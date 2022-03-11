import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.scss'],
})
export class ArchivoComponent implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {}
}
