---
slug: nodejs-sqlite
author:
  name: James Turner
  email: docs@linode.com
description: 'With npm and sqlite3, you can make your NodeJS applications shine. This guide shows what&#39;s involved.'
og_description: 'With npm and sqlite3, you can make your NodeJS applications shine. This guide shows what&#39;s involved.'
keywords: ['nodejs sqlite']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-12
modified_by:
  name: Linode
title: "Getting started with NodeJS and SQLite"
h1_title: "Getting started with NodeJS and SQLite"
contributor:
  name: James Turner
  link:
---

# Getting started with NodeJS and SQLite

SQLite makes a nice stand-alone database for applications that don&#39;t require a full client-server environment. Using it with NodeJS is easy, and can provide all the benefits of a SQL database persistence layer without needing a DBA or DevOps team.

You can read [the full documentation of the sqlite3 API](https://github.com/mapbox/node-sqlite3/wiki/API) but this example demonstrates the general process.

## Installing SQLite support in NodeJS

This guide assumes a working copy of NodeJS and `npm` installed on the development environment.

The first thing to do is to install SQLite on the local NodeJS environment. Obviously, in a production environment, the same thing needs to be done anywhere it needed to be run.

To install SQLite, use the Node Package Manager (`npm`). The relevant command is:

```
npm install sqlite3
```

Doing this downloads and installs SQLite support into NodeJS.

## Opening or creating a database

SQLite can either operate on an existing database, or create one the first time the application runs. This example uses a simple database application to track superheros from the [Marvel Cinematic Universe](https://www.marvel.com/movies).

The first step is to open/create the database.

```
var sqlite3 = require('sqlite3');
var db;
new sqlite3.Database('mcu.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
          console.log("Getting error " + err);
          exit(1);
        }
        runQueries(db);
});
```
The first line is fairly straightforward, and merely loads the SQLite support into NodeJS.

The second line attempts to open or create a database at the given path (in this case, a file called `mcu.db` in the current directory). The database call can take one, two, or three arguments. If a second argument is given and is a list of flags, SQLite uses these as database flags, from the set of `sqlite3.OPEN_READONLY`, `sqlite3.OPEN_READWRITE`, and `sqlite3.OPEN_CREATE`. The default is `read/write` and `open/create`. If you specify flags explicitly, you can leave out `OPEN_CREATE` to fail if the database doesn’t already exist.

The third argument (or second argument if flags aren&#39;t supplied) is a callback to execute once the database is opened (or fails). This is a more modern way of writing functional code, so it is used in this example.

If the database exists, the code goes right on to run the queries. If it doesn&#39;t, however, the database must be created and populated.

The first step is to create it:

```
function createDatabase() {
    var newdb = new sqlite3.Database('mcu.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}
```

This is essentially the same code that was run before to open the database. However, this time the flags are missing; that means that the database is created if it doesn&#39;t exist yet. If we get an error again, something more serious is going on, so the code exits. If it succeeds, however, the code goes on to create the tables.

## Creating tables and inserting data

To create the tables and populate them, the code takes advantage of the `sqlite3` exec method, which lets an arbitrary number of SQL commands be run with one string.

```
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
```

Just like all the other commands used, the `exec` method uses a callback to handle signaling completion. So once the creates and inserts are done, the code can move on to running the queries, just as if the database already existed.

## Querying the database

You can use one of several methods to fetch rows from the database. The data can be fetched row by row, looped over, or returned in a single array. In this case, the later method is used.

```
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
```

The `sqlite3.all` method returns an array of rows on success, or an error on failure. It is good practice to parameterize the query to avoid SQL injection hacks. All the `sqlite3` query methods allow this to be done by providing a list of substation values as in this case with an array of values, or an object with properties that can be substituted using `$properyname` syntax.

When this code is run, the following results are generated:

```
C:\Program Files\nodejs\node.exe .\sample.js
Spiderman	N	Y
Tony Stark	N	N
```

## One final caution

The functional nature of the NodeJS sqlite3 support requires developers to think asynchronously. Make sure that code doesn&#39;t plow ahead before callbacks are complete.
