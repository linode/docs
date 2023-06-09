---
slug: yarn-vs-npm
title: "Yarn vs. NPM: Which One is Right for You?"
title_meta: "What’s the Difference Between Yarn and NPM?"
description: 'When comparing Yarn vs. NPM, each differs in terms of security, speed and more. Read our guide to find out whether Yarn or NPM is right for you. ✓ Click here!'
keywords: ['yarn vs npm','what is yarn','yarn npm','yarn or npm','difference between yarn and npm','what is yarn npm','why use yarn over npm','yarn add vs npm install','what does yarn do','yarn install vs npm install']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["John Mueller"]
published: 2023-06-08
modified_by:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

[Yarn (Yet Another Resource Negotiator)](https://classic.yarnpkg.com/lang/en/) and [NPM (Node Package Manager)](https://www.npmjs.com/) are both package managers used with [Node.JS](https://nodejs.org/en/). Both provide Node.JS support in running JavaScript code outside of a browser, as is often the case when creating and maintaining server-side applications. Package managers are used to install, remove, update, and manage [libraries (groups of modules) and packages (compiled libraries)](https://www.techighness.com/post/javascript-difference-between-module-library-package-api-sdk-framework-app/). They also handle the dependencies these pieces of software rely upon to function. A package consists of these items:

-   Source Code
-   Pre-Built Binaries
-   Scripts
-   Metadata

Project dependencies have become more complex as the Internet has matured, so a package manager is needed to configure project settings. This guide details the differences between Yarn and NPM, and when to use one over the other. It also covers command differences, such as the `yarn add` versus `npm install` commands.

## What is NPM?

NPM was released in January of 2010 as a means to manage complex projects. The original version contained numerous security holes, partly because no one knew what security issues web applications faced at the time. This guide applies to NPM versions beyond the May 2017 v5.0 release that fixed many of the earlier issues. An NPM setup consists of:

-   A [website](https://www.npmjs.com/) that manages various aspects of the NPM experience.
-   A [registry](https://docs.npmjs.com/cli/v8/using-npm/registry) to access the vast array of public JavaScript software.
-   The Command Line Interface (CLI) to interact with NPM using the terminal.

NPM is optionally available as a [Pro](https://www.npmjs.com/products/pro) or a [Teams](https://www.npmjs.com/products/teams) version. Both are designed to provide additional functionality beyond mere package management. However, since Yarn doesn’t provide these additional levels of support, this guide focuses on the basic version of NPM.

## What is Yarn?

Yarn was originally introduced as a replacement for NPM by Facebook in October of 2016. It's goal was to overcome deficiencies in the NPM package, such as version locking. Since then, the NPM developers have dealt with most of these shortcomings. In fact, Yarn and NPM developers constantly take ideas from each other. In many respects, the differences between Yarn and NPM are fewer from a functional perspective. As far as popularity, [statistically](https://npmtrends.com/npm-vs-yarn) there are more NPM downloads than Yarn downloads.

Yarn 1.0 is meant as a drop-in replacement for NPM, and the two are quite compatible. While version 2.0 is available, many see it as a [curse](https://njbmartin.medium.com/whats-the-problem-with-yarn-2-ca59e3fabc9f) rather than a gift. Some developers refuse to use it because it doesn’t interact well with Version 1.0, causing significant breaking changes to deal with. Other developers have fallen in love with features like Plug’n’Play and Zero-Installs, and consider the loss of compatibility worth the new features. In fact, the 2.0 version is cited as why most developers use Yarn over NPM.

While most developers use NPM to install Yarn, the [Yarn development team](https://yarnpkg.com/getting-started/install) prefers using [Corepack](https://nodejs.org/dist/latest/docs/api/corepack.html) to install Yarn 2.0 as it provides additional flexibility. However, Corepack is still in the experimental stage, so some developers avoid it.

## A Side By Side Comparison

Yarn and NPM are both capable, but in different ways. Consequently, they're often used in tandem for some types of [product installations](/docs/guides/install-canvas-lms-on-ubuntu-2204/). This gives developers access to the best features of both. The table below provides a quick side-by-side comparison of their major features:

| Feature | Yarn | NPM |
| -- | -- | -- |
| **Dependency Installation** | Parallel | Sequentially |
| **Version Lock File** | `yarn.lock` | `package-lock.json` |
| **Package Data Transfer Encryption** | Checksum | Secure Hash Algorithm, 512-bit (SHA-512) |
| **Package Auditing** | No | Yes (`npm audit`) |
| **License Checking** | [Yes](https://yarnpkg.com/package/license-checker) (Automatically) | Yes* (`npm install -g `[`license-checker`](https://www.npmjs.com/package/license-checker)) |
| **License Listing** | Yes ([`yarn licenses list`](https://classic.yarnpkg.com/lang/en/docs/cli/licenses/)) | Yes* (`npm install -g `[`license-report`](https://www.npmjs.com/package/license-report)) |
| **Installation Logs** | Yes | Yes |
| **Interactive Mode** | Yes ([`yarn upgrade-interactive`](https://classic.yarnpkg.com/lang/en/docs/cli/upgrade-interactive/)) | Yes (`node`, using [Read-Eval-Print Loop (REPL)](https://www.oreilly.com/library/view/learning-node-2nd/9781491943113/ch04.html)) |
| **CLI** | [Moderate](https://classic.yarnpkg.com/en/docs/cli/) (`-h`) | [Extensive](https://nodejs.org/api/cli.html) (`-h`) |
| **Environment Variables** | [Few](https://classic.yarnpkg.com/lang/en/docs/envvars/) | [Moderate](https://nodejs.org/api/cli.html#environment-variables) |
| **Version Management / Multiple Version Access** | Yes** (`yarn set version`) | Yes*** |
| **Remote Script Execution** | Yes**** (`yarn dlx`) | Yes ([`npx`](https://nodejs.dev/en/learn/the-npx-nodejs-package-runner)) |
| **Product Installation Size** | Larger | Smaller |

*Installed Separately

**Requires Corepack Installation

***Requires [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm)

****Only available in Yarn v2.0 and up

### Considering Special Yarn Workflow Features, Plug’n’Play, and Zero-Installs

Both [Plug’n’Play](https://yarnpkg.com/features/pnp) and [Zero-Installs](https://yarnpkg.com/features/zero-installs) require Yarn 2.0 or above. This is an important issue to consider with products that require an older version of Yarn, but not when working on your own projects.

Plug’n’Play overcomes the `node_modules` directory problem, which comes down to a matter of efficiency. Because of the manner in which Node processes files, it takes a lot of time to load dependencies, and the `node_modules` directory is huge. Consequently, it can take up to 70 percent of the installation time to generate the `nodes_modules` directory. Yarn takes control of managing the dependencies, placing them in a single `.pnp.cjs` file, instead of relying on the entire directory.

Zero-Installs is a method of gaining stability that using lock files alone can’t provide. In addition to the lock files' reproducibility, Zero-Installs improve reliability and enhances efficiency. It also reduces the size of the cache from the `node_modules` directory by a significant amount. This makes it possible to upload the cache to places like GitHub. To obtain this functionality, ensure that your project is using Plug’n’Play and meets a number of other criteria. These include ensuring the package cache appears in the `.yarn/cache` folder and that the folder also contains the `.pnp.cjs` file. In addition, add a Continuous Integration (CI) step using the `yarn install --check-cache` command to ensure the project remains secure. While using Zero-Installs does have significant benefits, it comes at the cost of compatibility with any existing Node setups. There's also the potential for security issues, unless you proactively perform the correct steps.

Fortunately, newer versions of Yarn help to overcome some compatibility issues. For example, to transition a `package-lock.json` to a `yarn.lock` file, type `yarn import` in the directory containing the `package-lock.json` and press <kbd>Enter</kbd>. Yarn automatically creates an equivalent `yarn.lock` file. While NPM doesn’t provide an equivalent feature, v7.0 and above include a special feature for [automatic handling](https://blog.npmjs.org/post/621733939456933888/npm-v7-series-why-keep-package-lockjson.html) of `yarn.lock` files.

### Comparing Yarn and NPM commands

Developers have to overcome several issues when working with any software that has a CLI. One is remembering which commands to use, especially using multiple similar products. While developers often choose exclusively between Yarn or NPM, that is not always the case in practice. It’s important to know where differences and similarities lie. The commands in this list are precisely the same whether you use Yarn or NPM:

-   `init`: Create a new package
-   `run`: Run a script
-   `test`: Test a package
-   `publish`: Publish a package
-   `cache clean`: Remove all data from the cache folder

Because differentiation is important to vendors, some commands that serve the same purpose for both products are different, such as `yarn add` and `npm install`. Here's a list command that differ between Yarn and NPM:

-   **Install Dependencies**: `npm install` | `yarn`
-   **Install Package**: `npm install` | `yarn add`
-   **Uninstall Package**: `npm uninstall` | `yarn remove`
-   **Update Dependencies**: `npm update` | `yarn upgrade`

### Executing lifecycle scripts

Both Yarn and NPM support lifecycle scripts as found in the `package.json` file. A lifecycle script eases a developer’s workflow by automating repetitive tasks. When working with Yarn 1.0, lifecycle scripts are executed precisely the same as with NPM. The difference between Yarn and NPM comes with the handling of `pre` and `post` hooks in Yarn 2.0. For example, a script might specify a `prebuild` action, a `build` action, and a `postbuild` action, so it’s important to execute them in order.

In NPM, you can execute arbitrary and built-in scripts specified in the scripts field of the `package.json` file using `pre` and `post` actions. Yarn 2.0 and above does not support the automatic execution of these scripts. It can cause confusion and produce odd results, such as running opposing actions at the same time. It doesn’t support the `prestart` action, for example. Yarn 2.0 also doesn’t support arbitrary `pre` and `post` commands for user-specified scripts. The goal is to ensure that scripts are run explicitly, rather than implicitly. However, the difference can also cause compatibility problems between Yarn and NPM.

## Yarn vs. NPM: Which One Should You Use?

Initially, Yarn offered more security and speed over NPM. However, the latest versions of both products are nearly equivalent in both areas, even though each product implements these features differently. When looking for a product, basing your choice exclusively on security and speed depends on how the product implements these features. Yarn definitely has an edge in speed. Although the auditing features of NPM put it slightly ahead in security, it still suffers from its less useful security features from the past.

Both products also support workspaces. A *workspace* is a method of creating a single repository (monorepo) containing the apps, tools, and configurations of multiple projects (or project components across multiple projects). This provides a single, top-level root package that supports multiple child packages. Each of these child packages is its own workspace.

Here is how to decide between Yarn and NPM:

Choose Yarn when:

-   speed is an issue for larger projects.
-   creating a new project.
-   you need access to specialized Yarn functionality (e.g. Plug’n’Play and Zero-Installs).
-   there is a need to avoid potential security issues from an older Node package.
-   simplicity is a key issue for your development team.
-   easy to read reports are important.

Choose NPM when:

-   the current workflow is working well.
-   upgrading an existing project.
-   a project requires enhanced team development features.
-   you don’t want to maintain separate tools, as you need to install an installer for Yarn.
-   disk space can become a problem.
-   your development team needs additional management flexibility and functionality.
-   detailed reports are important.

## Conclusion

The most important takeaway from this comparison is that neither product is better than the other in every respect. You must look at the functionality of Yarn versus NPM specific to your project. Yarn strives to make tasks easy, data readable, and usage simple, all while performing tasks quickly. NPM tends to provide more flexibility, added functionality, and consistency with previous versions of Node.