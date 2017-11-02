---
author:
    name: Elle Krout
    email: ekrout@linode.com
description: 'Basic instructions to set up and configure a Puppet master and agents using Ubuntu or CentOS servers.'
keywords: ["puppet installation", "configuration change management", "server automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/puppet/basic-puppet-setup-and-configuration/','websites/puppet/manage-and-automate-systems-configuration-with-puppet/','applications/puppet/set-up-puppet-master-agent/','applications/puppet/install-and-configure-puppet']
modified: 2017-03-08
modified_by:
    name: Phil Zona
published: 2015-09-17
title: Install and Configure Puppet
external_resources:
    - '[Puppet Labs](https://puppetlabs.com/)'
    - '[Puppet Open Source Documentation](https://docs.puppetlabs.com/puppet/)'
---

[Puppet](https://puppetlabs.com/) is a configuration automation platform that simplifies various system administrator tasks. Puppet uses a client/server model where the managed servers, called *Puppet agents*, talk to and pull down configuration profiles from the *Puppet master*.

![Install and Configure Puppet](/docs/assets/install-puppet-title.png "Install and Configure Puppet")

Puppet is written in its own custom language, meant to be accessible to system administrators. A module, located on the Puppet master, describes the desired system. The Puppet software then translates the module into code and alters the agent servers as needed when the `puppet agent` command is run on an agent node or automatically at designated intervals.

Puppet can be used to manage multiple servers across various infrastructures, from a group of personal servers up to an enterprise level operation. It is intended to run on Linux and other Unix-like operating systems, but has also been ported to Windows. For the purpose of this guide, however, we will be working with an Ubuntu 16.04 LTS master server and two agent nodes: one Ubuntu 16.04, and one CentOS 7.

{{< note >}}
Begin this guide as the `root` user. A limited user with administrative privileges will be configured in later steps.
{{< /note >}}

## Before You Begin

1.  You should have three available Linodes, one of which has at least four CPU cores for the Puppet master. A [Linode 8GB](/pricing) plan is recommended. The two other nodes can be of any plan size, depending on how you intend to use them after Puppet is installed and configured.

2.  Follow the [Getting Started](/docs/getting-started) guide and ensure your Linodes are configured to use the same timezone.

    {{< note >}}
For ease of use, set the Puppet master server's hostname to `puppet`, and have a valid fully-qualified domain name (FQDN).

To check your hostname, run `hostname` and to check your FQDN, run `hostname -f`.
{{< /note >}}

## Puppet Master

### Install Puppet Master

1.  Install the `puppetlabs-release` repository into Ubuntu 16.04 and update your system. This process downloads a `.deb` file that will configure the repositories for you:

        wget https://apt.puppetlabs.com/puppetlabs-release-pc1-xenial.deb
        dpkg -i puppetlabs-release-pc1-xenial.deb
        apt update

    {{< note >}}
If you wish to run another Linux distribution as your master server, the initial `.deb` file can be substituted for another distribution based on the following formats:

-  Red Hat-based systems:

wget https://yum.puppetlabs.com/puppetlabs-release-pc1-OS-VERSION.noarch.rpm

-  Debian-based systems:

wget https://apt.puppetlabs.com/puppetlabs-release-pc1-VERSION.deb

Any Ubuntu-specific commands will then have to be amended for the proper distribution. More information can be found in [Puppet's Installation Documentation](https://docs.puppetlabs.com/puppet/4.0/reference/install_linux.html#install-a-release-package-to-enable-puppet-labs-package-repositories) or our guide to [package management](https://www.linode.com/docs/tools-reference/linux-package-management).
{{< /note >}}

2.  Install the `puppetmaster-passenger` package:

        apt install puppetmaster-passenger

3.  The default Puppet installation may start Apache and configure it to listen on the same port as Puppet. Stop Apache to avoid this conflict (if using CentOS7, change `apache2` in this example to `httpd`):

        systemctl stop apache2

4.  Ensure you have the latest version of Puppet by running:

        puppet resource package puppetmaster ensure=latest

### Configure Puppet Master

1.  Update `/etc/puppet/puppet.conf` and add the `dns_alt_names` line to the section `[main]`, replacing `puppet.example.com` with your own FQDN:

    {{< file-excerpt "/etc/puppet/puppet.conf" aconf >}}
[main]
dns_alt_names=puppet,puppet.example.com

{{< /file-excerpt >}}


2.  Start the Puppet master:

        systemctl start puppetmaster

    By default, the Puppet master process listens for client connections on port 8140. If the `puppetmaster` service fails to start, check that the port is not already in use:

        netstat -anpl | grep 8140

## Puppet Agents

### Install Puppet Agent

On agent nodes running **Ubuntu 16.04** or other Debian-based distributions, use this command to install Puppet:

    apt install puppet

On agent nodes running **CentOS 7** or other Red Hat systems, follow these steps:

1.  For **CentOS 7** only, add the Puppet Labs repository:

        rpm -ivh https://yum.puppetlabs.com/el/7/products/x86_64/puppetlabs-release-22.0-2.noarch.rpm

    {{< note >}}
If you're on a Red Hat system other than CentOS 7, skip this step.
{{< /note >}}

2.  Install the Puppet agent:

        yum install puppet

### Configure Puppet Agent

1.  Modify your Puppet Agent's host file to resolve the Puppet master IP as `puppet`:

    {{< file-excerpt "/etc/hosts" aconf >}}
198.51.100.0    puppet

{{< /file-excerpt >}}


2.  Add the `server` value to the `[main]` section of the node's `puppet.conf` file, replacing `puppet.example.com` with the FQDN of your Puppet master:

    {{< file-excerpt "/etc/puppet/puppet.conf" aconf >}}
[main]
server=puppet.example.com

{{< /file-excerpt >}}


3.  Restart the Puppet service:

        systemctl restart puppet

### Generate and Sign Certificates

1.  On each agent, generate a certificate for the Puppet master to sign:

        puppet agent -t

    This will output an error, stating that no certificate has been found. This error is because the generated certificate needs to be approved by the Puppet master.

2.  Log in to your **Puppet master** and list the certificates that need approval:

        puppet cert list

    It should output a list with your agent node's hostname.

3.  Approve the certificates, replacing `hostname.example.com` with the hostname of each agent node:

        puppet cert sign hostname.example.com

4.  Return to the **Puppet agent** nodes and run the Puppet agent again:

        puppet agent -t

## Add Modules to Configure Agent Nodes

Both the Puppet master and agent nodes configured above are functional, but not secure. Based on concepts from the [Securing Your Server](/docs/security/securing-your-server/) guide, a limited user and a firewall should be configured. This can be done on all nodes through the creation of basic Puppet modules, shown below.

{{< note >}}
This is not meant to provide a basis for a fully-hardened server, and is intended only as a starting point. Alter and add firewall rules and other configuration options, depending on your specific needs.
{{< /note >}}

### Add a Limited User

1.  From the **Puppet master**, navigate to the `/etc/puppet/modules` directory and create your new module for adding user accounts, then `cd` into that directory:

        mkdir /etc/puppet/modules/accounts
        cd /etc/puppet/modules/accounts

2.  Create the following directories, which are needed to have a functioning module:

        mkdir {examples,files,manifests,templates}

    The `examples` directory allows you to test the module locally. `files` contains any static files that may need to be edited or added. `manifests` contains the actual Puppet code for the module, and `templates` contains any non-static files that may be needed.

3.  Move to the `manifests` directory and create your first class, called `init.pp`. All modules require an `init.pp` file to be used as the main definition file of a module.

        cd manifests

4.  Within the `init.pp` file, define a limited user to use instead of `root`, replacing all instances of `username` with your chosen username:

    {{< file "/etc/puppet/modules/accounts/manifests/init.pp" puppet >}}
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


    The `init.pp` file initially defines the `accounts` class. It then calls for the `user` resource, where a `username` is defined. The `ensure` value is set to ensure that the user exists (is present). The `home` value should be set to the user's home directory path. `shell` defines the shell type, in this instance the bash shell. `managehome` notes that the home directory should be created. Finally, `gid` sets the primary group for the user.

5.  Although the primary group is set to share the username, the group itself has not been created. Save and exit `init.pp`. Then, create a new file called `groups.pp` and add the following contents. This file will be used to create the user's group. Again, replace `username` with your chosen username:

    {{< file "/etc/puppet/modules/accounts/manifests/groups.pp" puppet >}}
class accounts::groups {

  group { 'username':
    ensure  => present,
  }

}

{{< /file >}}


     Include this file by adding `include groups` to the `init.pp` file, within the `accounts` class:

     {{< file-excerpt "/etc/puppet/modules/accounts/manifests/init.pp" puppet >}}
class accounts {

  include groups
  ...
}

{{< /file-excerpt >}}


6.  This user should have privileges so that administrative tasks can be performed. Because we have agent nodes on both Debian- and Red Hat-based systems, the new user needs to be in the `sudo` group on Debian systems, and the `wheel` group on Red Hat systems. This value can be set dynamically through the use of a selector and *facter*, a program included in Puppet that keeps track of information, or *facts*, about every server. Add a selector statement to the top of the `init.pp` file within the accounts class brackets, defining the two options:

    {{< file-excerpt "/etc/puppet/modules/accounts/manifests/init.pp" puppet >}}
class accounts {

  $rootgroup = $osfamily ? {
    'Debian'  => 'sudo',
    'RedHat'  => 'wheel',
    default   => warning('This distribution is not supported by the Accounts module'),
  }

  user { 'username':
  ...

}

{{< /file-excerpt >}}


    This command sequence tells Puppet that within the *accounts* module the variable `$rootgroup` should evaluate, using facter, the operating system family (`$osfamily`), and if the value returned is `Debian`, to set the `$rootgroup` value to `sudo`. If the value returned is `RedHat`, this same value should be set to `wheel`; otherwise, the `default` value will output a warning that the distribution selected is not supported by this module.

    {{< note >}}
The `user` definition will include the `$rootgroup`, and the Puppet Configuration Language executes code from top to bottom. You must define the `$rootgroup` *before* the `user` so that it can be accessed.
{{< /note >}}

7.  Add the `groups` value to the user resource, calling to the `$rootgroup` variable defined in the previous step:

    {{< file-excerpt "/etc/puppet/modules/accounts/manifests/init.pp" puppet >}}
user { 'username':
  ensure      => present,
  home        => '/home/username',
  shell       => '/bin/bash',
  managehome  => true,
  gid         => 'username',
  groups      => "$rootgroup",
}

{{< /file-excerpt >}}


    The value `"$rootgroup"` is enclosed in double quotes (") instead of single quotes (') because it is a variable. Any value enclosed within single quotes will be added as typed in your module; anything enclosed in double quotes can accept variables.

8.  The final value that needs to be added is the `password`. Since we do not want to use plain text, it should be fed to Puppet as a SHA1 digest, which is supported by default. Set a password from the terminal:

        openssl passwd -1

    You will be prompted to enter your password and confirm. A hashed password will be output. This should then be copied and added to the `user` resource:

    {{< file "/etc/puppet/modules/accounts/manifests/init.pp" puppet >}}
class accounts {

  user { 'username':
    ensure      => present,
    home        => '/home/username',
    shell       => '/bin/bash',
    managehome  => true,
    gid         => 'username',
    groups      => "$rootgroup",
    password    => '$1$07JUIM1HJKDSWm8.NJOqsP.blweQ..3L0',
    }

}

{{< /file >}}


    {{< caution >}}
The hashed password **must** be included in single quotes (').
{{< /caution >}}

9.  After saving your changes, use the puppet parser to ensure that the code is correct:

        puppet parser validate init.pp

    Any errors that need to be addressed will be logged to standard output. If nothing is returned, your code is valid.

10. Before the module can be tested further, navigate to the `examples` directory and create another `init.pp` file, this time to call to the `accounts` module:

        cd ../examples

    {{< file "/etc/puppet/modules/accounts/examples/init.pp" puppet >}}
include accounts

{{< /file >}}


    After adding this line, save and exit the file.

11. While still in the `examples` directory, test the module without making changes:

        puppet apply --noop init.pp

    {{< note >}}
The `--noop` parameter prevents Puppet from actually running the module.
{{< /note >}}

    It should return:

        Notice: Compiled catalog for puppet.example.com in environment production in 0.26 seconds
        Notice: /Stage[main]/Accounts::Groups/Group[username]/ensure: current_value absent, should be present (noop)
        Notice: Class[Accounts::Groups]: Would have triggered 'refresh' from 1 events
        Notice: /Stage[main]/Accounts/User[username]/ensure: current_value absent, should be present (noop)
        Notice: Class[Accounts]: Would have triggered 'refresh' from 1 events
        Notice: Stage[main]: Would have triggered 'refresh' from 2 events
        Notice: Finished catalog run in 0.02 seconds

12. Again from the `examples` directory, run `puppet apply` to make these changes to the Puppet master server:

        puppet apply init.pp

13. Log out as `root` and log in to the Puppet master as your new user. The rest of this guide will be run by this user.

### Edit SSH Settings

Although a new user has successfully been added to the Puppet master, the account is still not secure. Root access should be disabled for the server before continuing.

1.  Navigate to `files` within the `account` module directory:

        cd /etc/puppet/modules/accounts/files

2.  Copy the `sshd_config` file to this directory:

        sudo cp /etc/ssh/sshd_config .

3.  Open the file with `sudo`, and set the `PermitRootLogin` value to `no`:

    {{< file-excerpt "/etc/puppet/modules/accounts/files/sshd_config" aconf >}}
PermitRootLogin no

{{< /file-excerpt >}}


4.  Navigate back to the `manifests` directory and, using `sudo`, create a file called `ssh.pp`. Use the `file` resource to replace the default configuration file with the one managed by Puppet:

        cd ../manifests

    {{< file "/etc/puppet/modules/accounts/manifests/ssh.pp" puppet >}}
class accounts::ssh {

  file { '/etc/ssh/sshd_config':
    ensure  => present,
    source  => 'puppet:///modules/accounts/sshd_config',
  }

}

{{< /file >}}


    {{< note >}}
The `file` directory is omitted from the `source` line because the `files` folder is the default location of files. For more information on the format used to access resources in a module, refer to the [official Puppet module documentation](https://docs.puppet.com/puppet/3.8/modules_fundamentals.html#module-layout).
{{< /note >}}

5.  Create a second resource to restart the SSH service and set it to run whenever `sshd_config` is changed. This will also require a selector statement because the SSH service is called `ssh` on Debian systems and `sshd` on Red Hat:

    {{< file "/etc/puppet/modules/accounts/manifests/ssh.pp" puppet >}}
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


6.  Include the `ssh` class within `init.pp`:

    {{< file-excerpt "/etc/puppet/modules/accounts/manifests/init.pp" puppet >}}
class accounts {
  include groups
  include ssh

...

{{< /file-excerpt >}}


    Your complete `init.pp` will look similar to this:

    {{< file "/etc/puppet/modules/accounts/manifests/init.pp" puppet >}}
class accounts {
    include groups
    include ssh

    $rootgroup = $osfamily ? {
        'Debian' => 'sudo',
        'RedHat' => 'wheel',
        default => warning('This distro not supported by Accounts module'),
    }
    user { 'example':

        ensure  => present,
        home    => '/home/username',
        shell   => '/bin/bash',
        managehome  => true,
        gid     => 'username',
        groups  => "$rootgroup",
        password => '$1$07JUIM1HJKDSWm8.NJOqsP.blweQ..3L0'
    }

}

{{< /file >}}


7.  Run the Puppet parser, then navigate to the `examples` directory to test and run `puppet apply`:

        sudo puppet parser validate ssh.pp
        cd ../examples
        sudo puppet apply --noop init.pp
        sudo puppet apply init.pp

    {{< note >}}
You may see the following line in your output when validating:

`Error: Removing mount "files": /etc/puppet/files does not exist or is not a directory`

This refers to a Puppet configuration file, not the module resource you're trying to copy. If this is the only error in your output, the operation should still succeed.
{{< /note >}}

8.  To ensure that the `ssh` class is working properly, log out and then try to log in as `root`. You should not be able to do so.

### Add and Configure IPtables

In this section, we'll configure firewall rules using `iptables`. However, these rules will not persist across reboots by default. To avoid this, install the appropriate package on each node (both master and agents) before proceeding:

**Ubuntu/Debian**:

    sudo apt install iptables-persistent

**CentOS 7**:

CentOS 7 uses firewalld by default as a controller for iptables. Be sure firewalld is stopped and disabled before starting to work directly with iptables:

    sudo systemctl stop firewalld && sudo systemctl disable firewalld

    sudo yum install iptables-services


1.  On your Puppet master node, install Puppet Lab's firewall module from the Puppet Forge:

        sudo puppet module install puppetlabs-firewall

    The module will be installed in your `/etc/puppet/modules` directory.

2.  Navigate to the `manifests` directory under the new `firewall` module:

        cd /etc/puppet/modules/firewall/manifests/

3.  Create a file titled `pre.pp`, which will contain all basic networking rules that should be run first:

    {{< file "/etc/puppet/modules/firewall/manifests/pre.pp" puppet >}}
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


    Each rule is explained via commented text. More information can also be found on the [Puppet Forge Firewall](https://forge.puppetlabs.com/puppetlabs/firewall) page.

4.  In the same directory create `post.pp`, which will run any firewall rules that need to be input last:

    {{< file "/etc/puppet/modules/firewall/manifests/post.pp" puppet >}}
class firewall::post {

  firewall { '999 drop all':
    proto  => 'all',
    action => 'drop',
    before => undef,
  }

}

{{< /file >}}


    These rules will direct the system to drop all inbound traffic that is not already permitted in the firewall.

5.  Run the Puppet parser on both files to ensure the code does not return any errors:

        sudo puppet parser validate pre.pp
        sudo puppet parser validate post.pp

6.  Move up a directory, create a new `examples` directory, and navigate to it:

        cd ..
        sudo mkdir examples
        cd examples

7.  Within `examples`, create an `init.pp` file to test the firewall on the Puppet master:

    {{< file "/etc/puppet/modules/firewall/examples/init.pp" puppet >}}
resources { 'firewall':
  purge => true,
}

Firewall {
  before        => Class['firewall::post'],
  require       => Class['firewall::pre'],
}

class { ['firewall::pre', 'firewall::post']: }

firewall { '200 Allow Puppet Master':
  dport          => '8140',
  proto         => 'tcp',
  action        => 'accept',
}

{{< /file >}}


    This code block ensures that `pre.pp` and `post.pp` run properly, and adds a firewall rule to the Puppet master to allow nodes to access it.

8.  Run the `init.pp` file through the Puppet parser and then test to see if it will run:

        sudo puppet parser validate init.pp
        sudo puppet apply --noop init.pp

    If successful, run the `puppet apply` without the `--noop` option:

        sudo puppet apply init.pp

9.  Once Puppet is done running, check the iptables rules:

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


### Add Modules to the Agent Nodes

Now that the `accounts` and `firewall` modules have been created, tested, and run on the Puppet master, it is time to add them to the Puppet agent nodes created earlier.

1.  From the **Puppet master**, navigate to `/etc/puppet/manifests`.

        cd /etc/puppet/manifests

2.  List all available agent nodes:

        sudo puppet cert list -all

3.  Create the file `site.pp` to define which nodes will take what modules. Replace `ubuntuagent.example.com` and `centosagent.example.com` with the FQDNs of your agent nodes:

    {{< file "/etc/puppet/manifests/site.pp" puppet >}}
node 'ubuntuagent.example.com' {
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

node 'centosagent.example.com' {
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


    This includes the `accounts` module and uses the same firewall settings as above to ensure that the firewall rules are applied properly.

4.  On each **Puppet agent node**, enable the `puppet agent` command:

        puppet agent --enable

5.  Run the Puppet agent:

        puppet agent -t

6.  To ensure the Puppet agent worked, log in as the limited user that was created and check the iptables:

        sudo iptables -L

Congratulations! You've successfully installed Puppet on a master and two agent nodes. Now that you've confirmed everything is working, you can create additional modules to automate configuration management on your agent nodes. For more information, see [Puppet module fundamentals](https://docs.puppet.com/puppet/latest/reference/modules_fundamentals.html). You can also install and use those modules others have created on the [Puppet Forge](https://docs.puppet.com/puppet/latest/reference/modules_installing.html).
