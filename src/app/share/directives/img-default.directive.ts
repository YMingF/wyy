import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[ImgDefault]',
})
export class ImgDefaultDirective {
  constructor() {}

  @HostListener('mousedown', ['$event']) onMousedown(event) {
    event.preventDefault();
  }
}
