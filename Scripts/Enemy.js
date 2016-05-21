"use strict";

class Enemy extends Element {
  constructor(img, x, y, width, height, cw, ch, hero) {
    super(img, x, y, width, height);
    this.img = document.getElementById(img);
    console.log("img="+this.img.width);
    this.cw = cw;
    this.ch = ch;
    this.x = x;
    this.y = y;
    this.toRemove = false;
    this.spriteCounter = 0;
    id_zombie++;
    Enemy.list[id_zombie] = this;
    console.log("id = "+id_zombie);
  }

  update(ctx, hero) {
    this.draw(ctx);
    super.update(ctx);
    this.hero_x = hero.x;
    this.hero_y = hero.y;
    //this.draw(ctx);
  }

  draw(ctx) {
    ctx.save();

    //console.log("[ENEMY] DRAW");
    if(zombieAnimCounter)
      ctx.drawImage(this.img, this.img.width/2, 0, this.img.width/2, this.img.height, this.x, this.y, 32, 32);
    else
      ctx.drawImage(this.img, 0, 0, this.img.width/2, this.img.height, this.x, this.y, 32, 32);
    //super.draw(ctx);

    ctx.restore();
  }

  updatePosition() {
    //var heroPos = hero.getPosition();
    var diffX = this.hero_x - this.x;
    var diffY = this.hero_y - this.y;

    if(diffX > 0)
      this.x += 0.5;
    else
      this.x -= 0.5;
    if(diffY > 0)
      this.y += 0.5;
    else
      this.y -= 0.5;
    this.spriteCounter++;
  }

  onDeath() {
    this.toRemove = true;
  }
}

Enemy.update = function(ctx, cw, ch, hero) {
  if(frames % 50 == 0) 
    this.randomGenerate(ctx, cw, ch);
  for(var key in Enemy.list){
    //console.log("update???");
		Enemy.list[key].update(ctx, hero);
	}
	for(var key in Enemy.list){
		if(Enemy.list[key].toRemove)
			delete Enemy.list[key];
	}
}

  // 4 Posicoes para os zombies nascerem: (0, ch/2) | (cw/2, 0) | (cw, ch/2) | (cw/2, ch)
Enemy.randomGenerate = function(ctx, cw, ch) {
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
    var en = new Enemy("zombie", x, y, 40, 40, cw, ch);
    //en.draw(ctx);
    console.log("A gerar novo Zombie em ("+x+","+y+")");
  }
