Intall PHP5, mod_fcgid, PHP-FPM and Configuring them for use with Apache
-------------------------------
PHP makes it possible to produce dynamic and interactive pages using your own scripts and popular web development frameworks. By default, Apache makes requests with mod_php, a non-threaded Apache module, which requires Prefork-MPM. As a result the server forks a child process for each client request in anticipation of new requests so that the process doesn't cause response time latency. With Prefork-MPM, a file is read in an identical and independent manner on each request, without taking any previous requests into account. As a result, when a visitor's actions on a website involve a request on the system, the PHP interpreter must be activated, put in memory, list the required elements, find them and then check that the code is valid. Finally, when all of this is complete, the request gets executed.

By contrast, using mod_fcgid with PHP-FPM, the elements and instructions that are called on when a request is made get cached as child processes, to be reused directly if the same request is made again. FastCGI was introduced as a middle ground between the PHP Apache Module and the CGI application. It allows scripts to be executed by an interpreter outside of the web server and includes the security benefits of CGI but doesn’t include any of the inefficiencies of CGI. When executing PHP scripts with FastCGI each request is passed from the web server to FastCGI via a communication socket. This allows for much greater scalability as the web server and the PHP interpreter can be split into their own individual server environments if necessary, this is what is known as pooling. Their interpretation is thus much faster, as is the page loading that follows. 


1. Ubuntu includes packages for installing PHP5 with support for PHP5-FPM. From the terminal, issue the following command:

        sudo apt install libapache2-mod-fastcgi php5-fpm php5

2. We will now configure Apache to pass all requests for PHP files, with the _php_ file extension, to the PHP wrapper through FastCGI. Once PHP5 is installed we'll want to ensure that the PHP5-FPM module is enabled. Issue the following command to do this:

        sudo a2enmod actions fastcgi alias
        sudo a2enconf php5-fpm

3. It is best to configure PHP-FPM to use UNIX sockets instead of TCP. To verify if this is already the case, issue the following command in your terminal:

        sudo grep -E '^\s*listen\s*=\s*[a-zA-Z/]+' /etc/php5/fpm/pool.d/www.conf

    You should see the following output:

        listen = /var/run/php5-fpm.sock

    If you see the above output, skip to step 6.

3. If no output is returned, you will need to edit the following file and add this line:

    {: .file-excerpt } 
    etc/php5/fpm/pool.d/www.conf
    :   ~~~
        listen = /var/run/php5-fpm.sock
        ~~~

4. Find the following line and comment it out, if it is not already.

    {: .file-excerpt }
    /etc/php5/fpm/pool.d/www.conf
    :   ~~~
        listen = 127.0.0.1:9000
        ~~~

5. Restart the php5-fpm daemon for these changes to take effect.

        sudo service php5-fpm restart

6. Check for the version of Apache with the following command.

        apache2 -v

7. We will need to modify the file `fastcgi.conf`. As with all default configuration files, it is a good idea to back them up before modifying them in case you need to start over. Backup `fastcg.conf` by entering the following command:

        sudo cp /etc/apache2/mods-enabled/fastcgi.conf ~/fastcgi.conf.backup

8. Depending on your Apache version, edit the following file accordingly.

    **Apache 2.2 or earlier**

    {: .file-excerpt }
    /etc/apache2/mods-enabled/fastcgi.conf
    :   ~~~
        <IfModule mod_fastcgi.c>
         AddType application/x-httpd-fastphp5 .php
         Action application/x-httpd-fastphp5 /php5-fcgi
         Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi
         FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi -socket /var/run/php5-fpm.sock -pass-header Authorization
        </IfModule>
        ~~~

    **Apache 2.4 or later**

    {: .file-excerpt }
    /etc/apache2/mods-enabled/fastcgi.conf
    :   ~~~
        <IfModule mod_fastcgi.c>
         AddType application/x-httpd-fastphp5 .php
         Action application/x-httpd-fastphp5 /php5-fcgi
         Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi
         FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi -socket /var/run/php5-fpm.sock -pass-header Authorization
         <Directory /usr/lib/cgi-bin>
          Require all granted
         </Directory>
        </IfModule>
        ~~~

9. Save the file and check for configuration errors.

        sudo apache2ctl configtest

10. As long as you received _Syntax OK_ as a result of that command, restart the Apache service:

        sudo service apache2 restart

If you did not get the _Syntax OK_ result, check your configuration for errors.

11. Check if the PHP is working by creating and accessing a page with `phpinfo()` displayed. The following command will create info.php in /var/www (default directory for websites in Apache):

        sudo echo "<?php phpinfo(); ?>" > /var/www/info.php

 {: .note }
 >
 >If you get a permissions error, you may need to log in as the root user or change owner with `chown`.


Configuring PHP Pools (Optional)
--------------------------------

PHP-FPM brings in the concept of pools. Using pools you can control the amount of resources dedicated to each virtual host, and also run PHP scripts as different users.

In this section we will create a pool for the domain example.com which is owned by the user **bob**.

1. Create a copy of the original pool file to make changes to using the following command.

        sudo cp /etc/php5/fpm/pool.d/www.conf /etc/php5/fpm/pool.d/example.com.conf

2. Edit the file to change the site name, socket name, and user/group.

    {: .file-excerpt }
    /etc/php5/fpm/pool.d/example.com.conf
    :   ~~~
        ; Start a new pool named 'www'.
        ; the variable $pool can we used in any directive and will be replaced by the
        ; pool name ('www' here)
        [example.com]

        ...

        ; Unix user/group of processes
        ; Note: The user is mandatory. If the group is not set, the default user's group
        ;       will be used.
        user = bob
        group = bob

        ...

        listen = /var/run/php5-fpm_example.com.sock
        ~~~

3. Restart the php5-fpm process for the new pool to be created.

        sudo service php5-fpm restart

4. Edit the virtual host file of example.com to use this PHP-FPM pool

    {: .file-excerpt }
    /etc/apache2/sites-available/example.com.conf
    :   ~~~
        <VirtualHost *:80>
            ServerAdmin webmaster@example.com
            ServerName example.com
            ServerAlias www.example.com
            DocumentRoot /var/www/example.com/public_html/
            ErrorLog /var/www/example.com/error.log
            CustomLog /var/www/example.com/access.log combined

            <IfModule mod_fastcgi.c>
                AddType application/x-httpd-fastphp5 .php
                Action application/x-httpd-fastphp5 /php5-fcgi
                Alias /php5-fcgi /usr/lib/cgi-bin/php5-fcgi_example.com
                FastCgiExternalServer /usr/lib/cgi-bin/php5-fcgi_example.com -socket /var/run/php5-fpm_example.com.sock -pass-header Authorization
            </IfModule>

        </VirtualHost>
        ~~~

5. Check the configuration file for errors.

        sudo apache2ctl configtest

6. If there were no errors, restart Apache.

        sudo apache2 restart

7. Create a PHP file inside the `DocumentRoot` of this domain to check the owner of this PHP-FPM pool.

    {: .file-excerpt }
    /var/www/example.com/public_html/user.php
    :   ~~~
        <?php
        $processUser = posix_getpwuid( posix_geteuid() );
        print $processUser('name');
        ?>
        ~~~

8. Access the following URL in a web browser, replacing example.com with your domain or IP address.

        http://example.com/user.php

The page should say **bob**.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

[PHP-FPM configuration directives](http://php.net/manual/en/install.fpm.configuration.php)
[mod_fastcgi configuration directives](http://www.fastcgi.com/mod_fastcgi/docs/mod_fastcgi.html)



Congratulations! You have now set up and configured a LAMP stack for Ubuntu 14.04 with support for Fast-cgi, using PHP-FPM.
