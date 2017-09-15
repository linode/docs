# How to install and configure Caddy, running as service from regular user on CentOS 6.8

### This is in-depth guide how to install a modern web server named Caddy as service, that running from regular unprivileged user. You will also obtain a Free SSL-Certificate for a Website automatically.

## Why Caddy?
**Linode presented the unbeatable offer: only for $5/Month you can take true VPS Hosting with 1GB RAM amount, where you get complete control fully administrative root SSH access and the ability to host and manage unlimited websites.**

Apache and Nginx are the two most common web servers in the world. Apache is a classical solution, but due to it's memory consumption (because to it's nature of creating a new process for each request) we will leave it for another occasion. Nginx is very fast and the RAM consumption is very-very low, if we need to serve static pages. But Nginx's configuration is not to easy read and understand, this is why we will try more flexible and clear solution, which is more intended for newbies.

[Caddy](https://caddyserver.com/) is written is Go, open-source and pretty fast web server. If you're looking for low-memory solution the Caddy Web server is the perfect solution. The Caddy's config file has a **very intuitive syntax**, where you can ask your web server which static pages to display or which backend to reverse or which route to handle. Additionally Caddy has a distinct advantage over their competitors: it uses HTTPS by default! A few config file yields a fully renewable(!) SSL-Certificate from [Let's Encrypt](https://letsencrypt.org/). Caddy is the first web server, that can **obtain certificates for you automatically**. And that's not all: Certificates are **automatically renewed in the background** - sounds like magic, isn't it? No CRON scheduling etc. Let's your hands free for other tasks!

### Basic Features

* TLS. Caddy obtains certificates for you automatically using Let's Encrypt.
* Easy configuration with the Caddyfile.
* VIRTUAL HOSTS. Serve multiple sites from the same IP address with one Caddy server.
* Minify static files on-the-fly. Supports CSS, HTML, JS, JSON, SVG and XML.
* HTTP/2. Caddy uses HTTP/2 right out of the box. This will increase the response time of a Website.

and more interesting features, please see the details in the [Official Documentation](https://caddyserver.com/docs)

## Preparing for Installation

{: .note}
>
> When you perform any root tasks with the new user, you will need to use the phrase `sudo` before the command.

Let’s go ahead and edit the sudo configuration. This can be done through the default editor, which in CentOS is **vi**.
Type from root:

      sudo /usr/sbin/visudo

Then find the section called **# User privilege specification**
Under this section, add the line as below, granting all the permissions to you as a new user (**replace** `regularuser` with your real *current* username).
To type in vi, press `a`.

{: .file-excerpt }
/etc/sudoers
:   ~~~ conf
      *\# User privilege specification\*  
      root    ALL=(ALL)       ALL  
      regularuser ALL=(ALL)       ALL
    ~~~

Then find above the line `Defaults	secure_path=...` and let's add to the end of line `:/usr/local/bin`
The line will look like this:
> Defaults	secure_path = /sbin:/bin:/usr/sbin:/usr/bin:/usr/local/bin

Press `Escape`, then type `:w`(press enter), `:q`(press enter)

Done!

To quit from root mode type:

      su regularuser

You are ready to install new software **without** to login as root.

## Installing

To install simple type the following command:

      sudo wget -qO- https://getcaddy.com | bash -s http.minify

The Output might look like this:
> Downloading Caddy for linux/386...
> https://caddyserver.com/download/linux/386?plugins=http.minify
> Extracting...
> Putting caddy in /usr/local/bin (may require password)
> Caddy 0.10.3
> Successfully installed

Then we need to make any changes to system environment. It's strange, but `/usr/local/bin` is missing from superuser `$PATH`.
Let's fix this bug: 

      echo 'pathmunge /usr/local/bin' | sudo tee /etc/profile.d/localbin.sh
      sudo chmod +x /etc/profile.d/localbin.sh

Done!

## Setup

In the next step we will create an unprivileged user, which will be used for running Caddy server. This is necessary for security reasons, because running a server as root is the really bad practice.

      sudo groupadd www-data
      sudo useradd www-data -d /home/www -g www-data -s /sbin/nologin

 In the next few steps we will create a few necessary directories: for caddy config file, log file and for automatic TLS support.

      sudo mkdir -p /etc/caddy
      sudo touch /etc/caddy/Caddyfile
      sudo mkdir -p /etc/ssl/caddy | sudo mkdir -p /var/log/caddy

 To change the owner of these directories and group too let's type:

      sudo chown -R www-data:www-data /etc/caddy
      sudo chown -R www-data:root /etc/ssl/caddy
      sudo chown -R www-data:www-data /var/log/caddy

 We need also to configure Caddy as a service to run at startup.
 
 {: .note}
 >
 > If your VPS is running on CentOS 7 or other system.**d** compatible distro you **don't** need to create a custom init-script. You can create and manage your service *out-of-box*, just follow simple steps from [Official Caddy's System.d Init Guide](https://github.com/mholt/caddy/tree/master/dist/init/linux-systemd). But since we are on CentOS 6 (init.**d** service management), we'll have to find a special workaround. Let's hacking!
 
 Let's type to create a *special* CentOS 6 init-script `sudo nano /etc/init.d` and after that paste the code from the box below:

 {: .file }
 /etc/init.d
 :   ~~~ bash
     #!/bin/sh
     ### BEGIN INIT INFO
     # Provides:          caddy
     # Required-Start:    $local_fs $network $named $time $syslog
     # Required-Stop:     $local_fs $network $named $time $syslog
     # Default-Start:     2 3 4 5
     # Default-Stop:      0 1 6
     # Short-Description: starts the caddy web server
     # Description:       starts caddy using start-stop-daemon
     ### END INIT INFO

     # Original Author: Frédéric Galusik (fredg)
     # Maintainer: Daniel van Dorp (djvdorp)
     # Modified by: Mono Bilişim (monobilisim)
     ## yum install -y daemonize
     # Modified To Run From Unprivileged User: by @coocheenin

     DESC="the caddy web server"
     NAME=caddy
     DAEMON=/usr/local/bin/caddy

     DAEMONUSER=www-data
     PIDFILE=/var/run/$NAME.pid
     LOCKFILE=/var/lock/subsys/$NAME
     LOGDIR=/var/log/caddy
     LOGFILE=$LOGDIR/$NAME.log
     CONFIGFILE=/etc/caddy/Caddyfile
     DAEMONOPTS="-agree=true -conf=$CONFIGFILE -log=$LOGFILE"
     CMD="${DAEMON} ${DAEMONOPTS}"

     USERBIND="setcap cap_net_bind_service=+ep"

     test -x $DAEMON || exit 0

     # Set the CADDYPATH; Let's Encrypt certificates will be written to this directory.
     export CADDYPATH=/etc/caddy/ssl

     # Set the ulimits
     ulimit -n 8192

     start() {
        $USERBIND $DAEMON
        daemonize -u $DAEMONUSER -p $PIDFILE -l $LOCKFILE -o $LOGDIR/stdout -e $LOGDIR/stderr $CMD
     }

     stop() {
        kill -15 $(cat "$PIDFILE")
        rm -f $PIDFILE $LOCKFILE
     }

     status() {
    if [ -f $PIDFILE ]; then
        if kill -0 $(cat "$PIDFILE"); then
            echo "$NAME is running"
        else
            echo "$NAME process is dead, but pidfile exists"
        fi
    else
        echo "$NAME is not running"
    fi
    }

    case "$1" in
    start)
        echo "Starting $NAME"
        start
    ;;
    stop)
        echo "Stopping $NAME"
        stop
    ;;
    status)
        status
    ;;
    *)
        echo "Usage: $0 {start|stop|status}"
        exit 2
    ;;
    esac

    exit 0
    ~~~
 Press `Control+X` to exit, then `Y`(press enter) to write it to disk.
 Don't forget to make it executable:

      sudo chmod +x /etc/init.d/caddy

Whats the difference between this script and init-script from caddy distro? The key command, which starts caddy as daemon, is different.
Since the command `start-stop-daemon` is missing in CentOS 6, daemonize utility was found in replacement.

Let's install with `yum` utility:

      sudo yum install -y daemonize

Then we will activate caddy as a service (daemon) and it might be enabled enabled to start on boot:

      sudo chkconfig --add caddy
      sudo chkconfig --level 2345 caddy on

 Done! Now we can check it like `sudo service caddy status`.
 The output will look like this:
 > caddy is not running

In the next chapter we will try to configure the web server to host a Website.

## Organizing and Managing Directories to Host a Website

We will locate the website directory at **/home/www** location.
Let's type to create a folder (web root):

      sudo mkdir /home/www/site1
 
> **Attention!** The files in your web root can belong to the caddy user (www-data) otherwise your regular user as long as Caddy has READ permission on all files to be served and EXECUTE permission on all directories.

So if you plan to deploy your pages via SFTP-Client as regular user, we must set the following permissions:
(**replace** `regularuser` with your real *current* username)

      sudo usermod -g www-data regularuser
      sudo chown -R regularuser:www-data /home/www/site1
      sudo chmod -R 755 /home/www/site1
      sudo chmod 750 /home/www

Since you are now the website's owner, feel free to create the test page without `sudo` using like this:

      echo '<!doctype html><head><title>Caddy Test Page</title></head><body><h1>Thank You, Matt!</h1></body></html>' >> /home/www/site1/index.htm

Done! In the last chapter below we will configure a web server via Caddyfile.

## Configuring

It's the last and the shortest chapter in this guideline.
Open the Caddyfile you created above like this:

      sudo nano /etc/caddy/Caddyfile

Then type the following text section in curly braces:

{: .file }
/etc/caddy/Caddyfile
:   ~~~ conf
    example.com {  
    root /home/www/site1  
    tls your-email-here@example.com  
    minify  
    }
    ~~~

That's all!

## Let's Start

      sudo service caddy start

Now open your browser and type your domain name with https prefix, like this `https://example.com` You should see a test page **"Thank You, Matt!"** with appreciation to the brilliant software creator, Caddy Author, Matt Holt.

Let's see for a green lock symbol in the URL bar. That’s all, you have successfully integrated Let’s Encrypt SSL-Certificate to your Website. Well done!
