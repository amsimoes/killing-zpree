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
    ctx.save();

    //console.log("[ENEMY] DRAW");
    if(zombieAnimCounter)
      ctx.drawImage(this.img, this.img.width/2, 0, this.img.width/2, this.img.height, this.x, this.y, this.img.width/2, this.img.height);
    else
      ctx.drawImage(this.img, 0, 0, this.img.width/2, this.img.height, this.x, this.y, this.img.width/2, this.img.height);
    //super.draw(ctx);

    ctx.restore();
  }

  updatePosition(map) {
    var obstaculo = false;
    var obstaculoLeft = false;
    var obstaculoUp = false;
    var obstaculoDown = false;
    var obstaculoRight = false;
    var diffX = this.hero_x - this.x;
    var diffY = this.hero_y - this.y;

    for (var i =0; i<map.coords.length; i++) {
      // LEFT
      if(map.coords[i].x===Math.floor((this.x-(0.1*this.width))/(this.cw/n)) && map.coords[i].y===Math.floor((this.y+(0*this.height))/(this.ch/n))) {
        obstaculoLeft = true;
        break;
      } else if(map.coords[i].y===Math.floor((this.y-(0.1*this.height))/(this.ch/n)) && map.coords[i].x===Math.floor((this.x+(0*this.width))/(this.cw/n))) {
        obstaculoUp = true;
        break;
      } else if(map.coords[i].x===Math.floor((this.x+(0.9*this.width))/(this.cw/n)) && map.coords[i].y===Math.floor((this.y+(0*this.height))/(this.ch/n))) {
        obstaculoRight = true;
        break;
      } else if(map.coords[i].y===Math.floor((this.y+(0.9*this.height))/(this.ch/n)) && map.coords[i].x===Math.floor((this.x+(0*this.width))/(this.cw/n))) {
        obstaculoDown = true;
        break;
      }
    }
    if(!obstaculoRight && !obstaculoDown && !obstaculoLeft && !obstaculoUp) {
      if(diffX > 0)
        this.x += this.movSpeed;
      else if(diffX < 0)
        this.x -= this.movSpeed;
      if(diffY > 0)
        this.y += this.movSpeed;
      else if(diffY < 0)
        this.y -= this.movSpeed;
    }
  }

  onDeath() {
    this.toRemove = true;
  }
}

// timeSpawn -> tempo em segundos que da spawn um zombie
Enemy.update = function(ctx, cw, ch, hero, movSpeed, timeSpawn, map) {
  if(frames % (25*timeSpawn) == 0)
    this.randomGenerate(ctx, cw, ch, movSpeed);
  for(var key in Enemy.list){
    //console.log("update???");
    Enemy.list[key].draw(ctx);
		Enemy.list[key].update(ctx, hero, map);
	}
	for(var key in Enemy.list){
		if(Enemy.list[key].toRemove) {
      delete Enemy.list[key];
      playSound("zombieDeath", 3);
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
    //playSound("zombieAppear", 3);
    //en.draw(ctx);
    console.log("A gerar novo Zombie em ("+x+","+y+")");
  }
