import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CategoryPageComponent } from './categories/pages/category-page/category-page.component';
import { FormPostComponent } from './categories/components/form-post/form-post.component';
import { DetailPostComponent } from './categories/components/detail-post/detail-post.component';
import { ReplyPostComponent } from './categories/components/reply-post/reply-post.component';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';

//PrimeNG
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    CategoryPageComponent,
    FormPostComponent,
    DetailPostComponent,
    ReplyPostComponent,
    HomeComponent,
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenubarModule,
    ButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
