---
author:
  name: Nashruddin Amin
  email: nashruddin.amin@gmail.com
description: 'Automate browsing tasks with Nightmare.js, a high-level browser automation library.'
keywords: 'nightmare.js, node.js, headless browser, automation'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Friday, September 29th, 2017'
modified: Tuesday, October 3rd, 2017
modified_by:
  name: Linode
title: 'Use Nightmare.js to Automate Headless Browsing'
contributor:
  name: Nashruddin Amin
  link: 'https://github.com/flowfree'
external_resources:
  - '[Nightmare.js Homepage](http://www.nightmarejs.org/)'
  - '[Nightmare.js Github Repository](https://github.com/segmentio/nightmare)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----



**Nightmare.js** is a high-level browser automation library, designed to automate browsing tasks for sites that don't have APIs. The library itself is a wrapper around [Electron](https://electron.atom.io/), which Nightmare.js then uses as a browser to interact with web sites. This guide will help you install Nightmare.js on Ubuntu 16.04 and run automation scripts without the need for a graphical user interface.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{: .note}
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Install Node.js

We will install the more recent Node.js version using the PPA maintained by NodeSource rather than the older version in the Ubuntu 16.04 repository.

1.  Install the NodeSource PPA (formerly Chris Lea's Launchpad PPA) in order to get access to its contents.

        curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

    {: .note}
    >
    > The command above will fetch the latest version of Node.js 6, which as of this writing is 6.11.3. If you want another version, replace the `6.x` to match with the version you need. See [Node.js Releases](https://nodejs.org/en/download/releases/).

2.  Install Node.js and NPM with the following command:

        sudo apt-get install -y nodejs

3.  Check that Node.js is successfully installed:

        node --version

    The command should show the version of Node.js installed on your server.

4. Check that NPM is successfully installed as well:

        npm --version


## Install Nightmare.js

We will install Nightmare.js in a specific directory to avoid installing the Node packages globally. We will use `automation/` directory within the current user's home directory as the base for our project.

1.  Create a directory `automation/` within your home directory and navigate to the new directory:

        mkdir ~/automation && cd ~/automation

2.  Initialize an npm project:

        npm init

    {:.note}
    > You will be prompted to provide a name, repository, and other details for the project. Since this information is not important for the purposes of this guide, you can accept the default values provided. To do this automatically, use the `-f` (force) flag when running `npm init`.

3.  Install Nightmare.js:

        npm install --save nightmare

## Create and Run the Automation Script

Nightmare.js is an npm module, so it can be imported from within a Node.js script. For the purposes of this guide, you will write a simple script that will search Linode's documentation for guides concerning Ubuntu.

1. Nightmare.js uses the Electron browser and it needs X server in order to run. Install `xvfb` and its dependencies so that you can run graphical applications without display hardware:

        sudo apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev libgtk2.0-dev libnotify-dev libgnome-keyring-dev libgconf2-dev libasound2-dev libcap-dev libcups2-dev libxtst-dev libxss1 libnss3-dev gcc-multilib g++-multilib

2. Create `linode.js` inside the automation directory and add contents as follows:

    {: .file }
    ~/automation/linode.js
    :   ~~~ javascript
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
        ~~~

    This script visits the Linode docs home page, enters 'ubuntu' into the input box, and clicks the submit button. It then waits for the results to load and prints the url and title each entry on the first page of results.

3.  Run the script:

        xvfb-run node linode.js

    It will output something like this:

        Title: How to Install a LAMP Stack on Ubuntu 16.04
        URL: https://www.linode.com/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04
        Title: Install and Configure MySQL Workbench on Ubuntu 16.04
        URL: https://www.linode.com/docs/databases/mysql/install-and-configure-mysql-workbench-on-ubuntu
        Title: Install MongoDB on Ubuntu 16.04 (Xenial)
        URL: https://www.linode.com/docs/databases/mongodb/install-mongodb-on-ubuntu-16-04
        ...

## Add a Cron Job to Run the Automation Script

In many cases you will want to run your script periodically using a cron task.

1.  Open the current user's crontab file:

        crontab -e

2.  Add the following line at the end of the file:

        0 * * * * cd ~/automation && xvfb-run node linode.js >> data_$(date +\%Y_\%m_\%d_\%I_\%M_\%p).txt

    The command above will change the working directory to the `~/automation/` dir, run the scraping script, and save the output to a file with a unique filename based on date and time. It will repeat this process automatically once every hour.

{: .note}
>
> For more information about Cron, see our [Schedule Tasks with Cron](/docs/tools-reference/tools/schedule-tasks-with-cron) guide.
