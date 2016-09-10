let groundConfig = {
  name: "ground",
  shape: "square",
  type: "static",
  color: "rgb(0,100,0)",
  width: 50,
  height: 0.5,
  y: 12
};

let createGround = () => {
  if (!window.world) {
    console.log("BINDING ERROR: NO WORLD ATTRIBUTE IN WINDOW");
  } else {
    return window.world.createEntity( groundConfig, {} );
  }
}

export { createGround, groundConfig };
