---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Enhance your server''s security through the use of TCP wrappers'
keywords: ["tcp wrappers", "security", "firewall", "acl", "access control"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2015-04-30
modified: 2015-04-30
modified_by:
  name: Elle Krout
title: Protecting Your Linode with TCP Wrappers
contributor:
    name: Francis McNamee
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

![Protecting your Linode with TCP Wrappers](/docs/assets/protecting-your-linode-with-tcp-wrappers.png "Protecting your Linode with TCP Wrappers")

TCP wrappers are a host-based access control system. They are used to prevent unauthorized access to your server by allowing only specific clients access to services running on your server.

## Why use TCP wrappers?

TCP wrappers create an additional layer of security between your server and any potential attacker. They provide logging and hostname verification in addition to access control features. TCP wrappers will work out-of-the-box on most Linux and UNIX-based operating systems, which makes them easy to set up, and a perfect compliment to your existing firewall implementation.

### How do I know if a program will work with TCP wrappers?

Not all services will support TCP wrappers. Services must be compiled with the `libwrap` library. Common services like `sshd`, `ftpd` and `telnet` support TCP wrappers by default. We can check whether TCP wrappers are supported by a service:

    ldd /path-to-daemon | grep libwrap.so

The command `ldd` prints a list of an executable's shared dependencies. By piping the output of `lld` to `grep`, we're searching the returned list for `libwrap.so`. If there is any output from this command we can assume that TCP wrappers are supported.

For example, if we want to test the `ssh` daemon on a server, we must first locate its binary file:

    whereis sshd

You will most likely get multiple results:

    sshd: /usr/sbin/sshd /usr/share/man/man8/sshd.8.gz

Files located in `/usr/bin` and `/usr/sbin` are most likely the executables you are looking for. Now we know which file to check for the `libwrap` dependency:

    ldd /usr/sbin/sshd | grep libwrap.so
            libwrap.so.0 => /lib/x86_64-linux-gnu/libwrap.so.0 (0x00007ff363c01000)

## How do I use TCP wrappers?

TCP wrappers rely on two files in order to work: `/etc/hosts.allow` and `/etc/hosts.deny`. If these files don't yet exist, create them:

        touch /etc/hosts.{allow,deny}

### Editing hosts.allow and hosts.deny

You can edit hosts.allow and hosts.deny with any text editor you like. Open the `hosts.deny` file in your preferred text editor. If you've never opened *hosts.deny* before it will look something like this:

{{< file "/etc/hosts.deny" >}}
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

{{< /file >}}


Rules can be added to this file. *hosts.deny* rules have to be inserted in a certain order, rules lower down in the file will be ignored if a rule higher up applies. Rules also have a specific syntax that you must adhere to. A rule looks like this:

    daemons : hostnames/IPs

On the left-hand side of the colon you enter a space-separated list of daemons (A daemon is just a process that runs in the background. For example, `sshd` is the daemon for SSH). On the right-hand side of the colon you place a space-separated list of the hostnames, IP addresses and wildcards the rule applies to.

## Examples

### Deny everything
This example *hosts.deny* file will block all client from all processes.

    ALL : ALL

We could express this rule in a sentence like this, "Deny access to all daemons from all clients". This rule will deny all traffic to the server regardless of the source. Utilizing this rule on its own is not recommended, as it will deny you access to your own server, excepting [LISH](/docs/networking/using-the-linode-shell-lish).

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

Here's what each wildcard means:

* ALL - Matches everything.
* LOCAL - Matches hostnames that don't contain a dot (`.`).
* UNKNOWN - Matches any user/hostname whose name is not known.
* KNOWN - Matches any user/hostname whose name is known.
* PARANOID - Matches any host whose name doesn't match its address.


## Logging

TCP wrappers will log connections per the settings in your `/etc/syslog.conf` file. The default location for these log files is the `/var/log/messages` log file.
