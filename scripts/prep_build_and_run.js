
// prep_build_and_run.js
var rmc = require('./lib/run_multiple_commands.js').run_multiple_commands;
var npmCommands = undefined;
if (process.argv.some((arg)=>{return arg.indexOf('mac_sign') > 0;})) {
	console.log('---------------------');
	console.log('--- Building --------');
	console.log('---------------------');
	npmCommands = [
		// 'git_checkout_core',
		'git_pull_core',
		// 'clean_core',
		// 'setup_core_dist',
		'node ./build_scripts/build_project.js',
		'clean_temp_files',
		'run_built_k3'
	];
	
} else {
	console.log('------------------------------');
	console.log('--- Building & Signing ---');
	console.log('------------------------------');
	npmCommands = [
		// 'git_checkout_core',
		'git_pull_core',
		// 'clean_core',
		// 'setup_core_dist',
		'node ./build_scripts/build_project.js mac_sign',
		// 'node ./build_scripts/build_project.js',
		'clean_temp_files',
		'run_built_k3'
	];
}
rmc(npmCommands);

