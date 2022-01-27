import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

//FIREBASE
import { collection, Firestore, getDocs, getFirestore } from '@angular/fire/firestore';
import { initializeApp } from "@angular/fire/app";
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private fs:Firestore) {
    
  }

  async getPosts():Promise<Post[]>{
    const firebaseApp = initializeApp(environment.firebase);
    const db = getFirestore(firebaseApp);

    const postsCollection = collection(db, "post");
    const postsSnapshot = await getDocs(postsCollection);
    const postsList = postsSnapshot.docs.map(doc => doc.data());

    return postsList as Post[];
  }
}
