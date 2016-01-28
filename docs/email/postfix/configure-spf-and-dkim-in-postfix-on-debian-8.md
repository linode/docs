---
author:
    name: Todd Knarr
    email: tknarr@silverglass.org
description: 'Configure SPF and DKIM in Postfix on Debian 8.'
keywords: 'email,postfix,spf,dkim,debian 8,opendkim,dns'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, December 11th 2015
modified_by:
    name: Todd Knarr
published: 'Friday, December 11th, 2015'
title: 'Configure SPF and DKIM in Postfix on Debian 8'
external_resources:
 - '[Sender Policy Framework](http://www.openspf.org/)'
 - '[DomainKeys Identified Mail](http://www.dkim.org/)'
 - '[OpenDKIM](http://www.opendkim.org/)'
 - 'The [Sender Policy Framework](https://en.wikipedia.org/wiki/Sender_Policy_Framework) and [DomainKeys Identified Mail](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail) Wikipedia pages should not be considered authoritative but do provide helpful discusson and additional references.'
---

[SPF (Sender Policy Framework)](http://www.openspf.org/) is a system that identifies to mail servers what hosts are allowed to send email for a given domain. Setting up SPF helps to prevent your email from being classified as spam.

[DKIM (DomainKeys Identified Mail)](http://www.dkim.org/) is a system that lets your official mail servers add a signature to headers of outgoing email and identifies your domain's public key so other mail servers can verify the signature. As with SPF, DKIM helps keep your mail from being considered spam. It also lets mail servers detect when your mail hass been tampered with in transit.

The instructions for setting up DNS for SPF and DKIM are generic. The instructions for configuring the SPF policy agent and OpenDKIM into Postfix should work on any distribution after making respective code adjustments for the package tool and to identify the exact path to OpenDKIM's socket file in Postfix.

{: .note}
>
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

{: .caution}
>
>You must already have Postfix installed, configured and working. Refer to the [Linode Postfix Guides](https://www.linode.com/docs/email/postfix/) for assistance.
>
>Publishing an SPF DNS record without having the SPF policy agent configured within Postfix is safe; however, publishing DKIM DNS records without having OpenDKIM working correctly within Postfix can result in your email being discarded by the recipient's email server.

## Install DKIM, SPF and Postfix

1.  Install the three required packages:

        apt-get install opendkim opendkim-tools postfix-policyd-spf-python

2.  Add user `postfix` to the `opendkim` group so that Postfix can access OpenDKIM's socket when it needs to:

        adduser postfix opendkim

## Set up SPF

### Add SPF records to DNS

The value in an SPF DNS record will look something like the following examples. The full syntax is at [the SPF record syntax page](http://www.openspf.org/SPF_Record_Syntax).

**Example 1**  Allow mail from all hosts listed in the MX records for the domain:

        v=spf1 mx -all

**Example 2**  Allow mail from a specific host:

        v=spf1 a:mail.example.com -all

- The `v=spf1` tag is required and has to be the first tag. 

- The last tag, `-all`, indicates that mail from your domain should only come from servers identified in the SPF string. Anything coming from any other source is forging your domain. An alternative is `~all`, indicating the same thing but also indicating that mail servers should accept the message and flag it as forged instead of rejecting it outright. `-all` makes it harder for spammers to forge your domain successfully; it is the recommended setting. `~all` reduces the chances of email getting lost because an incorrect mail server was used to send mail. `~all` can be used if you don't want to take chances.

The tags between identify eligible servers from which email to your domain can originate. 

- `mx` is a shorthand for all the hosts listed in MX records for your domain. If you've got a solitary mail server, `mx` is probably the best option. If you've got a backup mail server (a second MX record), using `mx` won't cause any problems. Your backup mail server will be identified as an authorized source for email althought it will probably never send any.

- The `a` tag lets you identify a specific host by name or IP address, letting you specify which hosts are authorized. You'd use `a` if you wanted to prevent the backup mail server from sending outgoing mail or if you wanted to identify hosts other than your own mail server that could send mail from your domain (e.g., putting your ISP's outgoing mail servers in the list so they'd be recognized when you had to send mail through them).

For now, we're going to stick with the `mx` version. It's simpler and correct for most basic configurations, including those that handle multiple domains. To add the record, go to your DNS management interface and add a record of type TXT for your domain itself (i.e., a blank hostname) containing this string:

    v=spf1 mx -all

If you're using Linode's DNS Manager, go to the domain zone page for the selected domain and add a new TXT record. The screen will look something like this once you've got it filled out:

![Linode DNS manager add TXT record](/docs/assets/Postfix_SPF_TXT_record.png)

If your DNS provider allows it (DNS Manager doesn't), you should also add a record of type SPF, filling it in the same way as you did the TXT record.

{: .note}
>
>The values for the DNS records above - and for the rest of this guide - are done in the style that Linode's DNS Manager needs them to be in. If you're using another provider, that respective system may require the values in a different style. For example freedns.afraid.org requires the values to be written in the style found in BIND zonefiles. Thus, the above SPF record's value would need to be wrapped in double-quotes like this: `"v=spf1 mx -all"`. You'll need to consult your DNS provider's documentation for the exact style required.

### Add the SPF policy agent to Postfix

The Python SPF policy agent adds SPF policy-checking to Postfix. The SPF record for the sender's domain for incoming mail will be checked and, if it exists, mail will be handled accordingly. Perl has its own version, but it lacks the full capabilities of Python policy agent.

1.  If you are using SpamAssassin to filter spam, you may want to edit `/etc/postfix-policyd-spf-python/policyd-spf.conf` to change the `HELO_reject` and `Mail_From_reject` settings to `False`. This edit will cause the SPF policy agent to run its tests and add a message header with the results in it while _not_ rejecting any messages. You may also want to make this change if you want to see the results of the checks but not actually apply them to mail processing. Otherwise, just go with the standard settings.

2.  Edit `/etc/postfix/master.cf` and add the following entry at the end:

    {: .file-excerpt}
    /etc/postfix/master.cf
    :   ~~~ text
        policyd-spf  unix  -       n       n       -       0       spawn
            user=policyd-spf argv=/usr/bin/policyd-spf
        ~~~

3.  Open `/etc/postfix/main.cf` and add this entry to increase the Postfix policy agent timeout, which will prevent Postfix from aborting the agent if transactions run a bit slowly:

    {: .file-excerpt}
    /etc/postfix/main.cf
    :   ~~~ conf
        policyd-spf_time_limit = 3600
        ~~~

4.  Edit the `smtpd_recipient_restrictions` entry to add a `check_policy_service` entry:

    {: .file-excerpt}
    /etc/postfix/main.cf
    :   ~~~ conf
        smtpd_recipient_restrictions =
            ...
            reject_unauth_destination,
            check_policy_service unix:private/policyd-spf,
            ...
        ~~~

    Make sure to add the `check_policy_service` entry **after** the `reject_unauth_destination` entry to avoid having your system become an open relay. If `reject_unauth_destination` is the last item in your restrictions list, add the comma after it and omit the comma at the end of the `check_policy_service` item above.

5.  Restart Postfix:

        systemctl restart postfix

You can check the operation of the policy agent by looking at raw headers on incoming email messages for the SPF results header. The header the policy agent adds to messages should look something like this:

    Received-SPF: Pass (sender SPF authorized) identity=mailfrom; client-ip=127.0.0.1; helo=mail.example.com; envelope-from=text@example.com; receiver=tknarr@silverglass.org

This header indicates a successful check against the SPF policy of the sending domain. If you changed the policy agent settings in Step 1 to not reject mail that fails the SPF check, you may see Fail results in this header. You won't see this header on outgoing or local mail.

The SPF policy agent also logs to `/var/log/mail.log`. In the `mail.log` file you'll see messages like this from the policy agent:

    Jan  7 06:24:44 arachnae policyd-spf[21065]: None; identity=helo; client-ip=127.0.0.1; helo=mail.example.com; envelope-from=test@example.com; receiver=tknarr@silverglass.org
    Jan  7 06:24:44 arachnae policyd-spf[21065]: Pass; identity=mailfrom; client-ip=127.0.0.1; helo=mail.example.com; envelope-from=test@example.com; receiver=tknarr@silverglass.org

The first message is a check of the HELO command, in this case indicating that there wasn't any SPF information matching the HELO (which is perfectly OK). The second message is the check against the envelope From address, and indicates the address passed the check and is coming from one of the outgoing mail servers the sender's domain has said should be sending mail for that domain. There may be other statuses in the first field after the colon indicating failure, temporary or permanent errors and so on.

## Set up DKIM

DKIM involves setting up the OpenDKIM package, hooking it into Postfix, and adding DNS records.

### Configure OpenDKIM

1.  The main OpenDKIM configuration file `/etc/opendkim.conf` needs to look like this:

    {: .file}
    /etc/opendkim.conf
    :   ~~~ conf
        # This is a basic configuration that can easily be adapted to suit a standard
        # installation. For more advanced options, see opendkim.conf(5) and/or
        # /usr/share/doc/opendkim/examples/opendkim.conf.sample.

        # Log to syslog
        Syslog          yes
        # Required to use local socket with MTAs that access the socket as a non-
        # privileged user (e.g. Postfix)
        UMask           002
        # OpenDKIM user
        # Remember to add user postfix to group opendkim
        UserID          opendkim

        # Map domains in From addresses to keys used to sign messages
        KeyTable        /etc/opendkim/key.table
        SigningTable        refile:/etc/opendkim/signing.table

        # Hosts to ignore when verifying signatures
        ExternalIgnoreList  /etc/opendkim/trusted.hosts
        InternalHosts       /etc/opendkim/trusted.hosts

        # Commonly-used options; the commented-out versions show the defaults.
        Canonicalization    relaxed/simple
        Mode            sv
        SubDomains      no
        #ADSPAction     continue
        AutoRestart     yes
        AutoRestartRate     10/1M
        Background      yes
        DNSTimeout      5
        SignatureAlgorithm  rsa-sha256

        # Always oversign From (sign using actual From and a null From to prevent
        # malicious signatures header fields (From and/or others) between the signer
        # and the verifier.  From is oversigned by default in the Debian pacakge
        # because it is often the identity key used by reputation systems and thus
        # somewhat security sensitive.
        OversignHeaders     From
        ~~~

    Edit `/etc/opendkim.conf` and replace it's contents with the above, or download [a copy of opendkim.conf](/docs/assets/postfix-opendkim.conf.txt), upload it to your server and copy it over `/etc/opendkim.conf`.

2.  Ensure that file permissions are set correctly:

        chmod u=rw,go=r /etc/opendkim.conf

3.  Create the directories to hold OpenDKIM's data files, assign ownership to the `opendkim` user, and restrict the file permissions:

        mkdir /etc/opendkim
        mkdir /etc/opendkim/keys
        chown -R opendkim:opendkim /etc/opendkim
        chmod go-rw /etc/opendkim/keys

4.  Create the signing table `/etc/opendkim/signing.table`. It needs to have one line per domain that you handle email for. Each line should look like this:

    {: .file-excerpt}
    /etc/opendkim/signing.table
    :   ~~~
        *@example.com   example
        ~~~

    Replace `example.com` with your domain and `example` with a short name for the domain. The first field is a pattern that matches e-mail addresses. The second field is a name for the key table entry that should be used to sign mail from that address. For simplicity's sake, we're going to set up one key for all addresses in a domain.

5.  Create the key table `/etc/opendkim/key.table`. It needs to have one line per short domain name in the signing table. Each line should look like this:

    {: .file-excerpt}
    /etc/opendkim/key.table
    :   ~~~ text
        example     example.com:YYYYMM:/etc/opendkim/keys/example.private
        ~~~

    Replace `example` with the `example` value you used for the domain in the signing table (make sure to catch the second occurrence at the end, where it's followed by `.private`). Replace `example.com` with your domain name and replace the `YYYYMM` with the current 4-digit year and 2-digit month (this is referred to as the selector). The first field connects the signing and key tables.

    The second field is broken down into 3 sections separated by colons.

    - The first section is the domain name for which the key is used.
    - The second section is a selector used when looking up key records in DNS.
    - The third section names the file containing the signing key for the domain.

    {: .note}
    >
    > The flow for DKIM lookup starts with the sender's address. The signing table is scanned until an entry whose pattern (first item) matches the address is found. Then, the second item's value is used to locate the entry in the key table whose key information will be used. For incoming mail the domain and selector are then used to find the public key TXT record in DNS and that public key is used to validate the signature. For outgoing mail the private key is read from the named file and used to generate the signature on the message.

6.  Create the trusted hosts file `/etc/opendkim/trusted.hosts`. Its contents need to be:

    {: .file}
    /etc/opendkim/trusted.hosts
    :   ~~~ text
        127.0.0.1
        ::1
        localhost
        myhostname
        myhostname.example.com
        example.com
        ~~~

    When creating the file, change `myhostname` to the name of your server and replace `example.com` with your own domain name. We're identifying the hosts that users will be submitting mail through and should have outgoing mail signed, which for basic configurations will be your own mail server.

7.  Make sure the ownership and permissions on `/etc/opendkim` and it's contents are correct (`opendkim` should own everything, the `keys` directory should only be accessible by the owner) by running the following commands:

    chown -R opendkim:opendkim /etc/opendkim
    chmod -R go-rwx /etc/opendkim/keys

8.  Generate keys for each domain:

        opendkim-genkey -b 2048 -r -s YYYYMM

    Replace `YYYYMM` with the current year and month as in the key table. This will give you two files, `YYYYMM.private` containing the key and `YYYYMM.txt` containing the TXT record you'll need to set up DNS. Rename the files so they have names matching the third section of the second field of the key table for the domain:

        mv YYYYMM.private example.private
        mv YYYYMM.txt example.txt

    Repeat the commands in this step for every entry in the key table. The `-b 2048` indicates the number of bits in the RSA key pair used for signing and verification. 1024 bits is the minimum, but with modern hardware 2048 bits is safer. (It's possible 4096 bits will be required at some point.)

9.  Make sure the ownership, permissions and contents on `/etc/opendkim` are correct by running the following commands:

        cd /etc
        chown -R opendkim:opendkim /etc/opendkim
        chmod -R go-rw /etc/opendkim/keys

10. Check that OpenDKIM starts correctly:

        systemctl restart opendkim

    You should not get error messages, but if you do, use:

        systemctl status -l opendkim

    to get the status and untruncated error messages.

### Set up DNS

As with SPF, DKIM uses TXT records to hold information about the signing key for each domain. Using YYYYMM as above, you need to make a TXT record for the host `YYYYMM._domainkey` for each domain you handle mail for. Its value can be found in the `example.txt` file for the domain. Those files look like this:

{: .file}
example.txt
:   ~~~ text
    201510._domainkey  IN  TXT ( "**v=DKIM1; k=rsa; s=email; "
        "p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu5oIUrFDWZK7F4thFxpZa2or6jBEX3cSL6b2TJdPkO5iNn9vHNXhNX31nOefN8FksX94YbLJ8NHcFPbaZTW8R2HthYxRaCyqodxlLHibg8aHdfa+bxKeiI/xABRuAM0WG0JEDSyakMFqIO40ghj/h7DUc/4OXNdeQhrKDTlgf2bd+FjpJ3bNAFcMYa3Oeju33b2Tp+PdtqIwXR"
        "ZksfuXh7m30kuyavp3Uaso145DRBaJZA55lNxmHWMgMjO+YjNeuR6j4oQqyGwzPaVcSdOG8Js2mXt+J3Hr+nNmJGxZUUW4Uw5ws08wT9opRgSpn+ThX2d1AgQePpGrWOamC3PdcwIDAQAB**" )  ; ----- DKIM key 201510 for example.com

    ~~~

The value inside the parentheses is what you want. Select and copy the entire region from (but not including) the double-quote before `v=DKIM1` on up to (but not including) the final double-quote before the closing parentheses. Then edit out the double-quotes within the copied text and the whitespace between them. From the above file the result would be:

{: .file-excerpt}
example-copied.txt
:   ~~~ text
    v=DKIM1; k=rsa; s=email; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu5oIUrFDWZK7F4thFxpZa2or6jBEX3cSL6b2TJdPkO5iNn9vHNXhNX31nOefN8FksX94YbLJ8NHcFPbaZTW8R2HthYxRaCyqodxlLHibg8aHdfa+bxKeiI/xABRuAM0WG0JEDSyakMFqIO40ghj/h7DUc/4OXNdeQhrKDTlgf2bd+FjpJ3bNAFcMYa3Oeju33b2Tp+PdtqIwXRZksfuXh7m30kuyavp3Uaso145DRBaJZA55lNxmHWMgMjO+YjNeuR6j4oQqyGwzPaVcSdOG8Js2mXt+J3Hr+nNmJGxZUUW4Uw5ws08wT9opRgSpn+ThX2d1AgQePpGrWOamC3PdcwIDAQAB
    ~~~

Paste that into the value for the TXT record.

If you're using Linode's DNS manager, this is what the add TXT record screen will look like when you have it filled out:

![Linode DNS manager add TXT record](/docs/assets/Postfix_DKIM_TXT_record.png)

Repeat this for every domain you handle mail for, using the `.txt` file for that domain.

### Test your configuration

Test the keys for correct signing and verification using the `opendkim-testkey` command:

    opendkim-testkey -d example.com -s YYYYMM

If everything is OK you shouldn't get any output. If you want to see more information, add `-vvv` to the end of the command. That produces verbose debugging output. The last message should be "key OK". Just before that you may see a "key not secure" message. That's normal and doesn't signal an error, it just means your domain isn't set up for DNSSEC yet.

### Hook OpenDKIM into Postfix

1.  Create the OpenDKIM socket directory in Postfix's work area and make sure it has the correct ownership:

        mkdir /var/spool/postfix/opendkim
        chown opendkim:postfix /var/spool/postfix/opendkim

2.  Set the correct socket for Postfix in the OpenDKIM defaults file `/etc/defaults/opendkim`:

    {: .file}
    /etc/defaults/opendkim
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

3.  Edit `/etc/postfix/main.cf` and add a section to activate processing of e-mail through the OpenDKIM daemon:

    {: .file-excerpt}
    /etc/postfix/main.cf
    :   ~~~ conf
        # Milter configuration
        # OpenDKIM
        milter_default_action = accept
        milter_protocol = 2
        smtpd_milters = local:/opendkim/opendkim.sock
        non_smtpd_milters = local:/opendkim/opendkim.sock
        ~~~

    You can put this anywhere in the file. The usual practice is to put it after the `smtpd_recipient_restrictions` entry. You'll notice the path to the socket isn't the same here as it was in the `/etc/defaults/opendkim` file. That's because of Postfix's chroot jail, the path here is the path within that restricted view of the filesystem instead of within the actual filesystem.

4.  Restart the OpenDKIM daemon so it sets up the correct socket for Postfix:

        systemctl restart opendkim

5.  Restart Postfix so it starts using OpenDKIM when processing mail:

        systemctl restart postfix

### Verify that everything's fully operational

The easiest way to verify that everything's working is to send a test e-mail to `check-auth@verifier.port25.com` using an email client configured to submit mail to the submission port on your mail server. It will analyze your message and mail you a report indicating whether your email was signed correctly or not. It also reports on a number of other things such as SPF configuration and SpamAssassin flagging of your domain. If there's a problem, it'll report what the problem was.

### Set up Author Domain Signing Practices (ADSP) (optional)

As a final item, you can add an ADSP policy to your domain saying that all emails from your domain should be DKIM-signed. As usual, it's done with a TXT record for host `_adsp._domainkey` in your domain with a value of `dkim=all`. If you're using Linode's DNS Manager, the screen for the new text record will look like this:

![Linode DNS manager add TXT record](/docs/assets/Postfix_ADSP_TXT_record.png)

You don't need to set this up, but doing so makes it harder for anyone to forge email from your domains because recipient mail servers will see the lack of a DKIM signature and reject the message.

### Key rotation

The reason the YYYYMM format is used for the selector is that best practice calls for changing the DKIM signing keys every so often (monthly is recommended, and no longer than every 6 months). To do that without disrupting messages in transit, you generate the new keys using a new selector. The process is:

1.  Generate new keys as in step 6 of "Configuring OpenDKIM". Do this in a scratch directory, not directly in `/etc/opendkim/keys`. Use the current year and month for the YYYYMM selector value, so it's different from the selector currently in use.

2.  Use the newly-generated `.txt` files to add the new keys to DNS as in the DKIM "Setting Up DNS" section, using the new YYYYMM selector in the host names. Don't remove or alter the existing DKIM TXT records.

3.  Stop Postfix and OpenDKIM by doing a `systemctl stop postfix opendkim` so that they won't be processing mail while you're changing out keys.

4.  Copy the newly-generated `.private` files into place and make sure their ownership and permissions are correct by running these commands from the directory in which you generated the key files:

        cp *.private /etc/opendkim/keys/
        chown opendkim:opendkim /etc/opendkim/keys/*
        chmod go-rw /etc/opendkim/keys/*

5.  Edit `/etc/opendkim/key.table` and change the old YYYYMM values to the new selector, reflecting the current year and month. Save the file.

6.  Restart OpenDKIM and Postfix by:

        systemctl start opendkim
        systemctl start postfix

    Make sure they both start without any errors.

7.  After a couple of weeks, all email in transit should either have been delivered or bounced and the old DKIM key information in DNS won't be needed anymore. Delete the old `YYYYMM._domainkey` TXT records in each of your domains, leaving just the newest ones (most recent year and month). Don't worry if you forget and leave the old keys around longer than planned. There's no security issue. Removing the obsolete records is more a matter of keeping things neat and tidy than anything else.
