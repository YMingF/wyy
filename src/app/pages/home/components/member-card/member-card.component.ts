import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from "../../../../service/data-types/member.type";
import { MemberService } from "../../../../service/member.service";

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Output() openModal = new EventEmitter<void>();
  tipTitle: string;
  showTip = true;

  constructor(
    private memberServe:MemberService
  ) {
  }

  ngOnInit(): void {
  }

  onSignIn() {
    this.memberServe.signIn().subscribe(res=>{
      console.log('result', res);
    },err=>{
      console.log(err);
    })
  }
}
