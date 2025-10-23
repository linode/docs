---
slug: managing-security-and-access-for-surrealdb
title: "Managing Security and Access Control for SurrealDB"
description: "Before moving to production, you need to secure your SurrealDB. Fortunately, SurrealDB features robust access control configurations and API. See how to lock-down your SurrealDB server and set up user access in this tutorial."
authors: ['Nathaniel Stickman']
contributors: ['Nathaniel Stickman']
published: 2024-05-01
keywords: ['surrealdb tutorial','surrealdb client','surrealdb authentication']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[SurrealDB Documentation](https://surrealdb.com/docs)'
---

SurrealDB provides a new approach to relational databases, with all-in-one database, API, and access control. Once a SurrealDB instance is up-and-running, you likely want to secure it. Learn about SurrealDB's security features and best practices in this tutorial. See how to secure your instance with limited user logins and discover how SurrealDB can implement a custom user-management solution for your applications.

## How to Secure SurrealDB

Learning how to run SurrealDB securely should be the first step after provisioning and getting familiar with your instance. The SurrealDB server is typically run with a root user during this initial provisioning and experimenting stage. However, to control access, you should create limited users. Only include a root user in rare circumstances.

Continue reading to find out how to regulate root access and work with limited users on your SurrealDB instance.

### Setting Up SurrealDB

For this tutorial, you need to have installed SurrealDB on your system and placed the SurrealDB binary in your shell path. To do so, follow along with the instructions in our [Getting Started with SurrealDB](/docs/guides/getting-started-with-surrealdb/) guide.

The tutorial assumes you have followed that guide up through the *How to Install SurrealDB* section, with SurrealDB installed and accessible via the `surreal` command.

Additionally, the examples throughout this tutorial assume you have set up the database with the sample records provided in the guide linked above. For convenience, a single set of SurrealQL commands that create these sample records are provided in the section below.

### Running SurrealDB Server Securely

The guide linked above starts the SurrealDB server with a root username and password. However, root credentials input in this way may be visible in plain text, presenting a potential security risk.

SurrealDB is only meant to be run in this way for initial setup purposes. During that period, limit access to `localhost`, where credentials are more secure.

Once your instance's basic needs are configured, you should run the SurrealDB server without a root user at all. To disable root access, run the `surreal start` command to start up your SurrealDB server, but leave off the `--user` and `--pass` options.

In this case, data is accessed using limited users created within particular namespaces and databases. Such users provide access to the server while keeping each set of credentials limited to one namespace or database.

The example that follows sets up a limited user on your SurrealDB server. This example names the user `exampleUser` and relegates their access to the database level, specifically within `exampleDb`.

1.  Start up the server just as shown in the [Getting Started](/docs/guides/getting-started-with-surrealdb/#running-the-surrealdb-server) guide linked above, using a root user and password. This example initially limits the server to `localhost` (`127.0.0.1`), shutting off external access. The example also stores the database as a file rather than in memory.

    ```command {title="Terminal #1"}
    surreal start --bind 127.0.0.1:8000 --user root --pass exampleRootPass file:///home/example-user/.surrealdb/exampleDb.db
    ```

1.  Open the SurrealDB CLI for entering SurrealQL commands. This example command also starts the CLI session out in a particular namespace and database.

    ```command {title="Terminal #2"}
    surreal sql --conn http://localhost:8000 --user root --pass exampleRootPass --ns exampleNs --db exampleDb
    ```

    {{< note >}}
    Technically you do not need to access the CLI, you could instead send commands as HTTP requests. However, the CLI provides a convenient method for entering commands during this stage of server provisioning.
    {{< /note >}}

1.  Enter any SurrealQL commands for initially populating the database or setting up schemas. For the examples in this tutorial, this means running the commands below to set up the sample data mentioned in the section above:

    ```command {title="Terminal #2"}
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

1.  Define a new SurrealDB limited user. The command below provides a basic example for a database-level user. Learn more about this command's usage in the section on [Creating a New SurrealDB User](/docs/guides/managing-security-and-access-for-surrealdb/#creating-a-new-surrealdb-user) further on.

    ```command {title="Terminal #2"}
    DEFINE LOGIN exampleUser ON DATABASE PASSWORD 'examplePass';
    ```

1.  Use the <kbd>Ctrl</kbd> + <kbd>C</kbd> key combination to shut down both the SurrealDB CLI and server.

1.  Start up a new SurrealDB server using the same database source, but without defining a root user or root user password. This command does not bind the server to `localhost`. Instead, it opens access to any address matching this system, which readies the server for external access.

    ```command {title="Terminal #1"}
    surreal start --bind 0.0.0.0:8000 file:///home/example-user/.surrealdb/exampleDb.db
    ```

    You can now use the limited user to access the SurrealDB server's APIs. Learn more about doing so in the section on [Accessing SurrealDB as a Limited User](/docs/guides/managing-security-and-access-for-surrealdb/#accessing-surrealdb-as-a-limited-user) further on.

1.  To get started, here is a simple example that fetches information about the database using the SurrealDB server's `/sql` HTTP API endpoint.

    ```command {title="Terminal #2"}
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

1.  To verify the limits to the user's access, try a similar command to fetch information about the namespace. Recall that this is a database-level user. As such, its access does not extend to namespace information.

    ```command {title="Terminal #2"}
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

The above shows how to secure a SurrealDB server by disabling the root user after initial setup. Part of that initial setup includes creating limited users, which are used to work within your SurrealDB databases.

Such limited users are intended to provide access to your database server after initial setup. With access restricted to specific namespaces or databases, these users offer your server a higher level of security.

This section goes more in-depth with limited users in SurrealDB, covering creation and use of both namespace- and database-level users.

### Creating a New SurrealDB User

Each SurrealDB login is created with a `DEFINE LOGIN` statement. Upon creation, each is associated with either the current namespace or the current database. That login has full access within the associated namespace/database, but cannot access information outside of that boundary.

SurrealQL's `DEFINE` statement creates new user logins. Each such new login exists either at the namespace level or the database level, relative to the current namespace or database.

For example, here are two ways of defining a new `exampleUser` login on your SurrealDB server:

-   The first example uses `ON NAMESPACE` to grant this user namespace-level permissions:

    ```command
    DEFINE LOGIN exampleUser ON NAMESPACE PASSWORD 'examplePass';
    ```

-   Alternatively, you could use `ON DATABASE` to only grant the user database-level permissions:

    ```command
    DEFINE LOGIN exampleUser ON DATABASE PASSWORD 'examplePass';
    ```

### Accessing SurrealDB as a Limited User

Once you have created a limited user login, you can access SurrealDB with that user's credentials. This allows you to run the SurrealDB server without a root user. Since limited users can only access their designated namespaces and databases, the server is more secure.

At this point, access relies on SurrealDB's APIs. The SurrealDB CLI limits its SQL interface to the root user. Thus, limited user logins need to access the SurrealDB server via HTTP requests or through dedicated SurrealDB libraries.

How to do this varies widely depending on the tools and frameworks in use. However, a straightforward way to explore your new limited users' capabilities is with the cURL command-line tool.

The section above on securing the SurrealDB instance had a simple example. The following example uses a more advanced query.

1.  Save a file with header information. While not mandatory, this avoids having to specify all of these headers in each cURL request.

    ```command {title="Terminal #2"}
    cat > surreal_header_file <<EOF
    Accept: application/json
    NS: exampleNs
    DB: exampleDb
    EOF
    ```

1.  Send a `POST` request to the SurrealDB server's `/sql` endpoint. The `POST` data consists of a string to be used as the SurrealQL query.

    The query data here can be any SurrealQL commands you choose, just recall that the user's access is limited to its namespace/database.

    ```command {title="Terminal #2"}
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

The limited users described above provide your SurrealDB instance with logins to manage your database without root access. Each such user login keeps user access restricted, while also giving these users credentials to interact with and manage the database.

Beyond this, SurrealDB also includes a set of features for scoped user accounts. These accounts primarily provide a set of access-control features to facilitate external access to the database. They are ideal for giving access to external applications, or even for full user management of your web application.

The rest of this tutorial is dedicated to covering scopes and scoped users in SurrealDB. Follow along for an overview that you can use to implement more fine-grained access control. You can use the information here to start building a full user management setup in SurrealDB.

### Creating a Scope in SurrealDB

Scoped user accounts center on the use of SurrealDB's scopes. A *scope* is a special construct specifically designed to help your SurrealDB server function as a web database.

You can use a scope to set up authentication endpoints and to build access rules for fine-grained database access control.

To get started with user accounts, you need to define a scope for those accounts. The steps that follow walk through an example of creating a `userAccount` scope. The example also leverages the sample data set up earlier in the tutorial to showcase scope-based access control.

1.  If still running, use the <kbd>Ctrl</kbd> + <kbd>C</kbd> key combination to shut down the SurrealDB server.

1.  Restart the server as the root user:

    ```command {title="Terminal #1"}
    surreal start --bind 127.0.0.1:8000 --user root --pass exampleRootPass file:///home/example-user/.surrealdb/exampleDb.db
    ```

1.  Log in to the SurrealDB CLI as the root user:

    ```command {title="Terminal #2"}
    surreal sql --conn http://localhost:8000 --user root --pass exampleRootPass --ns exampleNs --db exampleDb
    ```

1.  Define a new `userAccount` scope. Typically, a scope definition includes three parts in addition to the definition itself:

    -   `SESSION` defines how long a user authenticated in this scope remains authenticated. This example uses three days (`3d`). Alternatively, you might choose a number of hours, as in `24h`.

    -   `SIGNUP` defines a `/signup` endpoint and a query to execute for it. The example here represents a fairly standard approach. Upon signup attempt, SurrealDB attempts the create the new user account using a `$username` variable and a `$pass` variable.

    -   `SIGNIN` defines a `/signin` endpoint and a query to execute for it. Like above, this example shows something rather standard. Taking `$username` and `$pass` variables, SurrealDB attempts to authenticate the user.

    Both the `/signup` and `/signin` endpoints created here respond to successful requests with a JavaScript Web Token (JWT), which you can use further on.

    ```command {title="Terminal #2"}
    DEFINE SCOPE userAccount SESSION 3d
        SIGNUP (CREATE user SET username = $username, pass = crypto::argon2::generate($pass))
        SIGNIN (SELECT * FROM user WHERE username = $username AND crypto::argon2::compare(pass, $pass));
    ```

1.  Leverage information about the current user's scope to define fine-grained access to tables and records. Below is a simple example that requires external users to be in the `userAccount` scope to `SELECT` records from the `article` table. It also prohibits access to the `CREATE`, `UPDATE`, and `DELETE` type statements.

    ```command {title="Terminal #2"}
    DEFINE TABLE article SCHEMALESS
      PERMISSIONS
        FOR select WHERE $scope = "userAccount"
        FOR create, update, delete NONE;
    ```

    {{< note >}}
    Using the `$scope` variable is a good start, but more advanced scenarios probably want more information about the current authenticated user. For that, take advantage of the `$session` and `$auth` variables, particularly the `$auth.id` variable. Associate new records with the `$auth.id` of the current user, and you can subsequently provide users with matching IDs access to those records.

    See more of what these variables look like by using the `SELECT` statement on them when authenticated as a scoped user, for example:

    ```command
    SELECT * FROM $auth;
    ```
    {{< / note >}}

1.  When done, use the <kbd>Ctrl</kbd> + <kbd>C</kbd> key combination to shut down both the SurrealDB CLI and server.

### Creating a Scoped User Account

With a scope for user accounts set up, you can now start adding users to that scope. This is done via the `/signup` endpoint defined during the scope creation. The endpoint takes a `POST` request, with data indicating:

-   `NC` for the namespace

-   `DB` for the database

-   `SC` for the scope

Additionally, this example also requires the request data to include `username` and `pass` parameters. These were defined in the `SIGNUP` definition, and thus have to be present in the request for a successful `SIGNUP` query.

1.  Start the SurrealDB server as the limited user:

    ```command {title="Terminal #1"}
    surreal start --bind 0.0.0.0:8000 file:///home/example-user/.surrealdb/exampleDb.db
    ```

1.  Here is an example sign up for an `exampleAccount` user. The server URL and other parts of this example assume you are running your SurrealDB server as shown throughout the rest of this tutorial.

    ```command {title="Terminal #2"}
    curl -X POST -H "Accept: application/json" --data "{ NS: 'exampleNs', DB: 'exampleDb', SC: 'userAccount', username: 'exampleAccount', pass: 'exampleAccountPass' }" http://localhost:8000/signup | jq
    ```

    ```output
    {
      "code": 200,
      "details": "Authentication succeeded",
      "token": "SESSION_JWT"
    }
    ```

    The response includes a JWT `token` that you can use to authenticate requests as the newly created user.

1.  Once a new user account is created, you can use the `/signin` endpoint to authenticate a new session with that user. The example here works almost identically to the one above, except that it uses `/signin` instead of `/signup`.

    ```command {title="Terminal #2"}
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

To authenticate HTTP requests with the JWT, include an `Authorization: Bearer` header in the request. Using the `SESSION_JWT` example JWT from above, your requests for `exampleAccount` should have a header such as `Authorization: Bearer SESSION_JWT`.

The steps that follow use a couple of the SurrealDB query endpoints with the authenticated `exampleAccount` user created above. Like other examples in this tutorial, these use cURL for the HTTP requests to make the examples accessible and clear.

1.  Save a file with header information. A similar file, using the same name, was created earlier in the tutorial. Again, doing so is optional, but having this file helps to prevent repetitiveness in the cURL commands to follow.

    ```command {title="Terminal #2"}
    cat > surreal_header_file <<EOF
    Accept: application/json
    NS: exampleNs
    DB: exampleDb
    Authorization: Bearer SESSION_JWT
    EOF
    ```

1.  Fetch one of the records from the `article` table. This uses the `/key` endpoints on the SurrealDB HTTP API, allowing access by table (`/article`) and ID (`/first`).

    ```command {title="Terminal #2"}
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

1.  Retrieve information about the scope of the current authenticated user. This uses the `$scope` variable that SurrealDB creates for an authenticated session.

    ```command {title="Terminal #2"}
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

1.  Retrieve records from the `article` table using a more complicated query. SurrealDB's `/sql` endpoint allows you to send SurrealQL queries as `POST` data. To simplify the process, and make it easier to adapt to even more complicated queries, create a file with the query commands:

    ```command {title="Terminal #2"}
    cat > surreal.surql <<EOF
    SELECT id, title, body, date
      FROM article
      WHERE date < "2023-02-02T00:00:00Z"
      ORDER BY date;
    EOF
    ```

1.  Include the query file with the `--data-binary` option in the cURL request:

    ```command {title="Terminal #2"}
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

1.  To verify the limitations of this user's access, try making a request for data from another table. This example uses another `/key` endpoint to attempt to get records in the `tagged` table:

    ```command {title="Terminal #2"}
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

You now have what you need to secure your SurrealDB instance and start managing user accounts. Creating limited user logins with `DEFINE LOGIN` provides a set of users to manage resources on a SurrealDB server. This allows you to run the server without the risky root user. Implementing scopes for user accounts goes even further. With scopes, a SurrealDB instance gains a complete process for user management that can be leveraged by web applications.

With a secured SurrealDB server, you're in an excellent position to consider setting up SurrealDB for a particular use case. Get a head start by following along with one of our other guides on SurrealDB:

-   [Building an Web Application on Top of SurrealDB](/docs/guides/surrealdb-for-web-applications)
-   [Modeling Data with SurrealDB’s Inter-document Relations](/docs/guides/surrealdb-interdocument-modeling)
-   [Deploying a SurrealDB Cluster](/docs/guides/deploy-surrealdb-cluster/)