# PennApps-Mini-Hackathon: Angry Birds

A mini-project for a mini-hackathon


## Overview

![moving image](assets/README/moving.png)

This is a very basic implementation of Angry Birds in JavaScript. Currently, the implementation features several basic abilities of the 'Angry Birds' game including the ability for birds to have special abilities (e.g. this implementation has a default ability for the blue bird to split into 3). Also there are multiple block types and of course the pigs, all of which break in response to collisions. 

Currently Boxbox is being used to calculate the physics with javascript and handle collision logic. The app uses webpack to condense all the JavaScript files inside of the `components/` directory to the single `app.js` file. The `lib/` directory contains the scripts which the physics rely upon. The `styles/` directory includes a basic style sheet.

This write up was made for PennApps XIV by Abhinav Suri as part of the mini-hackathon program. The aim of this project is to provide a base for beginner/intermediate programmers to implement some new features on top of an existing codebase.

## Setup


We assume you have some knowledge of command line. Please install Node so you can get access to npm. 

After installing node, download this repository and run `npm install` to get all the dependencies this project requires onto your local machine. We will be using some ES6 in this project as appropriate (the boxbox physics simulator has a lot of parts that are still only ES5 compatible right now). 

After that you can run `npm run start:dev` to start a webpack build and load the page. You should see a working implementation at localhost:8080 or whatever the equivalent is for your computer.

![Introduction Image](assets/README/scene.png)

Also note that `npm run build` will condense all the app files into the single `app.js` file. This should only be run at the end.

## Part 1: index.html and `<canvas>`

First if you haven't used HTML before, go ahead and move over to Codecademy's excellent HTML, CSS, and JS tutorials. 

Our webpage is incredibly simple. Most of our work will be done inside of a `<canvas>` element.

```html
<canvas id="game" width=1400 height=900>
    Text that you see if you don't support Canvas :(
</canvas>
```
In browsers < IE 8, the `<canvas>` element does not appear due to the fact that those versions did not support HTML5 at the time. So, any text within a canvas will not show on any modern browsers, but will show on browsers that have canvas elements hidden/disabled or browsers that are old and not updated to handle HTML5 tags.

Looking at `index.html` we can see the canvas element is the only part of the page and it takes up a large part of it. There are certainly ways to adaptively size a canvas, but those can just make it complicated to position elements. 

Note we also include the `app.js` script even though all the scripts that we actually code are within the `components` folder. This is because, while we are running `npm run start:dev`, we are actually getting files dynamically packaged from webpack-dev-server. I'll discuss this more later on. But basically the app.js file isn't updated until you ask it to be with a `npm run build`.

The other tags on this page are rather self explanatory and it is a fairly bare page, but more than enough for what we need.

## Part 2: Webpack

Since our webapp will be dealing with multiple components, it is best to deal with a single tool to dynamically require in scripts dealing with different parts of application logic. **Webpack** is what allows us to do this. We do need to worry about import order etc. and can require 3rd party scripts into our application. It can also process ES6, the newest version of JavaScript. 

You can view the `webpack.config.js` file to look along with this.

The context and resolve keys basically specify that all 'require's are made from the root of the current working directory (i.e. where the application lives). The `entry` key specifies the first JavaScript file you need to process and which will require all the other files you need.

`output` specifies that all of this javascript will be moved to the current directory and 'compiled' into the `app.js` file. 

The `module` key specifies specific configuration about how the webpack should handle interpretting files that you have required into your scripts. For example, we will be writing parts of our code in ES6 to utilize the convenience features such as `map()` and arrow functions. However, most web browsers fail to correctly interpret ES6 yet, so we specify a `loader` called **babel** which will transpile our code from ES6 -> ES5 (the current version of JavaScript universally supported as of Sept 10 2016).

The process of transpiling code, requiring it in the right order, and then moving it into the right order is very resource intensive and time consuming. So we will use a tool called `web-dev-server` to allow us to _hot-reload_ our file (i.e. as we save a file, it will be merged with a state tree and only the changes that we actually need will be made rather than remaking the entire file). So as we save our work, the changes will instantaneously reappear in the web browser.

## Part 3: Planning the Game

On the high level, we define what we want to make in order to have a clear goal in mind while programming. In the game of angry birds, at the most level, there are `birds` with different abilities which can have some abilities which clicked. There are also different types of `blocks` with differing level of 'life' and they break under certain amounts of force. There are also `pigs` which `birds` can break and must break to win the game. We can also have a `ground` component which will be a static platform that hold everything else.

On a lower level. The `birds` must have a lot of the same characters. They definitely have a x and y coordinate, some velocity, an image to represent it, some force at which it will break, some radius and so on. So it would make sense for our implementation to have separate `sprites` for each of the objects mentioned above.

We must also keep some kind of scoring component in order to quantify how well we did in the game. We won't go too much into how score should be determined, but the more pigs you destroy, the higher your score should be.

## Part 4: Physics with Boxbox

In order to not have to deal with the nitty-gritty of physics and collisions, we are going to be a lightweight javascript physics library called `boxbox.js`. All characters in our game are going to be objects in a boxbox world. This world has things like gravity, collisions, and so much more (much like real life). Additionally, Boxbox can take in a common set of characteristics and a set of custom characteristics and merge them together to form an object. This is incredibly useful for creating a new type of bird. Or some new ability a bird can have.

## Part 5: Main.js Setup

Look under components and go to `Main.js`. This is the entry point of our application. At the very top we import a ton of files.

``` javascript
import $ from 'jquery';

require("script!lib/Box2dWeb-2.1.a.3.min.js");
require("script!lib/boxbox.min.js");

import { getDist, getDegrees } from 'components/helpers.js';

import { createBird, birdConfig } from 'components/sprites/Bird.js';
import { createGround, groundConfig } from 'components/sprites/Ground.js';
import { createBlock, blockConfig } from 'components/sprites/Block.js';
import { createPig, pigConfig } from 'components/sprites/Pig.js';

```

Note here we are using the ES6 import syntax. We are explicitly requiring Boxbox and its dependency, Box2dWeb, because it is not a CommonJS module since it has not been updated in a while. But this is fine, we can just add it into our files by requiring the script with a !script before its name and `webpack` will recognize to insert these scripts in your app.js file, but not try to bundle them. Also note that the typical syntax for imports in ES6 is `import { function1, function2, ... } from 'filePathOrModuleName';`.

Next we declare some constants: 

```
let anchorX, anchorY, mouseX, mouseY = 0;
const PLATFORM_X = 3;
const PLATFORM_Y = 6;
const SCALE = 45;
```

The anchor cooridates and the mouse coordinates are tracked later on for our usage when creating a projectory vector visualization when a user drags their mouse across the screen to sling the bird to the other side. The platform variables tell us where the launch platform should be placed. 

The SCALE variable will be used in setting up our world. The `boxbox` system does all its measurements in meters. The Scale specifies the ratio of pixels to meters. For most of our boxbox position, we will use the meter representation of the objects in the boxbox world. 

