---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Configure Apache on Ubuntu, Debian and CentOS with Salt Stack.'
keywords: ['salt','stack','saltstack','apache','httpd','ubuntu','debian','centos']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-19
modified: 2018-10-19
modified_by:
  name: Linode
title: "Configure Apache with Salt Stack"
external_resources:
- '[Salt Apache State Module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache.html)'
- '[Salt Apache_Conf State Module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache_conf.html)'
- '[Salt Apahce_Site State Module](https://docs.saltstack.com/en/latest/ref/states/all/salt.states.apache_site.html)'
- '[Using Grains in SLS Modules](https://docs.saltstack.com/en/latest/topics/tutorials/states_pt3.html#using-grains-in-sls-modules)'
---

Salt is a powerful configuration management tool. In this guide we will create a Salt state file that is capable of installing and configuring Apache on Ubunutu 18.04, Debian 9, and CentOS 7.

## Before You Begin

You will need at least two Linodes with Salt installed. If you have not already, read our [Getting Started with Salt - Basic Installation and Setup Guide](https://www.linode.com/docs/applications/configuration-management/getting-started-with-salt-basic-installation-and-setup/) and follow the instructions for setting up a Salt master and minion.

The following steps will be performed on your Salt master.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Set Up

1.  Create the `/srv/salt` directory if it does not already exist:

        mkdir /srv/salt

1.  Create a top file in `/srv/salt` that will be Salt's entry point to the Apache configuration:

    {{< file "/srv/salt/top.sls" yaml >}}
base:
  '*':
    - apache
{{< /file >}}

1.  Create a directory for your website files in the `/srv/salt` directory. You can choose to name this folder anything, but we will be using `example.com`:

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

## Creating the Apache State File

We will be going through the process of creating the Apache state file step by step. If you would like to view the entirety of the state file, scroll down to the bottom of this section.

1.  Create a state file named `apache.sls` in `/srv/salt` and open it in a text editor.

2.  Begin by declaring the Jinja variables that you'll be using in `apache.sls`:

    {{< file "/srv/salt/apache.sls" yaml >}}
{% set domain = 'example.com' %}
{% set debian = ['Debian', 'Ubuntu'] %}

...
{{< /file >}}

    The first variable is your website's domain name. This domain name will be used to configure an Apache virtual host and Apache's directory structure. Don't worry if you don't have your domain name DNS set up just yet, you will still be able access your server by its IP address.

    The second variable is an array of Linux distributions that share the same Apache installation steps, in this case Debian and Ubuntu. This variable will be used throughout `apache.sls` to determine our Apache installation logic.

1.  Instruct Salt to install the Apache package and ensure that Apache is running:

    {{< file "/srv/salt/apache.sls" yaml >}}
...

{% if grains['os'] in debian %}
apache2:
{% else %}
httpd:
{% endif %}
  pkg.installed: []
  service.running: []

...
{{< /file >}}

    This step uses a Jinja `if` statement and Salt grains to determine whether to install the `apache2` package on Debian-based systems, or to install the `httpd` package on CentOS systems. This pattern will be used throughout `apache.sls` to ensure that the script takes the proper actions.

1.  Tune your Apache configuration to run more optimally on your Linode by instructing salt to alter the Apache configuration file. For more information on tuning your Apache server, [visit our guide on the subject](https://www.linode.com/docs/web-servers/apache-tips-and-tricks/tuning-your-apache-server/).

    {{< file "/srv/salt/apache.sls" yaml >}}
...

Turn off KeepAlive:
  file.replace:
  {% if grains['os'] in debian %}
    - name: /etc/apache2/apache2.conf
  {% else %}
    - name: /etc/httpd/conf/httpd.conf
  {% endif %}
    - pattern: 'KeepAlive On'
    - repl: 'KeepAlive Off'
    - show_changes: True

Append mpm_prefork module and on CentOS include /sites-enabled:
  file.append:
  {% if grains['os'] in debian %}
    - name: /etc/apache2/apache2.conf
  {% else %}
    - name: /etc/httpd/conf/httpd.conf
  {% endif %}
    - text: |
      {% if grains['os'] not in debian %}
        IncludeOptional sites-enabled/*.conf
      {% endif %}
        <IfModule mpm_prefork_module>
        StartServers 4
        MinSpareServers 20
        MaxSpareServers 40
        MaxClients 200
        MaxRequestsPerChild 4500
        </IfModule>

...
{{< /file >}}

     Here Jinja `if` statements are used to select the proper Apache configuration file, as the location of this file differs depending on the Linux distribution. `apache.sls` instructs Salt to find and change the `KeepAlive On` directive to `KeepAlive Off` using `file.replace`. Then, it uses `file.append` to append an MPM prefork module to the end of the Apache configuration file. Also, on CentOS systems, this step adds the `IncludeOptional` directive to ensure that Apache can find our configuration file in the `sites-enabled/` directory.

1.  Change the document root for CentOS to match a Debian document root:

    {{< file "/srv/salt/apache.sls" yaml >}}
...

{% if grains['os'] not in debian %}
Change DocumentRoot:
  file.replace:
    - name: /etc/httpd/conf/httpd.conf
    - pattern: 'DocumentRoot "/var/www/html"'
    - repl: 'DocumentRoot "/var/www/html/{{ domain }}/public_html"'
    - show_changes: True
{% endif %}

...
{{< /file >}}

    While this step is not typical for a CentOS Apache installation, it is a practice introduced on Debian distributions that helps to organize website files. Note that we include the Jinja `{{ domain }}` variable that we declared in step one as a folder in the DocumentRoot. We will create this folder in the next step.

1.  Create the necessary directories:

    {{< file "/srv/salt/apache.sls" yaml >}}
...

{% if grains['os'] not in debian %}
/etc/httpd/sites-available:
  file.directory

/etc/httpd/sites-enabled:
  file.directory
{% endif %}

/var/www/html/{{ domain }}:
  file.directory

/var/www/html/{{ domain }}/log:
  file.directory

/var/www/html/{{ domain }}/backups:
  file.directory

/var/www/html/{{ domain }}/public_html:
  file.directory

...
{{< /file >}}

    For a CentOS installations `apache.sls` instructs Salt to create the `sites-available` and `sites-enabled` directories. Then, it instructs Salt to create the `log`, `backups`, and `public_html` directories in the `/var/www/html/example.com` directory.

1.  Disable the default virtual host configuration on Debian based distributions:

    {{< file "/srv/salt/apache.sls" yaml >}}
...

{% if grains['os'] in debian %}
000-default:
  apache_site.disabled
{% endif %}

...
{{< /file >}}

    Debian based systems have access to the `apache_site` Salt state module, which is used to disable and enable site configurations.

1.  Set up the Apache virtual host configuration file and enable it:

    {{< file "/srv/salt/apache.sls" yaml >}}
...

{% if grains['os'] in debian %}
/etc/apache2/sites-available/{{ domain }}.conf:
{% else %}
/etc/httpd/sites-available/{{ domain }}.conf:
{% endif %}
  apache.configfile:
    - config:
      - VirtualHost:
          this: '*:80'
          ServerName:
            - {{ domain }}
          ServerAlias:
            - www.{{ domain }}
          DocumentRoot: /var/www/html/{{ domain }}/public_html
          ErrorLog: /var/www/html/{{ domain }}/log/error.log
          CustomLog: /var/www/html/{{ domain }}/log/access.log combined
{% if grains['os'] not in debian %}
  file.symlink:
    - target: /etc/httpd/sites-enabled/{{ domain }}.conf
    - force: True
{% endif %}

{% if grains['os'] in debian %}
example.com:
  apache_site.enabled
{% endif %}

...
{{< /file >}}

    This section uses the `apache` Salt state module to configure your website's virtual host. The `this` variable signifies what would traditionally be include with `VirtualHost` within angle brackets in an Apache configuration file: `<VirtualHost *:80>`

    On CentOS systems `apache.sls` instructs Salt to manually create a symlink of the virtual host configuration file located in `sites-available/` in `sites-enabled/`, whereas on Debian based systems `apache.sls` uses the `apache_site` state module to accomplish the same task.

1.  Transfer `index.html` to the minion:

    {{< file "/srv/salt/apache.sls" yaml >}}
...

/var/www/html/{{ domain }}/public_html/index.html:
  file.managed:
    - source: salt://{{ domain }}/index.html

...
{{< /file >}}

    This section manages the `index.html` file that was created to test your Salt configuration in `/srv/salt/example.com`, here accessed through the convenience method `salt://`. Any changes made to `index.html` on the Salt master will be transferred to the Salt minion on `state.apply`.

1.  Open the proper ports on CentOS:

    {{< file "/srv/salt/apache.sls" yaml >}}
...

{% if grains['os'] not in debian %}
public:
  firewalld.present:
    - name: public
    - ports:
      - 22/tcp
      - 80/tcp
      - 443/tcp
{% endif %}

...
{{< /file >}}

    This command opens ports 80 and 443 for HTTP and HTTPS traffic, respectively. It also keeps the SSH port 22 open.

    {{< note >}}
Ensure that you declare all the ports you wish to remain open on your machine in this section. Failure to declare those ports will result in those ports being closed.
{{< /note >}}

1.  Manage SELinux on CentOS:

    {{< file "/srv/salt/apache.sls" yaml >}}
...

{% if grains['os'] not in debian %}
'semanage fcontext -a -t httpd_log_t "/var/www/html/{{ domain }}/.*\.log.*" && restorecon -R -v /var/www/html/{{ domain }}':
  cmd.run
{% endif %}

...
{{< /file >}}

    This section is necessary for CentOS installations to allow Apache to access a non-default error and access log directory.

1.  Lastly, instruct Salt to restart the Apache service for your changes to take place:

    {{< file "/srv/salt/apache.sls" yaml >}}
...

{% if grains['os'] in debian %}
'systemctl restart apache2.service':
{% else %}
'systemctl restart httpd.service':
{% endif %}
  cmd.run
{{< /file >}}

In summary, here is the entire state file you just created:

{{< file "/srv/salt/apache.sls" yaml >}}
{% set domain = 'example.com' %}
{% set debian = ['Debian', 'Ubuntu'] %}

{% if grains['os'] in debian %}
apache2:
{% else %}
httpd:
{% endif %}
  pkg.installed: []
  service.running: []

Turn off KeepAlive:
  file.replace:
  {% if grains['os'] in debian %}
    - name: /etc/apache2/apache2.conf
  {% else %}
    - name: /etc/httpd/conf/httpd.conf
  {% endif %}
    - pattern: 'KeepAlive On'
    - repl: 'KeepAlive Off'
    - show_changes: True

Append mpm_prefork module and on CentOS include /sites-enabled:
  file.append:
  {% if grains['os'] in debian %}
    - name: /etc/apache2/apache2.conf
  {% else %}
    - name: /etc/httpd/conf/httpd.conf
  {% endif %}
    - text: |
      {% if grains['os'] not in debian %}
        IncludeOptional sites-enabled/*.conf
      {% endif %}
        <IfModule mpm_prefork_module>
        StartServers 4
        MinSpareServers 20
        MaxSpareServers 40
        MaxClients 200
        MaxRequestsPerChild 4500
        </IfModule>

{% if grains['os'] not in debian %}
Change DocumentRoot:
  file.replace:
    - name: /etc/httpd/conf/httpd.conf
    - pattern: 'DocumentRoot "/var/www/html"'
    - repl: 'DocumentRoot "/var/www/html/{{ domain }}/public_html"'
    - show_changes: True
{% endif %}

{% if grains['os'] not in debian %}
/etc/httpd/sites-available:
  file.directory

/etc/httpd/sites-enabled:
  file.directory
{% endif %}

/var/www/html/{{ domain }}:
  file.directory

/var/www/html/{{ domain }}/log:
  file.directory

/var/www/html/{{ domain }}/backups:
  file.directory

/var/www/html/{{ domain }}/public_html:
  file.directory

{% if grains['os'] in debian %}
000-default:
  apache_site.disabled
{% endif %}

{% if grains['os'] in debian %}
/etc/apache2/sites-available/{{ domain }}.conf:
{% else %}
/etc/httpd/sites-available/{{ domain }}.conf:
{% endif %}
  apache.configfile:
    - config:
      - VirtualHost:
          this: '*:80'
          ServerName:
            - {{ domain }}
          ServerAlias:
            - www.{{ domain }}
          DocumentRoot: /var/www/html/{{ domain }}/public_html
          ErrorLog: /var/www/html/{{ domain }}/log/error.log
          CustomLog: /var/www/html/{{ domain }}/log/access.log combined
{% if grains['os'] not in debian %}
  file.symlink:
    - target: /etc/httpd/sites-enabled/{{ domain }}.conf
    - force: True
{% endif %}

{% if grains['os'] in debian %}
example.com:
  apache_site.enabled
{% endif %}

/var/www/html/{{ domain }}/public_html/index.html:
  file.managed:
    - source: salt://{{ domain }}/index.html

{% if grains['os'] not in debian %}
public:
  firewalld.present:
    - name: public
    - ports:
      - 22/tcp
      - 80/tcp
      - 443/tcp
{% endif %}

{% if grains['os'] not in debian %}
'semanage fcontext -a -t httpd_log_t "/var/www/html/{{ domain }}/.*\.log.*" && restorecon -R -v /var/www/html/{{ domain }}':
  cmd.run
{% endif %}

{% if grains['os'] in debian %}
'systemctl restart apache2.service':
{% else %}
'systemctl restart httpd.service':
{% endif %}
  cmd.run
{{< /file >}}

## Running the Apache State File

On your Salt master, issue a highstate command:

    salt '*' state.apply

After a few seconds you should see a list of the above commands and a summary of their successes. Navigate to your website's domain name if you have your DNS set up already, or your websites's public IP address. You should see your `index.html` file. You have now used Salt to configure Apache. Visit the links in the section below for more information.