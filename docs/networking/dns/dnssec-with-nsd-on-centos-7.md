DNSSEC With NSD in RHEL / CentOS 7
==================================

The Domain Name System has some inherent insecurities, it is a system based
largely upon trust. When a web browser requests an IP Address, it trusts the
nameserver is giving it the correct address. The nameserver in turn is also
trusting that it received the correct address.

DNSSEC is an extension to DNS that greatly reduces the amount of trust involved
by using cryptographic signed records to validate the result of the query.

This document was written with CentOS 7 in mind but it should work with most
Linux distributions with very little tweaking needed.

## The NSD Daemon

NSD is an alternative to bind. It is an authoritative only nameserver and works
well with DNSSEC out of the box. I personally find it easier to configure than
bind, it does what an authoritative name server needs to do and it does it
quite well. Several of root nameservers many more TLD nameservers run NSD, so
it is more than capable of handling my needs.

## Redundancy and Security

If you are going to operate your own nameserver, you should operate at least
two. One master, and at least one slave. I highly recommend that you use
dedicated linodes for your master and slave(s) and run them from different
facilities. For example, you can use a linode in the Dallas facility for your
master and a linode in the Fremont facility for a slave.

Running an authoritative only nameserver is not very CPU or Memory intensive
and does not use a lot of disk space, it is fine to use the smallest option
that Linode has to offer for your nameservers.

### Nameserver Domain Name and Nameserver's DNS

I do not manage the DNS zone for the domain I use as my DNS server for my
other domains. There are ways to do it (look up glue records if curious) but it
is much simpler not to and simplicity has benefits. I let Linode manage the
zone for the DNS server domain. That zone will be the only zone not under my
direct administration.

For example, I might register the `exampledns.com` domain to use as the
domain for my nameserver. When using the Linode DNS manager, both
`exampledns.com` and `ns1.exampledns.com` would point to the IP address I am
using as the master. Remember to include both the IPv4 and IPv6 when creating
the zone.

`ns2.exampledns.com` would point to the IPv4 and IPv6 address for the first
slave, and so on.

Once Linode's DNS server has updated (usually less than 15 minutes after you
create the zone) you then need to log in to your account with your registrar
and point the DNS records for the domain to the Linode DNS servers.

Finally, you will need to have your registrar recognize your nameservers (e.g.
`ns1.exampledns.com` and `ns2.exampledns.com`) as nameservers. How to do that
varies from registrar to registrar and it is necessary, otherwise when you
register new domains you won't be able to assign your nameservers as their
authoritative nameservers.

## Installing NSD on RHEL / CentOS 7

Unfortunately NSD is not packaged for RHEL / CentOS 7 either in their base
repositories or in EPEL. However the Fedora src.rpm rebuilds in CentOS 7
without modification.

A rebuild of NSD for RHEL / CentOS 7 can be found here:
[NSD for RHEL / CentOS 7](http://awel.domblogger.net/7/misc/x86_64/repoview/nsd.html)

Alternatively, you can rebuild the src.rpm from Fedora yourself.

There is one caveat. Starting the daemon works just swell when the server is up
and running, but it often does not start during a system boot. That's a
problem. That problem has existed for me since at least the CentOS 5 days, but
it is easy to work around. Create the following shell script and put it in the
`/root/bin` directory:

    #!/bin/bash
    # /root/bin/start_nsd.sh
    
    /sbin/service nsd status > /dev/null 2>&1
    if [ $? -ne 0 ]; then
      /sbin/service nsd start > /dev/null 2>&1
    else
      [ ! -f /root/nsdflush ] && touch /root/nsdflush
      if test `find /root/nsdflush -mmin + 240`; then
        touch /root/nsdflush #keep it from triggering
        sleep $[ ( $RANDOM % 600 ) + 1 ]s #so that unlikely all slaves trigger at same time
        /sbin/service nsd restart > /dev/null 2>&1
        sleep 3
        /usr/sbin/nsdc rebuild > /dev/null 2>&1
        /usr/sbin/nsdc reload > /dev/null 2>&1
        touch /root/nsdflush
      fi
    fi
    
    exit 0