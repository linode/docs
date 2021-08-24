---
slug: change-mysql-root-password
author:
  name: Linode Community
  email: docs@linode.com
description: 'A guide on how to change or reset the root password in a MySQL installation on Windows and Unix-like systems.'
og_description: 'How to change or reset your root password in MySQL.'
keywords: ['mysql','change','root','password','reset']
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-11
modified_by:
  name: Linode
title: "Change MySQL Root Password"
h1_title: "How to Change the MySQL Root Password"
enable_h1: true
contributor:
external_resources:
- '[How to Reset the Root Password at mysql.com](https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html)'
---
Due to its ubiquity, MySQL can be exploited by an attacker. Changing the MySQL root password is one of many ways you can work to secure your MySQL installation against such attempts. To see other ways to secure your MySQL installation, see our guide [Securing MySQL Server](/docs/guides/how-to-secure-mysql-server/).


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide.

2.  This guide will use `sudo` wherever possible. On Windows, you will want run applications as an Administrator.

3.  This guide assumes you have some familiarity with running MySQL. If you do not, see our [MySQL guides](https://www.linode.com/docs/guides/databases/mysql/) and the MySQL Reference Manual at the [MySQL Documentation site](https://dev.mysql.com/doc/) for more information.

4.  Update your system. On Debian and Ubuntu, enter:

        sudo apt-get update && sudo apt-get upgrade
    On Fedora, CentOS, or other Red Hat-derived distributions, either enter:

        sudo dnf update
    Or (on older Red Hat-based sytems):

        sudo yum update

    On any other systems (Windows, macOS), use your built-in updater(s).

## Change MySQL's Root Password

### Linux and macOS

On a Unix-like system (Linux, BSD, macOS, etc.), the procedure is to reset the `root@localhost` account within MySQL (depending upon the hostname of your system, you may have to change `localhost` to the system's name).

1.  Log into the system with the regular (non-root) account you use to run MySQL.
    -   If you are using the system's root account to run MySQL, make sure to start mysqld with the `--user=mysql` option. If you do not, you may do damage to the root-owned files on the system itself.

2.  Locate the .pid file containing the MySQL server process ID. This is usally found in /var/lib/mysql/, /var/run/mysqld/, or /usr/local/mysql/data/, and the filename will generally have an extension of .pid and start with either "mysql" or the system's hostname.

3.  Stop the MySQL server if it is running by sending a normal `kill` command (do not send a `kill -9`) using the path you found in the second step:

        kill `cat /mysql-data-directory/host_name.pid`

    For example, if the .pid file was named "mysql.pid" and locatted in /var/lib/mysql/, you would send:

        kill `cat /var/lib/mysql/mysql.pid`
    {{< note >}}
Be sure to use backticks (not quotation marks) when using the `cat` command. That way, the output from the file specified in `cat` is passed to the `kill` command.
{{< /note >}}

4.  Create a new text file named "mysql-init" within your user's home directory.

5.  Open the "mysql-init" file, and on the first line, enter:

        ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword';
    Replace the "localhost" with your system's hostname (if applicable) and replace "NewPassword" with a secure password.

5.  Exit and save the file.

6.  Start `mysqld` using the `--init-file` option to Start the MySQL server with the `init-file` option set to the new file, such as:

        mysqld --init-file=/home/mumbly/mysql-init &
    Replace "mumbly" with your username.

7.  The server will start and change the root password when it reads the file.

8.  Stop the server and restart it, then test connecting to it as root.

9.  If the password change was successful, immediately delete the mysql-init file in your home directory.

### Windows

On a Windows system, the change or reset procedure for the `root@localhost` account within MySQL (depending upon the hostname of your system, you may have to change `localhost` to the system's name) is a lot like Unix-like systems, but with changes only Windows users are likely to love.

1.  Log into Windows as an administrator.

2.  Stop MySQL server if it's running.
    -   If it's running as a service, go to the search box in your taskbar and type "Services." One of the results will be an application called "Services." Launch that.
    -   If it's not running as a service, use the Task Manager to stop it.

3.  Using Notepad or another text editor (not a word processor), create a new file, and on the first line, enter:

        ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword';
    Replace the "localhost" with your system's hostname (if applicable) and replace "NewPassword" with a secure password.

4.  Save the new text file at the C: drive's root level and name it "mysql-init" (C:\mysql-init.txt).

5.  Run the Command Prompt as an administrator.

6.  Start the MySQL server using the `--init-file` option set to the new file, such as:
        C:\> cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
        C:\> mysqld --init-file=C:\\mysql-init.txt
    If you used the MySQL Installation Wizard to install, you might need the `--defaults-file` option to be set. Search for "Services" in your search box again. Right-click on the MySQL service and choose "Properties." The path to use in the `--defaults-file` setting above will be found in the "Path to executable" field. For example:

        C:\> mysqld
             --defaults-file="C:\\ProgramData\\MySQL\\MySQL Server 8.0\\my.ini"
             --init-file=C:\\mysql-init.txt

7.  The server will start and change the root password when it reads the file.

8.  Stop the server and restart it, then test connecting to it as root.

9.  If the password change was successful, then immediately delete the mysql-init file.