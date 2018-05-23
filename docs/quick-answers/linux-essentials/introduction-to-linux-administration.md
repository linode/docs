---
author:
  name: Jared Kobos
  email: docs@linode.com
description: This guide provides an introduction for new
og_description: This guide provides an introduction for new
keywords: ["linux", "sysadmin", "administration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/wget/']
modified: 2018-05-22
modified_by:
  name: Linode
published: 2018-05-22
title: Introduction to Linux Administration
external_resources:
  - '[Linux System Administration Basics](/docs/tools-reference/linux-system-administration-basics/)'
  - '[Linode API Documentation](https://developers.linode.com/)'
---


## Create Servers

You will have to choose the best region, size, type, and image for your Linodes. For simple projects, a 2GB Linode running the `linode/debian` image is enough to get started. You should locate your servers close to your intended audience; if your project grows, you can scale your servers to additional regions.

## Users

If you will be the only one working on your project, a single regular user account with `sudo` access will be all you need. However, if you have multiple users, you will have to create accounts for each of them and make sure they have the correct permissions. Every directory and file in a Linux system has permssions setting specifying who can read, write, or execute the file. By default, limited user accounts can only write to files in their home directories (located at `/home/username` for each user). In a common use case like hosting a website, the files for the website are often kept in `/var/www/html` or a similar directory. You can create a `web` group for editing the website and give that group access to the website files. Then you can add the user accounts for each collaborator to the `web` group. For more information, see our [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.

## Backups

Making sure that all of your project's important data is backed up is one of a system administrator's most important tasks. Our [Introduction to Backups](/docs/quick-answers/linux-essentials/introduction-to-backups/) guide explains how to find the best backup solution for your project's needs.


## Monitoring and Diagnostic Tools

The dashboard in the Linode Manager provides basic information about your Linode's status, CPU and memory usage, and network traffic. Linode also offers the [Longview](/docs/platform/longview/longview/) service, which provides much more detailed insight into your Linode. Sometimes, however, issues will occur on your system and you will have to investigate to determine the cause.

### Basic Tools

Simple tools like `ping` and [mtr](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/), which are available on most Linux distributions, are helpful in diagnosing network issues.

### Elastic Stack

Larger projects can benefit from more advanced monitoring tools, such as the [Elastic Stack](/docs/databases/elasticsearch/visualize-apache-web-server-logs-using-elastic-stack-on-debian-8/). The Elastic Stack provides dozens of services and plugins that can be used to record, index, and search dfferent types of data, from webserver logs to geolocation data.

### Log Management

Linux systems and applications maintain a number of logs, usually stored in `/var/log/`; reviewing these logs with commands like `sudo tail -f /var/log/auth.log` is  good first step to take when tracking down a problem.

Over time, or with more complicated applications, log files can become difficult to keep track of. In this case it is a good idea to install [logrotate](/docs/uptime/logs/use-logrotate-to-manage-log-files/) to manage your log files.

## Containers and Orchestration

It has become increasingly common practice to encapsulate components of an application in an easily reproducible container. All of the packages and configurations for the application are stored within the container, so that it is simple to deploy the application to a new server (often just a single command). Containerization also helps keep the components of your application modular and isolated.

### Docker

Docker is the most commonly used container platform. [Docker Hub](https://hub.docker.com) is a public repository of thousands of images that can be used to easily build containers to run common applications, and [Docker Compose](/docs/applications/containers/how-to-use-docker-compose/) is a tool for running multi-container applications. To see if docker is a good choice for your project, read our guide on [When and Why to Use Docker](/docs/applications/containers/when-and-why-docker/). To install and start working with Docker, use our [Install Docker](/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment/) guide.

### Orchestration Tools

If your project will involve multiple Linodes, or if you think it might need to scale in the future, orchestration tools can be very helpful. These tools allow you to specify networks of Linodes (five nodes running Apache and three database nodes, for example)

## Advanced Topics

### Load Balancing

In a larger application with many users, it often becomes important to distribute the requests received across multiple web servers. Typically, a single server, known as a load balancer, will listen for requests on your IP address or domain name. The balancer then forwards the requests to backend servers. Linode includes a [NodeBalancer](docs/platform/nodebalancer/getting-started-with-nodebalancers/) service that will automatically balance load between attached backend nodes, and also includes monitoring and other features. If you would prefer to configure your own load balancers, start with our [HAProxy](/docs/uptime/loadbalancing/how-to-use-haproxy-for-load-balancing/) guide.

### Set Up an Email Server
