---
slug: navigate-mongodb-databases
description: "Learn how to navigate your MongoDB database. From examples of the various query operators through text searches and indexing, this tutorial has you covered."
keywords: ['mongodb query examples','mongodb filter query','mongodb text search']
tags: ['database', 'nosql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-02-28
modified_by:
  name: Nathaniel Stickman
title: "Navigate MongoDB and Query Your Data"
external_resources:
- '[MongoDB Manual: Query Documents](https://www.mongodb.com/docs/manual/tutorial/query-documents/)'
- '[MongoDB Guides: Read Data from MongoDB With Queries](https://www.mongodb.com/docs/guides/server/read_queries/)'
authors: ["Nathaniel Stickman"]
tags: ["saas"]
---

[MongoDB](https://www.mongodb.com/) is a flexible, NoSQL database solution which stores data as JSON-like documents. Compared to other database systems, MongoDB has much more to offer for effectively working with data. For those familiar with SQL, it may take some time and experience before feeling confident using MongoDB. This MongoDB tutorial shows you how to make more advanced queries. From querying arrays and nested objects to using comparative and logical operations, learn it all in this guide with practical examples.

{{< note >}}
Learn all about what MongoDB is and how it works in our [Introduction to MongoDB and its Use Cases](/docs/guides/mongodb-introduction/) guide. Then, find out about the basics of using MongoDB in our [Getting Started with MongoDB](/docs/guides/getting-started-with-mongodb/) guide.
{{< /note >}}

## Before You Begin

{{< content "mongodb-deployment-methods-shortguide" >}}

{{< content "mongodb-shell-shortguide" >}}

## Query Documents

The following sections show you various ways to query your MongoDB data. To apply the techniques, each section includes examples using a set of documents related to books. You can add the data to your own MongoDB instance using the commands shown below:

```command
use libraryDb

db.bookCatalog.insertMany([
    {
        "title": "A Midsummer Night's Dream",
        "author": "William Shakespeare",
        "originalPublicationYear": 1600,
        "originalPublisherLocation": ["London", "England"],
        "editions": [
            {
                "publicationYear": 2004,
                "publisher": "Simon & Schuster",
                "format": "paperback"
            },
            {
                "publicationYear": 2018,
                "publisher": "W. W. Norton & Company",
                "format": "paperback"
            }
        ]
    },
    {
        "title": "Othello",
        "author": "William Shakespeare",
        "originalPublicationYear": 1622,
        "originalPublisherLocation": ["London", "England"],
        "editions": [
            {
                "publicationYear": 1993,
                "publisher": "Simon & Schuster",
                "format": "paperback"
            },
            {
                "publicationYear": 2008,
                "publisher": "Dover Publications",
                "format": "paperback"
            }
        ]
    },
    {
        "title": "The Sound and the Fury",
        "author": "William Faulkner",
        "originalPublicationYear": 1929,
        "originalPublisherLocation": ["New York", "United States"],
        "editions": [
            {
                "publicationYear": 1956,
                "publisher": "Random House",
                "format": "hardcover"
            },
            {
                "publicationYear": 1990,
                "publisher": "Vintage",
                "format": "paperback"
            },
            {
                "publicationYear": 1992,
                "publisher": "Modern Library",
                "format": "hardcover"
            }
        ]
    },
    {
        "title": "Everything that Rises Must Converge",
        "author": "Flannery O'Connor",
        "originalPublicationYear": 1965,
        "originalPublisherLocation": ["New York", "United States"],
        "editions": [
            {
                "publicationYear": 1984,
                "publisher": "Farrar, Straus and Giroux",
                "format": "hardcover"
            },
            {
                "publicationYear": 1996,
                "publisher": "Farrar, Straus and Giroux",
                "format": "paperback"
            }
        ]
    },
    {
        "title": "Native Guard",
        "author": "Natasha Tretheway",
        "originalPublicationYear": 2007,
        "originalPublisherLocation": ["Boston", "United States"],
        "publisher": "Houghton Mifflin",
        "format": "Hardcover"
    }
])
```

```output
switched to db libraryDb

{
    "acknowledged" : true,
    "insertedIds" : [
        ObjectId("627abd0a9709397b4c05386f"),
        ObjectId("627abd0a9709397b4c053870"),
        ObjectId("627abd0a9709397b4c053871"),
        ObjectId("627abd0a9709397b4c053872"),
        ObjectId("627abd0a9709397b4c053873")
    ]
}
```

{{< note >}}
Most of the query examples in this guide use the `pretty` method appended to the end. This is to make the results displayed in an easier-to-read format.
{{< /note >}}

### Basic Query Operators

The simplest query filter locates specific values within specific fields. The example below, for instance, fetches the book originally published in `1622`:

```command
db.bookCatalog.find(
    {
        "originalPublicationYear": 1622
    }
).pretty()
```

```output
{
    "_id" : ObjectId("627abd0a9709397b4c053870"),
    "title" : "Othello",
    "author" : "William Shakespeare",
    "originalPublicationYear" : 1622,
    "originalPublisherLocation" : [
        "London",
        "England"
    ],
    "editions" : [
        {
            "publicationYear" : 1993,
            "publisher" : "Simon & Schuster",
            "format" : "paperback"
        },
        {
            "publicationYear" : 2008,
            "publisher" : "Dover Publications",
            "format" : "paperback"
        }
    ]
}
```

#### Checking for Null Fields

MongoDB also provides a way to check for documents where a given field is null (empty or absent). Within the MongoDB Shell, this just requires the use of the `null` keyword:

```command
db.bookCatalog.find( { "editions": null } ).pretty()
```

```output
{
    "_id" : ObjectId("627abd0a9709397b4c053873"),
    "title" : "Native Guard",
    "author" : "Natasha Tretheway",
    "originalPublicationYear" : 2007,
    "originalPublisherLocation" : [
        "Boston",
        "United States"
    ],
    "publisher" : "Houghton Mifflin",
    "format" : "Hardcover"
}
```

### Comparison Query Operators

These operators are used in more advanced queries. While identifying documents based on specific values in specific fields can be useful, often you need to fetch documents based on more general criteria.

MongoDB has several operators (keywords) that let you query by comparison. This guide covers all these operators with examples.

- Using the `$gt` and `$lt` operators lets you query for values greater than and less than a given value. These operators also come in variants `$gte` and `$lte` for matching values greater-than-or-equal-to and less-than-or-equal-to, respectively:

    ```command
    db.bookCatalog.find( { "originalPublicationYear": { $gt: 1950 } } ).pretty()
    ```

    ```output
    {
        "_id" : ObjectId("627abd0a9709397b4c053872"),
        "title" : "Everything that Rises Must Converge",
        "author" : "Flannery O'Connor",
        "originalPublicationYear" : 1965,
        "originalPublisherLocation" : [
            "New York",
            "United States"
        ],
        "editions" : [
            {
                "publicationYear" : 1984,
                "publisher" : "Farrar, Straus and Giroux",
                "format" : "hardcover"
            },
            {
                "publicationYear" : 1996,
                "publisher" : "Farrar, Straus and Giroux",
                "format" : "paperback"
            }
        ]
    }
    {
        "_id" : ObjectId("627abd0a9709397b4c053873"),
        "title" : "Native Guard",
        "author" : "Natasha Tretheway",
        "originalPublicationYear" : 2007,
        "originalPublisherLocation" : [
            "Boston",
            "United States"
        ],
        "publisher" : "Houghton Mifflin",
        "format" : "Hardcover"
    }
    ```

- Using the `$in` operator lets you check for documents with a given value in array fields. So long as one of the values in the array matches the given value, the query returns that document.

    ```command
    db.bookCatalog.find(
        {
            "originalPublisherLocation": { $in: ["England"] }
        }
    ).pretty()
    ```

    ```output
    {
        "_id" : ObjectId("627abd0a9709397b4c05386f"),
        "title" : "A Midsummer Night's Dream",
        "author" : "William Shakespeare",
        "originalPublicationYear" : 1600,
        "publisherLocation" : [
            "New York",
            "United States"
        ],
        "editions" : [
            {
                "publicationYear" : 2004,
                "publisher" : "Simon & Schuster",
                "format" : "paperback"
            },
            {
                "publicationYear" : 2018,
                "publisher" : "W. W. Norton & Company",
                "format" : "paperback"
            }
        ],
        "originalPublisherLocation" : [
            "London",
            "England"
        ]
    }
    {
        "_id" : ObjectId("627abd0a9709397b4c053870"),
        "title" : "Othello",
        "author" : "William Shakespeare",
        "originalPublicationYear" : 1622,
        "originalPublisherLocation" : [
            "London",
            "England"
        ],
        "editions" : [
            {
                "publicationYear" : 1993,
                "publisher" : "Simon & Schuster",
                "format" : "paperback"
            },
            {
                "publicationYear" : 2008,
                "publisher" : "Dover Publications",
                "format" : "paperback"
            }
        ]
    }
    ```

- Using the `$ne` operator matches where a given field does not equal a given value. This operator comes with a variant of `$nin`, the inverse of `$in`, that matches when a given value is not in a given array.

    ```command
    db.bookCatalog.find( { "author": { $ne: "William Sharkspeare" } } ).pretty()
    ```

    ```output
    {
        "_id" : ObjectId("627abd0a9709397b4c053871"),
        "title" : "The Sound and the Fury",
        "author" : "William Faulkner",
        "originalPublicationYear" : 1929,
        "originalPublisherLocation" : [
            "New York",
            "United States"
        ],
        "editions" : [
            {
                "publicationYear" : 1956,
                "publisher" : "Random House",
                "format" : "hardcover"
            },
            {
                "publicationYear" : 1990,
                "publisher" : "Vintage",
                "format" : "paperback"
            },
            {
                "publicationYear" : 1992,
                "publisher" : "Modern Library",
                "format" : "hardcover"
            }
        ]
    }
    {
        "_id" : ObjectId("627abd0a9709397b4c053872"),
        "title" : "Everything that Rises Must Converge",
        "author" : "Flannery O'Connor",
        "originalPublicationYear" : 1965,
        "originalPublisherLocation" : [
            "New York",
            "United States"
        ],
        "editions" : [
            {
                "publicationYear" : 1984,
                "publisher" : "Farrar, Straus and Giroux",
                "format" : "hardcover"
            },
            {
                "publicationYear" : 1996,
                "publisher" : "Farrar, Straus and Giroux",
                "format" : "paperback"
            }
        ]
    }
    {
        "_id" : ObjectId("627abd0a9709397b4c053873"),
        "title" : "Native Guard",
        "author" : "Natasha Tretheway",
        "originalPublicationYear" : 2007,
        "originalPublisherLocation" : [
            "Boston",
            "United States"
        ],
        "publisher" : "Houghton Mifflin",
        "format" : "Hardcover"
    }
    ```

### Logical Query Operators

Combining multiple filters using logical operations like *and* & *or* can add much-needed specificity to queries. In MongoDB, you can apply these logical operations to combine any of the filtering options discussed in this guide.

In total, MongoDB has four logical operations for queries.

- The `$and` operator matches documents where two or more conditions *all* match.

    ```command
    db.bookCatalog.find( {
        $and: [
            {
                "originalPublicationYear": { $lt: 1980 }
            },
            {
                "originalPublicationYear": { $gte: 1900 }
            }
        ]
    } ).pretty()
    ```

    ```output
    {
        "_id" : ObjectId("627abd0a9709397b4c053871"),
        "title" : "The Sound and the Fury",
        "author" : "William Faulkner",
        "originalPublicationYear" : 1929,
        "originalPublisherLocation" : [
            "New York",
            "United States"
        ],
        "editions" : [
            {
                "publicationYear" : 1956,
                "publisher" : "Random House",
                "format" : "hardcover"
            },
            {
                "publicationYear" : 1990,
                "publisher" : "Vintage",
                "format" : "paperback"
            },
            {
                "publicationYear" : 1992,
                "publisher" : "Modern Library",
                "format" : "hardcover"
            }
        ]
    }
    {
        "_id" : ObjectId("627abd0a9709397b4c053872"),
        "title" : "Everything that Rises Must Converge",
        "author" : "Flannery O'Connor",
        "originalPublicationYear" : 1965,
        "originalPublisherLocation" : [
            "New York",
            "United States"
        ],
        "editions" : [
            {
                "publicationYear" : 1984,
                "publisher" : "Farrar, Straus and Giroux",
                "format" : "hardcover"
            },
            {
                "publicationYear" : 1996,
                "publisher" : "Farrar, Straus and Giroux",
                "format" : "paperback"
            }
        ]
    }
    ```

- The `$or` operator matches documents where *at least* one condition matches a given array of two or more conditions.

    ```command
    db.bookCatalog.find( {
        $or: [
            {
                "originalPublisherLocation": { $in: ["London"] }
            },
            {
                "originalPublisherLocation": { $in: ["Boston"] }
            }
        ]
    } ).pretty()
    ```

    ```output
    {
        "_id" : ObjectId("627abd0a9709397b4c05386f"),
        "title" : "A Midsummer Night's Dream",
        "author" : "William Shakespeare",
        "originalPublicationYear" : 1600,
        "publisherLocation" : [
            "New York",
            "United States"
        ],
        "editions" : [
            {
                "publicationYear" : 2004,
                "publisher" : "Simon & Schuster",
                "format" : "paperback"
            },
            {
                "publicationYear" : 2018,
                "publisher" : "W. W. Norton & Company",
                "format" : "paperback"
            }
        ],
        "originalPublisherLocation" : [
            "London",
            "England"
        ]
    }
    {
        "_id" : ObjectId("627abd0a9709397b4c053870"),
        "title" : "Othello",
        "author" : "William Shakespeare",
        "originalPublicationYear" : 1622,
        "originalPublisherLocation" : [
            "London",
            "England"
        ],
        "editions" : [
            {
                "publicationYear" : 1993,
                "publisher" : "Simon & Schuster",
                "format" : "paperback"
            },
            {
                "publicationYear" : 2008,
                "publisher" : "Dover Publications",
                "format" : "paperback"
            }
        ]
    }
    {
        "_id" : ObjectId("627abd0a9709397b4c053873"),
        "title" : "Native Guard",
        "author" : "Natasha Tretheway",
        "originalPublicationYear" : 2007,
        "originalPublisherLocation" : [
            "Boston",
            "United States"
        ],
        "publisher" : "Houghton Mifflin",
        "format" : "Hardcover"
    }
    ```

- The `$not` operator matches documents that do not match a given condition. The syntax for this operator is a little different from the other logical operations.

    ```command
    db.bookCatalog.find(
        {
            "originalPublicationYear": { $not: { $lt: 1980 } }
        }
    ).pretty()
    ```

    ```output
    {
        "_id" : ObjectId("627abd0a9709397b4c053873"),
        "title" : "Native Guard",
        "author" : "Natasha Tretheway",
        "originalPublicationYear" : 2007,
        "originalPublisherLocation" : [
            "Boston",
            "United States"
        ],
        "publisher" : "Houghton Mifflin",
        "format" : "Hardcover"
    }
    ```

### Query Nested Objects

MongoDB can query for documents that contain specific other documents. These queries, at their simplest, work similar to other queries, except that you are matching for an exact object rather than some other kind of value.

```command
db.bookCatalog.find(
    {
        "editions": { $in: [
            {
                "publicationYear": 1992,
                "publisher": "Modern Library",
                "format": "hardcover"
            } ] }
    }
).pretty()
```

```output
{
    "_id" : ObjectId("627abd0a9709397b4c053871"),
    "title" : "The Sound and the Fury",
    "author" : "William Faulkner",
    "originalPublicationYear" : 1929,
    "originalPublisherLocation" : [
        "New York",
        "United States"
    ],
    "editions" : [
        {
            "publicationYear" : 1956,
            "publisher" : "Random House",
            "format" : "hardcover"
        },
        {
            "publicationYear" : 1990,
            "publisher" : "Vintage",
            "format" : "paperback"
        },
        {
            "publicationYear" : 1992,
            "publisher" : "Modern Library",
            "format" : "hardcover"
        }
    ]
}
```

From the example above, if `editions` contained one object, rather than an array of objects, the query could instead look like the following:

```command
db.bookCatalog.find(
    {
        "editions":
            {
                "publicationYear": 1992,
                "publisher": "Modern Library",
                "format": "hardcover"
            }
    }
).pretty()
```

```output
{
    "_id" : ObjectId("627abd0a9709397b4c053871"),
    "title" : "The Sound and the Fury",
    "author" : "William Faulkner",
    "originalPublicationYear" : 1929,
    "originalPublisherLocation" : [
        "New York",
        "United States"
    ],
    "editions" :
        {
            "publicationYear" : 1992,
            "publisher" : "Modern Library",
            "format" : "hardcover"
        }
}
```

But this approach has very limited applications in practice. Because it requires you to provide the entire nested document in your query, it is too specific for many real-world use cases.

Instead, more often you want to query for one or more nested fields. You can do this using dot notation — following the format `"field.nestedField"`.

Following is an example that fetches the same book as above but only using the `publicationYear` and `format` nested fields:

```command
db.bookCatalog.find(
    {
        "editions.publicationYear": { $gt: 1990 },
        "editions.format": "hardcover"
    }
).pretty()
```

```output
{
    "_id" : ObjectId("627abd0a9709397b4c053871"),
    "title" : "The Sound and the Fury",
    "author" : "William Faulkner",
    "originalPublicationYear" : 1929,
    "originalPublisherLocation" : [
        "New York",
        "United States"
    ],
    "editions" : [
        {
            "publicationYear" : 1956,
            "publisher" : "Random House",
            "format" : "hardcover"
        },
        {
            "publicationYear" : 1990,
            "publisher" : "Vintage",
            "format" : "paperback"
        },
        {
            "publicationYear" : 1992,
            "publisher" : "Modern Library",
            "format" : "hardcover"
        }
    ]
}
{
    "_id" : ObjectId("627abd0a9709397b4c053872"),
    "title" : "Everything that Rises Must Converge",
    "author" : "Flannery O'Connor",
    "originalPublicationYear" : 1965,
    "originalPublisherLocation" : [
        "New York",
        "United States"
    ],
    "editions" : [
        {
            "publicationYear" : 1984,
            "publisher" : "Farrar, Straus and Giroux",
            "format" : "hardcover"
        },
        {
            "publicationYear" : 1996,
            "publisher" : "Farrar, Straus and Giroux",
            "format" : "paperback"
        }
    ]
}
```

Notice that the above example fetched another book. This is because the `editions` field is an array of nested documents. The dot notation approach searches for matching nested fields in each of the documents in the array. A match can be made for multiple fields across objects in such a case.

## Search Document Text

MongoDB can conduct text searches on collections. However, doing so requires that the collection has been indexed for text. You can learn how to create a text index for your collection from MongoDB's [official documentation](https://www.mongodb.com/docs/manual/core/link-text-indexes/) or our **MongoDB Indexing Explained** guide.

For example, you can create a text index for the `title` and `author` fields using the following command:

```command
db.bookCatalog.createIndex( { "title": "text", "author": "text" } )
```

```output
{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1
}
```

### Exact Text

Text searches can be then made using the `$text` and `$search` keywords in combination.

```command
db.bookCatalog.find( { $text: { $search: "william" } } ).pretty()
```

```output
{
    "_id" : ObjectId("627abd0a9709397b4c053871"),
    "title" : "The Sound and the Fury",
    "author" : "William Faulkner",
    "originalPublicationYear" : 1929,
    "originalPublisherLocation" : [
        "New York",
        "United States"
    ],
    "editions" : [
        {
            "publicationYear" : 1956,
            "publisher" : "Random House",
            "format" : "hardcover"
        },
        {
            "publicationYear" : 1990,
            "publisher" : "Vintage",
            "format" : "paperback"
        },
        {
            "publicationYear" : 1992,
            "publisher" : "Modern Library",
            "format" : "hardcover"
        }
    ]
}
{
    "_id" : ObjectId("627abd0a9709397b4c053870"),
    "title" : "Othello",
    "author" : "William Shakespeare",
    "originalPublicationYear" : 1622,
    "originalPublisherLocation" : [
        "London",
        "England"
    ],
    "editions" : [
        {
            "publicationYear" : 1993,
            "publisher" : "Simon & Schuster",
            "format" : "paperback"
        },
        {
            "publicationYear" : 2008,
            "publisher" : "Dover Publications",
            "format" : "paperback"
        }
    ]
}
{
    "_id" : ObjectId("627abd0a9709397b4c05386f"),
    "title" : "A Midsummer Night's Dream",
    "author" : "William Shakespeare",
    "originalPublicationYear" : 1600,
    "originalPublisherLocation" : [
        "London",
        "England"
    ],
    "editions" : [
        {
            "publicationYear" : 2004,
            "publisher" : "Simon & Schuster",
            "format" : "paperback"
        },
        {
            "publicationYear" : 2018,
            "publisher" : "W. W. Norton & Company",
            "format" : "paperback"
        }
    ]
}
```

A search for `"william shakespeare` actually returns the same results as above. This is because MongoDB text searches by default match any term in the search, not the exact phrase.

To match an exact phrase, you can surround the text in quotes, using a backslash before each quote to include it in the search string.

```command
db.bookCatalog.find( { $text: { $search: "\"william shakespeare\"" } } ).pretty()
```

### Exclude Text

Search terms can be excluded as well. This is done by adding a `-` symbol before the search term to exclude.

```command
db.bookCatalog.find( { $text: { $search: "william -shakespeare" } } ).pretty()
```

```output
{
    "_id" : ObjectId("627abd0a9709397b4c053871"),
    "title" : "The Sound and the Fury",
    "author" : "William Faulkner",
    "originalPublicationYear" : 1929,
    "originalPublisherLocation" : [
        "New York",
        "United States"
    ],
    "editions" : [
        {
            "publicationYear" : 1956,
            "publisher" : "Random House",
            "format" : "hardcover"
        },
        {
            "publicationYear" : 1990,
            "publisher" : "Vintage",
            "format" : "paperback"
        },
        {
            "publicationYear" : 1992,
            "publisher" : "Modern Library",
            "format" : "hardcover"
        }
    ]
}
```

### Sort Results

MongoDB's text searches have a built-in text scoring capability based on search relevance. The following example shows the text scoring field, `$textScore`, applied to a text search for `"william shakespeare"`. You can see in the output that the relevancy scores are actually added to the resulting documents.

```command
db.bookCatalog.find(
    { $text: { $search: "william shakespeare" } },
    { score: { $meta: "textScore" } }
).sort( { score: { $meta: "textScore" } } ).pretty()
```

```output
{
    "_id" : ObjectId("627abd0a9709397b4c053870"),
    "title" : "Othello",
    "author" : "William Shakespeare",
    "originalPublicationYear" : 1622,
    "originalPublisherLocation" : [
        "London",
        "England"
    ],
    "editions" : [
        {
            "publicationYear" : 1993,
            "publisher" : "Simon & Schuster",
            "format" : "paperback"
        },
        {
            "publicationYear" : 2008,
            "publisher" : "Dover Publications",
            "format" : "paperback"
        }
    ],
    "score" : 1.5
}
{
    "_id" : ObjectId("627abd0a9709397b4c05386f"),
    "title" : "A Midsummer Night's Dream",
    "author" : "William Shakespeare",
    "originalPublicationYear" : 1600,
    "originalPublisherLocation" : [
        "London",
        "England"
    ],
    "editions" : [
        {
            "publicationYear" : 2004,
            "publisher" : "Simon & Schuster",
            "format" : "paperback"
        },
        {
            "publicationYear" : 2018,
            "publisher" : "W. W. Norton & Company",
            "format" : "paperback"
        }
    ],
    "score" : 1.5
}
{
    "_id" : ObjectId("627abd0a9709397b4c053871"),
    "title" : "The Sound and the Fury",
    "author" : "William Faulkner",
    "originalPublicationYear" : 1929,
    "originalPublisherLocation" : [
        "New York",
        "United States"
    ],
    "editions" : [
        {
            "publicationYear" : 1956,
            "publisher" : "Random House",
            "format" : "hardcover"
        },
        {
            "publicationYear" : 1990,
            "publisher" : "Vintage",
            "format" : "paperback"
        },
        {
            "publicationYear" : 1992,
            "publisher" : "Modern Library",
            "format" : "hardcover"
        }
    ],
    "score" : 0.75
}
```

### Regex Queries

As an alternative to text searches using text indices, you can also use regular expressions (regex) to search your MongoDB database. This allows you to conduct advanced text searches against particular fields.

The format for a regex search in MongoDB is: `{ "field": { $regex: "pattern" } }`. Here, `pattern` is a regex query string in the Perl regex format.

The following example matches all documents where `editions.publisher` has either the word `and` (surrounded by spaces), the symbol `&`, or a comma.

```command
db.bookCatalog.find( { "editions.publisher": { $regex: "\sand\s|&|," } } ).pretty()
```

```output
{
    "_id" : ObjectId("627abd0a9709397b4c05386f"),
    "title" : "A Midsummer Night's Dream",
    "author" : "William Shakespeare",
    "originalPublicationYear" : 1600,
    "originalPublisherLocation" : [
        "London",
        "England"
    ],
    "editions" : [
        {
            "publicationYear" : 2004,
            "publisher" : "Simon & Schuster",
            "format" : "paperback"
        },
        {
            "publicationYear" : 2018,
            "publisher" : "W. W. Norton & Company",
            "format" : "paperback"
        }
    ]
}
{
    "_id" : ObjectId("627abd0a9709397b4c053870"),
    "title" : "Othello",
    "author" : "William Shakespeare",
    "originalPublicationYear" : 1622,
    "originalPublisherLocation" : [
        "London",
        "England"
    ],
    "editions" : [
        {
            "publicationYear" : 1993,
            "publisher" : "Simon & Schuster",
            "format" : "paperback"
        },
        {
            "publicationYear" : 2008,
            "publisher" : "Dover Publications",
            "format" : "paperback"
        }
    ]
}
{
    "_id" : ObjectId("627abd0a9709397b4c053872"),
    "title" : "Everything that Rises Must Converge",
    "author" : "Flannery O'Connor",
    "originalPublicationYear" : 1965,
    "originalPublisherLocation" : [
        "New York",
        "United States"
    ],
    "editions" : [
        {
            "publicationYear" : 1984,
            "publisher" : "Farrar, Straus and Giroux",
            "format" : "hardcover"
        },
        {
            "publicationYear" : 1996,
            "publisher" : "Farrar, Straus and Giroux",
            "format" : "paperback"
        }
    ]
}
```

However, keep in mind that regex queries tend to take more processing power and time — they are not efficient compared to standard text searches. This may become noticeable with larger collections and more complex queries.

## Conclusion

This guide gives you everything you need to start making more of your MongoDB database and its querying capabilities. You can use it as a sort of cheat sheet for you when it comes to navigating MongoDB databases.

Looking to dive deeper into MongoDB? Be sure to peruse our other [MongoDB guides](/docs/guides/databases/mongodb/) for more on setting up and getting the most out of MongoDB.