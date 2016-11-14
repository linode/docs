---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will explain the steps for installing Redis database engine in your Debian 8 server.'
keywords: 'redis,debian,nosql,key-value database,redis on debian'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Weekday, Month 00st, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
  name: Linode
title: 'Redis on Debian 8 (Jessie)'
contributor:
  name: Joseph Ramírez
  link: https://github.com/jerm423
  external_resources:
- '[Redis commands](http://redis.io/documentation)'
- '[Redis functionality explanation](http://redis.io/documentation)'
- '[Debian build-essential package docs](https://packages.debian.org/en/sid/build-essential)'
---

Redis is a No-SQL key-value database engine that works on memory, which makes it incredibly fast and suitable for applications where the performance is a key factor. Because of its high performance, Redis can be used as cache in websites related tasks like session cache, full page cache, queues, rankings, among others. The possibilities are infinite!


Install Redis in Debian 8 (Jessie)
----------------------------------

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


##Prepare the system before installing Redis

Keep your system updated with the commands:

  apt-get update
  apt-get upgrade

Install the basic elements for building packages:

  apt-get install build-essential

##Download and build the software

Go to a location in which we can install the Redis library such as `/opt`.

Run the following commands:

  wget http://download.redis.io/releases/redis-3.2.5.tar.gz   #Download the package

  tar xzf redis-3.2.5.tar.gz                                  #Uncompress the package

  rm redis-3.2.5.tar.gz                                       #Remove the tar.gz to clean up the folder

  cd redis-3.2.5                                              #Move to the uncompressed folder

  make                                                        #Build the sources

##Start the Redis server

The basic command to start the server is `/opt/redis-3.0.7/src/redis-server` or in its defect, the place where that executable is located. However if you run the previous command you'll see that the redis shell take control of the terminal (like MySQL does). In that case, if you want to continue using the server for other tasks you would have to exit the shell and as a result, the Redis service would be stopped (int this sense it is not like MySQL). So in order to start the Redis service as a background we have two options:

  - Open another ssh session and start the service

    If you open a new ssh session, you can start the service, check that it is running and then close the session. This leaves the Redis running and you can continue using the server as if nothing happened.

  - Run the Redis server as a daemon

    Probably this is the easiest way to do this but it is worth for you as a reader to know the "why" of the things. In this case, it is just necessary to tell Redis to start in background by typing the following `/opt/redis-3.0.7/src/redis-server --daemonize yes` command.

##Check if Redis is running

To check if the service is running type `ps aux | grep redis-server`. You should see a process running in `src/redis-server *:6379`.

Now, you can perform queries to Redis to see if it is working by starting a client. According to Redis' official documentation:

{: .note}
>By default redis-cli connects to the server at 127.0.0.1 port 6379. As you can guess, you can easily change this using command line options. To specify a different host name or an IP address, use -h. In order to set a different port, use -p.

So, if you are in the server just run `/opt/redis-3.0.7/src/redis-cli`, or in its defect, the place where that executable is located. If you are in another location different from the server in which Redis is installed you'll have to run `/opt/redis-3.0.7/src/redis-cli -h ADDRESS_OF_REDIS_SERVER -p CUSTOM_PORT`.

{: .note}
>Notice that if you haven't changed the port in the Redis configuration, the port is going to still being `6379`.

Now you should be connected to the server.

##Play with Redis

Start a client (as I showed before) and run the next commands:

  keys *                      #Its like the show tables command in SQL

  append mykey "keycontent"   #If the key does not exist, Redis will create it.

  get mykey                   #Check the contents of the key you just created

  keys *                      #Watch the list of all your keys

##Miscellaneous commands

Here are some basic but pretty useful commands.

###To stop the Redis server

Since Redis is running in the background we have to stopp it through a client. To do that, start a client session and run the command `shutdown`. This will perform [some tasks](http://redis.io/commands/shutdown) and will stop the server. Again, you can check that the server isn't running anymore with `ps aux | grep redis-server`.

 ###To see the connected clients

 Run `client list` and you will see the connected clients. According to the documentation, the values are the following:

   id         #an unique 64-bit client ID (introduced in Redis 2.8.12).
   addr       #address/port of the client
   fd         #file descriptor corresponding to the socket
   age        #total duration of the connection in seconds
   idle       #idle time of the connection in seconds
   flags      #client flags (see below)
   db         #current database ID
   sub        #number of channel subscriptions
   psub       #number of pattern matching subscriptions
   multi      #number of commands in a MULTI/EXEC context
   qbuf       #query buffer length (0 means no query pending)
   qbuf-free  #free space of the query buffer (0 means the buffer is full)
   obl        #output buffer length
   oll        #output list length (replies are queued in this list when the buffer is full)
   omem       #output buffer memory usage
   events     #file descriptor events (see below)
   cmd        #last command played

##Adding Redis to init.d

Redis contains a script that allows Redis be added to the services folder in a simplified manner. In order to be able to run the start and stop commands with Redis, you'll have to run the following tasks.

Go to the location where the redis-server and redis-cli executables are located (under `/opt/redis-3.2.5/src/`) and copy those executables to `usr/local/bin`.

  cp /opt/redis-3.2.5/src/redis-server /usr/local/bin
  cp /opt/redis-3.2.5/src/redis-cli /usr/local/bin

Now go to the sources where Redis was downloaded.

Head to `utils` folder and execute the install-server.sh script.

The script is going to ask for some variables like:
- Port
- Redis config file name and location
- Redis log file name and location
- Redis data directory
- Redis executable path

The values for the first 4 variables are going to be provided by the script unless you want to change them. In some cases, in the last step, the script does not provide a default value so in that case just write the location in which we copied the redis executables (`usr/local/bin`).

Now you can check that the service was created in the init.d folder. The name of the service will be redis_PORT where PORT is the specified in the first step of the script (redis_6379 by default).

Now you can play with the new service.

  /etc/init.d/redis_6379 start
  /etc/init.d/redis_6379 stop

##Further Info

- [Redis commands](http://redis.io/documentation)
- [Redis functionality explanation](http://redis.io/documentation)
- [Debian build-essential package docs](https://packages.debian.org/en/sid/build-essential)
