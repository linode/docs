# Supervise programs with daemontools

There's no lack of programs out there to supervise long-running applications: Upstart, supervisord, systemd, and daemonize just to name a few. For many system administrators, it's a matter of what they know and what they're comfortable with. Daemontools has been around for a long time (over 10 years) and it's great at one thing: monitoring a process and restarting it if it dies.

In addition, daemontools supports logging (including rotation) via `multilog`, running services as specific users via `setuidgid`, setting environment variables via `envdir` and it includes several other helpful tools which you can read about on the [daemontools page](http://cr.yp.to/daemontools.html).

## Getting started

Due to its age, daemontools requires a patch to compile on most modern Linux and Unix-like operating systems (don't let this deter you from using it). Daemontools also has a bit of a quirky install process that may be unexpected unless you're new to Linux and Unix-like system administration.

## Install daemontools  

Make a temporary install directory
```
> mkdir daemontools_inst
```

Enter the directory and then download both the daemontools source and the errno patch. Then extract the daemontools source.
```
> cd daemontools_inst
> curl -LO http://cr.yp.to/daemontools/daemontools-0.76.tar.gz 
> curl -LO http://www.qmail.org/moni.csi.hu/pub/glibc-2.3.1/daemontools-0.76.errno.patch
> tar zxvf daemontools-0.76.tar.gz 
```

Apply the patch and run the install script. This will install the daemontools binaries to `/command` with symlinks to `/user/local/bin/`. `/service` and `/package` directories will also be created.
```
> cd admin/daemontools-0.76
> patch -p1 < ../../daemontools-0.76.errno.patch
> package/install
```

## Start daemontools

The installation script will try to automatically start daemontools now **and** at boot time. If it's unable to, you'll have to start it manually.
```
csh -cf '/command/svscanboot &'
```

By default, the install script will try to put this in `/etc/rc.local`.

You can refer to the [How to start daemontools](http://cr.yp.to/daemontools/start.html) page for more options.

## Creating a service

All programs supervised by daemontools **must** run in the foreground.

daemontools uses run scripts to supervise processes and these will live in the `/service` directory that was created during the installation process.

***Important***  
The `svscan` program constantly monitors the `/service` directory and will automatically start any services with run scripts.

As an example, we're going to create a supervised NGiNX service. But before we can do that, since NGiNX daemonizes itself by default, we'll need to force it to remain in the foreground. NGiNX has a configuration option that allows us to do that:
```
> echo "daemon off;" >> /etc/nginx/nginx.conf
```

Now that we have a supervisable program, let's create a service.

Create a new service directory with a nested log directory (if you don't create the log directory right away, daemontools seems to have a hard time finding it without completely restarting `svscan`).
```
> mkdir -p /service/nginx/log
```

Create the file `/service/nginx/run` with the following content:
```
#!/bin/bash
# Redirect STDERR to STDOUT for logging
exec 2>&1
# Run nginx
exec /usr/local/nginx/sbin/nginx 
```

Create the file `/service/nginx/log/run` with the following content:
```
#!/bin/bash
exec setuidgid [user] multilog t ./main
```

Replace `[user]` with a user account that has permission to write to `/service/nginx/log/`.  

`multilog t ./main` uses the `multilog` program to write logs to the directory `main`. The `t` option prepends a `tai64nlocal` timestamp to each log entry. For more multilog options, see [Multilog](http://cr.yp.to/daemontools/multilog.html).

Now that both `/service/nginx` and `/service/nginx/log` contain run scripts, we need to make them executable.
```
chmod +x /service/nginx/run /service/nginx/log/run
```

We can use `svstat` to check the status of a service:
```
> svstat /service/nginx
/service/nginx: up (pid 12200) 15 seconds
```

If you don't see a similar message or it remains at 0 seconds, your service wasn't able to start. There are a few ways to debug:
1. Look at the service log: `tail /service/nginx/log/main/current`
2. Look at the readproctitle process via `ps auwx | grep readproctitle`

Once your service is running, you can do the following:  
**Take the service down (stop it)**: `svc -d /service/nginx`  
**Bring the service up (start it)**: `svc -u /service/nginx`  
**Send the KILL signal (restart it)**: `svc -k /service/nginx`  
**Send the TERM signal**: `svc -t /service/nginx`  

See [The svc program](http://cr.yp.to/daemontools/svc.html) for all of the available options.

## Final thoughts

daemontools is a stable and solid program for supervising processes. While it had a rocky history, as of 2007 the code was released in the public domain, offering more freedom an ease of adoption. Being written in C also gives it some degree of added safety and stability that other supervisors lack.

