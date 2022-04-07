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
  deleteUser,
  updatePassword,
  sendEmailVerification,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  Firestore,
  getDocs,
  getFirestore,
  query,
  where,
} from '@angular/fire/firestore';
import { authState } from 'rxfire/auth';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

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
  }

  // CREAR USUARIO
  async registerUser(pEmail: string, pPassword: string) {
    return await createUserWithEmailAndPassword(this.auth, pEmail, pPassword);
  }

  // BORRAR USUARIO
  async borrarUsuario() {
    const user = this.auth.currentUser;
    const userCollection = collection(this.db, 'nombreUsuario');
    const q = query(userCollection, where('uid', '==', user!.uid));
    const querySnapshot = await getDocs(q);

    deleteUser(user!)
      .then(async () => {
        // User deleted.
        await deleteDoc(querySnapshot.docs[0].ref);
        this.setState(false);
        this.setInformacion(EMPTY);
        Swal.fire({
          title: 'Exito! ',
          text: 'Cuenta borrada con exito. Bye bye!!',
          icon: 'success',
          background: 'var(--fondo-medio)',
          color: 'var(--claro-claro)',
          confirmButtonColor: 'var(--medio-claro)',
        });
      })
      .catch((error) => {
        let errorMensaje = '';
        if (
          error ==
          'FirebaseError: Firebase: Error (auth/requires-recent-login).'
        ) {
          errorMensaje =
            'Por favor, desconectate y vuelve a loguearte para poder realizar esta acción';
        }
        Swal.fire({
          title: 'Error ',
          text: 'Error al borrar la cuenta. ' + errorMensaje,
          icon: 'warning',
          background: 'var(--fondo-medio)',
          color: 'var(--claro-claro)',
          confirmButtonColor: 'var(--medio-claro)',
        });
      });
  }

  // LOGUEAR USUARIO
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
    }
  }

  async actualizarNombreUsuarioDB(pNombreUsuario: string, pUid: string) {
    const docRef = await addDoc(collection(this.db, 'nombreUsuario'), {
      nombreDeUsuario: pNombreUsuario,
      uid: pUid,
    });
  }

  // USER LOGGED
  userLogged() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.setState(true);
        this.setInformacion(user);
      } else {
        this.setState(false);
        this.setInformacion(EMPTY);
      }
    });
  }

  setUserLS(user: User) {
    localStorage.setItem('user', JSON.stringify(user.refreshToken));
  }

  isUserLoggedLS(): boolean {
    if (localStorage.getItem('user')) {
      return true;
    } else {
      return false;
    }
  }

  // Obtener el observador del usuario actual
  get currentUser(): Observable<User | null> | undefined {
    return this.userLoged;
  }

  // CAMBIAR CONTRASEÑA
  cambiarContraseña(pContraseña: string) {
    const user = this.auth.currentUser;
    updatePassword(user!, pContraseña)
      .then(() => {
        // Update successful.
      })
      .catch((error) => {
        // An error ocurred
        // ...
        error;
      });
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
        this.setInformacion(EMPTY);
        localStorage.removeItem('user');
        Swal.fire({
          title: 'Desconectado',
          text: 'Cerraste sesion con exito.',
          icon: 'success',
          background: 'var(--fondo-medio)',
          color: 'var(--claro-claro)',
          confirmButtonColor: 'var(--medio-claro)',
        });
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'Error al cerrar sesion.',
          icon: 'warning',
          background: 'var(--fondo-medio)',
          color: 'var(--claro-claro)',
          confirmButtonColor: 'var(--medio-claro)',
        });
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

  async checkLoggedIn() {
    let isLogged: boolean = false;

    await this.auth.onAuthStateChanged((user) => {
      if (user) {
        isLogged = true;
      } else {
        isLogged = false;
      }
    });

    return isLogged;
  }

  // ENVIAR CORREO DE CONFIRMACION
  sendConfirmationEmail() {
    console.log(this.auth.currentUser!);
    /*     sendEmailVerification(this.auth.currentUser!)
      .then(() => {
        // Email verification sent!
        // ...
      }); */
  }
}
