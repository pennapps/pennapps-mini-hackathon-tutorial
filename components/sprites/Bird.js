require("script!lib/Box2dWeb-2.1.a.3.min.js");
require("script!lib/boxbox.min.js");

import { timerHelper } from 'components/helpers.js';

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
    image: "http://vignette2.wikia.nocookie.net/angrybirds/images/5/51/7632301_2.png/revision/latest/scale-to-width-down/200?cb=20120817021529",
    radius: 0.5
  }
}
let birdConfig = {
    name: "bird",
    shape: "circle",
    image: "https://dl.dropbox.com/u/200135/imgs/blue-bird.gif",
    imageStretchToFit: true,
    density: 4,
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
      $hasShot: false,
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
        if (this.$abilityTriggered === false && this.$canSplit === true && this.$hasShot === true) {
          this.$abilityTriggered = true;
          let birdA = createBird(type, this.position().x + 1, this.position().y - 1, false);
          let birdB = createBird(type, this.position().x - 1, this.position().y - 1, false);
          let velX = this._body.m_linearVelocity.x;
          let velY = this._body.m_linearVelocity.y;
          let magnitude = Math.sqrt((velX * velX) + (velY * velY));
          this.applyImpulse(magnitude,velX, velY);
          birdA.applyImpulse(magnitude,velX-1, velY-1); 
          birdB.applyImpulse(magnitude,velX+1, velY+1);
        }
      },
    });
  }
}
export { createBird, birdConfig } 
