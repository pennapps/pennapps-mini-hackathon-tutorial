require("script!lib/Box2dWeb-2.1.a.3.min.js");
require("script!lib/boxbox.min.js");

const FORCE_MULTIPLIER = 100;

let pigConfig = {
  name: "pig",
  shape: "circle",
  radius: 1,
  image: "https://dl.dropbox.com/u/200135/imgs/soldier-pig.png",
  imageStretchToFit: true,
  density: 4,
  x: 16.5,
  y: 11,
};

let createPig = (x, y, radius) => {
  if (!window.world) {
    console.log("BINDING ERROR: NO WORLD ATTRIBUTE IN WINDOW");
  } else {
    return window.world.createEntity( pigConfig, {
      x: x,
      y: y,
      radius: radius,
      $hits: 0,
      onImpact: function (entity, normal, tangential) {
        if (normal > 10 && entity.name() !== "ground") {
          window.world._ops.$score++;
          this.$hits++;
        }
        if (this.$hits > radius * FORCE_MULTIPLIER) {
          this.destroy();
          window.world._ops.$score += radius * FORCE_MULTIPLIER;
        }
      },
    });
  }
}
export { pigConfig, createPig };
