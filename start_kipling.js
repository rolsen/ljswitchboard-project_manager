
/*
 * start_kipling.js is a file that helps with starting kipling.  It runs kipling
 * from the ljswitchboard-splash_screen module.
 *
 * Dependencies:
 *     1. io.js version 1.2.0
 *     2. npm
 */

// Requirements
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

// Globals
var NODE_VERSION = 'v1.2.0';
var NWJS_VERSION = '0.12.1';


// It is required that anode/io.js version with child_process.execSync implemented
if(typeof(child_process.execSync) !== 'function') {
	console.log('Please install a version of node/io.js with child_process.execSync');
	process.exit();
}

try {

	var startingDir = process.cwd();

	// Navigate into the folder
	process.chdir('ljswitchboard-splash_screen');

	// Perform npm install command
	// console.log('Processing: ', folder);
	try {
		var installOutput = child_process.execSync('npm start');
	} catch(err) {
		console.log('Error Starting Kipling');
	}

	// Navigate back to the starting directory
	process.chdir(startingDir);

} catch(err) {
	console.error('Error', err);
}