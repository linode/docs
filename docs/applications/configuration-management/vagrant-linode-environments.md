---
author:
    name: Elle Krout
    email: ekrout@linode.com
description: 'Use Vagrant to manage development environments and content on Linode.'
keywords: 'linode,vagrant,content management,management,automation,development,ruby,vagrantfile,api'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: [ 'web-applications/cloud-storage/dropbox/debian-7.4' ]
modified: Tuesday, June 2nd, 2015 
modified_by:
    name: Elle Krout
published: 'Tuesday, June 2nd, 2015'
title: 'Use Vagrant to Manage Linode Environments'
---

## Prerequisites

1.	[Install Vagrant](http://www.vagrantup.com/downloads) on your chosen workspace.

2.	Generate an API Key. This will be used to create Linodes based upon your Vagrant profile:

	-	Log in to the Linode Manager and select **my profile** to the upper right.

	-	Select the API Keys tab.

	-	Enter a label for your API Key (such as "vagrant") and set an expire time. Then click **Create API Key**.

	-	Your API Key will be output in a green box. **It will only be shown once** so be sure to record the key for later use.

## Install the vagrant-linode Plugin

1.	From your workspace, create a directory for your project, and move into that directory:

		mkdir vagrant-linode
		cd vagrant-linode

2.	Install the plugin:

		vagrant plugin install vagrant-linode

3.	From the `vagrant-linode` directory, create the Vagrantfile:

		touch Vagrantfile

	The Vagrantfile is used to describe in code the type of machine that Vagrant will create. It defines everything from the operating system to the users, passwords, and SSH key authentication, to any applications that need to be initially installed to make one consistent word environment.

## Configure the Vagrantfile

1.	Open the Vagrantfile in your text editor of choice. In Ruby, define what version of Vagrant you are using. The `2` defines that it is Vagrant 1.1.0 leading up to Vagrant 2.0. `1` is any version of Vagrant below that:

	{: .file}
	~/vagrant-linode/Vagrantfile
	:	~~~ ruby
		Vagrant.configure('2') do |config|

		end
		~~~

	All code will take place between the `Vagrant.configure` and `end` lines.

2.	When creating a guest machine, Vagrant will create a username, password, and private key to access the machine. The default username and password is `vagrant`. Define your own parameters for the `username`, and set the pathway to your own private key:

	{: .file}
	~/vagrant-linode/Vagrantfile
	:	~~~ ruby
		Vagrant.configure('2') do |config|

		  ## SSH Configuration
		  config.ssh.username = 'user'
		  config.ssh.private_key_path = '~/.ssh/id_rsa' 

		end
		~~~

	If you choose to do so, you can also define your own password with the `config.ssh.password` setting.

3.	Define the Linode provider:

	{: .file}
	~/vagrant-linode/Vagrantfile
	:	~~~ ruby
		Vagrant.configure('2') do |config|

		  ...

		  # Global Configuration
		  config.vm.provider :linode do |provider, override|
		    override.vm.box = 'linode'
		    override.vm.box_url = "https://github.com/displague/vagrant-linode/raw/master/box/linode.box"
		    provider.token = 'API-KEY'
		  end

		end
		~~~

	Lines 6 defined the provider, whereas 7 and 8 define the *box*. Boxes are packages that define the basic requirements for a Vagrant environment to function. The supplied box is the `linode` box, created as part of the plugin. Replace the `API-KEY` with the key generated [above](#prerequisites)

4.	Choose your Linode's settings:

	{: .file}
	~/vagrant-linode/Vagrantfile
	:	~~~ ruby
		Vagrant.configure('2') do |config|

		  ...

		  # Global Configuration
		  config.vm.provider :linode do |provider, override|
		    
		    ...

		    #Linode Settings
		    provider.distribution = 'Ubuntu 14.04 LTS'
		    provider.datacenter = 'newark'
		    provider.plan = '1024'
		    provider.label = 'vagrant-ubuntu-lts'

		  end

		end
		~~~



## Install Apache and Sync Files

## Boot an Instance

