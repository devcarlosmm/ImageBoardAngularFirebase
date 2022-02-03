import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss'],
})
export class FormPostComponent implements OnInit {
  display: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  showDialog() {
    this.display = true;
  }
}
