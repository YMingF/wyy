import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CenterComponent } from './center/center.component';
import { CenterResolveService } from './center/center.resolve.service';

const routes: Routes = [
  {
    path: '',
    component: CenterComponent,
    data: { title: '个人中心' },
    resolve: {
      user: CenterResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CenterResolveService],
})
export class MemberRoutingModule {}
