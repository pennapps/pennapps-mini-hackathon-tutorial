import $ from 'jquery';

require("script!../lib/Box2dWeb-2.1.a.3.min.js");
require("script!../lib/boxbox.min.js");

import { birdConfig } from './Bird.js';
import { getDist, getDegrees } from './helpers.js';
import { block } from './Block.js';
import { pig } from './Pig.js';

var ORIGINX;
var ORIGINY;
var XCOOR;
var YCOOR;

$(document).ready( () => {

  var canvasElem = document.getElementById("game");
  var ctx = canvasElem.getContext('2d');
  var world = boxbox.createWorld(canvasElem, {
    collisionOutlines: false,
    scale: 45,
  });

  var bird = world.createEntity(birdConfig, {
    x: 2,
    $hit : false,
    onKeyDown: function(e) {
      var key = e.key;
      if (this.$hit === false) {
        this.$hit = true;
        world.createEntity(birdConfig, {
          x: this.position().x + 1,
          y: this.position().y + 1
        }).applyImpulse(200, 60);
        world.createEntity(birdConfig, {
          x: this.position().x  -1,
          y: this.position().y - 1
        }).applyImpulse(200, 60);
        this.friction(0.1);
      }
    },
    onRender: function(ctx) {
      ctx.font = "20pt Arial";
      ctx.fillText("Score: " + this._ops.score, 20, 20);
    },
  });
  
  world.createEntity({
    name: "ground",
    shape: "square",
    type: "static",
    color: "rgb(0,100,0)",
    width: 22,
    height: 0.5,
    y: 12
  });

  
  block.onImpact = function blockBird(entity, force) {
    if (entity.name() === "bird") {
      bird._ops.score++;
      this.color("black");
    }
    if (force > 100 && entity.name() !== "aground") {
      this.destroy();
    }
  }
  pig.onImpact = function(entity, force) {
    if (force > 75 && entity.name() !== "ground") {
      this.destroy();
    }
  }
  world.createEntity(block, {
    x: 13,
  });

  world.createEntity(block, {
    x: 19,
  });

  world.createEntity(block, {
    x: 16,
    y: 7,
    width: 7,
    height: 0.5,
  });

  world.createEntity(block, {
    x: 14,
    y: 6,
    height: 3,
  });

  world.createEntity(block, {
    x: 18,
    y: 6,
    height: 3,
  });

  world.createEntity(block, {
    x: 16,
    y: 4,
    width: 5,
    height: 0.5,
  });

  world.createEntity(pig);
  
  world.createEntity(pig, {
    y: 6.3,
  });

  world.createEntity({
    x: 20.75,
    y: 0,
    type: "static",
    height: 23.5,
    name: "block",
    shape: "square",
    color: "black",
    borderColor: "black",
    width: 0.1
  });

});

