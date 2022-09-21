---
slug: getting-started-with-puppet-6-1-basic-installation-and-setup
author:
    name: Linode
    email: docs@linode.com
description: 'Basic instructions to set up and configure a Puppet master and agents using Ubuntu and CentOS servers.'
keywords: ["puppet installation", "configuration change management", "server automation"]
tags: ["ubuntu","automation","centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-01-15
modified_by:
    name: Linode
published: 2019-01-15
title: Getting Started with Puppet - Basic Installation and Setup
external_resources:
    - '[Puppet Labs](https://puppet.com/)'
    - '[Puppet Open Source Documentation](https://docs.puppet.com/puppet/)'
    - '[Configuring Java Arguments](https://puppet.com/docs/pe/2019.0/config_java_args.html)'
aliases: ['/applications/configuration-management/puppet/getting-started-with-puppet-6-1-basic-installation-and-setup/','/applications/configuration-management/getting-started-with-puppet-6-1-basic-installation-and-setup/']
---

[Puppet](https://puppet.com/) is a configuration management tool that simplifies system administration. Puppet uses a client/server model in which your managed nodes, running a process called the Puppet *agent*, talk to and pull down configuration profiles from a Puppet *master*.

<!--
Tnis graphic doesn't have the same title as the new title for this doc.

![Install and Configure Puppet](install-puppet-title.png "Install and Configure Puppet")
-->

Puppet deployments can range from small groups of servers up to enterprise-level operations. This guide will demonstrate how to install Puppet 6.1 on three servers:

-   A Puppet master running Ubuntu 18.04
-   A managed Puppet node running Ubuntu 18.04
-   A managed Puppet node running CentOS 7

After installation, the next section will show you how to secure these servers via Puppet. This section will demonstrate core features of the Puppet language.

{{< note >}}
Most guides will instruct you to follow the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide before proceeding. Because Puppet will be used to perform this task, you should begin this guide as the `root` user. A limited user with administrative privileges will be configured via Puppet in later steps.
{{< /note >}}

## Before You Begin

The following table displays example system information for the servers that will be deployed in this guide:

| Description       | OS | Hostname | FQDN | IP |
| ----------------- | ----------- | ----- | ----- | ---- |
| Puppet master     | Ubuntu 18.04 | puppet | puppet.example.com | 192.0.2.2
| Node 1 (Ubuntu)   | Ubuntu 18.04 | puppet-agent-ubuntu |puppet-agent-ubuntu.example.com | 192.0.2.3 |
| Node 2 (CentOS)   | CentOS 7     | puppet-agent-centos | puppet-agent-centos.example.com | 192.0.2.4 |

You can choose different hostnames and fully qualified domain names (FQDN) for each of your servers, and the IP addresses for your servers will be different from the example addresses listed. You will need to have a registered domain name in order to specify FQDNs for your servers.

Throughout this guide, commands and code snippets will reference the values displayed in this table. Wherever such a value appears, replace it with your own value.

### Create your Linodes

1.  Create three Linodes corresponding to the servers listed in the table above. Your Puppet master Linode should have at least four CPU cores; the [Linode 8GB](https://www.linode.com/pricing) plan is recommended. The two other nodes can be of any plan size, depending on how you intend to use them after Puppet is installed and configured.

1.  [Configure your timezone](/docs/guides/set-up-and-secure/#set-the-timezone) on your master and agent nodes so that they all have the same time data.

1.  [Set the hostname](/docs/guides/set-up-and-secure/#configure-a-custom-hostname) for each server.

1.  [Set the FQDN](/docs/guides/using-your-systems-hosts-file/) for each Linode by editing the servers' `/etc/hosts` files.

    {{< disclosure-note "Example content for the hosts file" >}}
You can model the contents of your `/etc/hosts` files on these snippets:

{{< file "Master" >}}
127.0.0.1	localhost
192.0.2.2   puppet.example.com puppet

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
{{< /file >}}

{{< file "Node 1 (Ubuntu)" >}}
127.0.0.1	localhost
192.0.2.3   puppet-agent-ubuntu.example.com puppet-agent-ubuntu

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
{{< /file >}}

{{< file "Node 2 (CentOS)" >}}
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.0.2.4   puppet-agent-centos.example.com puppet-agent-centos
{{< /file >}}

{{< /disclosure-note >}}

1.  [Set up DNS records](/docs/guides/dns-manager/#add-dns-records) for your Linodes' FQDNs. For each Linode, create a new *A record* with the name specified by its FQDN and assign it to that Linode's IP address.

    If you don't use Linode's name servers for your domain, consult your name server authority's website for instructions on how to edit your DNS records.

    {{< content "update-dns-at-common-name-server-authorities" >}}

## Puppet Master

### Install the Puppet Server Software

The Puppet master runs the `puppetserver` service, which is responsible for compiling and supplying configuration profiles to your managed nodes.

The `puppetserver` service has the Puppet agent service as a dependency (which is just called `puppet` when running on your system). This means that the agent software will also be installed and can be run on your master. Because your master can run the agent service, you can configure your master via Puppet just as you can configure your other managed nodes.

1.  Log in to your Puppet master via SSH (as root):

        ssh root@puppet.example.com

1.  Download the Puppet repository, update your system packages, and install `puppetserver`:

        wget https://apt.puppet.com/puppet-release-bionic.deb
        dpkg -i puppet-release-bionic.deb
        apt update
        apt install puppetserver

### Configure the Server Software

1.  Use the `puppet config` command to set values for the `dns_alt_names` setting:

        /opt/puppetlabs/bin/puppet config set dns_alt_names 'puppet,puppet.example.com' --section main

    If you inspect the configuration file, you'll see that the setting has been added:

        cat /etc/puppetlabs/puppet/puppet.conf

    {{< output >}}
[main]
dns_alt_names = puppet,puppet.example.com
# ...
{{< /output >}}

    {{< note >}}
The `puppet` command by default is not added to your PATH. Using Puppet's interactive commands requires a full file path. To avoid this, update your PATH for your existing shell session:

    export PATH=/opt/puppetlabs/bin:$PATH

A more permanent solution would be to add this to your `.profile` or `.bashrc` files.
{{</ note >}}

1.  Update your Puppet master's `/etc/hosts` to resolve your managed nodes' IP addresses. For example, your `/etc/hosts` file might look like the following:

    {{< file "/etc/hosts" >}}
127.0.0.1   localhost
192.0.2.2   puppet.example.com puppet

192.0.2.3   puppet-agent-ubuntu.example.com puppet-agent-ubuntu
192.0.2.4   puppet-agent-centos.example.com puppet-agent-centos

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
{{< /file >}}

    {{< note >}}
This snippet incorporates the FQDN declaration described in the [Create your Linodes](#create-your-linodes) section.
{{< /note >}}

1.  Start and enable the `puppetserver` service:

        systemctl start puppetserver
        systemctl enable puppetserver

    By default, the Puppet master listens for client connections on port 8140. If the `puppetserver` service fails to start, check that the port is not already in use:

        netstat -anpl | grep 8140

## Puppet Agents

### Install Puppet Agent

1.  On your managed node running **Ubuntu 18.04**, install the `puppet-agent` package:

        wget https://apt.puppet.com/puppet-release-bionic.deb
        dpkg -i puppet-release-bionic.deb
        apt update
        apt install puppet-agent

1.  On your managed node running **CentOS 7**, enter:

        rpm -Uvh https://yum.puppet.com/puppet/puppet-release-el-7.noarch.rpm
        yum install puppet-agent

### Configure Puppet Agent

1.  Modify your managed nodes' hosts files to resolve the Puppet master's IP. To do so, add a line like:

    {{< file "/etc/hosts" >}}
192.0.2.2    puppet.example.com puppet
{{< /file >}}

    {{< disclosure-note "Example content for the hosts file" >}}
You can model the contents of your managed nodes' `/etc/hosts` files on the following snippets. These incorporate the FQDN declarations described in the [Create your Linodes](#create-your-linodes) section:

{{< file "Node 1 (Ubuntu)" >}}
127.0.0.1	localhost
192.0.2.3   puppet-agent-ubuntu.example.com puppet-agent-ubuntu

192.0.2.2   puppet.example.com puppet

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
{{< /file >}}

{{< file "Node 2 (CentOS)" >}}
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.0.2.4   puppet-agent-centos.example.com puppet-agent-centos

192.0.2.2   puppet.example.com puppet
{{< /file >}}

{{< /disclosure-note >}}

1.  On each managed node, use the `puppet config` command to set the value for your `server` setting to the FQDN of the master:

        /opt/puppetlabs/bin/puppet config set server 'puppet.example.com' --section main

    If you inspect the configuration file on the nodes, you'll see that the setting has been added:

        cat /etc/puppetlabs/puppet/puppet.conf

    {{< output >}}
[main]
server = puppet.example.com
# ...
{{< /output >}}

1.  Use the `puppet resource` command to start and enable the Puppet agent service:

        /opt/puppetlabs/bin/puppet resource service puppet ensure=running enable=true

    {{< note >}}
On systemd systems, the above command is equivalent to using these two `systemctl` commands:

    systemctl start puppet
    systemctl enable puppet
{{< /note >}}

### Generate and Sign Certificates

Before your managed nodes can receive configurations from the master, they first need to be authenticated:

1.  On your **Puppet agents**, generate a certificate for the Puppet master to sign:

        /opt/puppetlabs/bin/puppet agent -t

    This command will output an error, stating that no certificate has been found. This error is because the generated certificate needs to be approved by the Puppet master.

1.  Log in to your **Puppet master** and list the certificates that need approval:

        /opt/puppetlabs/bin/puppetserver ca list

    It should output a list with your agent nodes' hostnames.

1.  Approve the certificates:

        /opt/puppetlabs/bin/puppetserver ca sign --certname puppet-agent-ubuntu.example.com,puppet-agent-centos.example.com

1.  Return to the **Puppet agent** nodes and run the Puppet agent again:

        /opt/puppetlabs/bin/puppet agent -t

    You should see something like the following:

    {{< output >}}
Info: Downloaded certificate for hostname.example.com from puppet
Info: Using configured environment 'production'
Info: Retrieving pluginfacts
Info: Retrieving plugin
Info: Retrieving locales
Info: Caching catalog for hostname.example.com
Info: Applying configuration version '1547066428'
Info: Creating state file /opt/puppetlabs/puppet/cache/state/state.yaml
Notice: Applied catalog in 0.02 seconds
{{< /output >}}

## Add Modules to Configure Agent Nodes

The Puppet master and agent nodes are now functional, but they are not secure. Based on concepts from the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide, a limited user and a firewall should be configured. This can be done on all nodes through the creation of basic Puppet modules, shown below.

{{< note >}}
This is not meant to provide a basis for a fully-hardened server, and is intended only as a starting point. Alter and add firewall rules and other configuration options, depending on your specific needs.
{{< /note >}}

Puppet modules are Puppet's prescribed way of organizing configuration code to serve specific purposes, like installing and configuration an application. You can create custom modules, or you can download and use modules published on [Puppet Forge](https://forge.puppet.com/).

### Add a Limited User

To create a new limited user on your nodes, you will create and apply a new module called `accounts`. This module will employ the [`user` resource](https://puppet.com/docs/puppet/6.1/types/user.html).

1.  From the **Puppet master**, navigate to the `/etc/puppetlabs/code/environments/production/modules` directory. When a managed node requests its configuration from the master, the Puppet server process will look in this location for your modules:

        cd /etc/puppetlabs/code/environments/production/modules/

1.  Create the directory for a new `accounts` module:

        mkdir accounts
        cd accounts

1.  Create the following directories inside the `accounts` module:

        mkdir {examples,files,manifests,templates}

    | Directory | Description |
    | --------- | ----------- |
    | `manifests` | The Puppet code which powers the module |
    | `files` | Static files to be copied to managed nodes |
    | `templates` | Template files to be copied to managed nodes that can e customized with variables |
    | `examples` | Example code which shows how to use the module |

    {{< note >}}
Review Puppet's [Module fundamentals](https://puppet.com/docs/puppet/6.1/modules_fundamentals.html#module-structure) article for more information on how a module is structured.
{{< /note >}}

1.  Navigate to the `manifests` directory:

        cd manifests

1.  Any file which contains Puppet code is called a *manifest*, and each manifest file ends in `.pp`. When located inside a module, a manifest should only define one class. If a module's manifests directory has an `init.pp` file, the class definition it contains is considered the main class for the module. The class definition inside `init.pp` should have the same name as the module.

    Create an `init.pp` file with the contents of the following snippet. Replace all instances of `username` with a username of your choosing:

    {{< file "accounts/manifests/init.pp" puppet >}}
class accounts {

  user { 'username':
    ensure      => present,
    home        => '/home/username',
    shell       => '/bin/bash',
    managehome  => true,
    gid         => 'username',
  }

}
{{< /file >}}

    | Option | Description |
    | --------- | ----------- |
    | `ensure` | Ensures that the user exists if set to `present`, or does not exist if set to `absent` |
    | `home` | The path for the user's home directory |
    | `managehome` | Controls whether a home directory should be created when creating the user |
    | `shell` | The path to the shell for the user |
    | `gid` | The user's primary group |

1.  Although the class declares what the user's primary group should be, it will not create the group itself. Create a new file called `groups.pp` inside the `manifests` directory with the following contents. Replace `username` with your chosen username:

    {{< file "accounts/manifests/groups.pp" puppet >}}
class accounts::groups {

  group { 'username':
    ensure  => present,
  }

}
{{< /file >}}

1.  Your `accounts` class can [declare](https://puppet.com/docs/puppet/6.1/lang_classes.html#declaring-classes) your new `accounts::groups` class for use within the `accounts` class scope. Open your `init.pp` in your editor and enter a new `include` declaration at the beginning of the class:

    {{< file "accounts/manifests/init.pp" puppet >}}
class accounts {

  include accounts::groups

  # ...

}

{{< /file >}}

1.  The new user should have administrative privileges. Because we have agent nodes on both Debian- and Red Hat-based systems, the new user needs to be in the `sudo` group on Debian systems, and the `wheel` group on Red Hat systems.

    This value can be set dynamically through the use of [Puppet *facts*](https://puppet.com/docs/puppet/6.1/lang_facts_and_builtin_vars.html). The facts system collects system information about your nodes and makes it available in your manifests.

    Add a selector statement to the top of your `accounts` class:

    {{< file "accounts/manifests/init.pp" puppet >}}
class accounts {

  $rootgroup = $osfamily ? {
    'Debian'  => 'sudo',
    'RedHat'  => 'wheel',
    default   => warning('This distribution is not supported by the Accounts module'),
  }

  include accounts::groups

  # ...

}

{{< /file >}}

    This code defines the value for the `$rootgroup` variable by checking the value of `$osfamily`, which is one of Puppet's [core facts](https://puppet.com/docs/facter/6.1/core_facts.html). If the value for `$osfamily` does not match Debian or Red Hat, the `default` value will output a warning that the distribution selected is not supported by this module.

    {{< note >}}
The Puppet Configuration Language executes code from top to bottom. Because the `user` resource declaration will reference the `$rootgroup` variable, you must define `$rootgroup` *before* the `user` declaration.
{{< /note >}}

1.  Update the user resource to include the `groups` option as follows:

    {{< file "accounts/manifests/init.pp" puppet >}}
# ...

user { 'username':
  ensure      => present,
  home        => '/home/username',
  shell       => '/bin/bash',
  managehome  => true,
  gid         => 'username',
  groups      => "$rootgroup",
}

# ...
{{< /file >}}

    The value `"$rootgroup"` is enclosed in double quotes `" "` instead of single quotes `' '` because it is a variable which needs to be interpolated in your code.

1.  The final value that needs to be added is the user's password. Since we do not want to use plain text, the password should be supplied to Puppet as a SHA1 digest, which is supported by default. Generate a digest with the `openssl` command:

        openssl passwd -1

    You will be prompted to enter your password. A hashed password will be output. Copy this value to your clipboard.

1.  Update the user resource to include the `password` option as follows; insert your copied password hash as the value for the option:

    {{< file "accounts/manifests/init.pp" puppet >}}
# ...

user { 'username':
  ensure      => present,
  home        => '/home/username',
  shell       => '/bin/bash',
  managehome  => true,
  gid         => 'username',
  groups      => "$rootgroup",
  password    => 'your_password_hash',
}

# ...
{{< /file >}}

    {{< caution >}}
The hashed password **must** be included in single quotes `' '`.
{{< /caution >}}

1.  After saving your changes, use the Puppet parser to ensure that the code is correct:

        /opt/puppetlabs/bin/puppet parser validate init.pp

    Any errors that need to be addressed will be logged to standard output. If nothing is returned, your code is valid.

1.  Navigate to the `examples` directory and create another `init.pp` file:

        cd ../examples

    {{< file "accounts/examples/init.pp" puppet >}}
include accounts
{{< /file >}}

1. While still in the `examples` directory, test the module:

        /opt/puppetlabs/bin/puppet apply --noop init.pp

    {{< note >}}
The `--noop` parameter prevents Puppet from actually applying the module to your system and making any changes.
{{< /note >}}

    It should return:

    {{< output >}}
Notice: Compiled catalog for puppet.example.com in environment production in 0.26 seconds
Notice: /Stage[main]/Accounts::Groups/Group[username]/ensure: current_value absent, should be present (noop)
Notice: Class[Accounts::Groups]: Would have triggered 'refresh' from 1 events
Notice: /Stage[main]/Accounts/User[username]/ensure: current_value absent, should be present (noop)
Notice: Class[Accounts]: Would have triggered 'refresh' from 1 events
Notice: Stage[main]: Would have triggered 'refresh' from 2 events
Notice: Finished catalog run in 0.02 seconds
{{< /output >}}

1.  Again from the `examples` directory, run `puppet apply` to make these changes to the Puppet master server:

        /opt/puppetlabs/bin/puppet apply init.pp

    Puppet will create your limited Linux user on your master.

1.  Log out as `root` and log in to the Puppet master as your new user.

### Edit SSH Settings

Although a new limited user has successfully been added to the Puppet master, it is still possible to login to the system as root. To properly secure your system, root access should be disabled.

{{< note >}}
Because you are now logged in to the Puppet master as a limited user, you will need to execute commands and edit files with the user's sudo privileges.
{{< /note >}}

1.  Navigate to the `files` directory within the `accounts` module:

        cd /etc/puppetlabs/code/environments/production/modules/accounts/files

1.  Copy your system's existing `sshd_config` file to this directory:

        sudo cp /etc/ssh/sshd_config .

1.  Open the file in your editor (making sure that you open it with `sudo` privileges) and set the `PermitRootLogin` value to `no`:

    {{< file "accounts/files/sshd_config" aconf >}}
PermitRootLogin no

{{< /file >}}

1.  Navigate back to the `manifests` directory:

        cd ../manifests

1.  Create a new manifest called `ssh.pp`. Use the `file` resource to replace the default SSH configuration file with one managed by Puppet:

    {{< file "accounts/manifests/ssh.pp" puppet >}}
class accounts::ssh {

  file { '/etc/ssh/sshd_config':
    ensure  => present,
    source  => 'puppet:///modules/accounts/sshd_config',
  }

}
{{< /file >}}

    {{< note >}}
The `files` directory is omitted from the `source` line because the `files` folder is the default location of files within a module. For more information on the format used to access resources in a module, refer to the [official Puppet module documentation](https://docs.puppet.com/puppet/6.1/modules_fundamentals.html#module-layout).
{{< /note >}}

1.  Create a second resource to restart the SSH service and set it to run whenever `sshd_config` is changed. This will also require a selector statement because the SSH service is named `ssh` on Debian systems and `sshd` on Red Hat systems:

    {{< file "accounts/manifests/ssh.pp" puppet >}}
class accounts::ssh {

  $sshname = $osfamily ? {
    'Debian'  => 'ssh',
    'RedHat'  => 'sshd',
    default   => warning('This distribution is not supported by the Accounts module'),
  }

  file { '/etc/ssh/sshd_config':
    ensure  => present,
    source  => 'puppet:///modules/accounts/sshd_config',
    notify  => Service["$sshname"],
  }

  service { "$sshname":
    hasrestart  => true,
  }

}
{{< /file >}}

    {{< note >}}
`notify` is one of Puppet's [relationship metaparameters](https://puppet.com/docs/puppet/6.1/lang_relationships.html).
{{< /note >}}

1.  Include the `accounts::ssh` class within the `accounts` class in `init.pp`:

    {{< file "accounts/manifests/init.pp" puppet >}}
class accounts {

  # ...

  include accounts::groups
  include accounts::ssh

  # ...

}
{{< /file >}}

    {{< disclosure-note "The complete init.pp" >}}
The contents of your `init.pp` should now look like the following snippet:

{{< file "accounts/manifests/init.pp" puppet >}}
class accounts {

    $rootgroup = $osfamily ? {
        'Debian' => 'sudo',
        'RedHat' => 'wheel',
        default => warning('This distro not supported by Accounts module'),
    }

    include accounts::groups
    include accounts::ssh

    user { 'example':
        ensure  => present,
        home    => '/home/username',
        shell   => '/bin/bash',
        managehome  => true,
        gid     => 'username',
        groups  => "$rootgroup",
        password => 'your_password_hash'
    }

}
{{< /file >}}
{{< /disclosure-note >}}

1.  Run the Puppet parser to test the syntax of the new class, then navigate to the `examples` directory to test and run the update to your `accounts` class:

        sudo /opt/puppetlabs/bin/puppet parser validate ssh.pp
        cd ../examples
        sudo /opt/puppetlabs/bin/puppet apply --noop init.pp
        sudo /opt/puppetlabs/bin/puppet apply init.pp

    {{< note >}}
You may see the following line in your output when validating:

{{< output >}}
Error: Removing mount "files": /etc/puppet/files does not exist or is not a directory
{{< /output >}}

This refers to a Puppet configuration file, not the module resource you're trying to copy. If this is the only error in your output, the operation should still succeed.
{{< /note >}}

1.  To ensure that the `ssh` class is working properly, log out of the Puppet master and then try to log in as `root`. You should not be able to do so.

### Add and Configure IPtables

To complete this guide's security settings, the firewall needs to be configure on your Puppet master and nodes. The `iptables` firewall software will be used.

1.  By default, changes to your `iptables` rules will not persist across reboots. To avoid this, install the appropriate package on your Puppet master and nodes:

    **Ubuntu/Debian**:

        sudo apt install iptables-persistent

    **CentOS 7**:

    CentOS 7 uses firewalld by default as a controller for iptables. Be sure firewalld is stopped and disabled before starting to work directly with iptables:

        sudo systemctl stop firewalld && sudo systemctl disable firewalld
        sudo yum install iptables-services

1.  On your Puppet master, install [Puppet Lab's firewall module](https://forge.puppet.com/puppetlabs/firewall) from the Puppet Forge:

        sudo /opt/puppetlabs/bin/puppet module install puppetlabs-firewall

    The module will be installed in your `/etc/puppetlabs/code/environments/production/modules` directory.

1.  Navigate to the `manifests` directory inside the new `firewall` module:

        cd /etc/puppetlabs/code/environments/production/modules/firewall/manifests/

2.  Create a file titled `pre.pp`, which will contain all basic networking rules that should be run first:

    {{< file "firewall/manifests/pre.pp" puppet >}}
class firewall::pre {

  Firewall {
    require => undef,
  }

   # Accept all loopback traffic
  firewall { '000 lo traffic':
    proto       => 'all',
    iniface     => 'lo',
    action      => 'accept',
  }->

   #Drop non-loopback traffic
  firewall { '001 reject non-lo':
    proto       => 'all',
    iniface     => '! lo',
    destination => '127.0.0.0/8',
    action      => 'reject',
  }->

   #Accept established inbound connections
  firewall { '002 accept established':
    proto       => 'all',
    state       => ['RELATED', 'ESTABLISHED'],
    action      => 'accept',
  }->

   #Allow all outbound traffic
  firewall { '003 allow outbound':
    chain       => 'OUTPUT',
    action      => 'accept',
  }->

   #Allow ICMP/ping
  firewall { '004 allow icmp':
    proto       => 'icmp',
    action      => 'accept',
  }

   #Allow SSH connections
  firewall { '005 Allow SSH':
    dport    => '22',
    proto   => 'tcp',
    action  => 'accept',
  }->

   #Allow HTTP/HTTPS connections
  firewall { '006 HTTP/HTTPS connections':
    dport    => ['80', '443'],
    proto   => 'tcp',
    action  => 'accept',
  }

}

{{< /file >}}

1.  In the same directory, create `post.pp`, which will run any firewall rules that need to be input last:

    {{< file "firewall/manifests/post.pp" puppet >}}
class firewall::post {

  firewall { '999 drop all':
    proto  => 'all',
    action => 'drop',
    before => undef,
  }

}

{{< /file >}}

    These rules will direct the system to drop all inbound traffic that is not already permitted in the firewall.

1.  Run the Puppet parser on both files to check their syntax for errors:

        sudo /opt/puppetlabs/bin/puppet parser validate pre.pp
        sudo /opt/puppetlabs/bin/puppet parser validate post.pp

1.  Navigate to the main `manifests` directory:

        cd /etc/puppetlabs/code/environments/production/manifests

1.  Create a file named `site.pp` inside `/etc/puppetlabs/code/environments/production/manifests`. This file is the [main manifest](https://puppet.com/docs/puppet/6.1/dirs_manifest.html) for the Puppet server service. It is used to map modules, classes, and resources to the nodes that they should be applied to.

    {{< file "site.pp" puppet >}}
node default {

}

node 'puppet.example.com' {

  include accounts

  resources { 'firewall':
    purge => true,
  }

  Firewall {
    before        => Class['firewall::post'],
    require       => Class['firewall::pre'],
  }

  class { ['firewall::pre', 'firewall::post']: }

  firewall { '200 Allow Puppet Master':
    dport         => '8140',
    proto         => 'tcp',
    action        => 'accept',
  }

}
{{< /file >}}

1.  Run the `site.pp` file through the Puppet parser to check its syntax for errors. Then, test the file with the `--noop` option to see if it will run:

        sudo /opt/puppetlabs/bin/puppet parser validate site.pp
        sudo /opt/puppetlabs/bin/puppet apply --noop site.pp

    If successful, run `puppet apply` without the `--noop` option:

        sudo /opt/puppetlabs/bin/puppet apply site.pp

1.  Once Puppet has finished applying the changes, check the Puppet master's iptables rules:

        sudo iptables -L

    It should return:

        Chain INPUT (policy ACCEPT)
        target     prot opt source               destination
        ACCEPT     all  --  anywhere             anywhere             /* 000 lo traffic */
        REJECT     all  --  anywhere             127.0.0.0/8          /* 001 reject non-lo */ reject-with icmp-port-unreachable
        ACCEPT     all  --  anywhere             anywhere             /* 002 accept established */ state RELATED,ESTABLISHED
        ACCEPT     icmp --  anywhere             anywhere             /* 004 allow icmp */
        ACCEPT     tcp  --  anywhere             anywhere             multiport ports ssh /* 005 Allow SSH */
        ACCEPT     tcp  --  anywhere             anywhere             multiport ports http,https /* 006 HTTP/HTTPS connections */
        ACCEPT     tcp  --  anywhere             anywhere             multiport ports 8140 /* 200 Allow Puppet Master */
        DROP       all  --  anywhere             anywhere             /* 999 drop all */

        Chain FORWARD (policy ACCEPT)
        target     prot opt source               destination

        Chain OUTPUT (policy ACCEPT)
        target     prot opt source               destination
        ACCEPT     tcp  --  anywhere             anywhere             /* 003 allow outbound */

### Apply Modules to the Agent Nodes

Now that the `accounts` and `firewall` modules have been created, tested, and run on the Puppet master, it is time to apply them to your managed nodes.

1.  On the **Puppet master**, navigate to `/etc/puppetlabs/code/environments/production/manifests`:

        cd /etc/puppetlabs/code/environments/production/manifests

1.  Update `site.pp` to declare the modules, classes, and resources that should be applied to each managed node:

    {{< file "site.pp" puppet >}}
node default {

}

node 'puppet.example.com' {
  # ...
}

node 'puppet-agent-ubuntu.example.com' {

  include accounts

  resources { 'firewall':
    purge => true,
  }

  Firewall {
    before        => Class['firewall::post'],
    require       => Class['firewall::pre'],
  }

  class { ['firewall::pre', 'firewall::post']: }

}

node 'puppet-agent-centos.example.com' {

  include accounts

  resources { 'firewall':
    purge => true,
  }

  Firewall {
    before        => Class['firewall::post'],
    require       => Class['firewall::pre'],
  }

  class { ['firewall::pre', 'firewall::post']: }

}
{{< /file >}}

1.  By default, the Puppet agent service on your managed nodes will automatically check with the master once every 30 minutes and apply any new configurations from the master. You can also manually invoke the Puppet agent process in-between automatic agent runs.

    Log in to each managed node (as root) and run the Puppet agent:

        /opt/puppetlabs/bin/puppet agent -t

1.  To ensure the Puppet agent worked:

    -   Log out from your root SSH session and log back in as the limited user that was created.

    -   Check the node's firewall rules:

            sudo iptables -L

Congratulations! You've successfully installed Puppet on a master and two managed nodes. Now that you've confirmed everything is working, you can create additional modules to automate configuration management on your nodes. For more information, review Puppet's [open source documentation](https://docs.puppet.com/puppet/latest/reference/modules_fundamentals.html). You can also install and use modules others have created on the [Puppet Forge](https://docs.puppet.com/puppet/latest/reference/modules_installing.html).
