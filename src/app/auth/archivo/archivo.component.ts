import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { navbarInfo } from 'src/app/interfaces/register.interface';
import { catchError, map } from 'rxjs';
import { Post } from 'src/app/interfaces/post.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-archivo',
  templateUrl: './archivo.component.html',
  styleUrls: ['./archivo.component.scss'],
})
export class ArchivoComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  subject$: navbarInfo = {
    uid: '',
    displayName: '',
  };
  postsLits$: Post[] = [];
  error: string = '';
  constructor(
    private auth: AuthService,
    private categoryService: CategoryService
  ) {
    // Recuperamos los datos que necesitamos para el navegador
    this.auth
      .getInformacion()
      .pipe(
        map(({ uid, displayName }) => {
          console.log('data recibida', uid, displayName);
          return { displayName, uid };
        }),
        catchError((err) => err)
      )
      .subscribe((data) => {
        this.subject$ = data as navbarInfo;
        this.categoryService.recuperarPostUser(this.subject$.uid);
        this.categoryService.getUserPost().subscribe((data) => {
          this.postsLits$ = data as Post[];
          //
          console.log(this.postsLits$);
          for (const iterator of this.postsLits$) {
            this.form.controls['title'].setValue(iterator.title);
            this.form.controls['content'].setValue(iterator.content);
          }

          //
        });
      });
  }

  ngOnInit(): void {}

  editarPost(pPost: Post) {
    console.log(pPost, this.form.value);
  }
}
