---
author:
  name: Sam Mauldin
  email: sam@fluidnode.com
description: 'Use tinc VPN to securely cluster and access services on Ubuntu 14.04 and 15.10'
keywords: 'tinc,vpn,networking,ubuntu'
license: '[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)'
title: 'Secure Clustering with tinc on Ubuntu 14.04 and 15.10'
contributor:
  name: Sam Mauldin
---

tinc is a meshed VPN that can be used to encrypt traffic between a cluster of
Linodes. For example, if you're running a MySQL database, and need more performance,
you can setup a cluster of nodes and secure data as it passes through the network.

## Installing tinc

1. Make sure your systems are up to date.

```
sudo apt-get update
sudo apt-get upgrade
```

2. Then install the tinc package on the nodes you want to connect.

```
sudo apt-get install tinc
```

## Configure tinc

3. Decide what you want to name your network and put it in `/etc/tinc/nets.boot`.

```
echo 'mynetwork' | sudo tee -a /etc/tinc/nets.boot
```

4. Create a directory to put the network configuration files in.

```
sudo mkdir /etc/tinc/mynetwork/
```

5. Make up and down scripts to be run by tinc.

In the tinc-up file, you specify the IP address to be used by each node.
In this example, `192.168.100.xxx` is used.

{: .file }
/etc/tinc/mynetwork/tinc-up
:   ~~~ conf
    #!/bin/bash
    ifconfig $INTERFACE 192.168.100.1 netmask 255.255.255.0
    ~~~

{: .file }
/etc/tinc/mynetwork/tinc-down
:   ~~~ conf
    #!/bin/bash
    ifconfig $INTERFACE down
    ~~~

6. Make sure the `tinc-up` and `tinc-down` files are executable.

```
sudo chmod +x /etc/tinc/mynetwork/tinc-*
```

7. Create a tinc.conf file. You'll need to use a seperate name for every node.
The `ConnectTo` variable specifies which other nodes your server will connect
to directly when it starts.

{: .file }
/etc/tinc/mynetwork/tinc.conf
:   ~~~ conf
    Name=mylinode1
    Device=/dev/net/tun
    ConnectTo=mylinode2
    ConnectTo=mylinode3
    ~~~

8. Create public and private keys for each tinc node.

```
sudo tincd -K -n mynetwork
```

You may leave the key value at default or increase it to 2048 or 4096 for more
security.

9. Add internal and external IP addresses to the public key files.

You'll need to use the IP address you specified earlier in the `tinc-up` file
for each node.

{: .file }
/etc/tinc/mynetwork/hosts/mylinode1
:   ~~~ conf
    Subnet=192.168.100.1 # Replace this with the unique IP specified in tinc-up
    Address=203.0.113.96 # Replace this with your Linode's external IP address that you SSH into.
    -----BEGIN RSA PUBLIC KEY-----
    # Do not edit this part.
    -----END RSA PUBLIC KEY-----
    ~~~

Next, copy each host file to the other nodes in the network. You may wish to
use a file syncing service such as SyncThing or Google Drive to automatically
share these files if you have a large amount of nodes in your network.
It is not neccesary to have every single host in every single node, as the other
nodes will route traffic to these hosts.

10. Start tinc

When you have all the files ready, restart the tinc damon and ping another node
to test.

```
service tinc restart
ping 192.168.100.2
```

If this doesn't work, you may need to open port 655 in your firewall.
