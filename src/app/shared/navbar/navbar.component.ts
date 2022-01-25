import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];
  constructor() {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Japanese Culture',
        items: [
          { 
            label: 'Manga',
            routerLink: "categories/j-m"
          }
        ],
      },
      {
        label: 'Tecnology',

        items: [
          { 
            label: 'Gadgets',
            routerLink: "categories/t-g" 
          }
        ],
      },
      {
        label: 'Video Games',

        items: [
          { 
            label: "Nintendon't",
            routerLink: "categories/v-n"  
          }
        ],
      },
    ];
  }
}
