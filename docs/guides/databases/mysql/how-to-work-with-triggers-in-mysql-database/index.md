---
slug: how-to-work-with-triggers-in-mysql-database
description: 'In this guide, we will show you how to create triggers, pre-defined SQL commands which automatically run under certain conditions, in your MySQL database. '
keywords: ['mysql','database','triggers']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-02-21
modified_by:
  name: Linode
title: "Working with Triggers in a MySQL Database"
title_meta: "Working with Triggers in a MySQL Database - A Tutorial"
image: L_TriggersMySQL_db.png
external_resources:
- '[MySQL Trigger Syntax and Examples](https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html)'
tags: ["database","mysql"]
aliases: ['/databases/mysql/how-to-work-with-triggers-in-mysql-database/']
authors: ["Francis Ndungu"]
---

A *trigger* is a pre-defined SQL command that is automatically executed when specific actions occur in the database. It can be fired either before or after an `INSERT`, `UPDATE`, or `DELETE` event.

Triggers are mainly used to maintain software logic in the MySQL server, and they have several benefits:

-   Triggers help keep global operations centralized in one location.

-   They reduce client-side code and help minimize the round-trips made to the database server.

-   They help make applications more scalable across different platforms.

Some common use-cases of triggers include audit logging, pre-computing database values (e.g. cumulative sums), and enforcing complex data integrity and validation rules.

In this guide, you will learn:

- How the [syntax for a trigger](#trigger-syntax) is structured.

- How to create triggers that are executed [before other database events occur](#creating-before-event-triggers).

- How to create triggers that are executed [after other database events occur](#creating-after-event-triggers).

- [How to delete triggers](#deleting-a-trigger).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  A MySQL server and client installed on the Linode server. Installation guides for MySQL are available for different distributions in our [MySQL section](/docs/databases/mysql/).

## Prepare the Database

To better understand how triggers work, we will create a sample database and add sample data into it. Later, we will create different triggers on the database as a proof of concept exercise.

1.  First, log in to your MySQL Server:

        mysql -u root -p

    Then, enter the root password of your MySQL server and hit **Enter** to proceed.

1.  Next, you will see a MySQL prompt similar to the one shown below:

    {{< output >}}
mysql >
{{< /output >}}

1.  Create a `test_database` by running the command below:

        CREATE DATABASE test_database;

    Output:

    {{< output >}}
Query OK, 1 row affected (0.02 sec)
{{< /output >}}

1.  Switch to the database:

        USE test_database;

    Output:

    {{< output >}}
Database changed
{{< /output >}}

1.  Once the database is selected, we will create some tables that we will use for demonstrating triggers. We will begin by creating the `stores` table. This table will hold information about two sample stores/offices where our hypothetical business operates from:

        CREATE TABLE stores
        (
        store_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        store_name VARCHAR(50)
        ) ENGINE=InnoDB;

    Output:

    {{< output >}}
Query OK, 0 rows affected (0.07 sec)
{{< /output >}}

1.  Next, add two records to the `stores` table by running the commands below:

        INSERT INTO stores (store_name) VALUES ('Philadelphia');
        INSERT INTO stores (store_name) VALUES ('Galloway');

    After each command, you will get the below output:

    {{< output >}}
Query OK, 1 row affected (0.08 sec)
...
{{< /output >}}

1.  Confirm the records by running the command below:

        SELECT * FROM stores;

    Output:

    {{< output >}}
+----------+--------------+
| store_id | store_name   |
+----------+--------------+
|        1 | Philadelphia |
|        2 | Galloway     |
+----------+--------------+
2 rows in set (0.01 sec)
{{< /output >}}

1.  Next, create the `products` table. The table will hold different products being offered in the store:

        CREATE TABLE products
        (
        product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        product_name VARCHAR(40),
        cost_price DOUBLE,
        retail_price DOUBLE,
        availability VARCHAR(5)
        ) ENGINE=InnoDB;

    Output:

    {{< output >}}
Query OK, 0 rows affected (0.13 sec)
{{< /output >}}

    - Each product will be uniquely identified by a `product_id`.

    - A `product_name` field will specify the names of the items.

    - The `cost_price` and `retail_price` fields will determine the buying and selling price respectively.

    - An `availability` column will define the product availability in the different stores. If the product is only available in our local store (Philadelphia), we will denote it with a `LOCAL` value. Else, we will use the value of `ALL` to signify a product that is available in both stores (Philadelphia and Galloway).

1.  Add sample data to the `products` table:

        INSERT INTO products (product_name, cost_price, retail_price, availability) VALUES ('WIRELESS MOUSE', '18.23', '30.25','ALL');

        INSERT INTO products (product_name, cost_price, retail_price, availability) VALUES ('8 MP CAMERA', '60.40', '85.40','ALL');

        INSERT INTO products (product_name, cost_price, retail_price, availability) VALUES ('SMART WATCH', '189.60', '225.30','LOCAL');

    You will get the output shown below after each insert command:

    {{< output >}}
Query OK, 1 row affected (0.02 sec)
...
{{< /output >}}

1.  Confirm if the products were inserted by running the command below:

        SELECT * FROM products;

    Output:

    {{< output >}}
+------------+----------------+------------+--------------+--------------+
| product_id | product_name   | cost_price | retail_price | availability |
+------------+----------------+------------+--------------+--------------+
|          1 | WIRELESS MOUSE |      18.23 |        30.25 | ALL          |
|          2 | 8 MP CAMERA    |       60.4 |         85.4 | ALL          |
|          3 | SMART WATCH    |      189.6 |        225.3 | LOCAL        |
+------------+----------------+------------+--------------+--------------+
3 rows in set (0.00 sec)
{{< /output >}}

1.  Next, the products' availability will be mapped to another table named `products_to_stores`. This table will just reference the `product_id` from the `products` table and the `store_id` from the `stores` table where the item is available.

    Create the `products_to_stores` table by running the code below:

        CREATE TABLE products_to_stores
        (
        ref_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        product_id BIGINT,
        store_id BIGINT
        ) ENGINE=InnoDB;

    Output:

    {{< output >}}
Query OK, 0 rows affected (0.14 sec)
{{< /output >}}

1.  Next, we will create an `archived_products` table. The table will hold information about deleted products for future reference:

        CREATE TABLE archived_products
        (
        product_id BIGINT PRIMARY KEY ,
        product_name VARCHAR(40),
        cost_price DOUBLE,
        retail_price DOUBLE,
        availability VARCHAR(5)
        ) ENGINE=InnoDB;

    Output:

    {{< output >}}
Query OK, 0 rows affected (0.14 sec)
{{< /output >}}

1.  Lastly, we will create a `products_price_history` table for tracking the different prices of each product over time:


        CREATE TABLE products_price_history
        (
        product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        price_date DATETIME,
        retail_price DOUBLE
        ) ENGINE=InnoDB;

    Output:

    {{< output >}}
Query OK, 0 rows affected (0.14 sec)
{{< /output >}}

Once our database structure is in place, we can now go ahead and learn the basic syntax of a MySQL database trigger in order to create our first sample.

## Trigger Syntax

As indicated earlier, triggers are fired automatically either before or after an SQL command is run in the database. The basic syntax for creating triggers is as follows:

    CREATE TRIGGER TRIGGER_NAME

    TRIGGER_TIME TRIGGER_EVENT

    ON TABLE_NAME FOR EACH ROW

    [TRIGGER BODY];

- `TRIGGER_NAME`: Each trigger must have a unique name and you should define it here.

- `TRIGGER_TIME`: Either `BEFORE` or `AFTER`.

- `TRIGGER_EVENT`: You need to specify the database event that will invoke the trigger: `INSERT`, `UPDATE`, or `DELETE`.

- `TRIGGER BODY`: This specifies the actual SQL command (or commands) that you want to be run by your trigger.

If a trigger body has more than one SQL statement, you must enclose it within a `BEGIN...END` block. As well, you will need to temporarily change the `DELIMITER` that signals the end of the trigger body to a new value. This ensures that the statements within the body are not prematurely interpreted by your MySQL client. An example of this looks like the following:

    DELIMITER &&

    CREATE TRIGGER TRIGGER_NAME

    TRIGGER_TIME TRIGGER_EVENT

    ON TABLE_NAME FOR EACH ROW

    BEGIN

    [TRIGGER BODY]

    END &&

    DELIMITER ;

{{< note >}}
The last line of this example changes the `DELIMITER` back to the default `;` value.
{{< /note >}}

## Creating Before Event Triggers

In this section, we will look into the different types of triggers that are fired before a database operation. These include the `BEFORE INSERT`, `BEFORE UPDATE`, and `BEFORE DELETE` triggers.

### Creating a Before Insert Trigger

We will create our first `BEFORE INSERT` trigger. The trigger will make sure that the retail price of a product is greater than the cost price whenever items are inserted into the `products` table. Otherwise, the database user will get an error.

1.  While still on the `mysql >` prompt, enter the command below:

        DELIMITER $$

        CREATE TRIGGER price_validator

        BEFORE INSERT

        ON products FOR EACH ROW

        IF NEW.cost_price>=NEW.retail_price

        THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Retail price must be greater than cost price.';

        END IF $$

        DELIMITER ;

    -   The above code defines the trigger name (`price_validator`), time (`BEFORE`), event (`INSERT`), and the table (`products`) to be affected.

    -   Our trigger uses the `NEW` keyword to check the `cost_price` and `retail_price` before a record is inserted to the `products` table, using the `IF...THEN...END IF` statement.

    -   If the `cost_price` is greater or equal to the `retail price`, our triggers tells MySQL to throw a custom exception instructing the user to rectify the error.

1.  To test the trigger above, try inserting a product that violates the validation rule:

        INSERT INTO products (product_name, cost_price, retail_price, availability) VALUES ('GAMING MOUSE PAD', '145.00', '144.00','LOCAL');

    Output:

    {{< output >}}
ERROR 1644 (45000): Retail price must be greater than cost price.
{{< /output >}}

    The above insert commands should fail because the `retail_price` (144.00) is not greater than the `cost_price` (145.00).

### Creating a Before Update Trigger

Next, we will create a `BEFORE UPDATE` trigger. This trigger will prevent database users from editing a product name once a product has been inserted into the database. If you have multiple users working in the database, a `BEFORE UPDATE` trigger may be used to make values read-only, and this can prevent malicious or careless users from modifying records unnecessarily.

1.  Create a new `product_name_validator` trigger with the command below:

        DELIMITER $$

        CREATE TRIGGER product_name_validator

        BEFORE UPDATE

        ON products FOR EACH ROW

        IF NEW.product_name<>OLD.product_name

        THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product name is read-only and it can not be changed.';

        END IF $$

        DELIMITER ;

    This trigger compares the values of the new `product_name` (`NEW.product_name`) and the old name already in the database (`OLD.product_name`). If there is a mismatch, an exception is thrown.

1.  To invoke the `product_name_validator` trigger, we can attempt to update the name of the product with the ID `1`:

        UPDATE products SET product_name='WIRELESS BLUETOOTH MOUSE' WHERE product_id='1';

    Output:

    {{< output >}}
ERROR 1644 (45000): Product name is read-only and it can not be changed.
{{< /output >}}

### Defining a Before Delete Trigger

In this section, you will see how you can define a `BEFORE DELETE` trigger to prevent users from deleting specific records from a table.

1.  To create the `prevent_delete` trigger, run the command below:

        DELIMITER $$

        CREATE TRIGGER prevent_delete

        BEFORE DELETE

        ON products FOR EACH ROW

        IF OLD.availability='ALL'

        THEN

        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The product can not be deleted because it is available in ALL stores.';

        END IF $$

        DELIMITER ;

    This trigger will prevent products marked with a value of `ALL` in the availability column from being deleted.

1.  Next, try to delete the first product from the products table and see if the trigger will be invoked:

        DELETE FROM products WHERE product_id='1';

    Output:

    {{< output >}}
ERROR 1644 (45000): The product can not be deleted because it is available in ALL stores.
{{< /output >}}

We have looked at the different triggers that are invoked before a database operation. Next, we will look into the other types of triggers that are fired after database events.

## Creating After Event Triggers

In a production environment, you may want some triggers to be automatically executed after a database event occurs (for example, inserting records into different tables). The examples below demonstrate how these kinds of triggers can be used in our sample database.

### Creating an After Insert Trigger

This example creates a trigger named `product_availability` that inserts mapping records into the `products_to_stores` table. This trigger is used to enforce business logic; in particular, it helps define the product availability for the different stores.

1.  Run the code below to create the `product_availability` trigger. Since we have multiple lines of code in the trigger body, we will use a `BEGIN...END` block:

        DELIMITER $$

        CREATE TRIGGER product_availability

        AFTER INSERT

        ON products FOR EACH ROW

        BEGIN

        IF NEW.availability='LOCAL' then

        INSERT INTO products_to_stores (product_id, store_id) VALUES (NEW.product_id, '1');

        ELSE

        INSERT INTO products_to_stores (product_id, store_id) VALUES (NEW.product_id, '1');

        INSERT INTO products_to_stores (product_id, store_id) VALUES (NEW.product_id, '2');

        END IF;

        END $$

        DELIMITER ;

    -   When an item is being inserted into the `products` table, the trigger will check the `availability` field.

    -   If it is marked with the `LOCAL` value, the product will be made available in one store only.

    -   Any other value will instruct the trigger to make the product available to the two stores that we created earlier.

1.  To see the `product_availability` trigger in action, insert the two records to the products table:

        INSERT INTO products (product_name, cost_price, retail_price, availability) VALUES ('BLUETOOTH KEYBOARD', '17.60', '23.30','LOCAL');
        INSERT INTO products (product_name, cost_price, retail_price, availability) VALUES ('DVB-T2 RECEIVE', '49.80', '53.40','ALL');

1.  Then, query the `products_to_stores` table:

        SELECT * FROM products_to_stores;

    You should see an output similar to the one shown below:

    {{< output >}}
+--------+------------+----------+
| ref_id | product_id | store_id |
+--------+------------+----------+
|      1 |          4 |        1 |
|      2 |          5 |        1 |
|      3 |          5 |        2 |
+--------+------------+----------+
3 rows in set (0.00 sec)
{{< /output >}}

### Defining an After Update Trigger

A trigger can also be fired after an `UPDATE` event. We will see how we can leverage this type of trigger to keep track of price changes in our store over time.

1.  Create a `product_history_updater` trigger by running the command below:

        CREATE TRIGGER product_history_updater

        AFTER UPDATE

        ON products FOR EACH ROW

        INSERT INTO products_price_history (product_id, price_date, retail_price) VALUES (OLD.product_id, NOW(), NEW.retail_price);

    This trigger records changes to a product's `retail_price` in the `products_price_history` table.

    {{< note respectIndent=false >}}
Unlike previous examples, this trigger only has one statement in the trigger's body, so we do not need to change the `DELIMITER`.
{{< /note >}}

1.  Then, try updating the price of the first product by running the command below:

        UPDATE products SET retail_price='36.75' WHERE product_id='1';

1.  Next, query the `products_price_history` table to see if the price change was logged:

        SELECT * FROM products_price_history;

    If the trigger worked as expected, you should get the below output:

    {{< output >}}
+------------+---------------------+--------------+
| product_id | price_date          | retail_price |
+------------+---------------------+--------------+
|          1 | 2020-01-28 11:46:21 |        36.75 |
+------------+---------------------+--------------+
1 row in set (0.00 sec)
{{< /output >}}

### Creating an After Delete Trigger

In some cases, you might want to log delete operations after a specific action has occurred in the database. You can achieve this by using the `AFTER DELETE` trigger.

1.  Create a new the `product_archiver` trigger with the command below:

        CREATE TRIGGER product_archiver

        AFTER DELETE

        ON products FOR EACH ROW

        INSERT INTO archived_products (product_id, product_name, cost_price, retail_price, availability) VALUES (OLD.product_id, OLD.product_name, OLD.cost_price, OLD.retail_price, OLD.availability);

    This trigger archives deleted products in a separate table named `archived_products`. When an item is deleted from the main `products` table, our trigger will automatically log it to the `archived_products` table for future reference.

1.  Next, delete a product from the `products` table and see if the trigger will be invoked:

        DELETE FROM products WHERE product_id='3';

1.  Now, if you check the `archived_products` table, you should see one record:

        SELECT * FROM archived_products;

    Output:

    {{< output >}}
+------------+--------------+------------+--------------+--------------+
| product_id | product_name | cost_price | retail_price | availability |
+------------+--------------+------------+--------------+--------------+
|          3 | SMART WATCH  |      189.6 |        225.3 | LOCAL        |
+------------+--------------+------------+--------------+--------------+
1 row in set (0.00 sec)
{{< /output >}}

## Deleting a Trigger

You have seen the different types of triggers and how they can be used in a production environment. Sometimes, you may want to remove a trigger from the database.

You can delete a trigger if you don't want to use it anymore using the syntax below:

    DROP TRIGGER IF EXISTS TRIGGER_NAME;

{{< note >}}
The `IF EXISTS` keyword is an optional parameters that only deletes a trigger if it exists.
{{< /note >}}

For example, to delete the `product_archiving` trigger that we defined above, use the below command:

    DROP TRIGGER IF EXISTS product_archiver;

Output:

{{< output >}}
Query OK, 0 rows affected (0.00 sec)
{{< /output >}}

{{< note type="alert" >}}
Be cautious when deleting tables associated with triggers. Once a table is dropped from the MySQL database, the related triggers are also automatically deleted.
{{< /note >}}