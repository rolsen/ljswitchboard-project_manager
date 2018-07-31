
var child_process = require('child_process');

function exec(command) {
    var output = child_process.execSync(command);
}

console.log('npm install');
exec('npm install');
console.log('git submodule init');
exec('git submodule init');
console.log('git submodule update');
exec('git submodule update');
console.log('npm run checkout_master');
exec('npm run checkout_master');
console.log('npm run git_pull');
exec('npm run git_pull');
console.log('npm run setup');
exec('npm run setup');
