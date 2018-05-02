// setup_core_dist.js
var SmC = require('./lib/submodule_commander.js').SubmoduleCommander;
var smc = new SmC('core');
smc.commandSubmodules('npm install --production && npm dedupe');
