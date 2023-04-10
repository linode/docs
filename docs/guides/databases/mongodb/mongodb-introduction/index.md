---
slug: mongodb-introduction
description: 'This article introduces MongoDB, explains how it differs from other SQL databases, and provides some use cases.'
keywords: ['what is mongodb','mongodb vs sql','is mongodb a relational database','nosql']
tags: ['mysql', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-14
modified_by:
  name: Linode
title: "What Is MongoDB and Why Use It?"
title_meta: "Introduction to MongoDB and Its Use Cases"
external_resources:
- '[MongoDB Basics Tutorial](https://university.mongodb.com/courses/M001/about)'
- '[MongoDB Documentation](https://docs.mongodb.com/)'
aliases: ['/guides/mongodb-and-its-use-cases/']
authors: ["Jeff Novotny"]
---

[*MongoDB*](https://www.mongodb.com/) is a *document-oriented database* and an alternative to traditional *Relational DataBase Management System* (RDBMS) applications. MongoDB is a *NoSQL* database that stores data in a more flexible and less structured manner. This guide provides an introduction to MongoDB and describes how it works. It also explains how MongoDB differs from SQL-based databases including [MySQL](https://www.mysql.com/) and lists its main use cases.

## What is MongoDB?

MongoDB is a source-available document-oriented database originally developed by MongoDB Inc. It is free to use under the [*Server Side Public License*](https://en.wikipedia.org/wiki/Server_Side_Public_License) (SSPL). MongoDB is available for most operating systems, including Windows, macOS, and most Linux distributions. The free MongoDB Community Edition is designed for smaller organizations, while the commercial MongoDB Enterprise Server is packaged with advanced features and includes customer support. MongoDB Atlas is a fully managed service that runs inside a cloud.

{{< note >}}
The details of the MongoDB SSPL have been highly debated. Under the SSPL, anyone offering a product incorporating SSPL-licensed technology must also release their software. Some industry professionals believe this does not fully meet the criteria for an open-source license. It is best to thoroughly investigate the terms of the agreement before developing any software based on MongoDB.
{{< /note >}}

MongoDB is not a relational database. It does not store data as rows inside database tables. Instead, it stores data in documents. This means it is categorized as a NoSQL application. This allows users to save their data in a flexible and freeform manner. Users can define their own database schema to align with their internal data and programming structures. MongoDB documents can be organized using a strategy that closely maps to the classes and objects of object-oriented programming languages. This allows it to efficiently interact with client applications.

Each MongoDB document can have its own structure, and documents can be easily modified at any time. Unlike most RDBMS systems, the document schema does not have to be defined beforehand. MongoDB documents use a variation of the industry-standard *JavaScript Object Notation* (JSON) file format named *Binary JSON* (BSON). JSON is an open-standard file format that stores information as attribute-value pairs in human-readable text. BSON condenses and streamlines the data using binary encoding. It is more efficient than JSON in terms of storage space because it can be more easily parsed. However, it is not as readable and usually has to be decoded. MongoDB can still store JSON documents or retrieve BSON data in JSON format. Data in either CSV or JSON format can be easily imported into MongoDB.

MongoDB does not use the *Structured Query Language* (SQL) for queries. It instead uses the MongoDB Query API to insert, update, or delete documents, and retrieve data. The API additionally includes a bulk write operator. For more information on how to use the API, consult the [*MongoDB Query API documentation*](https://docs.mongodb.com/manual/crud/#std-label-crud).

MongoDB has some other distinctive characteristics. It is designed as a distributed database, which allows it to scale and store large amounts of data and achieve high availability. MongoDB also supports ad hoc queries based on regular expressions or JavaScript functions. MongoDB provides support for real-time aggregation as a way to sort and organize the queries.

For information on how to install MongoDB on a Linode, see our guide on [How To Install MongoDB on CentOS 7](/docs/guides/install-mongodb-on-centos-7/), or the guide on [How To Install MongoDB on Ubuntu 16.04](/docs/guides/install-mongodb-on-ubuntu-16-04/).

{{< note >}}
Earlier releases of MongoDB had some problems with security issues and some significant bugs. These have been fixed in recent releases and application security is now comparable to other databases.
{{< /note >}}

## MongoDB vs SQL

The most popular type of database is the *Relational DataBase Management System* (RDBMS). RDBMS applications use the SQL programming language to store and retrieve data and administer the database. An RDBMS or SQL-based database uses tables, rows, and columns in the following manner:

- Each database is a repository for a set of tables.
- A table is defined as a set of columns. Each column is associated with a particular data type. An example of a type is `VARCHAR`, standing for a variable-length string. A column represents a specific attribute of the record.
- A table is populated with rows. Each row in a table is a different entry in the database.
- A database table is like a two-by-two matrix. Each square inside the matrix represents one column of a row and contains a piece of data.

In contrast, MongoDB is a document-based database, which is a type of NoSQL database. As the name suggests, NoSQL databases do not use SQL. They access data using a proprietary API or another similar method. MongoDB data is described using different terms than an RDBMS application. Instead of using tables, rows, and columns, MongoDB stores documents inside collections. Each document contains a list of fields, with each field containing a key-value pair. See the following sections for more information about the internal structure of MongoDB.

On a system level, MongoDB differs from a typical RDBMS in several major ways. To make a sound decision on choosing a NoSQL vs a SQL database, consider the following points:

- RDBMS databases are relational. The database is structured around relationships between tables and columns. NoSQL databases, including MongoDB, are non-relational. Users do not have to define any connections between the various documents or collections.
- RDBMS applications are always table-based. Data is stored inside multi-column rows within a table. NoSQL databases do not use tables to store the data. Data is stored in documents, key-value pairs, graphs, or wide columns.
- SQL databases are highly suitable for well-structured data where the entries contain the same fields. MongoDB and other NoSQL databases are better for unstructured or variable data.
- SQL databases are designed to update several rows at a time. NoSQL databases are most effective at updating one document at a time, although they can handle multiple simultaneous updates.
- SQL databases are typically *vertically scalable*. The server administrator must increase the memory or CPU of the server to increase speed or handle more data. NoSQL databases are more frequently *horizontally scalable*. Capacity is increased by adding more servers to a cluster and configuring load balancing. Consequently, most NoSQL clusters can handle more data than a single-server relational database.
- RDBMS systems are well established and very reliable. Resources for relational databases are widely available and industry knowledge is very deep. NoSQL databases are not as well established and do not have as large of a community.
-  NoSQL databases do not reduce data duplication the way relational databases do. Consequently, a NoSQL database typically requires more storage space than an equivalent RDBMS.

Due to the very different models of SQL and NoSQL databases, they are often used in different scenarios. When designing and using a MongoDB database, keep the following points in mind, especially regarding the differences with an RDBMS.

- With SQL, the database schema must be designed in advance. The databases and tables must be created before any data is stored. RDBMS applications enforce a certain amount of pre-planning. The MongoDB entities can be created when data is added and do not have to be configured beforehand.
- In an RDBMS, the columns and their data types are specified in the table definition. Each new row in a table must correspond with this definition. In MongoDB, different documents inside the same collection do not have to have the same fields, keys, or schemas. The data type of a field can vary across different documents. However, in most actual deployments, the documents in a collection share a similar structure. MongoDB allows users to add validation rules to help maintain data consistency.
- When using a relational database, columns can only be added or removed if the table is modified using SQL commands. Changing a table changes the columns in every row. But in MongoDB, the fields in a document can be updated without updating any other documents in the collection.
- MongoDB permits data to be formatted hierarchically. The value of a field can be another set of fields. Relational databases do not usually allow this type of structure. The table columns store scalar data.
- MongoDB is defined to work in tandem with object-oriented languages. A document can be designed so its fields match the attributes of a class. This allows an application to easily transfer data from an application to the database and vice versa. SQL-based databases have no concept of objects. This means it is typically easier for developers to design an application that interacts with MongoDB.
- In MongoDB, cross-references are indicated through *references* from one document to another. The value of a field in one document can be the ID of another document. In SQL, other tables are referenced using foreign keys. For instance, the `clientID` in the `Accounts` table could be a foreign key that points to the `Customer` table.

The freedom of MongoDB is very appealing, but it is important to spend some time thinking about the architecture beforehand. Decisions taken without any coordination or planning could result in data that is difficult to understand and use.

MongoDB and SQL databases also differ in terms of their atomicity, performance, and reliability.

- **Atomicity:** In database terminology, an atomic operation is an indivisible operation. It either completely happens or it does not happen at all. A MongoDB write operation on a single document is always atomic, even when updating embedded documents. The Query API permits multiple documents to be updated in the same operation, but this is not guaranteed to be atomic. In an RDBMS, transactions could be atomic depending on the database and the storage engine. For example, MySQL guarantees atomicity when used with the InnoDB storage facility. For more information on the atomicity of MongoDB, see the [MongoDB Transactions Documentation](https://docs.mongodb.com/manual/core/transactions/).
- **Performance:** MongoDB features very good performance. This can be further improved using primary and secondary indexes and other optimizations. Performance between different database applications is sometimes difficult to compare. However, NoSQL databases are generally much faster than SQL-based databases. This is because they do not have to perform joins or verify indexes and foreign keys. The precise performance of MongoDB depends on how the data is stored and whether multiple documents must be accessed.
- **High-availability:** Robust high-availability capabilities based on replica sets are built-in to MongoDB. A replica set consists of at least two and preferably three copies of the data, and an arbiter daemon. All reads and writes are done on the primary replica, while secondary replicas maintain their own copies. At start-up time, or when a primary replica fails, the arbiter chooses a new primary through an election process. It is also possible for a secondary replica to handle read-only operations, but secondary replicas are not guaranteed to be completely up-to-date. RDBMS systems are not designed with this feature in mind, but some applications might provide this functionality. Most relational databases are considered highly reliable even without backups.

As with most relational databases, MongoDB is packaged with a command-line utility. The `mongosh` tool can be used to import data from CSV or JSON files and perform administration tasks including security.

Most statements from the SQL programming language can be translated into equivalent forms for the MongoDB Query API. For example, the SQL command `INSERT INTO <table_name>` becomes the `<collection_name>.insertOne` method call in the API.

Notice the changes between the SQL command,

    INSERT INTO employees(employee_id, age, department) VALUES ("b5007", 55, "Marketing")

versus the MongoDB Query API version:

    db.employees.insertOne(
        { employee_id: "b5007", age: 55, department: "Marketing" }
    )

The MongoDB documentation includes a handy [SQL to MongoDB Mapping Chart](https://docs.mongodb.com/manual/reference/sql-comparison/)that you can reference.

### Documents and Collections

MongoDB's architecture is described with different terms than a relational database. Instead of the terms table, row, column, and join, the words document, collection, and field are used.

Both SQL and MongoDB use the term *database* to refer to the top-level container. A single database typically serves a specific purpose or is used by an individual customer, and contains the entire body of data for this instance. MongoDB automatically creates a database when it is first used. This is different than in relational databases, where the database must be created before it is used.

Each MongoDB database contains one or more *collections*. MongoDB creates a collection and assigns it an immutable UUID when the collection is first used. A collection is similar to a file folder. A MongoDB collection is not given a default structure and is not associated with a specific definition or a template. However, it is possible to explicitly create a collection and assign it a number of optional parameters, including maximum size, and validation rules. At the same level of an RDBMS application, each database contains a set of tables. However, a table must be defined, along with its columns, before it can be used.

Because MongoDB is document-oriented, each collection contains a series of documents. A *document* can be thought of as an entry within the database. MongoDB documents contain a variable number of *fields*, which are used to store the data. Each field consists of a key-value pair. Commas separate the fields, while braces `{}` enclose the entire contents of the document. The different documents inside a collection do not have to share the same format or schema. The names of the field key and the data types can vary between documents. An RDBMS application stores a data entry as a row within a table. In a relational database, each row represents a distinct entry. Every row in a table must follow the same format and include the same columns.

MongoDB automatically adds a field named `_id` to each document. The `_id` field stores the internal ID of the document and functions as its unique primary key.

MongoDB has an object named a *cursor* that is somewhat related to collections and documents. A cursor is a pointer to the list of documents that are returned from a database query.

To summarize, a MongoDB database contains a number of collections, and a collection contains a cluster of documents. Each document contains zero or more fields. Every field is composed of a key-value pair. The following table compares the RDBMS terminology with the MongoDB equivalents.

| RDBMS| MongoDB |
|:-:|:-:|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |

### Key-Value Pairs

Each MongoDB document is composed of a list of fields. These are equivalent to key-value pairs. A field must include both a key and a value, separated by the `:` symbol, to be syntactically valid. In MongoDB, all data must be stored in fields, so the key-value pairs collectively represent the entire contents of the database.

The names of the keys can vary between documents and so can the number of fields. Type consistency is not enforced. Therefore, two documents in the same collection can look radically different. The field schema does not have to be defined ahead of time. Users can append new fields, or delete and modify existing ones, at any time, without regard to the rest of the collection. A table column in a SQL-based database is much more restrictive. In a relational database, the columns are consistent across all rows in a table. Additionally, the contents of a column must have the same type in every row.

The key-values are written in the BSON format. Experienced users can partially decipher BSON data, but it typically needs to be decoded into JSON to be completely understandable. Each document can contain a very large number of fields.

The following MongoDB sample document represents an individual employee in the `Employees` collection. The document consists of four fields. The first field stores the MongoDB-generated internal document ID. The name of the key for this field is `_id` and the value is the unique document ID. The first user-defined field consists of the key `firstname`, which has the value `John`. Each field, except the last one, is followed by a comma. The key and value are delimited using the colon symbol `:`, while braces enclose the list of fields.

    {
        _id: <ObjectID>,
        firstname: "John",
        lastname: "Doe",
        Group: "Marketing"
    }

Unlike a relational database, MongoDB permits nested fields. Any key-value pair can have a value that is another set of key-value pairs. This allows documents to represent hierarchical information. A nested set of key-value pairs that serve as the value for a top-layer key is referred to as an *embedded document*. An embedded document allows users to embed the second level of document-like data inside the main document. It can be thought of as a "document inside a document". This type of data is referred to as *denormalized* data. In many situations, this might be the most accurate way to represent the data.

This differs from how hierarchical relationships are implemented in an RDBMS. In a SQL-based table, the columns in a table store discrete data items. They are not designed to hold sub-records or arrays. Ancillary relationships are defined through foreign keys and joins with another table. MongoDB is much more flexible because it allows each document to maintain a different hierarchy and does not require foreign or compound keys. Embedded documents take the place of joins in a relational database. However, it is much more likely for MongoDB data to be duplicated in different embedded documents compared with RDBMS tables.

In this example, a key named `mailingAddress` has an embedded document for a value. This embedded document consists of four nested key-value pairs, `streetAddress`, `city`, `state`, and `postalCode`. This particular embedded document might be structured as shown below.

    mailingAddress: {
        streetAddress: "123 Some Street",
        city: "BigCity",
        state: "NY",
        postalCode: 10221
    },

For more information on embedded documents and schema design, consult the [MongoDB documentation on data model design](https://docs.mongodb.com/manual/core/data-model-design/).

## Why Use MongoDB?

MongoDB is an excellent choice to use with semi-structured data in situations requiring flexibility. As a document-oriented database, it is highly extensible and works well with programs written in object-oriented languages. Aside from the natural characteristics of NoSQL databases, MongoDB has the following advantages:

- It offers the user complete flexibility to organize and structure data in any manner. It is easy to align the documents in a collection with the exact objects and classes in an application.
- It supports ad-hoc queries based on fields and regular expressions. These queries can also include personalized JavaScript functions. Queries are much more open-ended and flexible than SQL statements.
- MongoDB is optimized for high-volume data sets and is highly scalable. It can implement load balancing across multiple servers using shards. The user-defined shard key determines how the data is distributed across servers according to ranges.
- MongoDB is designed with high availability in mind. It includes highly-robust and powerful replication and backup mechanisms. Different workloads can be isolated in the same cluster and data can be stored globally or locally.
- It offers high performance and is noticeably faster than relational databases, especially when writing data.
- MongoDB includes unique aggregation tools that allow users to select and group documents based on a particular attribute or the result of a function call.
- MongoDB is easy for developers to learn and use. It is less complicated and has fewer technical details than RDBMS applications.
- In terms of infrastructure components, MongoDB provides many built-in features to secure the database. It is highly portable, and platform, and cloud-agnostic. It allows users to port their data to other environments or change clouds or vendors. MongoDB provides drivers for over ten languages.
- MongoDB can use the GridFS component to act as a file system. Files can be replicated and load-balanced across multiple servers.
- The *capped collections* feature can be used to improve performance. This characteristic limits the size of a collection maintains insertion order and acts as a circular queue.

## Conclusion

This guide answers the question, "What is MongoDB?" MongoDB is a document-oriented NoSQL database, not a relational database. It stores its data entries as documents. Each MongoDB consists of a number of collections, and each collection contains a set of documents. The syntax of a MongoDB document is based on a variation of the JSON file format. It is composed of a set of fields, where each field has a key and a value. Fields can be nested inside each other. A nested field is referred to as an embedded document.

Compared to SQL, MongoDB handles unstructured data more effectively and offers more flexibility. The documents inside a collection do not have to have the same fields or data types, and individual documents can easily be modified. MongoDB is much faster than an RDBMS, and scales more easily using horizontal scaling. MongoDB uses replicas to deliver an advanced high-availability system, and feature powerful ad-hoc queries that can incorporate regular expressions and JavaScript functions. For more information about MongoDB, see the [MongoDB documentation](https://docs.mongodb.com/).