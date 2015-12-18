# ljswitchboard-project_manager

Orchestrator for LabJack Kipling development.


## Getting Started

```bash
cd ljswitchboard-project_manager
git submodule init
echo 'It is time to get coffee.'
git submodule update
echo 'It is time to get a donut.'
npm run setup
echo 'checkout the master branch for all repositories'
npm run checkout_master
echo 'update all the repositories'
npm run git_pull
```

## Required Node Versions
Windows users should be using node 0.12.7 as of 8/26/2015
Mac & Linux users should be using io.js 1.2.0 as of 8/26/2015
these versions are likely to change.  
running "nave.sh"

### Useful tool for installing node on Mac & Linux
```bash
wget https://raw.github.com/isaacs/nave/master/nave.sh
sudo bash nave.sh usemain 0.10.22
```



## Development


### Test mode

To enter test mode, change `test' in ljswitchboard-project_manager/ljswitchboard-splash_screen/package.json to true. This will:
 - provide mock device connections
 - disable the cache, so that essentially all you need to do make a change is to edit a file and reload the module by clicking on it again. (E.g. just click on the Settings module on the left side of the Kipling window.)
 - uses the data folder `LabJack/K3_DEV` instead of `LabJack/K3`


### Running Kipling

`npm start`


### Things to remember:

When you haven't done much development on a computer and need to catch up that development environment

1. perform `git fetch`/`git pull` on the package manager repo
2. perform `git status` to see what has been changed/what is old.
3. perform `npm run checkout_master` to get all sub-repos to checkout the master branch.
4. perform `npm run git_pull` to instruct all sub-repos to update themselves.
 - if things don't work then there are likely changes that need to be submitted.
5. perform `npm run update` to perform an npm update in all directories.




## Common issues with node:

When running the command `npm run update` a lot of packages fail to be upgraded due to EACCESS errors
1. Try navigating to `home/[username]/.npm` and running `sudo chown -R [username] ./` to make sure that npm has access to edit the files.

## Other documents
Some extra installation & setup instructions:
https://docs.google.com/document/d/1cv6Vt2i1TBBX3FfVmVyhCD3V0fwWm9nwvP3a_XmkBm0/edit?usp=sharing

A document with some of the priorities & todos:
https://docs.google.com/document/d/1l7COOy2fvlj_OOyijTg_mQJZJnLCLZDThMRwGygTTTQ/edit?usp=sharing


### Upgrading to nodejs version 5.x.x
Making this move primarily to get a flatter node_modules directory to prevent the long path issues on windows.

####mac:
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


