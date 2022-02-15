import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/interfaces/post.interface';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-form-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss'],
})
export class FormPostComponent {
  @Input() visible: boolean = false;
  @Output() newPostSubmitted = new EventEmitter<boolean>();
  postForm:FormGroup;
  subscription:Subscription;

  constructor(private fb:FormBuilder, private router:Router, private categoryService:CategoryService) {
    this.subscription = this.router.events.subscribe({
      next: (event) => {
        this.postForm.reset();
        if(event instanceof NavigationEnd){
          this.postForm.get("category")?.setValue(this.router.url.split("/")[2]);
        }
      }
    });

    this.postForm = this.fb.group({
      category: ["", [Validators.required]], 
      content: ["", [Validators.required, Validators.minLength(250)]], 
      img: ["", [Validators.required]], 
      title: ["", [Validators.required]], 
      uid: [""],
      id: [""]
    })
  }

  submitPost(data:Post) {
    this.visible = false;
    this.postForm.reset();
    const post:Post = {
      category: data.category,
      content:  data.content,
      img: data.img,
      title: data.title,
      uid: (data.uid) ? data.uid : "Anon"
    }
    this.categoryService.submitPost(post).then(() =>{
      this.newPostSubmitted.emit(true);
    });
  }

  clearImg() {
    this.postForm.get("img")?.reset();
  }

  clearTitle() {
    this.postForm.get("title")?.reset();
  }

  clearContent(){
    this.postForm.get("content")?.reset();
  }

}
