import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss'],
})
export class NotfoundComponent implements OnInit {
  errorMsg:string = "";

  constructor(private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.errorMsg = (params["err"]) ? params["err"]:"Page not found";
      console.log(params);
    });

    console.log(this.errorMsg);
  }
}
