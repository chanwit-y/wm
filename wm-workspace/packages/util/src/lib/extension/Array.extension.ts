export { };

declare global {
  interface Array<T> {
    first(): T;
    last(): T;
    isEmpty(): boolean;
  }
}

Array.prototype.first = function () {
  return this.length > 0 ? this.slice(0, 1).shift() : undefined;
};

Array.prototype.last = function () {
  return this.length > 0 ? this[this.length - 1] : undefined;
};

Array.prototype.isEmpty = function () {
  return this === undefined || this.length === 0;
};
