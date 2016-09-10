import $ from 'jquery';

require("script!lib/Box2dWeb-2.1.a.3.min.js");
require("script!lib/boxbox.min.js");

import { getDist, getDegrees } from 'components/helpers.js';

import { createBird, birdConfig } from 'components/sprites/Bird.js';
import { createGround, groundConfig } from 'components/sprites/Ground.js';
import { createBlock, blockConfig } from 'components/sprites/Block.js';
import { createPig, pigConfig } from 'components/sprites/Pig.js';

let anchorX, anchorY, mouseX, mouseY = 0;
const PLATFORM_X = 3;
const PLATFORM_Y = 6;
const SCALE = 45;
$(document).ready( () => {

  let canvasElem = document.getElementById("game");
  let ctx = canvasElem.getContext('2d');
  canvasElem.width = window.innerWidth;
  canvasElem.height = window.innerHeight;
  /** WORLD SETUP **/

  window.world = boxbox.createWorld(canvasElem, {
    collisionOutlines: false,
    $score: 0,
    scale: SCALE
  })
  
  window.world.onRender(function (ctx) {
    ctx.font = "20pt Arial";
    ctx.fillText("Score: " + this._ops.$score, 20, 20);
    if ( anchorX && anchorY && mouseX && mouseY ) {
      ctx.beginPath();
      ctx.moveTo(PLATFORM_X * SCALE, ( -bird._ops.radius + PLATFORM_Y ) * SCALE);
      console.log(bird);
      ctx.lineTo(PLATFORM_X * SCALE + (anchorX - mouseX), PLATFORM_Y * SCALE + (anchorY - mouseY));
      ctx.stroke();
    }
  });

  window.world.onTick( function() {
    let foundEls = window.world.find(1, 2, 5, 8);
    let found = false;
    for (var i = 0; i < foundEls.length; i++) {
      if (foundEls[i]._name === 'bird') {
        found = true;
      } else {
      }
    }
    if (found === false && birdArr.length > 0) {
      birdObj = birdArr.pop();
      bird = createBird.bind(window)(birdObj.type, birdObj.x, birdObj.y,birdObj.canSplit);  
    }
  });

  /** CLICK LISTENER SETUP **/

  $('#game').on('mousedown', function(e) {
    anchorX = e.offsetX;
    anchorY = e.offsetY;
    $(this).on('mousemove', function (move) {
      mouseX = move.offsetX;
      mouseY = move.offsetY;
    });
  }).on('mouseup', function(e) {
    $(this).unbind('mousemove');
    var dist = getDist(anchorX, anchorY, mouseX, mouseY);
    var degrees = getDegrees(anchorX, anchorY, mouseX, mouseY);
    if (!bird.$hasShot) {
      bird.applyImpulse(dist * 0.25, degrees);
      bird.$hasShot = true;
    }
    anchorX, anchorY, mouseX, mouseY = null;
  }).on('mouseout', function(e) {
    $(this).unbind('mousemove');
    anchorX, anchorY, mouseX, mouseY = null;
  });
  
  /** BIRD CONSTRUCTION **/
  let birdArr = 
    [ { type: 'blue', x: PLATFORM_X, y: PLATFORM_Y, canSplit:true  },
      { type: 'red',  x: PLATFORM_X, y: PLATFORM_Y, canSplit:false},
      { type: 'blue', x: PLATFORM_X, y: PLATFORM_Y, canSplit:true } ]
  let birdObj = birdArr.pop();
  let bird = createBird.bind(window)(birdObj.type, birdObj.x, birdObj.y, birdObj.canSplit);  
  
  /** GROUND AND PLATFORM CONSTRUCTION **/
  let ground = createGround.bind(window)();
  let platform = createBlock.bind(window)(PLATFORM_X, PLATFORM_Y, 1, 0.3, 'stone', false);
  /** BLOCK CONSTRUCTION **/
  let blockArr = 
    [ { x: 19, y: 11, width: 2, height: 1, type: 'stone' },
      { x: 17, y: 11, width: 2, height: 1, type: 'stone' },
      { x: 13, y: 11, width: 2, height: 1, type: 'stone' },
      { x: 11, y: 11, width: 2, height: 1, type: 'stone' },
      { x: 15, y: 10, width: 4, height: 0.5, type: 'wood' },
      { x: 12, y: 10, width: 2, height: 1, type: 'wood' },
      { x: 18, y: 10, width: 2, height: 1, type: 'wood' },
      { x: 19, y: 10, width: 1, height: 1, type: 'wood' },
      { x: 11, y: 10, width: 1, height: 1, type: 'wood' },
      { x: 11, y: 9, width: 2, height: 1, type: 'wood' },
      { x: 19, y: 9, width: 2, height: 1, type: 'wood' },
      { x: 12, y: 9, width: 1, height: 1, type: 'wood' },
      { x: 18, y: 9, width: 1, height: 1, type: 'wood' },
      { x: 18, y: 5, width: .5, height: 3, type: 'wood' },
      { x: 19, y: 5, width: .5, height: 3, type: 'stone' },
      { x: 11, y: 5, width: .5, height: 3, type: 'stone' },
      { x: 12, y: 5, width: .5, height: 3, type: 'wood' },
      { x: 11.5, y: 3, width: 4, height: 0.5, type: 'wood' },
      { x: 18.5, y: 3, width: 4, height: 0.5, type: 'wood' },
      { x: 17.5, y: 2, width: 0.5, height: 0.5, type: 'glass' },
      { x: 19.5, y: 2, width: 0.5, height: 0.5, type: 'glass' },
      { x: 10.5, y: 2, width: 0.5, height: 0.5, type: 'glass' },
      { x: 12.5, y: 2, width: 0.5, height: 0.5, type: 'glass' },
    ]
  blockArr.map( (el) => {
    createBlock.bind(window)(el.x, el.y, el.width, el.height, el.type, el.gravity);
  })
  //* PIG CONSTRUCTION *//
  let pigArr = 
    [ { x: 15, y: 8, radius: 1 },
     { x: 11.5, y: 1.5, radius: 0.5 },
     { x: 18.5, y: 1.5, radius: 0.5 },
    ] 
  pigArr.map( (el) => { 
    createPig.bind(window)(el.x, el.y, el.radius);
  });
});

