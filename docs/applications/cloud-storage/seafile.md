

Seafile is a cross-platform file syncing tool with server applications for Linux and Windows, and GUI clients for Android, iOS, Linux, OS X and Windows. It supports file versioning and snapshots, two-factor authentication, WebDAV, 

Seafile has [two editions](https://www.seafile.com/en/product/private_server/): a free and open source Community Edition and a paid Professional edition. However, the Pro edition is free for up to 3 users, so we'll be using that throughout this guide.

Seafile has some fairly advanced configuration setups available. We'll using Seafile Community Edition with nginx serving an https connection, and MariaDB on the backend.



SSH in to your Linode as the Seafile user.


{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Prepare Ubuntu

1.  Update the system:

    apt update && apt upgrade

2.  Set the Linode's hostname. We'll call it *seafile* as an example:

    hostnamectl set-hostname seafile

3.  On first boot, your Linode's timezone will be set to UTC. Changing this is optional, but if you wish, use:

    dpkg-reconfigure tzdata

4.  Create a standard user account with root privileges. Again as an example, we'll call it *sfadmin*:

    adduser sfadmin
    adduser sfadmin sudo

5.  Set the Linode's hostname to *seafile*:

    sed -i '2s/ubuntu/seafile' /etc/hosts

6.  Log out of your Linode's root user account and back in as *sfadmin*:

    exit
    ssh sfadmin&<your_linode's>ip>


## Install and Configure MySQL

1.  During Installation, you will be asked to assign a password for the root mysql user:

    sudo apt install mysql-server-5.7
    
    {note:}
     >Be sure to install the package `mysql-server-5.7`, not `mysql-server`. The package with the version number works correctly, b.

2.  Run the *mysql_secure_installation* script:

    sudo mysql_secure_installation


## Install and Configure nginx

You should now be logged into your Linode as *sfadmin*. This is the username we'll use for congfiguring nginx below. Using nginx with Seafile allows *** and HTTPS connections.

1.  Install nginx from Ubuntu's repository:

    sudo apt install nginx

2.  Create the site configuration file. The only line you need to change below is `server_name`.

    {: .file}
    /etc/nginx/sites-available/seafile.conf
    :   ~~~
server {
    listen 80;
    server_name seafile.example.com;

    proxy_set_header X-Forwarded-For $remote_addr;

    location / {
        fastcgi_pass    127.0.0.1:8000;
        fastcgi_param   SCRIPT_FILENAME     $document_root$fastcgi_script_name;
        fastcgi_param   PATH_INFO           $fastcgi_script_name;

        fastcgi_param    SERVER_PROTOCOL        $server_protocol;
        fastcgi_param   QUERY_STRING        $query_string;
        fastcgi_param   REQUEST_METHOD      $request_method;
        fastcgi_param   CONTENT_TYPE        $content_type;
        fastcgi_param   CONTENT_LENGTH      $content_length;
        fastcgi_param    SERVER_ADDR         $server_addr;
        fastcgi_param    SERVER_PORT         $server_port;
        fastcgi_param    SERVER_NAME         $server_name;
        fastcgi_param   REMOTE_ADDR         $remote_addr;

        access_log      /var/log/nginx/seahub.access.log;
        error_log       /var/log/nginx/seahub.error.log;
        fastcgi_read_timeout 36000;
        client_max_body_size 0;
    }

    location /seafhttp {
        rewrite ^/seafhttp(.*)$ $1 break;
        proxy_pass http://127.0.0.1:8082;
        client_max_body_size 0;
        proxy_connect_timeout  36000s;
        proxy_read_timeout  36000s;
        proxy_send_timeout  36000s;
        send_timeout  36000s;
    }

    location /media {
        root /home/user/sfadmin/seafile-server-latest/seahub;
    }
}
        ~~~

3.  Disable the default site configuration and enable the one you just created:

    sudo rm /etc/nginx/sites-enabled/default
    sudo ln -s /etc/nginx/sites-available/seafile.conf /etc/nginx/sites-enabled/seafile.conf

4.  Run the nginx configuration test and restart the web server:

    sudo nginx -t
    sudo systemctl restart nginx


## Configure and Install Seafile

1.  [Seafile's manual](https://manual.seafile.com/deploy/using_mysql.html) advises of a particular directory tree to ease upgrades.

    mkdir installed

2.  Download the Seafile CE 64 bit Linux server. You'll need to get the exact link from [seafile.com](https://www.seafile.com/en/download/). Once you have the URL, use `wget` to download it to the /home directory of *sfadmin*. 

    wget <link>

3.  Extract the tarball to sfadmin's home and move it when finished:

    tar -xzvf seafile-server*.tar.gz
    mv seafile-server*.tar.gz installed

4.  Install dependency packages for Seafile:

    sudo apt install python2.7 libpython2.7 python-setuptools python-imaging python-ldap python-mysqldb python-memcache python-urllib3

5.  Run the installation script:

    cd seafile-server-* && ./setup-seafile-mysql.sh

6.  Start the server.

    ./seafile.sh start
    ./seahub.sh start

    The `seahub.sh` script will set up an admin user account to log into Seafile with. You'll be asked for a login email and to create a password.

        ![First time starting Seafile](/docs/assets/seafile-firststart.png)

   Seafile now should be accessible from a web browser. You'll find the Seafile login at your Linode's IP address on the default port 8000.

        ![Seafile login prompt](/docs/assets/seafile-login.png)

7. Now that Seafile is installed and running, we'll install nginx. First shut down Seafile:

    ./seafile.sh stop
    ./seahub.sh stop


## Start Seafile Automatically on Sever Bootup

The `seafile.sh` and `seahub.sh` scripts don't automatically run on reboot. To do that, create systemd units to run each script.

/etc/systemd/system/SeafileStart.service

Paste seafile service configuration below:

[Unit]
Description=Seafile Server
After=network.target mysqld.service

[Service]
Type=oneshot
ExecStart=/home/sfadmin/seafile-server-latest/seafile.sh start
ExecStop=/home/sfadmin/seafile-server-latest/seafile.sh stop
RemainAfterExit=yes
User=sfadmin
Group=sfadmin

[Install]
WantedBy=multi-user.target




/etc/systemd/system/SeahubStart.service

[Unit]
Description=Seafile Hub
After=network.target seafile.service

[Service]
Type=oneshot
ExecStart=/home/sfadmin/seafile-server-latest/seahub.sh start
ExecStop=/home/sfadmin/seafile-server-latest/seahub.sh stop
RemainAfterExit=yes
User=sfadmin
Group=sfadmin

[Install]
WantedBy=multi-user.target

## Updating Seafile