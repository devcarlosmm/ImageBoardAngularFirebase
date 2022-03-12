import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { map } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Reply } from 'src/app/interfaces/reply.interface';
import { ReplyService } from 'src/app/services/reply.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-reply',
  templateUrl: './form-reply.component.html',
  styleUrls: ['./form-reply.component.scss']
})
export class FormReplyComponent implements OnInit{
  @Input('visible') visible: boolean = false;
  @Input("replyID") 
  get replyId(): string {return this.replyID}
  set replyId(id:string) {this.replyID = id}
  @Output() newReplySubmitted = new EventEmitter<boolean>();
  @Output() closedModal = new EventEmitter<boolean>();
  replyForm: FormGroup;
  imgData!: any;
  textAreaDiv?: any;
  fullOnModal!: Modal;
  userObj: any = {};
  isLoggedin: boolean = false;
  postId:string = "";
  replyID:string = "";

  constructor(
    private fb: FormBuilder,
    private route:ActivatedRoute,
    private replyService: ReplyService,
    private authService: AuthService
  ) 
  {
    this.postId = route.snapshot.params['id'];
    this.replyForm = this.fb.group({
      postID: [this.postId, [Validators.required]],
      idReply: [this.replyId],
      content: ['', [Validators.required]],
      img: [''],
      uid: [''],
      entries: [[]],
    });
  }

  ngOnInit(): void {
    let modal: HTMLElement = document.getElementById('exampleModal')!;
    this.fullOnModal = new Modal(modal, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.visible) {
      let modal: HTMLElement = document.getElementById('exampleModal')!;
      this.fullOnModal = new Modal(modal, {
        backdrop: 'static',
        keyboard: false,
      });
      this.fullOnModal.toggle();
    }
    this.replyID = this.replyId;
    console.log("REPLY ID CHANGES", this.replyID);
  }

  submitReply(data: Reply) {
    console.log("REPLY ID SUBMIT", this.replyID, this.replyId);
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
      img: (this.imgData) ? this.imgData.name:"",
      uid: this.userObj.uid,
      entries: [],
      idPost: this.postId,
      idReply: "906Fn456Wlr8bxJGIGBb",
      date: new Date(),
    };
    console.log("Reply obj",reply);
    this.replyService.submitReply(reply, this.imgData).then(() => {
      this.newReplySubmitted.emit(true);
    });
    this.replyForm.reset();
    this.closeModal();
  }

  processIMG(event: Event) {
    let imgFile = (event.target as HTMLInputElement)!.files![0];
    this.imgData = {
      file: imgFile,
      name: imgFile.name,
    };
  }

  closeModal() {
    this.fullOnModal.hide();
    this.closedModal.emit(true);
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
