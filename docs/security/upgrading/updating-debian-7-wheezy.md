# How to update your Debian Wheezy to the latest release

One of Debian’s distinguishing features is its release cycle, which makes it a rock-solid Linux distribution. In few words, a stable version is released only when it has been thoroughly well tested and no bugs have been found in any package during a certain period of time, known as the “frozen” state.

Even after the stable version is released, the Debian project continues taking security very seriously and working to fix any security problem or bug that come up and is communicated properly following [the distribution’s reporting process](https://www.debian.org/Bugs/Reporting). 

Thus, in order to keep a Debian system secure and as free from bugs as possible, users and system administrators are advised to update their current Debian installation to the latest release available for the stable version.

### Updating your system to the current Debian Wheezy release

The latest update available for the current stable version can be found at [the Debian Project's official web site](https://www.debian.org/releases/stable/):

![Debian "wheezy" Release Information](http://i62.tinypic.com/23kr7z9.png)

In the above image we can see that, as of today (April 6, 2015) the latest update to the current stable version is Debian **7.8**, released **January 10, 2015**.

### STEP 1 - Run any of the following commands to display your current Debian Wheezy update:
```
lsb_release -a | grep -B3 Codename # Also returns the distribution’s name, release codename, and OS description
```
or
```
cat /etc/debian_version
```

![Current version and release](http://i58.tinypic.com/xakok.png)

(Note that the pipe to `grep` in the first command returns the line where the string **Codename** is found along with the previous 3 lines. You can also run the same command without the pipe to get a full listing of the distribution’s specific information, or just `lsb_release -r` to display only the release number).

### STEP 2 - Check your /etc/apt/sources.list file:

It is essential that you make sure that the following lines are present in your repository listing. Add them if necessary:
```
deb http://ftp.us.debian.org/debian stable main contrib non-free
deb-src http://ftp.us.debian.org/debian stable main contrib non-free
```
### STEP 3 - As root, run:
```
aptitude update
```
to update the list of available packages from the repositories.

Then 
```
aptitude full-upgrade 
```
Note that this command, without further arguments, attempts to upgrade all installed packages to their most recent version, while removing or installing dependency packages as necessary. However, it will not remove any package without prompting you to confirm the removal first (when performing a version or release update, it sometimes becomes necessary to uninstall one package in order to upgrade another). 

As opposed to `aptitude safe-upgrade`, this command (`aptitude full-upgrade`) is able to upgrade packages in such situations.

### STEP 4 - Finally, repeat STEP 1 to verify that your Debian Wheezy installation is now updated:
```
lsb_release -r # Only display the release information
```
![Wheezy is updated](http://i59.tinypic.com/jfc5q8.png)
### CONCLUSION 
In this guide we have discussed why you should always make sure that your Debian system is updated regularly when new releases are made available, and how to do it in 4 simple steps. If you have any questions or comments feel free to let me know.

