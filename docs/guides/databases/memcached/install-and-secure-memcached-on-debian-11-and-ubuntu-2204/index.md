---
slug: install-and-secure-memcached-on-debian-11-and-ubuntu-2204
title: "Install and Secure Memcached on Debian 11 and Ubuntu 22.04"
description: "Learn how to install and configure Memcached on Debian and Ubuntu, then secure your installation using SASL authentication and firewall rules."
authors: ["Dan Nielsen"]
contributors: ["Dan Nielsen"]
published: 2024-06-03
keywords: ['memcached', 'debian', 'ubuntu', 'sasl', 'secure memcached']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Memcached](https://www.memcached.org)'
- '[Debian](https://www.debian.org)'
---

## Introduction

*Memcached* is an in-memory key-value store for small chunks of arbitrary data. Memory object caching systems like Memcached temporarily store frequently accessed data. This can improve system performance by reducing direct requests to databases. Typically, Memcached is used to speed up web applications.

This guide covers the installation of Memcached on Debian 11 and Ubuntu 22.04 LTS. It also includes information on securing the Memcached instance.

## Before You Begin

1.  If you do not already have a virtual machine to use, create a Compute Instance with at least 4 GB of memory. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Follow our [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/) guide to install UFW, allow SSH access, and enable the firewall.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Memcached

Memcached is available from the official Debian and Ubuntu repositories.

1.  First, install Memcached:

    ```command
    sudo apt install memcached
    ```

1.  Next, install `libmemcached-tools`, a library that provides several tools for interacting with Memcached servers:

    ```command
    sudo apt install libmemcached-tools
    ```

1.  Verify that Memcached is installed and running:

    ```command
    sudo systemctl status memcached
    ```

    The expected output should resemble:

    ```output
    ● memcached.service - memcached daemon
         Loaded: loaded (/lib/systemd/system/memcached.service; enabled; vendor preset: enabled)
         Active: active (running) since Thu 2024-06-06 11:29:42 EDT; 18s ago
    ```

    Press the <kbd>Q</kbd> to exit the status output and return to the terminal prompt.

1.  Make sure that Memcached is listening on the default address:

    ```command
    sudo ss -plunt | grep memcached
    ```

    By default, there should only be one IPv4 localhost (`127.0.0.1`) entry for Memcached:

    ```output
    tcp   LISTEN 0      1024       127.0.0.1:11211      0.0.0.0:*    users:(("memcached",pid=1789,fd=26))
    ```

1.  Use the `memcstat` tool to check the status of Memcached on `127.0.0.1`:

    ```command
    memcstat --servers="127.0.0.1"
    ```

    ```output
    Server: 127.0.0.1 (11211)
	     pid: 1789
	     uptime: 420
	     time: 1717688200
	     version: 1.6.9
    ...
    ```

## Securing the Installation

The following sections cover various solutions for securing a Memcached installation. These steps are not strictly necessary when Memcached listens locally. However, if Memcached is exposed over the network, all of these sections should be completed.

### Open External Access and Disable UDP

1.  Open the `/etc/memcached.conf` file:

    ```command
    sudo nano /etc/memcached.conf
    ```

    The default Memcached network address on Debian and Ubuntu is the local address (`127.0.0.1`). To open Memcached over the network, add your Compute Instances's external IP address. Disabling UDP using `-U 0` in the configuration is also recommended when opening Memcached access.

    ```file {title="/etc/memcached.conf" lang="conf" linenostart="31" hl_lines="6-9"}
    ...
    # Specify which IP address to listen on. The default is to listen on all IP addresses
    # This parameter is one of the only security measures that memcached has, so make sure
    # it's listening on a firewalled interface.
    -l 127.0.0.1
    -l {{< placeholder "IP_ADDRESS" >}}

    # Disable UDP
    -U 0

    # Limit the number of simultaneous incoming connections. The daemon default is 10>
    # -c 1024
    ...
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart Memcached to apply the changes:

    ```command
    sudo systemctl restart memcached
    ```

1.  Verify the network changes with the `ss` and `grep` commands from before:

    ```command
    sudo ss -plunt | grep memcached
    ```

    There should now be a second Memcached entry for your compute instance's external IP address:

    ```output
    tcp   LISTEN 0      1024        {{< placeholder "IP_ADDRESS" >}}:11211      0.0.0.0:*    users:(("memcached",pid=2477,fd=27))
    tcp   LISTEN 0      1024         127.0.0.1:11211      0.0.0.0:*    users:(("memcached",pid=2477,fd=26))
    ```

1.  Now use the `memcstat` tool to check the status of Memcached on your Compute Instance's external `{{< placeholder "IP_ADDRESS" >}}`:

    ```command
    memcstat --servers="{{< placeholder "IP_ADDRESS" >}}"
    ```

    ```output
    Server: {{< placeholder "IP_ADDRESS" >}} (11211)
	     pid: 2477
	     uptime: 203
	     time: 1717688684
	     version: 1.6.9
    ...
    ```

### Add Firewall Rules

This guide uses `ufw` to manage the firewall.

1.  Add a single firewall rule to allow limited access to port `11211` from a remote machine. Make sure to replace {{< placeholder "CLIENT_IP_ADDRESS" >}} with the IP address of the remote machine that you want to access the Memcached server from:

    ```command
    sudo ufw allow proto tcp from {{< placeholder "CLIENT_IP_ADDRESS" >}} to any port 11211
    ```

    ```output
    Rule added
    ```

1.  Verify that the rule has been added to UFW:

    ```command
    sudo ufw status
    ```

    ```output
    Status: active

    To                         Action      From
    --                         ------      ----
    22/tcp                     ALLOW       Anywhere
    11211/tcp                  ALLOW       {{< placeholder "CLIENT_IP_ADDRESS" >}}
    22/tcp (v6)                ALLOW       Anywhere (v6)
    ```

1.  From the remote client machine, run `memcstat` again on your Compute Instance's external {{< placeholder "IP_ADDRESS" >}} to confirm a connection:

    ```command
    memcstat --servers="{{< placeholder "IP_ADDRESS" >}}"
    ```

    ```output
    Server: 172.233.162.226 (11211)
	     pid: 2477
	     uptime: 1102
	     time: 1717689583
	     version: 1.6.9
    ```

    {{< note >}}
    The remote client machine must also have Memcached and `libmemcached-tools` installed.
    {{< /note >}}

### Install and Configure SASL

Memcached doesn't provide internal authentication procedures. However, Simple Authentication and Security Layer (SASL) can be used to provide authentication to Memcached. SASL is a framework that de-couples authentication procedures from application protocols.

1.  First, install SASL:

    ```command
    sudo apt install sasl2-bin
    ```

1.  Next, create the directory that the Memcached uses for SASL configuration:

    ```command
    sudo mkdir -p /etc/sasl2
    ```

1.  Now create a `memcached.conf` SASL configuration file in that directory:

    ```command
    sudo nano /etc/sasl2/memcached.conf
    ```

    Add the following content to the SASL configuration file:

    ```file {title="/etc/sasl2/memcached.conf" lang="conf"}
    mech_list: plain
    log_level: 5
    sasldb_path: /etc/sasl2/memcached-sasldb2
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

### Add Authorized Users

1.  Create a SASL database and user. Be sure to replace {{< placeholder "SASL_USERNAME" >}} with a username of your choice:

    ```command
    sudo saslpasswd2 -a memcached -c -f /etc/sasl2/memcached-sasldb2 {{< placeholder "SASL_USERNAME" >}}
    ```

    Provide a password of your choosing, then verify that password:

    ```output
    Password:
    Again (for verification):
    ```

1.  Finally, give Memcached ownership of the database:

    ```command
    sudo chown memcache:memcache /etc/sasl2/memcached-sasldb2
    ```

### Enable SASL

1.  Open the `/etc/memcached.conf` file once again:

    ```command
    sudo nano /etc/memcached.conf
    ```

    Enable SASL by adding the `-S` parameter to `/etc/memcached.conf`:

    ```file {title="/etc/memcached.conf" lang="conf" linenostart="31" hl_lines="11,12"}
    ...
    # Specify which IP address to listen on. The default is to listen on all IP addresses
    # This parameter is one of the only security measures that memcached has, so make sure
    # it's listening on a firewalled interface.
    -l 127.0.0.1
    -l {{< placeholder "IP_ADDRESS" >}}

    # Disable UDP
    -U 0

    # Enable SASL authenication
    -S

    # Limit the number of simultaneous incoming connections. The daemon default is 10>
    # -c 1024
    ...
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart Memcached to apply the changes:

    ```command
    sudo systemctl restart memcached
    ```

1.  Check the Memcached status locally once again. Be sure to replace {{< placeholder "SASL_USERNAME" >}} and {{< placeholder "SASL_PASSWORD" >}} with your chosen username and password:

    ```command
    sudo memcstat --servers="127.0.0.1" --username="{{< placeholder "SASL_USERNAME" >}}" --password="{{< placeholder "SASL_PASSWORD" >}}"
    ```

    The output should look similar to this:

    ```output
    Server: 127.0.0.1 (11211)
	     pid: 2956
	     uptime: 198
	     time: 1717690598
	     version: 1.6.9
    ...
    ```

1.  Repeat the process from the remote machine, using your Compute Instance's external IP address instead of `127.0.0.1`:

    ```command
    sudo memcstat --servers="{{< placeholder "IP_ADDRESS" >}}" --username="{{< placeholder "SASL_USERNAME" >}}" --password="{{< placeholder "SASL_PASSWORD" >}}"
    ```

    The output should be the same as above:

    ```output
    Server: 172.233.162.226 (11211)
	     pid: 2956
	     uptime: 271
	     time: 1717690671
	     version: 1.6.9
    ...
    ```

## Conclusion

Memcached enhances the performance and scalability of web applications by caching frequently accessed data. Implementing SASL authentication and firewall rules on your Memcached server can help protect it from unauthorized access and other potential security threats.