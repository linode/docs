---
slug: getting-started-with-salt-basic-installation-and-setup
description: 'Salt is a server management platform that can control a number of servers from a single location. Learn how to install Salt in this simple tutorial.'
keywords: ["salt", "configuration management"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/applications/configuration-management/install-and-configure-salt-master-and-minion-servers/','/applications/salt/install-salt/','/applications/configuration-management/install-salt/','/applications/configuration-management/getting-started-with-salt-basic-installation-and-setup/','/applications/configuration-management/salt/getting-started-with-salt-basic-installation-and-setup/']
modified: 2019-01-02
modified_by:
    name: Linode
image: GettingStartedwithSalt.png
published: 2015-09-22
title: Getting Started with Salt - Basic Installation and Setup
tags: ["automation","salt"]
authors: ["Linode"]
---

[Salt](https://saltproject.io/) is a Python-based configuration management platform designed to control a number of slave servers (called Minions in Salt terminology) from a single master server. This guide walks you through configuring a Salt Master and Minion, and is relevant to any supported Linux distribution.


## Before You Begin

-  You will need at least two Linodes: One will function as the Salt Master and the other(s) as Salt Minions.

-  Set each Linode's [hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname). The hostname will be used to identify each Linode within Salt so be specific with their naming (e.g. master, minion1, minion2, etc.).

-  We recommend that you configure [private IP addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#adding-an-ip-address) for each system if your Linodes are located in the same data center.


## Install Using Salt Bootstrap

[Salt Bootstrap](https://repo.saltproject.io/#bootstrap) is a configuration script which automatically detects the operating system it's running on, sets the correct repositories, and installs Salt. The install script is intended to be run on the Salt master and all minion machines.

**Salt Master**

    curl -L https://bootstrap.saltproject.io -o install_salt.sh
    sudo sh install_salt.sh -P -M -N

{{< note respectIndent=false >}}
The `-N` flag indicates not to install `salt-minion`, since this system is the Salt master.
{{< /note >}}

**Salt Minions**

    curl -L https://bootstrap.saltproject.io -o install_salt.sh
    sudo sh install_salt.sh -P


## Coordinate Network Addressing

**Salt Master**

1.  Uncomment the `#interface:` line near the top of the file and replace the address placeholder with the address of your Salt master's Linode. If your Linodes are located in the same data center, you can use the Linode's private IP address.

    {{< file "/etc/salt/master" >}}
# The address of the interface to bind to:
interface: 203.0.113.0
{{< /file >}}

3.  Restart Salt:

        sudo systemctl restart salt-master

**Salt Minions**

{{< note respectIndent=false >}}
This step must be performed on *each* Salt minion.
{{< /note >}}

Uncomment `#master: salt` near the top of `/etc/salt/minion`, and replace `salt` with your Salt master's IP address:

  {{< file "/etc/salt/minion" >}}
# Set the location of the salt master server. If the master server cannot be
# resolved, then the minion will fail to start.
master: 203.0.113.0
{{< /file >}}

## Authenticate Minions to the Salt Master

### Get Salt Master Key Fingerprint

From the Salt master, list its key fingerprint, and all Minions linked to it with their key fingerprints:

    sudo salt-key --finger-all

You should see the minion hostname or IP addresses listed under *Unaccepted Keys*, and a SHA256 fingerprint of each key. Here the fingerprints are truncated with `...` to avoid clutter.

{{< output >}}
Local Keys:
master.pem:  e9:6a:86:bf...
master.pub:  4b:2a:81:79...
Accepted Keys:
Unaccepted Keys:
minion1:  c7:b2:55:83:46...
minion2:  f8:41:ce:73:f8...
{{< /output >}}

### Configure Salt Minions

1.  Add the Salt Master's `master.pub` fingerprint to `/etc/salt/minion`, between the single quotes:

    {{< file "/etc/salt/minion" >}}
# Fingerprint of the master public key to validate the identity of your Salt master
# before the initial key exchange. The master fingerprint can be found by running
# "salt-key -f master.pub" on the Salt master.
master_finger: '4b:2a:81:79...'
{{< /file >}}

2.  Restart Salt:

        sudo systemctl restart salt-minion

3.  List the Minion's fingerprint hash and verify it with what's reported by the Salt Master in Step 1 above:

        sudo salt-call key.finger --local

### Accept Minions

1.  Once each Minion ID has been verified, accept them all from the Salt Master:

        sudo salt-key -A

    {{< note respectIndent=false >}}
To accept an individual minion, specify it by hostname or IP address:

    sudo salt-key -a hostname
{{< /note >}}

2.  Verify the status of accepted minions. The command below should return the hostname or IP address of each Minion which has been verified and is running.

        sudo salt-run manage.up

For more information about Salt keys, see the *[salt-key](https://docs.saltproject.io/en/latest/ref/configuration/index.html)* man page.

## Test Master-Minion Connection

Ping all Minions:

    sudo salt '*' test.ping

The output should show `true` for each Minion:

  {{< output >}}
root@saltmaster:~# salt '*' test.ping
minion1:
    True
minion2:
    True
{{< /output >}}

## Package Management Overview

Packages are installed or removed from Minions using the *[pkg state module](https://docs.saltproject.io/en/latest/ref/states/all/salt.states.pkg.html)*. As long as you're running a Linux distribution supported by SaltStack, the Salt module controls the distribution's package manager, be it `apt`, `yum`, etc. Packages can be targeted to individual Minions by specifying the minion's hostname or IP address, or to all Minions by using `*`.

Install packages using the same package name used in the system repositories of the Salt minion. For example, `apache` is the Apache httpd server package in Debian and Ubuntu, while `httpd` is the package name in RHEL-based systems. If your Salt Minions are a version of Debian or Ubuntu, you would install or remove Apache with the examples below.

Install Apache to all Minions:

    sudo salt '*' pkg.install apache2

Remove Apache from `minion5`:

    sudo salt 'minion5' pkg.remove apache2

List all packages installed on `minion1`:

    sudo salt 'minion1' pkg.list_pkgs

Services are controlled using the *[service module](https://docs.saltproject.io/en/latest/ref/modules/all/salt.modules.service.html)*.

Restart Apache on all Minions:

    sudo salt '*' service.start apache2

View status of the `mariadb` service on `minion1`:

    sudo salt 'minion1' service.status mariadb


## Next Steps

Salt is a complex ecosystem which requires study and practice to thoroughly grasp. The [Salt documentation](https://docs.saltproject.io/en/latest/) has many examples, tutorials, and reference pages which will help.

Moving forward, you should start by familiarizing yourself with *[Execution Modules](https://docs.saltproject.io/en/latest/ref/modules/all/index.html#all-salt-modules)* and *[Salt States](https://docs.saltproject.io/en/latest/ref/states/index.html)*, and determine how they can be applied to your setup.
