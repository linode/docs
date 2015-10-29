---
author:
  name: Todd Knarr
  email: tknarr@silverglass.org
description: 'Setting up SPF and DKIM for Postfix on Debian 8.'
keywords: 'email,mail,postfix,spf,dkim'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, October 29th 2015
modified_by:
  name: Todd Knarr
published: 'Thursday, October 29th, 2015'
title: 'Configuring Postfix for SPF and DKIM'
---

Getting Started
---------------

[SPF (Sender Policy Framework)](http://www.openspf.org/) is a system to advertise to mail servers what hosts are allowed to send e-mail for a given domain. Setting it up helps in keeping your mail from being classified as spam.

DKIM (DomainKeys Identified Mail) is a system to let your official mailservers add a signature to the headers of outgoing e-mail and advertise your domain's public key so other mailservers can verify the signature. As with SPF, it helps keep your mail from being considered spam. It also lets mailservers detect when your mail's been tampered with in transit.

The instructions for SPF will work for any Linux distribution and any mail server software. The instructions for setting up DKIM should work for any Linux distribution that uses the OpenDKIM package, as long as you configure the right repositories for that distribution to get the latest packages. The instructions for hooking OpenDKIM into Postfix work in principle for any system using Postfix and OpenDKIM, but the details are fairly specific to how Postfix is configured to work on Debian 8 (Jessie).

Setting up SPF
--------------

SPF only needs records added to DNS. The string will look something like the following examples. The full syntax is at [the SPF record syntax page](http://www.openspf.org/SPF_Record_Syntax).

Allow mail from all hosts listed in the MX records for the domain:

    "v=spf1 mx -all"

Allow mail from a specific host:

    "v=spf1 a:mail.example.com -all"

The "v=spf1" tag is required and has to be the first tag. The last tag, "-all", indicates that mail from your domain should only come from servers identified in the SPF string, anything coming from any other source is forging your domain. An alternative is "~all", indicating the same thing but also indicating that mailservers should accept the message and flag it as forged instead of rejecting it outright. I prefer "-all" to make it harder for spammers to forge my domain successfully, but if you're nervous you might want to use "~all" so no mail gets lost because of errors.

The tags in between identify the servers mail for your domain can come from. "mx" is a shorthand for all the hosts listed in MX records for your domain. If you've got just one mail server, it's probably the best option. If you've got a backup mail server (a second MX record) using "mx" won't cause any problems, your backup mail server will be advertised as an authorized source for mail and it just won't ever send any. The "a" tag lets you identify a specific host by name or IP address, letting you be specific about exactly which hosts are authorized. You'd use it if you wanted to be pedantic about the backup mail server not being allowed to send outgoing mail, or if you wanted to identify hosts other than your own mail server that could send mail from your domain (eg. putting your ISP's outgoing mail servers in the list so they'd be recognized when you had to send mail through them). For now we're going to stick with the "mx" version, it's simpler and is correct for most basic configurations including ones that handle multiple domains.

To add the record, go to your DNS management interface and add a record of type TXT for your domain itself (ie. a blank hostname) containing this string:

    "v=spf1 mx -all"

If you're using Linode's DNS Manager, go to the domain zone page for the domain you want to set SPF up for and add a new TXT record. The screen will look something like this when you've got it filled out:

![Linode DNS manager add TXT record](/docs/assets/9901_SPF_TXT_record.png)

If your DNS provider allows it (DNS Manager doesn't) you should also add a record of type SPF, filling it in the same way as you did the TXT record.

That's all that's needed to set up SPF for your domain.

Setting up DKIM
---------------

DKIM involves setting up the OpenDKIM package and hooking it into Postfix as well as adding DNS records.

First, switch to a root shell by doing:

    sudo -s

or

    su -

You'll need root privilegs for almost all of the setup.

## Installing the packages ##

Install the required `opendkim` and `opendkim-tools` packages by running this command:

    apt-get install opendkim opendkim-tools

Tell it "Y" when it asks whether to download and install the listed packages. It won't take long and won't prompt for anything. Once it's finished, check by doing:

    opendkim-testkey

If everything installed successfully it should give you the help text for the command. At this point OpenDKIM is up and running, but it's not hooked into anything so it's harmless to just leave it if you get interrupted.

## Configuring OpenDKIM ##

1. The main OpenDKIM configuration file `/etc/opendkim.conf` needs to look like this:

{: .file}
/etc/opendkim.conf
:   ~~~ conf
    # This is a basic configuration that can easily be adapted to suit a standard
    # installation. For more advanced options, see opendkim.conf(5) and/or
    # /usr/share/doc/opendkim/examples/opendkim.conf.sample.

    # Log to syslog
    Syslog			yes
    # Required to use local socket with MTAs that access the socket as a non-
    # privileged user (e.g. Postfix)
    UMask			002
    # OpenDKIM user
    # Remember to add user postfix to group opendkim
    UserID			opendkim

    # Map domains in From addresses to keys used to sign messages
    KeyTable		/etc/opendkim/key.table
    SigningTable		refile:/etc/opendkim/signing.table

    # Hosts to ignore when verifying signatures
    ExternalIgnoreList	/etc/opendkim/trusted.hosts
    InternalHosts		/etc/opendkim/trusted.hosts

    # Commonly-used options; the commented-out versions show the defaults.
    Canonicalization	relaxed/simple
    Mode			sv
    SubDomains		no
    #ADSPAction		continue
    AutoRestart		yes
    AutoRestartRate		10/1M
    Background		yes
    DNSTimeout		5
    SignatureAlgorithm	rsa-sha256

    # Always oversign From (sign using actual From and a null From to prevent
    # malicious signatures header fields (From and/or others) between the signer
    # and the verifier.  From is oversigned by default in the Debian pacakge
    # because it is often the identity key used by reputation systems and thus
    # somewhat security sensitive.
    OversignHeaders		From
    ~~~

Edit `/etc/opendkim.conf` and replace it's contents with the above, or download [a copy of opendkim.conf](/doc/assets/9902_opendkim.conf), upload it to your server and copy it over top of `/etc/opendkim.conf`. Do a `chmod u=rw,go=r /etc/opendkim.conf` to make sure it's permissions are set correctly.

2. Set the correct socket for Postfix in the OpenDKIM defaults file `/etc/defaults/opendkim`:

{: .file}
:   ~~~ conf
    # Command-line options specified here will override the contents of
    # /etc/opendkim.conf. See opendkim(8) for a complete list of options.
    #DAEMON_OPTS=""
    #
    # Uncomment to specify an alternate socket
    # Note that setting this will override any Socket value in opendkim.conf
    SOCKET="local:/var/spool/postfix/opendkim/opendkim.sock"
    #SOCKET="inet:54321" # listen on all interfaces on port 54321
    #SOCKET="inet:12345@localhost" # listen on loopback on port 12345
    #SOCKET="inet:12345@192.0.2.1" # listen on 192.0.2.1 on port 12345
    ~~~

Uncomment the first SOCKET line and edit it so it matches the uncommented line in the above file. The path to the socket is different from the default because on Debian 8 the Postfix process that handles mail runs in a chroot jail and can't access the normal location.

3. Create the directories to hold OpenDKIM's data files:

    mkdir /etc/opendkim
    mkdir /etc/opendkim/keys
    chown -R opendkim:opendkim /etc/opendkim
    chmod go-rw /etc/opendkim/keys
