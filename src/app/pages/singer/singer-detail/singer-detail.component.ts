import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(({singerDetail})=>{
      console.log('singer detail data');
      console.log(singerDetail);
    })
  }

  ngOnInit() {
  }

}
