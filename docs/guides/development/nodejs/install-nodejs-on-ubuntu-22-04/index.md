---
slug: install-nodejs-on-ubuntu-22-04
description: 'You need to know how to install Node.JS on Ubuntu 22.04 Linux if you work on a cloud server with cloud apps. This tutorial gets you started? ✓ Click here!'
keywords: ['Install Node.JS on Ubuntu 22.04','Node.JS','Node.JS Ubuntu 22.04','Ubuntu 22.04 Node.JS','Install Node.JS Linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-02-24
modified_by:
  name: Linode
title: "How to Install Node.JS on Ubuntu 22.04"
title_meta: "Installing Node.JS on Ubuntu 22.04"
external_resources:
- '[Installati.one: How To Install node-security on Ubuntu 22.04](https://installati.one/ubuntu/22.04/node-security/)'
authors: ["John Mueller"]
---

Developers use [Node.JS](https://nodejs.org/) to perform [many tasks](https://nodejs.org/en/about/). It's used to install other applications, run server-side code, and execute JavaScript for user environments such as web applications. This guide shows you how to install Node.JS on Ubuntu 22.04.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Installing Node.JS

There are a number of options to configure Ubuntu 22.04 for Node.JS. These sections discuss the three most popular techniques.

### Installing Node.JS from the Default Repositories

The following steps show the simplest method to get the current Node.JS implementation for Ubuntu 22.04 using the default repositories.

1.  Install Node.JS:

    ```command
    sudo apt install -y nodejs
    ```

1.  Once the install is complete, verify your Node.JS installation:

    ```command
    node -v
    ```

    This information is important, as you may need a different version of Node.JS to perform a particular task.

1.  **Optional:** Enter the following command to install the [Node Package Manager (NPM)](https://www.npmjs.com/), which provides additional flexibility for Node.JS management:

    ```command
    sudo apt install -y npm
    ```

    {{< note >}}
    Some scripts also rely on NPM to verify Node.JS features or perform other tasks.
    {{< /note >}}

1.  **Optional:** Verify your NPM version:

    ```command
    npm -v
    ```

### Installing a Specific Version

A task may require a specific version of Node.JS. The example steps below show how to install the most current Node.JS version 16.x setup. However, the `16` in can be replaced with any other major supported version, including `19` (also `current`), `18` (also `lts`), or `14`.

1.  Obtain the Node.JS source:

    ```command
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    ```

1.  Install the 16.x version of Node.JS:

    ```command
    sudo apt-get install -y nodejs
    ```

    {{< note >}}
    This process also automatically installs NPM.
    {{< /note >}}

1.  Verify that the correct version of Node.JS is installed:

    ```command
    node -v
    ```

    The output should display `v16.19.1` or above.

1.  Ensure that the most current version of NPM is installed:

    ```command
    sudo npm install -g npm@latest
    ```

1.  Check the NPM version:

    ```command
    npm -v
    ```

    The output should display version `9.5.1` or above.

### Node.JS for Developers

The Node Version Manager supports multiple versions of Node.JS on a single system. This is so it can test scripts using multiple Node.JS versions. You can find the procedure for working with NVM [here](/docs/guides/how-to-install-use-node-version-manager-nvm/).

## Securing Node.JS

Node.JS provides a powerful scripting engine that could be misused by others. Installing Node.JS without following best practices is an open invitation to hackers. This list provides basic steps you can use to make your instance of Node.JS more secure:

-   **Do not run Node.JS as the root user**: Assume that a hacker gains access to your system. Running code as the root user means the hacker has a valuable resource to break everything else down. Instead, run Node.JS with only the rights needed for the specific application in question.

-   **Use strong authentication**: The first line of defense for your application is to ensure that the user is not a hacker. The best practice is to use a tool such as [Okta](https://developer.okta.com/) or [OAuth](https://auth0.com/) for authentication.

-   **Use a reverse proxy**: A [reverse proxy](https://medium.com/intrinsic-blog/why-should-i-use-a-reverse-proxy-if-node-js-is-production-ready-5a079408b2ca) is a specialized kind of web server that makes it possible to do things like limit the number of requests a Node.JS application can receive. Basically, the reverse proxy receives the user request, vets it to ensure the request is valid, and only then passes it to the Node.JS application.

-   **Set package access levels**: One of the reasons to install a package manager like NPM [is to control](https://docs.npmjs.com/cli/v6/commands/npm-access) who can access packages and how they do so. In fact, NPM comes with a [wealth of commands](https://docs.npmjs.com/cli/v6/commands).

-   **Validate user inputs**: Node.JS is vulnerable to [injection-based attacks](https://www.stackhawk.com/blog/nodejs-command-injection-examples-and-prevention/), so it’s essential to verify that the user is sending data, and not an executable script.

-   **Keep secrets secret**: Storing sensitive information like database connection strings and API keys in code is a bad idea. Using a specially configured library like [dotenv](https://www.npmjs.com/package/dotenv) makes it possible to load and store environment variables in a secure manner.

-   **Keep error messages generic**: Error messages such as "Password Invalid" provide too much information. It tells the hacker that the name supplied was valid and reduces the amount of work the hacker must perform to gain access to the system. Use a message like "Invalid Input" instead. This conveys enough information for the user to make a correction without giving too much away.

-   **Add HTTP response headers**: An [HTTP response](https://hackernoon.com/nodejs-security-headers-101-mf9k24zn) header adds security that forces the user’s browser to take various actions. These include relying on strict transport security, displaying content in frames, and preventing Multipurpose Internet Mail Extensions (MIME) type from changing.

-   **Maintain server-side logs and monitor them**: [Server-side logging](https://stackify.com/node-js-logging/) ensures that administrators know what is going on with their servers. Keeping track of every transaction may seem like overkill, but it often surfaces patterns in transactions. These patterns can show if a hacker is interested in your site.

-   **Check code using a security linter**: A [linter](https://www.testim.io/blog/what-is-a-linter-heres-a-definition-and-quick-start-guide/) is an essential tool that helps improve code. A [security linter](https://geekflare.com/nodejs-security-scanner/) specifically looks for security issues in code. A security linter helps locate the vast majority of security issues. There is no guarantee that a hacker won’t find another way in, so use the other methods in this list as well to secure your application.

## Starting, Stopping, and Restarting Node.JS on Ubuntu 22.04

Working with Node.JS is easier when NPM is installed. Here are some useful commands to interact with installed packages:

-   `npm ls`: List the installed packages to determine if you need to install a package before you run it.

-   `npm run-script`: Starts the specified script.

-   `npm start`: Starts the specified package.

-   `npm stop`: Stops the specified package.

-   `npm restart`: Restarts the specified package.

NPM commands are the best way to manage scripts and packages and there are several to help do so.

Should a rogue process not work correctly with NPM or Node.JS, there is a three-stop process to stop it:

1.  List all of the running node processes:

    ```command
    sudo ps -ef | grep node
    ```

1.  Locate the node to be eliminated and obtain its process identifier (PID) from the second column of the following command's output:

    ```command
    ps -ef
    ```

1.  Stop the errant process:

    ```command
    kill -9 <PID>
    ```

    {{< note >}}
    The `-9` is a [kill signal](https://linuxhint.com/kill-signal-numbers-linux/) (with `-15` being the other common, less extreme, kill signal). A listing of the various `kill` commands can be obtained with:

    ```command
    kill -l
    ```
    {{< /note >}}

## Removing Node.JS

To remove the current version of Node.JS (and NPM, if installed), enter the following command:

```command
sudo apt remove -y nodejs
```

{{< note >}}
To remove only the current version of NPM, use the following command:

```command
sudo apt remove -y npm
```
{{< /note >}}

## Conclusion

Node.JS has a lot to offer in running server-side code. When paired with a package manager, it's an unbeatable combination that makes the work of both administrators and developers easier. There are two main considerations for Node.JS use. First, to obtain and install the correct version for a particular need. Second, to then secure the installation in order to keep hackers at bay.