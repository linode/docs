---
author:
  name: Linode Community
  email: docs@linode.com
description: '7 Easy Ways to improve SSH Server security'
keywords: 'SSH,Ubuntu,CentOS,security,2FA, server, Linux, port knock, fwknop, knockd, knockknock'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: ''
modified: ''
modified_by:
  name: Linode
title: '7 Easy Ways to improve SSH Server security'
contributor:
  name: Damaso Sanoja
  link: https://github.com/damasosanoja
external_resources:
 - '[OpenSSH](http://www.openssh.com/)'
 - '[knockd](http://zeroflux.org/projects/knock)'
 - '[knockknock](https://moxie.org/software/knockknock/)'
 - '[fwknop](http://www.cipherdyne.org/fwknop/)'
 - '[Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[OpenSSH](http://www.openssh.com/) is a suite of connectivity tools which sysadmins use daily to access remote servers. From a security point of view it's the "front door" for remote logins, and that's why is extremely important to harden it as much as possible.

The aim of this article is to go beyond [Securing Your Server](/docs/security/securing-your-server/) guide by means of seven easy steps that can be implemented in less than 10 minutes. This article also covers an "eighth step" which adds another extra layer of security through port knocking techniques.

**Assumptions:**

* You'll be deploying a Production Server open to the internet 24/7.
* Your primary concern is security over complexity or convenience. This point is very important be aware that more security implies, in most cases, less convenience.

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, create a basic firewall ruleset and remove unnecessary network services; this guide will use `sudo` wherever possible.

3.  Log in to your Linode via SSH and check for updates using the corresponding package manager: `apt-get` (Ubuntu/Debian) or `yum` (RHEL/CentOS) .

<!--comment -->

  sudo apt-get update && sudo apt-get upgrade
  sudo yum update

## Step 1: Enforce the use of stronger Diffie-Hellman algorithm

[Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) is the name of an asymmetric algorithm used to securely exchange cryptographic keys over public channels (like Internet). OpenSSH uses the D-H algorithm based in a configuration file located at `/etc/ssh/moduli`. Many IT news alerted about the possibility that several nations could have broken commonly used primes which means they can read encrypted traffic transmitted over "secure" channels.
Protecting your server against that threat is fairly simple, just edit the `/etc/ssh/moduli` file and comment the lines where the fifth field is 1023 or 1535 (approximately the first 87 lines). That forces the D-H to use keys from Group 14 (2048-bit) as minimum. Higher groups means more secure keys (less likely to be broken in near future) but also require additional time to compute.

![Enforcing a stronger Diffie-Hellman algorithm](/docs/assets/diffie_hellman_screenshot.png)

## Step 2: Implement SSH access control directives

## Step 3: Use a strong password for key-pair phrase

## Step 4: Chroot users when possible

## Step 5: Update regularly your revoked keys list

## Step 6: Reduce timeout interval and login grace time

## Step 7: Use a warning banner

## Step 8: Implement port knocking techniques (optional)

Previous steps focused on using best practices to harden SSH communications. Formally speaking port knocking methods add security to SSH communications "through obscurity", and not by hardening SSH protocol itself. This goal is achieved using a principle similar to old fashioned door knocking password: server's ports "seem" to be closed but behind the firewall a port knocking daemon is listening to all traffic waiting the "correct port knock sequence / encrypted packet" to open a previously configured port(s). The following figure shows a simplified comparison between a traditional SSH communication scheme and a port knocking implementation.

![SSH extra-layer of security through Port Knocking](/docs/assets/port_knocking_diagram.jpg)

Although port knocking principles are common to all solutions, not all implementations are created equal. For the purpose of this guide three methods are explained, ranging from the easier to the harder to implement:

* knockd
* knockknock
* fwknop

### Firewall preparation

### knockd

### knockknock

### fwknop


