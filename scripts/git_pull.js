// git_pull.js
var SmC = require('./lib/submodule_commander.js').SubmoduleCommander;
var smc = new SmC();
smc.commandSubmodules('git pull');
