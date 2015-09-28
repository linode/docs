---
author:
    name: Linode Community
    email: docs@linode.com
description: 'This guide will introduce you to FirewallD, its notions of zones and services, and show you some basic configuration steps.'
keywords: 'centos firewall,centos firewall config,centos firewall gui,centos configure firewall,Linux,Linode,cloud,firewall,firewalld,Fedora,CentOS,iptables,security'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Monday, September 28th, 2015'
modified: Monday, September 28th, 2015
modified_by:
    name: Linode
title: Introduction to FirewallD on CentOS
contributor:
    name: Florent Houbart
external_resources:
 - '[FirewallD Official Site](http://www.firewalld.org/)'
 - '[RHEL 7 Security Guide: Introduction to FirewallD](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Security_Guide/sec-Using_Firewalls.html#sec-Introduction_to_firewalld)'
 - '[Fedora Wiki: FirewallD](https://fedoraproject.org/wiki/FirewallD)'
---

[FirewallD](http://www.firewalld.org/) is frontend controller for iptables used to implement persistent network traffic rules. It provides command line and graphical interfaces and is available in the repositories of most Linux distributions. Working with FirewallD has two main differences compared to directly controlling iptables:

1.  FirewallD uses *zones* and *services* instead of chain and rules.
2.  It manages rulesets dynamically, allowing updates without breaking existing sessions and connections.

{: .note}
>
>FirewallD is a wrapper for iptables to allow easier management of iptables rules--it is **not** an iptables replacement. While iptables commands are still available to FirewallD, it's recommended to use only FirewallD commands with FirewallD.

 This guide will introduce you to FirewallD, its notions of zones and services, and show you some basic configuration steps.

# Installing and Managing FirewallD

FirewallD is included by default with CentOS 7 and Fedora 20+ but it's inactive. To start the service and enable it on boot:

    sudo systemctl start firewalld
    sudo systemctl enable firewalld


To stop and disable the FirewallD service:

    sudo systemctl stop firewalld
    sudo systemctl disable firewalld

Check the firewall status. The output should say either `running` or `not running`.

    sudo firewall-cmd --state

To view the status of the FirewallD daemon:

    sudo systemctl status firewalld

Example output:

~~~
firewalld.service - firewalld - dynamic firewall daemon
   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled)
   Active: active (running) since Wed 2015-09-02 18:03:22 UTC; 1min 12s ago
 Main PID: 11954 (firewalld)
   CGroup: /system.slice/firewalld.service
           └─11954 /usr/bin/python -Es /usr/sbin/firewalld --nofork --nopid
~~~

To reload a FirewallD configuration:

    sudo firewall-cmd --reload

# Configuring FirewallD

Firewalld is configured with XML files. Except for very specific configurations, you won’t have to deal with them and **firewall-cmd** should be used instead.

Configuration files are located in two directories:

* `/usr/lib/FirewallD` holds default configurations like default zones and common services. Avoid updating them because those files will be overwritten by each firewalld package update.
* `/etc/firewalld` holds system configuration files. These files will overwrite a default configuration.

## Configuration Sets

Firewalld uses two *configuration sets*: runtime and permanent. Changes on runtime configuration are not retained upon restarting FirewallD; changes on permanent configuration are not applied to a live configuration.

By default, `firewall-cmd` commands apply to runtime configuration but using the `--permanent` flag will establish a persistent configuration. To add and activate a permanent rule, you can use one of two methods.

1.  Add the rule to both the permanent and runtime sets.

        sudo firewall-cmd --zone=public --add-service=http --permanent
        sudo firewall-cmd --zone=public --add-service=http

2.  Add the rule to the permanent set and reload FirewallD.

        sudo firewall-cmd --zone=public --add-service=http --permanent
        sudo firewall-cmd --reload

      {: .note}
      >
      >The reload command drops all runtime configurations and applies a permanent configuration. Because firewalld manages the ruleset dynamically, it won’t break an existing connection and session.

## Firewall Zones

Zones allow you to add different sets of rules to different network interfaces. For example, with seperate interfaces for both an internal network and the Internet, you can allow DHCP on an internal zone but only HTTP and SSH on external zone. Any interface not explicitly set to a specific zone will be attached to the default zone.

To view the default zone:

    sudo firewall-cmd --get-default-zone


To change the default zone:

    sudo firewall-cmd --set-default-zone=internal


To see the zones used by your network interface(s):

    sudo firewall-cmd --get-active-zones

Example output:

    public interfaces: ens160


To get all configurations for a specific zone:

    sudo firewall-cmd --zone=public --list-all

Example output:

    public (default, active)
      interfaces: ens160
      sources:
      services: dhcpv6-client http ssh
      ports: 12345/tcp
      masquerade: no
      forward-ports:
      icmp-blocks:
      rich rules:


To get all configurations for all zones:

    firewall-cmd --list-all-zones

Example output:

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
      interfaces: ens160
      sources:
      services: dhcpv6-client http ssh
      ports: 12345/tcp
      masquerade: no
      forward-ports:
      icmp-blocks:
      rich rules:

## Working with Services

FirewallD can allow traffic based on lists of predefined rules for specific network services. The configuration files for the default supported services are located at `/usr/lib/firewalld/services` and custom-made service files would be created in `/etc/firewalld/services`.

To view the default available services:

    sudo firewall-cmd --get-services

As an example, to enable the HTTP service:

    sudo firewall-cmd --zone=public --add-service=http --permanent

## Allowing an Arbitrary Port/Protocol

As an example: Allow TCP traffic on port 12345.

    sudo firewall-cmd --zone=public --add-port=12345/tcp --permanent


## Port Forwarding

The example rule below forwards traffic from port 80 to port 12345 on **the same server**.

    sudo firewall-cmd --zone="public" --add-forward-port=port=80:proto=tcp:toport=12345

To forward a port to **a different server**:

1.  Activate masquerade in the desired zone.

        sudo firewall-cmd --zone=public --add-masquerade

2.  Add the forward rule. This example forwards traffic from local port 80 to port 8080 on *a remote server* located at the IP address: 123.456.78.9.

        sudo firewall-cmd --zone="public" --add-forward-port=port=80:proto=tcp:toport=8080:toaddr=123.456.78.9

# Advanced Configuration

Services and ports are fine for basic configuration but may be too limiting for advanced scenarios. Rich Rules and Direct Interface allow you to add fully custom firewall rules to any zone for any port, protocol, address and action.

## Rich Rules

Rich rules syntax is extensive but fully documented in the [firewalld.richlanguage(5)](https://jpopelka.fedorapeople.org/firewalld/doc/firewalld.richlanguage.html) man page (or see `man firewalld.richlanguage` in your terminal). Use `--add-rich-rule`, `--list-rich-rules` and `--remove-rich-rule` with firewall-cmd command to manage them.

Here are some common examples:

Allow all IPv4 traffic from host 192.168.0.14.

    sudo firewall-cmd --zone=public --add-rich-rule 'rule family="ipv4" source address=192.168.0.14 accept'

Deny IPv4 traffic over TCP from host 192.168.1.10 to port 22.

    sudo firewall-cmd --zone=public --add-rich-rule rule family="ipv4" source address="192.168.1.10" port port=22 protocol=tcp reject

Allow IPv4 traffic over TCP from host 10.1.0.3 to port 80, and forward it locally to port 6532.

    sudo firewall-cmd --zone=public --add-rich-rule rule family=ipv4 source address=10.1.0.3 forward-port port=80 protocol=tcp to-port=6532

Forward all IPv4 traffic on port 80 to port 8080 on host 172.31.4.2 (masquerade should be active on the zone).

    sudo firewall-cmd --zone=public --add-rich-rule rule family=ipv4 forward-port port=80 protocol=tcp to-port=8080 to-addr=172.31.4.2

To list your current Rich Rules:

    sudo firewall-cmd --list-rich-rules

## iptables Direct Interface

For the most advanced usage, or for iptables experts, FirewallD provides a direct interface that allows you to pass raw iptables commands to it. Direct Interface rules are not persistent unless the `--permanent` is used.

To see all custom chains or rules added to FirewallD:

    firewall-cmd --direct --get-all-chains
    firewall-cmd --direct --get-all-rules

Discussing iptables syntax details goes beyond the scope of this guide. If you want to learn more, you can review our [iptables guide](https://www.linode.com/docs/networking/firewalls/control-network-traffic-with-iptables).
