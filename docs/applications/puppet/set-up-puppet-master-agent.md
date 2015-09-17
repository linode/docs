---
author:
    name: Elle Krout
    email: ekrout@linode.com
description: 'Basic setup and configuration of a Puppet master and agents. Puppet is a configuration automation platform that allows users to efficiently manage servers'
keywords: 'puppet,puppet installation,install puppet,configuration change management,server automation,puppet master,puppet agent,puppet tutorial,open-source configuration management,configuration management'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['websites/puppet/basic-puppet-setup-and-configuration/','websites/puppet/manage-and-automate-systems-configuration-with-puppet/']
modified: Thursday, September 17th, 2015
modified_by:
    name: Elle Krout
published: 'Thursday, September 17th, 2015'
title: How to Install a Puppet Master and Agent Nodes
external_resources:
    - '[Puppet Labs](https://puppetlabs.com/)'
    - '[Puppet Open Source Documentation](https://docs.puppetlabs.com/puppet/)'
---

[Puppet](https://puppetlabs.com/) is a configuration automation platform that is meant to simplify various system administrator tasks. Puppet uses a client/server formation where the servers, called *agent nodes* talk to and pull down configuration profiles from the master client, or *Puppet master*.

Puppet is written in its own Puppet language, meant to be accessible to system administrators. A system is described via a module located on the Puppet master. Puppet then translates that description into code and alters the agent servers as needed when the `puppet agent` command is run on an agent node, or automatically at the configured intervals.

Puppet can be used to manage multiple servers across various infrastructures. For the purpose of this guide we will be working with an Ubuntu 14.04 LTS master server and two agent nodes: one Ubuntu 14.04, and one CentOS 7.

{: .note}
>
>Begin this guide as the `root` user. A super user will be configured in later steps.

## Before You Begin

1.  Have three available Linodes, one of which has at least four cores, and 4GB of RAM for the Puppet master. A [Linode 4GB](/pricing) plan is recommended. The two other nodes can be of any plan.

2.  Follow the [Getting Started](/docs/getting-started) guide and ensure your Linodes are on the same timezone.

    {: .note}
    >
    >For ease of use, set the Puppet master server's hostname to `puppet`, and have a valid fully-qualified domain name (FQDN).
    >
    >To check your hostname, run `hostname` and to check your FQDN, run `hostname -f`.


## Set Up the Puppet Master

1.  Enable the `puppetlabs-release` repository on Ubuntu 14.04, unpackage it, and update your system. This process downloads a `.deb` file which will configure the repositories for you:

        wget https://apt.puppetlabs.com/puppetlabs-release-trusty.deb
        dpkg -i puppetlabs-release-trusty.deb
        apt-get update
        
    {: .note}
    >
    >If you wish to run another Linux distribution as your master server, the initial `.deb` file can be substituted for another distribution based on the following formats:
    >
    >-  Red Hat-based systems:
    >       
    >        wget puppetlabs-release-pc1-OS-VERSION.noarch.rpm
    >
    >-  Debian-based systems:
    >
    >        wget puppetlabs-release-pc1-VERSION.deb
    >
    >The commands below will then have to be amended for the proper distribution. More information can be found in [Puppet's Installation Documentation](http://docs.puppetlabs.com/puppet/4.0/reference/install_linux.html#install-a-release-package-to-enable-puppet-labs-package-repositories).

2.  Install the `puppetmaster-passenger` package:

        apt-get install puppetmaster-passenger

3.  Ensure you have the latest version of Puppet by running:

        puppet resource package puppetmaster ensure=latest

4.  Update `/etc/puppet/puppet.conf` and add the `dns_alt_names` line to the section `[main]`, replacing `puppet.example.com` with your own FQDN:

    {: .file-excerpt}
    /etc/puppet/puppet.conf
    :   ~~~ conf
        [main]
        dns_alt_names = puppet,puppet.example.com
        ~~~

    Also remove the line `templatedir=$confdir/templates`, which has been deprecated.

5.  Start the puppet master:

        service puppetmaster start


## Set Up the Puppet Node

### Ubuntu 14.04/Debian Systems

1.  Install the `puppet` package:

        apt-get install puppet

2.  Add the `server` value to the `[main]` section of the node's `puppet.conf` file, replacing `puppet.example.com` with your Puppet master's FQDN:

    {: .file-excerpt}
    /etc/puppet/puppet.conf
    :   ~~~ conf
        [main]
        server = puppet.example.com
        ~~~

3.  Restart the Puppet service:

        service puppet restart

### CentOS 7/Red Hat Systems

1.  Add the Puppet Labs repository:

        rpm -ivh https://yum.puppetlabs.com/el/7/products/x86_64/puppetlabs-release-7-11.noarch.rpm
        
    {: .note}
    >
    >If on a Red Hat system other than CentOS 7, skip this step.
        
2.  Install the Puppet agent:

        yum install puppet
        
3.  Add the `server` value to the `[main]` section of the node's `puppet.conf` file, replacing `puppet.example.com` with your Puppet master's FQDN:

    {: .file-excerpt}
    /etc/puppet/puppet.conf
    :   ~~~ conf
        [main]
             server = puppet.example.com
        ~~~

4.  Start Puppet:

        systemctl start puppet

### Generate and Sign Certificates

For each of the agent nodes:

1.  Run the puppet agent to generate a certificate for the puppet master to sign:

        puppet agent -t
        
    It will appear to output an error, stating that no certificate is found. This is because the generated certificate needs to approved by the Puppet master.

2.  Log into to your **Puppet master** and list the certifications that need approval:

        puppet cert list

    It should output a list with your node's hostname.

3.  Approve the certificate, replacing `hostname.example.com` with your node's name:

        puppet cert sign hostname.example.com

4.  Back on the **puppet node**, run the puppet agent again:

        puppet agent -t

## Add Modules to Configure Nodes (Optional)

Both the Puppet master and nodes configured above are functional, but not fully secure. Based off concepts from the [Securing Your Server](/docs/security/securing-your-server/) guide, a superuser and a firewall should be configured. This can be done on all nodes through the creation of basic Puppet modules, shown below.

{: .note}
>
>This is meant to provide as basis for a fully-hardened server, and is intended as learning resource. Alter and add firewall and other configuration options as needed.

### Add a Superuser

1.  From the **Puppet master**, navigate to the `modules` directory and create your new module for adding user accounts, then `cd` into that directory:

        cd /etc/puppet/modules
        mkdir accounts
        cd accounts

2.  Create the directories needed to have a functioning module:

        mkdir {examples,files,manifests,templates}

    The `examples` directory allows you to test the module locally, `files` contains any static files that may need to be edited or added, `manifests` contains the actual Puppet code for the module, and `templates` contains any non-static files that may be needed.

3.  Move to the `manifests` directory and create your first class, called `init.pp`. All modules require an `init.pp` file to be used as the main definition file of a module.

4.  Within the `init.pp` file, define a superuser to use instead of `root`, replacing all instances of `username` with your chosen username:

    {: .file}
    /etc/puppet/modules/accounts/manifests/init.pp
    :   ~~~ pp
        class accounts {

          user { 'username':
            ensure      => present,
            home        => '/home/username',
            shell       => '/bin/bash',
            managehome  => true,
            gid         => 'username',
            }

        }
        ~~~

    The `init.pp` file initially defines the *class*, accounts. It then calls to the `user` resource, where a `username` is defined. The `ensure` value is set to ensure that the user is present. The `home` value should be set to the user's home directory path. `shell` defines the shell type, in this instance the bash shell. `managehome` notes that the home directory should be created, and, finally, `gid` sets the primary group for the user.
    
5.  Although the primary group is set to share the username, the group itself has not been created. Save and exit `init.pp` and then open a new file called `groups.pp`. This file will be used to create the user's group. Again replace `username` with your chosen username:

    {: .file}
    /etc/puppet/modules/accounts/manifests/groups.pp
    :   ~~~ pp
        class accounts::groups {
        
          group { 'username':
            ensure  => present,
          }
          
        }
        ~~~
        
     Include this file by adding `include groups` to the `init.pp` file:
     
     {: .file-excerpt}
     /etc/puppet/modules/accounts/manifests/init.pp
     :  ~~~ pp
        class accounts {
        
          include groups
          
        ...
        ~~~
    
6.  This user should be an administrative user. Because we have agent nodes on both Debian- and Red Hat-based systems, the new user needs to be in the `sudo` group on Debian systems, and the `wheel` group on Red Hat systems. This value can be set dynamically through the use of a selector and *facter*, a program incuded in Puppet that keeps tracks of information, or *facts*, about every server. Add a selector statement to the top of the `init.pp` file within the accounts class brackets, defining the two options:

    {: .file-excerpt}
    /etc/puppet/modules/accounts/manifests/init.pp
    :   ~~~ pp
        class accounts {
        
          $rootgroup = $osfamily ? {
            'Debian'  => 'sudo',
            'RedHat'  => 'wheel',
            default   => warning('This distribution is not supported by the Accounts module'),
          }
          
          ...
          
        }        
        ~~~
        
    This reads that, within the *accounts* module, the variable `$rootgroup` should evaluate, using facter, the operating system family (`$osfamily`), and if the value returned is `Debian`, to set the $rootgroup value to `sudo`; if the value returned is `RedHat` this same value should be set to `wheel`, otherwise, the `default` value will output a warning stating that the distribution selected is not supported by this module.
    
7.  Add the `groups` value to the user resource, calling to the `$rootgroup` variable defined in the previous step:

    {: .file-excerpt}
    /etc/puppet/modules/accounts/manifests/init.pp
    :   ~~~ pp
          user { 'username':
            ensure      => present,
            home        => '/home/username',
            shell       => '/bin/bash',
            managehome  => true,
            gid         => 'username',
            groups      => "$rootgroup",
          }
        ~~~
        
    The value, `"$rootgroup"`, is encased in double quotes (") instead of single quotes (') because it is a variable. Any value encased within single quotes will be added exactly as typed in your module, anything in double quotes can accept variables with the exception being hashed passwords.  

8.  A final value that needs to be added is the `password` value, but since we do not want to use plain text, it should be fed to Puppet as a SHA1 digest, which is supported by default. Set a password:

        openssl passwd -1

    You will be prompted to type in your password and then confirm. A hashed password will then be output. This should then be copied and added to the `user` resource:


    {: .file}
    /etc/puppet/modules/accounts/manifests
    :   ~~~ pp
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
        ~~~

    {: .note}
    >
    >The hashed password **must** be included in single quotes (').

9.  Use the puppet parser to ensure that the code is correct:

        puppet parser validate init.pp

    If nothing is returned, your code is correct. Otherwise, any errors that need to be addressed with be output.

10. Before the module can be tested further, navigate to the `examples` directory and create another `init.pp` file, this time to call to the `accounts` module:

    {: .file}
    /etc/puppet/modules/accounts/examples/init.pp
    :   ~~~ pp
        include accounts
        ~~~

11. Test the module without making changes:

        puppet apply --noop init.pp
        
    {: .note}
    >
    >The `--noop` parameter prevents Puppet from actually running the module.

    It should return:

        Notice: Compiled catalog for puppet.example.com in environment production in 0.07 seconds
        Notice: /Stage[main]/Accounts/User[username]/ensure: current_value absent, should be present (noop)
        Notice: Class[Accounts]: Would have triggered 'refresh' from 1 events
        Notice: Stage[main]: Would have triggered 'refresh' from 1 events
        Notice: Finished catalog run in 0.01 seconds

12. Run `puppet apply` to make these changes to the Puppet master server:

        puppet apply init.pp

13. Logout as `root` and log in to the Puppet master as your new superuser. The rest of this guide will be run through this user.


### Edit SSH Settings

Although a new user has successfully been added to the Puppet master, the account is still not secure. Root access should be disabled from the server before continuing.

1.  Navigate to `files` within the `account` module directory:

        cd /etc/puppet/modules/accounts/files
        
2.  Copy the `sshd_config` file to this directory:

        sudo cp /etc/ssh/sshd_config .
        
3.  Open the file with `sudo`, and set the `PermitRootLogin` value to `no`:

    {: .file-excerpt}
    /etc/puppet/modules/accounts/files/sshd_config
    :   ~~~ config
        PermitRootLogin no
        ~~~
        
4.  Navigate back to the `manifests` directory and create a file called `ssh.pp`. Use the `file` resource to replace the default configuration file with the one managed by Puppet:

    {: .file}
    /etc/puppet/modules/accounts/manifests/ssh.pp
    :   ~~~ pp
        class accounts::ssh {
        
          file { '/etc/ssh/sshd_config':
            ensure  => present,
            source  => puppet:///modules/accounts/sshd_config,
          }
        
        }
        ~~~

    {: .note}
    >
    > The `file` directory is left out of the `source` line because the `files` folder is the default location of files.
    
5.  Create a second resource to restart the SSH service and set it to run whenever `sshd_config` is changed. This will also require a selector statement because the SSH service is called `ssh` on Debian systems and `sshd` on Red Hat:

    {: .file-excerpt}
    /etc/puppet/modules/accounts/manifests/ssh.pp
    :   ~~~ pp

          ...

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
        ~~~
        
6.  Include the `ssh` class within `init.pp`:

    {: .file-excerpt}
    /etc/puppet/modules/accounts/manifests/init.pp
    :   ~~~ pp
        class account {
        
          include groups        
          include ssh
        
        ...
        ~~~
        
6.  Run the Puppet parser, then navigate to the `examples` directory to test and run `puppet apply`:

        puppet parser validate ssh.pp
        cd ../examples
        sudo puppet apply --noop init.pp
        sudo puppet apply init.pp
        
8.  To ensure that the `ssh` class is working properly, logout, and then try to log in as `root`. You should not be able it. Log in as your superuser again.
        
        

### Add and Configure iptables

1.  Install Puppet Lab's firewall module from the Puppet Forge:

        sudo puppet module install puppetlabs-firewall

2.  Navigate to the `manifests` directory under the new `firewall` module.

        cd /etc/puppet/modules/firewall/manifests/

3.  Create a file titled `pre.pp`, which will contain all basic networking rules that should be run first:

    {: .file}
    /etc/puppet/modules/firewall/manifests/pre.pp
    :   ~~~ pp
        class firewall::pre {

          Firewall {
            require => undef,
          }

           # Accept all lookback traffic
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
        ~~~

    Each rule is explained via commented text. More information can also be found on the [Puppet Forge Firewall](https://forge.puppetlabs.com/puppetlabs/firewall) page.

4.  In the same directory create `post.pp`, which will run any firewall rules that need to be input last:

    {: .file}
    post.pp
    :   ~~~ pp
        class firewall::post {

          firewall { '999 drop all':
            proto  => 'all',
            action => 'drop',
            before => undef,
          }

        }
        ~~~

    This is set to drop all inbound traffic that is not already permitted in the firewall.

5.  Run the Puppet parser on both files to ensure the code does not bring back any errors:

        sudo puppet parser validate pre.pp
        sudo puppet parser validate post.pp

6.  Move up a directory, create an `example` directory, and navigate to it:

        cd ..
        sudo mkdir examples
        cd examples

7.  Within `examples`, create an `init.pp` file to test the firewall on the Puppet master:

    {: .file}
    init.pp
    :   ~~~ pp
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
        ~~~

    This ensures that `pre.pp` and `post.pp` run properly, and adds an additional Firewall rule to the Puppet master to allow nodes to access it.

8.  Run the `init.pp` file through the Puppet parser and then test to see if it will run:

        sudo puppet parser validate init.pp
        sudo puppet apply --noop init.pp

    If successful, run the `puppet apply` without the `--noop`:

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


### Add Modules to the Puppet Nodes

Now that the Accounts and Firewall modules have been created, tested, and run on the puppet master, it is time to add them to the puppet nodes created earlier.

1.  From the **Puppet master** navigate to `/etc/puppet/manifests`.

        cd /etc/puppet/manifests

2.  List all available nodes:

        sudo puppet cert list -all

3.  Create the file `site.pp` to define which nodes will take what modules:

    {: .file}
    site.pp
    :   ~~~ pp
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
        ~~~

    This includes the Accounts module and uses the same Firewall settings as above to ensure that the firewall rules run properly.

4.  Switch to the **puppet node** and enable the `puppet agent` command:

        puppet agent --enable

5.  Run the puppet agent:

        puppet agent -t

6.  To ensure that the puppet agent worked, log in at the superuser that was created and check iptables:

        sudo iptables -L
