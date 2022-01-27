import { Injectable } from '@angular/core';

//FIREBASE
import {
  collection,
  Firestore,
  getDocs,
  getFirestore,
} from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { Reply } from '../interfaces/reply.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  constructor(private fs: Firestore) {}

  async getReplies(): Promise<Reply[]> {
    //Inicializamos Firebase
    const firebaseApp = initializeApp(environment.firebase);

    //Inicializamos la base de datos
    const db = getFirestore(firebaseApp);

    //Seleccionamos la coleccion a la que queremos acceder
    const RepliesCollection = collection(db, 'reply');

    //Recogemos los documentos
    const RepliesSnapshot = await getDocs(RepliesCollection);

    //Pillamos los documentos y los metemos en una lista mapeando los datos
    const RepliesList = RepliesSnapshot.docs.map((doc) => doc.data());

    //Retornamos la lista como tipo Reply[]
    return RepliesList as Reply[];
  }
}
