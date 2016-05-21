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

    // RICOCHETE BORDAS
    if(ricochete) {
      if(this.x < 0 || this.x > this.cw)
        this.speedX = -this.speedX;
      if(this.y < 0 || this.y > this.ch)
        this.speedY = -this.speedY;
    }
  }
}

Bullet.list = {};

Bullet.update = function(ctx) {
  for(var key in Bullet.list) {
    var b = Bullet.list[key];
    b.draw(ctx);
    b.update(ctx);

    var toRemove = false;

    b.timer++;
    if(!ricochete) {
      if(b.timer > 100)
        toRemove = true;
    } else {
      if(b.timer > 150)
        toRemove = true;
    }

    for(var enemy in Enemy.list) {
      if(b.checkCollision(Enemy.list[enemy])) {
        score++;
        toRemove = true;
        Enemy.list[enemy].onDeath();
        //delete Enemy.list[enemy];
      }
    }

    if(toRemove)
      delete Bullet.list[key];
  }
}

// Nova BALA + Velocidade da bala
Bullet.generate = function(hero, cw, ch) {
    var height = 24;
    var width = 24;
    var angle = hero.aimAngle;

    var spdX = Math.cos(angle/180*Math.PI)*5;
    var spdY = Math.sin(angle/180*Math.PI)*5;
    new Bullet("bullet", hero.x, hero.y, 12, 12, cw, ch, spdX, spdY);
  }
