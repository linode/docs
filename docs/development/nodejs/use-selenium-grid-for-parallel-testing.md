---
author:
  name: Jared Kobos
  email: jaredkobos@gmail.com
description: 'Automate browsing tasks with Nightmare.js, a high-level browser automation library.'
og_description: 'Nightmare.js is an automated, headless browsing tool that can be configured to self-navigate websites, automate data scraping, and quicken QA.'
keywords: ["selenium", "node.js", " headless browser", "automation", "webdriver"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-03-06
modified: 2018-03-06
modified_by:
  name: Linode
title: 'Use Selenium Grid for Parallel Testing'
external_resources:
  - '[Nightmare.js Homepage](http://www.nightmarejs.org/)'
  - '[Nightmare.js Github Repository](https://github.com/segmentio/nightmare)'
---

## What is Selenium Grid?

[Selenium](https://seleniumhq.github.io/selenium/docs/api/javascript/index.html) is a browser automation library with bindings for most common programming languages. It is most often used for testing web applications, but can also be used to automate any task that a web browser can perform. In contrast to similar tools such as Nightmare.js, Selenium can run tasks or tests on any version of any major browser. This can make it more complicated to get running, but allows you to test your application's behavior on exactly the platforms that users are likely to need.

For many applications, the Selenium standalone server is sufficient. However, Selenium can also be configured as a grid, with multiple nodes communicating with a central hub. The nodes and hub can be run on the same computer or server, or can be located on separate Linodes. This approach offers two main benefits:

- Selenium runs on Java and is compatible with all major operating systems. This makes it possible to set up a grid consisting of servers (or virtual machines) running Linux, OSX, and Windows. A test suite can then be run against the grid, with each test run on multiple browsers and operating systems. The hub will delegate each test to a node that has the requested capability (e.g. sending a Safari test to a grid with OSX and the Safari webdriver).

- For larger projects, running a lengthy test suite in series can be time consuming. By running the test suite across a grid consisting of multiple servers, it is possible to distribute the tests across multiple nodes and significantly increase the performance of the testing process.

This guide will show how to set up a simple Selenium grid consisting of a hub and two nodes, all on separate Linodes. A simple test script will then be used to demonstrate running tests against different versions of Firefox.

## Prepare Grid Linodes

You will need to install Java and other dependencies on each Linode that will be part of the Selenium grid. This guide will use three Linodes for this purpose, but you can also run all of the nodes from the same Linode if you prefer. Throughout this guide, these Linodes will be referred to as `hub`, `node-1`, and `node-2`.

### Install Java

{{< content "install-java-8-ppa.md" >}}

### Install Dependencies

When running tests with Selenium, each grid node can only run tests on browsers that have been installed on that node. Each browser also requires a separate executable webdriver. For this example, you will install Geckodriver and different versions of Firefox on `node-1` and `node-2`.

1.  Check the latest release of Geckodriver on the [releases](https://github.com/mozilla/geckodriver/releases) page and download it to `node-1` and `node-2`:

        wget https://github.com/mozilla/geckodriver/releases/download/v0.19.1/geckodriver-v0.19.1-linux64.tar.gz

2.  Extract the archive and move the executable to a location in your PATH:

        tar -xvf geckodriver-v0.19.1-linux64.tar.gz
        sudo mv geckodriver /usr/local/bin/

3.  On `node-1`, install the latest version of Firefox:

        sudo apt install firefox



### Download Selenium

Selenium provides a single `.jar` file that can be used to run a standalone server, hub, or node. Check the latest release at the [Selenium downloads page](https://www.seleniumhq.org/download/) and download the file to each Linode using `wget`:

    wget http://selenium-release.storage.googleapis.com/3.10/selenium-server-standalone-3.10.0.jar

### Start Grid Hub

1.  On the `hub` Linode, start the hub by running the Selenium server with `-role` set to `hub`:

        java -jar selenium-server-standalone-3.10.0.jar -role hub

2.  The resulting output will give you URLs to use for registering nodes and connecting to the hub. Copy these URLs for use in the next section.

    {{< output >}}
21:27:51.470 INFO [GridLauncherV3.launch] - Selenium build info: version: '3.10.0', revision: '176b4a9'
21:27:51.475 INFO [GridLauncherV3$2.launch] - Launching Selenium Grid hub on port 4444
2018-03-06 21:27:52.248:INFO::main: Logging initialized @1166ms to org.seleniumhq.jetty9.util.log.StdErrLog
21:27:52.446 INFO [Hub.start] - Selenium Grid hub is up and running
21:27:52.447 INFO [Hub.start] - Nodes should register to http://69.164.211.42:4444/grid/register/
21:27:52.448 INFO [Hub.start] - Clients should connect to http://69.164.211.42:4444/wd/hub
{{< /output >}}

### Configure Grid Nodes

On `node-1` and `node-2`, use the registration URL to connect each node to the hub. If you are putting the grid and nodes on the same Linode, replace the IP address with `localhost`.

      java -jar selenium-server-standalone-3.10.0.jar -role node -hub http://69.164.211.42:4444/grid/register/

You should see output similar to the following, indicating that your nodes have been successfully registered to the hub:

  {{< output >}}
21:33:22.856 INFO - Selenium Server is up and running on port 5555
21:33:22.857 INFO - Selenium Grid node is up and ready to register to the hub
21:33:22.895 INFO - Starting auto registration thread. Will try to register every 5000 ms.
21:33:22.896 INFO - Registering the node to the hub: http://69.164.211.42:4444/grid/register
21:33:23.064 INFO - Updating the node configuration from the hub
21:33:23.178 INFO - The node is registered to the hub and ready to use
{{< /output >}}

You can also check the output from the hub itself:

  {{< output >}}
21:27:53.849 INFO [DefaultGridRegistry.add] - Registered a node http://198.58.122.154:5555
21:27:56.445 WARN [BaseRemoteProxy.<init>] - Max instance not specified. Using default = 1 instance
21:27:56.450 INFO [DefaultGridRegistry.add] - Registered a node http://50.116.22.93:5555
21:27:56.743 WARN [BaseRemoteProxy.<init>] - Max instance not specified. Using default = 1 instance
{{< /output >}}

## Prepare Local Test Environment

In this example, the test script will be run from your local development machine. It will connect to the remote grid and execute the tests from there. If you do not have an available development machine, an additional Linode can also be used.

### Install Node.js and NPM

This guide will use the NPM `selenium-webdriver` package, which contains Node.js bindings for Selenium.

{{< content "install-nodejs-ppa.md" >}}

### Create an Example Test Script

This simple script will test the Linode docs home page.

1.  Create a directory for the test suite:

        mkdir test-selenium && cd test-selenium

2.  Initialize a Node.js app within the directory:

        npm init

    Accept the default values when prompted.

3.  Install NPM packages:

        npm install --save selenium-webdriver karma jasmine-node

4.  In a text editor, create `test.js` and add the following script:

    {{< file "~/test-selenium/test.js" js >}}
const {Builder, By, Capabilities, Key, until} = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
let firefox = require('selenium-webdriver/firefox');

(async function example() {
  let driver = await new Builder().forBrowser('firefox')
                                  .usingServer('http://69.164.211.42:4444/wd/hub')
                                  .setFirefoxOptions(
                                        new firefox.Options().headless())
                                  .setChromeOptions(
                                        new chrome.Options().headless().setChromeBinaryPath("/usr/bin/xchromium-browser"))
                                        .build();
                                  .build()
  try {
    await driver.get('http://www.linode.com/docs');
    await driver.findElement(By.name('q')).sendKeys('nginx', Key.RETURN);
    let el = driver.findElement(By.linkText('How to Configure nginx'));
    await driver.wait(until.elementIsVisible(el),100);
    await el.click();
    const title = await driver.getTitle();
    console.log(title);
  } finally {
    await driver.quit();
  }


})();
{{< /file >}}
