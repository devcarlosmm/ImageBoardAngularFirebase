import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss'],
})
export class FormPostComponent implements OnInit {
  @Input() visible: boolean = false;

  constructor() {}

  ngOnInit(): void {}

}
