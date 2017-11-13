---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'This guide shows how to set up Fail2Ban, a log-parsing application, to monitor system logs and detect automated attacks on your Linode.'
og_description: 'Fail2ban monitors system logs for symptoms of an automated attack, bans the IP and alerts you of the attach through email. This guide helps you set up Fail2ban to thwart automated system attacks and further secure your server.'
keywords: ["fail2ban", "ip whitelisting", "jail.local"]
aliases: ['tools-reference/tools/using-fail2ban-to-block-network-probes/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-08-23
modified_by:
  name: Linode
published: 2015-10-12
title: Use Fail2ban to Secure Your Server
---

## What is Fail2Ban

Fail2ban is a log-parsing application that monitors system logs for symptoms of an automated attack on your Linode. When an attempted compromise is located, using the defined parameters, Fail2ban will add a new rule to iptables to block the IP address of the attacker, either for a set amount of time or permanently. Fail2ban can also alert you through email that an attack is occurring.

![Using Fail2ban to secure your server](/docs/assets/fail2ban_tg.png "Using Fail2ban to secure your server")

Fail2ban is primarily focused on SSH attacks, although it can be further configured to work for any service that uses log files and can be subject to a compromise.

{{< note >}}
The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

{{< caution >}}
Fail2ban is intended to be used in conjunction with an already-hardened server and should not be used as a replacement for secure firewall rules.
{{< /caution >}}

## Install Fail2ban

Follow the [Getting Started](/docs/getting-started) guide to configure your basic server. You may also want to review the [Securing Your Server](/docs/security/securing-your-server) guide before beginning.

### CentOS 7

1.  Ensure your system is up to date and install the EPEL repository:

        yum update && yum install epel-release

2.  Install Fail2Ban:

        yum install fail2ban

3.  Install Sendmail if you additionally would like email support. Sendmail is not required to use Fail2Ban.:

        yum install sendmail

4.  Start and enable Fail2ban and, if needed, Sendmail:

        systemctl start fail2ban
        systemctl enable fail2ban
        systemctl start sendmail
        systemctl enable sendmail

    {{< note >}}
Should you encounter the error that there is "*no directory /var/run/fail2ban to contain the socket file /var/run/fail2ban/fail2ban.sock*", create the directory manually:

'mkdir /var/run/fail2ban'
{{< /note >}}

### Debian

1.  Ensure your system is up to date:

        apt-get update && apt-get upgrade -y

2.  Install Fail2ban:

        apt-get install fail2ban

    The service will automatically start.

3.  (Optional) If you would like email support, install Sendmail:

        apt-get install sendmail-bin sendmail

    {{< note >}}
The current version of Sendmail in Debian Jessie has an [upstream bug](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=293017) which causes the following errors when installing `sendmail-bin`. The installation will hang for a minute, but then complete.
Creating /etc/mail/sendmail.cf...
ERROR: FEATURE() should be before MAILER() MAILER(`local') must appear after FEATURE(`always_add_domain')
ERROR: FEATURE() should be before MAILER() MAILER(`local') must appear after FEATURE(`allmasquerade')
{{< /note >}}

### Fedora

1.  Update your system:

        dnf update

2.  Install Fail2ban:

        dnf install fail2ban

3.  (Optional) If you would like email support, install Sendmail:

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

3.  (Optional) If you would like email support, install Sendmail:

        apt-get install sendmail

4.  Allow SSH access through UFW and then enable the firewall:

        ufw allow ssh
        ufw enable

## Configure Fail2ban

Fail2ban reads `.conf` configuration files first, then `.local` files override any settings. Because of this, all changes to the configuration are generally done in `.local` files, leaving the `.conf` files untouched.

### Configure fail2ban.local

1.  `fail2ban.conf` contains the default configuration profile. The default settings will give you a reasonable working setup. If you want to make any changes, it's best to do it in a separate file, `fail2ban.local`, which overrides `fail2ban.conf`. Rename a copy `fail2ban.conf` to `fail2ban.local`.

        cp /etc/fail2ban/fail2ban.conf /etc/fail2ban/fail2ban.local

2.  From here, you can opt to edit the definitions in `fail2ban.local` to match your desired configuration. The values that can be changed are:

    -   `loglevel`: The level of detail that Fail2ban's logs provide can be set to 1 (error), 2 (warn), 3 (info), or 4 (debug).
    -   `logtarget`: Logs actions into a specific file. The default value of `/var/log/fail2ban.log` puts all logging into the defined file. Alternately, you can change the value to:
        -  `STDOUT`: output any data
        -  `STDERR`: output any errors
        -  `SYSLOG`: message-based logging
        -  `FILE`: output to a file
    -   `socket`: The location of the socket file.
    -   `pidfile`: The location of the PID file.

## Configure jail.local Settings

1.  The `jail.conf` file will enable Fail2ban for SSH by default for Debian and Ubuntu, but not CentOS. All other protocols and configurations (HTTP, FTP, etc.) are commented out. If you want to change this, create a `jail.local` for editing:

        cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

2.  **If using CentOS or Fedora** you will need to change the `backend` option in `jail.local` from *auto* to *systemd*. This is not necessary on Debian 8 or Ubuntu 16.04, even though both use systemd as well.

    {{< file-excerpt "/etc/fail2ban/jail.local" aconf >}}
# "backend" specifies the backend used to get files modification.
# Available options are "pyinotify", "gamin", "polling", "systemd" and "auto".
# This option can be overridden in each jail as well.

. . .

backend = systemd

{{< /file-excerpt >}}


    No jails are enabled by default in CentOS 7. For example, to enable the SSH daemon jail, uncomment the following lines in `jail.local`:

    {{< file-excerpt "/etc/fail2ban/jail.local" aconf >}}
[sshd]
enabled = true

{{< /file-excerpt >}}


### Whitelist IP

To ignore specific IPs, add them to the `ignoreip` line. By default, this command will not ban the localhost. If you work from a single IP address often, it may be beneficial to add it to the ignore list:

{{< file-excerpt "/etc/fail2ban/jail.local" aconf >}}
[DEFAULT]

# "ignoreip" can be an IP address, a CIDR mask or a DNS host. Fail2ban will not
# ban a host which matches an address in this list. Several addresses can be
# defined using space separator.
ignoreip = 127.0.0.1/8 123.45.67.89

{{< /file-excerpt >}}


If you wish to whitelist IPs only for certain jails, this can be done with the `fail2ban-client` command. Replace `JAIL` with the name of your jail, and `123.45.67.89` with the IP you wish to whitelist.

    fail2ban-client set JAIL addignoreip 123.45.67.89

### Ban Time and Retry Amount

Set `bantime`, `findtime`, and `maxretry` to define the circumstances and the length of time of a ban:

{{< file-excerpt "/etc/fail2ban/jail.local" aconf >}}
# "bantime" is the number of seconds that a host is banned.
bantime  = 600

# A host is banned if it has generated "maxretry" during the last "findtime"
# seconds.
findtime = 600
maxretry = 3

{{< /file-excerpt >}}


-   `bantime`: The length of time in seconds for which an IP is banned. If set to a negative number, the ban will be permanent. The default value of `600` is set to ban an IP for a 10-minute duration.

-   `findtime`: The length of time between login attempts before a ban is set. For example, if Fail2ban is set to ban an IP after five (5) failed log-in attempts, those 5 attempts must occur within the set 10-minute `findtime` limit. The `findtime` value should be a set number of seconds.

-   `maxretry`: How many attempts can be made to access the server from a single IP before a ban is imposed. The default is set to 3.

### Email Alerts

To receive email when fail2ban is triggered, adjust the email settings:

-   `destemail`:  The email address where you would like to receive the emails.

-   `sendername`: The name under which the email shows up.

-   `sender`: The email address from which Fail2ban will send emails.

{{< note >}}
If unsure of what to put under `sender`, run the command `sendmail -t user@email.com`, replacing `user@email.com` with your email address. Check your email (including spam folders, if needed) and review the sender email. This address can be used for the above configuration.
{{< /note >}}

You will also need to adjust the `action` setting, which defines what actions occur when the threshold for ban is met. The default, `%(action_)s`, only bans the user. `%(action_mw)s` will ban and send an email with a WhoIs report; while `%(action_mwl)s` will ban and send an email with the WhoIs report and all relevant lines in the log file. This can also be changed on a jail-specific basis.

### Other Jail Configuration

Beyond the basic settings address above, `jail.local` also contains various jail configurations for a number of common services, including SSH. By default, only SSH is enabled.

An average jail configuration will resemble the following:

{{< file-excerpt "/etc/fail2ban/jail.local" >}}
[ssh]

enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 6

{{< /file-excerpt >}}


-   `enabled`: Determines whether or not the filter is turned on.
-   `port`: The port Fail2ban should be referencing in regards to the service. If using the default port, then the service name can be placed here. If using a non-traditional port, this should be the port number. For example, if you moved your SSH port to 3456, you would replace `ssh` with `3456`.
-   `filter`: The name of the file located in `/etc/fail2ban/filter.d` that contains the failregex information used to parse log files appropriately. The `.conf` suffix need not be included.
-   `logpath`: Gives the location of the service's logs.
-   `maxretry`: Will override the global `maxretry` for the defined service. `findtime` and `bantime` can also be added.
-   `action`: This can be added as an additional setting, if the default action is not suitable for the jail. Additional actions can be found in the `action.d` folder.

{{< note >}}
Jails can also be configured as individual `.conf` files placed in the `jail.d` directory. The format will remain the same.
{{< /note >}}

## Failregexs

Although Fail2ban comes with a number of filters, you may want to further customize these filters or create your own to suit your needs. Fail2ban uses *regular expressions* (*regex*) to parse log files, looking for instances of attempted break-ins and password failures. Fail2ban uses Python's regex extensions.

The best way to understand how failregex works is to write one. Although we do not advise having Fail2ban monitor your Wordpress's `access.log` on heavily-trafficked websites due to CPU concerns, it provides an instance of an easy-to-understand log file that you can use to learn about the creation of any failregex.

### Write a Regex for Fail2ban

1.  Navigate to your website's `access.log` (generally located at `/var/www/example.com/logs/access.log`) and find a failed login attempt. It will resemble:

    {{< file-excerpt "/var/www/example.com/logs/access.log" resource >}}
123.45.67.89 - - [01/Oct/2015:12:46:34 -0400] "POST /wp-login.php HTTP/1.1" 200 1906 "http://example.com/wp-login.php" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0"

{{< /file-excerpt >}}


    Note that you will only need to track up to the `200`:

    {{< file-excerpt "/var/www/example.com/logs/access.log" resource >}}
123.45.67.89 - - [01/Oct/2015:12:46:34 -0400] "POST /wp-login.php HTTP/1.1" 200

{{< /file-excerpt >}}


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

4.  The next sequence is a series of two-digit numbers that make up the time. Because we defined the day of the month as a two-digit number in a capture group (the parentheses), we can backreference it using `\1` (since it is the *first* capture group). Again, the colons will be literals:

        <HOST> - - \[(\d{2})/\w{3}/\d{4}:\1:\1:\1

    If you do not want to use backreferences this can also be written as:

        <HOST> - - \[\d{2}/\w{3}/\d{4}:\d{2}:\d{2}:\d{2}

5.  The `-0400` segment should be written similarly to the year, with the additional literal `-`: `-\d{4}`. Finally, you can close the square bracket (escaping with a backslash first), and finish the rest with the literal string:

        <HOST> - - \[(\d{2})/\w{3}/\d{4}:\1:\1:\1 -\d{4}\] "POST /wp-login.php HTTP/1.1" 200

    Or:

        <HOST> - - \[\d{2}/\w{3}/\d{4}:\d{2}:\d{2}:\d{2} -\d{4}\] "POST /wp-login.php HTTP/1.1" 200

### Apply the Failregex

With the failregex created, it then needs to be added to a filter.

1.  Navigate to Fail2ban's `filter.d` directory:

        cd /etc/fail2ban/filter.d

2.  Create a file called `wordpress.conf`, and add your failregex:

    {{< file "/etc/fail2ban/filter.d/wordpress.conf" aconf >}}
# Fail2Ban filter for WordPress
#
#

[Definition]

failregex = <HOST> - - \[(\d{2})/\w{3}/\d{4}:\1:\1:\1 -\d{4}\] "POST /wp-login.php HTTP/1.1" 200
ignoreregex =

{{< /file >}}


    Save and quit.

3.  Add a WordPress section to `jail.local`:

    {{< file-excerpt "/etc/fail2ban/jail.local" aconf >}}
[wordpress]
enabled  = true
filter   = wordpress
logpath  = /var/www/html/andromeda/logs/access.log
port     = 80,443

{{< /file-excerpt >}}


    This will use the default ban and email action. Other actions can be defined by adding an `action =` line.

    Save and exit, then restart Fail2ban.

## Use the Fail2ban Client

Fail2ban provides a command `fail2ban-client` that can be used to run Fail2ban from the command line:

    fail2ban-client COMMAND

-   `start`: Starts the Fail2ban server and jails.
-   `reload`: Reloads Fail2ban's configuration files.
-   `reload JAIL`: Replaces `JAIL` with the name of a Fail2ban jail; this will reload the jail.
-   `stop`: Terminates the server.
-   `status`: Will show the status of the server, and enable jails.
-   `status JAIL`: Will show the status of the jail, including any currently-banned IPs.

For example, to check that the Fail2Ban is running and the SSHd jail is enabled, run:

    fail2ban-client status

The output should be:

    Status
    |- Number of jail:      1
    `- Jail list:   sshd

For additional information about `fail2ban-client` commands, see the [Fail2ban wiki](http://www.fail2ban.org/wiki/index.php/Commands).
