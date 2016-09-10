require("script!lib/Box2dWeb-2.1.a.3.min.js");
require("script!lib/boxbox.min.js");

import { timerHelper } from 'components/helpers.js';

const BLOCKTYPES = {
  'glass': 10,
  'wood' : 25,
  'stone' : 1000
}

let blockConfig = {
  name: "block",
  shape: "square",
  color: "brown",
};

let createBlock = (x, y, width, height, type, gravity = true) => {
  if (!window.world) {
    console.log("BINDING ERROR: NO WORLD ATTRIBUTE IN WINDOW");
  } else {
    return window.world.createEntity( blockConfig, {
      type: gravity === true ? 'dynamic' : 'static', 
      x: x,
      y: y,
      width: width,
      height: height,
      color: type === 'glass' ? "white" : ( type === 'wood' ? "brown" : ( type === 'stone' ? "grey" : "purple" ) ),  
      onImpact: function (entity, normal, tangential) {
        if (normal > BLOCKTYPES[type] && entity.name() === 'bird') {
          window.world.$score += BLOCKTYPES[type];
          this.destroy();
        }
      },
    });
  }
}

export { createBlock, blockConfig };
