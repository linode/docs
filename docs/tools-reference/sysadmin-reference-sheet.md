---
author:
    name: 'Ricardo N Feliciano (FelicianoTech)'
    email: rfeliciano@linode.com
description: A reference for common commands needed for system administration.
keywords: 'sysadmin, system administration, cheat sheet'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Wednesday, April 1st, 2015'
modified_by:
    name: 'Ricardo N Feliciano'
    email: rfeliciano@linode.com
published: 'Wednesday, April 1st, 2015'
title: System Administration Reference Sheet
---

This guide is also available as a printer friendly [Cheat Sheet](sysadmin-cheat-sheet).




##Disk IO

{: .table .table-striped .table-bordered 
| Action                               | Command                                    |
|:-------------------------------------|:-------------------------------------------|
| I/O per disk image:                  | iostat 1 10                                |
| Top-like I/O monitor.                | iotop -bo -n 20                            |
| Sort for the largest files.          | sudo du -h -d 2 / \| sort -h \| tail -n 15 |
| View deleted files still consuming memory. | lsof -a +L1 |



##DNS

{: .table .table-striped .table-bordered }
| Action                                     | Command / File                                  |
|:-------------------------------------------|:------------------------------------------------|
| Where resolvers and options are set.<br>**Debian/Ubuntu**<br><br>**CentOS/Fedora** | <br>`/etc/resolv.conf`<br><br>`/etc/network/interfaces` |
| Check for an open resolver.                | dig @**\<IP>** google.com                       |
| Verify zone transfers.                     | dig AXFR @**\<AUTHORITATIVE_NS> \<DOMAIN>**     |


##Linode Longview

{: .table .table-striped .table-bordered }
| Action                                     | Command / File                                  |
|:-------------------------------------------|:------------------------------------------------|
| API key location.                          | `etc/linode/longview.key`                             | 
| Start in debug mode.<br><br>**Debian/Ubuntu**<br><br>**CentOS 7 & Fedora 20+**<br><br>**CentOS 6 & Fedora <=19** | <br><br>service longview stop && /etc/init.d/longview debug<br><br>systemctl stop longview<br><br>service longview stop<br>/etc/init.d/longview debug |
| Log location.                              | `/var/log/linode/longview.log`                        |


##Networking

{: .table .table-striped .table-bordered }
| Action                                          | Command / File                                  |
|:------------------------------------------------|:------------------------------------------------|
| Restart network.<br><br>**Debian/Ubuntu**<br><br>**Fedora 21**<br><br>**CentOS 7 & Fedora 20+**<br><br>**CentOS <=6 Fedora <=19** | <br><br>ifdown eth0 && ifup eth0<br><br>systemctl restart systemd-networkd<br><br>nmcli con reload<br><br>service network restart |
| Interface info. *(IPv4)*                        | ip addr    
| Interface info. *(IPv6)                         | ip -6 addr   
| Routing *(IPv4)*                                | ip -6 addr
| Routing *(IPv4)*                                | ip -6 route
| Neighbor solicitations.                         | ip -6 neigh   
| View iptables rules.                            | iptables-save<br>iptables -nv -L --line-numbers
| View ip6tables rules.                           | ip6tables-save<br>ip6tables -nv -L --line-numbers 
| Back up, flush, and restore iptables rules.     | iptables-save > /root/iptbls.save<br>iptables -P INPUT ACCEPT<br>iptables -P OUTPUT ACCEPT<br>iptables -P FORWARD ACCEPT<br>iptables -F<br>iptables-restore < /root/iptbls.save |
| Back up, flush, and restore ip6tables rules.    | ip6tables-save > /root/iptbls.save<br>ip6tables -P INPUT ACCEPT<br>ip6tables -P OUTPUT ACCEPT<br>ip6tables -P FORWARD ACCEPT<br>ip6tables -F<br>ip6tables-restore < /root/iptbls.save |
| Force infrastructure to pick up an assigned IP. |arping -I eth0 -c3 -b -A **\<IP>**<br>ping -c3 -I **\<IP>** **\<GATEWAY>** |
| Test the network speed between two servers. Requires [iperf](/docs/networking/diagnostics/diagnosing-network-speed-with-iperf) | **From Server A:** <br> iperf -s <br> **From Server B:** <br> iperf -dc **\<IP>** |
| Check for privacy extensions.                   | cat `/proc/sys/net/ipv6/conf/eth0/use_tempaddr` |
| Check for router advertisement and forwarding.  | sysctl net/ipv6/conf/eth0<br>sysctl -w net.ipv6.conf.eth0.accept_ra = 1 | 


##NTP

{: .table .table-striped .table-bordered }
| Action                        | Command / File                                  |
|:------------------------------|:------------------------------------------------|
| Check for an open NTP server. | ntpdc -n -c monlist **\<IP>**                   |
| Force time sync.              | /etc/init.d/ntp stop<br>ntpdate pool.ntp.org<br>/etc/init.d/ntp start |


##Apache

{: .table .table-striped .table-bordered }
| Action                        | Command / File                                  |
|:------------------------------|:------------------------------------------------|
| Check for open ports.         | ss -ta                                          |
| Verify HTTP response.         | curl -I **\<HOSTNAME>**                         |
| Default Apache user<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora** | <br><br>www-data<br>apache |
| Active Apache vhosts<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora** | <br><br>apache2ctl -S<br>httpd -S |
| Loaded Apache modules: <br><br>**Debian/Ubuntu**<br>**CentOS/Fedora** | <br><br>apache2ctl -M<br>httpd -M |


##Package Management

{: .table .table-striped .table-bordered }
| Action                                        | Command / File                                  |
|:----------------------------------------------|:------------------------------------------------|
| Update package index.<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora** | <br><br>apt-get update<br>n/a |
| Upgrade packages.<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora** | <br><br>apt-get upgrade<br>yum update |
| Upgrade packages with changing dependancies.<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora** | <br><br>apt-get dist-upgrade<br>yum upgrade |
| Search for a package.<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora** |<br><br>apt-cache search **\<PACKAGE>**<br>yum search **\<PACKAGE>** |
| Install a package.<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora** | <br><br>apt-get install **\<PACKAGE>**<br>yum install **\<PACKAGE>** |
| Check if a package is installed.<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora** | <br><br>dpkg -s **\<PACKAGE>**<br>yum info **\<PACKAGE>** |


##Other


{: .table .table-striped .table-bordered }
| Action                                                                      | Command / File                                   |
|:----------------------------------------------------------------------------|:-------------------------------------------------|
| Security log:<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora**                 | <br><br>`/var/log/auth.log`<br>`/var/log/secure` |
| Security log:<br><br>**Debian/Ubuntu**<br>**CentOS/Fedora**                 | <br><br>`/var/log/syslog`<br>`/var/log/messages` |
| Status for all services.<br><br>**Debian/Ubuntu**<br>**CentOS 7 & Fedora 21**<br>**CentOS 6 & Fedora <=20** | <br><br>service status all<br>systemctl -t service<br>service status all |
| Starting & stopping services.<br><br>**Debian/Ubuntu**<br>**CentOS 7 & Fedora 21**<br>**CentOS 6 & Fedora <=20** | <br><br>service **\<SERVICE>**<br>systemctl start **\<SERVICE>**.service<br>service **\<SERVICE>** start



