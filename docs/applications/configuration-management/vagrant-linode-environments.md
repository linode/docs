---
author:
    name: Elle Krout
    email: ekrout@linode.com
description: 'Use Vagrant to manage development environments and content on Linode.'
keywords: ["linode", "vagrant", "content management", "management", "automation", "development", "ruby", "vagrantfile", "api", "apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-06-25
modified_by:
    name: Elle Krout
published: 2015-06-25
title: 'Using Vagrant to Manage Linode Environments'
external_resources:
 - '[Vagrant](http://www.vagrantup.com)'
 - '[vagrant-linode Plugin](https://github.com/displague/vagrant-linode)'
---

[Vagrant](http://www.vagrantup.com) is a configuration management tool that allows users to create portable and reproducible work environments. Vagrant excels at providing consistent, easy-to-configure servers that can be used to keep development environments consistent across all users. It is easy to both launch and tear down, and can be supplied to any part of a development team that may need an environment but does not have the means to configure one themselves. Often paired with providers such as Puppet, Salt, and Chef, it offers an easy solution to keeping a consistent workflow.

Vagrant can be paired with Linode through the use of the *vagrant-linode* plugin to spawn and destroy Linode servers as needed. This guide will provide instructions on installing Vagrant, configuring the vagrant-linode plugin, and setting up a basic Apache server for testing.

## Prerequisites

1.  [Install Vagrant](https://www.vagrantup.com/downloads.html) on your local computer or other workspace.

2.  Generate an API Key. This will be used to create Linodes based upon your Vagrant profile:

    -   Log in to the Linode Manager and select **my profile** to the upper right.

    -   Select the API Keys tab:

        [![Linode API](/docs/assets/linode-api-vagrant1-small.png)](/docs/assets/linode-api-vagrant1.png)

    -   Enter a label for your API Key and set an expiration time. Then click **Create API Key**.

    -   Your API Key will be output in a green box. **The key will only be shown once** so be sure to record it for later use:

        [![Linode API Key Generated](/docs/assets/linode-api-vagrant2-small.png)](/docs/assets/linode-api-vagrant2.png)


## Install the vagrant-linode Plugin

1.  From your workspace, create a directory for your project, and move into that directory:

        mkdir ~/vagrant-linode
        cd vagrant-linode

2.  Install the plugin:

        vagrant plugin install vagrant-linode

    {{< note >}}
If using a Mac, it may request to install development tools. Select yes, then re-run the command.
{{< /note >}}

3.  From the `vagrant-linode` directory, create the Vagrantfile:

        touch Vagrantfile

    The *Vagrantfile* is used to describe, in code, the type of machine that Vagrant will create. It defines everything from the operating system to the users, to any applications that need to be initially installed to make one consistent work environment.

## Configure the Vagrantfile

1.  Open the Vagrantfile in your text editor of choice. In Ruby, define what version of Vagrant you are using. The `2` defines that it is Vagrant 1.1.0 leading up to Vagrant 2.0. `1` is any version of Vagrant below that:

    {{< file "~/vagrant-linode/Vagrantfile" ruby >}}
Vagrant.configure('2') do |config|

end

{{< /file >}}


    All code will take place between the `Vagrant.configure` and `end` lines.

2.  When creating a *guest machine* -- the sever that will be created -- Vagrant will create a username, password, and private key to access the machine. The default username and password is `vagrant`. Define your own parameters for the `username`, and set the pathway to your own private key. If you have not generated a private and public key, you can do so by following the [Securing Your Server](/docs/security/securing-your-server#create-an-authentication-key-pair) guide:

    {{< file "~/vagrant-linode/Vagrantfile" ruby >}}
Vagrant.configure('2') do |config|

  ## SSH Configuration
  config.ssh.username = 'user'
  config.ssh.private_key_path = '~/.ssh/id_rsa'

end

{{< /file >}}


    If you choose to do so, you can also define your own password with the `config.ssh.password` setting.

3.  Define the Linode provider:

    {{< file-excerpt "~/vagrant-linode/Vagrantfile" ruby >}}
Vagrant.configure('2') do |config|

  ...

  # Global Configuration
  config.vm.provider :linode do |provider, override|
    override.vm.box = 'linode'
    override.vm.box_url = "https://github.com/displague/vagrant-linode/raw/master/box/linode.box"
    provider.token = 'API-KEY'
  end

end

{{< /file-excerpt >}}


    Lines 6 defines the provider, and lines 7 and 8 define the *box*. Boxes are packages that include the basic requirements for a Vagrant environment to function. The supplied box is the `linode` box, created as part of the plugin. Replace the `API-KEY` with the key generated [above](#prerequisites).

4.  Choose your Linode's settings:

    {{< file-excerpt "~/vagrant-linode/Vagrantfile" ruby >}}
Vagrant.configure('2') do |config|

  ...

  # Global Configuration
  config.vm.provider :linode do |provider, override|

    ...

    #Linode Settings
    provider.distribution = 'Ubuntu 14.04 LTS'
    provider.datacenter = 'newark'
    provider.plan = '2048'
    provider.label = 'vagrant-ubuntu-lts'

  end

end

{{< /file-excerpt >}}


    In this instance, a 2GB Ubuntu 14.04 LTS Linode is being created in the Newark data center. The `provider.label` is the name that the Linode will show up as in the Linode Manager.

    To see more options regarding the vagrant-linode plugin see the documentation on the plugin's [GitHub repository](https://github.com/displague/vagrant-linode).


## Set Up the Vagrant Box

Although the server can now be created successfully, many aspects of it still need to be configured. Shell scripts will be used to complete the steps from the [Getting Started](/docs/getting-started) guide, and to install and configure Apache. Files will also be synced between the workstation and the Linode.

### Configure the Server

1.  Create a shell script called `setup.sh` to configure the Linode's hostname, set the proper timezone, and update the server. Replace `vagranttest` with your chosen hostname, and `EST` with your timezone.

    {{< file "~/vagrant-linode/setup.sh" shell >}}
#!/bin/bash
echo "vagranttest" > /etc/hostname
hostname -F /etc/hostname
ip=$(ip addr show eth0 | grep -Po 'inet \K[\d.]+')
echo "$ip   $ip hostname" >> /etc/hosts
ln -sf /usr/share/zoneinfo/EST /etc/localtime
apt-get update && apt-get upgrade -y

{{< /file >}}


    * Lines 2 and 3 define the hostname.

    * Line 4 sets the variable `ip` to the Linode's IP address -- since we will not know IP address until Vagrant launches the Linode.

    * Line 5 inserts the IP address into the `/etc/hosts` file to define the fully-qualified domain name.

     * Line 6 sets the timezone, and the final line updates the server and server packages.

2.  Within the Vagrantfile, call to the shell script you just created by adding the `config.vm.provision` method:

    {{< file-excerpt "~/vagrant-linode/Vagrantfile" ruby >}}
Vagrant.configure('2') do |config|

...

  # Shell Scripts
  config.vm.provision :shell, path: "setup.sh"

end

{{< /file-excerpt >}}


### Install Apache and Sync Files

1.  Create an installation script for Apache called `apache.sh`, and add the following:

    {{< file "~/vagrant-linode/apache.sh" shell >}}
#!/bin/bash
apt-get install apache2 -y
mv /etc/apache2/ports.conf /etc/apache2/ports.conf.backup
mv /etc/apache2/ports1.conf /etc/apache2/ports.conf
a2dissite 000-default.conf
a2ensite vhost.conf
service apache2 reload

{{< /file >}}


    * Line 2 installs Apache.

    * Lines 3 & 4 create a backup of the `ports.conf` file and replaces it with a file created below.

    * Lines 5 & 6 disable the default host file and enable the one we will create below. Apache is then reloaded to take the configuration changes.

2.  Add the shell script provisioner method to your Vagrantfile, under the line that references `setup.sh`:

    {{< file-excerpt "~/vagrant-linode/Vagrantfile" ruby >}}
Vagrant.configure('2') do |config|

...

  # Shell Scripts
  config.vm.provision :shell, path: "setup.sh"
  config.vm.provision :shell, path: "apache.sh"

end

{{< /file-excerpt >}}


3.  Create a new directory for Apache configuration files:

        mkdir apache2

4.  Because Vagrant is often used for development environments, we want to host Apache on a port other than 80. Create `ports1.conf`, as referenced in the shell script above. The port will be set to **6789**:

    {{< file "~/vagrant-linode/apache2/ports1.conf" aconf >}}
Listen 6789

<IfModule ssl_module>
        Listen 443
</IfModule>

<IfModule mod_gnutls.c>
        Listen 443
</IfModule>

{{< /file >}}


5.  Create a new directory under `apache2` called `sites-available`. Add a VirtualHosts file, `vhost.conf`, to this new directory:

        mkdir sites-available

    {{< file "~/vagrant-linode/apache2/sites-available/vhost.conf" aconf >}}
<VirtualHost *:6789>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html
        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

{{< /file >}}


6.  Return to the Vagrantfile, and use the `config.vm.synced_folder` method to sync the local directories with directories on the server:

    {{< file-excerpt "~/vagrant-linode/Vagrantfile" ruby >}}
Vagrant.configure('2') do |config|

  ...

  # Synced Folders
  config.vm.synced_folder '.', '/vagrant', disabled: true
  config.vm.synced_folder './apache2', '/etc/apache2', disabled: false
  config.vm.synced_folder './webfiles', '/var/www/html'

end

{{< /file-excerpt >}}


    * Line 5 disables syncing for the root folders.

    * Line 6 defines the locally-hosted `apache2` folder (`'./apache2'`) and links it to the `/etc/apache2` directory on the Linode. `disabled: false` ensures that it will sync.
    * Line 7 does the same with a yet-to-be-created `./webfiles` directory that can be used to add any website files before booting the instance.


7.  Create the `webfiles` folder in your `vagrant-linode` directory:

        mkdir ~/vagrant-linode/webfiles

    Add to this directory any files you want the Linode to serve over HTTP.

## Boot an Instance

With the Vagrantfile configured, and scripts and files created, it's now time to create the guest machine and check that it's running properly.

1.  From your workstation, boot the instance:

        vagrant up

    It will run through the installation process, sync the directories, and run the shell scripts.

2.  Log into the newly-created Linode:

        vagrant ssh

3.  To ensure that Apache is running properly, check the status:

        service apache2 status

    It should output:

         * apache2 is running

4.  To see that the environment is accesible online, check for the IP address:

        hostname -i

    Then go to your chosen web browser and navigate to your ip address with `:6789` appended to the end. You should see Apache2 Ubuntu Default Page.

    {{< note >}}
If you wish to shut down or remove the Linode from your workspace you can do so through one of the following commands:

-  `vagrant halt` will power down the Linode through the shutdown mechanism. You can then run `vagrant up` again to power on the Linode.
-  `vagrant destroy` will remove the Linode entirely from your account, removing anything that was created during the Vagrant up process or added later to the server.
{{< /note >}}

