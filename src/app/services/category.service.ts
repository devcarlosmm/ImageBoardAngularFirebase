import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

//FIREBASE
import {
  collection,
  Firestore,
  getDocs,
  getFirestore,
  query,
  where,
} from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { Post } from '../interfaces/post.interface';
import { doc, getDoc } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  firebaseApp = initializeApp(environment.firebase);
  db = getFirestore(this.firebaseApp);

  constructor(private fs: Firestore) {}

  async getPostsByCategory(category: string): Promise<any> {
    const postsCollection = collection(this.db, 'post');
    const q = query(postsCollection, where('category', '==', category));
    const querySnapshot = await getDocs(q); 
    let postList:Post[] = [];

    querySnapshot.docs.forEach(doc => {
      const post:Post = {
        id: doc.id,
        category: doc.data()["category"] as Post["category"],
        content: doc.data()["content"] as Post["content"],
        img: doc.data()["img"] as Post["img"],
        title: doc.data()["title"] as Post["title"]
      };
      postList.push(post);
    });

    if(postList.length === 0){
      throw new Error("Category doesn't have any posts");
    }

    return postList;
  }

  async getDetailPost(pIdPost: string): Promise<Post> {
    const docRef = doc(this.db, 'post', pIdPost);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('No existeerrr');
    }
    console.log('Document data:', docSnap.data());
    return docSnap.data() as Post;
  }
}
