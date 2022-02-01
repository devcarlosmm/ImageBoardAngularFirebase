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
import { doc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  firebaseApp = initializeApp(environment.firebase);
  db = getFirestore(this.firebaseApp);
  constructor(private fs: Firestore) {}

  async getPosts(category: string): Promise<Post[]> {
    const postsCollection = collection(this.db, 'post');
    const q = query(postsCollection, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const postsList = querySnapshot.docs.map((doc) => doc.data());

    return postsList as Post[];
  }

  async getDetailPost(pIdPost: any) {
    const docRef = doc(this.db, 'post', pIdPost);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }
}
