---
# Shortguide: How to verify that the marketplace app has been successfully installed.

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: marketplace-verify-installation-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-07
author:
  name: Linode
  email: docs@linode.com
modified_by:
  name: Linode
---

To determine if the installation has completed, open the [Lish console](/docs/guides/using-the-lish-console/) and wait for the *"Installation Complete!"* notice to appear. This notice should also appear at the end of the installation's log file, which you can view by logging in to your instance through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/) and running:

    grep 'Installation complete!' /var/log/stackscript.log