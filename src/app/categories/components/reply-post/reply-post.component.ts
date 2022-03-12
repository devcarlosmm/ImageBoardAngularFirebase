import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reply } from 'src/app/interfaces/reply.interface';

@Component({
  selector: 'app-reply-post',
  templateUrl: './reply-post.component.html',
  styleUrls: ['./reply-post.component.scss'],
})
export class ReplyPostComponent {
  @Input() repliesData!: Reply[];
  @Input('visible') visible: boolean = false;
  @Output() newReplySubmitted = new EventEmitter<boolean>();
  @Output() closedModal = new EventEmitter<boolean>();

  modalVisible:boolean = false;

  constructor() {}

  createReply(){
    this.modalVisible = !this.modalVisible;
  }

  reloadReplies(){
    this.newReplySubmitted.emit(true);
  }
}
