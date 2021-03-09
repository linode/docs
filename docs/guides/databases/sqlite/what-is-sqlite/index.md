---
slug: what-is-sqlite
author:
  name: James Turner
  email: blkbearnh@gmail.com
description: 'SQLite is the most popular of the serverless SQL databases. These databases offer relational SQL capabilities without anyone needing to set up and maintain a database server. That brings advantages and disadvantages.'
og_description: 'SQLite is the most popular of the serverless SQL databases. These databases offer relational SQL capabilities without anyone needing to set up and maintain a database server. That brings advantages and disadvantages.'
keywords: ['what is sqlite']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-09
modified_by:
  name: Linode
title: "What is SQLite?"
h1_title: "What is SQLite?"
contributor:
  name: James Turner
  link: https://twitter.com/blackbearnh
---

# What is SQLite?

The database world is often divided into two major camps: traditional client/server relational database (such as [MySQL](https://www.linode.com/docs/guides/databases/mysql/) or [PostgreSQL](https://www.linode.com/docs/guides/databases/postgresql/)), and NoSQL databases (such as [MongoDB](https://www.linode.com/docs/guides/databases/mongodb/) or [Couchbase](https://www.linode.com/docs/guides/databases/couchdb/)). But there is a third option that straddles the gap. _Serverless SQL databases_ offer relational SQL capabilities without anyone needing to set up and maintain a database server at all.

[SQLite](https://www.sqlite.org/index.html) is the most popular of the serverless SQL databases. Part of its success lies in the large number of operating systems and languages with which it is compatible.

The major difference between SQLite and a traditional SQL database, such as MySQL, is that there is no server. The database is maintained on files to which the application has direct access, and the heavy lifting of processing SQL requests is done inside the application rather than by a separate server process.

## SQLite&#39;s advantages

SQLite can run essentially &quot;stand-alone&quot; and requires no setup before use. An application can be shipped with an existing SQLite database, or the application can create one from scratch when first started. This makes it ideal for embedded and mobile applications where connectivity may be intermittent or non-existent. It also means that there is no need to make sure that a database server is running before starting an application, or to shut one down on exit.

Also, because the underlying database file format is common across languages and platforms, it&#39;s easy to move files around. Incompatibilities between languages and operating systems are reduced because they all use a common library to access the database.

## SQLite&#39;s disadvantages

Obviously, if a database is stored locally, there&#39;s no real way for a number of different machines to access the data or to update it. On the other hand, SQLite does have support for concurrent reads and writes to the database on the same machine from multiple processes. (Writes lock the entire database until they complete, so do keep that in mind.)

Also, because the application does all the heavy lifting, responsiveness can bog down when running complex queries.

SQLite supports many advanced SQL capabilities, but not all of them. There are no stored procedures; and data types may be more limited than those of traditional server-based SQL databases.

Keep in mind, as well, that because the database is maintained inside the same process as the application, a compromised application could gain access to all the data stored in the SQLite database. An abrupt termination of the application might also cause the database to be left in an inconsistent state.

## What&#39;s the right use cases?

SQLite shines for delivering relational data to applications that can be accessed in offline environments. For example, a mobile application that needs to search for dealer locations when a phone is off the network could package a SQLite database with the application, and periodically update it by downloads that replace the entire file.

Another sweet spot is storing data that only needs to live locally, or is cached for later transmission to a remote system. A game could use a local SQLite database to store state information about the current player&#39;s progress.

Sometimes SQLite can be the right choice because it&#39;s &quot;just enough&quot; for a utility web service that doesn&#39;t need to scale. A developer can write an application or web service that uses a SQLite database, without having to worry about standing up a separate database server and managing the credentials to access it.

## Creating a SQLite database

Because there is no server with SQLite, the traditional approach of connecting to a database from a client to create a database doesn&#39;t work. Instead, most applications create their database inside the application itself. However, there are stand-alone programs that allow a user to create a SQLite database file using a traditional GUI. The most popular of these is [DB Browser for SQLite](https://sqlitebrowser.org/).

![DB Browser for SQLite](Turner_sqlite.png)

## Using SQLite in applications

From a developer standpoint, using SQLite as a persistence layer is largely the same as with any other SQL database. Drivers exist for JDBC and ODBC, and libraries are available for Swift, C, C++, and so on.

The typical work flow for a SQLite-based application is to check for an existing database, and if it is not present, to create one (unless a preexisting database is shipped with the application).
