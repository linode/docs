---
author:
  name: Florent Houbart
  email: --
description: 'Securing CentOS with FirewallD'
keywords: 'firewall,firewalld,security,firewall,acl,access control'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Monday, July 13, 2015'
modified: Monday, July 13, 2015
modified_by:
  name: James Stewart
title: Control Network Traffic With FirewallD
contributor:
    name: Florent Houbart
---

Starting with CentOS7, iptables is replaced with **Firewalld**. That may be confusing when used to iptables service, especially since iptables commands are still available. Firewalld is, however, easier to configure for most use cases. This guide will introduce you to firewalld notions of zone and services, and show you how to configure it.


# About firewalld

firewalld deamon is used in place of the well-known iptables service. It provides a command line interface (**firewall-cmd**) to manage configuration, and translates it in iptables commands to netfilter kernel module. It has two main differences with plain old iptables:

1. It works with zone and services instead of chain and rules.
2. It manage the ruleset dynamically, allowing updates without breaking existing sessions and connections


Iptables commands are used by firewalld and are still available, like `iptables -L`. Don’t update the rules with them, you may mess up everything !


Before going into detail, let’s see how easy it is to manage firewalld rules:

    # Allow FTP traffic to public zone.
    # Firewalld will manage automagically connection tracking
    firewall-cmd --zone=public --add-service=ftp
    # Prevent SSH traffic in public zone
    firewall-cmd --zone=public --remove-service=ssh



# Installation

firewalld is installed by default in CentOS7. If not, you can install it with a single yum command:

    yum install firewalld


# Starting and stopping firewalld

To start and stop firewalld, use `systemctl` commands:

    # Start firewalld
    systemctl start firewalld
    # Stop firewalld
    systemctl stop firewalld


Use `firewall-cmd` command to get status of the firewall. It returns 0 if it is running, any other value if not.

    [root@mycentos7 ~]# firewall-cmd --state
    running
    [root@mycentos7 ~]# systemctl stop firewalld  # stop firwalld
    [root@mycentos7 ~]# firewall-cmd --state
    not running




# Firewalld configuration

## Runtime and permanent configuration

Firewalld use 2 configuration sets: *runtime* and *permanent*. Changes on runtime configuration are not persisted on firewalld restart. Changes on permanent configuration are not applied to live configuration. By default, firewall-cmd commands apply on runtime configuration. Use the *--permanent* flag to firewall-cmd command to update permanent configuration.

To add an active and persistant rule, you can use two methods:

1. Add the rule both to runtime and permanent set. Example:

        firewall-cmd --zone=public --add-service=http --permanent
        firewall-cmd --zone=public --add-service=http

2. Add the rule to permanent set and reload configuration

        firewall-cmd --zone=public --add-service=http --permanent
        firewall-cmd --reload

Note that reloading configuration does not break any live session or connection.


## Firewalld configuration files

Firewalld is configured with XML files. Except for very specific configuration, you won’t have to deal with them but use **firewall-cmd** commands.

Configuration files are located in two directories:

* **/usr/lib/firewalld**: default configuration, like defaults zones and common services. Don’t update them as those files will be overwritten by each firewalld package update
* **/etc/firewalld**: system configuration. Those files will overwrite default configuration


## Reloading configuration

To reload firewalld configuration, use the following command:

    firewall-cmd --reload


It will drop all runtime configuration that have not been persisted and apply permanent configuration. As firewalld manage the ruleset dynamically, it won’t break existing connection and session.


# Managing zones and getting zone configuration

Zones allow you to add different set of rules to different interfaces. For example, with two interfaces on internal network and internet, you may allow dhcp query to internal  zone but only http and ssh on external zone.

For most hosts with only one interface, you won’t have to worry with that and use only the default zone.


To get the default zone use `--get-default-zone` command. All interface that are not explicitly set to a specific zone will be attached to the default zone:

    [root@mycentos7 ~]# firewall-cmd --get-default-zone
    public


You can change the default zone with `--set-default-zone` command:

    [root@mycentos7 ~]# firewall-cmd --set-default-zone=internal
    success


To see the zones used by your interfaces, use `--get-active-zones` command:

    [root@mycentos7 ~]# firewall-cmd --get-active-zones
    public
      interfaces: ens160


Use `--list-all` with the `--zone=XXX` flag to get all configuration for a given zone:

    [root@mycentos7 ~]# firewall-cmd --zone=public --list-all
    public (default, active)
      interfaces: ens160
      sources:
      services: dhcpv6-client http ssh
      ports: 12345/tcp
      masquerade: no
      forward-ports:
      icmp-blocks:
      rich rules:


Or use `--list-all-zones` command to get all the configuration of all zones (output truncated in the example to show only two zones):

    [root@mycentos7 ~]# firewall-cmd --list-all-zones
    internal
      interfaces:
      sources:
      services: dhcpv6-client ipp-client mdns samba-client ssh
      ports:
      masquerade: no
      forward-ports:
      icmp-blocks:
      rich rules:
    
    public (default, active)
      interfaces: ens160  <-- interface ens160 is on public zone
      sources:
      services: dhcpv6-client http ssh  <-- those services are allowed
      ports: 12345/tcp  <-- this tcp port is allowed
      masquerade: no
      forward-ports:
      icmp-blocks:
      rich rules:



# Allowing traffic in a zone

All commands in this paragraph can optionally use the `--permanent` flag: if set, the rule will be added to the permanent ruleset and not to the live ruleset. By default rules are added to live configuration and lost at the next firewalld reload.

## Allowing a standard service

You can allow standard services, like HTTP, FTP or any common service, with the `--add-service` command:

    # Allow http service to public zone
    firewall-cmd --zone=public --add-service=http --permanent

Get the list of all existing services with `--get-services` command:

    [root@mycentos7 ~]# firewall-cmd --get-services
    amanda-client bacula bacula-client dhcp dhcpv6 dhcpv6-client dns ftp high-availability http https imaps ipp ipp-client ipsec kerberos kpasswd ldap ldaps libvirt libvirt-tls mdns mountd ms-wbt mysql nfs ntp openvpn pmcd pmproxy pmwebapi pmwebapis pop3s postgresql proxy-dhcp radius rpc-bind samba samba-client smtp ssh telnet tftp tftp-client transmission-client vnc-server wbem-https


Firewalld use the XML configuration files to know what to open for a specific service. Look at them in **/usr/lib/firewalld/services** (or **/etc/firewalld/services** if you provide yours) to know what it will really do:

    [root@mycentos7 ~]# cat /usr/lib/firewalld/services/ftp.xml
    <?xml version="1.0" encoding="utf-8"?>
    <service>
      <short>FTP</short>
      <description>FTP is a protocol used for remote file transfer. If you plan to make your FTP server publicly available, enable this option. You need the vsftpd package installed for this option to be useful.</description>
	  <!-- Allow TCP on port 21 -->
      <port protocol="tcp" port="21"/>
	  <!-- Use nf_conntrack_ftp netfilter module -->
      <module name="nf_conntrack_ftp"/>
    </service>



## Allowing an arbitrary protocol/port

If you prefer using a port/protocol notation, or need to allow traffic on a non-standard service, you can use `--add-port` command:

    # Allow TCP traffic on port 12345
    firewall-cmd --zone=public --add-port=12345/tcp --permanent


# Port forwarding

You can forward traffic from a port to another, even on another server.
To forward a port to another on the same server, use:

    [root@mycentos7 ~]# firewall-cmd --zone="public" --add-forward-port=port=80:proto=tcp:toport=12345


To forward to another server:

1. Activate masquerade on the zone

        [root@mycentos7 ~]# firewall-cmd --zone=public --add-masquerade
        success

2. Add the forward rule:

        [root@mycentos7 ~]# firewall-cmd --zone="public" --add-forward-port=port=80:proto=tcp:toport=8080:toaddr=10.1.52.80
        success


# Advanced configuration with Rich Rules

Services and ports are fine for basic configuration, but may be too limiting for advanced scenario. Use Rich Rules to have more control. Rich rules syntax is extensive, and is documented in man page **firewalld.richlanguage(5)** (`man firewalld.richlanguage`). We will see here most common use cases.

Use `--add-rich-rule`, `--list-rich-rules` and `--remove-rich-rule` with firewall-cmd command to manage them:

    [root@mycentos7 ~]# firewall-cmd --zone=public --add-rich-rule 'rule family="ipv4" source address=192.168.0.14 accept'

Here are some common examples.

1. Allow all traffic from host 192.168.0.14:

        rule family="ipv4" source address="192.168.2.2" accept

2. Deny TCP traffic from host 192/160.1.10 to port 22:

        rule family="ipv4" source address="192.168.1.10" port port=22 protocol=tcp reject

3. Allow TCP traffic from host 10.1.0.3 to port 80, and forward it locally to  port 6532:

        rule family=ipv4 source address=10.1.0.3 forward-port port=80 protocol=tcp to-port=6532

4. Forward all traffic on port 80 to port 8080 on host 172.31.4.2 (masquerade should be active on the zone):

        rule family=ipv4 forward-port port=80 protocol=tcp to-port=8080 to-addr=172.31.4.2


# Direct interface

For more advanced usage, or for iptables gurus, firewalld provide a direct interface that allow you to pass raw iptables chains and rules to firewalld. Like for services configuration, use the `--permanent` flag to update permanent configuration.


To see all custom chains and rules added to firewalld, use:

    # Show custom chains
    firewall-cmd --direct --get-all-chains
    # Show custom rules
    firewall-cmd --direct --get-all-rules


To add custom chains and rules, use:


    # Add a custom chain
    firewall-cmd --direct --add-chain table chain
    # Remove a custom chain
    firewall-cmd --direct --add-rule table chain priority args

We won't get into more details here, iptables syntaxe being a whole topic on its own. You can have a look at the [ipTable guide](https://www.linode.com/docs/networking/firewalls/control-network-traffic-with-iptables) to get more information.

You can remove chains or rules with `--remove-chain` and `--remove-rule` commands.

# More information

To get more deeper into Firewalld, you can read the man pages `firewalld`, `firewall-cmd`, `firewalld.richlanguage`, they are well written and easy to read.

You may also want to read [Fedora's Security Guide](http://docs.fedoraproject.org/en-US/Fedora/19/html/Security_Guide/index.html) section about Firewalld ([3.8](http://docs.fedoraproject.org/en-US/Fedora/19/html/Security_Guide/sect-Security_Guide-Using_Firewalls.html))
