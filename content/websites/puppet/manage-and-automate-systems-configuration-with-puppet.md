---
author:
  name: Linode
  email: docs@linode.com
description: 'Use Puppet for configuration change management.'
keywords: ["puppet", "puppet configuration", "puppet linux", "configuration change management", "server automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['application-stacks/puppet/automation/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2010-06-13
title: Manage and Automate Systems Configuration with Puppet
external_resources:
 - '[Puppet Labs Home Page](http://www.puppetlabs.com/)'
 - '[Basic Puppet Configuration](http://docs.puppetlabs.com/guides/configuring.html)'
 - '[Puppet Manifest Language](http://docs.puppetlabs.com/guides/language_tutorial.html)'
 - '[Puppet Dashboard Documentation](http://docs.puppetlabs.com/guides/installing_dashboard.html)'
 - '[Puppet Recipe Directory](http://projects.puppetlabs.com/projects/puppet/wiki/Puppet_Recipes)'
 - '[Puppet Modules](http://projects.puppetlabs.com/projects/puppet/wiki/Puppet_Modules)'
---

Puppet is an open source "configuration change management" tool that allows users to automate and standardize the configuration of software infrastructure. Using a domain specific language for describing configuration, Puppet allows users to manage configurations in a service-oriented manner.

Because of Puppet's versatility, this guide provides an overview of a number of different Puppet-based deployments. Since there is no single "right way" to integrate Puppet into your network, this document will focus on a collection of independent strategies rather than a single procedure. Before following this document, it is assumed that you have an up-to-date system, have followed our [getting started guide](/docs/getting-started/) and have installed Puppet according to our [Puppet installation guide](/docs/application-stacks/puppet/installation).

## Using Puppet

Puppet is a collection of tools built around a language that allows systems administrators to specify configurations, or manifests, to describe the state of a computer system. In the [Puppet installation guide](/docs/application-stacks/puppet/installation), we covered installing both the "Puppetmaster" server component and the Puppet client. This section covers a number of different methods you may use to apply Puppet manifests to your Linodes.

### Running Puppet Manually

The most common way to apply Puppet manifests to a system is to use the Puppetmaster daemon (`puppetmasterd`) and Puppet client daemon (`puppetd`). However, you may also apply Puppet manifests manually using the `puppet` tool, which operates in an interactive mode but is otherwise functionally equivalent to `puppetd`. Given a Puppet manifest on the local file system located at `~/puppet/example-base.pp`, issue the following command:

    puppet ~/puppet/example-base.pp

This will apply the configuration specified in the manifest to your system.

### Running Puppet with Cron

By default, `puppetd` runs every 30 minutes, contacts the `puppetmasterd`, retrieves changes to the manifests, and applies these changes to the system. If you want to run Puppet more or less frequently, you can configure a [cron job](/docs/linux-tools/utilities/cron) on your client systems that resemble the following:

    30 * * * * puppetd --onetime --no-daemonize --logdest syslog > /dev/null 2>&1

The options to `puppetd` tell the program to run once without daemonizing, to log all events to the syslog (typically located at `/var/log/syslog`), and to generate no other output. The above cron job is scheduled to run hourly at 30 past the hour; however, you can configure this cronjob to run at the specific interval that your deployment requires. To test the functioning of this cronjob, issue the following command:

    puppetd --onetime --no-daemonize --logdest syslog

In order for `puppetd` to work in this manner you must [configure secure Puppet communications](/docs/application-stacks/puppet/installation#configure_secure_puppet_communications). To test the operation of Puppetd at the command line, with interactive output, you may issue the following command:

    puppetd --test

### Running Puppet with Puppetmaster

To generate a fully commented example of the `puppetmasterd` configuration issue the following command:

    puppetmasterd --genconfig --no-daemonize > /etc/puppet/reference-puppetmasterd.conf

These options can then be added and modified in the `[puppetmasterd]` section of the `/etc/puppet.conf` file. All other configuration for both `puppetmasterd` and `puppetd` are in the `/etc/puppet/puppet.conf` file.

All Puppet files are stored in the `/etc/puppet/manifests/` directory, and Puppetmaster will look in this directory and apply the manifests as described therein. Commonly "classes," or chunks of configuration that may be shared between different systems, are located in the `/etc/puppet/manifests/classes/` directory. A series of system manifests drawing on these classes are placed in your manifest directory. Puppet manifests have the extension `.pp`.

## Puppet Manifests

Consider the following class, which is an elaboration on the canonical example Puppet `sudo` class:

{{< file "/etc/puppet/manifests/classes/sudo.pp" puppet >}}
# /etc/puppet/manifests/classes/sudo.pp

class sudo {
    file { "/etc/sudoers":
           owner => "root",
           group => "root",
           mode  => 440,
           source => "puppet://example.com/files/sudoers"
    }
}

{{< /file >}}


In this example, configuration for the `/etc/sudoers` file is described, owned by the `root` user and group, with permissions of 440 that only allow read access for the owner and the members of the owner group. When applied, this manifest will ensure that the system in question has the above configuration applied to the `/etc/sudoers` file. The `source` specification allows puppet to copy a specific file from the Puppetmaster server. Distributing files with puppet will be covered [later](#serving_files).

{{< file "/etc/puppet/manifests/site.pp" puppet >}}
# /etc/puppet/manifests/site.pp

import "classes/*"

node default {
    include sudo
}

{{< /file >}}


This file imports all of the classes described in the `/etc/puppet/manifests/classes` directory. Then, into the `default` node it includes the configuration described in the `sudo` class. The `default` node is a special node identifier that includes all Puppet client nodes that connect to the local Puppetmaster daemon.

By default, `puppetd` runs as a client on the machine that `puppetmasterd` is installed on, and will receive all configuration specified for it and for the `default` node.

### Specifying Puppet Nodes

As above, the `default` node provides a space to specify the configuration for all Puppet nodes. Of course, it is also possible to configure node descriptions in more specific terms. Consider the following setup:

{{< file-excerpt "/etc/puppet/manifests/site.pp" puppet >}}
# /etc/puppet/manifests/site.pp

import "classes/*"

## Base Nodes

node default {
    include sudo
    include sshkeys
}

node appserverbasic {
    include django
    include apacheconf
    include app
}

node loadbalancer {
    include nginxlb
    include monitoring
}

## Specific Nodes

node 'fore.example.com' inherits loadbalancer {
    include django
    include apacheconf
    include app
    include backups
}

node 'lb1.example.com' inherits loadbalancer {
}

node 'hostname.example.com' inherits appserverbasic {
    include monitoring
    include backups
}

node 'test.hostname.example.com' inherits appserverbasic {
}

node 'monitoring1.example.com', 'monitoring2.example.com' {
    include monitoring
    include monitoringhub
}

{{< /file-excerpt >}}


In this example, we create several "base nodes" which each include a number of classes from the `classes/` directory. There are four specific nodes created, which specify in single quotes the names of machines. These machines are identified by a hostname, configured when the Puppetmaster node signed the certificate of the Puppet nodes. All nodes receive the `default` node configuration, the configuration specified in their description and all of the configuration options specified in the node description of the "inherited" nodes.

Therefore, `fore.example.com` will receive the configuration specified by the classes `nginxlb` and `monitoring` because it inherits the `loadbalancer` node configuration, as well as the `django`, `apacheconf` and `app` configuration of its own. The configuration for the remaining four hosts provide an example of how Puppet classes and node definitions can be combined to configure a diverse group of systems in a concise manner. You may also specify multiple nodes with the same configuration as in the final example.

### Facter

Facter is a tool that is installed as a dependency for Puppet. It provides detailed information regarding the current state of your system which can then be used in constructing Puppet manifests. To see an overview of the information provided by `facter`, issue the following command:

    facter

This makes it possible to write Puppet manifests that are sensitive to the actual configuration of a given system, without needing to rewrite individual manifests for every unique system.

## Describing Resources with Puppet

### Serving Files

While Puppet contains powerful abstractions for specifying configurations, in some cases it's necessary to deploy files to systems that are not configured using Puppet. The above example regarding the `/etc/sudoers` file presents one such situation. Puppet's fileserver is configured in the `/etc/puppet/fileserver.conf` file. Consider the following example configuration:

{{< file-excerpt "/etc/puppet/fileserver.conf" >}}
[files]
  path /etc/puppet/files
  allow *.example.com
  allow 192.168.0.0/24

{{< /file-excerpt >}}


In the Puppet fileserver configuration, the order of `allow` and `deny` statements does not carry any weight. Puppet will deny access to hosts by default. In this example, the only hosts that are allowed access to the server are hosts which have certificates signed for names within the `.example.com` name space, and any host accessing the Puppet server with an IP in the non-public address space beginning with `192.168.` as would be the case with access to Puppet over the LAN.

You may specify a `source` for a file object in Puppet manifests. Consider the following example:

{{< file-excerpt "Puppet Configuration Manifest" puppet >}}
file { "/etc/httpd/conf.d":
    source => "puppet://example.com/files/web-server/httpd/conf.d",
    recurse => "true"
}

{{< /file-excerpt >}}

Nodes that implemented the above configuration will recursively copy files from the Puppetmaster node located at `/etc/puppet/files/web-server/httpd/conf.d/` to `/etc/httpd/conf.d/`. Recursive file system sources are very useful for deploying basic configurations to a number of different machines; however, these recursive options can be taxing on a Puppet master node using the default Puppetmaster server. When deploying services with Puppet, consider the scale of your deployment and the need for this kind of recursive operation.

### Describing Services

Puppet makes it possible to require that nodes have configuration and services that extend beyond ensuring that files are present on a system, and can ensure that certain services are running. Consider the following example:

{{< file-excerpt "Puppet Configuration Manifest" puppet >}}
package { "openssh-server":
        ensure => latest
    }
service { "sshd":
    ensure => running,
    require => Package["opennssh-server"],
    subscribe => File[sshdconfig],
}

{{< /file-excerpt >}}


By defining the `sshd` service within a class with these parameters, puppet will ensure that the SSH daemon is running. Furthermore, if the `sshdconfig` file (which is defined elsewhere) changes, Puppet will restart the daemon. In the following example we define an `apache2` service for Debian and Ubuntu systems:

{{< file-excerpt "Puppet Configuration Manifest" puppet >}}
package { "apache2":
        ensure => latest
    }
service { "apache2":
    ensure => running,
    require => Package["apache2"],
    subscribe => File[httpdconf],
}

{{< /file-excerpt >}}

This will ensure that the `apache2` service is running, that the required package is installed on the system, and restart the service if the `httpdconf` file is changed. In both of these examples, the use of `File[]` and `Package[]` syntax marks a reference to descriptions in another part of the class. References to other definitions are capitalized.

### Defining Commands

Puppet attempts to normalize the way administrators interact with all resources, regardless of their type. Puppet makes it possible to define arbitrary commands that you want to execute. Consider the following example:

{{< file-excerpt "File Path" >}}
exec {"rsync_config":
    command => "/usr/bin/rsync -a username@hostname.example.com:/srv/puppet/www-config /opt/config",
    unless => "/bin/test -e /opt/config/fresh",
}

{{< /file-excerpt >}}

This instructs Puppet to run the specified command, in this case an `rsync` command. The `unless` parameter runs tests for the existence of a file before running the command, to avoid running a command unnecessarily.

## Advanced Puppet Usage

This guide only covers the most basic of puppet configurations options. It is certainly possible to deploy much more complex systems, including the following possibilities:

-   Store revisions of your manifest files in a [version control system](/docs/linux-tools/version-control/). Version control will make it easier to revert changes if you run into problems. It will also ease replication of manifests throughout a system with multiple Puppetmaster nodes.
-   Deploy Puppetmaster with [Passenger](/docs/frameworks/): the default Puppetmaster server is based on WEBrick, which is only capable of supporting 20 or 30 puppet nodes, depending on your configuration, according the Puppet developers.
-   You may consider using Puppet in combination with the [Linode API](http://www.linode.com/api/) and [StackScripts](http://www.linode.com/stackscripts/) to automate provisioning, deprovisioning, and configuration of Linodes.
-   Use [Puppet's module support](http://projects.puppetlabs.com/projects/puppet/wiki/Puppet_Modules) to more easily manage applications which require more complex configurations.