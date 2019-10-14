



console.log('Local Code-signing for Mac OS');

process.on('uncaughtException', function(err) {
	console.log('An uncaughtException occured', err);
	console.log('Stack', err.stack);
	// console.log('An uncaughtException occured');
});

var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var cwd = process.cwd();
var async = require('async');
var child_process = require('child_process');

// Figure out what OS we are building for
var buildOS = {
	'darwin': 'darwin',
	'win32': 'win32'
}[process.platform];
if(typeof(buildOS) === 'undefined') {
	buildOS = 'linux';
}

var curVersion = process.versions.node.split('.').join('_');
var pathToNodeBinaryPartials = [
	__dirname,
	'..',
	'ljswitchboard-io_manager',
	'node_binaries',
	buildOS,
	process.arch,
	curVersion,
	'node'
].join(path.sep);

var pathToNWJSAppPartials = [
	__dirname,
	'..',
	'ljswitchboard-splash_screen',
	'node_modules',
	'nw',
	'nwjs',
	'nwjs.app'
].join(path.sep);

var pathToNodeBinary = '"' + path.resolve(path.join(pathToNodeBinaryPartials)) + '"';
var pathToNWJSApp = '"' + path.resolve(path.join(pathToNWJSAppPartials)) + '"';

var pathToK3BuildScriptsPartials = [
	__dirname,
	'..',
	'ljswitchboard-builder',
	'build_scripts',
].join(path.sep);

var K3_SIGNER = 'sign_mac_build_after_compression.js';
var NODEJS_SIGNER = 'sign_mac_build_before_compression.js';

var pathToNWJSSigner = '"' + path.resolve(path.join(
	pathToK3BuildScriptsPartials,
	K3_SIGNER
)) + '"';
var pathToNodeSigner = '"' + path.resolve(path.join(
	pathToK3BuildScriptsPartials,
	NODEJS_SIGNER
)) + '"';


var buildScripts = [
	{
		'script': pathToNWJSSigner,
		'cliArgs': [
			pathToNWJSApp,
			pathToNodeBinary
		],
		'text': 'Signing local nwjs'
	},
	{
		'script': pathToNodeSigner,
		'cliArgs': [
			pathToNWJSApp,
			pathToNodeBinary
		],
		'text': 'Signing local node'
	},
];


buildScripts.forEach(function(buildScript) {
	buildScript.cmd = 'node ' + buildScript.script;
	buildScript.cmd += ' ' + buildScript.cliArgs.join(' ');
	buildScript.isFinished = false;
	buildScript.isSuccessful = false;
});


// Synchronous version of executing scripts
// buildScripts.forEach(function(buildScript) {
// 	try {
// 		console.log('Starting Step:', buildScript.text);
// 		var execOutput = child_process.execSync(buildScript.cmd);
// 		console.log('execOutput: ' , execOutput.toString());
// 	} catch(err) {
// 		console.log('Error Executing', buildScript.script, buildScript.text);
// 		process.exit(1);
// 	}
// });

// Asynchronous version of executing scripts
async.eachSeries(
	buildScripts,
	function(buildScript, cb) {
		console.log('Starting Step:', buildScript.text);
		child_process.exec(buildScript.cmd, function(error, stdout, stderr) {
			if (error) {
				console.error('Error Executing', error);
				console.error(buildScript.script, buildScript.text);
				cb(error);
			}
			console.log('stdout: ',stdout);
			console.log('stderr: ',stderr);
			cb();
		})
	},
	function(err) {
		if(err) {
			console.log('Error Executing Build Scripts...', err);
			process.exit(1);
		}
	});

