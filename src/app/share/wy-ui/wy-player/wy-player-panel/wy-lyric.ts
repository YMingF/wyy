import {Lyric} from '../../../../service/data-types/common.types';
import {from, Subject, Subscription, timer, zip} from 'rxjs';
import {skip} from 'rxjs/operators';

interface BaseLyricLine {
  txt: string,
  txtCn: string,
}

export interface LyricLine extends BaseLyricLine {
  time: number; //每行歌词对应的时间
}

interface Handler extends BaseLyricLine {
  lineNum: number; // 当前歌词的行索引
}
// 匹配歌词的时间前缀[00:09]或[00:09.021]或[00:09.32]
const timeExp = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;

export class WyLyric {
  private lrc: Lyric;
  lines: LyricLine[] = [];// 处理之后的歌词
  private playing = false;
  private curNum: number;
  startStamp: number;
  pauseStamp: number;
  handler = new Subject<Handler>();
  private timer$: Subscription;

  constructor(lrc: Lyric) {
    this.lrc = lrc;
    this.init();
  }

  private init() {
    // tlyric表翻译后的歌词，若此属性存在，则说明为外文歌曲，否则为中文
    if (this.lrc.tlyric) {
      this.generateTLyric();
    } else {
      this.generateLyric();
    }
  }

  private generateLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line => this.makeLine(line));
  }
  /* 含有中文翻译的歌词处理逻辑
  总目标：要让英文和中文同一时间点的歌词一一对应
  步骤：
  1. 原文歌词会包含歌手，歌名加歌词等信息，而翻译的歌词只有歌词信息。所以一定会存在一者长度比另一者长的问题。因此先取出更长的那个歌词的歌名和歌手信息
  2. 将剩余的原文和翻译歌词通过zip() 操作符按照索引对应起来
  3。 对应好后再依次取出进行处理，添加到歌词列表中。

  * */
  private generateTLyric() {
    const lines = this.lrc.lyric.split('\n');
    // 只留下以时间开头的字符，方便后续和lyric同时间的字符对应起来
    const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null);
    let tempArr;
    const lineLenDiff = lines.length - tlines.length;
    if (lineLenDiff >= 0) {
      tempArr = [lines, tlines];
    } else {
      tempArr = [tlines, lines];
    }
    const res = timeExp.exec(tempArr[1][0]);
    const first = res[0];
    let skipIndex = 0;
    for (const index in tempArr[0]) {
      if (tempArr[0][index].trim().startsWith(first)) {
        skipIndex = +index;
        break;
      }
    }
    tempArr[0].slice(0, skipIndex).forEach(item => this.makeLine(item));
    let zipLines$;
    if (lineLenDiff > 0) {
      // skip() 这里过滤掉的就是长出来的那部分歌名和歌手信息
      zipLines$ = zip(from(lines).pipe(skip(skipIndex)), from(tlines));
    } else {
      zipLines$ = zip(from(lines), from(tlines).pipe(skip(skipIndex)));
    }
    zipLines$.subscribe(([line, tLine]) => {
      this.makeLine(line, tLine);
    });
  }

  private makeLine(line: string, tLine: string = '') {
    const res = timeExp.exec(line);
    if (res) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = tLine ? tLine.replace(timeExp, '').trim() : '';
      if (txt) {
        let millSecond = parseFloat(res[3].padEnd(3, '0')); // 毫秒位置的数据或2位或3位，这里统一成3位
        const time = Number(res[1]) * 60 * 1000 + Number(res[2]) * 1000 + millSecond;
        this.lines.push({txt, txtCn, time});
      }
    }
  }

  play(startTime = 0, skip = false) {
    if (!this.lines.length) {
      return;
    }
    if (!this.playing) {
      this.playing = true;
    }

    this.curNum = this.findCurNum(startTime);
    this.startStamp = Date.now() - startTime;
    if (!skip) {
      this.callHandler(this.curNum - 1);
    }

    if (this.curNum < this.lines.length) {
      this.clearTimer();
      this.playReset();
    }

  }

  private playReset() {
    const line = this.lines[this.curNum];
    const delay = line.time - (Date.now() - this.startStamp);
    this.timer$ = timer(delay).subscribe(() => {
      this.callHandler(this.curNum++);
      if (this.curNum < this.lines.length && this.playing) {
        this.playReset();
      }
    });
  }

  private clearTimer() {
    this.timer$ && this.timer$.unsubscribe();
  }


  private callHandler(i: number) {
    if (i > 0) {
      this.handler.next({
        txt: this.lines[i].txt,
        txtCn: this.lines[i].txtCn,
        lineNum: i
      });
    }
  }


  private findCurNum(time: number): number {
    const index = this.lines.findIndex(item => time <= item.time);
    return index === -1 ? this.lines.length - 1 : index;
  }

  togglePlay(playing: boolean) {
    const now = Date.now();
    this.playing = playing;
    if (playing) {
      const startTime = (this.pauseStamp || now) - (this.startStamp || now);
      this.play(startTime, true); // 暂停时已经拿到了歌词，所以设置为true表示不再重复发送歌词。
    } else {
      this.stop();
      this.pauseStamp = now;
    }
  }

  stop() {
    if (this.playing) {
      this.playing = false;
    }
    this.clearTimer();
  }

  seek(time: number) {
    this.play(time);
  }
}
