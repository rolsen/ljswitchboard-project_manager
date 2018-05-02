/*
 * setup.js is a file that helps initialize the kipling development environment
 * for developers wanting to contribute to the project.  This specific script
 * goes into each folder and performs the commands "npm install" and "npm dedupe"
 * to automate the installation of each projects dependencies.
 */

var SmC = require('./lib/submodule_commander.js').SubmoduleCommander;
var smc = new SmC('core');
smc.commandSubmodules('npm install && npm dedupe');
