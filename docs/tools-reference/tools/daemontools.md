# daemontools

[daemontools](http://cr.yp.to/daemontools.html) is a collection of tools to manage Unix/Linux ***services*** in an easier and cleaner fashion as compared to **inittab** or **init.d**.

The software was developed by [Dan J. Bernstein](http://en.wikipedia.org/wiki/Daniel_J._Bernstein); the last stable release is 0.76 and was published in mid 2001, however, aside for minor changes needed for compilation in newer Linux environments, it is still quite useful. [DJB put the package under the public domain by the end of 2007](http://cr.yp.to/distributors.html), so it is no longer copyrighted and you're free to use it anyway you like.

The documentation included in the package is quite terse. We hope these instructions will help you install and use [daemontools](http://cr.yp.to/daemontools.html).


## Instaling daemontools

Although some Linux distributions have daemontools packaged in its repositories, most of them don't, so you have to compile them by yourself. This is not as hard as it sounds and we'll guide you step by step in this document.

You should have installed the **C development packages**, including **make** for your distribution which allows you to compile C language programs.

You will also need some standard tools like **patch** and **sed** which are usually installed alongside or are easy to install from your distribution standard software repositories.

We will be creating a folder named **soft** to hold the source tarball. You will need root privileges to install the software, so make sure your user is able to use **sudo**.

The next steps, which you can copy and paste into a terminal window allows you to download, patch and install the software. Comments, in lines starting with **#** explain what each step does and are ignored in the terminal (so you can copy and paste all the lines together if you will).

~~~
# download the daemontools source in a 'soft' folder under your home directory
mkdir -pv ${HOME}/soft
cd ${HOME}/soft
wget http://cr.yp.to/daemontools/daemontools-0.76.tar.gz


# create a /package directory which will be used by the compile script 
sudo mkdir -pv /package
sudo chmod -v 1755 /package

# open the package we downloaded
cd /package
sudo tar xvzf ${HOME}/soft/daemontools-0.76.tar.gz
cd admin/daemontools-0.76

# modify error.h so it compiles with newer glibc libraries
sudo sed -i.ORI -es/^extern\ int\ errno\;/#include\ \<errno.h\>/ src/error.h

# compile and install (this may be a long process)
sudo package/install
~~~

In Linux systems that use **inittab**, the installation added a line to **/etc/inittab** like this one:

~~~
SVSV:123456:respawn:/command/svscanboot:123456:respawn:/command/svscanboot
~~~

Otherwise, it added at the bottom of the **/etc/rc.local** file, a line like this one:

~~~
csh -cf '/command/svscanboot &'
~~~

which should start **svscan** on next boot. However **keep reading the next subsection** before rebooting:

### Systems with upstart

If you're using a system which uses [Upstart], you will need to configure an **upstart job** for **svscan** in order to make things work.

Upstart is used in

* Ubuntu 6.10 through 14.10 (Ubuntu 15.10 is expected to adopt **systemd**)
* Fedora 9 through 14 (Fedora adopted **systemd** starting with Fedora 15 release)
* RedHat Enterprise Linux 6 (RHEL 7 adopted **systemd**) and some of its derivatives (like CentOS).

You have to find out, using your distribution documentation, where are upstart job scripts stored (**``man upstart``** may help).

In Ubuntu 6.10 through 9.04 the Upstart job directory was **``/etc/event.d``**. In Ubuntu 9.10 through 14.10, the job directory is **``/etc/init``**.

Make sure the variable **``UPSTARTJOBDIR``** is correctly set in the following lines according to your distribution documentation.

The following lines will create an upstart job which will allow daemontools' svscan process to start at boot time. Copy and paste them all together in a terminal window:

~~~
# Make sure the following line assigns the correct value to the UPSTARTJOBDIR
# variable according to your distribution's Upstart documentation
UPSTARTJOBDIR=/etc/init


# You have to copy and paste ALL the following lines together
# up to the one that only says EOF
sudo sh -c "cat > ${UPSTARTJOBDIR}/svscan.conf" <<EOF
# svscan - djb daemontools
#
# This service starts daemontools from the point the system is
# started until it is shut down again.


start on filesystem
stop on runlevel [06]

respawn
exec /command/svscanboot
EOF
~~~

You can now reboot your system in order to start the [daemontools](http://cr.yp.to/daemontools.html)

### Installing man pages
The  don'[daemontools](http://cr.yp.to/daemontools.html)t include man(ual) pages since DJB only wrote HTML documentation. [Gerrit Pape](http://smarden.org/pape/) transcribed [DJB's documentation into manual pages](http://smarden.org/pape/djb/) that you can install in your system.

Follow these steps:

~~~
# download the manpages
cd ${HOME}/soft
wget http://smarden.org/pape/djb/manpages/daemontools-0.76-man.tar.gz
# extract them
tar xvzf daemontools-0.76-man.tar.gz
cd daemontools-man
# compress them
gzip *.8
# install them
sudo cp *.8.gz /usr/share/man/man8
~~~

### Installing tai64nfrac

[multilog](http://cr.yp.to/daemontools/multilog.html), the logging utility included in [daemontools](http://cr.yp.to/daemontools.html) uses a format called [TAI64N](http://cr.yp.to/libtai/tai64.html) for timestamps in log files. The [tai64nlocal](http://cr.yp.to/daemontools/tai64nlocal.html) also included in [daemontools](http://cr.yp.to/daemontools.html) translate this format into human readable text.

However, there are lots of log management tools in Unix and Linux that expect an *epoch* based timestamp (the number of seconds since, usually, the begininning of 1970).

[Russ Albery](http://www.eyrie.org/~eagle/) wrote a tool called [tai64nfrac](http://www.eyrie.org/~eagle/software/tai64nfrac/) to convert TAI64N labels into epoch based timestamps (with a fractional part).

Follow these steps to compile and install tai64nlocal and its man page:

~~~
# download the package
cd ${HOME}/soft
wget http://archives.eyrie.org/software/system/tai64nfrac-1.4.tar.gz

# open it
tar xvfz tai64nfrac-1.4.tar.gz 
cd tai64nfrac-1.4

# compile
make

# install
sudo make install
~~~

## Using daemontools

[supervise](http://cr.yp.to/daemontools/supervise.html) monitors a service. It starts the service using a specific ```run``` script and restarts the service if it dies.

[multilog](http://cr.yp.to/daemontools/multilog.html) saves error messages (actually, it saves any output of the process) to one or more logs. It optionally timestamps each line and, for each log, includes or excludes lines matching specified patterns. It automatically rotates logs to limit the amount of disk space used. If the disk fills up, it pauses and tries again, without losing any data.

### Service directory
You need to create a directory for each service you want to control, in it, you have to create an executable script called ```run``` with specific characteristics:

* All output (either standard or error) must go to the standard output of the script
* The script must be replaced by the process you want to control (via ```exec```)
* The process **must always** run in the foreground (that is, it **must not** go into background or be *daemonized*.
* The directory must be owned by **root**, readable and executable by everyone, writeable only by **root** and have the *sticky bit* on.


### Creating a service

Suppose you have a service called **my-service** installed with its configuration under ```/etc/my-service```.

Suppose the executable daemon for the service is ```/usr/lib/my-service/myservd``` which has an option ```--foreground``` which prevents it from going into background.

* Create a service directory for it:
~~~
mkdir -v -m 1755 /etc/my-service/service
~~~

* Create the ```run``` script under the ```/etc/my-service/service``` directory (it **must** be called **```run```**)

     The content of the ```run``` script should be something like this:
     
~~~
# daemontools run script for my-service
#
# combine stderr with stdout
exec 2>&1
#
# LOOKOUT: DON'T PUT a '&' at the end of the command to send it to background
# If the command has a specific option to run in the foreground USE IT
exec /usr/lib/my-service/myservd --foreground <options>
# Nothing under the exec line will ever run
###################################################################
~~~

* Make the script executable
~~~
chmod 755 /etc/my-service/service/run
~~~

* Start the service by simply making a symlink of the service directory into ```/service``` where [svscan](http://cr.yp.to/daemontools/svscan.html) controls it.

~~~
ln -s /etc/my-service/service /service/my-service
~~~

In under five seconds the service will be running. If the service crashes (or you kill it) it will automatically restart in under five seconds.

### Controlling services

#### Quick guide

##### Starting a service
~~~
export SERVICEDIR=<absolute path of the service directory which holds the run script>
export SERVICENAME=<logical name you want to use for the service under /service>
ln -s ${SERVICEDIR} /service/${SERVICENAME}
~~~
Note: on next boot, the service will start automatically

##### Restarting a service
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -t /service/${SERVICENAME}
~~~

##### Stopping a service temporarily
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -d /service/${SERVICENAME}
~~~
Note: on next boot, the service will start automatically

##### Restarting a temporarily stopped service
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -u /service/${SERVICENAME}
~~~

##### Stopping a service completely
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -dx /service/${SERVICENAME} ; rm -fv /service/${SERVICENAME}
~~~
Note: The service will **not** start automatically anymore (you have to symlink it again to ```/service``` if you want to start it again).

##### Stopping a service completely with its associated multilog (for services using multilog)
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -dx /service/${SERVICENAME} /service/${SERVICENAME}/log ; rm -fv /service/${SERVICENAME}
~~~
Note: The service will **not** start automatically anymore (you have to symlink it again to ```/service``` if you want to start it again).

#### Explanation of commands

[svscan](http://cr.yp.to/daemontools/svscan.html) (started at boot time) reads the ```/service``` directory every five seconds and it starts a [supervise](http://cr.yp.to/daemontools/supervise.html) for every subdirectory there. To control services monitored by [supervise](http://cr.yp.to/daemontools/supervise.html) you use the [svc](http://cr.yp.to/daemontools/svc.html) command.

* **svc -u** (*up*): If the service is not already running, start it (by executing the **```run```** script). If the service stops running, restart it.

* **svc -d** (*down*): If the service is running stop it by sending it a **TERM** signal. After the service stops, do not restart it.

* **svc -o** (*once*): If the service is not already running, start it (by executing the **```run```** script). If the service stops running, **do not** restart it.

* **svc -p** (*pause*): Send a **STOP** signal to the process[^1].
[^1]: Note that if you don't also use ```-d```, if the STOP signal makes the process exit, it will restart within five seconds by running the ```run``` script again.

* **svc -c** (*continue*): Send a **CONT** signal to the process.
* **svc -h** (*hangup*): Send a **HUP** signal to the process[^2].
[^2]: Note that if you don't also use ```-d```, if the HUP signal makes the process exit, it will restart within five seconds by running the ```run``` script again.

* **svc -a** (*alarm*): Send an **ALRM** signal to the process.

* **svc -i** (*interrupt*): Send an **INT** signal to the process[^3].
[^3]: Note that if you don't also use ```-d```, if the INT signal makes the process exit, it will restart within five seconds by running the ```run``` script again.

* **svc -t** (*terminate*): Send a **TERM** signal to the process[^4].
[^4]: Note that if you don't use ```-d```, if the TERM signal makes the process exit, it will restart within five seconds by running the ```run``` script again.

* **svc -k** (*kill*): Send a **KILL** signal to the process[^5].
[^5]: Note that if you don't also use ```-d```, if the KILL signal makes the process exit, it will restart within five seconds by running the ```run``` script again.

* **svc -x** (*exit*): Stop running [supervise](http://cr.yp.to/daemontools/supervise.html) as soon as the process terminates[^6].
[^6]: Note that if the service directory is still symlinked to ```/service```, [svscan](http://cr.yp.to/daemontools/svscan.html) will start a new [supervise](http://cr.yp.to/daemontools/supervise.html) within five seconds and the service will start again.

### Using multilog

[multilog](http://cr.yp.to/daemontools/multilog.html) is a logging tool included in [daemontools](http://cr.yp.to/daemontools.html). It keeps a set of logs automatically rotated in a specific directory.

Usually [multilog](http://cr.yp.to/daemontools/multilog.html) reads its standard input (*stdin*) and writes everything in a file called **```current```** in that specific directory.

If you want to log the output of a process you are monitoring with [supervise](http://cr.yp.to/daemontools/supervise.html) you can create a subdirectory called **log** within the service directory and place there a **```run``` script** for the [multilog](http://cr.yp.to/daemontools/multilog.html) service associated with that process.

A typical [multilog](http://cr.yp.to/daemontools/multilog.html) ```run``` script may look like:
~~~
exec setuidgid myserv multilog t s250000 n20 /var/log/my-service
~~~

Note that [multilog](http://cr.yp.to/daemontools/multilog.html) options are the ones *after* the [multilog](http://cr.yp.to/daemontools/multilog.html) command:

* The "**t**" option asks [multilog](http://cr.yp.to/daemontools/multilog.html) to prepend every line with a **timestamp** in [external TAI64N format](http://cr.yp.to/libtai/tai64.html#tai64n). This option, if present, **must** be the first one.

    The [tai64nlocal](http://cr.yp.to/daemontools/tai64nlocal.html) tool (included in [daemontools](http://cr.yp.to/daemontools.html)) is useful to convert these timestamps into human readable form.

* The "**s250000**" option tells [multilog](http://cr.yp.to/daemontools/multilog.html) that when the file reaches 250,000 bytes it must be *rotated*; that is, it must be renamed and start logging into a new **```current```** empty file.

    The old file is renamed (in the same directory) to file whose name starts with a "**@**" and is followed with a timestamp (in [external TAI64N format](http://cr.yp.to/libtai/tai64.html#tai64n)) of the moment when the file was finished followed with "**.s**" if the file was completely and safely processed or with "**.u**" otherwise meaning that there may have been an outage and the file was not completely processed and may be truncated.

    The default value (if you don't specify an "**sXXX**" option) is 99999.

* The "**n20**" option tells [multilog](http://cr.yp.to/daemontools/multilog.html) to keep at most 20 log files in the directory (including **```current```**. When that many log files are in the directory and a new file must be created (because of a rotation), the oldest file is deleted.

    The default value (if you don't specify an "**nXX**" option) is 10.

* The **/var/log/my-service** option tells [multilog](http://cr.yp.to/daemontools/multilog.html) to use that directory to keep all the log files (and some control files of its own).

    You **must not** have more than one [multilog](http://cr.yp.to/daemontools/multilog.html) using a specific directory.

* The [setuidgid](http://cr.yp.to/daemontools/setuidgid.html) right after the **```exec```** is actually another tool in [daemontools](http://cr.yp.to/daemontools.html) which is followed by a ***username*** and a command.

    [setuidgid](http://cr.yp.to/daemontools/setuidgid.html) sets its **uid** and **gid** to that username's and then *```exec```'s* the following.

    This is done in order for [multilog](http://cr.yp.to/daemontools/multilog.html) to run with less privileges. Take into account that the directory where [multilog](http://cr.yp.to/daemontools/multilog.html) is to write its logs **must be** *readable* **and** *writeable* by the user **myserv**.
    
    You can avoid using *```setuidgid myserv```* and [multilog](http://cr.yp.to/daemontools/multilog.html) will run as **root** then.

## Troubleshooting

### readproctitle

There might be the case where you see something is wrong but there is no logging at all. This is probably caused by some problem with one of the [daemontools](http://cr.yp.to/daemontools.html) (likely a permissions problem).

Since the [daemontools](http://cr.yp.to/daemontools.html) themselves don't generate any output, a tool called [readproctitle](http://cr.yp.to/daemontools/readproctitle.html) which is started at boot time maintains an automatically rotated error log from the tools ***in memory***.

You can inspect this log using the **```ps```** command.

[readproctitle](http://cr.yp.to/daemontools/readproctitle.html) changes its command line arguments when it has to display errors. If there are no errors, you will see that [readproctitle](http://cr.yp.to/daemontools/readproctitle.html)'s arguments is the string **```service errors: ```** followed by a couple hundred dots: **```service errors: ......```**(...).

You can use this command to see the errors:

~~~
ps -auxwww |grep readproctitle | grep -v grep
~~~

If there are no errors you will see something like this:

~~~
root       740  0.0  0.0   4192   356 ?        S    Nov17  
 0:00 readproctitle service errors: .....................
.........................................................
.........................................................
.........................................................
.........................................................
.........................................................
.........................................................
.....................................
~~~

Otherwise, you may see errors like this:

~~~
root      1192  0.0  0.2  1336  156 ?        S    May28  
 5:20 readproctitle  service errors: ...ory ../env: file 
does not exist?envdir: fatal: unable to switch to directo
ry ../env: file does not exist?envdir: fatal: unable to s
witch to directory ../env: file does not exist?envdir: fa
tal: unable to switch to directory ../env: file does not 
exist?envdir: fatal: unable to switch to directory ../env
: file does not exist?envdir: fatal: unable to switch to 
directory ../env: file does not exist?
~~~

This shows a repeating message from the [envdir](http://cr.yp.to/daemontools/envdir.html) tool that says "*fatal: unable to switch to directory ../env: file does not exist\n*".

### The service does not start

* Check that [readproctitle](http://cr.yp.to/daemontools/readproctitle.html) is running
* Check the output of [readproctitle](http://cr.yp.to/daemontools/readproctitle.html) using **```ps -auxwww |grep readproctitle | grep -v grep```**
* Is the service outputting stuff to *stderr* and you forgot to put **```exec 2>&1```** in your ```run``` script?

### Restart everything

If [readproctitle](http://cr.yp.to/daemontools/readproctitle.html) or [svscan](http://cr.yp.to/daemontools/svscan.html) are not running, something went really bad and processes will not restart.

In order to restart all of the [daemontools](http://cr.yp.to/daemontools.html) without rebooting the machine you have to be very careful:

* Stop and exit every service and multilog:
~~~
svc -dx /service/* /service/*/log
~~~

* Kill (in this order) the following processes:

    * svcan
 
    * readproctitle

~~~
pkill svscan

pkill readproctitle
~~~

* Check that there are no further [supervise](http://cr.yp.to/daemontools/supervise.html) processes hanging from the **init** process (process id 1)

~~~
ps -auxwww |grep supervise | grep -v grep
~~~

* Restart the svscan upstart service:

~~~
service svscan restart
~~~

* Restart every service:

~~~
svc -u /service/*
~~~

## Further information

1. The official [daemontools](http://cr.yp.to/daemontools.html) page.

2. [daemontools' page](http://thedjbway.b0llix.net/daemontools.html) in [the djb way](http://thedjbway.b0llix.net/).

3. [Debian daemontools packages](http://smarden.org/pape/Debian/daemontools.html) and [man pages](http://smarden.org/pape/djb/) maintained by [Gerrit Pape](http://smarden.org/pape/).

4. [daemontools instructions](https://web.archive.org/web/20131122141020/http://www.bytereef.org/howto/djb/daemontools-install.html) by [Stephan Krah](https://web.archive.org/web/20140518171155/http://www.bytereef.org/)[^7].
[^7]: Site seems to be down as of 2014-11-25. Using links from [The internet archive - archive.org - The Wayback Machine](https://archive.org/)

5. [run scripts samples](http://www.kdegraaf.net/supervise.html) by [Kevin DeGraaf](http://www.kdegraaf.net/).