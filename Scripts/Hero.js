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
    console.log("Hero created.");
  }

  update(ctx) {
    super.update(ctx);
    if(this.pressingRight || this.pressingLeft || this.pressingUp || this.pressingDown)
      this.spriteAnimCounter += 0.2;
    if(this.pressingMouseLeft)
      this.performAttack();
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
    if(this.x > this.cw - this.width/2)
      this.x = this.cw - this.width/2;
    if(this.y < this.height/2)
      this.y = this.height/2;
    if(this.y > this.ch - this.height/2)
      this.y = this.ch - this.height/2;
  }

  onDeath() {
    var timeSurvived = Date.now() - timeStarted;
    console.log("DEAD. GAME OVER.");
    console.log("You survived for " + (timeSurvived/1000)/60 + "minutes.");
    enableGameOver();
  }


}
