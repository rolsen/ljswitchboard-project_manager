// submodule_commander.js
// Manage multiple git submodules; e.g. run a command in each submodule.
// All functions must be executed from the repo that contains the submodules.
"use strict";

var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

exports.SubmoduleCommander = class SubmoduleCommander {
    // which_sm: Which submodules
    constructor(which_sm) {
        which_sm = (typeof which_sm !== 'undefined') ?  which_sm : 'all';

        if (which_sm === 'all') {
            this.submodules = exports.getAllSubmodules();
        }
        else if (which_sm === 'core') {
            this.submodules = exports.getCoreSubmodules();
        }
    }

    // Executes the given command in each of the submodules then prints a summary.
    // command: The shell command to execute
    commandSubmodules(command) {
        var repoStatuses = {};
        this.submodules.forEach(function(folder) {
            repoStatuses[folder] = {
                'folder': folder,
                'isSuccessful': false
            };
        });

        var startingDir = process.cwd();
        this.submodules.forEach(function(folder) {
            var workDir = path.join(startingDir, folder);
            process.chdir(workDir);

            console.log(workDir);

            try {
                var output = child_process.execSync(command);
                // console.log('output', output.toString());
                repoStatuses[folder].isSuccessful = true;
            } catch(err) {
                console.log('Error!!!');
                repoStatuses[folder].isSuccessful = false;
            }

            // Navigate back to the starting directory
            process.chdir(startingDir);
        });

        printStatuses(repoStatuses);
    }
};

// Return the path of each submodule, whether or not submodules are initialized.
// Returns something like:
//     ['ljswitchboard-builder', 'subdirectory/other_submodule']
exports.getAllSubmodules = function() {
    // https://stackoverflow.com/questions/12641469/list-submodules-in-a-git-repository
    var submodules = child_process.execSync(
        "git config --file .gitmodules --get-regexp path | awk '{ print $2 }'"
    );
    return submodules.toString().split('\n').filter(word => word.length > 0);
};

exports.getCoreSubmodules = function() {
    var ljswitchboardBuilderPackageInfo = require('../../ljswitchboard-builder/package.json');
    var currentFiles = ljswitchboardBuilderPackageInfo.kipling_dependencies;
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
    return currentFolders;
};

// Print the progress and success/fail state of all subrepos
var printStatuses = function(completionStates) {
    var numSteps = 0;
    var numCompleted = 0;
    var messages = [];

    var minSize = 35;
    for (var subrepo in completionStates) {
        var state = completionStates[subrepo];
        if(state.isSuccessful) {
            numCompleted += 1;
        }

        var nameSize = state.folder.length;
        var numExtraSpaces = minSize - nameSize;
        var message = state.folder.toString();
        for(var i = 0; i < numExtraSpaces; i++) {
            message += ' ';
        }
        message += '\t| ' + state.isSuccessful.toString();
        // message += '|' + nameSize.toString();
        messages.push(message);

        numSteps += 1;
    }
    var percentComplete = ((numCompleted/numSteps)*100).toFixed(1);
    console.log('');
    console.log('');
    console.log('');
    console.log('Success:', percentComplete + '%');
    var headerMessage = 'Package:';
    var headerLen = headerMessage.length;
    for(let i = 0; i < (minSize - headerLen); i++) {
        headerMessage += ' ';
    }
    headerMessage += '\t| succ';
    console.log(headerMessage);
    messages.forEach(function(message) {
        console.log(message);
    });
};
