---
title: "Deploy a MongoDB Cluster through the Linode Marketplace"
description: "This guide shows how you can deploy MongoDB, a database engine that provides access to non-relational, document-oriented databases, using the Linode Marketplace."
published: 2023-03-20
expiryDate: 2023-05-01
modified_by:
  name: Linode
keywords: ['mongodb','marketplace', 'database']
tags: ["linode platform","database","marketplace","cloud-manager"]
external_resources:
 - '[Official MongoDB Documentation](https://docs.mongodb.com/manual/)'
 - '[MongoDB Project](http://www.mongodb.org/)'
 - '[Language-Specific MongoDB Drivers](https://docs.mongodb.com/ecosystem/drivers/)'
authors: ["Linode"]
---

[MongoDB](https://www.mongodb.com/) is a database engine that provides access to non-relational, document-oriented databases. It is part of the growing [NoSQL](https://en.wikipedia.org/wiki/NoSQL) movement, along with databases like Redis and Cassandra (although there are vast differences among the many non-relational databases).

MongoDB seeks to provide an alternative to traditional relational database management systems (RDBMS). In addition to its schema-free design and scalable architecture, MongoDB provides a JSON output and specialized, language-specific bindings that make it particularly attractive for use in custom application development and rapid prototyping. MongoDB has been used in a number of large scale [production deployments](https://www.mongodb.com/community/deployments) and is currently one of the most popular database engines across all systems.

{{< note type="warning" title="Marketplace App Cluster Notice" >}}
This Marketplace App deploys 3 Compute Instances to create a highly available and redundant MongoDB cluster, each with the plan type and size that you select. Please be aware that each of these Compute Instances will appear on your invoice as separate items.
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-app-cluster-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** The MongoDB cluster should be fully deployed and configured within 5-10 minutes after the first Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used, though consider using a [High Memory Compute Instance](https://www.linode.com/products/high-memory/) for larger databases in a production environment.

### MongoDB Options

- **Linode API Token** *(required)*: Your API token is used to deploy additional Compute Instances as part of this cluster. At a minimum, this token must have Read/Write access to *Linodes*. If you do not yet have an API token, see [Get an API Access Token](/docs/products/tools/api/guides/manage-api-tokens/) to create one.

- **Limited sudo user** *(required)*: A limited user account with sudo access is created as part of this cluster deployment. Enter your preferred username for this limited user. Please note that the password is automatically created. See [Obtaining Usernames and Passwords](#obtaining-usernames-and-passwords).

- **Domain** *(required)*: The domain name you wish to use, such as *example.com*. This domain name is only used as part of the system's hostname and when creating the TLS/SSL certificate. No domain records are created within Linode's [DNS Manager](/docs/products/networking/dns-manager/).

- **Add SSH Keys to all nodes?** If you select *yes*, any SSH Keys that are added to the root user account (in the **SSH Keys** section), are also added to your limited user account on all deployed Compute Instances.

- **MongoDB cluster size:** This field cannot be edited, but is used to inform you of the number of Compute Instances that are created as part of this cluster.

#### TLS/SSL Certificate Options

The following fields (in addition to the domain field above) are used when creating your self-signed TLS/SSL certificate.

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

    The file contains your MongoDB admin username and password, the MongoDB root username and password, and your system's limited username and password.

    ```file {title="/home/[user]/.deployment-secrets.txt"}
    # BEGIN ANSIBLE MANAGED BLOCK
    # mongodb users

    user: mongo-admin
    password: 6nYPwXAtgM+xwAJCFlqjrr78/zuDF0+wd6xCCUwNpVk=

    user: mongo-root
    password: ltDpEM2AL1nS1j7L5JocZ7zj+7dXDSgTFDybdgaiGyU=

    user: example-user
    password: W?lXvW1dZ!o^?..Ea<[9Y9eN3)2MCIr*

    # SSL ca password
    mHGsxB@z{r(aCKmoJ<2U/cEg`
    # END ANSIBLE MANAGED BLOCK
    ```

### Access the MongoDB Shell

After MongoDB has finished deploying, you can access and administer it directly from the console.

1.  Log in to your Compute Instance via [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/).

1.  Launch the [mongo shell](https://docs.mongodb.com/v4.4/mongo/) by running the following command. When prompted, enter the admin user password you set when creating this instance.

    ```command
    mongo -u admin -p --authenticationDatabase admin
    ```

    The `-u`, `-p`, and `--authenticationDatabase` options in the above command are required in order to authenticate connections to the shell. Without authentication, the MongoDB shell can be accessed but will not allow connections to databases.

    The `admin` user is purely administrative based on the roles specified. It is defined as an administrator of users for all databases, but does not have any database permissions itself. You may use it to create additional users and define their roles. If you are using multiple applications with MongoDB, set up different users with custom permissions for their corresponding databases.

### Create a User Table

1.  As the `admin` user, create a new database to store regular user data for authentication. The following example calls this database `user-data`:

    ```command
    use user-data
    ```

1.  Permissions for different databases are handled in separate `roles` objects. This example creates the user, `example-user`, with read-only permissions for the `user-data` database and has read and write permissions for the `exampleDB` database that we'll create in the [Manage Data and Collections](#manage-data-and-collections) section below.

    Create a new, non-administrative user to enter test data. Change both `example-user` and `password` to something relevant and secure:

    ```command
    db.createUser({user: "example-user", pwd: "password", roles:[{role: "read", db: "user-data"}, {role:"readWrite", db: "exampleDB"}]})
    ```

    To create additional users, repeat this step as the administrative user, creating new usernames, passwords and roles by substituting the appropriate values.

1.  Exit the mongo shell:

    ```command
    quit()
    ```

For more information on access control and user management, as well as other tips on securing your databases, refer to the [MongoDB Security Documentation](https://docs.mongodb.com/manual/security).

### Manage Data and Collections

{{< content "mongodb-example-shortguide" >}}

## Next Steps

{{< content "marketplace-update-note-shortguide">}}

For more on MongoDB, checkout the following guides:

- [Creating a MongoDB Replica Set](/docs/guides/create-a-mongodb-replica-set/)
- [Building Database Clusters with MongoDB](/docs/guides/build-database-clusters-with-mongodb/)
