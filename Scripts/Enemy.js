"use strict";

class Enemy extends Element {
  constructor(img, x, y, width, height, cw, ch, movSpeed) {
    super(img, x, y, width, height);
    this.img = document.getElementById(img);
    this.cw = cw;
    this.ch = ch;
    this.x = x;
    this.y = y;
    this.movSpeed = movSpeed;
    this.toRemove = false;
    this.spriteCounter = 0;
    id_zombie++;
    Enemy.list[id_zombie] = this;
    console.log("id = "+id_zombie);
    this.coords = [new Coord(Math.floor(n/2), Math.floor(n/2))];
  }

  update(ctx, hero, map) {
    //this.draw(ctx);
    super.update(ctx, map);
    this.hero_x = hero.x;
    this.hero_y = hero.y;
    //this.draw(ctx);
  }

  draw(ctx) {
    //ctx.save();

    //console.log("[ENEMY] DRAW");
    if(zombieAnimCounter)
      ctx.drawImage(this.img, this.img.width/2, 0, this.img.width/2, this.img.height, this.x, this.y, this.img.width/2, this.img.height);
    else
      ctx.drawImage(this.img, 0, 0, this.img.width/2, this.img.height, this.x, this.y, this.img.width/2, this.img.height);
    //super.draw(ctx);

    //ctx.restore();
  }

  updatePosition(map) {
    //var heroPos = hero.getPosition();
    var diffX = this.hero_x - this.x;
    var diffY = this.hero_y - this.y;

    if(diffX > 0)
      this.x += this.movSpeed;
    else
      this.x -= this.movSpeed;
    if(diffY > 0)
      this.y += this.movSpeed;
    else
      this.y -= this.movSpeed;

    for(let i=0; i<map.coords.length; i++) {
      if(this.x == map.coords[i].x && this.y == map.coords[i].y)
        console.log("[ZOMBIE] COLISAO OBSTACULO");
    }
  }

  onDeath() {
    this.toRemove = true;
  }
}

// timeSpawn -> tempo em segundos que da spawn um zombie
Enemy.update = function(ctx, cw, ch, hero, movSpeed, timeSpawn, map) {
  if(frames % (25*timeSpawn) == 0 && id_zombie < zombieLimit)
    this.randomGenerate(ctx, cw, ch, movSpeed);
  for(var key in Enemy.list){
    //console.log("update???");
		Enemy.list[key].update(ctx, hero, map);
    Enemy.list[key].draw(ctx);
	}
	for(var key in Enemy.list){
		if(Enemy.list[key].toRemove) {
      delete Enemy.list[key];
      score++;
      console.log("Score ="+score);
    }
	}
}

  // 4 Posicoes para os zombies nascerem: (0, ch/2) | (cw/2, 0) | (cw, ch/2) | (cw/2, ch)
Enemy.randomGenerate = function(ctx, cw, ch, movSpeed) {
    var x, y;
    var rand = Math.random();
    if(rand <= 0.25) {
      x = 0;
      y = ch/2;
    } else if(rand > 0.25 && rand <= 0.5) {
      x = cw/2;
      y = 0;
    } else if(rand > 0.5 && rand <= 0.75) {
      x = cw;
      y = ch/2;
    } else if(rand > 0.75 && rand <= 1.0) {
      x = cw/2;
      y = ch;
    }
    var en = new Enemy("zombie", x, y, 40, 40, cw, ch, movSpeed);
    //en.draw(ctx);
    console.log("A gerar novo Zombie em ("+x+","+y+")");
  }
