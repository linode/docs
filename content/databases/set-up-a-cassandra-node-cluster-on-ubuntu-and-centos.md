---
author:
  name: Andrew Lescher
  email: docs@linode.com
description: This guide instructs you through the steps that deploy a production-ready Apache Cassandra node cluster on either Ubuntu 16.04 or CentOS 7.
keywords: ["cassandra", " apache-cassandra", " centos 7", " ubuntu 16.04", " database", " nosql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-06-24
modified: 2017-06-24
modified_by:
  name: Andrew Lescher
title: 'Set Up a Production-Ready Cassandra Node Cluster on Ubuntu 16.04 and CentOS 7'
aliases: ['databases/deploy-a-production-ready-cassandra-node-cluster-on-ubuntu-and-centos/']
contributor:
   name: Andrew Lescher
   link: https://www.linkedin.com/in/andrew-lescher-87027940/
external_resources:
 - '[How data is distributed across a cluster](https://docs.datastax.com/en/cassandra/2.1/cassandra/architecture/architectureDataDistributeDistribute_c.html)'
 - '[Client-to-node encryption](http://docs.datastax.com/en/cassandra/3.0/cassandra/configuration/secureSSLClientToNode.html)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

![Deploy A Production-Ready Cassandra Node Cluster on Ubuntu 16.04 and CentOS 7](/docs/assets/Cassandra/cass.png "Deploy A Production-Ready Cassandra Node Cluster on Ubuntu 16.04 and CentOS 7")

## What is Apache Cassandra

Apache Cassandra is an open-source application that is managed through a simple command line interface using the CQL language. CQL, or Cassandra Query Language, is syntactically similar to Structured Query Language, making it easy to pick up for those familiar with SQL.

Cassandra NoSQL databases are ideal for situations requiring maximum data redundancy and uptime, ease of horizontal scaling across multiple unique servers, and evolving project needs during the software development lifecycle, which would otherwise be heavily restricted by traditional relational database implementations.

This guide is [Part 2 in a series](/docs/databases/deploy-scalable-cassandra) detailing the implementation of Apache Cassandra on Ubuntu 16.04 and CentOS 7 distributions. To complete this guide, you must have at least two Cassandra nodes setup on two separate Linodes. By following these instructions, you will learn how to link your Cassandra nodes together to form a true cluster.

You will also learn how to secure communication between your nodes, as well as reinforce your cluster against typical failure points. The resulting cluster will be production-ready and configured for maximum uptime.

## Before You Begin

1. You must have at least two Cassandra nodes set up and configured according to the [Deploy A Scalable And Development-Driven NoSQL DB With Apache Cassandra](/docs/databases/deploy-scalable-cassandra) guide. The Cassandra nodes should have equal or similar hardware specs; otherwise, bottlenecks can occur.

2. A working firewall is a necessary security measure. Firewall-specific instructions will be presented for UFW, FirewallD, and IPtables. Steps for setting up UFW can be found at [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw). FirewallD instructions are located at [Introduction to FirewallD on CentOS](/docs/security/firewalls/introduction-to-firewalld-on-centos).

3. Most of the commands in this guide require root privileges in order to execute. You may work through the guide as-is if you can run the commands under the root account in your system. Alternatively, an elevated user account with sudo privileges can be used as long as each command is prefixed with `sudo`.

## Prepare the Cassandra Nodes for Clustering

The instructions here must be executed on each Cassandra node to be clustered. Apply the exact same configuration to each node, unless otherwise indicated.

1. Clear the default data from the Cassandra system table in order to import the new values set in the `cassandra.yaml` config file:

		systemctl stop cassandra
		rm -rf /var/lib/cassandra/data/system/*

2. Edit the `cassandra.yaml` file. Set the appropriate values for each variable indicated below:

         |  Property  | Explanation |
     |:----------:|:-----------:|
     | cluster_name | Choose your cluster name here. |
     | seed_provider | This contains a comma-delimited list of each public IP address of each node to be clustered. Input the list in the line that reads `- seeds: "127.0.0.1"`.  |
     | listen_address | Other nodes in the cluster will use the IP address listed here to find each other. Change from `localhost` to the specific node's public IP address. |
     | rpc_address | The listen address for client communication. Change from "localhost" to the public IP address or loopback address of the node. |
     | endpoint_snitch | Snitches determine how Cassandra replicates data. Change this to "GossipingPropertyFileSnitch," as this is more suitable to a multi-datacenter configuration. |
     | auto_bootstrap | Add this property anywhere in the file. If you have yet to add data to your nodes - that is, you would start with a fresh cluster - set this to "false." If your node(s) already contains data, **do not** add this property. |
     | num_tokens | This property defines the proportion of data stored on each node. For nodes with equal hardware capabilities, this number should be set equally between them so the data is more likely to be evenly distributed. The default value of 256 is likely to ensure equal data distribution. For more information on this topic, see the "How data is distributed across a cluster" link in the "External Resources" section. |

    {{< file "/etc/cassandra/conf/cassandra.yaml" >}}
cluster_name: '[Your Cluster Name]'
listen_address: [public_ip_address]
rpc_address: [public_ip_address]
num_tokens: 256
seed_provider:
  - class_name: org.apache.cassandra.locator.SimpleSeedProvider
parameters:
  - seeds: "[node1_ip_address],[node2_ip_address]"
endpoint_snitch: GossipingPropertyFileSnitch
auto_bootstrap: false

{{< /file >}}


3. Edit the `cassandra-rackdc.properties` file. Assign each node the same datacenter and rack name:

    {{< file "/etc/cassandra/conf/cassandra-rackdc.properties" properties >}}
# These properties are used with GossipingPropertyFileSnitch and will
# indicate the rack and dc for this node
dc=DC1
rack=RACK1

{{< /file >}}


## Edit Firewall Settings

### Open Cassandra Communication Ports

Ports `7000` and `9042` must be available for external nodes to connect to. As a security measure, limit connections to these ports to only the IP addresses of any other nodes in the cluster. Depending on your preference, you may use UFW, FirewallD, or iptables.

**UFW**

	ufw allow proto tcp from [external_node_ip_address] to any port 7000,9042 comment "Cassandra TCP"

**FirewallD**

	firewall-cmd --permanent --zone=public --add-rich-rule='
		rule family="ipv4"
		source address="[external_node_ip_address]"
		port protocol="tcp" port="7000" accept'

	firewall-cmd --permanent --zone=public --add-rich-rule='
		rule family="ipv4"
		source address="[external_node_ip_address]"
		port protocol="tcp" port="9042" accept'

	firewall-cmd --reload

**iptables**

	-A INPUT -p tcp -s [external_node_ip_address] -m multiport --dports 7000,9042 -m state --state NEW,ESTABLISHED -j ACCEPT

## Test the Cluster Setup

### Boot Cassandra

Start Cassandra on each node, one after another, with `systemctl start cassandra`. Run `nodetool status`, and you should see each node in your cluster listed in the output.

## Enable Node-to-Node Encryption

Setting up encryption between nodes offers additional security and protects the data that is transferred between Cassandra nodes. The commands in this section need only to be run on one node in your cluster, with the appropriate files then distributed across the rest of the cluster.

### Generate SSL Files

1. Create a new directory called `.keystore` in the Cassandra config directory. Navigate to the newly created directory:

        mkdir /etc/cassandra/conf/.keystore
        cd /etc/cassandra/conf/.keystore

2. Create a configuration file for openssl to help automate the certificate creation process. Copy the contents below into a new file called `rootCAcert.conf`. Replace the values for `examplePassword`, `US`, `WA`, `Seattle` with your specific information:

    {{< file "~/.keystore/rootCAcert.conf" aconf >}}
[ req ]
distinguished_name     = req_distinguished_name
prompt                 = no
output_password        = examplePassword
default_bits           = 4096

[ req_distinguished_name ]
C                      = US
ST                     = WA
L                      = Seattle
OU                     = Cluster_Name
CN                     = Cluster_Name_MasterCA

{{< /file >}}


3. Create the public and private key files.

		openssl req -config rootCAcert.conf -new -x509 -nodes -keyout ca-cert.key -out ca-cert.cert -days 365

4. Generate a keystore for each node in your cluster. Below, the command sequence is demonstrated as if two nodes comprised this cluster.

		keytool -genkeypair -keyalg RSA -alias node1 -keystore node1-keystore.jks -storepass cassandra -keypass cassandra -validity 365 -keysize 4096 -dname "CN=node1, OU=[cluster_name]"
	    keytool -genkeypair -keyalg RSA -alias node2 -keystore node2-keystore.jks -storepass cassandra -keypass cassandra -validity 365 -keysize 4096 -dname "CN=node2, OU=[cluster_name]"

5. Verify the key. A successful verification will print out the certificate fingerprint. Repeat this command for each certificate file.

		keytool -list -keystore node1-keystore.jks -storepass [password]

6. Generate the signing-request file. Repeat this command for each node in your cluster, using each .jks file for the `-keystore` option. Below, the command sequence is demonstrated as if two nodes comprised this cluster.

        keytool -certreq -keystore node1-keystore.jks -alias node1 -file node1-cert.csr -keypass cassandra -storepass cassandra -dname "CN=node1, OU=[cluster_name]"
	    keytool -certreq -keystore node2-keystore.jks -alias node2 -file node2-cert.csr -keypass cassandra -storepass cassandra -dname "CN=node2, OU=[cluster_name]"

7. Sign each node's certificate. Run the following command for each node in your cluster, using each .csr file you created earlier. Set the certificate to expire in 365 days for best practice. Below, the command sequence is demonstrated as if two nodes comprised this cluster.

		openssl x509 -req -CA ca-cert.cert -CAkey ca-cert.key -in node1-cert.csr -out node1-signed.cert -days 365 -CAcreateserial -passin pass:cassandra
		openssl x509 -req -CA ca-cert.cert -CAkey ca-cert.key -in node2-cert.csr -out node2-signed.cert -days 365 -CAcreateserial -passin pass:cassandra

8. Verify the certificates generated for each node.

		openssl verify -CAfile ca-cert.cert node1-signed.cert

9. Import the original certificate into the keystore for each node. Below, the command sequence is demonstrated as if two nodes comprised this cluster.

		keytool -importcert -keystore node1-keystore.jks -alias ca-cert -file ca-cert.cert -noprompt -keypass cassandra -storepass cassandra
		keytool -importcert -keystore node2-keystore.jks -alias ca-cert -file ca-cert.cert -noprompt -keypass cassandra -storepass cassandra

10. Now, import the signed certificate into the keystore for each node. Below, the command sequence is demonstrated as if two nodes comprised this cluster.

		keytool -importcert -keystore node1-keystore.jks -alias node1 -file node1-signed.cert -noprompt -keypass cassandra -storepass cassandra
		keytool -importcert -keystore node2-keystore.jks -alias node2 -file node2-signed.cert -noprompt -keypass cassandra -storepass cassandra

11. Create a Cassandra server truststore file. This essentially acts as a certificate authority, allowing all nodes whose client certificates were signed here to communicate.

		keytool -importcert -keystore cassandra-truststore.jks -alias truststore -file ca-cert.cert -noprompt -keypass [password] -storepass [password]

## Copy Files to Each Node in The Cluster

Copy the truststore file and keystore files into Cassandra's `conf` directory for each node. Depending on your installation, the `conf` directory could be located at `/etc/cassandra/conf`, or `/etc/cassandra`.

{{< note >}}
If you receive a "Permission denied" error upon executing the following command, your destination server user does not have permissions to access Cassandra's config directory.
{{< /note >}}

	scp ~/.keystore/cassandra-truststore.jks username@<dest_server_public_ip>:/cassandra/config/directory/cassandra-truststore.jks
    scp ~/.keystore/[Cluster_Name].jks username@<dest_server_public_ip>:/cassandra/config/directory/[Cluster_Name]-keystore.jks

Use the `-i` option if your destination server requires a certificate to login.

	scp -i /local_path/to/private_key_file ~/.keystore/cassandra-truststore.jks username@<dest_server_public_ip>:/cassandra/config/directory/cassandra-truststore.jks

## Configure Encryption Settings

Edit the `cassandra.yaml` file on each node to match the following. Replace text in [brackets] with the indicated information.

{{< file "/etc/cassandra/conf/cassandra.yaml" yaml >}}
server_encryption_options:
    internode_encryption: all
    keystore: /etc/cassandra/conf/[keystore_file.jks]
    keystore_password: cassandra
    truststore: /etc/cassandra/conf/[truststore_file.jks]
    truststore_password: cassandra
    # More advanced defaults below:
    protocol: TLS
    algorithm: SunX509
    store_type: JKS
    cipher_suites: [TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA]
    require_client_auth: true

{{< /file >}}


You may want to configure the *internode_encryption* setting to better meet the needs of your specific environment. A breakdown of available values are shown below:

 |  Property  | Property description |
 |:----------:|:-------------:|
 | all | All traffic between nodes is encrypted. |
 | none | No traffic is encrypted. |
 | dc | Only traffic between datacenters is encrypted. |
 | rack | Only traffic between server racks is encrypted. |

## Verify SSL Setup

Run the following commands on each server node.

1. Reboot Cassandra

        systemctl restart cassandra

2. Verify the nodes are online and communicating.

        nodetool status

3. Check log file to verify ssl encryption status.

        grep SSL /var/log/cassandra/system.log 2>&1 | tail -1

If successful, your console output should read similar to the following:

    INFO  [main] 2017-07-19 14:35:14,212 MessagingService.java:521 - Starting Encrypted Messaging Service on SSL port 7001

### Automate SSL Certificate Generation

If you have many Cassandra nodes for which to create and distribute certificates, the process outlined above can quickly become tedious. Now that you understand how SSL certificates are generated for Cassandra, the process can be automated with a bash script. You can [automate the process with a script](https://github.com/Darkstar90/cassandra-keygen). The rest of this guide shows you how to use the SSL certificate generator to automate the generation of SSL certificates.

1. Navigate to any folder and pull the script from Github:

        git pull https://github.com/Darkstar90/cassandra-keygen.git

2. Run the script with the `-h` or `--help` option:

	    bash cassandra-keygen.sh --help

3. The output of the command will demonstrate the capabilities of the script and define its usage. The script has 3 modes:

        a. Generate Node Certificates
        b. Import Node Certificates
        c. Generate Truststore

An example usage of each mode is demonstrated below, for a cluster of 6 nodes:

**Generate Node Certificates**

    bash cassandra-keygen.sh  --nodes 6 --directory /etc/cassandra/conf/.keystore --cluster Cassandra_Cluster --password cassandra --sslconfig /etc/cassandra/conf/rootCAcert.conf --keysize 4096

**Import Node Certificates**

    bash cassandra-keygen.sh -n 6 -d /etc/cassandra/conf/.keystore -p cassandra

**Generate Truststore**

    bash cassandra-keygen.sh --directory /etc/cassandra/conf/.keystore --truststore cassandra

**Do All Actions**

    bash cassandra-keygen.sh  --nodes 6 --directory /etc/cassandra/conf/.keystore --cluster Cassandra_Cluster --password cassandra --truststore cassandra --sslconfig /etc/cassandra/conf/rootCAcert.conf --keysize 4096

### Where to Go From Here

Now that your Cassandra cluster is up and running with node-to-node SSL encryption, you are prepared to deploy production-ready databases. Logging into each node in the cluster with `cqlsh` can also be accomplished with encryption. See the "[Client-to-node encryption]" link the external resources section for information on setting that up. [Client-to-node encryption](http://docs.datastax.com/en/cassandra/3.0/cassandra/configuration/secureSSLClientToNode.html)
