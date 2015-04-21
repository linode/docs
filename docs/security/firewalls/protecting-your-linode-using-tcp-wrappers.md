---
author:
  name: Francis McNamee
  email: --
description: 'Enhance your server''s security through the use of TCP wrasppers'
keywords: 'tcp wrappers,security,firewall,acl,access control'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/game-servers/minecraft-ubuntu12-04/']
published: 'Wednesday, January 21, 2015'
modified: Monday, January 26, 2015
modified_by:
  name: Elle Krout
title: Protecting your Linode with TCP Wrappers
contributor:
    name: Francis McNamee
---
s
TCP wrappers are a host-based access control system. They are used to prevent unauthorized access to your server by allowing only specific clients access to services running on your server.

## Why use TCP wrappers?

TCP wrappers offer less functionality than a full-blown firewall, but they can be useful by creating an additional layer of security between your server and any potential attacker. TCP wrappers provide logging and hostname verification in addition to access control features. TCP wrappers will work out-of-the-box on most Linux- and UNIX-based operating systems, which makes them extremely easy to set up, and a perfect compliment to your existing firewall implementation.

### How do I know if a program will work with TCP wrappers?

Not all services on your server will have support for TCP wrappers because the programs executable has to be compiled with the *libwrap* library. Common services like `sshd`, `ftpd` and `telnet` all support TCP wrappers. We can check whether TCP wrappers are supported by a service using this command:

    ldd /path-to-daemon | grep libwrap.so

The command `ldd` is used to print a list of all an executables shared dependencies. By attaching `grep` onto the end of the command, we're searching the returned list for `libwrap.so`. If there is any output from this command we can assume that TCP wrappers are supported.

## How do I use TCP wrappers?

TCP wrappers rely on two files in order to work. These files are **hosts.allow** and **hosts.deny**, they're stored in the `/etc/` directory of your server.

1.  Navigate to the `/etc/` directory by using the `cd` command.

        cd /etc/

2.  Here you'll find the two files we need, *hosts.allow* and *hosts.deny*. This command will list all files that start in *hosts.*:

        ls hosts.*

### Editing hosts.allow and hosts.deny

You can edit hosts.allow and hosts.deny with any text editor you like. Open the `hosts.deny` file in your perfered text editor. If you've never opened *hosts.deny* before it will look something like this:

{: .file}
/etc/hosts.deny
:   ~~~
    #
    # hosts.deny	This file contains access rules which are used to
	#		deny connections to network services that either use
	#		the tcp_wrappers library or that have been
	#		started through a tcp_wrappers-enabled xinetd.
	#
	#		The rules in this file can also be set up in
	#		/etc/hosts.allow with a 'deny' option instead.
	#
	#		See 'man 5 hosts_options' and 'man 5 hosts_access'
	#		for information on rule syntax.
	#		See 'man tcpd' for information on tcp_wrappers
	#
    ~~~

Rules can be added to this file. *hosts.deny* rules have to be inserted in a certain order, rules lower down in the file will be ignored if a rule higher up applies. Rules also have a specific syntax that you must adhere to. A rule looks like this:

    daemons : hostnames/IPs

On the left-hand side of the colon you enter a space-separated list of daemons (A daemon is just a process that runs in the background. For example, `sshd` is the daemon for SSH). On the right-hand side of the colon you place a space-separated list of the hostnames, IP addresses and wildcards the rule applies to. 

## Examples

### Deny everything
This example *hosts.deny* file will block all client from all processes.

    ALL : ALL

We could express this rule in a sentence like this, "Deny access to all daemons from all clients". This rule will deny all traffic to the server regardless of the source. Utilizing this rule on its own is not recommended, as it will deny you access to your own server.

### Allow exceptions

Rules in the *hosts.allow* file have a higher priority than rules in the *hosts.deny* file. This allows us to use the *hosts.allow* file to create exceptions to our deny rules.

1.  Open *hosts.allow* in your preferred text editor.

2.  Inside of your *hosts.allow* file you can add your exceptions. Find the IP you want to allow, be that your own IP address or the IP address of another server.

3.  Choose the service to allow the IP address access to. The example below will permit SSH traffic.

    Here's how the rule should appear, replacing `123.45.67.89` with the IP you wish to allow:

        sshd : 123.45.67.89

    When you save the file the rules will automatically take effect.

## Wildcards

TCP wrappers have *wildcards*, allowing you to create broad rules not limited to certain IP addresses or hostnames. The wildcards you can use are, *ALL*, *LOCAL*, *UNKNOWN*, *KNOWN* and *PARANOID*.

Here's what each means:

    ALL - Matches everything
    LOCAL - Matches hostnames that don't contain a dot (.).
    UNKNOWN - Matches any user/hostname whose name is not known.
    KNOWN - Matches any user/hostname whose name is known.
    PARANOID - Matches any host whose name doesn't match its address.


## Logging

TCP wrappers will log connections per the settings in your `/etc/syslog.conf` file. The default location for these log files is the `/var/log/messages` directory.

## Conclusion

You've just learned everything you need to know about securing your server with TCP wrappers. Using TCP wrappers wherever possible along with a strong firewall can help to make your Linode more secure against attacks.
