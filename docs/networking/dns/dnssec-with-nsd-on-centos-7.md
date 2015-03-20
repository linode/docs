DNSSEC With NSD in RHEL / CentOS 7
==================================

The Domain Name System has some inherent insecurities, it is a system based
largely upon trust. When a web browser requests an IP Address, it trusts the
nameserver is giving it the correct address. The nameserver in turn is also
trusting that it received the correct address from its source, and so on.

DNS spoofing is an attack that exploits that trust by injecting intentionally
bad data somewhere along that line of trust, ultimately resulting in an
incorrect IP address being delivered to some users.

DNSSEC is an extension to DNS that greatly reduces the amount of trust involved
by using cryptographic signed records to validate the result of a query.

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

Using Linode's nameserver for the zone that controls my nameservers does create
a point of failure. If all five of Linode's nameservers can not be reached,
then a client will not be able to resolve the domain names for my nameservers.
However if all five of Linode's nameservers can not be reached, the odds are
pretty good that my nameservers running on Linode powered virtual machines
can not be reached anyway.

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

### Starting NSD Automatically

There is one caveat. Starting the daemon works just swell when the server is up
and running, but it often does not start during a system boot. That's a
problem. That problem has existed for me since at least the CentOS 5 days and
that *might* be why it is not packaged for CentOS / RHEL in the official RPM
repositories, but it is easy to work around.

Create the following shell script and put it in the `/root/bin` directory:

    #!/bin/bash
    # /root/bin/start_nsd.sh
    
    /sbin/service nsd status > /dev/null 2>&1
    if [ $? -ne 0 ]; then
      /sbin/service nsd start > /dev/null 2>&1
      touch /root/nsdflush
    else
      [ ! -f /root/nsdflush ] && touch /root/nsdflush
      if test `find /root/nsdflush -mmin + 240`; then
        touch /root/nsdflush                #keep it from triggering
        sleep $[ ( $RANDOM % 600 ) + 1 ]
        /sbin/service nsd restart > /dev/null 2>&1
        /usr/sbin/nsdc rebuild > /dev/null 2>&1
        /usr/sbin/nsdc reload > /dev/null 2>&1
        touch /root/nsdflush
      fi
    fi
    
    exit 0
    
That script will start NSD if it is not running. If it is running, it will
restart it and rebuild / reload its database about every four hours.

I recommend removing the `else` block from the script on the master, but on the
slaves I have found it can hasten how quickly they publish updates they receive
from the master.

The purpose of the `sleep` in the `else` block, in the event that you run
multiple slaves, if they all boot at the same time the `sleep` will space out
when the maintenance restart and flush happens reducing the odds that multiple
slaves happen to restart at the same time. It probably does not matter if they
do but during the brief daemon restart they won't be responding to name lookup
requests.

With the script is in its proper place, add the following to the `root`
crontab:

    * * * * * /bin/bash /root/bin/start_nsd.sh > /dev/null 2>&1
    
Once a minute, the cron daemon will run the script, starting the daemon if it
is not already running. You probably do not want to load the cron job until
you have NSD configured and working.

## Configure the Master

Before we start using DNSSEC it is a good idea to get both the master and the
slave servers working without DNSSEC.

The configuration files for NSD can be found in the `/etc/nsd` directory. If
you are starting from the rebuilt Fedora RPM linked to earlier, initially there
will only be one file in that directory: `nsd.conf`.

That configuration file is mostly comments that explain what some of the
options are for and what the defaults are. I would suggest backing it up to
`nsd.conf.default` and creating a fresh configuration file without the
comments.

Most of the defaults are fine, in most cases there is very little to actually
configure. You will want to specify the IPv4 and IPv6 address that it listens
on, the database location, a key for pushing updates, and an include file:

    #
    # nsd.conf
    #
    server:
            ip-address: 69.164.200.202
            ip-address: 127.0.0.1
            ip-address: 2600:3c00::12
            ip-address: ::1

    database: /var/lib/nsd/nsd.db
    
    key:
            name: "mynsdkey"
            algorithm: hmac-sha256
            secret: "iRkBVSG+F4FtAHSdpb6FDvhdExeTKpSoBSyi4c9TbIg="
            
    include: "/etc/nsd/zones.config"
    
You will want to replace `69.164.200.202` with your master IPv4 address and
`2600:3c00::12` with your master IPv6 address.

In the `key` configuration, you can change `name` if you want but it is not
sensitive data. You do however want to change the `secret`. To generate a
secret of your own, run the following command:

    dd if=/dev/urandom count=1 bs=32 2> /dev/null |base64
    
Note that the `key` section comes *after* the `database` is defined.

For additional configuration options you may wish to define, you can look at
the comments in the original `nsd.conf.default` file.

### Master zones.config

The `zones.config` file is where you will define what zones the NSD server is
responsible for and where the configuration file is located. We will use
`example.org` and `example.net` in this example `zones.config` file:

    zone:
        name: example.org
        zonefile: /etc/nsd/example.org.zone
        notify: 2600:3c00::4e mynsdkey
        provide-xfr: 2600:3c00::4e mynsdkey
        
    zone:
        name: example.net
        zonefile: /etc/nsd/example.net.zone
        notify: 2600:3c00::4e mynsdkey
        provide-xfr: 2600:3c00::4e mynsdkey
        
For the `notify` and `provide-xfr` you want to specify the IPv6 address of your
slave. You could use the IPv4 address instead, but I generally recommend using
IPv6 for network communication between servers.

If you have more than one slave, you will need additional `notify` and
`provide-xfr` directives for each zone.

`mynsdkey` needs to be whatever was defined with the `name` directive in the
`key` definition of the `nsd.conf` file.

### Zone Files

For each zone defined in your `zones.config` file you will need to create a
zone file. The zone file format used by NSD is very similar to what is used by
bind. Below is an example for the `example.org` zone:

    $ORIGIN example.org.
    $TTL 86400
    
    @       IN      SOA     ns1.exampledns.com.        admin.example.org.  (
                                     2015032001       ; serial number
                                     28800            ; Refresh
                                     7200             ; Retry
                                     864000           ; Expire
                                     86400            ; Min TTL
                                     )
                                     
                    NS               ns1.exampledns.com.
                    NS               ns2.exampledns.com.
                    
                    MX      10       mail.example.org.
                    
    example.org.            IN       A        93.184.216.34
    www                     IN       A        93.184.216.34
    mail                    IN       A        93.184.216.63
    
    
    example.org.            IN       AAAA     2606:2800:220:1:248:1893:25c8:1946
    www                     IN       AAAA     2606:2800:220:1:248:1893:25c8:1946
    mail                    IN       AAAA     2606:2800:220:1:248:1893:25c8:1942

For more information on the zone file and DNS records, please refer to
[Introduction to DNS Records](https://www.linode.com/docs/networking/dns/introduction-to-dns-records).

### Test Configuration

One your zone files have been created, you should test your NSD configuration
file:

    nsd-checkconf /etc/nsd/nsd.conf
    
If there is no output, it passed the check. Running the above command will not
check the `zones.config` file or the various zone files.

Start the daemon:

    service nsd start
    
With the daemon running, we can now use the `dig` command to test and see if it
is working:

    [alice@localhost ~]$ dig @localhost mail.example.org.
    
    ; <<>> DiG 9.9.4-RedHat-9.9.4-14.el7_0.1 <<>> @localhost mail.example.org.
    ; (2 servers found)
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 20133
    ;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 2, ADDITIONAL: 1
    ;; WARNING: recursion requested but not available
    
    ;; OPT PSEUDOSECTION:
    ; EDNS: version: 0, flags:; udp: 4096
    ;; QUESTION SECTION:
    ;mail.example.org.    IN  A
    
    ;; ANSWER SECTION:
    mail.example.org. 86400 IN  A 93.184.216.63
    
    ;; AUTHORITY SECTION:
    example.org.    86400 IN  NS  ns1.exampledns.com.
    example.org.    86400 IN  NS  ns2.exampledns.com.
    
    ;; Query time: 0 msec
    ;; SERVER: ::1#53(::1)
    ;; WHEN: Fri Mar 20 02:26:57 PDT 2015
    ;; MSG SIZE  rcvd: 111
    
Your result should look something like that if is working.

## Configure the Slave

On the slave, the `nsd.conf` file should be identical to the master *except*
for the IP addresses it listens on, which of course should correspond to the
IP addresses of the slave. It is imperitive that the `key` section in the slave
`nsd.conf` is identical to the `key` section in master `nsd.conf`.

The `zones.config` file however will be different, and we do not need to create
any zone files on the slave.

### Slave zones.config

Again we will use `example.org` and `example.net` to demonstrate:

    zone:
        name: example.org
        zonefile: /etc/nsd/example.org.zone
        allow-notify: 2600:3c00::12 mynsdkey
        request-xfr: 2600:3c00::12 mynsdkey

    zone:
        name: example.net
        zonefile: /etc/nsd/example.net.zone
        allow-notify: 2600:3c00::12 mynsdkey
        request-xfr: 2600:3c00::12 mynsdkey
        
On the slave servers, we use `allow-notify` and `request-xfr` *instead* of
`notify` and `provide-xfr`.

The IP address should correspond with the master. Again, I recommend using the
IPv6 address.