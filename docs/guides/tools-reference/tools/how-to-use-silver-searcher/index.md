---
slug: how-to-use-silver-searcher
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to get started with the code-searching tool Silver Searcher. It is a tool like ack but emphasizing speed and efficiency."
og_description: "Learn how to get started with the code-searching tool Silver Searcher. It is a tool like ack but emphasizing speed and efficiency."
keywords: ['silver searcher ag','ag command linux','ack alternative']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-22
modified_by:
  name: Nathaniel Stickman
title: "How to Install and Use Silver Searcher on Linux"
h1_title: "How to Install and Use Silver Searcher on Linux"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

The Silver Searcher is a command-line tool for searching code. It is similar to the well-known `ack` command, but tremendously improves on performance and adds support for `.*ignore` files.

In this guide, learn more about The Silver Searcher and how to install and get started using it on your Linux system.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

    - On CentOS 7 or earlier, use:

            sudo yum update

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What is The Silver Searcher?

[The Silver Searcher](https://github.com/ggreer/the_silver_searcher) — also known by its command name, `ag` — is a code-searching tool similar to `ack`. But The Silver Searcher is designed to be much faster than `ack`, and it takes your `.gitignore`, `.hgignore`, and other `.*ignore` files into account.

By default, The Silver Searcher excludes files and directories listed in `.gitignore` and `.hgignore` files, as well as hidden files and directories, from your searches. This keeps your searches focused on relevant files, and, moreover, further speeds up search time.

The Silver Searcher can also have its own ignore file, `.ignore`. You can use this file to tightly control what files and directories you search and further keep out irrelevant results.

### The Silver Searcher vs ripgrep

`ripgrep` is a tool similar to The Silver Searcher, likewise boasting vast performance improvements over `ack`.

Both The Silver Searcher and `ripgrep` have their merits, many of which overlap. So, the choice of which one to use may come down to your personal preference between the tools' interfaces.

`ripgrep` uses regular expression (regex) search patterns almost exclusively; The Silver Searcher, though fully capable of regex searches, uses command patterns primarily resembling `ack` commands. (You can learn more about using regex searches in The Silver Searcher via the [Advanced Searches](/docs/guides/how-to-use-silver-searcher/#advanced-searches) section below.) Thus, The Silver Searcher may be easier to pick up if you are already familiar with `ack`.

The Silver Searcher is fast, but `ripgrep` purports to be even faster in most scenarios. Likely, The Silver Searcher's still-remarkable performance should be sufficient for most use cases. If, however, you find yourself still facing slowdowns while using The Silver Searcher, you should look into `ripgrep`.

You can learn more about `ripgrep` through our guide on how to install and start using it, which you can find via the search field above.

## How to Install The Silver Searcher

Depending on your Linux distribution, use one of the following methods to install The Silver Searcher.

- On Debian and Ubuntu, use:

        sudo apt install silversearcher-ag

- On AlmaLinux, CentOS 8 or later, and Fedora, use:

        sudo dnf install the_silver_searcher

- On CentOS 7 or earlier, use:

        sudo yum install epel-release
        sudo yum install the_silver_searcher

You can then verify your installation with:

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

You can then use The Silver Surfer in Vim via the `:Ack` command. Simply provide your search options, pattern, and directory like you would when using the `ag` command from the command-line.

For instance, the first example command from the [How to Use The Silver Searcher](/docs/guides/how-to-use-silver-searcher/#how-to-use-the-silver-searcher) section below would translate to the following in Vim:

    :Ack restful ~/express

## How to Use The Silver Searcher

This section walks you through some of the most useful features of The Silver Searcher using the [Express JS](https://github.com/expressjs/express) project for its examples. You can clone the project's GitHub repository to your current user's home directory using the commands below. Note that you need to have `git` installed for this to work:

    cd ~/
    git clone https://github.com/expressjs/express.git

### Basic Searches

At its simplest, The Silver Searcher just needs a search pattern and a path to search in:

    ag restful ~/express

{{< output >}}
/home/example-user/express/package.json
25:    "restful",

/home/example-user/express/History.md
3379:  * Removed usage of RESTful route funcs as http client
3400:  * Added high level restful http client module (express/http)
3401:  * Changed; RESTful route functions double as HTTP clients. Closes #69
{{< /output >}}

You can get a count of matches by piping the results to the `wc` command, as in:

    ag restful ~/express | wc -l

{{< output >}}
4
{{< /output >}}

If you just want to list the names of files with matching results, use the `-l` option with The Silver Searcher:

    ag -l restful ~/express

{{< output >}}
/home/example-user/express/package.json
/home/example-user/express/History.md
{{< /output >}}

A useful variant of this kind of search uses the `--count` option. With it, The Silver Searcher lists each matching file along with its number of matching lines:

    ag --count restful ~/express

{{< output >}}
/home/example-user/express/package.json:1
/home/example-user/express/History.md:3
{{< /output >}}

Notice in the first of the examples above that The Silver Searcher ignores case. You can, alternatively, make you search case sensitive with the `-s` option:

    ag -s restful ~/express

{{< output >}}
/home/example-user/express/package.json
25:    "restful",

/home/example-user/express/History.md
3400:  * Added high level restful http client module (express/http)
{{< /output >}}

### Excluding Files and Directories

By default, The Silver Searcher automatically excludes from its results files and directories listed in `.*ignore` files — for example, `.gitignore`, `.hgignore`, or just `.ignore`.

The Express JS directory searched in the examples above has its own such file. Mostly, its `.gitignore` file covers files and directories generated by the operating system, Node.js, or otherwise while working on the project.

But, for this example, let us say we want to search for `proxy` and want to ignore matches in the `test` subdirectory. First, you can see below just what results show up for the `proxy` search pattern without excluding anything beyond the default:

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

Now, create a `.ignore` file in the Express JS directory and have that file list the directory you want excluded:

    echo "test" > ~/express/.ignore

Conduct the search again, and notice that files in the `test` subdirectory are excluded from the results:

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

The Silver Searcher also has an option — `--ignore` — to exclude files and directories based on a given pattern. For instance, you can further tune the search above by excluding all `*.md` files:

    ag --count --ignore *.md proxy ~/express

{{< output >}}
/home/example-user/express/package.json:1
/home/example-user/express/lib/utils.js:4
/home/example-user/express/lib/request.js:22
/home/example-user/express/lib/application.js:18
/home/example-user/express/lib/router/index.js:1
{{< /output >}}

### Advanced Searches

The Silver Searcher accepts regular expression (regex) search patterns, giving you access to powerful advanced search patterns. Just wrap the search pattern portion of your command in quotes, then use a regex pattern there.

In the example below, regex is used to get a count of (most) JavaScript `function` declarations in the Express JS project:

    ag --js 'function.*\(.*\).*\{' ~/express | wc -l

{{< output >}}
2911
{{< /output >}}

As you can see from the example above, The Silver Searcher also lets you limit your search to specific file types. You can use the command below to see a listing of all file types recognized by Silver Searcher:

    ag --list-file-types


Wanting to broaden your search? The Silver Searcher excludes hidden files and directories from its results by default. Using the `--hidden` option, however, you can have it include those files and directories, broadening your search:

    ag --hidden package-lock.json ~/express

{{< output >}}
/home/example-user/express/.gitignore
18:package-lock.json
{{< /output >}}

You can further broaden your search using the `--skip-vcs-ignores` option, which has The Silver Searcher ignore the contents of `.gitignore` and `.hgignore` files.

Using the `--unrestricted` option gives you the broadest search. With it, The Silver Searcher searches hidden files and directories and ignores the contents of `.*ignore` files, including the `.ignore` file.

## Conclusion

You should be ready now to start using Silver Searcher for your projects! But Silver Searcher is a highly-capable search tool with even more to offer than covered in this guide. Be sure, as you put what you have learned here to action, to also check out Silver Searcher's additional command options. You can find them with the `ag --help` command, and they are likely to give you plenty more to fine-tune your searches.
