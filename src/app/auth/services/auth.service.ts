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
  User,
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
import { authState } from 'rxfire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseApp = initializeApp(environment.firebase);
  db = getFirestore(this.firebaseApp);
  auth = getAuth();
  userLoged: Observable<User | null> | undefined;

  isLoggin$ = new BehaviorSubject<boolean>(false);

  informacionUsuario: BehaviorSubject<any> = new BehaviorSubject([
    'Datos de inicio',
  ]);
  constructor(private fs: Firestore) {
    this.userLoged = authState(this.auth);
    console.log('userLoged', this.userLoged);
  }

  async registerUser(pEmail: string, pPassword: string) {
    return await createUserWithEmailAndPassword(this.auth, pEmail, pPassword);
  }

  async loginUser(pEmail: string, pPassword: string) {
    return await signInWithEmailAndPassword(this.auth, pEmail, pPassword);
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

  async actualizarNombreUsuarioDB(pNombreUsuario: string, pUid: string) {
    const docRef = await addDoc(collection(this.db, 'nombreUsuario'), {
      nombreDeUsuario: pNombreUsuario,
      uid: pUid,
    });
    console.log(docRef);
  }

  // USER LOGGED
  userLogged() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.setState(true);
        this.setInformacion(user);
        console.log('Habemus papam', this.userLoged);
      } else {
        console.log('No papam', this.userLoged);
      }
    });
  }

  // Obtener el observador del usuario actual
  get currentUser(): Observable<User | null> | undefined {
    /* console.log('getter', this.userLoged); */
    return this.userLoged;
  }

  //SET STATE LOGIN
  setState(pStado: boolean) {
    this.isLoggin$.next(pStado);
  }
  // GET STATE LOGIN
  getState() {
    return this.isLoggin$.asObservable();
  }

  //LOG OUT
  logOut() {
    signOut(this.auth)
      .then(() => {
        this.setState(false);
        this.setInformacion(undefined);
        alert('cerraste sesion con exito');
      })
      .catch((error) => {
        alert('Error al cerrar sesion');
      });
  }

  // SET INFORMACION USUARIO
  setInformacion(informacion: any) {
    this.informacionUsuario.next(informacion);
  }
  // GET INFORMACION USUARIO
  getInformacion() {
    return this.informacionUsuario.asObservable();
  }
}
