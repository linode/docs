---
slug: primer-on-sql-security
author:
  name: Linode Community
  email: docs@linode.com
description: 'SQL database provides robust security to your database and services. Learn about the SQL database security, its roles and permissions for users.'
keywords: ['groups', 'roles', 'permissions', 'grant permission', 'revoke permission']
tags: ['MySQL']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-15
modified_by:
  name: Linode
title: "A Primer on SQL Security"
h1_title: "Introduction to SQL Database Security"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/
---

When working with SQL and databases, security is of the utmost importance. Conceptually, SQL database security schemes consist of one or more users, their authentication, and permissions. It also validates the permissions for users attempting to perform some operation against an SQL object (for example, a table, an index, a stored procedure, etc). The basic premise behind the assignment of SQL roles and permissions is to provide users of the database only what is necessary to perform their job. In this article, you learn about SQL database security; namely, the use of roles and permissions for users of relational database systems.

## Users and Groups

In a relational database environment, some identity is required to grant access rights and permissions. This identity, to which these rights and permissions are assigned, can either be an individual user, or a group of users. If you have more than one user with similar access requirements and restrictions, you can define a group. Groups are defined by placing the collective set of users as members into the user-defined group (same role). In this instance, the authentication and validation process for a given SQL object is applied against the group instead of the user. This assumes that no restrictions have been established for individual users. In the case where a user and a group (containing that user) both have access restrictions on a given SQL object, all restrictions are considered by the database, and the most restrictive access rights are applied.

## Roles

Users of the relational database systems are typically assigned *Roles*. For example, a user could be a data entry person, a database administrator, or an end-user who retrieves data. Typically, people that have the same type of role require similar types of database access. As per the data access requirements associated with the role, you can establish a role in a database, and permit it. Once established, you can add individual users to that role, and all users inherit permissions assigned to that role.

## Permissions

Permissions assigned to Roles, Users, and Groups come in two flavors: *Statement Permissions* and *Object Permissions*. Statement permissions grant access to execute specific statements against a database. For example, a user could be granted access to create a stored procedure, but not be granted the right to create tables. Object permissions, on the other hand, grant the user the right to access a database object such as a table, a view, or to execute a stored procedure.

## Implementation of Users, Groups, Roles, and Permissions

The names of commands and syntax may differ slightly across SQL database implementations. But, when it comes to the management of users, groups, roles, and permissions, the concepts stated above are quite uniform. The examples below assume that all security is established within the database itself via command-line commands, and is devoid of any operating system-dependent security. To demonstrate the SQL security principles, this guide uses an example database for a school. The school database has tables, for students and courses taken by each student. The definition of the `Student` table contains columns for the student's `SSNumber`, `Firstname`, and `Lastname`, and the definition of the `CourseTaken` table contains columns for `SSNumber`, `CourseId`, `NumericGrade`, and `YearTaken`.

The example further assumes that four employees in the school administer the school database. Their respective roles are hypothetically defined as follows:

| Name | Database Role |
|:-:|:-:|
| Tom | Database Administrator |
| John | Database Data Entry Person |
| Mary | Database Query and Reports Person |
| Joan | Database Query and Reports Person |

In the example below, assume that Tom, the database administrator, has created the School database via the `CREATE DATABASE` command:

    CREATE DATABASE School;

Next, Tom creates database user login definitions for all four employees (including himself) via the `CREATE USER` command (this is the SQL Server implementation):

    Use School;
    CREATE USER Tom WITH PASSWORD = 'Tompassword';
    CREATE USER John WITH PASSWORD = 'Johnpassword';
    CREATE USER Mary WITH PASSWORD = 'Marypassword';
    CREATE USER Joan WITH PASSWORD = 'Joanpassword';

{{< note >}}
Unless mentioned otherwise, all the database commands demonstrated in this guide work well on both **MySQL** and **PostgreSQL**.
{{< /note >}}

    CREATE USER Tom IDENTIFIED BY 'TomPassword';

After creating user login definitions, Tom creates generic roles that is assigned appropriately to employees, by using the `CREATE ROLE` command:

    USE School;
    CREATE ROLE DBAdmin;
    CREATE ROLE DataEntry;
    CREATE ROLE QueryReports;

Following this, Tom assigns various roles to users using the `ALTER ROLE` command as follows:

    USE School
    ALTER ROLE DBAdmin ADD MEMBER Tom;
    ALTER ROLE DataEntry ADD MEMBER John;
    ALTER ROLE QueryReports ADD MEMBER Mary;
    ALTER ROLE QueryReports ADD MEMBER Joan;

{{< note >}}
In MySQL, the above “Alter Role” commands are implemented with a different set of commands but are functionally equivalent.
{{< /note >}}

    USE School;
    GRANT 'Tom' TO 'DBAdmin;
    GRANT 'John' TO 'DataEntry';
    GRANT 'Mary', 'Joan' TO 'QueryReports';

## Granting Permissions

The `GRANT` statement is used to assign permission to a user or to a role. Statement permissions can also be assigned using `GRANT` to permit a user or role to execute the statements. Some of the statements that can be executed are: Create Database, Create Default, Create Procedure, Create Rule, Create Table, Create View, Dump Database, and Dump Transaction.

An example of this is as follows:

    GRANT CREATE PROCEDURE TO <User or Role>;

Continuing along with our example, you can grant various permissions to defined database roles. Tom first grants required privileges to the DBAdmin Role (his Role), via the `GRANT` command, as follows:

    USE School;
    GRANT CREATE DATABASE TO DBAdmin;
    GRANT CREATE RULE TO DBAdmin;
    GRANT CREATE TABLE TO DBAdmin;
    GRANT CREATE VIEW TO DBAdmin;
    GRANT DUMP DATABASE TO DBAdmin;
    GRANT DUMP TRANSACTION TO DBAdmin;

Now Tom can create the two tables in the School database as follows:

    USE School;
    CREATE TABLE Student (
      SSNumber CHAR(9) NOT NULL,
      LastName VARCHAR(30) NOT NULL,
      FirstName VARCHAR(20) NOT NULL
    );

    CREATE TABLE CourseTaken (
      SSNumber CHAR(9) NOT NULL,
      CourseId CHAR(6) NOT NULL,
      NumericGrade TINYINT NOT NULL,
      YearTaken SMALLINT NOT NULL
    );

Tom grants necessary database entry permissions (Insert, Update, Delete) on both database tables, to employee John (Role DBEntry), as follows:

    USE School;
    GRANT INSERT, UPDATE, DELETE ON Student TO DBEntry;
    GRANT INSERT, UPDATE, DELETE ON CourseTaken TO DBEntry;

{{< note >}}
By the above `GRANT` commands, John is permitted to Insert, Update, and Delete data in the two database tables, but is not permitted to read (Select) from it.
{{< /note >}}

Tom grants necessary database read permission (Select) on both database tables, to employees Mary and Joan, via the Group QueryReports Role, as follows:

    USE School;
    GRANT SELECT ON Student TO QueryReports;
    GRANT SELECT ON CourseTaken TO QueryReports;

{{< note >}}
By the above Grant commands, Mary and Joan can only read the database tables (via the Select statement), but cannot manipulate the data (via the Insert, Update, or Delete statements).
{{< /note >}}

{{< note >}}
We have used the most generic SQL statement syntax above that meets the requirements of most/all SQL database implementations. However, the above syntax may vary slightly across some database implementations. Additionally, there are many additional switches/parameters associated with each of the above commands, which is beyond the scope of this introductory primer.
{{< /note >}}

## Revoking Permissions

Revoking permissions is the converse of Granting permissions on database objects. Similar to Grant permissions, Revoking permissions can be applied to a table, view, table-valued function, stored procedure, and many other types of database objects. Continuing with the above example, assume that John switches his role at the School from being a data entry person to a query and reports person.

As such, we no longer want John to have the ability to manipulate data (insert, update, delete) in the School tables, and only want to grant him the ability to read data from the table (via Select). Tom, the database administrator, needs to execute the following commands to
accomplish this:

    USE School;
    REVOKE INSERT, UPDATE, DELETE ON Students FROM John;
    REVOKE INSERT, UPDATE, DELETE ON CourseTaken FROM John;
    GRANT SELECT ON Student TO John;
    GRANT SELECT ON CourseTaken TO John;

Alternatively, a cleaner approach could have been similarly accomplished, by removing John from the DBEntry Role, and adding him to the QueryReports Role as follows (using the SQL Server implementation noted above):

    USE School;
    ALTER ROLE DBEntry DROP MEMBER John;
    ALTER ROLE QueryReports ADD MEMBER John;

## Conclusion

Through the examples provided, this article hopes to have provided a fundamental introduction to security in SQL databases. In SQL databases, every action must pass through a validity check to determine if the defined security allows for a database action to be completed. Permissions are required to access SQL database objects and execute statements. The design required to establish User, Roles,
Groups and Permissions for a database are of paramount importance and highly contribute to the integrity of the database.
