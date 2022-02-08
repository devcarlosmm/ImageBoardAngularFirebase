import { Injectable } from '@angular/core';

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
import { Reply } from '../interfaces/reply.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  //Inicializamos Firebase
  firebaseApp = initializeApp(environment.firebase);
  //Inicializamos la base de datos
  db = getFirestore(this.firebaseApp);

  constructor(private fs: Firestore) {}

  async getReplies(): Promise<Reply[]> {
    //Seleccionamos la coleccion a la que queremos acceder
    const RepliesCollection = collection(this.db, 'reply');

    //Recogemos los documentos
    const RepliesSnapshot = await getDocs(RepliesCollection);

    //Pillamos los documentos y los metemos en una lista mapeando los datos
    const RepliesList = RepliesSnapshot.docs.map((doc) => doc.data());

    //Retornamos la lista como tipo Reply[]
    return RepliesList as Reply[];
  }

  async getRepliesPost(pIdPostReplies: string) {
    const postsCollection = collection(this.db, 'reply');
    const q = query(postsCollection, where('idPost', '==', pIdPostReplies));
    const querySnapshot = await getDocs(q);
    let replyList: Reply[] = [];
    querySnapshot.docs.forEach((doc) => {
      const reply: Reply = {
        idReply: doc.id,
        idPost: doc.data()['category'] as Reply['idPost'],
        content: doc.data()['content'] as Reply['content'],
        img: doc.data()['img'] as Reply['img'],
        entries: doc.data()['title'] as Reply['entries'],
      };
      replyList.push(reply);
    });

    return replyList as Reply[];
  }
}
