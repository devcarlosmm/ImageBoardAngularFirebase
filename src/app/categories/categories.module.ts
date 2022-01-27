import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CardModule } from 'primeng/card';

import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { ReplyPostComponent } from './components/reply-post/reply-post.component';
import { DetailPostComponent } from './components/detail-post/detail-post.component';
import { FormPostComponent } from './components/form-post/form-post.component';
import { ButtonModule } from 'primeng/button';
@NgModule({
  declarations: [
    CategoryPageComponent,
    ReplyPostComponent,
    DetailPostComponent,
    FormPostComponent,
  ],
  imports: [CommonModule, CategoriesRoutingModule, CardModule, ButtonModule],
})
export class CategoriesModule {}
