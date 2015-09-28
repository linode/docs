---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install MySQL Workbench to administer databases without installing phpmyadmin'
keywords: 'MySQL, phpmyadmin, workbench, database, administer'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Thursday, September 26th, 2015'
title: 'Install and use MySQL Workbench to administer your server databases'
contributor:
    name: Scott Somner
external_resources:
 - '[Download MySQL Workbench](https://www.mysql.com/products/workbench/)'
 - '[Resetting MySQL Root Password](https://dev.mysql.com/doc/refman/5.0/en/resetting-permissions.html)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and
earn $250 per published guide.*

<hr>

This guide will show you how to download, install, and get started using MySQL Workbench.  MySQL Workbench runs directly on your desktop, not on the server.  As it needs to communicate with MySQL it will open connections itself and communicate directly.

## Before You Begin

* We suggest following the [Getting Started](/docs/getting-started), [Securing Your Server](), and [Installing MySQL] guides.

* MySQL Workbench is available for all major platforms.  The screenshots here are generated from Ubuntu.  Once Workbench is installed on your system the remaining steps should be identical.

* You'll also need your MySQL username and password.  This is the same username and password you use to login to phpmyadmin or other administrative tools.  If you just installed MySQL then your username is root and the password is what you specified during the install.

## Install MySQL Workbench

1.  On your own computer visit the [MySQL Workbench Homepage](https://www.mysql.com/products/workbench/).

2.  Click the **Download Now** button in the middle of the page

3.  Scroll to the bottom of the page and select your desktop's OS from the **Select Platform** dropdown

4.  Follow the installation instructions for your platform

## Running MySQL Workbench

When you start MySQL Workbench you'll land at the home screen.  Once you configure your database servers they'll have shortcuts here.

![MySQL Workbench's home screen right after installation.](/docs/assets/workbenchHome.png)

## Adding MySQL servers

The first step after running MySQL Workbench is to add your Linode as a database server within MySQL Workbench.  You'll need your MySQL username and password for this step.  If you just installed MySQL then the username will be root and the password you provided during the install.

1.  Click the + next to **MySQL Connections** to get the **Setup New Connection** dialog

	![The New Connection Dialog.](/docs/assets/workbenchHome.png)

Here's the settings you'll need

* Connection Name -- This is the name of the connection for your reference only

* Connection Method -- Set this to "Standard TCP/IP over SSH

* SSH Hostname -- The IP address of your Linode.  If you use a non-standard port (other than 22) add it to the end after a colon

* SSH Password -- You can store your password for the SSH account here if you want to.  If you don't provide it then Workbench will prompt for it each time.

* SSH Key File -- if you use public / private key pairs you can point Workbench to your key file here

* MySQL Hostname -- Leave this as 127.0.0.1.  This says that the database is running on the Linode that you just logged into

* MySQL Server Port -- Leave this as 3306 unless you changed the MySQL port number.

* Username -- this is the database username.  If you just installed MySQL this will be **root**.

* Password -- this is the database user's password.  If you don't store it here then Workbench will prompt for it each time.

* Default Schema -- This is the default database to connect to.  Its OK to leave this blank if you haven't created a database or don't want one to load by default.

2.  Once you've configured everything click **Test Connection**.  If you didn't save your passwords then Workbench will prompt for them.

{: .note }

> Pay attention to **Service** in each dialog.  Use the appropriate password (SSH or MySQL) or else the connection will fail!

	![The **SSH** password dialog](/docs/assets/workbenchPassword.png)

	![The **MySQL** password dialog](/docs/assets/workbenchDBpassword.png)

3.  If all is well then you should get a **Connection Successful** message.

	![Connection Successful!](/docs/assets/workbenchGoodConnection.png)

4.  Click **OK** to clear the message, then click **OK** again to add the connection.  You'll get a shortcut to the new connection on the home screen.

	![Shortcut to your database](/docs/assets/workbenchHomeWithLinode.png)

If you have more than one Linode or other servers your administer you can repeat this process to add all of your database servers.

## Connecting to MySQL

Click on the shortcut to your Linode.  You'll see connection details, then click **Connect**.

![Connection details just before connecting](/docs/assets/workbenchInfoConnect.png)

Workbench will prompt for passwords again as needed, then you'll arrive at the database screen.  This is where you'll do most of your work.

![The database screen](/docs/assets/workbenchDataScreen.png)

## Setting Preferences

By default MySQL Workbench is in safe mode.  This will not allow certain types of queries such as updates without explicit ID's.  To fix this we need to turn off safe mode.

1. Go to the menu and select Edit>Preferences

2. Select the **SQL Queries** tab.

![The SQL Queries configuration page](/docs/assets/workbenchSQLqueries.png)

3. Uncheck **Safe Updates**

4. Click **OK**

5. Close the database screen to return to home

6. Reconnect to the database

## Adding a Schema (Database)

Lets start by adding a new database that we can work with.

1.  Click the **New Schema** button on the toolbar.

	![The new schema button.  Make sure you click the one with a plus, not the one with an i](/docs/assets/workbenchToolbarNewSchema.png)

	![The new schema dialog](/docs/assets/workbenchNewSchema.png)

Only a name is required to create the new database but there's a big area for comments if you want to add some.  Default collation can be left blank, in that case MySQL will use the default.

2. Click **Apply**

Once you click **Apply** at the bottom of the form then you'll get an **Apply SQL Script to Database** dialog.  This shows you what commands are actually being sent to MySQL to perform the requested actions.

	![The Apply dialog shows you the commands actually being sent to MySQL](/docs/assets/workbenchSQL.png)

3.  Click **Apply** again and then you should get a **SQL Succesful** message.  Then click **Close**.

	![Our SQL has been successfully applied!](/docs/assets/workbenchSQLsuccessful.png)

Now we're back at the main database screen and we see that **phonebook** has been added to the schema list.  Double click on any item in the schema list to switch to that database.

	![The currently selected database is displayed in bold print](/docs/assets/workbenchSchemaSelected.png)

## Adding a Table

Tables are where MySQL stores its information.  They look a lot like a spreadsheet.

1.  Click the **Add Table** button to get started.

	![The add table button](/docs/assets/workbenchMenuButton.png)

You'll get a screen that looks like this.

	![Creating a MySQL table](/docs/assets/workbenchAddTable.png)

**Name** is the table name you want to add, I called my table **employees**.  **Schema** is which database to add the table to.  It will default to what's selected in the Schema pane.

	![Entering field names for the phonebook](/docs/assets/workbenchSetupTable.png)

Fields are the columns of the table and the information that you want to store.  Each table should always have an **ID** field that is set up as a **Primary Key**.

2.  Type **ID** under column name and press ENTER.

3.  Check the **PK** checkbox if its not already checked for you.

4.  Also check **Not Null (NN)** and **Auto Increment (AI)**.  

This will require the ID field to always have a value and generate a sequential number each time you add new data.

Once the ID field is setup add all of the other fields you'll need.

1.  Click directly under **ID** to add a new field

2.  Enter lastName for the column name

3. Click under **Datatype** and select **VARCHAR()**

4. Click between the parentheses and enter 45

Datatype **VARCHAR** is a string and the number in parentheses is the maximum length.

Repeat this process to create the following fields

* firstName, a VARCHAR(45)

* phone, a VARCHAR(16)

* email, a VARCHAR(45)

When you've set up everything click the **Apply** button.  You'll get another **Apply SQL Script To Database** window.  Click **Apply** again and look for the **SQL Successful** message.

![The SQL commands to build the phonebook table](/docs/assets/workbenchTableSQL.png)

Now that our database has a table in it we can click on the right arrow in the **Schemas** pane to expand the view.  Click the arrow next to **Tables** and you'll see the **employees** table we just created.

## Adding Data to a Table

The first step to add table data is to open the table.

1.  Right click on **employees** and select the top option **SELECT ROWS - LIMIT 1000**.

	![A blank table ready for data](/docs/assets/workbenchEmptyTable.png)

2.  Double click on **NULL** under **lastName**.  Now you can start entering your data.  You must press ENTER after each field to exit editing or else the field will revert to its previous value.

3.  Once all of the data is entered click the **Apply** button.  If you skip this step then none of the data will be saved in the database!

## Running Queries

You can run a SQL query on a table by entering it at the top of the table view.

1.  Click on the text entry area and type

	SELECT * FROM phonebook.employees WHERE `firstName` = 'Bob'

2.  Click on the lightning bolt to run the query.  You should get results like this:

	![Who is named Bob?](/docs/assets/workbenchSQLresults.png)

## Adding Users and Privileges

Just like its a bad idea to use the root account for "daily use" in the shell the same idea applies inside MySQL.  Workbench provides the capability to add, edit and manage user privileges.  Lets add a user and give it a few privileges.

1. Click **Users and Privileges** under the **Management** pane.

![MySQL user management](/docs/assets/workbenchUsers.png)

2. Click **Add Account**

3. Enter a **Login Name** and a **Password**, then confirm the password

4. Click the **Administrative Roles** tab

5. Select a role or assign specific privileges by checking the different boxes.

6. Click **Apply**

The user you just created shouuld be able to login to MySQL via Workbench or any application that supports accessing a MySQL database.

## Exporting data

Exporting data is handy for backing up database content or moving a database to a new server.  Its always a good idea to export the database prior to any major changes in structure or installing a new application just in case it breaks something or you want to revert to your pre-install state.

1. Click **Data Export** under the **Management** pane.

![Options for exporting data](/docs/assets/workbenchExportSQL.png)

2. Check the database(s) you would like to export data from on the left pane

3. Check the table(s) you would like to export data from on the right pane

4. Select **Export to Self-Contained File** -- The .sql file this produces is plain text so you can explore it with a text editor.

5. Click **...** and enter a file name

6. OPTIONAL -- if you only want the table structures and not the data check **Skip table data**

7. Click **Start Export**

## Importing data

Importing can be used to restore a backup created with **Data Export** or perhaps to load a database sent to you by a coworker.

1. Click **Data Import / Restore**

![Import options](/docs/assets/workbenchImport.png)

2. Select **Import from Self-Contained File**

3. Click **...** and locate your .sql file

4. Under **Default Target Schema** select the database where you want this import to go

5. Click **Start Import**

## Conclusion

MySQL Workbench is a very handy tool designed from the ground up to administer databases.  This has just scratched the surface of what it can do.  As you explore and manipulate your data with this great tool you'll discover many more features and shortcuts that can make managing your databases that much easier!

