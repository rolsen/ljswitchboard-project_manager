
var child_process = require('child_process');

function exec(command) {
    var output = child_process.execSync(command);
}

exec('npm install');
exec('git submodule init');
exec('git submodule update');
exec('npm run checkout_master');
exec('npm run git_pull');
exec('npm run setup');
