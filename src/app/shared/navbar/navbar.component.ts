import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  usuario: string = '';
  items: MenuItem[] = [];
  abierto: boolean = false;
  constructor(private auth: AuthService, private route: Router) {
    this.verPerfil();
    console.log('consusa', this.usuario);
    this.route.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          this.reloadMenuItems('');
        }
      },
    });
  }

  ngOnInit(): void {
    console.log('on inisa', this.usuario);
    this.reloadMenuItems('');
  }

  logOut() {
    this.auth.logOut();
  }

  reloadMenuItems(usuario: string) {
    console.log('relousa', usuario);
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
        label: 'this.usuario',
        visible: usuario != '',
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

  //togle el contenido
  cambiar() {
    if (this.abierto == true) {
      this.abierto = false;
    } else {
      this.abierto = true;
    }
  }

  async verPerfil() {
    await this.auth
      .userLogged()
      .then((data) => {
        this.usuario = data;
        console.log(this.usuario, data);
        this.reloadMenuItems(data);
      })
      .catch((error) => console.log(error));
    console.log('perfisa', this.usuario);
  }
}
