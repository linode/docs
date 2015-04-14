---
author:
  name: Francis McNamee
  email: --
description: 'Enhance your server''s security through the use of TCP wrasppers'
keywords: 'garry''s mod,centos,centos 7'
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

Don't worry it's not as bad as it sounds and in this guide you'll learn everything you need to know about TCP wrappers. TCP wrappers are just a host-based access control system and they're a great way to prevent unauthorized access to your server because they give you the power to allow only specific clients access to specific services running on your server.

## Why use TCP wrappers?

TCP wrappers offer less functionality than a full-blown firewall but they can be useful by creating an additional layer of security between your server and any potential attacker. TCP wrappers will work out-of-the-box on most Linux- and UNIX-based operating systems, which makes them extremely easy to setup because all you need to do is tell the operating system what you want to allow and what you want to block.

TCP wrappers don't just provide access control features, they also provide a logging system and hostname verification.

Not all services on your server will have support for TCP wrappers because the programs executable has to be compiled with the *libwrap* library.

### How do I know if a program will work with TCP wrappers?

Luckily, most popular services on your server have got support for TCP wrappers. Services like `sshd`, `ftpd` and `telnet` all support TCP wrappers. We can check whether TCP wrappers are supported by a service using this command:

    ldd /path-to-daemon | grep libwrap.so

The command `ldd` is used to print a list of all an executables shared dependencies. By attaching `grep` onto the end of the command, we're searching the returned list for `libwrap.so`. If there is any output from this command we can assume that TCP wrappers are supported.

## How do I use TCP wrappers?

TCP wrappers rely on two files in order to work. These files are **hosts.allow** and **hosts.deny**, they're stored in the `/etc/` directory of your server. Let's get to work!

1.  Navigate to the `/etc/` directory by using the `cd` command.

        cd /etc/

2.  Here you'll find the two files we need, *hosts.allow* and *hosts.deny*. This command will list all files that start in *hosts.*:

        ls hosts.*

    The `hosts.allow` and `hosts.deny` files should be output.

### Editing hosts.allow and hosts.deny

You can edit hosts.allow and hosts.deny with any text editor you like. Open the `hosts.deny` file in your perfered text editor, such as `nano`:

    nano hosts.deny

If you've never opened *hosts.deny* before it will look something like this:

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

So, let's write some rules. *hosts.deny* rules have to be written in a certain order, this is because rules lower down in the file will be ignored if a rule higher up applies. Don't worry, this will be clear when we write our rules.

Rules also have a specific syntax that you must adhere to. A rule looks like this:

    daemons : hostnames/IPs

On the left-hand side of the colon you enter a space-separated list of daemons (A daemon is just a process that runs in the background. For example, `sshd` is the daemon for SSH). On the right-hand side of the colon you place a space-separated list of the hostnames, IP addresses and wildcards the rule applies to. 

## Examples

### Deny everything
This example *hosts.deny* file will block all client from all processes.

    ALL : ALL

We could express this rule in a sentence like this, "Deny access to all daemons from all clients". That means it doesn't matter where a connection comes from or what their IP address is, the server will deny them access. This rule on its own is probably not what you want, seeing as it will deny you access to your own server.

To make this more useful we can add some rules into our *hosts.allow* file. Rules in the *hosts.allow* file have a higher priority than rules in the *hosts.deny* file. This allows us to use the *hosts.allow* file to create exceptions to our deny rules.

### Allow exceptions

1.  Open *hosts.allow* in your preferred text editor.

2.  Inside of your *hosts.allow* file you can add your exceptions. I'm going to create an exception that will allow me access from my home network. Find the IP you want to allow, be that your own IP address or the IP address of another server.

3.  Choose the service you want to allow the IP address access to. I'll choose `sshd`, this will allow me SSH access to my server from my home network.

    Here's what your rule should look like, replacing `123.45.67.89` with the IP:

        sshd : 123.45.67.89

    When you save the file the rules will automatically take affect, you don't need to restart any services on your server.

## Wildcards

TCP wrappers have *wildcards*, these allow you to create broad rules that aren't limited to certain IP addresses or hostnames. The wildcards you can use are, *ALL*, *LOCAL*, *UNKNOWN*, *KNOWN* and *PARANOID*.

Here's what each means:

    ALL - Matches everything
    LOCAL - Matches hostnames that don't contain a dot (.).
    UNKNOWN - Matches any user/hostname whose name is not known.
    KNOWN - Matches any user/hostname whose name is known.
    PARANOID - Matches any host whose name doesn't match its address.


## Logging

TCP wrappers will log connections according to your `/etc/syslog.conf` file. On Linux systems the default location for these logs to appear in is, `/var/log/messages`.

## Conclusion

You've just learned everything you need to know about securing your server with TCP wrappers. Just a final thing to note, while TCP wrappers make an excellent addition to your servers security, they shouldn't be used instead of a firewall. But they are useful because a firewall cannot examine encrypted connections.

You should use TCP wrappers wherever possible to enhance your servers security alongside a strong firewall.
