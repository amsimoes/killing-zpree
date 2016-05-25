"use strict";

const n = 25;
var score = 0;
var timeStarted = 0;
var frames;
var id_zombie = 0;
var id_bullet = 0;
var zombieLimit = 0;
var gameOver = false;
var mapAnimCounter = true;
var zombieAnimCounter = true;
var ricochete = false;
var zombieMovSpeed;
var zombieSpawn;
var mapLevel = 1;
var changeLevel = false;

(function() {
    window.addEventListener("load", main);
}());

function main() {
  var mapCanvas = document.getElementById("mapCanvas");

  initCanvas(mapCanvas);

  var c_width = mapCanvas.width;
  var c_height = mapCanvas.height;
  console.log(c_width);
  console.log(c_height);

  menu(mapCanvas, c_width, c_height);
}

function initCanvas(mapCanvas) {
  console.log("A iniciar Canvas.");
  var width = window.innerWidth;
  var height = window.innerHeight;

  var x = getConstN();
  var size;
  if (width < height) {
    size = width - (width % x) - x;
    mapCanvas.width = size;
    mapCanvas.height = size;
  } else {
    size = height - (height % x) - x;
    mapCanvas.width = size;
    mapCanvas.height = size;
  }

  var main = document.getElementById("main");
  main.style.left = ((width*0.5) - (size/2)).toString() + "px";

  mapCanvas.style.visibility = "visible";
}

function menu(mapCanvas, cw, ch) {
  enableLogo(cw, ch, mapCanvas.offsetLeft);

  var logo = document.getElementById("logo");
  var start_button = document.getElementById("start");
  var start_img = document.getElementById("start_img");

  enableButton(start_button, start_img, cw, ch, mapCanvas.offsetLeft);

  var ev_start = function(event) {
    disableButton(start_button, start_img);
    disableImage(logo);
    start_button.removeEventListener("click", ev_start);
    window.removeEventListener("resize", resize_menu);
    document.getElementById("options").style.visibility = "hidden";
    newGame(mapCanvas, cw, ch, 1);
  };
  var resize_menu = function(event) {
    start_button.removeEventListener("click", ev_start);
    window.removeEventListener("resize", resize_menu);
    initCanvas(mapCanvas);
    menu(mapCanvas, mapCanvas.width, mapCanvas.height);
  }
  start_button.addEventListener("click",  ev_start);
  window.addEventListener("resize", resize_menu);
  console.log("A espera de algum evento...");
}

function newGame(mapCanvas, cw, ch, level) {
  var map_ctx = mapCanvas.getContext("2d");
  clearCanvas(map_ctx, cw, ch);

  var timerID = 0;
  var paused = false;
  zombieMovSpeed = 1.5;
  zombieSpawn = 2;  // De 2 em 2 segundos faz spawn um zombie
  frames = 0;
  score = 0;
  timeStarted = Date.now();
  gameOver = false;
  id_zombie = 0;
  Enemy.list = {};
  Bullet.list = {};

  var update = function() {
    if(gameOver) {
      //clearInterval(timerID);
      //enableGameOverText(cw, ch, score);
      map_ctx.clearRect(0, 0, cw, ch);
      paused = false;
      map_ctx.font = "bold 20px Tahoma, sans-serif";
      map_ctx.textAlign = "center";
      map_ctx.fillStyle = "#ff0000";
      map_ctx.fillText("Game Over", cw/2, ch/2);
      map_ctx.font = "15px Tahoma";
      map_ctx.fillStyle = "#bbbbbb";
      map_ctx.textAlign = "center";
      map_ctx.fillText("Prima [Espaço] para voltar ao menu.", cw/2+20, ch/2+20);
      console.log("PQ CARALHO????");
      return;
    }
    if(paused) {
      console.log("Jogo em pausa.");
      map_ctx.font = "bold 20px Tahoma, sans-serif";
      map_ctx.textAlign = "center";
      map_ctx.fillStyle = "#ff0000";
      map_ctx.fillText("Paused", cw/2, ch/2);
      return;
    }
    if(changeLevel) {
      playSound("next_level", 1);
      changeLevel = false;
    }

    frames++;
    if(frames % 50 == 0)
      mapAnimCounter = !mapAnimCounter;
    if(frames % 8 == 0)
      zombieAnimCounter = !zombieAnimCounter;

    map.levelSelect(map_ctx, score);
    Enemy.update(map_ctx, cw, ch, hero, zombieMovSpeed, zombieSpawn, map);
    hero.update(map_ctx, 8, map);
    Bullet.update(map_ctx, map);
  }

  var hero = new Hero("hero", cw/2, cw/2, 32, 32, cw, ch);
  Enemy.randomGenerate(map_ctx, cw, ch, zombieMovSpeed);
  Enemy.randomGenerate(map_ctx, cw, ch, zombieMovSpeed);
  Enemy.randomGenerate(map_ctx, cw, ch, zombieMovSpeed);

  hero.draw(map_ctx);
  playSound("play_game", 1);

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
      clearCanvas(map_ctx, cw, ch);
      clearInterval(timerID);
      //menu(mapCanvas, heroCanvas, zombieCanvas, powerCanvas, cw, ch);
      main();
    }
    if(e.keyCode === 32 && gameOver) {
      console.log("GAMEOVER - A voltar ao menu.");
      clearInterval(timerID);
      clearCanvas(map_ctx, cw, ch);
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

function getSeconds(time) { // 25 frames -> 1 segundo

}

function clearCanvas(map_ctx, cw, ch) {
  map_ctx.clearRect(0, 0, cw, ch);
}

function enableLogo(cw, ch, canvas_offset) {
  var logo = document.getElementById("logo");
  logo.style.width = (12*cw/n).toString()+"px";
  logo.style.height = (5.5*ch/n).toString()+"px";
  logo.style.left = (canvas_offset+(cw/2)-(cw/n*5.5)).toString()+"px";
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

function enableButton(button, img, cw, ch, canvas_offset) {
  img.style.width = (5.5*cw/n).toString()+"px";
  img.style.height = (ch/n*1.5).toString()+"px";
  img.style.visibility = "visible";
  button.style.width = (6*cw/n).toString()+"px";
  button.style.height = (ch/n*2).toString()+"px";
  button.style.left = (canvas_offset+(cw/2)-(cw/n*2.5)).toString()+"px";
  button.style.top = (ch / getConstN() * 14).toString()+"px";
  button.style.visibility = "visible";
  button.disabled = false;
}

function disableButton(button, img) {
  button.style.visibility = "hidden";
  button.disabled = true;
  img.style.visibility = "hidden";
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
