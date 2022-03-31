import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ArchivoComponent } from './archivo/archivo.component';
import { UserRoutesGuard } from './guards/user-routes.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'perfil',
        canActivate: [UserRoutesGuard],
        canLoad: [UserRoutesGuard],
        component: PerfilComponent,
      },
      {
        path: 'archivo',
        canActivate: [UserRoutesGuard],
        canLoad: [UserRoutesGuard],
        component: ArchivoComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
