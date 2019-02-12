---
author:
    name: Linode
description: 'Learn how to efficiently use Puppet modules to manage files and services, create templates, and store data in Hiera in this simple tutorial.'
keywords: ["puppet", "automation", "lamp", "configuration management"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/puppet/create-puppet-module/','applications/configuration-management/create-puppet-module/']
modified: 2019-01-25
modified_by:
    name: Linode
published: 2019-01-25
title: Use Puppet Modules to Create a LAMP Stack
---

![Use Puppet Modules to Create a LAMP Stack](Use_Puppet_Modules_to_Create_a_LAMP_Stack_smg.jpg)

Puppet modules are the building blocks of your Puppet managed servers. Modules install and configure packages, create directories, and generate any other server changes that the user includes in the module. A Puppet module aims to perform all parts of a certain task, such as downloading the Apache package, configuring all files, changing the MPM data, and setting up virtual hosts.

In this guide, you will create an Apache and a PHP module. A MySQL module will be adapted from the Puppet Lab's MySQL module found on the [Puppet Forge](https://forge.puppet.com/). These steps will create a full LAMP stack on your server and provide an overview of the various ways modules can be utilized.

## Before You Begin

Set up a Puppet Master (Ubuntu 18.04) and two Puppet agents (Ubuntu 18.04 and CentOS 7) by following the steps in the [Getting Started with Puppet - Basic Installation and Setup](/docs/applications/configuration-management/getting-started-with-puppet-6-1-basic-installation-and-setup) guide.

## Create the Apache Module

Modules are composed of classes that represent various tasks and that improve the module's readability for any future users. These classes are stored within manifest files (ending in the `.pp` extension) that are located within specific directories inside the module.

1.  From the Puppet Master, navigate to Puppet's module directory and create the `apache` directory:

        cd /etc/puppetlabs/code/environments/production/modules/
        sudo mkdir apache

1.  From within the `apache` directory, create `manifests`, `templates`, `files`, and `examples` directories:

        cd apache
        sudo mkdir {manifests,templates,files,examples}

1.  Navigate to the `manifests` directory:

        cd manifests

    Your module's classes are stored in the `manifests` directory. The manifests and classes that will be created for our example module include:

    -   An `init.pp` manifest that contains the *main* class for the module. This module will download the Apache package and enable the service.
    -   A `params.pp` manifest that defines variables and parameters.
    -   A `config.pp` file that configuration files for the Apache service itself.
    -   A `vhosts.pp` file that defines the virtual hosts.

### Create the Initial Apache Class and Parameters

1.  From within `/etc/puppetlabs/code/environments/production/modules/apache/manifests`, create an `init.pp` file to hold the module's main `apache` class. This class should share its name with the module's name. This file will be used to install the Apache package. Since Ubuntu 18.04 and CentOS 7 use different package names for Apache, a variable will be used:

    {{< file "production/modules/apache/manifests/init.pp" puppet >}}
class apache {

  package { 'apache':
    name    => $apachename,
    ensure  => present,
  }

  service { 'apache-service':
    name          => $apachename,
    hasrestart    => true,
    enable => true,
    ensure => running,
  }

}
{{< /file >}}

    The [`package` resource](https://puppet.com/docs/puppet/6.2/types/package.html) is used to add, remove, or ensure a package is present. In most cases, the name of the resource (`apache`, above) should be the name of the package being managed. Because of the difference in naming conventions, however, this resource is simply called `apache`, while the actual *name* of the package is called upon with the `name` reference. `name`, in this instance, calls for the yet-undefined variable `$apachename`. The `ensure` reference ensures that the package is `present`.

    The [`service` resource](https://puppet.com/docs/puppet/6.2/types/service.html) is used to run, stop, restart, enable, and disable services. The `service` resource in this example will also accept the `$apachename` variable to determine which service should be managed.

1.  Create a `params.pp` in the same directory as `init.pp` and add the following code:

    {{< file "production/modules/apache/manifests/params.pp" puppet >}}
class apache::params {

  if $::osfamily == 'RedHat' {
    $apachename   = 'httpd'
  }
  elsif $::osfamily == 'Debian' {
      $apachename   = 'apache2'
  }
  else {
    fail ( 'this is not a supported distro.')
  }

}

{{< /file >}}

    Outside of the original `init.pp` class, each class name needs to branch off of `apache`. As such, this class is called `apache::params`. The name after the double colon should share a name with the file.

    An `if` statement is used to define the parameters, pulling from information provided by [Facter](https://puppetlabs.com/facter), which is already installed on the Puppet master. In this case, Facter will be used to pull down the operating system family (`osfamily`) to discern if it is Red Hat or Debian-based.

1.  With the parameters defined, we need to call the `params.pp` file and add the parameters into `init.pp`. To do this, the parameters need to be added inside a set of parentheses after the class name, but before the opening curly bracket (`{`):

    {{< file "production/modules/apache/manifests/init.pp" puppet >}}
class apache (
  $apachename   = $::apache::params::apachename,
) inherits ::apache::params {

{{< /file >}}

    The value string `$::apache::params::value` tells Puppet to pull the values from the `apache` module's `params` class, followed by the parameter name. The fragment `inherits ::apache::params` allows for `init.pp` to inherit these values.


### Manage Configuration Files

The Apache configuration file will be different depending on whether you are working on a Red Hat- or Debian-based system. These can be viewed here: [httpd.conf (Red Hat)](httpd.conf), [apache2.conf (Debian)](apache2.conf).

1.  Copy the example `httpd.conf` and `apache2.conf` files provided above to the `files` directory located at `/etc/puppetlabs/code/environments/production/modules/apache/files`.

    {{< note >}}
A comment was included at the top of these configuration files:

{{< file >}}
# This file is managed by Puppet
{{< /file >}}

If someone were to log in to a Puppet node and then open this file, the comment would let them know that it should not be edited directly.
{{< /note >}}

1.  Open the `params.pp` file and define two new variables: `$conffile` and `$confsource`. These will map to the correct configuration file locations based on a node's distribution:

    {{< file "production/modules/apache/manifests/params.pp" puppet >}}
class apache::params {

  if $::osfamily == 'RedHat' {
    # ...
    $conffile     = '/etc/httpd/conf/httpd.conf'
    $confsource   = 'puppet:///modules/apache/httpd.conf'
  }
  elsif $::osfamily == 'Debian' {
    # ...
    $conffile     = '/etc/apache2/apache2.conf'
    $confsource   = 'puppet:///modules/apache/apache2.conf'
  }
  else {
    # ...
  }

}
{{< /file >}}

    {{< note >}}
Compare your file with the [completed `params.pp`](params.pp).
{{< /note >}}

1.  Open `init.pp`. Update the list of class parameters at the top to include your new `$conffile` and `$confsource` variables, and insert the `file` resource between the `package` and `service` resources:

    {{< file "production/modules/apache/manifests/init.pp" puppet >}}
class apache (
  $apachename   = $::apache::params::apachename,
  $conffile   = $::apache::params::conffile,
  $confsource = $::apache::params::confsource,
) inherits ::apache::params {

  package { 'apache':
    # ...
  }

  file { 'configuration-file':
    path    => $conffile,
    ensure  => file,
    source  => $confsource,
  }

  service { 'apache-service':
    # ...
  }

}
{{< /file >}}

    The [`file` resource](https://puppet.com/docs/puppet/6.2/types/file.html) manages files on your nodes. This example copies a file from the Puppet master (at the `source` location) to the Puppet node (at the `path` location).

1.  When the configuration file is changed, Apache needs to restart. To automate this, the `service` resource can be used in combination with the `notify` relationship. This will tell the `service` resource to refresh/restart whenever the configuration file is changed. Insert the `notify` relationship into your `file` resource in `init.pp`:

    {{< file "production/modules/apache/manifests/init.pp" puppet >}}
class apache (
  # ...
) inherits ::apache::params {

  # ...

  file { 'configuration-file':
    # ...
    notify  => Service['apache-service'],
  }

  # ...

}
{{< /file >}}

    {{< note >}}
Compare your file with the [completed `init.pp`](init.pp).
{{< /note >}}

### Create the Virtual Hosts Files

Depending on your system's distribution, Apache's virtual hosts files will be managed differently. Because of this, the code for virtual hosts will be encased in an `if` statement, similar to the one used in the `params.pp` class, but containing actual Puppet resources. This will provide an example of an alternate use of `if` statements within Puppet's code.

1.  From within the `/etc/puppetlabs/code/environments/production/modules/apache/manifests/` directory, create and open a `vhosts.pp` file. Add the skeleton of the `if` statement:

    {{< file "production/modules/apache/manifests/vhosts.pp" puppet >}}
class apache::vhosts {

  if $::osfamily == 'RedHat' {

  } elsif $::osfamily == 'Debian' {

  } else {

  }

}
{{< /file >}}

1.  The location of the virtual hosts file on our CentOS 7 server is `/etc/httpd/conf.d/vhost.conf`. This file will need to be created as a template on the Puppet master. The same needs to be done for the Ubuntu virtual hosts file, which is located at `/etc/apache2/sites-available/example.com.conf`, replacing `example.com` with the server's FQDN.

    Navigate to the `templates` file within the `apache` module (full filesystem path: `/etc/puppetlabs/code/environments/production/modules/apache/templates/`) and create two files for your virtual hosts:

    -   **CentOS 7**

        {{< file "production/modules/apache/templates/vhosts-rh.conf.erb" aconf >}}
<VirtualHost *:80>
    ServerAdmin	<%= @adminemail %>
    ServerName <%= @servername %>
    ServerAlias www.<%= @servername %>
    DocumentRoot /var/www/<%= @servername -%>/public_html/
    ErrorLog /var/www/<%= @servername -%>/logs/error.log
    CustomLog /var/www/<%= @servername -%>/logs/access.log combined
</VirtualHost>
{{< /file >}}

    -   **Ubuntu 18.04**

        {{< file "production/modules/apache/templates/vhosts-deb.conf.erb" aconf >}}
<VirtualHost *:80>
    ServerAdmin	<%= @adminemail %>
    ServerName <%= @servername %>
    ServerAlias www.<%= @servername %>
    DocumentRoot /var/www/<%= @servername -%>/public_html/
    ErrorLog /var/www/<%= @servername -%>/logs/error.log
    CustomLog /var/www/<%= @servername -%>/logs/access.log combined
    <Directory /var/www/<%= @servername -%>/public_html>
        Require all granted
    </Directory>
</VirtualHost>
{{< /file >}}

    Only two variables are used in these files: `adminemail` and `servername`. These will be defined on a node-by-node basis, within the `site.pp` file.

1.  Return to the `vhosts.pp` file. The templates created can now be referenced in the code:

    {{< file "production/modules/apache/manifests/vhosts.pp" puppet >}}
class apache::vhosts {

  if $::osfamily == 'RedHat' {
    file { '/etc/httpd/conf.d/vhost.conf':
      ensure    => file,
      content   => template('apache/vhosts-rh.conf.erb'),
      notify   => Service['apache-service'],
    }
  } elsif $::osfamily == 'Debian' {
    file { "/etc/apache2/sites-available/$servername.conf":
      ensure    => file,
      content   => template('apache/vhosts-deb.conf.erb'),
      notify   => Service['apache-service'],
    }
    file { "/etc/apache2/sites-enabled/$servername.conf":
      ensure    => 'link',
      target    => "/etc/apache2/sites-available/$servername.conf",
      notify   => Service['apache-service'],
    }
  } else {
      fail('This is not a supported distro.')
  }

}
{{< /file >}}

    Both distribution families declare a `file` resource to copy the virtual host configuration from the Puppet master to the node. The Debian family also declares a second `file` resource which creates a symlink from the `sites-enabled` directory to the virtual host in the `sites-available` directory. `notify` relationships are specified for all of these declarations so that Apache will restart when any of these files change.

    {{< note >}}
Values containing variables, such as the name of the Debian file resource above, need to be wrapped in double quotes (`"`). Any variables in single quotes (`'`) are parsed exactly as written and will not pull in a variable.
{{< /note >}}

1.  Both virtual host files reference directories under `/var/www` that do not exist on the Puppet nodes by default. These can be created through the use of the `file` resource, each located within the `if` statement. Add these new directory `file` resources at the top of each `if` clause in your `vhosts.pp`:

    {{< file "production/modules/apache/manifests/vhosts.pp" puppet >}}
class apache::vhosts {

  if $::osfamily == 'RedHat' {
    file { [ "/var/www/$servername",
             "/var/www/$servername/public_html",
             "/var/www/$servername/log", ]:
      ensure    => directory,
    }

    file { '/etc/httpd/conf.d/vhost.conf':
      # ...
    }
  } elsif $::osfamily == 'Debian' {
    file { [ "/var/www/$servername",
             "/var/www/$servername/public_html",
             "/var/www/$servername/logs", ]:
      ensure    => directory,
    }

    file { "/etc/apache2/sites-available/$servername.conf":
      # ...
    }
    # ...
  } else {
    # ...
  }

}
{{< /file >}}

    {{< note >}}
Compare your file with the [completed `vhosts.pp`](vhosts.pp).
{{< /note >}}

### Test and Run the Module

1.  Run the `puppet parser` on all files to ensure the Puppet code does not contain syntax errors:

        cd /etc/puppetlabs/code/environments/production/apache/manifests/
        sudo /opt/puppetlabs/bin/puppet parser validate init.pp params.pp vhosts.pp

    If there are no issues, the parser will return with no output.

1.  Navigate to the `examples` directory within the `apache` module:

        cd /etc/puppetlabs/code/environments/production/modules/apache/examples/

1.  Create an `init.pp` file with the contents of the following snippet. Replace the values for `$servername` and `$adminemail` with your own:

    {{< file "production/modules/apache/examples/init.pp" puppet >}}
$serveremail = 'webmaster@example.com'
$servername = 'example.com'

include apache
include apache::vhosts
{{< /file >}}

1.  Test the module by running `puppet apply` with the `--noop` tag:

        sudo /opt/puppetlabs/bin/puppet apply --noop init.pp

    It should return no errors, and output that it will trigger refreshes from events. To install and configure Apache on the Puppet master, this can be run again without `--noop` , if desired.

1.  Navigate back to the main Puppet directory and then to the main `manifests` folder (**not** the one located in the Apache module):

        cd /etc/puppetlabs/code/environments/production/manifests

    If you are continuing this guide from the [Getting Started with Puppet - Basic Installation and Setup](/docs/applications/configuration-management/getting-started-with-puppet-6-1-basic-installation-and-setup/) guide, you should have a `site.pp` file already created in this directory. If not, create one now.

1.  Open `site.pp` and include the Apache module for each agent node. Also input the variables for the `adminemail` and `servername` parameters.

    -   If you followed the [Getting Started with Puppet - Basic Installation and Setup](/docs/applications/configuration-management/getting-started-with-puppet-6-1-basic-installation-and-setup/) guide, your updated configuration should resemble:

        {{< file "production/manifests/site.pp" puppet >}}
node default {

}

node 'puppet.example.com' {
  # ...
}

node 'puppet-agent-ubuntu.example.com' {
  $adminemail = 'webmaster@example.com'
  $servername = 'hostname.example.com'

  include accounts
  include apache
  include apache::vhosts

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
  $adminemail = 'webmaster@example.com'
  $servername = 'hostname.example.com'

  include accounts
  include apache
  include apache::vhosts

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

    -   If you did not follow [Getting Started with Puppet - Basic Installation and Setup](/docs/applications/configuration-management/getting-started-with-puppet-6-1-basic-installation-and-setup/), then your new `site.pp` file should resemble:

        {{< file "production/manifests/site.pp" puppet >}}
node default {

}

node 'puppet-agent-ubuntu.example.com' {
  $adminemail = 'webmaster@example.com'
  $servername = 'hostname.example.com'

  include apache
  include apache::vhosts
}

node 'puppet-agent-centos.example.com' {
  $adminemail = 'webmaster@example.com'
  $servername = 'hostname.example.com'

  include apache
  include apache::vhosts
}
{{</ file >}}

1.  By default, the Puppet agent service on your managed nodes will automatically check with the master once every 30 minutes and apply any new configurations from the master. You can also manually invoke the Puppet agent process in-between automatic agent runs. To manually apply the new module to your agent nodes, **log in to the nodes** and run:

        sudo /opt/puppetlabs/bin/puppet agent -t

## Using the MySQL Module

Many modules needed to run a server already exist within Puppet Labs' [Puppet Forge](https://forge.puppetlabs.com). These can be configured just as extensively as a module that you created and can save time since the module need not be created from scratch.

Ensure you are in the `/etc/puppetlabs/code/environments/production/modules` directory and install the [Puppet Forge's MySQL module](https://forge.puppetlabs.com/puppetlabs/mysql) by PuppetLabs. This will also install any prerequisite modules.

    cd /etc/puppetlabs/code/environments/production/modules
    sudo /opt/puppetlabs/bin/puppet module install puppetlabs-mysql

### Use Hiera to Create Databases

[Puppet Hiera](https://puppet.com/docs/puppet/6.2/hiera_intro.html) is used to store data that you don't want to include in your Puppet classes. This can be sensitive data like passwords, or it can be non-sensitive but site-specific information. Refactoring site-specific information into Hiera can make your Puppet code more reusable.

This example will store the root password for MySQL in Hiera:

1.  Navigate to `/etc/puppetlabs/code/environments/production/` and create Hiera's configuration file `hiera.yaml`. You will use Hiera's default values:

    {{< file "production/hiera.yaml" yaml >}}
---
version: 5
hierarchy:
  - name: Common
    path: common.yaml
defaults:
  data_hash: yaml_data
  datadir: data

{{< /file >}}

1.  Create the file `common.yaml`. It will be used to define the default `root` password for MySQL. Enter your own complex and unique password in this file:

    {{< file "production/common.yaml" yaml >}}
mysql::server::root_password: 'password'
{{< /file >}}

    The `common.yaml` file is used when a variable is not defined elsewhere. This means all servers will share the same MySQL root password. These passwords can also be hashed to increase security.

1.  To use the MySQL module's defaults you can simply add an `include '::mysql::server'` line to the `site.pp` file. However, in this example, you will override some of the module's defaults to create a database for each of your nodes.

    Edit `site.pp` with the following new declarations. Set your own values for the `user`, `password`, and `dbname` options in the `mysql::db` declaration in each node:

    {{< file "production/site.pp" puppet >}}
# ...

node 'puppet-agent-ubuntu.example.com' {
  # ...

  include apache
  include apache::vhosts

  include mysql::server

  mysql::db { "mydb_${fqdn}":
    user     => 'myuser',
    password => 'mypass',
    dbname   => 'mydb',
    host     => 'localhost',
    grant    => ['SELECT', 'UPDATE'],
    tag      => $domain,
  }

  # ...
}

node 'puppet-agent-centos.example.com' {
  # ...

  include apache
  include apache::vhosts

  include mysql::server

  mysql::db { "mydb_${fqdn}":
    user     => 'myuser',
    password => 'mypass',
    dbname   => 'mydb',
    host     => 'localhost',
    grant    => ['SELECT', 'UPDATE'],
    tag      => $domain,
  }

  # ...
}
{{</ file >}}

    {{< note >}}
You can also set values for your database's `user`, `password`, and `dbname` in Hiera. Review [Install and Manage MySQL Databases with Puppet Hiera on Ubuntu 18.04](/docs/applications/configuration-management/install-and-manage-mysql-databases-with-puppet-hiera-on-ubuntu-18-04/) for more information on this subject.
{{< /note >}}

1.  As before, you can run these updates manually on each node. **Log into each node** via SSH and run:

        sudo /opt/puppetlabs/bin/puppet agent -t

## Create the PHP Module

1.  Create the `php` directory in the `/etc/puppetlabs/code/environments/production/modules` path:

        cd /etc/puppetlabs/code/environments/production/modules
        sudo mkdir php

1.  Generate the `files`, `manifests`, `templates`, and `examples` directories that constitute your module's structure:

        cd php
        sudo mkdir {files,manifests,examples,templates}

1.  Create the new module's `init.pp` inside its `manifests` directory. This file will use the `package` resource to install PHP. Two packages will be installed: The PHP package and the PHP extension and application repository:

    {{< file "production/modules/php/manifests/init.pp" puppet >}}
class php {

  package { 'php':
    ensure => present,
  }

  package { 'php-pear':
    ensure => present,
  }

}
{{< /file >}}

1.  Update your main `sites.pp` manifest and include the new `php` module:

    {{< file "production/manifests/site.pp" puppet >}}
# ...

node 'puppet-agent-ubuntu.example.com' {
  # ...

  include apache
  include apache::vhosts

  include php

  include mysql::database

  # ...
}

node 'puppet-agent-centos.example.com' {
  # ...

  include apache
  include apache::vhosts

  include php

  include mysql::database

  # ...
}
{{</ file >}}

1. Run the following command on your agent nodes to pull in any changes to your servers.

        sudo /opt/puppetlabs/bin/puppet agent -t

    Otherwise, the Puppet agent service on your managed nodes will automatically check with the master once every 30 minutes and apply any new configurations from the master.

    You should now have a fully functioning LAMP stack on each of your Puppet managed nodes.