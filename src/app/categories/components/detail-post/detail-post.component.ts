import { Component, OnInit } from '@angular/core';
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
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {}
}
