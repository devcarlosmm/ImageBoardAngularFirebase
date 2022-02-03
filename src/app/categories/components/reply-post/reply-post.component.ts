import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Reply } from 'src/app/interfaces/reply.interface';

@Component({
  selector: 'app-reply-post',
  templateUrl: './reply-post.component.html',
  styleUrls: ['./reply-post.component.scss'],
})
export class ReplyPostComponent implements OnChanges {
  @Input() repliesData!: Reply[];
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.repliesData);
  }
}
