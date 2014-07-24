---
author:
  name: Linode
  email: docs@linode.com
description: 'Blocking malicious server probes from botnets with the open source Fail2ban network security tool.'
keywords: 'fail2ban,ssh probes,network security'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['security/fail2ban/']
modified: Tuesday, May 24th, 2011
modified_by:
  name: Amanda Folson
published: 'Tuesday, September 8th, 2009'
title: Using Fail2ban to Block Network Probes
---

Internet servers are routinely exposed to a barrage of attempts to gain unauthorized access to server resources. Common targets include SSH, SMTP, HTTP authentication, and FTP services. This guide will help you use [Fail2ban](http://www.fail2ban.org) on your Linux VPS to block automated attempts to compromise the system.

Please note that Fail2ban should not be relied upon as your sole means of preventing unauthorized access to services. It is useful in scenarios where you are required to allow password logins to services like SSH; it reduces the likelihood of an account being compromised, but does not eliminate it due to the highly distributed nature of botnet attacks.

This guide assumes you've completed the steps outlined in our [getting started guide](/docs/getting-started/). Make sure you're logged into your VPS as root before proceeding.

Installing and Using Fail2ban
-----------------------------

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

On Debian and Ubuntu systems, issue the following command to get Fail2ban installed:

    apt-get install fail2ban 

Edit the configuration file `/etc/fail2ban/jail.conf` to set up blocking for various services. SSH blocking will be enabled by default. To make sure you don't accidentally lock yourself out of services, you can set the `ignoreip` variable to match your home or office connection's IP address. Set `bantime` to specify how long (in seconds) bans should last. The `maxretry` variable specifies the default number of tries a connection may be attempted by any IP before a ban is put in place.

Fail2ban will monitor your log files for failed login attempts. After an IP address has exceeded the maximum number of authentication attempts, it will be blocked at the network level and the event will be logged in `/var/log/fail2ban.log`.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Fail2ban Project Site](http://www.fail2ban.org/)
- [Fail2ban Manual Page](http://linux.die.net/man/8/fail2ban)



