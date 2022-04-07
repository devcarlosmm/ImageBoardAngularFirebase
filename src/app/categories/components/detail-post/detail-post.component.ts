import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/post.interface';
import { Reply } from 'src/app/interfaces/reply.interface';
import { CategoryService } from '../../../services/category.service';
import { ReplyService } from '../../../services/reply.service';
import { FormReplyComponent } from '../form-reply/form-reply.component';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.scss'],
})
export class DetailPostComponent{
  detailPost: Post = {
    id: '',
    uid: '',
    category: '',
    content: '',
    img: "",
    title: '',
    date: new Date(2022,1,1)
  };
  repliesPost: Reply[] = [];
  postId: string = '';
  username:string = "";
  loading: boolean = true;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private replyService: ReplyService,
    public dialog:MatDialog
  ) {
    this.postId = route.snapshot.params['id'];
    this.retrieveData();
  }

  createReply(){
    const dialogRef = this.dialog.open(FormReplyComponent);
    dialogRef.afterClosed().subscribe(() =>{
      this.retrieveData();
    });
  }

  retrieveData(){
    this.categoryService
      .getDetailPost(this.postId)
      .then((data) => {
        this.detailPost = data;
        this.reloadReplies();
      })
      .catch((error) => {
        console.log("Error retrieving post data", error);
      });
  }

  reloadReplies(){
    this.replyService
      .getRepliesPost(this.postId)
      .then((data) => {
        this.repliesPost = data;
        this.loading = false;
      })
      .catch((error) => {
        console.log("Error loading reply data", error);
      });
  }

  scrollToReply(replyID:string){
    let reply = document.getElementById(replyID);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.toggle("popIntoView");
          return;
        }
      })
    });
    observer.observe(reply!);
    reply!.scrollIntoView({
      block:"center",
      behavior: "smooth"
    }); 
  }
}
