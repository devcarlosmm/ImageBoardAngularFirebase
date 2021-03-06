import { Component } from '@angular/core';
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
export class ArchivoComponent {
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
  loading:boolean = true;

  constructor(
    private auth: AuthService,
    private categoryService: CategoryService
  ) {
    // Recuperamos los datos que necesitamos para el navegador
    this.auth
      .getInformacion()
      .pipe(
        map(({ uid, displayName }) => {
          return { displayName, uid };
        }),
        catchError((err) => err)
      )
      .subscribe(async (data) => {
        this.subject$ = data as navbarInfo;
        await this.retrieveData();
        this.loading = false;
      });
  }

  async retrieveData(){
    this.categoryService.recuperarPostUser(this.subject$.uid);
    await this.categoryService.getUserPost().subscribe((data) => {
      this.postsList$ = data as Post[];
    });
    this.categoryService.recuperarReplyUser(this.subject$.uid);
    await this.categoryService.getUserReply().subscribe((data) => {
      this.replyList$ = data as Reply[];
    });
  }

  // Editar POST
  async postFormulario(pItem: Post) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Post',
      width: 600,
      background: 'var(--fondo-medio)',
      color: 'var(--claro-claro)',
      confirmButtonColor: 'var(--medio-claro)',
      confirmButtonText: 'Editar',
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
        return [inputValue, textAreaValue];
      },
    });
    if (formValues) {
      this.setFormPost(pItem, formValues);
    }
  }

  // Editar REPLY
  async replyFormulario(pItem: Reply) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Reply',
      width: 600,
      background: 'var(--fondo-medio)',
      color: 'var(--claro-claro)',
      confirmButtonColor: 'var(--medio-claro)',
      confirmButtonText: 'Editar',
      html:
        '<input id="swal-input1" class="swal2-input" value="' +
        pItem.content +
        '">',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const inputElement = document.getElementById(
          'swal-input1'
        ) as HTMLInputElement;

        const inputValue = inputElement.value;
        return [inputValue];
      },
    });
    if (formValues) {
      this.setFormReply(pItem, formValues);
    }
  }

  // Set datos FORMVALUE POST
  async setFormPost(pItem: Post, pFormValues: string[]) {
    //TODO mirar si el contenido es igual al POST con if else

    //TODO si es diferente mandar datos para actualizar
    this.form.controls['title'].setValue(pFormValues[0]);
    this.form.controls['content'].setValue(pFormValues[1]);
    this.form.controls['id'].setValue(pItem.id);
    await this.categoryService.updatePost(this.form.value);
    this.retrieveData();
  }
  // Set datos FORMVALUE REPLY
  async setFormReply(pItem: Reply, pFormValues: string[]) {
    //TODO mirar si el contenido es igual al REPLY con if else

    //TODO si es diferente mandar datos para actualizar
    this.form.controls['content'].setValue(pFormValues[0]);
    this.form.controls['id'].setValue(pItem.idReply);
    await this.categoryService.updateReply(this.form.value);
    this.retrieveData();
  }

  //TODO borrar POST
  borrarPost(post: Post) {
    Swal.fire({
      title: '??Estas seguro de borrar el post?',
      text: 'Si lo borras desaparecera el post y las respuestas',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!',
      width: 600,
      background: 'var(--fondo-medio)',
      color: 'var(--claro-claro)',
      confirmButtonColor: 'var(--medio-claro)',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.categoryService.borrarPost(post.id!);
        this.retrieveData();
        Swal.fire({
          title: 'Borrado!',
          text: 'Tu post ha sido borrado.',
          icon: 'success',
          background: 'var(--fondo-medio)',
          color: 'var(--claro-claro)',
          confirmButtonColor: 'var(--medio-claro)',
        });
      }
    });
  }

  //TODO borrar Reply
  borrarReply(reply: Reply) {
    Swal.fire({
      title: '??Estas seguro de borrar el comentario?',
      text: 'Si lo borras desaparecera tanto el comentario como su imagen',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!',
      width: 600,
      background: 'var(--fondo-medio)',
      color: 'var(--claro-claro)',
      confirmButtonColor: 'var(--medio-claro)',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.categoryService.borrarReply(reply.idReply);
        this.retrieveData();
        Swal.fire({
          title: 'Borrado!',
          text: 'Tu comentario ha sido borrado.',
          icon: 'success',
          background: 'var(--fondo-medio)',
          color: 'var(--claro-claro)',
          confirmButtonColor: 'var(--medio-claro)',
        });
      }
    });
  }
}
