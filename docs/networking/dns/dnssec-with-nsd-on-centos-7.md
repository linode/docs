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
by using cryptographic signed records that allows caching nameservers along the
way and the web browser (or any other Internet client) to validate the
authenticity of the result and reject the result if it does not validate.

This document was written with CentOS 7 in mind but it should work with most
Linux distributions with very little tweaking needed.

I need to warn you that migrating to DNSSEC is not something where you can just
set it up and forget it for awhile. It does require frequent maintenance to
roll over one of the keys. You can automate that, but that automation is beyond
the scope of this document.

I have however attempted to make the key rollover a simple matter of running a
few scripts.

## The NSD Daemon

NSD is an alternative to bind. It is an authoritative only nameserver and works
well with DNSSEC out of the box. I personally find it easier to configure than
bind, it does what an authoritative name server needs to do and it does it
quite well. Several of the root nameservers as well as numerous TLD nameservers
run NSD, so it is more than capable of the needs of an authoritative
nameserver.

NSD is not the right choice if you need a round robin or a recursive
nameserver. Generally speaking, an authoritative name server should not also be
a recursive nameserver, but round robin is sometimes beneficial. If you do need
round robin then you should use a different nameserver.

## Redundancy and Security

If you are going to operate your own nameserver, you should operate at least
two. One master, and at least one slave. I highly recommend that you use
dedicated linodes for your master and slave(s) and run them from different
facilities. For example, you can use a linode in the Dallas facility for your
master and a linode in the Fremont facility for a slave.

For security reasons, the linodes you use for your nameserver really should be
dedicated to the nameserver. A nameserver listens for requests on an open port
providing potential vectors for remote exploits if the daemon has a
vulnerability. You do not want an exploit in the nameserver to allow your other
services to be compromised or vice versa.

Running an authoritative only nameserver is not very CPU or Memory intensive
and does not use a lot of disk space, it is fine to use the smallest option
that Linode has to offer for your nameservers.

### Nameserver Domain Name and Nameserver's DNS

Your nameserver itself will have a domain name that needs to be resolved. It is
possible to create a special kind of record, called a glue record, that allows
your nameservers to be hosts in a zone the nameservers controls.

I personally prefer not to do that, I do not like to use domain names for my
nameserver that are part of the zones they control. I prefer to register a
separate domain that is only used for my nameservers and host the zone for that
domain on a third party nameserver, such as the Linode provided nameserver. It
is simpler and simplicity has its benefits.

I suggest using a `.com` or `.net` TLD for the nameserver domain, it allows you
to use [http://www.internic.net/whois.html](http://www.internic.net/whois.html)
to easily verify that your nameservers are in fact seen as nameservers.

For example, I might register the `exampledns.com` domain to use as the
domain for my nameserver. When using the Linode DNS manager, both
`exampledns.com` and `ns1.exampledns.com` would point to the IP address I am
using as the master. Remember to include both the IPv4 and IPv6 when creating
the zone.

`ns2.exampledns.com` would point to the IPv4 and IPv6 address for the first
slave, and so on.

Once Linode's DNS server has updated (usually less than 15 minutes after you
create the zone) you then need to log in to your account with your registrar
and point the DNS records for your DNS specific domain to the Linode DNS
servers. Specify all five of Linode's nameservers as authoritive:

[![Entering Linode DNS Servers at Registrar](/docs/assets/specify_linode_nameservers.png)](/docs/assets/specify_linode_nameservers.png)

It might be tempting to use your registrar's nameserver for this instead of
Linode's. Be warned that doing so can cause issues if you ever decide to
transfer that domain. The registrars will often remove the zone file from
their nameserver when a transfer begins but you can not update the nameservers
until the transfer ends.

In the case of the nameservers you operate, this could result in all of the
domains under your administration losing service until the transfer is over.
When you use the Linode nameservers, there is no loss of service during a
transfer of your nameserver domain from one registrar to another.

For more information on the Linode DNS Manager, see [DNS Manager](https://www.linode.com/docs/networking/dns/dns-manager).

Finally, you will need to have your registrar recognize your nameservers (e.g.
`ns1.exampledns.com` and `ns2.exampledns.com`) as nameservers. How to do that
varies from registrar to registrar and it is necessary, otherwise when you
register new domains you won't be able to assign your nameservers as their
authoritative nameservers.

It may be under Advanced Options and be called Nameserver Registration. The
registrar will make a special record with ICANN that then allows your
nameservers to be specified as authoritative nameservers for other domains.

## Installing NSD on RHEL / CentOS 7

Unfortunately NSD is not packaged for RHEL / CentOS 7 either in their base
repositories or in EPEL. However the Fedora src.rpm rebuilds in CentOS 7
without modification.

A rebuild of NSD for RHEL / CentOS 7 can be found here:
[NSD for RHEL / CentOS 7](http://awel.domblogger.net/7/misc/x86_64/repoview/nsd.html)

Alternatively, you can rebuild the src.rpm from Fedora yourself.

You will also want the `dig` command available on your nameservers. If it is
not present when you create your linode, it can be installed with command

    yum install bind-utils
    
`dig` is useful for testing how your nameserver responds to a query and that
often needs to be done when logged in to the nameserver itself.

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
      if test `find /root/nsdflush -mmin 240`; then
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

With the script in its proper place, add the following to the `root` crontab:

    * * * * * /bin/bash /root/bin/start_nsd.sh > /dev/null 2>&1
    
Once a minute, the cron daemon will run the script, starting the daemon if it
is not already running. You probably do not want to load the cron job until
you have NSD configured and working.

If you need more information on how to use `cron`, see [Schedule Tasks with Cron](https://www.linode.com/docs/tools-reference/tools/schedule-tasks-with-cron).

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

Once your zone files have been created, you should test your NSD configuration
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

When you start the NSD server on the slave, it should request the zone
information from the master and populate the zone files itself.

You should test the slave with the `dig` command the same way that you tested
the master.

### Important Note

When you modify the `zones.config` file on the master to add a new zone, do not
forget to also modify the `zones.config` file on all of your slaves. The slave
will only update zones it knows about from that file.

## Test Your Setup

Before continuing with the DNSSEC setup, test that everything is working as
intended. Start by rebooting the linodes for your nameservers.

After they have rebooted, you can test whether or not the nameservers are
listening by using the `nmap` command from a different host:

    [alice@localhost ~]$ nmap ns2.exampledns.com
    
    Starting Nmap 6.40 ( http://nmap.org ) at 2015-03-21 00:55 PDT
    Nmap scan report for ns2.exampledns.com (*.*.*.*)
    Host is up (0.044s latency).
    rDNS record for *.*.*.(: li*-*.members.linode.com
    Not shown: 995 closed ports
    PORT    STATE    SERVICE
    53/tcp  open     domain
    135/tcp filtered msrpc
    139/tcp filtered netbios-ssn
    445/tcp filtered microsoft-ds
    593/tcp filtered http-rpc-epmap
    
    Nmap done: 1 IP address (1 host up) scanned in 1.82 seconds
    
The important line that should be there is

    53/tcp  open     domain
    
Port 53 should have a state of `open`. If it is not listed then NSD is not
running. Check to make sure that you set up the cron daemon to check its state
once a minute and start it for you when it is not running.

Next, make sure all your nameservers are recognized as nameservers. If your
nameserver is on a `.com` or `.net` TLD you can do this at
[http://www.internic.net/whois.html](http://www.internic.net/whois.html)

Check the radio button for nameserver and enter the FQDN of the nameserver into
the text input. If your nameservers are not seen as nameservers, you need to
log into your account at your domain registry and make sure they are flagged as
nameservers.

When your nameservers pass these tests, you can log in to your domain registry
accounts and update the authoritative nameserver settings for the domains that
your NSD nameservers have zones for.

## DNSSEC

DNSSEC works on the principle of a chain of trust verified by cryptographic
signed keys.

Several new types of records are added to the zone that include the digitally
signed data.

Two different signing keys are used, a Zone Signing Key (ZSK) and a second Key
Signing Key (KSK).

A Delegation Signer (DS record) of your KSK is then kept on record with your
TLD.

When a DNSSEC aware application does a DNS lookup, it uses the digital
signature of the root nameserver to verify the validity of your TLD
signature. The signature of your TLD is then used to verify your KSK
signature. Your KSK signature is then used to verify your ZSK signature.
Finally your ZSK signature is used to verify the results of the query.

There is a reason two keys are used. The larger the key, the larger the resonse
to a DNSSEC query. This is problematic, especially with DNS amplification
attacks.

The KSK needs to be 2048 bits making it unlikely that it will ever be cracked.
The Delegation Signer from your KSK is then submitted through your registrar
where it can be signed by your TLD. It is recommended that a 2048 bit KSK be
rotated once a year.

The KSK can then sign a smaller 1024 bit ZSK that is rotated more frequently
without the need for updating information with your registrar. The ZSK should
be rotated at least every other month but I prefer more often.

In order for DNSSEC to work, you need to be able to make your TLD aware of your
KSK Delegation Signer (DS). This will be unique for each registered domain
name.

Unfortunately some domain registrars do not yet support informing the TLD of
your KSK DS. If your registrar does not support DS records you will need to
transfer your domains to a registrar that does.

### Zone Signing Machine

Do not sign zones on the nameserver itself. I have read many tutorials on
DNSSEC that do just that, but it is a very dangerous practice.

If your nameserver is compromised, an attacker will not be able to create zone
files that will DNSSEC validate if the keys are not on the server. However if
the keys *are* on the server, all your zone are belong to us.

It is best to do your zone signing from a computer without a public IP address.
It is even better to do your zone signing from a computer without a public IP
address *or* a wifi interface.

The instructions here assume the computer used for signing keys is RHEL /
CentOS 7 but any Linux distribution should work.

You will need to install the `ldns` tools and I highly recommend that you also
install and start the `haveged` daemon.

You do not need to have NSD installed on the computer you use to sign your
zones. You also do not need a privileged account to sign zones, you can sign
zones from a regular user account.

### Zones Directory

Create a directory specific directory that will be used for your zone files as
well as the keys used to sign them. Call it something like `zonesign` or
whatever floats your boat. You will want to back it up to a secure location in
case of hard drive failure.

Within this directory, place your zone files but append `.template` to the end
of the zone name. The purpose of this has to do with key rollovers, we want to
be able to script the generation of a zone files that include new ZSK keys
before the new ZSK is used to sign zones, allowing for a smooth transition from
an old ZSK to a new ZSK.

### Signing Zone Files

The following shell script, which I call `dnsSignZone.sh`, will generate the
initial signing keys and sign the zone files. Whenever you update one of the
templates, the script will find the existing keys if they exist and re-use
them.

**IMPORTANT**: Always increment the `serial` before running this script. There
is not a specified standard for the serial, other than it needs to be a
positive integer. I like to use `YYYYMMDDNN` where `YYYY` is the year, `MM`
is the two-digit month, `DD` is the two-digit day, and `NN` is a two-digit
number in case I need to do more than one edit in a day (I start at 01 and then
increment each time I edit it, returning it to 01 when doing the first edit on
a given day).

    #!/bin/bash
    # ~/bin/dnsSignZone.sh
    
    zone=$1
    if [ ! -f ${zone}.template ]; then
      /bin/echo "Template file ${zone}.template not found."
      exit 1
    fi
    
    /bin/cat ${zone}.template > ${zone}.zone
    /bin/echo -e '\n\n' >> ${zone}.zone
    
    if [ -f ${zone}.zone.signed ]; then
      ZSK=`/bin/grep -H "(zsk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
      KSK=`/bin/grep -H "(ksk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
      if [ -L rollover/${zone}.new.zsk ]; then
        /bin/cat rollover/${zone}.new.zsk >> ${zone}.zone
      fi
      if [ -L rollover/${zone}.old.zsk ]; then
        /bin/cat rollover/${zone}.old.zsk >> ${zone}.zone
      fi
    else
      ZSK=`/usr/bin/ldns-keygen -a RSASHA1-NSEC3-SHA1 -b 1024 ${zone}`
      KSK=`/usr/bin/ldns-keygen -k -a RSASHA1-NSEC3-SHA1 -b 2048 ${zone}`
      /bin/rm -f ${ZSK}.ds ${KSK}.ds
    fi
    
    SALT=`/bin/head -n 1024 /dev/random |/usr/bin/sha1sum |cut -d' ' -f1`
    
    #KSK sign
    if [ -L rollover/${zone}.new.ksk ]; then
      #sign with both KSK keys
      cd rollover
      NKSK=`/bin/grep -H "(ksk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
      cd ..
      /usr/bin/ldns-signzone -n -p -s ${SALT} ${zone}.zone $ZSK $KSK rollover/${NKSK}
    else
      /usr/bin/ldns-signzone -n -p -s ${SALT} ${zone}.zone $ZSK $KSK
    fi
    
    #KSK DS
    /bin/rm -f K256${zone}.+*.ds
    /bin/rm -f K${zone}.+*.ds
    
    /usr/bin/ldns-key2ds -n -1 ${zone}.zone.signed > ${KSK}.ds
    
    KKSK=`echo ${KSK} |/bin/sed -e s?"^K"?"K256"?`
    
    /usr/bin/ldns-key2ds -n -2 ${zone}.zone.signed > ${KKSK}.ds

The way to use the script on our `example.org.template` file:

    cd ~/zonesign
    sh ~/bin/dnsSignZone.sh example.org

The signed zone file will be called `example.org.zone.signed`.

Upload the signed zone file to your master nameserver, and place it in the
`/etc/nsd/` directory. You should *not* upload the `.private` files, those are
your private keys and do not belong on the nameserver for security reasons.

Do not delete your keys, keep them on your signing machine in the `zonesign`
directory. Do not delete the signed zone file from the `zonesign` directory, it
is how the script knows that signing keys already exist for the zone.

The *only* file you need to upload to the master nameserver is the
`.zone.signed` file(s).

On the master nameserver, edit the `/etc/nsd/zones.config` file and append
`.signed` to the `zonefile` definition for any signed zones you uploaded.

In this example, since we only signed the zone for example.org but did not
sign the zone for example.net, our `zones.config` file would now look like:

    zone:
        name: example.org
        zonefile: /etc/nsd/example.org.zone.signed
        notify: 2600:3c00::4e mynsdkey
        provide-xfr: 2600:3c00::4e mynsdkey
    
    zone:
        name: example.net
        zonefile: /etc/nsd/example.net.zone
        notify: 2600:3c00::4e mynsdkey
        provide-xfr: 2600:3c00::4e mynsdkey
        
You do *not* need to modify `zones.config` file on the slave. That only needs
to be modified when adding a new zone.

Restart the NSD daemon on the master:

    service nsd restart
    nsdc rebuild
    nsdc reload
    
Check that NSD sees the DNSKEY information using dig:

    dig DNSKEY example.com. @localhost +multiline +norec
    
The result should have several `IN DNSKEY` entries if NSD is loading the signed
zone file.
    
Finally, instruct the master to push the changes to the slave(s):

    nsdc notify
    
Within a few hours, the slaves will respond with updated information. If you
need them to respond immediately, you can log in to the slaves and restart,
rebuild, and reload manually. Generally that is not needed, most clients
will only query the slave when the master is not responsive, it is usually
okay to leave it alone and let it update when the TTL for the zone expires
or when the slave restarts from the cron job running on the slave.

#### Description of dnsSignZone.sh Script

The script starts by copying the appropriate `.template` file to a `.zone`
file for the zone.

The script then checks to see if there is already a signed version of the
zone file. If there is, then the script will find and use the existing
signing keys rather than generate new signing keys. It generates new
signing keys if there is not an existing *signed* zone file.

If there is already a signed zone file, the script will check to see if there
is a new version of the ZSK key it should add to the zone file. It also will
check to see if it should add an old version of the ZSK to the zone file.

The script then generates a one time use salt and signs the zone file. If it
detects a new KSK it will sign the zone file using the current ZSK, the
current KSK, and the new KSK. If it does not detect a new KSK then it will sign
the zone file using the current ZSK and KSK.

### Delegation Signer Records

The nameserver is now giving proper DNSSEC responses, but DNSSEC clients have
no way to validate the responses your nameserver is giving. They need to be
able to trust that responses are what they are suppose to be.

This is accomplished through Delegation Signer records that you must submit
through your domain registrar.

In the directory where you generated the signed zone files, there will be two
files with a `.ds` extension per signed zone. These contain the Designated
Signer information you need to submit through your registrar so that your Top
Level Domain can sign your Key Signing Key.

For the example.org zone the file names would be similar to:

    K256example.org.+007+12933.ds
    Kexample.org.+007+12933.ds
    
Here is what the contents will look like:

    [alice@localhost zonesign]$ cat K256example.org.+007+12933.ds 
    example.org.    86400   IN      DS      12933 7 2 8696a5bf3d9f0be5a2486b5b761481683e9507fa9b3f562a1b49d65b9cebfce0
    [alice@localhost zonesign]$ cat Kexample.org.+007+12933.ds 
    example.org.    86400   IN      DS      12933 7 1 61fe11182591548d37c0d0e06e5bb0fd19213b5b
    
We generated two of them, the `.ds` file with the longer digest is more secure
but some DNSSEC clients may not support it, so the shorter type is also
generated.

The first field contains the name of the zone. The second field contains the
TTL for the zone. The second and third fields contain `IN` and `DS`
respectively. It is the fields after those fields that have the information we
need to input with the registrar.

The fifth field, `12933` in the above examples, is the **Key Tag** field.

The sixth field, `7` in the above examples, is the **Algorithm** field.

The seventh field, `2` in the longer example and `1` in the shorter example,
is the **Digest Type** field.

The eighth field with the hexadecimal string is the **Digest** field.

That is the information you will need when creating a DS record for your zone
with your domain registrar. You should create two DS records, one for the
shorter digest and one for the longer digest.

You do not have to update the DS records with your registrar every time you
make a change to your zone, you only need to do it when you change your KSK
key, which you probably should do about once a year or so.

### Testing DNSSEC

When your nameserver is serving your signed zone files and you have entered the
necessary information into your registrar for the DS data, you can test your
DNSSEC setup using
[http://dnssec-debugger.verisignlabs.com/](http://dnssec-debugger.verisignlabs.com/)

Please note it that entering a DS record with your registrar may take a little
while before it actually is reflected using that resource. Usually in my own
experience it takes less than an hour, but it may take longer.

## Key Rollover

DNSSEC uses two different keys. In order to keep DNS responses small, it is
recommended that you use a 1024-bit key for the ZSK (Zone Signing Key). A
consequence of using only a 1024-bit key for your ZSK is that it needs to be
changed fairly frequently so that there is an extremely low probability of the
ZSK ever being cracked while it is still valid.

Most tutorials recommend rolling over to a new ZSK every 1 to 3 months. I
personally do it more often, it does not cost any money and it reduces the time
a potential hacker has to crack the key.

The KSK (Key Signing Key) should be a 2048-bit key. It is probably safe to
keep the same KSK for two years but I like to change it once a year.

Due to the fact that DNS responses are often cached, you can not simply
stop using one key are start using another. That will result in cases where
the old key is cached but an un-cached query is made, the response for which
is signed by the new key. This would cause the new response to be rejected
by a DNSSEC aware client as the response is signed by a different key than
the cached key it looked at.

For the ZSK this is handled by pre-publishing the new ZSK before it is used
to sign the zone and to keep publishing the old key for a short while after
the new key has been started. Double the zone TTL is what I recommend. As I
never use a TTL longer than a day, I use two days to pre-publish the new key
before I sign with it and include the old key in the zone for two days after
I start signing with the new key.

For the KSK it is handled differently. Initially you want to sign the zone
using both the old KSK and the new KSK. You will need to enter the new KSK DS
information with your registrar. When the DS information for the new KSK has
been live with your TLD for twice the TTL, then you can remove the DS info
for the old KSK and stop signing the zone with the old KSK.

### ZSK Rollover

There are three steps involved with a ZSK Rollover:

1. Generate the new ZSK and add the public key to your zone file while still
signing the zone with the old ZSK.
2. Add the old ZSK public key to the zone file and start signing with the new
ZSK.
3. Remove the old ZSK from the zone file and continue signing with with the new
ZSK.

As I personally never use a TTL longer than a day, I allow two days between
the steps.

The following scripts takes care of each step of the rollover, and takes two
arguments. The first argument specifies what step in the process it is going
to take, and the second argument is the zone:

    #!/bin/bash
    # ~/bin/zskRollover.sh
    
    step=$1
    zone=$2
    if [ ! -f ${zone}.template ]; then
      /bin/echo "Template file ${zone}.template not found."
      exit 1
    fi
    [ ! -d archive ] && mkdir archive
    [ ! -d rollover ] && mkdir rollover
    
    case "${step}" in
      "newkey")
        if [ ! -L rollover/${zone}.new.zsk ]; then
          cd rollover
          ZSK=`/usr/bin/ldns-keygen -a RSASHA1-NSEC3-SHA1 -b 1024 ${zone}`
          rm -f ${ZSK}.ds
          ln -s ${ZSK}.key ${zone}.new.zsk
        fi
        exit 0;
        ;;
      "switch")
        if [ -L rollover/${zone}.new.zsk ]; then
          OLD=`/bin/grep -H "(zsk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
          cd rollover
          rm -f ${zone}.new.zsk
          NEW=`/bin/grep -H "(zsk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
          mv "../${OLD}.key" .
          mv "../${OLD}.private" .
          ln -s ${OLD}.key ${zone}.old.zsk
          mv "${NEW}.key" ../
          mv "${NEW}.private" ../
        fi
        exit 0
        ;;
      "rmold")
        if [ -L rollover/${zone}.old.zsk ]; then
          cd rollover
          rm -f ${zone}.old.zsk
          ZSK=`/bin/grep -H "(zsk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
          mv "${ZSK}.key" ../archive/
          mv "${ZSK}.private" ../archive/
        fi
        exit 0
        ;;
      *)
        echo "usage: zskRollover.sh newkey|switch|rmold zone"
        ;;
    esac
    
    exit 1
    
Please note that this script does *not* sign the zone, it merely adjusts the
signing keys so that the `dnsSignZone.sh` script will do the right thing.

When we want to do a ZSK rollover on the example.org zone, we start by calling
this script with the `newkey` argument:

    cd ~/zonesign
    sh ~/bin/zskRollover.sh newkey example.org
    
Then update the serial in the `example.org.template` file and run the
`dnsSignZone.sh` script to create a new signed zone file for example.org that
is still signed by the old ZSK key but tells clients the new ZSK is also valid
for the zone.

Two days later:

    cd ~/zonesign
    sh ~/bin/zskRollover.sh switch example.org
    
Again update the serial in the `example.org.template` file and run the
`dnsSignZone.sh` script to create a new signed zone file for example.org.

That will create a signed zone file using the new ZSK key but it will indicate
that responses signed by the previous key are valid.

Two days later:

    cd ~/zonesign
    sh ~/bin/zskRollover.sh rmold example.org
    
Once again, update the serial in the `example.org.template` file and run the
`dnsSignZone.sh` script to create a new signed zone for file for example.org.

Now the generated zone file is signed by the new ZSK key and the old ZSK key is
no longer valid and responses signed with it will be rejected by DNSSEC aware
clients.

Remember after each step to upload the new signed zone files to your NSD
master. Rebuild and reload the NSD database and send the notify message to the
slaves.

Most people seem to like the roll the ZSK key over once every 1-3 months but I
personally like to start the process on the 1st and 16th of every month, just
to reduce the lifespan of the 1024-bit ZSK key even more.

Doing it twice a month doesn't cost me anything but it does significantly
reduce the already slim odds that an attacker will crack the key while it is
still a valid key.

### KSK Rollover

Rolling over the Key Signing Key is a different process. When a new KSK is
generated, initially the zone needs to be signed by both the old and the new
key.

DS records for the new key must be submitted to your registrar, and after
roughly twice the TTL of the zone has passed, then the zone is only signed
using the new KSK and the DS records associated with the old key can be deleted
from your registrar.

To roll over the KSK, you can use the following script:

    #!/bin/bash
    # ~/bin/kskRollover.sh
    
    step=$1
    zone=$2
    if [ ! -f ${zone}.template ]; then
      /bin/echo "Template file ${zone}.template not found."
      exit 1
    fi
    [ ! -d archive ] && mkdir archive
    [ ! -d rollover ] && mkdir rollover
    
    case "${step}" in
      "newkey")
        if [ ! -L rollover/${zone}.new.ksk ]; then
          cd rollover
          KSK=`/usr/bin/ldns-keygen -k -a RSASHA1-NSEC3-SHA1 -b 2048 ${zone}`
          rm -f ${KSK}.ds
          ln -s ${KSK}.key ${zone}.new.ksk
        fi
        exit 0
        ;;
      "switch")
        if [ -L rollover/${zone}.new.ksk ]; then
          OLD=`/bin/grep -H "(ksk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
          mv "${OLD}.key" archive/
          mv "${OLD}.private" archive/
          cd rollover
          rm ${zone}.new.ksk
          KSK=`/bin/grep -H "(ksk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
          mv "${KSK}.key" ../
          mv "${KSK}.private" ../
        fi
        exit 0
        ;;
      *)
        echo "usage: kskRollover.sh newkey|switch zone"
        ;;
    esac
    
    exit 1

Like the previous script, again please note that this script does *not* sign
the zone, it adjusts the keys so that the `dnsSignZone.sh` script will do the
right thing.

When we want to a KSK rollover on the example.org zone, we start the process by
calling this script with the `newkey` argument:

    cd ~/zonesign
    sh ~/bin/kskRollover.sh newkey example.org
    
Update the serial in the `example.org.template` file and run the
`dnsSignZone.sh` script to generate a new signed zone file.

The `dnsSignZone.sh` script will also re-create the `.ds` files that contain
the Delegation Signer information you need to enter with your domain registrar.

As the zone is currently being signed by two KSK keys, each of the `.ds` files
will have two records: one for the old key which should already have been
entered at your registrar, and a second one for the new key.

You will need to create two new DS records with your registrar. One for the
new Type 1 digest and one for the new Type 2 digest.

It is a good idea to make a note of which Key Tag corresponds to the old KSK
and which Kay Tag corresponds with the new KSK.

After twice the zone's TTL has passed, remove the DS records associated with
the old KSK from your registrar, so that only the DS records associated with
the new KSK remain.

Then you can remove the old signature from your zone as it is no longer
necessary:

    cd ~/zonesign
    sh ~/bin/kskRollover.sh switch example.org
    
Update the serial for the zone and run the `dnsSignZone.sh` script. The zone is
now only being signed with the new KSK, the old has been retired.

## Signing Key Backup

If you lose your signing keys, you will essentially need to start over and
there will be a loss of service to DNSSEC aware clients as they will initially
reject the new signed records until the TTL has expired on any cached copies of
your old keys.

I highly recommend that you create a cron job that runs at least once a day and
backs up the `zonesign` directory, preferably as an encrypted tarball, and then
uploads the backup to two other locations.

That way if there is a hardware failure on your zone signing machine, you can
use the backup to create a new zone signing machine with your current signing
keys intact.

## Automation

Taking care of you DNSSEC manually is fine for a few zones, but if you have
many zones, you probably want to automate much of this.

Automation is beyond the scope of this document, but I will list some things to
consider.

### Zone Template Files

For automation, you probably want to create a database driven application for
your zone information, and create the zone template files from the database.

If taking this approach, you can just use the UNIX seconds since epoch as your
zone serial number, seconds since epoch being the time you requested the
zone information from the database rather than the last time the information
was updated in the database.

You can then modify the `dnsSignZone.sh` to always grab the template from the
database so that the serial will always be newer than the last template that
was signed.

If you choose to write your own application to generate zone files from a
database, make it complete. Zone information you do not think you need now, you
may end up needing in the future, and it is always easier to code it as part of
the design rather than modifying the database in the future.

### Automate the `zones.config` file

Without automation, every time you add a new zone you want your nameservers to
control, you need to log in to the master and all of the slaves to update the
`zones.config` file.

If you frequently add and/or remove domains, that gets old really fast. You can
use the same application that generates zone files from a database to generate
new `zones.config` files for your master and slaves.

The `start_nsd.sh` script near the beginning of this article, for the slaves
the else block can be modified to attempt to create a fresh copy of the
`zones.config` file from the database before it does its periodic restart and
reload. It should only replace the `zones.config` file if it was successful in
talking to the database to get an updated list of zones.

For the master it should be done a little differently, the master should not
have the else block in that script.

In the instructions for setting up the master to use signed zones, I suggested
changing the master to look for `example.org.zone.signed` instead of looking
for `example.org.zone`.

When automating things, you probably do not want that distinction.

On the master, you should have an incoming directory where you upload new and
modified zone files.

A cron job on the master should check for new files in that directory once a
minute. When it finds new files in that directory, then the master should:

1. Attempt to fetch a fresh `zones.config` from the database, only replacing
the existing `zones.config` upon success.
2. `/bin/cat` the new domain.tld.zone *or* domain.tld.zone.signed file on top
of the old `/etc/nsd/domain.tld.zone` file, creating a new one if it does not
already exist. Then delete the uploaded zone from the incoming directory.
3. Restart the NSD daemon.
4. Rebuild and reload the NSD database
5. Issue a notify to all the slaves

Remember that when generating the `zones.config` file that it is different for
the master than for the slaves.

For the master, each zone defined needs a `notify` and `provide-xfr` directive
pointing to each slave.

For the slaves, each zone defined needs a `allow-notify` and `request-xfr`
directive that points to the master.

### Automate ZSK Rollover

The Zone Signing Key is only a 1024-bit key and should be rotated often. For
manual management of a DNSSEC enabled zone, I usually do it twice a month. If
automating things, you may as well do it once a week.

Rolling over the ZSK is a three step process, as described above. Do the first
step every Sunday. On Tuesday, use a public DNS to check and make sure the new
ZSK key is in fact being reported by that public DNS server and if so, do the
second step. Then on Thursday, again use a public DNS to check and make sure
the results are signed with the new ZSK. If they are, then run the third step
that removes the old ZSK.

When automating it, it is important to do those checks before proceeding. If
there was a problem uploading the signed zone file after any of those steps
were performed (e.g. a temporary network outage) then proceeding with the next
step in the rollover could result in a loss of service for some users.

Your automation therefore **must** verify that each previous step in the
rollover worked before proceeding with the next step.

Google's public nameservers are a nice nameserver to specify to `dig` when
testing. They are fully DNSSEC aware, if they give you the result you expect
then the previous step did in fact work.

### Automate KSK Rollover

Rolling over the KSK can only be partially automated because it requires manual
interaction with the domain registrar. Fortunately this only needs to be done
about once a year.

Once a week, say every Wednesday, scan the `zonesign` directory for KSK keys
that are at least 345 days old (top level of the zonesign directory, ignore
the `archive` sub-directory where expired keys are preserved).

When it finds a key that is at least 345 days old:

1. Check to see if the rollover has started. If not, start the rollover. Send
an e-mail to the admin address in the zone with the new DS information and
instructions on how to add the new DS information.
2. If a rollover has started, use a public DNS server to check to see if the
new DS information has been added through their registrar. If not, send a
reminder e-mail.
3. If new DS information is in place, check to see if the expiring DS info
is still active. If it is, send an e-mail to the admin requesting that they
delete the old DS info from their registrar.
4. Once the old DS info has been removed, stop signing the zone with the old
KSK.

It is imperitive that you do those checks and notifications when automating a
KSK rollover so that you do not stop signing the zone with the old key until
the DS information from the new key has been properly added to the domain by
the registrar.