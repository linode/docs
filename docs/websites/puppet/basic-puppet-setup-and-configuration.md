---
author:
  name: Linode
  email: skleinman@linode.com
description: Basic setup and configuration
keywords: 'puppet installation,puppet,configuration change management,server automation'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['application-stacks/puppet/installation/']
modified: Tuesday, September 10th, 2013
modified_by:
  name: Linode
published: 'Sunday, June 13th, 2010'
title: Basic Puppet Setup and Configuration
---

Puppet is an open-source tool that helps system administrators manage server configurations. Puppet makes it easy to automate and standardize configurations across multiple Linodes or other servers, for both the front end and the backend. You can update configurations on a per-domain basis, which is useful in both large and small deployments.

Puppet is also very useful if you're running a collection of servers with different operating systems. It abstracts the differences between different operating systems, so you can set up a single master server and store configurations for a heterogeneous collection of client servers. Puppetmaster servers do need not to run the same distribution or operating system as the components running the Puppet client.

Puppet uses the client/server model. The master server runs `puppetmasterd`, which stores the configuration description and resource files for several server nodes, while the clients run `puppetd`. The client servers regularly connect to the master server to synchronize their configurations and report any local changes back to the central nodes. It's also possible to run just a single client, which checks in with the master node either at specified intervals, or with a manual *pull* operation.

Getting Started
---------------

Before you dive into Puppet, you should complete the [Getting Started Guide](/docs/getting-started/).

If you're new to Linux systems administration, we also recommend reviewing the guides in our [Tools & Reference](/docs/tools-reference/) section, particularly the [Administration Basics Guide](/docs/using-linux/administration-basics).

This document covers the installation and configuration of Puppet. Once you've finished the installation, head over to the [Manage and Automate Systems Configuration with Puppet](/docs/application-stacks/puppet/automation) article to learn how to use Puppet effectively.

Installing Puppetmaster
-----------------------

For most situations, we recommend that you install Puppet from the package for your operating system. If you need access to the latest features, you can install it from source instead.

When you install or upgrade Puppet, remember that the Puppetmaster component *must* be updated first. Puppetmaster has to be of the same version or newer than the clients that connect to it. Older versions of the client can always communicate with newer versions of Puppetmaster, but the inverse is not guaranteed to be the case. A Puppet client can connect to a Puppetmaster component running on another operating system as long as the Puppet client is of the same version or older than the Puppetmaster server.

### Install Puppetmaster on Debian and Ubuntu

1.  Execute the following commands to update your system:

        apt-get update
        apt-get upgrade

2.  Install Puppetmaster:

        apt-get install puppetmaster rdoc

3.  Create the `/etc/puppet/manifests/site.pp` file:

        touch /etc/puppet/manifests/site.pp

### Install Puppetmaster on CentOS

1.  Install the EPEL repository:

        rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

2.  Execute the following command to update your system:

        yum update

3.  Install Puppetmaster:

        yum install puppet-server

4.  Create the `/etc/puppet/manifests/site.pp` file:

        touch /etc/puppet/manifests/site.pp

### Install Puppetmaster on Fedora

1.  Execute the following command to update your system:

        yum update

2.  Install Puppetmaster:

        yum install puppet-server

3.  Create the `/etc/puppet/manifests/site.pp` file:

        touch /etc/puppet/manifests/site.pp     

Installing the Puppet Client
----------------------------

You can install the Puppet client on as many Linodes or other servers as you want to manage with Puppet. When you're ready to upgrade the Puppet client, make sure you upgrade Puppetmaster first.

### Install the Puppet Client on Debian and Ubuntu

1.  Execute the following commands to update your system:

        apt-get update
        apt-get upgrade

2.  Install the Puppet client:

        apt-get install puppet

### Install the Puppet Client on CentOS

1.  Install the EPEL repository:

        rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm

2.  Execute the following command to update your system:

        yum update

3.  Install the Puppet client:

        yum install puppet

### Install the Puppet Client on Fedora

1.  Execute the following command to update your system:

        yum update

2.  Install the Puppet client:

        yum install puppet     

Configuring Puppet
------------------

This section provides instructions for configuring your new Puppet installation.

### Configure Access to the Puppet Host

By default, the Puppet client locates the Puppetmaster instance by contacting the host with the name `puppet`. There are a number of options for setting up hostname resolution, with various advantages and disadvantages. The easiest way is to create entries for the `puppet` host in the `/etc/hosts` file that point to the puppet server's IP address; however, this may be difficult to update across multiple hosts if you need to change the IP of your Puppetmaster server at any point. A better option is to create DNS records for the `puppet` record that point to the Puppetmaster server.

1.  Create an A record or a CNAME for the hostname `puppet` (e.g., puppet.example.com) and point it to your master server's IP address. For more about adding DNS records, please read our [Adding DNS Records](/docs/networking/dns/dns-manager#adding-1) article.
2.  On your client machine, [configure static networking](/docs/networking/linux-static-ip-configuration) to ensure that DHCP will not overwrite the contents of the `/etc/resolv.conf` file, which we'll be modifying in the next step.
3.  Edit your `/etc/resolv.conf` file to include a `search` statement for the domain where you've set up the Puppet master server:

        nano /etc/resolv.conf

    {: .file-excerpt }
/etc/resolv.conf

    > search example.com

4.  Make sure your client server can locate the Puppetmaster server, named `puppet`, by running this command:

        ping -c 3 puppet

    You should receive a response with the domain name and IP address of the master server:

        PING example.com (12.34.56.78) 56(84) bytes of data.
        64 bytes from puppet.example.com (12.34.56.78): icmp_seq=1 ttl=64 time=0.050 ms
        64 bytes from puppet.example.com (12.34.56.78): icmp_seq=2 ttl=64 time=0.062 ms
        64 bytes from puppet.example.com (12.34.56.78): icmp_seq=3 ttl=64 time=0.061 ms

        --- puppet.example.com ping statistics ---
        3 packets transmitted, 3 received, 0% packet loss, time 2002ms
        rtt min/avg/max/mdev = 0.050/0.057/0.062/0.010 ms

You may also want to consider connecting to your Puppetmaster server over a private local area network, for speed and security.

### Configure Secure Puppet Communications

Next, you'll need to set up the SSL certificate on the client machine. Puppet clients use SSL certificates and an SSL certificate authority for secure communication with the Puppetmaster node.

1.  On the client machine, issue the following command to request a certificate:

        puppetd --server puppet.example.com --waitforcert 60 --test

    The following message will appear on the console:

        info: Creating a new certificate request for jockey.example.com 
        warning: peer certificate won't be verified in this SSL session
        notice: Did not receive certificate
        notice: Set to run 'one time'; exiting with no certificate

2.  On the Puppetmaster machine, issue the following command to view a list of all certificates waiting to be signed:

        puppetca --list

3.  Sign the certificate for the client, `client.example.com` in this example, by issuing the following command:

        puppetca --sign client.example.com

The new Puppet client node will now be able to connect to the Puppetmaster node. Congratulations! You have successfully installed and configured the Puppet configuration change management framework.

To learn more about using Puppet, please review our [Managing and Automating Systems Configuration with Puppet](/docs/application-stacks/puppet/automation) guide.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Puppet Labs Home Page](http://www.puppetlabs.com/)
- [Managing and Automating Systems Configuration with Puppet](/docs/application-stacks/puppet/automation)



