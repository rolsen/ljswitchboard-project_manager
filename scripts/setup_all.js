// setup_all.js

var path = require('path');
var child_process = require('child_process');

var SmC = require('./lib/submodule_commander.js').SubmoduleCommander;
var smc = new SmC();
smc.commandSubmodules('npm install && npm dedupe');

// Install node-webkit
var NWJS_VERSION = '0.12.1';
console.log('Installing nw version:', NWJS_VERSION);
var startingDir = process.cwd();
var builderDir = path.join(startingDir, 'ljswitchboard-builder');
process.chdir(builderDir);
var nwInstallOut = child_process.execSync('npm install nw@' + NWJS_VERSION);
console.log('Successfully installed nw');
process.chdir(startingDir);
