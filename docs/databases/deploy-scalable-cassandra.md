---
author:
   name: Andrew Lescher
   email: docs@linode.com
description: 'This guide presents instructions to deploy a scalable and development-driven NoSQL database with Apache Cassandra for both the Ubuntu 17.04 and CentOS 7 distros.'
keywords: ["cassandra", " apache cassandra", " centos 7", " ubuntu 17.04", " database", " nosql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-06-12
modified: 2017-06-24
modified_by:
  name: 'Andrew Lescher'
title: 'How to Install Apache Cassandra on Ubuntu 17.04 and CentOS 7'
contributor:
   name: Andrew Lescher
   link: https://www.linkedin.com/in/andrew-lescher-87027940/
external_resources:
   - '[Cassandra Documentation](http://cassandra.apache.org/doc/latest/)'
   - '[Cassandra cqlshrc File Configuration Overview](http://docs.datastax.com/en/cql/3.3/cql/cql_reference/cqlshUsingCqlshrc.html)'
   - '[Cassandra .yaml Configuration File Overview](http://cassandra.apache.org/doc/latest/configuration/cassandra_config_file.html)'
   - '[Recommended Production Settings For Apache Cassandra](http://docs.datastax.com/en/landing_page/doc/landing_page/recommendedSettings.html)'
   - '[The Cassandra Query Language (CQL)](http://cassandra.apache.org/doc/latest/cql/index.html)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

---

![Deploy a scalable and development driven NoSQL DB with Cassandra](/docs/assets/Cassandra/Apache_Cassandra.png)

## Introduction to Apache Cassandra

The Cassandra NoSQL database is ideal for situations requiring maximum data redundancy and uptime, ease of horizontal scaling across multiple unique servers, and rapidly evolving project demands during the development life cycle which would otherwise be heavily restricted by traditional relational database implementations. Apache Cassandra is an open-source application that is managed in a simple command line interface using the CQL language. CQL, or Cassandra Query Language is syntactically similar to the Structured Query Language, making it easy to pick up for those already familiar with SQL.

After completing this guide, you will have a single-node, production-ready installation of Apache Cassandra hosted on your Linode. This tutorial will cover basic configuration options, as well as harden database security. If the instructions differ between the Ubuntu and CentOS distros, they will be presented in sections underneath the **bolded** names of the distributions. In order to successfully execute the commands in this guide, you will need to run them as the "root" user, or log in using an account with root privileges, prefixing each command with `sudo`.

### Install Cassandra

#### Before You Begin

1. Complete the [Getting Started](/docs/getting-started) guide for setting up a new Linode.
2. While it is recommended you complete the entire [Securing Your Server](/docs/security/securing-your-server) guide, it will be necessary at least to possess a limited user account.

#### Add Repositories and GPG Keys

Add required repositories/gpg keys. Be sure to run the key add commands in the order shown.

{{< caution >}}
(Ubuntu only) If you receive an error while running `apt update` that pertains to a missing key, copy the key listed in the error message and add it to your keyring using the commands in step 4. As of this publish date, the only keys required are listed below.
{{< /caution >}}

**Ubuntu 17.04**

1. Add the package `software-properties-common`:

	   apt install software-properties-common

2. Add the Java repository:

	   add-apt-repository ppa:webupd8team/java

3. Add the apache repository:

	   echo "deb http://www.apache.org/dist/cassandra/debian 39x main" |  tee /etc/apt/sources.list.d/cassandra.list

{{< note >}}
You may want to follow the link to the Apache repository to confirm that "39x" is the latest available version.
{{< /note >}}

4. Download the two public keys needed to access these repositories:

		      gpg --keyserver pgp.mit.edu --recv-keys 749D6EEC0353B12C
		      gpg --export --armor 749D6EEC0353B12C | apt-key add -

		      gpg --keyserver pgp.mit.edu --recv-keys A278B781FE4B2BDA
		      gpg --export --armor A278B781FE4B2BDA | apt-key add -

**CentOS 7**

1. Install the "yum-utils" package:

		      yum install yum-utils -y

2. Add the Datastax repository:

		      yum-config-manager --add-repo http://rpm.datastax.com/community

4. Add the public key for the datastax repository. Create a directory for the downloaded key:

		      mkdir ~/.keys

5. Navigate to the ".keys" directory you just created and download the public key:

		      wget http://rpm.datastax.com/rpm/repo_key

6. The key should now be contained in a file called "repo_key". Install the key with the package manager:

		      rpm --import repo_key

## Install Cassandra and Supporting Applications

Update the system and install Java along with Cassandra. Answer "yes" to the Java installation prompts regarding the license terms (Ubuntu only). NTP will help keep the Cassandra node synced to the correct time.

1. Install Cassandra, Java, and NTP:

	**Ubuntu 17.04**

		apt-get update && apt-get upgrade -yuf
		apt-get install oracle-java8-set-default cassandra ntp -y

	**CentOS 7**

		yum update && yum upgrade -y
		yum install java dsc30 cassandra30-tools ntp -y

## Activate Cassandra

1. Enable Cassandra on system boot and verify that it is running:

		systemctl enable cassandra
        	systemctl start cassandra
		systemctl -l status cassandra

3. Check the status of the Cassandra cluster:

        nodetool status

If `UN` is displayed in the output, the cluster is working. Your output should resemble this:

	Status=Up/Down
	|/ State=Normal/Leaving/Joining/Moving
	--  Address    Load       Tokens       Owns (effective)  Host ID                               Rack
	UN  127.0.0.1  103.51 KiB  256          100.0%            c43a2db6-8e5f-4b5e-8a83-d9b6764d923d  rack1


If you are receiving connection errors, open the `cassandra-env.sh` file in a text editor:

  **Ubuntu 17.04**

          vim /etc/cassandra/cassandra-env.sh

  **CentOS 7**

          vim /etc/cassandra/conf/cassandra-env.sh

Search for `-Djava.rmi.server.hostname=` in the file. Uncomment this line and add your loopback address or public IP address by replacing `<public name>` at the end of the line:

          JVM_OPTS="$JVM_OPTS -Djava.rmi.server.hostname=<public name>"

Restart Cassandra with `systemctl restart Cassandra` and check the node status `nodetool status`.

{{< note >}}
It may take a few seconds for Cassandra to refresh the configuration. If you receive another connection error, try waiting 15 seconds before rechecking the node status.
{{< /note >}}

### Configure Cassandra

#### Enable Security Features

1. Enable user login authentication. Make a backup of the Cassandra configuration file "cassandra.yaml."

{{< note >}}
The CentOS 7 installation already includes a backup file located at `/etc/cassandra/conf/cassandra.yaml.orig`.
{{< /note >}}

  **Ubuntu 17.04**

	cp /etc/cassandra/cassandra.yaml /etc/cassandra/cassandra.yaml.backup

2. Open "cassandra.yaml" in your preferred text editor:

		**Ubuntu 17.04**

			    vim /etc/cassandra/cassandra.yaml

		**CentOS 7**

			    vim /etc/cassandra/conf/cassandra.yaml

3. Match the following variables in the file to the values shown below. If any values are commented out, uncomment them. The rest of the properties found in the cassandra.yaml config file should be set based on your project's particular requirements and how you plan to utilize Cassandra. The default configuration should work well for development.

More information on this file can be found by following the *Cassandra .yaml Configuration File Overview* link in the "External Resources" section.

After editing the file restart Cassandra.

{{< file "Ubuntu /etc/cassandra/cassandra.yaml" yaml >}}
authenticator: org.apache.cassandra.auth.PasswordAuthenticator
authorizer: org.apache.cassandra.auth.CassandraAuthorizer
role_manager: CassandraRoleManager
roles_validity_in_ms: 0
permissions_validity_in_ms: 0

{{< /file >}}


### Add An Administration Superuser

1. Open the Cassandra command terminal by typing `cqlsh`. Login with the credentials shown below for the default user "Cassandra":

		cqlsh -u cassandra -p cassandra

2. Create a new superuser. Replace the brackets as well as the content inside with the applicable information:

		cassandra@cqlsh> CREATE ROLE [new_superuser] WITH PASSWORD = '[secure_password]' AND SUPERUSER = true AND LOGIN = true;

3. Log out by typing exit.

4. Log back in with the new superuser account using the new credentials, and remove the elevated permissions from the Cassandra account:

		superuser@cqlsh> ALTER ROLE cassandra WITH PASSWORD = 'cassandra' AND SUPERUSER = false AND LOGIN = false;

	    	superuser@cqlsh> REVOKE ALL PERMISSIONS ON ALL KEYSPACES FROM cassandra;

5. Grant all permissions to the new superuser account. Replace the brackets and contents inside with your superuser account username:

		superuser@cqlsh> GRANT ALL PERMISSIONS ON ALL KEYSPACES TO [superuser];

## Edit The Console Configuration File

The *cqlshrc* file holds configuration settings that influence user preferences on how Cassandra performs certain tasks. Before proceeding, switch from the "root" user to your administrative Linux user account (you need sudo privileges for this).

Since your Cassandra username and password can be stored here in plaintext, this should only be accessible to your administrative user account, and is designed to be inaccessible to other accounts on your Linux system. Do not set this up as the root user. Caution: Before proceeding, fully evaluate the security risks and consequences to your node cluster before adding the [Authentication] section.

1. Create the file *cqlshrc* using your preferred text editor. If the `~/.cassandra` directory does not exist, create it:

		      sudo mkdir ~/.cassandra
		      sudo vim ~/.cassandra/cqlshrc

2. Copy any sections below that you wish to add to your configuration. Details for this file can be found by following the "Cassandra cqlshrc File Configuration Overview" link in the "External Resources" section.

{{< note >}}
CentOS 7 users can find a sample file containing all the configuration options at `/etc/cassandra/conf/cqlshrc.sample`.
{{< /note >}}

{{< file ".cassandra/cqlshrc" aconf >}}
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

{{< /file >}}


3. Save and close the file. Update the file and directory with the following permissions:

	    	sudo chmod 1700 ~/.cassandra/cqlshrc
        	sudo chmod 700 ~/.cassandra

5. If you enabled the auto-login feature, login by typing `cqlsh`. The command terminal should open, and your superuser name should be visible in the command line.

## Rename the Cluster

Update your default cluster name from "Test Cluster" to your desired name.

1. Login to the control terminal with cqlsh. Replace [new_name] with your new cluster name:

		UPDATE system.local SET cluster_name = '[new_name]' WHERE KEY = 'local';

2. Edit the cassandra.yaml file and replace the value in the cluster_name variable with the new cluster name you just set.

3. Save and close.

  **Ubuntu 17.04**

	vim /etc/cassandra/cassandra.yaml


  **CentOS 7**

	vim /etc/cassandra/conf/cassandra.yaml

3. From the Linux terminal (not cqlsh), run `nodetool flush system`. This will clear the system cache and preserve all data in the node.

4. Restart Cassandra. Log in with cqlsh and verify the new cluster name is visible.

### Where To Go From Here

Be sure to check out the links in the "External Resources" section, which will help you further configure Cassandra to your needs, as well as provide resources to improve your understanding and ability to use Cassandra. To fully utilize the capabilities of Cassandra in a production setting, additional nodes should be added to your cluster. See the companion guide, "Deploy Additional Nodes To The Cassandra Cluster" to get started.
