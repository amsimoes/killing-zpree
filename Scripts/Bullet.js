"use strict";

class Bullet extends Element {
  constructor(img, x, y, width, height, cw, ch, speedX, speedY) {
    super(img, x, y, width, height);
    this.timer = 0;
    this.speedX = speedX;
    this.speedY = speedY;
    this.toRemove = false;
    id_bullet++;
    Bullet.list[id_bullet] = this;
  }

  updatePosition() {
    this.x += this.speedX;
    this.y += this.speedY;

    if(this.x < 0 || this.x > this.cw)
      this.speedX = -this.speedX;
    if(this.y < 0 || this.y > this.ch)
      this.speedY = -this.speedY;
  }
}

Bullet.list = {};

Bullet.update = function(ctx) {
  console.log("update bullet");
  for(var key in Bullet.list) {
    var b = Bullet.list[key];
    b.update(ctx);

    b.timer++;
    if(b.timer > 75)
      toRemove = true;

    for(var enemy in Enemy.list) {
      if(b.checkCollision(Enemy.list[enemy])) {
        toRemove = true;
        Enemy.list[enemy].toRemove = true;
      }
    }

    if(toRemove)
      delete Bullet.list[key];
  }
}

Bullet.generate = function(hero, cw, ch) {
    var height = 24;
    var width = 24;
    var angle = hero.aimAngle;

    var spdX = Math.cos(angle/180*Math.PI)*5;
    var spdY = Math.sin(angle/180*Math.PI)*5;
    new Bullet("bullet", this.x, this.y, this.width, this.height, cw, ch, spdX, spdY);
  }
