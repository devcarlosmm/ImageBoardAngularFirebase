import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs';
import { navbarInfo } from '../../interfaces/register.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  usuario: any = '';
  items: MenuItem[] = [];
  abierto: boolean = false;

  // intento con subject
  subject$: navbarInfo = {
    uid: '',
    displayName: '',
  };
  constructor(private auth: AuthService, private route: Router) {
    this.auth.userLogged();
    this.auth
      .getInformacion()
      .pipe(
        map(({ uid, displayName }) => {
          console.log('data recibida', uid, displayName);
          return { displayName, uid };
        })
      )
      .subscribe((data) => {
        this.subject$ = data;
      });

    /* this.verPerfil(); */
    console.log('contructor', this.usuario, this.subject$);
    this.route.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          this.reloadMenuItems('Constructor');
        }
      },
    });
  }

  ngOnInit(): void {
    console.log('on init', this.usuario);
    this.reloadMenuItems('On init');
  }

  // LOG OUT
  logOut() {
    this.auth.logOut();
    this.route.navigateByUrl('auth/login');
  }

  // RELOAD MENU ITEMS
  reloadMenuItems(asd: string) {
    console.log('reload ', asd, this.subject$?.displayName);
    this.items = [
      {
        label: 'Japanese Culture',
        items: [
          {
            label: 'Manga',
            routerLink: 'categories/j-m',
          },
        ],
      },
      {
        label: 'Tecnology',

        items: [
          {
            label: 'Gadgets',
            routerLink: 'categories/t-g',
          },
        ],
      },
      {
        label: 'Video Games',

        items: [
          {
            label: "Nintendon't",
            routerLink: 'categories/v-n',
          },
        ],
      },
      {
        label: this.subject$?.displayName,
        visible: asd != '',
        items: [
          {
            label: 'Perfil',
          },
          {
            label: 'Logout',
            command: () => this.logOut(),
          },
        ],
      },
    ];
  }
  // VER USUARIO
  /*  async verPerfil() {
    this.auth.currentUser?.subscribe((data) => {
      console.log('ptm', data);
      this.asignarUsuario(data);
    });
  } */

  asignarUsuario(data: any) {
    this.usuario = data;
    console.log('perfil recuperado', this.usuario);
  }
}
