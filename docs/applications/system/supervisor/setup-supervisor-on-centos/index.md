---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install and configure supervisor on CentOS'
og_description: 'Install and confgiure supervisor on CentOS'
keywords: ['centos', 'system', 'supervisor', 'supervisord']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-06-10
modified_by:
  name: Linode
title: "Install and configure supervisor on CentOS"
h1_title: "Install and configure supervisor on CentOS"
contributor:
  name: Dan Nielsen
  link: https://github.com/danielsen
---

## Introduction

**supervisor** is a process control system based on the client/server model. It can be used to simplify process management
by providing a centralized location for process control. It is most often deployed to control services that don't have
initialization/auto-start/management scripts. Remote process control is also supported via RPC.

{{< note >}}
This guide will use a dummy program called `app.py` as an example for process control. However, it should not be assumed
that `supervisor` can only control Python applications.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.


<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Prepare System

    sudo yum update

`supervisor` is in the EPEL package repository for CentOS.

    sudo yum install epel-release

## Install and Configure Supervisor

    sudo yum install supervisor

If you intend supervisor to manage processes that require the network to be online edit `/usr/lib/systemd/system/supervisord.service` and add `network-online.target` to the `After` parameter of the `[Unit]` section. For example:

{{< file "/usr/lib/systemd/system/supervisord.service" conf >}}
[Unit]
Description=Process Monitoring and Control Daemon
After=rc-local.service nss-user-lookup.target network-online.target

...
{{< /file >}}

In this guide, individual processes will have their own `.conf` configuration files placed in `/etc/supervisord.d/`. If you
prefer to store configuration files elsewhere, edit the `[include]` section of `/etc/supervisord.conf` to point to the
directory of your choice.

{{< file "/etc/supervisord.conf" conf >}}
[include]
files = supervisord.d/*.conf
{{< /file >}}

### Add Process Configuration Files

Process configurations can be added directly in `/etc/supervisord.conf` but configuration management can be simplified
by placing individual configuration files in `/etc/supervisord.d/`.

This guide will use the fictional `app.py` application as an example.

{{< note >}}
`supervisord` provides simple logging of `stderr` and `stdout`. If you choose to log those outputs to files make sure
that you create the log file directory before starting / restarting `supervisord`.
{{< /note >}}

{{< file "/etc/supervisord.d/app.conf" conf >}}
[group:appgroup]
programs=app

[program:app]
directory=/opt/app                       ; Location of application
command=python app.py                    ; The command to execute
autostart=true                           ; Start this application when supervisord starts
autorestart=true                         ; Restart this application if it crashes
stderr_logfile=/var/log/app/app.err.log  ; Make sure this directory exists
stdout_logfile=/var/log/app/app.log      ; Make sure this directory exists
stopsignal=INT                           ; Signal sent to the application when halting
stopasgroup=true
{{< /file >}}

Enable and start the `supervisord` service.

    sudo systemctl enable supervisord
    sudo systemctl start supervisord

Once `supervisord` has been started you can access it via the command line with the `supervisorctl`, e.g.

    sudo supervisorctl

The `supervisorctl` documentation can be found at (http://supervisord.org/running.html#running-supervisorctl).

## Enabling HTTP Access (Optional)

In some cases you may want to add HTTP access to `supervisord` either to enable the web interface or to allow remote
RPC calls.

{{< caution >}}
Enabling HTTP access will expose `supervisord` to the internet at large. If you choose to enable HTTP access, make
sure to configure firewall rules that limit access to trusted IPs in addition to configuring a user name and password
for service access.
{{< /caution >}}

To enable HTTP access, uncomment the `[inet_http_server]` in `/etc/supervisord.conf`, updating the `port`, `username`,
and `password` settings.

{{< file "/etc/supervisord.conf" conf >}}
[inet_http_server]
port=1.2.3.4:9001              ; IP address and port to bind to. Use *:9001 to listen on all interfaces.
username=super                 ; Service user name
password=A!VeryS3cuReP@5sw0rd  ; Service password, make it a good one.
{{< /file >}}

Enable a firewall rule to allow access for your remote IP or a trusted network.

    sudo firewall-cmd --permanent --zone=public --add-rich-rule='
      rule family="ipv4"
      source address="4.3.2.1/32"
      port protocol="tcp" port="9001" accept'
    sudo firewall-cmd --reload

Restart `supervisord`

    sudo systemctl restart supervisord

You should now be able to visit `http://<yourIPOrDomain>:9001` and log in with the configured user name and password.