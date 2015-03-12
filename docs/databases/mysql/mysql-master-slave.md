MySQL Master-Slave replication helps you backup your database on other servers automatically at real time. This backup is a saviour in disaster recovery situations. 

You can refer this procedure for setting up master-slave replication
http://dev.mysql.com/doc/refman/5.5/en/replication-howto.html

Some of the steps in replication process are to stop writes on the db, take mysqldump, note down binlog position respectively. To stop writes on the db, you can either stop mysql or do 

    mysql> FLUSH TABLES WITH READ LOCK;

If you don't do it you will lose some data. If you do it your database server will be down during that time. Eventually your application will be down.

You take downtime and set up replication. After some days you decide to setup another slave. You can follow the replication procedure. But then your application will face a downtime. You can avoid this downtime by following below procedure. Basically we will be using the existing slave to set up an additional slave (without touching master).

Here is how you should do it.

# SLAVE1

Copy configurations and mysql data from slave1 to slave2, assuming IP address for slave2 is x.x.x.x

## Copy my.cnf from slave1 to slave2
~~~~
$ sudo rsync -avzP -e ssh /etc/mysql/my.cnf  user@x.x.x.x:/home/user/data/slave-my.cnf
~~~~
If you access slave2 using a ssh private key, pass it like this
~~~~
$ sudo rsync -avzP -e "ssh -i /home/user/.ssh/id_rsa_slave2" /etc/mysql/my.cnf  user@x.x.x.x:/home/user/data/slave-my.cnf
~~~~
-a               archive mode for persisting file permissions and other attributes on the destination
-v               verbose
-z               compress file data during the transfer
-P		 show progress of the transfer
2. Stop the slave
~~~~
mysql> STOP SLAVE;
~~~~
## Copy datadir from slave1 to slave2
You can check what your datadir is in /etc/mysql/my.cnf
~~~~
[mysqld]
...
datadir		= /var/lib/mysql
...
~~~~
~~~~
$ sudo rsync -avzP -e ssh /var/lib/mysql/ user@x.x.x.x:/home/user/data/slave-mysql-datadir
~~~~
## Copy logdir from slave1 to slave2
~~~~
$ sudo rsync -avzP -e "ssh -i /home/user/.ssh/id_rsa_slave2" /var/log/mysql/ user@x.x.x.x:/home/user/data/slave-mysql-log
~~~~
**Note :** Generally only the relay logs are needed
## Start the slave
~~~~
mysql> START SLAVE;
~~~~

Now let's make slave2 replicate from master.

# SLAVE2

## Stop mysql
~~~~
$ sudo service mysql stop
~~~~
If mysql is not installed, install it
~~~~
$ sudo apt-get install mysql-server mysql-client
~~~~
## Configure a new /etc/mysql/my.cnf
First ovewrite /etc/mysql/my.cnf by slave1's 
~~~~
$ sudo mv ~/data/slave-my.cnf /etc/mysql/my.cnf
~~~~
Then update server-id and bind-adress
~~~~
server-id = 201
bind-address = x.x.x.x
~~~~
Note that the server-id must not match with server-id from a master or any slave
bind-adress slave2's own ip address.
## Overwrite /var/lib/mysql by slave1's
~~~~
$ sudo mv ~/data/slave-mysql-datadir /var/lib/mysql
~~~~
Check the owners of your new datadir. If the it's not mysql:mysql we would have to change it to that.
~~~~
$ sudo chown mysql:mysql /var/lib/mysql
~~~~
Because mysql to be able to access the datadir, the owners on the files have to be mysql:mysql
## Overwrite /var/log/mysql by slave1's
~~~~
$ sudo mv ~/data/slave-mysql-log /var/log/mysql
$ sudo chown mysql:mysql /var/log/mysql
~~~~
## Start mysql
~~~~
$ sudo service mysql start
~~~~
## Start slave
If skip-slave-start is there in your my.cnf 
~~~~
[mysqld]
skip-slave-start
~~~~
you would need to explicitly start slave
~~~~
mysql> START SLAVE;
~~~~
Otherwise, it will automatically start it.
## Verify that slave2 is replicating
~~~~
mysql> SHOW SLAVE STATUS\G
~~~~
If slave2 is replicating from master, the output should say
~~~~
Slave_IO_State: Waiting for master to send event
...
Slave_IO_Running: Yes
...
~~~~

Lot of Web applications are hosted in a distributed system. 


[![Distributed MySQL with separate master.](/docs/assets/mysql-distributed-master.jpg)](/docs/assets/mysql-distributed-master.jpg)

For a better response time, slaves are used for read operations and master is used for write operations. 
What if you decide to add a new web server, you will need to setup a slave. This procedure will come in really handy at that time.

Fore more information on setting up additional slaves to an existing replication environment you can refer
http://dev.mysql.com/doc/refman/5.5/en/replication-howto-additionalslaves.html

