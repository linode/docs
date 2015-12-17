---
author:
  name: Derek Yu
  email: derek@yudesigns.net
description: 'Learn how to configure IP failover with keepalived on CentOS 6'
keywords: 'CentOS,IP Failover,keepalived,HA,High Availability,failover,cluster,floating ip,virtual ip,VIP'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Friday, December 18th, 2015'
modified: Friday, December 18th, 2015
modified_by:
  name: Derek Yu
title: 'Configuring IP failover with keepalived on CentOS 6'
contributor:
  name: Derek Yu
  
  external_resources:
- '[Keepalived] http://www.keepalived.org/'
---

[Keepalived] (http://www.keepalived.org/) is a routing software that works on VRRP ( Virtual Router Redundancy Protocol ) allowing for the high availability of services or systems. Setting up keepalived with [Linodes IP failover](/docs/networking/remote-access), a small cluster of two Linodes can be configured with failover if the master Linode goes offline.

This guide will show you the basic configuration steps to setup keepalived with IP Failover between two Linodes.

{: .note}
>
>IP failover is only available for Linodes within the same datacenter.
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Example use case
A Linode or a service such as nginx or haproxy is accessed through a virtual IP address (also known as a 'floating IP Address') that is assigned to the master Linode. Keepalived monitors the Linode system or service, checking on their status. If the master Linode or service fails, keepalived reassigns the virtual IP address from the master Linode to the backup Linode.

## Before You Begin

For Linode1 and Linode2, the Public and Private network interfaces need to be configured with [static IPs](https://www.linode.com/docs/networking/linux-static-ip-configuration).

## Example network scenario
* Linode1: 1.1.1.1/24 (eth0) 192.168.1.1/17 (eth0:1) Master
* Linode2: 2.2.2.2/24 (eth0) 192.168.1.2/17 (eth0:1) Backup
* Virtual IP - to be requested from Linode

Please replace the IP addresses in the example with the Public and Private IP addresses of your Linodes.

## Requesting the virtual IP

To request the virtual IP on Linode, submit an 'Additional IP Justification' support ticket from the Dashboard.

1. Log in to the Linode Manager.
2. Select a Master Linode (Server1).
3. Click on the **Remote Access** tab.
4. In the **Public IP** section, click **IP Add**  

* Summary: Additional IP Justification (should already be populated with the summary text)
* Regarding: Select the Linode server that will be the master Linode from the dropdown
* Description: Write your justification for the additional public IP address.

Once the request has been approved by Linode, go back to the **Remote Access** tab, and click on the **IP Add** link in the **Public IP** section.
This will create the virtual IP.

{: .note}
>
>The virtual IP does not need to be configured on a network interface on the master Linode.

## Add IP failover to the backup Linode
On the backup Linode (Linode2), add the virtual IP as the IP Failover.

1. Log in to the Linode Manager.
2. Select a Backup Linode (Server2).
3. Click on the **Remote Access** tab.
4. In the **Public IP** section, click **IP Failover**  
5. Add a checkmark in the box next to the virtual IP (second IP on Linode1), and click **Save Changes**.

### Reminder:
* Linode1: 1.1.1.1/24 (eth0) 192.168.1.1/17 (eth0:1) Master 
* Linode2: 2.2.2.2/24 (eth0) 192.168.1.2/17 (eth0:1) Backup
* Virtual IP - 3.3.3.3/24

## Preparation and installation of keepalived
Firstly, we have to allow packets to be forwarded between network interfaces.

{: .file}
/etc/sysctl.conf
:   ~~~ conf
    net.ipv4.ip_forward = 1 
    ~~~

Then add this line to the end of the file to make the virtual IP address bindable.

{: .file}
/etc/sysctl.conf
:   ~~~ conf
    net.ipv4.ip_nonlocal_bind = 1 
    ~~~

Run the following command to activate the setting.

    sudo sysctl -p

Install keepalived and required packages, on both servers.

    sudo yum install gcc kernel-headers kernel-devel keepalived ipvsadm

Next run the following to see if the Kernel supports LVS

    sudo ipvsadm --version

If the version number is displayed as follows, you can skip the custom kernel setup, and proceed with the keepalived configuration.

**Sample output**

    ipvsadm v1.26 2008/5/15 (compiled with popt and IPVS v1.2.1)

If you get the following, proceed to the custom kernel setup.

**Sample output**

    FATAL: Module ip_vs not found.
    Can't initialize ipvs: Protocol not available
    Are you sure that IP Virtual Server is built in the kernel or as module?

## Custom kernel setup
Keepalived requires LVS (ip_vs module) to be installed on the Linodes, however the Linode supplied kernel does not support this.
Follow the instructions from [this document](https://www.linode.com/docs/tools-reference/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub#centos-6-and-newer) to install a custom kernel.

Once that is done, run the `sudo ipvsadm --version` command again.

## Configuring keepalived

If you have not already done so, reboot both Linodes from the Linode dashboard to confirm that the private and public static IP addresses are set correctly on the network interfaces.

Below are sample configurations for keepalived.

### Sample configuration for Linode1

{: .file}
/etc/keepalived/keepalived.conf
:   ~~~ conf
    vrrp_instance VI_1 {
        interface eth0
        state MASTER
        priority 101

        virtual_router_id 33

        unicast_src_ip 192.168.1.1
        unicast_peer {
            192.168.1.2
        }

        authentication {
            auth_type PASS
            auth_pass 123456
        }

        virtual_ipaddress {
            3.3.3.3
        }
    }
    ~~~

### Sample configuration for Linode2

{: .file}
/etc/keepalived/keepalived.conf
:   ~~~ conf
    vrrp_instance VI_1 {
        interface eth0
        state BACKUP
        priority 100

        virtual_router_id 33

        unicast_src_ip 192.168.1.2
        unicast_peer {
            192.168.1.1
        }

        authentication {
            auth_type PASS
            auth_pass 123456
        }

        virtual_ipaddress {
            3.3.3.3
        }
    }
    ~~~

{: .note}
>
>The master Linode should have a higher priority (101) than the backup Linode (100).
>As multicast is not supported, unicast is specified between the two Linodes.
>Replace `auth_pass` with your own password. The password is used to authenticate the Linodes for failover syncrhonization, and should be the same on both Linodes. Long passwords may be used, but only the first eight (8) characters are used.

Start keepalived:

    sudo service keepalived start

Configure keepalived to autostart after on system boot
	
    sudo chkconfig keepalived on

## Check the virtual IP
The virtual IP should only be assigned to the master Linode.
From Linode1, run the following command to confirm the virtual IP has been assigned to eth0

    ip addr show eth0

You should see a line with the virtual IP in the output similar to:

    inet 3.3.3.3/32 scope global eth0

This line should not be present in the backup Linode2.

The logs in `/var/log/messages` would also show the virtual IP registered.
Watch for a line similar to:
	
    Netlink reflector reports IP 3.3.3.3 added

## Verify IP Failover

Shutdown Linode1 and see if the virtual IP is assigned to Linode2.
You can check the IP assignment from:

    ip addr show eth0

or run:

    sudo tail /var/log/messages

Then start up Linode1 from the Linode dashboard, and confirm that the virtual IP is assigned back on Linode1.

## Keepalived monitoring services

To configure keepalived to failover to the backup Linode when a service such as nginx or haproxy is down, edit the `/etc/keepalived/keepalived.conf` as follows:

### Sample configuration for Linode1 to monitor nginx service

{: .file}
/etc/keepalived/keepalived.conf
:   ~~~ conf
    vrrp_script chk_nginx {  
        script "pidof nginx"  
        interval 2
    }

    vrrp_instance VI_1 {
        interface eth0
        state MASTER
        priority 101

        virtual_router_id 33

        unicast_src_ip 192.168.1.1
        unicast_peer {
            192.168.1.2
        }

        authentication {
            auth_type PASS
            auth_pass 123456
        }

        virtual_ipaddress {
            3.3.3.3
        }
		
        track_script {
            chk_nginx
        }
    }
    ~~~

Make the same changes for Linode2 by adding the `vrrp_script` block and `track_script` block.

The vrrp_script block tells keepalived to monitor nginx every 2 seconds, checking if the nginx process has a pid (i.e. nginx is running).
To check on a different service such as haproxy, replace nginx with haproxy.

## Verify IP Failover

To test nginx failover, run `sudo service nginx stop` and see if the virtual IP is assigned to Linode2.
You can check the IP assignment from:

    ip addr show eth0

or run:

    sudo tail /var/log/messages

Then start up nginx by running `sudo service nginx start`, and confirm that the virtual IP is assigned back on Linode1.

Failover using keepalived should now be successfully setup between both Linodes.
