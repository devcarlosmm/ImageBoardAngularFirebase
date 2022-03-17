import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Post } from 'src/app/interfaces/post.interface';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'dialog-post',
  templateUrl: './form-post.component.html',
  styleUrls: ['./form-post.component.scss'],
})
export class FormPostComponent{
  @Input('visible') visible: boolean = false;
  @Output() newPostSubmitted = new EventEmitter<boolean>();
  @Output() closedModal = new EventEmitter<boolean>();
  postForm: FormGroup;
  imgData!: any;
  captcha: boolean = false;
  textAreaDiv?: HTMLElement;
  user: string = '';
  userObj: any = {};
  isLoggedin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private authService: AuthService,
  ) {

    this.postForm = this.fb.group({
      category: ['', [Validators.required]],
      content: ['', [Validators.required]],
      img: ['', [Validators.required]],
      title: ['', [Validators.required]],
      uid: [''],
      id: [''],
    });

    this.postForm.get("category")?.setValue(this.router.url.split("/")[2]);
  }

  submitPost(data: Post) {
    this.visible = false;
    this.captcha = false;
    // Recuperamos el estado del loggin (true/false)
    this.authService.getState().subscribe((data) => {
      this.isLoggedin = data;
      console.log(this.isLoggedin);
    });
    if (this.isLoggedin) {
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
    } else {
      this.userObj.uid = 'Anon';
    }

    const post: Post = {
      category: data.category,
      content: this.textAreaDiv!.innerHTML,
      img: this.imgData.name,
      title: data.title,
      uid: this.userObj.uid,
      date: new Date(),
    };
    this.categoryService.submitPost(post, this.imgData).then(() => {
      this.newPostSubmitted.emit(true);
    });
    this.resetForm();
  }

  processIMG(event: Event) {
    let imgFile = (event.target as HTMLInputElement)!.files![0];
    this.imgData = {
      file: imgFile,
      name: imgFile.name,
    };
  }

  correctCaptcha(event: any) {
    this.captcha = true;
  }

  resetForm() {
    this.postForm.reset();
    this.textAreaDiv!.innerHTML = "";
  }

  clearImg() {
    this.postForm.get('img')?.reset();
  }

  clearTitle() {
    this.postForm.get('title')?.reset();
  }

  clearContent() {
    this.postForm.get('content')?.reset();
  }

  formatText(command: any, value: any = '') {
    document.execCommand(command, false, value);
  }

  copyContent(event: Event) {
    this.textAreaDiv = document.getElementById('content')!;
    //TODO Cambiar la long a 250 cuando funcione
    if (this.textAreaDiv!.innerText.length >= 1) {
      this.postForm.controls['content'].markAsTouched();
      this.postForm.controls['content'].setErrors(null);
    }
  }
}
