---
author:
  name: Nashruddin Amin
  email: nashruddin.amin@gmail.com
description: 'Automate browsing tasks with Nightmare.js, a high-level browser automation library.'
og_description: 'Nightmare.js is an automated, headless browsing tool that can be configured to self-navigate websites, automate data scraping, and quicken QA.'
keywords: ["nightmare.js", " node.js", " headless browser", " automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-10-09
modified: 2017-10-09
modified_by:
  name: Linode
title: 'Use Nightmare.js to Automate Headless Browsing'
contributor:
  name: Nashruddin Amin
  link: https://github.com/flowfree
external_resources:
  - '[Nightmare.js Homepage](http://www.nightmarejs.org/)'
  - '[Nightmare.js Github Repository](https://github.com/segmentio/nightmare)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

**Nightmare.js** is a high-level browser automation library, designed to automate browsing tasks for sites that don't have APIs. The library itself is a wrapper around [Electron](https://electron.atom.io/), which Nightmare.js uses as a browser to interact with web sites. This guide helps you install Nightmare.js on Ubuntu 16.04 and run automation scripts without the need for a graphical user interface.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Node.js

The Ubuntu 16.04 repository is slower to release recent versions of Node.js. Install the most recent available version through the NodeSource PPA (formerly Chris Lea's Launchpad PPA).

1.  Install the NodeSource PPA:

        curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

    {{< note >}}
This command fetches the latest version of Node.js 6. To install a [specific version](https://nodejs.org/en/download/releases/), replace the `6.x` in this example.
{{< /note >}}

2.  Install Node.js and NPM with the following command:

        sudo apt-get install -y nodejs

3.  Confirm that Node.js is successfully installed:

        node --version

4. Check that the NPM command-line tool is successfully installed as well:

        npm --version

## Install Nightmare.js

To avoid installing the Node packages for the system globally, install Nightmare.js in a specific directory. This examples creates a `automation` directory within the current user's home directory as the base the project.

1.  Create and switch to the `automation` directory:

        mkdir ~/automation && cd ~/automation

2.  Initialize an NPM project. NPM prompts you to provide a name, repository, and other details for the project. Accept the default values or assign whatever names your want. To accept the defaults automatically, add the `-f` force flag to this example:

        npm init

3.  Install Nightmare.js:

        npm install --save nightmare

## Create and Run the Automation Script

Nightmare.js is an NPM module, so it can be imported from within a Node.js script. Use these examples to write a simple script that will search Linode's documentation for guides about Ubuntu.

1. Nightmare.js uses the Electron browser and requires an X server. Install `xvfb` and its dependencies so that you can run graphical applications without display hardware:

        sudo apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev libgtk2.0-dev libnotify-dev libgnome-keyring-dev libgconf2-dev libasound2-dev libcap-dev libcups2-dev libxtst-dev libxss1 libnss3-dev gcc-multilib g++-multilib

2. Create `linode.js` inside the automation directory and add the following:

    {{< file "~/automation/linode.js" javascript >}}
const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});


nightmare
    .goto('https://www.linode.com/docs')
    .insert('#gsc-i-id1', 'ubuntu')
    .click('input.gsc-search-button-v2')
    .wait('#search-results')
    .evaluate(function() {
            let searchResults = [];

            const results =  document.querySelectorAll('h6.library-search-result-title a');
            results.forEach(function(result) {
                    let row = {
                                    'title':result.innerText,
                                    'url':result.href
                              }
                    searchResults.push(row);
            });
            return searchResults;
    })
    .end()
    .then(function(result) {
            result.forEach(function(r) {
                    console.log('Title: ' + r.title);
                    console.log('URL: ' + r.url);
            })
    })
    .catch(function(e)  {
            console.log(e);
    });

{{< /file >}}


3.  Run the script:

        xvfb-run node linode.js

    The script visits the [Linode docs](/docs) page, enters 'ubuntu' into the input box, and clicks the submit button. It then waits for the results to load and prints the url and title each entry on the first page of results.

    The output will resemble the following:

        Title: How to Install a LAMP Stack on Ubuntu 16.04
        URL: https://www.linode.com/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04
        Title: Install and Configure MySQL Workbench on Ubuntu 16.04
        URL: https://www.linode.com/docs/databases/mysql/install-and-configure-mysql-workbench-on-ubuntu
        Title: Install MongoDB on Ubuntu 16.04 (Xenial)
        URL: https://www.linode.com/docs/databases/mongodb/install-mongodb-on-ubuntu-16-04
        ...

## Add a Cron Job to Run the Automation Script

This example automates the script to run once every hour. It changes to the `~/automation/` directory, runs the scraping script, and saves the output to a file with a unique filename that includes the date and time it ran.

For more information about using Cron, see our [Schedule Tasks with Cron](/docs/tools-reference/tools/schedule-tasks-with-cron) guide.

1.  Open the crontab file:

        crontab -e

2.  Add the following line to the end of the file:

    {{< file-excerpt "crontab" cron >}}
0 * * * * cd ~/automation && xvfb-run node linode.js >> data_$(date +\%Y_\%m_\%d_\%I_\%M_\%p).txt

{{< /file-excerpt >}}

