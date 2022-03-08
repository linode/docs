---
slug: sql-data-types
author:
  name: Doug Hayman for NanoHertz Solutions Inc.
  email: docs@linode.com
description: 'In this guide, you learn about the various data types that are used in the relational database management systems.'
og_description: 'In this guide, you learn about the various data types that are used in the relational database management systems.'
keywords: ['binary data type', 'numeric data type', 'character data type', 'date time data type']
tags: ['MySQL', 'PostgreSQL']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-03
modified_by:
  name: Linode
title: "SQL Data Types"
h1_title: "Introduction to SQL Data Types"
enable_h1: true
contributor:
  name: Doug Hayman
  link: http://nhzsolutions.com/
---

Choosing the proper data type for a table column is an important decision. It reduces the need for data type conversions, enhances the performance of database queries, and minimizes storage requirements.

In this guide, you explore the various data types that are used in the relational database management systems (RDBMS). These data types can be used when creating or altering a table, or when declaring variables in the database stored procedures. Some well-known RDBMS are MySQL and PostgreSQL.

## Binary Data Types

To store binary data (`0` or `1`), you use the `BINARY` and `VARBINARY` data types. The length of the `Binary` data type is a length in bytes for all table rows. Whereas, the `VarBinary` data type can vary in length in bytes from one table row to the next. Both these data types are used to store strings of bits (`0`'s and `1`'s). Their values are assigned and retrieved using the hexadecimal representation, which is indicated by a prefix of "`0x`". The columns (or variables) of both the `Binary` and `VarBinary` data types are used to store the content of image files such as JPEG, BMP, or word files, etc.

For example, for a decimal value of `63`, its hexadecimal value is represented by "`0x3F`" and its binary bit string equivalent would be "`111111`". To understand the value of these binary strings and how they are stored, consider the example below:

{{< note >}}
Unless mentioned otherwise, all the database commands demonstrated in this guide works well on both **MySQL** and **PostgreSQL**.
{{< /note >}}

1. From the command line, create a table called `BinaryExample` as shown below:

        CREATE TABLE BinaryExample (
          BinaryCol BINARY (10),
          VarBinaryCol VARBINARY (10)
        );

1. Insert a row into the `BinaryExample` table:

        INSERT INTO BinaryExample (BinaryCol, VarBinaryCol)
        VALUES (0x4D7953514C, 0x39274D);

1. Select the data from the `BinaryExample` table:

        SELECT BinaryCol, VarBinaryCol FROM BinaryExample;

    The output would look like the following:

    {{< output >}}
+------------------------+----------------------------+
| BinaryCol              | VarBinaryCol               |
+------------------------+----------------------------+
| 0x4D7953514C0000000000 | 0x39274D                   |
+------------------------+----------------------------+
    {{< /output >}}

As you can see, the `BinaryCol` data is padded to the maximum column size with trailing zeros, but the `VarBinaryCol` data does not. This is because the columns of the `VarBinaryCol` are defined as variable length.

{{< note >}}
The maximum size (length) of Binary and VarBinary data types vary depending on the database implementation. They're generally quite large (over 8,000 bytes). Some database implementations have binary extensions to these core data types that can store data in sizes of multi-gigabytes.
{{< /note >}}

## Numeric Data Types

Numeric data types come in the flavor of Integer numeric data, Exact numeric data, or Approximate numeric data.

### Integer Numeric Data Types

Integer data types can be Unsigned and Signed. **Unsigned** can store only zero and positive numbers, whereas **Signed** allows zero, positive, and negative numbers.

Most SQL implementations support Integer data types of `INT`, `SMALLINT`, and `TINYINT` for storage of positive and negative whole numbers. The choice of using these data types depends on the range of values required to be stored.

The following table displays the permitted storage in bytes for the integer numeric data types, and their minimum and maximum SIGNED values.

| Type | Storage (bytes) | Minimum Value SIGNED | Maximum Value SIGNED |
|:-:|:-:|:-:|:-:|
| INT | 4 | minus 2^31 (-2147483648) | plus 2^31 (2147483647) |
| SMALLINT | 2 | minus 2^15 (-32768) | plus 2^15 (32767) |
| TINYINT | 1 | -128 | 127 |

To demonstrate the minimum and maximum signed values of Integer numeric data types, consider the example `NumericExample` table below:

1. From the command line, create the `NumericExample` table.

        CREATE TABLE NumericExample (
          IntColumn INT,
          SmallIntColumn SMALLINT,
          TinyIntColumn TINYINT
        );

1. Insert the following values into the `NumericExample` table.

        INSERT INTO NumericExample (IntColumn, SmallIntColumn, TinyIntColumn)
        VALUES (3258594758, 32767, 255);

   From the above command, you can observe that you cannot insert the values `3258594758` and `255` to `IntColumn` and `TinyIntColumn` respectively. This is because the maximum SIGNED value for an integer data type is `2147483647` and that of a TinyInt is `127`. When you execute the above command you get the "Out of range" error as shown below:

    {{< output >}}
ERROR 1264 (22003): Out of range value for column 'IntColumn' at row 1
{{< /output >}}

1. Update the values of the `IntColumn` and `TinyIntColumn` columns and rerun the `INSERT` command.

        INSERT INTO NumericExample (IntColumn, SmallIntColumn, TinyIntColumn)
        VALUES (2147483647, 32767, 127);

1. Retrieve the column values using the `SELECT` statement:

        SELECT IntColumn, SmallIntColumn, TinyIntColumn
        FROM NumericExample;

    The output would look like the following:

    {{< output >}}
+------------+----------------+---------------+
| IntColumn  | SmallIntColumn | TinyIntColumn |
+------------+----------------+---------------+
| 2147483647 |          32767 |           127 |
+------------+----------------+---------------+
{{< /output >}}

### Decimal Numeric Data Types (Exact Numeric)

Decimal data types, `DECIMAL` and `NUMERIC`, also called exact numeric data types stores exact and fixed numeric values. They store an integer value to the left of the decimal point and a fractional value to the right of the decimal point. They're functionally equivalent with the same storage requirements. The storage used for these types depends on the specified precision and ranges. They can range from two bytes to 17 bytes, and their values can range from `-10^38 +1` to `+10^38 -1`.

These two data types are defined by a *precision* and a *scale*. The "precision" denotes the number of places to the left and right of the decimal point combined, whereas the "scale" denotes the total number of digits to the right of the decimal point. These two data types can be formally defined as:

    DECIMAL(precision, scale)

or

    NUMERIC(precision,scale)

To demonstrate the decimal numeric data type, consider the example below:

1. From the command line, create the `ExactNumericExample` table.

        CREATE TABLE ExactNumericExample (
          DecimalCol DECIMAL(5,2),
          NumericCol NUMERIC(7,2)
        );

1. Insert the following values into the `ExactNumericExample` table.

        INSERT INTO ExactNumericExample (DecimalCol, NumericCol)
        VALUES (123.45, 12345.67);

1. Retrieve the column values using the `SELECT` statement:

        SELECT DecimalCol, NumericCol FROM ExactNumericExample;

    The output would like the following:

    {{< output >}}
+------------+------------+
| DecimalCol | NumericCol |
+------------+------------+
|     123.45 |   12345.67 |
+------------+------------+
{{< /output >}}

### Floating-Point Numeric Data Types (Approximate Numeric)

The Floating-point numeric data types, also called approximate numeric data types are `FLOAT` and `REAL`. These data types store an approximate value due to the binary representation of floating-point data. A column/variable can be defined as type:

    Float(N)

Here, the parameter `N` indicates whether the field should hold four or eight bytes. A value of `N` greater than seven requires eight bytes; seven or less requires four bytes. Floating precision for this data type ranges from `-1.79E + 308` to `1.79E + 308`.

Similarly, a column/variable defined as data type Real takes up four bytes of storage, and provides a range of values from `-3.40E + 38` to `3.40E + 38`.

## Character Data Types

The data types `CHAR` and `VARCHAR` are used to store character data up to 8,000 bytes in length. Both these data types store string values in the database columns, but they differ in how their values are stored & retrieved. The length of the `CHAR` data type remains fixed at their specified length whether that allocation space is utilized or not. If the space is not utilized, the column/variable is padded with extra spaces. `VARCHAR` outputs the value as it is, without any additional spaces.

To demonstrate the character data type, consider the example below:

1. From the command line, create the `Employee` table.

        CREATE TABLE Employee (
            LastName VARCHAR(25),
            FirstName VARCHAR(20),
            Sex CHAR(1)
        );

1. Insert the following values into the `Employee` table.

        INSERT INTO Employee (LastName, FirstName, Sex)
        VALUES ('Jones', 'Mary', 'F');

1. Retrieve the column values using the `SELECT` statement:

        SELECT LastName, FirstName, Sex FROM Employee;

    The output would like the following:

    {{< output >}}
+----------+-----------+------+
| LastName | FirstName | Sex  |
+----------+-----------+------+
| Jones    | Mary      | F    |
+----------+-----------+------+
{{< /output >}}

The columns `LastName` and `Firstname` are declared type `Varchar`. This allows names to be as long as the data type definition. But for names shorter than the specified maximum, no blank spaces are appended to the data in these columns.

## Date/Time Data Type

The `DATETIME` data type is used to store the date and time values in the database. Values for the `DATETIME` data type use four bytes of storage for the
date portion and four bytes for the time portion. But, the time portion specifies time with a granularity down to the number of milliseconds after midnight. Precision for this data type ranges from "January 1, 1753", to "December 31, 9999", with an accuracy of 3.33 milliseconds.

{{< note >}}
If you assign only the date value to a `DATETIME` data type column/variable, the time portion defaults to midnight.
{{< /note >}}

To demonstrate the `DATETIME` data type, consider the stored procedure example below:

    DELIMITER //
    CREATE PROCEDURE Datetimedemo()
    BEGIN
    DECLARE BirthDate DATETIME
    SET BirthDate = '1990-01-01 09:00:00'
    SELECT BirthDate
    END//
    DELIMITER ;
    call Datetimedemo;

The output would like the following:
        {{< output >}}
+----------+-----------+
| BirthDate            |
+----------+-----------+
| 1990-01-01 09:00:00  |
+----------+-----------+
{{< /output >}}

{{< note >}}
Some SQL implementations support additional data types, which are either a subset, superset, or variant of all the above specified data types.
{{< /note >}}

## SQL Data Type Considerations

When designing a database, it is extremely important to carefully select appropriate data types for table columns and stored procedure variables.

Choices made can have a significant impact on storage efficiency and overall database performance. A simple example is to define a person’s `Age` column to be of the `Tinyint` data type, as opposed to the `Int` data type. This is because of the following reasons:

1. As noted earlier, `Tinyint` data types have ¼ of the storage requirements of `Int` data types.
1. The retrieval efficiency of a `Tinyint` column versus an `Int` column is much greater.

On the surface, this may not appear to be of a large concern. But, if the affected table has millions of rows in it, both storage, and performance efficiencies can certainly be achieved. If you extend this design criteria across an entire database, you can generate these efficiencies by orders of magnitude.

Spending the necessary design time in database data type selection can potentially mitigate the need to perform expensive type conversions in queries and stored procedure logic, when comparing columns of different data types.

For example, in one table, you store a date in a `Varchar(20)`column, and in another table you store a date in `Datetime` column. If you need to compare the two columns, you must use a data type conversion function in a query on one of the two columns. This would be an expensive operation.

## Conclusion

SQL Data Types are the attributes associated with database columns/variables. These attributes can take the form of being binary, numeric, character, and date/time. Careful design time is necessary to ensure that columns/variables are defined with a correct data type, to ensure both storage and query execution efficiency.