---
slug: monitoring-third-party-tools-shortguide
description: 'Shortguide that describes monitoring third-party tools.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-21
modified_by:
  name: Heather Zoppetti
published: 2020-07-21
title: Monitoring Third-Party Tools
keywords: ["monitoring"]
headless: true
show_on_rss_feed: false
aliases: ['/uptime/monitoring-third-party-tools-shortguide/']
authors: ["Linode"]
---

The graphs in the Linode Cloud Manager provide basic information for things like CPU utilization and bandwidth consumption. That's good information as far as it goes, but it won't sate the appetite of true geeks who crave detailed statistics on a server's disk, network, system, and service performance. For that kind of information, you'll need to install and configure a third-party performance monitoring tool.

There are several free third-party performance monitoring tools available for your Linode:

-   **Munin**: Munin is a system and network monitoring tool that generates graphs of resource usage in an accessible web based interface. Munin also makes it possible to monitor multiple Linodes with a single installation.
-   **Cacti**: If you have advanced monitoring needs, try Cacti. It allows you to monitor larger systems and more complex deployments with its plugin framework and web-based interface.
