---
slug: ripgrep-linux-installation
description: 'This guide provides background information on ripgrep, including installation instructions, comparisons to other regex tools, and examples.'
keywords: ['ripgrep','Ripgrep ubuntu','Ripgrep examples']
tags: ['ubuntu', 'linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-05
modified_by:
  name: Linode
title: "Install and Use ripgrep"
title_meta: "How to Install and Use ripgrep"
external_resources:
- '[Ripgrep GitHub site](https://github.com/BurntSushi/ripgrep)'
- '[ripgrep blog](https://blog.burntsushi.net/ripgrep/)'
authors: ["Jeff Novotny"]
---

The [*ripgrep* utility](https://github.com/BurntSushi/ripgrep) is a useful alternative to the traditional [`grep` command](/docs/guides/differences-between-grep-sed-awk/) on Linux. Both ripgrep and grep are used to search files for specific patterns of text. However, ripgrep is much faster and uses intelligent defaults which are optimal for most users. This guide provides some background on ripgrep, including a comparison with other search tools. It also explains how to install and use ripgrep, and provides some examples of typical searches.

## An Introduction to ripgrep

ripgrep is an open-source line-oriented tool that is optimized to recursively search for text within a file or directory. It skips hidden files and directories and takes into account the contents of any ignore files. ripgrep is available for Ubuntu and other Linux distributions, as well as for macOS and Windows. The name of the tool is intentionally not capitalized.

Benchmarking tests demonstrate that ripgrep is on average much faster than other text search tools. ripgrep is more efficient because it uses the Rust regex engine, which uses finite automation to speed up searches. It also quickly iterates through directories using a parallel recursive technique. Ripgrep automatically chooses whether to use memory maps or an intermediate buffer. Memory maps are best for single files, while buffers are better for larger directories. ripgrep includes most features found in other search tools, but does not necessarily have complete feature parity with any of them. Some of the most important ripgrep features and highlights include the following:

- ripgrep provides full Unicode support, with built-in UTF-8 support to maintain performance. Support for Unicode is always enabled.
- ripgrep can provide extra context for search results, allowing a user to specify the number of lines before or after the match to display. It also highlights matches in color.
- ripgrep searches in a case-sensitive manner, but it also supports case insensitive or smart case searches. In a smart case search, the search is case sensitive if and only if a capital letter is included in the search term.
- It allows users to search for multiple patterns or a search pattern spanning multiple lines.
- It reviews the contents of any `.gitignore`, `ignore`, or `rgignore` files and excludes these entries from the search. It uses a *regexSet* to match a file path against several patterns simultaneously.
- It ignores hidden and binary files by default.
- It can limit its search to particular types of files.
- It provides optional support for the *Perl Compatible Regular Expression 2* (PCRE2) search engine. This enables the use of look around, a technique for retrieving text that precedes or follows the match, as well as back references.
- It supports a variety of text encodings such as UTF-8, UTF-16, latin-1, GBK, EUC-JP, and Shift_JIS. It can also search files compressed with the most common utilities.
- ripgrep can interact with input preprocessing filters for text extraction, decryption, and automatic encoding detection.

However, ripgrep is not POSIX-compliant and it is not installed on most systems. Therefore, it is not a good choice if portability is required.

## Comparing ripgrep to grep, ack, and Silver Searcher

Some alternatives to ripgrep include the familiar grep tool, [ack](https://github.com/beyondgrep/ack3/), and ag, also known as the [Silver Searcher](https://github.com/ggreer/the_silver_searcher). The biggest advantage of ripgrep is its speed. On average, it is noticeably faster than other tools as measured across multiple benchmarks. Although it is not always the fastest tool in every case, it handles complicated queries much more efficiently. Its parallel search technique is more efficient when searching through a large number of files. It also avoids worst-case scenarios where performance badly degrades with certain search parameters. Ripgrep uses Rust and its collection of highly-optimized libraries, while the other search tools use C or Perl. A full set of benchmarks is available in the "Code Search Benchmarks" section of the [ripgrep blog](https://blog.burntsushi.net/ripgrep/#code-search-benchmarks).

ripgrep is generally competitive with the other tools in terms of feature parity. On occasion, it lacks a feature that one of the other tools provides and vice versa. Here is a more detailed comparison between ripgrep and the other tools.

- **ripgrep vs grep:** The grep tool is available as part of the standard Linux specification and has been around for a very long time. This means it is available on almost every system. It is reasonably efficient, but it is not as fast as ripgrep, especially when handling Unicode searches. It also does not have as many features. For example, it is not possible to restrict a search to a particular file type and it does not ignore file names listed in `.gitignore`. It does not provide user-friendly options such as smart-case searching, nor does it use optimized search techniques like parallel iteration. However, it does support searches based on extended regular expressions, a feature ripgrep lacks.
- **ripgrep vs ack:** ack release 3 uses Perl and is designed for developers searching repositories of source code. It has the advantage of being highly portable because it can run on any platform that supports Perl. It is relatively similar to ripgrep in the number of features it supports, but it is not as fast.
- **ripgrep vs Silver Searcher/ag:** The Silver Searcher program is probably the best comparison for ripgrep. Both programs provide a similar set of optimization and user-friendly features. Silver Searcher is considered quite fast, although ripgrep performs better on most benchmarks, and significantly better on Unicode searches. Silver Searcher uses some different search techniques than ripgrep does, including look around.

Both ripgrep and Silver Searcher are considered major improvements over the standard `grep` command. ack should be considered if maximum portability is absolutely necessary. A useful chart-based comparison of the different tools can be found at the [Beyond Grep site](https://beyondgrep.com/feature-comparison/). You can learn more about Silver Searcher in our [How to Install and Use Silver Searcher on Linux](/docs/guides/silver-searcher-on-linux/) guide.

## How to Install ripgrep

ripgrep is usually available as part of the standard package for most Linux distributions and is easy to install. It can also be installed using either the cargo or Homebrew package managers.

### Install ripgrep on Ubuntu and Debian

Ripgrep is available through APT for Ubuntu release 18.10 or higher as well as the newest release of Debian. To install ripgrep, use the following command.

    sudo apt-get install ripgrep

{{< note respectIndent=false >}}
To install ripgrep on earlier releases, see the [ripgrep installation instructions](https://github.com/BurntSushi/ripgrep#installation) for information on how to add the binary `.deb` file.
{{< /note >}}

### Install ripgrep on RHEL Derivatives

To install ripgrep on RHEL or CentOS distributions, follow the instructions below. On CentOS, the package is available for release 7 and higher.

1. Add the ripgrep repository using Yum.

    {{< note respectIndent=false >}}
To use the `yum-config-manager` utility, the `yum-utils` package must be installed first. This can be installed using the command `sudo yum install yum-utils`.
    {{< /note >}}

        sudo yum-config-manager --add-repo=https://copr.fedorainfracloud.org/coprs/carlwgeorge/ripgrep/repo/epel-7/carlwgeorge-ripgrep-epel-7.repo

1. Install the ripgrep package using Yum.

        sudo yum install ripgrep

Install ripgrep on Fedora systems using the `dnf install` command.

    sudo dnf install ripgrep

### Install ripgrep Using Homebrew

Ripgrep can also be installed using the popular [Homebrew](https://brew.sh/) package manager. For instructions on installing Homebrew, see their website. Use the following command to install ripgrep using Homebrew.

    brew install ripgrep

### Install ripgrep Using Cargo

Because ripgrep is written in Rust, it can be installed using Cargo, Rust's package manager. If Rust is already installed on the system, then Cargo is already available. Otherwise, Cargo can be installed as a stand-alone utility using the command `sudo apt install cargo`. To install ripgrep using Cargo, run the following command.

{{< note respectIndent=false >}}
To be able to run Cargo executables, add the line `export PATH=$PATH:$HOME/.cargo/bin` to the `.bashrc` file. Source the `.bashrc` file to apply the changes.
{{< /note >}}

    cargo install ripgrep

### Install ripgrep on macOS and Windows

Ripgrep is also available for macOS and Windows as a static executable. Download the correct ZIP file for your system from the [ripgrep releases webpage](https://github.com/BurntSushi/ripgrep/releases) and unzip the archive. For a macOS system with Homebrew installed, ripgrep can also be installed using the `brew install ripgrep` command.

## How to Use ripgrep

The ripgrep executable is known as `rg`. Most commands take the form of `rg <search_pattern>  <filename>`. To see all of the search options, see the [ripgrep user guide](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md).

To see usage notes for `rg` and a list of all the options, use the `-help` option.

    rg -help

{{< note respectIndent=false >}}
The examples in the following section search the codebase of the open-source [PHP Composer](https://getcomposer.org/) application.
{{< /note >}}

### Basic Searching with ripgrep

To search a specific file, Use the `rg` command followed by the search term and the name of the file. ripgrep orders the results by line number. The matching section of each line is highlighted in color.

    rg Exception InstalledVersions.php

{{< output >}}
146:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
167:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
188:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
209:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
226:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
{{< /output >}}

You can also specify multiple files. In this case, ripgrep groups the results by file.

    rg Exception InstalledVersions.php ClassLoader.php

{{< output >}}
InstalledVersions.php
146:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
167:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
188:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
209:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');
226:        throw new \OutOfBoundsException('Package "' . $packageName . '" is not installed');

ClassLoader.php
163:     *@throws \InvalidArgumentException
184:                throw new \InvalidArgumentException("A non-empty PSR-4 prefix must end with a namespace separator.");
226:* @throws \InvalidArgumentException
235:                throw new \InvalidArgumentException("A non-empty PSR-4 prefix must end with a namespace separator.");
{{< /output >}}

To see each match with more context, use the `-C` option along with the number of lines to display. Adding `-C 2` tells ripgrep to include the two lines preceding and following the match in the output.

    rg Vendor  InstalledVersions.php -C 2

{{< output >}}
26-{
27-    private static $installed;
28:    private static $canGetVendors;
29:    private static $installedByVendor = array();
30-
31-    /**
--

294-    {
295-        self::$installed = $data;
296:        self::$installedByVendor = array();
297-    }
298-
--

...
{{< /output >}}

For more granularity, the `-B` and `-A` options allow users to specify the number of lines both before and after the matching line. To display two lines before and one after, use `rg <search_string> <directory> -B 2 -A 1`.

    rg Vendor  InstalledVersions.php -B 2 -A 1

{{< output >}}
26-{
27-    private static $installed;
28:    private static $canGetVendors;
29:    private static $installedByVendor = array();
30-
--

294-    {
295-        self::$installed = $data;
296:        self::$installedByVendor = array();
297-    }
--

...
{{< /output >}}

By default, ripgrep searches are case-sensitive. Use the `-i` option for case-insensitive searches. If the `-S` option is appended, ripgrep performs a smart case search. In smart case mode, a search becomes case-sensitive when the search term includes a capital letter.

    rg ssl OpenSSL.php -i

{{< output >}}
13: *The OpenSSL Random Number Source
34:* The OpenSSL Random Number Source
45:class OpenSSL extends \RandomLib\AbstractSource
56:         *Prior to PHP 5.6.12 (see <https://bugs.php.net/bug.php?id=70014>) the "openssl_random_pseudo_bytes"
65:* Prior to PHP 5.5.28 (see <https://bugs.php.net/bug.php?id=70014>) the "openssl_random_pseudo_bytes"
74:         * Prior to PHP 5.4.44 (see <https://bugs.php.net/bug.php?id=70014>) the "openssl_random_pseudo_bytes"
93:        return function_exists('openssl_random_pseudo_bytes');
114:        return openssl_random_pseudo_bytes($size);
{{< /output >}}

ripgrep treats every search pattern as a regular expression. So it is easy to search for any one set of string, insert wild cards, or look for repeating patterns. Enclose the regular expression in quotes to ensure the Linux parser passes the expression to ripgrep in an unaltered form. The first example searches the file for either `Error` or `Exception`. The second example looks for a `t` and a `p` with any single character in between.

    rg 'Error|Exception' phpunit.xml.dist

{{< output >}}
6:         convertErrorsToExceptions="true"
7:         convertNoticesToExceptions="true"
8:         convertWarningsToExceptions="true"
12:         stopOnError="false"
{{< /output >}}

    rg 't.p'  phpunit.xml.dist
{{< output >}}
12:         stopOnError="false"
13:         stopOnFailure="false"
14:         stopOnIncomplete="false"
15:         stopOnSkipped="false"
{{< /output >}}

At times, you might not want ripgrep to treat a search pattern like a regular expression. In this case, use the `-F` option to treat the search string as a string literal. For an explanation of the regex rules and how to apply them, see the [Rust Regex Guide](https://docs.rs/regex/1.5.4/regex/#syntax).

### Recursive Search with ripgrep

When no file or directory name is provided, ripgrep searches for the pattern recursively starting from the current directory. During its search, ripgrep ignores any patterns listed in `gitignore`, `ignore`, and `.rgignore`, as well as hidden files, hidden directories, and binary files. It also does not follow any symbolic links. If ripgrep is not returning the results you expect, add the `--debug` flag to include trace information.

The following command recursively searches for instances of `ssl` in a case-insensitive manner. The matching lines are numbered and grouped by file.

    rg ssl -i

{{< output >}}
vendor/composer/autoload_static.php
30:    public static function getInitializer(ClassLoader $loader)
36:        }, null, ClassLoader::class);

vendor/composer/autoload_real.php
9:    public static function loadClassLoader($class)
...
29:        spl_autoload_unregister(array('ComposerAutoloaderInit3df74e6ed39c5b9c938eb947aa3d92ed', 'loadClassLoader'));

vendor/composer/InstalledVersions.php
15:use Composer\Autoload\ClassLoader;
306:            self::$canGetVendors = method_exists('Composer\Autoload\ClassLoader', 'getRegisteredLoaders');
312:            foreach (ClassLoader::getRegisteredLoaders() as $vendorDir => $loader) {

vendor/composer/ClassLoader.php
16: *ClassLoader implements a PSR-0, PSR-4 and classmap class loader.
18:*     $loader = new \Composer\Autoload\ClassLoader();
36: * This class is loosely based on the Symfony UniversalClassLoader.
43:class ClassLoader

vendor/ircmaxell/random-lib/lib/RandomLib/Source/OpenSSL.php
13: * The OpenSSL Random Number Source
...
114:        return openssl_random_pseudo_bytes($size);
{{< /output >}}

It is also possible to search recursively in a specific directory using either a relative or absolute path. Specify the directory as the second argument following the search term. The full path of the file is displayed in the output.

    rg ssl ~/phpcomposer/vendor/composer/ -i

{{< output >}}
/home/userid/phpcomposer/vendor/composer/autoload_static.php
30:    public static function getInitializer(ClassLoader $loader)
36:        }, null, ClassLoader::class);

/home/userid/phpcomposer/vendor/composer/autoload_real.php
9:    public static function loadClassLoader($class)
...
29:        spl_autoload_unregister(array('ComposerAutoloaderInit3df74e6ed39c5b9c938eb947aa3d92ed', 'loadClassLoader'));

/home/userid/phpcomposer/vendor/composer/InstalledVersions.php
15:use Composer\Autoload\ClassLoader;
306:            self::$canGetVendors = method_exists('Composer\Autoload\ClassLoader', 'getRegisteredLoaders');
312:            foreach (ClassLoader::getRegisteredLoaders() as $vendorDir => $loader) {

/home/userid/phpcomposer/vendor/composer/ClassLoader.php
16: *ClassLoader implements a PSR-0, PSR-4 and classmap class loader.
18:*     $loader = new \Composer\Autoload\ClassLoader();
36: * This class is loosely based on the Symfony UniversalClassLoader.
43:class ClassLoader
{{< /output >}}

To display the files that contain a match, without the corresponding lines, use the `list` option or `-l`. The following example lists all of the files containing the string `key` without any additional details.

    rg key -l
{{< output >}}
composer.lock
vendor/composer/installed.json
vendor/composer/InstalledVersions.php
vendor/ircmaxell/security-lib/composer.lock
vendor/ircmaxell/security-lib/composer.json
vendor/ircmaxell/random-lib/README.md
vendor/ircmaxell/random-lib/composer.json
vendor/ircmaxell/security-lib/lib/SecurityLib/composer.json
vendor/ircmaxell/random-lib/lib/RandomLib/Generator.php
vendor/ircmaxell/random-lib/lib/RandomLib/AbstractMcryptMixer.php
vendor/ircmaxell/random-lib/lib/RandomLib/Factory.php
{{< /output >}}

### Filter with ripgrep

ripgrep has several options to limit the search space or filter out results. The `-t` option allows users to only search inside files of a particular type. ripgrep understands most common file types. For instance `-t md` only searches Markdown files. Other commonly-used types include `txt`, `sh`, `py`, `php`, `js`, `java`, `config`, and `c`. To see a list of the available file types, use the `rg --type-list` command.

    rg --type-list

{{< output >}}
agda: *.agda,*.lagda
aidl: *.aidl
...
zsh:*.zsh, .zlogin, .zlogout, .zprofile, .zshenv, .zshrc, zlogin, zlogout, zprofile, zshenv, zshrc
zstd: *.zst,*.zstd
{{< /output >}}

The following command restricts the search for the pattern `key` to `json` files only.

    rg key -t json

{{< output >}}
composer.lock
29:                "mikey179/vfsstream": "^1.6",
56:            "keywords": [
86:                "mikey179/vfsstream": "1.1.*"

vendor/composer/installed.json
24:                "mikey179/vfsstream": "^1.6",
53:            "keywords": [
84:                "mikey179/vfsstream": "1.1.*"

vendor/ircmaxell/security-lib/composer.lock
12:            "name": "mikey179/vfsStream",
16:                "url": "https://github.com/mikey179/vfsStream",
21:                "url": "https://github.com/mikey179/vfsStream/zipball/v1.1.0",

vendor/ircmaxell/security-lib/composer.json
5:    "keywords": [],
16:        "mikey179/vfsStream": "1.1.*"

vendor/ircmaxell/random-lib/composer.json
5:    "keywords": ["random", "random-numbers", "random-strings", "cryptography"],
16:        "mikey179/vfsStream": "^1.6",

vendor/ircmaxell/security-lib/lib/SecurityLib/composer.json
4:    "keywords": ["security"],
{{< /output >}}

A search can also be restricted to filenames matching a particular pattern, using the `g` option, standing for global. The following search only searches for the pattern `key` in files beginning with the substring `comp`.

    rg -g 'comp*'  key

 {{< output >}}
composer.lock
29:                "mikey179/vfsstream": "^1.6",
56:            "keywords": [
86:                "mikey179/vfsstream": "1.1.*"

vendor/ircmaxell/security-lib/composer.lock
12:            "name": "mikey179/vfsStream",
16:                "url": "https://github.com/mikey179/vfsStream",
21:                "url": "https://github.com/mikey179/vfsStream/zipball/v1.1.0",

vendor/ircmaxell/security-lib/composer.json
5:    "keywords": [],
16:        "mikey179/vfsStream": "1.1.*"

vendor/ircmaxell/random-lib/composer.json
5:    "keywords": ["random", "random-numbers", "random-strings", "cryptography"],
16:        "mikey179/vfsStream": "^1.6",

vendor/ircmaxell/security-lib/lib/SecurityLib/composer.json
4:    "keywords": ["security"],
{{< /output >}}

Ripgrep has other options to filter or format the results. Use the `rg --help` command to see a list of all options.

- `-T` to exclude files of a certain type.
- `-w` to only display matches surrounded by word boundaries.
- `-x` to only display matches surrounded by line boundaries.
- `--trim` to trim whitespace from the results.
- `--sort` to sort results in ascending order.
- `-o` to only print the section of each line matching the search pattern.
- `-N` to suppress the display of the line number of each matching line.
- `-U` to search for matches across multiple lines.
- `-m <num>` to limit the number of matches to `num` results.
- `--max-depth <num>` to limit the number of levels of subdirectories to search to `num` levels.
- `--hidden` to include hidden files and directories in the search.
- `-E` to specify the encoding.

## Some Concluding Thoughts on ripgrep

The ripgrep utility for Ubuntu and other Linux distributions is a fast and user-friendly alternative to the traditional, but often inscrutable, `grep` command. It uses intelligent defaults and skips hidden files and entries matching patterns in the `.gitignore` file. ripgrep is available for most Linux distributions, typically as part of the default packages.

ripgrep is very intuitive to use, as shown through a series of examples. The typical ripgrep command has a format similar to `rg <search_pattern> <directory_of_file>`. Users can search one file, or recursively in a specific directory. With several user-friendly options, ripgrep can display more lines around a search for better context, or display only the file names without the matching text.

ripgrep uses regular expressions by default, so complex searches based on certain patterns of characters are easy to construct. Results can also be filtered based on file type, or against global filename patterns. The `rg --help` command displays a complete list of options. The [ripgrep user guide](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md) contains even more details for those who want to master the tool.
