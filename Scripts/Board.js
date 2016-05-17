"use strict";

const n = 25;

class Coord {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return "("+this.x+", "+this.y+")";
  }
}

class Board {
  constructor(cw, ch) {
    this.cw = cw;
    this.ch = ch;
    this.width = cw / n;
    this.height = ch / n;
    this.coords = [];
  }
  draw(ctx, cw, ch) {

  }
}
