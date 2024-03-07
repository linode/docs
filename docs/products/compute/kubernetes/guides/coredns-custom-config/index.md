---
slug: coredns-custom-config
title: "Coredns Custom Config"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Linode"]
published: 2024-03-07
modified_by:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

When writing content, please reference the [Linode Writer's Formatting Guide](https://www.linode.com/docs/guides/linode-writers-formatting-guide/). This provides formatting guidelines for YAML front matter, Markdown, and our custom shortcodes (like [command](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#commands), [file](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#files), [notes](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#note-shortcode), and [tabs](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#tabs)).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started on the Linode Platform](/docs/products/platform/get-started/) and [Create a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}