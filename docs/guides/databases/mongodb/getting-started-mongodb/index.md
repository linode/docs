---
slug: getting-started-with-mongodb
author:
  name: Linode Community
  email: docs@linode.com
description: "MongoDB gives you a flexible and less rigid way to store your data than traditional relational databases. But where to learn how to get started with it? Look no further. This tutorial gives everything you need to start using MongoDB."
keywords: ['mongodb tutorial','getting started mongodb','basic mongodb commands']
tags: ['database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-09
modified_by:
  name: Nathaniel Stickman
title: "Getting Started with MongoDB"
h1_title: "Introduction to MongoDB"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[MongoDB: Getting Started](https://www.mongodb.com/docs/manual/tutorial/getting-started/)'
- '[freeCodeCamp: How to Get Started with MongoDB in 10 Minutes](https://www.freecodecamp.org/news/learn-mongodb-a4ce205e7739/)'
- '[GeeksforGeeks: MongoDB — Getting Started](https://www.geeksforgeeks.org/mongodb-getting-started/)'
---

[MongoDB](https://www.mongodb.com/) is a NoSQL database, that provides more flexible and less rigidly structured data storage than traditional relational databases.

Learn all about what MongoDB is and how it works in our [Introduction to MongoDB and its Use Cases](https://www.linode.com/docs/guides/mongodb-and-its-use-cases/) guide.

But how do you get started using MongoDB? What are the basic MongoDB commands for operations like queries, inserts, updates, and deletions?

This MongoDB guide introduces you to all the basic MongoDB operations you need to get started. It sets you up to begin effectively populating and using your MongoDB instance.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Setup and Secure a Linode Compute Instance](/docs/security/securing-your-server/) guide to creating a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

            sudo apt update && sudo apt upgrade

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

            sudo dnf upgrade

1. Install MongoDB on your Linux system. You can follow our guide on [How To Install MongoDB on Ubuntu 16.04](/docs/guides/install-mongodb-on-ubuntu-16-04/) or our guide on [How To Install MongoDB on CentOS 7](/docs/guides/install-mongodb-on-centos-7/).

    For other Linux distributions, you can follow MongoDB's [official Linux installation documentation](https://www.mongodb.com/docs/manual/administration/install-on-linux/).

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Working with Databases

Once you have MongoDB installed on your Linux system, you can start working with its databases. Doing so allows you to keep multiple databases on a single MongoDB instance.

Just start up the MongoDB shell with the `mongo` command. The following sections introduce you to the main MongoDB shell commands you can use to review and manipulate your MongoDB instance's databases.

### Check Current Database

You can ascertain the name of the database your MongoDB shell is currently in using the following command:

    db

{{< output >}}
test
{{< /output >}}

As you see, by default you start in the `test` database.

### Create a Database

You can create a custom database to fit your needs with the `use` command. It accepts the database name as a parameter. It assumes your instance does not already have a database with that name.

The example below creates a database named `exampleDb`, assuming that a database with that name does not already exist on the instance:

    use exampleDb

{{< output >}}
switched to db exampleDb
{{< /output >}}

MongoDB automatically switches the current database to the new database:

    db

{{< output >}}
exampleDb
{{< /output >}}

### List Databases

MongoDB provides a command that lets you see a list of your instance's databases:

    show databases

{{< output >}}
admin   0.000GB
config  0.000GB
local   0.000GB
{{< /output >}}

You can see from the example above that `exampleDb` has not been included. This is because a database does not get permanently stored until data gets added to it.

Once data gets added to the `exampleDb` database, which you can see in later sections of this guide, the database displays in the list:

{{< output >}}
admin      0.000GB
config     0.000GB
exampleDb  0.000GB
local      0.000GB
{{< /output >}}

### Change Current Database

The `use` command is not only used to create a database, but also to change the current database. It creates a database if it does not already exist.

If the `exampleDb` database already exists, the following command switches over to it as your current database:

    use exampleDb

{{< output >}}
switched to db exampleDb
{{< /output >}}

## Working with Documents

Databases become useful once they have data stored in them. With MongoDB, data is stored in the form of *documents*. A MongoDB document is an object in the [BSON](http://bsonspec.org/) format, which is similar to JSON. (Take a look at the specifications in the link to know more about the differences between BSON and JSON).

Documents are stored in a given database within a *collection*. If you are familiar with SQL databases, you can think of a collection as a table. Collections provide ways of organizing documents within a given database.

The following sections cover everything you need to start working with collections and documents and to start filling your MongoDB database with useful data.

### Using Collections

To create a collection, you can simply call the collection name appended to the `db` prefix. For instance, the command below creates a collection named `exampleCollection` in the current database (which is `exampleDb` which was created in the previous section).

    db.exampleCollection

{{< output >}}
exampleDb.exampleCollection
{{< /output >}}

You can list the collections in the current database using the command below. However, a collection only persists once data has been added to it. Collections with no data thus is not displayed from the command below.

The following example assumes that data has already been added to the `exampleCollection`, which you can see in the following section of the guide.

    show collections

{{< output >}}
exampleCollection
{{< /output >}}

### Adding Documents

You can add documents to a MongoDB collection through the `insert` method. This method takes one object or a list of objects, adding each object to the collection.

    db.exampleCollection.insert([
        {
            "id": 1,
            "name": "First Test Entry"
        },
        {
            "id": 2,
            "name": "Second Test Entry"
        }
    ])

{{< output >}}
BulkWriteResult({
    "writeErrors" : [ ],
    "writeConcernErrors" : [ ],
    "nInserted" : 2,
    "nUpserted" : 0,
    "nMatched" : 0,
    "nModified" : 0,
    "nRemoved" : 0,
    "upserted" : [ ]
})
{{< /output >}}

MongoDB also has two methods dedicated to adding a single document or in bulk.

- You can use the `insertOne` method when you only want to insert a single document.

        db.exampleCollection.insertOne(
            {
                "id": 3,
                "name": "Another Test Entry"
            }
        )

    {{< output >}}
{
    "acknowledged" : true,
    "insertedId" : ObjectId("62757aa798fcda5eac416190")
}
    {{< /output >}}

- You can use the `insertMany` method when you want to insert a list of documents.

        db.exampleCollection.insertMany([
            {
                "id": 4,
                "name": "Another Entry for Testing"
            },
            {
                "id": 5,
                "name": "Test Entry, yet Another"
            }
        ])

    {{< output >}}
{
    "acknowledged" : true,
    "insertedIds" : [
        ObjectId("62757b4298fcda5eac416191"),
        ObjectId("62757b4298fcda5eac416192")
    ]
}
    {{< /output >}}

Functionally, the `insert` method can handle both the single entries of `insertOne` and the multiple entries of `insertMany` methods. However, these additional methods provide different outputs, as seen above, which may prove useful depending on the kind of response you need.

### Querying Documents

MongoDB has two primary query commands-`find()` and `findOne()`. When used without a filter, each query command fetches from the entirety of a given collection.

The `find()` command fetches all matching documents while the `findOne()` command fetches the first document from the matches.

The `find()` used on the `exampleCollection` from above looks like the following:

    db.exampleCollection.find()

{{< output >}}
{ "_id" : ObjectId("62757a0798fcda5eac41618e"), "id" : 1, "name" : "First Test Entry" }
{ "_id" : ObjectId("62757a0798fcda5eac41618f"), "id" : 2, "name" : "Second Test Entry" }
{ "_id" : ObjectId("62757aa798fcda5eac416190"), "id" : 3, "name" : "Another Test Entry" }
{ "_id" : ObjectId("62757b4298fcda5eac416191"), "id" : 4, "name" : "Another Entry for Testing" }
{ "_id" : ObjectId("62757b4298fcda5eac416192"), "id" : 5, "name" : "Test Entry, yet Another" }
{{< /output >}}

Similarly, the `findOne()` on the `exampleCollection` from above looks like the following:

    db.exampleCollection.findOne()

{{< output >}}
{ "_id" : ObjectId("62757a0798fcda5eac41618e"), "id" : 1, "name" : "First Test Entry" }
{{< /output >}}

You can also get a count of documents in a given collection using the `count` method:

    db.exampleCollection.count()

{{< output >}}
5
{{< /output >}}

#### Filtering Documents

You often want to query more specifically by applying filters. Both the `find()` and `findOne()` methods can take an object as an argument. In the object, you can provide properties to filter your query by using the following command:

    db.exampleCollection.findOne(
        {
            "id": 2
        }
    )

{{< output >}}
{
    "_id" : ObjectId("62757a0798fcda5eac41618f"),
    "id" : 2,
    "name" : "Second Test Entry"
}
{{< /output >}}

MongoDB filters also support comparison operators; the full list can be found in the [MongoDB official documentation](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-projection-operators-top).

For demonstration, the following are some of the useful operators for filtering queries:

- Use `$lt` for "less than" and `$lte` for "less than or equal to":

        db.exampleCollection.find(
            {
                "id": { $lt: 3 }
            }
        )

    {{< output >}}
{ "_id" : ObjectId("62757a0798fcda5eac41618e"), "id" : 1, "name" : "First Test Entry" }
{ "_id" : ObjectId("62757a0798fcda5eac41618f"), "id" : 2, "name" : "Second Test Entry" }
    {{< /output >}}


- Use `$gt` for "greater than" and `$gte` for "greater than or equal to":

        db.exampleCollection.find(
            {
                "id": { $gte: 3 }
            }
        )

    {{< output >}}
{ "_id" : ObjectId("62757aa798fcda5eac416190"), "id" : 3, "name" : "Another Test Entry" }
{ "_id" : ObjectId("62757b4298fcda5eac416191"), "id" : 4, "name" : "Another Entry for Testing" }
{ "_id" : ObjectId("62757b4298fcda5eac416192"), "id" : 5, "name" : "Test Entry, yet Another" }
    {{< /output >}}

- Use `$ne` for "not equal to":

        db.exampleCollection.find(
            {
                "name": { $ne: "First Test Entry" }
            }
        )

    {{< output >}}
{ "_id" : ObjectId("62757a0798fcda5eac41618f"), "id" : 2, "name" : "Second Test Entry" }
{ "_id" : ObjectId("62757aa798fcda5eac416190"), "id" : 3, "name" : "Another Test Entry" }
{ "_id" : ObjectId("62757b4298fcda5eac416191"), "id" : 4, "name" : "Another Entry for Testing" }
{ "_id" : ObjectId("62757b4298fcda5eac416192"), "id" : 5, "name" : "Test Entry, yet Another" }
    {{< /output >}}

- Use `$and` and `$or` for logical *and* and *or* operations. These operators should be used as if they were properties with the desired conditions provided as a list of objects.

    The example below combines a search for documents where `id` is greater than `2` and less than `5`:

        db.exampleCollection.find( {
            $and: [
                {
                    "id": { $gt: 2 }
                },
                {
                    "id": { $lt: 5 }
                }
            ]
        } )

    {{< output >}}
{ "_id" : ObjectId("62757aa798fcda5eac416190"), "id" : 3, "name" : "Another Test Entry" }
{ "_id" : ObjectId("62757b4298fcda5eac416191"), "id" : 4, "name" : "Another Entry for Testing" }
    {{< /output >}}

Learn more about comparison and logical query operations in our guide on [How to Navigate MongoDB Databases](/docs/guides/navigating-mongodb).

### Updating Documents

MongoDB documents can also be updated, allowing you to change existing documents in a collection.

There are two methods for modifying existing documents, and each one takes two required arguments. The first argument is the query filter identifying the document or documents you want to modify. The second argument uses the `$set` property to modify one or more fields on the document.

Use the `updateOne` method for modifying just one document. The example below queries the document where `id` is `1` and modifies its `name` to `The First Test Entry`:

    db.exampleCollection.update(
        {
            "id": 1
        },
        {
            $set: { "name": "The First Test Entry" }
        }
    )

{{< output >}}
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
{{< /output >}}

Use the `updateMany` method, on the other hand, for modifying multiple documents at once. The example below shows a filter matching all documents where `id` is greater than `2`. For each, the `name` is changed to `Another Test Entry`:

    db.exampleCollection.updateMany(
        {
            "id": { $gt: 2 }
        },
        {
            $set: { "name": "Another Test Entry" }
        }
    )

{{< output >}}
{ "acknowledged" : true, "matchedCount" : 3, "modifiedCount" : 2 }
{{< /output >}}

### Removing Documents

Removing a document from a MongoDB collection is straightforward and uses the `deleteOne()` and `deleteMany()` methods. Much like the update methods above, each takes a filter as an argument. The filter identifies the document or documents you want to remove.

So, to remove the first entry from the `exampleCollection`, use the command below:

    db.exampleCollection.deleteOne(
        {
            "id": 1
        }
    )

{{< output >}}
{ "acknowledged" : true, "deletedCount" : 1 }
{{< /output >}}

And to remove all entries after `"id": 3`, use the command below:

    db.exampleCollection.deleteMany(
        {
            "id": { $gt: 3 }
        }
    )

{{< output >}}
{ "acknowledged" : true, "deletedCount" : 2 }
{{< /output >}}

MongoDB also comes with the ability to remove all documents from a collection at once. This is accomplished using the `deleteMany()` method with a blank object as the argument:

    db.exampleCollection.deleteMany( {} )

{{< output >}}
{ "acknowledged" : true, "deletedCount" : 3 }
{{< /output >}}

### Removing a Collection

The `deleteMany()` method described in the section above removes all of the documents in a collection. However, it does not remove the collection itself.

To do that, you can use the `drop()` method:

    db.exampleCollection.drop()

{{< output >}}
true
{{< /output >}}

## Conclusion

This tutorial has laid out the basics of MongoDB you need for getting started. From how to work with databases and collections, to inserting and modifying documents, this guide gives you the tools you need.

Looking to dive deeper into MongoDB? Be sure to peruse our other [MongoDB guides](/docs/guides/databases/mongodb/) for more on setting up and getting the most out of MongoDB. And take a look at our [How to Navigate MongoDB Databases](/docs/guides/navigating-mongodb) for more on querying and text searches.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
