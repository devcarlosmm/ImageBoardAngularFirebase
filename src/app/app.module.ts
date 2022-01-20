import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MenubarModule } from 'primeng/menubar';
import { CategoryPageComponent } from './categories/pages/category-page/category-page.component';
import { FormPostComponent } from './categories/components/form-post/form-post.component';
import { DetailPostComponent } from './categories/components/detail-post/detail-post.component';
import { ReplyPostComponent } from './categories/components/reply-post/reply-post.component';
@NgModule({
  declarations: [AppComponent, NavbarComponent, FooterComponent, CategoryPageComponent, FormPostComponent, DetailPostComponent, ReplyPostComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenubarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
