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