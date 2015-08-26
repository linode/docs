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

Starting with CentOS7, iptables is replaced with **Firewalld**. This may be confusing when used for iptables service, especially since iptables commands are still available. Firewalld is, however, easier to configure for most use cases. This guide will introduce you to firewalld notions of zone and services, and show you how to configure them.


# About firewalld

firewalld deamon is used in place of the well-known iptables service. It provides a command line interface (**firewall-cmd**) to manage configuration and, using iptables commands, translates it to netfilter kernel module. It has two main differences with legacy iptables:

1. It works with zone and services instead of chain and rules.
2. It manages the ruleset dynamically, allowing updates without breaking existing sessions and connections.


Iptables commands are used by firewalld and are still available, for example `iptables -L`. Avoid updating rules with them, you could disrupt/disable everything!


Before going into detail, let’s see how easy it is to manage firewalld rules:

    # Allow FTP traffic to public zone.
    # Firewalld will manage automagically connection tracking:
    firewall-cmd --zone=public --add-service=ftp
    # Prevent SSH traffic in public zone:
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


Use `firewall-cmd` command to get firewall status. A running firewall returns 0; another value, if down.

    firewall-cmd --state
    running
    systemctl stop firewalld  # stop firwalld
    firewall-cmd --state
    not running




# Firewalld configuration

## Runtime and permanent configuration

Firewalld uses 2 configuration sets: *runtime* and *permanent*. Changes on runtime configuration are not retained upon firewalld restart. Changes on permanent configuration are not applied to a live configuration. By default, firewall-cmd commands apply to runtime configuration. However, using the *--permanent* flag with firewall-cmd command will establish a permanent configuration.

To add an active and persistant rule, you can use two methods:

1. Add the rule to both the permanent and runtime sets. Example:

        firewall-cmd --zone=public --add-service=http --permanent
        firewall-cmd --zone=public --add-service=http

2. Add the rule to the permanent set and then reload its configuration

        firewall-cmd --zone=public --add-service=http --permanent
        firewall-cmd --reload

Note that reloading a configuration does not break any live session or connection.


## Firewalld configuration files

Firewalld is configured with XML files. Except for very specific configurations, you won’t have to deal with them; instead, use **firewall-cmd** commands.

Configuration files are located in two directories:

* **/usr/lib/firewalld**: default configuration, like default zones and common services. Avoid updating them as those files will be overwritten by each firewalld package update.
* **/etc/firewalld**: system configuration. These files will overwrite a default configuration.


## Reloading configuration

To reload firewalld configuration, use the following command:

    firewall-cmd --reload


This command drops all runtime configurations and applies a permanent configuration. Because firewalld manages the ruleset dynamically, it won’t break an existing connection and session.


# Managing zones and getting zone configuration

Zones allow you to add different sets of rules to different interfaces. For example, with seperate interfaces for both an internal network and the Internet, you can allow the dhcp query on an internal zone but only http and ssh on external zone.

Most hosts that use a single interface use only the default zone.


To get the default zone, use `--get-default-zone` command. Any interface not explicitly set to a specific zone will be attached to the default zone:

    firewall-cmd --get-default-zone
    public


You can change the default zone with `--set-default-zone` command:

    firewall-cmd --set-default-zone=internal
    success


To see the zones used by your interfaces, use `--get-active-zones` command:

    firewall-cmd --get-active-zones
    public interfaces: ens160


Use `--list-all` with the `--zone=XXX` flag to get all configurations for a selected zone:

    firewall-cmd --zone=public --list-all
    public (default, active)
      interfaces: ens160
      sources:
      services: dhcpv6-client http ssh
      ports: 12345/tcp
      masquerade: no
      forward-ports:
      icmp-blocks:
      rich rules:


Or use `--list-all-zones` command to get all configurations for all zones (truncated output in the example below shows only two zones):

    firewall-cmd --list-all-zones
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

All commands in this paragraph can optionally use the `--permanent` flag. If set, the rule will be added to the permanent ruleset and not to the runtime ruleset. By default, rules added to a runtime configuration are lost at the next firewalld reload.

## Allowing a standard service

You can allow standard services, like HTTP, FTP or any common service, with the `--add-service` command:

    # Allow http service to public zone:
    firewall-cmd --zone=public --add-service=http --permanent

Get the list of all existing services with `--get-services` command:

    firewall-cmd --get-services
    amanda-client bacula bacula-client dhcp dhcpv6 dhcpv6-client dns ftp high-availability http https imaps ipp ipp-client ipsec kerberos kpasswd ldap ldaps libvirt libvirt-tls mdns mountd ms-wbt mysql nfs ntp openvpn pmcd pmproxy pmwebapi pmwebapis pop3s postgresql proxy-dhcp radius rpc-bind samba samba-client smtp ssh telnet tftp tftp-client transmission-client vnc-server wbem-https


Firewalld uses the XML configuration files to determine what files to open for a specific service. Review these files in **/usr/lib/firewalld/services** (or **/etc/firewalld/services** if you provide yours) to recognize the purpose of each:

    cat /usr/lib/firewalld/services/ftp.xml
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

You can forward traffic from one port to another, even on another server.
To forward a port to another on the same server, use:

    firewall-cmd --zone="public" --add-forward-port=port=80:proto=tcp:toport=12345


To forward a port to another ona different server:

1. Activate masquerade in selected zone with the command:

        firewall-cmd --zone=public --add-masquerade
        success

2. Add the forward rule:

        firewall-cmd --zone="public" --add-forward-port=port=80:proto=tcp:toport=8080:toaddr=10.1.52.80
        success


# Advanced configuration with Rich Rules

Services and ports are fine for basic configuration, but may be too limiting for advanced scenarios. Use Rich Rules to gain more control. Rich rules syntax is extensive, and fully documented on the man page **firewalld.richlanguage(5)** (`man firewalld.richlanguage`). Following are the most common use cases.

Use `--add-rich-rule`, `--list-rich-rules` and `--remove-rich-rule` with firewall-cmd command to manage them:

    firewall-cmd --zone=public --add-rich-rule 'rule family="ipv4" source address=192.168.0.14 accept'

Here are some common examples.

1. Allow all traffic from host 192.168.0.14:

        firewall-cmd --zone=public --add-rich-rule rule family="ipv4" source address="192.168.2.2" accept

2. Deny TCP traffic from host 192/160.1.10 to port 22:

        firewall-cmd --zone=public --add-rich-rule rule family="ipv4" source address="192.168.1.10" port port=22 protocol=tcp reject

3. Allow TCP traffic from host 10.1.0.3 to port 80, and forward it locally to port 6532:

        firewall-cmd --zone=public --add-rich-rule rule family=ipv4 source address=10.1.0.3 forward-port port=80 protocol=tcp to-port=6532

4. Forward all traffic on port 80 to port 8080 on host 172.31.4.2 (masquerade should be active on the zone):

        firewall-cmd --zone=public --add-rich-rule rule family=ipv4 forward-port port=80 protocol=tcp to-port=8080 to-addr=172.31.4.2


# Direct interface

For more advanced usage, or for iptables experts, firewalld provides a direct interface that allows you to pass raw iptables chains and rules to it; for example, with a services configuration, you can use the `--permanent` flag to update permanent configuration.


To see all custom chains and rules added to firewalld, use:

    # Show custom chains
    firewall-cmd --direct --get-all-chains
    # Show custom rules
    firewall-cmd --direct --get-all-rules


To add custom chains and rules, use:


    # Add a custom chain:
    firewall-cmd --direct --add-chain table chain
    # Remove a custom chain:
    firewall-cmd --direct --add-rule table chain priority args

You can remove chains or rules with `--remove-chain` and `--remove-rule` commands.

Discussing iptables syntax details goes beyond the scope of this guide. If you want to learn more, you can review the iptables guide on your own: [ipTable guide] (https://www.linode.com/docs/networking/firewalls/control-network-traffic-with-iptables).

# More information

To learn more about Firewalld, read the man pages `firewalld`, `firewall-cmd`, `firewalld.richlanguage`.

You may also want to read [Fedora's Security Guide](http://docs.fedoraproject.org/en-US/Fedora/19/html/Security_Guide/index.html) section about Firewalld ([3.8](http://docs.fedoraproject.org/en-US/Fedora/19/html/Security_Guide/sect-Security_Guide-Using_Firewalls.html))
