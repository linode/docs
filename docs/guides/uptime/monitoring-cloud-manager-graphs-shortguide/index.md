---
slug: monitoring-cloud-manager-graphs-shortguide
description: 'Shortguide that describes the Linode monitoring graphs in Cloud Manager.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-21
modified_by:
  name: Heather Zoppetti
published: 2020-07-21
title: Linode Cloud Manager Graphs
keywords: ["monitoring"]
headless: true
show_on_rss_feed: false
aliases: ['/uptime/monitoring-cloud-manager-graphs-shortguide/']
authors: ["Linode"]
---

If you're new to performance monitoring, you can get started by logging in to the Linode Cloud Manager. There are four simple graphs available on the Dashboard and in the Graphs section:

-   **CPU %:** Monitor how your Linode's CPU cores are being utilized. Note that each of your Linode's CPU cores is capable of 100% utilization, which means you could see this graph spike well over 100%, depending on your Linode plan size.
-   **IPv4 Network Traffic:** Keep tabs on how much incoming and outgoing bandwidth your server is using.
-   **IPv6 Network Traffic:** Wondering if any of your visitors are using IPv6? Check this graph to see how much bandwidth has been transferred over IPv6.
-   **Disk I/O:** Watch for [disk input/output bottlenecks](/docs/guides/troubleshooting-overview/#is-your-disk-full).

When you first start monitoring the graphs, you won't know what numbers are normal. Don't worry. With time and practice, you'll learn what the graphs are supposed to look like when your server is operating normally. Then you'll be able to spot performance abnormalities before they turn into full-blown problems.
