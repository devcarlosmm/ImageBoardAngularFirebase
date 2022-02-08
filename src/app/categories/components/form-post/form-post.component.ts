import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss'],
})
export class FormPostComponent implements OnInit {
  @Input() visible: boolean = false;
  postForm:FormGroup;

  constructor(private fb:FormBuilder) {
    this.postForm = this.fb.group({
      category: [], 
      content: [], 
      img: [], 
      title: [], 
    })
  }

  ngOnInit(): void {}

}
