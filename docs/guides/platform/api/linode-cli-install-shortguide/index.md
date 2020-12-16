---
slug: linode-cli-install-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to install the Linode CLI.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Install the Linode CLI
keywords: ["linode cli"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-install-shortguide/']
---

The easiest way to install the CLI is through [Pip](https://pypi.org/project/pip/):

1.  Install the CLI:

        pip3 install linode-cli --upgrade

1.  You need a Personal Access Token to use the CLI. Use the [Linode Cloud Manager](https://cloud.linode.com/profile/tokens) to obtain a token.

1.  The first time you run any command, you will be prompted with the CLI's configuration script. Paste your access token (which will then be used by default for all requests made through the CLI) at the prompt. You will be prompted to choose defaults for Linodes created through the CLI (region, type, and image). These are optional, and can be overridden for individual commands. Update these defaults at any time by running `linode-cli configure`:

    {{< output >}}
Welcome to the Linode CLI.  This will walk you through some
initial setup.

First, we need a Personal Access Token.  To get one, please visit
https://cloud.linode.com/profile/tokens and click
"Create a Personal Access Token".  The CLI needs access to everything
on your account to work correctly.

Personal Access Token:
{{< /output >}}

{{< note >}}
The CLI installs a bash completion file. On OSX, you may have to source this file before it can be used. To do this, add `source /etc/bash_completion.d/linode-cli.sh` to your `~/.bashrc` file.
{{< /note >}}
