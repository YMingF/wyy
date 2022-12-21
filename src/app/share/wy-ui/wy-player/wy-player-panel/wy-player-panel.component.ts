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
import {LyricLine, WyLyric} from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit {
  @Input() playing: boolean;
  @Input() songList: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  scrollY = 0;
  currentLyric: LyricLine[];
  lyric: WyLyric;
  currentLineNum: number;
  lyricRefs: NodeList; // 存放歌词界面所有的li标签
  constructor(private songService: SongService) {
  }

  scrollToCurrent(speed = 300) {
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
    if (changes['playing']) {
      if (!changes['playing'].firstChange) {
        this.lyric&&this.lyric.togglePlay(this.playing);
      }

    }
    if (changes['currentSong']) {
      if (this.currentSong) {
        this.currentIndex = findSongIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {
        this.resetLyric();
      }

    }
    if (changes['show']) {
      if (!changes['show'].firstChange && this.show) {
        this.wyScroll.first.refreshScroll();
        this.wyScroll.last.refreshScroll(); // 刷新歌词面板
        if (this.currentSong) {
          timer(80).subscribe(() => {
            this.scrollToCurrent(0);
          });
        }
      }
    }
  }

  updateLyric() {
    this.resetLyric();
    this.songService.getLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      const startLine = res.tlyric ? 1 : 2;
      this.handleLyric(startLine);
      this.wyScroll.last.scrollTo(0, 0);
      timer(100).subscribe(() => {
        if (this.playing) {
          this.lyric.play();
        }
      });
    });
  }

  private handleLyric(startLine = 2) {
    this.lyric.handler.subscribe(({lineNum}) => {
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }
      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        if (this.currentLineNum > startLine) {
          const targetLine = this.lyricRefs[lineNum - startLine];
          if (targetLine) {
            this.wyScroll.last.scrollToElement(targetLine, 300, false, false);
          }
        } else {
          this.wyScroll.last.scrollTo(0, 0);
        }

      }
    });
  }

  resetLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = [];
      this.currentLineNum = 0;
      this.lyricRefs = null;
    }
  }
  seekLyric(time:number){
    if (this.lyric){
      this.lyric.seek(time)
    }
  }
}
