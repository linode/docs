Introduction
============
JBoss AS (Renamed to [WildFly](http://wildfly.org/)) has been used for many years as one of the best known performing & free community Java Application Server. The attention even increased when Red Hat started providing commercial support to its enterprise version [JBoss EAP](http://www.redhat.com/en/technologies/jboss-middleware/application-platform) with support to on-premise, virtual, or cloud. Red Hat also provides commercial support for Red Hat Enterprise Linux & building huge ecosystem of multiple products to serve its clients.

Many software companies working with Java technology are targeting the stack of WildFly on CentOS so it supports clients with limited budget, and also supports JBoss EAP on Redhat Enterprise Linux for customers looking for commercial support, so they ensure their software meets various customer segments.

This article has been introduced to show one of the most common architecture in Java application hosting stack, it consists of:

 1. CentOS 7: As Operating System.
 2. MySQL 5.6.24 Community Server: As RDBMS.
 3. WildFly 8.2 Final: As Java Application Server.
 4. Apache HTTP 2.4.6: As HTTP Server for serving static content & using mod_jk 1.2.40 for directing calls to WildFly (Apache as reverse proxy).

After full installation of above stack it was consuming around 650 MB of RAM with a very small sample application, so maybe you can consider Linode plan 1 GB for small application & larger plan based on your application.

Target Audience
---------------

 - Developers building development server for their project.
 - Application Server Administrator who would like to start switching to WildFly & need some guidance in their standalone setup.

Prerequisites
=============

Securing your server
--------------------
Please follow the steps mentioned in [Linode: Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) but skip the section Creating a Firewall as iptables has been replaced in CentOS 7 with [firewalld](https://fedoraproject.org/wiki/FirewallD).

```
# Start & enable Firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
```

MySQL installation
----------------------
Please follow the steps mentioned in [Linode: Hosting a Website](https://www.linode.com/docs/websites/hosting-a-website) sections "Installing MySQL", "Optimizing MySQL for a Linode 1GB", "Creating a Database".


Oracle Java 8 SE installation
----------------------

> Note:
> Oracle is producing many updates for Java, so below steps ensures you are getting the latest updated Java version.

 1. In any browser go to [Oracle Java SE download page](http://www.oracle.com/technetwork/java/javase/downloads/index.html).
 2. Select Java JDK 8 download.
 3. Accept license agreement.
 4. Copy the link location of Linux x64 bit as the product & the download with extension tar.gz not the RPM.
 5. Execute the following commands to download Java, and extract archive content
 ```bash
 # Switch to destination folder
 cd /opt
  
 # Download Java, remember to change the URL with the  latest you got in step 4
 sudo wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "http://download.oracle.com/otn-pub/java/jdk/8u45-b14/jdk-8u45-linux-x64.tar.gz"
 
 # Extract archive content, remember exact name will differ based on your version
 sudo tar xzf jdk-8u45-linux-x64.tar.gz
 ```
 
 6. Install Java with Alternatives (I prefer this method as in future you most probably will have multiple versions of Java running on same server, so better use alternative to make sure you know the default version of your OS & be able to change it easily). In the below option for new Linode you will find only 1 option:
 ```bash
 cd /opt/jdk1.8.0_45/
 
 sudo alternatives --install /usr/bin/java java /opt/jdk1.8.0_45/bin/java 2
 sudo alternatives --config java
 There is 1 program that provides 'java'.
   Selection    Command
  *+ 1           /opt/jdk1.8.0_45/bin/java
 Enter to keep the current selection[+], or type selection number: 1
 ```
 7. Setup javac and jar commands path using alternatives, then Check Java version installed
 ```bash
 sudo alternatives --install /usr/bin/jar jar /opt/jdk1.8.0_45/bin/jar 2
 sudo alternatives --install /usr/bin/javac javac /opt/jdk1.8.0_45/bin/javac 2
 sudo alternatives --set jar /opt/jdk1.8.0_45/bin/jar
 sudo alternatives --set javac /opt/jdk1.8.0_45/bin/javac
 
 java -version
 java version "1.8.0_45"
 Java(TM) SE Runtime Environment (build 1.8.0_45-b14)
 Java HotSpot(TM) 64-Bit Server VM (build 25.45-b02, mixed mode)
 ```
 
 8. Configure environment variables:
 ```bash
 export JAVA_HOME=/opt/jdk1.8.0_45
 export JRE_HOME=/opt/jdk1.8.0_45/jre
 export PATH=$PATH:/opt/jdk1.8.0_45/bin:/opt/jdk1.8.0_45/jre/bin
 ```
 
 9. The above command will work for this session only, but you will need to be added to all system users especially when server reboots, so for the Bourne shell, create a new file called /etc/profile.d/java.sh
 ```bash
 sudo vi /etc/profile.d/java.sh
 
 if ! echo ${PATH} | grep -q /opt/jdk1.8.0_45/bin ; then
    export PATH=/opt/jdk1.8.0_45/bin:${PATH}
 fi
 if ! echo ${PATH} | grep -q /opt/jdk1.8.0_45/jre/bin ; then
    export PATH=/opt/jdk1.8.0_45/jre/bin:${PATH}
 fi
 export JAVA_HOME=/opt/jdk1.8.0_45
 export JRE_HOME=/opt/jdk1.8.0_45/jre
 export CLASSPATH=.:/opt/jdk1.8.0_45/lib/tools.jar:/opt/jdk1.8.0_45/jre/lib/rt.jar
 ```

 10. For the C shell, create a new file called /etc/profile.d/java.csh
 ```bash
 sudo vi /etc/profile.d/java.csh
 
 if ( "${path}" !~ */opt/jdk1.8.0_45/bin* ) then
    set path = ( /opt/jdk1.8.0_45/bin $path )
 endif
 if ( "${path}" !~ */opt/jdk1.8.0_45/jre/bin* ) then
    set path = ( /opt/jdk1.8.0_45/jre/bin $path )
 endif
 setenv JAVA_HOME /opt/jdk1.8.0_45
 setenv JRE_HOME /opt/jdk1.8.0_45/jre
 setenv CLASSPATH .:/opt/jdk1.8.0_45/lib/tools.jar:/opt/jdk1.8.0_45/jre/lib/rt.jar
 ```

 11. Make sure of the owner and ACL for the profile files by executing the following:
 ```bash
 sudo chown root:root /etc/profile.d/java.sh
 sudo chmod 755 /etc/profile.d/java.sh
 sudo chown root:root /etc/profile.d/java.csh
 sudo chmod 755 /etc/profile.d/java.csh
 ```

 12. Now Java is available to everyone in system.

WildFly 8.2 installation
=============

 1. This script is based on great article & code mentioned in "Dmitriy Sukharev. IT Blog", the original article & original script can be found [here](http://sukharevd.net/wildfly-8-installation.html) I have done few modification to do the following:
  2. Add backup to some important files before modification.
  3. Added modification to solve warning messages of using JDK 8 with WildFly (Default is JDK 7).
  4. Added scripts for firewalld to get WildFly working on your Linode instance.
  5. Enable access from anywhere for admin console (Recommended for development environment only).
  6. Remove other Linux distros, only CentOS is available for simplicity.
  7. Add WildFly to automatic start after boot.
  8. Show progress on screen for some commands.
  9. Added more comments for someone with basic CentOS & Linux knowledge like myself :)
 10. Create wildfly installation file, & execute using root user 
 ```bash
 vi /opt/wildfly-install.sh
 
 
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
 systemctl enable $WILDFLY_SERVICE

 echo "Done."
 ```
 
 11. You will need to add to add management user (Web and/or CLI) to be able to access the management console, this can be simply done by running the command simply run the shell script in /opt/wildfly/bin/add-user.sh
  12. Select option a for Management user.
  13. Username: type_the_username 
  14. Password: type_the_password
  15. What groups do you want this user to belong to? Leave empty and click Enter
  16. About to add user ... Is this correct? yes
  17. Is this new user going to be used for one AS process to connect to another AS process? yes (Just in-case, we need this in the future, i.e. domain setup).
  18. You will get this message: To represent the user add the following to the server-identities definition, this is just to be used in domain installation just keep it if you needed to switch to domain installation later.
 19. You should be enable to test the wildfly by using the URL http://LINODE_WILDFLY_IP:8080
 20. You should be able to access the WildFly Admin console using the URL http://LINODE_WILDFLY_IP:9990/console
 21. I prefer that you install any sample application (Use your own, or simply get the [default sample from Tomcat](https://tomcat.apache.org/tomcat-6.0-doc/appdev/sample/)) and make sure it is working using the port 8080, as it will be used when testing after adding Apache HTTP.

Configure MySQL Driver in WildFly & Add DataSource
--------------------------------------------------
Please Follow these steps to install MySQL driver as "module" in WildFly

 1. Create a folder within WildFly installation for the new module:
 ```bash
 su
 mkdir -p /opt/wildfly/modules/com/mysql/main
 ```
 
 2. Download the [jdbc driver of mysql](http://dev.mysql.com/downloads/connector/j/) (mysql-connector-java-5.1.34-bin.jar) and SFTP to /opt/wildfly/modules/com/mysql/main 
 3. Create a file defining the module to the same folder /opt/wildfly/modules/com/mysql/main named module.xml have the following information:
 ```bash
 vi /opt/wildfly/modules/com/mysql/main/module.xml
 
 
 <module xmlns="urn:jboss:module:1.3" name="com.mysql">
    <resources>
        <resource-root path="mysql-connector-java-5.1.34-bin.jar"/>
    </resources>
    <dependencies>
        <module name="javax.api"/>
        <module name="javax.transaction.api"/>
    </dependencies>
 </module>
 ```
 
 4. Change ownership for the user wildfly for the files by issuing the command
 ```bash
 chown -R wildfly:wildfly /opt/wildfly/modules
 ```
 
 5. We need to define MySQL driver in /opt/wildfly/standalone/configuration/standalone.xml by adding the following driver definition within the drivers tag, by default you will find only definition for h2
 ```bash
  vi /opt/wildfly/standalone/configuration/standalone.xml
 
 <driver name="mysqlDriver" module="com.mysql">
     <xa-datasource-class>com.mysql.jdbc.jdbc2.optional.MysqlXADataSource</xa-datasource-class>
 </driver>
 ```
 
 6. Restart WildFly so changes take effect using the command
 ```bash
 systemctl restart wildfly
 ```
 
 6. Login from management console http://LINODE_WILDFLY_IP:9990/console
 7. Click "Configuration", On left menu "SubSystems" -> "Connector" -> "DataSources", in the DataSources tab, click "Add"
 8. In step 1 (Replace with your required DataSource name):
  9. Name: MySQLDS
  10. JNDI Name: java:/datasource/MySQLDS
  11. Click "Next"
 12. In step 2:
  13. You should see "mysqlDriver" listed.
  14. Click "Next".
 15. In step 3 (Replace with your required MySQL DB, username, & password ):
  16. Connection URL: jdbc:mysql://localhost:3066/type_db_name
  17. Username: type_db_user
  18. Password: type_db_password
  19. Security Domain: leave_empty
  20. Click "Test Connection".
  21. Click "Done".
 22. Select the dataSource, & click "Enable".
 23. Now your WildFly is connected to MySQL.

Apache HTTP Server installation
===============================

Just execute following commands, it performs the installation, and add HTTP in boot, and open port 80 to your firewall, and backup your default configuration
```bash
sudo yum install -y httpd
 
# Start Apache HTTP
sudo systemctl start httpd
sudo systemctl enable httpd
 
# Open port 80 for HTTP
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload
 
# Backup Apache default configuration
sudo cp /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd-org.conf
```
You can test your installation successfully by opening a browser and typing the server link http://LINODE_WILDFLY_IP you should be getting the default provided testing page 123.

Configuring Apache HTTP as reverse proxy for WildFly using mod_jk
-----------------------------------------------------------------
There are multiple ways for setting Apache HTTP to direct calls to WildFly (mod_jk, mod_proxy, mod_cluster), the decision mainly to select mod_jk was based on [this article](http://www.programering.com/a/MTO3gDMwATg.html) that its content is distributed across several sites, you will find detailed pros & cons.

 1. mod_jk provided by tomcat needs to be built on the server, thats why you need to install build & make tools to your linode using following command:
 ```bash
 sudo yum install httpd-devel gcc gcc-c++ make libtool
 sudo ln -s /usr/bin/apxs /usr/sbin/apxs
 ```

 3. Download mod_jk to temporary directory till build using following commands
 ```bash
 cd /tmp
 wget http://www.apache.org/dist/tomcat/tomcat-connectors/jk/tomcat-connectors-1.2.40-src.tar.gz
 
 tar -xf tomcat-connectors-1.2.40-src.tar.gz
 
 cd /tmp/tomcat-connectors-1.2.40-src/native 
 ./buildconf.sh
 ./configure --with-apxs=/usr/sbin/apxs
 make
 ```

 4. After successful build the library a file named mod_jk.so should be created in /tmp/tomcat-connectors-1.2.40-src/native/apache-2.0/
 5. Copy the file to Apache http modules using the command:
 ```bash
 sudo cp /tmp/tomcat-connectors-1.2.40-src/native/apache-2.0/mod_jk.so /usr/lib64/httpd/modules
 ```
 
 7. We need to configure Apache HTTP server to use this module, we will create worker file for mod_jk, and add its content (Status worker is useful in debugging as well):
 ```bash
 sudo vi /etc/httpd/conf.d/workers.properties
 
 
 worker.list=jboss1,jkstatus
 worker.jkstatus.type=status
 worker.jboss1.type=ajp13
 worker.jboss1.port=8009
 # The host should be using IP not server name as reported bug
 # https://www.apachelounge.com/viewtopic.php?t=5883
 worker.jboss1.host=127.0.0.1
 ```
 
 9. Instead of modifying apache configuration file; better create extra Apache HTTP configuration file that will work as Apache by default has in the file /etc/httpd/conf/httpd.conf the directive IncludeOptional conf.d/*.conf
 ```bash
 sudo vi /etc/httpd/conf.d/modjk.conf
 
 
 
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
 ```
 
 6. Restart Apache
 ```bash
 sudo systemctl restart httpd
 ```
 
 8. Try the URL: http://LINODE_WILDFLY_IP/jkstatus it should display a page for "JK Status Manager".
 9. We need to configure WildFly for accepting calls from Apache HTTP, Open the admin console http://LINODE_WILDFLY_IP:9990/console
 10. "Configuration" Menu -> Left Menu "Web" -> "HTTP" -> Click "View" link beside the "default-server"
 11. Select "AJP Listener" tab -> click "Add"
  12. Name: default.ajp
  13. Socket binding: ajp
  14. Click "Save"
 15. Scroll down to make sure the "Enabled: true"
 16. Try the URL: http://LINODE_WILDFLY_IP/ it should show Apache normal testing page
 17. Try the URL: http://LINODE_WILDFLY_IP/sample it should show sample application deployed in JBoss

