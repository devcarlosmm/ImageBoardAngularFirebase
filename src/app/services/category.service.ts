import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Post } from '../interfaces/post.interface';

//FIREBASE
import {
  addDoc,
  collection,
  deleteDoc,
  Firestore,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { doc, getDoc } from '@angular/fire/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { Reply } from '../interfaces/reply.interface';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  firebaseApp = initializeApp(environment.firebase);
  db = getFirestore(this.firebaseApp);
  storage = getStorage();

  //
  postUserList: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  replyUserList: BehaviorSubject<Reply[]> = new BehaviorSubject<Reply[]>([]);
  //
  constructor(private fs: Firestore) {}

  randomIntegerID(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    const postsCollection = collection(this.db, 'post');
    const q = query(postsCollection, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    let postList: Post[] = [];

    querySnapshot.docs.forEach((doc) => {
      const post: Post = {
        id: doc.id,
        category: doc.data()['category'] as Post['category'],
        content: doc.data()['content'] as Post['content'],
        img: doc.data()['img'] as Post['img'],
        title: doc.data()['title'] as Post['title'],
        date: doc.data()['date'].toDate() as Post['date'],
      };
      postList.push(post);
    });

    if (postList.length === 0) {
      return postList;
    }

    postList.sort((a, b) => {
      return b.date.valueOf() - a.date.valueOf();
    });

    return postList;
  }

  async getDetailPost(pIdPost: string): Promise<Post> {
    const docRef = doc(this.db, 'post', pIdPost);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('No existeerrr');
    }

    const userCollection = collection(this.db, 'nombreUsuario');
    const q = query(userCollection, where('uid', '==', docSnap.data()['uid']));
    const querySnapshot = await getDocs(q);
    let username: string = '';

    if (!querySnapshot.empty) {
      username = querySnapshot.docs[0].data()['nombreDeUsuario'];
    }

    const post: Post = {
      id: docSnap.id,
      uid: username,
      category: docSnap.data()['category'] as Post['category'],
      content: docSnap.data()['content'] as Post['content'],
      img: docSnap.data()['img'] as Post['img'],
      title: docSnap.data()['title'] as Post['title'],
      date: docSnap.data()['date'] as Post['date'],
    };

    return post;
  }

  async submitPost(post: Post, img: any) {
    const metadata = {
      contentType: 'image/png',
    };
    const storageRef = ref(
      this.storage,
      `img/${post.category}/${
        new Date().valueOf() + this.randomIntegerID(1, 100)
      }/${post.img}`
    );
    await uploadBytes(storageRef, img.file, metadata).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((value) => {
        post.img = value.split('&token')[0];
        const docRef = addDoc(collection(this.db, 'post'), {
          uid: post.uid,
          category: post.category,
          content: post.content,
          title: post.title,
          img: post.img,
          date: post.date,
        });
      });
    });
  }

  // Recuperar POSTS PERFIL USUARIO
  async recuperarPostUser(pUid: string) {
    console.log('Mandao', pUid);
    const postsCollection = collection(this.db, 'post');
    const q = query(postsCollection, where('uid', '==', pUid));
    const querySnapshot = await getDocs(q);
    let postList: Post[] = [];

    querySnapshot.docs.forEach((doc) => {
      console.log('Esto es docs', doc);
      const post: Post = {
        id: doc.id,
        category: doc.data()['category'] as Post['category'],
        content: doc.data()['content'] as Post['content'],
        img: doc.data()['img'] as Post['img'],
        title: doc.data()['title'] as Post['title'],
        date: doc.data()['date'].toDate() as Post['date'],
      };
      console.log(post, doc);
      postList.push(post);
    });

    if (postList.length === 0) {
      //throw new Error("Category doesn't have any posts");
    }

    postList.sort((a, b) => {
      return b.date.valueOf() - a.date.valueOf();
    });

    this.setUserPost(postList);
  }

  // Recuperar REPLIES PERFIL USUARIO
  async recuperarReplyUser(pUid: string) {
    console.log('Mandao', pUid);
    const postsCollection = collection(this.db, 'reply');
    const q = query(postsCollection, where('uid', '==', pUid));
    const querySnapshot = await getDocs(q);
    let replyList: Reply[] = [];

    querySnapshot.docs.forEach((doc) => {
      console.log('Esto es docs', doc);
      const reply: Reply = {
        idReply: doc.id,
        content: doc.data()['content'] as Reply['content'],
        img: doc.data()['img'] as Reply['img'],
        date: doc.data()['date'].toDate() as Reply['date'],
        uid: doc.data()['uid'] as Reply['uid'],
        idPost: doc.data()['idPost'] as Reply['idPost'],
        entries: doc.data()['entries'] as Reply['entries'],
      };
      console.log(reply, doc);
      replyList.push(reply);
    });

    if (replyList.length === 0) {
      //throw new Error("Category doesn't have any posts");
    }

    replyList.sort((a, b) => {
      return b.date.valueOf() - a.date.valueOf();
    });

    this.setUserReply(replyList);
  }

  // UPDATEAR POST DE USER
  async updatePost(data: any) {
    console.log('tenemos data', data);

    const postRef = doc(this.db, 'post', data.id);

    await updateDoc(postRef, {
      title: data.title,
      content: data.content,
    });
  }

  // UPDATEAR REPLY DE USER
  async updateReply(data: any) {
    console.log('tenemos data', data);

    const postRef = doc(this.db, 'reply', data.id);

    await updateDoc(postRef, {
      content: data.content,
    });
  }

  // SET USER POSTS
  setUserPost(informacion: any) {
    this.postUserList.next(informacion);
  }
  // GET USER POSTS
  getUserPost() {
    return this.postUserList.asObservable();
  }

  // SET USER REPLY
  setUserReply(informacion: any) {
    this.replyUserList.next(informacion);
  }
  // GET USER REPLY
  getUserReply() {
    return this.replyUserList.asObservable();
  }

  async borrarPost(pUid: string) {
    const post = doc(this.db, 'post', pUid);
    const postSnap = await getDoc(post);
    const postImage = postSnap.get('img');
    const postImageRef = ref(this.storage, postImage);

    await deleteObject(postImageRef)
      .then(() => {
        console.log('Deleted post image');
      })
      .catch((err) => {
        console.log('Error in deleting image post', err);
      });
    await deleteDoc(post);

    const replyRef = collection(this.db, 'reply');
    const q = query(replyRef, where('idPost', '==', pUid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      if (doc.get('img')) {
        let replyImageRef = ref(this.storage, doc.get('img'));
        deleteObject(replyImageRef)
          .then(() => {
            console.log('Deleted image!');
          })
          .catch((err) => {
            console.log('Image error', err);
          });
      }
      await deleteDoc(doc.ref);
    });
  }

  async borrarReply(rUid: string) {
    const reply = doc(this.db, 'reply', rUid);
    const replySnap = await getDoc(reply);
    const replyImage = replySnap.get('img');
    console.log(replyImage);
    if (replyImage != '') {
      console.log('tenemos imagen');
      const replyImageRef = ref(this.storage, replyImage);
      console.log(rUid, replyImageRef);
      await deleteObject(replyImageRef)
        .then(() => {
          console.log('Deleted post image');
        })
        .catch((err) => {
          console.log('Error in deleting image post', err);
        });
    } else {
      console.log('no tenemos imagen');
    }

    await deleteDoc(reply);
  }
}
