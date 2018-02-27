---
author:
  name: Jared Kobos
  email: sfoo@linode.com
description: 'Shortguide for installing Java 8 JDK with the Oracle ppa repositories.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
modified: 2018-02-02
modified_by:
  name: Sam Foo
title: "How to Install Java 8 JDK"
published: 2018-01-09
shortguide: true
show_on_rss_feed: false
---

1.  Install `software-properties-common` to easily add new repositories:

        sudo apt-get install software-properties-common

2.  Add the Java PPA in order to download from Oracle repositories:

        sudo add-apt-repository ppa:webupd8team/java

3.  Update the source list:

        sudo apt-get update

4.  Install the Java JDK 8:

        sudo apt-get install oracle-java8-installer
