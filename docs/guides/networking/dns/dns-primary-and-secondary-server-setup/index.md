---
slug: dns-primary-and-secondary-server-setup
title: "How to Configure DNS Primary and Secondary Servers"
description: 'Two to three sentences describing your guide.'
keywords: ['dns primary and secondary server setup','dns primary server','domain name service','linux dns server','dns secondary server','configuring dns','install dns']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["David Robert Newman"]
published: 2023-05-17
modified_by:
  name: Linode
external_resources:
- '[Systran Box: Checking Your DNS Configuration In Linux: A Step-by-Step Guide](https://www.systranbox.com/checking-your-dns-configuration-in-linux-a-step-by-step-guide/)'
- '[LinuxTeck: How to Install and configure Master /Slave DNS in Centos /RHEL 7.6](https://www.linuxteck.com/how-to-install-and-configure-master-slave-dns-in-centos-rhel-7-6/)'
---

A single web server or a database going offline is a pain, but what if all your services became unreachable? That’s exactly what happens when Domain Name System (DNS) servers stop working.

Because networked services depend on DNS, it’s critical to add one or more secondary name servers for redundancy. Hardening your DNS servers to protect against rogue updates and hiding your primary name server also helps ensure smooth DNS operation.

The "An Introduction to DNS on Linux” guide explains how DNS works and how to build a primary name server. This guide walks you through configuration of a secondary name server for redundancy, the use of secret keys for authentication, and the use of a hidden primary name server for protection against attack.

## Before You Begin

1.  Follow our [Introduction to DNS on Linux](/docs/guides/dnssec) guide to set up a functional primary name server (`ns1.example.com`).

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides. This guide is for Ubuntu 22.04 LTS instances.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access. To follow along with this guide, give your server the hostname `ns2.example.com`, replacing `example.com` with your own domain name. Also be sure to configure the hosts file with your hostname and external IP addresses.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< file "/etc/hosts" aconf >}}
192.0.2.0/24      # Sample IP addresses
198.51.100.0/24
203.0.113.0/24
{{< /file >}}

## Prepare the Primary DNS Server

Before building the secondary name server, configure the primary name server to send zone updates to it, and only to it. To do this, configure a secret key that authenticates communications between primary and secondary name servers. The sample `nsd.conf` file includes a comment showing how to generate a random string for use as a key.

1.  Run this command on your primary name server:

    ```command {title="ns1"}
    dd if=/dev/random of=/dev/stdout count=1 bs=32 | base64
    ```

    The output should be similar to this:

    ```output
    7Q7KLOi44zuTjK/RavkFECLgglv6qkwN2y1GOdWFE/A=
    1+0 records in
    1+0 records out
    32 bytes copied, 0.00053066 s, 60.3 kB/s
    ```

    Copy and record the random string (`7Q7K...`).

1.  Open the Name Server Daemon (NSD) configuration file `/etc/nsd/nsd.conf`:

    ```command {title="ns1"}
    sudo nano /etc/nsd/nsd.conf
    ```

1.  Find and uncomment the `key:` section and add the following lines below it. For the `secret:` value, use the random value generated above, in quotations.

    ```file {title="/etc/nsd/nsd.conf"}
    key:
        name: "secretkey0"
        algorithm: hmac-sha256
        secret: "7Q7KLOi44zuTjK/RavkFECLgglv6qkwN2y1GOdWFE/A="
    ```

    {{< note >}}
This is not an actual secret key. Never paste secret or private keys into any public posting.
    {{< /note >}}

1.  Next, uncomment the `pattern:` section. A pattern is a macro that stores options for all zones. In this example, only one zone is being set up. However, in production, where an NSD server may handle dozens to thousands of zones, patterns can save much repetitive typing.

    Before defining a pattern, spin up another Linode as your secondary server. It can be the same size as your primary server. Note the IPv4 address of your secondary server so you can use it in the pattern definition.

    Add these lines to create a pattern. This pattern tells this primary name server to notify a secondary name server of zone updates, and to respond to zone transfer requests from a specific nameserver. Both actions use your secret key.

    ```file {title="/etc/nsd/nsd.conf"}
    pattern:
    	    name: "secondary_outbound"
    	    notify: 192.0.2.3 secretkey0
    	    provide-xfr: 192.0.2.3 secretkey0
    ```

    If you have more secondary name servers, add them here with `notify` and `provide-xfr` statements for each.

1.  Modify any `zone:` statements to use the pattern(s):

    ```file {title="/etc/nsd/nsd.conf"}
    zone:
    	    name: "linoderocks.com"
    	    zonefile: "zones/master/linoderocks.com.zone"
    	    include-pattern: "secondary_outbound"
    ```

    When done, save and close the file.

1.  Check the file's syntax with `nsd-checkconf`:

    ```command {title="ns1"}
    nsd-checkconf /etc/nsd/nsd.conf
    ```

1.  If the file returns no errors, restart the NSD server:

    ```command {title="ns1"}
    sudo systemctl restart nsd
    ```

Now move on to secondary name server configuration.

## Secondary Name Server Setup

This guide assumes that the Ubuntu 22.04 LTS secondary name server has a hostname of `ns2.yourdomainhere.com` and that you know its IP addresses.

The new server can be in the same data center as the primary, but it doesn’t have to be. In fact, having name servers in different geographic locations helps protect against disasters in any one area. The tradeoff may be increased latency for some lookups.

1.  On this new server, open an ssh session and install NSD:

    ```command
    sudo apt install nsd
    ```

1.  Configure the NSD control utility, `nsd-config`:

    ```command
    sudo nsd-control-setup
    ```

    You should see output like this:

    ```output
    setup in directory /etc/nsd
    removing artifacts
    Setup success. Certificates created.
    ```

    If not, check `/var/log/syslog` for errors.

1.  Copy `nsd.conf` to the secondary name server from the primary nameserver using the `scp` secure-copy utility, substituting your domain name for `linoderocks.com`:

    ```command
    sudo scp root@ns1.linoderocks.com:/etc/nsd/nsd.conf /etc/nsd
    ```

1.  Next, note `ns2`’s IP addresses. You don’t need to use `sudo` here.

    ```command
    ip a
    ```

1.  Open `/etc/nsd/nsd.conf`:

    ```command
    sudo nano /etc/nsd/nsd.conf
    ```

1.  Modify the `ip-address` statements to use the secondary server’s addresses. For example, if your primary and secondary servers have IPv6 addresses, you should include the secondary server’s IPv6 address here:

    ```file{title="/etc/nsd/nsd.conf"}
    ip-address: 192.0.2.3
    ip-address: 2001:DB8::3
    ```

    The rest of the `server:`, `remote-control:`, and `key:` sections don’t require any additional changes. However, you do need to modify the `pattern:` and `zone:` sections.

1.  All three lines in the `pattern:` section need to be changed. First, change the pattern name using something specific to the secondary name server. Second, change the `notify` statement to `allow-notify`, followed by the primary name server’s IP address. Finally, change `provide-xfr` to `request-xfr` and also add the AXFR transfer type. [AXFR](https://www.rfc-editor.org/rfc/rfc5936) is the DNS zone transfer protocol. Here is the updated pattern section:

    ```file{title="/etc/nsd/nsd.conf"}
    pattern:
    	    name: "secondary_inbound"
    	    allow-notify: 96.126.102.178 secretkey0
    	    request-xfr: AXFR 96.126.102.178 secretkey0
    ```

1.  In the `zone:` section, point to a zone file in the secondary directory, and use the new pattern name you defined for this secondary name server. Here and in all subsequent examples, substitute your domain name for `linoderocks.com`.

    ```file{title="/etc/nsd/nsd.conf"}
    zone:
    	    name: "linoderocks.com"
    	    zonefile: "zones/secondary/linoderocks.com.zone"
    	    include-pattern: "secondary_inbound"
    ```

    When complete, save and close the file.

1.  Check the configuration:

    ```command
    nsd-checkconf /etc/nsd/nsd.conf
    ```

1.  If that succeeds, restart NSD:

    ```command
    sudo systemctl restart nsd
    ```

## Test Both Name Servers

You can verify both name servers work as intended with two tests. First, run queries against both name servers to verify both respond with DNS records. Second, add a new record on the primary name server and verify that it propagates to the secondary name server.

For both tests, use the dig utility, which comes included in the Linode distribution of Ubuntu 22 LTS. Since you don’t need the fairly verbose output dig produces by default, use the +short argument in all these commands. Also, you can query a specific name server by prepending the @ character to any hostname.

1.  Here is a sample query against the primary name server:

    ```command
    dig john.linoderocks.com +short @ns1.linoderocks.com
    ```

    ```output
    192.0.2.10
    ```

1.  Now run the same test against the secondary name server:

    ```command
    dig john.linoderocks.com +short @ns2.linoderocks.com
    ```

    ```output
    192.0.2.10
    ```

    Congratulations! You have a working primary and secondary name server. Next, verify transfers work between the primary and secondary name servers by adding a new resource record on the primary name server.

1.  On the primary name server, open the zone file for `linoderocks.com` (`/etc/nsd/zones/master/linoderocks.com.zone`):

    ```command
    sudo nano /etc/nsd/zones/master/linoderocks.com.zone
    ```

1.  Increment the zone file’s serial number. This is very important as NSD does not load changes to your zone unless the zone file’s serial number increments. In this example, simply increment the serial number’s final digit by 1:

    ```file{title="/etc/nsd/zones/master/linoderocks.com.zone"}
    Old: 2023030800
    New: 2023030801

1.  Then add an A record for a new host:

    ```file{title="/etc/nsd/zones/master/linoderocks.com.zone"}
    brian	        A       96.126.102.183
    ```

    When finished, save and close the file.

1.  Reload the zone:

    ```command
    sudo nsd-control reload linoderocks.com
    ```

1.  Run a `dig` query on the secondary name server for the new hostname:

    ```command
    dig -t a brian.linoderocks.com +short @ns2.linoderocks.com
    ```

    ```output
    192.0.2.15
    ```

    This validates automatic zone transfers. Even if you have 100 secondary name servers, you would only need to make changes on the primary name server, and you’d still see output like this on every secondary name server.

## Hidden Primary Name Server Configuration

A hidden primary name server works the same way as your current primary when it comes to zone transfers: All secondary name servers still get zone updates from it. The only difference is that you never list a hidden primary in the public DNS. It’s neither authoritative for any zone, nor do you delegate any authority to it at your registrar. Instead, all the “authoritative” name servers you list, both in registrar delegations and in each zone’s NS records, are actually secondary name servers that receive updates from the hidden primary.

Because attackers don’t know the hidden primary exists, they can’t try to compromise your configuration or zone files. Of course, you still need to update Linux and protect access to the hidden primary, as with any system.

Make use of the two name servers you have by converting them to secondaries, and spinning up a third Linode to serve as the new hidden primary, like this:

-   ns1.linoderocks.com (secondary)
-   ns2.linoderocks.com (secondary)
-   ns3.linoderocks.com (hidden primary)

There is no requirement that the hidden primary reside in the same data center as either of the secondaries. However, if one or more name servers are in the same data center, they can use private addresses (e.g. `192.168.173.25`), which aren’t routable on the public Internet, for zone transfers.

1.  Create a new `ns3.linoderocks.com` Linode, then open an ssh session and install NSD:

    ```command
    sudo apt install nsd
    ```

1.  Configure the NSD control utility, `nsd-config`:

    ```command
    sudo nsd-control-setup
    ```

    You should see output like this:

    ```output
    setup in directory /etc/nsd
    removing artifacts
    Setup success. Certificates created.
    ```

    If not, check `/var/log/syslog` for errors.

1.  Copy `nsd.conf` from `ns1.linoderocks.com` (the original primary name server) using the `scp` secure-copy utility. Also copy the entire zones directory structure:

    ```command
    sudo scp root@ns1.linoderocks.com:/etc/nsd/nsd.conf /etc/nsd
    sudo scp -r root@ns1.linoderocks.com:/etc/nsd/zones /etc/nsd
    ```

1.  Note `ns3`’s IP addresses.

    ```command
    ip a
    ```

1.  In `/etc/nsd/nsd.conf`, replace the existing ip-address statements with `ns3`'s addresses, including IPv6 addresses if you’ve configured them:

    ```file{title="/etc/nsd/nsd.conf"}
    ip-address: 192.0.2.4
    ip-address: 2001:DB8::4
    ```

1.  Next, update the pattern statement to point to both existing servers as secondaries:

    ```file{title="/etc/nsd/nsd.conf"}
    pattern:
            name: "secondary_outbound"
            # transfers to ns1.linoderocks.com
       notify: 192.0.2.2 secretkey0
            provide-xfr: 192.0.2.2 secretkey0
            # transfers to ns2.linoderocks.com
            notify: 192.0.2.3 secretkey0
            provide-xfr: 192.0.2.3 secretkey0
    ```

    When done, save and close the file, but don’t restart NSD just yet. First, you need to configure both existing name servers to pull updates from `ns3`, and also change `ns1` from a primary to a secondary name server.

1.  On both `ns1` and `ns2`, edit `/etc/nsd/nsd.conf` so the pattern and zone statements indicate these are now secondary servers, and that they are to get their updates from `ns3`:

    ```file{title="/etc/nsd/nsd.conf"}
    pattern:
            name: "secondary_inbound"
            allow-notify: 192.0.2.3 secretkey0
            request-xfr: AXFR 192.0.2.3 secretkey0

    zone:
            name: "linoderocks.com"
            zonefile: "zones/secondary/linoderocks.com.zone"
            include-pattern: "secondary_inbound"
    ```

    When complete, save and close the files on both `ns1` and `ns2`.

1.  Restart NSD on all three name servers:

    ```command
    sudo systemctl restart nsd
    ```

From now on, any changes you make on the hidden primary ()`ns3`) propagate to the secondary name servers (`ns1` and `ns2`). As before, you can verify this by adding a new resource record to the `linoderocks.com` zone file on `ns3`. After reloading the zone, you should be able to query either secondary name server and see the new record.

You don’t need to make any changes at your domain registrar. To anyone on the public Internet, the now-secondary name servers at `ns1` and `ns2` are still authoritative for `linoderocks.com`.

## Conclusion

Redundancy is important for any networked service, but none more so than the DNS. Given the dependency of virtually all other services on a functioning DNS infrastructure, it’s important to ensure the loss of any one name server doesn’t affect availability. And given the critical role of the primary name server, security measures such as secret keys and a hidden-primary design maximize uptime not only for your DNS servers but also for all the services that depend on it.