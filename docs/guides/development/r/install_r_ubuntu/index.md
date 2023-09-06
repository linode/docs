---
slug: install_r_ubuntu
description: 'Shortguide for installing R on Ubuntu'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
tags: ["ubuntu", "debian"]
modified: 2018-02-07
modified_by:
  name: Sam Foo
title: "Install R on Ubuntu"
published: 2018-02-07
headless: true
show_on_rss_feed: false
aliases: ['/development/r/install_r_ubuntu/']
authors: ["Sam Foo"]
---

1.  Open `/etc/apt/sources.list` and add the following line to the end of the file:

    Ubuntu:

        deb http://cran.rstudio.com/bin/linux/ubuntu xenial/

    Debian:

        deb http://cran.rstudio.com/bin/linux/debian stretch-cran34/

2.  Add the key ID for the CRAN network:

    [Ubuntu GPG key](https://cran.rstudio.com/bin/linux/ubuntu/):

        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9

    [Debian GPG key](https://cran.rstudio.com/bin/linux/debian/):

        sudo apt install dirmngr
        sudo apt-key adv --keyserver keys.gnupg.net --recv-key 'E19F5F87128899B192B1A2C2AD5F960A256A04AF'

3.  Update the repository:

        sudo apt update

4.  Install the R binaries:

        sudo apt install r-base
