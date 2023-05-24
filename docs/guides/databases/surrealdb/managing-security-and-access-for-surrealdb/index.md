---
slug: managing-security-and-access-for-surrealdb
title: "Managing Security and Access Control for SurrealDB"
description: "Before moving to production, you need to secure your SurrealDB. Fortunately, SurrealDB features robust access control configurations and API. See how to lock-down your SurrealDB server and set up user access in this tutorial."
keywords: ['surrealdb tutorial','surrealdb client','surrealdb authentication']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-05-24
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[SurrealDB Documentation](https://surrealdb.com/docs)'
---

SurrealDB gives you a new approach to relational databases, with all-in-one database, API, and access control. Once you have your SurrealDB instance running and you have a grasp of the basic, likely you want to start securing your instance.

SurrealDB comes with a suite of features ready to both secure your instance and give you powerful and flexible access control. Learn all about these features in this tutorial. See both how to secure your instance with limited user logins and how SurrealDB can implement a custom user-management solution for your applications.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Secure SurrealDB

The first step after provisioning and getting familiar with your SurrealDB instance should be learning how to run it securely. Typically, you run the SurrealDB server with a root user during this initial provisioning and experimenting stage. But to really control your instance's access, you should create limited users and only include a root user in limited circumstances.

Here, you can see just how to star working with limited users on your SurrealDB instance and how to regulate root access.

### Setting Up SurrealDB

For this tutorial, you need to have installed SurrealDB on your system and placed the SurrealDB binary in your shell path. Follow along with our [Getting Started with SurrealDB](/docs/guides/getting-started-with-surrealdb/) guide to see how you can.

The tutorial assumes you have followed that guide up through the *How to Install SurrealDB* section, with SurrealDB installed and accessible via the `surreal` command.

Additionally, examples throughout assume you have set up the database with the sample records provided in the guide linked above. For convenience, here is a set of SurrealQL commands that you can run on your instance to provide it with the sample records.

```command
INSERT INTO tags [
    { id: "first", value: "first" },
    { id: "last", value: "last" },
    { id: "post", value: "post" },
    { id: "test", value: "test" }
];


INSERT INTO article [
    { id: "first", date: "2023-01-01T12:01:01Z", title: "First Post", body: "This is the first post." },
    { id: "second", date: "2023-02-01T13:02:02Z", title: "Second Post", body: "You are reading the second post." },
    { id: "third", date: "2023-03-01T14:03:03Z", title: "Third Post", body: "Here, the contents for the third post." }
];

RELATE article:first->tagged->tags:post;
RELATE article:first->tagged->tags:first;
RELATE article:first->tagged->tags:test;

RELATE article:second->tagged->tags:post;
RELATE article:second->tagged->tags:test;

RELATE article:third->tagged->tags:post;
RELATE article:third->tagged->tags:last;
RELATE article:third->tagged->tags:test;
```

### Running SurrealDB Server Securely

You may have noticed in the guide linked above that typically you start the SurrealDB server with a root username and password. But root credentials input in this way may be visible in plain text, presenting a potential security risk.

By intention, SurrealDB is only meant to be run in this way for initial setup purposes. During that period, you can limit access to `localhost`, where your credentials are more secure.

Once your instance's basic needs are configured, you should actually run the SurrealDB server without a root user at all. Running the `surreal start` command to start up your SurrealDB server, you can leave off the `--user` and `--pass` options to disable root access.

So how, in that case, do you access data? Using limited users created within particular namespaces and databases. Such users give you access to the server while keeping each set of credentials limited to one namespace or database.

What follows is an example process for setting up a limited user on your SurrealDB server. This example names the user `exampleUser` and relegates their access to the database level, specifically within `exampleDb`.

1. Start up the server just as shown in the [Getting Started](/docs/guides/getting-started-with-surrealdb/#running-the-surrealdb-server) guide linked above, using a root user and password. This example initially limits the server to `localhost` (`127.0.0.1`), limiting external access. The example also stores the database as a file.

    ```command
    surreal start --bind 127.0.0.1:8000 --user root --pass exampleRootPass file:///home/example-user/.surrealdb/exampleSurreal.db
    ```

1. Open the SurrealDB CLI for entering SurrealQL commands. Using the above server startup, you could do this with a command like the one shown here. This example command also starts the CLI session out in a particular namespace and database.

    ```command
    surreal sql --conn http://localhost:8000 --user root --pass exampleRootPass --ns exampleNs --db exampleDb
    ```

    Technically you do not need to access the CLI — you could instead send commands as HTTP requests. However, the CLI provides a convenient method for entering commands during this stage of server provisioning.

1. Enter any SurrealQL command for initially populating the database or setting up schemas. For the examples in this tutorial, this would just mean running the commands provided in the previous section for setting up sample data.

1. Define a new SurrealDB limited user. The command below provides a basic example for a database-level user. You can learn more about this command's usage in the section on [Creating a New SurrealDB User](/docs/guides/managing-security-and-access-for-surrealdb/#creating-a-new-surrealdb-user) further on.

    ```command
    DEFINE LOGIN exampleUser ON DATABASE PASSWORD 'examplePass';
    ```

1. Shut down the SurrealDB CLI and server each with the <kbd>Ctrl</kbd> + <kbd>C</kbd> key combination.

1. Start up a new SurrealDB server using the same database source, but without defining a root user or root user password. Based on the example above, here is another example command doing just that.

    ```command
    surreal start --bind 0.0.0.0:8000 file:///home/example-user/.surrealdb/exampleDb.db
    ```

    Notice, too, that this command does not bind the server to `localhost`. Instead, it opens access to any address matching this system. This readies the server for external access.

You can now use the limited user to access the SurrealDB server's APIs. You can learn more about doing so in the section on [Accessing SurrealDB as a Limited User](/docs/guides/managing-security-and-access-for-surrealdb/#accessing-surrealdb-as-a-limited-user) further on.

But to get started, here is a simple example that fetches information about the database using the SurrealDB server's `/sql` HTTP API endpoint.

```command
curl -X POST -H "Accept: application/json" -H "NS: exampleNs" -H "DB: exampleDb" --user "exampleUser:examplePass" --data "INFO FOR DB;" http://localhost:8000/sql | jq
```

```output
[
  {
    "time": "239.691µs",
    "status": "OK",
    "result": {
      "dl": {
        "exampleUser": "DEFINE LOGIN exampleUser ON DATABASE PASSHASH '$argon2ExamplePassHash'"
      },
      "dt": {},
      "fc": {},
      "pa": {},
      "sc": {},
      "tb": {
        "article": "DEFINE TABLE article SCHEMALESS PERMISSIONS NONE",
        "tagged": "DEFINE TABLE tagged SCHEMALESS PERMISSIONS NONE",
        "tags": "DEFINE TABLE tags SCHEMALESS PERMISSIONS NONE"
      }
    }
  }
]
```

To verify the limits to the user's access, try a similar command to fetch information about the namespace. Recall that this is a database-level user. As such, its access does not extend to namespace information.

```command
curl -X POST -H "Accept: application/json" -H "NS: exampleNs" -H "DB: exampleDb" --user "exampleUser:examplePass" --data "INFO FOR NS;" http://localhost:8000/sql | jq
```

```output
[
  {
    "time": "43.29µs",
    "status": "ERR",
    "detail": "You don't have permission to perform this query type"
  }
]
```

## How to Securely Access SurrealDB with a Limited User

The above shows you how to secure your SurrealDB server by disabling the root user after initial setup. Part of that initial setup includes creating limited users, which you use afterward to work within your SurrealDB databases.

Such limited users are intended to provide access to your database server after initial setup. And with access restricted to specific namespaces or databases, these users offer your server a higher level of security.

This section goes more in-depth in working with limited users in SurrealDB, covering creation and use of namespace- and database-level users.

### Creating a New SurrealDB User

Each SurrealDB login is created with a `DEFINE LOGIN` statement. At creation, each such login is associated with either the current namespace or the current database. Within the associated namespace/database, that login has full access, but the login cannot access information outside of that boundary.

SurrealQL's `DEFINE` statement creates new user logins. Each such new login exists either at the namespace level or the database level, relative to the current namespace or database.

Take these two ways of defining a new `exampleUser` login on your SurrealDB server. The first uses `ON NAMESPACE` to grant this user namespace-level permissions.

```command
DEFINE LOGIN exampleUser ON NAMESPACE PASSWORD 'examplePass';
```

Alternatively, you could use `ON DATABASE` to grant the user database-level permissions only.

```command
DEFINE LOGIN exampleUser ON DATABASE PASSWORD 'examplePass';
```

### Accessing SurrealDB as a Limited User

Once you have a limited user login, you can access SurrealDB with that user's credentials. Doing so allows you to run your SurrealDB server without a root user. Since limited users can only access their designated namespaces and databases, your server is more secure.

At this point, you access relies on SurrealDB's APIs. The SurrealDB CLI limits its SQL interface to the root user. Thus, limited user logins need to access the SurrealDB server through HTTP requests or through dedicated SurrealDB libraries.

How you do so varies widely depending on the tools and frameworks you are using. But a straightforward way to explore your limited users' capabilities is with the cURL command-line tool.

The section above on securing your SurrealDB instance had a simple example. Here is another example, using a more advanced query.

1. Save a file with header information. You do not have to do this, but otherwise you need to specify all of these headers in each cURL request.

    ```command
    cat > surreal_header_file <<EOF
    Accept: application/json
    NS: exampleNs
    DB: exampleDb
    EOF
    ```

1. Send a `POST` request to the SurrealDB server's `/sql` endpoint. The `POST` data consists of a string to be used as the SurrealQL query.

    Your query data here can be whatever SurrealQL command or commands you want. But just recall that the user's access is limited to its namespace/database.

    ```command
    curl -X POST -H "@surreal_header_file" --user "exampleUser:examplePass" --data 'SELECT title, ->tagged->tags.value AS tags, date FROM article ORDER BY date;' http://localhost:8000/sql | jq
    ```

    ```output
    [
      {
        "time": "1.054678ms",
        "status": "OK",
        "result": [
          {
            "date": "2023-01-01T12:01:01Z",
            "tags": [
              "test",
              "post",
              "first"
            ],
            "title": "First Post"
          },
          {
            "date": "2023-02-01T13:02:02Z",
            "tags": [
              "test",
              "post"
            ],
            "title": "Second Post"
          },
          {
            "date": "2023-03-01T14:03:03Z",
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

## How to Manage Scoped User Accounts and Access in SurrealDB

The kinds of limited users described above provide your SurrealDB instance with logins for managing your database without root access. Each such user login keeping user access restricted while giving your users sets of credentials to interact with and manage the database.

But beyond this SurrealDB also includes a set of features for scoped user accounts. Such accounts primarily provide a set of access-control features to facilitate external access to the database. They are ideal for giving access, for instance, to external applications, or even for full user management for your web application.

The rest of this tutorial is dedicated to getting you started with scopes and scoped users in SurrealDB. Follow along for an overview that you can use to implement more fine-grained access control. You can even go further and use what you find here to start putting together a full user management setup in SurrealDB.

### Creating a Scope in SurrealDB

Scoped user accounts center on the use of SurrealDB's scopes. A *scope* is a special construct specifically designed to help your SurrealDB server function as a web database.

At base, you can use a scope to set up authentication endpoints and to build access rules for fine-grained database access control.

To get started with user accounts, then, you need to define a scope for those accounts. The steps that follow walk you through an example, creating a `userAccount` scope. Along the way, the example here also leverages the sample data set up earlier in the tutorial to show access control based on scope.

1. Define a new scope, `userAccount`. Typically a scope definition includes three parts in addition to the definition itself.

    - `SESSION` defines how long a user authenticated in this scope stays authenticated. This example uses three days (`3d`). Alternatively, you might choose a number of hours, as in `24h`.

    - `SIGNUP` defines a `/signup` endpoint and a query to execute for it. The example here represents a fairly standard approach. Upon signup attempt, SurrealDB attempts the create the new user account using a `$username` variable and a `$pass` variable.

    - `SIGNIN` defines a `/signin` endpoint and a query to execute for it. Like above, this example shows something rather standard. Taking `$username` and `$pass` variables, SurrealDB attempts to authenticate the user.

    Both the `/signup` and `/signin` endpoints created in this way respond to successful requests with a JavaScript Web Token (JWT), which you can see how to use further on.

    ```command
    DEFINE SCOPE userAccount SESSION 3d
        SIGNUP (CREATE user SET username = $username, pass = crypto::argon2::generate($pass))
        SIGNIN (SELECT * FROM user WHERE username = $username AND crypto::argon2::compare(pass, $pass))
    ```

1. Leverage information about the current user's scope to define fine-grained access to tables and records. What you see below is a simple example. It requires external users to be in the `userAccount` scope to `SELECT` records from the `article` table, and prohibits access to the `CREATE`, `UPDATE`, and `DELETE` type statements.

    ```command
    DEFINE TABLE article SCHEMALESS
      PERMISSIONS
        FOR select WHERE $scope = "userAccount"
        FOR create, update, delete NONE;
    ```

    Using the `$scope` variable is a good start, but more advanced scenarios probably want more information about the current authenticated user. For that, you can take advantage of the `$session` and `$auth` variables.

    Particularly, the `$auth.id` variable can be helpful. Associate new records with the `$auth.id` of the current user, and you can subsequently provide users with matching IDs access to updating those records.

    To see more of what these variables look like, use the `SELECT` statement on them when authenticated as a scoped user, as in this example.

    ```command
    SELECT * FROM $auth;
    ```

### Creating a Scoped User Account

With a scope for user accounts set up, you can now start adding users to that scope. You do so via the `/signup` endpoint defined during the scope creation. The endpoint takes a `POST` request, with data indicating:

- `NC` for the namespace

- `DB` for the database

- `SC` for the scope

Additionally, this case also requires the request data to include `username` and `pass` parameters. These were defined in the `SIGNUP` definition, and they thus have to be present in the request for a successful `SIGNUP` query.

Taking all of that, here is an example sign up for an `exampleAccount` user. The server URL and other parts of this example assume you are running your SurrealDB server as shown throughout the rest of this tutorial.

```command
curl -X POST -H "Accept: application/json" --data "{ NS: 'exampleNs', DB: 'exampleDb', SC: 'userAccount', username: 'exampleAccount', pass: 'exampleAccountPass' }" http://localhost:8000/signup | jq
```

```output
{
  "code": 200,
  "details": "Authentication succeeded",
  "token": "SESSION_JWT"
}
```

The response includes a `token`, which is a JWT that you can use to authenticate requests as the newly-created user.

Once you have signed up a new user account, you can subsequently use the `/signin` endpoint to authenticate a new session with that same user. The example here works almost identically to the one above, except that it uses `/signin` instead of `/signup`.

```command
curl -X POST -H "Accept: application/json" --data "{ NS: 'exampleNs', DB: 'exampleDb', SC: 'userAccount', username: 'exampleAccount', pass: 'exampleAccountPass' }" http://localhost:8000/signin | jq
```

```output
{
  "code": 200,
  "details": "Authentication succeeded",
  "token": "SESSION_JWT"
}
```

### Accessing SurrealDB with a Scoped User

The key to accessing SurrealDB resources with a scoped user is the JWT. Requests using a valid JWT for authentication allow you to query the SurrealDB database as the authenticated scoped user.

To authenticate HTTP requests with the JWT, include an `Authorization: Bearer` header in the request. So using the `SESSION_JWT` example JWT from above, your requests for `exampleAccount` should have a header like this: `Authorization: Bearer SESSION_JWT`.

The steps that follow walk you through using a couple of the SurrealDB query endpoints with the authenticated `exampleAccount` user created above. Like other examples in this tutorial, these use cURL for the HTTP requests, mainly to make the examples accessible and clear.

1. Save a file with header information. A similar file, using the same name, was created in some example steps earlier in the tutorial, and again doing so here is optional. But having this file helps to prevent repetitiveness in the cURL commands to follow.

    ```command
    cat > surreal_header_file <<EOF
    Accept: application/json
    NS: exampleNs
    DB: exampleDb
    Authorization: Bearer SESSION_JWT
    EOF
    ```

1. Fetch one of the records from the `article` table. This uses the `/key` endpoints on the SurrealDB HTTP API, allowing access by table (`/article`) and ID (`/first`).

    ```command
    curl -X GET -H "@surreal_header_file"  http://localhost:8000/key/article/first | jq
    ```

    ```output
    [
      {
        "time": "117.591µs",
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

1. Retrieve information about the scope of the current authenticated user. This uses the `$scope` variable that SurrealDB creates for an authenticated session.

    ```command
    curl -X POST -H "@surreal_header_file" --data 'SELECT * FROM $scope;'  http://localhost:8000/sql | jq
    ```

    ```output
    [
      {
        "time": "60.79µs",
        "status": "OK",
        "result": [
          "userAccount"
        ]
      }
    ]
    ```

1. Get records from the `article` table using a more complicated query. SurrealDB's `/sql` endpoint allows you to send SurrealQL queries as `POST` data.

    To simplify the process, and make it easier to adapt to even more complicated queries, create a file with the query command or commands.

    ```command
    cat > surreal.surql <<EOF
    SELECT id, title, body, date
      FROM article
      WHERE date < "2023-02-02T00:00:00Z"
      ORDER BY date;
    EOF
    ```

    Then in the cURL request include the query file with the `--data-binary` option.

    ```command
    curl -X POST -H "@surreal_header_file" --data-binary "@surreal.surql" http://localhost:8000/sql | jq
    ```

    ```output
    [
      {
        "time": "284.402µs",
        "status": "OK",
        "result": [
          {
            "body": "This is the first post.",
            "date": "2023-01-01T12:01:01Z",
            "id": "article:first",
            "title": "First Post"
          },
          {
            "body": "You are reading the second post.",
            "date": "2023-02-01T13:02:02Z",
            "id": "article:second",
            "title": "Second Post"
          }
        ]
      }
    ]
    ```

1. To verify the limitations of this user's access, try running making a request for data from another table. This example uses another `/key` endpoint to attempt to get records in the `tagged` table.

    ```command
    curl -X GET -H "@surreal_header_file" http://localhost:8000/key/tagged | jq
    ```

    ```output
    [
      {
        "time": "147.101µs",
        "status": "OK",
        "result": []
      }
    ]
    ```

## Conclusion

After all of this, you now have what you need not only to secure your SurrealDB instance but also to start managing user accounts.

Creating limited user logins with `DEFINE LOGIN` gives you a set of users to manage resources on your SurrealDB server. All while allowing you to run the server without a risky root user.

Implementing scopes for user accounts goes further. With scopes, your SurrealDB instance gains a complete process for user management that can be leveraged by your web applications.

With a secured SurrealDB server, you are in an excellent position to start considering setting up SurrealDB for particular use cases. Get a head start by following along with one of our other guides on SurrealDB.

- [Building an Web Application on Top of SurrealDB](/docs/guides/surrealdb-for-web-applications)

- [Modeling Data with SurrealDB’s Inter-document Relations](/docs/guides/surrealdb-interdocument-modeling)

- [Deploying a SurrealDB Cluster](/docs/guides/deploy-surrealdb-cluster/)
