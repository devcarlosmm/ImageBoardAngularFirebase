import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { navbarInfo } from 'src/app/interfaces/register.interface';
import { catchError, map } from 'rxjs';
import { Post } from 'src/app/interfaces/post.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Reply } from 'src/app/interfaces/reply.interface';

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
    id: new FormControl(''),
  });

  subject$: navbarInfo = {
    uid: '',
    displayName: '',
  };
  postsList$: Post[] = [];
  replyList$: Reply[] = [];
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
          this.postsList$ = data as Post[];
        });
        this.categoryService.recuperarReplyUser(this.subject$.uid);
        this.categoryService.getUserReply().subscribe((data) => {
          this.replyList$ = data as Reply[];
        });
      });
  }

  ngOnInit(): void {}

  editarPost(pPost: Post) {
    console.log(pPost, this.form.value);
  }

  async pruebaFormulario(pItem: Post) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Post',
      width: 600,
      html:
        '<input id="swal-input1" class="swal2-input" value="' +
        pItem.title +
        '">' +
        '<textarea id="swal-area2" class="swal2-textarea">' +
        pItem.content +
        '</textarea>',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const inputElement = document.getElementById(
          'swal-input1'
        ) as HTMLInputElement;
        const areaElement = document.getElementById(
          'swal-area2'
        ) as HTMLTextAreaElement;

        const inputValue = inputElement.value;
        const textAreaValue = areaElement.value;
        console.log(inputValue, textAreaValue);
        return [inputValue, textAreaValue];
      },
    });
    if (formValues) {
      Swal.fire(JSON.stringify(formValues));
      this.setForm(pItem, formValues);
    }
  }

  // Set datos FORMVALUE
  setForm(pItem: Post, pFormValues: string[]) {
    //TODO mirar si el contenido es igual al POST con if else

    //TODO si es diferente mandar datos para actualizar
    this.form.controls['title'].setValue(pFormValues[0]);
    this.form.controls['content'].setValue(pFormValues[1]);
    this.form.controls['id'].setValue(pItem.id);
    this.categoryService.updatePost(this.form.value);
  }
}
