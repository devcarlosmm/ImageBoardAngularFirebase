import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Post } from '../../../interfaces/post.interface';
import { FormPostComponent } from '../../components/form-post/form-post.component';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
})
export class CategoryPageComponent implements OnInit {
  posts: Post[] = [];
  category: string = '';
  currentCategory: string = '';
  subscription: Subscription;
  loading: boolean = true;
  modalVisible: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    public dialog:MatDialog
  ) {
    this.subscription = this.router.events.subscribe({
      next: (event) => {
        this.posts = [];
        this.loading = true;
        if (event instanceof NavigationEnd) {
          if (event.url.split('/')[2] != this.currentCategory) {
            this.retrievePosts();
          }
        }
      },
    });
  }

  ngOnInit(): void {
    window.onbeforeunload = () => this.unsubscribeOnChange();
  }

  retrievePosts() {
    this.posts = [];
    this.loading = true;
    this.category = this.router.url.split('/')[2];
    this.currentCategory = this.category;
    this.categoryService.getPostsByCategory(this.category).then((data) => {
      this.posts = data;
      this.loading = false;
    });
  }

  createPost() {
    const dialogRef = this.dialog.open(FormPostComponent);
  }

  reloadPosts(reload: boolean) {
    if (reload) {
      this.retrievePosts();
    }
  }

  unsubscribeOnChange(): void {
    this.subscription.unsubscribe();
  }
}
