
var q = require('q');
var async = require('async');
var colors = require('colors');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var child_process = require('child_process')
var cjson = require('cjson');
/*
 * This is a script for upgrading project dependencies.
 */

var test_constants = cjson.load('test_constants.json');
var reqPrimaryDependencies = test_constants.primary_dependencies;
var reqPrimaryDependencyKeys = Object.keys(reqPrimaryDependencies);
var reqDevDependencies = test_constants.dev_dependencies;
var reqDevDependencyKeys = Object.keys(reqDevDependencies);

var projects = test_constants.projects_to_test;

if(typeof(test_constants.override_projects_to_test) !== 'undefined') {
	projects = test_constants.override_projects_to_test;
}
var mainProjectDir = path.join(__dirname, '..');

function exitWithErrorMessage(message) {
	console.error(message);
	process.exit(1);
}

function printStep(step) {
	console.log('  - ' + step);
}

var ALLOW_UPDATES = false;
if(process.argv.some((arg)=>{return arg.indexOf('-f') > 0;})) {
	ALLOW_UPDATES = true;
}

projects.forEach(function(project) {
	var projectPath = path.join(mainProjectDir, project);
	var projectInfoPath = path.join(projectPath, 'package.json');
	var projectInfo = JSON.parse(fs.readFileSync(projectInfoPath));
	console.log('project:', projectInfo.name);
	
	// Check to make sure all dependencies are defined in constants
	var projectDepKeys = [];
	if(typeof(projectInfo.dependencies) !== 'undefined') {
		projectDepKeys = Object.keys(projectInfo.dependencies);
	}
	var isDepKeyMissing = projectDepKeys.some(function(projectDepKey) {
		if(reqPrimaryDependencyKeys.indexOf(projectDepKey) >= 0) {
			return false;
		} else {
			return true;
		}
	});

	if(isDepKeyMissing) {
		exitWithErrorMessage(
			'Project: ' + (project).green
			 + `: uses libs: ` + `${projectDepKeys}`.green 
			 +`, atleast one is not managed.  Managed libs: ` + `${reqPrimaryDependencyKeys}`.green)
	}

	// Check to make sure all dependencies are properly defined.
	var isDepKeyOld = false;
	var depsToUpdate = [];
	projectDepKeys.forEach(function(projectDepKey) {
		var reqVersion = reqPrimaryDependencies[projectDepKey];
		var curVersion = projectInfo.dependencies[projectDepKey];
		
		if(reqVersion !== curVersion) {
			projectInfo.dependencies[projectDepKey] = reqVersion;
			isDepKeyOld = true;
			depsToUpdate.push({
				'name': projectDepKey,
				'curVersion': curVersion,
				'reqVersion': reqVersion
			});
		}
	});

	// Check to make sure all devDependencies are defined in constants
	var projectDevDepKeys = [];
	if(typeof(projectInfo.devDependencies) !== 'undefined') {
		projectDevDepKeys = Object.keys(projectInfo.devDependencies);
	}
	var isDevDepKeyMissing = projectDevDepKeys.some(function(projectDepKey) {
		if(reqDevDependencyKeys.indexOf(projectDepKey) >= 0) {
			return false;
		} else {
			return true;
		}
	});

	if(isDevDepKeyMissing) {
		exitWithErrorMessage(
			'Project: ' + (project).green
			 + `: uses Dev libs: ` + `${projectDevDepKeys}`.green 
			 +`, atleast one is not managed.  Managed libs: ` + `${reqDevDependencyKeys}`.green)
	}

	// Check to make sure all devDependencies are properly defined.
	var isDevDepKeyOld = false;
	var devDepsToUpdate = [];
	projectDevDepKeys.forEach(function(projectDevDepKey) {
		var reqVersion = reqDevDependencies[projectDevDepKey];
		var curVersion = projectInfo.devDependencies[projectDevDepKey];
		
		if(reqVersion !== curVersion) {
			projectInfo.devDependencies[projectDevDepKey] = reqVersion;
			isDevDepKeyOld = true;
			devDepsToUpdate.push({
				'name': projectDevDepKey,
				'curVersion': curVersion,
				'reqVersion': reqVersion
			});
		}
	});
	
	if(isDepKeyOld) {
		printStep('Dependency is old, updating:' + JSON.stringify(depsToUpdate).green);
	}
	if(isDevDepKeyOld) {
		printStep('Dependency is old, updating:' + JSON.stringify(devDepsToUpdate).green);
	}


	if(!(isDepKeyOld || isDevDepKeyOld)) {
		printStep('Already up to date');
		return;
	} else {
		printStep('Need to update'.red);
		return;
	}
	// // Run "npm install" before testing.
	// printStep('running npm install');
	// try {
	// 	var stdioOut = [];
	// 	child_process.execSync('npm install', {cwd: projectPath, stdio: stdioOut});
	// } catch(err) {
	// 	exitWithErrorMessage('Error running npm install: ' + `${err}`.red)
	// }

	// // Run "npm test".
	// printStep('running npm test');
	// try {
	// 	var stdioOut = [];
	// 	child_process.execSync('npm test', {cwd: projectPath, stdio: stdioOut});
	// } catch(err) {
	// 	exitWithErrorMessage('Error running npm install: ' + `${err}`.red)
	// }

	
	// // Edit the project.json file.
	// printStep('Edit the project.json');
	// try {
	// 	var stdioOut = [];
	// 	fs.writeFileSync(projectInfoPath, JSON.stringify(projectInfo, null, 4));
	// } catch(err) {
	// 	exitWithErrorMessage('Error editing package.json: ' + `${err}`.red)
	// }
	
	// // Delete the node_modules directory.
	// printStep('running rm -r node_modules');
	// try {
	// 	var stdioOut = [];
	// 	child_process.execSync('rm -r node_modules', {cwd: projectPath, stdio: stdioOut});
	// } catch(err) {
	// 	exitWithErrorMessage('Error deleting node_modules folder: ' + `${err}`.red)
	// }

	// // Delete the package-lock.json file.
	// printStep('Delete the package-lock.json file');
	// try {
	// 	var stdioOut = [];
	// 	child_process.execSync('rm package-lock.json', {cwd: projectPath, stdio: stdioOut});
	// } catch(err) {
	// 	exitWithErrorMessage('Error deleting node_modules folder: ' + `${err}`.red)
	// }

	// // Delete the node_modules directory.
	// printStep('Installing dependencies');
	// try {
	// 	var stdioOut = [];
	// 	child_process.execSync('npm install', {cwd: projectPath, stdio: stdioOut});
	// } catch(err) {
	// 	exitWithErrorMessage('Error installing dependencies: ' + `${err}`.red)
	// }

	// // Run "npm test".
	// printStep('running npm test');
	// try {
	// 	var stdioOut = [];
	// 	child_process.execSync('npm test', {cwd: projectPath, stdio: stdioOut});
	// } catch(err) {
	// 	exitWithErrorMessage('Error running npm install: ' + `${err}`.red)
	// }
});