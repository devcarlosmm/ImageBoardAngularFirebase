import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';

import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { ReplyPostComponent } from './components/reply-post/reply-post.component';
import { DetailPostComponent } from './components/detail-post/detail-post.component';
import { FormPostComponent } from './components/form-post/form-post.component';
import { ShortContentPipe } from './pipes/short-content.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormReplyComponent } from './components/form-reply/form-reply.component';
@NgModule({
  declarations: [
    CategoryPageComponent,
    ReplyPostComponent,
    DetailPostComponent,
    FormPostComponent,
    ShortContentPipe,
    FormReplyComponent,
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CategoriesModule {}
