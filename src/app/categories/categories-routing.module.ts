import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailPostComponent } from './components/detail-post/detail-post.component';
import { FormPostComponent } from './components/form-post/form-post.component';
import { ReplyPostComponent } from './components/reply-post/reply-post.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'details/:id',
        component: DetailPostComponent,
      },
      {
        path: 'formPost',
        component: FormPostComponent,
      },
      {
        path: 'reply',
        component: ReplyPostComponent,
      },
      {
        path: '',
        component: CategoryPageComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
