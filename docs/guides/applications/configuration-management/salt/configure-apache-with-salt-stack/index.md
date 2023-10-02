---
slug: configure-apache-with-salt-stack
description: 'This guide provides you with step-by-step instructions for installing and configuring the Apache Web Server on Ubuntu, Debian, and CentOS with the Salt Sack.'
keywords: ['salt','stack','saltstack','apache','httpd','ubuntu','debian','centos']
tags: ["automation","salt","debian","centos","ubuntu","apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-19
modified: 2019-01-02
modified_by:
  name: Linode
image: ConfigureApachewithSaltStack.png
title: "Configure Apache with Salt Stack"
external_resources:
- '[Salt Apache State Module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache.html)'
- '[Salt Apache_Conf State Module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache_conf.html)'
- '[Salt Apache_Site State Module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache_site.html)'
- '[Using Grains in SLS Modules](https://docs.saltstack.com/en/latest/topics/tutorials/states_pt3.html#using-grains-in-sls-modules)'
aliases: ['/applications/configuration-management/salt/configure-apache-with-salt-stack/','/applications/configuration-management/configure-apache-with-salt-stack/']
authors: ["Linode"]
---

Salt is a powerful configuration management tool. In this guide you will create Salt state files that are capable of installing and configuring Apache on Ubuntu 18.04, Debian 9, or CentOS 7.

## Before You Begin

You will need at least two Linodes with Salt installed. If you have not already, read our [Getting Started with Salt - Basic Installation and Setup Guide](/docs/guides/getting-started-with-salt-basic-installation-and-setup/) and follow the instructions for setting up a Salt master and minion.

The following steps will be performed on your Salt master.

{{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Setting Up Your Salt Master and Managed Files

### Salt Master SLS Files

1.  Create the `/srv/salt` directory if it does not already exist:

        mkdir /srv/salt

1.  Create a Salt top file in `/srv/salt` that will be Salt's entry point to the Apache configuration:

    {{< file "/srv/salt/top.sls" yaml >}}
base:
  'G@os_family:Debian':
    - match: compound
    - apache-debian

  'G@os:CentOS':
    - match: compound
    - apache-centos
{{< /file >}}

    This top file uses [compound matching](https://docs.saltstack.com/en/latest/topics/targeting/compound.html) to target your minions by operating system using Salt Grains. This will allow Salt to choose the appropriate Apache configuration depending on the Linux distribution. These matchers could be extended to be even more specific. For instance, if you wanted to only target minions with the ID of `web-server` that are running on Ubuntu, you can type `web* and G@os:Ubuntu`.

### Pillar Files

1.  Create the `/srv/pillar` directory if it does not already exist:

        mkdir /srv/pillar

1.  Create a Pillar top file. This top file references the `apache.sls` Pillar file that you will create in the next step:

    {{< file "/srv/pillar/top.sls" yaml >}}
base:
  '*':
    - apache
{{< /file >}}

1.  Create the `apache.sls` file that was referenced in the previous step. This file defines Pillar data that will be used inside our Apache state file in the next section, in this case your domain name. Replace `example.com` with your domain:

    {{< file "/srv/pillar/apache.sls" yaml >}}
domain: example.com
{{< /file >}}

### Website Files

1.  Create a directory for your website files in the `/srv/salt` directory. Replace `example.com` with your website domain name:

        mkdir /srv/salt/example.com

    This directory will be accessible from your Salt state files at `salt://example.com`.

1.  Create an `index.html` file for your website in the `/srv/salt/example.com` directory, substituting `example.com` for the folder name you chose in the previous step. You will use this file as a test to make sure your website is functioning correctly.

    {{< file "/srv/salt/example.com/index.html" html >}}
<html>
  <body>
    <h1>Server Up and Running!</h1>
  </body>
</html>
{{< /file >}}

### Configuration Files

1.  Create a folder for your additional configuration files at `/srv/salt/files`. These files will be accessible at `salt://files`.

        mkdir /srv/salt/files

1.  Create a file called `tune_apache.conf` in `/srv/salt/files` and paste in the following block:

    {{< file "/srv/salt/files/tune_apache.conf" ApacheConf >}}
<IfModule mpm_prefork_module>
StartServers 4
MinSpareServers 20
MaxSpareServers 40
MaxClients 200
MaxRequestsPerChild 4500
</IfModule>
{{</ file >}}

    This MPM prefork module provides additional [tuning for your Apache installation](/docs/guides/tuning-your-apache-server/). This file will be managed by Salt and installed into the appropriate configuration directory in a later step.

1.  If you will be installing Apache on a CentOS machine, create a file called `include_sites_enabled.conf` in `/srv/salt/files` and paste in the following:

    {{< file "/srv/salt/files/include_sites_enabled.conf" ApacheConf >}}
IncludeOptional sites-enabled/*.conf
{{< /file >}}

    This file will allow us to use file directories like those found on Debian installations to help organize the Apache configuration.

## Creating the Apache State File for Debian and Ubuntu

### Individual Steps

This guide will be going through the process of creating the Apache for Debian and Ubuntu state file step by step. If you would like to view the entirety of the state file, [you can view it at the end of this section](/docs/guides/configure-apache-with-salt-stack/#complete-state-file).

1.  Create a state file named `apache-debian.sls` in `/srv/salt` and open it in a text editor of your choice.

1.  Instruct Salt to install the `apache2` package and start the `apache2` service:

    {{< file "/srv/salt/apache-debian.sls" yaml >}}
apache2:
  pkg.installed

apache2 Service:
  service.running:
    - name: apache2
    - enable: True
    - require:
      - pkg: apache2

...
{{< /file >}}

    Here Salt makes sure the `apache2` package is installed with `pkg.installed`. Likewise, it ensures the `apache2` service is running and enabled under `service.running`. Also under `service.running`, `apache-debian.sls` uses `require` to ensure that this command does not run before the `apache2` package is installed. This `require` step will be repeated throughout `apache-debian.sls`.

    Lastly, a `watch` statement is employed to restart the `apache2` service if your site's configuration file changes. You will define that configuration file in a later step. Note that this configuration file is named using the domain you supplied when creating your Salt Pillar file in the first section. This Pillar data will be used throughout `apache-debian.sls`.

1.  Turn off KeepAlive:

    {{< file "/srv/salt/apache-debian.sls" yaml >}}
...

Turn Off KeepAlive:
  file.replace:
    - name: /etc/apache2/apache2.conf
    - pattern: 'KeepAlive On'
    - repl: 'KeepAlive Off'
    - show_changes: True
    - require:
      - pkg: apache2
...
{{< /file >}}

    KeepAlive allows multiple requests to be sent over the same TCP connection. For the purpose of this guide KeepAlive will be disabled. To disable it, Salt is instructed to find the KeepAlive directive in `/etc/apache2/apache2.conf` by matching a pattern and replacing it with `KeepAlive Off`. `show_changes` instructs Salt to display any changes it has made during a highstate.

1.  Transfer `tune_apache.conf` to your minion and enable it:

    {{< file "/srv/salt/apache-debian.sls" yaml >}}
...

/etc/apache2/conf-available/tune_apache.conf:
  file.managed:
    - source: salt://files/tune_apache.conf
    - require:
      - pkg: apache2

Enable tune_apache:
  apache_conf.enabled:
    - name: tune_apache
    - require:
      - pkg: apache2

...
{{< /file >}}

    This step takes the `tune_apache.conf` file you created in the [Configuration Files](/docs/guides/configure-apache-with-salt-stack/#configuration-files) step and transfers it to your Salt minion. Then, Salt enables that configuration file with the [apache_conf module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache_conf.html).

1.  Create the necessary directories:

    {{< file "/srv/salt/apache-debian.sls" yaml>}}
...

/var/www/html/{{ pillar['domain'] }}:
  file.directory

/var/www/html/{{ pillar['domain'] }}/log:
  file.directory

/var/www/html/{{ pillar['domain'] }}/backups:
  file.directory

/var/www/html/{{ pillar['domain'] }}/public_html:
  file.directory

...
{{< /file >}}

1.  Disable the default virtual host configuration file:

    {{< file "/srv/salt/apache-debian.sls" yaml >}}
...

000-default:
  apache_site.disabled:
    - require:
      - pkg: apache2

...
{{< /file >}}

    This step uses Salt's [apache_site module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache_site.html) to disable the default Apache virtual host configuration file, and is the same as running `a2dissite` on a Debian-based machine.

1.  Create your site's virtual host configuration file:

    {{< file "/srv/salt/apache-debian.sls" yaml >}}
...

/etc/apache2/sites-available/{{ pillar['domain'] }}.conf:
  apache.configfile:
    - config:
      - VirtualHost:
          this: '*:80'
          ServerName:
            - {{ pillar['domain'] }}
          ServerAlias:
            - www.{{ pillar['domain'] }}
          DocumentRoot: /var/www/html/{{ pillar['domain'] }}/public_html
          ErrorLog: /var/www/html/{{ pillar['domain'] }}/log/error.log
          CustomLog: /var/www/html/{{ pillar['domain'] }}/log/access.log combined

...
{{< /file >}}

    This step uses Salt's [apache module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache.html), (not to be confused with the `apache_site` module used in the previous step), to create your site's virtual host configuration file. The `this` variable signifies what would traditionally be include with `VirtualHost` within angle brackets in an Apache configuration file: `<VirtualHost *:80>`.

1.  Enable your new virtual host configuration file:

    {{< file "/srv/salt/apache-debian.sls" yaml >}}
...

{{ pillar['domain'] }}:
  apache_site.enabled:
    - require:
      - pkg: apache2

...
{{< /file >}}

    This step uses the same `apache_site` module you used to disable the default virtual host file to enable your newly created virtual host file. `apache_site.enabled` creates a symlink from `/etc/apache2/sites-available/example.com.conf` to `/etc/apache2/sites-enabled/example.com.conf` and is the same as running `a2ensite` on a Debian-based machine.

1.  Transfer your `index.html` website file to your minion:

    {{< file "/srv/salt/apache-debian.sls" yaml >}}
...

/var/www/html/{{ pillar['domain'] }}/public_html/index.html:
  file.managed:
    - source: salt://{{ pillar['domain'] }}/index.html
{{< /file >}}

    Any changes made to your `index.html` file on your Salt master will be propagated to your minion.

    {{< note respectIndent=false >}}
Since Salt is not watching configuration files for a change to trigger a restart for Apache, you may need to use the command below from your Salt master.

    salt '*' apache.signal restart
{{< /note >}}

### Complete State File
The complete `apache-debian.sls` file looks like this:
{{< file "/srv/salt/apache-debian.sls" yaml >}}
apache2:
  pkg.installed

apache2 Service:
  service.running:
    - name: apache2
    - enable: True
    - require:
      - pkg: apache2

Turn Off KeepAlive:
  file.replace:
    - name: /etc/apache2/apache2.conf
    - pattern: 'KeepAlive On'
    - repl: 'KeepAlive Off'
    - show_changes: True
    - require:
      - pkg: apache2

/etc/apache2/conf-available/tune_apache.conf:
  file.managed:
    - source: salt://files/tune_apache.conf
    - require:
      - pkg: apache2

Enable tune_apache:
  apache_conf.enabled:
    - name: tune_apache
    - require:
      - pkg: apache2

/var/www/html/{{ pillar['domain'] }}:
  file.directory

/var/www/html/{{ pillar['domain'] }}/log:
  file.directory

/var/www/html/{{ pillar['domain'] }}/backups:
  file.directory

/var/www/html/{{ pillar['domain'] }}/public_html:
  file.directory

000-default:
  apache_site.disabled:
    - require:
      - pkg: apache2

/etc/apache2/sites-available/{{ pillar['domain'] }}.conf:
  apache.configfile:
    - config:
      - VirtualHost:
          this: '*:80'
          ServerName:
            - {{ pillar['domain'] }}
          ServerAlias:
            - www.{{ pillar['domain'] }}
          DocumentRoot: /var/www/html/{{ pillar['domain'] }}/public_html
          ErrorLog: /var/www/html/{{ pillar['domain'] }}/log/error.log
          CustomLog: /var/www/html/{{ pillar['domain'] }}/log/access.log combined

{{ pillar['domain'] }}:
  apache_site.enabled:
    - require:
      - pkg: apache2

/var/www/html/{{ pillar['domain'] }}/public_html/index.html:
  file.managed:
    - source: salt://{{ pillar['domain'] }}/index.html
{{< /file >}}

## Creating an Apache State File for CentOS

### Individual Steps

1.  Create a file called `apache-centos.sls` in `/srv/salt` and open it in a text editor of your choice.

2.  On CentOS Apache is named `httpd`. Instruct Salt to install `httpd` and run the `httpd` service:

    {{< file "/srv/salt/apache-centos.sls" yaml>}}
httpd:
  pkg.installed

httpd Service:
  service.running:
    - name: httpd
    - enable: True
    - require:
      - pkg: httpd
    - watch:
      - file: /etc/httpd/sites-available/{{ pillar['domain'] }}.conf

...
{{< /file >}}

    Here Salt makes sure the `httpd` package is installed with `pkg.installed`. Likewise, it ensures the `httpd` service is running and enabled under `service.running`. Also under `service.running`, `apache-debian.sls` uses `require` to ensure that this command does not run before the `httpd` package is installed. This `require` step will be repeated throughout `apache-centos.sls`.

    Lastly, a `watch` statement is employed to restart the `httpd` service if your site’s configuration file changes. You will define that configuration file in a later step. Note that this configuration file is named using the domain you supplied when creating your Salt Pillar file in the first section. This Pillar data will be used throughout `apache-centos.sls`.

1.  Turn off KeepAlive:

    {{< file "/srv/salt/apache-centos.sls" yaml >}}
...

Turn Off KeepAlive:
  file.replace:
    - name: /etc/httpd/conf/httpd.conf
    - pattern: 'KeepAlive On'
    - repl: 'KeepAlive Off'
    - show_changes: True
    - require:
      - pkg: httpd
...
{{< /file >}}

    KeepAlive allows multiple requests to be sent over the same TCP connection. For the purpose of this guide KeepAlive will be disabled. To disable it, Salt is instructed to find the KeepAlive directive in `/etc/httpd/conf/httpd.conf` by matching a pattern and replacing it with `KeepAlive Off`. `show_changes` instructs Salt to display any changes it has made during a highstate.

1.  Change the DocumentRoot:

    {{< file "/srv/salt/apache-centos.sls" yaml >}}
...

Change DocumentRoot:
  file.replace:
    - name: /etc/httpd/conf/httpd.conf
    - pattern: 'DocumentRoot "/var/www/html"'
    - repl: 'DocumentRoot "/var/www/html/{{ pillar['domain'] }}/public_html"'
    - show_changes: True
    - require:
      - pkg: httpd

...
{{< /file >}}

    Similar to the last step, in this step `salt-centos.sls` instructs Salt to search for the DocumentRoot directive in Apache's `httpd.conf` file, and replaces that line with the new document root. This allows for the use of a Debian-style site directory architecture.

1.  Transfer the `tune_apache.conf` and `include_sites_enabled.conf` to your minion.

    {{< file "/srv/salt/apache-centos.sls" yaml>}}
...

/etc/httpd/conf.d/tune_apache.conf:
  file.managed:
    - source: salt://files/tune_apache.conf
    - require:
      - pkg: httpd

/etc/httpd/conf.d/include_sites_enabled.conf:
  file.managed:
    - source: salt://files/include_sites_enabled.conf
    - require:
      - pkg: httpd

...
{{< /file >}}

1.  Create the necessary directories:

    {{< file "srv/salt/apache-centos.sls" yaml >}}
...

/etc/httpd/sites-available:
  file.directory

/etc/httpd/sites-enabled:
  file.directory

/var/www/html/{{ pillar['domain'] }}:
  file.directory

/var/www/html/{{ pillar['domain'] }}/backups:
  file.directory

/var/www/html/{{ pillar['domain'] }}/public_html:
  file.directory

...
{{< /file >}}

1.  Create your site's virtual host configuration file:

    {{< file "/srv/salt/apache-centos.sls" yaml>}}
...

/etc/httpd/sites-available/{{ pillar['domain'] }}.conf:
  apache.configfile:
    - config:
      - VirtualHost:
          this: '*:80'
          ServerName:
            - {{ pillar['domain'] }}
          ServerAlias:
            - www.{{ pillar['domain'] }}
          DocumentRoot: /var/www/html/{{ pillar['domain'] }}/public_html
  file.symlink:
    - target: /etc/httpd/sites-enabled/{{ pillar['domain'] }}.conf
    - force: True

...
{{< /file >}}

    This step uses Salt's [apache module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache.html) to create your site's virtual host configuration file. The `this` variable signifies what would traditionally be include with `VirtualHost` within angle brackets in an Apache configuration file: `<VirtualHost *:80>`.

1.  Transfer your `index.html` website file to your minion:

    {{< file "/srv/salt/apache-debian.sls" yaml >}}
...

/var/www/html/{{ pillar['domain'] }}/public_html/index.html:
  file.managed:
    - source: salt://{{ pillar['domain'] }}/index.html

...
{{< /file >}}

    Any changes made to your `index.html` file on your Salt master will be propigated to your minion.

1.  Configure your firewall to allow http and https traffic:

    {{< file "/srv/salt/apache-centos.sls" yaml >}}
...

Configure Firewall:
  firewalld.present:
    - name: public
    - ports:
      - 22/tcp
      - 80/tcp
      - 443/tcp
{{< /file >}}

    {{< note respectIndent=false >}}
It is imperative that you list all ports you need open to your machine in this section. Failure to list these ports will result in their closure by Salt.
{{< /note >}}

### Complete State File

The complete `apache-centos.sls` file looks like this:

   {{< file "/srv/salt/apache-centos.sls" yaml >}}
httpd:
  pkg.installed

httpd Service:
  service.running:
    - name: httpd
    - enable: True
    - require:
      - pkg: httpd
    - watch:
      - file: /etc/httpd/sites-available/{{ pillar['domain'] }}.conf

Turn off KeepAlive:
  file.replace:
    - name: /etc/httpd/conf/httpd.conf
    - pattern: 'KeepAlive On'
    - repl: 'KeepAlive Off'
    - show_changes: True
    - require:
      - pkg: httpd

Change DocumentRoot:
  file.replace:
    - name: /etc/httpd/conf/httpd.conf
    - pattern: 'DocumentRoot "/var/www/html"'
    - repl: 'DocumentRoot "/var/www/html/{{ pillar['domain'] }}/public_html"'
    - show_changes: True
    - require:
      - pkg: httpd

/etc/httpd/conf.d/tune_apache.conf:
  file.managed:
    - source: salt://files/tune_apache.conf
    - require:
      - pkg: httpd

/etc/httpd/conf.d/include_sites_enabled.conf:
  file.managed:
    - source: salt://files/include_sites_enabled.conf
    - require:
      - pkg: httpd

/etc/httpd/sites-available:
  file.directory

/etc/httpd/sites-enabled:
  file.directory

/var/www/html/{{ pillar['domain'] }}:
  file.directory

/var/www/html/{{ pillar['domain'] }}/backups:
  file.directory

/var/www/html/{{ pillar['domain'] }}/public_html:
  file.directory

/etc/httpd/sites-available/{{ pillar['domain'] }}.conf:
  apache.configfile:
    - config:
      - VirtualHost:
          this: '*:80'
          ServerName:
            - {{ pillar['domain'] }}
          ServerAlias:
            - www.{{ pillar['domain'] }}
          DocumentRoot: /var/www/html/{{ pillar['domain'] }}/public_html
  file.symlink:
    - target: /etc/httpd/sites-enabled/{{ pillar['domain'] }}.conf
    - force: True

/var/www/html/{{ pillar['domain'] }}/public_html/index.html:
  file.managed:
    - source: salt://{{ pillar['domain'] }}/index.html

Configure Firewall:
  firewalld.present:
    - name: public
    - ports:
      - 22/tcp
      - 80/tcp
      - 443/tcp
{{< /file >}}

## Running the Apache State File

On your Salt master, issue a highstate command:

    salt '*' state.apply

After a few moments you should see a list of Salt commands and a summary of their successes. Navigate to your website's domain name if you have your DNS set up already, or your website's public IP address. You should see your `index.html` file. You have now used Salt to configure Apache. Visit the links in the section below for more information.
