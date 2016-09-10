import $ from 'jquery';

require("script!lib/Box2dWeb-2.1.a.3.min.js");
require("script!lib/boxbox.min.js");

import { getDist, getDegrees } from 'components/helpers.js';

import { createBird, birdConfig } from 'components/sprites/Bird.js';
import { createGround, groundConfig } from 'components/sprites/Ground.js';
import { createBlock, blockConfig } from 'components/sprites/Block.js';
import { createPig, pigConfig } from 'components/sprites/Pig.js';

let anchorX, anchorY, mouseX, mouseY = null;

$(document).ready( () => {

  let canvasElem = document.getElementById("game");
  let ctx = canvasElem.getContext('2d');

  window.world = boxbox.createWorld(canvasElem, {
    collisionOutlines: false,
    $score: 0,
  })
  
  window.world.onRender(function (ctx) {
    ctx.font = "20pt Arial";
    ctx.fillText("Score: " + this._ops.$score, 20, 20);
    if ( anchorX && anchorY && mouseX && mouseY ) {
      ctx.beginPath();
      ctx.moveTo(anchorX, anchorY);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
  });

  $('#game').on('mousedown', function(e) {
    anchorX = e.offsetX;
    anchorY = e.offsetY;
    $(this).on('mousemove', function (move) {
      mouseX = move.offsetX;
      mouseY = move.offsetY;
    });
  }).on('mouseup', function(e) {
    $(this).unbind('mousemove');
    anchorX, anchorY, mouseX, mouseY = null;
  }).on('mouseout', function(e) {
    $(this).unbind('mousemove');
    anchorX, anchorY, mouseX, mouseY = null;
  });
  
  /** GROUND CONSTRUCTION **/
  let ground = createGround.bind(window)();

  /** BIRD CONSTRUCTION **/
  let bird = createBird.bind(window)('blue', 3, 6);  
  let block =  
  console.log(bird);
  /** BLOCK CONSTRUCTION **/
  let blockArr = 
    [ { x: 19, y: 7, width: 7, height: 0.5, type: 'glass' },
      { x: 16, y: 7, width: 7, height: 0.5, type: 'wood'  },
      { x: 14, y: 6, width: 3, height: 4  , type: 'stone' },
      { x: 18, y: 6, width: 1, height: 3  , type: 'glass' },
      { x: 3, y: 6, width: 0.5, height: 0.1  , type: 'stone', gravity: false },
      { x: 16, y: 4, width: 5, height: 0.5, type: 'wood'} ]

  blockArr.map( (el) => {
    createBlock.bind(window)(el.x, el.y, el.width, el.height, el.type, el.gravity);
  })
  /** PIG CONSTRUCTION **/
  let pigArr = 
    [ { x: 16.5, y: 11, radius: 1 }, 
      { x: 16.5, y: 6.3, radius: 2 } ]
  
  pigArr.map( (el) => { 
    createPig.bind(window)(el.x, el.y, el.radius);
  });
});

