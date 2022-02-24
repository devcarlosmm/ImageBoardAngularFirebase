import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post.interface';
import { Reply } from 'src/app/interfaces/reply.interface';
import { CategoryService } from '../../../services/category.service';
import { ReplyService } from '../../../services/reply.service';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.scss'],
})
export class DetailPostComponent implements OnInit {
  detailPost: Post = {
    id: '',
    uid: '',
    category: '',
    content: '',
    img: "",
    title: '',
  };
  repliesPost: Reply[] = [];
  postId: string = '';

  constructor(
    private categoryService: CategoryService,
    route: ActivatedRoute,
    private replyService: ReplyService
  ) {
    this.postId = route.snapshot.params['id'];

    this.categoryService
      .getDetailPost(this.postId)
      .then((data) => {
        this.detailPost = data;
        console.log('OP', this.detailPost);
        this.replyService
          .getRepliesPost(this.postId)
          .then((data) => {
            this.repliesPost = data;
            console.log('RP', this.repliesPost);
          })
          .catch((error) => {
            console.log('Error al recibir replies:', error);
          });
      })
      .catch((error) => {
        console.log('Errollll: ', error);
      });
  }

  ngOnInit(): void {}
}
