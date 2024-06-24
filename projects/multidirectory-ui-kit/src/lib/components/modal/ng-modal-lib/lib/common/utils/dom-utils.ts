export function isLeftButton(event: MouseEvent | TouchEvent): boolean {
  if (event.type === 'touchstart') {
    return true;
  }
  return event.type === 'mousedown' && (event as MouseEvent).button === 0;
}

export function getEvent(event: MouseEvent | TouchEvent): MouseEvent | Touch {
  if (event.type === 'touchend' || event.type === 'touchcancel') {
    return (event as TouchEvent).changedTouches[0];
  }
  return event.type.startsWith('touch')
    ? (event as TouchEvent).targetTouches[0]
    : (event as MouseEvent);
}
