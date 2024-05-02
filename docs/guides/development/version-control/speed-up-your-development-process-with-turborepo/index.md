---
slug: speed-up-your-development-process-with-turborepo
title: "Speed up Your Development Process with Turborepo"
description: "Learn about Turborepo, the high-performance build system for JavaScript and TypeScript. Discover how it can help speed up your development process."
authors: ["John Mueller"]
contributors: ["John Mueller"]
published: 2023-06-27
modified: 2024-05-02
keywords: ['turborepo speeds up development process','monorepo','multirepo','remote scaling','polyrepo']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[npm Docs: npm-prune](https://docs.npmjs.com/cli/v8/commands/npm-prune)'
- '[Turbo Repo Docs](https://turbo.build/repo/docs)'
---

A *monorepo* is a powerful method of using a single version-controlled repository to interact with multiple distinct projects that have well-defined associations. In most cases, these projects are logically independent and managed by different teams. For example, Google, Microsoft, Facebook, and Twitter are companies that use immense code repositories, in the terabyte range, to manage their projects. Turborepo is a product that makes it easier to implement a monorepo when working with JavaScript and TypeScript.

## Working with a Monorepo

Monorepos are currently one of the most popular tools available for managing multiple projects under a single umbrella. This means that a code change is reflected in every project that uses that code, rather than having to be replicated. Web developers especially like using monorepos because they usually have to manage a large number of projects.

### What is a monorepo?

A monorepo, sometimes called a monolithic repository (not to be confused with monolithic architecture), is the opposite of a multirepo. A *multirepo* reflects a method of placing each project in its own repository. A monorepo reflects a coordinated effort where code only appears once in a repository, but can be used by everyone.

Moving from a multirepo to a monorepo can be difficult. It requires code consolidation, followed by refactoring, to ensure all of the code points to the right place. The results are worth the effort in most cases because a monorepo provides these, and other, benefits:

-   Everyone can see everyone else’s code. This makes it possible for a member of one team to fix another team’s code before they even know there's a problem.
-   Sharing dependencies becomes trivial, reducing the need for an advanced package manager.
-   The number of versioning conflicts is reduced because there is a single "source of truth".
-   The code itself is far more consistent, which reduces the time required to understand what it does.
-   All of the teams using the repository can coordinate their efforts, creating a single timeline for updates.

There are times when a monorepo works well. You want to use a monorepo under the following conditions:

-   The projects have a lot of scripts that are dependent on each other. This allows a single change to affect all of the projects requiring that change. However, this feature can also backfire because a broken main/master affects everyone’s projects, not just one.
-   It’s possible to execute tasks in parallel so that the build process can proceed in an efficient manner. A monorepo can experience performance issues when some commands take too long to execute; parallel execution partly overcomes this issue.
-   The projects can support incremental builds, so that only the files with changes are rebuilt.
-   There is a strong data management process in place because monorepos can quickly become immense.
-   All of the projects support a uniform linting configuration to look for patterns that cause problems in the source code.
-   Caching the build steps doesn’t cause problems, which means using remote caching instead of local caching.

### Comparing a Monorepo to a Multirepo

A *multirepo* is also called a *polyrepo*, so you may encounter both terms in your development journey. No matter what you call it, both terms refer to using multiple code repositories to manage projects. When choosing between a monorepo and a multirepo consider that the multirepo generally has a reduced learning curve.

There are two other major issues to consider when working with a monorepo instead of a multirepo. The first is ownership. Sometimes you need to set permissions to ensure that code is only modified by authorized people. For example, when working with code that is affected by legal considerations. The second is code reviews. This process can become chaotic when working with a monorepo, and development teams may get bogged down with notifications.

## Understand the Turborepo Advantage

The advantages of a monorepo usually outweigh the disadvantages for certain types of projects. This is why larger organizations choose to use the monorepo approach. However, you can create a monorepo from scratch using a tool like NPM, PNPM, or Yarn. Unfortunately, these tools don’t scale well, but Turborepo helps overcome such issues. The following sections provide insights into why Turborepo may be the optimal solution for an organization.

### Allow Your Monorepo to Scale

The problem with a monorepo is that it doesn’t scale well in many situations. This is because each workspace has its own testing, linting, and build process. This means that a monorepo could end up executing hundreds of tasks during each deployment and integration. Turborepo solves this problem by supporting remote caching, so that the Continuous Integration (CI) process never performs the same work twice.

### Keep Things Moving with Task Scheduling

In this case, there are two levels of interaction with Turborepo. First, it ensures that each task occurs in the right order, and at the right time. Trying to keep track of all the various projects in a monorepo can prove difficult, time consuming, and error-prone. Efficiently performing tasks in the right order can be hard. Second, Turborepo can bypass time-consuming tasks by using parallel processing. When working with a monorepo in a manually configured environment, many organizations perform one task at a time. This means that resources go unused, leading to inefficiencies.

### Get Rid of Overgrowth with Pruning

The problem with many containers like Docker is that a single change can cause a rebuild and redeployment of all the packages in an application. Turborepo works with the root lockfile to generate a pruned subset, with only the packages necessary to update a given target. This process ensures that packages are only rebuilt and deployed when necessary. [The `turbo prune --scope` command](https://turbo.build/repo/docs/reference/command-line-reference#turbo-prune---scopetarget) creates a sparse lockfile with only the elements that have changed and need updated. You can target specific packages to determine if and when they need rebuilding and redeployment.

### Include Support for Multirepo

In most environments, you must choose between a monorepo and a multirepo. It's too complex to maintain a mixed environment in order to get benefits of both. However, Turborepo can support a mixed environment if necessary. In this case, the main contribution from Turborepo is the caching, which reduces the amount of work needed to keep everything in sync. Of course, you need a really good business case for maintaining a mixed environment because it’s still a lot of work. One situation that may require a mixed environment is if you have projects that must keep data safe in a particular way. For example, projects that support the Health Insurance Portability and Accountability Act of 1996 (HIPAA) requirements. A project of this sort needs some of the cached code, but could also contain code that you must maintain in a separate repository.

### What Turborepo Doesn't Do

Turborepo doesn’t install packages. This final piece of the puzzle is left to tools like NPM, PNPM, or Yarn. What Turborepo does is ensure that the package installers work efficiently by limiting them strictly to what they do best, install packages.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Follow the instructions in our guide [Installing and Using NVM (Node Version Manager)](/docs/guides/how-to-install-use-node-version-manager-nvm/) to install NVM, Node.js, and NPM.

1.  You should also be familiar with Git, and have access to a remote repository on GitHub, GitLab, Bitbucket, or other compatible platform. See our [Getting Started with Git](/docs/guides/how-to-configure-git/) guide to learn more about Git.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Get Your Own Copy of Turborepo

If you followed the prerequisites above, you should have a Linode compute instance with NVM, Node.js, and NPM installed. You can now install Turborepo. Use `npm` to install it globally, which allows use of Turborepo on any project:

```command
npm install turbo --global
```

You should see a few messages telling you about the installation progress.

## Develop a Basic TypeScript Example

Having NPM and Turborepo installed means you can create a small test application. The following steps tell you how.

1.  Create a directory for the test application repository and change into it

    ```command
    mkdir testApp
    cd testApp
    ```

1.  Create a remote repository:

    ```command
    git init
    ```

1.  Enter the following commands to add a readme file to the repository:

    ```command
    echo "# Test Application" >> README.md
    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"
    git add . && git commit -m "Initial commit"
    ```

1.  Change the remote repository location, replacing `<Git-Repository-URL>` with a working remote git address, such as `https://github.com/example-username>/example-repository.git`:

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

1.  Install TypeScript in a manner that allows a developer to use it, without it being installed as part of the application:

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

1.  Change back into the main `testApp` directory and open the `package.json` file created earlier::

    ```command
    cd ..
    nano package.json
    ```

1.  Modify the file to as highlighted below, paying particular attention to the addition of the comma at the end of line seven:

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

Using a monorepo in place of a multirepo can save considerable time, money, and frustration. Especially when managing multiple projects that rely on common code and have long testing, linting, and build processes to consider. It helps to make things consistent and centralizes the efforts of everyone in an organization. There are also downsides, however, most notably scalability. Turborepo doesn’t try to replace tools like NPM, PNPM, or Yarn. Instead, it augments them and simplifies the techniques required to use them. Turborepo can provide a significant benefit to your organization, especially as the number and size of your projects grow.