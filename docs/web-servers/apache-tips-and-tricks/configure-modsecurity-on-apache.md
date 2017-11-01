---
author:
  name: Linode
  email: docs@linode.com
description: 'Learn how to install ModSecurity, a web application firewall for the Apache server, which provides logging capabilities and real time monitoring.'
keywords: 'apache, mod_security'
og_description: 'Besides providing logging capabilities, ModSecurity, as a web-detection tool, can monitor the HTTP traffic in real time in order to spot attacks. This guide shows how to load and run ModSecurity on your Linode.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['web-servers/apache/mod-security/','websites/apache-tips-and-tricks/modsecurity-on-apache/','web-servers/apache-tips-and-tricks/modsecurity-on-apache/']
modified: Wednesday, Novermber 1st, 2017
modified_by:
  name: Linode
published: 'Wednesday, November 1st, 2017'
title: 'How to Configure ModSecurity on Apache'
external_resources:
 - '[ModSecurity Home Page](http://www.modsecurity.org)'
 - '[OWASP Home Page](https://www.owasp.org/index.php/Main_Page)'
 - '[OWASP ModSecurity Core Rule Set Wiki](https://www.owasp.org/index.php/Category:OWASP_ModSecurity_Core_Rule_Set_Project#tab=Installation)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

## Introduction

ModSecurity is a web application firewall for the Apache web server. In addition to providing logging capabilities, ModSecurity can monitor the HTTP traffic in real time in order to detect attacks. ModSecurity also operates as a web intrusion detection tool, allowing you to react to suspicious events that take place at your web systems.

Although ModSecurity comes with a recommended configuration, this guide will use OWASP ModeSecurity Core Rule Set (CRS) version 3.0.2. This version of CRS requires ModSecurity 2.8.0 or higher. Configuration is done through rule sets to prevent common attacks such as SQL injections, cross site scripting, and remote code execution. This guide will show how to setup the default rules while advanced configurations are left as a challenge to the reader.

## Install ModSecurity

Before you install ModSecurity, you'll want to have a LAMP stack set up on your Linode. For instructions, see the [LAMP Guides](/docs/websites/lamp/).

### Ubuntu/Debian

    sudo apt install libapache2-modsecurity

Restart Apache:

    /etc/init.d/apache2 restart

Verify the version of ModSecurity is 2.8.0 or higher:

    apt-cache-show libapache2-modsecurity

{:.note}
>
> When listing all mods using `apachectl -M`, ModSecurity is under the name `security2_module`.

### CentOS

    yum install mod_security

Restart Apache by entering the following command:

    /etc/init.d/httpd restart

Verify the version of ModSecurity is 2.8.0 or higher:

    yum info mod_fcgid

## OWASP ModSecurity Core Rule Set

The following steps are for Debian based distributions. File paths and commands for RHEL will differ slightly.

1.  Move and change the name of the default ModSecurity file.

        mv modsecurity.conf-recommended  modsecurity.conf

2.  Install git if needed:

        sudo apt install git

3.  Download the OWASP ModSecurity CRS from Github.

        git clone https://github.com/SpiderLabs/owasp-modsecurity-crs.git

4.  Navigate into the directory. Move and rename `crs-setup.conf.example` to `crs-setup.conf`. Then move `rules/` as well.

        cd owasp-modsecurity-crs
        mv crs-setup.conf.example /etc/modsecurity/crs-setup.conf
        mv rules/ /etc/modsecurity/

5.  The configuration file should match the path above as defined in the `IncludeOptional` directive. Add another `Include` directive pointing to the rule set.

    {:.file}
    /etc/apache2/mods-available/security2.conf
    :   ~~~
        <IfModule security2_module>
                # Default Debian dir for modsecurity's persistent data
                SecDataDir /var/cache/modsecurity

                # Include all the *.conf files in /etc/modsecurity.
                # Keeping your local configuration in that directory
                # will allow for an easy upgrade of THIS file and
                # make your life easier
                IncludeOptional /etc/modsecurity/*.conf
                Include /etc/modsecurity/rules/*.conf
        </IfModule>
        ~~~

6.  Restart Apache to implement the changes.

        /etc/init.d/apache2 restart

### ModSecurity Test
OWASP CRS builds on top of ModSecurity so that existing rules can be extended.

1.  Navigate to the default Apache configuration and add two additional directives using the default configuration as an example.

    {:.file}
    /etc/apache2/sites-available/000-default.conf
    :   ~~~
    <VirtualHost *:80>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined

        SecRuleEngine On
        SecRule ARGS:testparam "@contains test" "id:1234,deny,status:403,msg:'Our test rule has triggered'"
    </VirtualHost>
        ~~~

2.  Restart Apache then curl the index page to intentionally trigger the alarms.

        curl localhost/index.html?testparam=test

    The response code should be 403. Looking at the logs, there should be a message that shows the defined ModSecurity rule worked.

    {:.output}
    ~~~
    ModSecurity: Access denied with code 403 (phase 2). String match "test" at ARGS:testparam. [file "/etc/apache2/sites-enabled/000-default.conf"] [line "24"] [id "1234"] [msg "Our test rule has triggered"] [hostname "localhost"] [uri "/index.html"] [unique_id "WfnEd38AAAEAAEnQyBAAAAAB"]
    ~~~

3.  Verify the OWASP CRS is in effect.

        curl localhost/index.html?exec=/bin/bash

    Looking into the error logs again, the rule has caught the attempted execution of some arbitrary bash script.

    {:.output}
    ~~~
    ModSecurity: Warning. Matched phrase "bin/bash" at ARGS:. [file "/etc/modsecurity/rules/REQUEST-932-APPLICATION-ATTACK-RCE.conf"] [line "448"] [id "932160"] [rev "1"] [msg "Remote Command Execution: Unix Shell Code Found"] [data "Matched Data: bin/bash found within ARGS:: exec/bin/bash"] [severity "CRITICAL"] [ver "OWASP_CRS/3.0.0"] [maturity "1"] [accuracy "8"] [tag "application-multi"] [tag "language-shell"] [tag "platform-unix"] [tag "attack-rce"] [tag "OWASP_CRS/WEB_ATTACK/COMMAND_INJECTION"] [tag "WASCTC/WASC-31"] [tag "OWASP_TOP_10/A1"] [tag "PCI/6.5.2"] [hostname "localhost"] [uri "/index.html"] [unique_id "WfnVf38AAAEAAEqya3YAAAAC"]
    ~~~

Looking into some of the configuration files located in `/etc/modsecurity/*.conf`, most of the files are heavily commented with definitions of the various options. ModSecurity uses an Anomaly Scoring Level where the highest number at 5 is most severe. Review the [wiki](https://github.com/SpiderLabs/ModSecurity/wiki) for additional directives to update rules when encountering false positives.

