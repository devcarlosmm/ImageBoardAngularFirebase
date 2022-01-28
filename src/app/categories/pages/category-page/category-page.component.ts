import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Post } from '../../../interfaces/post.interface';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
})
export class CategoryPageComponent implements OnInit {
  posts: Post[] = [];
  
  constructor(categoryService: CategoryService) {
    categoryService.getPosts().then((data) => {
      this.posts = data;
    });
  }

  ngOnInit(): void {}
}
