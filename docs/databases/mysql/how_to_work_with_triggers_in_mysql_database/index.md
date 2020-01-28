---
author:
  name: Francis Ndungu
  email: francisndungu83@gmail.com
description: 'In this guide, we will walk you through the steps of creating and working with triggers in your MySQL database.'
keywords: ['mysql','database','triggers']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-01-28
modified_by:
  name: Linode
title: "How to Work with Triggers in MySQL Database"
contributor:
  name: Francis Ndungu
  link: https://twitter.com/francisndungu83
external_resources:
- '[MySQL Trigger Syntax and Examples](https://dev.mysql.com/doc/refman/8.0/en/trigger-syntax.html)'
---


### Introduction

A trigger is a pre-defined SQL command that is automatically executed when specific actions occur in the database and it can be fired either before or after an `INSERT`, `UPDATE`, or `DELETE` event. 

Triggers are mainly used to maintain software logic in the MySQL server(centralizing global operations) and they also reduce client-side code while still minimizing the round-trips made to the database server. These make application more scalable across different platforms.

Some common use-cases of triggers include audit logging, pre-computing database values(e.g. cummulative sum) and enforcing complex data integrity and validation rules.

In this guide, we will take you through the steps of creating, using and dropping triggers in your MySQL server.

## Before you Begin

1. To follow along with this guide, familiarize yourself with our [Getting Started guide](/docs/getting-started/) and set up a linode server.
	
2. Install a MySQL server by following our guide on [How to Install MySQL server](/docs/databases/mysql/install-mysql-on-ubuntu-14-04/). 
3. Ensure you have root access to your MySQL server.

## Step 1 - Creating a Test Database, Tables and Sample Data

To better understand how triggers work, we will create a sample database and add sample data into it. Later, we will run triggers on the database to proof of concept.

First, log in to your MySQL Server:

    mysql -u root -p

Then, enter the root password of your MySQL server and hit **Enter** to proceed. Next, create a `test_database` by running the command below:

    mysql> Create database test_database;

Output:

    Query OK, 1 row affected (0.02 sec)

Switch to the database:

    mysql> Use test_database;

Output:
    
    Database changed

Once the database is selected, we will create some tables that we will use for demonstrating triggers. We will begin by creating the `stores` table. This table will hold information about two sample stores/offices where our hypothetical business operates from :

    mysql> Create table stores
    (
    store_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_name vARCHAR(50)	
    ) ENGINE=InnoDB;

Output:

    Query OK, 0 rows affected (0.07 sec)

Next, add two records to the `stores` table by running the commands below:

    mysql> Insert into stores(store_name) values('Philadelphia');
    mysql> Insert into stores(store_name) values('Galloway');

After each command, you will get the below output:

    Query OK, 1 row affected (0.08 sec)
    ...

Confirm the records by running the command below:

    mysql> Select * from stores;

Output

    +----------+--------------+
    | store_id | store_name   |
    +----------+--------------+
    |        1 | Philadelphia |
    |        2 | Galloway     |
    +----------+--------------+
    2 rows in set (0.01 sec)

Next create the `products` table. The table will hold different products being offered in the store. Each product will be uniquely identified by a `product_id` . We will also have a `product_name` field that will specify the names of the items. 

The `cost_price` and `retail_price` fields will determine the buying and selling price respectively. In addition, we will have an `availability` column which will define the product availability in the different stores. If the product is only available in our local store(Philadelphia), we will denote it with a `LOCAL` value. Else, we will use the value of `ALL` to signify a product that is available in both stores(Philadelphia and Galloway).

To create the `products` table, run the command below:

    mysql> Create table products
    (
    product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(40),
    cost_price DOUBLE,
    retail_price DOUBLE,
    availability VARCHAR(5)
    ) ENGINE=InnoDB;

Output:

    Query OK, 0 rows affected (0.13 sec)

Then, add sample data to the `products` table:

    mysql> Insert into products (product_name, cost_price, retail_price, availability) values('WIRELESS MOUSE', '18.23', '30.25','ALL');

    mysql> Insert into products (product_name, cost_price, retail_price, availability) values('8 MP CAMERA', '60.40', '85.40','ALL');

    mysql> Insert into products (product_name, cost_price, retail_price, availability) values('SMART WATCH', '189.60', '225.30','LOCAL');

You will get the output shown below after each insert command:

    Query OK, 1 row affected (0.02 sec)
    ...

Confirm if the products were inserted by running the command below:

    mysql> Select * from products;

Output:

    +------------+----------------+------------+--------------+--------------+
    | product_id | product_name   | cost_price | retail_price | availability |
    +------------+----------------+------------+--------------+--------------+
    |          1 | WIRELESS MOUSE |      18.23 |        30.25 | ALL          |
    |          2 | 8 MP CAMERA    |       60.4 |         85.4 | ALL          |
    |          3 | SMART WATCH    |      189.6 |        225.3 | LOCAL        |
    +------------+----------------+------------+--------------+--------------+
    3 rows in set (0.00 sec)
    
Next, the products availability will be mapped to another table named `products_to_stores`. This table will just reference the `product_id` from the `products` table and the `store_id` from the `stores` table where the item is available.

Create the `products_to_stores` table by running the code below:

	mysql> Create table products_to_stores
	(
	ref_id BIGINT PRIMARY KEY AUTO_INCREMENT,
	product_id BIGINT,
	store_id BIGINT	
	) ENGINE=InnoDB;

Output:

    Query OK, 0 rows affected (0.14 sec)

Next, we will create an `archived products` table. The table will hold information for deleted products for future reference:

    mysql> Create table archived_products
    (
    product_id BIGINT PRIMARY KEY ,
    product_name VARCHAR(40),
    cost_price DOUBLE,
    retail_price DOUBLE,
    availability VARCHAR(5) 
    ) ENGINE=InnoDB;

Output:

    Query OK, 0 rows affected (0.14 sec)

Lastly, we will create another table called the `products_price_history` table for tracking the different prices of each product. To create the `products_price_history`, run the command below:


    mysql> Create table products_price_history
    (
    product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    price_date DATETIME,    
    retail_price DOUBLE
    ) ENGINE=InnoDB;

Output:

    Query OK, 0 rows affected (0.14 sec)

Once our database structure is in place, we can now go ahead and learn the basic syntax of a MySQL database trigger in order to create our first sample.

## Step 2 - Creating a Before Insert, Before Update and Before Delete Trigger

As indicated earlier, triggers are fired automatically either before or after an SQL command is run in the database. In this step, we will look into the different types of triggers that are fired before a database operation. These include the `BEFORE INSERT`, `BEFORE UPDATE` AND `BEFORE DELETE` triggers.

Before we create the first trigger, let's look at the trigger syntax.

    mysql> CREATE TRIGGER [TRIGGER NAME]

    [TRIGGER TIME] [TRIGGER EVENT]

    ON [TABLE NAME] FOR EACH ROW

    TRIGGER BODY;

The MySQL trigger syntax above is quite self-explanatory but we will go over it to make it easier for you to understand.

* `TRIGGER NAME` : Each trigger must have a unique name and you should define it here.
* `TRIGGER TIME` : There are two acceptable values. That is `BEFORE` or `AFTER`.
* `TRIGGER EVENT`: You need to specify the database event that will invoke the trigger(e.g. `INSERT`, `UPDATE` or `DELETE`).
* `TRIGGER BODY` : This specifies the actual SQL command that you want to be run by your trigger. 

{{< note >}}
Note, if a trigger body has more than one SQL statement, you must enclose it witin a `BEGIN...END` block.
{{< /note >}}

### Creating a MySQL Before Insert Trigger

We will create our first `BEFORE INSERT` trigger. The trigger will make sure that the retail price of the product is greater than the cost price when the items are being inserted to the `products` table. Otherwise, the database user will get an error.

While still on the MySQL prompt, enter the command below:

    mysql> DELIMITER $$

    CREATE TRIGGER price_validator

    BEFORE INSERT

    ON products FOR EACH ROW    

    IF NEW.cost_price>=NEW.retail_price

    THEN

    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Retail price must greater than cost price';

    END IF $$

    DELIMITER ;

In the above code, we have switched to a custom delimiter at the top using the syntax `DELIMITER $$`. Then, we have defined the trigger name(price_validator), time(BEFORE), event(INSERT) and the table(products) to be affected. 

Our trigger uses the `NEW` keyword to check the `cost_price` and `retail_price` before a record is inserted to the `products` table using the `IF...THEN...END IF` statement. If the `cost_price` is greater or equal to the `retail price`, we have instructed MySQL to throw a custom exception instructing the user to rectify the error.

To test the trigger above, trying inserting a product that violates the validation rule by running the command below:

    mysql> Insert into products (product_name, cost_price, retail_price, availability) values('GAMING MOUSE PAD', '145.00', '144.00','LOCAL');

Output:

    ERROR 1644 (45000): Retail price must greater than cost price

The above insert commands should fail because the `retail_price`(144.00) is not greater than the `cost_price`(145.00). Apart from a `BEFORE INSERT` trigger, you can also create a `BEFORE UPDATE` trigger by tweaking the code above as we will see in the next step.

### Creating a MySQL Before Update Trigger

Next, we will create a `BEFORE UPDATE` trigger. This trigger will prevent database users from editing a product name once a product has been inserted into the database. If you have multiple users working in the database, a `BEFORE UPDATE` trigger may be used to make values read-only and this can prevent malicious or careless users from modifying records unnecessarily.

To create the `product_name_validator` trigger, run the command below:

    mysql> DELIMITER $$

    CREATE TRIGGER product_name_validator

    BEFORE UPDATE

    ON products FOR EACH ROW
  
    IF NEW.product_name<>OLD.product_name

    THEN

    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product name is read-only and it can not be changed.';

    END IF $$

    DELIMITER ;

The trigger aboves compares the values of the new product_name(NEW.product_name) and the old name already in the database(OLD.product_name). If there is a mismatch, an exception is thrown. 

To invoke the `product_name_validator` trigger, we can attempt to update the product with the id `1`;

    mysql> Update products set product_name='WIRELESS BLUETOOTH MOUSE' where product_id='1';

Output:

    ERROR 1644 (45000): Product name is read-only and it can not be changed.

In the next step, you will see how you can define a `BEFORE DELETE` trigger to prevent users from deleting specific records from a table.

### Defining a MySQL Before Delete Trigger

To prevent products marked with a value of `ALL` in the availability column from being deleted, we will create a `BEFORE DELETE` trigger.

To create the `prevent_delete` trigger, run the command below:

    mysql> DELIMITER $$

    CREATE TRIGGER prevent_delete

    BEFORE DELETE

    ON products FOR EACH ROW  

    IF OLD.availability='ALL'

    THEN

    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The product can not be deleted because it is available in ALL stores.';

    END IF $$   

    DELIMITER ;

Next, try to delete the first product from the products table and see if the trigger will be invoked:

    mysql > Delete from products where product_id='1';

Output:

    ERROR 1644 (45000): The product can not be deleted because it is available in ALL stores.

We have looked at the different triggers that are invoked before a database operation. Next, we will look into the other types of triggers that are fired after database events.

## Step 3 - Executing an After Insert, After Update and After Delete Trigger

In a production environment, you may want some triggers to be automatically executed after a database event has been executed. For instance inserting records to different tables. The example below demonstrates how these kinds of triggers can be used in our sample database.

### Creating a MySQL After Insert Trigger

This sample creates a trigger named `product_availability` that insert a mapping records to the `products_to_stores` table. This helps to define the product availability on the different stores.

When an item is being inserted to the products table, the trigger will check the availability field and if it is marked with a `LOCAL` value, the product will be made available in one store only. Any other value will instruct the trigger to avail the product to the two stores that we created earlier. This trigger is used to enforce a business logic.

Run the code below to create the `product_availability` trigger. Since we have multiple lines of code in the trigger body, we will use the `BEGIN...END` block as shown below: 

    mysql> DELIMITER $$

    CREATE TRIGGER product_availability

    AFTER INSERT

    ON products FOR EACH ROW

    BEGIN

    IF NEW.availability='LOCAL' then

    Insert into products_to_stores (product_id, store_id) values(NEW.product_id, '1');

    ELSE

    Insert into products_to_stores (product_id, store_id) values(NEW.product_id, '1');

    Insert into products_to_stores (product_id, store_id) values(NEW.product_id, '2');

    END IF; 
 
    END $$

    DELIMITER ;

To see the `product_availability` trigger in action, insert the two records to the products table.

    mysql>Insert into products (product_name, cost_price, retail_price, availability) values('BLUETOOTH KEYBOARD', '17.60', '23.30','LOCAL');
    mysql>Insert into products (product_name, cost_price, retail_price, availability) values('DVB-T2 RECEIVE', '49.80', '53.40','ALL');

Then, query the `products_to_stores` table. 

    mysql> Select * from products_to_stores;

You should see an output similar to the one shown below:

    +--------+------------+----------+
    | ref_id | product_id | store_id |
    +--------+------------+----------+
    |      1 |          4 |        1 |
    |      2 |          5 |        1 |
    |      3 |          5 |        2 |
    +--------+------------+----------+
    3 rows in set (0.00 sec)

A trigger can also be fired after an update event. We will see how we can leverage this type of trigger to keep track of price changes in our store.

### Defining a MySQL After Update Trigger

Since a product `retail_price` can change over time, we can use an `UPDATE TRIGGER` to record these changes in a different table. This can help us track the history of the product price irrespective of the varying price.

Create a `product_history_updater` trigger by running the command below:

    mysql> DELIMITER $$

    CREATE TRIGGER product_history_updater

    AFTER UPDATE

    ON products FOR EACH ROW  

    Insert into products_price_history(product_id, price_date, retail_price) values(OLD.product_id, NOW(), NEW.retail_price);$$

    DELIMITER ;

Then, try updating the price of the first product by running the command below:

    mysql> Update products set retail_price='36.75' where product_id='1';

Next, query the `products_price_history` table to see if the price change was logged.

    mysql> Select * from products_price_history;

If the trigger worked as expected, you should get the below output:

    +------------+---------------------+--------------+
    | product_id | price_date          | retail_price |
    +------------+---------------------+--------------+
    |          1 | 2020-01-28 11:46:21 |        36.75 |
    +------------+---------------------+--------------+
    1 row in set (0.00 sec)

In some cases, you might want to log delete operations after a specific action has occured in the database. You can achieve this by using the `AFTER DELETE` trigger as we will see next.

### Creating a MySQL After Delete Trigger

We will create a trigger named `product_archiver` to archive deleted products in a separate table named `archived_products`. When an item is deleted from the main `products` table, our trigger will automatically log it to the `archived_products` table for future reference.

To create the trigger, run the command below:

    mysql> DELIMITER $$

    CREATE TRIGGER product_archiver

    AFTER DELETE

    ON products FOR EACH ROW  

    Insert into archived_products (product_id, product_name, cost_price, retail_price, availability)values (OLD.product_id, OLD.product_name, OLD.cost_price, OLD.retail_price, OLD.availability); $$

    DELIMITER ;

Next, delete a product from the `products` table and see if the trigger will be invoked:

    mysql> Delete from products where product_id='3';

Now, if you check the `archived_products` table, you should see one record

	mysql> Select * from archived_products;

Output:

    +------------+--------------+------------+--------------+--------------+
    | product_id | product_name | cost_price | retail_price | availability |
    +------------+--------------+------------+--------------+--------------+
    |          3 | SMART WATCH  |      189.6 |        225.3 | LOCAL        |
    +------------+--------------+------------+--------------+--------------+
    1 row in set (0.00 sec)

You have seen the different types of triggers and how they can be used in a production environment. Sometimes, you may want to remove a trigger from the database and this can be achieved very easily as we will demonstrate next.

## Step 4 - Deleting a MySQL Database Trigger

You can delete a trigger if you don't want to use it anymore using the syntax below:

    mysql> DROP TRIGGER IF EXISTS [TRIGGER NAME];

The `IF EXISTS` keyword is an optional parameters that only deletes a trigger if it exists. So for instance to delete the `product_archiving` trigger that we defined above use the below command:

    mysql> DROP TRIGGER IF EXISTS product_archiver;

Output:

    Query OK, 0 rows affected (0.00 sec)

{{< caution >}}
Be catious when deleting tables associated with triggers because once a table is dropped from the MySQL database, the related triggers are also automatically deleted.
{{< /caution >}}

## Conclusion


In this article, we took you through all the steps of creating, using and dropping triggers in MySQL database. Although this is not a conclusive tutorial on how you can use all types of triggers in your application, it has taken you through most of the best use-cases and you can expand the samples in this guide to suit your needs.