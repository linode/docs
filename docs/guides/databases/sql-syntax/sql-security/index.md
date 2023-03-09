---
slug: sql-security
description: 'SQL database security relies on user management, permissions, groups, and roles. This guide discusses each of these aspects of SQL database security with examples.'
keywords: ['groups', 'roles', 'permissions', 'grant permission', 'revoke permission']
tags: ['MySQL']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-20
modified_by:
  name: Linode
title: "SQL Database Security: User Management"
title_meta: "SQL Security and User Management"
authors: ["Doug Hayman for NanoHertz Solutions Inc."]
---

User management and permissions are essential to SQL database security. Typically, SQL database security schemes consist of one or more users, their authentication, and permissions. The database engine validates a user's permissions when they attempt to perform an operation against a SQL object —for example, a table, an index, a stored procedure, etc. The basic premise behind the assignment of SQL roles and permissions is to provide users of the database access to only what is necessary to perform their job. In this guide, you learn how to create and assign roles and permissions to users of relational database systems.

## Users and Groups

In order to grant access rights and permissions, a relational database management system requires user identities.
These rights and permissions can be assigned to either an individual user, or a group of users. If you have more than one user with similar access requirements and restrictions, you can define a group. Then, you add the collective set of users as members of the appropriate group. In this way, the authentication and validation process for a given SQL object is applied against the group instead of the user. This assumes that no restrictions have been established for individual users. In the case where a user and the user's group both have access restrictions on a given SQL object, the database applies the most restrictive access rights of either the user or the user's group.

## Roles

Users of relational database systems are typically assigned *roles*. Different users might need to perform different tasks on the same database. For example, one user might be in charge of data entry, another user might be the database administrator, and an end-user may only need to retrieve data from the database. Typically, users that have the same type of role in an organization require the same type of database access. Each database role can have its own data access permission levels. Once the role is created and the appropriate permissions are applied, you can add individual users to that role. All users assigned to a particular role inherit its permissions.

## Permissions

There are two different types of permissions that can be assigned to roles, users, and groups: *statement permissions* and *object permissions*. Statement permissions grant access to execute specific statements against a database. For example, a user could be granted access to create a stored procedure, but not be granted the right to create tables. Object permissions, on the other hand, grant the user the right to access a database object such as a table, a view, or to execute a stored procedure.

## Implementation of Users, Groups, Roles, and Permissions

When it comes to the management of users, groups, roles, and permissions, the concepts stated in the previous sections are quite uniform across SQL-based database management systems. What may differ are the names of commands and the syntax used by different SQL database implementations.

{{< note respectIndent=false >}}
The examples below use Microsoft SQL Server syntax. All commands should be executed from the command line. The examples also assume that all server security hardening has already been implemented.
{{< /note >}}

To demonstrate SQL security principles, this guide uses an example database that is used by a school. The school's database has tables for students and courses taken by each student. The definition of the `Student` table contains columns for the student's `SSNumber`, `Firstname`, and `Lastname`, and the definition of the `CourseTaken` table contains columns for `SSNumber`, `CourseId`, `NumericGrade`, and `YearTaken`.

The example further assumes that four employees in the school administer the school database. Their respective roles are defined as follows:

| Name | Database Role |
|:-:|:-:|
| Tom | Database Administrator |
| John | Database Data Entry |
| Mary | Database Query and Reports |
| Joan | Database Query and Reports |

In the example below, assume that Tom, the database administrator (DBA), has created the school database via the `CREATE DATABASE` command:

    CREATE DATABASE School;

Next, Tom creates database user login definitions for all four employees (including themselves) via the `CREATE USER` command:

    Use School;
    CREATE USER Tom WITH PASSWORD = 'Tompassword';
    CREATE USER John WITH PASSWORD = 'Johnpassword';
    CREATE USER Mary WITH PASSWORD = 'Marypassword';
    CREATE USER Joan WITH PASSWORD = 'Joanpassword';

    CREATE USER Tom IDENTIFIED BY 'TomPassword';

After creating user login definitions, Tom creates generic roles that will later be assigned to each employee, by using the `CREATE ROLE` command:

    USE School;
    CREATE ROLE DBAdmin;
    CREATE ROLE DataEntry;
    CREATE ROLE QueryReports;

Now that the roles exist, Tom assigns the roles to the appropriate users with the `ALTER ROLE` command as follows:

    USE School
    ALTER ROLE DBAdmin ADD MEMBER Tom;
    ALTER ROLE DataEntry ADD MEMBER John;
    ALTER ROLE QueryReports ADD MEMBER Mary;
    ALTER ROLE QueryReports ADD MEMBER Joan;

The workflow demonstrated in this section reflects the user management steps a DBA might need to take when configuring a newly   created database.

## Granting Permissions

The `GRANT` statement is used to assign permissions to a user or to a role. You can also use the `GRANT` statement to assign specific statement permissions to a user or to a role. Some of the statement permissions that can be granted are: `CREATE DATABASE`, `CREATE DEFAULT`, `CREATE PROCEDURE`, `CREATE RULE`, `CREATE TABLE`, `CREATE VIEW`, `DUMP DATABASE`, and `DUMP TRANSACTION`.

For example, to grant the `CREATE PROCEDURE` statement permission to a user or a role, use the following command:

    GRANT CREATE PROCEDURE TO <User or Role>;

Continuing along with this guide's school database example, you can grant various permissions to the database roles you created in the previous section. Tom first grants required privileges to the `DBAdmin Role` (Tom's role), via the `GRANT` command, as follows:

    USE School;
    GRANT CREATE DATABASE TO DBAdmin;
    GRANT CREATE RULE TO DBAdmin;
    GRANT CREATE TABLE TO DBAdmin;
    GRANT CREATE VIEW TO DBAdmin;
    GRANT DUMP DATABASE TO DBAdmin;
    GRANT DUMP TRANSACTION TO DBAdmin;

Now, Tom can create the two tables in the school's database as follows:

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

Tom grants necessary database entry permissions (`INSERT`, `UPDATE`, `DELETE`) on both database tables, to employee John  (`DBEntry` role), as follows:

    USE School;
    GRANT INSERT, UPDATE, DELETE ON Student TO DBEntry;
    GRANT INSERT, UPDATE, DELETE ON CourseTaken TO DBEntry;

{{< note respectIndent=false >}}
After executing the above `GRANT` commands, John is permitted to `INSERT`, `UPDATE`, and `DELETE` data in the two database tables, but is not permitted to read (`SELECT`) from it.
{{< /note >}}

Tom grants necessary database read permission (`SELECT`) on both database tables, to employees Mary and Joan, via the `QueryReports` role, as follows:

    USE School;
    GRANT SELECT ON Student TO QueryReports;
    GRANT SELECT ON CourseTaken TO QueryReports;

{{< note respectIndent=false >}}
After executing the above `GRANT` commands, Mary and Joan can only read the database tables (via the `SELECT` statement), but cannot manipulate the data (via the `INSERT`, `UPDATE`, or `DELETE` statements).
{{< /note >}}

## Revoking Permissions

Revoking permissions is the converse of granting permissions on database objects. You can revoke permissions from a table, view, table-valued function, stored procedure, and many other types of database objects.

Continuing with the school database example, assume that John switches his role at the school from performing data entry to querying reports. Due to this change, John should no longer have the ability to manipulate data (`INSERT`, `UPDATE`, `DELETE`) in the school tables. John should also be granted the ability to read data from the table (via `SELECT`). Tom, the database administrator, needs to execute the following commands to revoke and grant the appropriate permissions to John:

    USE School;
    REVOKE INSERT, UPDATE, DELETE ON Students FROM John;
    REVOKE INSERT, UPDATE, DELETE ON CourseTaken FROM John;
    GRANT SELECT ON Student TO John;
    GRANT SELECT ON CourseTaken TO John;

Alternatively, a simpler approach is to remove John from the `DBEntry` role and add him to the `QueryReports` role:

    USE School;
    ALTER ROLE DBEntry DROP MEMBER John;
    ALTER ROLE QueryReports ADD MEMBER John;

## Conclusion

User management, permissions, and roles are essential to SQL database security. Create a new group and add users to that group if they require the same database access and permissions. To control access by the tasks users should be allowed to perform against a database, use database roles.

In SQL databases, every action must pass through a validity check that determines if the database action can be completed by a particular user. The appropriate permissions are required to access SQL database objects and execute statements. The integrity of a SQL database relies on secure and well-designed user management.

Now that you are familiar with SQL user management, you can learn about some different aspects of the SQL language, like [joins](/docs/guides/sql-joins/), [data types](/docs/guides/sql-data-types/), and [grouping and totaling](/docs/guides/sql-grouping-and-totaling/).

