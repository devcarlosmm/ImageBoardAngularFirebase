import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

//FIREBASE
import { collection, Firestore, getDocs, getFirestore, query, where } from '@angular/fire/firestore';
import { initializeApp } from "@angular/fire/app";
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private fs:Firestore) {}

  async getPosts(category:string):Promise<Post[]>{
    const firebaseApp = initializeApp(environment.firebase);
    const db = getFirestore(firebaseApp);

    const postsCollection = collection(db, "post");
    const q = query(postsCollection, where("category", "==", category))
    const querySnapshot = await getDocs(q);
    const postsList = querySnapshot.docs.map(doc => doc.data());

    return postsList as Post[];
  }
}
