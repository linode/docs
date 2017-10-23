---
deprecated: true
author:
  name: Brett Kaplan
  email: docs@linode.com
description: 'Use the Mono project''s Apache module to run ASP.NET applications.'
keywords: 'apache,mono,.net,asp.net,mod\_mono'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['frameworks/mod-mono/ubuntu-9-10-karmic/','websites/frameworks/build-aspnetmono-applications-with-modmono-and-apache-on-ubuntu-9-10-karmic/']
modified: Wednesday, June 15th, 2011
modified_by:
  name: Linode
published: 'Sunday, August 1st, 2010'
title: 'Build ASP.NET/Mono Applications with mod_mono and Apache on Ubuntu 9.10 (Karmic)'
---



`mod_mono` is an Apache module that makes it possible to run ASP.NET applications in Linux environments running Apache. While ASP.NET is a Microsoft technology and is traditionally used with IIS, `mod_mono` has become a viable option for deploying ASP.NET applications on Linux. This guide is largely based on the [mod\_mono guide from the Ubuntu Community](https://help.ubuntu.com/community/ModMono) and the [Mono Project's Apache and Mono document](http://mono-project.com/Mod_mono) with minor modifications. This guide does not cover installation and configuration of the Mono IDE which is used to develop ASP.NET applications on Linux. If you are interested in developing using Visual Studio for Mono, you can download a 30-day trial of the commercial Mono Tools plugin at the [Mono Tools for Visual Studio page](http://go-mono.com/monotools).

This guide assumes that you've followed the steps outlined in our [getting started guide](/docs/getting-started/). You will install the [Apache web server](/docs/web-servers/apache/installation/ubuntu-9-10-karmic) with very minimal configuration. If you already have Apache installed and configured, you may omit these steps; however, if you have not installed Apache and are unfamiliar with this server read the installation guide for additional documentation. Additionally, `mod_mono` is incompatible with the integrated PHP interpreter described in other guides. If you need to have both mod\_mono and PHP running on the same Apache server you will need to run [PHP scripts using the CGI method](/docs/web-servers/apache/php-cgi/ubuntu-9-10-karmic)

Set the Hostname
----------------

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Install Required Software
-------------------------

### Enable Universe Repositories

Before installing `mod_mono` we must ensure that the `universe` repositories are enabled on your system. Your `/etc/apt/sources.list` should resemble the following (you may have to uncomment or add the `universe` lines:)

{: .file }
/etc/apt/sources.list
:   ~~~
    ## main & restricted repositories
    deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
    deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

    deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates main restricted
    deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

    deb http://security.ubuntu.com/ubuntu karmic-security main restricted
    deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

    ## universe repositories
    deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
    deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe

    deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
    deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

    deb http://security.ubuntu.com/ubuntu karmic-security universe
    deb-src http://security.ubuntu.com/ubuntu karmic-security universe
    ~~~

If you had to enable new repositories, issue the following command to update your package lists:

    apt-get update
    apt-get upgrade

### Install Apache

If you already have Apache installed and configured, you can safely skip this section of the guide. Install Apache by running the following command:

    apt-get install apache2

As mentioned earlier, you will need to go to the installation guide if you wish to configure your server beyond the default configuration.

### Install mod\_mono

The Apache daemon must be stopped before `mod_mono` is installed. Issue the following command to stop the apache process:

    /etc/init.d/apache2 stop

At this point we're able to install the required packages for `mod_mono`. Run the following command:

    apt-get install mono-apache-server2 libapache2-mod-mono libmono-i18n2.0-cil

While installing, you will see a prompt that looks like the following:

    Configuration file `/etc/apache2/mods-available/mod_mono.conf'
     ==> File on system created by you or by a script.
     ==> File also in package provided by package maintainer.
       What would you like to do about it ?  Your options are:
        Y or I  : install the package maintainer's version
        N or O  : keep your currently-installed version
          D     : show the differences between the versions
          Z     : background this process to examine the situation
     The default action is to keep your current version.
    *** mod_mono.conf (Y/I/N/O/D/Z) [default=N] ?

Accept the default option at this point. When the installation process completes start Apache with the following command:

    /etc/init.d/apache2 start

### Configure Apache

We recommend using name-based virtual hosts for web hosting. Refer to the Apache documentation for [setting up Name-based virtual hosts](/docs/web-servers/apache/apache-2-web-server-on-ubuntu-9-10-karmic#configure-apache-for-named-based-virtual-hosting).

Recent versions of `mod_mono` utilize the `AutoHosting` method of application deployment. This allows non-privileged users to deploy new applications without modifying Apache configuration files. While this provides great flexibility, it may also present a security risk. As a result, `mod_mono` must be enabled on a per-virtual host basis.

For the sake of this guide, we're going to create a site on the root of our example domain, `example.com`. If you already have an Apache configuration for the root of your site, you will need to modify your existing virtual host file or create a new one on a subdomain of your site. Create the virtual host file, taking the following example virtual host configuration and modifying it to suit your needs. You may also use the [Mod\_Mono Configuration Generator](http://go-mono.com/config-mod-mono/) to generate your own custom configuration.

{: .file-excerpt }
/etc/apache2/sites-available/example.com
:   ~~~ apache
    <VirtualHost 12.34.56.78:80>

      ServerName example.com
      ServerAdmin admin@example.com
      ServerAlias www.example.com
      DocumentRoot /srv/www/example.com/public_html
      ErrorLog /srv/www/example.com/logs/error.log
      CustomLog /srv/www/example.com/logs/access.log combined

      MonoServerPath example.com "/usr/bin/mod-mono-server2"
      MonoDebug example.com true
      MonoSetEnv example.com MONO_IOMAP=all
      MonoApplications example.com "/:/srv/www/example.com/public_html"
      <Location "/">
        Allow from all
        Order allow,deny
        MonoSetServerAlias example.com
        SetHandler mono
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI "\.(?:gif|jpe?g|png)$" no-gzip dont-vary
      </Location>
      <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/javascript
      </IfModule>
    </VirtualHost>
    ~~~

Save and close the file, and create the directories referenced in the `DocumentRoot` and `ErrorLog` directive:

    mkdir -p /srv/www/example.com/public_html
    mkdir /srv/www/example.com/logs

Enable the site by running the `a2ensite` command:

    a2ensite example.com

Since we have modified the virtual host configuration, Apache must be reloaded:

    /etc/init.d/apache2 reload

If you still see the default "It works!" Apache installation page, you may need to disable the default site. Run the following command if this is an issue for you:

    a2dissite default
    /etc/init.d/apache2 reload

Note: Should you restart Apache in the future, you will see an error that will look similar to this:

    [crit] (13)Permission denied: Failed to attach to existing dashboard,
    and removing dashboard file '/tmp/mod_mono_dashboard_XXGLOBAL_1' failed
    (Operation not permitted). Further action impossible.

You can safely ignore this warning, as it won't affect deployment using the methods explained in this guide.

Installing MySQL Connector/Net for ASP.NET
------------------------------------------

This section assumes that you already have a functioning MySQL installation. Please refer to our [MySQL Installation Guide](/docs/databases/mysql/ubuntu-9-10-karmic) for more detailed instructions for installing MySQL, otherwise issue the following command:

    apt-get install mysql-server

In order for your ASP.NET application to communicate properly with your MySQL server, you must install the MySQL Connector/Net driver. The following commands download and install the 6.2.3 version of the connector. Check the [MySQL Upstream](http://dev.mysql.com/downloads/connector/net/) to ensure that this the latest version of the plugin:

    cd /opt/
    wget http://dev.mysql.com/get/Downloads/Connector-Net/mysql-connector-net-6.2.3-noinstall.zip/from/http://mysql.mirrors.pair.com/
    unzip -d mysqlConnector mysql-connector-net-6.2.3-noinstall.zip
    cd mysqlConnector
    gacutil -i mysql.data.dll
    gacutil -i mysql.web.dll

Creating a Database to Test the MySQL Connector
-----------------------------------------------

Now that the MySQL Connector has been installed, you should test it by creating a sample database and a test table. First you must log in to your MySQL DBMS:

    mysql -u root -p

Next you must create the sample table. Issue the following commands at the MySQL prompt:

    CREATE DATABASE sample;
    USE sample;
    CREATE TABLE test (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(25));
    INSERT INTO sample.test VALUES (null, 'Lucy');
    INSERT INTO sample.test VALUES (null, 'Ivan');
    INSERT INTO sample.test VALUES (null, 'Nicole');
    INSERT INTO sample.test VALUES (null, 'Ursula');
    INSERT INTO sample.test VALUES (null, 'Xavier');

Finally you must create a test user named "testuser" and give that user access to the newly created sample database:

    CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'somepassword';
    GRANT ALL PRIVILEGES ON sample.* TO 'testuser'@'localhost';
    FLUSH PRIVILEGES;

Creating a Simple ASP.NET Application
-------------------------------------

Now that you have created a sample database, you can test your installation with the following test page. This will not only test your Mono installation but it will also will test your MySQL connector configuration. First create a file called `testdb.aspx` in your `DocumentRoot` and paste the text below into it. Be sure to change the `User ID` and `Password` to match what you specified above.

{: .file-excerpt }
/srv/www/example.com/public\_html/testdb.aspx
:   ~~~ aspx
    <%@ Page Language="C#" %>
    <%@ Import Namespace="System.Data" %>
    <%@ Import Namespace="MySql.Data.MySqlClient" %>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
    <title>ASP and MySQL Test Page</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <script runat="server">
    private void Page_Load(Object sender, EventArgs e)
    {
    string connectionString = "Server=127.0.0.1;Database=sample;User ID=testuser;Password=somepassword;Pooling=false;";
    MySqlConnection dbcon = new MySqlConnection(connectionString);
    dbcon.Open();

    MySqlDataAdapter adapter = new MySqlDataAdapter("SELECT * FROM test", dbcon);
    DataSet ds = new DataSet();
    adapter.Fill(ds, "result");

    dbcon.Close();
    dbcon = null;

    SampleControl.DataSource = ds.Tables["result"];
    SampleControl.DataBind();
    }
    </script>

    </head>

    <body>
    <h1>Testing Sample Database</h1>
    <asp:DataGrid runat="server" id="SampleControl" />
    </body>

    </html>
    ~~~

Next you will need to create a `web.config` file. You can copy and paste the example below. Please note that `Custom Errors` have been turned off in this web.config for debugging purposes. The `customErrors mode` line should be removed in a production environment.

{: .file-excerpt }
/srv/www/example.org/public\_html/web.config
:   ~~~
    <configuration>
      <system.web>
        <customErrors mode="Off"/>
        <compilation>
          <assemblies>
            <add assembly="MySql.Data"/>
          </assemblies>
        </compilation>
      </system.web>
    </configuration>
    ~~~

Point your browser to the `testdb.aspx` page. If you see the text "Testing Sample Databases" in your browser with the information that you inserted into the database above, you now have a functioning `mod_mono` installation and can continue with the development and deployment of your own application!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Mono Project - Homepage](http://mono-project.com/Mod_mono)
- [Mono Project - Autohosting Documentation](http://www.mono-project.com/AutoHosting)
- [Mod\_Mono Configuration Generator](http://go-mono.com/config-mod-mono/)
- [ModMono - Ubuntu Community Documentation](https://help.ubuntu.com/community/ModMono)



