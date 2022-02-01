import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Post } from '../../../interfaces/post.interface';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
})
export class CategoryPageComponent implements OnInit{
  posts: Post[] = [];
  category:string = "";
  currentCategory:string = "";
  subscription:Subscription;
  loading:boolean = false;
  
  constructor(private categoryService: CategoryService, private router:Router) {
    this.subscription = this.router.events.subscribe({
      next: (event) => {
        if(event instanceof NavigationStart){
          this.loading = true;
          this.posts = [];
        }
        if(event instanceof NavigationEnd){
          if(event.url.split("/")[2] != this.currentCategory){
            this.retrievePosts();
          }
        }
      }
    })
  }

  ngOnInit(): void {
    window.onbeforeunload = () => this.unsubscribeOnChange();
  }

  retrievePosts():void{
    this.posts = [];
    this.category = this.router.url.split("/")[2];
    this.currentCategory = this.category;
    this.categoryService.getPosts(this.category).then((data) => {
      this.posts = data;
      this.loading = false;
    });
  }

  unsubscribeOnChange():void{
    this.subscription.unsubscribe();
  }
}
