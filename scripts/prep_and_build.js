// prep_and_build.js
var rmc = require('./lib/run_multiple_commands.js').run_multiple_commands;
var npmCommands = [
	'git_pull_core',
	// 'clean_core',
	// 'setup_core_dist',
	'node ./build_scripts/build_project.js',
	'run_built_k3'
];
rmc(npmCommands);
