---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction and getting started guide for CouchDB on Ubuntu 9.10 (Karmic) systems.'
keywords: ["couchdb", "nosql", "json", "ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/couchdb/ubuntu-9-10-karmic/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-02-18
title: 'Use CouchDB for Document Based Data Storage on Ubuntu 9.10 (Karmic)'
---



CouchDB is a non-relational document based database. Like other entrants into the "NoSQL" field, CouchDB attempts to provide a more flexible data storage system for use in custom application development. CouchDB is written in the Erlang programing language which supports an innovative concurrency model. While CouchDB does not use an SQL interface, it uses an HTTP interface and JSON as a data format for easy integration in application development.

Before installing CouchDB, it is assumed that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Installing CouchDB

### Enable Universe Repositories

Edit your `/etc/apt/sources.list` file to enable the "universe" repositories by removing the hash symbol in front of the universe lines. The file should resemble the following example:

{{< file "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

deb http://security.ubuntu.com/ubuntu karmic-security main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

## universe repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe

{{< /file >}}


When you have saved this file, issue the following commands to refresh your system's package database and ensure that you're running the most up to date software:

    apt-get update
    apt-get upgrade --show-upgraded

### Install CouchDB Software

To install CouchDB and all of its dependencies, issue the following command:

    apt-get install couchdb

CouchDB will start as soon as the application is fully installed. You can use the "init script" located at `/etc/init.d/couchdb` to control CouchDB. Issue the following commands to start, restart, and stop CouchDB:

    /etc/init.d/couchdb start
    /etc/init.d/couchdb restart
    /etc/init.d/couchdb stop

Congratulations! In most use cases, you will not need to modify CouchDB's configuration file. However, should you need to modify any of its settings, a number of options are set in the `/etc/couchdb/local.ini` file.

# Using CouchDB

Most of your interaction with CouchDB will occur by way of the system's HTTP and JSON interface. CouchDB comes with a web-based administrative interface called "Futon". Since CouchDB is only accessible over the local interface by default, you will want to [create a secure ssh tunnel](/docs/databases/couchdb/ssh-tunnel) in order to access CouchDB or Futon from your local machine to avoid sending data in the clear.

Once the SSH tunnel is in place or you have configured your Linode, you can access the CouchDB HTTP interface by making a request for `http://localhost:5984`. For a simple command-line HTTP client consider installing `curl` with the following command:

    apt-get install curl

Now issue the following command:

    curl http://localhost:5984

In response, CouchDB will return the following:

    {"couchdb":"Welcome","version":"0.10.0"}

With the SSH tunnel active, you can access the Futon interface by visiting the URL `http://localhost:5984/_utils/` in a web browser on your local system.

Additionally, CouchDB provides an embedded JavaScript interpreter if you would like to interact with CouchDB directly. Access this interpreter with the `couchjs` command in your terminal by issuing a command in the following form:

    couchjs duck-team-check.js

Where, `duck-team-check.js` is a file containing JavaScript code for the CouchDB interpreter.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [CouchDB Project](http://couchdb.apache.org/)
- [CouchDB Community Wiki](http://wiki.apache.org/couchdb/)



