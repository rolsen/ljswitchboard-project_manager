// git_pull_core.js
var SmC = require('./lib/submodule_commander.js').SubmoduleCommander;
var smc = new SmC('core');
smc.commandSubmodules('git pull');
