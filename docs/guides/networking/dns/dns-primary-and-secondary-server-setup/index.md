---
slug: dns-primary-and-secondary-server-setup
title: "How to Configure DNS Primary and Secondary Servers"
description: 'Enhance website reliability and performance by creating a secondary name server, along with a hidden primary, using NSD on Ubuntu. ✓ Click here!'
keywords: ['dns primary and secondary server setup','dns primary server','domain name service','linux dns server','dns secondary server','configuring dns','install dns']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["David Robert Newman"]
published: 2023-06-09
modified_by:
  name: Linode
external_resources:
- '[Systran Box: Checking Your DNS Configuration In Linux: A Step-by-Step Guide](https://www.systranbox.com/checking-your-dns-configuration-in-linux-a-step-by-step-guide/)'
- '[LinuxTeck: How to Install and configure Master /Slave DNS in Centos /RHEL 7.6](https://www.linuxteck.com/how-to-install-and-configure-master-slave-dns-in-centos-rhel-7-6/)'
---

A single web server or a database going offline is a hassle, but what if all services became unreachable? That’s exactly what happens when Domain Name System (DNS) servers stop working.

Because networked services depend on DNS, it’s critical to add one or more secondary name servers for redundancy. Hardening DNS servers to protect against rogue updates and hiding the primary name server also helps ensure smooth DNS operation.

Our guide [An Introduction to DNS on Linux](/docs/guides/introduction-to-dns-on-linux) explains how DNS works and how to build a primary name server. This guide configures a secondary name server for redundancy, adds secret keys for authentication, and a hidden primary name server for protection against attacks.

## Before You Begin

1.  Follow our Introduction to DNS on Linux(/docs/guides/introduction-to-dns-on-linux) guide to set up a functional primary name server (`ns1`).

1. Create two Compute instances for our secondary name servers. This guide requires two new Ubuntu 22.04 LTS instances (`ns2` and `ns3`) in addition to the primary name server (`ns1`).

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your systems. Also set the timezone, configure your hostnames, and create limited user accounts. To follow along with this guide, give your servers the hostnames `ns2` and `ns3`. Make them part of the `yourdomainhere.com` domain (e.g. `ns2.yourdomainhere.com` and `ns3.yourdomainhere.com`, replacing `yourdomainhere.com` with your actual domain name). Also be sure to configure the hosts files with your hostnames and external IP addresses.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Prepare the Primary DNS Server

Before setting up the secondary name server, configure the primary name server to send zone updates to it, and only it. To do this, configure a secret key that authenticates communications between primary and secondary name servers. The sample `nsd.conf` file includes a comment showing how to generate a random string for use as a key.

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

    Copy and record the random string (e.g. `7Q7KLOi44zuTjK/RavkFECLgglv6qkwN2y1GOdWFE/A=`).

1.  Open the Name Server Daemon (NSD) configuration file `/etc/nsd/nsd.conf`:

    ```command {title="ns1"}
    sudo nano /etc/nsd/nsd.conf
    ```

1.  Find and uncomment the `key:` section. Uncomment the `name` statement and give the key a name (e.g. `secretkey0`). Uncomment the `algorithm` statement and enter `hmac-sha256`. Uncomment the `secret:` statement and use the random value generated above, in quotations.

    ```file {title="/etc/nsd/nsd.conf" hl_lines="1,3,5,9"}
    key:
        # The key name is sent to the other party, it must be the same
        name: "secretkey0"
        # algorithm hmac-md5, or sha1, sha256, sha224, sha384, sha512
        algorithm: hmac-sha256
        # secret material, must be the same as the other party uses.
        # base64 encoded random number.
        # e.g. from dd if=/dev/random of=/dev/stdout count=1 bs=32 | base64
        secret: "7Q7KLOi44zuTjK/RavkFECLgglv6qkwN2y1GOdWFE/A="
    ```

    {{< note >}}
This is not an actual secret key. Never paste secret or private keys into any public posting.
    {{< /note >}}

1.  Next, uncomment the `pattern:` section. A pattern is a macro that stores options for all zones. In this example, only one zone is set up. However, in production, where an NSD server may handle dozens to thousands of zones, patterns can save a lot of repetitive typing.

    Uncomment these lines to create a pattern, replacing `192.0.2.3` with the external IP address of `ns2`:

    ```file {title="/etc/nsd/nsd.conf" hl_lines="1,3,27,30"}
    pattern:
            # name by which the pattern is referred to
            name: "secondary_outbound"
            # the zonefile for the zones that use this pattern.
            # if relative then from the zonesdir (inside the chroot).
            # the name is processed: %s - zone name (as appears in zone:name).
            # %1 - first character of zone name, %2 second, %3 third.
            # %z - topleveldomain label of zone, %y, %x next labels in name.
            # if label or character does not exist you get a dot '.'.
            # for example "%s.zone" or "zones/%1/%2/%3/%s" or "secondary/%z/%s"
            #zonefile: "%s.zone"

            # The allow-query allows an access control list to be specified
            # for a zone to be queried. Without an allow-query option, any
            # IP address is allowed to send queries for the zone.
            # This could be useful for example to not leak content from a zone
            # which is only offered for transfer to secondaries over TLS.
            #allow-query: 192.0.2.0/24 NOKEY

            # If no master and slave access control elements are provided,
            # this zone will not be served to/from other servers.

            # A master zone needs notify: and provide-xfr: lists.  A slave
            # may also allow zone transfer (for debug or other secondaries).
            # notify these slaves when the master zone changes, address TSIG|NOKEY
            # IP can be ipv4 and ipv6, with @port for a nondefault port number.
            notify: 192.0.2.3 secretkey0
            # allow these IPs and TSIG to transfer zones, addr TSIG|NOKEY|BLOCKED
            # address range 192.0.2.0/24, 1.2.3.4&255.255.0.0, 3.0.2.20-3.0.2.40
            provide-xfr: 192.0.2.3 secretkey0
    ```

    This pattern tells the primary name server to notify a secondary name server of zone updates, and to respond to zone transfer requests from a specific nameserver. Both actions use your secret key.

    If you have more secondary name servers, add them here with `notify` and `provide-xfr` statements for each.

1.  Modify any `zone:` statements to use the pattern(s):

    ```file {title="/etc/nsd/nsd.conf" hl_lines="5"}
    zone:
            name: "yourdomainhere.com"
            # you can give a pattern here, all the settings from that pattern
            # are then inserted at this point
            include-pattern: "secondary_outbound"
            # You can also specify (additional) options directly for this zone.
            zonefile: "zones/master/yourdomainhere.com.zone"
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd> then <kbd>Y</kbd> and <kbd>Enter</kbd> to save and close the file.

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

This guide assumes that the Ubuntu 22.04 LTS secondary name server has a hostname of `ns2` and that you know its IP addresses.

The new server can be in the same data center as the primary, but it doesn’t have to be. In fact, having name servers in different geographic locations helps protect against disasters in any one area. The tradeoff may be increased latency for some lookups.

1.  Open an SSH session on the new secondary name server (`ns2`) and install NSD:

    ```command {title="ns2"}
    sudo apt install nsd
    ```

1.  Configure the NSD control utility, `nsd-config`:

    ```command {title="ns2"}
    sudo nsd-control-setup
    ```

    The output should appear as follows:

    ```output
    setup in directory /etc/nsd
    removing artifacts
    Setup success. Certificates created.
    ```

    If not, check `/var/log/syslog` for errors.

1.  Copy `nsd.conf` to the secondary name server from the primary nameserver using the `scp` secure-copy utility, substituting your domain name for `yourdomainhere.com`:

    ```command {title="ns2"}
    sudo scp root@ns1.yourdomainhere.com:/etc/nsd/nsd.conf /etc/nsd
    ```

1.  Gather `ns2`'s external IPv4 and IPv6 addresses. Follow this guide to [Find Your Linode's IP Address](/docs/guides/find-your-linodes-ip-address) or use the following command:

    ```command {title="ns2"}
    ip a
    ```

1.  Open `/etc/nsd/nsd.conf`:

    ```command {title="ns2"}
    sudo nano /etc/nsd/nsd.conf
    ```

1.  Modify the `ip-address` statements in the `server:` section to use the secondary server’s (`ns2`) IP addresses, including IPv6 addresses if you’ve configured them:

    ```file{title="/etc/nsd/nsd.conf" hl_lines="26-27"}
    server:
            # Number of NSD servers to fork.  Put the number of CPUs to use here.
            # server-count: 1

            # Set overall CPU affinity for NSD processes on Linux and FreeBSD.
            # Any server/xfrd CPU affinity value will be masked by this value.
            # cpu-affinity: 0 1 2 3

            # Bind NSD server(s), configured by server-count (1-based), to a
            # dedicated core. Single core affinity improves L1/L2 cache hits and
            # reduces pipeline stalls/flushes.
            #
            # server-1-cpu-affinity: 0
            # server-2-cpu-affinity: 1
            # ...
            # server-<N>-cpu-affinity: 2

            # Bind xfrd to a dedicated core.
            # xfrd-cpu-affinity: 3

            # Specify specific interfaces to bind (default are the wildcard
            # interfaces 0.0.0.0 and ::0).
            # For servers with multiple IP addresses, list them one by one,
            # or the source address of replies could be wrong.
            # Use ip-transparent to be able to list addresses that turn on later.
            ip-address: 192.0.2.3
            ip-address: 2001:DB8::3
    ```

    The rest of the `server:`, `remote-control:`, and `key:` sections don’t require any additional changes, but the `pattern:` and `zone:` sections do.

1.  First, change the `pattern:` `name` to something specific to the secondary name server (e.g. `secondary_inbound`). Comment out the `notify` and `provide-xfr` statements. Uncomment the `allow-notify` statement and change its value to the primary name server’s (`ns1`) IP address followed by `secretkey0`. Do the same to the `request-xfr` statement, but also add the AXFR transfer type. [AXFR](https://www.rfc-editor.org/rfc/rfc5936) is the DNS zone transfer protocol. Here is the updated pattern section:

    ```file{title="/etc/nsd/nsd.conf" hl_lines="3,27,30,39,44"}
    pattern:
            # name by which the pattern is referred to
            name: "secondary_inbound"
            # the zonefile for the zones that use this pattern.
            # if relative then from the zonesdir (inside the chroot).
            # the name is processed: %s - zone name (as appears in zone:name).
            # %1 - first character of zone name, %2 second, %3 third.
            # %z - topleveldomain label of zone, %y, %x next labels in name.
            # if label or character does not exist you get a dot '.'.
            # for example "%s.zone" or "zones/%1/%2/%3/%s" or "secondary/%z/%s"
            #zonefile: "%s.zone"

            # The allow-query allows an access control list to be specified
            # for a zone to be queried. Without an allow-query option, any
            # IP address is allowed to send queries for the zone.
            # This could be useful for example to not leak content from a zone
            # which is only offered for transfer to secondaries over TLS.
            #allow-query: 192.0.2.0/24 NOKEY

            # If no master and slave access control elements are provided,
            # this zone will not be served to/from other servers.

            # A master zone needs notify: and provide-xfr: lists.  A slave
            # may also allow zone transfer (for debug or other secondaries).
            # notify these slaves when the master zone changes, address TSIG|NOKEY
            # IP can be ipv4 and ipv6, with @port for a nondefault port number.
            # notify: 192.0.2.0 secretkey0
            # allow these IPs and TSIG to transfer zones, addr TSIG|NOKEY|BLOCKED
            # address range 192.0.2.0/24, 1.2.3.4&255.255.0.0, 3.0.2.20-3.0.2.40
            # provide-xfr: 192.0.2.0 secretkey0
            # set the number of retries for notify.
            #notify-retry: 5

            # uncomment to provide AXFR to all the world
            # provide-xfr: 0.0.0.0/0 NOKEY
            # provide-xfr: ::0/0 NOKEY

            # A slave zone needs allow-notify: and request-xfr: lists.
            allow-notify: 192.0.2.2 secretkey0
            # By default, a slave will request a zone transfer with IXFR/TCP.
            # If you want to make use of IXFR/UDP use: UDP addr tsigkey
            # for a master that only speaks AXFR (like NSD) use AXFR addr tsigkey
            # If you want to require use of XFR-over-TLS use: addr tsigkey tlsauthname
            request-xfr: AXFR 190.0.2.2 secretkey0
    ```

1.  In the `zone:` section, point to a zone file in the `secondary` directory. Use the new pattern name defined above for the secondary name server for `include-pattern`. As usual, substitute your own domain name for `yourdomainhere.com`.

    ```file{title="/etc/nsd/nsd.conf" hl_lines="3-4"}
    zone:
            name: "yourdomainhere.com"
            zonefile: "zones/secondary/yourdomainhere.com.zone"
            include-pattern: "secondary_inbound"
    ```

    When complete, save and close the file.

1.  Check the configuration:

    ```command {title="ns2"}
    nsd-checkconf /etc/nsd/nsd.conf
    ```

1.  If no errors are returned, restart NSD:

    ```command {title="ns2"}
    sudo systemctl restart nsd
    ```

## Test Both Name Servers

Two tests can verify if both name servers work as intended. First, run queries against both name servers to verify that both respond with DNS records. Second, add a new record on the primary name server (`ns1`) and check if it propagates to the secondary name server (`ns2`).

For both tests, use the `dig` utility, which comes included in the Linode distribution of Ubuntu 22.04 LTS. The fairly verbose output that`dig` produces by default is not needed here, so use the `+short` argument in all these commands. Also, query a specific name server by prepending the `@` character to any hostname.

1.  Here is a sample query against the primary name server:

    ```command {title="ns2"}
    dig john.yourdomainhere.com +short @ns1.yourdomainhere.com
    ```

    ```output
    96.126.102.179
    ```

1.  Now run the same test against the secondary name server:

    ```command {title="ns1"}
    dig john.yourdomainhere.com +short @ns2.yourdomainhere.com
    ```

    ```output
    96.126.102.179
    ```

    Congratulations! The primary and secondary name servers are now working as intended. Next, verify transfers work between the primary and secondary name servers by adding a new resource record on the primary name server.

1.  On the primary name server, open the zone file for `yourdomainhere.com` (`/etc/nsd/zones/master/yourdomainhere.com.zone`):

    ```command {title="ns1"}
    sudo nano /etc/nsd/zones/master/yourdomainhere.com.zone
    ```

1.  Increment the zone file’s serial number. This is very important as NSD does not load changes to the zone unless the zone file’s serial number increments. In this example, simply increment the serial number’s final digit by 1:

    ```file{title="/etc/nsd/zones/master/yourdomainhere.com.zone"}
    Old: 2023030701
    New: 2023030702

1.  Then add an A record for a new host:

    ```file{title="/etc/nsd/zones/master/yourdomainhere.com.zone"}
    brian	        A       96.126.102.183
    ```

    When finished, save and close the file.

1.  Reload the zone:

    ```command {title="ns1"}
    sudo nsd-control reload yourdomainhere.com
    ```

1.  Run a `dig` query on the secondary name server for the new hostname:

    ```command {title="ns1"}
    dig -t a brian.yourdomainhere.com +short @ns2.yourdomainhere.com
    ```

    ```output
    192.0.2.15
    ```

    This validates automatic zone transfers. Even if there are 100 secondary name servers, changes would only need to be made on the primary, and every secondary would still produce this output.

## Hidden Primary Name Server Configuration

A hidden primary name server works the same way as the current primary when it comes to zone transfers. All secondary name servers still get zone updates from it. The only difference is that a hidden primary is never listed in the public DNS. It’s neither authoritative for any zone, nor do you delegate any authority to it at your registrar. Instead, all the “authoritative” name servers you list, both in registrar delegations and in each zone’s NS records, are actually secondary name servers that receive updates from the hidden primary.

Because attackers don’t know the hidden primary exists, they can’t try to compromise your configuration or zone files. Of course, you still need to update Linux and protect access to the hidden primary, as with any system.

Make use of the existing `ns1` and `ns2` by converting them to secondaries, and configuring `ns3` to serve as the new hidden primary, like so:

-   `ns1.yourdomainhere.com` (secondary)
-   `ns2.yourdomainhere.com` (secondary)
-   `ns3.yourdomainhere.com` (hidden primary)

There is no requirement that the hidden primary reside in the same data center as either of the secondaries. However, if one or more name servers are in the same data center, they can use private addresses (e.g. `192.168.173.25`) for zone transfers. These addresses aren’t routable on the public Internet.

1.  Open an SSH session to the `ns3` instance and install NSD:

    ```command {title="ns3"}
    sudo apt install nsd
    ```

1.  Configure the NSD control utility, `nsd-config`:

    ```command {title="ns3"}
    sudo nsd-control-setup
    ```

    The output should appear as follows:

    ```output
    setup in directory /etc/nsd
    removing artifacts
    Setup success. Certificates created.
    ```

    If not, check `/var/log/syslog` for errors.

1.  Copy `nsd.conf` from `ns1` (the original primary name server) using the `scp` secure-copy utility, and remember to replace `yourdomainhere.com` with your actual domain name:

    ```command {title="ns3"}
    sudo scp root@ns1.yourdomainhere.com:/etc/nsd/nsd.conf /etc/nsd
    ```

1.  Also copy the entire zones directory structure:

    ```command {title="ns3"}
    sudo scp -r root@ns1.yourdomainhere.com:/etc/nsd/zones /etc/nsd
    ```

1.  Gather `ns3`'s external IPv4 and IPv6 addresses. Follow this guide to [Find Your Linode's IP Address](/docs/guides/find-your-linodes-ip-address) or use the following command:

    ```command {title="ns3"}
    ip a
    ```

1.  Open `/etc/nsd/nsd.conf`:

    ```command {title="ns3"}
    sudo nano /etc/nsd/nsd.conf
    ```

1.  Replace the existing `ip-address` statements in the `servers:` section with `ns3`'s addresses, including IPv6 addresses if you’ve configured them:

    ```file{title="/etc/nsd/nsd.conf" hl_lines="26-27"}
    server:
            # Number of NSD servers to fork.  Put the number of CPUs to use here.
            # server-count: 1

            # Set overall CPU affinity for NSD processes on Linux and FreeBSD.
            # Any server/xfrd CPU affinity value will be masked by this value.
            # cpu-affinity: 0 1 2 3

            # Bind NSD server(s), configured by server-count (1-based), to a
            # dedicated core. Single core affinity improves L1/L2 cache hits and
            # reduces pipeline stalls/flushes.
            #
            # server-1-cpu-affinity: 0
            # server-2-cpu-affinity: 1
            # ...
            # server-<N>-cpu-affinity: 2

            # Bind xfrd to a dedicated core.
            # xfrd-cpu-affinity: 3

            # Specify specific interfaces to bind (default are the wildcard
            # interfaces 0.0.0.0 and ::0).
            # For servers with multiple IP addresses, list them one by one,
            # or the source address of replies could be wrong.
            # Use ip-transparent to be able to list addresses that turn on later.
            ip-address: 192.0.2.4
            ip-address: 2001:DB8::4
    ```

1.  Next, add additional `notify` and `provide-xfr` statements in the `pattern:` section. Replace the IP addresses with those of `ns1` and `ns2`:

    ```file{title="/etc/nsd/nsd.conf" hl_lines="28,33"}
    pattern:
            # name by which the pattern is referred to
            name: "secondary_outbound"
            # the zonefile for the zones that use this pattern.
            # if relative then from the zonesdir (inside the chroot).
            # the name is processed: %s - zone name (as appears in zone:name).
            # %1 - first character of zone name, %2 second, %3 third.
            # %z - topleveldomain label of zone, %y, %x next labels in name.
            # if label or character does not exist you get a dot '.'.
            # for example "%s.zone" or "zones/%1/%2/%3/%s" or "secondary/%z/%s"
            #zonefile: "%s.zone"

            # The allow-query allows an access control list to be specified
            # for a zone to be queried. Without an allow-query option, any
            # IP address is allowed to send queries for the zone.
            # This could be useful for example to not leak content from a zone
            # which is only offered for transfer to secondaries over TLS.
            #allow-query: 192.0.2.0/24 NOKEY

            # If no master and slave access control elements are provided,
            # this zone will not be served to/from other servers.

            # A master zone needs notify: and provide-xfr: lists.  A slave
            # may also allow zone transfer (for debug or other secondaries).
            # notify these slaves when the master zone changes, address TSIG|NOKEY
            # IP can be ipv4 and ipv6, with @port for a nondefault port number.
            notify: 192.0.2.2 secretkey0
            notify: 192.0.2.3 secretkey0

            # allow these IPs and TSIG to transfer zones, addr TSIG|NOKEY|BLOCKED
            # address range 192.0.2.0/24, 1.2.3.4&255.255.0.0, 3.0.2.20-3.0.2.40
            provide-xfr: 192.0.2.2 secretkey0
            provide-xfr: 192.0.2.3 secretkey0

    ```

    When done, save and close the file, but don’t restart NSD just yet. First, configure both existing name servers to pull updates from `ns3`, and change `ns1` from a primary to a secondary name server.

1.  Open `/etc/nsd/nsd.conf` on both `ns1` and `ns2`:

    ```command {title="ns1 and ns2"}
    sudo nano /etc/nsd/nsd.conf
    ```

1.  Edit the files so the statements in the `pattern:` and `zone:` sections indicate that these are now secondary servers, and are to get their updates from `ns3`:

    ```file{title="/etc/nsd/nsd.conf" hl_lines="3,39,44"}
    pattern:
            # name by which the pattern is referred to
            name: "secondary_inbound"
            # the zonefile for the zones that use this pattern.
            # if relative then from the zonesdir (inside the chroot).
            # the name is processed: %s - zone name (as appears in zone:name).
            # %1 - first character of zone name, %2 second, %3 third.
            # %z - topleveldomain label of zone, %y, %x next labels in name.
            # if label or character does not exist you get a dot '.'.
            # for example "%s.zone" or "zones/%1/%2/%3/%s" or "secondary/%z/%s"
            #zonefile: "%s.zone"

            # The allow-query allows an access control list to be specified
            # for a zone to be queried. Without an allow-query option, any
            # IP address is allowed to send queries for the zone.
            # This could be useful for example to not leak content from a zone
            # which is only offered for transfer to secondaries over TLS.
            #allow-query: 192.0.2.0/24 NOKEY

            # If no master and slave access control elements are provided,
            # this zone will not be served to/from other servers.

            # A master zone needs notify: and provide-xfr: lists.  A slave
            # may also allow zone transfer (for debug or other secondaries).
            # notify these slaves when the master zone changes, address TSIG|NOKEY
            # IP can be ipv4 and ipv6, with @port for a nondefault port number.
            # notify: 192.0.2.3 secretkey0
            # allow these IPs and TSIG to transfer zones, addr TSIG|NOKEY|BLOCKED
            # address range 192.0.2.0/24, 1.2.3.4&255.255.0.0, 3.0.2.20-3.0.2.40
            # provide-xfr: 192.0.2.2 secretkey0
            # set the number of retries for notify.
            #notify-retry: 5

            # uncomment to provide AXFR to all the world
            # provide-xfr: 0.0.0.0/0 NOKEY
            # provide-xfr: ::0/0 NOKEY

            # A slave zone needs allow-notify: and request-xfr: lists.
            allow-notify: 192.0.2.3 secretkey0
            # By default, a slave will request a zone transfer with IXFR/TCP.
            # If you want to make use of IXFR/UDP use: UDP addr tsigkey
            # for a master that only speaks AXFR (like NSD) use AXFR addr tsigkey
            # If you want to require use of XFR-over-TLS use: addr tsigkey tlsauthname
            request-xfr: AXFR 192.0.2.3 secretkey0
    ```

    ```file {title="/etc/nsd/nsd.conf" hl_lines="5,7"}
    zone:
            name: "yourdomainhere.com"
            # you can give a pattern here, all the settings from that pattern
            # are then inserted at this point
            include-pattern: "secondary_inbound"
            # You can also specify (additional) options directly for this zone.
            zonefile: "zones/secondary/yourdomainhere.com.zone"
    ```

    When complete, save and close the files on both `ns1` and `ns2`.

1.  Restart NSD on all three name servers:

    ```command {title="ns1, ns2, and ns3"}
    sudo systemctl restart nsd
    ```

From now on, any changes made on the hidden primary (`ns3`) propagate to the secondary name servers (`ns1` and `ns2`). As before, verify this by adding a new resource record to the `yourdomainhere.com` zone file on `ns3`. After reloading the zone, query the secondary name servers to see the new record.

You don’t need to make any changes at your domain registrar. To anyone on the public Internet, the now-secondary name servers at `ns1` and `ns2` are still authoritative for `yourdomainhere.com`.

## Conclusion

Redundancy is important for any networked service, but none more so than DNS. Given the dependency of virtually all other services on a functioning DNS infrastructure, it’s important to ensure the loss of any one name server doesn’t affect availability. Given the critical role of the primary name server, security measures such as secret keys and a hidden primary can maximize uptime, not only for your DNS servers, but for all services that depend on it.
