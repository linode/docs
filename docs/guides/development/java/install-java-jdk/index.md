---
slug: install-java-jdk
description: 'Shortguide for installing Java on Ubuntu'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["java", "jdk", "install java"]
tags: ["java","ubuntu"]
modified: 2017-01-08
modified_by:
  name: Jared Kobos
title: "Install JDK on Ubuntu"
published: 2018-01-30
headless: true
show_on_rss_feed: false
aliases: ['/development/java/install-java-jdk/']
authors: ["Jared Kobos"]
---

1.  Install `software-properties-common`:

        sudo apt install software-properties-common

2.  Add the Oracle PPA repository:

        sudo apt-add-repository ppa:webupd8team/java

3.  Update your system:

        sudo apt update

4.  Install the Oracle JDK. To install the Java 9 JDK, change `java8` to `java9` in the command:

        sudo apt install oracle-java8-installer

5.  Check your Java version:

        java -version
