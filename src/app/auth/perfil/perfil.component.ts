import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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
      alert('Contraseña cambiada con exito');
    } else {
      alert('Error: Contraseñas diferentes');
    }
  }
  borrarCuenta() {
    if (confirm('Estas seguro de querer borrar la cuenta?? ')) {
      this.auth.borrarUsuario();
      this.router.navigateByUrl('auth/register');
    }
  }
}
