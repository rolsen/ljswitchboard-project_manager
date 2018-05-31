# ljswitchboard-project_manager

This is the Primary Project Repository for LabJack's Kipling application.

ljswitchboard-project_manager contains git submodules which together comprise LabJack's Kipling GUI program. Kipling is mostly for LabJack device configuration but is flexible enough to perform most LabJack device functionality. More information: [Kipling](https://labjack.com/support/software/applications/t-series/kipling). Kipling is powered by [nw.js](https://nwjs.io/).

Besides organizing the directory structure of the Kipling development, ljswitchboard-project_manager provides commands to perform common development tasks. These tasks include project initialization / updating, batch git operations, and linting.


## Development Setup

First, install the [LJM library](https://labjack.com/support/software/installers/ljm). Then:

```bash
git clone https://github.com/rolsen/ljswitchboard-project_manager
cd ljswitchboard-project_manager
npm run initialize # Initialize submodules and install npm modules
npm start # Launch a development version of Kipling
```

For details and troubleshooting, see [docs/setup.md](https://github.com/rolsen/ljswitchboard-project_manager/blob/master/docs/setup.md).


## Development vs Distribution

Once successfully setup, Kipling can be launched "live" from the working directories. Alternately, it can be launched from a packaged build. The packaged build is what is distributed via the [LabJack installer](https://labjack.com/support/software/installers/ljm). Information on building Kipling for distribution is in [docs/distribution.md](https://github.com/rolsen/ljswitchboard-project_manager/blob/master/docs/distribution.md).


## Kipling Core modules:
Kipling's core submodules are the only ones that are strictly needed to launch Kipling. These core modules can be thought of as the entry point to Kipling's dependency tree -- they include other Kipling modules as npm dependencies. The core modules are:

```
ljswitchboard-splash_screen
ljswitchboard-core
ljswitchboard-io_manager
ljswitchboard-kipling
ljswitchboard-module_manager
ljswitchboard-static_files
```

## Commands:

There are two types of commands: npm run-scripts commands and grunt commands.


### npm Commands

- "npm run setup": loops through all folders and executes "npm install"
- "npm run setup_core": loops through core projects and executes "npm install"
- "npm run setup_core_dist": loops through core projects and executes "npm install --production"
    - Note: setting up ljswitchboard-io_manager takes 100+ seconds on windows.
- "npm run git_pull_core": loops through core projects and executes "git pull"
- "npm run clean_core": loops through core folders and executes "rm -r node_modules"
- "npm run build_k3": runs the build script in the ljswitchboard-builder project.
- "npm run prep_for_dist": runs "git_pull_core", "clean_core", and "setup_core_dist".
- "npm run prep_and_build": runs "git_pull_core", "clean_core", "setup_core_dist", and "build_k3".
- "npm run run_built_k3": runs the created K3 .exe

To execute arbitrary commands on the submodules, you can use ljswitchboard-project_manager/index.js. For more information, call `node index.js do -h`. See package.json for examples. To pass flags to index.js from `npm run`, use -- before your flags, e.g. to only do git status for core modules, do `npm run git_status -- --which=core`.


### Grunt

Run `grunt` to lint Kipling's code, including ljswitchboard-project_manager's code.


## Development


### <a name="test-mode"></a>Test Mode

To enter test mode, change "test" in ljswitchboard-project_manager/ljswitchboard-splash_screen/package.json to true. This will:
 - provide mock device connections
 - disable the cache, so that essentially all you need to do make a change is to edit a file and reload the module by clicking on it again. (E.g. just click on the Settings module on the left side of the Kipling window.)
 - uses the data folder `LabJack/K3_DEV` instead of `LabJack/K3`


### Things to remember:

When you haven't done much development on a computer and need to catch up that development environment

1. perform `git fetch`/`git pull` on this project_manager repo
2. perform `git status` to see what has been changed/what is old.
3. perform `npm run checkout_master` to get all sub-repos to checkout the master branch.
4. perform `npm run git_pull` to instruct all sub-repos to update themselves.
 - if things don't work then there are likely changes that need to be submitted.
5. perform `npm run update` to perform an npm update in all directories.


