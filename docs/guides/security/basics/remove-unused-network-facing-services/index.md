---
slug: remove-unused-network-facing-services
description: "Learn how to remove unused services that are exposed to the network and why you should."
keywords: ["security", "secure", "remove services"]
tags: ["security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-16
modified: 2022-02-15
modified_by:
  name: Linode
title: "Remove Unused Network-Facing Services"
title_meta: "How to Remove Unused Network-Facing Services"
authors: ["Linode"]
---

Most Linux distributions install with running network services which listen for incoming connections from the internet, the loopback interface, or a combination of both. Network-facing services which are not needed should be removed from the system to reduce the attack surface of both running processes and installed packages.

### Determine Running Services

To see your Linode's running network services:

    sudo ss -atpu

The following is an example of the output given by `ss`, and shows that the SSH daemon (sshd) is listening and connected. Note that because distributions run different services by default, your output will differ.

{{< output >}}
Netid State   Recv-Q Send-Q   Local Address:Port   Peer Address:Port
tcp   LISTEN     0      128               *:ssh               *:*        users:(("sshd",pid=3675,fd=3))
tcp   ESTAB      0      208     203.0.113.1:ssh    198.51.100.2:54820    users:(("sshd",pid=3698,fd=3))
tcp   LISTEN     0      128              :::ssh              :::*        users:(("sshd",pid=3675,fd=4))
{{< /output >}}

#### TCP

See the **Peer Address:Port** column of the `ss` readout. The process `sshd` is listening on `*:*`, which translates into any incoming IPv4 address to any port, and over any network interface. The next line shows an established SSH connection from IP address 198.51.100.2 via ephemeral port 54820. The last line, `:::*` denotes the `sshd` process listening for any incoming SSH connections over IPv6 to any port, and again over any network interface.

#### UDP

UDP sockets are *[stateless](https://en.wikipedia.org/wiki/Stateless_protocol)*, meaning they are either open or closed and every process's connection is independent of those which occurred before and after. This is in contrast to TCP connection states such as *LISTEN*, *ESTABLISHED* and *CLOSE_WAIT*. The `ss` output above shows no UDP connections.


### Determine Which Services to Remove

A basic TCP and UDP [nmap](https://nmap.org/) scan of your Linode without a firewall enabled would show SSH and possibly other services listening for incoming connections. By [configuring a firewall](#configure-a-firewall) you can filter those ports to your requirements. Ideally, the unused services should be disabled.

You will likely be administering your server primarily through an SSH connection, so that service needs to stay. As mentioned above, [RSA keys](/docs/products/compute/compute-instances/guides/set-up-and-secure/#create-an-authentication-key-pair) and [Fail2Ban](/docs/products/compute/compute-instances/guides/set-up-and-secure/#use-fail2ban-for-ssh-login-protection) can help protect SSH. System services like `chronyd`, `systemd-resolved`, and `dnsmasq` are usually listening on localhost and only occasionally contacting the outside world. Services like this are part of your operating system and will cause problems if removed and not properly substituted.

However, some services are unnecessary and should be removed unless you have a specific need for them. Some examples could be [Exim](https://www.exim.org/), [Apache](https://httpd.apache.org/) and [RPC](https://en.wikipedia.org/wiki/Open_Network_Computing_Remote_Procedure_Call).

{{< note respectIndent=false >}}
If you are using the [Apache](https://httpd.apache.org/) web server as part of your configuration, it is recommended in most cases to disable `Directory Listing` as this setting is enabled by default and can pose a security risk. For more information, see [Apache's Documentation](https://cwiki.apache.org/confluence/display/HTTPD/DirectoryListings).
{{< /note >}}

### Uninstall the Listening Services

How to remove the offending packages will differ depending on your distribution's package manager.

**CentOS**

    sudo yum remove package_name

**Debian / Ubuntu**

    sudo apt purge package_name

**Fedora**

    sudo dnf remove package_name

Run `ss -atup` again to verify that the unwanted services are no longer running.