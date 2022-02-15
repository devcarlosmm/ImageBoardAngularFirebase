import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { from } from 'rxjs';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  register() {
    console.log(this.form.value.email, this.form.value.password);

    const observableFrom$ = from(
      this.auth.registerUser(this.form.value.email, this.form.value.password)
    );
    observableFrom$.subscribe({
      next(data) {
        console.log('got value ' + data);
      },
      error(err) {
        console.error('something wrong occurred: ' + err);
      },
      complete() {
        console.log('done');
      },
    });
  }
}
