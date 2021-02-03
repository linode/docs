---
slug: install-and-secure-memcached-on-debian
author:
  name: Dan Nielsen
  email: dnielsen@fastmail.fm
description: 'How to Install and Secure Memcached on Debian.'
og_description: 'How to Install and Secure Memcached on Debian.'
keywords: ['memcached', 'debian', 'caching']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-01
modified_by:
  name: Linode
title: "Install and Secure Memcached on Debian"
h1_title: "Install and Secure Memcached on Debian"
contributor:
  name: Dan Nielsen
  link: https://github.com/danielsen
external_resources:
- '[Memcached](https://www.memcached.org)'
- '[Debian](https://www.debian.org)'
---

## Introduction

Memcached is an in-memory key-value store for small chunks of arbitrary data. Memory object caching systems like Memcached temporarily store frequently accessed data. In this way they can improve system performance by reducing direct requests to databases. Typically, memcached is used to speed up web applications.

This guide covers installation of memcached on Debian and derivative Linux systems and includes information on securing the memcached instance.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Install Memcached from the Official Repositories

Begin by installing Memcached and `libmemcached-tools`. `libmemcached-tools` is a library that provides several tools for interacting with Memcached servers.

        sudo apt-get install memcached libmemcached-tools

Verify that Memcached is installed and running using:

        sudo systemctl status memcached

Set Memcached to start at boot:

        sudo systemctl enable memcached

## Securing the Installation

The following sections cover various solutions for securing a Memcached installation. These are not strictly necessary when Memcached listens locally. When Memcached is exposed over the network all of these sections should be completed.

### Securing the Memcached Configuration

The default Memcached network address on Debian and Ubuntu is the local address. To open memcached over the network, change that setting your Linode's IP address. Disabling UDP using `-U 0` in the configuration is recommended when opening Memcached access.

{{< file "/etc/memcached.conf" conf >}}
. . .
-l 127.0.0.1            # Listen on local address only
-l linode_ip_address    # Listen on the host public address
. . .
-U 0                    # Disable UDP
{{< /file >}}

Restart Memcached to apply the changes:

        sudo systemctl restart memcached

Verify the network changes with `ss -plunt` or `netstat -plunt`. The output should be similar to this:

{{< output >}}
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
. . .
tcp        0      0 127.0.0.1:11211         0.0.0.0:*               LISTEN      users:(("memcached",pid=0000,fd=1))
. . .
{{< /output >}}

### Adding Firewall Rules

{{< note >}}
If your Linode is **not** accessible to the broader internet you can skip this section. You can also skip this section if Memcached is only listening on the local address.
{{< /note >}}

A single firewall rule is added to restrict access to port 11211. `ufw` is used in this guide to manage the firewall. Make sure to replace `linode_ip/24` with the correct IP or CIDR.

        sudo ufw allow proto tcp from linode_ip/24 to any port 11211
        sudo ufw restart

### Adding Authorized Users

Memcached doesn't provide internal authentication procedures. However, Simple Authentication and Security Layer (SASL) can be used to provide authentication to Memcached. SASL is a framework that de-couples authentication procedures from application protocols.

Confirm that the Memcached instance is up and running:

        sudo memcstat --servers="127.0.0.1"

The output should look similar to:

{{< output >}}
Server: 127.0.0.1 (11211)
    pid: 4021
    uptime: 398
    . . .
{{< /output >}}

Move on to enabling SASL by adding the `-S` parameter to `/etc/memcached.conf`.

{{< file "/etc/memcached.conf" conf >}}
. . .
# Enable SASL authenication
-S
. . .
{{< /file >}}

Restart Memcached:

        sudo systemctl restart memcached

At this point, checking the status using `memcstat` should produce no output.

        sudo memcstat --servers="127.0.0.1"
        # Check the exit code, should output '1'
        echo $?

#### Add and Configure SASL

SASL can now be installed and configured.

        sudo apt-get install sasl2-bin

Create the directory and file that the Memcached uses for SASL configuration.

        sudo mkdir -p /etc/sasl2
        sudo touch /etc/sasl2/memcached.conf

Add the following to the SASL configuration file.

{{< file "/etc/sasl2/memcached.conf" yaml >}}
mech_list: plain
log_level: 5
sasldb_path: /etc/sasl2/memcached-sasldb2
{{< /file >}}

Create a SASL database and user. In this example, the user is `admin`.

        sudo saslpasswd2 -a memcached -c -f /etc/sasl2/memcached-sasldb2 admin

Finally, give Memcached ownership of the database and restart Memcached.

        sudo chown memcache:memcache /etc/sasl2/memcached-sasldb2
        sudo systemctl restart memcached

Check the Memcached status.

        sudo memcstat --servers="127.0.0.1" --username=admin --password="the_chosen_password"

The output should look similar to this:

{{< output >}}
Server: 127.0.0.1 (11211)
    pid: 4021
    uptime: 398
    . . .
{{< /output >}}
