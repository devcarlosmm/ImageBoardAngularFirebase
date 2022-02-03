import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';

//PrimeNG
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { ReplyPostComponent } from './components/reply-post/reply-post.component';
import { DetailPostComponent } from './components/detail-post/detail-post.component';
import { FormPostComponent } from './components/form-post/form-post.component';
import { ButtonModule } from 'primeng/button';
import { ShortContentPipe } from './pipes/short-content.pipe';
@NgModule({
  declarations: [
    CategoryPageComponent,
    ReplyPostComponent,
    DetailPostComponent,
    FormPostComponent,
    ShortContentPipe,
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
  ],
})
export class CategoriesModule {}
