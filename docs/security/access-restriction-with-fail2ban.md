Access restriction with Fail2ban on CentOS/Debian

Any Internet-connected server will be at some point the target of unauthorized access attempts. While these attacks are usually harmless, they are a nuisance: system resources are being used to serve the unauthorized access attempts and system logs increase in size and become cluttered. Even worse, any public-facing accounts (FTP, POP3/IMAP, SSH) with weak passwords can be accessed by a thorough password scanner. 

This document will explain how to further restrict access to your Debian/CentOS server using Fail2ban, a tool which can trigger actions (most of the time, the action is to ban the offender's IP address) based on events logged in your system (a number of failed attempts to log into a service, for example).

# Prerequisites

Ensure your system is up to date before starting. 

For CentOS, run:

	[root@server ~]# yum update

For Debian, run:

	[root@server ~]# apt-get update; apt-get upgrade

## CentOS 

Fail2ban is provided by the EPEL repository, so this needs to be installed first:

	[root@server ~]# yum -y install epel-release

Update the yum repository and install fail2ban:

	[root@server ~]# yum update; yum -y install fail2ban

## Debian

fail2ban is already included in the standard distribution, so you just need to run:

	[root@server ~]# apt-get install fail2ban

The configuration set for a specific application is called a "jail" and contains the jail settings, the filter and the required action. Fail2ban will permanently monitor the specified log file using the filter and jail settings and trigger the action if the conditions are matched. After a configurable time, another action can be performed (such as unbanning the offending IP).

# Fail2ban configuration

## Configuration files

Configuration files are located under `/etc/fail2ban`. You will find here:

- `jail.conf`: the stock jails configuration, which for most users will be sufficient. Should you wish to create your own jails or adjust the existing jails' configuration, it's recommended to deploy them in a "jail.local" file and leave the original file untouched. Otherwise, your jail.conf customizations might get lost when upgrading fail2ban.
- `fail2ban.conf`: the general fail2ban configuration file. Same as above, any customizations should be placed in a separate file named fail2ban.local.
- `filter.d`: the folder containing built-in (predefined) filters, each filter being in a separate file.
- `action.d`: the folder containing built-in (predefined) actions, each action being in a separate file.

## Starting and stopping fail2ban

The fail2ban service is started/stopped/checked using the standard commands:

	[root@server ~]# /etc/init.d/fail2ban status
	fail2ban-server is stopped
	[root@server ~]# /etc/init.d/fail2ban start
	Starting fail2ban:                                         [  OK  ]
	[root@server ~]# /etc/init.d/fail2ban status
	fail2ban-server (pid  763) is running...
	Status
	|- Number of jail:      1
	`- Jail list:           ssh-iptables
	[root@server ~]# /etc/init.d/fail2ban stop
	Stopping fail2ban:                                         [  OK  ]

You can see the `ssh-iptables` jail is already active - it monitors the SSH login attempts and uses iptables to ban IPs which fail to authenticate properly.

## Analysing an existing jail 

Let's take a look at an existing jail. Use your favorite file editor, open the `/etc/fail2ban/jail.conf` file and look for the `ssh-iptables` jail configuration. You should find a code block similar to this:

	[ssh-iptables]
	enabled  = true
	filter   = sshd
	action   = iptables[name=SSH, port=ssh, protocol=tcp]
		   sendmail-whois[name=SSH, dest=you@example.com, sender=fail2ban@example.com, sendername="Fail2Ban"]
	logpath  = /var/log/secure
	maxretry = 5

- The first line lists the jail name between brackets - this is the name visible when doing `/etc/init.d/fail2ban status`. 
- The `enabled` parameter enables the jail when set to `true` or disables the jail when set to `false`.
- The `filter` parameter specifies which filter will be applied when looking for events in the log file. It has to match the name of one file in the `/etc/fail2ban/filter.d` folder.
- The `action` parameter can have one or more lines (actions); in this example, there are two configured actions: one called `iptables` which will ban the offending IP and another one called `sendmail-whois` which will send an email with the IP details to the email address specified in the `dest` field.
- The `logpath` indicates the name of the monitored log file (the log file containing the events which will trigger actions).
- The `maxretry` parameter indicates how many times the filter must be triggered before action is taken. As it's set to 5 by default, 4 failed login attempts will not ban the offending IP (but 6 attempts will).

## Analysing an existing action

Let's take a look at `/etc/fail2ban/action.d/iptables.conf` which is used by the `ssh-iptables` jail.

	[INCLUDES]
	before = iptables-blocktype.conf

The `[INCLUDES]` section allows you to include other configuration files before/after the current one. Before loading the current action, we include the `iptables-blocktype.conf` which defines the blocking method used by iptables.

	[Definition]
	actionstart = iptables -N fail2ban-<name>
        	      iptables -A fail2ban-<name> -j RETURN
	              iptables -I <chain> -p <protocol> --dport <port> -j fail2ban-<name>

	actionstop = iptables -D <chain> -p <protocol> --dport <port> -j fail2ban-<name>
        	     iptables -F fail2ban-<name>
	             iptables -X fail2ban-<name>

	actioncheck = iptables -n -L <chain> | grep -q 'fail2ban-<name>[ \t]'

	actionban = iptables -I fail2ban-<name> 1 -s <ip> -j <blocktype>

	actionunban = iptables -D fail2ban-<name> -s <ip> -j <blocktype>

Next we have the actual definition of the action, which consists of 5 parameters. They're also commented in the stock configuration file:

- `actionstart` will be executed only once, when Fail2Ban is started
- `actionstop` will be executed only once, when Fail2Ban is stopped
- `actioncheck` will be executed once before each actionban command
- `actionban` will be executed when banning an IP
- `actionunban` will be executed when unbanning an IP

The value of each parameter is an actual command to be executed, which would work if it was written in a terminal with actual values replacing the parameter names. How iptables works is outside the scope of this tutorial, but here's a simple description:

- `actionstart` will create a new chain named `fail2ban-jailname`, add a RETURN rule and insert a rule in the INPUT iptables chain to jump to the `fail2ban-jailname` when the specified port is accessed
- `actionstop` will delete the jump rule inserted in the INPUT chain, flush the `fail2ban-jailname` chain and delete it
- `actioncheck` will check the jump rule is still present in the INPUT chain
- `actionban` will block the offending IP by inserting a rule in the `fail2ban-jailname` chain
- `actionunban` will unblock the offending IP by deleting the corresponding rule in `fail2ban-jailname`

The `init` section:

	[Init]
	name = default
	port = ssh
	protocol = tcp
	chain = INPUT

This section initializes the action parameters:

- `name` is the default name of the chain (will be replaced with the jail name)
- `port` defines the port to be used in iptables rules (will be replaced with the configured port)
- `protocol` defines the protocol, which can be one of `tcp`, `udp`, `icmp` or `all`
- `chain` specifies the name of the main iptables chain (`INPUT` in our case)

## Analysing an existing filter

Next, let's take a look at an existing filter. According to the `ssh-iptables` configuration, it uses the `sshd` filter - this means it's time to open `/etc/fail2ban/filter.d/sshd.conf` which is a bit simpler.

	[INCLUDES]
	before = common.conf

Same as the action configuration file, the INCLUDES section allows to include another file before/after the current one. The `common.conf` file has a list of generic configuration items which help match the usual date and time formats used in system logs, while also identifying the common prefixes used in log files (hostname, application names and so on).

	[Definition]
	_daemon = sshd

The `_daemon` parameter indicates the application name that will be searched in the common prefixes. It's usually safe to have it set to the binary application name.

	failregex = ^%(__prefix_line)s(?:error: PAM: )?[aA]uthentication (?:failure|error) for .* from <HOST>( via \S+)?\s*$
	            ^%(__prefix_line)s(?:error: PAM: )?User not known to the underlying authentication module for .* from <HOST>\s*$
	            ^%(__prefix_line)sFailed \S+ for .*? from <HOST>(?: port \d*)?(?: ssh\d*)?(: (ruser .*|(\S+ ID \S+ \(serial \d+\) CA )?\S+ %(__md5hex)s(, client user ".*", client host ".*")?))?\s*$
	            ^%(__prefix_line)sROOT LOGIN REFUSED.* FROM <HOST>\s*$
	            ^%(__prefix_line)s[iI](?:llegal|nvalid) user .* from <HOST>\s*$
	            ^%(__prefix_line)sUser .+ from <HOST> not allowed because not listed in AllowUsers\s*$
	            ^%(__prefix_line)sUser .+ from <HOST> not allowed because listed in DenyUsers\s*$
	            ^%(__prefix_line)sUser .+ from <HOST> not allowed because not in any group\s*$
	            ^%(__prefix_line)srefused connect from \S+ \(<HOST>\)\s*$
	            ^%(__prefix_line)sReceived disconnect from <HOST>: 3: \S+: Auth fail$
	            ^%(__prefix_line)sUser .+ from <HOST> not allowed because a group is listed in DenyGroups\s*$
	            ^%(__prefix_line)sUser .+ from <HOST> not allowed because none of user's groups are listed in AllowGroups\s*$

	ignoreregex =

The `ignoreregex` specifies which regular expression pattern will be ignored in the log file. Usually it's empty; all the work is done by the `failregex` filter.

The `failregex` filter can be configured to have multiple lines, each matching one regular expression pattern. Any line in the log file that matches one of these patterns will be considered as a "hit" by the filter and increase the hit counter that is compared with the `maxretry` parameter of the jail.

Learning regular expressions is an extensive topic which will not be covered in this tutorial; the important part is that your `failregex` needs to have a `<HOST>` match which will catch the IP address at fault.

To test a filter against a log file, you can use `fail2ban-regex`. For example, to check the `sshd` filter against the `/var/log/secure.log` filter:

	[root@server ~]# fail2ban-regex /var/log/secure.log /etc/fail2ban/filter.d/sshd.conf

# Creating a custom filter

Let's prepare a custom filter on our own. I'll use as an example a filter which restricts remote hosts from hammering our NTP server with invalid time stamps. These hosts are logged into /var/log/syslog with lines similar to these:

	Apr 27 06:26:15 server kernel: UDP: bad checksum. From 197.161.124.9:54211 to 1.2.3.4:123 ulen 56
	Apr 27 07:50:58 server kernel: UDP: bad checksum. From 41.222.179.149:14307 to 1.2.3.4:123 ulen 56
	Apr 27 10:42:38 server kernel: UDP: bad checksum. From 195.171.193.42:12837 to 1.2.3.4:123 ulen 56
	Apr 27 11:28:00 server kernel: UDP: bad checksum. From 79.171.53.65:30199 to 1.2.3.4:123 ulen 56
	Apr 27 12:04:31 server kernel: UDP: bad checksum. From 105.112.8.115:16950 to 1.2.3.4:123 ulen 56

1.2.3.4 is the IP of your server, while the "From " part contains the remote hosts which send an invalid UDP packet.

## Defining the new jail

Add these lines to `/etc/fail2ban/jail.local`:

	[ntpd]
	enabled = true
	port = 123
	filter = ntpd
	logpath = /var/log/syslog
	bantime = 3600
	findtime = 10800

All of these settings are explained previously. We will set the jail to be `enabled`, set the port to the NTP port of `123`, specify we will use a filter named `ntpd` while looking in the `/var/log/syslog` log file. The `bantime` is set to 1 hour and the `findtime` is set to 3 hours.

## Defining the new filter

The new filter will be placed in a file named `/etc/fail2ban/filter.d/ntpd.conf`. The filter file contains:

	[INCLUDES]
	before = common.conf
	
	[Definition]
	_daemon = ntpd
	failregex = ^%(__prefix_line)skernel: UDP: bad checksum. From <HOST>:.* to .*$
	ignoreregex =

Our regular expression filter will check for the `UDP: bad checksum` message and take the offender's IP from the `<HOST>` variable.

## Testing the new filter

As mentioned above, you can use `fail2ban-regex` to test your filter is configured correctly:

	server:~# fail2ban-regex /var/log/syslog /etc/fail2ban/filter.d/ntpd.conf
	
	Running tests
	=============
	
	Use regex file : /etc/fail2ban/filter.d/ntpd.conf
	Use log file   : /var/log/syslog
	
	
	Results
	=======
	
	Failregex
	|- Regular expressions:
	|  [1] UDP: bad checksum. From <HOST>:.* to .*$
	|
	`- Number of matches:
	   [1] 5 match(es)
	
	Ignoreregex
	|- Regular expressions:
	|
	`- Number of matches:
	
	Summary
	=======
	
	Addresses found:
	[1]
	    197.161.124.9 (Mon Apr 27 06:26:15 2015)
	    41.222.179.149 (Mon Apr 27 07:50:58 2015)
	    195.171.193.42 (Mon Apr 27 10:42:38 2015)
	    79.171.53.65 (Mon Apr 27 11:28:00 2015)
	    105.112.8.115 (Mon Apr 27 12:04:31 2015)

	Date template hits:
	1873 hit(s): MONTH Day Hour:Minute:Second
	0 hit(s): WEEKDAY MONTH Day Hour:Minute:Second Year
	0 hit(s): WEEKDAY MONTH Day Hour:Minute:Second
	0 hit(s): Year/Month/Day Hour:Minute:Second
	0 hit(s): Day/Month/Year Hour:Minute:Second
	0 hit(s): Day/Month/Year Hour:Minute:Second
	0 hit(s): Day/MONTH/Year:Hour:Minute:Second
	0 hit(s): Month/Day/Year:Hour:Minute:Second
	0 hit(s): Year-Month-Day Hour:Minute:Second
	0 hit(s): Day-MONTH-Year Hour:Minute:Second[.Millisecond]
	0 hit(s): Day-Month-Year Hour:Minute:Second
	0 hit(s): TAI64N
	0 hit(s): Epoch
	0 hit(s): ISO 8601
	0 hit(s): Hour:Minute:Second
	0 hit(s): <Month/Day/Year@Hour:Minute:Second>
	
	Success, the total number of match is 5
	
	However, look at the above section 'Running tests' which could contain important
	information.

If the output looks like above, the filter is configured correctly. Restart fail2ban and you should see the new jail in fail2ban's log file (default `/var/log/fail2ban.log`):

	2015-04-27 12:42:53,340 fail2ban.jail   : INFO   Creating new jail 'ntpd'
	2015-04-27 12:42:53,340 fail2ban.jail   : INFO   Jail 'ntpd' uses poller
	2015-04-27 12:42:53,340 fail2ban.filter : INFO   Added logfile = /var/log/syslog
	2015-04-27 12:42:53,341 fail2ban.filter : INFO   Set maxRetry = 3
	2015-04-27 12:42:53,342 fail2ban.filter : INFO   Set findtime = 10800
	2015-04-27 12:42:53,342 fail2ban.actions: INFO   Set banTime = 3600

That's it - you have configured a new fail2ban jail!


# Troubleshooting

## The jail is not properly configured

Make sure your new jail is picked up by fail2ban. It should be clearly
listed along with its parameters in the `fail2ban.log` file.

## The filter is not correct

Regular expressions can be tricky. Make sure you are getting a match when
testing with `fail2ban-regex`.

## The time is skewed

If your log files are not synchronized with the system's date and timezone,
fail2ban will ignore log entries dated in the future. Make sure every log is
configured to use the system's time zone.

## Check iptables chains

To check iptables chains, use `iptables -L -n -v`. You should see new chains
being created after fail2ban is started, one chain for each configured jail.

## Inspect the fail2ban log

As mentioned before, the fail2ban log file is usually under
`/var/log/fail2ban.log`. Actions will be logged similarly to this:

	2015-04-27 12:43:20,395 fail2ban.actions: WARNING [pure-ftpd] Ban 31.14.85.191
	2015-04-27 13:05:00,861 fail2ban.actions: WARNING [pure-ftpd] Ban 223.240.80.91
	2015-04-27 13:20:44,910 fail2ban.actions: WARNING [ssh] Ban 37.59.230.138


