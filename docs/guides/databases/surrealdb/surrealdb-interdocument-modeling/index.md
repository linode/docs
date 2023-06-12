---
slug: surrealdb-interdocument-modeling
title: "Modeling Data with SurrealDB’s Inter-document Relations"
description: "One of SurrealDB's chief features is its multi-model approach. Using inter-document relations, you can model your data according to your needs, without having to design all of your models in advance. Find out more and see the examples is this tutorial."
keywords: ['surrealdb tutorial','surrealdb examples','surrealdb client']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-06-11
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[SurrealDB Documentation](https://surrealdb.com/docs)'
- '[SurrealDB: RELATE Statement](https://surrealdb.com/docs/surrealql/statements/relate)'
---

SurrealDB offers a versatile new approach to relational databases. A SurrealDB server includes a built-in API layer, often eliminating the need for server-side components to your application. Add to that a high-performance architecture, real-time queries, and scalability, and you can see why SurrealDB stands out.

SurrealDB also leverages a multi-model approach to data. Use whatever models fit your needs when storing and retrieving data, without meticulously planning out models in advance. SurrealDB makes use of inter-document relations for that, and implements a highly-efficient core for managing relations.

To start making the most of SurrealDB and seeing how you can use its multi-model architecture, follow along with this tutorial. Learn about the concepts behind SurrealDB's inter-document relations, and walk through examples illustrating how to put them into practice.

## What Are Inter-document Relations in SurrealDB?

Inter-document relations have actually existed as an integral part of document-centered NoSQL databases like MongoDB. Such databases can typically do without `JOIN` commands. Instead, relations between documents are formed by features like embedded documents and document references.

SurrealDB itself has document logic at its core. And it is from that core that SurrealDB draws powerful possibilities for relating documents.

But SurrealDB expands on that core with a versatile, multi-model approach. That approach allows SurrealDB to store data sequentially like SQL relational databases, for efficient and familiar table structures. The approach also grants SurrealDB interconnected structure of NoSQL graph databases, for complex relations.

## How Do SurrealDB Inter-document Relations Work?

As the description above shows, there are numerous ways to work with inter-document relations in a multi-model database like SurrealDB. Part of SurrealDB's advantage comes in its freedom to store and retrieve data with different models.

But to demonstrate and help you get started working with SurrealDB's inter-document relations, this tutorial breaks these down into two broad categories.

### Document Notation

SurrealDB supports typical notations for accessing nested fields from documents. This includes dot notation (`.`) and array notation (`[]`).

To demonstrate, try out this sample data set.

```command
INSERT INTO person [
    {
        id: "one",
        name: "Person One"
    },
    {
        id: "two",
        name: "Person Two"
    },
    {
        id: "three",
        name: "Person Three"
    },
    {
        id: "four",
        name: "Person Four"
    }
];

INSERT INTO department [
    {
        id: "first",
        participants: [
            {
                ref: person:one,
                role: role:doer
            },
            {
                ref: person:three,
                role: role:undoer
            }
        ]
    },
    {
        id: "second",
        participants: [
            {
                ref: person:two,
                role: role:doer
            },
            {
                ref: person:three,
                role: role:undoer
            },
            {
                ref: person:four,
                role: role:redoer
            }
        ]
    }
];

INSERT INTO role [
    {
        id: "doer",
        description: "Does Stuff"
    },
    {
        id: "undoer",
        description: "Fixes Things"
    },
    {
        id: "redoer",
        description: "Repairs Fixes"
    }
];
```

From this, data can be fetched from nested fields using document notation to get to deeper and deeper levels. Record IDs in SurrealDB act as direct references, so having these in the documents above eases relations.

In this example, dot notation allows for grabbing the `description` from a `role` document based on the ID held in a completely separate document in the `participants` array.

```command
SELECT role.description AS role
    FROM department:second.participants
    WHERE ref = person:three;
```

```output
{
    role: 'Fixes Things'
}
```

Array notation extends on this behavior, allowing you to select a particular member of an array based on its index (starting at zero).

That is the case in this example, where the query uses the `person` ID in a specific member of the `participants` array.

```command
SELECT name FROM department:first.participants[1].ref;
```

```output
{
    name: 'Person Three'
}
```

### Graph Relations

SurrealDB can build graph edge relations using its `RELATE` statement. Such a statement allows you to create vertex -> edge -> vertex relations between documents. Similar arrow notation can then be used to relate documents in queries.

You may alternatively think of these relations as noun -> verb -> noun.

Each `RELATE` results in a new table (the edge or verb) that operates to relate documents in a given way.

Try out this data set to start working with graph relations in SurrealDB.

```command
INSERT INTO person [
    {
        id: "one",
        name: "Person One"
    },
    {
        id: "two",
        name: "Person Two"
    },
    {
        id: "three",
        name: "Person Three"
    },
    {
        id: "four",
        name: "Person Four"
    }
];

INSERT INTO department [
    {
        id: "first",
    },
    {
        id: "second",
    }
];

INSERT INTO role [
    {
        id: "doer",
        description: "Does Stuff"
    },
    {
        id: "undoer",
        description: "Fixes Things"
    },
    {
        id: "redoer",
        description: "Repairs Fixes"
    }
];

RELATE person:one->participates->department:first SET role = role:doer;
RELATE person:three->participates->department:first SET role = role:undoer;

RELATE person:two->participates->department:second SET role = role:doer;
RELATE person:three->participates->department:second SET role = role:undoer;
RELATE person:four->participates->department:second SET role = role:redoer;
```

Leveraging the graph relations, queries can navigate from vertex to vertex by way of the edges. To do so, recall the arrow notation from the initial `RELATE` statements. These define the direction of graph flow.

The example here starts with the `department` vertex (because `FROM department`). From there, it works through the `participates` edge using a `WHERE` statement to limit by role. And finally from that it renders the `name` field from the corresponding `person` vertices.

```command
SELECT <-(participates WHERE role=role:doer)<-person.name AS name
    FROM department
```

```output
[
    {
        name: [
            'Person One'
        ]
    },
    {
        name: [
            'Person Two'
        ]
    }
]
```

## How to Use SurrealDB’s Inter-document Relations

With the above, you have an overview and a start to exploring inter-document relations in SurrealDB. But to take that further, it can be helpful to see these features used in specific and more practical use cases.

That is what this section walks you through. The data here may not actually distill all of the complexities of real-world data. But by taking a relatable and practical use case, the examples here should help you better navigate SurrealDB relations in all situations.

### Setting Up the Prerequisites

To get started, you need to have installed SurrealDB on your system and have placed the SurrealDB binary in your shell path. Follow along with our [Getting Started with SurrealDB](/docs/guides/getting-started-with-surrealdb/) guide to see how you can.

This tutorial assumes that you have followed that guide up through the *How to Install SurrealDB* section, with SurrealDB installed and accessible via the `surreal` command.

For the examples to follow, you only need to be running your SurrealDB server locally. And to make things easier, you should be running the server with a root user. You can accomplish this with a command like this one.

```command
surreal start --bind 127.0.0.1:8000 --user root --pass exampleRootPass
```

By using a root user, you also have access to SurrealDB's command-line interface (CLI). This makes setting up data and executing queries significantly smoother, especially early on and when exploring relational queries.

To start up the SurrealDB CLI, you can use a command like this one. This command assumes you have used the same parameters in starting your SurrealDB server as used in the example command above.

```command
surreal sql --host http://localhost:8000 --user root --pass exampleRootPass --ns exampleNs --db exampleDb --pretty
```

### Populating a Database

Using the SurrealDB CLI, you can now start populating the database. Throughout the examples that follow, the goal in populating the database is to leverage SurrealDB's multi-model inter-document relations. To that end, the data should be good for demonstrating both document relations and graph relations.

The use case for the examples here is a system for tracking college courses. Such a system needs to be able to catalog courses and list available professors and their departments. (To simplify things, these examples do not venture into adding a student table to the mix.)

#### Defining Schemas

To begin, you can define each of the tables. SurrealDB is a document database at core, but one of its features from relational database is its ability to define table schemas.

Defining the schemas is not required for the data used here. But doing so follows a good practice to make your SurrealDB database more robust.

The tables for courses and professors in this example are relatively flat, without nested fields to deal with. For that reason, those tables can benefit from SurrealDB's `SCHEMAFULL` designation. With that, SurrealDB provides strict schema enforcement, similar to traditional relational databases.

The table listing departments needs a less strict schema, since the example here gives each department document an array of nested documents. Here, you can use SurrealDB's `SCHEMALESS` designation, which lets you still define a schema but have it remain unenforced.

With `SCHEMALESS`, why define the table and fields at all? Because SurrealDB still enforces the permissions, assertions, and default values you add to schemaless tables.

```command
DEFINE TABLE course SCHEMAFULL;
DEFINE FIELD name ON TABLE course TYPE string
    ASSERT $value != NONE;
DEFINE FIELD description ON TABLE course TYPE string
    ASSERT $value != NONE;
DEFINE FIELD hours ON TABLE course TYPE int
    ASSERT $value != NONE && $value > 0;
DEFINE FIELD capacity ON TABLE course TYPE int
    ASSERT $value != NONE && $value > 0;

DEFINE TABLE professor SCHEMAFULL;
DEFINE FIELD name ON TABLE professor TYPE string
    ASSERT $value != NONE;

DEFINE TABLE department SCHEMALESS;
DEFINE FIELD name ON TABLE department TYPE string
    ASSERT $value != NONE;
DEFINE FIELD courses ON TABLE department TYPE array;
```

#### Inserting Documents

With the schemas defined, you can start adding in the particular data. The four courses below add a good base to start from. Each course has an designated ID, some descriptive text, and a set of numerical variables to manage the course.

```command
INSERT INTO course [
    {
        id: "bio103",
        name: "Human Biology",
        description: "Builds on basic biology to introduce a study of the human organism.",
        hours: 4,
        capacity: 25
    },
    {
        id: "eng101",
        name: "English Composition",
        description: "Teaches skills in English composition.",
        hours: 3,
        capacity: 15
    },
    {
        id: "his102",
        name: "American History, 1900–Present",
        description: "Covers American history from 1900 to the present.",
        hours: 3,
        capacity: 20
    },
    {
        id: "mat101",
        name: "College Algebra I",
        description: "Instructs the first phase of college-level algebra.",
        hours: 3,
        capacity: 30
    }
];
```

Those courses need instructors, so next you can insert some data to create those. In this example, the professors only need a designated ID and a name. Everything else can be handled with relations, at least as far as the simple use case here.

```command
INSERT INTO professor [
    {
        id: "otwo",
        name: "Dr. One Two"
    },
    {
        id: "tfour",
        name: "Dr. Three Four"
    },
    {
        id: "fsix",
        name: "Dr. Five Six"
    },
    {
        id: "seight",
        name: "Dr. Seven Eight"
    },
    {
        id: "nten",
        name: "Dr. Nine Ten"
    },
    {
        id: "etwelve",
        name: "Dr. Eleven Twelve"
    }
];
```

For this example system, a professor's availability to instruct a course depends only on whether the professor is part of the right department. Graph relations provide a good method to relate professors with departments. And to associate courses with departments, you can leverage nested arrays.

```command
INSERT INTO department [
    {
        id: "bio",
        name: "Biological Sciences",
        courses: [
            {
                course: course:bio103,
                enrollment: 20
            }
        ]
    },
    {
        id: "eng",
        name: "English",
        courses: [
            {
                course: course:eng101,
                enrollment: 10
            }
        ]
    },
    {
        id: "his",
        name: "History",
        courses: [
            {
                course: course:his102,
                enrollment: 15
            }
        ]
    },
    {
        id: "mat",
        name: "Mathematics",
        courses: [
            {
                course: course:mat101,
                enrollment: 25
            }
        ]
    }
];
```

#### Putting in Graph Relations

Using arrays of objects for the course lists leaves the department more adaptable. More courses can be added, even of the same kind, and more advanced data like scheduling can be manipulated here.

As a last step for preparing the data, you can add the graph relations between professors and departments. The example here uses the `teaches` verb for the relations.

```command
RELATE professor:otwo->teaches->department:mat;
RELATE professor:tfour->teaches->department:his;
RELATE professor:fsix->teaches->department:mat;
RELATE professor:seight->teaches->department:eng;
RELATE professor:nten->teaches->department:bio;
RELATE professor:etwelve->teaches->department:eng;
```

#### (Optional) Advanced Features

One advanced possibility opened up by the setup above is further associating each professor with available schedules, which you could do with the `SET` option. That would also fit well with the more advanced option of adding schedules to department course listings.

Here is a brief snippet that shows how, with a `schedule` table defined and populated, you could start with these advanced options.

```command
INSERT INTO department [
    {
        id: "mat",
        name: "Mathematics"
        courses: [
            {
                course: course:mat101,
                enrollment: 25,
                schedule: mwf1000
            },
            {
                course: course:mat101,
                enrollment: 19,
                schedule: tr1600
            }
        ]
    }
];

RELATE professor:otwo->teaches->department:mat
    SET availability = [
        schedule:mwf0900,
        schedule:tr1400,
        schedule:tr1600
    ];
```

### Querying on Inter-document Relations
Show example queries demonstrating the flexibility and multi-model capabilities

Having some sample data in place, you can start to work through some practical applications of SurrealDB's inter-document relations. The queries that follow aim to show some particular use cases to help with that.

- Fetching Mathematics professors and courses. Most SurrealDB queries that seek to model the retrieved data make use of document notation. Here, dot notation gives the query access to the nested `course.name` field associated with each `courses` ID.

    What is more useful here is how SurrealDB lets you use those `courses` IDs just as if they were the objects those IDs refer to.

    Going beyond the document notation, the query uses the `teaches` edge graph to get professor names associated with the Mathematics department.

    ```command
    SELECT <-teaches<-professor.name AS math_professors,
            courses.course.name AS math_courses
        FROM department:mat
    ```

    ```output
    {
        math_courses: [
            'College Algebra I'
        ],
        math_professors: [
            'Dr. One Two',
            'Dr. Five Six'
        ]
    }
    ```

- Fetching the total number of enrolled students. The goal sounds simple, but actually the initial model — how the data was input — does not make it straightforward to get this total.

    But SurrealDB boasts the ability to remodel data through queries. That means that you should not have to design your tables around how you want to fetch data later. Nor should you have to use a server-side component to perform multiple queries and build up the model manually.

    The most noteworthy document relation feature here is the use of `.enrollment` after the deepest nested `SELECT` statement. You can treat that statement, in parentheses, as a document itself, fetching a nested document within it. The logic here is more akin to JavaScript than traditional SQL.

    SurrealDB also includes a set of functions for things like working with arrays and applying math operations. The `array::flatten` function combines the multiple returned arrays, and then `math::sum` adds together all of the numbers in that resulting array.

    ```command
    SELECT * FROM math::sum(
        ( array::flatten(
            ( SELECT * FROM
                ( SELECT courses.enrollment AS enrollment
                    FROM department )
                .enrollment )
            )
        )
    );
    ```

    ```output
    70
    ```

- Fetching percentage enrollments for each department. SurrealDB's more advanced queries can leverage nested queries and functions to sleekly perform operations on data to give the resulting model.

    Like in the previous query, this one uses some of SurrealDB's built-in functions. The ones here performs some math operations and cast a value as a specific data type.

    The structure has similarities to traditional SQL queries, but deep inside it leverages the `courses.enrollement` and `courses.course.capacity` relations, similar to the first example query above.

```command
SELECT department, type::int(
        math::round( ( enrolled / capacity ) * 100 ) ) AS percentage_enrollment
    FROM ( SELECT name AS department,
            math::sum(courses.enrollment) AS enrolled,
            math::sum(courses.course.capacity) AS capacity
        FROM department );
```

```output
[
    {
        department: 'Biological Sciences',
        percentage_enrollment: 80
    },
    {
        department: 'English',
        percentage_enrollment: 67
    },
    {
        department: 'History',
        percentage_enrollment: 75
    },
    {
        department: 'Mathematics',
        percentage_enrollment: 83
    }
]
```

## Conclusion

You now have a foundation in how SurrealDB employs inter-document relations and achieves its multi-model approach. The explanations and demonstrations in this tutorial aim to give you tools to use when making your SurrealDB models. From schema definitions to queries with document and graph relations, you should be able to craft your data to your needs.

Be sure to continue learning everything you need to make the most of SurrealDB with our other tutorials.

- [Managing Security and Access Control for SurrealDB](/docs/guides/managing-security-and-access-for-surrealdb/)

- [Building an Web Application on Top of SurrealDB](/docs/guides/surrealdb-for-web-applications)

- [Deploying a SurrealDB Cluster](/docs/guides/deploy-surrealdb-cluster/)
