import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Post } from '../interfaces/post.interface';

//FIREBASE
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  getFirestore,
  query,
  where,
} from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { doc, getDoc } from '@angular/fire/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  firebaseApp = initializeApp(environment.firebase);
  db = getFirestore(this.firebaseApp);
  storage = getStorage();

  //
  postUserList: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  //
  constructor(private fs: Firestore) {}

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
      throw new Error("Category doesn't have any posts");
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
    const storageRef = ref(this.storage, `img/${post.category}/${post.img}`);
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
      throw new Error("Category doesn't have any posts");
    }

    postList.sort((a, b) => {
      return b.date.valueOf() - a.date.valueOf();
    });

    this.setUserPost(postList);
  }

  // SET USER POSTS
  setUserPost(informacion: any) {
    this.postUserList.next(informacion);
  }
  // GET USER POSTS
  getUserPost() {
    return this.postUserList.asObservable();
  }
}
