---
author:
  name: Nashruddin Amin
  email: nashruddin.amin@gmail.com
description: 'Automate browsing tasks with Nightmare.js, a high-level browser automation library.'
keywords: 'nightmare.js, node.js, headless browser, automation'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Saturday, September 30th, 2017'
modified: Saturday, September 30th, 2017
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

**Nightmare.js** is a high-level browser automation library, designed to automate browsing tasks for sites that don't have APIs. The library itself is a wrapper around **Electron**, which is used as the browser by Nightmare.js. This guide will help you install Nightmare.js on Ubuntu 16.04 and run automation scripts without the need of a graphical user interface.


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
    > The command above will fetch the latest version of Node.js 6, which is 6.11.3. If you want another version, replace the `6.x` to match with the version you need. See [Node.js Releases](https://nodejs.org/en/download/releases/).

2.  Install Node.js and NPM with the following command:

        sudo apt-get install -y nodejs

3.  Check that Node.js is successfully installed:

        node --version

    The command should show the version of Node.js installed on your server.

4. Check that NPM is successfully installed as well:

        npm --version


## Install Nightmare.js

We will install Nightmare.js in a specific directory to avoid installing the Node packages globally. We will use `automation/` directory within the current user's home directory as the base for our project.

1.  Create a new directory `automation/` within your home directory:

        cd ~ && mkdir automation

2. Change the current working directory to the newly created directory:

        cd automation

2.  Install Nightmare.js:

        npm install --save nightmare

    {: .note}
    >
    > It will take some time to install Nightmare.js, so you might want to set the `--verbose` flag to see what's going on.


## Create and Run the Automation Script

For our sample automation, we will try to fetch the latest job posts from [Indeed.com](http://indeed.com). 

1. Change the current working directory:

        cd ~/automation

2. Create a new file named `indeed.js`:

        nano indeed.js

3. Paste the following content:

    {: .file }
    ~/indeed.js
    :   ~~~ javascript
        // Import module and instantiate the Nightmare object
        var Nightmare = require('nightmare');
        var nightmare = Nightmare();

        /**
         * Function to perform search on Indeed given a keyword and a location.
         * This will make it possible to perform multiple searches within a session
         */
        var indeedSearch = function(keyword, location) {
          return function(nightmare) {
            nightmare
              .goto('http://www.indeed.com/')       // Open indeed.com
              .type('input[name=q]', keyword)       // Type the keyword in the "What" text box
              .type('input[name=l]', '')            // Clear the "Where" text box
              .type('input[name=l]', location)      // Type the location in the "Where" text box
              .click('input[type=submit')           // Click the "Find Jobs" button
              .wait('#resultsCol')                  // Wait until the result page is loaded
              .evaluate(function() {
                // Parse all of the job title, company name, and URL
                var jobs = new Array();
                var rows = document.querySelectorAll('.row.result');
                rows.forEach(function(row) {
                  var link = row.querySelector('h2 a');
                  var company = row.querySelector('span.company');
                  jobs.push({
                    title: link.innerText.trim(),
                    company: company.textContent.trim(),
                    url: link.href
                  });
                });
                // Return the parsed jobs
                return jobs;
              });
          };
        };

        // Start the automation
        nightmare
          .use(indeedSearch('devops', 'new york'))   // Search Indeed using the function above
          .end()                                     // Done, close the browser
          .then(function(jobs) {                     // Process the returned jobs from `evaluate` function above
            console.log('Title,Company,URL');
            jobs.forEach(function(job) {
              console.log(job.title + ',' + job.company + ',' + job.url);
            });
          });
        ~~~

    The code is pretty straightforward. Please read the comments within the code to learn what it does.

4.  Save the file by pressing **CTRL+O** and exit `nano` with **CTRL+X**.

5.  Run the script:

        xvfb-run node indeed.js

    It will output something like this:

        Title,Company,URL
        DevOps Engineer,Cynetra,https://www.indeed.com/rc/clk?jk=400...
        DevOps Sr Engineer,InRhythm,https://www.indeed.com/rc/clk?jk=2a3...
        DevOps Consultant,InRhythm,https://www.indeed.com/rc/clk?jk=273...
        DevOps Engineer,SiriusXM,https://www.indeed.com/rc/clk?jk=18c...
        ...

    {: .note}
    >
    > Nightmare.js uses Electron as the browser and it needs X server to run. We need a headless automation, so we prefixes the command with `xvfb-run` to provide in-memory display server. `Xvfb` allows you to run graphical applications without a display hardware.


## Add Cron Job to Run the Automation Script

Since we are automating web tasks, it makes sense if we run the automation script periodically using cron job. The following steps will show you how to run the script every hour using cron job.

1.  Edit the current user's crontab file:

        crontab -e

    This will open a text editor and allow you to edit the `crontab`.

    {: .note}
    >
    > If it shows some options for the text editors to be used, select `nano` for the easiest editor.

2.  Add the following line at the end of the file:

        0 * * * * cd ~/automation && xvfb-run node indeed.js >> data_$(date +\%Y_\%m_\%d_\%I_\%M_\%p).txt

    The command above will change the working directory to the `~/automation/` dir, run the Indeed scraping script, and save the output to a file with unique filename based on date and time.

3.  Press **CTRL+O** to save the file and **CTRL+X** to exit `nano`.

{: .note}
>
> For more information about Cron, see our [Schedule Tasks with Cron](/docs/tools-reference/tools/schedule-tasks-with-cron) guide.
