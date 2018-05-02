// git_commit.js
var SmC = require('./lib/submodule_commander.js').SubmoduleCommander;
var smc = new SmC();
smc.commandSubmodules('git commit -a');
