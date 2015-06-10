---
author:
    name: Elle Krout
    email: ekrout@linode.com
description: 'Use Vagrant to manage development environments and content on Linode.'
keywords: 'linode,vagrant,content management,management,automation,development,ruby,vagrantfile,api,apache'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: [ 'web-applications/cloud-storage/dropbox/debian-7.4' ]
modified: Tuesday, June 9th, 2015 
modified_by:
    name: Elle Krout
published: 'Tuesday, June 9th, 2015'
title: 'Using Vagrant to Manage Linode Environments'
external_resources:
 - '[Vagrant](http://www.vagrantup.com)'
 - '[vagrant-linode Plugin](https://github.com/displague/vagrant-linode)'
---

[Vagrant](http://www.vagrantup.com) is a configuration management tool that allows users to create portable and reproducible work environments. Vagrant excels at providing consistent, easy-to-configure servers that can be used to keep developement environments consistent across all users. It is easy to both launch and tear down, and can be supplied to any part of a developement team that may need an environment but does not have the means to configure one themselves. Often paired with providers such as Puppet, Salt, and Chef, it offers an easy solution to keeping a consistent workflow.

Vagrant can be paired with Linode through the use of the *vagrant-linode* plugin to spawn and destroy Linode servers as needed, making it an ideal option should Linode be used as part of one's developement process. This guide will provide instructions on installing Vagrant, configuring the vagrant-linode plugin, and setting up a basic Apache server for testing.

## Prerequisites

1.	[Install Vagrant](http://www.vagrantup.com/downloads) on your chosen workspace.

2.	Generate an API Key. This will be used to create Linodes based upon your Vagrant profile:

	-	Log in to the Linode Manager and select **my profile** to the upper right.

	-	Select the API Keys tab. The following screen will appear:

		[![Linode API](/docs/assets/linode-api-vagrant1-small.png)](/docs/assets/linode-api-vagrant1.png)

	-	Enter a label for your API Key (such as "vagrant") and set an expire time. Then click **Create API Key**.

	-	Your API Key will be output in a green box. **It will only be shown once** so be sure to record the key for later use:

		[![Linode API Key Generated](/docs/assets/linode-api-vagrant2-small.png)](/docs/assets/linode-api-vagrant2.png)


## Install the vagrant-linode Plugin

1.	From your workspace, create a directory for your project, and move into that directory:

		mkdir vagrant-linode
		cd vagrant-linode

2.	Install the plugin:

		vagrant plugin install vagrant-linode

	{: .note}
	>
	>If using a Mac, it may request to install development tools. Select yes, then re-run the command.

3.	From the `vagrant-linode` directory, create the Vagrantfile:

		touch Vagrantfile

	The *Vagrantfile* is used to describe, in code, the type of machine that Vagrant will create. It defines everything from the operating system to the users, to any applications that need to be initially installed to make one consistent work environment.

## Configure the Vagrantfile

1.	Open the Vagrantfile in your text editor of choice. In Ruby, define what version of Vagrant you are using. The `2` defines that it is Vagrant 1.1.0 leading up to Vagrant 2.0. `1` is any version of Vagrant below that:

	{: .file}
	~/vagrant-linode/Vagrantfile
	:	~~~ ruby
		Vagrant.configure('2') do |config|

		end
		~~~

	All code will take place between the `Vagrant.configure` and `end` lines.

2.	When creating a *guest machine* -- the sever that will be created -- Vagrant will create a username, password, and private key to access the machine. The default username and password is `vagrant`. Define your own parameters for the `username`, and set the pathway to your own private key. If you have not generated a private and public key, you can do so by following the [Securing Your Server](/docs/security/securing-your-server/#using-ssh-key-pair-authentication) guide:

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

	Lines 6 defines the provider, whereas 7 and 8 define the *box*. Boxes are packages that include the basic requirements for a Vagrant environment to function. The supplied box is the `linode` box, created as part of the plugin. Replace the `API-KEY` with the key generated [above](#prerequisites).

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

	In this instance, a 1GB Ubuntu 14.04 LTS Linode is being created in the Newark data center. The `provider.label` is the name that the Linode will show up as in the Linode Manager.

	To see more options regarding the vagrant-linode plugin see the documentation on the plugin's [GitHub repository](https://github.com/displague/vagrant-linode).


## Set Up the Server

Although the server could now be launched successfully, many aspects of it still need to be created. Shell scripts will be used to complete the steps from the [Getting Started](/docs/getting-started) guide, and to install and configure Apache. Files will also be synced between the workstation and the Linode.

### Configure the Server

1.	Create a shell script called `setup.sh` to configure the Linode's hostname, set the proper timezone, and update the server. Replace `hostname` with your choosen hostname, and `EST` with your timezone.

	{: .file}
	~/vagrant-linode/setup.sh
	:	~~~ shell
		echo "hostname" > /etc/hostname
		hostname -F /etc/hostname
		ip=$(dig +short myip.opendns.com @resolver1.opendns.com)
		echo "$ip	$ip	hostname" >> /etc/hosts
		ln -sf /usr/share/zoneinfo/EST /etc/localtime
		apt-get update && apt-get upgrade -y
		~~~

	The first two lines define the hostname. The third sets the variable to determine the IP address -- since we will not know IP address until Vagrant launchs the Linode. It is then inserted into the `/etc/hosts` file to define the fully-qualified domain name. Line 5 sets the timezone, and the final line updates the server and server packages.

2.	Within the Vagrantfile call to the shell script you just created by adding the `config.vm.provision` method:

	{: .file}
	~/vagrant-linode/Vagrantfile
	:	~~~ ruby
		Vagrant.configure('2') do |config|

		...

		  # Shell Scripts
		  config.vm.provision :shell, path: "setup.sh"

		end
		~~~

### Install Apache and Sync Files

1.	Create an installation script for Apache. Create a file called `apache.sh` and add the following:

	{: .file}
	~/vagrant-linode/apache.sh
	:	~~~ shell
		apt-get install apache2 -y
		mv /etc/apache2/ports.conf /etc/apache2/ports.conf.backup
		mv /etc/apache2/ports1.conf /etc/apache2/ports.conf
		a2dissite 000-default.conf
		a2ensite vhost.conf
		service apache2 reload
		~~~

	Line 1 installs Apache, whereas the second and third lines create a backup of the `ports.conf` file and replaces it with a file created below. The default hosts file is then disabled and the one that will be created below enabled. Apache is then reloaded to take the configuration changes.

2.	Add the shell script provisioner method to your Vagrantfile, under the line that references `setup.sh`:

	{: .file-excerpt}
	~/vagrant-linode/Vagrantfile
	:	~~~ ruby
		Vagrant.configure('2') do |config|

		...

		  # Shell Scripts
		  config.vm.provision :shell, path: "setup.sh"
		  config.vm.provision :shell, path: "apache.sh"

		end
		~~~

3.	Create a new directory for Apache configuration files, and move into it:

		mkdir apache2
		cd apache2

4.	Because Vagrant is often used for developement environments, we want to host Apache on a port other than 80. Create `ports1.conf`, as referenced in the shell script above. The port will be set to **6789**:

	{: .file}
	~/vagrant-linode/apache2/ports1.conf
	:	~~~ conf
		Listen 6789

		<IfModule ssl_module>
		        Listen 443
		</IfModule>

		<IfModule mod_gnutls.c>
		        Listen 443
		</IfModule>
		~~~

5.	Create a new directory under `apache2` called `sites-available`. Add a VirtualHosts file, `vhost.conf`, to this new directory:

		mkdir sites-available

	{: .file}
	~/vagrant-linode/apache2/sites-available/vhost.conf
	:	~~~ conf
		<VirtualHost *:6789>
		        ServerAdmin webmaster@localhost
		        DocumentRoot /var/www/html
		        ErrorLog ${APACHE_LOG_DIR}/error.log
		        CustomLog ${APACHE_LOG_DIR}/access.log combined
		</VirtualHost>
		~~~

6.	Return to the Vagrantfile, and use the `config.vm.synced_folder` method to sync the local directories with directories on the server:

	{: .file-excerpt}
	~/vagrant-linode/Vagrantfile
	:	~~~ ruby
		Vagrant.configure('2') do |config|
		  ...

		  # Synced Folders
		  config.vm.synced_folder '.', '/vagrant', disabled: true
		  config.vm.synced_folder './apache2', '/etc/apache2', disabled: false
		  config.vm.synced_folder './webfiles', '/var/www/html'

		end
		~~~

	Because the Vagrantfile and shell scripts need not be located on the Linode, line 5 disables syncing for the root folders. Line 6 then defines the locally-hosted `apache2` folder (`'./apache2'`) and links it to the `/etc/apache2` directory on the Linode. `disabled: false` ensures that it will sync. Line 7 does the same with a yet-to-be-created `./webfiles` directory that can be used to add any website files before booting the instance. To add this create the `webfiles` folder in your `vagrant-linode` directory:

		mkdir webfiles


## Boot an Instance

With the Vagrantfile configured, and scripts and files created, it is now time to boot the guest machine and check that it is running properly.

1.	Boot the instance:

		vagrant up

	It will run through the installation process, sync the directories, and run the shell scripts.

2.	Log into the newly-created Linode:

		vagrant ssh

3.	To ensure that Apache is running properly, check the status:

		service apache2 status

	It should output:

		 * apache2 is running

4.	To see that the environment is accesible online, check for the IP address:

		hostname -i

	Then go to your choosen web browser and navigate to your ip address with `:6789` appended to the end. You should see Apache2 Ubuntu Default Page.

	{: .note}
	>
	>If you wish to shut down or remove the Linode from your workspace you can do so through one of the following commands:
	>
	>-	`vagrant halt` will power down the Linode through the shutdown mechanism. You can then run `vagrant up` again to power on the Linode.
	>- 	`vagrant destroy` will remove the Linode entirely from your account, removing anything that was created during the Vagrant up process or added later to the server.

