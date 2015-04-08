---
author:
    name: 'Ricardo N Feliciano (FelicianoTech)'
    email: rfeliciano@linode.com
description: A reference for common commands needed for system administration.
keywords: 'sysadmin, system administration, cheat sheet'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Wednesday, April 1st, 2015'
modified_by:
    name: 'Ricardo N Feliciano (FelicianoTech)'
    email: rfeliciano@linode.com
published: 'Wednesday, April 1st, 2015'
title: System Administration Cheat Sheet
---

[Click Here]() to download this table as a PDF.

<style type="text/css">
.center {
	text-align: center;
}

#cs-table {
	width: 100%;
}

#cs-table #col1 {
	background-color: #2D8EC6;
	width: 8%;
}

#cs-table #col2 {
	width: 24%;
}

#cs-table #col3and4 {
	width: 34%;
}

#cs-table thead, #cs-table tbody {
	border: 2px solid #000000;
}
	#cs-table-title {
		background-color: #FFFFFF;
		color: #000000;
		text-align: center;
	}

	#cs-table th ~ th {
		background-color: #000000;
		color: #FFFFFF;
		text-align: center;
	}

	#cs-table tbody th:first-child {
		vertical-align: top;
		padding-left: 5px;
		color: #FFFFFF;
		font-size: 12px;
		font-weight: bold;
	}

	#cs-table tbody tr:nth-child(even) {
		background-color: #F4F4F4;
	}

	#cs-table tbody td {
		border-top: 1px solid #DDDDDD;
		border-left: 1px solid #DDDDDD;
		padding-left: 10px;
		vertical-align: top;
		font-size: 14px;
	}
		#cs-table tbody td:first-child {
			border-left: none;
		}

		#cs-table tbody tr:first-child td {
			border-top: none;
		}
			#cs-table tbody tr:first-child td:nth-child(2) {
				border-left: none;
			}

	#cs-table span.v4note, #cs-table span.v6note {
		font-style: italic;
		font-size: smaller;
	}
		#cs-table span.v4note:before {
			content: "(IPv4)";
		}

		#cs-table span.v6note:after {
			content: "(IPv6)"
		}

#ubuntu:hover {
	color: #DD4814;
}
</style>

<table id="cs-table">
<colgroup>
	<col id="col1">
	<col id="col2">
	<col id="col3and4" span="2">
</colgroup>
<thead>
	<tr>
		<th id="cs-table-title" colspan="2">SysAdmin Cheat Sheet</th>
		<th scope="col">Debian / <span id="ubuntu">Ubuntu</span></th>
		<th scope="col">CentOS / Fedora</th>
	</tr>
</thead>
<tbody>
	<tr>
		<th rowspan="4" scope="rowgroup">Disk I/O</th>
		<td>I/O per disk image.</td>
		<td colspan="2">iostat 1 10</td>
	</tr>
	<tr>
		<td>Top-like I/O monitor.</td>
		<td colspan="2">iotop -bo -n 20</td>
	</tr>
	<tr>
		<td>Sort for the largest files.</td>
		<td colspan="2">sudo du -h -d 2 / | sort -h | tail -n 15</td>
	</tr>
	<tr>
		<td>View deleted files still consuming memory.</td>
		<td colspan="2">lsof -a +L1</td>
	</tr>
</tbody>
<tbody>
	<tr>
		<th rowspan="3" scope="rowgroup">DNS</th>
		<td>Where resolvers and options are set.</td>
		<td>/etc/resolv.conf<br />
		/etc/network/interfaces</td>
		<td>/etc/resolv.conf</td>
	</tr>
	<tr>
		<td>Check for an open resolver.</td>
		<td colspan="2">dig @<strong>&lt;IP&gt;</strong> google.com</td>
	</tr>
	<tr>
		<td>Verify zone transfers.</td>
		<td colspan="2">dig AXFR @<strong>&lt;AUTHORITATIVE_NS&gt;
		&lt;DOMAIN&gt;</strong></td>
	</tr>
</tbody>
<tbody>
	<tr>
		<th rowspan="3" scope="rowgroup">Longview</th>
		<td>API key location.</td>
		<td colspan="2">/etc/linode/longview.key</td>
	</tr>
	<tr>
		<td>Start in debug mode.</td>
		<td>
			service longview stop<br />
			/etc/init.d/longview debug
		</td>
		<td>
			<strong>CentOS 7 & Fedora 20+</strong><br />
			systemctl restart systemd-networkd<br />
			<br />
			<strong>CentOS 6 & Fedora &lt;=19</strong><br />
			service longview stop<br />
			/etc/init.d/longview debug
		</td>
	</tr>
	<tr>
		<td>Log location.</td>
		<td colspan="2">/var/log/linode/longview.log</td>
	</tr>
</tbody>
<tbody>
	<tr>
		<th rowspan="14" scope="rowgroup">Network</th>
		<td>Restart network.</td>
		<td>ifdown eth0 && ifup eth0</td>
		<td>
			<strong>Fedora 21</strong><br />
			systemctl restart systemd-networkd<br />
			<br />
			<strong>CentOS 7 & Fedora 20</strong><br />
			nmcli con reload<br />
			<br />
			<strong>CentOS &lt;=6 Fedora &lt;=19</strong>
			service network restart
		</td>
	</tr>
	<tr>
		<td>Interface info. <span class="v4note"></span></td>
		<td colspan="2">ip addr</td>
	</tr>
	<tr>
		<td>Interface info. <span class="v6note"></span></td>
		<td colspan="2">ip -6 addr</td>
	</tr>
	<tr>
		<td>Routing info. <span class="v4note"></span></td>
		<td colspan="2">ip route</td>
	</tr>
	<tr>
		<td>Routing info. <span class="v6note"></span></td>
		<td colspan="2">ip -6 route</td>
	</tr>
	<tr>
		<td>Neighbor solicitations.</td>
		<td colspan="2">ip -6 neigh</td>
	</tr>
	<tr>
		<td>View iptables rules.</td>
		<td colspan="2">
			iptables-save<br />
			iptables -nv -L --line-numbers
		</td>
	</tr>
	<tr>
		<td>View ip6tables rules.</td>
		<td colspan="2">
			ip6tables-save<br />
			ip6tables -nv -L --line-numbers
		</td>
	</tr>
	<tr>
		<td>Back up, flush, and restore iptables rules.</td>
		<td colspan="2">
			iptables-save > /root/iptbls.save<br />
			iptables -P INPUT ACCEPT<br />
			iptables -P OUTPUT ACCEPT<br />
			iptables -P FORWARD ACCEPT<br />
			iptables -F<br />
			iptables-restore < /root/iptbls.save
		</td>
	</tr>
	<tr>
		<td>Back up, flush, and restore ip6tables rules.</td>
		<td colspan="2">
			ip6tables-save > /root/iptbls.save<br />
			ip6tables -P INPUT ACCEPT<br />
			ip6tables -P OUTPUT ACCEPT<br />
			ip6tables -P FORWARD ACCEPT<br />
			ip6tables -F<br />
			ip6tables-restore < /root/iptbls.save
		</td>
	</tr>
	<tr>
		<td>Force infrastructure to pick up an assigned IP.</td>
		<td colspan="2">
			arping -I eth0 -c3 -b -A <strong>&lt;IP&gt;</strong><br />
			ping -c3 -I <strong>&lt;IP&gt; &lt;GATEWAY&gt;</strong>
		</td>
	</tr>
	<tr>
		<td>
			Test the network speed between two servers.<br />
			<br />
			Useful between data centers. `iperf` would need to be installed.
		</td>
		<td colspan="2">
			On one endpoint, you would start the server:<br />
			<span style="display:block;" class="center">iperf -s</span><br />
			On the other endpoint, you would connect to the server as a
			client:<br />
			<span style="display:block;" class="center">iperf -dc
			<strong>&lt;IP&gt;</strong></span><br />
			`iperf` needs to be installed. You can find instructions in the <a
			href="https://www.linode.com/docs/networking/diagnostics/diagnosing-network-speed-with-iperf">Linode
			Docs</a>
		</td>
	</tr>
	<tr>
		<td>Check for privacy extensions.</td>
		<td colspan="2">cat /proc/sys/net/ipv6/conf/eth0/use_tempaddr</td>
	</tr>
	<tr>
		<td>Check for router advertisement and forwarding.</td>
		<td colspan="2">
			sysctl net/ipv6/conf/eth0<br />
			sysctl -w net.ipv6.conf.eth0.accept_ra = 1
		</td>
	</tr>
</tbody>
<tbody>
	<tr>
		<th rowspan="2">NTP</th>
		<td>Check for an open NTP server.</td>
		<td colspan="2">ntpdc -n -c monlist <strong>&lt;IP&gt;</strong></td>
	</tr>
	<tr>
		<td>Force time sync.</td>
		<td colspan="2">
			/etc/init.d/ntp stop<br />
			ntpdate pool.ntp.org<br />
			/etc/init.d/ntp start
		</td>
	</tr>
</tbody>
<tbody>
	<tr>
		<th rowspan="15">Other</th>
		<td>Check for open ports.</td>
		<td colspan="2">ss -ta</td>
	</tr>
	<tr>
		<td>Verify HTTP response.</td>
		<td colspan="2">curl -I <strong>&lt;HOSTNAME&gt;</strong></td>
	</tr>
	<tr>
		<td>Default Apache user:</td>
		<td>www-data</td>
		<td>apache</td>
	</tr>
	<tr>
		<td>Active Apache vhosts:</td>
		<td>apache2ctl -S</td>
		<td>httpd -S</td>
	</tr>
	<tr>
		<td>Loaded Apache modules:</td>
		<td>apache2ctl -M</td>
		<td>httpd -M</td>
	</tr>
	<tr>
		<td>Update package index.</td>
		<td>apt-get update</td>
		<td>n/a</td>
	</tr>
	<tr>
		<td>Upgrade packages.</td>
		<td>apt-get upgrade</td>
		<td>yum update</td>
	</tr>		
	<tr>
		<td>Upgrade packages with changing dependancies.</td>
		<td>apt-get dist-upgrade</td>
		<td>yum upgrade</td>
	</tr>
	<tr>
		<td>Search for a package.</td>
		<td>apt-cache search <strong>&lt;PACKAGE&gt;</strong></td>
		<td>yum search <strong>&lt;PACKAGE&gt;</strong></td>
	</tr>
	<tr>
		<td>Install a package.</td>
		<td>apt-get install <strong>&lt;PACKAGE&gt;</strong></td>
		<td>yum install <strong>&lt;PACKAGE&gt;</strong></td>
	</tr>
	<tr>
		<td>Check if a package is installed.</td>
		<td>dpkg -s <strong>&lt;PACKAGE&gt;</strong></td>
		<td>yum info <strong>&lt;PACKAGE&gt;</strong></td>
	</tr>
	<tr>
		<td>Security log:</td>
		<td>/var/log/auth.log</td>
		<td>/var/log/secure</td>
	</tr>
	<tr>
		<td>System log:</td>
		<td>/var/log/syslog</td>
		<td>/var/log/messages</td>
	</tr>
	<tr>
		<td>Status for all services.</td>
		<td>service status all</td>
		<td>
			<strong>CentOS 7 & Fedora 21</strong><br />
			systemctl -t service<br />
			<br />
			<strong>CentOS 6 & Fedora &lt;=20</strong><br />
			service status all
		</td>
	</tr>
	<tr>
		<td>Starting & stopping services.</td>
		<td>service <strong>&lt;SERVICE&gt;</strong></td>
		<td>
			<strong>CentOS 7 & Fedora 21</strong><br />
			systemctl start <strong>&lt;SERVICE&gt;</strong>.service<br />
			<br />
			<strong>CentOS 6 & Fedora &lt;=20</strong><br />
			service <strong>&lt;SERVICE&gt;</strong> start
		</td>
	</tr>
</tbody>
</table>
