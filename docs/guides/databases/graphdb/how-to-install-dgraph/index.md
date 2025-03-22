---
slug: how-to-install-dgraph
author:
  name: Rajakavitha Kodhandapani
  email: docs@linode.com
description: 'Install Dgraph on Ubuntu 22.04.'
keywords: ["nosql", "graph database", "graph", "dgraph", "ubuntu", "dgraph tutorial"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2016-05-20
title: 'Installing Dgraph on Ubuntu 22.04'
title_meta: 'How To Install Dgraph on Ubuntu 22.04'
external_resources:
 - '[Official Dgraph Documentation](https://dgraph.io/docs)'
 - '[GraphQL](https://graphql.org)'
relations:
    platform:
        key: how-to-install-dgraph
        keywords:
            - distribution: Ubuntu 22.04
tags: ["ubuntu","graph database","nosql"]
---

In this Dgraph tutorial, learn how to install the database on Ubuntu 22.04, add a schema and access the GraphQL endpoint.

Graph databases are databases explicitly designed for the analysis of relationships. You can use graph databases if you are interested in the analysis of relationships between data — not to build the data store for your typical backend application.

Dgraph is an open-source, scalable, distributed, highly available and fast graph database, designed from the ground up to be run in production.

Dgraph consists of different nodes such as Zero, Alpha, and Ratel each node serves a different purpose.

* Dgraph Zero control the Dgraph database cluster. It assigns Alpha nodes to groups, re-balances data between groups, handles transaction timestamp and UID assignment.
* Dgraph Alpha hosts predicates and indexes. Predicates are either the properties associated with a node or the relationship between two nodes. Indexes are the tokens that can be associated with the predicates to enable filtering using appropriate functions.
* Ratel is the UI to run queries, mutations, and altering schema.


## Before You Begin

- Familiarize yourself with our [Getting Started](/docs/guides/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

- Complete the sections of our [Securing Your Server](/docs/guides/set-up-and-secure/) to create a standard user account, harden SSH access and remove unnecessary network services.

- Update your system:

        sudo apt-get update && sudo apt-get upgrade

- Install [Docker Engine](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/)

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Dgraph

You can install Dgraph using the Docker Compose.

1. If you not already installed Docker Compose, install it using:

       sudo apt install docker-compose

1. Download the Dgraph `docker-compose.yml` file:

       wget https://github.com/dgraph-io/dgraph/raw/main/contrib/config/docker/docker-compose.yml

   By default only the localhost IP 127.0.0.1 is allowed. When you run Dgraph on Docker, the containers are assigned IPs and those IPs need to be added to the allowed list.

1. Add a list of IPs allowed for Dgraph so that you can create the schema. Use an editor of your choice and add the `<ip_address>` of the local host in `docker-compose.yml` file:
{{< file "/docker-compose.yml">}}
# This Docker Compose file can be used to quickly bootup Dgraph Zero
# and Alpha in different Docker containers.

# It mounts /tmp/data on the host machine to /dgraph within the
# container. You will need to change /tmp/data to a more appropriate location.
# Run `docker-compose up` to start Dgraph.

version: "3.2"
services:
  zero:
    image: dgraph/dgraph:latest
    volumes:
      - /tmp/data:/dgraph
    ports:
      - 5080:5080
      - 6080:6080
    restart: on-failure
    command: dgraph zero --my=zero:5080
  alpha:
    image: dgraph/dgraph:latest
    volumes:
      - /tmp/data:/dgraph
    ports:
      - 8080:8080
      - 9080:9080
    restart: on-failure
    command: dgraph alpha --my=alpha:7080 --zero=zero:5080 --security whitelist=<ip_address>
  ratel:
    image: dgraph/ratel:latest
    ports:
      - 8000:8000


{{< /file >}}
1. Run the `docker-compose` command to start the Dgraph services in the docker container:

       sudo docker-compose up

   After Dgraph is installed on Docker, you can view the images and the containers running in Docker for Dgraph.

1. View the containers running for Dgraph using:

       sudo docker ps -a

    An output similar to the following appears:

   {{< output >}}
   CONTAINER ID   IMAGE                  COMMAND                  CREATED
   4b67157933b6   dgraph/dgraph:latest   "dgraph zero --my=ze…"   2 days ago
   3faf9bba3a5b   dgraph/ratel:latest    "/usr/local/bin/dgra…"   2 days ago
   a6b5823b668d   dgraph/dgraph:latest   "dgraph alpha --my=a…"   2 days ago
   {{< /output >}}

1. To access the Ratel UI for queries, mutations, and altering schema, open your web browser and navigate to `http://<LINODE_IP_ADDRESS>:8000`.
1. Click **Launch Latest** to access the latest stable release of Ratel UI.
1. In the **Dgraph Server Connection** dialog that set the **Dgraph server URL** as `http://<LINODE_IP_ADDRESS>:8080`
1. Click **Connect** . The connection health appears green.
1. Click **Continue** to query or run mutations.

## Get Started with Dgraph

1. Use an editor of your choice and add the following content in file named `schema.graphql`, to create a schema on a local computer:

   {{< file "/schema.graphql" >}}
type Product {
    productID: ID!
    name: String @search(by: [term])
    reviews: [Review] @hasInverse(field: about)
}

type Customer {
    username: String! @id @search(by: [hash, regexp])
    reviews: [Review] @hasInverse(field: by)
}

type Review {
    id: ID!
    about: Product!
    by: Customer!
    comment: String @search(by: [fulltext])
    rating: Int @search
}

{{< /file >}}

1. Add this schema to Dgraph using the following command:

       curl -X POST <LINODE_IP_ADDRESS>:8080/admin/schema --data-binary '@schema.graphql'

    When the schema is added successfully a message similar to the following appears:

       {"data":{"code":"Success","message":"Done"}}%

  In the Ratel UI go to **Schema** and the schema that you added appears in **Schema**.

## GraphQL Mutations

You can access that GraphQL endpoint with any of the great GraphQL developer tools such as GraphQL Playground, Insomnia, GraphiQL and Altair. The GraphQL endpoint is `http://<LINODE_IP_ADDRESS>:8080/graphql`. For more information about getting started with GraphQL mutations and queries, see the Dgraph [quick start guide](https://dgraph.io/docs/graphql/quick-start/#graphql-mutations).