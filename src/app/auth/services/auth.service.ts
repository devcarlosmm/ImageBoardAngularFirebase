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
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  deleteDoc,
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
    console.log('userLoged', this.userLoged);
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

    await deleteDoc(querySnapshot.docs[0].ref);

    deleteUser(user!)
      .then(() => {
        // User deleted.
        console.log('Cuenta borrada');
        this.setState(false);
        this.setInformacion(undefined);

        alert('Cuenta borrada con exito. Bye bye!!');
      })
      .catch((error) => {
        // An error ocurred
        // ...
        console.log('Error: Cuenta no borrada', error);
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
        this.setState(false);
        this.setInformacion(undefined);
      }
    });
  }

  // Obtener el observador del usuario actual
  get currentUser(): Observable<User | null> | undefined {
    /* console.log('getter', this.userLoged); */
    return this.userLoged;
  }

  // CAMBIAR CONTRASEÑA
  cambiarContraseña(pContraseña: string) {
    const user = this.auth.currentUser;
    console.log('Pues probamos', user);
    updatePassword(user!, pContraseña)
      .then(() => {
        // Update successful.
        console.log('Contraseña cambiada correctamente');
      })
      .catch((error) => {
        // An error ocurred
        // ...
        console.log('Error al cambiar contraseña');
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
        this.setInformacion(undefined);
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
}
