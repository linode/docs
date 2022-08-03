---
slug: introduction-to-bun
author:
  name: Linode Community
  email: docs@linode.com
description: "Bun introduces a JavaScript runtime with incredible speed and built-in bundling and transpiling. Bun thus offers simplified tooling and a sharp contender to the reigning Node.js and Deno runtimes. Learn more about Bun here and see how you can get started using it for your JavaScript projects."
og_description: "Bun introduces a JavaScript runtime with incredible speed and built-in bundling and transpiling. Bun thus offers simplified tooling and a sharp contender to the reigning Node.js and Deno runtimes. Learn more about Bun here and see how you can get started using it for your JavaScript projects."
keywords: ['bun javascript','javascript runtime','bun node']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-01
modified_by:
  name: Nathaniel Stickman
title: "Introduction to the Bun JavaScript Runtime"
h1_title: "Introduction to the Bun JavaScript Runtime"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[LogRocker: Bun - The JavaScript Runtime Taking on Node.js and Deno](https://blog.logrocket.com/bun-javascript-runtime-taking-node-js-deno/)'
- '[The New Stack: Meet Bun - A JavaScript Runtime for the Whole Dev Lifecycle](https://thenewstack.io/meet-bun-a-javascript-runtime-for-the-whole-dev-lifecycle/)'
- "[high0verEngineering: Let's Bun! - A New JavaScript Runtime](https://jenil777007.hashnode.dev/lets-bun)"
---

Bun introduces a new JavaScript runtime with exceptional performance, built-in bundling and transpiling, and first-class support for TypeScript and JSX. This up-and-coming tool promises to be an asset for JavaScript developers and a strong competitor to Node.js and Deno.

In this tutorial, learn about the Bun JavaScript runtime and how it compares to other runtimes, like Node.js and Deno. See how to set up Bun on your own system, and follow along to build an example React application with it.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Bun?

[Bun](https://bun.sh/) enters the field of JavaScript runtimes opposite options like Node.js and Deno. The Bun runtime stands out for its speed — it is built on the JavaScriptCore engine and is lightning fast — and its built-in bundling and transpiling features.

These next sections aim to make you more familiar with Bun and what it has to offer. Keep reading to learn more about JavaScript runtimes, about what Bun has to offer, and about how it stacks up against its main competitors.

### What Are JavaScript Runtimes?

First off, JavaScript runtimes are tools that allow you to run JavaScript outside of a browser. With a JavaScript runtime, you can use JavaScript to build things like server, desktop, and mobile applications.

So far, the predominant JavaScript runtime has by far been Node.js. Built on the V8 JavaScript engine behind Google Chrome, Node.js has been the default JavaScript runtime for many developers.

Recently, the creator of Node.js put out a new JavaScript runtime, Deno. The Deno runtime, like Node.js, is built on the V8 JavaScript engine. But Deno introduces numerous fundamental improvements to Node.js — in terms of security, performance, and more. It also adds first-class support for TypeScript and JSX.

### The Bun Runtime

The Bun runtime arose with a fresh approach to JavaScript runtimes. Developed using the Zig programming language, Bun constructs its runtime on the JavaScriptCore engine, used behind the Safari web browser. The result is an incredibly fast runtime.

Additionally, Bun has built-in handling for bundling and transpiling. With other runtimes, you need to rely on outside tools for bundling your JavaScript projects and for transpiling code from one language into JavaScript. Bun handles all of these features.

Bun's runtime implements the Node.js algorithm for resolving modules, meaning that Bun can make use of NPM packages as well. Bun's bundler can find and install packages from the vast NPM repository and manage their dependencies, give you a full-featured and seamless bundler.

And finally, like Deno, Bun comes with first-class support for the TypeScript and JSX languages.

### Bun vs Node.js and Deno

Bun offers some of the same advantages over Node.js as Deno. It includes first-class support for TypeScript and JSX and offers performance and quality-of-life improvements.

But the Bun runtime also aims to exceed Deno itself in terms of performance. Bun's use of the JavaScriptCore engine has allowed Bun to achieve immense speed gains in its execution of JavaScript programs.

With Bun, you also get simplified tooling. Bun includes transpiling and bundling features, which keeps you from having to adopt and maintain separate tools for those tasks.

## How to Install Bun

Before proceeding, make sure that your Linux system uses a version supported by Bun. Currently, Bun runs on systems using at least version 5.1 of the Linux kernel (though it prefers 5.6).

You can check your kernel version with the command:

    uname -r

On a CentOS Stream 9 system, for instance, you could expect an output like the following:

{{< output >}}
5.14.0-80.el9.x86_64
{{< /output >}}

For reference, here are versions of some popular Linux distributions that use at least version 5.1 of the Linux kernel:

- CentOS Stream 9 or newer

- Debian 11 or newer

- Fedora 34 or newer

- Ubuntu 20.04 or newer

Bun can be installed using an installation script. The command below accesses the script and runs it in your shell session:

    curl https://bun.sh/install | bash

The Bun installation script requires that you have Unzip installed on your system. You can install Unzip using one of the following commands:

- On Debian and Ubuntu systems, use:

        sudo apt install unzip

- On CentOS, Fedora, and similar systems, use:

        sudo dnf install unzip

Once finished, the Bun installation script displays a success message.

{{< output >}}
bun was installed successfully to /home/example-user/.bun/bin/bun
[...]
{{< /output >}}

The script may also inform you to add two lines to your `.bashrc` file. You can quickly do so using the following commands:

    echo 'export BUN_INSTALL="/home/example-user/.bun"' >> ~/.bashrc
    echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc

Restart your shell session by exiting and reentering it, and you are finally ready to start using Bun. At this point you can verify your installation by checking the Bun version:

    bun -v

{{< output >}}
0.1.5
{{< /output >}}

## Example of a Bun Project

Like NPM, Bun can be used to create and manage application projects. To give you an idea of Bun's capabilities, this next series of steps walks you through creating and running a React application with Bun.

The example adds to the base React template a simple analog clock widget, which lets you see more of how Bun manages project dependencies.

1. Create a new Bun project. This is done by giving the `bun create` command with a template name and project folder.

    You can get a list of some useful available templates by running the `create` command without any arguments:

        bun create

    For this example, create your project from the React template, and give the project a directory of `example-react-app`, like this:

        bun create react ./example-react-app

    Afterward, be sure to change into the new project directory. The rest of these steps assume you are working out of this directory:

        cd example-react-app

1. This already gives you a working React application. You can see the application in action by navigating to `localhost:3000` in your browser.

    To see the application remotely, you can use an SSH tunnel.

    - On Windows, use the PuTTY tool to set up your SSH tunnel. Follow the appropriate section of the [Setting up an SSH Tunnel with Your Linode for Safe Browsing](/docs/guides/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing/#windows) guide, replacing the example port number there with `3000`.

    - On macOS or Linux, use the following command to set up the SSH tunnel. Replace `example-user` with your username on the application server and `192.0.2.0` with the server's IP address:

            ssh -L3000:localhost:3000 example-user@192.0.2.0

    ![Default React application](example-app-default.png)

    Use the *Ctrl* + *C* key combination to stop Bun when you are finished using the application.

1. Add an NPM package to your project. You can do so using the `bun add` command followed by the package name.

    This example uses the `react-clock` package, which allows you to easily render an analog clock for your React application:

        bun add react-clock

1. Modify the `src/App.jsx` file to incorporate the `react-clock`. This file is the basis for the default React application. Below, you can see an example of relatively simple modifications to this file to incorporate the `react-clock`. Spots that have been modified have been prefaced with explanatory comments:

    {{< file "src/App.jsx" jsx >}}
import logo from "./logo.svg";
import "./App.css";

// Import React modules to be used by react-clock.
import React, { useEffect, useState } from 'react';

// Import react-clock and its CSS file.
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

function App() {
    // Define a state variable for the clock value; initialize it with the
    // current date-time.
    const [clockValue, setValue] = useState(new Date());

    // Define an effect that updates the clock's value periodically.
    useEffect(() => {
        const clockInterval = setInterval(() => setValue(new Date()), 1000);

        return () => {
            clearInterval(clockInterval);
        };
    }, []);

    // Add to the default layout a <Clock/> tag for rendering the clock;
    // give it the clockValue to display.
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h3>Welcome to React!</h3>
                <Clock value={clockValue} />
            </header>
        </div>
    );
}

export default App;
    {{< /file >}}

1. Start up the application with Bun again:

        bun dev

    Once again, you should be able to visit the project by navigating to `localhost:3000` in a web browser. And now you should see the default application modified with an analog clock.

    ![React application with an analog clock](example-app-clock.png)

## Conclusion

Now that you have a footing with the Bun runtime, you can start exploring and seeing all that it has to offer. With its built-in bundling and transpiling, you can create and execute projects with a simpler tooling, and you get the benefits of Bun's incredible performance.

Keep learning about Bun through the links below, as well as through the [official documentation](https://github.com/oven-sh/bun#Reference).

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.

