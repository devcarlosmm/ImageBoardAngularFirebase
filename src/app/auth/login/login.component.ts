import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from 'src/app/interfaces/register.interface';
import Swal from 'sweetalert2';
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
  async login() {
    let mensaje: Register = {
      message: '',
      status: '',
      codigo: 0,
    };
    await this.auth
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
        Swal.fire({
          title: 'Exito ',
          text: 'Usuario ' + mensaje.message + ' logueado con exito',
          icon: 'success',
          background: 'var(--fondo-medio)',
          color: 'var(--claro-claro)',
          confirmButtonColor: 'var(--medio-claro)',
        });
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
        Swal.fire({
          title: 'Error ' + mensaje.codigo,
          text: 'Error de email o contraseña',
          icon: 'warning',
          background: 'var(--fondo-medio)',
          color: 'var(--claro-claro)',
          confirmButtonColor: 'var(--medio-claro)',
        });
      });
  }

  navegar() {
    this.router.navigateByUrl('/');
  }
}
