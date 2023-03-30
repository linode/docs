---
slug: how-to-use-ack-command
description: "The ack command provides a powerful alternative to grep. The ack command has the benefit of being specifically designed for working with source code repositories, making it a more well-suited tool for developers. In this tutorial, learn everything you need to get started using it."
keywords: ['ack command line', 'ack command in linux', 'ack command examples']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-20
modified_by:
  name: Nathaniel Stickman
title: "How to Use the ack Command on Linux"
title_meta: "Using the ack Command on Linux"
external_resources:
- '[ack!: Documentation](https://beyondgrep.com/documentation/)'
- '[DigitalOcean: How To Install and Use Ack, a Grep Replacement for Developers, on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-ack-a-grep-replacement-for-developers-on-ubuntu-14-04)'
- '[Linux Shell Tips: How to Install and Use Ack Command in Linux with Examples](https://www.linuxshelltips.com/ack-command-in-linux/)'
authors: ["Nathaniel Stickman"]
---

The Linux search tool *grep* has plenty to offer, but, if you are working with source code, there is a more efficient alternative. That alternative is *ack*, a faster tool dedicated specifically to searching source code.

*ack* boasts an increased performance by identifying relevant files and searching only those. *ack* also brings in optimized regular expressions, meant to make pattern matching more efficient.

This guide helps introduce you to *ack* and everything it has to offer. It covers everything from the basics that many *grep* users are familiar with to more advanced searches using regular expressions and file-type filters.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

        ```command
        sudo apt update && sudo apt upgrade
        ```

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

        ```command
        sudo dnf upgrade
        ```

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## ack vs grep: Which One to Use?

Both *ack* and *grep* are command-line search tools, capable of matching string patterns to find text within files and directories.

The main difference between the two is emphasis. The *grep* command is considered a standard, helped by the fact that it comes installed by default on most Linux systems. It is a general-purpose tool, meant to be versatile enough for any kind of search but not specifically optimized for any kind in particular.

Meanwhile, the *ack* command aims for higher efficiency by applying itself to searching particular kinds of files, those found in source code repositories. Because it is designed with this particular use in mind, *ack* can ignore certain files as irrelevant. Doing so makes its searches easier for users to navigate and more performant compared to *grep*.

In general, *grep* still offers much when it comes to general-purpose text searches. But, if you are specifically looking for a tool for searching within source code repositories, *ack* should be your go-to command-line tool.

## How to Install the ack Command

Installing *ack* is straightforward using your Linux system's package manager.

- On **Debian** and **Ubuntu**, use the following command:

    ```command
    sudo apt install ack
    ```

    However, on **Debian** 9 or older or **Ubuntu** 19.10 or older, you should use the following command instead:

    ```command
    sudo apt install ack-grep
    ```

- On **AlmaLinux**, **CentOS**, and **Fedora**, use the following command:

    ```command
    sudo dnf install ack
    ```

You can verify your installation by checking the installed *ack* version. The output varies depending on your Linux system, but the command should look something like the below:

```command
ack --version
```

```output
ack 2.24
Running under Perl 5.28.1 at /usr/bin/perl

Copyright 2005-2018 Andy Lester.

This program is free software.  You may modify or distribute it
under the terms of the Artistic License v2.0.
```

## How to Search Source Code with the ack Command

These next sections walk you through how to start using *ack* to search source code repositories.

To see *ack* in action, the examples that follow use the source code for the [Terrastories](https://github.com/Terrastories/terrastories) project. You can download the repository to follow along with the examples using the steps below:

1. Ensure that you have Git installed. The repository, like many other open-source code repositories, is stored using Git.

    - On **Debian** and **Ubuntu**, you can install Git using the following command:

        ```command
        sudo apt install git
        ```

    - On **AlmaLinux**, **CentOS**, and **Fedora**, you can install Git using the following command:

        ```command
        sudo dnf install git
        ```

1. Clone the GitHub repository for the project. Here, the repository is cloned into the current user's home directory. A project subdirectory is automatically created:

    ```command
    cd ~
    git clone https://github.com/Terrastories/terrastories
    ```

1. Change into the project's directory.

    ```command
    cd terrastories
    ```

Additionally, most guides recommend that you configure *ack* to pipe long-listed results into *less*. The *less* program, generally installed by default on Linux systems, can make output conveniently scrollable.

You can implement this configuration change with a single command. The command writes a line to the *ack* configuration file telling it to pipe long output:

```command
echo '--pager=less -RFX' >> ~/.ackrc
```

### Get Count of Files

A basic usage of *ack* is simply getting a count of the relevant files in a source code directory. You can achieve this using the following command:

```command
ack -f | wc -l
```

```output
667
```

Here, the *ack* command runs with the `-f` option. This tells *ack* to identify all relevant files in the repository, without any search pattern. The results are piped into *wc*, which, with the `-l` option, counts the number of lines of output.

It is important to note that *ack* only queries the files it deems relevant. Remember, *ack* is designed for searching source code specifically, not searching files generally. So, its elimination of certain files from searches is intended to make it more efficient than *grep* for its particular use case.

To demonstrate, compare the file count from *ack* to the standard way of getting file counts on Linux using the *find* command:

```command
find . | wc -l
```

```output
933
```

### Search by Term

Of course, most often you want to search files by a given term or set of terms. You can achieve this by giving the `ack` command your search pattern, as shown below:

```command
ack create
```

```output
README.md
91:Push your branch up and create a pull request! Please indicate which issue your PR addresses in the title.

documentation/SETUP-LINUX.md
33:Copy the contents of this file into a newly created file called `.env` (Do not change .env.example!).
35:Now navigate to a site called [Mapbox](https://mapbox.com/signup) create an account and copy the Mapbox access token (either your default public token or a new one you create) found under your account.
37:Navigate back to the `.env` file you created and replace where it says [your pk token here] with your Mapbox access token.
[...]
```

The above command finds even partial matches for the search term. For example, though the search term is `create`, the results include lines with `created`.

Additionally, the example above is case-sensitive. This means that while all cases of `create`, `created`, etc. can be found, cases of `Create`, `Created`, etc., are not.

You can adjust both of those factors, however. In this next example, the `-w` option tells *ack* to find only whole-word matches — that is, `create` but not `created`. The `-i` option tells *ack* to make the search case-insensitive, so it can return results of `create` and `Create`:

```command
ack -i -w create
```

```output
.github/ISSUE_TEMPLATE/bug_report.md
3:about: Create a report to help us improve

.github/ISSUE_TEMPLATE/feature_request.md
20:- [ ] \(Optional) Create an integration test for any new feature

README.md
84:**Step 4: Create a branch**
91:Push your branch up and create a pull request! Please indicate which issue your PR addresses in the title.
```

#### Advanced Searches with Regex

The pattern field for *ack* searches also supports regular expressions (regex). Regex provides a pattern-matching syntax for searching and sometimes replacing, text. It is often used for advanced pattern matching and can be a powerful tool for demanding search tasks.

Here is a straightforward example of regex in *ack*. The pattern allows *ack* to find lines matching two search terms. For this example, the terms must be set off by spaces to match, and they can be separated by any number and variation of characters:

```command
ack -i ' create (.*) example '
```

```output
documentation/SETUP-OFFLINE.md
58:*Raster tiles*: If you have raster tiles that you want to load in Terrastories, those will need to be defined differently from the vector tiles above. In `sources`, create a new source definition with `url` pointing to the raster `MBTIles` in the same format as above, `type` set to `raster`, and `tileSize` to `256`. Then, in `layers`, create a map object with your `id` of choice, `type` set to `raster`, and `source` set to the name of your raster tiles as defined in `sources`. Here is an example:

rails/db/seeds.rb
17:# Create an example Community
95:# Create an admin user for example community
103:# Create an editor user for example community
111:# Create a member user for example community
119:# Create a viewer user for example community
```

*ack* uses the Perl implementation of regular expression syntax, also known as *Perlre*. The full reference for this regex syntax can be found in the [official Perldoc documentation](https://perldoc.perl.org/perlre).

However, that reference can be daunting, especially when starting out with regex. You may, instead, find the coverage of regex filters in our [How to Filter Data Using AWK RegEx](/docs/guides/filter-data-using-awk-regex/) more helpful to start with. The guide does not specifically address Perl regex. Nonetheless, it provides useful examples and breakdowns to help you get a footing with regex's usage and capabilities generally.

#### Count Matches per File

The *ack* command also includes several options for counting matches. Using the *wc* program like above can give you a count of files, but the options built into *ack* give you more granular control and can count the number of matches.

These options all build on the `-c` option. This option causes *ack* to list file names with the number of matches in each file. For instance, this command lists files and indicates the number of times each has the term `def`:

```command
ack -c def
```

```output
[...]
documentation/CODE_OF_CONDUCT.md:0
documentation/CUSTOMIZATION.md:2
.gitattributes:0
rails/.gitignore:2
rails/db/migrate/20200425195232_rename_curriculum_stories_order_to_display_order.rb:1
rails/db/migrate/20220414120430_add_mapbox_3d_boolean.rb:2
[...]
```

Notice, however, that these results include files without any matches for the term. The full results include many such files.

To weed these out, you can add the `-l` option alongside the `-c` option. The `-l` option instructs *ack* to only list files that have at least one match to the search pattern:

```command
ack -cl def
```

```output
[...]
documentation/CUSTOMIZATION.md:2
rails/.gitignore:2
rails/db/migrate/20200425195232_rename_curriculum_stories_order_to_display_order.rb:1
rails/db/migrate/20220414120430_add_mapbox_3d_boolean.rb:2
rails/db/migrate/20210323183008_add_map_config_to_theme.rb:1
rails/db/migrate/20201213191300_add_super_admin_to_users.rb:2
[...]
```

Finally, you may want a pure count of matches, without the list of file names. You can get this by adding the `-h` option. This option removes the display of file names. Combined with the `-c` option, it results in a simple count of matches within the repository, like this:

```command
ack -ch def
```

```output
568
```

### Limit Searches by File Type

The *ack* tool is oriented around source code repositories, and many times it can be useful to limit searches in these repositories by file type. As such, *ack* includes a wide set of options designed for filtering searches based on file types.

To use these options, you can provide the file-type name as a flag on the *ack* command. This example, for instance, searches the repository for the term `blue` but has _ack_ only looks at SASS files (which end in either `.sass` or `.scss`):

```command
ack --sass blue
```

```output
rails/app/assets/stylesheets/core/_colors.scss
29:$blue: #09697e;
30:$light-blue: #179caa;
31:$medium-blue: $blue;
32:$dark-blue: #0f566b; // does not match palatte since dark blue is text color

rails/app/assets/stylesheets/components/devise.scss
36:    color: $blue;
92:        background-color: $blue;

rails/app/assets/stylesheets/components/card.scss
75:    background: $dark-blue;
92:    background-color: $dark-blue;
145:        border: 3px solid $dark-blue;
[...]
```

Conversely, you can use a similar approach to exclude a given file type. These works are simply adding `no` to the beginning of the file-type name, as in:

```command
ack -w --nosass red
```

```output
rails/yarn.lock
3506:    functional-red-black-tree "^1.0.1"
4137:functional-red-black-tree@^1.0.1:
4139:  resolved "https://registry.yarnpkg.com/functional-red-black-tree/-/functional-red-black-tree-1.0.1.tgz#1b0ab3bd553b2a0d6399d29c0e3ea0b252078327"
[...]
```

You can even fine-tune your searches further by using multiple file-type flags at the same time.

To see a full list of supported file types in *ack*, you can run the command with the `--help-types` option, as in:

```command
ack --help-types
```

```output
[...]
The following is the list of file types supported by ack.  You can
specify a file type with the --type=TYPE format, or the --TYPE
format.  For example, both --type=perl and --perl work.

Note that some extensions may appear in multiple types.  For example,
.pod files are both Perl and Parrot.

    --[no]actionscript .as .mxml
    --[no]ada          .ada .adb .ads
    --[no]asm          .asm .s
[...]
```

## Conclusion

That covers everything you need to start using the *ack* command-line tool on your Linux system.

When it comes to text searches in source code repositories, *ack* gives you an efficient and streamlined alternative to the *grep* standard. And, with all the features covered in this tutorial, you should be ready to put *ack* to practical use.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
