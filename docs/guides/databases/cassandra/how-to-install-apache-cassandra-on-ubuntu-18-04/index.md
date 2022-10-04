---
slug: how-to-install-apache-cassandra-on-ubuntu-18-04
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide presents instructions to deploy a scalable and development-driven NoSQL database with Apache Cassandra for Ubuntu 18.04.'
keywords: ["cassandra", " apache cassandra", " centos 7", " ubuntu 18.04", " database", " nosql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-09-24
image: L_ApacheCass_on_Ubuntu1804.png
modified: 2022-05-16
modified_by:
  name: Linode
title: "How to Install Apache Cassandra on Ubuntu 18.04"
h1_title: "Installing Apache Cassandra on Ubuntu 18.04"
enable_h1: true
contributor:
  name: Linode
external_resources:
   - '[Cassandra Documentation](http://cassandra.apache.org/doc/latest/)'
   - '[Cassandra cqlshrc File Configuration Overview](http://docs.datastax.com/en/cql/3.3/cql/cql_reference/cqlshUsingCqlshrc.html)'
   - '[Cassandra .yaml Configuration File Overview](http://cassandra.apache.org/doc/latest/configuration/cassandra_config_file.html)'
   - '[Recommended Production Settings For Apache Cassandra](http://docs.datastax.com/en/landing_page/doc/landing_page/recommendedSettings.html)'
   - '[The Cassandra Query Language (CQL)](http://cassandra.apache.org/doc/latest/cql/index.html)'
relations:
    platform:
        key: install-apache-cassandra
        keywords:
            - distribution: Ubuntu 18.04
tags: ["ubuntu","database","nosql"]
aliases: ['/databases/cassandra/how-to-install-apache-cassandra-on-ubuntu-18-04/','/databases/cassandra/deploy-scalable-cassandra/','/guides/deploy-scalable-cassandra/','/databases/deploy-scalable-cassandra/','/databases/cassandra/deploy-scalable-cassandra-on-ubuntu-18.04-and-centos-7/','/guides/deploy-scalable-cassandra-on-ubuntu-18.04-and-centos-7/']
---

After completing this guide, you will have a single-node, production-ready installation of [Apache Cassandra](http://cassandra.apache.org/) hosted on your Linode running Ubuntu 18.04. This tutorial will cover basic configuration options, as well as harden database security.

{{< note >}}
In order to successfully execute the commands in this guide, you will need to run them as the `root` user, or log in using an account with root privileges, prefixing each command with `sudo`.
{{</ note >}}

## Before You Begin

1. Complete the [Getting Started](/docs/getting-started) guide for setting up a new Linode.
1. While it is recommended you complete the entire [Securing Your Server](/docs/security/securing-your-server) guide, at  minimum, you should [add a limited user account](/docs/guides/set-up-and-secure/#add-a-limited-user-account).

## Install OpenJDK (Java)

Apache Cassandra requires OpenJDK 8 or OpenJDK 11 (both are LTS releases). OpenJDK 11 has been officially supported in Cassandra since 4.0.2 (February 8, 2022).

1.  Check to see if you have Java installed and, if so, verify that it is a compatible version.

        java -version

1.  If Java is not installed, install OpenJDK. The command below installs OpenJDK 11, though you can replace the package with `openjdk-8-jdk` if you wish to use OpenJDK 8.

        apt update
        apt install openjdk-11-jdk

## Install Cassandra

Add Apache Cassandra's repository and GPG keys so that you can install Cassandra.

1.  Add the Apache Cassandra repository:

        echo "deb http://www.apache.org/dist/cassandra/debian 40x main" |  sudo tee /etc/apt/sources.list.d/cassandra.list

    {{< note >}}
The above command installs the latest version within the Apache Cassandra 4.0 release. To see what other versions are available, you can review the [repository](https://downloads.apache.org/cassandra/debian/dists/) and adjust the command as needed.
{{< /note >}}

1.  Add the keys required to access the repository:

        curl https://downloads.apache.org/cassandra/KEYS | sudo apt-key add -

1.  Get the latest package information from the newly added source and install Apache Cassandra.

        sudo apt update
        sudo apt install cassandra

## Activate Cassandra

1.  Enable Cassandra on system boot and verify that it is running:

        sudo systemctl enable cassandra
        sudo systemctl start cassandra
        sudo systemctl -l status cassandra

1.  Check the status of the Cassandra cluster:

        nodetool status

    If `UN` is displayed in the output, the cluster is working. Your output should resemble the following:

    {{< output >}}
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address    Load       Tokens       Owns (effective)  Host ID                               Rack
UN  127.0.0.1  103.51 KiB  256          100.0%            c43a2db6-8e5f-4b5e-8a83-d9b6764d923d  rack1
    {{< /output >}}

    If you receive connection errors, see [Troubleshooting Connection Errors](#troubleshooting-connection-errors).

## Configure Cassandra

### Enable Security Features

In this section, you will enable user login authentication. You can also configure other security settings based on your project's needs.

1.  Make a backup of the Cassandra configuration file `cassandra.yaml`.

        sudo cp /etc/cassandra/cassandra.yaml /etc/cassandra/cassandra.yaml.backup

1.  Open `cassandra.yaml` in your preferred text editor:

    {{< note >}}
Locations of the `cassandra.yaml` file may differ slightly between distros.
    {{< /note >}}

        sudo vim /etc/cassandra/cassandra.yaml

1.  Match the following variables in the file to the values shown in the example file. If any values are commented out, uncomment them. The rest of the properties found in the `cassandra.yaml` file should be set based on your project's particular requirements and how you plan to utilize Cassandra. The default configuration should work well for development.

    {{< file "Ubuntu /etc/cassandra/cassandra.yaml" yaml >}}
. . .

authenticator: org.apache.cassandra.auth.PasswordAuthenticator
authorizer: org.apache.cassandra.auth.CassandraAuthorizer
role_manager: CassandraRoleManager
roles_validity_in_ms: 0
permissions_validity_in_ms: 0

. . .
    {{< /file >}}

    More information about this file can be found in the [Cassandra Configuration File](http://cassandra.apache.org/doc/latest/configuration/cassandra_config_file.html) guide in Apache's official documentation.

1.  After editing the configuration file restart Cassandra.

        sudo systemctl restart cassandra

### Add An Administration Superuser

1.  Open the Cassandra command terminal by typing `cqlsh`. Log in with the credentials shown below for the default user `cassandra`:

        cqlsh -u cassandra -p cassandra

1.  Create a new superuser. Replace the brackets as well as the content inside with the applicable information:


        CREATE ROLE [new_superuser] WITH PASSWORD = '[secure_password]' AND SUPERUSER = true AND LOGIN = true;

1. Log out by typing `exit`.

1.  Log back in with the new superuser account and replace the username and password with your new credentials:

        cqlsh -u new-super-user -p my-scecure-password

1.  Remove the elevated permissions from the Cassandra account:

        ALTER ROLE cassandra WITH PASSWORD = 'cassandra' AND SUPERUSER = false AND LOGIN = false;
        REVOKE ALL PERMISSIONS ON ALL KEYSPACES FROM cassandra;

1.  Grant all permissions to the new superuser account. Replace the brackets and contents inside with your superuser account username:

        GRANT ALL PERMISSIONS ON ALL KEYSPACES TO [superuser];

1.  Log out by typing `exit`.

### Edit The Console Configuration File

The `cqlshrc` file holds configuration settings that influence user preferences and how Cassandra performs certain tasks.

{{< note >}}
Ensure you complete the steps in this section using your limited user account. This account will need [sudo privileges](/docs/guides/set-up-and-secure/#ubuntu), if it does not already have them.
{{</ note >}}

Since your Cassandra username and password can be stored in plaintext, the `cqlshrc` file should only be accessible to your administrative user account, and is designed to be inaccessible to other accounts on your Linux system.

{{< caution >}}
Do not complete this section as the root user. Before proceeding, fully evaluate the security risks and consequences to your node cluster before adding the `[authentication]` section.
{{</ caution >}}

1.  Create the file `cqlshrc` using your preferred text editor. If the `~/.cassandra` directory does not exist, create it:

        sudo mkdir ~/.cassandra
        sudo vim ~/.cassandra/cqlshrc

1.  Copy any sections below that you wish to add to your configuration, and ensure you replace the `superuser` and `password` value in brackets with your own values. Details for this file can be found in the [Configuring cqlsh From a File](https://docs.datastax.com/en/archived/cql/3.3/cql/cql_reference/cqlshUsingCqlshrc.html) guide on the [DataStax](https://www.datastax.com/) site.


    {{< file "~/.cassandra/cqlshrc" aconf >}}
. . .

;; Options that are common to both COPY TO and COPY FROM

[copy]
;; The string placeholder for null values
nullval=null
;; For COPY TO, controls whether the first line in the CSV output file will
;; contain the column names.  For COPY FROM, specifies whether the first
;; line in the CSV file contains column names.
header=true
;; The string literal format for boolean values
boolstyle = True,False
;; Input login credentials here to automatically login to the Cassandra command line without entering them each time. When this
;; is enabled, just type "cqlsh" to start Cassandra.
[authentication]
username=[superuser]
password=[password]

;; Uncomment to automatically use a certain keyspace on login
;; keyspace=[keyspace]

[ui]
color=on
datetimeformat=%Y-%m-%d %H:%M:%S%z
completekey=tab
;; The number of digits displayed after the decimal point
;; (note that increasing this to large numbers can result in unusual values)
float_precision = 5
;; The encoding used for characters
encoding = utf8

. . .
{{< /file >}}


1.  Save and close the file.

1.  Update the `cqlshrc` file and directory with the following permissions:

        sudo chmod 440 ~/.cassandra/cqlshrc
        sudo chmod 700 ~/.cassandra

1.  Login by typing the command below. You will be prompted to enter your password. The `cqlsh` command terminal should open, and your superuser name should be visible in the command line.

        cqlsh -u superuser

    {{< note >}}
You can also login by providing your username and password:

    cqlsh -u superuser -p password
    {{</ note >}}

## Rename the Cluster

In this section, you will update your default cluster name from "Test Cluster" to your desired name.

1.  Log into the `cqlsh` control terminal if you are not already logged in.

        cqlsh -u superuser

1.  Replace `[new_name]` with your new cluster name:

        UPDATE system.local SET cluster_name = '[new_name]' WHERE KEY = 'local';

1. Type `exit` to return to the Linux command line.

1.  Edit the `cassandra.yaml` file and replace the value in the `cluster_name` variable with the new cluster name you just set.

        sudo vim /etc/cassandra/cassandra.yaml

1.  Save and close.

1.  From the Linux terminal (not cqlsh) clear the system cache. This command will not disturb your node's data.

        nodetool flush system

1.  Restart Cassandra:

        sudo systemctl restart cassandra

1.  Log in with `cqlsh` and verify the new cluster name is visible.

        cqlsh -u superuser

    {{< output >}}
Connected to my-cluster-name at 127.0.0.1:9042.
[cqlsh 5.0.1 | Cassandra 4.0 | CQL spec 3.4.5 | Native protocol v4]
Use HELP for help.
superuser@cqlsh>
    {{</ output >}}

## Troubleshooting Connection Errors

If you receive connection errors when running `nodetool status`, you may need to manually enter networking information.

1.  Open the `cassandra-env.sh` file in a text editor.

        sudo vim /etc/cassandra/cassandra-env.sh

1.  Search for `-Djava.rmi.server.hostname=` in the file. Uncomment this line and add your loopback address or public IP address by replacing `<public name>` at the end of the line:

    {{< file "/etc/cassandra/cassandra-env.sh" bash >}}
. . .
JVM_OPTS="$JVM_OPTS -Djava.rmi.server.hostname=<public name>"
. . .
{{< /file >}}

1.  Restart Cassandra after you've finished updating the `cassandra-env.sh` file:

        sudo systemctl restart cassandra

1.  Check the node status again after the service restarts:

        nodetool status

    {{< note >}}
It may take a few seconds for Cassandra to refresh the configuration. If you receive another connection error, try waiting 15 seconds before rechecking the node status.
{{< /note >}}

## Where To Go From Here

Be sure to check out the links in the [More Information](#more-information) section, which will help you further configure Cassandra to your needs, as well as provide resources to improve your understanding and ability to use Cassandra.

To fully utilize the capabilities of Cassandra in a production setting, additional nodes should be added to your cluster. See the companion guide [Adding Nodes to an Existing Cluster](https://docs.datastax.com/en/archived/cassandra/3.0/cassandra/operations/opsAddNodeToCluster.html) for more information.