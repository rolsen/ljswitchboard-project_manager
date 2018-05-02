// git_status.js

// Requirements
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');


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
		'isSuccessful': false,
		'output': ''
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

		var appendOutput = false;
		var isUpToDate = false;
		if(install.output.indexOf('Your branch is up-to-date') >= 0) {
			isUpToDate = true;
		}
		if(isUpToDate) {
			message += '\t| true';
		} else {
			message += '\t| false';
			appendOutput = true;
		}

		var availableChanges = false;
		if(install.output.indexOf('Changes not staged for commit') >= 0) {
			message += '\t| true';
			appendOutput = true;
		} else {
			message += '\t| false';
		}
		
		if(appendOutput) {
			message += '\r\n' + install.output;
		}
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
	headerMessage += '\t| old';
	headerMessage += '\t| changes';
	
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
			if(typeof(options.output) !== 'undefined') {
				install.output = options.output;
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
		var installOutput = child_process.execSync('git status');
		console.log(installOutput.toString());
		updateStatus(folder, {isCheckedOut: true, isSuccessful: true, isFinished: true, output: installOutput.toString()});
	} catch(err) {
		console.log('Error!!!');
		updateStatus(folder, {isSuccessful: false, isFinished: true});
	}

	// Navigate back to the starting directory
	process.chdir(startingDir);
});
