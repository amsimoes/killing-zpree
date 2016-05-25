"use strict";

class Hero extends Element {
  constructor(img, x, y, width, height, cw, ch) {
    super(img, x, y, width, height);
    this.img = document.getElementById(img);
    this.cw = cw;
    this.ch = ch;
    this.pressingUp = false;
    this.pressingDown = false;
    this.pressingLeft = false;
    this.pressingRight = false;
    this.shooting = false;
    this.atkCounter = 0;
    this.aimAngle = 0;
    this.movSpeed = 5;
    console.log("Hero created.");
    console.log(cw);
    console.log(ch);
  }

  update(ctx, attackSpeed, map) {
    this.draw(ctx);
    super.update(ctx, map);
    this.atkCounter++;
    if(this.shooting)
      this.attack(attackSpeed);
    for(let key in Enemy.list) {
      if(this.checkCollision(Enemy.list[key]))
        this.onDeath(ctx);
    }
  }

  draw(ctx) {
    ctx.save();

    //console.log("[HERO] DRAW");

    if(this.pressingUp === false && this.pressingRight === false && this.pressingLeft === false && this.pressingRight === false) {
      //ctx.drawImage("hero_idle", this.x, this.y, 32, 32);
      ctx.drawImage(this.img, this.img.width/2, 0, this.img.width/4, this.img.height, this.x, this.y, this.img.width/4, this.img.height);
    }

    if(this.aimAngle === 270 || this.pressingUp) // CIMA
      ctx.drawImage(this.img, 0, 0, this.img.width/4, this.img.height, this.x, this.y, this.img.width/4, this.img.height);
    else if(this.aimAngle === 0 || this.pressingRight) // DIREITA
      ctx.drawImage(this.img, this.img.width/4, 0, this.img.width/4, this.img.height, this.x, this.y, this.img.width/4, this.img.height);
    else if(this.aimAngle === 90 || this.pressingDown) // BAIXO
      ctx.drawImage(this.img, this.img.width/2, 0, this.img.width/4, this.img.height, this.x, this.y, this.img.width/4, this.img.height);
    else if(this.aimAngle === 180 || this.pressingLeft) // ESQUERDA
      ctx.drawImage(this.img, this.img.width/4*3, 0, this.img.width/4, this.img.height, this.x, this.y, this.img.width/4, this.img.height);
    //TODO putImageData <- mais eficaz
    //console.log("img: " + this.img + " x: " + this.x + " y:" + this.y + " w: " + this.width + " h:" + this.height);

    ctx.restore();
  }

  updatePosition(map) {
    for (var i =0; i<map.coords.length; i++) {
      if(map.coords[i].x===Math.floor((this.x-(0.1*this.width))/(this.cw/n)) && map.coords[i].y===Math.floor((this.y+(0*this.height))/(this.ch/n)))
        this.pressingLeft=false;
      if(map.coords[i].y===Math.floor((this.y-(0.1*this.height))/(this.ch/n)) && map.coords[i].x===Math.floor((this.x+(0*this.width))/(this.cw/n)))
        this.pressingUp=false;
      if(map.coords[i].x===Math.floor((this.x+(0.9*this.width))/(this.cw/n)) && map.coords[i].y===Math.floor((this.y+(0*this.height))/(this.ch/n)))
        this.pressingRight=false;
      if(map.coords[i].y===Math.floor((this.y+(0.9*this.height))/(this.ch/n)) && map.coords[i].x===Math.floor((this.x+(0*this.width))/(this.cw/n)))
        this.pressingDown=false;
    }

    if(this.pressingRight)
      this.x += this.movSpeed;
    if(this.pressingLeft)
      this.x -= this.movSpeed;
    if(this.pressingDown)
      this.y += this.movSpeed;
    if(this.pressingUp)
      this.y -= this.movSpeed;

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

  // ATTACK SPEED
  attack(attackSpeed) {
    if(this.atkCounter >= attackSpeed) {
      this.atkCounter = 0;
      Bullet.generate(this, this.cw, this.ch);
    }
  }

  onDeath(ctx) {
    var timeSurvived = Date.now() - timeStarted;
    console.log("DEAD. GAME OVER.");
    console.log("You survived for " + (timeSurvived/1000)/60 + "minutes.");
    gameOver = true;
    playSound("game_over", 3);
  }
}
