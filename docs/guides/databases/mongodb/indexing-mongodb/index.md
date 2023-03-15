---
slug: indexing-mongodb
description: "Learn what MongoDB indexes are, how to create and modify them to improve your database query performance."
keywords: ['mongodb indexing best practices', 'mongodb indexing tutorial', 'mongodb indexing explained']
tags: ['database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-02-28
modified_by:
  name: Nathaniel Stickman
title: "How to Use Indexes in MongoDB"
title_meta: "MongoDB Indexing Explained"
external_resources:
- '[MongoDB: Indexes](https://www.mongodb.com/docs/manual/indexes/)'
- '[MongoDB: Create Indexes to Support Your Queries](https://www.mongodb.com/docs/manual/tutorial/create-indexes-to-support-queries/)'
- '[MongoDB: Performance Best Practices — Indexing](https://www.mongodb.com/blog/post/performance-best-practices-indexing)'
authors: ["Nathaniel Stickman"]
tags: ["saas"]
---

[MongoDB](https://www.mongodb.com/) is a NoSQL database, an alternative to relational SQL databases that uses JSON-like documents to store data. To learn about what MongoDB is and how it works, review our [Introduction to MongoDB and its Use Cases](/docs/guides/mongodb-introduction/) guide. Know more about the basics of using MongoDB in our [Getting Started with MongoDB](/docs/guides/getting-started-with-mongodb/) guide.

To have efficient performance on queries, your MongoDB database should make use of indices. An index prevents a query from having to scan every document in a collection, instead letting the query focus on just the relevant documents.

In this guide, you learn what MongoDB indices are and how to use them to improve queries. This guide also walks you through the various options of MongoDB indices, and strategies for using them with practical examples.

## Before You Begin

{{< content "mongodb-deployment-methods-shortguide" >}}

{{< content "mongodb-shell-shortguide" >}}

## How Does MongoDB Indexing Work?

MongoDB query performance is directly impacted by the amount of data stored in each collection in your database. The performance impact is even more noticeable when the documents stored are more complex. This is because queries typically have to scan every document in a collection to identify relevant results.

But query performance can be improved significantly by implementing effective *indexing*. An index identifies a particular field — or fields — and, by doing so, limits the number of documents that queries have to look through.

Indices are stored as separate, smaller data sets. The data in these data sets match the indexed data, but, because the data set is smaller, searches are significantly more efficient.

## Create MongoDB Indices

MongoDB indices can be created using a method on the collection you want to apply the indices on. The method takes the field, or fields, to be indexed.

The following sections show how to use that method to apply indices in different ways. The sections' examples use a data set that you can recreate with the following commands:

```command
use filmDb

db.actorCollection.insertMany([
    {
        firstName: "Chadwick",
        lastName: "Boseman",
        popularFilms: ["Law & Order", "Black Panther", "Da 5 Bloods"],
        startDate: 2003,
        latestDate: 2020
    },
    {
        firstName: "Xochitl",
        lastName: "Gomez",
        popularFilms: ["Gentefied", "The Baby-sitters Club", "Doctor Strange in the Multiverse of Madness"],
        startDate: 2016,
        latestDate: 2022
    },
    {
        firstName: "Chris",
        lastName: "Hemsworth",
        popularFilms: ["Star Trek", "The Cabin in the Woods", "Thor: Ragnarok"],
        startDate: 2002,
        latestDate: 2022
    },
    {
        firstName: "Tom",
        lastName: "Holland",
        popularFilms: ["The Secret World of Arrietty", "Spider-man: Homecoming", "The Devil All the Time"],
        startDate: 2010,
        latestDate: 2022
    },
    {
        firstName: "Elizabeth",
        lastName: "Olsen",
        popularFilms: ["Godzilla", "Avengers: Age of Ultron", "WandaVision"],
        startDate: 1994,
        latestDate: 2022
    }
])
```

```output
{
    "acknowledged" : true,
    "insertedIds" : [
        ObjectId("6287bc86de18010c521bd08a"),
        ObjectId("6287bc86de18010c521bd08b"),
        ObjectId("6287bc86de18010c521bd08c"),
        ObjectId("6287bc86de18010c521bd08d"),
        ObjectId("6287bc86de18010c521bd08e")
    ]
}
```

### Single-key Indices

Indexing on a single key is useful for collections in which you plan to query almost exclusively on one key. In the following example, the collection is indexed on the `startDate` field.

```command
db.actorCollection.createIndex( { startDate: 1 } )
```

```output
{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1
}
```

### Compound Indices

However, if you query regularly on more than one field, you should use a compound index. Compound indices keep their efficiency irrespective of whether one of the indexed fields or multiple indexed fields is used in a query.

The following example indexes the collection on the `startDate` and `latestDate` fields:

```command
db.actorCollection.createIndex(
    {
        startDate: 1,
        latestDate: 1
    }
)
```

```output
{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1
}
```

### Collation Indices

Collation allows you to define the language rules to use for string comparisons. It affects things like letter cases and accents.

The following example implements an English-language collation for the `popularFilms` field.

```command
db.actorCollection.createIndex(
    { popularFilms: 1 },
    { collation: { locale: "en" } }
)
```

```output
{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1
}
```

You can also see that the above applies the index for an array field. In these cases, MongoDB automatically uses a multi-key index, allowing each element in each array to be indexed.

### Text Indices

To effectively conduct text searches in a MongoDB collection, you need to add a text index. Doing so allows you to search for a given term or phrase within all indexed text fields.

The following example shows how to add a text index for the `firstName` and `lastName` fields.

```command
db.actorCollection.createIndex(
    {
        firstName: "text",
        lastName: "text"
    }
)
```

```output
{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1
}
```

That index lets you run a search like the one below:

```command
db.actorCollection.find( { $text: { $search: "Chris" } } ).pretty()
```

```output
{
    "_id" : ObjectId("6287bc86de18010c521bd08c"),
    "firstName" : "Chris",
    "lastName" : "Hemsworth",
    "popularFilms" : [
        "Star Trek",
        "The Cabin in the Woods",
        "Thor: Ragnarok"
    ],
    "startDate" : 2002,
    "latestDate" : 2022
}
```

Our guide **How to Navigate MongoDB Databases** includes more about how to conduct text searches in your MongoDB collections.

## Modify Indices

After creating indices, you may want to review and remove some that are no longer relevant. You can list the indices for a given collection using the command below:

```command
db.actorCollection.getIndxes()
```

```output
[
    {
        "v" : 2,
        "key" : {
            "_id" : 1
        },
        "name" : "_id_"
    },
    {
        "v" : 2,
        "key" : {
            "startDate" : 1
        },
        "name" : "startDate_1"
    },
    {
        "v" : 2,
        "key" : {
            "startDate" : 1,
            "latestDate" : 1
        },
        "name" : "startDate_1_latestDate_1"
    },

    [...]
]
```

You can remove an index using the `dropIndex` method on the collection, providing the method with the index name. The example above removes the index related to the `startDate` field.

```command
db.actorCollection.dropIndex("startDate_1")
```

```output
{ "nIndexesWas" : 5, "ok" : 1 }
```

## MongoDB Index Best Practices

To make the most of indices on your MongoDB collection, you should keep in mind some best practices. These ensure that, when you use indices, they are set up to improve query performance and overall database performance.

The list that follows is not comprehensive, but it includes key principles for maintaining efficient indexing.

- Use compound indices. Further, you should use the ESR approach to the order of compound indices. This means you put fields for *equality* first, then fields concerned with *sort order*, and finally fields related to the *range* of queried data.

- Conduct covered queries for indexed documents when possible. A covered query only includes fields from the collection's index, and these queries perform much more efficiently. Following is an example of a covered query, assuming the collection has a compound index on the `startDate` and `latestDate` fields.

    ```command
    db.actorCollection.find(
        { startDate: { $gte: 2010 } },
        { startDate: 1, latestDate: 1, _id: 0 }
    )
    ```

    ```output
    { "startDate" : 2010, "latestDate" : 2022 }
    { "startDate" : 2016, "latestDate" : 2022 }
    ```

    Learn more about covered queries in MongoDB's [official documentation](https://www.mongodb.com/docs/manual/core/query-optimization/#covered-query).

- Know when indexing is not efficient for your collection. For instance, collections that tend to have a high ratio of writing activities to reading ones may have negative performance impacts from maintaining indices. This is because, each time after writing, the collection needs to be re-indexed.

## Conclusion

In this guide, you have learned major MongoDB indexing strategies and options for getting the most out of indices. With performance best practices and concrete examples, this guide can be a useful reference when working on making your MongoDB databases more efficient. Looking to dive deeper into MongoDB? Be sure to peruse our other [MongoDB guides](/docs/guides/databases/mongodb/) for more on setting up and getting the most out of MongoDB.