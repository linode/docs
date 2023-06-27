---
slug: install-and-use-the-yarn-package-manager
description: 'This guide will show you how to install and use the Yarn package manager, a great alternative to NPM which you can use to manage your Javascript projects.'
keywords: ['yarn package manager','yarn install','yarn vs npm']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-03
modified_by:
  name: Nathaniel Stickman
title: "Install and Use the Yarn Package Manager"
title_meta: "How to Install and Use the Yarn Package Manager"
external_resources:
- '[Yarn Classic Documentation](https://classic.yarnpkg.com/en/docs)'
authors: ["Nathaniel Stickman"]
---

Yarn is a Node.js package manager used to handle JavaScript project dependencies. It was originally developed to be a more performant alternative to the Node Package Manager (NPM). This guide discusses the differences between Yarn and NPM and shows you how to get started using it.

## Yarn vs NPM

The Yarn package manager uses the NPM registry, so it has access to all of the packages available through NPM. Yarn's commands are also generally similar to NPM's.

Yarn's chief advantage over NPM is its speed. Originally, Yarn was created to address performance and security concerns in NPM. Since then, NPM has made significant changes to address security concerns and even improved its performance. However, Yarn remains faster than NPM.

Yarn's performance advantage makes it especially useful for projects where installation speed is a factor. Large projects can be more quickly set up on new machines, with dependencies installing in a fraction of the time needed by NPM. Projects that require automated installation can make good use of Yarn's performance.

Yarn has also prioritized user-friendliness. Its output tends to be clear and straightforward, in contrast to the often verbose and difficult-to-decipher output from NPM.

Yarn previously had an advantage with its `yarn.lock` file. Yarn creates this file by default when packages are added to a project. The file tracks exact package versions installed and their installation order. This ensures consistent versioning and file structure when installing project dependencies. NPM, however, has recently added its own lock file, `package-lock.json`. It works similarly to Yarn's and brings the two package managers essentially to an even playing field when it comes to lock files.

## How to Install Yarn

1. Follow the steps for installing NPM in our [How to Install and Use Node Package Manager (NPM) on Linux](/docs/guides/install-and-use-npm-on-linux/#how-to-install-npm) guide.

1. Install Yarn using NPM. The `-g` flag has NPM install Yarn as a global package, rather than a project package.

        npm install -g yarn

1. Verify the installation.

        yarn --version

## Install, Remove, and Modify Packages with Yarn

This section shows you how to work with packages using Yarn.

Most of the time, Yarn is used to work with packages for a specific project. You can use the commands below to create a project directory and initialize a Yarn project as an example to follow along within this guide.

Create a new project directory and move into it.

    mkdir ~/example-app
    cd ~/example-app

Initialize the new project using Yarn.

    yarn init

Yarn prompts you for information about the project. You can use the defaults for this example. The result is an initial `package.json` file representing the project. For more on the `package.json`, take a look our [How to Install and Use Node Package Manager (NPM) on Linux](/docs/guides/install-and-use-npm-on-linux/#packagejson) guide.

### How to Install a Package with Yarn

The easiest way to install a package with Yarn is the `add` command followed by the name of the package. This example installs the latest stable version of the TailwindCSS package.

    yarn add tailwindcss

You can, alternatively, specify the exact version of the package you want Yarn to install.

    yarn add tailwindcss@2.2.7

This method also lets you specify a version range. Wrap the version part of the expression in quotations, and precede the version with the relevant comparison operators. You can separate multiple version constraints with spaces.

    yarn add tailwindcss@">2.2.0 <=2.2.7"

The above command installs the latest available version of TailwindCSS that is greater than **2.2.0** and equal to or less than **2.2.7**.

For any of the above commands, Yarn updates the `package.json` file with the package information. This example shows the `package.json` resulting from the version range command:

{{< output >}}
{
  "name": "example-yarn-app",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "tailwindcss": ">2.2.0 <=2.2.7"
  }
}
{{< /output >}}

Finally, if you are trying to install dependencies for an existing project, with its own `package.json`, run the following command in the base directory:

    yarn install

### How to Remove a Package with Yarn

You can uninstall a Yarn package with the `remove` command. Replace the example package with your own package's name.

    yarn remove tailwindcss

As with the `add` command, Yarn updates the `package.json` to reflect the removed package.

{{< output >}}
{
  "name": "example-yarn-app",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {}
}
{{< /output >}}

### How to Update Packages with Yarn

You can use the command below to update all of a project's packages to their latest compatible versions.

    yarn upgrade

The update utilizes the version numbers or ranges listed in your project's `package.json` file. This ensures that the updates do not conflict with your specified package versions for the project.

### Yarn Global

Packages can also be managed at a global level. These packages are not associated with a particular project, so they can be accessed across your system and outside of a project context.

You can install a package globally using the `global` command followed by the `add` command and the name of your package.

    yarn global add tailwindcss@2.2.7

To uninstall a package that you installed globally, likewise use the `global` command followed by the `remove` command.

    yarn global remove tailwindcss

Finally, you can also use the `upgrade` command globally to upgrade all packages to their latest version.

    yarn global upgrade
