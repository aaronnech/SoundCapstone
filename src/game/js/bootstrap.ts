// require.js (our library that manages all these javascript files)
// needs a "main file" to derive all dependencies from and execute.
// This is that file.

///<reference path="./def/phaser.d.ts" />
import App = require('./App');

declare var cordova : any;
declare var PhoneGap : any;
declare var phonegap : any;
declare var $ : any;

/**
 * Determine whether the file loaded from PhoneGap or not
 */
function isPhoneGap() {
    return (typeof cordova != "undefined"
         || typeof PhoneGap != "undefined"
         || typeof phonegap != "undefined")
        && /^file:\/{3}[^\/]/i.test(window.location.href)
        && /ios|iphone|ipod|ipad|android/i.test(navigator.userAgent);
}

function ready() {
    new App();
}

if (isPhoneGap()) {
    document.addEventListener("deviceready", ready, false);
} else {
    (<any> $)(document).ready(ready);
}
