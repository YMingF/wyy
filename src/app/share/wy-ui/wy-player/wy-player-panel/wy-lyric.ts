import {Lyric} from '../../../../service/data-types/common.types';

export type LyricLine = {
  txt: string,
  txtCn: string,
  time: number //每行歌词对应的时间
}
const timeExp = /\[(\d{2}):(\d{2}).(\d{2,3})\]/g;

export class WyLyric {
  private lrc: Lyric;
  lines: LyricLine[] = [];// 处理之后的歌词
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

  private generateTLyric() {
  }

  private makeLine(line: string) {
    const res = timeExp.exec(line);
    if (res) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = '';
      if (txt) {
        let millSecond = parseFloat(res[3].padEnd(3, '0')); // 毫秒位置的数据或2位或3位，这里统一成3位
        const time = Number(res[1]) * 60 * 1000 + Number(res[2]) * 1000 + millSecond;
        this.lines.push({txt, txtCn, time});
      }
    }
  }
}
