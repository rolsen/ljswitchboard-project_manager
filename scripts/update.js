// update.js
var SmC = require('./lib/submodule_commander.js').SubmoduleCommander;
var smc = new SmC();
smc.commandSubmodules('npm update && npm dedupe');
