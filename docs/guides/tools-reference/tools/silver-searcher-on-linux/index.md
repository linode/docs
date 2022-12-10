---
slug: silver-searcher-on-linux
author:
  name: Nathaniel Stickman
description: "This guide shows you how to install and use the code-searching tool Silver Searcher. The Silver Searcher is a tool like ack that emphasizes speed and efficiency."
keywords: ['silver searcher ag','ag command linux','ack alternative']
tags: ['ubuntu', 'debian', 'linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-05
modified_by:
  name: Nathaniel Stickman
title: "Installing and Using Silver Searcher on Linux"
h1_title: "How to Install and Use Silver Searcher on Linux"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

The Silver Searcher is a command-line tool for searching code. It is similar to the well-known `ack` command, but improves on performance and adds support for `.*ignore` files. In this guide, you learn more about Silver Searcher and how to install and get started using it on your Linux system.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is the Silver Searcher?

[The Silver Searcher](https://github.com/ggreer/the_silver_searcher) — also known by its command name, `ag` — is a code-searching tool similar to ack. But The Silver Searcher is designed to be much faster than ack, and it takes your `.gitignore`, `.hgignore`, and other `.*ignore` files into account.

By default, The Silver Searcher excludes files and directories listed in `.gitignore` and `.hgignore` files, as well as hidden files and directories, from your searches. This keeps your searches focused on relevant files, and further speeds up search time.

The Silver Searcher can also have it's own ignore file, `.ignore`. You can use this file to tightly control what files and directories you search and further keep out irrelevant results.

### The Silver Searcher vs ripgrep

ripgrep is a tool similar to The Silver Searcher, likewise boasting vast performance improvements over ack. Both the Silver Searcher and ripgrep have their merits, many of which overlap. So, the choice of which one to use may come down to your personal preference between their interfaces.

ripgrep uses regular expression (regex) search patterns almost exclusively; the Silver Searcher, though fully capable of regex searches, uses command patterns primarily resembling ack commands. (You can learn more about using regex searches in the Silver Searcher via the [Advanced Searches](#advanced-searches) section below). The Silver Searcher may be easier to pick up if you are already familiar with ack.

The Silver Searcher is fast, but ripgrep claims to be even faster in most scenarios. However, the Silver Searcher's still-remarkable performance should be sufficient for most use cases. If you find yourself still facing slowdowns while using he Silver Searcher, you should look into ripgrep. You can learn more about ripgrep through our guide on [how to install and start using ripgrep](/docs/guides/ripgrep-linux-installation/).

## How to Install the Silver Searcher

Depending on your Linux distribution, use one of the following methods to install The Silver Searcher.

- On **Debian** and **Ubuntu**, use the following command:

        sudo apt install silversearcher-ag

- On **AlmaLinux**, **CentOS 8** or later, and **Fedora**, use the following command:

        sudo dnf install the_silver_searcher

- On **CentOS 7** or earlier, use the following command:

        sudo yum install epel-release
        sudo yum install the_silver_searcher

You can then verify your installation with the `--version` flag:

    ag --version

{{< output >}}
ag version 2.2.0
{{< /output >}}

### Vim Integration

The Silver Searcher can be integrated with Vim via the [`ack.vim`](https://github.com/mileszs/ack.vim) plugin. You first need to install that plugin, which you can do using your preferred plugin manager for Vim.

Once you have the plugin installed, add the following line somewhere in your `.vimrc` file after invoking the plugin:

{{< file "~/.vimrc" vim >}}
" [...]

let g:ackprg = 'ag --vimgrep'

" [...]
{{< /file >}}

You can then use the Silver Searcher in Vim via the `:Ack` command. Simply provide your search options, pattern, and directory like you would when using the `ag` command from the command line.

For instance, the first example command from the [How to Use The Silver Searcher](#how-to-use-the-silver-searcher) section below translates to the following in Vim:

    :Ack restful ~/express

## How to Use the Silver Searcher

This section walks you through some of the most useful features of the Silver Searcher using the [Express JS](https://github.com/expressjs/express) project for its examples. You can clone the project's GitHub repository to your current user's home directory using the commands below. You need [Git installed](/docs/guides/how-to-install-git-on-linux-mac-and-windows/) on your system to use the examples in this section.

    cd ~/
    git clone https://github.com/expressjs/express.git

### Basic Searches

In its most basic usage, the Silver Searcher only needs a search pattern and a path to search, as show below.

    ag restful ~/express

{{< output >}}
/home/example-user/express/package.json
25:    "restful",

/home/example-user/express/History.md
3379:  * Removed usage of RESTful route funcs as http client
3400:  * Added high level restful http client module (express/http)
3401:  * Changed; RESTful route functions double as HTTP clients. Closes #69
{{< /output >}}

You can get a count of matches by piping the results to the `wc` command, for example:

    ag restful ~/express | wc -l

{{< output >}}
4
{{< /output >}}

If you just want to list the names of files with matching results, use the `-l` option with the Silver Searcher.

    ag -l restful ~/express

{{< output >}}
/home/example-user/express/package.json
/home/example-user/express/History.md
{{< /output >}}

A useful variant of this kind of search uses the `--count` option. With it, the Silver Searcher lists each matching file along with its number of matching lines.

    ag --count restful ~/express

{{< output >}}
/home/example-user/express/package.json:1
/home/example-user/express/History.md:3
{{< /output >}}

Notice in the previous examples above that the Silver Searcher ignores cases. You can alternatively make your search case sensitive with the `-s` option.

    ag -s restful ~/express

{{< output >}}
/home/example-user/express/package.json
25:    "restful",

/home/example-user/express/History.md
3400:  * Added high level restful http client module (express/http)
{{< /output >}}

### Exclude Files and Directories

By default, the Silver Searcher automatically excludes from its results files and directories listed in `.*ignore` files — for example, `.gitignore`, `.hgignore`, or just `.ignore`.

The Express JS directory searched in the examples above has its own ignore file. Mostly, its `.gitignore` file covers files and directories generated by the operating system, Node.js, or otherwise while working on the project.

For this example, you search for `proxy` and ignore matches in the `test` subdirectory. To achieve this, first, you can see the results that show up for the `proxy` search pattern without excluding anything beyond the default.

    ag --count proxy ~/express

{{< output >}}
/home/example-user/express/package.json:1
/home/example-user/express/test/req.protocol.js:7
/home/example-user/express/test/req.ips.js:4
/home/example-user/express/test/req.subdomains.js:1
/home/example-user/express/test/Router.js:4
/home/example-user/express/test/req.secure.js:8
/home/example-user/express/test/req.ip.js:8
/home/example-user/express/test/config.js:21
/home/example-user/express/test/req.hostname.js:8
/home/example-user/express/test/req.host.js:6
/home/example-user/express/lib/utils.js:4
/home/example-user/express/lib/application.js:18
/home/example-user/express/lib/request.js:22
/home/example-user/express/lib/router/index.js:1
/home/example-user/express/History.md:54
/home/example-user/express/Readme-Guide.md:1
{{< /output >}}

Now, create a `.ignore` file in the Express JS directory and have that file list the directory you want it to exclude.

    echo "test" > ~/express/.ignore

Run the search command again and notice that files in the `test` subdirectory are excluded from the results.

    ag --count proxy ~/express

{{< output >}}
/home/example-user/express/package.json:1
/home/example-user/express/lib/utils.js:4
/home/example-user/express/lib/request.js:22
/home/example-user/express/lib/application.js:18
/home/example-user/express/lib/router/index.js:1
/home/example-user/express/History.md:54
/home/example-user/express/Readme-Guide.md:1
{{< /output >}}

The Silver Searcher also has an option — `--ignore` — to exclude files and directories based on a given pattern. For instance, you can further tune the search from the above example by excluding all `*.md` files.

    ag --count --ignore *.md proxy ~/express

{{< output >}}
/home/example-user/express/package.json:1
/home/example-user/express/lib/utils.js:4
/home/example-user/express/lib/request.js:22
/home/example-user/express/lib/application.js:18
/home/example-user/express/lib/router/index.js:1
{{< /output >}}

### Advanced Searches

The Silver Searcher accepts regular expression (regex) search patterns, giving you access to powerful advanced search patterns. Wrap the search pattern portion of your command in quotes, then use a regex pattern there.

In the example below, regex is used to get a count of (most) JavaScript `function` declarations in the Express JS project.

    ag --js 'function.*\(.*\).*\{' ~/express | wc -l

{{< output >}}
2911
{{< /output >}}

As you can see from the example above, the Silver Searcher also lets you limit your search to specific file types. You can use the command below to see a listing of all file types recognized by Silver Searcher.

    ag --list-file-types

You can also broaden your searched. The Silver Searcher excludes hidden files and directories from its results by default. Using the `--hidden` option, however, you can have it include those files, and directories, broadening your search.

    ag --hidden package-lock.json ~/express

{{< output >}}
/home/example-user/express/.gitignore
18:package-lock.json
{{< /output >}}

You can further broaden your search using the `--skip-vcs-ignores` option, which has the Silver Searcher ignore the contents of `.gitignore` and `.hgignore` files.

Using the `--unrestricted` option gives you the broadest search. With this option, the Silver Searcher searches hidden files and directories and ignores the contents of `.*ignore` files, including the `.ignore` file.

## Conclusion

You should now be ready to start using Silver Searcher for your projects. But Silver Searcher is a highly-capable search tool with even more to offer than covered in this guide. Be sure, as you put what you have learned here to action, to also check out Silver Searcher's additional command options. You can find them with the `ag --help` command, and they are likely to give you plenty more to fine-tune your searches.
