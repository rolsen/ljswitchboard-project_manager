// git_push.js
var SmC = require('./lib/submodule_commander.js').SubmoduleCommander;
var smc = new SmC();
smc.commandSubmodules('git push');
