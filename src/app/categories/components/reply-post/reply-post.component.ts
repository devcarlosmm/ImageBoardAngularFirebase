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
  @Output() newReplySubmitted = new EventEmitter();
  replyID:string = "";

  constructor(public dialog:MatDialog) {}

  createReply(event:Event){
    const dialogRef = this.dialog.open(FormReplyComponent, {
      data: {
        id: ((<HTMLElement>event.target).id !== null) ? (<HTMLElement>event.target).id : ""
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.reloadReplies();
    })
  }

  reloadReplies(){
    this.newReplySubmitted.emit();
  }

  scrollToReply(replyID:string){
    let reply = document.getElementById(replyID);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("popIntoView");
          return;
        }
        entry.target.classList.remove("popIntoView");
      })
    });
    observer.observe(reply!);
    reply!.scrollIntoView({behavior: "smooth"});   
  }
}
