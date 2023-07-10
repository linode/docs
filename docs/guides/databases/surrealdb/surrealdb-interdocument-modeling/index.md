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

SurrealDB offers a versatile new approach to relational databases. A SurrealDB server includes a built-in API layer, often eliminating the need for server-side components in your application. With a high-performance architecture, real-time queries, and scalability, you can see why SurrealDB stands out.

SurrealDB also leverages a multi-model approach to data. You can use whatever models fit your needs when storing and retrieving data, without meticulously planning out models in advance. For that, SurrealDB makes use of inter-document relations, and implements a highly-efficient core for managing relations.

Follow along with this tutorial to start making the most out of SurrealDB, and see how you can use its multi-model architecture. Learn about the concepts behind SurrealDB's inter-document relations, and walk through examples that put them into practice.

## What Are Inter-document Relations in SurrealDB?

Inter-document relations have existed as an integral part of document-centered NoSQL databases like MongoDB. Such databases can typically do without `JOIN` commands. Instead, relations between documents are formed by features like embedded documents and document references.

SurrealDB itself has document logic at its core, from which it draws powerful possibilities for relating documents.

SurrealDB expands on that core with a versatile multi-model approach. This allows SurrealDB to store data sequentially like SQL relational databases, for efficient and familiar table structures. At the same time, it also grants SurrealDB the interconnected structure of NoSQL graph databases for complex relations between records.

## How Do SurrealDB Inter-document Relations Work?

As the description above shows, there are numerous ways to work with inter-document relations in a multi-model database like SurrealDB. Part of SurrealDB's advantage comes in its freedom to store and retrieve data with different models.

However, to demonstrate and help you get started working with SurrealDB's inter-document relations, this tutorial breaks these down into two broad categories:

-   **Document**: Uses document-database notation to navigate nested and related documents.

-   **Graph**: Uses the interconnections of graphs to relate documents.

### Document Notation

SurrealDB supports notations similar to other document databases, such as MongoDB, for accessing nested fields from documents. This includes dot notation (`.`) and array notation (`[]`).

To demonstrate, try out this sample data set:

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

Here, data can be fetched from nested fields using document notation to access deeper and deeper levels. Additionally, record IDs in SurrealDB act as direct references, so having these in the documents above eases relations.

In this example, dot notation allows for grabbing the `description` from a `role` document based on the ID held in a completely separate document in the `participants` array:

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

Array notation from there allows you to select a particular member of an array based on its index (starting at zero). In this example, the query uses the `person` ID in a specific member of the `participants` array:

```command
SELECT name FROM department:first.participants[1].ref;
```

```output
{
    name: 'Person Three'
}
```

### Graph Relations

SurrealDB can build graph edge relations using its `RELATE` statement. Such a statement allows you to create vertex -> edge -> vertex relations between documents. Afterward, similar arrow notation can be used to leverage the document relations in queries.

Instead of vertex -> edge -> vertex, you may find it helpful to think of these relations as noun -> verb -> noun. This tends to be how SurrealDB's documentation names these relations, and this tutorial does the same.

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

Leveraging the graph relations, queries can navigate from vertex to vertex by way of the edges. To do so, recall the arrow notation from the initial `RELATE` statements. These define the directions for graph flows.

The example here starts with the `department` vertices (because `FROM department`). From there, it works through the `participates` edge, at the same time using a `WHERE` statement to limit by role. And finally from that it renders the `name` field from the corresponding `person` vertices.

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

You now have an overview and a start to exploring inter-document relations in SurrealDB. However, it can be helpful to see these features used in specific and more practical use cases.

This section walks you through just that. While the data here may not distill all of the complexities of real-world data, it represents a relatable and practical use case. The examples here help provide a better foothold for navigating SurrealDB relations in all situations.

### Setting Up the Prerequisites

To get started, you need to have installed SurrealDB on your system and have placed the SurrealDB binary in your shell path. Follow along with our [Getting Started with SurrealDB](/docs/guides/getting-started-with-surrealdb/) guide to see how.

This tutorial assumes that you have followed that guide up through the *How to Install SurrealDB* section, with SurrealDB installed and accessible via the `surreal` command.

For the examples to follow, you only need to be running the SurrealDB server with local access. To make things even easier, just run the server with a root user. You can accomplish this with the following command:

```command
surreal start --bind 127.0.0.1:8000 --user root --pass exampleRootPass
```

By using a root user, you also have access to SurrealDB's command-line interface (CLI). This makes setting up data and exploring the effects of different queries significantly smoother.

To start up the SurrealDB CLI, use the command below in a second terminal. This command assumes you have used the same parameters in starting your SurrealDB server as used in the example command above.

```command
surreal sql --host http://localhost:8000 --user root --pass exampleRootPass --ns exampleNs --db exampleDb --pretty
```

### Populating a Database

Using the SurrealDB CLI, you can now start populating the database. The goal in populating this example database is to leverage SurrealDB's multi-model inter-document relations. To that end, the example data is good for demonstrating both document relations and graph relations.

The use case for the examples here is a system for tracking college courses. Such a system needs to be able to catalog courses and list available professors and their departments. To simplify things, these examples do not venture into adding a student or scheduling data to the mix.

#### Defining Schemas

To begin, define each of the tables. SurrealDB is a document database at core, but one of its features from relational databases is its ability to define table schemas.

Defining a table's schema is not required for the data used here. However, doing so follows a good practice to make your SurrealDB database more robust.

The tables for courses and professors in this example are relatively flat, without nested fields to deal with. For that reason, those tables can benefit from SurrealDB's `SCHEMAFULL` designation. It provides strict schema enforcement, similar to traditional relational databases.

The table listing departments needs a less strict schema, since the example here gives each department document an array of nested documents. Here, use SurrealDB's `SCHEMALESS` designation, which still lets you define a schema, though unenforced.

So with `SCHEMALESS`, why define the table and fields at all? Because SurrealDB still enforces the permissions, assertions, and default values you add to schemaless tables.

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

With the schemas defined, start adding in data. The four courses below add a good base to start from. Each course has an designated ID, some descriptive text, and a set of numerical variables.

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

Next, those courses need instructors, so insert some data to create them. In this example, the professors only need an ID and a name. Everything else can be handled with relations, at least as far as the simple use case here.

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

In this example, a professor's availability to instruct a course depends on whether the professor is part of the proper department. Graph relations provide a good method to relate professors with departments. To associate courses with departments, leverage nested arrays.

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

Using arrays of objects for the course list leaves the department more adaptable. More courses can be added, including more of the same kind. More advanced data like scheduling can also be manipulated here.

#### Putting in Graph Relations

As a last step for preparing the data, add the graph relations between professors and departments. The example here uses the `teaches` verb for the relations.

```command
RELATE professor:otwo->teaches->department:mat;
RELATE professor:tfour->teaches->department:his;
RELATE professor:fsix->teaches->department:mat;
RELATE professor:seight->teaches->department:eng;
RELATE professor:nten->teaches->department:bio;
RELATE professor:etwelve->teaches->department:eng;
```

#### Optional Advanced Features

One advanced possibility opened up by the setup above is further associating each professor with available schedules, which you could do with the `SET` option. That would also work well with the more advanced option of adding schedules to department course listings.

This tutorial does not cover this scenario in full. However, if you are interested, here is a brief snippet of what you might do if you wanted to incorporate a `schedule` table:

```command
INSERT INTO department [
    {
        id: "mat",
        name: "Mathematics",
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

Having the sample data in place, you can start to work through some practical applications of SurrealDB's inter-document relations. The queries that follow demonstrate particular use cases, and each provides practical SurrealQL tools to work with.

-   **Fetching Mathematics professors and courses.** Most SurrealDB queries that seek to model the retrieved data make use of document notation. Here, dot notation gives the query access to the nested `course.name` field associated with each `courses` ID.

    What is more useful here is how SurrealDB lets you use those `courses` IDs just as if they were the objects those IDs refer to.

    Going beyond the document notation, the query uses the `teaches` edge graph to retrieve professor names associated with the Mathematics department.

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

-   **Fetching the total number of enrolled students.** While the goal sounds simple, the initial model (i.e. how the data was input), does not make it straightforward to retrieve this total.

    However, SurrealDB boasts the ability to remodel data *ad hoc* through queries. This means that you shouldn't have to design your tables around how you want to fetch data later. Nor should you have to use a server-side component to perform multiple queries and build up the model manually.

    The most noteworthy document relation feature here is the use of `.enrollment` immediately after the deepest nested `SELECT` statement. It treats that statement in parentheses as if it were a document itself, allowing you to fetch a nested document from within it. The logic here is more akin to JavaScript than traditional SQL.

    SurrealDB also includes a set of functions for things like working with arrays and applying math operations. The `array::flatten` function combines the multiple returned arrays, and then `math::sum` adds together all of the numbers in that resulting array.

    ```command
    SELECT * FROM math::sum(
        ( array::flatten(
            ( SELECT * FROM
                ( SELECT courses.enrollment AS enrollment
                    FROM department )
            ).enrollment )
        )
    );
    ```

    ```output
    70
    ```

-   **Fetching percentage enrollments for each department.** SurrealDB's more advanced queries can leverage nested queries and functions to sleekly perform operations on data.

    Like in the previous query, this one uses some of SurrealDB's built-in functions. The ones here perform some math operations and cast a value as a specific data type.

    The structure has similarities to traditional SQL queries, but it leverages the `courses.enrollement` and `courses.course.capacity` relations, similar to the first example query above.

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

You now have a foundation in how SurrealDB employs inter-document relations and achieves its multi-model approach. The explanations and demonstrations in this tutorial aim to give you tools to use when making your own SurrealDB models. From schema definitions to queries with document and graph relations, you should be able to craft your data to your needs.

Continue learning everything you need to make the most of SurrealDB with our other tutorials:

-   [Managing Security and Access Control for SurrealDB](/docs/guides/managing-security-and-access-for-surrealdb/)

-   [Building an Web Application on Top of SurrealDB](/docs/guides/surrealdb-for-web-applications)

-   [Deploying a SurrealDB Cluster](/docs/guides/deploy-surrealdb-cluster/)
