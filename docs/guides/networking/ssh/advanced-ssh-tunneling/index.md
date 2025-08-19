---
slug: advanced-ssh-tunneling
author:
  name: Linode
  email: docs@linode.com
description: 'This guide goes beyond basic SSH uses and teaches the reader how to build configurations for their specific needs.  This guide explains the configuration and usage for creating dynamic tunnels, remote and local forwarding, multi-hop proxies, pivoting, tunneling other protocols through SSH, and working with a few common open-source tools. .'
keywords: ["ssh", "tunneling", "port forwarding", "remote forwarding", "local forwarding", "multi-hop", "pivoting"]
tags: ["ssh", "networking"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-16
title: 'Advanced SSH Tunneling and Port-Forwarding Uses and Configurations'
contributor:
  name: Jan Slezak
  link: https://github.com/scumdestroy
external_resources:
  - '[Official SSH Documentation1](https://www.ssh.com/academy/ssh/tunneling)'
  - '[Link Title 2](http://www.example.net)'
---

[SSH](https://www.ssh.com/) (Secure Shell Protocol) is the standard tool and protocol for logging in to servers remotely, however, when wielded by a knowledgable user, its deep configuration options can increase its potential capabilities tremendously.  This guide will teach you to create secure and encrypted connections in new ways.  These concepts can provide solutions for challenges you may be facing and may inspire changes that simplify your workflow or open new possibilities.  

### Example Use Cases

- Accessing files, services and servers on remote, internal networks over the internet.

- Bypassing firewall rules (egress filters) to access a remote FTP server, even though the firewall only allows outgoing traffic on port 80

- Encrypting traffic that uses unencrypted protocols, such as IRC, IMAP or VNC.

- Encrypting all HTTP traffic, even when on a public network.

- Accessing a MySQL server on an internal network, that only accepts logins from `localhost`

### Before You Begin

{{< note >}}
Many forwarding and tunneling configurations require sudo or root permissions on either or both ends of the connection. Therefore, some steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

    1. Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

    2. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

    3. When choosing ports for SSH tunneling, you should choose ports higher than 1024.  Ports below 1024 are reserved for specific protocols or root processes and may cause conflicts with your SSH process.

This guide will use various IPs and ports that will change depending on the example, your configuration, and your needs. To best prevent confusion, the IP addresses will remain the same and are described below.

- Your local machine, the ssh client: `127.0.0.1` or `localhost` 

- The ssh server, which will serve as the pivot point: `10.10.10.2`

- Destination machine, which is not publicly facing, but is accessible from the SSH server: `10.10.10.100` 

- As many configurations require `sudo` permissions, I will be using the `root` user.

{{< caution >}}
Effective use of tunneling can allow a user to bypass security measures such as firewall rules and gain access to internal services and machines.  This ability is also a double-edged sword, so it is important to disable access to these options in the SSH server configuration when they are not in use, to prevent malicious actors from accessing sensitive data.
{{< /caution >}}

## Preparing SSH for Tunneling

1. On the server, set the SSH configuration file to allow Port-Forwarding.  By default, it is located at `/etc/ssh/ssh_config`.  
  
        AllowTcpForwarding yes
        AllowStreamLocalForwarding yes
        GatewayPorts yes
   
   {{< note >}}
   Possible values for `AllowTcpForwarding` are `yes`, `no`, `remote` (to allow remote forwarding) and `local` (to allow local forwarding)
   
   Possible values for GatewayPorts are `yes` (anyone can connect to remote forwarded ports), `no` (only local connections from server are allowed, this is the Default value) and `clientspecified` (which would be followed with a specific IP address, because leaving it blank would allow anyone to connect)
   
   {{< /note >}}

2. Make sure the machines involved have at least three network interfaces (for example, `loopback`, `eth0` and `tun0`).
   
        ifconfig

3. If access to the SSH server is available, make sure `sshd` is running.
   
        sudo systemctl start sshd

   
   

# Local Port Forwarding

Local port forwarding allows a user to expose local, internal resources to a server.  The remote server can then access that resource quite transparently as if it was within its local network.  For example, a user may want to forward a port (and its attached service) to a corporate web server, an internal mail server's IMAP port, an SMB share, or almost any other service running on an internal network.  

Local port forwarding is denoted by the `-L` option.

        ssh -L local_port:destination:destination_portbash

        ssh -L 8888:10.10.10.100:3306 username@10.10.10.2


In the example above, traffic can be sent to `127.0.0.1:8888` and it will go through the tunnel to `10.10.10.100:3306`

## Dynamic Port Forwarding

This option will use a desired port on a local machine as a SOCKS proxy.  Any connection sent to this port will be forwarded to the SSH server and then to the dynamic port on the destination machine.  Applications can be connected to these dynamic tunnels, through a tool  like `proxychains`, a tool that can force another application's traffic through a specified port or a browser extension like `FoxyProxy`[[[FoxyProxy · GitHub](https://github.com/foxyproxy)], which easily connects the browser to a specified proxy.

Install Proxychains

        sudo apt install proxychains4


Set up dynamic port forwarding with SSH

        ssh -D 9050 user@10.10.10.2


{{< note >}}
For simplicity, use port 9050, the default port used by proxychains in its standard configuration file (found at `/etc/proxychains.conf`). 
{{< /note >}}

Now, applications will run through proxychains as if they are on the destination network that was connected through SSH.  For example, here is how to use Nmap (a common port scanning tool) to perform a basic scan on the previously inaccessible network.

        proxychains nmap 10.10.10.100       


To run a browser through proxychains, [FoxyProxy](https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard/) is a simple solution, available for Firefox and Chromium.  Simply install the add-on by visiting the Add-On page and enable it in the browser's settings.

        Chrome and Chromium-based Browsers: https://chrome.google.com/webstore/detail/foxyproxy-standard/gcknhkkoolaabfmlnjonogaaifnjlfnp?hl=en
        Firefox: https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard/


Once enabled, click on the FoxyProxy icon in the toolbar and go to "**Options**". 

- To add a proxychains set-up to FoxyProxy, click on "**Add**".

- On the next screen, set "**Proxy Type**" to `SOCKS5`.  

- Set "**Proxy IP address**" to `127.0.0.1` or "**localhost**".

- Set "**Port**" to `9050`.

- Choose anything for the proxy's name and color.

- Close the FoxyProxy tab in the browser.

- Click on the FoxyProxy icon in the toolbar. The drop-down options should contain the recently added proxy.  Click on the proxy to force the browser to run through proxychains.

- Previously inaccessible web servers on the intranet's network should now be accessible through the browser.

{{< note >}}

The above options assume you are using the default proxychains settings.  Any changes committed to your local proxychains configuration file should be reflected in your FoxyProxy configuration when setting the "Port" and "Proxy Type".

{{< /note >}}



## Remote Port Forwarding

Remote port forwarding is a similar concept to local port forwarding, however, instead of forwarding a local port and local service to a remote network (ssh server's network), we are instead pulling a remote network's resource to the local machine. In other words, the SSH server will listen for any connection to a specified port and then tunnel any traffic to the local SSH client and forwards it to the destination port.

        ssh -R [REMOTE:]REMOTE_PORT:DESTINATION:DESTINATION_PORT [USER@]SSH_SERVER


Using the example IPs, run the following in the terminal.

        ssh -R 8080:127.0.0.1:3000 user@10.10.10.2

Remote port forwarding is often used to provide access to an internal service to a client outside of that network.  The example above would allow access to a web server running on `10.10.10.100:8080` by sending the browser to `http://127.0.0.1:3000`. 



## Keeping Sessions Alive

It is quite likely that a situation may occur where a connection is momentarily dropped or an IP address changes due to external factors. Unfortunately, the remedy of this situation will require manually re-establishing the connection. As there is no native solution within the SSH client, a following bash script does alleviate this problem.  Using this script, when the connection happens to drop, it will automatically and continuously attempt to reconnect.  Change the values for the `IP` (127.0.0.1), `user`, SSH server (`host`), and `ports` (8080) before running the following in the terminal.

        while true; do
            ssh -N -oExitOnForwardFailure=yes -L 8080:127.0.0.1:8080 user@host
            sleep 1
        done

## Multi-Hop

In certain situations, networks may be inaccessible due to firewalls or ACLs that restrict traffic from specific inbound or outbound ports or IP addresses. In such situations, a configuration consisting of more than one SSH connection may be required.

Chain multiple SSH tunnels together using one command with the `-t` flag.

        ssh -p 8888 user@10.10.10.2 -t ssh -p 8889 user@10.10.10.100 

## Additional SSH Flags

- On slow networks, add  the `-C` flag to enable compression mode.  This will compress all data sent through the connection, resulting in a lesser strain on the network.  SSH will perform identically to a normal session, while the feature works in the background.

- If terminal use is not required through the SSH connection, but rather a browser or another tool, use the flag `-N` to tell SSH not to open an active shell.  This is commonly used with `-n` to put SSH in the background and increases security by preventing any processes from reading from stdin. 

- To enable X11 forwarding, add the `-X` flag.

## Additional Information

- [Official SSH Documentation on using the config file](https://www.ssh.com/academy/ssh/config)

- [Linux man page for ssh](https://linux.die.net/man/1/ssh)

- [sshuttle](https://github.com/sshuttle/sshuttle), an alternative open-source tool that works as a transparent proxy server and supports DNS tunneling.

- [proxychains](https://github.com/haad/proxychains), an open-source tool that forces programs through a proxy.  It supports SOCKS4, SOCKS5, HTTP(S), and Tor.


