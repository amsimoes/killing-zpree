"use strict";

(function() {
    window.addEventListener("load", main);
}());

const n = 25;

function main() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  initCanvas(canvas);

  var c_width = canvas.width;
  var c_height = canvas.height;
  console.log(c_width);
  console.log(c_height);

  menu(canvas, c_width, c_height);
}

function initCanvas(canvas) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var n = getConstN();
  var size;
  if (width < height) {
    size = width - (width % n) - n;
    canvas.width = size;
    canvas.height = size;
  } else {
    size = height - (height % n) - n;
    canvas.width = size;
    canvas.height = size;
  }

  var main = document.getElementById("container");
  main.style.left = ((width*0.5) - (size/2)).toString() + "px";

  canvas.style.visibility = "visible";
}

function menu(canvas, cw, ch) {
  enableLogo(cw, ch, canvas.offsetLeft);

  var start_button = document.getElementById("start");
  var ranking_button = document.getElementById("ranking");
  var help_button = document.getElementById("help");
  var credits_button = document.getElementById("credits");

  enableButton(start_button, canvas.offsetLeft+(cw/2.5), canvas.offsetTop+(ch/2));
  enableButton(ranking_button, canvas.offsetLeft+(cw/3.1), canvas.offsetTop+(ch/2)+(ch/getConstN()*2.5));
  enableButton(help_button, canvas.offsetLeft+(cw/2.3), canvas.offsetTop+(ch/2)+(ch/getConstN()*5));
  enableButton(credits_button, canvas.offsetLeft+(cw/2.6), canvas.offsetTop+(ch/2)+(ch/getConstN()*7.5));

  var ev_start = function(event) {
    disableButton(start_button);
    disableButton(ranking_button);
    disableButton(help_button);
    disableButton(credits_button);
    start_button.removeEventListener("click", ev_start);
    credits_button.removeEventListener("click", ev_credits);
    window.removeEventListener("resize", resize_menu);
    document.getElementById("options").style.visibility = "hidden";
    console.log("Start!!!!");
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
    initCanvas(canvas);
    menu(canvas, cw, ch);
  }
  start_button.addEventListener("click",  ev_start);
  credits_button.addEventListener("click", ev_credits);
  window.addEventListener("resize", resize_menu);
}

function initGame(canvas, cw, ch, level) {
  var ctx = canvas.getContext("2d");

  clearCanvas(canvas, cw, ch);

}

function clearCanvas(canvas, cw, ch) {
  canvas.clearRect(0, 0, cw, ch);
}

function enableLogo(cw, ch, canvas_offset) {
  var logo = document.getElementById("logo");
  logo.style.left = (canvas_offset+cw/3.6).toString()+"px";
  logo.style.top = (ch / getConstN() * 3).toString()+"px";
  logo.style.visibility = "visible";
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

function getConstN() {
  return n;
}
