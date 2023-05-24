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

SurrealDB offers a new approach to relational databases. SurrealDB brings features like all-in-one handling of database, API, and security layers; real-time queries; and multi-model data storage. All this while retaining a familiar SQL-like language.

In this tutorial, learn more about SurrealDB's offerings and how you can get started with this new database solution.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Why SurrealDB?

[SurrealDB](https://surrealdb.com/) is an ambitious database solution combining a suite of compelling features. Keeping the familiarity of relational databases, SurrealDB adds multi-model and real-time queries, high scalability, and configuration of all schema layers in one place.

SurrealDB stands as an ideal solution in many cases for serverless applications and for use cases that require high degrees of scalability. For serverless applications, SurrealDB's all-in-one schema handling lets you design APIs right alongside your databases. Web clients can then readily access those APIs, letting SurrealDB support Jamstack and other serverless web applications.

At the same time, SurrealDB has been designed with scalability in mind. It is built on Rust, giving it high performance. More than that though, SurrealDB's architecture and database handling places distributed systems at the forefront, making it ready for horizontal scaling.

Though not inclusive, here is a list of some of most compelling features SurrealDB has to offer.

- Handling of database, API, and security layers all in one place. SurrealDB does not require separate server-side applications to schematize and expose a client-facing API. You can do that right within SurrealDB, giving ready support to serverless applications like those using the Jamstack architecture. Moreover, SurrealDB includes a robust access-control system, further reducing your need to implement separate server-side tools and development.

- Implements a multi-model approach. SurrealDB retains the familiarity of SQL queries. At the same time, SurrealDB's queries can leverage inter-document relations and support multiple models. You can store data however you would like and retrieve it however you need. SurrealDB does not limit your models on either end and does not require you to finalize your models in advance.

- Supports real-time queries. SurrealDB can keep clients up-to-date with live push updates for changes in data. Clients can subscribe to queries, and SurrealDB leverages advanced filtering options to fine-tune what kinds of changes those clients get pushed live updates for.

- Uses a highly-scalable architecture. SurrealDB has been designed to support running your databases on distributed clusters, making it readily adaptable to your scaling needs. And SurrealDB's database operations are specially built to handle distributed operations without table or row locks.

## How to Install SurrealDB

To start with SurrealDB, you can install a standalone instance on your system. SurrealDB provides an installation script that makes the process straightforward. Follow along with the steps below to install your SurrealDB server, and then further on in the tutorial see how to start using it.

SurrealDB can also be [run as a Docker container](https://surrealdb.com/docs/installation/running/docker). This tutorial, however, focuses on a full installation of SurrealDB to give you a more versatile installation to work with.

1. Install Tar for extracting `tar` packages. This is required for part of the installation script's process.

    - On Debian and Ubuntu, install Tar using the APT package manager.

        ```command
        sudo apt install tar
        ```

    - On CentOS and similar RHEL-based systems, install Tar using the DNF package manager.

        ```command
        sudo dnf install tar
        ```

1. Run the installation script. cURL accesses the script via its URL, and the script's contents are piped to your shell to execute.

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

1. By default, the SurrealDB binary file is stored as `~/.surrealdb/surreal`. For easier access to the `surreal` command, you can move the binary to a directory on your shell path, like here.

    ```command
    sudo mv /home/example-user/.surrealdb/surreal /usr/local/bin
    ```

    You may find it useful to leave the `~/.surrealdb/` directory in place. The next section shows you SurrealDB's option to persist a database to a file, and the directory provides a convenient location.

## SurrealDB: The Basics

With your SurrealDB server installed, you can now getting started seeing its many features in action. Below, follow along to see how to start running your SurrealDB server and approaches for querying it from the command-line and from HTTP requests.

This tutorial keeps things simple, aiming to explore SurrealDB's bases and show how its queries stand out over traditional SQL and relational databases. But when you are ready, take a look at the links to our other SurrealDB tutorials in the conclusion to keep learning.

### Running the SurrealDB Server

To start using SurrealDB, you need to start up the database server. You can do this from the `surreal` binary's `start` command. Before running your server though, you need to decide how you want the data stored: in memory or in file.

The below shows two versions of a basic command for starting up your SurrealDB server, one for each of the kinds of storage options.

- To run SurrealDB using in-memory database storage, end your `start` command with `memory`. This option is exceptional for testing out SurrealDB, allowing you to get a feel for queries without committing to persistent data.

    ```command
    surreal start --user root --pass exampleRootPass memory
    ```

- To run SurrealDB using a database file for storage, end your `start` command with `file://<path>`, where `<path>` points to a `.db` file. The example here points to a `exampleDatabase.db` file (which does not yet exist) stored in the current user's (`example-user`'s) home directory. This uses the absolute path, so it begins with a `/`.

    ```command
    surreal start --user root --pass exampleRootPass file:///home/example-user/.surrealdb/exampleDatabase.db
    ```

```output
[...]
2022-12-31T22:23:24.252627Z  INFO surrealdb::net: Starting web server on 0.0.0.0:8000
2022-12-31T22:23:25.262728Z  INFO surrealdb::net: Started web server on 0.0.0.0:8000
[...]
```

Notice that both of the commands above have `--user` and `--pass` options. These define the root user credentials for your server instance, which you can use to for queries in later examples.

Likely before moving ahead with SurrealDB you want to implement a stricter security around this user — and to create other users with managed access. When you are ready for that, you can check out another of our tutorials, [Managing Security and Access Control for SurrealDB](/docs/guides/managing-security-and-access-for-surrealdb/).

#### Running on a Different Port

By default, SurrealDB runs on port `8000`. You can alter the port with the `--bind` option. This example runs the SurrealDB server on port `8080`.

```command
surreal start --bind 0.0.0.0:8080 --user root --pass exampleRootPass memory
```

The `--bind` option also lets you alter the address at which the SurrealDB server can be accessed. By default, the address is `0.0.0.0` as above. The server can thus be accessed from any address that accesses the server machine.

For the examples in this tutorial, you only need to access the SurrealDB server over `localhost` (`127.0.0.1`). So a good practice would be to just run the server there for testing purposes.

```command
surreal start --bind 127.0.0.1:8000 --user root --pass exampleRootPass memory
```

### Querying SurrealDB from the CLI

In addition to the server, the `surreal` binary includes a `sql` command to run SurrealDB's CLI tool. This provides ready access to your SurrealDB server and is probably the best way to get started trying out SurrealDB queries.

To start a SurrealDB CLI session, you can use a command like this one. This connects you to a SurrealDB server started with one of the examples commands above, except for the command that changes the default port.

```command
surreal sql --conn http://localhost:8000 --user root --pass exampleRootPass --ns exampleNs --db exampleDb --pretty
```

The command specifies a connection to a SurrealDB server running on `localhost`, and connects using the `root` user and the example password from above. Additionally, for this tutorial's purposes, the connection to the database server immediately initiates a `exampleNs` namespace and a `exampleDb` database.

The example CLI startup here also includes the optional `--pretty` option. This "pretty prints" the responses from the server, making the records easier to read and navigate.

From there, you can start executing queries on your SurrealDB database. These steps give you some examples, setting up a set of tables and records that do a lot to demonstrate some of SurrealDB's unique features.

1. Create a `tags` table to store tags for each blog post, and give a few starting values here.

    ```command
    INSERT INTO tags [
        { id: "first", value: "first" },
        { id: "last", value: "last" },
        { id: "post", value: "post" },
        { id: "test", value: "test" }
    ]
    ```

    SurrealDB automatically generates unique IDs, but by entering these manually you can make the records more intuitive to fetch. For instance, you can fetch the `last` tag above with the following command.

    ```command
    SELECT value FROM tags:last;
    ```

    SurrealDB's IDs consists of the record's ID — `last` in this case — and the table name — hence `tags:last`.

1. Create a set of blog posts into an `article` table. These just consist of defined IDs, titles, and body content. Date values are includes as well for easily sorting the records later.

    ```command
    INSERT INTO article [
        { id: "first", date: "2023-01-01T12:01:01Z", title: "First Post", body: "This is the first post." },
        { id: "second", date: "2023-02-01T13:02:02Z", title: "Second Post", body: "You are reading the second post." },
        { id: "third", date: "2023-03-01T14:03:03Z", title: "Third Post", body: "Here, the contents for the third post." }
    ];
    ```

    For those familiar with traditional SQL, the two `INSERT` statements above may seem unusual. SurrealDB supports the traditional `INSERT` syntax, but the syntax in this version condenses the command and is much more aligned with "document" database work.

1. Create some relations between the `article` records and `tags` records. This provides a nice way to "tag" the posts while also demonstrating SurrealDB's `RELATE` statement and how it can be used for managing inter-document relations.

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

    So to elaborate, the commands above result in the `first` article being associated with the `post`, `first`, and `test` tags. Later, you can see how you can create fresh and useful models from these relations.

Now you can take a look at what kinds of records your database has. To start, you can get all the records from the two base tables like this.

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

Of course, one of the key features of this setup is being able to relate article records to tags. Here is what that might look like. This next query essentially uses the `tagged` relations to create a new model, one that should prove much more useful for rendering the blog.

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

A SurrealDB server instance also maintains a set of HTTP endpoints. With these, applications of a wide range can query the database without the need of a separate server-side application.

This section aims to give some simple demonstrations of SurrealDB's HTTP endpoints using cURL from the command line.

Just as with starting up the SurrealDB CLI, HTTP requests do well to indicate the namespace and database upfront. For this, you can create a file with the header contents for your requests, making these easier to input.

```command
cat > surreal_header_file <<EOF
Accept: application/json
NS: exampleNs
DB: exampleDb
EOF
```

And now you can make your first HTTP query to the SurrealDB database. In the command below, notice that in addition to the header file, these HTTP queries need a `--user` option. This option provides your credentials into the database.

Also, for legibility, this and the next example pipe the cURL output through the jq tool to pretty print the JSON. You should be able to install that tool from your system's package manager.

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

But you can make plenty more advanced queries through the HTTP API — in fact, any SurrealDB query — using the `/sql` endpoint.

First, these queries become somewhat easier to manage with the query commands held in a dedicated file. Using the modeled query from the previous section, store that query in a file for access by the cURL command.

```file
cat > surreal_query_file <<EOF
SELECT id, title, body, ->tagged->tags.value AS tags, date FROM article ORDER BY date;
EOF
```

Now you can run the cURL request to fetch the modeled blog post data.

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

You now have your foundation in SurrealDB, and are ready to start making use of its powerful features as a database. To keep going with your foundations, you may want to start in on the official SurrealDB documentation, linked below.

After that, be sure to continue on to our other tutorials on SurrealDB, taking on more advanced and focused use cases. In particular, likely everyone should take on our [Managing Security and Access Control for SurrealDB](/docs/guides/managing-security-and-access-for-surrealdb/) tutorial next, ensuring a secure and controlled database server.

From there, take your pick based on your interests and needs:

- [Building an Web Application on Top of SurrealDB](/docs/guides/surrealdb-for-web-applications)

- [Modeling Data with SurrealDB’s Inter-document Relations](/docs/guides/surrealdb-interdocument-modeling)

- [Deploying a SurrealDB Cluster](/docs/guides/deploy-surrealdb-cluster/)
