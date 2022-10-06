---
slug: how-to-install-openldap-client
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to install OpenLDAP client and connect it to an OpenLDAP server on a Linux environment"
og_description: "Learn how to install OpenLDAP client and connect it to an OpenLDAP server on a Linux environment."
keywords: ["LDAP", "Install", "Linux", "database"]
tags: ["LDAP", "OpenLDAP", "linux", "server", "storage", "authentication", "database"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 
modified_by:
  name: Linode
title: "How to Install and Configure OpenLDAP Client on Linux"
h1_title: "Installing OpenLDAP Client"
enable_h1: true
contributor:
  name: Jan Slezak
  link: https://github.com/scumdestroy
external_resources:
- '[OpenLDAP Project Official Site](https://www.openldap.org/)'
- '[OpenLDAP Official Download](https://www.openldap.org/software/download/)'
- '[OpenLDAP Documentation](https://www.openldap.org/doc/)'
- '[OpenLDAP Foundation](https://www.openldap.org/foundation/)'

---

[*OpenLDAP*](https://www.openldap.org/) is an open-source implementation of the *Lightweight Directory Access Protocol* or **LDAP**, a lightweight client-server protocol typically accessed through a TCP/IP connection.  LDAP is primarily used for file and information storage across an intricate system of directories, as well as managing access to its contents through authentication.  Many organizations also use LDAP to provide a directory service of information about their employees, clients, departments and more.  

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

2.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

3.  Before installing and configuring an OpenLDAP client, you must have access to an OpenLDAP server through a local network or remote connection.  In addition, the root user on the OpenLDAP server must configure user accounts and provide credentials before you can succesfully connect the OpenLDAP client to the server. 

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}


## Installing OpenLDAP 

{{< note >}}
Throughout this guide, the examples will use `10.10.10.10` as the OpenLDAP server's IP address and `ldapserver.com` as its domain.  The LDAP client and local machine will use an IP address of `127.0.0.1`.  These values will likely be different in your own set-ups.
{{< /note >}}


- Append the LDAP server's IP address and domain name to the bottom of the `/etc/hosts` file on the client machine. 

{{< file `/etc/hosts` >}}
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost 
127.0.0.1       localhost

10.10.10.10     ldapserver.com
{{< /file >}}


### Debian and Ubuntu Instructions 

- Use `apt` to install the `libnss-ldap`, `libpam-ldap`, `nscd` and `ldap-utils` packages.

                sudo apt update && sudo apt upgrade && sudo apt install libnss-ldap libpam-ldap nscd ldap-utils -y

- During the installation process, an interactive prompt will guide the majority of the configuration process.  Your responses should reflect your local environment and server configuration.  

1.  First, enter the **LDAP server URI** of your local OpenLDAP server.  It is recommended to use the server's IP address, rather than domain name, to avoid potential DNS issues caused by misconfigurations or service failures.  Use a prefix of `ldap://` before the IP address.

                ldap://10.10.10.10

2. Next, enter the **distinguished name** of the LDAP server's search base.  This should be in the server's configuration files, however, it typically follows a pattern of splitting the domain name and the TLD in the following manner.

                dc=ldapserver,dc=com

3.  Choose the preferred LDAP protocol version.  Unless required by a specific configuration on an older server, it is recommended to choose the most recent and secure version. 

4.  Next, select `Yes` to make local root Database admin.  

5.  Select `No` when prompted `Does the LDAP database require login?`.

6.  Next, set the LDAP account for root.  The default account name is `admin` and can be left unchanged for simplicity, followed by the `distinguished name` as entered in the first page.

                cn=admin,dc=ldapserver,dc=com 

7.  Finally, choose a secure password for root access to the LDAP directory.  This password will be saved in a file at `/etc/ldap.secret` on the local machine and accessible only to root.  Entering the password will allow installation to finish.

{{< note >}}
The preceding set of questions creates the configuration file at `/etc/ldap.conf`.  Privileged users can edit this file to make configuration changes with `nano`, `vim` or any other terminal-based text editor.  
{{< /note >}}

### Updating System Configuration Files

The installation prompt covers most of the necessary configuration changes, though not all.
Open `/etc/ldap/ldap.conf` in any text editor as a sudo user and uncomment lines 8 and 9, as well as updating them to your local LDAP server settings.

{{< file `/etc/ldap/ldap.conf`  >}}
[...]
BASE    dc=ldapserver,dc=com
URI     ldap://10.10.10.10
[...]
{{< /file >}}

- Next, configure NSS via the following command.

                sudo auth-client-config -t nss -p lac_ldap

- Update the PAM auth file to use LDAP for authentication.  

                sudo pam-auth-update

- Enable the `LDAP Authentication` PAM profile in the table that appears and press `Ok`.

### Enabling Home Directories for LDAP Users

To enable the automatic creation of user's home directories upon first login into the LDAP network, append the following line to `/etc/pam.d/common-session` 

                session optional pam_mkhomedir.so skel=/etc/skel umask=077


## CentOS Instructions

- Use `yum` to install `openldap-clients` and `nss-pam-ldapd`.

                yum update && yum install -y openldap openldap-clients nss-pam-ldapd

- Configure LDAP Authentication via the `authconfig` command.  Substitute the values for the `--ldapserver` and `--ldapbasedn` parameters with your OpenLDAP server's IP address and distinguished name.  Distinguished name is typically derived from splitting the server's domain and TLD apart in the syntax seen in the following example.

                authconfig --enableldap --enableldapauth --ldapserver=10.10.10.10 --ldapbasedn="dc=ldapserver,dc=com" --enablemkhomedir --update 

- Finally, restart the `nslcd` service to load the new configuration into the current environment.

                systemctl restart nslcd

## Further Information

There is a wealth of information available at OpenLDAP's documentation [here](hhttps://www.openldap.org/doc/).

The main page for OpenLDAP documentation can be found [here](https://www.openldap.org/doc/)

Various Linux distributions have their own help pages for setting up OpenLDAP.  These may provide additional assistance to any distro-specific and nuanced problems encountered.
- [RedHat OpenLDAP Docs](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/5/html/deployment_guide/s1-ldap-pam)
- [OpenSUSE LDAP Docs](https://doc.opensuse.org/documentation/leap/security/html/book-security/cha-security-ldap.html)
- [Debian LDAP Docs](https://wiki.debian.org/LDAP)

