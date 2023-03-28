import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../../service/data-types/member.type';
import {MemberService} from '../../../../service/member.service';
import {timer} from 'rxjs';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  @Output() openModal = new EventEmitter<void>();
  point: number;
  tipTitle: string;
  showTip = false;

  constructor(
    private memberServe:MemberService
  ) {
  }

  ngOnInit(): void {
  }

  onSignIn() {
    this.memberServe.signIn().subscribe(res => {
      this.tipTitle = `积分+${res.point}`;
      this.showTip = true;
      timer(1500).subscribe(() => {
        this.showTip = false;
        this.tipTitle = '';
      });
    }, err => {
      console.log(err);
    });
  }
}
