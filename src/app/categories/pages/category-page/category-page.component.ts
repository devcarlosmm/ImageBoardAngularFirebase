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
  loading:boolean = true;
  
  constructor(private categoryService: CategoryService, private router:Router) {
    this.subscription = this.router.events.subscribe({
      next: (event) => {
        this.posts = [];
        this.loading = true;
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

  retrievePosts(){
    this.category = this.router.url.split("/")[2];
    this.currentCategory = this.category;
    this.categoryService.getPosts(this.category).then((data) => {
      setTimeout(() => {
        this.posts = data;
        this.loading = false;
      }, 1000);
    });
  }

  unsubscribeOnChange():void{
    this.subscription.unsubscribe();
  }
}
