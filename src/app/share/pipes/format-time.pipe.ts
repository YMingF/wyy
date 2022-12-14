import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time: number): any {
    if (time) {
      const temp = time | 0;
      const minute = temp / 60 | 0;
      const seconds = (temp % 60).toString().padStart(2, '0');
      return `${minute}:${seconds}`;
    } else {
      return '00:00';
    }
  }

}
