/*
 * start_kipling.js is a file that helps with starting kipling.  It runs kipling
 * from the ljswitchboard-splash_screen module.
 */

// Requirements
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var startingDir = process.cwd();
process.chdir('ljswitchboard-splash_screen');
var installOutput = child_process.execSync('npm start');
process.chdir(startingDir);
