require("script!../lib/matter.min.js");

// Matter aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events;

var engine = Engine.create(document.body, { 
    render: {
        options: {
          background: '../lib/background.png',
            wireframes: false
        }
    }
});

var mouse = MouseConstraint.create(engine, {
    constraint: { stiffness: 1 }
});

var ground = Bodies.rectangle(395, 600, 815, 50, { 
    isStatic: true, 
    render: { 
      visible: false 
    } 
});

var birdOptions = { 
      render: { 
        sprite: { 
          texture: '../lib/angry-bird-icon.png' 
        } 
      } 
    };

var bird = Bodies.polygon(170, 450, 8, 20, birdOptions),
    anchor = { x: 170, y: 450 },
    elastic = Constraint.create({ 
        pointA: anchor, 
        bodyB: bird, 
        stiffness: 0.1, 
        render: { 
            lineWidth: 5, 
            strokeStyle: '#dfa417' 
        } 
    });

var pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, function(x, y, column, row) {
  var texture = column % 2 === 0 ? '../lib/wood.png' : '../lib/glass.png';
    return Bodies.rectangle(x, y, 25, 40, { render: { sprite: { texture: texture } } });
});

var ground2 = Bodies.rectangle(610, 250, 200, 20, { 
    isStatic: true, 
    render: { 
        fillStyle: '#edc51e', 
        strokeStyle: '#b5a91c' 
    } 
});

var pyramid2 = Composites.pyramid(550, 0, 5, 10, 0, 0, function(x, y, column, row) {
  var texture = column % 2 === 0 ? '../lib/wood.png' : '../lib/glass.png';
    return Bodies.rectangle(x, y, 25, 40, { 
      render: { 
        sprite: { 
          texture: texture 
        } 
      } 
    });
});

World.add(engine.world, [mouse, ground, pyramid, ground2, pyramid2, bird, elastic]);

Events.on(engine, 'tick', function(event) {
    if (engine.input.mouse.button === -1 && (bird.position.x > 190 || bird.position.y < 430)) {
        World.remove(engine.world, [elastic]);
    }
});

Events.on(engine, 'collisionActive', function(event) {
  let i, pair,
    length = event.pairs.length;
  for(i = 0; i < length; i++) {
    pair = event.pairs[i];
    console.log(pair.bodyA.label);
    console.log(pair.bodyB.label);
  }
});

Engine.run(engine);
