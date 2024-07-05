---
title: "Deploy Apache Cassandra Cluster through the Linode Marketplace"
description: "Apache Cassandra is an open-source, distributed NoSQL database management system designed for handling large amounts of data across many commodity servers, providing high availability with no single point of failure. Cassandra offers robust support for clusters with asynchronous masterless replication allowing low-latency operations for all clients. "
published: 2024-07-22
keywords: ['nosql','database', 'marketplace', 'cassandra']
tags: ["ubuntu","marketplace", "database", "linode platform", "cloud manager", "ssl", "cloud storage", "high availability", "compute storage"]
external_resources:
- '[About Apache Cassandra](https://cassandra.apache.org/)'
- '[Apache Cassandra Documentation](https://cassandra.apache.org/doc/latest/cassandra/architecture/overview.html)'
---

## Cluster Deployment Architecture

Create a highly available Apache Cassandra cluster through the Linode Marketplace. Apache Cassandra is an open-source, distributed NoSQL database management system designed for handling large amounts of data across many commodity servers, providing high availability with no single point of failure. Cassandra offers robust support for clusters with asynchronous masterless replication, allowing low-latency operations for all clients. 

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Your Apache Cassandra cluster should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Suggested minimum plan:** All plan types and sizes can be used. For best results, a minimum of 8GB Dedicated CPU or Shared Compute Instance is recommended. 

### Apache Cassandra Options

- **[Linode API Token](/docs/products/tools/api/guides/manage-api-tokens/#create-an-api-token):** The provisioner node uses an authenticated API token to create the additional components to the cluster. This is required to fully create the Apache Cassandra cluster.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

- **Cassandra Database User:** Enter your database super username for the Cassandra cluster.

- **Number of clients connecting to Cassandra:** The number of clients that will be connecting to the cluster. The application will create SSL certificates for your clients that need to connect to the cluster. The number of clients should be an interger equal or greater than 1.

- **Cassandra cluster size:** The size of the Cassandra cluster

- **Country or Region:** Enter the country or region for you or your organization.

- **State or Province:** Enter the state or province for you or your organization.

- **Locality:** Enter the town or other locality for you or your organization.

- **Organization:** Enter the name of your organization.

- **Email Address:** Enter the email address you wish to use for your certificate file.


## Getting Started After Deployment

This Marketplace App creates a 3-5 node cluster using Apache Cassandra. Authentication to the cluster is secured via a user-supplied username. The default `cassandra` database role is removed and superseded by the new user role provided by the client. In addition, cluster communication is secured via SSL/TLS with self-signed keystores.

Both certificates and keystores can be found on every node in the `/etc/cassandra/ssl` directory. Only the first Cassandra server will have client certificates. This playbook also creates *_n_* amount of client certificates so that applications can connect to the Cassandra cluster.

### Connecting to Cassandra

Connect to Cassandra using `cqlsh` using client or server certificates. You will need 4 components to connect to the cluster:

- Username and password created by the playbook. You can find the credentials in `/home/$SUDO_USER/.credentials`, where `$SUDO_USER` is your sudo user used during deployment.
- Client certificate
- Client key
- CA certificate

1. On the client node, create the `/home/$SUDO_USER/cassandra_ssl` directory, where `$SUDO_USER` is your sudo user used during deployment.

2. From the first Cassandra node, securely transfer the following files and directories: `/etc/cassandra/ssl/cert/client1.crt`, `/etc/cassandra/ssl/cert/client1.crt` and `/etc/cassandra/ssl/ca/ca.crt` to the `/home/$SUDO_USER/cassandra_ssl` directory on the client node.

3. Create a Cassandra resource file to use our client certificate. Create the `/home/$SUDO_USER/.cassandra` directory. In the `.cassandra` directory, create a `cqlshrc` file with the following content:

```
[connection]
ssl = true
factory = cqlshlib.ssl.ssl_transport_factory
[ssl]
certfile = /home/$SUDO_USER/cassandra_ssl/ca.crt
userkey = /home/$SUDO_USER/cassandra_ssl/client1.key
usercert = /home/$SUDO_USER/cassandra_ssl/client1.crt
validate = true
```

4. Connect to one of the Cassandra servers using `cqlsh`:

```command
cqlsh 192.168.139.160 -u superuser --ssl
```

Replace `192.168.139.160` with the private IP address of one of the Cassandra nodes and `superuser` with the Cassandra database user you provided when deploying the cluster. Once you are connected, enter the password from `/home/$SUDO_USER/.credentials` at the prompt to authenticate to the cluster.

```output
Connected to Cassandra Cluster at 192.168.139.160:9042
[cqlsh 6.1.0 | Cassandra 4.1.5 | CQL spec 3.4.6 | Native protocol v5]
Use HELP for help.
superadmin@cqlsh>
```

You can distribute the remainder of client certifcates to the rest of the nodes.

## Software Included

The Apache Cassandra Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Apache Cassandra**](https://cassandra.apache.org/) | Open Source NoSQL Database. |
| [**UFW**](https://help.ubuntu.com/community/UFW) | Uncomplicated Firewall |

{{% content "marketplace-update-note-shortguide" %}}