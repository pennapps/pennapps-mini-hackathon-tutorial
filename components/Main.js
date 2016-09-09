import $ from 'jquery';

require("script!../lib/Box2dWeb-2.1.a.3.min.js");
require("script!../lib/boxbox.min.js");

import { birdConfig } from './Bird.js';
import { getDist, getDegrees } from './helpers.js';
import { block } from './Block.js';
import { pig } from './Pig.js';

$(document).ready( () => {

  let canvasElem = document.getElementById("game");
  let ctx = canvasElem.getContext('2d');

  // create boxbox world 45 px = 1 meter
  let world = boxbox.createWorld(canvasElem, {
    collisionOutlines: false,
    scale: 45,
  });

  // add ground as static element
  world.createEntity({
    name: "ground",
    shape: "square",
    type: "static",
    color: "rgb(0,100,0)",
    width: 50,
    height: 0.5,
    y: 12
  });

  /** BIRD CONSTRUCTION **/
  // see the Bird.js file. Need to specify OnKeyDown and OnRender in this scope
  let bird = world.createEntity(birdConfig, {
    x: 2,
    score: 0,
    $hit: false,
    onKeyDown: function(e) {
        this.$hit = true;
        this.applyImpulse(200,60);
        world.createEntity(birdConfig, {
          x: this.position().x + 1,
          y: this.position().y + 1
        }).applyImpulse(200, 60);
        world.createEntity(birdConfig, {
          x: this.position().x  -1,
          y: this.position().y - 1
        }).applyImpulse(200, 60);
        this.friction(0.1);
    },
    onRender: function(ctx) {
      ctx.font = "20pt Arial";
      ctx.fillText("Score: " + this._ops.score, 20, 20);
    },
  });
    
  /** BLOCK CONSTRUCTION **/

  block.onImpact = function(entity, force) {
    if (entity.name() === "bird") {
      bird._ops.score++;
      this.color("black");
    }
    if (force > 100 && entity.name() !== "aground") {
      this.destroy();
    }
  }
  var blockArr = 
    [ { x: 19},
      { x: 16, y: 7, width: 7, height: 0.5},
      { x: 14, y: 6, height: 3},
      { x: 18, y: 6, height: 3},
      { x: 16, y: 4, width: 5, height: 0.5},
      { x: 13, color: "grey", onImpact: function(entity, force) {
          if (entity.name() === "bird") {
            bird._ops.score++;
            this.color("white");
          }
          if (force > 75 && entity.name() !== "aground") {
            this.destroy();
          } 
        }
      } ];
  blockArr.map( (el) => {
    world.createEntity(block, el);
  })
  
  /** PIG CONSTRUCTION **/

  pig.onImpact = function(entity, force) {
    if (force > 75 && entity.name() !== "ground") {
      this.destroy();
    }
  }
  var pigArr = [{}, { y: 6.3 }]
  pigArr.map( (el) => { 
    world.createEntity( pig, el );
  });

});

