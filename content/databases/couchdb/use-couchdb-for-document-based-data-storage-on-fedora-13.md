---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction and getting started guide for CouchDB on Fedora 13 systems.'
keywords: ["couchdb", "nosql", "json", "centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/couchdb/fedora-13/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-05-27
title: Use CouchDB for Document Based Data Storage on Fedora 13
---



CouchDB is a non-relational, document based database. Like other entrants into the "NoSQL" field, CouchDB attempts to provide a more flexible data storage system for use in custom application development. CouchDB is written in the Erlang Programing language which supports an innovative concurrency model. While CouchDB does not use an SQL interface, it uses an HTTP interface and JSON as a data format for easy integration in application development.

Before installing CouchDB, it is assumed that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics).

Installing CouchDB
------------------

Before proceeding with the installation of CouchDB, make sure your package repositories and installed programs are up to date by issuing the following command:

    yum update

To install CouchDB and all of its dependencies, issue the following command:

    yum install couchdb

To start CouchDB, use the "init script" located at `/etc/init.d/couchdb`. Issue the following commands to start CouchDB:

    /etc/init.d/couchdb start

Later, if you need to restart or stop CouchDB you can use the following commands to accomplish these functions:

    /etc/init.d/couchdb restart
    /etc/init.d/couchdb stop

To ensure that CouchDB starts following the next system reboot, issue the following command:

    chkconfig couchdb on

Congratulations! In most use cases, you will not need to modify CouchDB's configuration file. However, should you need to modify any of its settings, a number of options are set in the `/etc/couchdb/local.ini` file.

Using CouchDB
-------------

Most of your interaction with CouchDB will occur by way of the system's HTTP and JSON interface. CouchDB comes with a web-based administrative interface called "Futon". Since CouchDB is only accessible over the local interface by default, you will want to [create a secure ssh tunnel](/docs/databases/couchdb/ssh-tunnel) in order to access CouchDB or Futon from your local machine to avoid sending data in the clear.

Once the SSH tunnel is in place or you have configured your Linode, you can access the CouchDB HTTP interface by making a request for `http://localhost:5984`. For a simple command-line HTTP client consider installing `curl`. You can test your CouchDB instance by issuing the following command:

    curl http://localhost:5984

In response, CouchDB will return the following:

~~~ js
{"couchdb":"Welcome","version":"0.10.2"}
~~~

With the SSH tunnel active, you can access the Futon interface by visiting the URL `http://localhost:5984/_utils/` in a web browser on your local system.

Additionally, CouchDB provides an embedded JavaScript interpreter if you would like to interact with CouchDB directly. Access this interpreter with the `couchjs` command in your terminal by issuing a command in the following form:

    couchjs duck-team-check.js

Where, `duck-team-check.js` is a file containing JavaScript code for the CouchDB interpreter.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [CouchDB Project](http://couchdb.apache.org/)
- [CouchDB Community Wiki](http://wiki.apache.org/couchdb/)



