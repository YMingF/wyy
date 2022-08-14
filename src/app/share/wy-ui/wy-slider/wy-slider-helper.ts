export function sliderEvent(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}

export function getElementOffset(el: HTMLElement): { top: number, left: number } {
  // 若这个dom元素连一个此物件都不存在，就退出
  if (!el.getClientRects().length) {
    return {top: 0, left: 0};
  }
  const rect = el.getBoundingClientRect();
  // 获取el这个dom对象所在document的window
  const win = el.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset
  };
}
