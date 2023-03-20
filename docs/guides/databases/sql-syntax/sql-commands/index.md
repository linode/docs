---
slug: sql-commands
description: 'SQL commands can be used across relational database systems like MySQL and PostgreSQL. Learn the fundamental SQL commands used to insert and modify data in a SQL table.'
keywords: ['create table', 'alter table', 'drop table', 'ddl commands']
tags: ['MySQL']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-04
modified_by:
  name: Linode
title: "Introduction to SQL Commands"
title_meta: "SQL Commands: Getting Started"
authors: ["Doug Hayman for NanoHertz Solutions Inc."]
---

In today’s world of increased digitization, big data, and cloud computing, data management is amongst the most important skills a software engineer can have. To this end, one of the most powerful database tools is SQL.

SQL (Structured Query Language) is the standard programming language used to manipulate data structure objects. They operate upon data that is contained in a relational database management system (RDBMS). Some well-known RDBMS are MySQL and PostgreSQL.

In this guide, you learn about the subsets of the SQL language and how to use some fundamental SQL commands, like `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

## Subsets of SQL

The list below includes the different language subsets of various SQL commands. Each subset has its own function and purpose.

- **Data Definition Language** (DDL): This allows you to create, delete, and update database schema definitions (namely, tables and indexes), without actually manipulating the data within the database tables.
- **Data Query Language** (DQL): DQL is used to retrieve data from the database using the `SELECT` statement.
- **Data Manipulation Language** (DML): This sublanguage allows for data manipulation in the database using the `INSERT`, `UPDATE`, and `DELETE` statements.

This guide uses an example database for a school to further demonstrate the SQL commands for each subset listed above. The school database has several tables, for students, courses, grades, and so forth. The definition of the `Student` table contains columns for the student's `SSNumber`, `Firstname`, and `Lastname`, and the definition of the `CourseTaken` table contains columns for `SSNumber`, `CourseId`, `NumericGrade`, and `YearTaken`.

The example assumes that there are three students in the school, each of which has completed two courses. The sample data is shown in the table below:

| SSNumber | LastName | FirstName | CourseId | NumericGrade | YearTaken |
|:-:|:-:|:-:|:-:|:-:|:-:|
| 111111111 | Smith | John | CSC101 | 98 | 2021 |
| 111111111 | Smith | John | ENG101 | 95 | 2022 |
| 222222222 | Jones | Mary | CSC101 | 100 | 2022 |
| 222222222 | Jones | Mary | EEE101 | 75 | 2022 |
| 333333333 | Hansen | Robert | POL101 | 92 | 2021 |
| 333333333 | Hansen | Robert | SOC103 | 84 | 2022 |

## Create, Alter, and Drop Tables using SQL Commands

From the command line, use the `CREATE TABLE` command followed by the name of the table and the table data. The command below creates the `Student` table.

    CREATE TABLE Student (
      SSNumber CHAR(9) NOT NULL,
      LastName VARCHAR(30) NOT NULL,
      FirstName VARCHAR(20) NOT NULL
    );

The parenthesis encloses the table data, starting with a column that labels each row’s data. The next column indicates the data type that this row holds. `CHAR` indicates a fixed-length string data type and `VARCHAR` indicates a variable-length string data type. In the final column, the `NOT NULL` attribute ensures that a record cannot be added to the table if any of the `NOT NULL` columns do not have data associated with them.

{{< note respectIndent=false >}}
The `CREATE TABLE` statement is delimited with a trailing semicolon (;), although it is possible that some commercial relational database systems may not require that delimiter.
{{< /note >}}

{{< note respectIndent=false >}}
Unless mentioned otherwise, all the database commands demonstrated in this guide work well on both **MySQL** and **PostgreSQL**.
{{< /note >}}

To create the `CourseTaken` table, execute the following command:

    CREATE TABLE CourseTaken (
      SSNumber CHAR(9) NOT NULL,
      CourseId CHAR(6) NOT NULL,
      NumericGrade INT NOT NULL
    );

The `YearTaken` column is intentionally not included in the `CourseTaken` table to demonstrate the usage of the `ALTER TABLE` command. To add the `YearTaken` column in the `CourseTaken` table, you don't need to drop the `CourseTaken` table entirely. Instead, you can use the DDL `ALTER TABLE` command. The following command alters the `CourseTaken` table by adding the missing column to the table.

    ALTER TABLE CourseTaken
      ADD (YearTaken INT NOT NULL);

The command above follows a similar syntax as before. It requires the table name as well as three arguments: row name, row data type, and `NOT NULL` attribute. If you want to delete the `CourseTaken` table entirely, issue the DDL `DROP TABLE` command followed by the table name.

    DROP TABLE CourseTaken;

{{< note type="alert" respectIndent=false >}}
Dropping a table deletes all the data in the table.
{{< /note >}}

### How to Insert Data Into a Table in SQL

To insert the data into the table, use the SQL `INSERT INTO` statement. To call this command, provide the table name and the list of row names (in parenthesis) that you want to insert the data into. This is followed by the `VALUES` keyword and the actual values (in parenthesis) that you wish to insert. The values are inserted into the rows in order of which they are called.

{{< note respectIndent=false >}}
- SQL commands can be broken up across lines. The end of the SQL command is delimited by a semicolon (`;`).
- The character data is delimited by an opening and closing apostrophe (`‘`), whereas numeric data is not.
{{< /note >}}

The following `INSERT` commands insert three rows into the `Student` table. These commands use multiple `INSERT` statements.

    INSERT INTO Student (SSNumber, LastName, FirstName) VALUES
    ('111111111', 'Smith', 'John');

    INSERT INTO Student (SSNumber, LastName, FirstName) VALUES
    ('222222222', 'Jones', 'Mary');

    INSERT INTO Student (SSNumber, LastName, FirstName) VALUES
    ('333333333', 'Hansen', 'Robert');

Similarly, you can also insert multiple rows into the table in a single SQL query as shown below:

    INSERT INTO CourseTaken
    (SSNumber, CourseId, NumericGrade, YearTaken)
    VALUES
    ('111111111', 'CSC101', 98, 2021),
    ('111111111', 'ENG101', 95, 2022),
    ('222222222', 'CSC101', 100, 2022);

{{< note respectIndent=false >}}
You can use the `INSERT INTO` command similarly in **PostgreSQL** to add rows to the table. Make sure the values match the order of the columns in the table definition.

    INSERT INTO student VALUES ('111111111', 'Smith', 'John');
{{< /note >}}

### Delete Data From a Table

To delete data from a table, use the SQL `DELETE FROM` statement. Use the `WHERE` clause to specify the condition, and if there is more than one condition, use the `AND` clause along with `WHERE`.

For example, the following command deletes a record from the `CourseTaken` table with **SSNumber** `333333333` and **CourseId** `POL101`.

{{< note type="alert" respectIndent=false >}}
If you omit the `WHERE` clause, all the records in the table are deleted.
{{< /note >}}

    DELETE FROM CourseTaken WHERE SSNumber = '333333333' AND CourseId = 'POL101';

### SQL Command to Update Data in a Table

To update the existing record in a table, use the SQL `UPDATE` command. The `SET` clause is used to set (update) a new value to a particular column and the `WHERE` clause is used to update the selected rows.

For example, the following command updates the `NumericGrade` column of the `CourseTaken` table for records with **SSNumber** `222222222` and **CourseId** `EEE101`.

    UPDATE CourseTaken
    SET NumericGrade = 95
    WHERE SSNumber = '222222222' AND CourseId = 'EEE101';

### SQL Command to Retrieve Data From a Table

The true power of relational database systems is in its ability to retrieve information in a multi-table schema, via the SQL `SELECT` command, and the ability to join tables via common keys. Although this introductory guide does not examine the creation of keys and indexes utilizing those keys, it utilizes the `SSNumber` column of each table as a vehicle (key) to relate (or join) the tables to generate information. The following examples provide different use cases of using the SQL `SELECT` command from the command line.

**Example 1:** To fetch the list of all students in the school.

    SELECT * from Student;

**Output:**
{{< output >}}

+-----------+----------+-----------+
| SSNumber  | LastName | FirstName |
+-----------+----------+-----------+
| 111111111 | Smith    | John      |
| 222222222 | Jones    | Mary      |
| 333333333 | Hansen   | Robert    |
+-----------+----------+-----------+

{{< /output >}}

**Example 2:** To fetch the list of all students and courses they have taken.

    SELECT Student.SSNumber, Student.LastName,
           Student.FirstName, CourseTaken.CourseId
    FROM Student, CourseTaken
    WHERE Student.SSNumber = CourseTaken.SSNumber;

**Output:**

{{< output >}}
+-----------+----------+-----------+----------+
| SSNumber  | LastName | FirstName | CourseId |
+-----------+----------+-----------+----------+
| 111111111 | Smith    | John      | CSC101   |
| 111111111 | Smith    | John      | ENG101   |
| 222222222 | Jones    | Mary      | CSC101   |
+-----------+----------+-----------+----------+
{{< /output >}}

{{< note respectIndent=false >}}
In the above command, the two tables, `Student` and `CourseTaken` are joined to retrieve the required information. The column names in the `SELECT` and `WHERE` clauses are prefixed with their table names for clarity. However, in the case of the `SSNumber` column, we are required to specify the appropriate table name prefixes, since both tables share the same column name. The `FROM` clause indicates the tables that are being used in this query.
{{< /note >}}

**Example 3:** Retrieve the list of students with **CourseId** `CSC101` and the year that they took this course.

    SELECT Student.LastName, Student.FirstName,
           CourseTaken.CourseId, CourseTaken.YearTaken
    FROM Student, CourseTaken
    WHERE Student.SSNumber = CourseTaken.SSNumber
    AND CourseTaken.CourseId = 'CSC101';

**Output:**
{{< output >}}

+----------+-----------+----------+-----------+
| LastName | FirstName | CourseId | YearTaken |
+----------+-----------+----------+-----------+
| Smith    | John      | CSC101   |      2021 |
| Jones    | Mary      | CSC101   |      2022 |
+----------+-----------+----------+-----------+

{{< /output >}}

**Example 4:** Retrieve the list of student names, courses taken and grades received, for those that had course grades above `90`.

    SELECT Student.LastName, Student.FirstName,
           CourseTaken.CourseId, CourseTaken.NumericGrade
    FROM Student, CourseTaken
    WHERE Student.SSNumber = CourseTaken.SSNumber
    AND CourseTaken.NumericGrade > 90;

**Output:**
{{< output >}}

+----------+-----------+----------+--------------+
| LastName | FirstName | CourseId | NumericGrade |
+----------+-----------+----------+--------------+
| Smith    | John      | ENG101   |           95 |
| Smith    | John      | CSC101   |           98 |
| Jones    | Mary      | CSC101   |          100 |
+----------+-----------+----------+--------------+

{{< /output >}}

{{< note respectIndent=false >}}
The `AND` clause in the command above allows you to filter the results by a conditional grade score test.
{{< /note >}}

## Conclusion

This guide on SQL commands is an introductory primer on how to create database schemas and manipulate data within those databases. Although the concepts introduced here merely scratch the surface in regard to relational database systems’ usage, it as a good starting point for basic and essential commands and concepts.