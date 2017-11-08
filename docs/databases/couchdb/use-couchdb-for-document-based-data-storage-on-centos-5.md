---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction and getting started guide for CouchDB on CentOS 5 systems.'
keywords: ["couchdb", "nosql", "json", "centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['databases/couchdb/centos-5/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-02-18
title: Use CouchDB for Document Based Data Storage on CentOS 5
external_resources:
 - '[CouchDB Project](http://couchdb.apache.org/)'
 - '[CouchDB Community Wiki](http://wiki.apache.org/couchdb/)'
---

CouchDB is a non-relational document based database. Like other entrants into the "NoSQL" field, CouchDB attempts to provide a more flexible data storage system for use in custom application development. CouchDB is written in the Erlang programing language and uses an HTTP interface and JSON as a data format for easy integration in application development.

Before installing CouchDB, it is assumed that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

## Installing CouchDB

The packages required to install CouchDB and its dependencies are not available in the standard CentOS repositories. As a result, "[EPEL](https://fedoraproject.org/wiki/EPEL)" must be installed in order to install CouchDB. EPEL, or "Extra Packages for Enterprise Linux", is a product of the Fedora Project that attempts to provide current versions of software packages that may not be available in the CentOS repositories. Enable EPEL with the following command:

    rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm

Before proceeding with the installation of CouchDB, make sure your package repositories and installed programs are up to date by issuing the following command:

    yum update

To install CouchDB and all of its dependencies, issue the following command:

    yum install couchdb

The installation process will prompt you to accept the repository key for EPEL. After you confirm the key, the installation will complete. To start CouchDB, use the "init script" located at `/etc/init.d/couchdb`. Issue the following commands to start CouchDB:

    /etc/init.d/couchdb start

If you need to restart or stop CouchDB, you can use the following commands:

    /etc/init.d/couchdb restart
    /etc/init.d/couchdb stop

To ensure that CouchDB starts following the next system reboot, issue the following command:

    chkconfig couchdb on

Congratulations! You have successfully installed CouchDB. In most cases, you will not need to modify CouchDB's configuration file; however, a number of options are set in the `/etc/couchdb/local.ini` file if you need to edit them in the future.

## Using CouchDB

CouchDB comes with a web-based administrative interface called "Futon". Since CouchDB is only accessible over the local interface by default, you will want to [create a secure ssh tunnel](/docs/databases/couchdb/ssh-tunnel) in order to access CouchDB or Futon from your local machine to avoid sending data in the clear.

Once the SSH tunnel is in place or you have configured your Linode, you can access the CouchDB HTTP interface by making a request for `http://localhost:5984`. If you would like to install a simple command line HTTP client, you may wish to use `curl` You can test your CouchDB instance by issuing the following command:

    curl http://localhost:5984

In response, CouchDB will return the following:

    {{< output >}}
{"couchdb":"Welcome","version":"0.10.2"}
{{< /output >}}

With the SSH tunnel active, you can access the Futon interface by visiting the URL `http://localhost:5984/_utils/` in a web browser on your local system.

Additionally, CouchDB provides an embedded JavaScript interpreter if you would like to interact with CouchDB directly. Access this interpreter with the `couchjs` command in your terminal by issuing a command in the following form:

    couchjs duck-team-check.js

Where `duck-team-check.js` is a file containing JavaScript code for the CouchDB interpreter.
