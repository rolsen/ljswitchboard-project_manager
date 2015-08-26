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
```


### Use Node 0.10.22

running "nave.sh"

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
3. perform `npm run checkout_master`
4. perform `npm run git_pull`
 - if things don't work then there are likely changes that need to be submitted.
5. perform `npm run update`




## Common issues with node:

When running the command `npm run update` a lot of packages fail to be upgraded due to EACCESS errors
1. Try navigating to `home/[username]/.npm` and running `sudo chown -R [username] ./` to make sure that npm has access to edit the files.
