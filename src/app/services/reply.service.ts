import { Injectable } from '@angular/core';

//FIREBASE
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  query,
  where,
} from '@angular/fire/firestore';
import { initializeApp } from '@angular/fire/app';
import { Reply } from '../interfaces/reply.interface';
import { environment } from 'src/environments/environment';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { arrayUnion, DocumentData, DocumentReference, updateDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ReplyService {
  //Inicializamos Firebase
  firebaseApp = initializeApp(environment.firebase);
  //Inicializamos la base de datos
  db = getFirestore(this.firebaseApp);
  storage = getStorage();

  constructor(private fs: Firestore) {}

  randomIntegerID(min:number, max:number){
    return Math.floor(Math.random() * (max-min) + min);
  }

  async getReplies(): Promise<Reply[]> {
    //Seleccionamos la coleccion a la que queremos acceder
    const RepliesCollection = collection(this.db, 'reply');

    //Recogemos los documentos
    const RepliesSnapshot = await getDocs(RepliesCollection);

    //Pillamos los documentos y los metemos en una lista mapeando los datos
    const RepliesList = RepliesSnapshot.docs.map((doc) => doc.data());

    RepliesList.sort((a,b) => {
      return b['date'].toDate().valueOf() - a['date'].toDate().valueOf();
    })

    //Retornamos la lista como tipo Reply[]
    return RepliesList as Reply[];
  }

  async getRepliesPost(pIdPostReplies: string) {
    const postsCollection = collection(this.db, 'reply');
    const q = query(postsCollection, where('idPost', '==', pIdPostReplies));
    const querySnapshot = await getDocs(q);
    let replyList: Reply[] = [];
    
    const userCollection = collection(this.db, 'nombreUsuario');
    let username:string = "";

    querySnapshot.docs.forEach(async (doc) => {
      const q1 = query(userCollection, where('uid', '==', doc.data()['uid']));
      const userSnapshot = await getDocs(q1); 
      if(!userSnapshot.empty){
        username = userSnapshot.docs[0].data()['nombreDeUsuario'];
      }
      const reply: Reply = {
        idReply: doc.id,
        uid: username,
        idPost: doc.data()['category'] as Reply['idPost'],
        content: doc.data()['content'] as Reply['content'],
        img: doc.data()['img'] as Reply['img'],
        entries: doc.data()['entries'] as Reply['entries'],
        date: doc.data()['date'] as Reply['date'],
      };
      replyList.push(reply);
      username = "";
    });

    return replyList as Reply[];
  }

  async submitReply(reply:Reply, img?:any) {
    let docRef: DocumentReference<DocumentData> | Promise<DocumentReference<DocumentData>>;
    if(img){
      const metadata = {
        contentType: "image/png"
      }
      const storageRef = ref(this.storage, `img/${reply.idPost}/${new Date().valueOf() + this.randomIntegerID(1,100)}/${reply.img}`);
      await uploadBytes(storageRef, img.file, metadata).then(async (snapshot) =>  {
        await getDownloadURL(snapshot.ref).then((value) =>{
          reply.img = value.split("&token")[0];
          docRef = addDoc(collection(this.db, "reply"), {
            uid: reply.uid,
            idPost: reply.idPost,
            content: reply.content,
            img: reply.img,
            entries: reply.entries,
            date: reply.date
          });
        });
      });
    }else{
      docRef = await addDoc(collection(this.db, "reply"), {
        uid: reply.uid,
            idPost: reply.idPost,
            content: reply.content,
            img: "",
            entries: reply.entries,
            date: reply.date
      })
    }

    if(reply.idReply){
      const replyCollection = collection(this.db, 'reply');
      const querySnapshot = await getDocs(replyCollection); 

      if(!querySnapshot.empty){
        querySnapshot.forEach((doc) => {
          if(doc.id == reply.idReply){
            updateDoc(doc.ref, {
              entries: arrayUnion((docRef as DocumentReference<DocumentData>).id)
            })
          }
        })
      }
    }
  }
}
