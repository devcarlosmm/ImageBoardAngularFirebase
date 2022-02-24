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
export class FormPostComponent{
  @Input() visible: boolean = false;
  @Output() newPostSubmitted = new EventEmitter<boolean>();
  postForm:FormGroup;
  imgData!:any;
  captcha:boolean = false;
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
    this.captcha = false;
    const post:Post = {
      category: data.category,
      content:  data.content,
      img: this.imgData.name,
      title: data.title,
      uid: (data.uid) ? data.uid : "Anon"
    }
    this.categoryService.submitPost(post, this.imgData).then(() =>{
      this.newPostSubmitted.emit(true);
    });
    this.postForm.reset();
  }

  processIMG(event:Event){
    let imgFile = (event.target as HTMLInputElement)!.files![0];
    this.imgData = {
      file: imgFile,
      name: imgFile.name
    }
  }

  correctCaptcha(event:any){
    this.captcha = true;
  }

  resetForm(){
    this.postForm.reset();
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
