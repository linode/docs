---
slug: storing-json-in-postgresql
author:
  name: Linode Community
  email: docs@linode.com
description: "Since version 9.4 of PostgreSQL, you can add JSON and JSONB columns to your tables. This guide shows you how to use PostgreSQL's JSON columns, queries, and functions for a more flexible database."
og_description: "Since version 9.4 of PostgreSQL, you can add JSON and JSONB columns to your tables. This guide shows you how to use PostgreSQL's JSON columns, queries, and functions for a more flexible database."
keywords: ['postgres','postgresql','json columns','json queries']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-28
modified_by:
  name: Linode
title: "Storing JSON in PostgreSQL"
h1_title: "Storing JSON in PostgreSQL"
enable_h1: true
contributor:
  name: Stephan Miller
  link: https://github.com/eristoddle
external_resources:
- '[PostgreSQL JSON Types](https://www.postgresql.org/docs/14/datatype-json.html)'
- '[PostgreSQL JSON Functions](https://www.postgresql.org/docs/14/functions-json.html)'
---

Often the data for an application won’t fit completely into either a relational or NoSQL world. This used to mean compromising by choosing one or using both and making your application code overly complex. But this changed with the release of PostgreSQL 9.2, the first version with native JSON support.

Developers could store JSON in relational databases before, usually as a blob. But when storing JSON as a blob, it is necessary to use application code, or a stored procedure to manipulate it. The native JSON support PostgreSQL added was completely different. JSON was now a built-in data type. You can insert JSON directly into a column, query and filter the data stored in a JSON column, and create indexes on JSON data.

It is important to note that not all of these JSON features came in version 9.2 of PostgreSQL. Version 9.3 added additional constructor and extractor methods, but the biggest change came in version 9.4, which added the ability to store binary JSON. The JSONB data type makes data input slightly slower, but querying the data is faster. You can also use indexes with the JSONB data type.

## Using JSON in PostgreSQL Tables

The current version of PostgreSQL is 14 and there have been a few additions to its JSON features since support was first added in 9.2.

- Version 12 added [JSONPATH](https://www.postgresql.org/docs/current/datatype-json.html#DATATYPE-JSONPATH) support, a new powerful way to search JSON data that is similar to XPATH for XML data.
- Version 14 added [JSONB subscripting](https://www.postgresql.org/docs/current/datatype-json.html#JSONB-SUBSCRIPTING), a new way to access JSON sub-objects that is closer to how other programming languages reference JSON values.

So in some examples below, there will be more than one way of getting the same results depending on the version of PostgreSQL you are using. When that is the case, it will be noted with the example, but it will be assumed that you are using at least version 9.4 with JSONB support. PostgreSQL docs recommend using JSONB over JSON because of performance.

### Defining JSONB Columns

Defining a JSONB column is simple. Here is an example of creating a table called `books` with a JSON with a JSONB metadata column:

```sql
CREATE TABLE books (
  id INT GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(256),
  metadata JSONB
);
```

It is also possible to define a column as `JSON`, but it won’t come with all the performance enhancements of the JSONB type.

### Inserting JSON Data

To insert data into a JSONB column, pass the JSON string as a field value.

```sql
INSERT INTO books(title, metadata) VALUES ('The Talisman', '{ "genres": ["Fiction", "Thriller", "Horror"], "authors": ["Stephen King", "Peter Straub"], "format": "hardcover"}');
INSERT INTO books(title, metadata) VALUES ('Siddhartha', '{ "genres": ["Fiction", "Spirituality"], "authors": ["Herman Hesse"], "format": "softcover"}');
```

The JSON passed as a string must be valid. Here is an example of a query with invalid data:

```sql
INSERT INTO books(title, metadata) VALUES ('My Book', '{ "genres": ["Fiction"]');
```

If we try to run this query, we will get this error:

```shell
SQL Error [22P02]: ERROR: invalid input syntax for type json
  Detail: The input string ended unexpectedly.
  Position: 41
  Where: JSON data, line 1: { "genres": ["Fiction"]
```

### Querying JSON Data

Reading the JSON data is simple if you want the full JSON field.

```sql
SELECT title, metadata FROM books;
```

The data returned for the JSON field will look like any other text value, so when using the result in an application, you will have to parse it as JSON to turn it into an object.

| title         | metadata                                                     |
| ------------- | ------------------------------------------------------------ |
| The Talisman  | {"format": "hardcover", "genres": ["Fiction", "Thriller", "Horror"], "authors": ["Stephen King", "Peter Straub"]} |
| The Alchemist | {"format": "softcover", "genres": ["Fiction", "Spirituality"], "authors": ["Paulo Coelho"]} |

You can select individual attributes from the JSON data using the `->` notation. Here is an example to list the formats of all the books we have in the database:

```sql
SELECT title, metadata->'format' AS format FROM books;
```

Notice that we added an alias of `format` to the attribute we are getting from the JSON field. If not, the label for the value in the results will be `?column?`. And here are the results:

| title              | format      |
| ------------------ | ----------- |
| The Talisman       | "hardcover" |
| The Alchemist      | "softcover" |
| The Shining        | "softcover" |
| The Sun Also Rises | null        |

Notice that each value we extracted from the JSON has quotes around it. This is because the `->` operator returns JSON, which means it still has to be parsed as JSON. To get the text value of this attribute, we need to use the `->>` operator, like this:

```sql
SELECT title, metadata->>'format' as format FROM books;
```

Then we will get the format values without quotes. The `->` operator is useful when you are extracting a nested JSON object from the field, which you will then convert to an object with application code or return as JSON from an API. The `->>` operator is useful when you need a single value.

| title              | format    |
| ------------------ | --------- |
| The Talisman       | hardcover |
| The Alchemist      | softcover |
| The Shining        | softcover |
| The Sun Also Rises | null      |

Also, notice in the results that one value for format is null. This is because that record doesn’t have the `format` key in its JSON field.

We can also query single values from deeper inside the JSON. For example, if we wanted to retrieve only the first genre in the array of genres, we could use either of these two queries, depending on whether we want the result as JSON (with double quotes around the value) or text (with no quotes).

```sql
-- genre1 = "Fiction"
SELECT title, metadata->'genres'->0 AS genre1 FROM books;
-- genre1 = Fiction
SELECT title, metadata->'genres'->>0 AS genre1 FROM books;
```

Notice that to get this value, we use the `->` operator to get to the `genres` attribute in the JSON. The `->>` operator won't work in its place because it returns text and we are retrieving a value deeper in the JSON, so we need the first operator to provide a JSON value. And finally `0` selects the first value in the array of genres.

We can also use a different syntax to retrieve values from a JSON array. These queries return the same results as the last two.

```sql
-- genre1 = "Fiction"
SELECT title, metadata#>'{genres, 0}' AS genre1 FROM books;
-- genre1 = Fiction
SELECT title, metadata#>>'{genres, 0}' AS genre1 FROM books;
```

The `#>` operator returns JSON values and quotes around the genre, and the `#>>` operator returns text with no quotes. After the operator, we specify the key of the array and the index of the element we need.

### Filtering JSON Results

To filter the results based on values, we can use a similar syntax that we used for querying the values. Here we are searching for books in the table that have the ePub format.

```sql
SELECT title FROM books WHERE metadata->'format' = 'epub';
```

But this query will fail with an error because we are using the `->` operator which is expecting JSON and the value we are filtering by is a string. We can fix the query by using the `->>` operator.

```sql
SELECT title FROM books WHERE metadata->>'format' = 'epub';
```

### Checking Containment in JSON Columns

Checking containment is an extension of filtering. In the books table, all the authors are stored in an array in the JSON field. This is because some books have more than one author. To filter the results to all the books to those that Stephen King either wrote or cowrote, we can use the `@>` operator and then use JSON for the value we are filtering by. Here is that query:

```sql
SELECT title FROM books WHERE metadata->'authors' @> '["Stephen King"]';
```

We can also rewrite the queries in the filtering section using the containment operator. Here is the query that selects the titles of books that have an ePub format.

```sql
SELECT title FROM books WHERE metadata->'format' @> '"epub"';
```

The containment operator is really flexible. We can rewrite the same query like this to get the same results.

```sql
SELECT title FROM books WHERE metadata @> '{"format" : "epub"}';
```

### Checking Existence in JSON Columns

One benefit of a JSON column is that you can store any valid JSON in it. This means that the JSON for each of the records in your database doesn't have to have the same structure. When we queried the `format` key in the books table earlier, some records didn't have it and returned a `null`. Most times, this is not what we want. We may want only the records where that key exists in the JSON. We can use the `?` to check that the JSON contains the key. Here is the query rewritten to return only those records that actually have the value.

```sql
SELECT title, metadata->>'format' as format FROM books WHERE metadata ? 'format';
```

### Updating JSON values

If you want to update the values in a JSONB column without reading the entire value, modifying it, and writing the whole new value, you can use the built in PostgreSQL function `JSONB_SET`. Here is an example that updates the genres of one the books in the table.

```sql
UPDATE books SET metadata = JSONB_SET(metadata, '{genres}', '["Fiction", "Thriller", "Horror"]') WHERE title = 'The Talisman';
```

The first parameter of `JSONB_SET` is the JSON value you want to modify. The second is the path to the JSON value we are updating. And the last parameter is the value in JSON we want to update it to. This function also accepts a fourth parameter that is a boolean. Setting it to `true` will create the value if it doesn't exist. It is useful when adding new data to the JSON, like this:

```sql
UPDATE books SET metadata = JSONB_SET(metadata, '{locations}', '["The Territories", "Alhambra Hotel", "Oatley Tap"]', true) WHERE title = 'The Talisman';
```

### Creating Indexes in JSON Column Data

You can only create indexes on your table's JSON data if you use the JSONB datatype, but you should do that instead of using the JSON datatype, anyway. You can create two types of indexes: standard PostgreSQL indexes or GIN indexes. Here, we create a standard index on the `format` key of the JSON in our table using the `->>` operator to specify the key.

 ```sql
CREATE INDEX book_format ON books ((metadata->>'format'));
 ```

GIN (Generalized Inverted Index) can do more that standard indexes for your JSONB columns. They are suited to indexing columns that have composite types. Here, we create a GIN index on the `authors` key in the `metadata` column, so queries for books by specific authors are faster. To create a GIN index, use the `->` operator to select the key you are indexing.

```sql
CREATE INDEX book_authors ON books USING GIN ((metadata->'authors'));
```

### Using JSONPATH: PostgreSQL 12 and Higher

In version 12, JSONPATH was added. This was to provide a better way of accessing JSON values closer to the way that JavaScript does it. Here are some important parts of the syntax:

- `@@` is a match operator used to compare the JSONPATH expression with the JSONB column.
- `@?` is a existence operator used to compare the JSONPATH expression with the JSONB column.
- `$` represents the root object of the JSON in a JSONPATH expression.
- Dot (`.`) is used for member access in a JSONPATH expression.
- Square brackets (`[]`) are used for array access in a JSONPATH expression..
- SQL/JSON arrays are 0 relative, unlike regular SQL arrays that start from 1.

Here were are queries all the books that are hardcovers:

```sql
SELECT title FROM books WHERE metadata @@ '$.format == "hardcover"';
```

You can also use some JSONPATH methods inside of the expressions. Here is an example of using JSONPATH to retrieve books that have more than one genre with the `size()` method:

```sql
SELECT title FROM books WHERE metadata @@ '$.genres.size() > 1';
```

You can also do comparisons without typecasting in JSONPATH.

```sql
SELECT title FROM books WHERE metadata @@ '$.price > 19.99';
```

Before JSONPATH, you would have to do something like this:

```sql
SELECT title FROM books WHERE (metadata->>price)::numeric > 19.99;
```

### Using JSONB Subscripting: PostgreSQL 14 and Higher

In version 14, PostgreSQL added yet another way to query JSON values. JSONPATH may be useful, but JSON subscripting even gets closer to the syntax we are used to in other programming languages. Here is an example:

```sql
SELECT title FROM books WHERE metadata['format'] = '"epub"';
```

Note that when you use JSON subscripting, your comparison value must be a JSON value. This is the reason for the double quotes.

Here is a query that finds all the titles that have "Fiction" in the first element of the genres array:

```sql
SELECT title FROM books WHERE metadata['genres'][0] = '"Fiction"';
```

Because of JSON subscripting, you no longer have to use `JSONB_SET` to update JSON values in version 14. Here is an example updating the format of one of the books in the table:

```sql
UPDATE books SET metadata['format'] = '"epub"' WHERE title = 'The Alchemist';
```

But sometimes you will still want to use `JSONB_SET` because JSON subscripting doesn't prevent you from adding a non-existent path. If the path you are updating is not there, it will always create it. This is also something to keep in mind when updating values by index in an array using subscripting. If the elements up to the index you are creating do not exist, they will get filled with nulls.

### Deleting a Row Based on a JSON value

You can delete records based on a JSON value using any of the methods we have already seen for selecting records.

```sql
DELETE FROM books WHERE metadata->>'format' = 'epub';
DELETE FROM books WHERE metadata->'format' @> '"epub"';
DELETE FROM books WHERE metadata @> '{"format" : "epub"}';
-- Version 12 and higher
DELETE FROM books WHERE metadata @@ '$.format == "epub"';
-- Version 14 and higher
DELETE FROM books WHERE metadata['format'] = '"epub"';
```

## PostgreSQL’s JSONB Functions

So far, we have only used one of PostgreSQL's JSONB functions, `JSONB_SET`, because we had to in order to update the JSON in a column, but there are many more. Each of these JSONB functions also has a JSON equivalent if you are using the JSON data type instead of JSONB.

### JSONB_EACH

This function expands the top-level JSON document into a set of key-value pairs.

```sql
SELECT JSONB_EACH(metadata) FROM books WHERE title = 'The Alchemist';
```

This query returns the following:

| jsonb_each                                |
| ----------------------------------------- |
| (format,"""epub""")                       |
| (genres,"[""Fiction"", ""Sprituality""]") |
| (authors,"[""Paulo Coelho""]")            |

### JSONB_OBJECT_KEYS

This function returns the keys of a JSON object.

```sql
SELECT JSONB_OBJECT_KEYS(metadata) FROM books WHERE title = 'The Alchemist';
```

This query returns the following:

| jsonb_object_keys |
| ----------------- |
| format            |
| genres            |
| authors           |

### JSONB_ARRAY_ELEMENTS

This function expands a JSON array into a set of values.

```sql
SELECT genres FROM books, JSONB_ARRAY_ELEMENTS(books.metadata['genres']) AS genres WHERE title = 'The Alchemist';
```

This query returns:

| genres         |
| -------------- |
| "Fiction"      |
| "Spirituality" |

This function returns the values as JSON. There is also a `JSONB_ARRAY_ELEMENTS_TEXT` that returns the elements as text values without the double quotes.

There are still more JSON and JSONB functions which you can research [here](https://www.postgresql.org/docs/14/functions-json.html).

## PostgreSQL JSON Tips

For database developers who deal with both relational and unstructured data, PostgreSQL might seem like the swiss army knife for all data, but it is not a fit for all use cases. Here are some tips to help you make sure you are using PostgreSQL’s JSON support effectively.

### Don't Store Everything as JSON Just Because You Can

After all, that is what NoSQL databases are for. The JSONB data type in PostgreSQL gives you much more flexibility, but with great flexibility comes more planning. You can query and update JSON columns, but if it is happening to the same values often, shouldn't that value be in a column?

### Avoid JSON if You Need Constraints

If you have to enforce any constraints on your JSON data, reconsider storing it in a JSONB column. It is possible to use a constraint trigger, but it won’t be easy. It would either involve complicated locking or the `SERIALIZABLE` transaction isolation level to prevent race conditions.

### Avoid JSON if You Need to Join on Attributes

If you need to use a JOIN, chances are that data should be in another table rather than in a JSONB column. You cannot use a foreign key in JSON and you will have to use a `CROSS JOIN` to join the JSON data to a column in another table.

## Summary

Often, neither a relational nor a NoSQL database perfectly fits a use case. In those cases where most of your data is relational and some of it is unstructured, PostgreSQL might be an excellent solution. The JSONB datatype that was added to PostgreSQL in version 9.4 gives you many of the features of a NoSQL database inside of PostgreSQL itself. The JSONB data type allows you to insert, validate, query, filter, and even add indexes to JSON data stored in your database while still giving you the power of relations and SQL.
