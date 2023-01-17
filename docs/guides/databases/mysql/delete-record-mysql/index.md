---
slug: delete-record-sql
author:
  name: Linode Community
  email: docs@linode.com
description: 'Read our guide to learn the SQL Delete syntax and the step-by-step process to delete rows from tables in SQL.'
keywords: ['delete record sql', 'delete all rows', 'how to delete row in sql', 'delete query in sql', 'sql delete syntax']
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-01-09
modified_by:
  name: Linode
title_meta: "Using the Delete Command in SQL"
title: "Developer’s Guide to the Delete Query in SQL"
enable_h1: true
contributor:
  name: Martin Heller
---

The `DELETE` statement allows you to remove a row or rows from a database table using Structured Query Language (SQL). This guide explains `DELETE` statement and ways to use them and explores what can make a `DELETE` statement fail.

## What Is Delete in SQL?

CRUD (create, read, update, and delete) refers to the four basic transactional operations in SQL, which are implemented for rows by the `INSERT`, `SELECT`, `UPDATE`, and `DELETE` statements. The `SELECT`, `UPDATE` and `DELETE` statements can be combined with a `WHERE` clause to limit their scope.

The `DELETE` statement removes a single row, a group of rows that meet some criteria, or all rows from a single database table. If the specified row does not exist, the `DELETE` statement fails. If the specified row does exist but has a foreign key constraint with an existing reference, the `DELETE` statement fails unless an `ON DELETE CASCADE` trigger applies.

{{< caution >}}
Be sure when executing the `DELETE` statements, because they permanently remove rows. The damage can be even more extensive when an `ON DELETE CASCADE` trigger exists. This is because, if a row in a parent table is deleted, then all the corresponding records in the child table are automatically deleted.
{{< /caution >}}

 This guide includes several verification techniques to ensure that you are deleting only the desired rows, and also ways to save rows elsewhere before removing them.


### SQL Delete Syntax

The basic syntax of the SQL `DELETE` statement is as follows:

    DELETE FROM <table name> WHERE <condition>;

The `WHERE` clause can be simple or complex. A `DELETE` statement that omits `WHERE` and its condition deletes all rows in the named table, which is the equivalent of `DROP` and `CREATE TABLE` syntax. The `DROP`/`CREATE` sequence is often faster at runtime, depending on your database and the amount of data in the table.

`WHERE` clause syntax uses the operators =, <, >, <=, >=, <>, BETWEEN, LIKE, IN, IS NULL, and IS NOT NULL. The same `WHERE` clause applies to `SELECT` statements as `DELETE` statements. So it’s useful to test your clause on non-destructive `SELECT` statements before you delete half of a table by accident.

{{< note >}}
Most SQL databases expect you to enclose string literals in single quotes; some also accept double quotes. For the definitive `WHERE` clause syntax for your database, consult its reference documentation.
{{< /note >}}

## How to Use the Delete Command in SQL?

The hard part of constructing a `DELETE` statement is usually getting the `WHERE` clause right.

### Deleting Rows With IN and IS NULL

You can delete specific rows using `IN` for the `WHERE` condition of a `DELETE` statement. This is the least confusing when you choose a field that is a unique primary key. Using `IS NULL` for the `WHERE` condition of a `DELETE` statement deletes rows where the field is NULL. NULL is not a value; it means that the field has no value, so you can’t test for equality like you would if it were 0 or 'NULL'.

For example, consider the table below from a banking example:

    SELECT * FROM accounts;

{{< output >}}
id   | balance
+----+----------+
   1 | 10000.50
   2 | 25000.00
   3 |  8095.23
   4 |  9394.60
   5 | NULL
   6 | NULL
(6 rows)
{{< /output >}}

There are two obvious ways to delete the two NULL rows, which have id values of `5` and `6`. You can use the `IN` operator, or the `IS NULL` operator that produces the same result.

    DELETE FROM accounts WHERE id in (5, 6);

or

    DELETE FROM accounts WHERE balance is null


In either case, the two rows are removed. To confirm, execute the `SELECT` statement on the `accounts` table.


    SELECT * FROM accounts;

{{< output >}}
  id | balance
+----+----------+
   1 | 10000.50
   2 | 25000.00
   3 |  8095.23
   4 |  9394.60
(4 rows)
{{< /output >}}

### Deleting promo_codes From the movr Database

The [movr database](https://www.cockroachlabs.com/docs/stable/movr.html) is a sample database supplied with CockroachDB, which can be generated using the workload tool. CockroachDB supports PostgreSQL syntax.

One of the tables in movr is `promo_codes` and the below statement retrieves `code` from the `promo_codes` table with a limit.

    movr> select code from promo_codes limit 10;

{{< output >}}
             code
------------------------------
  0_explain_theory_something
  100_address_garden_certain
  101_system_skin_night
  102_card_professional_kid
  103_now_project_focus
  104_long_become_prove
  105_republican_guess_arm
  106_court_especially_plan
  107_she_matter_ten
  108_wind_marriage_for
(10 rows)
{{< /output >}}

To delete the first code, `0_explain_theory_something`, you can use one of two ways; with the `=` operator or the `LIKE` operator as shown below:

    DELETE FROM promo_codes where code = '0_explain_theory_something';

The statement above is fairly foolproof assuming that the codes are unique (which they are). Although it might require you to type, or copy, a long string, the `LIKE` operator can be tricky. So you can test it first with a `SELECT` statement as follows:

    SELECT code FROM promo_codes where code like '0%';

{{< output >}}
  0_explain_theory_something
(1 row)
{{< /output >}}

That works, so go ahead and use it in a `DELETE` statement as follows:

    DELETE FROM promo_codes where code like '0%';
    DELETE 1


Note that the `LIKE` operator supports two wildcard characters, `%`, which matches any string, and `_`, which matches any single character. To include the `_` that appears in the values in `LIKE` operator, you need to escape it with a backslash as follows:

    DELETE FROM promo_codes where code like '0\_%';

Using a `%` at the end of a `LIKE` specifier is typically efficient because the index on the field can apply. But using a `%` at the beginning of a `LIKE` specifier is not, because the SQL engine has to scan the whole field instead of relying on the index to reduce the number of rows read.


## Conclusion

You now know the usage and syntax of the SQL `DELETE` statement, several conditions that can make a `DELETE` statement fail, and several ways to use `DELETE` with different `WHERE` clauses. You can also see the value of testing your `WHERE` clauses non-destructively in `SELECT` statements.
