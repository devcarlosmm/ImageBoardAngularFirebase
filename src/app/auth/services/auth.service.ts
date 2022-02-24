import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
//Firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseApp = initializeApp(environment.firebase);
  db = getFirestore(this.firebaseApp);
  auth = getAuth();

  constructor(private fs: Firestore) {}

  async registerUser(pEmail: string, pPassword: string) {
    return await createUserWithEmailAndPassword(this.auth, pEmail, pPassword);
  }

  async loginUser(pEmail: string, pPassword: string) {
    return await signInWithEmailAndPassword(this.auth, pEmail, pPassword);
  }

  async userLogged() {
    let userR: string = '';
    await onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('user', user);
        const uid = user.uid;
        userR = user.uid;
      } else {
        userR = 'No estas logueado';
      }
    });
    return userR;
  }

  // Comprobar si el usuario existe ya
  async getUsuarioNombre(pInombreUsuario: string): Promise<Boolean> {
    let userExists: boolean = false;
    const UserNameRef = collection(this.db, 'nombreUsuario');
    const q = query(
      UserNameRef,
      where('nombreDeUsuario', '==', pInombreUsuario)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (doc) userExists = true;
    });
    return userExists;
  }

  // Actualizar perfil de usuario
  actualizarPerfil(pNombreUsuario: string) {
    console.log('Actualizar', pNombreUsuario);
    updateProfile(this.auth.currentUser!, { displayName: pNombreUsuario });
  }

  verPerfil() {
    const user = this.auth.currentUser;
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;

      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;
      console.log(displayName);
    }
  }

  async actualizarNombreUsuarioDB(pNombreUsuario: string) {
    const docRef = await addDoc(collection(this.db, 'nombreUsuario'), {
      nombreDeUsuario: pNombreUsuario,
    });
    console.log(docRef);
  }

  //LOG OUT
  logOut() {
    signOut(this.auth)
      .then(() => {
        alert('cerraste sesion con exito');
      })
      .catch((error) => {
        alert('Error al cerrar sesion');
      });
  }
}
