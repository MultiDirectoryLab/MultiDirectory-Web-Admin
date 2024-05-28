export class Trackable<T> {
  current: T;
  original: T;

  constructor(obj: T) {
    this.current = obj;
    this.original = JSON.parse(JSON.stringify(obj));
  }
}
