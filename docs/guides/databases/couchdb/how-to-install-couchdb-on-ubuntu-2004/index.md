---
slug: how-to-install-couchdb-on-ubuntu-2004
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide shows you how to install CouchDB on Ubuntu 20.04. CouchDB is a NoSQL database noteworthy for its scalability, fault tolerance, and inituitive concepts for web and mobile applications.'
og_description: 'This guide shows you how to install CouchDB on Ubuntu 20.04. CouchDB is a NoSQL database noteworthy for its scalability, fault tolerance, and inituitive concepts for web and mobile applications.'
keywords: ['couchdb','nosql','database','deploy on ubuntu 20.04']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-04
modified_by:
  name: Nathaniel Stickman
title: "How to Install CouchDB on Ubuntu 20.04"
h1_title: "How to Install CouchDB on Ubuntu 20.04"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[CouchDB: Installation on Unix-like Systems](https://docs.couchdb.org/en/stable/install/unix.html#installation-on-unix-like-systems)'
---

CouchDB is a non-relational, or "NoSQL," database designed with scalability and a more trouble-free experience in mind. CouchDB is programmed in Erlang, which boasts a highly-scalable concurrency model and fault tolerance. CouchDB capitalizes on both of these features to ensure production databases run with fewer interruptions, regardless of changes in request volumes and inevitable performance potholes.

CouchDB uses HTTP APIs and JSON documents, which are intended to be more intuitive and to integrate more simply into web and mobile applications. Its use of JSON documents makes it highly flexible and able to accommodate a wide variety of needs.

This guides shows you how to install CouchDB on Ubuntu 20.04. At the end of the guide, there is a link to a subsequent guide for getting started using CouchDB and understanding its concepts.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

1.  Update your system:

        sudo apt update && sudo apt upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Set Up the Apache CouchDB Repository

1. Install the prerequisites for using the Apache CouchDB repository:

        sudo apt-get install -y gnupg ca-certificates

1. Add the CouchDB repository to the `apt` repository list:

        echo "deb https://apache.bintray.com/couchdb-deb focal main" | sudo tee /etc/apt/sources.list.d/couchdb.list

1. Install the CouchDB repository key:

        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 8756C4F765C9AC3CB6B85D62379CE192D401AB61

## Install CouchDB

{{< note >}}
The steps below are for installing a standalone CouchDB server. If you intend to use CouchDB in a cluster, choose **clustered** instead of **standalone** and enter `0.0.0.0` as the interface bind address in the steps that follow.

See CouchDB's [cluster set up guide](https://docs.couchdb.org/en/latest/setup/cluster.html) for the additional steps needed to set up a CouchDB cluster once you have completed the installation.
{{< /note >}}

1. Update the package manager:

        sudo apt update

1. Install CouchDB:

        sudo apt install couchdb

    Choose **standalone** when prompted for a configuration type.

    [![CouchDB configuration type selection](couchdb-installation-config-type_small.png "CouchDB configuration type selection")](couchdb-installation-config-type.png)

    Enter the default value — `127.0.0.1` — for the interface bind address.

    [![Inputting the CouchDB network interface](couchdb-installation-network_small.png "Inputting the CouchDB network interface")](couchdb-installation-network.png)

    Since CouchDB 3.0.0, CouchDB does not run without an administrator user being configured. When prompted, create an administrator user by entering a password. Re-enter the password on the subsequent screen.

    [![Creating a CouchDB administrator user](couchdb-installation-admin-user_small.png "Creating a CouchDB administrator user")](couchdb-installation-admin-user.png)

1. You can verify that CouchDB is installed and running with the following command:

        curl 127.0.0.1:5984

## Getting Started with CouchDB

You have now successfully installed CouchDB! To get started using it, head over to the guide for [Using CouchDB on Ubuntu 20.04](/docs/guides/using-couchdb-on-ubuntu-2004/).