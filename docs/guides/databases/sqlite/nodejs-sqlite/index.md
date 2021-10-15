---
slug: getting-started-with-nodejs-sqlite
author:
  name: James Turner
  email: docs@linode.com
description: 'With npm and sqlite3, you can make your NodeJS applications shine. This guide explains how you can install NodeJS SQLite, create a SQLite database, create tables, and insert data.'
og_description: 'With npm and sqlite3, you can make your NodeJS applications shine. This guide explains how you can install NodeJS SQLite, create a SQLite database, create tables, and insert data.'
keywords: ['nodejs sqlite']
tags: ['nodejs', 'sqlite', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-21
image: NodeSQLite.jpg
modified_by:
  name: Linode
title: "A Beginner's Guide to NodeJS and SQLite"
h1_title: "Getting Started with NodeJS SQLite"
contributor:
  name: James Turner
external_resources:
- '[SQLite3 API](https://github.com/mapbox/node-sqlite3/wiki/API)'
- '[Marvel Cinematic Universe](https://www.marvel.com/movies)'

---

## Getting Started with Node.js and SQLite

SQLite makes a nice stand-alone database for applications that do not require a full client-server environment. Using SQLite with Node.js is easy, and can provide all the benefits of a SQL database persistence layer without needing a DBA or DevOps team.

For a demonstration of the general process, you can read the documentation of the [SQLite3 API](https://github.com/mapbox/node-sqlite3/wiki/API).

**Prerequisite:**
You must have installed Node.js and Node Package Manager (`npm`) on your machine. If you have not, install using the below commands:

    sudo apt install npm
    sudo apt install nodejs

## Install SQLite

Install SQLite support into Node.js using `npm` on your local development environment.

    sudo npm install sqlite3

## Create a Database

This example uses a simple database application to track superheroes from the [Marvel Cinematic Universe](https://www.marvel.com/movies).

1. First, create a file called `sample.js` and import the `sqlite3` module into Node.js:

    {{< file "sample.js" js >}}
var sqlite3 = require('sqlite3');
{{</ file >}}

1. The following line creates a database, `mcu.db`, in the current working directory. The `sqlite3.Database()` call can take one, two, or three arguments. The second argument is SQLite database flags, from the set of `sqlite3.OPEN_READONLY`, `sqlite3.OPEN_READWRITE`, and `sqlite3.OPEN_CREATE`.

    {{< file "sample.js" js >}}
...

new sqlite3.Database('./mcu.db', sqlite3.OPEN_READWRITE, (err) ...);
{{</ file >}}
    {{< note >}}
The following are the different SQLite flag combinations:

   - `OPEN_READONLY`: The database is opened in read-only mode. If the database does not already exist, an error is returned.

   - `OPEN_READWRITE`: The database is opened for reading and writing where the database must already exist, otherwise an error is returned.

   - `OPEN_CREATE`: The database is opened for reading and writing, and if the database does not exist, it is created.

   The default SQLite database flag is `sqlite3.OPEN_READWRITE` and `sqlite3.OPEN_CREATE`.
{{< /note >}}

1. The third argument in the `sqlite3.Database()` is a callback function that is called when the database is opened successfully or when an error occurred. This callback function has the error object, `err` as the first parameter. If an error occurred, the error object is not null, otherwise, it is null.
        {{< file "sample.js" js >}}

var sqlite3 = require('sqlite3');
var db;
new sqlite3.Database('./mcu.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
    runQueries(db);
});
{{< /file >}}

1. If the database exists, the `runQueries()` is executed. Now you need to create the `createDatabase()` function as shown below:
        {{< file "sample.js" >}}

function createDatabase() {
    var newdb = new sqlite3.Database('mcu.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}
{{< /file >}}

The above code is similar to that of creating the database. However, this time the flags are missing; that means that the database is created if it does not exist yet. If it succeeds, the `createTables()` is executed to create the tables. If we get an error again, something more serious is going on, so the code exits.

## Create Tables and Insert Data

The following code illustrates SQLite's `exec()` method to create the tables and populate them. The `exec()` method runs all the queries in the specified string. Once the tables are created and insertions are made, the `runQueries()` method is executed. The following code creates a table for popular Marvel superheroes and whether they are X-Men, or if they were snapped by Thanos, as well as creates a table for their superpowers.
        {{< file "sample.js" >}}
function createTables(newdb) {
    newdb.exec(`
    create table hero (
        hero_id int primary key not null,
        hero_name text not null,
        is_xman text not null,
        was_snapped text not null
    );
    insert into hero (hero_id, hero_name, is_xman, was_snapped)
        values (1, 'Spiderman', 'N', 'Y'),
               (2, 'Tony Stark', 'N', 'N'),
               (3, 'Jean Grey', 'Y', 'N');

    create table hero_power (
        hero_id int not null,
        hero_power text not null
    );

    insert into hero_power (hero_id, hero_power)
        values (1, 'Web Slinging'),
               (1, 'Super Strength'),
               (1, 'Total Nerd'),
               (2, 'Total Nerd'),
               (3, 'Telepathic Manipulation'),
               (3, 'Astral Projection');
        `, ()  => {
            runQueries(newdb);
    });
}
{{< /file >}}

## Query the Database

You can use one of several methods to fetch rows from the database. The data can be fetched row by row, looped over, or returned in a single array. In this case, the latter method is used. The following code returns characters whose superpowers are being "Total Nerds," and whether they are X-Men or were snapped by Thanos.
    {{< file "sample.js" >}}
function runQueries(db) {
    db.all(`
    select hero_name, is_xman, was_snapped from hero h
    inner join hero_power hp on h.hero_id = hp.hero_id
    where hero_power = ?`, "Total Nerd", (err, rows) => {
        rows.forEach(row => {
            console.log(row.hero_name + "\t" +
            row.is_xman + "\t" +
            row.was_snapped);
        });
    });
}
{{< /file >}}

The `all()` method of the sqlite3 returns an array of rows on success, or an error on failure.

{{< note >}}
It is good practice to parameterize the query by providing a list of substation values or an object with properties that can be substituted using `$properyname` syntax. This avoids SQL injection hacks.
{{< /note >}}

Below is the complete `sample.js` file:
    {{< file "sample.js" >}}
var sqlite3 = require('sqlite3');
let db= new sqlite3.Database('./mcu.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
    runQueries(db);
});

function createDatabase() {
    var newdb = new sqlite3.Database('mcu.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

function createTables(newdb) {
    newdb.exec(`
    create table hero (
        hero_id int primary key not null,
        hero_name text not null,
        is_xman text not null,
        was_snapped text not null
    );
    insert into hero (hero_id, hero_name, is_xman, was_snapped)
        values (1, 'Spiderman', 'N', 'Y'),
               (2, 'Tony Stark', 'N', 'N'),
               (3, 'Jean Grey', 'Y', 'N');

    create table hero_power (
        hero_id int not null,
        hero_power text not null
    );

    insert into hero_power (hero_id, hero_power)
        values (1, 'Web Slinging'),
               (1, 'Super Strength'),
               (1, 'Total Nerd'),
               (2, 'Total Nerd'),
               (3, 'Telepathic Manipulation'),
               (3, 'Astral Projection');
        `, ()  => {
            runQueries(newdb);
    });
}

function runQueries(db) {
    db.all(`select hero_name, is_xman, was_snapped from hero h
   inner join hero_power hp on h.hero_id = hp.hero_id
   where hero_power = ?`, "Total Nerd", (err, rows) => {
        rows.forEach(row => {
            console.log(row.hero_name + "\t" +row.is_xman + "\t" +row.was_snapped);
        });
    });
}
{{< /file >}}

When you execute `sample.js` file, the following result is generated:
    {{< output >}}
username@localhost:~$ node sample.js
Spiderman	N	Y
Tony Stark	N	N
{{< /output >}}
