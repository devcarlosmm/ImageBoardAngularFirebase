import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';

//PrimeNG
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { CaptchaModule } from 'primeng/captcha';

import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { ReplyPostComponent } from './components/reply-post/reply-post.component';
import { DetailPostComponent } from './components/detail-post/detail-post.component';
import { FormPostComponent } from './components/form-post/form-post.component';
import { ButtonModule } from 'primeng/button';
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
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    CaptchaModule
  ],
})
export class CategoriesModule {}
