---
slug: install-rabbitmq-on-debian-10
author:
  name: Dan Nielsen
  email: dnielsen@fastmail.fm
description: 'Install and Configure RabbitMQ on Debian 10.'
og_description: 'Install and Configure RabbitMQ on Debian 10.'
keywords: ['debian', 'rabbitmq', 'message brokers']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-11
modified_by:
  name: Dan Nielsen
title: "Install RabbitMQ on Debian 10"
h1_title: "Install and Configure RabbitMQ on Debian 10"
contributor:
  name: Dan Nielsen
  link: https://dnielsen.dev
external_resources:
- '[Debian](https://www.debian.org)'
- '[RabbitMQ](https://www.rabbitmq.com)'
---

## Introduction

This guide covers installing the [RabbitMQ](https://www.rabbitmq.com) message broker on [Debian 10](https://www.debian.org). Message brokers ease development of asynchronous programming patterns by providing a centralized infrastructure to consume and distribute messages. Common uses are distribution of tasks to worker clusters or asynchronous processing of long-running tasks. `RabbitMQ` is one of the most popular open source message brokers.

Also included in this guide are basic system configuration changes to improve `RabbitMQ` performance.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Component Installation

{{< note >}}
`RabbitMQ` is included in standard `Debian` repositories but is often several versions behind the current release. Therefore, in this guide the `apt` repositories maintained by the `RabbitMQ` team are used to provide the latest versions. These repositories are used for install of `Erlang/OTP` and `RabbitMQ`
{{< /note >}}

### Install Prerequisites

        sudo apt-get install -y apt-transport-https curl gnupg

### Add the Package Signing Key

        curl -fsSL https://github.com/rabbitmq/signing-keys/releases/download/2.0/rabbitmq-release-signing-key.asc | sudo apt-key add -

### Configure Repositories

Since 3rd party `apt` repositories are being used, a file describing the repository must be placed in `/etc/apt/sources.list.d/`. This file should include a source (repository) definition formatted as follows: `deb https://dl.bintray.com/rabbitmq-erlang/debian $distribution $component`. In this case `$distribution` is `buster` and `$component` is the latest `Erlang 23.x` version.

{{< file "/etc/apt/sources.list.d/rabbitmq.list" apt >}}
## Provides Erlang/OTP packages
deb https://dl.bintray.com/rabbitmq-erlang/debian buster erlang
## Provides RabbitMQ packages
deb https://dl.bintray.com/rabbitmq/debian buster main
{{< /file >}}

### Configure Package and Repository Pinning

Package and repository pinning should be configured when the same package is available from multiple repositories. Pinning the package and repository ensures that the preferred sources are used to install and upgrade.

{{< file "/etc/apt/preferences.d/erlang" apt-preferences >}}
Package: erlang*
Pin: release o=Bintray
Pin-Priority: 1000
{{< /file >}}

{{< file "/etc/apt/preferences.d/rabbitmq" apt-preferences >}}
Package: rabbitmq-server
Pin: release o=Bintray
Pin-Priority: 1000
{{< /file >}}

The policy can be verified using:

        sudo apt-get update
        sudo apt-cache policy

### Update and Install

        sudo apt-get install -y --fix-missing rabbitmq-server
        sudo systemctl enable rabbitmq-server

### Enable the Management Plugin

`RabbitMQ` provides a management plugin that includes a HTTP-based API, browser UI, and a command line tool. In addition to the management features, it exposes system metrics for long-term storage or alerting.

        sudo /sbin/rabbitmq-plugins enable rabbitmq_management

## Configure RabbitMQ

### Configure Users and Virtual Hosts

The base `RabbitMQ` installation has a single user named `guest` using the password `guest`. That user can only connect via localhost. It's best to create a new user or set of users and delete the `guest` user. At minimum the `guest` user should have it's password changed.

After having installed the `rabbitmq_management` plugin, `rabbitmqctl` can be used to manage users.

        # Add a user
        sudo /sbin/rabbitmqctl add_user 'username' 'aVeryGoodpassWORD'
        # List users
        sudo /sbin/rabbitmqctl list_users
        # Delete a user
        sudo /sbin/rabbitmqctl delete_user 'username'

The base installation has a single virtual host, `/`. It's common to add additional virtual hosts to provide logical grouping of resources. For example, virtual hosts `ci` and `production` virtual might be created to separate tests from deployed operations.

`rabbitmqctl` can be used to manage virtual hosts.

        # Add a virtual host
        sudo /sbin/rabbitmqctl add_vhost 'ci'
        # Delete a virtual host
        sudo /sbin/rabbitmqctl delete_vhost 'ci'

Virtual hosts do not contain any permissions until assigned.

        # First '.*' references which vhost entities
        # Second '.*' for write permissions on every entity
        # Third '.*' for read permissions on every entity
        sudo /sbin/rabbitmqctl set_permissions -p 'vhost-name' 'username' '.*' '.*' '.*'

For practice, create the `ci` user and grant permissions on the `ci` vhost. Also create an administrative user that can be used for the API or UI.

        sudo /sbin/rabbitmqctl add_user 'admin' 'aVeryNicePa55W0rd'
        sudo /sbin/rabbitmqctl set_user_tags 'admin' 'administrator'
        sudo /sbin/rabbitmqctl add_user 'ci' 'aVeryStronGPasW00rd'
        sudo /sbin/rabbitmqctl add_vhost 'ci'
        sudo /sbin/rabbitmqctl set_permissions -p 'ci' 'ci' '.*' '.*' '.*'

## Configure RabbitMQ Runtime

`RabbitMQ` has a number of configurable options but this guide changes only a few.

{{< file "/etc/rabbitmq/rabbitmq.conf" ini >}}
# vm_memory_high_watermark sets the memory threshold at which flow
# control is triggered. Can be either relative to the available RAM
# or absolute.
vm_memory_high_watermark.relativw = 0.6
#vm_memory_high_watermark.absolute = 2GB

# log.file.level controls the amount of logging
log.file.level = warning

# cluster_partition_handling is only needed when creating a cluster of RabbitMQ nodes.
cluster_partition_handling = autoheal
{{< /file >}}

## System Tuning

`RabbitMQ` installations under production workloads benefit from tuning system limits and kernel parameters. Making these changes helps `RabbitMQ` service more concurrent connections and queues.

### Increase the File Descriptor Limits

{{< note >}}
The Debian default for `fs.file-max` is usually adequate but should be checked with `sudo /sbin/sysctl fs.file-max`. If the limit is less than 65536, it should be increased.
{{< /note >}}

{{< file "/etc/sysctl.d/60-rmq-fs-override.conf" ini >}}
# fs.file-max=65536
# Decrease the amount of ram used for file system caching
vm.dirty_ratio = 10
vm.dirty_background_ratio = 5
{{< /file >}}

{{< file "/etc/security/limits.d/60-rmq-fs-override.conf" conf >}}
rabbitmq soft nofile 65536
rabbitmq hard nofile 98304
{{< /file >}}

### Tune the TCP Stack

{{< file "/etc/sysctl.d/60-rmq-net-override.conf" ini >}}
# Shorten the timeout wait for "finished" connections
net.ipv4.tcp_fin_timeout=5
# Increase the maximum number of connections
net.core.somaxconn=4096
# Increase the maximum number of connections held in backlog
net.ipv4.tcp_max_syn_backlog=4096
{{< /file >}}

At this time the system should be rebooted to let all the changes take effect. After the reboot the new system settings can be confirmed using `sudo /sbin/sysctl $setting`. For example:

        sudo /sbin/sysctl vm.dirty_ratio

## Firewall Configuration

{{< note >}}
If your Linode is **not** accessible to the broader internet, you can skip this section. If it is, read on to see a basic firewall configuration for RabbitMQ installations.
{{< /note >}}

`RabbitMQ` defaults to binding to public IPs where it runs. Aside from accepting and delivering messages, it needs to discover and communicate with other nodes. If the host it's running can be reached by the broader internet, a firewall is needed to secure access. This guide uses `ufw` do setup some basic firewall rules. If `ufw` is not your preferred firewall solution, a summary of rules is provided. The goal of these firewall rules is to close off outside access while allowing select IPs to connect. This guide assumes that `ufw` needs to be installed and have initial configuration performed. Those steps can be skipped if `ufw` is already installed.

{{< caution >}}
If your Linode is running other networked services, make sure that you add rules for them as well.
{{< /caution >}}

### Rule Summary

- Allow select connections to port 4369
- Allow select connections to port 5671
- Allow select connections to port 5672
- Allow select connections to port 25672
- Allow all connections to port 22
- Allow all connections to port 80
- Allow all connections to port 443

Descriptions of `RabbitMQ` port use can be found [here](https://www.rabbitmq.com/networking.html#ports).

        sudo apt-get install -y ufw
        sudo ufw default deny incoming
        sudo ufw default allow outgoing
        sudo ufw allow ssh
        sudo ufw allow www
        sudo ufw allow https
        # These rules need not be limited to a single IP. Subnets can be allowed
        # by using CIDR notation, e.g. aa.bb.cc.dd/24
        sudo ufw allow proto tcp from $ip to any port 4369
        sudo ufw allow proto tcp from $ip to any port 5671
        sudo ufw allow proto tcp from $ip to any port 5672
        sudo ufw allow proto tcp from $ip to any port 25672
        # Opening port 15672 exposes the management UI and API. It can be opened
        # here or can be accessed by proxying from a web server (see below).
        # sudo ufw allow tcp/15672
        sudo ufw enable
        # Check the results
        sudo ufw status

## Configure a Proxy (Optional)

If using the management UI or API remotely, you may want to configure a HTTP proxy rather than expose the management port directly. The example below uses `Nginx` as a simple reverse proxy.

{{< file "/etc/nginx/sites-available/rabbitmq" nginx >}}
server {
    listen        80;
    server_name   the.domain.com;
    location / {
        proxy_pass         http://localhost:15672/;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
{{< /file >}}

Or if using SSL ...

{{< file "/etc/nginx/sites-available/rabbitmq" nginx >}}
server {
    listen        80;
    server_name   the.domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen        443;
    server_name   the.domain.com

    ssl_certificate     /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/certificate.key;

    location / {
        proxy_pass         http://localhost:15672/;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
{{< /file >}}

Link the configuration file, verify, and restart.

        sudo ln -s /etc/nginx/sites-available/rabbitmq /etc/nginx/sites-enabled/rabbitmq
        sudo nginx -t
        sudo systemctl restart nginx

## Conclusion

Setup is now complete and `RabbitMQ` is now ready to start receiving and delivering messages.