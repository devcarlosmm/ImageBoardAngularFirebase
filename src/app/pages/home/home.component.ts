import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  angleY:number = 0;
  
  constructor() {}

  ngOnInit(): void {}

  gallerySpin(sign:string){
    let carousel = document.getElementById("carousel");
    if(sign){
      this.angleY += 90;
    }else{
      this.angleY -= 90;
    }
    carousel?.setAttribute("style", `transform: rotateY(${this.angleY}deg)`);
  }
}
