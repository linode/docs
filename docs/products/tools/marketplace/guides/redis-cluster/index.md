---
title: "Deploy a Redis Sentinel Cluster through the Linode Marketplace"
description: "This guide shows how you can install Redis database, a open-source, in-memory, data structure store, with optional write and persistence of data on a disk."
published: 2023-03-20
modified_by:
  name: Linode
keywords: ['redis','data store','cluster','database']
tags: ["linode platform","database","marketplace","cloud-manager"]
external_resources:
- '[Introduction to Redis Data Types](https://redis.io/topics/data-types-intro)'
- '[Redis Replication](https://redis.io/topics/replication)'
authors: ["Linode"]
---

[Redis](https://redis.io/) is an open-source, in-memory, data-structure store, with the optional ability to write and persist data to a disk, which can be used as a key-value database, cache, and message broker. Redis features built-in transactions, replication, and support for a variety of data structures such as strings, hashes, lists, sets, and others.

{{< note type="warning" title="Marketplace App Cluster Notice" >}}
This Marketplace App deploys 3 or 5 Compute Instances to create a highly available and redundant Redis cluster using Redis Sentinel, each with the plan type and size that you select. Please be aware that each of these Compute Instances will appear on your invoice as separate items. To instead deploy Redis on a single Compute Instance, see [Deploy Redis through the Linode Marketplace](/docs/products/tools/marketplace/guides/redis/).
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-app-cluster-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** The Redis cluster should be fully deployed and configured within 15-30 minutes after the first Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used, though consider using a [High Memory Compute Instance](https://www.linode.com/products/high-memory/) for larger databases in a production environment.

### Redis Sentinel Options

- **Linode API Token** *(required)*: Your API token is used to deploy additional Compute Instances as part of this cluster. At a minimum, this token must have Read/Write access to *Linodes*. If you do not yet have an API token, see [Get an API Access Token](/docs/products/tools/api/guides/manage-api-tokens/) to create one.

- **Limited sudo user** *(required)*: A limited user account with sudo access is created as part of this cluster deployment. Enter your preferred username for this limited user. Please note that the password is automatically created. See [Obtaining Usernames and Passwords](#obtaining-usernames-and-passwords).

- **Add SSH Keys to all nodes?** If you select *yes*, any SSH Keys that are added to the root user account (in the **SSH Keys** section), are also added to your limited user account on all deployed Compute Instances.

- **Redis cluster size:** Select the preferred size of your cluster from the available options (3 or 5). Please be aware that this creates the corresponding number of Compute Instances.

#### TLS/SSL Certificate Options

The following fields are used when creating your self-signed TLS/SSL certificate.

- **Country or region** *(required)*: Enter the country or region for you or your organization.
- **State or province** *(required)*: Enter the state or province for you or your organization.
- **Locality** *(required)*: Enter the town or other locality for you or your organization.
- **Organization** *(required)*: Enter the name of your organization.
- **Email address** *(required)*: Enter the email address you wish to use for your certificate file. This email address may receive notifications about the state of your certificate, including when it is expired.
- **CA Common name:** This is the common name for the self-signed Certificate Authority.
- **Common name:** This is the common name that is used for the domain.

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Obtaining Usernames and Passwords

After your cluster has been fully provisioned, use the instructs below to obtain and save passwords that were generated on your behalf during deployment.

1. Log in to your new Compute Instance through [Lish](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using the `root` user and the associated password you entered when creating the instance. If you opted to include your SSH keys as part of this deployment, you can also log in using those keys as either the `root` user or the limited user account you specified during deployment.

1. The passwords have been saved in a `.deployment-secrets.txt` file located in your user's home directory. You can view this file in your preferred text editor or through the `cat` command. In the command below, replace *[username]* with the limited sudo user you created during deployment.

    ```command
    cat /home/[username]/.deployment-secrets.txt
    ```

    The file contains your Redis credentials and your system's limited username and password.

    ```file {title="/home/[user]/.deployment-secrets.txt"}
    # BEGIN ANSIBLE MANAGED BLOCK
    # system user

    user: example-user
    password: R(9C!Iwp4dirlC<;~{7^$XMB#v\)yaB\

    # redis password
    redis-cli --askpass --tls --cacert /etc/redis/tls/ca.crt:
    7znrp73fCHjpislibge3tRi44tjNKSsTLoAHs1aSZRg=
    # END ANSIBLE MANAGED BLOCK
    ```

### Access the Redis CLI

1.  Log in to your new Compute Instance through [Lish](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using either the `root` user or limited user and the associated password you entered when creating the instance.

1.  To use the redis-cli, run either of the commands below:

    - `redis-cli`: This opens the interactive mode where you can type in whichever commands you wish.
    - `redis-cli [argument]`, where *[argument]* is the argument or command you wish to run. For instance, running `redis-cli ping` should result in the output of `PONG` if redis is configured properly.

For more information about the redis-cli and the commands you have available, see [redis-cli, the Redis command line interface](https://redis.io/topics/rediscli).

### Determining How to Use Redis

There are several types of Redis configurations you can use. For example, you can configure Redis as a standalone Redis installation or a Redis cluster with a primary (master) and two replicas. As a next step, you should determine which type of deployment you require for your use case by reviewing the resources provided below.

- Learn about Redis Clusters by going through their related [tutorial](https://redis.io/topics/cluster-tutorial).
- Redis Sentinel is another deployment configuration focused on high availability. See the [Redis Sentinel](https://redis.io/topics/sentinel) documentation for more details.
- Read the [Redis Quickstart](https://redis.io/topics/quickstart) to learn about securing Redis and installing client libraries to use Redis with your applications.
- Refer to the [Redis configuration documentation](https://redis.io/topics/config) to learn about the Redis configuration file.

Once you have determined how you would like to configure your Redis deployment, connect to your [Linode via SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance) to complete your configuration.

{{< content "marketplace-update-note-shortguide">}}
