---
slug: troubleshooting-web-servers-databases-other-services
author:
  name: Linode
  email: docs@linode.com
description: "Troubleshooting steps for when you can't connect to a service that your Linode runs."
keywords: ['linux','reboot','lish']
tags: ["web server", "database", "networking"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-02-01
modified: 2019-02-01
modified_by:
  name: Linode
title: "Troubleshooting Web Servers, Databases, and Other Services"
aliases: ['/troubleshooting/troubleshooting-web-servers-databases-other-services/']
---

This guide presents troubleshooting strategies for when you can't connect to your web server, database, or other services running on your Linode. This guide assumes that you have access to SSH. If you can't log in with SSH, review [Troubleshooting SSH](/docs/guides/troubleshooting-ssh/) and then return to this guide.

{{< disclosure-note "Where to go for help outside this guide" >}}
This guide explains how to use different troubleshooting commands on your Linode. These commands can produce diagnostic information and logs that may expose the root of your connection issues. For some specific examples of diagnostic information, this guide also explains the corresponding cause of the issue and presents solutions for it.

If the information and logs you gather do not match a solution outlined here, consider searching the [Linode Community Site](https://www.linode.com/community/questions/) for posts that match your system's symptoms. Or, post a new question in the Community Site and include your commands' output.

Linode is not responsible for the configuration or installation of software on your Linode. Refer to Linode's [Scope of Support](/docs/platform/billing-and-support/support/#scope-of-support) for a description of which issues Linode Support can help with.
{{< /disclosure-note >}}

## General Troubleshooting Strategies

This section highlights troubleshooting strategies that apply to every service.

### Check if the Service is Running

The service may not be running. Check the status of the service:

| **Distribution** | **Command**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| ------------ | ------- |
| systemd systems (Arch, Ubuntu 16.04+, Debian 8+, CentOS 7+, etc) | `sudo systemctl status <service name> -l` |
| sysvinit systems (CentOS 6, Ubuntu 14.04, Debian 7, etc) | `sudo service <service name> status` |

### Restart the Service

If the service isn't running, try restarting it:

| **Distribution** | **Command** |
| ------------ | ------- |
| systemd systems | `sudo systemctl restart <service name>` |
| sysVinit systems | `sudo service <service name> restart` |

### Enable the Service

If your system was recently rebooted, and the service didn't start automatically at boot, then it may not be enabled. Enable the service to prevent this from happening in the future:

| **Distribution** | **Command** |
| ------------ | ------- |
| systemd systems | `sudo systemctl enable <service name>` |
| sysVinit systems | `sudo chkconfig <service name> on` |

### Check your Service's Bound IP Address and Ports

Your service may be listening on an unexpected port, or it may not be bound to your public IP address (or whatever address is desirable). To view which address and ports a service is bound on, run the `ss` command with these options:

    sudo ss -atpu

Review the application's documentation for help determining the address and port your service should bind to.

{{< note >}}
One notable example is if a service is only bound to a public IPv4 address and not to an IPv6 address. If a user connects to your Linode over IPv6, they will not be able to access the service.
{{< /note >}}

### Analyze Service Logs

If your service doesn't start normally, review your system logs for the service. Your system logs may be in the following locations:

| **Distribution** | **System Logs** |
| ------------ | ------- |
| systemd systems | [Run `journalctl`](/docs/guides/how-to-use-journalctl/) |
| Ubuntu 14.04, Debian 7 | `/var/log/syslog` |
| CentOS 6 | `/var/log/messages` |

Your service's log location will vary by the application, but they are often stored in `/var/log`. [The `less` command](/docs/guides/how-to-use-less/) is a useful tool for browsing through your logs.

Try pasting your log messages into a search engine or searching for your messages in the [Linode Community Site](https://www.linode.com/community/questions/) to see if anyone else has run into similar issues. If you don't find any results, you can try asking about your issues in a new post on the Linode Community Site. If it becomes difficult to find a solution, you may need to [rebuild your Linode](/docs/troubleshooting/rescue-and-rebuild/#rebuilding).

### Review Firewall Rules

If your service is running but your connections still fail, your firewall (which is likely implemented by the `iptables` software) may be blocking the connections. To review your current firewall ruleset, run:

    sudo iptables -L # displays IPv4 rules
    sudo ip6tables -L # displays IPv6 rules

{{< note >}}
Your deployment may be running FirewallD or UFW, which are frontends used to more easily manage your iptables rules. Run these commands to find out if you are running either package:

    sudo ufw status
    sudo firewall-cmd --state

Review [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw/#ufw-status) and [Introduction to FirewallD on CentOS](/docs/security/firewalls/introduction-to-firewalld-on-centos/#firewall-zones) to learn how to manage and inspect your firewall rules with those packages.
{{< /note >}}

Firewall rulesets can vary widely. Review the [Control Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/) guide to analyze your rules and determine if they are blocking connections. For example, a rule which allows incoming HTTP traffic could look like this:

{{< output >}}
-A INPUT -p tcp -m tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
{{< /output >}}

### Disable Firewall Rules

In addition to analyzing your firewall ruleset, you can also temporarily disable your firewall to test if it is interfering with your connections. Leaving your firewall disabled increases your security risk, so we recommend re-enabling it afterward with a modified ruleset that will accept your connections. Review [Control Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/) for help with this subject.

1.  Create a temporary backup of your current iptables:

        sudo iptables-save > ~/iptables.txt

1.  Set the `INPUT`, `FORWARD` and `OUTPUT` packet policies as `ACCEPT`:

        sudo iptables -P INPUT ACCEPT
        sudo iptables -P FORWARD ACCEPT
        sudo iptables -P OUTPUT ACCEPT

1.  Flush the `nat` table that is consulted when a packet that creates a new connection is encountered:

        sudo iptables -t nat -F

1.  Flush the `mangle` table that is used for specialized packet alteration:

        sudo iptables -t mangle -F

1.  Flush all the chains in the table:

        sudo iptables -F

1.  Delete every non-built-in chain in the table:

        sudo iptables -X

1.  Repeat these steps with the `ip6tables` command to flush your IPv6 rules. Be sure to assign a different name to the IPv6 rules file (e.g. `~/ip6tables.txt`).

## Troubleshoot Web Servers

If your web server is not running or if connections are timing out, review the [general troubleshooting strategies](#general-troubleshooting-strategies).

{{< note >}}
Troubleshooting specific to Apache is outlined in [Troubleshooting Common Apache Issues](/docs/troubleshooting/troubleshooting-common-apache-issues/#check-virtual-host-definitions).
{{< /note >}}

If your web server is responding with an error code, your troubleshooting will vary by what code is returned. For more detailed information about each request that's failing, read your web server's logs. Here are some commands that can help you find your web server's logs:

-   **Apache:**

        grep ErrorLog -r /etc/apache2  # On Ubuntu, Debian
        grep ErrorLog -r /etc/httpd    # On CentOS, Fedora, RHEL

-   **NGINX:**

        grep error_log -r /etc/nginx

### Frequent Error Codes

-   **HTTP 401 Unauthorized, HTTP 403 Forbidden**

    The requesting user did not have sufficient permission or access to the requested URL. Review your web server authorization and access control configuration:

    -   [Apache - Access Control](https://httpd.apache.org/docs/2.4/howto/access.html)

    -   [Apache - Authentication and Authorization](https://httpd.apache.org/docs/2.4/howto/auth.html)

    -   [NGINX - Restricting Access with HTTP Basic Authentication](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/)

-   **HTTP 404 Not Found**

    The URL that a user requested could not be found by the web server. Review your web server configuration and make sure your website files are stored in the right location on your filesystem:

    -   [Apache - Mapping URLs to Filesystem Locations](https://httpd.apache.org/docs/2.4/urlmapping.html)

    -   [NGINX - How nginx processes a request](http://nginx.org/en/docs/http/request_processing.html)

-   **HTTP 500, 502, 503, 504**

    The web server requested a resource from a process it depends on, but the process did not respond as expected. For example, if a database query needs to be performed for a web request, but the database isn't running, then a 50X code will be returned. To troubleshoot these issues, investigate the service that the web server depends on.

## Troubleshoot Databases

### Is your Disk Full?

One common reason that a database may not start is if your disk is full. To check how much disk space you are using, run:

    df -h

{{< note >}}
This reported disk usage is not the same as the reported storage usage in the Linode Manager. The storage usage in the Linode Manager refers to how much of the disk space you pay for is allocated to your Linode's disks. The output of `df -h` shows how full those disks are.
{{< /note >}}

You have several options for resolving disk space issues:

-   Free up space on your disk by locating and removing files you don't need, using a tool like [ncdu](https://dev.yorhel.nl/ncdu).

-   If you have any unallocated space on your Linode (storage that you pay for already but which isn't assigned to your disk), [resize your disk](/docs/guides/resize-a-linode-disk/) to take advantage of the space.

-   [Upgrade your Linode](/docs/guides/resizing-a-linode/) to a higher-tier resource plan and then resize your disk to use the newly available space. If your Linode has a pending free upgrade for your storage space, you can choose to take this free upgrade to solve the issue.

<!-- >
Would be nice to eventually have these instructions in a new "How to Free Up Space on Your Linode" guide and then link to it.
-->

### Database Performance Troubleshooting

If your database is running but returning slowly, research how to optimize the database software for the resources your Linode has. If you run MySQL or MariaDB, read [How to Optimize MySQL Performance Using MySQLTuner](/docs/guides/how-to-optimize-mysql-performance-using-mysqltuner/).
