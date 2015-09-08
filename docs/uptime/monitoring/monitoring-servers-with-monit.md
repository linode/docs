
---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Improve server uptime with Monit'
keywords: 'Monit,monitoring,error handling,process restart'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Friday, September 18th, 2015'
modified: Tuesday, September 8th, 2015
modified_by:
    name: Linode
title: 'Monitoring servers with Monit'
contributor:
    name: Bill Bardon
    link: 
external_resources:
 - '[Monit Documentation](https://mmonit.com/monit/documentation/monit.html)'
 - '[Email-to-SMS gateways - Wikipedia](https://en.wikipedia.org/wiki/SMS_gateway)'
---

#Monitoring servers with Monit

Keeping tabs on your servers can be time-consuming. You need to make sure connectivity is good, processes are running but not running away, resources are available, and system health is good. Whether you have one server or many, it's something you may not do as often as you should. 

Monit can watch your servers for you. You can tell Monit exactly what you would do if a program stops running, or begins using too much RAM, or another host becomes unreachable. Monit will watch around the clock, and respond to out-of-the-norm events by following your instructions.

Automatic process maintenance in a lightweight package
Can act on out-of-bounds values for CPU, RAM, disk, file size, age, more
Watches running services, can start, kill or restart
Sends alerts by email on event triggers
Web interface for status monitoring
Available from main package repositories

{: .note}
>
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Install

Use your OS's package manager to fetch the monit package and install it. On Debian derivatives (Ubuntu, Debian itself), type `apt-get install monit`. On RedHat and CentOS, type `yum install monit`.

If you choose to implement the web interface, be sure the port Monit uses (default 2812) is exposed to the devices on which you'll be viewing it. You may need to configure your firewall package or iptables if you have a default deny policy. See [Securing Your Server - Creating a Firewall](https://www.linode.com/docs/security/securing-your-server#creating-a-firewall). 


##Configure

Monit's configuration is in the file `/etc/monit/monitrc`. Open this file now in your favorite text editor. We'll start by setting up the monit process itself. Most of these settings (except where `anonymized`) are currently in use on my own Linode mail server.

###Monit behavior

####Startup

    set daemon 300

This is the interval (in seconds) at which Monit runs its tests. The value you choose will depend on how many tests you define, how quickly you need Monit to act on events, and how much load the tests themselves add to your server. Run Monit at the default two minutes and evaluate its performance. If you change this value, you will need to restart Monit: `service monit restart` on Debian 7, `systemctl restart monit` on Debian 8 running _systemd_.

I set the interval at 5 minutes, because minimizing the load on my server is more important to me than instant alerts and responses.

Include the delay line

    set daemon 300
        with start delay 240

to have Monit delay starting on system boot. Other processes may take some time to complete their own startup, and this will prevent Monit from alerting that all services are down every time you boot the server.

####Alerting

Monit can optionally alert you by email when it triggers on an event. It can use a Mail Transfer Agent (MTA) on the local host if you have one configured, or an outside mail server that will accept incoming SMTP traffic from your host. See [Linux System Administration Basics - Sending Email From Your Server](https://www.linode.com/docs/tools-reference/linux-system-administration-basics#sending-email-from-your-server) for help with configuring this.

Specify what server you will send mail through on this line

    set mailserver mail.example.com

If you need to specify a port other than the default for SMTP (25), add it following the server name

    set mailserver mail.example.com port 2025

You can also specify multiple mail servers by entering more than one server name, separated by comma:

    set mailserver mail.example.com, backupmail.example.com
    
Monit will try each server in turn until one succeeds. It will **not** _retry_ if no servers succeed, unless you also configure the event queue. To do this, you specify a directory to store the undelivered messages, and how many messages you want to allow to queue up. The config file defaults are normally adequate:

    set eventqueue
        basedir /var/lib/monit/events
        slots 100

Enter the email address to which Monit should deliver its alerts:

    set alert your.email@example.com

If you prefer to receive alerts as text messages, use your cell provider's email-to-text gateway if they provide one. Wikipedia has a list of providers here: [Email-to-SMS gateways](https://en.wikipedia.org/wiki/SMS_gateway#Use_with_email_clients).

####Web service

Finally, as far as configuring Monit itself, you can enable the embedded web server to display all your system tests as a web page.

    set httpd port 2812

If there is no other web server running on your host, Monit can run on port 80 if you specify `port 80` in the config file.

You can optionally restrict access to the web interface to just your IP address.

    set httpd port 2812
        allow 10.0.0.1 (your ip address)
    
###Checking system values

Monit can watch server resource utilization and alert when your server is under unusual load.

    check system mail
        if loadavg (5min) > 2.0 then alert
        if memory usage > 85% then alert
        if cpu usage (user) > 60% then alert

Here I have asked Monit to alert if the load average, total system memory use or CPU usage exceed the specified limits. You should set these limits based on your server's normal operating values. 

A good way to determine the alert thresholds is to set them low (you will receive frequent alerts) and then adjust them higher if alerts are more frequent than the situation requires. The actual tested values which triggered the alert will be included in the alert message, and you can use these to gauge what is a good threshold limit for your server.

###Checking processes

Most servers are running a set of critical services that are their reason for existing. If those services are not running and reachable, the server is down for all practical purposes. Monit can check on running processes and stop, start or restart them as needed.

    check process apache-server with pidfile /run/apache2.pid
        if cpu > 95% for 3 cycles then alert

For the `check process` statement, Monit requires an associated .pid file. Many common Linux server programs put a .pid file within the `/run` directory (`/var/run` on earlier Debian versions.) You can look for the location of the .pid file in your program's documentation, man page, or init script. In this example, the apache2 process uses a file named apache2.pid in the `/run` directory. I have asked Monit to alert if this apache process starts to use too much CPU for a minimum of 3 cycles. As I defined `set daemon 300` in the global configuration, if apache uses more than 95% CPU for 3 x 300 seconds, or 15 minutes, then Monit will trigger.

You can test more than one parameter in a single check statement. The apache program spawns children as needed to serve requests. If a large number of requests come in and continue unabated for 25 minutes, the test added here will alert on it.

    check process apache-server with pidfile /run/apache2.pid
        if children > 255 for 5 cycles then alert
        if cpu usage > 95% for 3 cycles then alert



Monit can do more than simply check the resource utilization of a process. It supports a number of protocols for testing the actual connectivity of a service. Among them are DNS, HTTP, IMAP, SMTP, LDAP, and SSH. So we can ask our apache server for a response and act on the result.

    check process apache-server with pidfile /run/apache2.pid
        start program = "systemctl start apache2" with timeout 40 seconds
        stop program  = "systemctl stop apache2"
        if children > 255 for 5 cycles then alert
        if cpu usage > 95% for 3 cycles then alert
        if failed port 80 protocol http then restart

OK, a lot is happening in the newly added lines of this check statement, including the best feature of Monit, automated process management. First, I told Monit how to start and stop the process I am checking. Then I've asked Monit to use HTTP on port 80 to send a GET request to this running instance of apache. By default it will send a normal 'GET "/"' request. If apache returns an HTTP status code of 400 or greater, Monit will alert _and_ restart the process using the commands given. 

The commands shown above are systemd compatible for Debian 8. If your server is Debian 7, use these instead:

        start program = "service apache2 start" with timeout 40 seconds
        stop program  = "service apache2 stop"

###Checking the filesystem

Monit can check filesystem properties such as whether a file exists, if its size is larger or smaller than specified, and what permissions it is assigned. A useful application is to test the timestamp of log files that should be updating. 

    check file mail.log with path /var/log/mail.log
        if timestamp > 10 minutes then alert

This mail server is normally busy around the clock. If the mail.log file has not been touched for ten minutes something is probably wrong and I want to know about it.

You can also use it to confirm that cron jobs have completed correctly. Add a line in your job script (that will only be reached upon success) to `touch <filename>`, then have Monit check the file's timestamp age. If it's an hourly job, use a value "> 65 minutes". If it's an overnight job, use "> 25 hours". The extra margin allows for some variability in job time-to-complete.

So for example, I have a nightly backup script that cron runs in the wee hours. In that script is a line that only executes on a successful backup:

    touch /tmp/backup-ok

Then in monitrc I have:

    check file nightly-backup with path /tmp/backup-ok
        if timestamp > 25 hours then alert

If the backup does not complete, then the next morning I will have an alert message waiting for me, and the server's Monit web page will show nightly-backup with a red status of "Timestamp failed".

###Checking other hosts

Perhaps you are not a system admin at all, you are a web designer who works with many client sites on different hosts. It would be nice to proactively respond to site outages even before the client calls, wouldn't it? Configure Monit to check all your client sites' status and alert you immediately if they are down:

    check host web-server with address www.example.com
        if failed port 80 protocol http with timeout 30 seconds then alert

Monit can test many protocols, not just HTTP:

    check host mail-server with address mail.example.com
        if failed port 143 protocol IMAP with timeout 30 seconds then alert
        if failed port 587 protocol SMTP with timeout 30 seconds then alert
        if failed port 22 protocol ssh with timeout 20 seconds then alert

If you have more than one server, it's a good idea to have them monitor each other. If you only run Monit on one host, and that host goes completely off-line, Monit will be unable to notify you about the problem. Running a second instance of Monit on another server, you can set up each one to alert if the other one goes off-line.

Note that it is possible to change the alert recipient from the globally-defined address in the `set alert` statement, to another recipient using the `noalert` keyword. 

    check host web-server with address www.example.com
        if failed port 80 protocol http with timeout 30 seconds then alert
        alert someone.else@example.com
        noalert your.email@example.com

##More Monit

Monit is highly configurable and its capabilities go beyond what I have touched on here. If you want to understand Monit more fully, you will find more information in the Monit documentation, linked below. It's lengthy but detailed and well organized.
