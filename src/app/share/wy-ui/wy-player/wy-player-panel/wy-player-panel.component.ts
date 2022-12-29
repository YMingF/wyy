import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
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
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @Output() onDeleteSong = new EventEmitter<Song>();
  @Output() onClearSong = new EventEmitter<void>();
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  currentIndex: number;
  scrollY = 0;
  currentLyric: LyricLine[];
  lyric: WyLyric;
  currentLineNum: number;
  lyricRefs: NodeList; // 存放歌词界面所有的li标签
  startLine = 2;
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
    if (changes['songList']) {
      this.updateCurrentIndex();
    }
    if (changes['playing']) {
      if (!changes['playing'].firstChange) {
        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }
    if (changes['currentSong']) {
      if (this.currentSong) {
        this.updateCurrentIndex();
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
          timer(80).subscribe(() => {
            if (this.currentSong) {
              this.scrollToCurrent(0);
            }
            // 确保歌词面板打开时，滚动条滚动到歌词高亮位置
            if (this.lyricRefs) {
              this.scrollToCurrentLyric(0);
            }
          });
      }
    }
  }
  // 在删除等操作改变播放列表时，当前索引也要改变，确保高亮在正确的歌曲上
  updateCurrentIndex() {
    this.currentIndex = findSongIndex(this.songList, this.currentSong);
  }

  updateLyric() {
    this.resetLyric();
    this.songService.getLyric(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      this.startLine = res.tlyric ? 1 : 3;
      this.handleLyric();
      this.wyScroll.last.scrollTo(0, 0);
      timer(100).subscribe(() => {
        if (this.playing) {
          this.lyric.play();
        }
      });
    });
  }

  private handleLyric() {
    this.lyric.handler.subscribe(({lineNum}) => {
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
      }
      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        if (this.currentLineNum > this.startLine) {
          this.scrollToCurrentLyric();
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

  seekLyric(time: number) {
    if (this.lyric) {
      this.lyric.seek(time);
    }
  }

  private scrollToCurrentLyric(speed = 300) {
    const targetLine = this.lyricRefs[this.currentLineNum - this.startLine];
    if (targetLine) {
      this.wyScroll.last.scrollToElement(targetLine, speed, false, false);
    }
  }
}
