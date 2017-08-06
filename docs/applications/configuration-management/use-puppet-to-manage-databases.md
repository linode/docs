---
author:
    name: Linode Community
    email: docs@linode.com
description: 'A guide using Puppet to install, deploy, and manage a MySQL server. Example Puppet manifests and configuration files explaining how to manage Puppet using Hiera.'
keywords: 'puppet installation,configuration change management,server automation,mysql,database,hiera'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: Monday, August 14th, 2017
modified: Monday, August 14th, 2017
modified_by:
    name: Linode
title: Install MySQL Using Puppet and Hiera On Ubuntu 16.04
contributor:
  name: Tyler Langlois
  link: https://tjll.net
external_resources:
    - '[Puppet Labs](https://puppetlabs.com/)'
    - '[Puppet Open Source Documentation](https://docs.puppetlabs.com/puppet/)'
---

*This is a Linode Community guide. If you're an expert on something we need a guide on, you too can [get paid to write for us](/docs/contribute).*
----

[Puppet](https://puppetlabs.com/) is a configuration management system that can help simplify the use and deployment of many different types of software, making system administration more reliable and repeatable. In this guide, Puppet will be used to manage an installation of [MySQL](https://www.mysql.com/), a popular relational database used for applications such as [Wordpress](https://www.mysql.com/), Ruby on Rails, and others. [Hiera](https://docs.puppet.com/hiera/) is a powerful method of defining configuration values that will also be used to simplify configuring MySQL.

This guide will walk through the steps of setting up Puppet for use in deploying [modules](https://docs.puppet.com/puppet/latest/modules_fundamentals.html) on your server. At the conclusion of this walkthrough, MySQL will be installed, configured, and ready to use for a wide variety of applications that require a database backend.

{: .note}
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before You Begin

1.  A [Linode 1GB](/pricing) should be sufficient to run MySQL, though you may consider using a larger plan if you plan to use MySQL heavily for more than just a simple personal web site.

2.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

3.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

4.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Puppet

The following steps will set up Puppet for a single, local-only deployment. If you require more than one server or a setup including a Puppet master, considering following [our multi-server Puppet guide](docs/applications/configuration-management/install-and-configure-puppet).

### Package Installation

1.  Install the `puppetlabs-release` repository to gain access to Puppet packages:

        wget https://apt.puppetlabs.com/puppetlabs-release-pc1-xenial.deb
        sudo dpkg -i puppetlabs-release-pc1-xenial.deb

2.  Update the apt package index to make the Puppet Labs repository packages available, then install Puppet itself. This will install the `puppet-agent` package, which provides the `puppet` executable wrapped in a ruby environment ensured to be compatible and tested with Puppet:

        sudo apt update
        sudo apt install puppet-agent=1.10.4-1xenial

3.  Confirm that Puppet is installed and at the expected version.

        puppet --version

    Note that the `puppet-agent` package includes a different version of Puppet, which is expected:

        4.10.4

    Puppet 4.x is used in this guide as it is the most widely used version of Puppet at the time of this writing.

### MySQL Module

The [Puppet Forge](https://forge.puppet.com/) is a collection of _modules_ that can aid in the installation of different types of software. The [MySQL module](https://forge.puppet.com/puppetlabs/mysql) can handle the installation and configuration of MySQL without needing to manage various configuration files and services by hand.

1.  Install the MySQL module:

        sudo -i puppet module install puppetlabs-mysql --version 3.11

### Puppet MySQL Manifest

The actual process of instructing Puppet to install and configure software can happen in a few different ways, including communicating with a Puppet master or by applying a manifest file. In this tutorial, a simple manifest will be used.

While the entirety of a Puppet _manifest_ can contain the desired configuration for a host, values for Puppet _classes_ or _types_ can also be defined in a Hiera configuration file, which greatly simplifies writing Puppet manifests in most use cases. In this exercise, the `mysql::server` class parameters will be defined in Hiera, but the class must first be applied our host.

To apply the `mysql::server` class by to all hosts by default, create the following Puppet manifest:

{: .file}
/etc/puppetlabs/code/environments/production/manifests/site.pp
:   ~~~ pp
    include ::mysql::server
    ~~~

Note that `site.pp` is the default manifest file, and without a qualifying `node { .. }` line, this applies the class to any host applying the manifest. Puppet now knows to apply the `mysql::server` class, but still needs values for resources like databases, users, and other settings. Hiera can provide these values.

## Hiera

To understand how Hiera works in the following examples, consider the default `hiera.yaml` file that is included with the installation of Puppet (the first part of the file is reproduced here):

:   ~~~ yaml
    ---
    :backends:
      - yaml
    :hierarchy:
      - "nodes/%{::trusted.certname}"
      - common
   ~~~

This Hiera configuration instructs Puppet to accept variable values from `nodes/%{::trusted.certname}.yaml` (for example, if your machine's hostname is `ubuntu`, you could define a file called `nodes/ubuntu.yaml`). Any variables found in yaml files _higher_ in the hierarchy are preferred, while any variable names that do not exist in those files will fall-through to files _lower_ in the hierarchy (in this example, `common.yaml`).

The following configuration will define Puppet variables in `common.yaml` to inject variables into the `mysql::server` class.

### Initial Hiera Configuration

Hiera configuraiton files are formatted as yaml, with keys defining which Puppet parameters to inject their associated values into. To get started, consider how to set the MySQL root password. The following Puppet manifest is one way to control this password (there is no need to create this file anywhere, it only serves to illustrate an example):

:   ~~~ pp
    class { '::mysql::server':
      root_password => 'strongpassword',
    }
    ~~~

But we can also define the root Password with the following Hiera configuration file. Create the following yaml file and note how the `root_password` parameter is defined as Hiera yaml:

{: .file}
/etc/puppetlabs/code/environments/production/hieradata/common.yaml
:   ~~~ yaml
    mysql::server::root_password: strongpassword
    ~~~

You should replace `strongpassword` with a secure password of your choice. Now perform an initial Puppet run, which will set up MySQL with default settings and with the root password set as the chosen value.

    sudo -i puppet apply /etc/puppetlabs/code/environments/production/manifests/site.pp

Puppet will output its progress before completing. To confirm MySQL has been configured properly, attempt to run a some simple SQL:

    mysql -u root -p -e 'select version();'

Enter the password (in this tutorial's example, "strongpassword") and MySQL should return its version:

    +-------------------------+
    | version()               |
    +-------------------------+
    | 5.7.19-0ubuntu0.16.04.1 |
    +-------------------------+

### Defining MySQL Resources

Using hiera, we can define the rest of the MySQL configuration entirely in yaml. The following steps will create a database and user suitable for use in a Wordpress installation.

To begin, create the necesssary pre-hashed MySQL password with the command:

    mysql -u root -p -NBe 'select password("wordpresspassword")'

Again, replace the password in this example with a password of your choosing (this command will ask for a pasword to authenticate against the MySQL server, use the first root password chosen previously to authenticate). Make note of the string the command returns. It will be in the format of a hash prefixed with `*` similar to the following:

    *E62D3F829F44A91CC231C76347712772B3B9DABC

With the precomputed MySQL password hash ready, Hiera values can be defined. The following yaml defines parameters to create a database called `wordpress` and a user named `wpuser` that has permission to connect from localhost. The yaml also defines a `GRANT` allowing `wpuser` to operate on the `wordpress` database will `ALL` permissions:

{: .file}
/etc/puppetlabs/code/environments/production/hieradata/common.yaml
:   ~~~ yaml
    mysql::server::root_password: strongpassword
    mysql::server::databases:
      wordpress:
        ensure: present
    mysql::server::users:
      wpuser@localhost:
        ensure: present
        password_hash: '*E62D3F829F44A91CC231C76347712772B3B9DABC'
    mysql::server::grants:
      wpuser@localhost/wordpress.*:
        ensure: present
        privileges: ALL
        table: wordpress.*
        user: wpuser@localhost
    ~~~

With the Hiera yaml defined, re-run the Puppet manifest:

    sudo -i puppet apply /etc/puppetlabs/code/environments/production/manifests/site.pp

The `wpuser` should now be able to connect with rights to the `wordpress` database. Verify this by connecting to the MySQL daemon as the user `wpuser` to the `wordpress` database:

    mysql -u wpuser -p wordpress

After entering the chosen password for `wpuser`, a MySQL prompt should become available (press `Ctrl-D` to exit this prompt).

### Adding Hierarchies

Additional configurations can be added that will only be applied to specific environments. For example, backup jobs may only be applied for hosts in a certain region, or specific databases can be created in a particular deployment.

In the following example, Puppet will configure the MySQL server with one additional database, *but only if that server's distribution is Debian-based*.

To begin, modify `hiera.yaml` to contain the following:

{: .file}
/etc/puppetlabs/puppet/hiera.yaml
:   ~~~ yaml
    ---
    :backends:
      - yaml
    :hierarchy:
      - "%{facts.os.family}"
      - common
    ~~~

This change instructs Hiera to look for Puppet parameters first in `"%{facts.os.family}.yaml"` and then in `common.yaml`. The first, fact-based element of the hierarchy is dynamic and dependent upon the host that Puppet and Hiera are controlling. In this Ubuntu-based example, Hiera will look for `Debian.yaml`, while on a distribution such as CentOS, the file `RedHat.yaml` will automatically be referenced instead.

Now create the following yaml file:

{: .file}
/etc/puppetlabs/code/environments/production/hieradata/Debian.yaml
:   ~~~ yaml
    lookup_options:
      mysql::server::databases:
        merge: deep

    mysql::server::databases:
      ubuntu-backup:
        ensure: present
    ~~~

Though similar to the `common.yaml` file defined in previous steps, this file will add the `ubuntu-backup` database _only_ on Debian-based hosts (which Ubuntu is). In addition, the `lookup_options` setting ensures that the `mysql::server:databases` parameter is _merged_ between `Debian.yaml` and `common.yaml` so that all databases are managed. Without `lookup_options` set to deeply merge these hashes, only the _most specific_ hierarchy file (in this case, `Debian.yaml`) will be applied to the host.

Run Puppet once again and observe the changes:

    sudo -i puppet apply -e 'include ::mysql::server'

Another database should be created. Run some simple SQL verifying that the database is present:

    mysql -u root -p -e 'show databases;'

Which should return:

    +---------------------+
    | Database            |
    +---------------------+
    | information_schema  |
    | mysql               |
    | performance_schema  |
    | sys                 |
    | ubuntu-backup       |
    | wordpress           |
    +---------------------+

Congratulations! You can now control your Puppet configuration via highly configurable Hiera definitions.

## Further Reading

The Puppet ecosystem contains a wide array of tools and libraries. To learn more about the topics covered in this tutorial, consider the following pages:

- [Hiera's documentation](https://docs.puppet.com/hiera/) explains additional concepts regarding how to best use it in conjunction with Puppet.
- [Facter](https://docs.puppet.com/facter/) is the tool used to determine "facts" such as the operating system family used earlier.
- [The Puppet Forge](https://forge.puppet.com/) contains a wide variety of modules for many different types of software.
