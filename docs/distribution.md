# Building Kipling for distribution

After running the setup instructions, you can run the "npm run setup" command (or `npm run setup_core`), then run the command "npm run prep_build_and_run".
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
4. run "npm run clean" to delete all sub-module's node_modules folders.
5. run "npm run setup" to install all of the sub-modules.
 - You should probably go get beer at this point.  This takes a while...
6. Navigate into the ljswitchboard-build directory and run "npm run build_project" to build the project.  The output files will exist in the /output folder.



## Building & Releasing (12/1/2017)
1. git pull // update -project_manager
2. npm run build // runs git_pull_core, prep_build_and_run
When finished, this will launch the built version of Kipling.  A compressed version of Kipling is also created and is ready to be uploaded to github for release.

### Debugging building.
If things aren't working properly, run:
1. npm run git_pull // to pull all latest project changes.
2. npm run setup // to run npm install everywhere.

