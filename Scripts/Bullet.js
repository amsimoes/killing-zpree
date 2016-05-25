"use strict";

class Bullet extends Element {
  constructor(img, x, y, width, height, cw, ch, speedX, speedY) {
    super(img, x, y, width, height);
    this.x = x;
    this.y = y;
    this.ch = ch;
    this.cw = cw;
    this.timer = 0;
    this.speedX = speedX;
    this.speedY = speedY;
    this.toRemove = false;
    id_bullet++;
    Bullet.list[id_bullet] = this;
  }

  updatePosition(map) {
    for (var i =0; i<map.coords.length; i++) {
      if(map.coords[i].x===Math.floor((this.x-(0.1*this.width))/(this.cw/n)) && map.coords[i].y===Math.floor((this.y+(0*this.height))/(this.ch/n)))
        this.toRemove = true;
      if(map.coords[i].y===Math.floor((this.y-(0.1*this.height))/(this.ch/n)) && map.coords[i].x===Math.floor((this.x+(0*this.width))/(this.cw/n)))
        this.toRemove = true;
      if(map.coords[i].x===Math.floor((this.x+(0.9*this.width))/(this.cw/n)) && map.coords[i].y===Math.floor((this.y+(0*this.height))/(this.ch/n)))
        this.toRemove = true;
      if(map.coords[i].y===Math.floor((this.y+(0.9*this.height))/(this.ch/n)) && map.coords[i].x===Math.floor((this.x+(0*this.width))/(this.cw/n)))
        this.toRemove = true;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    // RICOCHETE BORDAS
    if(ricochete) {
      if(this.x < 0 || this.x > this.cw)
        this.speedX = -this.speedX;
      if(this.y < 0 || this.y > this.ch)
        this.speedY = -this.speedY;
    }

    for(var key in Bullet.list) {
      if(Bullet.list[key].toRemove)
        delete Bullet.list[key];
    }
  }
}

Bullet.list = {};

Bullet.update = function(ctx, map) {
  for(var key in Bullet.list) {
    var b = Bullet.list[key];
    b.draw(ctx);
    b.update(ctx, map);

    var toRemove = false;

    b.timer++;
    if(!ricochete) {
      if(b.timer > 100)
        toRemove = true;
    } else {
      if(b.timer > 300)
        toRemove = true;
    }

    for(var enemy in Enemy.list) {
      if(b.checkCollision(Enemy.list[enemy])) {
        toRemove = true;
        Enemy.list[enemy].onDeath();
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

    var spdX = Math.cos(angle/180*Math.PI)*7;
    var spdY = Math.sin(angle/180*Math.PI)*7;
    new Bullet("bullet", hero.x, hero.y, 12, 12, cw, ch, spdX, spdY);
    playSound("shot", 1);
  }
