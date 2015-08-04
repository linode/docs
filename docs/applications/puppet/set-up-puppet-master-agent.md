---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'Basic setup and configuration of a Puppet master and agent. Puppet is a configuration automation platform that allows users to efficiently manage servers'
keywords: 'puppet,puppet installation,configuration change management,server automation,puppet master,puppet agent'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, July 17th, 2015
modified_by:
  name: Elle Krout
published: 'Friday, July 17th, 2015'
title: Setting Up a Puppet Master and Agent on Ubuntu 14.04
---

Puppet is a configuration automation platform that is meant to simplify and automate various system administrator tasks. Puppet uses a client/server formation where the clients, called *nodes* talk to and pull down configuration profiles from the master server, or *puppet master*.

Puppet is written in its own Puppet language, meant to be easily accessible to system administrators. A system is described via module, located on the puppet master, and then Puppet translates that description into code and alters the agent servers as needed when the `puppet agent` command is run on an agent node.

## Before You Begin

1.	Have two available nodes, one of which has at least four cores, and 4GB of RAM for the puppet master. A [Linode 4GB](/pricing) plan is recommended.

2.	Follow the [Getting Started](/docs/getting-started) and ensure your Linodes are on the same timezone.

	{: .note}
	>
	>On the puppet master server, for ease of use, set the hostname to `puppet`, and have a valid fully-qualified domain name (FQDN).
	>
	>To check your hostname run:
	>
	>	hostname
	>
	>To check your FQDN run:
	>
	>	hostname -f


## Set Up the Puppet Master

1.	Enable the `puppetlabs-release` repository on Ubuntu 14.04, unpackage it, and update your system:

		wget https://apt.puppetlabs.com/puppetlabs-release-trusty.deb
		dpkg -i puppetlabs-release-trusty.deb
		apt-get update

2.	Install the `puppetmaster-passenger` package:

		apt-get install puppetmaster-passenger

3.	Ensure the latest version of Puppet by running:

		puppet resource package puppetmaster ensure=latest

4.	Update `/etc/puppet/puppet.conf` and add the `dns_alt_names` line to the section `[main]`, replacing `puppet.example.com` with your own FQDN:

	{: .file-excerpt}
	/etc/puppet/puppet.conf
	:	~~~ conf
		[main]
		dns_alt_names = puppet,puppet.example.com
		~~~

	Also remove the love `templatedir=$confdir/templates`, which has been deprecated.

5.	Start the puppet master:

		service puppetmaster start


## Set Up the Puppet Node

1.	Install the `puppet` package:

		apt-get install puppet

2.	Add the `server` value to the `[main]` section of the node's `puppet.conf` file, replacing `puppet.example.com` with your puppet master's FQDN:

	{: .file-excerpt}
	/etc/puppet/puppet.conf
	:	~~~ conf
		[main]
		server = puppet.example.com
		~~~

3.	Restart the puppet service:

		service puppet restart

4.	Run the puppet agent to generate a certificate for the puppet master to sign:

		puppet agent -t

5.	Log into to your **puppet master** and list the certifications that need approval:

		puppet cert list

	It should output a list with your node's hostname.

6.	Approve the certificate, replacing `hostname.example.com` with your node's name:

		puppet cert sign hostname.example.com

7.	Back on the **puppet node** run the puppet agent again:

		puppet agent -t

## Add Modules to Configure Nodes (Optional)

Both the puppet master and node configured above are functional, but not fully secure. Based off concepts from the [Securing Your Server](/docs/security/securing-your-server/) guide, a superuser and a firewall should be configured. This can be done on both nodes through Puppet, making it easy to pass these requirements on to any future nodes.

### Add a Superuser

1. 	From the **puppet master**, navigate to the `modules` directory and create your new module for adding user accounts, then `cd` into that directory:

		cd /etc/puppet/modules
		mkdir accounts
		cd accounts

2.	Create the directories needed to have a functioning module:

		mkdir {examples,files,manifests,templates}

	The `examples` directory allows you to test the module locally, `files` contains any static files that may need to be edited or added, `manifests` contains the actual Puppet code for the module, and `templates` contains any non-static files that may be needed.

3.	Move to the `manifests` directory and create your first class, called `init.pp`. All modules require an `init.pp` file to be used as the main definition file of a module.

4.	Within the `init.pp` file, define a superuser to use instead of `root`, replacing all instances of `username` with your choosen username:

	{: .file}
	init.pp
	:	~~~ pp
		class accounts {

		  user { 'username':
		    ensure      => present,
		    home        => '/home/username',
		    shell       => '/bin/bash',
		    gid         => 'sudo',
		    managehome  => true,
		    }

		}
		~~~

	The `init.pp` file initially defined the *class*, accounts (as noted above). It then calls to the `user` resource, where a `username` is defined. The `ensure` value is set to ensure that the user is present. The `home` value should be set to what the user's home directory should be. `shell` defined the shell, in this instance `/bin/bash`. Because this is to be used on an Ubuntu 14.04 system, the `gid` -- or main group -- is defined as `sudo`, which will grant the user sudo privledges. If this were CentOS or another Red Hat distro, this should be set to the `wheel` group. Finally, `managehome` notes that the home directory should be created.

5. 	A final value that needs to be added is the `password` value: But since we do not want to use plain text, it should be fed to Puppet through SHA1 encryption, which is supported by default. Set a password:

		openssl passwd -1

	You will be prompted to type in your password and then comfirm. A hashed password will then be output. This should then be copied and added to the `user` resource:


	{: .file}
	init.pp
	:	~~~ pp
		class accounts {

		  user { 'username':
		    ensure      => present,
		    home        => '/home/username',
		    shell       => '/bin/bash',
		    gid         => 'sudo',
		    managehome  => true,
		    password	=> '$1$07JUIM15$NWm8.NJOqsP.blweQ..3L0',
		    }

		}
		~~~

	{: .note}
	>
	>The hashed password **must** be included in single quotes (').

6.	Use the puppet parser to ensure that the code is correct:

		puppet parser validate init.pp

	If nothing is output, your code is correct; otherwise, any errors that need to be addressed with be output.

7.	Before this can be tested, navigate to the `examples` directory and create another `init.pp` file, this time to call to the `accounts` module:

	{: .file}
	examples/init.pp
	:	~~~ pp
		include accounts
		~~~

7.	To test the module without making changes, from the `examples` directory run:

		puppet apply --noop init.pp

	It should output:

		Notice: Compiled catalog for puppet.example.com in environment production in 0.07 seconds
		Notice: /Stage[main]/Accounts/User[username]/ensure: current_value absent, should be present (noop)
		Notice: Class[Accounts]: Would have triggered 'refresh' from 1 events
		Notice: Stage[main]: Would have triggered 'refresh' from 1 events
		Notice: Finished catalog run in 0.01 seconds

8.	Run `puppet apply` to make these changes to the puppet master server:

		puppet apply init.pp

9.	Logout as `root` and log in to your puppet master server as your new superuser. The rest of this guide will be run through this user.


### Add and Configure IPTables

1.	Install Puppet Lab's firewall module from the Puppet Forge:

		sudo puppet module install puppetlabs-firewall

2.	Navigate to the `manifests` directory under the new `firewall` module.

3.	Create a file titled `pre.pp`, which will contain all basic networking rules that should be run first:

	{: .file}
	pre.pp
	:	~~~ pp
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

		   #All all outbound traffic
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
		    port	=> '22',
		    proto	=> 'tcp',
		    action	=> 'accept',
		  }->

		   #Allow HTTP/HTTPS connections
		  firewall { '006 HTTP/HTTPS connections':
		    port	=> ['80', '443'],
		    proto	=> 'tcp',
		    action	=> 'accept',
		  }

		}
		~~~

	Each rule is explained via commented text. More information can also be found on the [Puppet Forge Firewall](https://forge.puppetlabs.com/puppetlabs/firewall) page.

4.	In the same directory create `post.pp`, which will run any firewall rules that need to be input last:

	{: .file}
	post.pp
	:	~~~ pp
		class firewall::post {

		  firewall { '999 drop all':
		    proto  => 'all',
		    action => 'drop',
		    before => undef,
		  }

		}
		~~~

	This is set to drop all inbound traffic that is not already permitted in the firewall.

5.	Run the Puppet parser on both files to ensure the code does not bring back any errors:

		puppet parser validate pre.pp
		puppet parser validate post.pp

6.	Move down a directory, create an `example` directory, and navigate to it:

		cd ..
		sudo mkdir examples
		cd examples

7.	Within `examples`, create an `init.pp` file to test the firewall on the Puppet master:

	{: .file}
	init.pp
	:	~~~ pp
		resources { 'firewall':
		  purge => true,
		}

		Firewall {
		  before        => Class['firewall::post'],
		  require       => Class['firewall::pre'],
		}

		class { ['firewall::pre', 'firewall::post']: }

		firewall { '200 Allow Puppet Master':
		  port          => '8140',
		  proto         => 'tcp',
		  action        => 'accept',
		}
		~~~

	This ensures that `pre.pp` and `post.pp` run properly, and adds an additional Firewall rule to the Puppet master, to allow nodes to access it.

8.	Run the `init.pp` file through the Puppet parser, and then test to see if it will run:

		puppet parser validate init.pp
		sudo puppet apply --noop init.pp

	If successful, run the `puppet apply` without the `--noop`:

		sudo puppet apply init.pp

9.	Once Puppet is done running, check the IPTables rules:

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

### Add Modules to the Puppet Node

Now that the Accounts and Firewall modules have been created, tested, and run on the puppet master, it is time to add them to the puppet node created earlier.

1.	From the **puppet master** navigate to `/etc/puppet/manifests`.

2.	List all available nodes, to check the node names:

		sudo puppet cert list -all

3.	Create the file `site.pp` to define which nodes will take what modules:

	{: .file}
	site.pp
	:	~~~ pp
		node 'bootes.kitteninspace.com' {
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

	This includes the Accounts module, and uses the same Firewall settings as above to ensure that the firewall rules run properly.

4.	Switch to the **puppet node**, and enable the `puppet agent` command:

		puppet agent --enable

5.	Run the puppet agent:

		puppet agent -t

6.	To ensure that the puppet agent worked, log in at the superuser that was created, and then check iptables:

		sudo iptables -L

