---
slug: speed-up-your-development-process-with-turborepo
title: "Speed up Your Development Process with Turborepo"
description: 'Two to three sentences describing your guide.'
keywords: ['turborepo speeds up development process','monorepo','multirepo','remote scaling','polyrepo']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["John Mueller"]
published: 2023-06-27
modified_by:
  name: Linode
external_resources:
- '[npm Docs: npm-prune](https://docs.npmjs.com/cli/v8/commands/npm-prune)'
- '[Turbo Repo Docs](https://turbo.build/repo/docs)'
---

A *monorepo* is a powerful method of using a single version-controlled repository to interact with multiple distinct projects that have well-defined associations. These projects are logically independent and managed by different teams in most cases. Google, Microsoft, Facebook, and Twitter are just four companies that use immense code repositories, in the TB range, to manage their projects. Turborepo is a product that makes it easier to implement a monorepo when working with JavaScript and TypeScript.

## Working with a Monorepo

Monorepos are one of the hottest tools available now for managing multiple projects under a single umbrella so that a code change is reflected in every project that uses that code, rather than having to be replicated. Web developers especially like using monorepos because they usually have to manage a large number of projects.

### What is a monorepo?

A monorepo, sometimes called a monolithic repository (not to be confused with a monolithic architecture), is the opposite of a multirepo. Whereas a *multirepo* reflects a method of placing each project in its own repository, a monorepo reflects a coordinated effort where code only appears once in a repository, but can be used by everyone. Moving from a multirepo to a monorepo can be difficult because it requires code consolidation, followed by refactoring to ensure all of the code points to the right place. The results are worth the effort in most cases because a monorepo provides these, and other, benefits:

-   Everyone can see everyone else’s code so it’s possible that a member of one team is able to fix another team’s code before the other team knows there is a problem.
-   Sharing dependencies becomes trivial, reducing the need for an advanced package manager.
-   The number of versioning conflicts is reduced because there is a single source of truth.
-   The code itself is far more consistent, which reduces the time required to understand what it does.
-   All of the teams involved with using the repository can coordinate their efforts, creating a single timeline for updates.

There are times when a monorepo works well and others when it doesn’t. You want to use a monorepo under the following conditions:

-   The projects have a lot of scripts that are dependent on each other, which allows a single change to affect all of the projects that require that change. However, this feature can also backfire because a broken main/master affects everyone’s projects, not just one.
-   It’s possible to execute tasks in parallel so that the build process can proceed in an efficient manner. A monorepo can experience performance issues when some commands take too long to execute; parallel execution partly overcomes this issue.
-   The projects can support incremental builds, so that only the files that have changes are rebuilt.
-   There is a strong data management process in place because monorepos can quickly become immense.
-   All of the projects support a uniform linting configuration to look for patterns that cause problems in the source code.
-   Caching the build steps doesn’t cause problems, which means using remote caching instead of local caching.

### Comparing a Monorepo to a Multirepo

A *multirepo* is also called a *polyrepo*, so you may encounter both terms in your development journey. No matter what you call them, both terms refer to using multiple code repositories to manage projects. One of the most important things to consider when choosing between a monorepo and a multirepo is that the multirepo generally has a reduced learning curve, so you spend less time getting up to speed.

There are two other major issues to consider when working with a monorepo instead of a multirepo. The first is ownership. Sometimes you need some type of permissions setup to ensure that some types of code are only modified by people who know how to make the required modification, such as when working with code that is affected by legal considerations. The second is code reviews. The process can become quite noisy when working with a monorepo and your development teams may get bogged down with notifications.

## Understand the Turborepo Advantage

Usually the advantages of a monorepo outweigh the disadvantages for the types of projects that most organizations support. This is why larger organizations choose to use the monorepo approach. However, you can create a monorepo from scratch using a tool like npm, pnpm, or yarn. The problems with these tools are that they don’t do things like scale well and Turborepo helps overcome these issues. The following sections provide insights into why Turborepo may be an optimal solution for an organization.

### Allow Your Monorepo to Scale

The problem with a monorepo is that it doesn’t scale well in many situations because each workspace has its own testing, linting, and build process. This means that a monorepo could end up executing hundreds of tasks during each deployment and integration. Turborepo solves this problem by supporting remote caching so that the Continuous Integration (CI) process never performs the same work twice.

### Keep Things Moving with Task Scheduling

There are two levels of interaction with Turborepo in this case. The first is that it ensures that each task occurs in the right order and at the right time. Trying to keep all of the various projects in a monorepo straight can prove difficult, time consuming, and error prone. When performing the tasks in the right order, doing so efficiently can be hard. The second level of interaction is the use of parallel processing. By using parallel processing techniques, Turborepo can bypass time-consuming tasks. When working with a monorepo in a manually configured environment, many organizations perform one task at a time, which means that resources go unused, leading to inefficiencies.

### Get Rid of Overgrowth with Pruning

A problem with many containers like Docker is that a single change can cause a rebuild and redeployment of all of the packages in an application. Turborepo works with the root lockfile to generate a pruned subset with only the packages necessary to update a given target. This process ensures that packages are only rebuilt and deployed when necessary. [The `turbo prune --scope` command](https://turbo.build/repo/docs/reference/command-line-reference#turbo-prune---scopetarget) creates a sparse lockfile with only the elements that have changed and need update. You can target specific packages to determine if and when they need rebuilding and redeployment.

### Include Support for Multirepo

When working in most environments, you must choose between a monorepo and a multirepo–it's too complex to maintain a mixed environment to get benefits of both. When working with Turborepo, you can support a mixed environment if necessary. The main contribution from Turborepo in this case is the caching, which reduces the amount of work needed to keep everything in sync. Of course, you need a really good business case for maintaining a mixed environment because it’s still a lot of work. One situation that may require a mixed environment is if you have projects that have to keep data safe in a particular way, such as those that support the Health Insurance Portability and Accountability Act of 1996 (HIPAA) requirements. A project of this sort needs some of the cached code, but could also contain code that you must maintain in a separate repository.

### What Turborepo Doesn't Do

Turborepo doesn’t install packages. This final piece of the puzzle is left to tools like npm, pnpm, or yarn. What Turborepo does is ensure that the package installers work efficiently by limiting them strictly to what they do best, install packages.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Working with Node.js on a Linode

Before you can work with Turborepo, you need one of the package managers that it supports installed on your system. For the purposes of discussion, the upcoming sections rely on Node.js, which uses npm. The following steps help you install [Node.js](https://nodejs.org/) on an Ubuntu 22.04 LTS system.

1.  First, ensure your system is up-to-date:

    ```command
    sudo apt update
    ```

    You may see a number of available system updates.

1.  Perform any required package upgrades.

    ```command
    sudo apt -y upgrade
    ```

    If requires, reboot your system or restart services for the changes take effect.

1.  Install Node.js on your system:

    ```command
    sudo apt -y install nodejs
    ```

1.  Verify the Node.js installation by checking the installed version number:

    ```command
    node -v
    ```

    The output displays the installed version of Node.js, for example:

    ```output
    v12.22.9
    ```

    This information is important as you may later find that you need a different version of Node.JS to perform a particular task. Turborepo for instance requires Node.js version 14.17 or higher, meaning it must be updated.

1.  First, install the [Node Package Manager (NPM)](https://www.npmjs.com/), which provides additional flexibility for Node.JS management:

    ```command
    sudo apt -y install npm
    ```

1.  Verify the NPM installation by checking the installed version number:

    ```command
    npm -v
    ```

    ```output
    8.5.1
    ```

1.  Follow the instructions in our guide [Update Node.js on Linux, macOS, and Windows](/docs/guides/how-to-update-nodejs) to update your version of Node.js.

## Get Your Own Copy of Turborepo

Now that you have a package manager to work with, you can install Turborepo. To do so, enter the following command:

```command
npm install turbo --global
```

You see a few messages telling you about the installation progress. This step performs a global install, which allows use of Turborepo on any project.

## Develop a Basic TypeScript Example

Having npm and Turborepo installed means you can do something interesting, like create a small test application. The following steps tell you how:

1.  Create a repository directory for the test application and change into it

    ```command
    mkdir testApp
    cd testApp
    ```

1.  Create a remote repository:

    ```command
    git init
    ```

    Note that this step provides you with a location on the drive that is your remote repository URL that you use in later steps.

1.  Enter the following commands to add a readme file to the repository:

    ```command
    echo "# Test Application" >> README.md
    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"
    git add . && git commit -m "Initial commit"
    ```

1.  Change the remote repository location, replacing `<Git-Repository-URL>` with a working git address, such as `https://github.com/example-username>/example-repository.git`:

    ```command
    git remote add origin <Git-Repository-URL>
    ```

1.  Create the Git master branch:

    ```command
    git push -u origin master
    ```

1.  Initialize the project:

    ```command
    npm init -y
    ```

    This step creates a `package.json` file that is echoed on the display:

    ```output
    Wrote to /home/example-user/testApp/package.json:

    {
      "name": "testapp",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "repository": {
        "type": "git",
        "url": "git+https://github.com/example-user/turborepo.git"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "bugs": {
        "url": "https://github.com/example-user/turborepo/issues"
      },
      "homepage": "https://github.com/example-user/turborepo#readme"
    }
    ```

1.  Create a .gitignore file that describes which modules to ignore:

    ```command
    echo "node_modules" >> .gitignore
    ```

    In this case, the entry simply makes the process of creating the test application easier.

1.  Install TypeScript in a manner that allows a developer to use TypeScript, but that TypeScript isn’t installed as part of the user application:

    ```command
    npm install --save-dev typescript
    ```

1.  To compile the TypeScript application, you need to create a `tsconfig.json` file:

    ```command
    nano tsconfig.json
    ```

1.  Enter the following code into the `tsconfig.json` file:

    ```file {title="tsconfig.json" lang="typescript"}
    {
      "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "declaration": true,
        "outDir": "./lib",
        "strict": true
      },
      "include": ["src"],
      "exclude": ["node_modules", "**/__tests__/*"]
    }
    ```

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Create a source code directory, then access that directory:

    ```command
    mkdir src
    cd src
    ```

1.  Create an `index.ts` file:

    ```command
    nano index.ts
    ```

1.  Give it the contents shown below:

    ```file {title="index.ts"}
    var message:string = "Hello World"
    console.log(message)
    ```

1.  When done, save the file and exit `nano` as above.

1.  Change back into the main `testApp` directory:

    ```command
    cd ..
    ```

1.  Open the `package.json` file you created earlier:

    ```command
    nano package.json
    ```

1.  Modify the file to contain a script action to build the application as highlighted below (pay particular attention to the addition of the comma at the end of line 7):

    ```file {title="package.json" linenostart="6" hl_lines="2,3"}
     "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build" : "tsc"
      },
    ```

1.  When done, save the file and exit `nano`.

1.  Build the application:

    ```command
    npm run build
    ```

    The application should compile as expected:

    ```output
    > testapp@1.0.0 build
    > tsc
    ```

1.  View the JavaScript output created during the build process:

    ```command
    cat lib/index.js
    ```

    ```output
    "use strict";
    var message = "Hello World";
    console.log(message);
    ```

## Conclusion

Using a monorepo in place of a multirepo saves considerable time, money, and frustration when you need to manage multiple projects that rely on some amount of the same code and you have a long testing, linting, and build process to consider. What it comes down to is making things consistent and centralizing the efforts of everyone in an organization. There are also downsides, most notably scalability. Turborepo doesn’t try to replace tools like npm, pnpm, or yarn. What it does is augment them and simplify the techniques required to use them. This is the reason why Turborepo can provide a significant benefit to your organization, especially as the number and size of your projects grow.