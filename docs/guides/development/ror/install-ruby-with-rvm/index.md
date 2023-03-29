---
slug: install-ruby-with-rvm
description: 'Install Ruby on Linux using RVM.'
keywords: ["ruby", "rvm"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-03-08
modified: 2018-03-08
modified_by:
  name: Jared Kobos
headless: true
show_on_rss_feed: false
title: 'Install Ruby Using RVM'
tags: ["ruby"]
aliases: ['/development/ror/install-ruby-with-rvm/']
authors: ["Linode"]
---

1.  Install the mpapis GPG key:

        gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB

    If this does not work, your system may not have `dirmngr` installed by default. Install it to correct the error:

        sudo apt install dirmngr

2.  Run the official RVM installation script:

        curl -sSL https://get.rvm.io | bash -s stable --ruby

3.  The installation process will output a command that must be run before RVM can be used:

        source /home/username/.rvm/scripts/rvm

4.  Check the requirements for `rvm`:

        rvm requirements

5.  Install a version of Ruby and set it as the default version for your system:

        rvm install ruby
        rvm --default use ruby

    If your project requires a different version of ruby, install that version explicitly:

        rvm install ruby-2.5.0
        rvm --default use ruby-2.5.0
