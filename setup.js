
/*
 * Setup.js is a file that helps initialize the kipling development environment
 * for developers wanting to contribute to the project.  This specific script
 * goes into each folder and performs the commands "npm install" and "npm dedupe"
 * to automate the installation of each projects dependencies.
 *
 * Dependencies:
 *     1. io.js version 1.2.0
 *     2. npm
 *     3. git
 */

// Requirements
var fs = require('fs');


// Globals
var NODE_VERSION = 'v1.2.0';
var NWJS_VERSION = '0.12.1';


// It is required that io.js version 1.2.0 is installed
if(process.version !== NODE_VERSION) {
	console.log('Please install node/io.js version:', NODE_VERSION);
	process.exit();
}

try {

// Get a listing of the folders & files in the current directory.
var currentFiles = fs.readdirSync('.');
var ignoredFolders = ['.git'];
var currentFolders = currentFiles.filter(function(fileName) {
	// Determine if the found fileName is a directory
	var isDir = fs.statSync('./' + fileName).isDirectory();

	// Determine if the found fileName should be ignored
	var isIgnored = ignoredFolders.indexOf(fileName) >= 0;

	// If the fileName is a directory and shouldn't be ignored then return true.
	// (indicating that the fileName passes the filter)
	return isDir && !isIgnored;
});

console.log('Folders', currentFolders);

} catch(err) {
	console.error('Error', err);
}