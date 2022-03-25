import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Reply } from 'src/app/interfaces/reply.interface';
import { ReplyService } from 'src/app/services/reply.service';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-form-reply',
  templateUrl: './form-reply.component.html',
  styleUrls: ['./form-reply.component.scss'],
})
export class FormReplyComponent implements OnInit {
  @Input('visible') visible: boolean = false;
  replyForm: FormGroup;
  imgData!: any;
  textAreaDiv?: any;
  userObj: any = {};
  isLoggedin: boolean = false;
  postId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private replyService: ReplyService,
    private authService: AuthService,
    public dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {id: string}
  ) {
    this.replyForm = this.fb.group({
      postID: ["", [Validators.required]],
      idReply: [],
      content: ['', [Validators.required]],
      img: [''],
      uid: [''],
      entries: [[]],
    });
    if(data !== null){
      console.log("This is the data id on constructor", data.id);
    }
  }
  ngOnInit(): void {
    this.replyForm.get("postID")?.setValue(this.router.url.split("/")[3]);
    this.postId = this.router.url.split("/")[3];
  }

  async submitReply(data: Reply) {
    this.visible = false;
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

    //

    const reply: Reply = {
      content: this.textAreaDiv!.innerHTML,
      img: this.imgData ? this.imgData.name : '',
      uid: this.userObj.uid,
      entries: [],
      idPost: this.postId,
      idReply: (this.data !== null) ? this.data.id: "",
      date: new Date(),
    };
    console.log('Reply obj', reply);
    await this.replyService.submitReply(reply, this.imgData)
    .then(() => {
      this.dialog.closeAll();
    });
    this.replyForm.reset();
  }

  processIMG(event: Event) {
    let imgFile = (event.target as HTMLInputElement)!.files![0];
    this.imgData = {
      file: imgFile,
      name: imgFile.name,
    };
  }

  resetForm() {
    this.replyForm.reset();
  }

  clearImg() {
    this.replyForm.get('img')?.reset();
  }

  clearTitle() {
    this.replyForm.get('title')?.reset();
  }

  clearContent() {
    this.replyForm.get('content')?.reset();
  }

  formatText(command: any, value: any = '') {
    document.execCommand(command, false, value);
  }

  copyContent(event: Event) {
    this.textAreaDiv = document.getElementById('content');
    //TODO Cambiar la long a 250 cuando funcione
    if (this.textAreaDiv.innerText.length >= 1) {
      this.replyForm.controls['content'].markAsTouched();
      this.replyForm.controls['content'].setErrors(null);
    }
  }
}
