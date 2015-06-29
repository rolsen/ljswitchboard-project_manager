
running "nave.sh"
wget https://raw.github.com/isaacs/nave/master/nave.sh
$ sudo bash nave.sh usemain 0.10.22

Things to remember:
When you haven't done much development on a computer and need to catch up that development environment
1. perform "git fetch"/"git pull" on the package manager repo
2. perform "git status" to see what has been changed/what is old.
3. perform "npm run checkout_master"
4. perform "npm run git_pull"
 - if things don't work then there are likely changes that need to be submitted.
5. perform "npm run update"

Common issues with node:
when running the command "npm run update" a lot of packages fail to be upgraded due to EACCESS errors
1. Try navigating to home/[username]/.npm and running "sudo chown -R [username] ./" to make sure that npm has access to edit the files.