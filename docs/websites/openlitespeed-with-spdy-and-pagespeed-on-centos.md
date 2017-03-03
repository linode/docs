Install OpenLiteSpeed Web Server with Spdy and Pagespeed on CentOS 6
--------------------------------------------------------------------

![/docs/assets/OpenLiteSpeed1.png](/docs/assets/OpenLiteSpeed1.png)

OpenLiteSpeed is a high-performance, lightweight, open source HTTP server developed and copyrighted by LiteSpeed Technologies. Users are free to download, use, distribute, and modify OpenLiteSpeed and its source code in accordance with the precepts of the GPLv3 license.

SPDY (pronounced speedy) is an open networking protocol developed primarily at Google for transporting web content. SPDY manipulates HTTP traffic, with particular goals of reducing web page load latency and improving web security.

PageSpeed Module speeds up your site and reduces page load time. This open-source webserver module automatically applies web performance best practices to pages and associated assets (CSS, JavaScript, images) without requiring that you modify your existing content or workflow.

This tutorial explains how to install and configure the OpenLiteSpeed Web Server with mod_spdy and mod_pagespeed on CentOS 6. We will be performing the installation through the terminal; please make sure you are logged into your Linode as root via SSH.

This document assumes that you already have a working and up to date CentOS 6 system. If you have not followed our [getting started](/docs/getting-started/) guide, we recommend that you do so prior to following these instructions.


Set the Hostname
----------------

Before you begin installing and configuring the components described in this guide, please make sure you’ve followed our instructions for setting your hostname. Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Install OpenLiteSpeed
---------------------

The following packages need to be installed before compiling and installing OpenLiteSpeed: pcre, expat, openssl, geoip, zlib

    yum install epel-release
    yum install gcc gcc-c++ make autoconf glibc
    yum install pcre-devel expat-devel openssl wget openssl-devel geoip-devel zlib-devel

You can download the OpenLiteSpeed package right [here](http://open.litespeedtech.com/mediawiki/index.php/Downloads)
Download and decompress the package:

    wget http://open.litespeedtech.com/packages/openlitespeed-1.4.2.tgz
    tar -xvf openlitespeed-1.4.2.tgz
    cd openlitespeed-1.4.2
    ./configure --with-password=123456 --with-openssl=/usr --enable-spdy 
    make && make install

Note: 

    use the --with-password=123456 option to build OpenLiteSpeed with the default password 123456 for the WebAdmin console
    use the --enable-spdy option to build OpenLiteSpeed with SPDY enabled
    use the --with-openssl=/usr option to build OpenLiteSpeed with openssl, the default OpenSSL location is /usr.



Install mod_pagespeed for OpenLiteSpeed:

    cd src/modules/pagespeed
    ./ccc.sh
    make
    cp modpagespeed.so /usr/local/lsws/modules



Start OpenLiteSpeed
-------------------

    service lsws start
    chkconfig lsws on

Check port OpenLiteSpeed Web Server running (port 8088 and 7080):

    [root@C65 pagespeed]# netstat -lnt
    Active Internet connections (only servers)
    Proto Recv-Q Send-Q Local Address               Foreign Address             State
    tcp        0      0 0.0.0.0:22                  0.0.0.0:*                   LISTEN
    tcp        0      0 0.0.0.0:8088                0.0.0.0:*                   LISTEN
    tcp        0      0 0.0.0.0:7080                0.0.0.0:*                   LISTEN

You need to disable the Iptables Firewall (or allow traffic on port 8088 and 7080):

    service iptables stop


You may now visit the WebAdmin console in your web browser https://your_ip:7080/ with User:admin |Password:123456

![/docs/assets/OpenLiteSpeed2.png](/docs/assets/OpenLiteSpeed2.png)

A sample site should be running on the server. WebAdmin > Home > Virtual Host > Example
Note:

    Example's Home Dir: /usr/local/lsws/Example/html/

![/docs/assets/OpenLiteSpeed3.png](/docs/assets/OpenLiteSpeed3.png)

To access your site, point your browser to http://your_ip:8088/

![/docs/assets/OpenLiteSpeed4.png](/docs/assets/OpenLiteSpeed4.png)

"8088" is the default port, you can change it: WebAdmin > Home > Listener > Default > Edit

![/docs/assets/OpenLiteSpeed5.png](/docs/assets/OpenLiteSpeed5.png)

Enable mod_pagespeed speeds up your site: WebAdmin > Home > Server Configuration > Modules > Add

![/docs/assets/OpenLiteSpeed6.png](/docs/assets/OpenLiteSpeed6.png)

Enter the name of the module as "modpagespeed"
Set parameters

    pagespeed on
    pagespeed FileCachePath /tmp/lshttpd/pagespeed
    pagespeed RewriteLevel CoreFilters

Save and Graceful restart

![/docs/assets/OpenLiteSpeed7.png](/docs/assets/OpenLiteSpeed7.png)
![/docs/assets/OpenLiteSpeed8.png](/docs/assets/OpenLiteSpeed8.png)

Access your site, point your browser to http://your_ip/phpinfo.php to view info of PHP

![/docs/assets/OpenLiteSpeed9.png](/docs/assets/OpenLiteSpeed9.png)

You can check mod_pagespeed by looking at your page's source:

Set parameters pagespeed off:

![/docs/assets/OpenLiteSpeed10.png](/docs/assets/OpenLiteSpeed10.png)

Set parameters pagespeed on:

![/docs/assets/OpenLiteSpeed11.png](/docs/assets/OpenLiteSpeed11.png)

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [OpenLiteSpeed Home](http://open.litespeedtech.com/)
- [OpenLiteSpeed Forum](http://openlitespeed.com/)
- [PageSpeed Module Google developers](https://developers.google.com/speed/pagespeed/module)
- [Spdy Project Home](https://code.google.com/p/mod-spdy/)
