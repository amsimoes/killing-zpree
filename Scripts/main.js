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

  enableButton(start_button, );
  enableButton(ranking_button);
  enableButton(help_button);
  enableButton(credits_button);

}

function enableLogo(cw, ch, canvas_offset) {
  var logo = document.getElementsById("logo");
  logo.style.width = (cw / getConstN() * 2).toString()+"px";
  logo.style.height = (ch / getConstN() * 2).toString()+"px";
  logo.style.left = (canvas_offset + (cw/2) - (cw/getConstN())).toString()+"px";
  logo.style.top = (ch / getConstN() * 2).toString()+"px";
}

function enableButton(button, x, y, w, h, font_size) {
  button.style.left = x.toString()+"px";
  button.style.right = y.toString()+"px";
  button.style.width = w.toString()+"px";
  button.style.height = h.toString()+"px";
  button.style.font_size = font_size.toString()+"px";
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
