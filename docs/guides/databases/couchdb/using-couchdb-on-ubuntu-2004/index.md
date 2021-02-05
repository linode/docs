---
slug: using-couchdb-on-ubuntu-2004
author:
  name: Linode Community
  email: docs@linode.com
description: 'CouchDB is a NoSQL database that uses HTTP APIs and JSON documents to come more intuitively and integrate more simply with web and mobile applications. This guide explores CouchDB's basic concepts and usage.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['couchdb','nosql','fauxton','database','ubuntu 20.04']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-05
modified_by:
  name: Nathaniel Stickman
title: "Using CouchDB on Ubuntu 20.04"
h1_title: "Using CouchDB on Ubuntu 20.04"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[CouchDB: API Reference](https://docs.couchdb.org/en/latest/api/index.html)'
- '[CouchDB: JSON Structure Reference](https://docs.couchdb.org/en/latest/json-structure.html)'
---

CouchDB, a non-relational or "NoSQL" database, uses HTTP APIs and JSON documents, making its concepts more intuitive to those familiar with web technologies. These also make CouchDB simple to integrate with web and mobile applications.

This guide shows you how to get started with CouchDB using its web interface — Fauxton — before diving into the basics of using the HTTP API and creating JSON documents.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Install CouchDB. Follow the instructions in the guide on [How to Install CouchDB on Ubuntu 20.04](/docs/guides/how-to-install-couchdb-on-ubuntu-2004).

1.  Update your system:

        sudo apt update && sudo apt upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Access the Fauxton Web Interface

The easiest way to configure and maintain your CouchDB installation is through its web interface, Fauxton. From a web browser on the machine where CouchDB is installed, you can access Fauxton by navigating to `127.0.0.1:5984/_utils`.

However, if you are accessing the machine remotely, the simplest and most secure way to access Fauxton is by using SSH tunneling. The following steps show you how to create and use and SSH tunnel for this purpose.

1. Follow the [Access Futon Over SSH to Administer CouchDB](/docs/guides/access-futon-over-ssh-using-putty-on-windows/) guide to create an SSH tunnel between your CouchDB server and the machine you are wanting to access it from.

1. In a web browser, navigate to `127.0.0.1:5984/_utils`.

1. Log in to CouchDB using the administrator password you set up during the CouchDB installation. The default username for this user is `admin`.

    [![Fauxton login screen](fauxton-login_small.png "Fauxton login screen")](fauxton-login.png)

## Navigating Fauxton

Once you have logged into Fauxton, you are presented with a list of your CouchDB databases. Initially, this should only contain a `_users` and a `_replicator` database. These are the two default system databases used by CouchDB.

[![Initial page in Fauxton](fauxton-database-list_small.png "Initial page in Fauxton")](fauxton-database-list.png)

You can use the menu on the left to navigate a variety of configuration and monitoring options. This menu also has a **Documentation** option, where you can find numerous links to CouchDB and Fauxton documentation libraries.

There are two important actions not presented in the menu on the left: creating a database and adding documents to a database. The following steps show you how to take these actions using Fauxton.

### Create a Database

1. Click the **Create Database** button on the upper right.

1. You are presented with a menu to enter the database name and select whether or not you want it partitioned.

    ![Fauxton menu for creating a database](fauxton-create-database.png "Fauxton menu for creating a database")

1. Once you have created the database, you are taken to its page.

    [![A database's page within Fauxton](fauxton-database-page_small.png "A database's page within Fauxton")](fauxton-database-page.png)

    You can reach any particular database's page via the **Databases** option on the menu on the left. On the resulting page, select the name of the desired database name from the list.

### Add a Document

1. Go to the page for the database that you want to add a document to.

1. Click the **+** icon beside the **All Documents** option. From the dropdown menu, select **New Doc**.

1. You are taken to the new document editor, where you can input the JSON for a new CouchDB document.

    [![Fauxton document editor](fauxton-document-design_small.png "Fauxton document editor")](fauxton-document-design.png)

## Using the HTTP API

CouchDB also has an HTTP API for managing databases and documents. In this way, you can use the `curl` command from the command line to view and make changes to data within CouchDB.

The following commands are some examples of what you can do using the HTTP API. Replace `admin` and `password` with the username and password, respectively, for an authorized CouchDB user. These commands assume you are connected to the CouchDB machine either by SSH or an SSH tunnel, as described above.

### HTTP Queries

1. To view a list of all databases, use:

        curl -X GET http://admin:password@127.0.0.1:5984/_all_dbs

1. Use the following to create a new database; replace `new-example-db` with the name for the new database:

        curl -X PUT http://admin:password@127.0.0.1:5984/new-example-db

1. To view a list of the documents in the `example-db` database, use:

        curl -X GET http://admin:password@127.0.0.1:5984/example-db/_all_docs

1. Use the following to add a document to the `example-db` database; replace the JSON after the `-d` option with the desired JSON content for the document:

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db \
             -d '{"key1":"value1","key2":"value2"}'

1. The above returns an ID corresponding to the new document. Likewise, the `_all_docs` command gives the ID for each document it lists. These IDs can be used to access the identified document as follows; replace `id-string` with the ID for the desired document:

        curl -X GET http://admin:password@127.0.0.1:5984/example-db/id-string

### Query Server

For more advanced queries, CouchDB provides a query server. Provided with an appropriate JSON, the query server locates documents and/or specific document fields matching criteria you provide.

The URL for the query server is similar to the above. To query the `example-db` database, you direct a `POST` request to `http://admin:password@127.0.0.1:5984/example-db/_find`.

The main part of the query JSON is the `selector` attribute, which defines your search criteria. Additional attributes allow you to further control the response. For instance, a `fields` attribute lets you define, and limit, the fields to be included in the response.

The following are some example usages for the query server.

1. To retrieve all documents from `example-db` where `key_1` is greater than five:

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db/_find \
             -d '{"selector": {"key_1": {"$gt": 5}}}'

    CouchDB has several operators that can be used in addition to `$gt` here. These include `$eq` for "is equal to" and `$lt` for is less than.

1. Use the following to define the specific fields to be returned from the matching documents and to sort the results by a specific field. In this case, the query server only returns the `key_2` field from the matching documents and sorts the results by the `key_3` field's values:

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db/_find \
             -d '{"selector": {"key_1": {"$gt": 5}}, "fields": ["key_2"], "sort": [{"key_3": "asc"}]}'

    {{< note >}}
To sort results, you must first define an index for the field and the sort order. For the example above, you could use the following to create the necessary index:

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/example-db/_index \
             -d {"index": {"fields": [{"key_3": "asc"}]}, "name": "example-index", "type": "json"}

    {{< /note >}}

## Usage Examples

CouchDB shines in its straightforward integration with web applications. The following examples aim to demonstrate this through using CouchDB for a simple messaging application. The examples are written in pseudo code, but they should be readily adaptable to most popular programming languages for web applications.

You can find the small dataset used in these examples [here](example-db.json). If you would like to follow along, you can import the dataset using the following cURL command. Make sure you are in the same directory as the`example-db.json` file, and make sure you have already created the `messaging-db` database used in these examples:

        curl -H 'Content-Type: application/json' \
             -X POST http://admin:password@127.0.0.1:5984/messaging-db/_bulk_docs \
             -d @example-db.json

1. The dataset already includes a custom index for sorting by a `date_time` field, but, for reference, here is a command to create one of your own:

        {
            "index": {
                "fields": [
                    {"date_time": "desc"}
                ]
            },
            "name": "messaging-index",
            "type": "json"
        }

1. When a user accesses a message thread, the application fetches the two most recent messages:

        db_query_headers = {"Content-Type": "application/json"}
        db_query_url = "http://admin:password@127.0.0.1:5984/messaging-db/_find"
        db_request = {
            "selector": {
                "type": {
                    "$eq": "message"
                },
                "thread_id": {
                    "$eq": "thread-94b1cc6edb320dae92d6de1b710059c8"
                }
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

1. When a user sends a new message, the application inserts it as a new document:

        db_query_headers = {"Content-Type": "application/json"}
        db_query_url = "http://admin:password@127.0.0.1:5984/messaging-db"
        db_request = {
            "_id": "message-94b1cc6edb320dae92d6de1b7100837c",
            "type": "message",
            "thread_id": "thread-94b1cc6edb320dae92d6de1b710059c8",
            "user_id": "user-000001",
            "date_time": "2021-02-05 10:57:00",
            "message_body": "Example message text from user-000001, the first."
        }

        db_response = http_post_request(db_query_url, db_request, db_query_headers)
