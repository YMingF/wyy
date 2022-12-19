import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output, QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {Song} from '../../../../service/data-types/common.types';
import {WyScrollComponent} from '../wy-scroll/wy-scroll.component';
import {findSongIndex} from '../../../../utils/array';
import {timer} from 'rxjs';
import {SongService} from '../../../../service/song.service';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit {
  @Input() songList: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  scrollY = 0;
  constructor(private songService: SongService) {
  }

  scrollToCurrent(speed=300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = songListRefs[this.currentIndex || 0];
      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;
      if ((offsetTop - Math.abs(this.scrollY) > offsetHeight * 5) || (offsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findSongIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      }

    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        if (this.currentSong) {
          timer(80).subscribe(() => {
            this.scrollToCurrent(0);
          });
        }
      }
    }
  }

  updateLyric() {
    this.songService.getLyric(this.currentSong.id).subscribe(lyric=>{
      console.log('歌词');
      console.log(lyric);
    })
  }
}
