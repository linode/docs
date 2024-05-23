---
title: "Deploy Apache Cassandra Cluster through the Linode Marketplace"
description: "Apache Cassandra is an open-source, distributed NoSQL database management system designed for handling large amounts of data across many commodity servers, providing high availability with no single point of failure. Cassandra offers robust support for clusters with asynchronous masterless replication allowing low-latency operations for all clients. "
published: 2024-04-26
keywords: ['nosql','database', 'marketplace', 'cassandra']
tags: ["ubuntu","marketplace", "database", "linode platform", "cloud manager", "ssl", "cloud storage", "high availability", "compute storage"]
external_resources:
- '[About Apache Cassandra](https://cassandra.apache.org/)'
- '[Apache Cassandra Documentation](https://cassandra.apache.org/doc/latest/cassandra/architecture/overview.html)'
---

## Cluster Deployment Architecture

Create a highly available Apache Cassandra cluster using through the Linode Marketplace. Apache Cassandra is an open-source, distributed NoSQL database management system designed for handling large amounts of data across many commodity servers, providing high availability with no single point of failure. Cassandra offers robust support for clusters with asynchronous masterless replication allowing low-latency operations for all clients. 

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Your Apache Cassandra cluster should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Suggested minimum plan:** All plan types and sizes can be used. For best results, use a minimum of 8GB Dedicated CPU or Shared Compute Instance is recommended. 

### Apache Cassandra Options

- **[Linode API Token](/docs/products/tools/api/guides/manage-api-tokens/#create-an-api-token):** The provisioner node will use an authenticated API token to create the additional components to the cluster. This is required to fully create the Apache Cassandra cluster.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

- **Cassandra Database User:** Enter your database super username for the Cassandra cluster

- **Number of clients connecting to Cassandra:** The number of clients that will be connecting to the cluster. The application will create SSL certificates for your client that need to connect to the cluster. This should be an interger equal or greater than 1.

- **Cassandra cluster size:** The size of the Cassandra cluster. One of 3 or 5 nodes.

- **Country or Region:** Enter the country or region for you or your organization.

- **State or Province:** Enter the state or province for you or your organization.

- **Locality:** Enter the town or other locality for you or your organization.

- **Organization:** Enter the name of your organization.

- **Email Address:** Enter the email address you wish to use for your certificate file.


## Getting Started After Deployment

Apache Cassandra is now installed and ready to use!

This playbook generates the client's SSL certificates and stores them on the first node in the cluster, labeled `cassandra1`, in the `/etc/cassandra/ssl` directory. You will need to transfer the certificates to your clients in order to connect to your cluster. 
Copy over the client certificate and keys, along with the root CA certificate, to the client server using a secure method such as SSH or a HTTPS encrypted webu UI. Once you login to the `cassandra1` node, the certificates can be found in the  
Be sure to replace the variable `$CLIENTIP` with the IP of the client server connected to the Cassandra cluster.

```
rsync -avp client1.key client1.crt rootCA.crt root@$CLIENTIP:/etc/cassandra/ssl
```

Next, you'll want to configure the `cqlshrc` file on the client server to access the Cassandra cluster. Best practice is to create and own this file with a limited sudo user, and place it in that sudo user's home directory. For example: `/home/$SUDO_USER/.cassandra/cqlsh`. 
A custom location can be specified with the `--cqlshrc` option. You can review the configuration options found in the link below:

https://github.com/apache/cassandra/blob/trunk/conf/cqlshrc.sample

A basic example to get started can look as follows:

```
[connection]
ssl = true
factory = cqlshlib.ssl.ssl_transport_factory
[ssl]
certfile= /etc/cassandra/ssl/rootCA.crt
userkey = /etc/cassandra/ssl/client1_key.key
usercert = /etc/cassandra/ssl/client1_cert.crt
validate = true

```
Next, ensure that you update the client's `/etc/hosts` so you have host resolution. For example:

```
192.168.139.160 cassandra1
192.168.201.13 cassandra2
192.168.230.83 cassandra3
```

From here you can test connection by logging into the `cassandra1` node from your client server. Replace `$DB-USER` with the Cassandra Database user entered before the deployment.

```
cqlsh cassandra1 -u $DB-USER -p --ssl
```

Repeat this process for the remainder of the client nodes.

## Software Included

The Apache Cassandra Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Apache Cassandra**](https://cassandra.apache.org/) | Open Source NoSQL Database. |
| [**UFW**](https://help.ubuntu.com/community/UFW) | Uncomplicated Firewall |

{{% content "marketplace-update-note-shortguide" %}}