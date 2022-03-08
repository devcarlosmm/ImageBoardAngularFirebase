import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { Register } from '../../interfaces/register.interface';
import { Router } from '@angular/router';

import { animales, adjetivos } from '../animales-adjetivos';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private fs: Firestore
  ) {}

  ngOnInit(): void {}

  register() {
    let mensaje: Register = {
      message: '',
      status: '',
      codigo: 0,
    };
    console.log(this.form.value.email, this.form.value.password);
    this.auth
      .registerUser(this.form.value.email, this.form.value.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userUid = user.uid;
        // ...
        mensaje = {
          message: user.email!,
          status: 'success',
          codigo: 200,
        };
        alert(
          `<h1 class="${mensaje.status}">Usuario "${mensaje.message}" registrado con exito</h1>`
        );
        await this.comprobarNombreGenerado().then(async (data) => {
          let nombreUsuario = data;
          console.log('nombre usuario', nombreUsuario, userUid);
          await this.auth.actualizarPerfil(nombreUsuario);
          await this.auth.actualizarNombreUsuarioDB(nombreUsuario, userUid);
        });

        this.navegar();
      })
      .catch((error: any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        mensaje = {
          message: errorMessage,
          status: errorCode,
          codigo: 400,
        };
        alert(
          `<h1 class="warning">Error ${mensaje.codigo}: ${mensaje.status}</h1>
            <h2 >${mensaje.message}</h2>`
        );
      });
  }

  navegar() {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  generarNombreRandom() {
    let animal: any = Math.floor(Math.random() * animales.length);
    animal = animales[animal];
    animal = animal.charAt(0).toUpperCase() + animal.slice(1);

    let adjetivo: any = Math.floor(Math.random() * adjetivos.length);
    adjetivo = adjetivos[adjetivo];
    adjetivo = adjetivo.charAt(0).toUpperCase() + adjetivo.slice(1);

    if (animal.endsWith('a') && adjetivo.endsWith('o')) {
      adjetivo = adjetivo.replace(/o$/, 'a');
    }

    let numero = Math.floor(Math.random() * (999 + 1));
    let nombreUsuario = animal + adjetivo + numero;
    console.log(nombreUsuario);
    return nombreUsuario;
  }

  async comprobarNombreGenerado(): Promise<string> {
    let usuarioExiste: boolean = false;
    let nombreUsuario: string = this.generarNombreRandom();
    do {
      if (usuarioExiste != false) {
        let nombreUsuario: string = this.generarNombreRandom();
      }
      console.log(nombreUsuario);
      await this.auth
        .getUsuarioNombre(nombreUsuario)
        .then((data) => {
          console.log('Data recibida', data);
          if (data == true) {
            usuarioExiste = true;
          } else {
            usuarioExiste = false;
          }
        })
        .catch((error) => console.log('Error recibido', error));
      usuarioExiste = false;
    } while (usuarioExiste != false);
    return nombreUsuario;
  }
}
