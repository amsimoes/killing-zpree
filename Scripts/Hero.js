"use strict";

class Hero extends Element {
  constructor(img, x, y, width, height, cw, ch) {
    super(img, x, y, width, height);
    this.cw = cw;
    this.ch = ch;
    this.pressingUp = false;
    this.pressingDown = false;
    this.pressingLeft = false;
    this.pressingRight = false;
    this.pressingMouseLeft = false;
    this.aimAngle = 0;
    console.log("Hero created.");
    console.log(cw);
    console.log(ch);
  }

  update(ctx, bullet) {
    super.update(ctx);
    this.updatePosition();
    if(this.pressingRight || this.pressingLeft || this.pressingUp || this.pressingDown)
      this.spriteAnimCounter += 0.2;
    if(this.pressingMouseLeft)
      this.attack();
  }

  updatePosition() {
    if(this.pressingRight)
      this.x += 5;
    if(this.pressingLeft)
      this.x -= 5;
    if(this.pressingDown)
      this.y += 5;
    if(this.pressingUp)
      this.y -= 5;

    // Verificar se a posicao é valida (Dentro dos limites)
    if(this.x < this.width/2)
      this.x = this.width/2;
    if(this.x > this.cw - 1.5*this.width)
      this.x = this.cw - 1.5*this.width;
    if(this.y < this.height/2)
      this.y = this.height/2;
    if(this.y > this.ch - 1.75*this.height)
      this.y = this.ch - 1.75*this.height;
  }

  attack() {
    Bullet.generate(this, this.cw, this.ch);
  }

  onDeath() {
    var timeSurvived = Date.now() - timeStarted;
    console.log("DEAD. GAME OVER.");
    console.log("You survived for " + (timeSurvived/1000)/60 + "minutes.");
    enableGameOver();
  }
}
