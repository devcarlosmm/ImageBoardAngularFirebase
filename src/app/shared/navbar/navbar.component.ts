import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs';
import { navbarInfo } from '../../interfaces/register.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  usuario: any = '';

  // intento con subject
  subject$: navbarInfo = {
    uid: '',
    displayName: '',
  };
  isLoggedin: boolean = false;
  constructor(private auth: AuthService, private route: Router) {
    this.auth.userLogged();

    // Recuperamos el estado del loggin (true/false)
    this.auth.getState().subscribe((data) => {
      this.isLoggedin = data;
      console.log(this.isLoggedin);
    });

    // Recuperamos los datos que necesitamos para el navegador
    this.auth
      .getInformacion()
      .pipe(
        map(({ uid, displayName }) => {
          console.log('data recibida', uid, displayName);
          return { displayName, uid };
        }),
        catchError((err) => err)
      )
      .subscribe((data) => {
        this.subject$ = data as navbarInfo;
      });
  }

  ngOnInit(): void {}

  // LOG OUT
  logOut() {
    this.auth.logOut();
    this.route.navigateByUrl('auth/login');
  }
}
