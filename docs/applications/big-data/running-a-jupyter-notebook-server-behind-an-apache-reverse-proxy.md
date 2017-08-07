---
author:
    name: Sam Foo 
    email: docs@linode.com
description: 'How to access a Jupyter notebook remotely and securely through an Apache reverse proxy'
keywords: 'storm,analytics,big data,zookeeper'
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
published: 'Friday August 4th, 2017'
modified: Friday August 4th, 2017
modified_by:
    name: Sam Foo
title: 'Running a Jupyter Notebook Server Behind an Apache Reverse Proxy'
external_resources:
 - '[Jupyter Notebook Documentation](https://jupyter-notebook.readthedocs.io/en/stable/)'
 - '[Anaconda Documentation](https://docs.continuum.io/)'
 - '[Certbot](https://certbot.eff.org/)'
---

Jupyter Notebook is an interactive enhanced shell that can be run in the web browser that is popular among data scientists. The Notebook supports inline rendering of figures, exporting to a variety of formats, and LaTeX for mathematical notation. This guide aims to setup a Jupyter Notebook server on a Linode to allow access to your computation needs remotely.

## Before You Begin

You will need:

 - [A Linode you can connect to via SSH](/docs/getting-started)
 - [Anaconda](https://www.continuum.io/what-is-anaconda)

## Install Jupyter Notebook 

Anaconda is a package manager with built in support for virtual environments that also comes with installation of Jupyter notebooks. This is the recommended method of installation from the documentation.

1.  SSH into your Linode and install the latest version of Anaconda. The example below downloads the version of Anaconda with Python 3.6, but Python 2.7 is also available:

        wget https://repo.continuum.io/archive/Anaconda3-4.4.0-Linux-x86_64.sh

2.  Run the downloaded installation script using this command:

        bash ~/Anaconda3-4.4.0-Linux-x86_64.sh

3.  Follow the prompts in the terminal, accept the license usage terms, and allow the installer create a PATH in `.bashrc`.

4.  Reload the new `.bashrc` changes with:

        exec bash

5.  Start the server by running:

        jupyter notebook

    The server will start on `localhost:8888`. To stop running, press `ctrl`+`c` and press enter **yes** when prompted.

## Setting Up Apache Reverse Proxy

1.  Install Apache 2.4:

        sudo apt install apache2

2.  Enable mod_proxy, mod_proxy_http, mod_proxy_wstunnel, ssl

        sudo a2enmod

    {: . note}
    >Your choices are: access_compat actions alias allowmethods asis auth_basic auth_digest auth_form authn_anon authn_core authn_dbd authn_dbm authn_file authn_socache authnz_fcgi authnz_ldap authz_core authz_dbd authz_dbm authz_groupfile authz_host authz_owner authz_user autoindex buffer cache cache_disk cache_socache cgi cgid charset_lite data dav dav_fs dav_lock dbd deflate dialup dir dump_io echo env expires ext_filter file_cache filter headers heartbeat heartmonitor ident include info lbmethod_bybusyness lbmethod_byrequests lbmethod_bytraffic lbmethod_heartbeat ldap log_debug log_forensic lua macro mime mime_magic mpm_event mpm_prefork mpm_worker negotiation proxy proxy_ajp proxy_balancer proxy_connect proxy_express proxy_fcgi proxy_fdpass proxy_ftp proxy_html proxy_http proxy_scgi proxy_wstunnel ratelimit reflector remoteip reqtimeout request rewrite sed session session_cookie session_crypto session_dbd setenvif slotmem_plain slotmem_shm socache_dbm socache_memcache socache_shmcb speling ssl status substitute suexec unique_id userdir usertrack vhost_alias xml2enc
    >Which module(s) do you want to enable (wildcards ok)?

    proxy proxy_http proxy_https proxy_wstunnel ssl headers

3.  Navigate to `/etc/apache2/sites-available` director. Copy the default configuration file then add directives on virtualhost:

        cp 000-default.conf jupyter.conf

    {: .file-excerpt}
    /etc/apache2/sites-available/jupyter.conf
    :   ~~~conf
        <VirtualHost *:443>
            ServerAdmin webmaster@localhost
            DocumentRoot /var/www/html

            ErrorLog ${APACHE_LOG_DIR}.error.log
            CustomLog ${APACHE_LOG_DIR}/access.log combined

            SSLProxyEngine On
            ServerName localhost
            ProxyPreserveHost On
            LogLevel debug

            <Location "/jupyter">
                ProxyPass   http://localhost:8888/jupyter
                ProxyPassReverse   http://localhost:8888/jupyter
                ProxyPassReverseCookieDomain localhost your.linode.ip
                RequestHeader set Origin "http://localhost:8888"
            </Location>

            <Location "/jupyter/api/kernels">
                ProxyPass   wss://localhost:8888/jupyter/api/kernels
                ProxyPassReverse    wss://localhost:8888/jupyter/api/kernels
            </Location>

            <Location "/jupyter/terminals/websocket">
                ProxyPass   wss://localhost:8888/jupyter/terminals/websocket
                ProxyPassReverse    wss://localhost:8888/jupyter/terminals/websocket
            </Location>
        </VirtualHost>
        ~~~

4.  Enable the newly created configuration:

        sudo a2ensite jupyter.conf

5.   Restart the Apache server:

        sudo service apache2 restart

## Create SSL Certificate with OpenSSL 

1.  Create a self-signed certificate valid for 365 days.

        openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem

    This command will create a `key.pem` and `certificate.pem`

2.  Restrict the files to only be read from the owner.

        chmod 400 key.pem
        chmod 400 certificate.pem

## Jupyter Notebook Configurations

1.  Generate a new configuration file. This will create a `~/.jupyter` directory:

        jupyter notebook --generate-config

2.  Create a password for the notebook.

        jupyter notebook password

3.  Copy the password from the newly created `jupyter_notebook_config.py` file.

2.  Uncomment lines from the Jupyter Notebook configuration file. Paste the password from the previous step:

    {: .file-excerpt }
    /.jupyter/jupyter-notebook-config.py
    :   ~~~ conf
        c.NotebookApp.keyfile = '/path/to/key.pem'
        c.NotebookApp.certfile = '/path/to/certificate.pem'
        c.NotebookApp.ip = '*'
        c.NotebookApp.password = 'paste_hashed_password_here'
        c.NotebookApp.base_url = '/jupyter'
        c.NotebookApp.open_browser = False
        ~~~

2.  Do you need to point back to path of certs?






