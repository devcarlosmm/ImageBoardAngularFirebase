import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
//Firebase
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseApp = initializeApp(environment.firebase);
  auth = getAuth();

  constructor() {}

  async registerUser(pEmail: string, pPassword: string) {
    return await createUserWithEmailAndPassword(this.auth, pEmail, pPassword);
  }

  async loginUser(pEmail: string, pPassword: string) {
    return await signInWithEmailAndPassword(this.auth, pEmail, pPassword);
  }

  userLogged() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        return uid;
      } else {
        // User is signed out
        // ...
        const error = 'No estas logueado';
        return error;
      }
    });
  }
}
