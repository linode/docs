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

Setting up SPF
--------------

SPF only needs records added to DNS. The string will look something like the following examples. The full syntax is at [the SPF record syntax page](http://www.openspf.org/SPF_Record_Syntax).

Allow mail from all hosts listed in the MX records for the domain:
```
"v=spf1 mx -all"
```

Allow mail from a specific host:
```
"v=spf1 a:mail.example.com -all"
```

The "`v=spf1`" tag is required and has to be the first tag. The last tag, "`-all`", indicates that mail from your domain should only come from servers identified in the SPF string, anything coming from any other source is forging your domain. An alternative is "`~all`", indicating the same thing but also indicating that mailservers should accept the message and flag it as forged instead of rejecting it outright. I prefer "`-all`" to make it harder for spammers to forge my domain successfully, but if you're nervous you might want to use "`~all`" so no mail gets lost because of errors.

The tags in between identify the servers mail for your domain can come from. `mx` is a shorthand for all the hosts listed in MX records for your domain. If you've got just one mail server, it's probably the best option. If you've got a backup mail server (a second MX record) using `mx` won't cause any problems, your backup mail server will be advertised as an authorized source for mail and it just won't ever send any. The `a` tag lets you identify a specific host by name or IP address, letting you be specific about exactly which hosts are authorized. You'd use it if you wanted to be pedantic about the backup mail server not being allowed to send outgoing mail, or if you wanted to identify hosts other than your own mail server that could send mail from your domain (eg. putting your ISP's outgoing mail servers in the list so they'd be recognized when you had to send mail through them). For now we're going to stick with the `mx` version, it's simpler and is correct for most basic configurations including ones that handle multiple domains.

To add the record, go to your DNS management interface and add a record of type TXT for your domain itself (ie. a blank hostname) containing this string:
```
"v=spf1 mx -all"
```
If you're using Linode's DNS Manager, go to the domain zone page for the domain you want to set SPF up for and add a new TXT record. The screen will look something like this when you've got it filled out:

![Linode DNS manager add TXT record](/docs/assets/9901_SPF_TXT_record.png)

If your DNS provider allows it (DNS Manager doesn't) you should also add a record of type SPF, filling it in the same way as you did the TXT record.
