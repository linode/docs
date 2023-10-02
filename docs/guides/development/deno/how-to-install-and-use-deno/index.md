---
slug: how-to-install-and-use-deno
title: "Install and Use the Deno Javascript Runtime (Node.js Alternative)"
description: 'This guide introduces the Deno JavaScript runtime and compares it to Node.js. It also explains how to install and use Deno.'
keywords: ['what is Deno', 'Deno vs Node.js', 'install Deno', 'how to use Deno']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
published: 2023-08-29
modified_by:
  name: Linode
external_resources:
- '[Deno website](https://deno.land/)'
- '[Deno documentation](https://deno.land/manual@v1.29.1/introduction)'
- '[Deno installation](https://deno.land/manual@v1.29.1/getting_started/installation)'
- '[Deno permissions](https://deno.land/manual@v1.29.1/basics/permissions)'
- '[Sample Deno programs](https://deno.land/manual@v1.29.1/examples)'
- '[Deno Standard Modules](https://deno.land/std@0.170.0)'
- '[Node.js to Deno cheatsheet](https://deno.land/manual@v1.29.1/references/cheatsheet)'
- '[Deno Wikipedia page](https://en.wikipedia.org/wiki/Deno_(software))'
- '[Deno third-party modules archive: deno.land x](https://deno.land/x)'
---

[Deno](https://deno.land/) is a new runtime for JavaScript and TypeScript. Compared to the more-established Node.js environment, Deno offers many improvements in structure, organization, and security. This guide offers an introduction to Deno and compares Deno and Node.js. It also explains how to install and configure Deno and includes some examples demonstrating how to use it.

## What is Deno?

Deno is a modern and secure open-source scripting environment. It was co-created and authored by Ryan Dash, who also developed the Node.js runtime. Dash created Deno to improve on some of the design decisions of his earlier program. Deno was originally written in Go and then rewritten in Rust for better performance.

Deno can be used as a JavaScript or TypeScript runtime, allowing users to run code outside of a browser environment. Based on the Google/Chrome V8 JavaScript engine, Deno uses an event-driven architecture and an asynchronous non-blocking input/output mechanism. In terms of performance, Deno is fast and does not have excessive memory requirements.

In addition to providing a runtime environment, Deno is also its own package manager. It includes a standard library with a comprehensive set of tools and utilities. Unlike some other runtimes, Deno is a single executable and does not require additional compilers, extensions, or helper applications. It can be used from a command-line interface to run scripts and commands, but GUIs are also available.

Deno is a fully-featured environment. Some of its main highlights are as follows.

- It is easy to use and has a relatively small learning curve.
- In addition to JavaScript capabilities, it includes native TypeScript support, a TypeScript compiler, and a caching mechanism. There is no requirement for additional modules or compilers. It also supports JavaScript XML and the TypeScript equivalent TSX.
- It is designed to avoid dependencies through the incorporation of a large [standard library of modules](https://deno.land/std@0.170.0). These modules include support for working with the file and network system, formatting output, benchmarking code, and processing different file formats. The library also includes a compatibility layer for importing Node.js libraries.
- It imports modules using URLs. The URL can specify either an absolute or relative path, and both Deno and third-party modules can be imported. Many modules are hosted on the [Deno Third Party Modules archive](https://deno.land/x). These modules have been analyzed for potential performance and security issues.
- It includes a large web-standard API that emulates the features found on browsers such as Safari and Chrome. This allows users to run browser APIs on their server.
- It places a big emphasis on security. By default, Deno does not provide I/O or file system access. This means it can be used to securely evaluate third-party code.
- The Deno `await` command allows for an asynchronous file or network access for better performance.
- It includes additional tools including a linter, code formatting, file watcher, and dependency inspector. Deno features a *Read Evaluate Print Loop* (REPL) utility to allow interactive execution and code development.
- It gives users the ability to build an executable that does not require a local Deno instance.
- Deno provides test infrastructure support and IDE integration.
- It has a granular access control mechanism to directories, source code, and network resources.
- It is compatible with the *Node Package Manager* (NPM) used in Node.js.

Deno can be used alongside the Deno Deploy dashboard and configuration manager, and Deno Fresh, a next-gen web framework. Deno Deploy is available as a free application or as a more scalable professional package.

## A Comparison of Deno vs Node.js

Deno is designed to correct some of the deficiencies of the Node.js runtime. Because they were both designed by the same software engineer and based on the same engine, they naturally have many similarities. The two applications have the following characteristics in common.

- Both applications are based on Google's V8 JavaScript engine and can be used as a JavaScript runtime.
- They both use an event-driven architecture and can handle asynchronous events.
- Both can be used from the command line.
- Both permit local and remote dependencies and external modules.
- Both support *ECMAScript* (ES) modules.

However, there are some significant differences between Deno and the Node.js application. Some of these differences are internal and highly technical, such as how messages are processed. But there are other more obvious distinctions. Here are the four most significant differences between Node.js and Deno.

- **Dependencies:** In Deno, URLs must be used to import dependencies and resources, whereas, in Node.js, both URLs and modules can be used.
- **Use of Package Manager:** Deno imports packages using URLs and does not use a package manager. Node.js requires a supporting package manager such as NPM to import packages. Deno caches the packages it supports, allowing better performance on subsequent trials.
- **Security:** Deno restricts default access to other components, including the local file system and networking, to prioritize security. In Deno, these features must be explicitly enabled using flags. Node.js does not implement these restrictions.
- **TypeScript Support:** Deno supports TypeScript as part of its core functionality. It converts TypeScript into JavaScript and caches the result.

In addition to the main differences, there are a number of other distinctions between the two products.

- Deno follows a different strategy regarding functionality. It has a minimum set of core features, but a large standard library. Node.js has a larger API supplemented with external packages.
- Deno generally provides better performance on many commonly-used benchmarks. It also uses less memory. However, the differences are not large and there are some scenarios where Node.js outperforms Deno.
- Node.js natively supports CommonJS in addition to ES modules. Deno only supports ES. CommonJS support requires an additional compatibility layer.
- Deno has more comprehensive browser compatibility and a broader selection of APIs.
- Node.js is widely known and used. Deno is much newer. This means it has fewer resources and a smaller user community.
- Node.js must support a large number of legacy APIs and is considered bloated. Deno does not yet have this type of technical debt.

Under some circumstances, Deno and Node.js can be used together. Many NPM packages work inside a Deno runtime without additional changes and many Deno packages can be imported to Node.js using NPM. However, the two applications are frequently incompatible. For example, the Node.js plug-in system does not work in Deno. It is not easy to determine in advance if a Node.js project can be feasibly ported to Deno. For a more in-depth comparison between Node.js and Deno, see the [Deno Node.js cheatsheet](https://deno.land/manual@v1.29.1/references/cheatsheet).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Deno

The easiest way to install Deno on Linux is to use `curl` to download and run the install script. Other methods, including solutions for other operating systems and Docker, are documented on the [Deno Installation page](https://deno.land/manual@v1.29.1/getting_started/installation).

The following instructions are designed for Ubuntu 22.04 LTS users but are generally compatible with other Linux distributions. To install Deno and confirm the installation, follow the steps below:

1.  Install the `unzip` utility. Ensure the system is up to date first.

    ```command
    sudo apt-get update -y && sudo apt-get upgrade -y
    sudo apt install -y unzip
    ```

1.  Use `curl` to download the script. Pipe the script to the `sh` command to install it.

    ```command
    curl -fsSL https://deno.land/x/install/install.sh | sh
    ```

    ```output
    Deno was installed successfully to /home/userid/.deno/bin/deno
    ```

1.  Add the location of the `deno` executable to the `PATH` variable. This step ensures that you can run Deno from any location in the terminal. Open your shell profile file (e.g., `~/.bashrc`, `~/.bash_profile`, or `~/.zshrc`) and add the following lines at the end of the file.

    ```command
    export DENO_INSTALL="$HOME/.deno"
    export PATH="$DENO_INSTALL/bin:$PATH"
    ```

1. Save the file, and then run the following command to apply the changes to your current shell session:

    ```command
    source ~/.bashrc
    ```

    {{< note >}}
To make Deno available on a system-wide basis, move the binary file using the command `sudo mv /root/.deno/bin/deno /usr/bin/`. The `export` commands listed here are not required in this scenario.
    {{< /note >}}

1.  Use the `--version` flag to verify the release and confirm a successful installation.

    ```command
    deno --version
    ```

    ```output
    deno 1.29.1 (release, x86_64-unknown-linux-gnu)
    v8 10.9.194.5
    typescript 4.9.4
    ```

## How to Use Deno

Deno is a complex application containing many options. This guide only covers certain basic scenarios and provides a brief introduction to how to use Deno. For a complete understanding of the Deno commands and options, see the [Deno Documentation](https://deno.land/manual@v1.29.1/introduction).

### How to Use Deno Interactively

To instantiate the Deno REPL, use the `deno` command without any options.

    ```command
    deno
    ```

    ```output
    Deno 1.29.1
    exit using ctrl+d, ctrl+c, or close()
    REPL is running with all permissions allowed.
    To specify permissions, run `deno repl` with allow flags.
    ```

Inside the REPL utility, it is possible to write and test code, evaluate functions, and perform mathematical expressions. The following executes a basic addition operation.

```command
3 + 4
```

```output
7
```

Commands run the same way in Deno as they do in a browser. The following example prints `Welcome to Deno`.

```command
console.log("Welcome to Deno!");
```

```output
Welcome to Deno!
```

To terminate the interactive runtime, either enter `ctrl+C` twice or use the `close()` command.

### How to Run a Deno Program

To run a Deno program, use the `deno run` command. Supply the name of a local or remote script as an argument. The following example runs the `welcome.ts` TypeScript program from the Deno standard library.

```command
deno run https://deno.land/std@0.109.0/examples/welcome.ts
```

```output
Welcome to Deno!
```

### How to Access the Network or File System in a Deno File

By default, the Deno runtime does not allow programs to access network resources or local files. To enable internet access, add the `--allow-net` flag to the `deno run` command. To restrict access to a specific domain, use `--allow-net=domainname`, where `domainname` is the name of the site to allow.

For example, the `curl.ts` example script in the Deno standard library accepts the name of a URL as an argument. The program retrieves the contents of the URL using the `fetch` command, converts the results to an array, and prints the array to standard output. However, the program displays an error when it is run.

```command
deno run https://deno.land/std@0.109.0/examples/curl.ts https://example.com
```

```output
┌ Deno requests net access to "example.com".
├ Requested by `fetch()` API
├ Run again with --allow-net to bypass this prompt.
└ Allow? [y/n] (y = yes, allow; n = no, deny) >
```

To enable network access and run the program, enter `y`. The program runs to completion this time and outputs the contents of the URL. To avoid the messages and prompts altogether, run the program with the `--allow-net` option.

{{< note >}}
The permission flag must immediately follow the `deno run` syntax. Permissions placed at the end of the command are treated as arguments to the `curl.ts` script. This would result in network access remaining disabled.
{{< /note >}}

```command
deno run --allow-net  https://deno.land/std@0.109.0/examples/curl.ts https://example.com
```

```output
<!doctype html>
<html>
<head>
    <title>Example Domain</title>
...
```

The same principle applies to local file system access. Use the option `--allow-read` to grant read-only permission. To restrict file access to a single file, use `--allow-read=filename`.

The following example runs the example Deno program `cat.ts`. The program accepts a list of files. For each file, the Deno runtime reads the contents of the file and prints the result to standard output. For the program to work correctly, `--allow-read` must be added after the `deno run` command. Without this flag, the program again prompts for user input.

```command
deno run --allow-read https://deno.land/std@0.109.0/examples/cat.ts /etc/hosts
```

```output
# /etc/hosts
127.0.0.1	localhost
...
```

The equivalent option to allow writes to the file system is `--allow-write`. The Deno [Permissions page](https://deno.land/manual@v1.29.1/basics/permissions) contains a full list of all permission flags, including the comprehensive but potentially risky `--allow-all` option.

### How to Run a Local Script in Deno

To run a local TypeScript or JavaScript script, use the same basic method. To run a local version of the Deno `cat.ts` example, add a `cat.ts` TypeScript file with the following contents. This script uses the critical `import` directive to import the `copy` function from Deno's `io` library.

```file {title="cat.ts" lang="ts"}
import { copy } from "https://deno.land/std@0.109.0/io/util.ts";
for (const filename of Deno.args) {
  const file = await Deno.open(filename);
  await copy(file, Deno.stdout);
  file.close();
}
```

Use the `deno run` command with the name of the file to run the script. Include the `--allow-read` command to grant local file access. The output should be the same as in the previous example.

```command
deno run --allow-read cat.ts /etc/hosts
```

```output
# /etc/hosts
127.0.0.1	localhost
...
```

## Additional Deno Options

Deno can be optimized through a variety of configuration changes. To see all of the Deno options and runtime flags, use `deno help`.

```command
deno help
```

Deno also allows users to supply a configuration file to customize the compiler behavior, formatting, and linting. This file is strictly optional. Add the customizable options to a `.json` or `.jsonc` file, and pass the file to the `deno run` command. The following example demonstrates how to use a configuration file with the `cat.ts` script. For more information, see the [Deno Configuration File Example](https://deno.land/manual@v1.29.1/getting_started/configuration_file).

```command
deno run --allow-read --config deno_cfg.json  cat.ts /etc/hosts
```

## Conclusion

Deno is a new JavaScript and TypeScript runtime that provides a solid alternative to the established Node.js application. Based on the Google V8 JavaScript engine, it is designed for better performance, flexibility, and security. It includes a large standard library and imports dependencies using URLs rather than through a package manager. It also includes native TypeScript support.

To install Deno, use the `curl` command. To run a script using Deno, use the `deno run` command. An interactive REPL interpreter is also available, and the application can be customized and optimized using `.json` configuration files. Deno restricts access to the network and file system by default, but users can override this behavior using permission flags. For more information, see the [Deno documentation](https://deno.land/manual@v1.29.1/introduction).
