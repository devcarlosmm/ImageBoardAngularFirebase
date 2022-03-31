import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confPassword: new FormControl('', [Validators.required]),
  });
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}
  submitPassword() {
    if (
      this.passwordForm.value.password == this.passwordForm.value.confPassword
    ) {
      this.auth.cambiarContraseña(this.passwordForm.value.password);
      Swal.fire({
        title: 'Exito! ',
        text: 'Contraseña cambiada con exito',
        icon: 'success',
        background: 'var(--fondo-medio)',
        color: 'var(--claro-claro)',
        confirmButtonColor: 'var(--medio-claro)',
      });
    } else {
      Swal.fire({
        title: 'Error ',
        text: 'Error, las contraseñas no coinciden',
        icon: 'warning',
        background: 'var(--fondo-medio)',
        color: 'var(--claro-claro)',
        confirmButtonColor: 'var(--medio-claro)',
      });
    }
  }
  borrarCuenta() {
    if (confirm('Estas seguro de querer borrar la cuenta?? ')) {
      this.auth.borrarUsuario();
      this.router.navigateByUrl('auth/register');
    }
  }
}
