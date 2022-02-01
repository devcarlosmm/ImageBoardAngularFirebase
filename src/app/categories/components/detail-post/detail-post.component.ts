import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post.interface';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.scss'],
})
export class DetailPostComponent implements OnInit {
  detailPost: Post = {
    id: '',
    category: '',
    content: '',
    img: '',
    title: '',
  };
  postId: string = '';

  constructor(private categoryService: CategoryService, route: ActivatedRoute) {
    this.postId = route.snapshot.params['id'];

    this.categoryService
      .getDetailPost(this.postId)
      .then((data) => {
        this.detailPost = data;
        console.log('OP', this.detailPost);
      })
      .catch((error) => {
        console.log('Errollll: ', error);
      });
  }

  ngOnInit(): void {}
}
