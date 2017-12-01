
// Requirements
var fs = require('fs');
var async = require('async');
var q = require('q');
var path = require('path');
var child_process = require('child_process');



var cwd = process.cwd();
var k3Path = path.join(cwd, 'ljswitchboard-builder','output','Kipling.exe');

function runFile(filePath) {
	var defered = q.defer();

	receivedDisconnectMessage = false;
    receivedExitMessage = false;

    function finishFunc() {
    	defered.resolve();
    }
	function errorListener(data) {
		console.log('in errorListener',data);
		finishFunc();
	}
	function exitListener(data) {
		receivedExitMessage = true;
		console.log('in exitListener',data);
		finishFunc();
	}
	function closeListener(data) {
		receivedExitMessage = true;
		console.log('in closeListener',data);
		finishFunc();
	}
	function disconnectListener(data) {
		console.log('in disconnectListener',data);
		finishFunc();
	}
	function messageListener(data) {
		// console.log('in messageListener',data);
	}
	function stdinListener(data) {
		// printStatusInfo(cmd);
		// console.log('Data from running cmd:', findNPMCmd(cmd));
		console.log(data.toString());
	}
	function stderrListener(data) {
		// console.log('Data from running cmd:', findNPMCmd(cmd));
		// printStatusInfo(cmd);
		console.log(data.toString());
	}

	var subProcess = child_process.execFile(
		filePath,
		[],
		{
			cwd:process.cwd(),
		});
	subProcess.on('error', errorListener);
	subProcess.on('exit', exitListener);
	subProcess.on('close', closeListener);
	subProcess.on('disconnect', disconnectListener);
	subProcess.on('message', messageListener);
	subProcess.stdout.on('data', stdinListener);
	subProcess.stderr.on('data', stderrListener);

	return defered.promise;
}

console.log('executing file:', k3Path);
runFile(k3Path);
// ljswitchboard-builder/build_scripts/build_project.js