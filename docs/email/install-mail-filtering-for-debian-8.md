---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: 'Configuring Virus and Spam protection for your mail server.'
keywords: 'email,mail,postfix,dovecot,mysql,debian,clamav,spamassassin,amavis'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Monday, September 19th, 2016'
modified_by:
  name: Alex Fornuto
published: 'Monday, September 19th, 2016'
title: 'Installing Mail Filtering for Debian 8'
external_resources:
 - '[The Official SpamAssassin Site](http://spamassassin.apache.org/)'
 - '[The Official ClamAV Site](http://www.clamav.net/)'
 - '[Ubuntu Community Documentation](https://help.ubuntu.com/community/PostfixAmavisNew)'
 - '[Whitelisting and Blacklisting in Amavis](http://www.akadia.com/services/postfix_amavisd.html#Globally%20Sender%20Whitelists%20and%20Blacklists)'
---
If you're running a mail server, it's a good idea to have spam and virus filtering. Spam can flood your users' inboxes, and those running insecure local PCs are susceptible to virus infection. Protecting your email server protects your clients and you. This guide goes through the installation and configuration of virus and spam filtering, using Amavis-new, ClamAV, and SpamAssassin.

 {: .caution }
>
> This is a generic introductory guide. You are responsible for ensuring that your virus/spam filtering system meets the needs of your environment.

## Prerequisites

This guide assumes you have already followed our [Email with Postfix, Dovecot, and MySQL](/docs/email/postfix/email-with-postfix-dovecot-and-mysql) guides and are running Debian 8. This guide is written for the root user, and all commands listed require root privileges.

## Installation

Run the following commands to install all the necessary packages:

    apt-get update
    apt-get upgrade
    apt-get install amavisd-new spamassassin clamav-daemon libnet-dns-perl libmail-spf-perl pyzor razor

**Optional:** Installing the following packages will allow your filters to better scan through various archive files. Unless you're deploying on a small disk where storage is a concern, this step is recommended:

    apt-get install arj bzip2 cabextract cpio file gzip lhasa nomarch pax unrar-free unzip zip zoo

## Configuration

In this section, we'll configure the newly installed software to work with our existing mail server.

### ClamAV

Here, we'll make sure ClamAV stays updated with the latest virus definitions.

1.  The following commands add the ClamAV and Amavis users to each others' groups, which prevents ownership issues from inhibiting scans:

        adduser clamav amavis
        adduser amavis clamav

### SpamAssassin

Here, we'll set various options and settings for SpamAssassin.

1.  Make a copy of the default configuration file:

        cp /etc/spamassassin/local.cf /etc/spamassassin/local.cf.orig

2.  SpamAssassin scores incoming messages and assigns a score based on its spam characteristics. A score of 0 is considered safe, while a score of 10 or higher is usually spam. You need to adjust its configuration file to determine what score threshold will be allowed through the filter. We're going to use 8, but this can be adjusted later. Locate and uncomment the line `# required_score 5.0` by removing the **\#** symbol, and adjust the value to 8:

    {: .file }
    /etc/spamassassin/local.cf
    :   ~~~
        #   Set the threshold at which a message is considered spam (default: 5.0)
        #
        required_score 8
        ~~~

3.  Restart the SpamAssassin daemon:

        systemctl restart spamassassin.service

### Amavis

1.  On Debian-based systems like Ubuntu, Amavis splits its configuration among several files. Enable spam and antivirus filtering by opening the `/etc/amavis/conf.d/15-content_filter_mode` file and removing the comment symbols (**\#**) from the two bypass blocks, as shown below:

    {: .file }
    /etc/amavis/conf.d/15-content\_filter\_mode
    :   ~~~ perl
        use strict;

        # You can modify this file to re-enable SPAM checking through spamassassin
        # and to re-enable antivirus checking.

        #
        # Default antivirus checking mode
        # Please note, that anti-virus checking is DISABLED by
        # default.
        # If You wish to enable it, please uncomment the following lines:


        @bypass_virus_checks_maps = (
           \%bypass_virus_checks, \@bypass_virus_checks_acl, \$bypass_virus_checks_re);


        #
        # Default SPAM checking mode
        # Please note, that anti-spam checking is DISABLED by
        # default.
        # If You wish to enable it, please uncomment the following lines:


        @bypass_spam_checks_maps = (
           \%bypass_spam_checks, \@bypass_spam_checks_acl, \$bypass_spam_checks_re);

        1;  # ensure a defined return
        ~~~


    {: .note }
    >
    > Be sure to remove all four **\#** symbols, as shown above.

2.  Restart Amavis:

        systemctl restart amavis.service

3.  Open the Postfix main configuration file. If you followed our Email with Postfix Dovecot and MySQL guide, you should already have a backup. Add the following line to the bottom of the file:

    {: .file }
    /etc/postfix/main.cf
    :   ~~~
        # Additional option for filtering
        content_filter = smtp-amavis:[127.0.0.1]:10024
        ~~~

4.  The next configuration file to edit is `/etc/postfix/master.cf`. On a new line below the `pickup` directive, add the following options:

    {: .file }
    /etc/postfix/master.cf
    :   ~~~
        pickup    fifo  n       -       -       60      1       pickup
                 -o content_filter=
                 -o receive_override_options=no_header_body_checks
        ~~~

5.  Add the following lines to the bottom of the file, and be sure to include the indents on lines beginning with `-o`:

    {: .file }
    /etc/postfix/master.cf
    :   ~~~
        # Options for the filter
        smtp-amavis     unix    -       -       -       -       2       smtp
                -o smtp_data_done_timeout=1200
                -o smtp_send_xforward_command=yes
                -o disable_dns_lookups=yes
                -o max_use=20

        # Listener for filtered mail
        127.0.0.1:10025 inet    n       -       -       -       -       smtpd
                -o content_filter=
                -o local_recipient_maps=
                -o relay_recipient_maps=
                -o smtpd_restriction_classes=
                -o smtpd_delay_reject=no
                -o smtpd_client_restrictions=permit_mynetworks,reject
                -o smtpd_helo_restrictions=
                -o smtpd_sender_restrictions=
                -o smtpd_recipient_restrictions=permit_mynetworks,reject
                -o smtpd_data_restrictions=reject_unauth_pipelining
                -o smtpd_end_of_data_restrictions=
                -o mynetworks=127.0.0.0/8
                -o smtpd_error_sleep_time=0
                -o smtpd_soft_error_limit=1001
                -o smtpd_hard_error_limit=1000
                -o smtpd_client_connection_count_limit=0
                -o smtpd_client_connection_rate_limit=0
                -o receive_override_options=no_header_body_checks,no_unknown_recipient_checks
        ~~~

6.  Load the new configuration into Postfix:

        systemctl restart postfix.service

## Testing ClamAV

You'll want to test that your email server is removing malicious emails from your users' inboxes. [The European Expert Group For IT-Security](http://www.eicar.org/) has files available for download that will be seen by ClamAV as a virus. You can download these test virus files [here](http://www.eicar.org/85-0-Download.html).

{: .note }
>
> Please be aware that if you are running antivirus software locally, it may block these test files. Be sure to read the `Important Note` section of the EICAR download page before you continue.

You can send these files as attachments to an email address on your mail server. If ClamAV is working, the recipient shouldn't see the email and your `/var/log/mail.log` file should have lines similar to this:

    mail amavis[18034]: (18034-02) Blocked INFECTED (Eicar-Test-Signature)

You can quickly search for these lines with the command:

    cat /var/log/mail.log | grep INFECTED

## Testing SpamAssassin

The string below is used for testing spam filters. By sending it in an email (without whitespace or extra lines), you can test that the SpamAssassin filter is active:

    XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X

You can search for the relevant logfiles with `cat /var/log/mail.log | grep SPAM`

## Enabling Notifications

Depending on the amount of users and activity on your mail server, you may wish to receive notifications when ClamAV identifies and removes an incoming virus, or SpamAssassin filters an email as spam. If you want to receive emails, open the file `/etc/amavis/conf.d/20-debian_defaults`. Add the desired email address to the **\$virus\_admin** and **\$spam\_admin** parameters, as shown below.

{: .file-excerpt }
/etc/amavis/conf.d/20-debian_defaults
:   ~~~
    use strict;

    #
    # These are Ubuntu specific defaults for amavisd-new configuration
    #
    # DOMAIN KEYS IDENTIFIED MAIL (DKIM)
    $enable_dkim_verification = 1;
    # Don't be verbose about sending mail:
    @whitelist_sender_acl = qw( .$mydomain );
    $final_virus_destiny      = D_DISCARD; # (defaults to D_BOUNCE)
    $final_banned_destiny     = D_DISCARD;  # (defaults to D_BOUNCE)
    $final_spam_destiny       = D_DISCARD;  # (defaults to D_REJECT)
    $final_bad_header_destiny = D_PASS;  # (defaults to D_PASS), D_BOUNCE suggested

    $virus_admin = "admin\@example.com"; # due to D_DISCARD default
    $spam_admin = "admin\@example.com";

    # Set to empty ("") to add no header
    $X_HEADER_LINE = "Debian $myproduct_name at $mydomain";
    ~~~

After changing this file, you will need to restart Amavis:

    systemctl restart amavis.service

### Optional Settings

1.  You can whitelist senders to ensure that their messages are never filtered. Likewise, you can blacklist senders that you feel should always be filtered. The lines to add to `/etc/amavis/conf.d/50-user` would look like this:

        @whitelist_sender_maps = (['docs@linode.com']);
        @blacklist_sender_maps = (['.gmail.com', 'scammer@junk.org']);

    In the example above all email from `docs@linode.com` will be passed through regardless of its spam score. All emails from any Gmail address, as well as `scammer@junk.org`, will be flagged as spam. Please note that spammers often spoof the sender address, so whitelisting an entire domain may or may not be a good idea in your situation. When you are done, save and exit this file.

2.  If you decide to modify these values, you will need to restart Amavis before they will take effect:

        service amavis restart
