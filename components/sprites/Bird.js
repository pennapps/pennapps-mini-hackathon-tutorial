require("script!lib/Box2dWeb-2.1.a.3.min.js");
require("script!lib/boxbox.min.js");

import { timerHelper } from 'components/helpers.js';

const DEFAULT_X = 2;
const DEFAULT_Y = 11;
const FORCE_THRESHOLD = 50;
const TIMEOUT_CONST = 5000;
const BIRD_TYPES = {
  'blue': {
    force: 50,
    image: "https://dl.dropbox.com/u/200135/imgs/blue-bird.gif",
    radius: 0.5
  },
  'red' : {
    force: 75,
    image: "https://dl.dropbox.com/u/200135/imgs/red-bird.gif",
    radius: 1
  }
}
let birdConfig = {
    name: "bird",
    shape: "circle",
    radius: 1,
    image: "https://dl.dropbox.com/u/200135/imgs/blue-bird.gif",
    imageStretchToFit: true,
    density: 4,
    x: DEFAULT_X,
    y: DEFAULT_Y
};

let createBird = (type, x, y, canSplit = true) => {
  if (!window.world) {
    console.log("BINDING ERROR: NO WORLD ATTRIBUTE IN WINDOW");
  } else {
    return window.world.createEntity( birdConfig, {
      x: x,
      y: y,
      radius: BIRD_TYPES[type]['radius'],
      image: BIRD_TYPES[type]['image'],
      $abilityTriggered: false,
      $canSplit: canSplit,
      $hits: 0,
      $timer: null, 
      onImpact: function (entity, normal, tangential) {
        if ( normal > 5 ) {
          timerHelper( "start", window, this, TIMEOUT_CONST )
        }
        if (normal > BIRD_TYPES[type]['force']) {
          timerHelper( "reset", window, this, TIMEOUT_CONST );
          this.$hits++;
        }
        if (this.$hits > 3) {
          this.destroy();
        }
      },
      onKeyDown: function (e) {
        if (this.$abilityTriggered === false && this.$canSplit === true) {
          this.$abilityTriggered = true;
          let birdA = createBird('blue', this.position().x + 1, this.position().y - 1, false);
          let birdB = createBird('blue', this.position().x - 1, this.position().y - 1, false);
          this.applyImpulse(200,60);
          birdA.applyImpulse(200,60); 
          birdB.applyImpulse(200,60);
        }
      },
    });
  }
}
export { createBird, birdConfig } 
