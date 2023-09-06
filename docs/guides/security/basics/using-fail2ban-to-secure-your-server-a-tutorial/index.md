---
title: "Using Fail2ban to Secure Your Server"
title_meta: "How to Use Fail2ban to Secure Your Server (A Tutorial)"
slug: using-fail2ban-to-secure-your-server-a-tutorial
description: "This guide shows you how to set up Fail2Ban, a log-parsing application, to monitor system logs, and detect automated attacks on your Linode."
keywords: ["fail2ban", "ip whitelisting", "jail.local"]
aliases: ['/tools-reference/tools/using-fail2ban-to-block-network-probes/','/security/using-fail2ban-to-secure-your-server-a-tutorial/','/security/using-fail2ban-for-security/','/security/basics/using-fail2ban-to-secure-your-server-a-tutorial/']
bundles: ['debian-security', 'centos-security']
tags: ["monitoring","security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2015-10-12
modified: 2023-06-27
modified_by:
  name: Linode
authors: ["Linode"]
---

## What is Fail2Ban

{{< youtube kgdoVeyoO2E >}}

Fail2ban is a log-parsing application that monitors system logs for symptoms of an automated attack on your Linode. In this guide, you learn how to use Fail2ban to secure your server.

When an attempted compromise is located, using the defined parameters, Fail2ban adds a new rule to iptables to block the IP address of the attacker, either for a set amount of time, or permanently. Fail2ban can also alert you through email that an attack is occurring.

Fail2ban is primarily focused on SSH attacks, although it can be further configured to work for any service that uses log files and can be subject to a compromise.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups) guide.
{{< /note >}}

{{< note type="alert" >}}
Fail2ban is intended to be used in conjunction with an already-hardened server and should not be used as a replacement for secure firewall rules.
{{< /note >}}

## How to Install Fail2ban

Follow the [Getting Started](/docs/products/platform/get-started/) guide to configure your basic server. You may also want to review the [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide before beginning.

### CentOS/CentOS Stream/RHEL Based Operating Systems

1.  Ensure your system is up to date and install the EPEL repository:

    ```command
    yum update -y && yum install epel-release -y
    ```

1.  Install Fail2Ban:

    ```command
    yum install fail2ban
    ```

1.  Install Sendmail if you additionally would like email support. Sendmail is not required to use Fail2Ban.:

    ```command
    yum install sendmail
    ```

1.  Start and enable Fail2ban and, if needed, Sendmail:

    ```command
    systemctl enable --now fail2ban
    systemctl enable --now sendmail
    ```

    {{< note >}}
    If you encounter the error that there is `no directory /var/run/fail2ban to contain the socket file /var/run/fail2ban/fail2ban.sock`, create the directory manually:

    ```command
    mkdir /var/run/fail2ban
    ```
    {{< /note >}}

### Debian

1.  Ensure your system is up to date:

    ```command
    apt update && apt upgrade -y
    ```

2.  Install Fail2ban:

    ```command
    apt install fail2ban
    ```

    The service automatically starts.

3.  (Optional) If you would like email support, install Sendmail:

    ```command
    apt install sendmail-bin sendmail
    ```

    {{< note >}}
    The current version of Sendmail in Debian Jessie has an [upstream bug](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=293017) which causes the following errors when installing `sendmail-bin`. The installation hangs for a minute, but then completes.

    ```output
    Creating /etc/mail/sendmail.cf...
    ERROR: FEATURE() should be before MAILER() MAILER('local') must appear after FEATURE('always_add_domain')
    ERROR: FEATURE() should be before MAILER() MAILER('local') must appear after FEATURE('allmasquerade')
    ```
    {{< /note >}}

### Fedora

1.  Update your system:

    ```command
    dnf update
    ```

2.  Install Fail2ban:

    ```command
    dnf install fail2ban
    ```

3.  (Optional) If you would like email support, install Sendmail:

    ```command
    dnf install sendmail
    ```

4.  Start and enable Fail2ban and, if needed, Sendmail:

    ```command
    systemctl enable --now fail2ban
    systemctl enable --now sendmail
    ```

### Ubuntu

1.  Ensure your system is up to date:

    ```command
    apt update && apt upgrade -y
    ```

2.  Install Fail2ban:

    ```command
    apt install fail2ban
    ```

    The service automatically starts.

3.  (Optional) If you would like email support, install Sendmail:

    ```command
    apt install sendmail
    ```

4.  Allow SSH access through UFW and then enable the firewall:

    ```command
    ufw allow ssh
    ufw enable
    ```

## How to Configure Fail2ban

This section contains examples of common Fail2ban configurations using `fail2ban.local` and `jail.local` files. Fail2ban reads `.conf` configuration files first, then `.local` files override any settings. Because of this, all changes to the configuration are generally done in `.local` files, leaving the `.conf` files untouched.

### Configure fail2ban.local

1.  `fail2ban.conf` contains the default configuration profile. The default settings give you a reasonable working setup. If you want to make any changes, it's best to do it in a separate file, `fail2ban.local`, which overrides `fail2ban.conf`. Rename a copy `fail2ban.conf` to `fail2ban.local`.

    ```command
    cp /etc/fail2ban/fail2ban.conf /etc/fail2ban/fail2ban.local
    ```

1.  From here, you can opt to edit the definitions in `fail2ban.local` to match your desired configuration. The values that can be changed are:

    -   `loglevel`: The level of detail that Fail2ban's logs provide can be set to 1 (error), 2 (warn), 3 (info), or 4 (debug).
    -   `logtarget`: Logs actions into a specific file. The default value of `/var/log/fail2ban.log` puts all logging into the defined file. Alternately, you can change the value to:
        -  `STDOUT`: output any data
        -  `STDERR`: output any errors
        -  `SYSLOG`: message-based logging
        -  `FILE`: output to a file
    -   `socket`: The location of the socket file.
    -   `pidfile`: The location of the PID file.

### Fail2ban Backend Configuration

1.  The `jail.conf` file enables Fail2ban for SSH by default for Debian and Ubuntu, but not CentOS. All other protocols and configurations (HTTP, FTP, etc.) are commented out. If you want to change this, create a `jail.local` for editing:

    ```command
    cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
    ```

1.  **If using CentOS or Fedora** you need to change the `backend` option in `jail.local` from *auto* to *systemd*. This is not necessary on Debian 8 or Ubuntu 16.04, even though both use systemd as well.

    ```file {title="/etc/fail2ban/jail.local" lang="aconf"}
    # "backend" specifies the backend used to get files modification.
    # Available options are "pyinotify", "gamin", "polling", "systemd" and "auto".
    # This option can be overridden in each jail as well.

    . . .

    backend = systemd
    ```

    {{< note >}}
    If the `backend` configuration is set to `auto`, Fail2ban monitors log files by first using `pyinotify`. Next, it tries `gamin`. If neither are available, a polling algorithm decides what to try next.
    {{< /note >}}

    No jails are enabled by default in CentOS 7. For example, to enable the SSH daemon jail, uncomment the following lines in `jail.local`:

    ```file {title="/etc/fail2ban/jail.local" lang="aconf"}
    [sshd]
    enabled = true
    ```

### Fail2ban jail.local Configurations

To become more familiar with Fail2ban's available settings, open your `jail.local` file and browse the available configurations.

```file {title="/etc/fail2ban/jail.local"}
[DEFAULT]

ignoreip = 127.0.0.1/8
bantime = 600
findtime = 600
maxretry = 3
backend = auto
usedns = warn
destemail = root@localhost
sendername = Fail2Ban
banaction = iptables-multiport
mta = sendmail
protocol = tcp
chain = INPUT
action_ = %(banaction)...
action_mw = %(banaction)...
protocol="%(protocol)s"...
action_mwl = %(banaction)s...
```

For example, if you set the `usedns` setting to `no`, Fail2ban does not use reverse DNS to set its bans, and instead bans the IP address. When set as `warn`, Fail2ban performs a reverse lookup of the hostname and uses it to perform a ban.

The `chain` setting refers to the series of [iptables](/docs/guides/what-is-iptables/) rules where jumps should be added in ban-actions. By default, this is set to the `INPUT` chain. You can read more about iptables chains in our [What is iptables](/docs/guides/what-is-iptables/#chains) guide.

### Fail2ban Chain Traffic Drop Configuration

You can use iptables' `--line-numbers` option to view your Fail2ban rules.

```command
iptables -L f2b-sshd -v -n --line-numbers
```

You should receive a similar output:

```output
Chain fail2ban-SSH (1 references)
num   pkts bytes target     prot opt in     out   source              destination
1       19  2332 DROP       all  --  *      *     192.0.0.0           0.0.0.0/0
2       16  1704 DROP       all  --  *      *     192.0.0.1           0.0.0.0/0
3       15   980 DROP       all  --  *      *     192.0.0.2           0.0.0.0/0
4        6   360 DROP       all  --  *      *     192.0.0.3           0.0.0.0/0
5     8504  581K RETURN     all  --  *      *     0.0.0.0/0           0.0.0.0/0
```

You can remove a rule applied to an IP address using the `iptables -D chain rulenum` command. Replace `rulenum` with the corresponding IP address rule number from the `num` column. For example, to remove the IP address `192.0.0.1`, issue the following command:

```command
iptables -D fail2ban-SSH 2
```

### Ban Time and Retry Amount Fail2Ban Configuration

Set `bantime`, `findtime`, and `maxretry` to define the circumstances and the length of time of a ban:

```file {title="/etc/fail2ban/jail.local" lang="aconf"}
# "bantime" is the number of seconds that a host is banned.
bantime  = 600

# A host is banned if it has generated "maxretry" during the last "findtime"
# seconds.
findtime = 600
maxretry = 3
```

-   `findtime`: The lengths of time between login attempts before a ban is set. For example, if Fail2ban is set to ban an IP after five (5) failed log-in attempts, those 5 attempts must occur within the set 10-minute `findtime` limit. The `findtime` value should be a set number of seconds.

-   `maxretry`: Fail2ban uses `findtime` and `maxretry` to decide when a ban is justified. If the number of attempts exceeds the limit set at `maxretry` and is within the `findtime` time limit, a ban is set by Fail2ban. The default is set to `3`.

-   `bantime`: The length of time in seconds for which an IP is banned. If set to a negative number, the ban is permanent. The default value of 600 is set to ban an IP for a 10-minute duration.

### ignoreip Fail2ban Configurations

To ignore specific IPs, add them to the `ignoreip` line. By default, this command does not ban the localhost. If you work from a single IP address often, it may be beneficial to add it to the ignore list:

```file {title="/etc/fail2ban/jail.local" lang="aconf"}
[DEFAULT]

# "ignoreip" can be an IP address, a CIDR mask or a DNS host. Fail2ban will not
# ban a host which matches an address in this list. Several addresses can be
# defined using space separator.
ignoreip = 127.0.0.1/8 123.45.67.89
```

`ignoreip`: This setting helps you define IP addresses that should be excluded from Fail2ban rules. To ignore specific IPs, add them to the `ignoreip` configuration, as shown in the example. By default, this command does not ban the `localhost`. If you often work from a single IP address, you should consider adding it to the ignore list.

If you wish to allow IPs only for certain jails, this can be done with the `fail2ban-client` command. Replace `JAIL` with the name of your jail, and `192.0.0.1` with the IP you wish to allow.

```command
fail2ban-client set JAIL addignoreip 192.0.0.1
```

### Fail2ban Email Alerts

{{< content "email-warning-shortguide" >}}

To receive email when fail2ban is triggered, adjust the email settings:

-  `destemail`:  The email address where you would like to receive the emails.

-  `sendername`: The name under which the email shows up.

-  `sender`: The email address from which Fail2ban sends emails.

{{< note >}}
If unsure of what to put under `sender`, run the command `sendmail -t user@email.com`, replacing `user@email.com` with your email address. Check your email (including spam folders, if needed) and review the sender email. This address can be used for the above configuration.
{{< /note >}}

You also need to adjust the `action` setting, which defines what actions occur when the threshold for ban is met. The default, `%(action_)s`, only bans the user. `%(action_mw)s` bans and sends an email with a WhoIs report; while `%(action_mwl)s` bans and sends an email with the WhoIs report and all relevant lines in the log file. This can also be changed on a jail-specific basis.

### Fail2ban banaction and ports Configuration

Beyond the basic settings address above, jail.local also contains various jail configurations for a number of common services, including SSH, and iptables. By default, only SSH is enabled and the action is to ban the offending host/IP address by modifying the iptables firewall rules.

An average jail configuration resembles the following:

```file {title="/etc/fail2ban/jail.local"}
# Default banning action (e.g. iptables, iptables-new,
# iptables-multiport, shorewall, etc) It is used to define
# action_* variables. Can be overridden globally or per
# section within jail.local file
banaction = iptables-multiport
banaction_allports = iptables-allports

[ssh]

enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 6
```

-   `banaction`: Determines the action to use when the threshold is reached. If you have configured the firewall to use firewalld set the value to `firewallcmd-ipset` and if you have configured the firewall to use UFW set the value to `ufw`.
-   `banaction_allports`: Blocks a remote IP in every port. If you have configured the firewall to use firewalld set the value to `firewallcmd-ipset`.
-   `enabled`: Determines whether or not the filter is turned on.
-   `port`: The port Fail2ban should be referencing in regards to the service. If using the default port, then the service name can be placed here. If using a non-traditional port, this should be the port number. For example, if you moved your SSH port to 3456, you would replace `ssh` with `3456`.
-   `filter`: The name of the file located in `/etc/fail2ban/filter.d` that contains the failregex information used to parse log files appropriately. The `.conf` suffix need not be included.
-   `logpath`: Gives the location of the service's logs.
-   `maxretry`: Will override the global `maxretry` for the defined service. `findtime` and `bantime` can also be added.
-   `action`: This can be added as an additional setting, if the default action is not suitable for the jail. Additional actions can be found in the `action.d` folder.

{{< note >}}
Jails can also be configured as individual `.conf` files placed in the `jail.d` directory. The format remains the same.
{{< /note >}}

## Using Fail2ban Filters to Secure Your Server

In this section you examine your system's Fail2ban filters defined in their configuration files.

Depending on your system's Fail2ban version, you can find your system's filters in either the `/etc/fail2ban/jail.conf` file or in the `/etc/fail2ban/jail.d/defaults-*.conf`file.

Open your `/etc/fail2ban/jail.conf` file and examine the `ssh/sshd` filter:

```file {title="/etc/fail2ban/jail.local"}
[ssh]

enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 5
```

If you are using a Fail2ban version greater than `0.8`, check both your `defaults-*.conf` and `jail.conf` files.

If your system has Fail2ban version 0.8 or greater, your `jail.conf` file resembles the following example:

```file {title="/etc/fail2ban/jail.local"}
[sshd]

port    = ssh
logpath = %(sshd_log)s
```

Finally, a system using Fail2ban 0.8 or greater has a `defaults-*.conf` that includes the following filters:

```file {title="/etc/fail2ban/jail.d/defaults-*.conf"}
[sshd]

enabled  = true
maxretry = 3
```

You can test your existing filters by running the example command and replacing `logfile`, `failregex`, and `ignoreregex` with your own values.

```command
fail2ban-regex logfile failregex ignoreregex
```

Using the examples from the beginning of this section, the command resembles the following:

```command
fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf
```

Your Fail2ban filters have to work with:

1. Different types of logs generated by different software
2. Different configurations and multiple operating systems

In addition to the above, they also have to be log-format agnostic, must be safeguarded against DDoS, and have to be compatible with future versions of the software.

### Customizing Your ignoreregex Configuration

Before making changes to the `failregex` configuration, you have to customize `ignoreregex`. Fail2ban needs to know what is considered normal server activity and what is not considered normal activity.

For example, to exclude activity cron from running on your server or to exclude MySQL, you can configure `ignoreregex` to filter logs generated by these two programs:

```file {title="/etc/fail2ban/filter.d/sshd.conf"}
ignoreregex = : pam_unix\((cron|sshd):session\): session (open|clos)ed for user (daemon|munin|mysql|root)( by \(uid=0\))?$
            : Successful su for (mysql) by root$
            New session \d+ of user (mysql)\.$
            Removed session \d+\.$
```

Now that you have filtered for the each program's logs, you can customize `failregexs` to block what you want.

### Customizing Failregexs

Although Fail2ban comes with a number of filters, you may want to further customize these filters or create your own to suit your needs. Fail2ban uses regular expressions (regex) to parse log files, looking for instances of attempted break-ins and password failures. Fail2ban uses Python’s regex extensions.

The best way to understand how failregex works is to write one. Although we do not advise having Fail2ban monitor your Wordpress’s access.log on heavily-trafficked websites due to CPU concerns, it provides an instance of an easy-to-understand log file that you can use to learn about the creation of any failregex.

### Write a Regex for Fail2ban

1.  Navigate to your website's `access.log` (generally located at `/var/www/example.com/logs/access.log`) and find a failed login attempt. It resembles:

    ```file {title="/var/www/example.com/logs/access.log" lang="resource"}
    123.45.67.89 - - [01/Oct/2015:12:46:34 -0400] "POST /wp-login.php HTTP/1.1" 200 1906 "http://example.com/wp-login.php" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0"
    ```

    Note that you only need to track up to the `200`:

    ```file {title="/var/www/example.com/logs/access.log" lang="resource"}
    123.45.67.89 - - [01/Oct/2015:12:46:34 -0400] "POST /wp-login.php HTTP/1.1" 200
    ```

1.  The IP address from where the failed attempt originated is always be defined as `<HOST>`. The subsequent few characters are unchanging and can be input as literals:

    ```command
    <HOST> - - \[
    ```

    The `\` before the `[` denotes that the square bracket is to be read literally.

1.  The next section, the date of the login attempt, can be written as grouped expressions using regex expressions. The first portion, `01` in this example, can be written as `(\d{2})`: The parentheses group the expression, while `\d` looks for any numerical digits. `{2}` notes that the expression is looking for two digits in a row, i.e., the day of the month.

    Thus far, you should have:

    ```command
    <HOST> - - \[(\d{2})
    ```

    The following forward slash is then be called with a literal forward slash, followed by `\w{3}` which looks for a series of `3` alpha-numeric characters (i.e., A-Z, 0-9, any case). The following forward slash should also be literal:

    ```command
    <HOST> - - \[(\d{2})/\w{3}/
    ```

    The section for the year should be written similar to the day, but without the need for a capture group, and for four consecutive characters (and a literal colon):

    ```command
    <HOST> - - \[(\d{2})/\w{3}/\d{4}:
    ```

1.  The next sequence is a series of two-digit numbers that make up the time. Because we defined the day of the month as a two-digit number in a capture group (the parentheses), we can backreference it using `\1` (since it is the *first* capture group). Again, the colons are literals:

    ```command
    <HOST> - - \[(\d{2})/\w{3}/\d{4}:\1:\1:\1
    ```

    If you do not want to use backreferences this can also be written as:

    ```command
    <HOST> - - \[\d{2}/\w{3}/\d{4}:\d{2}:\d{2}:\d{2}
    ```

1.  The `-0400` segment should be written similarly to the year, with the additional literal `-`: `-\d{4}`. Finally, you can close the square bracket (escaping with a backslash first), and finish the rest with the literal string:

    ```command
    <HOST> - - \[(\d{2})/\w{3}/\d{4}:\1:\1:\1 -\d{4}\] "POST /wp-login.php HTTP/1.1" 200
    ```

    Or:

    ```command
    <HOST> - - \[\d{2}/\w{3}/\d{4}:\d{2}:\d{2}:\d{2} -\d{4}\] "POST /wp-login.php HTTP/1.1" 200
    ```

### Apply the Failregex

With the failregex created, it then needs to be added to a filter.

1.  Navigate to Fail2ban's `filter.d` directory:

    ```command
    cd /etc/fail2ban/filter.d
    ```

1.  Create a file called `wordpress.conf`, and add your failregex:

    ```file {title="/etc/fail2ban/filter.d/wordpress.conf" lang="aconf"}
    # Fail2Ban filter for WordPress

    [Definition]

    failregex = <HOST> - - \[(\d{2})/\w{3}/\d{4}:\1:\1:\1 -\d{4}\] "POST /wp-login.php HTTP/1.1" 200
    ignoreregex =
    ```

    Save and quit.

1.  Add a WordPress section to `jail.local`:

    ```file {title="/etc/fail2ban/jail.local" lang="aconf"}
    [wordpress]
    enabled  = true
    filter   = wordpress
    logpath  = /var/www/html/andromeda/logs/access.log
    port     = 80,443
    ```

This uses the default ban and email action. Other actions can be defined by adding an `action =` line.

Save and exit, then restart Fail2ban.

## Use the Fail2ban Client

Fail2ban provides a command `fail2ban-client` that can be used to run Fail2ban from the command line:

```command
fail2ban-client COMMAND
```

-   `start`: Starts the Fail2ban server and jails.
-   `reload`: Reloads Fail2ban's configuration files.
-   `reload JAIL`: Replaces `JAIL` with the name of a Fail2ban jail; this reloads the jail.
-   `stop`: Terminates the server.
-   `status`: Will show the status of the server, and enable jails.
-   `status JAIL`: Will show the status of the jail, including any currently-banned IPs.

For example, to check that the Fail2Ban is running and the SSHd jail is enabled, run:

```command
fail2ban-client status
```

The output should be:

```output
Status
|- Number of jail:      1
`- Jail list:   sshd
```

For additional information about `fail2ban-client` commands, see the [Fail2ban wiki](http://www.fail2ban.org/wiki/index.php/Commands).

## Lockout Recovery

In the event that you find yourself locked out of your Linode due to fail2ban, you can still gain access by using our out-of-band [Lish Console](/docs/products/compute/compute-instances/guides/lish/).

From here, you can view your firewall rules to ensure that it is fail2ban that blocked your IP, and not something else. To do this, enter the following command:

```command
iptables -n -L
```

Look for your IP address in the `source` column of any fail2ban chains (always prefixed by `f2b` or `fail2ban`) to confirm whether or not you were blocked by the fail2ban service:

```output
Chain f2b-sshd (1 references)
target     prot opt source               destination
REJECT     all  --  203.0.113.0        0.0.0.0/0            reject-with icmp-e
```

To remove your IP address from a [jail](#configure-jail-local-settings), you can use the following command, replacing `203.0.113.0` and `jailname` with the IP address and name of the jail that you'd like to unban:

```command
fail2ban-client set jailname unbanip 203.0.113.0
```

{{< note >}}
If you can't remember your jail name, then you can always use the following command to list all jails:

```command
fail2ban-client status
```
{{< /note >}}

If you find that you would like to stop using your fail2ban service at any time, you can enter the following:

```command
fail2ban-client stop
```

CentOS 7 and Fedora additionally require two extra commands to be fully stopped and disabled:

```command
systemctl disable --now fail2ban
```