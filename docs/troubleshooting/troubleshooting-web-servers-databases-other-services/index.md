---
author:
  name: Linode
  email: docs@linode.com
description: 'Troubleshooting steps to access your Linode after maintenance has been applied to your host.'
keywords: ['linux','reboot','lish']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-01-21
modified: 2019-01-21
modified_by:
  name: Linode
title: "Troubleshooting Web Servers, Databases, and Other Services"
---

## Troubleshoot Other Services

If you can establish an SSH connection, but some of your other services aren't working, here's more troubleshooting goodness:

### Check if the Service is Running

EDITOR's NOTE: Also include instructions for non-systemd systems

On systemd systems, check the logs for the service. Example:

    sudo systemctl status mysql -l
    sudo journalctl -u mysql

Try restarting the service:

    sudo systemctl restart mysql

For Apache issues, review the [Troubleshooting Common Apache Issues](/docs/troubleshooting/troubleshooting-common-apache-issues/)

### Check if the Service is Enabled at Boot

Take instructions from https://www.linode.com/docs/troubleshooting/disaster-recovery-guide/#did-all-of-your-services-start-after-reboot

### Review Application Logs

EDITOR'S NOTE: Not sure if we should include this section, but possibly:

Show locations for common application logs maintained outside of the system logs, e.g.:

MySQL: /var/log/mysql + the slow queries log
Show how to turn slow queries log on

PHP: /var/log/php, or check phpinfo() from web browser to see where log file is

Apache: See dedicated apache guide

NGINX: /var/log/nginx, or check log location in nginx config

### Is your Disk Full?

If you're having issues with your database service, one common reason a database might not run as expected is if your disk is full. To check on your current disk usage, run the `df` command:

    df -h

{{< note >}}
Note about how this is not the same thing as the reported unallocated space in the Linode Manager.
{{< /note >}}

Include instructions for how to resolve this situation:

-   Free up space on your disk by locating and removing files you don't need, using a tool like du or ncdu

-   Resize the disk if you have any unallocated space on your Linode

-   Upgrade your Linode (either through a free upgrade if one is available or by resizing to a higher tier) and then resize your disk to use the newly available space.

Or, consider putting those instructions into a new "How to Free Up Space on Your Linode" guide and then link to it.

### Check which IP Addresses and Ports your Services Are Bound To

Include instructions for using `netstat -plntu` to see which processes are listening on which ports and which addresses. Possible example problems:

-   Web server is only listening on the IPv4 address, not also the IPv6 address (which is a common problem for users trying to connect to a website via a cell phone, as those networks seem to prefer IPv6).

-   Service not listening on a standard port. Include markdown table of common services+ports

### Is your Firewall Blocking the Service?

Link back to [Review Firewall Rules](#review-firewall-rules) back in basic connectivity section, add some context about looking for rules on the port that matches your service (e.g. 80 for HTTP).