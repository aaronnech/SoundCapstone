// require.js (our library that manages all these javascript files)
// needs a "main file" to derive all dependencies from and execute.
// This is that file.

///<reference path="./def/phaser.d.ts" />

import App = require('./App');
new App();