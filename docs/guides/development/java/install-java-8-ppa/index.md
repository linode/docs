---
slug: install-java-8-ppa
title: "Install Java 8 JDK"
description: 'Shortguide for installing Java 8 JDK with the Oracle ppa repositories.'
authors: ["Jared Kobos"]
contributors: ["Jared Kobos"]
published: 2018-01-09
modified: 2018-02-02
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
headless: true
show_on_rss_feed: false
tags: ["java"]
aliases: ['/development/java/install-java-8-ppa/']
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
