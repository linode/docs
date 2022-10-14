---
slug: introduction-to-linux-administration
author:
  name: Jared Kobos
  email: docs@linode.com
description: This guide introduces important sysadmin concepts and tools for new users who are managing a project on a Linode.
og_description: This guide introduces important sysadmin concepts and tools for new users who are managing a project on a Linode.
keywords: ["linux", "sysadmin", "administration"]
tags: ["linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-05-31
modified_by:
  name: Linode
published: 2018-05-31
title: Introduction to Linux Administration
external_resources:
  - '[Linux System Administration Basics](/docs/guides/linux-system-administration-basics/)'
  - '[Linode API Documentation](https://developers.linode.com/)'
aliases: ['/quick-answers/linux-essentials/introduction-to-linux-administration/']
---

Linode offers a flexible and customizable cloud platform for your applications. This has advantages in terms of cost and control, but also means that many services which are included in shared hosting need to be manually deployed and configured for your needs. If you are new to self-hosting, you may not know everything that needs to be done. This guide introduces the concepts and tools that you will need to be familiar with when hosting your own applications on a Linode.

## Create Servers

You will have to choose the best region, plan size, type, and Linux distribution for your Linodes. For simple projects, a 2GB Linode is enough to get started. You should choose a data center close to your intended audience; if your project grows, you can scale your servers to additional regions.

## Users

If you will be the only one working on your project, a single standard user account with `sudo` access should be all you need. However, if you have multiple users, you must create accounts for each of them and make sure they have the correct permissions. Every directory and file in a Linux system has permissions setting specifying who can read, write, or execute the file.

Limited user accounts can only write to files in their home directories by default (located at `/home/username` for each user). In a common use case like hosting a website, the files for the website are often kept in `/var/www/html` or a similar directory. You can create a `web` group for editing the website and give that group access to the website files. Then you can add the user accounts for each collaborator to the `web` group. For more information, see our [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.

## Backups

Making sure that all important data is backed up is one of a system administrator's most important tasks. Our [Introduction to Backups](/docs/guides/introduction-to-backups/) guide explains how to find the best backup solution for your needs.

## Monitoring and Diagnostic Tools

The dashboard in the Linode Manager provides basic information about your Linode's status, CPU and memory usage, and network traffic. Linode also offers the [Longview](/docs/guides/what-is-longview/) service, which provides much more detailed insight into your Linode. Sometimes, however, issues will occur on your system and you will have to investigate to determine their cause.

Simple tools like `ping` and [MTR](/docs/guides/diagnosing-network-issues-with-mtr/), which are available on most Linux distributions, are helpful in diagnosing network issues. There are also [shell commands](/docs/guides/linux-system-administration-basics/#system-diagnostics) used for checking memory usage, disk allocation, and running processes.

Larger projects can benefit from more advanced monitoring tools, such as the [Elastic Stack](/docs/guides/visualize-apache-web-server-logs-using-elastic-stack-on-debian-8/). The Elastic Stack provides dozens of services and plugins that can be used to record, index, and search different types of data, from webserver logs to geolocation data.

### Log Management

Linux systems and applications maintain a number of logs, usually stored in `/var/log/`. Reviewing these logs with commands like `sudo tail -f /var/log/auth.log` is  good first step to take when troubleshooting a problem.

Over time, or with more complicated applications, log files can become difficult to keep track of. In this case it is a good idea to install [logrotate](/docs/guides/use-logrotate-to-manage-log-files/) to manage your log files.

## Containers and Orchestration

It has become increasingly common practice to encapsulate components of an application in an easily reproducible container. All of the packages and configurations for the application are stored within the container, so that it is simple to deploy the application to a new server (often just a single command). Containerization also helps keep the components of your application modular and isolated.

### Docker

Docker is the most commonly used container platform. [Docker Hub](https://hub.docker.com) is a public repository of thousands of images that can be used to easily build containers to run common applications, and [Docker Compose](/docs/guides/how-to-use-docker-compose/) is a tool for running multi-container applications.

Read our guide on [When and Why to Use Docker](/docs/guides/when-and-why-to-use-docker/) to see if docker is a good choice for your project. To install and start working with Docker, use our [Install Docker](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/) guide.

### Orchestration Tools

For larger-scale projects, orchestration tools can be very helpful. These tools allow you to manage clusters of Linodes, including giving you the ability to quickly scale or perform rolling upgrades. If your application's audience is growing rapidly, having to manually create new Linodes, deploy your application to them, then connect each new Linode to your existing cluster is time consuming and error-prone. Similarly, making sure that a large fleet of Linodes is running the most up-to-date system packages and software versions can cause a lot of difficulty. With tools like [Kubernetes](https://kubernetes.io/), [Salt](/docs/guides/getting-started-with-salt-basic-installation-and-setup/), and [Terraform](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/), building out and managing your infrastructure becomes much easier.

## Advanced Topics

### Load Balancing

In a larger application with many users, it often becomes important to distribute the requests received across multiple web servers. Typically, a single server, known as a *load balancer*, will listen for requests on your IP address or domain name. The balancer then forwards the requests to backend servers. Linode includes a [NodeBalancer](/docs/guides/getting-started-with-nodebalancers/) service that will automatically balance load between attached backend nodes, and also includes monitoring and other features. If you would prefer to configure your own load balancers, start with our [HAProxy](/docs/guides/how-to-use-haproxy-for-load-balancing/) guide.

### Set Up an Email Server

With a Linode and a fully-qualified domain name (FQDN), you can set up a private email server with @your-domain.com addresses. Email server configuration can be quite complex, but fortunately there are free third-party solutions that can simplify the process. Start with our [Running a Mail Server](/docs/guides/running-a-mail-server/) guide, or consider [Mail-in-a-Box](/docs/guides/how-to-create-an-email-server-with-mail-in-a-box/) for an all-in-one solution.
