---
author:
    name: Antonio Valencia
    email: public@tonny.org
contributor:
    name: TonnyORG
    link: https://github.com/tonnyorg
description: 'Learn how to handle different PHP versions in a single instance. This guide will teach you how to install and use PHPBrew to switch between different PHP versions.'
keywords: 'php, phpbrew'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Sunday, December 12th, 2015'
published: 'N/A'
title: Manage PHP versons with PHPBrew on Ubuntu 14.04
---

If you are an ambitious PHP programmer I can bet that you've been in a situation where you needed to juggle various projects at once and it's possible that some of them required different versions of PHP. Well, these days it's very easy to deal with this kind of situations with **PHPBrew**.

PHPBrew it's your new friend, in short-words, it's a tool that help you to install and manage multiple PHP versions in a single instance.

[![PHPBrew](/docs/assets/phpbrew-preview-small.png)](/docs/assets/phpbrew-preview.png)

Some of the benefits of use PHPBrew are:

*   Configure each PHP version with different variants like, but not limited to: PDO, Debug.

*   Build and install PHP for "testing" purposes in `$HOME` directory.

*   Switch between PHP versions with a bash/zsh shell command.

*   Detect features automatically.

*   Enable and disable PHP extensions into current environment with ease.

#### Requirements

Before go over the tool, keep in mind that you need to install a few things in your system.

{: .note}
>
>Please note that you need to disable suhosin patch to run PHPBrew.

*   PHP 5.3+

*   curl

*   gd

*   openssl

*   gettext

*   mhash

*   mcrypt

*   icu

In order to install all the requirements listed previously, let's run the following lines:

    apt-get build-dep php5
    apt-get install -y php5 php5-dev php-pear autoconf automake curl libcurl3-openssl-dev build-essential libxslt1-dev re2c libxml2 libxml2-dev php5-cli bison libbz2-dev libreadline-dev
    apt-get install -y libfreetype6 libfreetype6-dev libpng12-0 libpng12-dev libjpeg-dev libjpeg8-dev libjpeg8  libgd-dev libgd3 libxpm4 libltdl7 libltdl-dev
    apt-get install -y libssl-dev openssl
    apt-get install -y gettext libgettextpo-dev libgettextpo0
    apt-get install -y libicu-dev
    apt-get install -y libmhash-dev libmhash2
    apt-get install -y libmcrypt-dev libmcrypt4

### Installing PHPBrew

Now that we already have all the dependencies installed it's time to install this awesome tool. Basically, to **install PHPBrew on Ubuntu 14.04** we just need to download and move it into our `/usr/bin` folder.

    curl -L -O https://github.com/phpbrew/phpbrew/raw/master/phpbrew
    chmod +x phpbrew
    sudo mv phpbrew /usr/bin/phpbrew

Then, it's time to init PHPBrew with:

    phpbrew init

After that, add this line into your `~/.bashrc` file:

    source ~/.phpbrew/bashrc

Now, it's time to use it and let the magic happen.

### Install multiple PHP versions

The first step is to list known versions of PHP:

    phpbrew known

It should list all the PHP versions available to install, if you wanna list the older versions of PHP then just add `--old` to the previous instruction.

Now, for testing purposes, let's build and install PHP 5.4:

    phpbrew install 5.4.0

If you wish to install PHP with PgSQL support then run:

    phpbrew install 5.4.0 +pgsql+pdo

{: .note}
>
>To build and install old versions you must append `--old`:
>
>   phpbrew install --old 5.2.13

To see installed PHP versions with PHPBrew just run:

    phpbrew use 5.4.22

### Switch between versions

Now it's time to use and move between the installed PHP versions using PHPBrew. The first step is to list all the versions already installed:

    phpbrew list

We can configure any of those PHP versions as default (to use it the whole time) or switch temporarily, and the following command deppends of your needs:

*   If you want to setup it as default version then type:

    phpbrew switch 5.4.0

*   Otherwise, if you want to switch temporarily then type:

    phpbrew use 5.4.0

That's it! Now that you've learned how to install and use PHPBrew, you don't need to setup multiple staging instances to test applications with different versions of PHP.

Want more? Read the official documentation at [PHPBrew website](http://phpbrew.github.io/phpbrew/).