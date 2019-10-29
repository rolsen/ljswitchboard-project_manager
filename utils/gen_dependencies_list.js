

const colors = require('colors');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const async = require('async');
const q = require('q');

const projectPath = path.join(__dirname, '..');
const allProjectFiles = fs.readdirSync(projectPath);

let projectFolders = [];
allProjectFiles.forEach((projectFile) => {
	let filePath = path.join(projectPath, projectFile);
	try {
		if(fs.lstatSync(filePath).isDirectory()) {
			try {
				let pkgPath = path.join(filePath,'package.json');
				if(fs.lstatSync(pkgPath).isFile()) {
					projectFolders.push(filePath);
				}
			} catch(err) {
				// suppress errors.
				console.log('Error reading file', pkgPath);
			}
		}
	} catch(err) {
		console.log('Error getting FP dir info:', filePath);
	}
});

let dependenciesMap = {};
let devDependenciesMap = {};
let allDependenciesMap = {};
let latestDependencies = {};


function buildDependencyObj(dependencyObj, dependencyName, dependencyInfo, dependent) {
	let curKeys = Object.keys(dependencyObj)
	let version = dependencyInfo[dependencyName];
	let dependentStr = (dependent + ` (${version})`);
	if(curKeys.indexOf(dependencyName) >= 0) {
		if(dependencyObj[dependencyName].versions.indexOf(version) < 0) {
			dependencyObj[dependencyName].versions.push(version);
			dependencyObj[dependencyName].dependents.push(dependent);
			dependencyObj[dependencyName].dependentStrs.push(dependentStr);
		} else {
			dependencyObj[dependencyName].dependents.push(dependent);
			dependencyObj[dependencyName].dependentStrs.push(dependentStr);
		}
	} else {
		dependencyObj[dependencyName] = {
			versions: [version],
			dependents: [dependent],
			dependentStrs: [dependentStr]
		};
	}
}



projectFolders.forEach((projectFolder) => {
	let projectPath = path.join(projectFolder, 'package.json');
	let projectInfo = JSON.parse(fs.readFileSync(projectPath));
	let projectName = projectInfo.name;
	console.log('Name:',projectName);

	let dependencyKeys = [];
	if(typeof(projectInfo.dependencies) !== 'undefined') {
		dependencyKeys = Object.keys(projectInfo.dependencies);
	}
	let devDependencyKeys = [];
	if(typeof(projectInfo.devDependencies) !== 'undefined') {
		devDependencyKeys = Object.keys(projectInfo.devDependencies);
	}

	dependencyKeys.forEach((dependencyKey) => {
		buildDependencyObj(dependenciesMap, dependencyKey, projectInfo.dependencies, projectName);
		buildDependencyObj(allDependenciesMap, dependencyKey, projectInfo.dependencies, projectName);
	});

	devDependencyKeys.forEach((devDependencyKey) => {
		buildDependencyObj(devDependenciesMap, devDependencyKey, projectInfo.devDependencies, projectName);
		buildDependencyObj(allDependenciesMap, devDependencyKey, projectInfo.devDependencies, projectName);
	});

	// if(projectName === 'ljswitchboard-splash_screen') {
	// 	console.log('dependencyKeys', dependencyKeys)
	// }
});

let projectDependencies = {};

projectFolders.forEach((projectFolder) => {
	let projectPath = path.join(projectFolder, 'package.json');
	let projectInfo = JSON.parse(fs.readFileSync(projectPath));
	let projectName = projectInfo.name;

	let dependencyKeys = [];
	if(typeof(projectInfo.dependencies) !== 'undefined') {
		dependencyKeys = Object.keys(projectInfo.dependencies);
	}
	let devDependencyKeys = [];
	if(typeof(projectInfo.devDependencies) !== 'undefined') {
		devDependencyKeys = Object.keys(projectInfo.devDependencies);
	}

	projectObj = {
		dependencies:{},
		devDependencies:{},
		curVer: projectInfo.version,
	}
	

	dependencyKeys.forEach((dependencyKey) => {
		let version = projectInfo.dependencies[dependencyKey];

		if(dependenciesMap[dependencyKey].versions.length > 1) {
			projectObj.dependencies[dependencyKey] = {
				version: version,
				versions: dependenciesMap[dependencyKey].versions
			};
		}
	});

	devDependencyKeys.forEach((devDependencyKey) => {
		let version = projectInfo.devDependencies[devDependencyKey];

		if(devDependenciesMap[devDependencyKey].versions.length > 1) {
			projectObj.devDependencies[devDependencyKey] = {
				version: version,
				versions: devDependenciesMap[devDependencyKey].versions
			};
		}
	});
	projectDependencies[projectName] = projectObj;
});

function isLJProject(projectName) {
	let ljProjects = Object.keys(projectDependencies);
	let isLJProject = false;
	if(ljProjects.indexOf(projectName) >= 0) {
		isLJProject = true;
	}
	return isLJProject;
}


function queryVersions() {
	let defered = q.defer();
	let keys = Object.keys(allDependenciesMap);
	console.log('getting all dependencies', keys.length);
	async.each(keys,function(depName, cb) {
		let version = '0.0.0';

		if(isLJProject(depName)){
			version = projectDependencies[depName].curVer;
			latestDependencies[depName] = version;
			cb();
		} else {
			// console.log('getting', depName);
			child_process.exec(`npm view ${depName} version`, {cwd: projectPath}, (err, stdout, stderr) => {

				version = stdout.toString().trim();
				latestDependencies[depName] = version;
				// console.log('got', depName, version);
				if((err) || (stderr.toString().trim().length > 0)) {
					// console.log('err getting version info', err);
					cb(err);
				} else {
					cb();
				}
			});
		}
	}, function(err) {
		if(err) {
			defered.reject();
		} else {
			console.log('queried all versions', latestDependencies);
			defered.resolve();
		}
	})
	return defered.promise;
}
function executeRemaining() {
	let defered = q.defer();

	
	function getLatestVersion(projectName) {
		return latestDependencies[projectName];
	}

	function printDuplicatedDependencies(dependencyObj) {
		let dependencyKeys = Object.keys(dependencyObj);
		dependencyKeys.forEach((dependencyKey) => {
			if(dependencyObj[dependencyKey].versions.length > 1) {
				console.log((dependencyKey).green, `(${getLatestVersion(dependencyKey)})`.green);
				console.log('  Versions');
				dependencyObj[dependencyKey].versions.forEach((version) => {
					console.log(`  - ${version}`.red)
				});
				console.log('  Dependents');
				dependencyObj[dependencyKey].dependentStrs.forEach((dependent) => {
					console.log(`  - ${dependent}`)
				});
			}
		});
	}

	function sortProjectKeys(keys) {
		let ljProjectKeys = [];
		let extProjectKeys = [];
		let sortedProjectKeys = [];
		keys.forEach(function(projectKey) {
			if(isLJProject(projectKey)) {
				ljProjectKeys.push(projectKey);
			} else {
				extProjectKeys.push(projectKey);
			}
		});

		ljProjectKeys.sort(function(a, b){
			if(a < b) { return -1; }
			if(a > b) { return 1; }
			return 0;
		});
		extProjectKeys.sort(function(a, b){
			if(a < b) { return -1; }
			if(a > b) { return 1; }
			return 0;
		});
		sortedProjectKeys = ljProjectKeys.concat(extProjectKeys);
		return sortedProjectKeys;
	}
	function printLatestDependencyVersions(dependencyObj) {
		let dependencyKeys = Object.keys(dependencyObj);
		let sortedProjectKeys = sortProjectKeys(dependencyKeys);
		sortedProjectKeys.forEach((dependencyKey) => {
			let version = dependencyObj[dependencyKey];
			console.log((dependencyKey).green, `  - ${version}`.red);
		});
	}

	function printProjectDependencies(printDeps, printDevDeps) {
		let ljProjects = Object.keys(projectDependencies);
		let projectKeys = Object.keys(projectDependencies);

		let sortedProjectKeys = sortProjectKeys(projectKeys);

		// projectKeys = [projectKeys[0]];
		sortedProjectKeys.forEach((projectKey) => {
			let productObj = projectDependencies[projectKey];

			console.log((`${projectKey} (${productObj.curVer})`).green);
			if(printDeps) {
				console.log('Dependencies');
				let dependencyKeys = Object.keys(productObj.dependencies);
				dependencyKeys.forEach((dependencyKey) => {
					let version = productObj.dependencies[dependencyKey].version;
					let versions = productObj.dependencies[dependencyKey].versions;
					let latestVersion = getLatestVersion(dependencyKey);
					console.log(`  ${dependencyKey} (${version})`.yellow);

					if(isLJProject(dependencyKey)) {
						console.log(`  LJ Dep (${latestVersion})`.red);
					} else {
						console.log(`  Ext Dep (${latestVersion})`.red);
					}
					versions.forEach((version) => {
						console.log(`  - ${version}`);
					});
				});
			}

			if(printDevDeps) {
				console.log('Dev Dependencies')
				let devDependencyKeys = Object.keys(productObj.devDependencies);
				devDependencyKeys.forEach((devDependencyKey) => {
					let version = productObj.devDependencies[devDependencyKey].version;
					let versions = productObj.devDependencies[devDependencyKey].versions;
					let latestVersion = getLatestVersion(devDependencyKey);

					console.log(`  ${devDependencyKey} (${version})`.yellow);
					if(isLJProject(devDependencyKey)) {
						console.log(`  LJ Dep (${latestVersion})`.red);
					} else {
						console.log(`  Ext Dep (${latestVersion})`.red);
					}
					versions.forEach((version) => {
						console.log(`  - ${version}`);
					});
				});
			}
		});
	}
	console.log('*********************************'.blue);
	console.log('*********************************'.blue);
	console.log('*********************************'.blue);
	// console.log('Project Folders',projectFolders)
	console.log('Dependency Map', dependenciesMap);
	// printDuplicatedDependencies(dependenciesMap);
	// printDuplicatedDependencies(devDependenciesMap);
	
	try {
		printDuplicatedDependencies(allDependenciesMap);
		// printProjectDependencies(true,true);
		printLatestDependencyVersions(latestDependencies);
	} catch(err) {
		console.log('err',err);
	}
	return defered.promise;
}

queryVersions()
.then(executeRemaining)