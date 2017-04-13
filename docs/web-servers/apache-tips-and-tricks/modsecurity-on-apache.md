---
author:
  name: Chris Ciufo
  email: docs@linode.com
description: 'mod_security'
keywords: 'apache, mod_security'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['web-servers/apache/mod-security/','websites/apache-tips-and-tricks/modsecurity-on-apache/']
modified: Friday, February 14th, 2014
modified_by:
  name: Linode
published: 'Thursday, November 10th, 2011'
title: 'mod_security on Apache'
external_resources:
 - '[ModSecurity Home Page](http://www.modsecurity.org)'
 - '[OWASP Home Page](https://www.owasp.org/index.php/Main_Page)'
 - '[OWASP ModSecurity Core Rule Set Wiki](https://www.owasp.org/index.php/Category:OWASP_ModSecurity_Core_Rule_Set_Project#tab=Installation)'
---

ModSecurity is a web application firewall for the Apache web server. In addition to providing logging capabilities, ModSecurity can monitor the HTTP traffic in real time in order to detect attacks. ModSecurity also operates as a web intrusion detection tool, allowing you to react to suspicious events that take place at your web systems.

## Installing ModSecurity

Before you install ModSecurity, you'll want to have a LAMP stack set up on your Linode. For instructions, see the [LAMP Guides](/docs/websites/lamp/).

### Ubuntu / Debian

To install ModSecurity on a Linode running Ubuntu or Debian, enter the following commands, one by one:

    sudo apt-get install libxml2 libxml2-dev libxml2-utils
    sudo apt-get install libaprutil1 libaprutil1-dev
    sudo apt-get install libapache-mod-security

ModSecurity is now installed on your Linode.

### CentOS / Fedora

To install ModSecurity on a Linode running CentOS or Fedora, perform the following steps:

1.  Install the GCC compiler and the dependencies by entering the following commands, one by one:

        sudo yum install mod_security

2.  Restart Apache by entering the following command:

        sudo /etc/init.d/httpd restart

ModSecurity is now installed on your Linode.

## OWASP ModSecurity Core Rule Set

For a base configuration, we are going to use the OWASP core rule set. Installation instructions are in the SpiderLabs GitHub project here:

-   <https://github.com/SpiderLabs/owasp-modsecurity-crs/blob/master/INSTALL>

## Configuring ModSecurity

You'll want to use the `modsecurity_10_crs_config`, so let's copy that from the example:

    cp modsecurity_crs_10_setup.conf.example modsecurity_crs_10_setup.conf

There are five rules directories:

- activated\_rules
- base\_rules
- experimental\_rules
- optional\_rules
- slr\_rules

 {: .note }
>
> The activated\_rules directory will be empty in case you wanted to symlink the configuration files for the rules you wish to use into that directory.

There are two ways to configure ModSecurity: use a basic ruleset, or use symbolic links. The following sections explain how to use both methods.

### Using a Basic Ruleset

If you want to get started with a basic ruleset and would rather not bother with symbolically linking configuration files, perform the following steps:

1.  Modify your httpd.conf file as shown below:

    > {: .file }
/etc/apache2/httpd.conf (Debian / Ubuntu)
    >
    > > \<IfModule security2\_module\>
    > > :   Include modsecurity-crs/*.conf Include modsecurity-crs/base\_rules/*.conf
    > >
    > > \</IfModule\>
    >
    > {: .file }
/etc/httpd/conf/httpd.conf (CentOS / Fedora)
    >
    > > \<IfModule security2\_module\>
    > > :   Include modsecurity-crs/*.conf Include modsecurity-crs/base\_rules/*.conf
    > >
    > > \</IfModule\>

2.  In the *modsecurity\_crs\_20\_protocol\_violations.conf* file, rename the `REQBODY_ERROR` variable to `REQBODY_PROCESSOR_ERROR`.
3.  Restart Apache for the updates to take effect:

    > Debian / Ubuntu:
    >
    >     /etc/init.d/apache2 restart
    >
    > CentOS / Fedora:
    >
    >     /etc/init.d/httpd restart

You have successfully configured ModSecurity.

### Using Symbolic Links

If you would rather symbolically link those configuration files to the activated\_rules directory, perform the following steps:

1.  Edit the Apache configuration file so `IfModule` looks like this:

    > {: .file }
/etc/apache2/httpd.conf (Debian / Ubuntu)
    >
    > > \<IfModule security2\_module\>
    > > :   Include modsecurity-crs/modsecurity\_crs\_10\_config.conf
    > >     Include modsecurity-crs/activated\_rules/\*.conf
    > > \</IfModule\>
    >
    > {: .file }
/etc/httpd/conf/httpd.conf (CentOS / Fedora)
    >
    > > \<IfModule security2\_module\>
    > > :   Include modsecurity-crs/modsecurity\_crs\_10\_config.conf
    > >     Include modsecurity-crs/activated\_rules/\*.conf
    > > \</IfModule\>

2.  Create the symbolic links before restarting Apache. A few examples are shown below.

    - To copy all the base\_rules over to activated\_rules:
    >
    >         for f in `ls base_rules/` ; do ln -s /usr/local/apache/conf/crs/base_rules/$f activated_rules/$f ; done
    >
    - To copy the comment spam rules from the optional\_rules directory to the activated\_rules directory:
    >
    >         for f in `ls optional_rules/ | grep comment_spam` ; do sudo ln -s /usr/local/apache/conf/crs/optional_rules/$f activated_rules/$f ; done
    >
3.  Restart Apache for the updates to take effect:

    > Debian / Ubuntu:
    >
    >     /etc/init.d/apache2 restart
    >
    > CentOS / Fedora:
    >
    >     /etc/init.d/httpd restart

You have successfully configured ModSecurity.
