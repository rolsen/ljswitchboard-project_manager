// clean_core.js
var SmC = require('./lib/submodule_commander.js').SubmoduleCommander;
var smc = new SmC('core');
smc.commandSubmodules('rm -r node_modules');
