---
author:
  name: Linode
  email: docs@linode.com
description: 'A look into Salt''s primary components, features, and configurations for the new SaltStack user'
keywords: ["salt", "automation", "saltstack", "configuration management"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-10-16
modified_by:
  name: Linode
published: 2018-10-16
title: A Beginner's Guide to SaltStack
external_resources:
 - '[SaltStack Documentation](https://docs.saltstack.com/)'
---

[Salt](https://s.saltstack.com/community/) is a Python-based configuration management and orchestration system. Salt uses a client/server model to communicate with remote machines. Here is a brief overview of the major components to SaltStack. These are useful terms to become familiar with before beginning to work with Salt.


## Master

The **salt-master** is a daemon running on a server which controls client servers running the **salt-minion**.

## Minion

Minions are the SaltStack client machines. A minion authenticates with the master using public key encryption and further communicates via encrypted TCP connections. Minions are usually managed with a Salt master but they're also capable of running without one, sometimes called [masterless mode](https://docs.saltstack.com/en/latest/topics/tutorials/standalone_minion.html#tutorial-standalone-minion).

## States and Formulas

A [Salt state](https://docs.saltstack.com/en/latest/topics/tutorials/starting_states.html) is a particular configuration setup enforced by a `top.sls` file. An SLS file contains YAML data for specific configuration options such as (but not limited to) installed packages, system changes, and application configurations.

Multiple SLS files can be combined and reference each other to form a Salt Tree, and while SLS files are most commonly used on minons, it's  possible to enforce a particular state on your Salt master in the same way.

One use case for a Salt State is a base system configuration that would include items such as an added third party package repository with an application installed from it, configured as necessary. From this state, a Pillar can be used to add additional information for user credentials, site files, scripts or service files, etc.

Where a state can be templated to provide abstraction over running the same monotonous commands each time, and to make it variable, etc., a [Salt formula](https://docs.saltstack.com/en/latest/topics/development/conventions/formulas.html) is able to provide a group of states all working toward a common configuration or function.

One example of a Salt formula would be an Apache server proxying traffic to NGINX. You could have the initial installation with accompanying packages that may not be direct dependencies, possibly a monitoring service for each web server's service, and potentially a watchdog for configuration changes so as to restart the individual services. A Pillar can then be used to manage the web servers' configuration files.

## Grains

[Grains](https://docs.saltstack.com/en/latest/topics/grains/) are individual properties of an operating system or hardware setup such as domain, OS version, CPU core count, etc. Grains allow you to target minons matching specific requirements. For example, the following command installs Apache HTTP Server on all minions running CentOS:

        salt -G 'os:CentOS' pkg.install httpd

Grains are considered to be static and unchanging (such as hardware information), or one-time configurations (such as a machine's domain name). Grains can be assigned to minon configuration files or stored in `/etc/salt/grains`. The built-in grains are those made available by [salt.grains.core](https://docs.saltstack.com/en/latest/ref/grains/all/salt.grains.core.html). You can create custom grains or alter pre-existing ones.


## Pillars

Salt's Pillar feature takes data defined on the Salt master and distributes it to minons. Pillars are especially useful for secure data such as account credentials, defining variables such as network addresses, and minion module configuration. On the other hand, Pillars can be much more complex and Pillar data can be pulled from a multitude of places, such as a Git repository or database. Similar to Salt States, Pillar data is distributed to minions matched in a `top.sls` file.

Using Pillars is optional, but a way to determine appropriate use of a Pillar over a Salt state could be: Data goes into a Pillar, while the logic of how that data should be used makes up a State. Furthermore, sometimes the distinction between Grains and Pillars can be confusing. A Pillar is a structure of application or system data for use by a minion (or multiple minions), whereas Grains are small points of information about the minion, created by, and stored on, the minion.

As an example, if you simply need to change root’s shell to `/bin/zsh`, you could easily just hardcode that right into a State. However, if you’re operating with hundreds of users, you'd want to avoid the process of hardcoding that logic hundreds of times.

## Beacons

The [beacon](https://salt.readthedocs.io/en/stable/topics/beacons/index.html) system is a way of monitoring a variety of system processes on Salt minions. There are a variety of [beacon modules](https://docs.saltstack.com/en/latest/ref/beacons/all/index.html) available.

Beacons can trigger [reactors](https://docs.saltstack.com/en/latest/topics/reactor/index.html#reactor) which can then help implement a change or troubleshoot an issue. For example, if a service's response times out, the reactor system can restart the service.


## Getting Started with Salt

Now that you're familiar with some of Salt's basic terminology and components, move on to our guide [Getting Started with Salt - Basic Installation and Setup](https://www.linode.com/docs/applications/configuration-management/getting-started-with-salt-basic-installation-and-setup/) to set up a configuration to start running commands and provisioning minion servers.

The SaltStack documentation also contains a page of [best practices](https://docs.saltstack.com/en/latest/topics/best_practices.html) to be mindful of when working with Salt. You should review this page and implement those practices into your own workflow whenever possible.