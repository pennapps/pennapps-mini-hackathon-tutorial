import $ from 'jquery';

require("script!lib/Box2dWeb-2.1.a.3.min.js");
require("script!lib/boxbox.min.js");

import { createBird, birdConfig } from 'components/sprites/Bird.js';
import { getDist, getDegrees } from 'components/helpers.js';
import { block } from 'components/sprites/Block.js';
import { pig } from 'components/sprites/Pig.js';

$(document).ready( () => {

  let canvasElem = document.getElementById("game");
  let ctx = canvasElem.getContext('2d');

  // create boxbox world 45 px = 1 meter
  let world = boxbox.createWorld(canvasElem, {
    collisionOutlines: false,
    scale: 15,
    $score: 0,
    onRender: function (ctx) {
    }
  });
  // add to global object

  window.world = world;
  // add ground as static element
  window.world.createEntity({
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
  let bird = createBird.bind(window)();  
  /** BLOCK CONSTRUCTION **/

  block.onImpact = function(entity, force) {
    if (entity.name() === "bird") {
      window.world._ops.$score++;
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
            window.world._ops.$score++;
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

