import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reply } from 'src/app/interfaces/reply.interface';
import { MatDialog } from '@angular/material/dialog';
import { FormReplyComponent } from '../form-reply/form-reply.component';

@Component({
  selector: 'app-reply-post',
  templateUrl: './reply-post.component.html',
  styleUrls: ['./reply-post.component.scss'],
})
export class ReplyPostComponent {
  @Input() repliesData!: Reply[];
  @Output() newReplySubmitted = new EventEmitter<boolean>();
  @Output() closedModal = new EventEmitter<boolean>();
  replyID:string = "";

  constructor(public dialog:MatDialog) {}

  createReply(event:Event){
    console.log(event);
    const dialogRef = this.dialog.open(FormReplyComponent, {
      data: {
        id: ((<HTMLElement>event.target).id !== null) ? (<HTMLElement>event.target).id : ""
      }
    });
  }

  reloadReplies(){
    this.newReplySubmitted.emit(true);
  }

  scrollToReply(replyID:string){
    let reply = document.getElementById(replyID);
    reply!.scrollIntoView({behavior: "smooth"}); 
  }
}
