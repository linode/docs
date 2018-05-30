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
The steps in this section will install the Java 8 JDK on Ubuntu 16.04. For other distributions, see the [official docs](https://docs.oracle.com/javase/8/docs/technotes/guides/install/linux_jdk.html#BJFGGEFG).

1.  Install `software-properties-common` to easily add new repositories:

        sudo apt-get install software-properties-common

2.  Add the Java PPA:

        sudo add-apt-repository ppa:webupd8team/java

3.  Update the source list:

        sudo apt-get update

4.  Install the Java JDK 8:

        sudo apt-get install oracle-java8-installer
