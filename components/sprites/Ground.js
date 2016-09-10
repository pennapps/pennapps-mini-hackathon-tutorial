let groundConfig = {
  name: "ground",
  shape: "square",
  color: "green",
  type: "static",
  width: 50,
  height: 10,
  y: 14
};

let createGround = () => {
  if (!window.world) {
    console.log("BINDING ERROR: NO WORLD ATTRIBUTE IN WINDOW");
  } else {
    return window.world.createEntity( groundConfig, {} );
  }
}

export { createGround, groundConfig };
