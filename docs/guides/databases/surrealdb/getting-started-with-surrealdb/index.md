---
slug: getting-started-with-surrealdb
title: "Getting Started with SurrealDB"
description: "SurrealDB brings new features to the relational database model, with an emphasis on supporting serverless applications and distributed infrastructures. Learn about SurrealDB and how to get started using it in this tutorial."
keywords: ['surrealdb examples','surrealdb performance','surrealdb authentication']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-05-16
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[SurrealDB Documentation](https://surrealdb.com/docs)'
---

SurrealDB offers a new approach to relational databases. It brings features like all-in-one handling of database, API, and security layers, real-time queries, and multi-model data storage. SurrealDB does all this while still retaining a familiar SQL-like language.

In this tutorial, learn more about SurrealDB's offerings and how you can get started with this new database solution.

## Why SurrealDB?

[SurrealDB](https://surrealdb.com/) is an ambitious database solution combining a suite of compelling features. Keeping the familiarity of relational databases, SurrealDB adds multi-model and real-time queries, high scalability, and configuration of all schema layers in one place.

SurrealDB is an ideal solution in many cases for serverless applications and for use cases that require a high degree of scalability. For serverless applications, SurrealDB's all-in-one schema handling lets you design APIs right alongside your databases. Web clients can then readily access those APIs, letting SurrealDB support Jamstack and other serverless web applications.

At the same time, SurrealDB has been designed with scalability in mind. It is built on Rust, giving it high performance. SurrealDB's architecture and database handling places distributed systems at the forefront, making it ready for horizontal scaling.

Though not complete, here is a list of some of most compelling features that SurrealDB has to offer:

-   **Handling of database, API, and security layers all in one place.** SurrealDB does not require separate server-side applications to schematize and expose a client-facing API. You can do that from right within SurrealDB, providing support to serverless applications like those using the Jamstack architecture. Moreover, SurrealDB includes a robust access-control system. This further reduces the need to implement separate server-side tools and development.

-   **Implements a multi-model approach.** SurrealDB retains the familiarity of SQL queries. At the same time, SurrealDB's queries can leverage inter-document relations and support multiple models. You can store data however you like, and retrieve it however you need. SurrealDB does not limit your models on either end, and does not require you to finalize your models in advance.

-   **Supports real-time queries.** SurrealDB can keep clients up-to-date with live push updates for changes in data. Clients can subscribe to queries, and SurrealDB leverages advanced filtering options to fine-tune what kinds of changes clients get live push updates for.

-   **Uses a highly-scalable architecture.** SurrealDB is designed to support running databases on distributed clusters, making it easily scalable. SurrealDB's database operations are specially built to handle distributed operations without table or row locks.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install SurrealDB

To start with SurrealDB, install a standalone instance on your system. SurrealDB provides an installation script that makes the process straightforward. Follow along with the steps below to install the SurrealDB server, then keep reading to learn how to use it.

{{< note >}}
SurrealDB can also be [run as a Docker container](https://surrealdb.com/docs/installation/running/docker). This tutorial, however, focuses on a full installation of SurrealDB to provide a more versatile installation to work with.
{{< /note >}}

1.  Install Tar to extract `tar` packages. This is required for part of the installation script's process.

    {{< tabs >}}
    {{< tab "Debian and Ubuntu" >}}
    ```command
    sudo apt install tar
    ```
    {{< /tab >}}
    {{< tab "AlmaLinux, CentOS Stream, and Rocky Linux" >}}
    ```command
    sudo dnf install tar
    ```{{< /tab >}}
    {{< /tabs >}}

1.  Run the installation script. cURL accesses the script via its URL, the script's contents are then piped to your shell for execution.

    ```command
    curl -sSf https://install.surrealdb.com | sh
    ```

    ```output
     .d8888b.                                             888 8888888b.  888888b.
    d88P  Y88b                                            888 888  'Y88b 888  '88b
    Y88b.                                                 888 888    888 888  .88P
     'Y888b.   888  888 888d888 888d888  .d88b.   8888b.  888 888    888 8888888K.
        'Y88b. 888  888 888P'   888P'   d8P  Y8b     '88b 888 888    888 888  'Y88b
          '888 888  888 888     888     88888888 .d888888 888 888    888 888    888
    Y88b  d88P Y88b 888 888     888     Y8b.     888  888 888 888  .d88P 888   d88P
     'Y8888P'   'Y88888 888     888      'Y8888  'Y888888 888 8888888P'  8888888P'

    Fetching the latest database version...
    Fetching the host system architecture...

    [...]

    SurrealDB successfully installed in:
      /home/example-user/.surrealdb/surreal

    [...]
    ```

1.  By default, the SurrealDB binary file is stored at `~/.surrealdb/surreal`. For easier access to the `surreal` command, move the binary to a directory on your shell path such as:

    ```command
    sudo mv /home/example-user/.surrealdb/surreal /usr/local/bin
    ```

    Make sure to change `example-user` to your actual username.

    Leave the `~/.surrealdb/` directory in place. The next section showcases SurrealDB's option to persist a database to a file, and the directory provides a convenient location.

## SurrealDB: The Basics

With the SurrealDB server installed, you can begin to explore its many features. Follow along below to start running the SurrealDB server. Subsequent sections detail approaches for querying it from both the command line and HTTP requests.

This tutorial explores SurrealDB's basics, and shows how its queries stand out from traditional SQL and relational databases. To learn more, check out the links to our other SurrealDB tutorials in the conclusion.

### Running the SurrealDB Server

To start using SurrealDB, you must first start the database server. You can do this from the `surreal` binary's `start` command. However, before starting the server, you need to decide how to store data: in memory or in a file.

Below are two versions of a basic command for starting up the SurrealDB server, one for each of the kinds of storage options:

-   **Memory**: To run SurrealDB using in-memory database storage, end the `start` command with `memory`. This option is exceptional for testing out SurrealDB, allowing you to get a feel for queries without committing to persistent data.

    ```command
    surreal start --user root --pass exampleRootPass memory
    ```

-   **File**: To run SurrealDB using a database file for storage, end the `start` command with `file://<path>`, where `<path>` points to a `.db` file. The example here points to a `exampleDatabase.db` file (which does not yet exist) stored in the current user's (`example-user`) home directory. This uses the absolute path, so it begins with a `/`. Make sure to change `example-user` to your actual username.

    ```command
    surreal start --user root --pass exampleRootPass file:///home/example-user/.surrealdb/exampleDatabase.db
    ```

```output
[...]
2022-12-31T22:23:24.252627Z  INFO surrealdb::net: Starting web server on 0.0.0.0:8000
2022-12-31T22:23:25.262728Z  INFO surrealdb::net: Started web server on 0.0.0.0:8000
[...]
```

Notice that both of the commands have `--user` and `--pass` options. These define the root user credentials for your server instance, which you can use for queries in later examples.

Before moving ahead with SurrealDB, you likely want to implement stricter security around this user, and to create other users with managed access. If so, check out our tutorial [Managing Security and Access Control for SurrealDB](/docs/guides/managing-security-and-access-for-surrealdb/).

#### Running on a Different Port

By default, SurrealDB runs on port `8000`. You can alter the port with the `--bind` option. This example runs the SurrealDB server on port `8080`:

```command
surreal start --bind 0.0.0.0:8080 --user root --pass exampleRootPass memory
```

The `--bind` option also lets you alter the address at which the SurrealDB server can be accessed. By default, the address is `0.0.0.0` as above. The server can thus be accessed from any address that accesses the server machine.

The examples in this tutorial only need to access the SurrealDB server over `localhost` (`127.0.0.1`). It's good practice to only run the server there for testing purposes:

```command
surreal start --bind 127.0.0.1:8000 --user root --pass exampleRootPass memory
```

### Querying SurrealDB from the CLI

In addition to the server, the `surreal` binary includes an `sql` command to run SurrealDB's CLI tool. This provides easy access to the SurrealDB server and is probably the best way to learn SurrealDB queries.

1.  To start a SurrealDB CLI session, use a command like the one below. This connects to a SurrealDB server started with one of the examples commands above (except for the one that changes the default port).

    ```command
    surreal sql --conn http://localhost:8000 --user root --pass exampleRootPass --ns exampleNs --db exampleDb --pretty
    ```

    The command specifies a connection to a SurrealDB server running on `localhost`, and connects using the `root` user and the example password from above. Additionally, for this tutorial's purposes, the connection to the database server immediately initiates a `exampleNs` namespace and a `exampleDb` database.

    The example CLI startup here also includes the `--pretty` option. This "pretty prints" responses from the server, making them easier to read and navigate.

    From there, you can start executing queries on your SurrealDB database. These steps provide some examples that set up a set of tables and records. These do a lot to demonstrate some of SurrealDB's unique features.

1.  Create a `tags` table to store tags for each blog post and provide a few starting values:

    ```command
    INSERT INTO tags [
        { id: "first", value: "first" },
        { id: "last", value: "last" },
        { id: "post", value: "post" },
        { id: "test", value: "test" }
    ];
    ```

1.  SurrealDB automatically generates unique IDs, but entering these manually makes the records more intuitive to fetch. For instance, you can fetch the `last` tag above with the following command:

    ```command
    SELECT value FROM tags:last;
    ```

    ```output
    {
      value: 'last'
    }
    ```

    SurrealDB IDs consist of the record's ID, `last` in this case, and the table name, hence `tags:last`.

1.  Create a set of blog posts in an `article` table. These consist of defined IDs, titles, and body content. Date values are included as well for easily sorting the records later.

    ```command
    INSERT INTO article [
        { id: "first", date: "2023-01-01T12:01:01Z", title: "First Post", body: "This is the first post." },
        { id: "second", date: "2023-02-01T13:02:02Z", title: "Second Post", body: "You are reading the second post." },
        { id: "third", date: "2023-03-01T14:03:03Z", title: "Third Post", body: "Here, the contents for the third post." }
    ];
    ```

    For those familiar with traditional SQL, the two `INSERT` statements above may seem unusual. SurrealDB supports the traditional `INSERT` syntax, but the syntax in this version condenses the command and is more aligned with "document" database work.

1.  Create some relations between the `article` records and `tags` records. This provides a nice way to "tag" the posts while also demonstrating how SurrealDB's `RELATE` statement can be used for managing inter-document relations.

    ```command
    RELATE article:first->tagged->tags:post;
    RELATE article:first->tagged->tags:first;
    RELATE article:first->tagged->tags:test;

    RELATE article:second->tagged->tags:post;
    RELATE article:second->tagged->tags:test;

    RELATE article:third->tagged->tags:post;
    RELATE article:third->tagged->tags:last;
    RELATE article:third->tagged->tags:test;
    ```

    To elaborate, the commands above result in the `first` article being associated with the `post`, `first`, and `test` tags. See how to create fresh and useful models from these relations later on.

1.  Now take a look at what kinds of records your database has. To start, get all the records from the `article` base table:

    ```command
    SELECT id, title, body FROM article;
    ```

    ```output
    [
        {
            body: 'This is the first post.',
            id: article:first,
            title: 'First Post'
        },
        {
            body: 'You are reading the second post.',
            id: article:second,
            title: 'Second Post'
        },
        {
            body: 'Here, the contents for the third post.',
            id: article:third,
            title: 'Third Post'
        }
    ]
    ```

1.  Now do the same for `tags`:

    ```command
    SELECT id, value FROM tags;
    ```

    ```output
    [
        {
            id: tags:first,
            value: 'first'
        },
        {
            id: tags:last,
            value: 'last'
        },
        {
            id: tags:post,
            value: 'post'
        },
        {
            id: tags:test,
            value: 'test'
        }
    ]
    ```

1.  One of the key features of this setup is being able to relate article records to tags. This next query essentially uses the `tagged` relations to create a new model, one that should prove much more useful for rendering the blog:

    ```command
    SELECT id, title, body, ->tagged->tags.value AS tags, date FROM article ORDER BY date;
    ```

    ``` output
    [
        {
            body: 'This is the first post.',
            date: '2023-01-01T12:01:01Z',
            id: article:first,
            tags: [
                'post',
                'test',
                'first'
            ],
            title: 'First Post'
        },
        {
            body: 'You are reading the second post.',
            date: '2023-02-01T13:02:02Z',
            id: article:second,
            tags: [
                'post',
                'test'
            ],
            title: 'Second Post'
        },
        {
            body: 'Here, the contents for the third post.',
            date: '2023-03-01T14:03:03Z',
            id: article:third,
            tags: [
                'test',
                'last',
                'post'
            ],
            title: 'Third Post'
        }
    ]
    ```

### Querying SurrealDB Using HTTP

A SurrealDB server instance also maintains a set of HTTP endpoints. With these, a wide range of applications can query the database without needing a separate server-side application.

This section provides some simple demonstrations of SurrealDB's HTTP endpoints using cURL from the command line.

1.  For legibility, the following two examples pipe the cURL output through the `jq` tool to pretty print the JSON. You can install the `jq` tool from your system's package manager:

    {{< tabs >}}
    {{< tab "Debian and Ubuntu" >}}
    ```command
    sudo apt install jq
    ```
    {{< /tab >}}
    {{< tab "AlmaLinux, CentOS Stream, and Rocky Linux" >}}
    ```command
    sudo dnf install jq
    ```
    {{< /tab >}}
    {{< /tabs >}}

1.  Just like starting up the SurrealDB CLI, it's best to indicate the namespace and database upfront with HTTP requests. For this, create a file with the header contents for your requests, which makes these easier to input:

    ```command
    cat > surreal_header_file <<EOF
    Accept: application/json
    NS: exampleNs
    DB: exampleDb
    EOF
    ```

1.  Now you can make your first HTTP query to the SurrealDB database. In the command below, notice that in addition to the header file, these HTTP queries need a `--user` option. This option provides your credentials for the database.

    ```command
    curl -X GET -H "@surreal_header_file" --user "root:exampleRootPass" http://localhost:8000/key/article/first | jq
    ```

    ```output
    [
      {
        "time": "144.031µs",
        "status": "OK",
        "result": [
          {
            "body": "This is the first post.",
            "date": "2023-01-01T12:01:01Z",
            "id": "article:first",
            "title": "First Post"
          }
        ]
      }
    ]
    ```

    The above is one of the simplest queries available. SurrealDB makes dedicated endpoints available on the `/key` path that let you query by table (`article`) and ID (`first`).

    You can make any SurrealDB query through the HTTP API using the `/sql` endpoint.

1.  These queries are somewhat easier to manage with the query commands held in a dedicated file. Using the modeled query from the previous section, store that query in a file for access by the cURL command:

    ```file
    cat > surreal_query_file <<EOF
    SELECT id, title, body, ->tagged->tags.value AS tags, date FROM article ORDER BY date;
    EOF
    ```

1.  Now run the cURL request to fetch the modeled blog post data:

    ```command
    curl -X POST -H "@surreal_header_file" --user "root:exampleRootPass" --data-binary "@surreal_query_file" http://localhost:8000/sql | jq
    ```

    ```output
    [
      {
        "time": "828.056µs",
        "status": "OK",
        "result": [
          {
            "body": "This is the first post.",
            "date": "2023-01-01T12:01:01Z",
            "id": "article:first",
            "tags": [
              "post",
              "test",
              "first"
            ],
            "title": "First Post"
          },
          {
            "body": "You are reading the second post.",
            "date": "2023-02-01T13:02:02Z",
            "id": "article:second",
            "tags": [
              "post",
              "test"
            ],
            "title": "Second Post"
          },
          {
            "body": "Here, the contents for the third post.",
            "date": "2023-03-01T14:03:03Z",
            "id": "article:third",
            "tags": [
              "test",
              "last",
              "post"
            ],
            "title": "Third Post"
          }
        ]
      }
    ]
    ```

## Conclusion

You now have a foundation in SurrealDB and are ready to start making use of its powerful features as a database. To build on these foundations, you may want to start with the official SurrealDB documentation linked below.

Afterwards, continue reading our other tutorials on SurrealDB. These tackle more advanced and focused use cases. In particular, everyone should follow our [Managing Security and Access Control for SurrealDB](/docs/guides/managing-security-and-access-for-surrealdb/) tutorial next, ensuring a secure and controlled database server.

From there, take your pick based on your interests and needs:

-   [Deploying a SurrealDB Cluster](/docs/guides/deploy-surrealdb-cluster/)
-   [Building an Web Application on Top of SurrealDB](/docs/guides/surrealdb-for-web-applications)
-   [Modeling Data with SurrealDB’s Inter-document Relations](/docs/guides/surrealdb-interdocument-modeling)