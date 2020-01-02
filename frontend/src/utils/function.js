export function dispatchEvent(event) {
  if (Event.prototype.initEvent) {
    const evt = window.document.createEvent('UIEvents');
    evt.initUIEvent(event, true, false, window, 0);
    window.dispatchEvent(evt);
  } else {
    window.dispatchEvent(new Event(event));
  }
}
export function a() {
  console.log(111)
}
