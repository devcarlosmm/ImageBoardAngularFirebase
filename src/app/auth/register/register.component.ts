import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { Register } from '../../interfaces/register.interface';
import { Router } from '@angular/router';
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

  constructor(private auth: AuthService, private router: Router) {}

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
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        mensaje = {
          message: user.email!,
          status: 'success',
          codigo: 200,
        };
        alert(
          `<h1 class="${mensaje.status}">Usuario "${mensaje.message}" registrado con exito</h1>`
        );
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
    this.router.navigateByUrl('/');
  }
}
