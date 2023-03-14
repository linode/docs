---
slug: how-to-install-nvm
description: 'Shortguide for installing the Node Version Manager (NVM)'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["nodejs", "version management"]
tags: ["version control system"]
modified: 2020-04-24
modified_by:
  name: Sam Foo
title: "Install Node Version Manager (NVM)"
published: 2020-04-24
headless: true
show_on_rss_feed: false
aliases: ['/development/nodejs/how-to-install-nvm/']
authors: ["Linode"]
---

1.  Install the [Node Version Manager](https://github.com/nvm-sh/nvm) (NVM) for Node.js. This program helps you manage different Node.js versions on a single system.

        sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash


1.  To start using `nvm` in the same terminal run the following commands:

        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    Verify that you have access to NVM by printing its current version.

        nvm --version

    You should see a similar output:

    {{< output >}}
0.35.3
    {{</ output >}}

1.  Install Node.js:

    {{< note respectIndent=false >}}
As of writing this guide, the latest LTS version of [Node.js](https://nodejs.org/en/download/) is `v12.16.2`. Update this command with the version of Node.js you would like to install.
    {{< /note >}}

        nvm install 12.16.2

1. Use NVM to run your preferred version of Node.js.

        nvm use 12.16.2

    Your output will resemble the following

    {{< output >}}
Now using node v12.16.2 (npm v6.14.4)
    {{</ output >}}
