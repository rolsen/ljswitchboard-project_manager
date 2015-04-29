
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

// Get a listing of the folders & files in the current directory.
var currentFiles = fs.readdirSync('.');
var ignoredFolders = ['.git'];
var currentFolders = currentFiles.filter(function(fileName) {
	// Determine if the found fileName is a directory
	var isDir = fs.statSync(path.join('.',fileName)).isDirectory();

	// Determine if the found fileName should be ignored
	var isIgnored = ignoredFolders.indexOf(fileName) >= 0;

	// If the fileName is a directory and shouldn't be ignored then return true.
	// (indicating that the fileName passes the filter)
	return isDir && !isIgnored;
});

var installationStates = [];
currentFolders.forEach(function(folder) {
	installationStates.push({
		'folder': folder,
		'isCheckedOut': false,
		'isFinished': false,
		'isSuccessful': false
	});
});

function printStatus() {
	var numSteps = installationStates.length;
	var numCompleted = 0;
	var messages = [];

	var minSize = 35;
	installationStates.forEach(function(install) {
		if(install.isFinished) {
			numCompleted += 1;
		}
		
		var nameSize = install.folder.length;
		var numExtraSpaces = minSize - nameSize;
		var message = install.folder.toString();
		for(var i = 0; i < numExtraSpaces; i++) {
			message += ' ';
		}
		message += '\t| ' + install.isCheckedOut.toString();
		message += '\t| ' + install.isSuccessful.toString();
		message += '\t| ' + install.isFinished.toString();
		// message += '|' + nameSize.toString();
		messages.push(message);
	});
	var percentComplete = ((numCompleted/numSteps)*100).toFixed(1);
	console.log('');
	console.log('');
	console.log('');
	console.log('Status:', percentComplete + '%');
	var headerMessage = 'Package:';
	var headerLen = headerMessage.length;
	for(var i = 0; i < (minSize - headerLen); i++) {
		headerMessage += ' ';
	}
	headerMessage += '\t| chk';
	headerMessage += '\t| succ';
	headerMessage += '\t| fin';
	console.log(headerMessage);
	messages.forEach(function(message) {
		console.log(message);
	});
}
function updateStatus(name, options) {
	installationStates.forEach(function(install) {
		if(install.folder === name) {
			if(typeof(options.isFinished) !== 'undefined') {
				install.isFinished = options.isFinished;
			}
			if(typeof(options.isCheckedOut) !== 'undefined') {
				install.isCheckedOut = options.isCheckedOut;
			}
			if(typeof(options.isSuccessful) !== 'undefined') {
				install.isSuccessful = options.isSuccessful;
			}
		}
	});
	printStatus();
}

// console.log('Folders', currentFolders);
currentFolders.forEach(function(folder) {
	var startingDir = process.cwd();
	var tempDir = path.join(startingDir, folder);

	// Navigate into the folder
	process.chdir(tempDir);

	// Perform npm install command
	// console.log('Processing: ', folder);
	try {
		var installOutput = child_process.execSync('git commit -a');
		updateStatus(folder, {isCheckedOut: true, isSuccessful: true, isFinished: true});
	} catch(err) {
		console.log('Error!!!');
		updateStatus(folder, {isSuccessful: false, isFinished: true});
	}

	// Navigate back to the starting directory
	process.chdir(startingDir);
});

} catch(err) {
	console.error('Error', err);
}