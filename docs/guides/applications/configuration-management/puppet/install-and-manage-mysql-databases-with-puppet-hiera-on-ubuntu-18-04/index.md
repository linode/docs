---
slug: install-and-manage-mysql-databases-with-puppet-hiera-on-ubuntu-18-04
description: "Use this guide to install Puppet with MySQL modules and Puppet Hiera configuration manifests to manage MySQL in a variety of environments on Ubuntu 18.04."
keywords: ["puppet installation", "configuration change management", "server automation", "mysql", "database", "hiera"]
tags: ["database","ubuntu","automation","mysql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-01-15
modified: 2019-01-15
modified_by:
    name: Linode
title: "Manage MySQL Database with Puppet Hiera on Ubuntu 18.04"
external_resources:
  - '[Puppet Labs](https://puppet.com/)'
  - '[Puppet Open Source Documentation](https://puppet.com/docs/open-source-puppet/)'
  - '[The Puppet Forge](https://forge.puppet.com/)'
  - '[Hiera documentation](https://docs.puppet.com/hiera/)'
  - '[Facter](https://puppet.com/docs/puppet/7/facter.html)'
relations:
    platform:
        key: install-puppet-mysql-hiera
        keywords:
            - distribution: Ubuntu 18.04
aliases: ['/applications/configuration-management/puppet/install-and-manage-mysql-databases-with-puppet-hiera-on-ubuntu-18-04/','/applications/configuration-management/install-and-manage-mysql-databases-with-puppet-hiera-on-ubuntu-18-04/']
authors: ["Linode"]
---

[Puppet](https://puppet.com/) is a configuration management system that helps simplify the use and deployment of different types of software, making system administration more reliable and replicable. In this guide, we use Puppet to manage an installation of [MySQL](https://www.mysql.com/), a popular relational database used for applications such as WordPress, Ruby on Rails, and others. [Hiera](https://docs.puppet.com/hiera/) is a method of defining configuration values that Puppet will use to simplify MySQL configuration.

In this guide, you'll use Puppet to deploy [modules](https://docs.puppet.com/puppet/latest/modules_fundamentals.html) on your server. At the end, you will have MySQL installed, configured, and ready to use for a variety of applications that require a database backend.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

## Install and Configure Puppet

Follow these steps to set up Puppet for single-host, local-only deployment. If you need to configure more than one server or to deploy a Puppet master, follow our [multi-server Puppet guide](/docs/guides/install-and-configure-puppet/).

### Install the Puppet Package

1.  Install the `puppetlabs-release-bionic` repository to add the Puppet packages:

        wget https://apt.puppet.com/puppet-release-bionic.deb
        sudo dpkg -i puppet-release-bionic.deb

2.  Update the apt package index to make the Puppet Labs repository packages available, then install Puppet. This will install the `puppet-agent` package, which provides the `puppet` executable within in a compatible Ruby environment:

        sudo apt update && sudo apt install puppet-agent

3.  Confirm the version of Puppet installed:

        puppet --version

    At the time of writing, the Puppet version is `6.1.0`.

### Install the Puppet MySQL Module

[Puppet Forge](https://forge.puppet.com/) is a collection of _modules_ that aid in the installation of different types of software. The [MySQL module](https://forge.puppet.com/puppetlabs/mysql) handles the installation and configuration of MySQL without you needing to manage various configuration files and services by hand.

1.  Install the MySQL module:

        sudo puppet module install puppetlabs-mysql --version 7.0.0

    This will install the `mysql` module into the default path: `/etc/puppetlabs/code/environments/production/modules/`.

### Puppet MySQL Manifest

This guide uses a Puppet *manifest* to provide Puppet with installation and configuration instructions. Alternatively, you can configure [a Puppet master](/docs/guides/install-and-configure-puppet/).

While the entirety of a Puppet *manifest* can contain the desired configuration for a host, values for Puppet *classes* or *types* can also be defined in a Hiera configuration file to simplify writing Puppet manifests in most cases. In this example, the `mysql::server` class parameters will be defined in Hiera, but the class must first be applied to the host.

To apply the `mysql::server` class to all hosts by default, create the following Puppet manifest:

{{< file "/etc/puppetlabs/code/environments/production/manifests/site.pp" puppet >}}
include ::mysql::server
{{< /file >}}


Note that `site.pp` is the default manifest file. Without a qualifying `node { .. }` line, this applies the class to any host applying the manifest. Puppet now knows to apply the `mysql::server` class, but still needs values for resources like databases, users, and other settings. Configure Hiera to provide these values in the next section.

## Install and Configure Puppet Hiera

To understand how Hiera works, consider this excerpt from the default `hiera.yaml` file:

{{< file "/etc/puppetlabs/code/environments/production/hiera.yaml" yaml >}}
---
version: 5
hierarchy:
  - name: "Per-node data"
    path: "nodes/%{::trusted.certname}.yaml"
  - name: "Common data"
    path: "common.yaml"
{{< /file >}}


This Hiera configuration instructs Puppet to accept variable values from `nodes/%{::trusted.certname}.yaml`. If your Linode's hostname is `examplehostname`, define a file called `nodes/examplehostname.yaml`). Any variables found in YAML files higher in the hierarchy are preferred, while any variable names that do not exist in those files will fall-through to files lower in the hierarchy (in this example, `common.yaml`).

The following configuration will define Puppet variables in `common.yaml` to inject variables into the `mysql::server` class.

### Initial Hiera Configuration

Hiera configuration files are formatted as yaml, with keys defining the Puppet parameters to inject their associated values. To get started,  set the MySQL root password. The following example of a Puppet manifest is one way to control this password:

{{< file "example.pp" >}}
class { '::mysql::server':
  root_password => 'examplepassword',
}
{{< /file >}}

We can also define the root password with the following Hiera configuration file. Create the following YAML file and note how the `root_password` parameter is defined as Hiera yaml:

{{< file "/etc/puppetlabs/code/environments/production/data/common.yaml" >}}
mysql::server::root_password: examplepassword
{{< /file >}}

Replace `examplepassword` with the secure password of your choice. Run Puppet to set up MySQL with default settings and the chosen root password:

    sudo -i puppet apply /etc/puppetlabs/code/environments/production/manifests/site.pp

Puppet will output its progress before completing. To confirm MySQL has been configured properly, run a command:

    mysql -u root -p -e 'select version();'

Enter the password and MySQL returns its version:

    +-------------------------+
    | version()               |
    +-------------------------+
    | 5.7.24-0ubuntu0.18.04.1 |
    +-------------------------+

### Define MySQL Resources

Using Hiera, we can define the rest of the MySQL configuration entirely in yaml. The following steps will create a database and user for use in a WordPress installation.

1.  Create a pre-hashed MySQL password. Replace the password `wordpresspassword` in this example, and when prompted for a the root MySQL password, use the first root password chosen in the previous section to authenticate. Note the string starting with a `*` that the command returns for Step 2:

        mysql -u root -p -NBe 'select password("wordpresspassword")'
        *E62D3F829F44A91CC231C76347712772B3B9DABC

2.  With the MySQL password hash ready, we can define Hiera values. The following YAML defines parameters to create a database called `wordpress` and a user named `wpuser` that has permission to connect from `localhost`. The YAML also defines a `GRANT` allowing `wpuser` to operate on the `wordpress` database with `ALL` permissions:

    {{< file "/etc/puppetlabs/code/environments/production/data/common.yaml" yaml >}}
mysql::server::root_password: examplepassword
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

{{< /file >}}


1.  Re-run Puppet:

        sudo -i puppet apply /etc/puppetlabs/code/environments/production/manifests/site.pp

2.  The `wpuser` should now be able to connect to the `wordpress` database. To verify, connect to the MySQL daemon as the user `wpuser` to the `wordpress` database:

        mysql -u wpuser -p wordpress

    After you enter the password for `wpuser`, exit the MySQL prompt:

        exit

### Add Hierarchies for Specific Environments

Additional configurations can be added that will only be applied to specific environments. For example, backup jobs may only be applied for hosts in a certain region, or specific databases can be created in a particular deployment.

In the following example, Puppet will configure the MySQL server with one additional database, but only if that server's distribution is Debian-based.

1.  Modify `hiera.yaml` to contain the following:

    {{< file "/etc/puppetlabs/code/environments/production/hiera.yaml" yaml >}}
---
version: 5
hierarchy:
  - name: "Per OS Family"
    path: "os/%{facts.os.family}.yaml"
  - name: "Other YAML hierarchy levels"
    paths:
      - "common.yaml"
{{< /file >}}


    This change instructs Hiera to look for Puppet parameters first in `"os/%{facts.os.family}.yaml"` and then in `common.yaml`. The first, fact-based element of the hierarchy is dynamic, and dependent upon the host that Puppet and Hiera control. In this Ubuntu-based example, Hiera will look for `Debian.yaml` in the `os` folder, while on a distribution such as CentOS, the file `RedHat.yaml` will automatically be referenced instead.

1.  Create the following YAML file:

    {{< file "/etc/puppetlabs/code/environments/production/data/os/Debian.yaml" yaml >}}
lookup_options:
  mysql::server::databases:
    merge: deep

mysql::server::databases:
  ubuntu-backup:
    ensure: present

{{< /file >}}


    Though similar to the `common.yaml` file defined in previous steps, this file will add the `ubuntu-backup` database *only* on Debian-based hosts (like Ubuntu). In addition, the `lookup_options` setting ensures that the `mysql::server:databases` parameter is *merged* between `Debian.yaml` and `common.yaml` so that all databases are managed. Without `lookup_options` set to deeply merge these hashes, only the most specific hierarchy file will be applied to the host, in this case, `Debian.yaml`.

    *  Alternatively, because our Puppet manifest is short, we can test the same command using the `-e` flag to apply an inline manifest:

            sudo -i puppet apply -e 'include ::mysql::server'

3.  Run Puppet and observe the changes:

        sudo -i puppet apply /etc/puppetlabs/code/environments/production/manifests/site.pp

4.  Verify that the new database exists:

        mysql -u root -p -e 'show databases;'

    This includes the new `ubuntu-backup` database:

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
