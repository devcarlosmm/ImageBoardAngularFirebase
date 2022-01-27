import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Post } from '../../../interfaces/post.interface';
import { Reply } from 'src/app/interfaces/reply.interface';
import { ReplyService } from 'src/app/services/reply.service';
@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
})
export class CategoryPageComponent implements OnInit {
  posts: Post[] = [];
  replies: Reply[] = [];
  constructor(categoryService: CategoryService, replyService: ReplyService) {
    categoryService.getPosts().then((data) => {
      this.posts = data;
    });

    replyService.getReplies().then((data) => {
      this.replies = data;
    });
  }

  ngOnInit(): void {}
}
