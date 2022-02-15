import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from 'src/app/interfaces/register.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  logueado: boolean = true;

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
  login() {
    let mensaje: Register = {
      message: '',
      status: '',
      codigo: 0,
    };
    this.auth
      .loginUser(this.form.value.email, this.form.value.password)
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
          `<h1 class="${mensaje.status}">Usuario "${mensaje.message}" logueado con exito</h1>`
        );
        this.navegar();
      })
      .catch((error: any) => {
        this.logueado = false;
        setTimeout(() => (this.logueado = true), 5000);
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
