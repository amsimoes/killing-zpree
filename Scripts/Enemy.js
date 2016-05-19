"use strict";

class Enemy extends Element {
  constructor(img, x, y, width, height, cw, ch, hero) {
    super(img, x, y, width, height);
    this.cw = cw;
    this.ch = ch;
    this.toRemove = false;
    Enemy.list[id_zombie] = this;
    id_zombie++;
    console.log("id = "+id_zombie);
  }

  update(ctx, hero_x, hero_y) {
    super.update(ctx);
    this.hero_x = hero_x;
    this.hero_y = hero_y;
    if(frames % 200 == 0 && id_zombie <= 10) // de 8 em 8 segundos
      this.randomGenerate(ctx);
  }

  draw(ctx) {
    super.draw(ctx);
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
  }

  // 4 Posicoes para os zombies nascerem: (0, ch/2) | (cw/2, 0) | (cw, ch/2) | (cw/2, ch)
  randomGenerate(ctx) {
    var x, y;
    var rand = Math.random();
    console.log("rand = "+rand);
    if(rand <= 0.25) {
      x = 0;
      y = this.ch/2;
    } else if(rand > 0.25 && rand <= 0.5) {
      x = this.cw/2;
      y = 0;
    } else if(rand > 0.5 && rand <= 0.75) {
      x = this.cw;
      y = this.ch/2;
    } else if(rand > 0.75 && rand <= 1.0) {
      x = this.cw/2;
      y = this.ch;
    }
    var en = new Enemy("zombie", x, y, 40, 40, this.cw, this.ch);
    en.draw(ctx);
    console.log("A gerar novo Zombie em ("+x+","+y+")");
  }

  onDeath() {
    this.toRemove = true;
  }
}
