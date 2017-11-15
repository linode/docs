---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Set up and configure WildFly as your Java Application Server to develop, test, and run, Java applications'
keywords: ["java", "jboss", "jboss as", "wildfly", "apache", "mysql", "mariaDB"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2015-09-18
aliases: ['applications/development/java-development-wildfly-centos-7/']
modified: 2015-09-18
modified_by:
    name: Linode
title: 'Java Development with WildFly on CentOS 7'
contributor:
    name: Ashraf Fouad
    link: https://github.com/ashraffouad
external_resources:
 - '[WildFly Administration Guide](https://books.google.com.sa/books?id=rufiBAAAQBAJ)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

JBoss AS (Renamed to [WildFly](http://wildfly.org/)) has been used for many years as one of the best known performing & free community Java Application Server. The attention even increased when Red Hat started providing commercial support to its enterprise version [JBoss EAP](http://www.redhat.com/en/technologies/jboss-middleware/application-platform) with support to on-premises, virtual, or cloud. Red Hat also provides commercial support for Red Hat Enterprise Linux & building huge ecosystem of multiple products to serve its clients.

Many software companies working with Java technology are targeting the stack of WildFly on CentOS so it supports clients with limited budget, and also supports JBoss EAP on Redhat Enterprise Linux for customers looking for commercial support, so they ensure their software meets various customer segments.

This article has been introduced to show one of the most common architecture in Java application hosting stack, it consists of:

1.  CentOS 7: As Operating System.
2.  MySQL 5.6.24 Community Server: As RDBMS.
3.  WildFly 8.2 Final: As Java Application Server.
4.  Apache HTTP 2.4.6: As HTTP Server for serving static content & using mod_jk 1.2.40 for directing calls to WildFly (Apache as reverse proxy).

After full installation of above stack it was consuming around 650 MB of RAM with a very small sample application, so maybe you can consider Linode plan 1 GB for small application & larger plan based on your application.

### Target Audience

-   Developers building development server for their project.
-   Application Server Administrator who would like to start switching to WildFly & need some guidance in their standalone setup.

## Before You Begin

-   Please follow the steps mentioned in [Linode: Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) but skip the section Creating a Firewall as iptables has been replaced in CentOS 7 with [firewalld](https://fedoraproject.org/wiki/FirewallD).

-   Start & enable Firewalld

        sudo systemctl start firewalld
        sudo systemctl enable firewalld

-   Please follow the steps mentioned in [Linode: Hosting a Website](https://www.linode.com/docs/websites/hosting-a-website) sections "Installing MySQL", "Optimizing MySQL for a Linode 2GB", "Creating a Database".


### Oracle Java 8 SE installation

{{< note >}}
Oracle is producing many updates for Java, so below steps ensures you are getting the latest updated Java version.
{{< /note >}}

1.  In any browser go to [Oracle Java SE download page](http://www.oracle.com/technetwork/java/javase/downloads/index.html).

2.  Select Java JDK 8 download.

3.  Accept license agreement.

4.  Copy the link location of Linux x64 bit as the product & the download with extension tar.gz not the RPM.

5.  Switch to destination folder:

        cd /opt

6.  Download Java, remember to change the URL with the latest you got in step 4:

        sudo wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.tar.gz"

7.  Extract archived content, remember exact name will differ based on your version

        sudo tar xzf jdk-*.tar.gz

8.  Install Java with Alternatives (I prefer this method as in future you most probably will have multiple versions of Java running on same server, so better use alternative to make sure you know the default version of your OS & be able to change it easily). In the below option for new Linode you will find only 1 option. Be sure to change all instances of `jdk1.8.0_45` to include the correct version:

        cd /opt/jdk1.8.0_45/
        sudo alternatives --install /usr/bin/java java /opt/jdk1.8.0_45/bin/java 2
        sudo alternatives --config java

    It will output:

        There is 1 program that provides 'java'.
        Selection    Command
          *+ 1           /opt/jdk1.8.0_45/bin/java

        Enter to keep the current selection[+], or type selection number: 1

    Select `1`.

9.  Setup *javac* and *jar* commands path using alternatives, then check the java version installed. Replace all instances of `jdk1.8.0_45` with the appropriate version:

        sudo alternatives --install /usr/bin/jar jar /opt/jdk1.8.0_45/bin/jar 2
        sudo alternatives --install /usr/bin/javac javac /opt/jdk1.8.0_45/bin/javac 2
        sudo alternatives --set jar /opt/jdk1.8.0_45/bin/jar
        sudo alternatives --set javac /opt/jdk1.8.0_45/bin/javac

        java -version
        java version "1.8.0_45"
        Java(TM) SE Runtime Environment (build 1.8.0_45-b14)
        Java HotSpot(TM) 64-Bit Server VM (build 25.45-b02, mixed mode)

10. Configure environment variables, replacing `jdk1.8.0_45` with the proper version:

        export JAVA_HOME=/opt/jdk1.8.0_45
        export JRE_HOME=/opt/jdk1.8.0_45/jre
        export PATH=$PATH:/opt/jdk1.8.0_45/bin:/opt/jdk1.8.0_45/jre/bin

11. The above command will work for this session only, but you will need to be added to all system users especially when server reboots, so for the Bourne shell, create a new file called `/etc/profile.d/java.sh`, replacing `jdk1.8.0_45` with the appropriate version:

    {{< file "/etc/profile.d/java.sh" shell >}}
if ! echo ${PATH} | grep -q /opt/jdk1.8.0_45/bin ; then
   export PATH=/opt/jdk1.8.0_45/bin:${PATH}
fi
if ! echo ${PATH} | grep -q /opt/jdk1.8.0_45/jre/bin ; then
   export PATH=/opt/jdk1.8.0_45/jre/bin:${PATH}
fi
export JAVA_HOME=/opt/jdk1.8.0_45
export JRE_HOME=/opt/jdk1.8.0_45/jre
export CLASSPATH=.:/opt/jdk1.8.0_45/lib/tools.jar:/opt/jdk1.8.0_45/jre/lib/rt.jar

{{< /file >}}


12. For the C shell, create a new file called `/etc/profile.d/java.csh`, replacing `jdk1.8.0_51` with the appropriate version:

    {{< file "/etc/profile.d/java.csh" shell >}}
if ( "${path}" !~ */opt/jdk1.8.0_45/bin* ) then
   set path = ( /opt/jdk1.8.0_45/bin $path )
endif
if ( "${path}" !~ */opt/jdk1.8.0_45/jre/bin* ) then
   set path = ( /opt/jdk1.8.0_45/jre/bin $path )
endif
setenv JAVA_HOME /opt/jdk1.8.0_45
setenv JRE_HOME /opt/jdk1.8.0_45/jre
setenv CLASSPATH .:/opt/jdk1.8.0_45/lib/tools.jar:/opt/jdk1.8.0_45/jre/lib/rt.jar

{{< /file >}}


13. Make sure of the owner and ACL for the profile files by executing the following:

        sudo chown root:root /etc/profile.d/java.sh
        sudo chmod 755 /etc/profile.d/java.sh
        sudo chown root:root /etc/profile.d/java.csh
        sudo chmod 755 /etc/profile.d/java.csh

14. Now Java is available to everyone in system.

## WildFly 8.2 installation

1.  This script is based on great article & code mentioned in "Dmitriy Sukharev. IT Blog", the original article & original script can be found [here](http://sukharevd.net/wildfly-8-installation.html) I have done few modification to do the following:

    1.  Add backup to some important files before modification.

    2.  Added modification to solve warning messages of using JDK 8 with WildFly (Default is JDK 7).

    3.  Added scripts for firewalld to get WildFly working on your Linode instance.

    4.  Enable access from anywhere for admin console (Recommended for development environment only).

    5.  Remove other Linux distros, only CentOS is available for simplicity.

    6.  Add WildFly to automatic start after boot.

    7.  Show progress on screen for some commands.

    8.  Added more comments for someone with basic CentOS & Linux knowledge like myself :)

    Create wildfly installation file, & execute using root user:

    {{< file "/opt/wildfly-install.sh" shell >}}
#!/bin/bash
#Title : wildfly-install.sh
#Description : The script to install Wildfly 8.x
#Original script: http://sukharevd.net/wildfly-8-installation.html

# This version is the only variable to change when running the script
WILDFLY_VERSION=8.2.0.Final
WILDFLY_FILENAME=wildfly-$WILDFLY_VERSION
WILDFLY_ARCHIVE_NAME=$WILDFLY_FILENAME.tar.gz
WILDFLY_DOWNLOAD_ADDRESS=http://download.jboss.org/wildfly/$WILDFLY_VERSION/$WILDFLY_ARCHIVE_NAME

# Specify the destination location
INSTALL_DIR=/opt
WILDFLY_FULL_DIR=$INSTALL_DIR/$WILDFLY_FILENAME
WILDFLY_DIR=$INSTALL_DIR/wildfly

WILDFLY_USER="wildfly"
WILDFLY_SERVICE="wildfly"

WILDFLY_STARTUP_TIMEOUT=240
WILDFLY_SHUTDOWN_TIMEOUT=30

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [[ $EUID -ne 0 ]]; then
echo "This script must be run as root."
exit 1
fi

echo "Downloading: $WILDFLY_DOWNLOAD_ADDRESS..."
[ -e "$WILDFLY_ARCHIVE_NAME" ] && echo 'Wildfly archive already exists.'
if [ ! -e "$WILDFLY_ARCHIVE_NAME" ]; then
wget $WILDFLY_DOWNLOAD_ADDRESS
if [ $? -ne 0 ]; then
echo "Not possible to download Wildfly."
exit 1
fi
fi

echo "Cleaning up..."
rm -f "$WILDFLY_DIR"
rm -rf "$WILDFLY_FULL_DIR"
rm -rf "/var/run/$WILDFLY_SERVICE/"
rm -f "/etc/init.d/$WILDFLY_SERVICE"

echo "Installation..."
mkdir $WILDFLY_FULL_DIR
tar -xzf $WILDFLY_ARCHIVE_NAME -C $INSTALL_DIR
ln -s $WILDFLY_FULL_DIR/ $WILDFLY_DIR
useradd -s /sbin/nologin $WILDFLY_USER
chown -R $WILDFLY_USER:$WILDFLY_USER $WILDFLY_DIR
chown -R $WILDFLY_USER:$WILDFLY_USER $WILDFLY_DIR/

echo "Registering Wildfly as service..."
cp $WILDFLY_DIR/bin/init.d/wildfly-init-redhat.sh /etc/init.d/$WILDFLY_SERVICE
WILDFLY_SERVICE_CONF=/etc/default/wildfly.conf

chmod 755 /etc/init.d/$WILDFLY_SERVICE

if [ ! -z "$WILDFLY_SERVICE_CONF" ]; then
echo "Configuring service..."
echo JBOSS_HOME=\"$WILDFLY_DIR\" > $WILDFLY_SERVICE_CONF
echo JBOSS_USER=$WILDFLY_USER >> $WILDFLY_SERVICE_CONF
echo JBOSS_MODE=standalone >> $WILDFLY_SERVICE_CONF
echo JBOSS_CONFIG=standalone.xml >> $WILDFLY_SERVICE_CONF
echo STARTUP_WAIT=$WILDFLY_STARTUP_TIMEOUT >> $WILDFLY_SERVICE_CONF
echo SHUTDOWN_WAIT=$WILDFLY_SHUTDOWN_TIMEOUT >> $WILDFLY_SERVICE_CONF
fi

echo "Configuration backup"
cp $WILDFLY_DIR/standalone/configuration/standalone.xml $WILDFLY_DIR/standalone/configuration/standalone-org.xml
cp $WILDFLY_DIR/bin/standalone.conf $WILDFLY_DIR/bin/standalone-org.conf

echo "Configuring application server..."
sed -i -e 's,<deployment-scanner path="deployments" relative-to="jboss.server.base.dir" scan-interval="5000"/>,<deployment-scanner path="deployments" relative-to="jboss.server.base.dir" scan-interval="5000" deployment-timeout="'$WILDFLY_STARTUP_TIMEOUT'"/>,g' $WILDFLY_DIR/standalone/configuration/standalone.xml
# Enable access from any server
sed -i -e 's,<inet-address value="${jboss.bind.address.management:127.0.0.1}"/>,<any-address/>,g' $WILDFLY_DIR/standalone/configuration/standalone.xml
sed -i -e 's,<inet-address value="${jboss.bind.address:127.0.0.1}"/>,<any-address/>,g' $WILDFLY_DIR/standalone/configuration/standalone.xml

# The below line is added to avoid warning when starting WildFly with jdk 8 SE, as the JVM memory parameter changed
sed -i -e 's,MaxPermSize,MaxMetaspaceSize,g' $WILDFLY_DIR/bin/standalone.conf

echo "Configuring Firewalld for WildFly ports"
firewall-cmd --permanent --add-port=8080/tcp
firewall-cmd --permanent --add-port=8443/tcp
firewall-cmd --permanent --add-port=9990/tcp
firewall-cmd --permanent --add-port=9993/tcp
firewall-cmd --reload

echo "Backup management user"
cp $WILDFLY_DIR/standalone/configuration/mgmt-users.properties $WILDFLY_DIR/standalone/configuration/mgmt-users-org.properties
cp $WILDFLY_DIR/standalone/configuration/application-users.properties $WILDFLY_DIR/standalone/configuration/application-users-org.properties
cp $WILDFLY_DIR/domain/configuration/mgmt-users.properties $WILDFLY_DIR/domain/configuration/mgmt-users-org.properties
cp $WILDFLY_DIR/domain/configuration/application-users.properties $WILDFLY_DIR/domain/configuration/application-users-org.properties
chown -R $WILDFLY_USER:$WILDFLY_USER $WILDFLY_DIR/standalone/configuration/mgmt-users-org.properties
chown -R $WILDFLY_USER:$WILDFLY_USER $WILDFLY_DIR/standalone/configuration/application-users-org.properties
chown -R $WILDFLY_USER:$WILDFLY_USER $WILDFLY_DIR/domain/configuration/mgmt-users-org.properties
chown -R $WILDFLY_USER:$WILDFLY_USER $WILDFLY_DIR/domain/configuration/application-users-org.properties

echo "Starting Wildfly"
service $WILDFLY_SERVICE start
chkconfig --add wildfly
chkconfig --level 2345 wildfly on

echo "Done."

{{< /file >}}


2.  Make the script executable:

        sudo chmod +x /opt/wildfly-install.sh

3.  Run the script:

        cd /opt
        sudo ./wildfly-install.sh

4.  You will need to add to add management user (Web and/or CLI) to be able to access the management console, this can be simply done by running the command simply run the shell script in `/opt/wildfly/bin/add-user.sh`:

    1.  **Select option a for Management user.**
    2.  **Username:** type_the_username
    3.  **Password:** type_the_password
    4.  **What groups do you want this user to belong to?:** Leave empty and click Enter
    5.  **About to add user ... Is this correct?:** yes
    6.  **Is this new user going to be used for one AS process to connect to another AS process:** yes (Just in-case, we need this in the future, i.e. domain setup).
    7.  You will get this message: **To represent the user add the following to the server-identities definition**. This is just to be used in domain installation. Keep it if you needed to switch to domain installation later.**

    You should be able to test the wildfly by using the URL `http://123.45.67.89:8080`, and the WildFly Admin console using the URL `http://123.45.67.89:9990/console`, replacing `123.45.67.89` with your Linode's IP address.

5. I prefer that you install any sample application (Use your own, or simply get the [default sample from Tomcat](https://tomcat.apache.org/tomcat-6.0-doc/appdev/sample/) and make sure it is working using the port 8080, as it will be used when testing after adding Apache HTTP. The sample application can be deployed from the WildFly admin console.

### Configure MySQL Driver in WildFly & Add DataSource

Please Follow these steps to install MySQL driver as "module" in WildFly

1.  Log in as root, and create a folder within WildFly installation for the new module:

        su
        mkdir -p /opt/wildfly/modules/com/mysql/main


2.  Download the [jdbc driver of mysql](http://dev.mysql.com/downloads/connector/j/) (mysql-connector-java-*-bin.jar) to `/opt/wildfly/modules/com/mysql/main`.

3.  Create a file defining the module to the same folder `/opt/wildfly/modules/com/mysql/main` named `module.xml` have the following information, replacing the `mysql-connector-java-5.1.34-bin.jar` with the correct version:

    {{< file "/opt/wildfly/modules/com/mysql/main/module.xml" xml >}}
<module xmlns="urn:jboss:module:1.3" name="com.mysql">
   <resources>
       <resource-root path="mysql-connector-java-5.1.34-bin.jar"/>
   </resources>
   <dependencies>
       <module name="javax.api"/>
       <module name="javax.transaction.api"/>
   </dependencies>
</module>

{{< /file >}}


4.  Change ownership for the user wildfly for the files by issuing the command:

        chown -R wildfly:wildfly /opt/wildfly/modules

5.  We need to define MySQL driver in `/opt/wildfly/standalone/configuration/standalone.xml` by adding the following driver definition within the drivers tag, by default you will find only definition for h2:

    {{< file-excerpt "/opt/wildfly/standalone/configuration/standalone.xml" xml >}}
<drivers>
    <driver name="h2" module="com.h2database.h2">
        <xa-datasource-class>org.h2.jdbcx.JdbcDataSource</xa-datasource-class>
    </driver>
    <driver name="mysqlDriver" module="com.mysql">
        <xa-datasource-class>com.mysql.jdbc.jdbc2.optional.MysqlXADataSource</xa-datasource-class>
    </driver>
</drivers>

{{< /file-excerpt >}}


6.  Restart WildFly so changes take effect:

        systemctl restart wildfly

7.  Login to the management console at `http://123.45.67.89:9990/console`.

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

You can test your installation successfully by opening a browser and typing the server link `http://123.45.67.89`, replacing the IP address with your own. You should be getting the default provided testing page 123.

### Configuring Apache HTTP as reverse proxy for WildFly using mod_jk

There are multiple ways for setting Apache HTTP to direct calls to WildFly (mod_jk, mod_proxy, mod_cluster), the decision mainly to select mod_jk was based on [this article](http://www.programering.com/a/MTO3gDMwATg.html) that its content is distributed across several sites, you will find detailed pros & cons.

1.  `mod_jk` provided by Tomcat needs to be built on the server, thats why you need to install build & make tools to your linode using following command:

        sudo yum install httpd-devel gcc gcc-c++ make libtool
        sudo ln -s /usr/bin/apxs /usr/sbin/apxs

2.  Download `mod_jk` to temporary directory till build using following commands:

        cd /tmp
        wget http://www.apache.org/dist/tomcat/tomcat-connectors/jk/tomcat-connectors-1.2.40-src.tar.gz
        tar -xf tomcat-connectors-1.2.40-src.tar.gz
        cd /tmp/tomcat-connectors-1.2.40-src/native
        ./buildconf.sh
        ./configure --with-apxs=/usr/sbin/apxs
        make

3.  After successful build the library a file named `mod_jk.so` should be created in `/tmp/tomcat-connectors-1.2.40-src/native/apache-2.0/`. Copy the file to Apache http modules:

        sudo cp /tmp/tomcat-connectors-1.2.40-src/native/apache-2.0/mod_jk.so /usr/lib64/httpd/modules

4.  We need to configure Apache HTTP server to use this module, we will create worker file for mod_jk, and add its content (Status worker is useful in debugging as well):

    {{< file "/etc/httpd/conf.d/workers.properties" aconf >}}
worker.list=jboss1,jkstatus
worker.jkstatus.type=status
worker.jboss1.type=ajp13
worker.jboss1.port=8009
# The host should be using IP not server name as reported bug
# https://www.apachelounge.com/viewtopic.php?t=5883
worker.jboss1.host=127.0.0.1

{{< /file >}}


5.  Instead of modifying Apache configuration file; better create extra Apache HTTP configuration file that will work as Apache by default has in the file `/etc/httpd/conf/httpd.conf` the directive `IncludeOptional conf.d/*.conf`:

    {{< file "/etc/httpd/conf.d/modjk.conf" aconf >}}
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

{{< /file >}}


6.  Restart Apache:

        sudo systemctl restart httpd


7.  Try the URL `http://123.45.67.89/jkstatus`, repalcing `123.45.67.89` with your Linode IP. It should display a page for "JK Status Manager".

8.  We need to configure WildFly for accepting calls from Apache HTTP, Open the admin console, and selection the **Configuration** Menu -> **Web** -> **HTTP**. Then click the **View** link beside the **default-server**.

9.  Select the **AJP Listener** above, and click **Add**.

    -   **Name:** default.ajp
    -   **Socket binding:** ajp

    Click **Save**, then ensure the **Enabled** attribute is set to **true**.

10. Go to your Linode's IP address. It should show Apache normal testing page. To see if the sample application works, go to `http://123.45.67.89/sample`, replacing `123.45.67.89` if your Linode IP. It should show sample application deployed in JBoss.
