---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'Use Fail2ban to block automated system attacks and further harden your server.'
keywords: 'security,linode,fail2ban,ssl,logs,firewalls'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, September 23rd, 2015
modified_by:
  name: Elle Krout
published: 'Wednesday, September 23rd, 2015'
title: Securing Your Server with Fail2ban
---

Fail2ban is a log-parsing application that monitors system logs for symptoms of an automated attack on your Linode. When an attempted compromise is located, using the defined parameters, Fail2ban will add a new rule to iptables, thus blocking the IP address of the attacker, either for a set amount of time or permanently. Fail2ban will also alert you through email that an attack is occurring.

Fail2ban is primarily focused on SSH attacks, although it can be further canfigured to work for any service that uses log files and can be subject to a compromise.

{: .note}
>
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

{: .caution}
>
>Fail2ban is intended to be used in conjunction with an already-hardened server and should not be used as a replacement for secure firewall rules.

## Installing Fail2ban

Follow the [Getting Started](/docs/getting-started) guide to configure your basic server. You may also want to review the [Securing Your Server](/docs/security/securing-your-server) guide before beginning.
        
        
### CentOS 7

1.  Ensure your system is up to date:

        yum update
        
2.  Enable the EPEL repository:

        wget http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-5.noarch.rpm
        rpm -ivh epel-release-7-5.noarch.rpm
        
3.  Install Fail2ban:

        yum install fail2ban
        
4.  (Optional) For email support, install Sendmail:

        yum install sendmail
        
5.  Start and enable Fail2ban and, if needed, Sendmail:

        systemctl start fail2ban
        systemctl enable fail2ban
        systemctl start sendmail
        systemctl enable sendmail

### Debian

1.  Ensure your system is up to date:

        apt-get update && apt-get upgrade -y
        
2.  Install Fail2ban:

        apt-get install fail2ban
        
    The service will automatically start.
    
3.  (Optional) If you wish to avail email support, install Sendmail:

        apt-get install sendmail-bin sendmail
        
        
### Fedora

1.  Update your system:

        dnf update
        
2.  Install Fail2ban:

        dnf install fail2ban
        
3.  (Optional) If you wish to avail email support, install Sendmail:

        dnf install sendmail
        
4.  Start and enable Fail2ban and, if needed, Sendmail:

        systemctl start fail2ban
        systemctl enable fail2ban
        systemctl start sendmail
        systemctl enable sendmail
        

### Ubuntu

1.  Ensure your system is up to date:

        apt-get update && apt-get upgrade -y
        
2.  Install Fail2ban:

        apt-get install fail2ban
        
    The service will automatically start.
    
3.  (Optional) If you wish to avail email support, install Sendmail:

        apt-get install sendmail
        
4.  Ensure UFW is enabled, and you have SSH access to the server:

        ufw enable
        ufw allow ssh
    
## Configuring Fail2ban

Fail2ban reads its configuration files so that all `.conf` files are read first and `.local` files override any settings. Because of this, all changes to the configuration are generally done in `.local` files, leaving the `.conf` files untouched.

### fail2ban.local Configuration

1.  Navigate to `/etc/fail2ban`. Within this directory are all configuration files.

        cd /etc/fail2ban

2.  Copy `fail2ban.conf` to `fail2ban.local`:

        cp fail2ban.conf fail2ban.local
        
3.  Open `fail2ban.local` in your chosen text editor. This file contains configuration for Fail2ban logging, the socket used to communicate with the daemon, and the location of the PID file. The values that can be changed within the `fail2ban.local` file are as follows:

    -   `loglevel`: The level of detail that Fail2ban's logs provide can be set to 1 (error), 2 (warn), 3 (info), or 4 (debug).
    -   `logtarget`: Logs actions into a specific file. The default value of `/var/log/fail2ban.log` puts all logging into the defined file. Alternately, you can change the value to STDOUT, which will output any data; STDERR, which will output any errors; SYSLOG, which is message-based logging; and FILE, which outputs to a file.
    -   `socket`: The location of the socket file.
    -   `pidfile`: The location of the PID file.

### jail.local Basic Configuration

1.  Return to `/etc/fail2ban` directory and copy the `fail.conf` file to `jail.local`:

    cp jail.conf jail.local
    
2.  **If using Arch, CentOS or Fedora** open `jail.local` and set the `backend` to `systemd`. This is not necessary on Debian 8, even though it is a SystemD system.

    {: .file-excerpt}
    /etc/fail2ban/jail.local
    :   ~~~
        backend = systemd
        ~~~
        
#### IP Whitelisting        

Add any IPs to the `ignoreip` line that you wish Fail2ban to ignore. By default, this command will not ban the localhost. If you work from a single IP address often, it may be beneficial to add it to the ignore list:

{: .file-excerpt}
/etc/fail2ban/jail.local
:   ~~~ conf
    [DEFAULT]

    # "ignoreip" can be an IP address, a CIDR mask or a DNS host. Fail2ban will not
    # ban a host which matches an address in this list. Several addresses can be
    # defined using space separator.
    ignoreip = 127.0.0.1/8 123.45.67.89
    ~~~
    
If you wish to whitelist IPs only for certain jails, this can be done with the `fail2ban-client` command. Replace `JAIL` with the name of your fail, and `123.45.67.89` with the IP you wish to whitelist.

    fail2ban-client set JAIL addignoreip 123.45.67.89   
    
        
#### Ban Time and Retry Amount

The `bantime`, `findtime`, and `maxretry` then need to be set. These are the values that define the circumstances and the length of time of a ban.

{: .file-excerpt}
/etc/fail2ban/jail.local
:   ~~~ conf
    # "bantime" is the number of seconds that a host is banned.
    bantime  = 600
    
    # A host is banned if it has generated "maxretry" during the last "findtime"
    # seconds.
    findtime = 600
    maxretry = 3
    ~~~

-   `bantime`: The length of time in seconds for which an IP is banned. If set to a negative number, the ban will be permanent. The default value of `600` is set to ban an IP for a 10-minute duration.
    
-   `findtime`: The length of time between login attempts before a ban is set. For example, if Fail2ban is set to ban an IP after five (5) failed log-in attempts, those 5 attempts must occur within the set 10-minute `findtime` limit. The `findtime` value should be a set number of seconds.
    
-   `maxretry`: How many attempts can be made to access the server from a single IP before a ban is imposed. The default is set to 3.
    

#### Email Alerts

If you wish to receive email when Fail2ban is triggered, adjust the email settings:

-   `destemail`:  The email address where you would like to receive the emails.
    
-   `sendername`: The name under which the email shows up.
    
-   `sender`: The email address from which Fail2ban will send emails.
    
{: .note}
>
>If unsure of what to put under `sender`, run the command `sendmail -t user@email.com`, replacing `user@email.com` with your email address. Check your email (including spam folders, if needed) and review the sender email. This address can be used for the above configuration.
    
You will also need to adjudst the `action` setting, which defines what actions occur when the threshold for ban is met. The default, `%(action_)s`, only bans the user. `action_mw` will ban and send an email with a WhoIs report; while `action_mwl` will ban and send an email with the WhoIs report and all relevant lines in the log file. This can also be changed on a jail-specific basis.
    
### Jail Configuration

Beyond the basic settings address above, `jail.local` also contains various jail configurations for a number of common services, including SSH. By default, only SSH is enabled.

An average jail configuration will resemble the following:

{: .file-excerpt}
/etc/fail2ban/jail.local
:   ~~~
    [ssh]
    
    enabled  = true
    port     = ssh
    filter   = sshd
    logpath  = /var/log/auth.log
    maxretry = 6
    ~~~

-   `enabled`: Determines whether or not the filter is turned on.
-   `port`: The port Fail2ban should be referencing in regards to the service. If using the default port, then the service name can be placed here. If using a non-traditional port, this should be the port number. For example, if you moved your SSH port to 3456, you would replace `ssh` with `3456`.
-   `filter`: The name of the file located in `/etc/fail2ban/filter.d` that contains the failregex information used to parse log files appropriately. The `.conf` suffix need not be included.
-   `logpath`: Gives the location of the service's logs.
-   `maxretry`: Will override the global `maxretry` for the defined service. `findtime` and `bantime` can also be added.
-   `action`: This can be added as an additional setting, if the default action is not suitable for the jail. Additional actions can be found in the `action.d` folder.

{: .note}
>
>Jails can also be configured as individual `.conf` files placed in the `jail.d` directory. The format will remain the same.


## Failregexs

Although Fail2ban comes with a number of filters for use, you may want to further customize these filters or create your own to suit your needs. Fail2ban uses *regular expressions* (*regex*) to parse log files, looking for instances of attempted break-ins and password failures. Fail2ban uses Python's regex extensions.

The best way to understand how failregex works is to write one. Although we do not advise having Fail2ban monitor your Wordpress' `access.log` on heavily-trafficked websites due to CPU concerns, it provides an instance of an easy-to-understand log file that you can use to learn about the creation of any failregex.
### Writing the Regex

1.  Navigate to your website's `access.log` (generally located at `/var/www/example.com/logs/access.log`) and find a failed login attempt. It will resemble:

    {: .file-excerpt}
    /var/www/example.com/logs/access.log
    :   ~~~ log
        123.45.67.89 - - [01/Oct/2015:12:46:34 -0400] "POST /wp-login.php HTTP/1.1" 200 1906 "http://example.com/wp-login.php" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0"
        ~~~
        
    Note that you will only need to track up to the `200`:

    {: .file-excerpt}
    /var/www/example.com/logs/access.log
    :   ~~~ log
        123.45.67.89 - - [01/Oct/2015:12:46:34 -0400] "POST /wp-login.php HTTP/1.1" 200
        ~~~

2.  The IP address from where the failed attempt originated will always be defined as `<HOST>`. The subsequent few characters are unchanging and can be input as literals:

        <HOST> - - \[
            
    The `\` before the `[` denotes that the square bracket is to be read literally.
    
3.  The next section, the date of the login attempt, can be written as grouped expressions using regex expressions. The first portion, `01` in this example, can be written as `(\d{2})`: The parentheses group the expression, while `\d` looks for any numerical digits. `{2}` notes that the expression is looking for two digits in a row, i.e., the day of the month.

    Thus far, you should have:
    
        <HOST> - - \[(\d{2})
        
    The following forward slash will then be called with a literal forward slash, followed by `\w{3}` which looks for a series of `3` apha-numeric characters (i.e., A-Z, 0-9, any case). The following forward slash should also be literal:
    
        <HOST> - - \[(\d{2})/\w{3}/
        
    The section for the year should be written similar to the day, but without the need for a capture group, and for four consecutive characters (and a literal colon):
    
        <HOST> - - \[(\d{2})/\w{3}/\d{4}:
        
4.  The next sequence is a series of two-digit numbers that make up the time. Because we defined the day of the month as a two-digit number in a capture group (the parentheses), we can back-reference it using `\1` (since it is the *first* capture group). Again, the colons will be literals:

        <HOST> - - \[(\d{2})/\w{3}/\d{4}:\1:\1:\1 
    
    If you do not want to use backreferences this can also be written as:
    
        <HOST> - - \[\d{2}/\w{3}/\d{4}:\d{2}:\d{2}:\d{2}
        
5.  The `-0400` segment should be written similarly to the year, with the additional literal `-`: `-\d{4}`. Finally, you can close the square bracket (escaping with a backslash first), and finish the rest with the literal string:

        <HOST> - - \[(\d{2})/\w{3}/\d{4}:\1:\1:\1 -\d{4}\] "POST /wp-login.php HTTP/1.1" 200
        
    Or:
        
        <HOST> - - \[\d{2}/\w{3}/\d{4}:\d{2}:\d{2}:\d{2} -\d{4}\] "POST /wp-login.php HTTP/1.1" 200
        
### Using the Failregex

With the failregex created, it then needs to be added to a filter.

1.  Navigate to Fail2ban's `filter.d` directory:

        cd /etc/fail2ban/filter.d
        
2.  Create a file called `wordpress.conf`, and add your failregex:

    {: .file}
    /etc/fail2ban/filter.d/wordpress.conf
    :   ~~~ conf
        # Fail2Ban filter for WordPress
        #
        #
        
        [Definition]
        
        failregex = <HOST> - - \[(\d{2})/\w{3}/\d{4}:\1:\1:\1 -\d{4}\] "POST /wp-login.php HTTP/1.1" 200
        ~~~
        
    Save and quit.
    
3.  Add a WordPress section to `jail.local`:

    {: .file-excerpt}
    /etc/fail2ban/jail.local
    :   ~~~ conf
        [wordpress]
        enabled  = true
        filter   = wordpress
        logpath  = /var/www/html/andromeda/logs/access.log
        ~~~
        
    This will use the default ban and email action. Other actions can be defined by adding an `action =` line.
    
    Save and exit, then restart Fail2ban.


## Using the Fail2ban Client

Fail2ban provides a command `fail2ban-client` that can be used to run Fail2ban from the command line. The input should be as follows: 

    `fail2ban-client COMMAND`

-   `start`: Starts the Fail2ban server and jails.
-   `reload`: Reloads Fail2ban's configuration files.
-   `reload JAIL`: Replaces `JAIL` with the name of a Fail2ban jail; this will reload the jail.
-   `stop`: Terminates the server.
-   `status`: Will show the status of the server, and enable jails.
-   `status JAIL`: Will show the status of the jail, including any currently-banned IPs.

For additional information about `fail2ban-client` commands, see the [Fail2ban wiki](http://www.fail2ban.org/wiki/index.php/Commands).
