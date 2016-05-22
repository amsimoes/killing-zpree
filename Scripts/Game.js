"use strict";

(function() {
    window.addEventListener("load", main);
}());

const n = 25;
var score = 0;
var timeStarted = 0;
var frames;
var id_zombie = 0;
var id_bullet = 0;
var zombieSpeed = 0.5;
var zombieLimit = 0;
var gameOver = false;
var mapAnimCounter = true;
var zombieAnimCounter = true;
var ricochete = false;
var zombieMovSpeed;
var zombieSpawn;
var mapLevel = 1;


function main() {
  var mapCanvas = document.getElementById("mapCanvas");
  var heroCanvas = document.getElementById("heroCanvas");
  var powerCanvas = document.getElementById("powerCanvas");
  var zombieCanvas = document.getElementById("zombieCanvas");

  /*Img.hero = new Image();
  Img.hero.src = "Sprites/hero.png";*/

  initCanvas(mapCanvas, heroCanvas, zombieCanvas, powerCanvas);

  var c_width = mapCanvas.width;
  var c_height = mapCanvas.height;
  console.log(c_width);
  console.log(c_height);

  menu(mapCanvas, heroCanvas, zombieCanvas, powerCanvas, c_width, c_height);
}

function initCanvas(mapCanvas, heroCanvas, zombieCanvas, powerCanvas) {
  console.log("A iniciar Canvas.");
  var width = window.innerWidth;
  var height = window.innerHeight;

  var n = getConstN();
  var size;
  if (width < height) {
    size = width - (width % n) - n;
    mapCanvas.width = size;
    mapCanvas.height = size;
    heroCanvas.width = size;
    heroCanvas.height = size;
    zombieCanvas.width = size;
    zombieCanvas.height = size;
    powerCanvas.width = size;
    powerCanvas.height = size;
  } else {
    size = height - (height % n) - n;
    mapCanvas.width = size;
    mapCanvas.height = size;
    heroCanvas.width = size;
    heroCanvas.height = size;
    zombieCanvas.width = size;
    zombieCanvas.height = size;
    powerCanvas.width = size;
    powerCanvas.height = size;
  }

  var main = document.getElementById("container");
  main.style.left = ((width*0.5) - (size/2)).toString() + "px";

  mapCanvas.style.visibility = "visible";
  heroCanvas.style.visibility = "visible";
  zombieCanvas.style.visibility = "visible";
  powerCanvas.style.visibility = "visible";
}

function menu(mapCanvas, heroCanvas, zombieCanvas, powerCanvas, cw, ch) {
  console.log("funcao menuuuu...");
  enableLogo(cw, ch, mapCanvas.offsetLeft);

  var logo = document.getElementById("logo");
  var start_button = document.getElementById("start");
  var ranking_button = document.getElementById("ranking");
  var help_button = document.getElementById("help");
  var credits_button = document.getElementById("credits");

  enableButton(start_button, mapCanvas.offsetLeft+(cw/2.5), mapCanvas.offsetTop+(ch/2));
  enableButton(ranking_button, mapCanvas.offsetLeft+(cw/3.1), mapCanvas.offsetTop+(ch/2)+(ch/getConstN()*2.5));
  enableButton(help_button, mapCanvas.offsetLeft+(cw/2.3), mapCanvas.offsetTop+(ch/2)+(ch/getConstN()*5));
  enableButton(credits_button, mapCanvas.offsetLeft+(cw/2.6), mapCanvas.offsetTop+(ch/2)+(ch/getConstN()*7.5));
  console.log("Botoes ativados...");

  var ev_start = function(event) {
    disableButton(start_button);
    disableButton(ranking_button);
    disableButton(help_button);
    disableButton(credits_button);
    disableImage(logo);
    start_button.removeEventListener("click", ev_start);
    credits_button.removeEventListener("click", ev_credits);
    window.removeEventListener("resize", resize_menu);
    document.getElementById("options").style.visibility = "hidden";
    console.log("Start!!!!");
    newGame(mapCanvas, heroCanvas, zombieCanvas, powerCanvas, cw, ch, 1);
  };
  var ev_credits = function(event) {
    disableButton(start_button);
    disableButton(ranking_button);
    disableButton(help_button);
    disableButton(credits_button);
    start_button.removeEventListener("click", ev_start);
    credits_button.removeEventListener("click", ev_credits);
    window.removeEventListener("resize", resize_menu);
    document.getElementById("options").style.visibility = "hidden";
    console.log("Credits!!!!");
  };
  var resize_menu = function(event) {
    start_button.removeEventListener("click", ev_start);
    credits_button.removeEventListener("click", ev_credits);
    window.removeEventListener("resize", resize_menu);
    initCanvas(mapCanvas, heroCanvas, zombieCanvas, powerCanvas);
    menu(mapCanvas, heroCanvas, zombieCanvas, powerCanvas, cw, ch);
  }
  start_button.addEventListener("click",  ev_start);
  credits_button.addEventListener("click", ev_credits);
  window.addEventListener("resize", resize_menu);
  console.log("A espera de algum evento...");
}

function newGame(mapCanvas, heroCanvas, zombieCanvas, powerCanvas, cw, ch, level) {
  var map_ctx = mapCanvas.getContext("2d");
  var hero_ctx = heroCanvas.getContext("2d");
  var zombie_ctx = zombieCanvas.getContext("2d");
  var power_ctx = powerCanvas.getContext("2d");
  clearCanvas(map_ctx, hero_ctx, zombie_ctx, power_ctx, cw, ch);

  var timerID = 0;
  var paused = false;
  zombieMovSpeed = 1.5;
  zombieSpawn = 2;  // De 2 em 2 segundos faz spawn um zombie

  frames = 0;
  score = 0;
  timeStarted = Date.now();
  gameOver = false;

  Enemy.list = {};
  Bullet.list = {};


  var update = function() {
    if(paused) {
      console.log("Jogo em pausa.");
      map_ctx.font = "50px Arial";
      map_ctx.fillText("Paused", cw/2, ch/2);
      return;
    }
    if(gameOver) {
      //clearInterval(timerID);
      enableGameOverText(cw, ch, score);
      map_ctx.fillText("Game Over", cw/2, ch/2);
      return;
    }


    frames++;
    if(frames % 50 == 0)
      mapAnimCounter = !mapAnimCounter;
    if(frames % 8 == 0)
      zombieAnimCounter = !zombieAnimCounter;

    //map_ctx.clearRect(0, 0, cw, ch);
    map.levelSelect(map_ctx, score);


    hero.update(map_ctx, 4, map);
    Enemy.update(map_ctx, cw, ch, hero, zombieMovSpeed, zombieSpawn, map);
    Bullet.update(map_ctx);
  }

  var hero = new Hero("hero", cw/2, cw/2, 32, 32, cw, ch);
  Enemy.randomGenerate(map_ctx, cw, ch, zombieMovSpeed);
  Enemy.randomGenerate(map_ctx, cw, ch, zombieMovSpeed);
  Enemy.randomGenerate(map_ctx, cw, ch, zombieMovSpeed);

  hero.draw(map_ctx);

  // Desenhar Mapa
  var map = new Map(cw, ch);
  map.levelSelect(map_ctx, score);  // Começa no nivel 1
  console.log("Mapa desenhado.");

  // EventListener para keyDown
  var keyDownHandler = function (e) { // W A S D e PAUSE
    //console.log("Handler keyDown");
    if(e.keyCode === 80) {
      console.log("TECLA PAUSE");
      paused =! paused;
      if(paused)
        console.log("PAUSE = TRUE");
      else
        console.log("PAUSE = FALSE");
    }

    if(e.keyCode === 87) // W
      hero.pressingUp = true;
    if(e.keyCode === 65)  // A
      hero.pressingLeft = true;
    if(e.keyCode === 83)  // S
      hero.pressingDown = true;
    if(e.keyCode === 68)  // D
      hero.pressingRight = true;
    if(e.keyCode === 27) {  // ESC
      console.log("ESC - A voltar ao menu...");
      clearCanvas(map_ctx, hero_ctx, zombie_ctx, power_ctx, cw, ch);
      clearInterval(timerID);
      //menu(mapCanvas, heroCanvas, zombieCanvas, powerCanvas, cw, ch);
      main();
    }
    if(e.keyCode === 32 && gameOver) {
      console.log("GAMEOVER - A voltar ao menu.");
      clearInterval(timerID);
      clearCanvas(map_ctx, hero_ctx, zombie_ctx, power_ctx, cw, ch);
      main();
    }

    if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
      hero.shooting = true;
      e.preventDefault();
    }
    if(e.keyCode === 37 && e.keyCode !== 40)  // LEFT ARROW
      hero.aimAngle = 180;
    if(e.keyCode === 38 && e.keyCode !== 37) // UP ARROW
      hero.aimAngle = 270;
    if(e.keyCode === 39)
      hero.aimAngle = 0;
    if(e.keyCode === 40)
      hero.aimAngle = 90;
    if(e.keyCode === 39 && e.keyCode === 40)
      hero.aimAngle = 315;
    if(e.keyCode === 37 && e.keyCode === 40)
      hero.aimAngle = 225;
    if(e.keyCode === 37 && e.keyCode === 38)
      hero.aimAngle = 135;
  }
  document.addEventListener("keydown", keyDownHandler);

  // EventListener para keyUp
  var keyUpHandler = function (e) { // W A S D e PAUSE
    //console.log("Handler keyUp");
    if(e.keyCode === 87) // W
      hero.pressingUp = false;
    if(e.keyCode === 65)  // A
      hero.pressingLeft = false;
    if(e.keyCode === 83)  // S
      hero.pressingDown = false;
    if(e.keyCode === 68)  // D
      hero.pressingRight = false;
    if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40)
      hero.shooting = false;
  }
  document.addEventListener("keyup", keyUpHandler);

  var mouseDownHandler = function (mouse) {
    //console.log("Mouse down.");
    if(mouse.which === 1)
      hero.pressingMouseLeft = true;
  }
  document.addEventListener("mousedown", mouseDownHandler);

  var mouseUpHandler = function (mouse) {
    if(mouse.which === 1)
      hero.pressingMouseLeft = false;
  }
  document.addEventListener("mouseup", mouseUpHandler);

  var mouseMoveHandler = function (mouse) {
    //console.log("Mouse move!");
    var mouseX = mouse.clientX - document.getElementById("mapCanvas").getBoundingClientRect().left;
    var mouseY = mouse.clientY - document.getElementById("mapCanvas").getBoundingClientRect().top;
    // ?
    mouseX -= cw/2;
    mouseY -= ch/2;

    hero.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI*180;
  }
  //document.addEventListener("mousemove", mouseMoveHandler, false);

  // EventListener para dar resize
  var resize_game = function (e) {
    initCanvas(mapCanvas, heroCanvas, zombieCanvas, powerCanvas)
    cw = mapCanvas.width;
    ch = mapCanvas.height;
    map.cw = cw;
    map.ch = ch;
    map.width = cw / n;
    map.height = ch / n;
    map.draw(map_ctx, cw, ch);
  }
  window.addEventListener("resize", resize_game);

  timerID = setInterval(update, 40);
}

function clearCanvas(map_ctx, hero_ctx, zombie_ctx, power_ctx, cw, ch) {
  map_ctx.clearRect(0, 0, cw, ch);
  hero_ctx.clearRect(0, 0, cw, ch);
  zombie_ctx.clearRect(0, 0, cw, ch);
  power_ctx.clearRect(0, 0, cw, ch);
}

function enableLogo(cw, ch, canvas_offset) {
  var logo = document.getElementById("logo");
  logo.style.left = (canvas_offset+cw/3.6).toString()+"px";
  logo.style.top = (ch / getConstN() * 3).toString()+"px";
  logo.style.visibility = "visible";
}

function enableGameOverText(cw, ch, score) {
  var text = document.getElementById("gameover");
  var text_score = document.getElementById("score");
  text_score.innerHTML = score;
  text.style.left = (cw/2).toString() + "px";
  text.style.top = (ch/2).toString() + "px";
  text.style.width = "20px";
  text.style.fontSize = "15px";
  text.style.visibility = "visible";
}

function playSound(id, speed) {
    var audio = document.getElementById(id);
    audio.currentTime = 0;
    audio.playbackRate = speed;
    audio.play();
}

function enableButton(button, x, y) {
  button.style.left = x.toString()+"px";
  button.style.top = y.toString()+"px";
  button.style.visibility = "visible";
  button.disabled = false;
}

function disableButton(button) {
  button.style.visibility = "hidden";
  button.disabled = true;
}

function disableImage(img) {
  img.style.visibility = "hidden";
}

function playSound(id, speed) {
    var audio = document.getElementById(id);
    audio.currentTime = 0;
    audio.playbackRate = speed;
    audio.play();
}

function getConstN() {
  return n;
}
