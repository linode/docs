---
slug: delete-record-sql
description: 'Learn the SQL delete syntax and the step-by-step process to delete rows from tables in SQL.'
keywords: ['delete record sql', 'delete all rows', 'how to delete row in sql', 'delete query in sql', 'sql delete syntax']
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-04-10
modified_by:
  name: Linode
title_meta: "Using the Delete Command in SQL"
title: "Developer’s Guide to the Delete Query in SQL"
authors: ["Martin Heller"]
---

The `DELETE` statement allows you to remove a row or rows from a database table using Structured Query Language (SQL). This guide explains the `DELETE` statement, ways to use it, and what can make a `DELETE` statement fail.

## What Is Delete in SQL?

The acronym CRUD refers to the four basic transactional operations in SQL: create, read, update, and delete, which are implemented with the `INSERT`, `SELECT`, `UPDATE`, and `DELETE` statements. The `SELECT`, `UPDATE` and `DELETE` statements can be combined with a `WHERE` clause to limit their scope.

The `DELETE` statement removes a single row, a group of rows that meet some criteria, or all rows from a single database table. If the specified row does not exist, the `DELETE` statement fails. If the specified row does exist but has a foreign key constraint with an existing reference, the `DELETE` statement fails unless an `ON DELETE CASCADE` trigger applies.

{{< caution >}}
Be cautious when executing `DELETE` statements, because they permanently remove database rows. The effects can be even more extensive when an `ON DELETE CASCADE` trigger exists. This is because if a row in a parent table is deleted, then all the corresponding records in the child table are automatically deleted.
{{< /caution >}}

This guide includes several verification techniques to ensure that you are deleting only the desired rows, and also ways to save rows elsewhere before removing them.


### SQL Delete Syntax

The basic syntax of the SQL `DELETE` statement is as follows:

```command
DELETE FROM <table name> WHERE <condition>;
```

The `WHERE` clause can be simple or complex. A `DELETE` statement that omits `WHERE` and its condition deletes all rows in the named table, which is the equivalent of using `DROP` to remove a table. The `DROP` sequence is often faster at runtime if you need to delete all rows from a table, depending on your database and the amount of data in the table.

`WHERE` clause syntax uses the operators `=`, `<`, `>`, `<=`, `>=`, `<>`, `BETWEEN`, `LIKE`, `IN`, `IS NULL`, and `IS NOT NULL`. The same `WHERE` clause that works with `DELETE` statements also works with `SELECT` statements. Therefor, it’s useful to test your clause on non-destructive `SELECT` statements before you attempt to delete a large portion of data.

{{< note >}}
Most SQL databases expect you to enclose string literals in single quotes, however some also accept double quotes. Refer to your SQL database's documentation for the definitive `WHERE` clause syntax.
{{< /note >}}

## How to Use the Delete Command in SQL?

The most important aspect of a `DELETE` statement is crafting an exacting `WHERE` clause.

### Deleting Rows With IN and IS NULL

You can delete specific rows using `IN` as pat of the `WHERE` condition of a `DELETE` statement. This is helpful when choosing a field that is a unique primary key. Similarly, you can use `IS NULL` for the `WHERE` condition of a `DELETE` statement to delete rows where the field is NULL. NULL is not a value; it means that the field has no value, so you can’t test for equality like you would if it were 0 or 'NULL'.

For example, consider the table below from a banking example:

```command
SELECT * FROM accounts;
```

```output
id   | balance
+----+----------+
   1 | 10000.50
   2 | 25000.00
   3 |  8095.23
   4 |  9394.60
   5 | NULL
   6 | NULL
(6 rows)
```

There are two ways to delete the two NULL rows, which have id values of `5` and `6`. You can use the `IN` operator:

```command
DELETE FROM accounts WHERE id in (5, 6);
```

Or, you can use the `IS NULL` operator to produce the same result.

```command
DELETE FROM accounts WHERE balance is null
```

In either case, the two matching rows are removed. To confirm, execute the `SELECT` statement on the `accounts` table.

```command
SELECT * FROM accounts;
```

```output
  id | balance
+----+----------+
   1 | 10000.50
   2 | 25000.00
   3 |  8095.23
   4 |  9394.60
(4 rows)
```

### Deleting promo_codes From the movr Database

The [movr database](https://www.cockroachlabs.com/docs/stable/movr.html) is a sample database supplied with CockroachDB, which you can generate using the workload tool. CockroachDB supports PostgreSQL syntax.

The below statement retrieves `code` values from the `promo_codes`, returning a limit of ten values.

```command
movr> select code from promo_codes limit 10;
```

```output
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
```

To delete the first code, `0_explain_theory_something`, you can use either the `=` operator or `LIKE`.

```command
DELETE FROM promo_codes where code = '0_explain_theory_something';
```

The statement above works assuming the codes are unique, which in this case is true.

The `LIKE` operator is less straightforward, so it's a good idea to test which rows will be effected with a `SELECT` statement like the one below:

```command
SELECT code FROM promo_codes where code like '0%';
```

```output
  0_explain_theory_something
(1 row)
```

In this example, the query correctly identified the target row. You can now use the `DELETE` statement:

```command
DELETE FROM promo_codes where code like '0%';
```

`LIKE` operator supports two wildcard characters: `%`, which matches any string, and `_`, which matches any single character. To include the `_` that appears in the values in `LIKE` operator, you need to escape it with a backslash as follows:

```command
DELETE FROM promo_codes where code like '0\_%';
```

Using a `%` at the end of a `LIKE` specifier is typically more efficient than using a `%` at the beginning of a `LIKE` specifier. This is because the SQL engine has to scan the whole field instead of relying on the index to reduce the number of rows read.


## Conclusion

You now know the usage and syntax of the SQL `DELETE` statement, several conditions that can make a `DELETE` statement fail, and several ways to use `DELETE` with different `WHERE` clauses. You can also see the value of testing your `WHERE` clauses non-destructively in `SELECT` statements.
