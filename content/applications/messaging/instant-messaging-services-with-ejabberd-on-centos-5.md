---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Getting started with ejabberd, an instant messaging server written in Erlang/OTP on CentOS 5.'
keywords: ["ejabberd", "ejabberd on linux", "real-time messaging", "xmpp server", "collaboration software", "chat software", "linux jabber server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['communications/xmpp/ejabberd/centos-5/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2009-12-08
title: Instant Messaging Services with ejabberd on CentOS 5
external_resources:
 - '[Ejabberd Community Site](http://www.ejabberd.im/)'
 - '[XMPP Standards Foundation](http://xmpp.org/)'
 - '[XMPP Client Software](http://xmpp.org/software/clients.shtml)'
---

Ejabberd, the "Erlang Jabber Daemon," is an extensible, flexible and very high performance XMPP server written in the Erlang programming language. With a web-based interface and broad support for [XMPP standards](http://xmpp.org/), ejabberd is an ideal general-use and multi-purpose XMPP server. Although ejabberd is considered "heavyweight" by some, mostly due to the requirements of the Erlang runtimes, it is incredibly robust and can scale to support heavy loads. It even includes support for hosting multiple domains virtually.

This installation process assumes that you have a working installation of CentOS 5.4, that you've followed the steps in the [getting started](/docs/getting-started/) guide, and that you are connected to your Linode via SSH as the root user. Once you've completed these requirements we can begin with the installation process.

## XMPP/Jabber Basics

Though you can successfully run an XMPP server with only a passing familiarity of the way the XMPP network and system works, understanding the following basic concepts will be helpful:

-   The *JID* or "Jabber ID" is the unique identifier for a user in the XMPP network. It often looks like an email address and contains the username that identifies a specific user on a server, the hostname that identifies the server, and a resource that identifies where a given user is logged in from. The resource is optional, and is often safely omitted or ignored for most users. In following example, "username" is the username, "example.com" is the hostname, and "/office" is the resource.

        username@example.com/office

    Again, the resource is optional; although XMPP allows a single JID to be connected to the server from multiple machines (i.e. resources), the resource adds a useful amount of specificity.

-   The XMPP system is federated by nature. Users with accounts on one server--if the server administrators allow it--can communicate with users on other servers. Without a centralized server, every XMPP server maintains the accounts and serves as the communication gateway for their own users. In the XMPP system there is no single point of failure, however each server administrator can decide how their server is going to participate in the federated network. For instance, to federate with Google's "GTalk" XMPP network, server administrators need to have server-to-server (s2s) SSL/TLS encryption enabled, while other servers don't always require this.
-   XMPP takes advantage of ["SRV" DNS Records](/docs/dns-guides/introduction-to-dns) to support the resolution of domains to the servers which provide DNS records.

## Set the Hostname

Run the following commands the set the hostname of your Linode:

    echo "example" > /etc/hostname
    hostname -F /etc/hostname

In this case, the hostname will be set to "example". Along with this, you will need to open the `/etc/sysconfig/network` file and change the `HOSTNAME` line to reflect your newly set hostname:

{{< file-excerpt "/etc/sysconfig/network" >}}
NETWORKING=yes NETWORKING_IPV6=no HOSTNAME=example

{{< /file-excerpt >}}


Finally, open `/etc/hosts` and put in your IP address, fully qualified domain name (FQDN), and hostname. See the example below:

{{< file-excerpt "/etc/hosts" >}}
123.123.123.123 example.com example

{{< /file-excerpt >}}


## Install ejabberd

The packages required to install ejabberd and it's dependencies are not available in the standard CentOS repositories. As a result, in order to install ejabberd, we must install the "[EPEL](https://fedoraproject.org/wiki/EPEL)" system. EPEL, or "Extra Packages for Enterprise Linux," is a product of the Fedora Project that attempts to provide Enterprise-grade software that's more current than what is typically available in the CentOS repositories. Enable EPEL with the following command:

    rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm

Issue the following command to install ejabberd:

    yum update
    yum install ejabberd

## Configure ejabberd

Ejabberd's configuration files are written in Erlang syntax, which might be difficult to comprehend. Thankfully, the modifications we need to make are relatively minor and straightforward. The primary ejabberd configuration file is located at `/etc/ejabberd/ejabberd.cfg`, for this version. We'll cover each relevant option in turn.

### Administrative Users

Some users will need the ability to administer the XMPP server remotely. By default this block of the config file looks like this:

{{< file-excerpt "/etc/ejabberd/ejabberd.cfg" >}}
{acl, admin, {user, "admin", "example.com"}}.

{{< /file-excerpt >}}


In Erlang, comments begin with the `%` character, and the access control list segment contains information in the following form: `{user, "USERNAME", "HOSTNAME"}`. The following examples correspond to the users with the JIDs of `admin@example.com` and `username@example.com`. You only need to specify one administrator, but you can add more than one administrator simply by adding more lines, as shown below:

{{< file-excerpt "/etc/ejabberd/ejabberd.cfg" >}}
{acl, admin, {user, "admin", "example.com"}}.
{acl, admin, {user, "username", "example.com"}}.

{{< /file-excerpt >}}


All users specified in this manner have full administrative access to the server, through both the XMPP and web-based interfaces. You will have to create your administrative users (as described below) before they can log in.

### Hostnames and Virtual Hosting

A single ejabberd instance can provide XMPP services for multiple domains at once, as long as those domains (or subdomains) are hosted by the server. To add a hostname for virtual hosting in ejabberd, modify the `hosts` option. By default, ejabberd is only configured to host the domain set during the installation process. You should also append a host item for "localhost." Here are a couple of examples:

{{< file-excerpt "/etc/ejabberd/ejabberd.cfg" >}}
{hosts, ["example.com", "localhost"]}.

{{< /file-excerpt >}}


In the following example, ejabberd has been configured to host a number of additional domains. In this case, these domains are "username.example.com," "example.com," and "bampton.com"

{{< file-excerpt "/etc/ejabberd/ejabberd.cfg" >}}
{hosts, ["username.example.com", "example.com", "example.com", "localhost"]}.

{{< /file-excerpt >}}


You can specify any number of hostnames in the host list, but you should be careful to avoid inserting a line break as this will cause ejabberd to fail.

### Listening Ports

TCP port number 5222 is the conventional "XMPP" port. If you want to change the port, this is the section of the configuration that needs to be modified. Furthermore if you wish to use SSL/TLS encryption for the connections between clients and the server, you'll need to adjust the path to the certificate file, in the following line:

{{< file-excerpt "/etc/ejabberd/ejabberd.cfg" >}}
{certfile, "/etc/ejabberd/ejabberd.pem"}, starttls,

{{< /file-excerpt >}}


Additionally, you may want to enable SSL access for client-to-server (c2s) SSL/TLS connections if you or the other users of you are using a client that requires legacy support for secured connections on port 5223. Uncomment the following stanza.

{{< file-excerpt "/etc/ejabberd/ejabberd.cfg" >}}
{5223, ejabberd_c2s, [
    {access, c2s},
    {shaper, c2s_shaper},
    {max_stanza_size, 65536},
    tls, {certfile, "/etc/ejabberd/server.pem"}
]},

{{< /file-excerpt >}}


### Additional Functionality

The `ejabberd.cfg` file is complete and well commented, and from this point forward your server should run. However, you should take the time to become familiar with the options provided in this file. We would only add, regarding the multi-user chats:

By default, MUCs or Multi-User-Chats (chatrooms) are accessible on the "conference.[hostname]" subdomain. If you want the public to be able to access MUCs on your domain, you need to create an "A Record" pointing the `conference` hostname (eg. subdomain) to the IP address where the ejabberd instance is running.

## Using Ejabberd

Once installed, the use and configuration of ejabberd is uncomplicated. To start, stop, or restart the server, issue the appropriate command to the `/etc/init.d/ejabberd` script:

    /etc/init.d/ejabberd start
    /etc/init.d/ejabberd stop
    /etc/init.d/ejabberd restart

Issue the following command to ensure that ejabberd starts following the next boot:

    chkconfig ejabberd on

By default, ejabberd is configured to disallow "in-band-registrations," which prevent Internet users from getting accounts on your server without your consent. To register a new user, issue a command in the following form:

    ejabberdctl register username example.com man

In this example, `username` is the username, `example.com` is the domain, and `man` is the password. This will create a JID for `username@example.com` with the password of "man." Use this form to create the administrative users specified above.

To remove a user from your server, issue a command in the following form:

    ejabberdctl unregister username example.com

The above command would unregister the `username@example.com` account from the server.

To set or reset the password for a user, issue the following command:

    ejabberdctl set-password username example.com morris

This command changes the password for the `username@example.com` user to `morris`.

To back up ejabberd's database, issue the following command:

    ejabberdctl dump ejabberd-backup.db

This command dumps the contents of the internal ejabberd database into a file located in the "/etc/ejabberd/" directory. To restore from the backup, issue the following command:

    ejabberdctl load ejabberd-backup.db

For more information about the `ejabberdctl` command, issue `ejabberdctl help` or `man ejabberdctl`.

If you would prefer to administer your ejabberd instance via the web-based interface, log in to `http://example.com:5280/admin/`, where "example.com" is the domain where ejabberd is running. Log in with the full JID and password of one of the administrators specified in the `/etc/ejabberd/ejabberd.cfg` file.

## XMPP Federation and DNS

To ensure that your ejabberd instance will federate properly with the rest of the XMPP network, particularly with Google's "GTalk" service (i.e. the ["@gmail.com](mailto:"@gmail.com)" chat tool) you must set the SRV records for your domain to point to the server where the ejabberd instance is running. We need three records, which can be created in the DNS management tool of your choice:

1.  Service: `_xmpp-server` Protocol: TCP Port: 5269
2.  Service: `_xmpp-client` Protocol: TCP Port: 5222
3.  Service: `_jabber` Protocol: TCP Port: 5269

The "target" of the SRV record should point to the publicly routable hostname for that machine (e.g. "example.example.com"). The priority and weight should both be set to `0`.

## Troubleshooting

If you're having problems getting ejabberd to start, or are getting obscure errors on the console, don't be discouraged; the errors generated by Erlang are often abstruse at best. The logs for ejabberd are located in the `/opt/ejabberd-2.1.0_rc2/logs/` directory. If you're getting error messages look in these files. Additionally, if ejabberd crashes, the "image dump" of Erlang will be saved in this directory. Begin your investigations for error messages in these files.
