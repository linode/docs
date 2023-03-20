---
slug: sql-grouping-and-totaling
description: "SQL aggregate functions calculate a set of values by using grouping and totaling. This guide uses various examples to demonstrate how to calculate values using the Where and Having clauses."
keywords: ['aggregate functions', 'group functions', 'where clause', 'having clause']
tags: ['MySQL', 'PostgreSQL']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-18
modified_by:
  name: Linode
title: "Introduction to SQL Grouping and Totaling"
title_meta: "SQL Grouping and Totaling"
authors: ["Doug Hayman for NanoHertz Solutions Inc."]
---

One of the most powerful aspects of SQL is the ability to perform data aggregation. Two of the most powerful SQL data aggregation tools are *grouping* and *totaling*. In this guide, you learn SQL data aggregation using grouping and totaling.

## SQL Aggregate Functions

In SQL, aggregation is the process of operating or calculating a set of values. The intent is to return a single summary value. SQL includes several very powerful Aggregate Functions such as `AVG()`, `COUNT()`, `SUM()`, `MAX()`, and `MIN()`. These functions, in turn, are most often found in SQL statements that implement a `GROUP BY` clause. However, these functions do not need to be associated with that clause.

{{< note respectIndent=false >}}
Unless mentioned otherwise, all the database commands demonstrated in this guide work well on both **MySQL** and **PostgreSQL**.
{{< /note >}}

This guide uses a `CourseTaken` table to demonstrate aggregate functions. From the command line, create the `CourseTaken` table.

    CREATE TABLE CourseTaken (
        SSNumber CHAR(9) NOT NULL,
        CourseId CHAR(6) NOT NULL,
        NumericGrade INT NOT NULL,
        YearTaken INT NOT NULL
    );

The `CourseTaken` table contains the following column data:

| SSNumber | CourseId | NumericGrade | YearTaken
|:-:|:-:|:-:|:-:|
| 111111111 | CSC101 | 98 | 2021|
| 111111111 | ENG101 | 95 | 2022|
| 222222222 | CSC101 | 100 | 2022|
| 222222222 | EEE101 | 75 | 2022|
| 333333333 | POL101 | 92 | 2021|
| 333333333 | CSC101 | 84 | 2022|

### Use a SQL Aggregate Function to Calculate a Single Summary Value

The sections below provide different examples that use aggregate functions to return a single summary value. All examples use the `CourseTaken` table that was created in the Aggregate Functions section of the guide.

**Example 1:**

In this example, the aggregate function returns a numerical average grade for all students taking the course `CSC101` in the year 2022.

    SELECT AVG(NumericGrade) AS 'Avg Grade'
    FROM CourseTaken
    WHERE CourseId = 'CSC101
    AND YearTaken = 2022;

SQL returns the following average grade:

{{< output >}}
Avg Grade
---------
92
{{< /output >}}

**Example 2:**

The aggregate function below returns a count of the number of students that took course `CSC101` before the year 2022.

    SELECT COUNT(SSNumber) AS 'Student Count'
    FROM CourseTaken
    WHERE CourseId = 'CSC101'
    AND YearTaken < 2022;

The following count is returned:

{{< output >}}
Student Count
---------
1
{{< /output >}}

**Example 3:**

In this example, an aggregate function is used to obtain the maximum numeric grade recorded in any year by a Student taking `CSC101`.

    SELECT MAX(NumericGrade) AS 'Max Grade'
    FROM CourseTaken
    WHERE CourseId = 'CSC101'

The returned maximum grade is the following:

{{< output >}}
Max Grade
---------
100
{{< /output >}}

## Aggregate Data Using Group Functions

The following examples demonstrate the use of the `GROUP BY` clause using the data from the `CourseTaken` table.

**Example 1:**

The example below determines the average grade for each student for all courses that they have taken to date. To execute this, use the SQL `Group By` clause to group by Student (in this case, the `SSNumber` column).

    SELECT SSNumber, AVG(NumericGrade) AS 'Avg Grade'
    FROM CourseTaken
    GROUP BY SSNumber

The output returns the average grade for each student.

{{< output >}}
+-----------+----------+
| SSNumber  | Avg Grade|
+-----------+----------+
| 111111111 | 96.5     |
| 222222222 | 87.5     |
| 333333333 | 88       |
+-----------+----------+
{{< /output >}}

**Example 2:**

The aggregate function below finds the average grade received across every `CourseId` in the `CourseTaken` table. To do this, group by `CourseId` within `YearTaken` with the following SQL code:

    SELECT CourseId AS 'Course', YearTaken AS 'Year',
    AVG(NumericGrade) AS 'Avg Grade'
    FROM CourseTaken
    GROUP BY CourseId, YearTaken
    ORDER BY CourseId, YearTaken

You should see the following output:

{{< output >}}
+--------+------+-----------+
| Course | Year | Avg Grade |
+--------+------+-----------+
| CSC101 | 2021 | 98        |
| POL101 | 2021 | 92        |
| CSC101 | 2022 | 92        |
| EEE101 | 2022 | 75        |
| ENG101 | 2022 | 95        |
+--------+------+-----------+
{{< /output >}}

{{< note respectIndent=false >}}
The example above is slightly more complex. You group by two columns instead of one (`CourseId` within `Year`). Hence, you calculate the average grade and group by `CSC101` for the year `2021` separately from the Average Grade for `CSC101` for the year `2022`. The course `CSC101` for Year `2022` is an aggregation of two rows, while all of the other Group By rows are an aggregation of one row. Additionally, from the concept of *Ordering* (`Order By` clause) you can display ordered results (sorted) by `Course` within a given Year.
{{< /note >}}

**Example 3:**

From the SQL query in the previous example, you can restrict the number of rows that you operate by adding a `WHERE` clause to the query. For example, to generate the average grade received by students only for `CourseId` `CSC101`, group by `CourseId` within `YearTaken`. The following SQL code can accomplish this:

    SELECT CourseId AS 'Course', YearTaken AS 'Year',
    AVG(NumericGrade) AS 'Avg Grade'
    FROM CourseTaken
    WHERE CourseId = 'CSC101'
    GROUP BY CourseId, YearTaken
    ORDER BY CourseId, YearTaken

In the above SQL code, you are adding a condition (via the `WHERE` clause) before the actual group aggregation is performed (via the `GROUP BY` clause).

The following output is returned:

{{< output >}}
+--------+------+-----------+
| Course | Year | Avg Grade |
+--------+------+-----------+
| CSC101 | 2021 | 98        |
| CSC101 | 2022 | 92        |
+--------+------+-----------+
{{< /output >}}

**Example 4:**

From the SQL query in Example 2, you can apply a condition before the final result is returned. To accomplish this use the SQL `Having` clause. You can determine the average grade across every `CourseId`, where the aggregated average grade is greater than `90`. You can again group by `CourseId` within `YearTaken`. The following SQL code can accomplish this:

    SELECT CourseId AS ‘Course’, YearTaken AS ‘Year’,
    AVG(NumericGrade) AS ‘Avg Grade’
    FROM CourseTaken
    GROUP BY CourseId, YearTaken
    HAVING AVG(NumericGrade) > 90
    ORDER BY CourseId, YearTaken

The output is the following:

{{< output >}}
+--------+------+-----------+
| Course | Year | Avg Grade |
+--------+------+-----------+
| CSC101 | 2021 | 98        |
| POL101 | 2021 | 92        |
| CSC101 | 2022 | 92        |
| ENG101 | 2022 | 95        |
+--------+------+-----------+
{{< /output >}}

The row for `CourseId` `EEE101` was not returned. This is because the `Having` clause filtered it out after the `GROUP BY` clause was executed (`CourseId` `EEE101`'s average grade is below 90).

**Example 5:**

Building upon the SQL code from **Example 3** and **Example 4**, you can create aggregation queries that utilize both the `Where` and `Having` clause. For example, you can determine the courses that were taken in `2021`, where the average grade for those courses taken was greater than `93`. Here, the `Where` clause filters out results before the `Group By` data aggregation is performed, and the `Having` clause filters out results returned after the `Group By` data aggregation is performed. The following SQL code can accomplish this:

    SELECT CourseId AS ‘Course’, YearTaken AS ‘Year’,
    AVG(NumericGrade) AS ‘Avg Grade’
    FROM CourseTaken
    WHERE YearTaken = 2021
    GROUP BY CourseId, YearTaken
    HAVING AVG(NumericGrade) > 93
    ORDER BY CourseId

The output returned is the following:

{{< output >}}
+--------+------+-----------+
| Course | Year | Avg Grade |
+--------+------+-----------+
| CSC101 | 2021 | 98        |
+--------+------+-----------+
{{< /output >}}

**Example 6:**

You can count the number of rows associated with each `Group By` aggregation in a query. Building upon the previous example SQL code, you can generate the average grade received by `Students` for only `CourseId` `CSC101`, grouped by `CourseId` within `YearTaken`. The code should provide the number of students (count) associated with each group. The following SQL code can accomplish this:

    SELECT CourseId AS ‘Course’, YearTaken AS ‘Year’,
    AVG(NumericGrade) AS ‘Avg Grade’,
    Count(SSNumber) AS ‘Count’
    FROM CourseTaken
    WHERE CourseId = ‘CSC101’
    GROUP BY CourseId, YearTaken
    ORDER BY CourseId, YearTaken

The `Count(SSNumber)` in the `SELECT` clause could have been specified as `Count(*)`. The difference between the two syntaxes is that `Count(*)` includes rows that have `NULL` values in them as well. As per the `CourseTaken` table definition above, all columns in the `CourseTaken` table must contain non-null values (the `NOT NULL` attribute assures this). The `Count(SSNumber)` and `Count(*)` would be functionally equivalent in this example.

The following output is returned:

{{< output >}}
+--------+------+-----------+-------+
| Course | Year | Avg Grade | Count |
+--------+------+-----------+-------+
| CSC101 | 2021 | 98        | 1     |
| CSC101 | 2022 | 92        | 2     |
+--------+------+-----------+-------+
{{< /output >}}

## Conclusion

This guide provides the building blocks for SQL’s powerful data aggregation operations for grouping and totaling. As noted, you can restrict values that become part of these groups by using a `Where` clause in queries before the aggregation is performed. You can filter out rows of grouped results (after the aggregation is performed) by using the `Having` clause in the SQL queries.

To learn more about SQL, see our guides on [SQL data types](/docs/guides/sql-data-types/), [joins](/docs/guides/sql-joins/), and [SQL user management security](/docs/guides/sql-security/).