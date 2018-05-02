# ljswitchboard-project_manager

This is the Primary Project Repository for LabJack's Kipling application.

# Development Setup/Getting Started

#### Short Instructions

```bash
git clone https://github.com/rolsen/ljswitchboard-project_manager
cd ljswitchboard-project_manager
git submodule init
git submodule update
npm run checkout_master
npm run git_pull
npm run setup
npm start
```

#### More Detailed Instructions

1. Install Project Building Dependencies
 Set-up Node, git, and some other things on your computer.  LJ-ers, check out the QMS-xxx~new computer for details.  Others, feel free to email us and we can make a public document.  The first few following steps are windows only.
    1. **(windows)** Install windows-build-tools using npm.  After installing node.js open a new Powershell window as an admin user (windows key, type powershell, right click, run as admin) and then run the following command:
    ```bash
    > npm install -g windows-build-tools
    ```
    2. **(windows)** Install node-gyp.  Do this in a command prompt window (windows key, type cmd) with standard user permissions, not admin.
    ```bash
    > npm install -g node-gyp
    ```
    3. **(windows)** Configure msvs version
    ```bash
    > npm config set msvs_version 2015
    ```
    4. **(windows)** Configure it globally
    ```bash
    > npm config set msvs_version 2015 --global
    ```
2. In order to contribute to the project, please request permissions to edit the repo from someone on the team.

3. Clone this repository: [https://github.com/rolsen/ljswitchboard-project_manager](https://github.com/rolsen/ljswitchboard-project_manager)
```bash
git clone https://github.com/rolsen/ljswitchboard-project_manager
...
```
4. Navigate into the project
```bash
cd ljswitchboard-project_manager
```
5. Initialize the git sub-modules
```bash
git submodule init
git submodule update
```
6. Checkout the master branch for all repositories by running  "git checkout master" in each of the sub-module directories.
```bash
npm run checkout_master
```
7. Update all the repositories by running the command "npm run git_pull" in each sub-module directory.
```bash
npm run git_pull
```
8. Execute the "npm install" instruction in each of the sub-modules.  This can be done with two options:
	a. In order to set up a computer for development,
	```bash
	npm run setup
	```
	b. In order to set up a computer with the core components, the bare minimum to be able to run and build the project:
	```bash
	npm run setup-core
	```
9. After the last step has finished (it takes quite a while) start Kipling by running the command "npm start".
```bash
npm start
```
10. Optionally, enable [testing mode](#test-mode).

11. Run `npm start`


# Build Steps
After running the above setup instructions, you can run the "npm run setup" command (or `npm run setup-core`), then run the command "npm run prep_build_and_run".
```bash
npm run setup
npm run prep_build_and_run
```


## Building
Once the subrepositories of `ljswitchboard-project_manager` have been updated (changes to those subrepos have been committed and pushed/merged to `master`, `package.json` files have been updated with new version numbers, and subrepos have been `npm publish`ed), the main Kipling version may be updated:

If steps of the above build process fail, these are some extra descriptions and another list of commands that can be run:
1. Run "git pull" to update the project manager.
2. Make sure the proper version of node.js is installed.  Ihe x-io_manager has a node.js binary it is programmed to use.  Make sure the build computer has the same version as the io_manager. The node binary file is located in the folder ljswitchboard-io_manager/node_binaries.  These are just copies of the binaries from node.js.  Perhaps there is a better way to properly include these into a repository & link them to node itself; suggestions welcome.
3. run "npm run git_pull" to update each of the modules.  If necessary, run "npm run checkout_master".
4. run "npm run rm_r_node_modules" to delete all sub-module's node_modules folders.
5. run "npm run setup" to install all of the sub-modules.
 - You should probably go get beer at this point.  This takes a while...
6. Navigate into the ljswitchboard-build directory and run "npm run build_project" to build the project.  The output files will exist in the /output folder.


## Required Node Versions
As of 2/22/2018, Windows/Mac/Linux users should be using node.js 6.6.0. This version is likely to change to newer versions over time.  A nice tool to install node on mac/linux computers is a script called "nave".  Instructions are included below:

## Running "nave.sh"

"nave.sh" is a useful tool for installing node on Mac & Linux.
```bash
wget https://raw.github.com/isaacs/nave/master/nave.sh
sudo bash nave.sh usemain 0.10.22
```

## Building & Releasing (12/1/2017)
1. git pull // update -project_manager
2. npm run build // runs git_pull_core, prep_build_and_run
When finished, this will launch the built version of Kipling.  A compressed version of Kipling is also created and is ready to be uploaded to github for release.

### Debugging building.
If things aren't working properly, run:
1. npm run git_pull // to pull all latest project changes.
2. npm run setup_all // to run npm install everywhere.



## Kipling Core projects/folders:
```
ljswitchboard-splash_screen
ljswitchboard-core
ljswitchboard-io_manager
ljswitchboard-kipling
ljswitchboard-module_manager
ljswitchboard-static_files
```

## Available commands:

- "npm run setup_all": loops through all folders and executes "npm install"
- "npm run setup": loops through core projects and executes "npm install"
- "npm run setup_core_dev": loops through core projects and executes "npm install"
- "npm run setup_core_dist": loops through core projects and executes "npm install --production"
    - Note: setting up ljswitchboard-io_manager takes 100+ seconds on windows.
- "npm run git_pull_core": loops through core projects and executes "git pull"
- "npm run clean_core": loops through core folders and executes "rm -r node_modules"
- "npm run build_k3": runs the build script in the ljswitchboard-builder project.
- "npm run prep_for_dist": runs "git_pull_core", "clean_core", and "setup_core_dist".
- "npm run prep_and_build": runs "git_pull_core", "clean_core", "setup_core_dist", and "build_k3".
- "npm run run_built_k3": runs the created K3 .exe



# Development


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




## Common issues with node:

When running the command `npm run update` a lot of packages fail to be upgraded due to EACCESS errors
1. Try running `sudo chown -R [username] /home/[username]/.npm` to make sure that npm has access to edit the files.

## Other documents
Some extra installation & setup instructions:
https://docs.google.com/document/d/1cv6Vt2i1TBBX3FfVmVyhCD3V0fwWm9nwvP3a_XmkBm0/edit?usp=sharing

A document with some of the priorities & todos:
https://docs.google.com/document/d/1l7COOy2fvlj_OOyijTg_mQJZJnLCLZDThMRwGygTTTQ/edit?usp=sharing


#### macOS:
Current development takes place primarily on a 10.8.5 Mac OS X machine.  I needed to install xcode 5.1.1:
https://teamtreehouse.com/community/installing-xcode-on-1085-mac

I also had to manually remove npm from my path by editing the .bash_profile file:
```
# The new path for npm and node:
export PATH="/usr/local/bin/node":$PATH
export PATH="/usr/local/bin/npm":$PATH
# the old path for npm:
# export PATH="/usr/local/share/npm/bin":$PATH
```

I had to uninstall node-gyp:
```
npm uninstall -g node-gyp
```

#### windows (windows 10)
I needed to install visual studio 2015.  There is now a cli tool in preview that can be downloaded and installed instead.
Had a lot of issues with removing the old npm (npm was upgraded to version 3.x.x)

(as of 1/x/2016 the winows 10 computer has nodejs 5.x.x which contains npm version 3.x.x)

#### Linux 32/64 (Both versions of ubuntu).
Current Linux development uses two ubuntu version 14.0.x virtual machines.  The 32bit version is an i686 computer so I had to modify the nave.sh script to get the correct node.js .tar.gz link from node's website.

For both computers I had to uninstall node-gyp:
```
sudo npm uninstall -g node-gyp
```

For the project as a whole, I wrote a npm script:
```
npm run rm_r_node_modules
```
This script goes through each module and deletes the node_modules directory.

The general process of:
1. git pull (on the project manager repo)
2. npm run git_pull (performs a git pull in each found directory)
3. npm run rm_r_node_modules (the new step)
4. npm run update (performs an npm update in each found directory)

worked to get everything working again on the linux32/linux64 machines to get K3 building again.

Installing node.js from the raw download:
https://blog.wia.io/installing-node-js-on-a-raspberry-pi-3



