High performance Nginx and PHP over Debian 8
19th May 2015 by Javier Briz


This document describes how to install and setup an nginx server with PHP-FPM.
This stack, together with a MySQL server, is what is called a **LEMP** server. After following this article, your PHP code will be
able to connect to a MySQL server, but the MySQL server installation itself will not be explained;
there are already [lots of guides](https://www.linode.com/docs/databases/mysql/) on this topic. 

#Installation Prerequisites
First of all, follow the [Getting Started Guide](https://www.linode.com/docs/getting-started/).
It is also usefull to have a Fully Qualified Domain Name to have a handy pointer to the server.

#Packages installation
In this step, we are installing all the necessary packages.
Run the following as root to install nginx, PHP and MySQL connector:

        apt-get update
        apt-get install nginx php5-fpm php5-mysql

Make sure nginx and PHP-FPM are running

        ps aux|grep -e nginx -e php
        
#Nginx setup
Now we have to setup nginx server to relay on PHP-FPM for PHP requests. 
By default, PHP-FPM on debian listens on a socket. We are putting everything in one single server so this is ok.
To find the path for the socket run:

        cat /etc/php5/fpm/pool.d/www.conf |grep 'listen ='

Probably, it is located in `/var/run/php5-fpm.sock`

We will tell nginx where is this socket in a *server* context in the nginx setup.
In other words, add following lines to `/etc/nginx/sites-enabled/default`, below start of *server* section:

        location ~ [^/]\.php(/|$) {
          fastcgi_param REQUEST_METHOD $request_method;
          fastcgi_pass unix:/var/run/php5-fpm.sock;
          fastcgi_index index.php;
          include fastcgi_params;
        }

Restart nginx by running:

        /etc/init.d/nginx reload
        
#Test
Done! Let's test the web server. Just write the following content in /var/www/html/index.php:

        <?php
        phpinfo();
        ?>

And now go to http://example.com/index.php and, if everything is ok, you will see the phpinfo for the installed version.
      
{: .note}
>
> At this point, you already have a working nginx+PHP server, and the performance should be quite good.
>
> Anyway, it can be even better, so continue reading  :)

#Performance tuning
Performance is highly application and hardware dependent. This document will try to make some general advices on performance, and then will help you measure your application needs and size your linode to fine-tune the performance.

##Nginx performance

### Workers

First thing to check, is the number of processes running and the number of connections the server can handle.

The worker_processes directive in `/etc/nginx/nginx.conf` is the number of system processes handling requests. If this number is too big, there will be lots of context switches and therefore, a lot of time lost.
On the other hand, a small number of processes will make some cores to be idle, and we want them working.

A good approach is to match the workers number to the cores available in your system. Fin the "worker processes" directive in /etc/nginx/nginx.conf and set it to your number of cores:
        
        worker_processes 4;

The worker_connections directive is a bit harder to set. If you foresee few visitors, don't worry much and set it to 512, but if you are reading this you are likely expecting high traffic. You should set this directive to the number of requests divided by the number of cores your server can handle.

If your web app has an homogeneous behavior,  
i.e., it uses about the same memory and about the same cpu time each time it is called, it is easier to set a good value for *worker_connections*.

If not the case, the best way to find an appropriate value is by monitoring the production system. 512 is a good starting point, and your target is to set this value as high as you can without "going over", without filling the memory, and keeping reasonable response times.
To set this, just edit the "worker_connections" limit in "/etc/nginx/nginx.conf":

        worker_connections 512;

We can lower latency on our nginx server by allowing processes to accept several new connections at a time. Do this by uncommenting the following line in your `/etc/nginx/nginx.conf` file.

        multi_accept on;

### Logging

Another way to improve performance is to reduce I/O. This can be done in several ways. One of them is reduce or even disable logging: if you don't need access log, disable them.
It is done by adding the following directives to "/etc/nginx/nginx.conf":

          access_log off;
          log_not_found off; 

Another less dramatic solution, is to keep logs in memory until a certain buffer is filled, and then flush them to disk. They can also be compressed, which will cause an small cpu overhead but will result in less disk writing.
You can add "flush=#m" to the "access_log" directive in the following way:

        access_log /var/log/nginx/access.log combined gzip flush=5m;

It is also helpfull to keep logs in a ram-disk, the problem is that if the server reboots, the logs will be lost, so use this with caution.

### Caching

To avoid reading files from disk every time a client makes a request, we should enable caching. Only do this on production servers, not on development servers.

You can enable nginx cache adding the following lines to your `/etc/nginx/nginx.conf` file, inside the *http* section.

        open_file_cache max=2000 inactive=20s; 
        open_file_cache_valid 60s; 
        open_file_cache_min_uses 5; 
        open_file_cache_errors off;
        

{: .caution}
>
> Remember that performance highly depends on your application, so if you really need top performance, [consider caching at application level](https://www.linode.com/docs/databases/redis/).

##PHP-FPM performance

PHP-FPM launches some daemons, which wait for incoming requests to process PHP. The same as above, one obvious tune is to disable logging, but in this case the proper action would be solve errors/warning on the PHP application.

What we should adjust is the number of daemons waiting to run PHP.

By default, the number is dynamic, what means daemons are launched on demand. This causes higher latency.

Depending on the needs of the application, while running, some of them could go to iowait, so the number highly depends on the number of cores available and the % of time the application is waiting for the disk or a database. A good starting point may be 4*number_of_cores, and reduce it if you find there is not enough memory.
Edit the "pm.max_children =" and the "pm=" directives in "/etc/php5/fpm/pool.d/www.conf":

        pm = static
        pm.max_children = 20

Depending on your site complexity, you will need to increase the `memory_limit` variable on `/etc/php5/fpm/php.ini`. The ideal scenario is where:

        memory_limit * pm.max_children < average free memory

This is not always possible since some pages may allocate higher amounts of memory.

After modifying PHP-FPM setup, just restart it.

        /etc/init.d/php5-fpm restart

#Next steps

Put your application online, monitor it and check its memory and cpu needs. According to that, tweak previous parameters as explained, and if necessary, use a bigger machine.

A few good tools to do this are iotop, htop, zabbix (for the long term), ps, free...

- `iotop` will show you which processes are consuming high disk bandwidth. If nginx or PHP stays on top with high IO% for a few seconds, that means you are using slow disks or your application needs to read or write too much to disk, take a look because this is one of the most common performance killers.

        apt-get install iotop

- `htop` nicely shows the process list, memory and swap allocation, load, uptime... almost everyting you need to know if your server is running healthy. If load is over the number of cores, memory is almost full, swap is starting to fill, or other weird things are happening, that may mean your setup is not the appropiate for your hardware.

        apt-get install htop

- `zabbix` is (imho) the best open source monitoring tool, altough it is a bit complex to install. You can get more information [on zabbix.com](http://www.zabbix.com/).

Other tools, like `ps`, `free` and much others, are usefull when you need a particular data, because its performance is higher than that of the previous tools, but will not offer you a more complete overview of your system.

