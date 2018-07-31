# Getting set up


## Instructions

First, install the [LJM library](https://labjack.com/support/software/installers/ljm). Then:


1. Install Project Building Dependencies
 Setup Node, git, and some other things on your computer.  LJ-ers, check out the QMS-xxx~new computer for details.  Others, feel free to email us and we can make a public document.  The first few following steps are windows only.
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
2. Clone this repository: [https://github.com/rolsen/ljswitchboard-project_manager](https://github.com/rolsen/ljswitchboard-project_manager)
```bash
git clone https://github.com/rolsen/ljswitchboard-project_manager
```
3. Navigate into the project
```bash
cd ljswitchboard-project_manager
```
4. Initialize the git sub-modules
```bash
git submodule init
git submodule update
```
5. Checkout the master branch for all repositories by running  "git checkout master" in each of the sub-module directories.
```bash
npm run checkout_master
```
6. Update all the repositories by running the command "npm run git_pull" in each sub-module directory.
```bash
npm run git_pull
```
7. Execute the "npm install" instruction in each of the sub-modules.  This can be done with two options:
    a. In order to set up a computer for development,
    ```bash
    npm run setup
    ```
    b. In order to set up a computer with the core components, the bare minimum to be able to run and build the project:
    ```bash
    npm run setup_core
    ```
8. After the last step has finished (it takes quite a while) start Kipling by running the command "npm start".
```bash
npm start
```
9. Optionally, enable [testing mode](https://github.com/rolsen/ljswitchboard-project_manager/blob/master/README.md#test-mode).

10. Run `npm start`





## Required Node Versions
As of 2/22/2018, Windows/Mac/Linux users should be using node.js 6.6.0. This version is likely to change to newer versions over time.  A nice tool to install node on mac/linux computers is a script called "nave".  Instructions are included below:

## Running "nave.sh"

"nave.sh" is a useful tool for installing node on Mac & Linux.
```bash
wget https://raw.github.com/isaacs/nave/master/nave.sh
sudo bash nave.sh usemain 0.10.22
```





## Common issues with node:

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
npm run clean
```
This script goes through each module and deletes the node_modules directory.

The general process of:
1. git pull (on the project manager repo)
2. npm run git_pull (performs a git pull in each found directory)
3. npm run clean (the new step)
4. npm run update (performs an npm update in each found directory)

worked to get everything working again on the linux32/linux64 machines to get K3 building again.

Installing node.js from the raw download:
https://blog.wia.io/installing-node-js-on-a-raspberry-pi-3


