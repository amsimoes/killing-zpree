"use strict";

(function() {
    window.addEventListener("load", main);
}());

function main() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var c_width = canvas.width;
  var c_height = canvas.height;

  menu(canvas, ctx)
}

function menu(canvas, ctx) {
  var start_button = document.getElementById("start");
  var ranking_button = document.getElementById("ranking");
  var help_button = document.getElementById("help");
  var credits_button = document.getElementById("credits");
  showButton(start_button);
  /* disableButton(start_button); */
}

function showButton(button) {
  button.style.visibility = "visible";
  button.disabled = false;
}

function disableButton(button) {
  button.style.visibility = "hidden";
  button.disabled = true;
}
