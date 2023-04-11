import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongInfoComponent } from './song-info.component';
import { SongInfoResolverService } from './song-info-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: SongInfoComponent,
    data: { title: '歌曲' },
    resolve: { songInfo: SongInfoResolverService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SongInfoResolverService],
})
export class SongInfoRoutingModule {}
