import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { Modal } from "bootstrap";
import { Post } from 'src/app/interfaces/post.interface';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-form-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss'],
})
export class FormPostComponent implements OnChanges{
  @Input("visible") visible: boolean = false;
  @Output() newPostSubmitted = new EventEmitter<boolean>();
  @Output() closedModal = new EventEmitter<boolean>();
  postForm:FormGroup;
  imgData!:any;
  captcha:boolean = false;
  subscription:Subscription;
  textAreaDiv?:any;
  fullOnModal!:Modal;
  user:string = "";
  userObj:any = {};

  constructor(private fb:FormBuilder, private router:Router, private categoryService:CategoryService, private authService:AuthService) {
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
      content: ["", [Validators.required]], 
      img: ["", [Validators.required]], 
      title: ["", [Validators.required]], 
      uid: [""],
      id: [""]
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if(this.visible){
      let modal:HTMLElement = document.getElementById("exampleModal")!;
      this.fullOnModal = new Modal(modal, {backdrop:"static", keyboard:false});
      this.fullOnModal.toggle();
    }
  }

  submitPost(data:Post) {
    this.visible = false;
    this.captcha = false;

    this.authService
      .getInformacion()
      .pipe(
        map(({ uid, displayName }) => {
          console.log('data recibida', uid, displayName);
          return { displayName, uid };
        })
      )
      .subscribe((data) => {
        this.userObj = data;
      });

    const post:Post = {
      category: data.category,
      content:  this.textAreaDiv!.innerHTML,
      img: this.imgData.name,
      title: data.title,
      uid: (this.userObj) ? this.userObj.uid : "Anon",
      date: new Date()
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

  closeModal(){
    this.fullOnModal.hide();
    this.closedModal.emit(true);
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

  formatText(command:any, value:any=""){
    document.execCommand(command, false, value);
  }

  copyContent(event:Event){
    this.textAreaDiv = document.getElementById("content");
    if(this.textAreaDiv.innerText.length >= 250){
      this.postForm.controls["content"].markAsTouched();
      this.postForm.controls["content"].setErrors(null);
    }
  }
}
