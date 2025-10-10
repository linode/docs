---
slug: sql-functions
title: "Introduction to SQL Functions"
description: "Learn about SQL functions and how it can be used for performing calculations on data."
authors: ["Doug Hayman for NanoHertz Solutions Inc"]
contributors: ["Doug Hayman for NanoHertz Solutions Inc"]
published: 2022-06-27
keywords: ['SQL mathematical functions', 'SQL date functions', 'SQL string functions', 'SQL conversion functions']
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

SQL Server, MySQL server, and other commercial database systems offer a host of built-in functions that include mathematical, date, string, and conversion functions. These functions can be used for both processing and manipulating data within the server environments. These inherent functions provide valuable enhancements/extensions to the SQL language and are useful programmatic utilities that are available to a SQL developer.

In this guide, we discuss SQL functions, what they are, and how they work.

## SQL Mathematical Functions

Most SQL dialects offer a plethora of mathematical functions as added enhancements to the SQL language. In addition to many mathematical functions, some of the more widely used include `ABS`, `COUNT`, `MIN`, `MAX`, `ROUND`, and `SUM` which are all outlined below.

### ABS() function

The `ABS()` function returns the absolute value of a constant or expression and returns `NULL` if the constant or expression is `NULL`.

For example:

    SELECT ABS(2);   /* Returns a value of "2" */

    SELECT ABS(-2);  /* Returns a value of "2" */

### COUNT() function

The `COUNT()` function returns the number of rows that matches a specified criterion in a `Select` statement.

The format of the COUNT() function is:

    SELECT COUNT(ColumnName)
    FROM   Table
    WHERE  Criteria

where `ColumnName` is the name of a column in table `Table`, and `Criteria` is a condition based on which `COUNT()` returns the number of rows matched.

For example:

    SELECT COUNT(EmployeeName)
    FROM   Employees
    WHERE  Salary > 100000;    /* Returns the count of employees
                                with salary > $100k */

### MIN() and MAX() function

The `MIN()` function returns the minimum value of a selected column, whereas the `MAX()` function returns the maximum value of a selected column.

For example:

    SELECT MAX(Salary)
    FROM   Employees;  /* Returns the highest salary of all employees
                       in table Employees */

    SELECT MIN(Salary)
    FROM   Employees;  /* Returns the lowest salary of all employees
                       in table Employees */

### ROUND() function

The `ROUND()` function rounds a number to a specified number of decimal places.

The format of the `ROUND()` function is:

    ROUND( Number, DecimalPlaces);  /* Round Number to # of DecimalPlace */

For example:

    SELECT ROUND (346.315, 2);      /* Returns a value of 346.32 */

    SELECT ROUND (346.314, 2);      /* Returns a value of 346.31 */

    SELECT ROUND (346.27863, 3);    /* Returns a value of 346.279 */

### SUM() function

The `SUM()` function calculates the sum of a set of values.

For example:

    SELECT SUM(Quantity)
    FROM OrderDetails;     /* Returns the Sum of Column Quantity
                            from the OrderDetails Table */

## SQL Date Functions

Most SQL dialects offer several date functions that are added enhancements to the SQL language. Although the names of date functions differ across the different database server implementations, their functionality is identical. In SQL Server, some of the more popular date functions include `GETDATE`, `DATEPART`, `DATEADD`, `DATEDIFF`, and `CONVERT`, which are all outlined below.

### GETDATE() function

The `GETDATE()` function is a SQL Server function that returns the current date and time. Its MySQL equivalent is the `NOW()` function.

    SELECT GETDATE();    /* Returns this system date.
                          As an example,'2022-03-19 11:22.04' */

In the following example, any time a record is inserted into the `Orders` table, the current date/time is inserted into the `OrderDate` column. This is because its default is defined by the `GETDATE()` function.

     CREATE TABLE Orders (
        OrderId       INT           NOT NULL,
        ProductName   VARCHAR(25)   NOT NULL,
        OrderDate     DATETIME NOT  NULL DEFAULT GETDATE()
    );

### DATEPART() function

The `DATEPART()` function returns a specific portion of a date/time string, based on a unit specification. The unit specification can be any portion of the date/time string including Year, Month, Day, Hour, Minute, Seconds, etc. The MySQL equivalent is the `EXTRACT()` function.

The format of the `DATEPART()` function is:

    DATEPART (unit, date string)

For example, using the `Orders` table specified above, we can retrieve specific units (year, month, and day) of the `OrderDate` column for `OrderId` 7, as shown below:

    SELECT   DATEPART(yyyy, OrderDate),
             DATEPART(mm, OrderDate),
             DATEPART(dd, OrderDate)
    FROM Orders
    WHERE OrderId = 7;

### DATEADD() function

The `DATEADD()` function adds (or subtracts using negative units) a specified time interval (based on a specified unit) from a date, where the unit specification can be in Years, Months, Days, Hours, Minutes, Seconds, etc. The MySQL equivalent functions are `DATE_ADD()` and `DATE_SUB()`.

The format of the `DATEADD()` function is:

    DATEADD(unit, number, date)

For example, following is the SQL code to calculate 30 days beyond the `OrderDate` in the `Orders` table, for `OrderId` 7:

    SELECT DATEADD(day, 30, OrderDate)
    FROM Orders
    WHERE OrderId = 7;

### DATEDIFF() function

The `DATEDIFF()` function, similarly named in MySQL, returns the time between two dates. The unit specification for the difference can again be expressed in Years, Months, Days, Hours, Minutes, Seconds, etc.

The format of the `DATEDIFF()` function is:

    DATEDIFF(unit, startdate, enddate)

Consider the `Orders` table example above. For `OrderId` 7, to calculate the number of days that have elapsed between Today (from `GETDATE()`), and the `OrderDate` column value, the SQL code would be:

    SELECT DATEDIFF(day, GETDATE(), OrderDate)
    FROM Orders
    WHERE  OrderId=7;

### CONVERT() function

The `CONVERT()` function can be used to display date/time data in different formats. The MySQL equivalent function is the `DATE_FORMAT()` function.

The format of the `CONVERT()` function is:

    CONVERT(data_type(length), expression, style)

where `style` can be a myriad of numeric output formats (see SQL Server documentation for an [exhaustive list](https://docs.microsoft.com/en-us/sql/t-sql/functions/format-transact-sql?view=sql-server-ver16)).

For example:

    SELECT GETDATE();    /* Returns this system date.
                            For example, 2022-03-19 11:22.04 */

    SELECT CONVERT(VARCHAR(10), GETDATE(), 10);
    /* Returns ‘03-19-22’, since style "10" equates to "mm-dd-yy" */

## SQL String Functions

Most SQL dialects offer a number of string manipulation functions which are added enhancements to the SQL language. Some of the more prominent SQL Server string functions include `CHARINDEX`, `CONCAT`, `FORMAT`, `LEFT`, `LEN`, `RIGHT`, `TRIM`, and `SUBSTRING`. If the string function names (described below) in MySQL differ, their counterpart name is specified.

### CHARINDEX() function

The `CHARINDEX()` function searches for a substring in a string and returns the starting numeric position of the specified substring. If the substring is not found within the string, this function returns a value of "0". The MySQL equivalent function is named `INSTR`.

The format of the `CHARINDEX()` function is:

    CHARINDEX(substring, string, start)

For example:

    SELECT CHARINDEX('b’, 'Zebra');   /* Returns a value of ‘3’ */

    SELECT CHARINDEX('y’, 'Zebra');   /* Returns a value of ‘0’ */

### CONCAT() function

The `CONCAT()` function adds two or more strings together.

The format of the `CONCAT()` function is:

     CONCAT(string1, string2, ...., stringN)

For example:

     SELECT CONCAT('Today is ', 'Sunday');   /* Returns the string:
                                               'Today is Sunday' */

### FORMAT() function

The `FORMAT()` function formats a value with the specified format. It is typically used to format date/time values and numeric values.

The format of the `FORMAT()` function is:

    FORMAT(value, format)

For example:

    SELECT FORMAT(111223333, '##-##-#####'); /* Returns the string '111-22-3333' */

### LEFT() function

The `LEFT()` function returns a substring with a specified number of characters from a string (starting from the left; that is position 1).

The format of the `LEFT()` functions is:

     LEFT(string, NumberOfChars)

For example:

     SELECT LEFT('Johanson', 5); /* Returns a substring of ‘Johan’ */

### LEN() function

The function `LEN()` returns the length of a string. The Mysql equivalent function is named `CHAR_LENGTH`.

The format of the `LEN()` function is:

    LEN(string)

For example:

    SELECT LEN('My dog is named Lily');  /* Returns a value of 20 */

### RIGHT() function

The `RIGHT()` function returns a substring with a specified number of characters from a string (starting from the right).

The format of the `RIGHT()` functions is:

    RIGHT(string, NumberOfChars)

For example:

    SELECT RIGHT('Johanson', 5);    /* Returns a substring of 'anson' */

### TRIM() function

The `TRIM()` function removes both leading and trailing spaces from a string.

The format of the `TRIM()` function is:

    SELECT TRIM(string)

For example:

    SELECT TRIM(' This is a string `); /* Returns the string This is a string' */

### SUBSTRING() function

The `SUBSTRING()` function returns a substring of characters from a string, given a starting position and a specified length of the required substring.

The format of the `SUBSTRING()` function is:

    SUBSTRING(string, start, length)

For example:

    SELECT SUBSTRING('Mr. Jones', 5, 5);   /* Returns a substring of ‘Jones’ */

## SQL Conversion Functions

In addition to assisting date/time columns/values from being converted to different display formats (noted in the SQL Date functions section above), the `CONVERT()` function can also be used to convert a value of any type into a different specified datatype.

In this context, the format of the `CONVERT()` function is:

    SELECT CONVERT(datatype, value);

For example:

    SELECT CONVERT(VARCHAR(20), 12345.34); /* Returns a string of ‘12345.34’ */

## Conclusion

The use of mathematical, date/time, string, and conversion functions offers many built-in facilities that help augment the SQL language. These powerful functions can be used for both processing and manipulating data in a database server environment.
