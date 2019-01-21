---
author:
  name: Linode
  email: docs@linode.com
description: "Troubleshooting steps for when you can't connect to your Linode."
keywords: ['linux','reboot','lish']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-01-21
modified: 2019-01-21
modified_by:
  name: Linode
title: "Troubleshooting SSH"
---

EDITOR'S NOTE: This outline attempts to cover connection issues logically in ascending order: booting issues -> basic connectivity (routing or network interface issues) -> SSH -> other services (http, mysql, etc)

EDITOR'S NOTE: Some of these sections only include commands for systemd or Debian etc. Final version of this guide should optimally include commands for all recent-ish distros.

Sometimes through the course of updating or altering a Linode you might be unable to connect to your Linode through SSH or through other services you may run. The following are steps to regain access to your Linode should you lose access to those services.

{{< note >}}
Linode is not responsible for the configuration or installation of software on your Linode, etc. Could link to the newly edited Support guide for more information, or a link to the TOS.

Also say something like:
Various parts of this guide involve running diagnostic troubleshooting commands on your Linode, which can produce clues about the root of your connection issues. Several parts of this guide highlight frequent causes of connection issues and the diagnostic command output they correspond to. If the diagnostic information you've gathered does not match a solution presented here, consider searching the [Linode Community Site](link) for similar issues. Or, post a new question in the Community Site and include your commands' output.
{{< /note >}}

## Troubleshoot SSH

EDITOR's NOTE: Some example output can be found in https://www.linode.com/community/questions/400/why-cant-i-connect-to-my-linode-via-ssh

We may need to include more new example output here thats not in that community question. It could be good to insert those into disclosure-notes (Attempt to Connect to SSH in Verbose Mode section shows how to do that).

### Review SSH Service Status and Logs

Check on status:

    sudo systemctl status ssh -l

If it's not running, try restarting it:

    sudo systemctl restart ssh

If it won't run, check for error messages:

    sudo journalctl -u ssh --no-pager | tail -20

### Review SSH Login Attempts

[Use the `less` command](/docs/quick-answers/linux/how-to-use-less/) to inspect your authorization logs:

    sudo less /var/log/auth.log # Ubuntu/Debian
    sudo less /var/log/secure # CentOS

### Attempt to Connect to SSH in Verbose Mode

SSH into your server from your local computer in verbose mode:

    ssh -vvv <user>@<IP address>

This will give exacting details about why the SSH connection is not working, and may be useful.

{{< disclosure-note "Example output from a successful connection" >}}
Include example successful connection output here
{{< /disclosure-note >}}

### Is SSH Running on another Port?

Run `netstat` on your Linode to check which port is used by SSH:

    sudo netstat -plntu

SSH runs on 22 by default, but you may have changed it in your SSH config. Include instructions here for changing the config, or specifying the port in the SSH client command.

### Is Root Login Permitted?

Describe how root logins can be disabled in the SSH config, where to check on that (see command below), and what to adjust to turn it back on if it's disabled:

egrep -i 'permit' /etc/ssh/sshd_config

### Are Password Logins Accepted?

Describe how password logins can be enabled/disabled, where to check on that (see command below), and what to adjust to turn it back on if it's disabled:

egrep -i 'password' /etc/ssh/sshd_config

### Is your Public Key Stored on the Server?

Include instructions for checking which SSH private keys are on the client computer vs. which are on the Linode. Refer back to verbose mode to show which keys were tried by the client/server.

### Is your Firewall Blocking SSH?

Link back to [Review Firewall Rules](#review-firewall-rules) back in basic connectivity section, add some context about looking for rules on the port that matches SSH (22 by default but could be custom).