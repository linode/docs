---
slug: use-couchdb-2-0-on-ubuntu-20-04
description: "Learn the basic concepts of CouchDB 2.0, along with how to use it on Ubuntu."
keywords: ['couchdb','nosql','fauxton','database','ubuntu 20.04']
tags: ['couchdb','fauxton', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-21
modified_by:
  name: Nathaniel Stickman
title: "Using CouchDB 2.0 on Ubuntu 20.04"
title_meta: "How to Use CouchDB 2.0 on Ubuntu 20.04"
external_resources:
- '[API guide](https://docs.couchdb.org/en/latest/api/index.html)'
- '[documentation for the _find API](https://docs.couchdb.org/en/latest/api/database/find.html)'
- '[Apache CouchDB Documentation](https://docs.couchdb.org/en/stable/)'
authors: ["Nathaniel Stickman"]
---

*CouchDB*, a non-relational or "NoSQL" database, uses HTTP APIs and JSON documents, making its concepts more intuitive to those familiar with web technologies. These also make CouchDB simple to integrate with web and mobile applications.

This guide shows you how to get started with CouchDB using its web interface—**Fauxton**—before diving into the basics of using the HTTP API and integrating it into a basic application.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Install CouchDB. Follow the instructions in the guide on [How to Install CouchDB on Ubuntu 20.04](/docs/guides/install-couchdb-20-on-ubuntu/).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Access the Fauxton Web Interface

The easiest way to configure and maintain your CouchDB installation is through its web interface, *Fauxton*. From a web browser on the machine where CouchDB is installed, you can access Fauxton by navigating to `127.0.0.1:5984/_utils`.

However, if you are accessing the machine remotely, the simplest and most secure way to access Fauxton is by using SSH tunneling. The following steps show you how to create and use an SSH tunnel for this purpose.

1. Follow the [Access Futon Over SSH to Administer CouchDB](/docs/guides/access-futon-over-ssh-using-putty-on-windows/) guide to creating an SSH tunnel between your CouchDB server and the machine you are wanting to access it from.

1. In a web browser, navigate to `127.0.0.1:5984/_utils`.

1. Log in to CouchDB using the administrator password you set up during the CouchDB installation. The default username for this user is `admin`.

    ![Fauxton login screen](fauxton-login.png)

## Navigate Fauxton

- Once you have logged into Fauxton, you are presented with a list of your CouchDB databases. Initially, this should only contain a `_users` and a `_replicator` database. These are the two default system databases used by CouchDB.

    ![Initial page in Fauxton](fauxton-database-list.png)

- You can use the menu on the left to navigate the variety of configuration and monitoring options Fauxton offers. This menu also provides a **Documentation** option, where you can find numerous links to CouchDB and Fauxton documentation libraries.

- There are two important actions not presented in the menu on the left:
  - Creating a database
  - Adding documents to a database.

The following steps show you how to take these actions using Fauxton.

### Create a Database

1. Click the **Create Database** button on the upper right.

1. You are presented with a menu to enter the database name and select whether or not you want it partitioned.

    ![Fauxton menu for creating a database](fauxton-create-database.png "Fauxton menu for creating a database")

1. Once you have created the database, you are taken to its page.

    ![A database's page within Fauxton](fauxton-database-page.png)

    You can reach any particular database's page via the **Databases** option on the menu on the left. The resulting page presents a list of databases from which you can select the desired database.

### Add a Document

1. Go to the page for the database that you want to add a document to.

1. Click the **+** icon beside the **All Documents** option. From the dropdown menu, select **New Doc**.

1. You are taken to the new document editor, where you can input the JSON for a new CouchDB document.

    ![Fauxton document editor](fauxton-document-design.png)

## Use the HTTP API

CouchDB's HTTP API is the primary means for applications to interact with your databases. From the command line, you can use cURL to explore the API and even to quickly view and make changes to data within CouchDB.

The following commands are some examples of what you can do using the HTTP API. Replace `admin` and `password` with the username and password, respectively, for an authorized CouchDB user. These commands assume you are connected to the CouchDB machine either by SSH or an SSH tunnel, as described above.

Refer to CouchDB's [API guide](https://docs.couchdb.org/en/latest/api/index.html) for a full listing of API endpoints, parameters, and capabilities.

### HTTP Queries

1. View the list of all databases.

        curl -X GET http://admin:password@127.0.0.1:5984/_all_dbs

1. Create a new database using the following command; replace `new-example-db` with the name for the new database.

        curl -X PUT http://admin:password@127.0.0.1:5984/new-example-db

1. View the list of all documents in the `example-db` database by using the following command:

        curl -X GET http://admin:password@127.0.0.1:5984/example-db/_all_docs

1. Add a document to the `example-db` database; replace the JSON after the `-d` option with the desired JSON content for the document.

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db \
             -d '{"key1":"value1","key2":"value2"}'

    {{< note respectIndent=false >}}
CouchDB automatically assigns an ID to the document if you do not explicitly provide one. However, CouchDB recommends that production applications create document IDs explicitly. Doing so prevents duplication of documents if your application has to retry its connection to the CouchDB database.
    {{< /note >}}

1. The above command returns an ID corresponding to the new document. Likewise, the `_all_docs` command gives the ID for each document it lists. These IDs can be used to access the identified document by replacing `id-string` with the ID for the desired document.

        curl -X GET http://admin:password@127.0.0.1:5984/example-db/id-string

### Query Server

For more advanced queries, CouchDB has a query server. The query server takes search criteria in a JSON format and returns matching documents, or even a particular set of fields from matching documents.

The URL for the query server follows the same format as the URLs above. To query the `example-db` database, for instance, you direct a `POST` request to `http://admin:password@127.0.0.1:5984/example-db/_find` with your JSON search criteria as the payload.

The following are examples of basic queries aiming to provide an idea of how the JSON search criteria work. Refer to CouchDB's reference [documentation for the `_find` API](https://docs.couchdb.org/en/latest/api/database/find.html) for a full list of criteria parameters and more details on their usage.

1. To retrieve all documents from `example-db` where `key_1` is greater than five.

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db/_find \
             -d '{"selector": {"key_1": {"$gt": 5}}}'

    The operator options include:
    - `$eq` (for "is equal to")
    - `$lt` (for "is less than") in addition to `$gt` (for "is greater than").

    Some of CouchDB's combination operators allow you to conduct boolean and other more advanced searches. Here is another example, which retrieves documents where `key_1` is between five and ten.

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db/_find \
             -d '{"selector": {"$and": [{"key_1": {"$gt": 5}}, {"key_1": {"$lt": 10}}]}}'

    Here is one that retrieves documents where `key_1` is greater than five or where `key_2` equals "Example String".

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db/_find \
             -d '{"selector": {"$or": [{"key_1": {"$gt": 5}}, {"key_2": {"$eq": "Example String"}}]}}'

1. Use the following to define the specific fields to be returned from the matching documents and to sort the results by a specific field. In this case, the query server only returns the `key_2` field from the matching documents and sorts the results by the `key_3` field's values.

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db/_find \
             -d '{"selector": {"key_1": {"$gt": 5}}, "fields": ["key_2"], "sort": [{"key_3": "asc"}]}'

    {{< note respectIndent=false >}}
To sort results, you must first define an index for the field and the sort order. For the example above, you could use the following to create the necessary index:

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db/_index \
             -d {"index": {"fields": [{"key_3": "asc"}]}, "name": "example-index", "type": "json"}

    {{< /note >}}

## Usage Examples

CouchDB shines in its straightforward integration with web applications. The following examples aim to demonstrate this by using CouchDB for a simple messaging application. The examples are written in pseudo-code, and they should be readily adaptable to the most popular programming languages for web applications.

You can find the small dataset used in these examples [here](example-db.json). If you would like to follow along, you can import the dataset using the following cURL command. Make sure you are in the same directory as the `example-db.json` file and make sure you have already created the `messaging-db` database used in the following examples:

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/messaging-db/_bulk_docs \
             -d @example-db.json

1. The dataset already includes a custom index for sorting by a `date_time` field. However, for reference in creating your indices, here is the JSON used to generate this index. You can execute it using a cURL command like the one in the note above:

        {
            "index": {
                "fields": [
                    {"date_time": "desc"}
                ]
            },
            "name": "messaging-index",
            "type": "json"
        }

1. The application initially sets up a couple of variables that are to be referenced in each query.

    {{< file "Example Messaging Application" python>}}
db_query_headers = {"Content-Type": "application/json"}
db_query_url = "http://admin:password@127.0.0.1:5984/messaging-db/_find"
    {{< /file >}}

1. When a user accesses a message thread, the application fetches the two most recent messages.

    {{< file "Example Messaging Application" python>}}
db_request = {
    "selector": {
        "$and": [
            {
                "type": {
                    "$eq": "message"
                }
            },
            {
                "thread_id": {
                    "$eq": "thread-0001"
                }
            }
        ]
    },
    "fields": [
        "user_id",
        "date_time",
        "message_body"
    ],
    "sort": [
        {"date_time": "desc"}
    ],
    "limit": 2
}

db_response = http_post_request(db_query_url, db_request, db_query_headers)
    {{< /file >}}

1. When a user sends a new message, the application inserts it as a new document.

    {{< file "Example Messaging Application" python>}}
db_request = {
    "_id": "message-00000006",
    "type": "message",
    "thread_id": "thread-0001",
    "user_id": "user-000001",
    "date_time": "2021-02-05 10:57:00",
    "message_body": "Example message text from user-000001, the first."
}

db_response = http_post_request(db_query_url, db_request, db_query_headers)
    {{< /file >}}

## Next Steps

With that, you are ready to get started using CouchDB in your applications.

CouchDB has many more features than those demonstrated here, making it capable of handling a wide array of applications. You can easily begin to extend on the examples in this guide by referencing CouchDB's exceptional repository of [Apache CouchDB Documentation](https://docs.couchdb.org/en/stable/). Be sure to also explore the links provided in this guide and the documentation listing in your Fauxton interface.
