---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Set up and configure WildFly as your Java Application Server to develop, test, and run, Java applications'
keywords: 'java,jboss,jboss as,wildfly,apache,mysql,mariaDB'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Friday, July 31st, 2015'
modified: Friday, July 31st, 2015
modified_by:
    name: Linode
title: 'Java Development with WildFly on CentOS 7'
contributor:
    name: Ashraf Fouad
    link: https://github.com/ashraffouad
external_resources:
 - '[WildFly Administration Guide](https://books.google.com.sa/books?id=rufiBAAAQBAJ)'
---

JBoss AS (Renamed to [WildFly](http://wildfly.org/)) has been used for many years as one of the best performing & free community Java Application Servers. Attention increased when Red Hat started providing commercial support to its enterprise version [JBoss EAP](http://www.redhat.com/en/technologies/jboss-middleware/application-platform).

Many software companies working with Java technology are using the WildFly on CentOS stack, as it supports clients with limited budget, and is compatible with JBoss EAP on Redhat for customers looking for commercial support.

This article shows one of the most common Java application hosting stack architectures:

-  CentOS 7: The operating system.
-  MySQL: A **R**elational **D**ata**B**ase **M**anagement **S**ystem (**RDBMS**). 
-  WildFly 8.2: The Java Application Server.
-  Apache: An HTTP Server for serving static content and reverse proxy services.

This configuration will work on a Linode 1GB, consuming about 650MB of RAM with a sample app, but you may need to scale up depending on the application.

 {: .note }
>
> This guide is written for non-root users. Commands that require elevated privileges are prefixed with sudo. If you are not familiar with the sudo command, you can check out our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before You Begin

-   Follow the steps in our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server/) guide, but skip the section on Creating a Firewall as `iptables` has been replaced in CentOS 7 with [FirewallD](https://fedoraproject.org/wiki/FirewallD).

-   Start & enable FirewallD

        sudo systemctl start firewalld
        sudo systemctl enable firewalld

-   Please follow the steps  in the [Hosting a Website](https://www.linode.com/docs/websites/hosting-a-website)  sections "Installing MySQL", "Optimizing MySQL for a Linode 1GB", "Creating a Database".


### Oracle Java 8 SE installation

{: .note}
>
> Oracle consistently updates Java, so the steps below ensure you are getting the latest updated Java version. In all commands below, be sure to replace all instances of `jdk1.8.0_51` with the appropriate version.

1.  In any browser go to [Oracle Java SE download page](http://www.oracle.com/technetwork/java/javase/downloads/index.html).

2.  Select Java **JDK 8** download.

3.  Accept the license agreement.

4.  Copy the link location of Linux x64 bit download with extension `tar.gz`.

    ![The JDK download.](/docs/assets/wildfly-java-download.png)

5.  Switch to destination folder:

        cd /opt
  
6.  Download Java. Remember to replace the URL in the command below with the link from step 4:

        sudo wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.tar.gz"
 
7.  Extract the file:

        sudo tar xzf jdk-*.tar.gz
 
8.  Install Java with the `alternatives` command. This method allows you to install and manage multiple versions of Java.

        cd /opt/jdk1.8.0_51/
        sudo alternatives --install /usr/bin/java java /opt/jdk1.8.0_51/bin/java 2
        sudo alternatives --config java

    It will output:

        There is 1 program that provides 'java'.
        Selection    Command
          *+ 1           /opt/jdk1.8.0_51/bin/java

        Enter to keep the current selection[+], or type selection number: 1

    Select `1`.

9.  Setup *javac* and *jar* commands path using alternatives, then check the java version installed.

        sudo alternatives --install /usr/bin/jar jar /opt/jdk1.8.0_51/bin/jar 2
        sudo alternatives --install /usr/bin/javac javac /opt/jdk1.8.0_51/bin/javac 2
        sudo alternatives --set jar /opt/jdk1.8.0_51/bin/jar
        sudo alternatives --set javac /opt/jdk1.8.0_51/bin/javac
 
        java -version
        java version "1.8.0_45"
        Java(TM) SE Runtime Environment (build 1.8.0_45-b14)
        Java HotSpot(TM) 64-Bit Server VM (build 25.45-b02, mixed mode)

10. Configure environment variables:

        export JAVA_HOME=/opt/jdk1.8.0_51
        export JRE_HOME=/opt/jdk1.8.0_51/jre
        export PATH=$PATH:/opt/jdk1.8.0_51/bin:/opt/jdk1.8.0_51/jre/bin
 
11. The above variables will work for this session only. To be reboot persistent, create a new file called `/etc/profile.d/java.sh`:

    {: .file}
    /etc/profile.d/java.sh
    :   ~~~ shell
        if ! echo ${PATH} | grep -q /opt/jdk1.8.0_51/bin ; then
           export PATH=/opt/jdk1.8.0_51/bin:${PATH}
        fi
        if ! echo ${PATH} | grep -q /opt/jdk1.8.0_51/jre/bin ; then
           export PATH=/opt/jdk1.8.0_51/jre/bin:${PATH}
        fi
        export JAVA_HOME=/opt/jdk1.8.0_51
        export JRE_HOME=/opt/jdk1.8.0_51/jre
        export CLASSPATH=.:/opt/jdk1.8.0_51/lib/tools.jar:/opt/jdk1.8.0_51/jre/lib/rt.jar
        ~~~

12. For the C shell, create a new file called `/etc/profile.d/java.csh`:

    {: .file}
    /etc/profile.d/java.csh
    :   ~~~ shell
        if ( "${path}" !~ */opt/jdk1.8.0_51/bin* ) then
           set path = ( /opt/jdk1.8.0_51/bin $path )
        endif
        if ( "${path}" !~ */opt/jdk1.8.0_51/jre/bin* ) then
           set path = ( /opt/jdk1.8.0_51/jre/bin $path )
        endif
        setenv JAVA_HOME /opt/jdk1.8.0_51
        setenv JRE_HOME /opt/jdk1.8.0_51/jre
        setenv CLASSPATH .:/opt/jdk1.8.0_51/lib/tools.jar:/opt/jdk1.8.0_51/jre/lib/rt.jar
        ~~~

13. Change the owner and access for the profile files:

        sudo chown root:root /etc/profile.d/java.sh
        sudo chmod 755 /etc/profile.d/java.sh
        sudo chown root:root /etc/profile.d/java.csh
        sudo chmod 755 /etc/profile.d/java.csh

14. Now Java is available to everyone in system.

## WildFly 8.2 installation

We'll install WildFly using a shell script. This script is based on a great article & code mentioned in "Dmitriy Sukharev. IT Blog", the original article & script can be found [here](http://sukharevd.net/wildfly-8-installation.html). This version has been modified to:

-  Add backups to some important files before modification.

-  Solve warning messages regarding using JDK 8 with WildFly (Default is JDK 7).

-  Add scripts for firewalld to get WildFly working on your Linode instance.

-  Enable access from anywhere for admin console (Recommended for development environment only).

-  Remove other Linux distros, only CentOS is available for simplicity.

-  Start WildFly automatically at boot.

-  Show progress on screen for some commands.

-  Add more comments for someone with basic CentOS & Linux knowledge.


    You can view or download the file [here](/docs/assets/wildfly-install.sh), or download it directly to your linode:

        wget https://linode.com/docs/assets/wildfly-install.sh

1.  Save the script as `/opt/wildfly-install.sh`:

2.  Make the script executable:

        sudo chmod +x /opt/wildfly-install.sh

3.  Run the script:

        cd /opt
        sudo ./wildfly-install.sh
 
4.  You will need to add to add a management user (Web and/or CLI) to be able to access the management console. WildFly provides a script that can guide you through this process, `/opt/wildfly/bin/add-user.sh`:

    1.  Select option a for Management user.
    2.  Username: type_the_username 
    3.  Password: type_the_password
    4.  What groups do you want this user to belong to? Leave empty and click Enter
    5.  About to add user ... Is this correct? yes
    6.  Is this new user going to be used for one AS process to connect to another AS process? yes (Just in-case, we need this in the future, i.e. domain setup).
    7.  You will get this message: To represent the user add the following to the server-identities definition, this is just to be used in domain installation just keep it if you needed to switch to domain installation later.

    You can now test WildFly by going to your IP or FQDN in your browser, appending `:8080` to the URL. The WildFly Admin console should load.
 
5. We suggest that you install any sample application (use your own, or get the [default sample from Tomcat](https://tomcat.apache.org/tomcat-6.0-doc/appdev/sample/)) and make sure it is working using the port 8080, as it will be used when testing after adding Apache HTTP. The sample application can be deployed from the WildFly admin console.

### Configure MySQL Driver in WildFly & Add DataSource

These steps will install the MySQL driver as a "module" in WildFly.

1.  Log in as root, and create a folder within the WildFly installation for the new module:
 
        su
        mkdir -p /opt/wildfly/modules/com/mysql/main

 
2.  Download and uncompress the [JDBC driver for mysql](http://dev.mysql.com/downloads/connector/j/) package. Move (`mysql-connector-java-*-bin.jar`) to `/opt/wildfly/modules/com/mysql/main`.

        mv mysql-connector-java-5.1.36/mysql-connector-java-5.1.36-bin.jar /opt/wildfly/modules/com/mysql/main/

3.  Create a file `/opt/wildfly/modules/com/mysql/main/module.xml` inserting the following information, replacing the `mysql-connector-java-5.1.36-bin.jar` with the correct version:

    {: .file}
    /opt/wildfly/modules/com/mysql/main/module.xml
    :   ~~~ xml
        <module xmlns="urn:jboss:module:1.3" name="com.mysql">
           <resources>
               <resource-root path="mysql-connector-java-5.1.36-bin.jar"/>
           </resources>
           <dependencies>
               <module name="javax.api"/>
               <module name="javax.transaction.api"/>
           </dependencies>
        </module>
        ~~~
 
4.  Change ownership to the `wildfly` user:

        chown -R wildfly:wildfly /opt/wildfly/modules

5.  Define the MySQL driver in `/opt/wildfly/standalone/configuration/standalone.xml`:

    {: .file-excerpt}
    /opt/wildfly/standalone/configuration/standalone.xml
    :   ~~~ xml
        <drivers>
            <driver name="h2" module="com.h2database.h2">
                <xa-datasource-class>org.h2.jdbcx.JdbcDataSource</xa-datasource-class>
            </driver>
            <driver name="mysqlDriver" module="com.mysql">
                <xa-datasource-class>com.mysql.jdbc.jdbc2.optional.MysqlXADataSource</xa-datasource-class>
            </driver>
        </drivers>
        ~~~

6.  Restart WildFly:

        systemctl restart wildfly
 
7.  Login to the management console at `http://123.45.67.89:9990/console`, substituting `123.45.67.89` with your IP or domain name.

8.  Click **Configuration**, then on the left menu **SubSystems** -> **Connector** -> **DataSources**. In the **DataSources**0 tab, click **Add**.

9.  For step 1 set:

    -   **Name:** MySQLDS
    -   **JNDI Name:** java:/datasource/MySQLDS

    Click **Next**.

10. In step 2 select the **mysqlDriver** listed and click **Next**.

11. In step 3 insert `jdbc:mysql://localhost:3066/type_db_name` as your **Connection URL**, replacing `type_db_name` with your database name, and set the username and password to your MySQL username and password. Leave the **Security Domain** blank.

    Click **Test Connectivity** and then **Done**.

12. Select the MySQLDS Datasource, and click **Enable**.

13. From your terminal, exit the root user session:

        exit

WildFly is now connected to MySQL.

## Apache HTTP Server installation

1.  Install Apache:
    
        sudo yum install -y httpd

2.  Start and enable Apache:
 
        sudo systemctl start httpd
        sudo systemctl enable httpd

3.  Add a firewall exception for port 80:

        sudo firewall-cmd --permanent --add-port=80/tcp
        sudo firewall-cmd --reload

4.  Backup your default Apache configuration: 

        sudo cp /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd-org.conf

You can test your installation by opening a browser and navigating to `http://123.45.67.89`, replacing the IP address with your own. You should see the Apache test page.

### Configuring Apache HTTP as reverse proxy for WildFly using mod_jk

There are multiple ways to set Apache HTTP to direct calls to WildFly (mod\_jk, mod\_proxy, mod\_cluster), the decision mainly to select mod_jk was based on [this article](http://www.programering.com/a/MTO3gDMwATg.html), which has been referenced on several other sites.

1.  `mod_jk` provided by Tomcat needs to be built on the server. Start by installing build & make tools:

        sudo yum install httpd-devel gcc gcc-c++ make libtool
        sudo ln -s /usr/bin/apxs /usr/sbin/apxs

2.  Download `mod_jk` to a temporary directory and build:

        cd /tmp
        wget http://www.apache.org/dist/tomcat/tomcat-connectors/jk/tomcat-connectors-1.2.40-src.tar.gz
        tar -xf tomcat-connectors-1.2.40-src.tar.gz
        cd /tmp/tomcat-connectors-1.2.40-src/native 
        ./buildconf.sh
        ./configure --with-apxs=/usr/sbin/apxs
        make

3.  Copy `mod_jk.so` to the Apache http modules directory:

        sudo cp /tmp/tomcat-connectors-1.2.40-src/native/apache-2.0/mod_jk.so /usr/lib64/httpd/modules

4.  We need to configure Apache HTTP server to use this module. Create a worker file for mod_jk:

    {: .file}
    /etc/httpd/conf.d/workers.properties
    :   ~~~ conf 
        worker.list=jboss1,jkstatus
        worker.jkstatus.type=status
        worker.jboss1.type=ajp13
        worker.jboss1.port=8009
        # The host should be using IP not server name as reported bug
        # https://www.apachelounge.com/viewtopic.php?t=5883
        worker.jboss1.host=127.0.0.1
        ~~~
 
5.  Create an HTTP configuration file `/etc/httpd/conf/httpd.conf`:

    {: .file}
    /etc/httpd/conf.d/modjk.conf
    :   ~~~ conf
        # To avoid error AH00558: httpd: Could not reliably
        # determine the server's fully qualified domain name
        # replace 1.2.3.4 with your server IP
        ServerName    1.2.3.4
         
        # Load mod_jk
        LoadModule    jk_module modules/mod_jk.so
        JkWorkersFile /etc/httpd/conf.d/workers.properties
        JkLogFile     /var/log/httpd/mod_jk_log
         
        # To be changed to warn in production, the mount point should match your application sample pathes
        JkLogLevel    info
        JKMount       /sample jboss1
        JkMount       /sample/* jboss1
        JKMount       /jkstatus jkstatus
         
        # To avoid write access error in mod_jk
        # https://bugzilla.redhat.com/show_bug.cgi?id=912730
        JKShmFile     /var/tmp/jk-runtime-status
        ~~~
 
6.  Restart Apache:

        sudo systemctl restart httpd

 
7.  Try the URL `http://123.45.67.89/jkstatus`, repalcing `123.45.67.89` with your Linode IP. It should display a page for "JK Status Manager".

8.  We need to configure WildFly to accept calls from Apache HTTP. Open the admin console, and select the **Configuration** Menu -> **Web** -> **HTTP**. Then click the **View** link beside the **default-server**.

9.  Select the **AJP Listener** above, and click **Add**.

    -   **Name:** default.ajp
    -   **Socket binding:** ajp

    Click **Save**, then ensure the **Enabled** attribute is set to **true**.

10. Go to your Linode's IP address. It should show Apache normal testing page. To see if the sample application works, go to `http://123.45.67.89/sample`, replacing `123.45.67.89` if your Linode IP. It should show sample application deployed in JBoss.