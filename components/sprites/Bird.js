require("script!lib/Box2dWeb-2.1.a.3.min.js");
require("script!lib/boxbox.min.js");

let birdConfig = {
    name: "bird",
    shape: "circle",
    radius: 1,
    image: "https://dl.dropbox.com/u/200135/imgs/blue-bird.gif",
    imageStretchToFit: true,
    density: 4,
    x: 2,
    y: 11
};

let createBird = () => {
  if (!window.world) {
    console.log("BINDING ERROR: NO WORLD ATTRIBUTE IN WINDOW");
  } else {
    return window.world.createEntity( birdConfig, {
      x: 2,
      $score: 0,
      $abilityTriggered: false,
      onKeyDown: function (e) {
        if (this.$abilityTriggered === false) {
          this.$abilityTriggered = true;
          this.applyImpulse(200,60);
          window.world.createEntity(birdConfig, {
            x: this.position().x + 1,
            y: this.position().y + 1
          }).applyImpulse(200, 60);
          window.world.createEntity(birdConfig, {
            x: this.position().x  -1,
            y: this.position().y - 1
          }).applyImpulse(200, 60);
          this.friction(0.1);
        }
      },
      onRender: function (ctx) {
      },
    });
  }
}
export { createBird, birdConfig } 
