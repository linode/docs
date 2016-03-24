When administrating some servers administrator needs to know their some important parameters such as interfaces status, hard drives load, processes and services statistics etc.

Zabbix is the monitoring software designed for real-time monitoring of lots of metrics collected from thousands of servers, virtual machines and network devices.

Visualization features such as network maps, graphs, screens are available for the purpose of alerting.

More about Zabbix features can be learned on the [*features page*]

Note:

Zabbix requires LAMP server, install it before installing Zabbix. For more information on LAMP installation see LAMP installation [*guide*].

**Notes:**

**1. The steps require root privileges (sudo).**

**2. Assumed that LAMP server is installed on your system.**

**Installing Zabbix**

**Update your system and install Zabbix server and its Web interface:**

sudo apt-get update && sudo apt-get upgrade

sudo apt-get install zabbix-server-mysql zabbix-frontend-php

**Create group and user for Zabbix server:**

sudo groupadd zabbix

sudo useradd zabbix

**After the installation of zabbix-server-mysql the database named ‘zabbix’ must be created automatically. Check it by entering MySQL using the command below. You will enter your default ‘root’ database created during the LAMP installation procedure.**

sudo mysql -u root -p

**After entering MySQL menu use the command below to see the list of all existing databases. If among them there is ‘zabbix’ database, then it is ok. Note that MySQL uses its own syntax, in particular “;” sign is mandatory.**

mysql&gt;show datababses;

**If there is no ‘zabbix’ database, then you should create it manually:**

mysql&gt;create database zabbix;

**Grant user zabbix usage and all privileges to database:**

mysql&gt;grant usage on \*.\* to zabbix@localhost identified by "zabbix";

mysql&gt;grant all privileges on zabbix.\* to zabbix@localhost;

**Flush privileges and quit:**

mysql&gt;flush privileges;

mysql&gt;quit;

**Check the connection of user ‘zabbix’ to database ‘zabbix’ using command below:**

sudo mysql -u zabbix -p

**Configuring the Zabbix Daemon**

**Now we can continue with configuring Zabbix Daemon config file which is located in** /etc/zabbix/ . **Open the** zabbix\_server.conf **file with your favorite text editor. Uncomment and edit following lines to make Daemons basic configuration.**

**1. The TCP port Daemon should listen for (10051 is used by default):**

ListenPort=10051

**2. Daemons log directory:**

LogFile=/var/log/zabbix/zabbix\_server.log

**3. Maximum size of log file in MB (range 1-1024, 0 – disable logging):**

LogFileSize=1

**4. Specify debug level. This option is useful while troubleshooting. Range is 0-4, where 0 – basic info, 4 – lots of information):**

DebugLevel=3

**5. Programs pid file directory:**

PidFile=/var/run/zabbix/zabbix\_server.pid

**Note:**

/var/run/zabbix/ **directory must be created automatically during zabbix server installation process. But if it is not, you have to create that directory manually using command below:**

sudo mkdir /var/run/zabbix/

**6. Specify database hostname:**

DBHost=localhost

**7. Tell Daemon database name and user name created before:**

DBName=zabbix

DBUser=zabbix

**The basic configuration of Daemon is done.**

**Notice that this file contains lots of other parameters (e.g. VMware monitoring params, SNMP trapper params, SSH key dir etc, if necessary you can return to it and uncomment needed params)**

**Configuring Apache and Zabbix Web interface**

**Start the Apache Web server from LAMP server installed before:**

sudo service apache2 start

**Move to the Zabbix Web interfaces directory** /usr/share/doc/zabbix-frontend-php/ **and make a symbolic link to Apache server:**

sudo ln -s /usr/share/doc/zabbix-frontend-php/examples/apache.conf /etc/apache2/sites-enabled/

**Now we should keep doing with configuring** php.ini **- PHP's initialization file, which is responsible for configuring many of the aspects of PHP's behavior. It is located in** /etc/php5/apache2/ directory.

**Open the** php.ini **file using your favorite text editor and enable following parameters.**

**1. Maximum execution time of each script, in seconds:**

max\_execution\_time = 300

**2. Maximum amount of time each script may spend parsing request data, in seconds:**

max\_input\_time = 300

**3. Save the changes and restart Apache:**

sudo apache2ctl restart

**Start Zabbix Daemon:**

sudo zabbix-server start

**Now we can check connectivity. Open your favorite browser to access Zabbix Web interface:** IP\_of\_zabbix\_machine/zabbix

**The Zabbix server and Web interface is now installed and basically configured to be in working condition.**

Notice that to begin monitoring your servers you have to choose the monitoring method (install and configure Zabbix agent or install and configure SNMP Daemon).

This guide is a basic installation guide. More information about Zabbix futures can be found at

[*Zabbix documentation*] and [*Zabbix forum*]

  [*features page*]: http://www.zabbix.com/features.php
  [*guide*]: https://www.linode.com/docs/websites/lamp/lamp-on-ubuntu-14-04
  [*Zabbix documentation*]: http://www.zabbix.com/documentation.php
  [*Zabbix forum*]: https://www.zabbix.com/forum/
