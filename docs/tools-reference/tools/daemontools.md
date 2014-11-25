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

###Systems with upstart

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

###Installing man pages
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

###Installing tai64nfrac

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

##Using daemontools

[supervise](http://cr.yp.to/daemontools/supervise.html) monitors a service. It starts the service using a specific ```run``` script and restarts the service if it dies.

[multilog](http://cr.yp.to/daemontools/multilog.html) saves error messages (actually, it saves any output of the process) to one or more logs. It optionally timestamps each line and, for each log, includes or excludes lines matching specified patterns. It automatically rotates logs to limit the amount of disk space used. If the disk fills up, it pauses and tries again, without losing any data.

###Service directory
You need to create a directory for each service you want to control, in it, you have to create an executable script called ```run``` with specific characteristics:

* All output (either standard or error) must go to the standard output of the script
* The script must be replaced by the process you want to control (via ```exec```)
* The process **must always** run in the foreground (that is, it **must not** go into background or be *daemonized*.
* The directory must be owned by **root**, readable and executable by everyone, writeable only by **root** and have the *sticky bit* on.


###Creating a service

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

###Controlling services

####Quick guide

#####Starting a service
~~~
export SERVICEDIR=<absolute path of the service directory which holds the run script>
export SERVICENAME=<logical name you want to use for the service under /service>
ln -s ${SERVICEDIR} /service/${SERVICENAME}
~~~
Note: on next boot, the service will start automatically

#####Restarting a service
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -t /service/${SERVICENAME}
~~~

#####Stopping a service temporarily
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -d /service/${SERVICENAME}
~~~
Note: on next boot, the service will start automatically

#####Restarting a temporarily stopped service
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -u /service/${SERVICENAME}
~~~

#####Stopping a service completely
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -dx /service/${SERVICENAME} ; rm -fv /service/${SERVICENAME}
~~~
Note: The service will **not** start automatically anymore (you have to symlink it again to ```/service``` if you want to start it again).

#####Stopping a service completely with its associated multilog (for services using multilog)
~~~
export SERVICENAME=<logical name you use for the service under /service>
svc -dx /service/${SERVICENAME} /service/${SERVICENAME}/log ; rm -fv /service/${SERVICENAME}
~~~
Note: The service will **not** start automatically anymore (you have to symlink it again to ```/service``` if you want to start it again).

####Explanation of commands

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







