---
 author:
 name: Linode Community
 email: docs@linode.com
description: 'Utilizing the ELK Stack (ElasticSearch, Logstash, and Kibana), security data and threat alerts can be collected, logged, and visualized with the integration of Wazuh, a branch of the OSSEC Intrusion Detection System.'
keywords: 'ossec, elk stack, elk, ossec-hids'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published:
modified:
modified_by:
  name: Linode
title: 'Visualize Server Security With The ELK Stack'
contributor:
   name: Andrew Lescher
   link: [Andrew Lescher](https://www.linkedin.com/in/andrew-lescher-87027940/)
external_resources:
  - '[Wazuh Official Documentation](https://documentation.wazuh.com/current/index.html)'
  - '[OSSEC Official Documentation](http://ossec-docs.readthedocs.io/en/latest/index.html)'
  - '[Install Nginx Web Server on Debian 8](/docs/web-servers/nginx/install-nginx-web-server-on-debian-8)'
  - '[Apache Web Server on Debian 8](/docs/web-servers/apache/apache-web-server-debian-8)'
  - '[Install and configure Nginx and PHP-FastCGI on Ubuntu 16.04](/docs/web-servers/nginx/install-and-configure-nginx-and-php-fastcgi-on-ubuntu-16-04)'
  - '[How to Install a LAMP Stack on Ubuntu 16.04](/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04)'
  - '[Install a LEMP Stack on CentOS 7 with FastCGI](/docs/web-servers/lemp/lemp-stack-on-centos-7-with-fastcgi)'
  - '[LAMP on CentOS 7](/docs/web-servers/lamp/lamp-on-centos-7)'
  - '[How to Configure nginx](/docs/web-servers/nginx/how-to-configure-nginx)'
  - '[Apache Configuration Basics](/docs/web-servers/apache-tips-and-tricks/apache-configuration-basics)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To This Tutorial

In this tutorial, you will learn how to Install and link together ElasticSearch, Logstash, Kibana, and Wazuh OSSEC to aid in monitoring and visualizing security threats to your machine. The resulting structure can be broken down into four core components:

**ElasticSearch**

  - Essentially the heart of the ELK Stack, Elasticsearch provides powerful search and analytical capabilities. It's purpose in the ELK Stack is to centrally store and retrieve data collected by Logstash.

**Logstash**

  - Ingests data from multiple sources and passes it along to a central database (Elasticsearch) 

**Kibana**

  - A self-hosted, web based tool which provides a multitude of methods to visualize and represent data stored in Elasticsearch.

**Wazuh OSSEC**

  - An open source branch of the orignal OSSEC HIDS developed for integration into the ELK Stack. Wazuh provides the OSSEC software with the OSSEC ruleset, aw well as a RESTful API Kibana plugin optimized for displaying and analyzing host IDS alerts.

## Before You Begin

1. Working through this tutorial requires the use of a limited user account. If you have yet to create one, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

2. Ideally, your Linode should possess at least 4GB of RAM. While the ELK Stack will run on less RAM, the Wazuh Manager will crash if RAM is depleted at any time during use.

{: .note}
> Some of the commands below require elevated privilidges to execute, and must be prefixed with `sudo` when necessary.

3. You will need to have either Nginx or Apache installed. If you have yet to install a webserver, follow the instructions in the below guide that best describes your Linux environment.

  **Debian**

  - [Install Nginx Web Server on Debian 8](/docs/web-servers/nginx/install-nginx-web-server-on-debian-8)
  - [Apache Web Server on Debian 8](/docs/web-servers/apache/apache-web-server-debian-8)

  **Ubuntu**

  - [Install and configure Nginx and PHP-FastCGI on Ubuntu 16.04](/docs/web-servers/nginx/install-and-configure-nginx-and-php-fastcgi-on-ubuntu-16-04)
  - [How to Install a LAMP Stack on Ubuntu 16.04](/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04)

  **CentOS**

  - [Install a LEMP Stack on CentOS 7 with FastCGI](/docs/web-servers/lemp/lemp-stack-on-centos-7-with-fastcgi)
  - [LAMP on CentOS 7](/docs/web-servers/lamp/lamp-on-centos-7)

4. Configure your webserver for virtual domain hosting. Follow the tutorial best suited for your installed webserver.

  **Nginx**

  - [How to Configure nginx](/docs/web-servers/nginx/how-to-configure-nginx)

  **Apache**

  - [Apache Configuration Basics](/docs/web-servers/apache-tips-and-tricks/apache-configuration-basics)

# Setup The ELK Stack And Integrate Wazuh OSSEC

Installing the ELK Stack components can be accomplished in various ways, however installation via rpm will yield the latest versions.

## Update System And Install Pre-requisites

1. Update system packages.

    **Debian & Ubuntu**

        apt update -y && apt upgrade -y

    **Fedora & RHEL based**

        yum update -y && yum upgrade -y

2. Install Java 8 JDK.

    **Debian & Ubuntu**

    1. Add the Java 8 repository, download the gpg key, and install Java 8. 

            echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee /etc/apt/sources.list.d/webupd8team-java.list

            echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list

            apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886

            apt update

            apt install oracle-java8-installer 

    2. In most systems, the *oracle-java8-set-default* package will also be downloaded and installed. To verify, run the following command and check for matching output. If your output does not match, continue to step 3. Otherwise, Java 8 installation is complete.

            dpkg --list | grep oracle

    *Output*
        
        ii  oracle-java8-installer        8u144-1~webupd8~0            all          Oracle Java(TM) Development Kit (JDK) 8
        ii  oracle-java8-set-default      8u144-1~webupd8~0            all          Set Oracle JDK 8 as default Java

    3. Install the *oracle-java8-set-default* package.

        apt install oracle-java8-set-default

    **Fedora & RHEL based**

        yum install java-1.8.0-openjdk.x86_64

    Once Java is installed, verify the installation by running the following command:

        java -version

    Your output should be similar to the lines below:

    *Output*

        openjdk version "1.8.0_144"
        OpenJDK Runtime Environment (IcedTea 3.5.1) (suse-13.3-x86_64)
        OpenJDK 64-Bit Server VM (build 25.144-b01, mixed mode)

3. Install final pre-requisites.

    **Debian & Ubuntu**
                
            apt install curl apt-transport-https lsb-release

    **Fedora & RHEL based**

            yum install curl

## Install Wazuh

Follow the section relevant to your Linux distribution to install the Wazuh components.

### RPM Installation (Fedora, RHEL, CentOS)

1. Create the repository file in the indicated location and paste the provided text using your preferred text editor.

**RHEL**

{: .file}
**/etc/yum.repos.d/wazuh.repo**
~~~ .repo
[wazuh_repo]
gpgcheck=1
gpgkey=https://packages.wazuh.com/key/GPG-KEY-WAZUH
enabled=1
name=RHEL-$releasever - Wazuh
baseurl=https://packages.wazuh.com/yum/rhel/$releasever/$basearch
protect=1
~~~

**CentOS**

{: .file}
**/etc/yum.repos.d/wazuh.repo**
~~~ .repo
[wazuh_repo]
gpgcheck=1
gpgkey=https://packages.wazuh.com/key/GPG-KEY-WAZUH
enabled=1
name=CentOS-$releasever - Wazuh
baseurl=https://packages.wazuh.com/yum/el/$releasever/$basearch
protect=1
~~~

**Fedora**

{: .file}
**/etc/yum.repos.d/wazuh.repo**
~~~ .repo
[wazuh_repo]
gpgcheck=1
gpgkey=https://packages.wazuh.com/key/GPG-KEY-WAZUH
name=Fedora-$releasever - Wazuh
enabled=1
baseurl=https://packages.wazuh.com/yum/fc/$releasever/$basearch
protect=1
~~~

2. Install the Wazuh Manager and `curl`.

        yum install wazuh-manager curl

3. Install Wazuh API.

    1. Install the NodeJS repository.

            curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -

    2. Install NodeJS

            yum install nodejs
    
    3. Install Wazuh API.

            yum install wazuh-api

### DEB Installation (Debian & Ubuntu)

1. Install the GPG key. Install `curl` as well if necessary with `apt install curl`.

        curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | apt-key add -

2. Add the Wazuh repository.

        echo "deb https://packages.wazuh.com/apt $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/wazuh.list

3. Update the Wazuh repository package information.

        apt -y update

4. Install Wazuh Manager.

        apt install wazuh-manager

5. Install Wazuh API

    1. Add the NodeJS repository.

            curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

    2. Install NodeJS.

            apt install nodejs

    3. Install Wazuh API.

            apt install wazuh-api

## Install Elasticsearch, Logstash, and Kibana

Install the ELK Stack via rpm files to get the latest versions of all the software. Be sure to check the Elastic website for more recent software versions. Version 5.5.2 was the most recent at the time of publishing.

### Elasticsearch

1. Download the Elasticsearch rpm file into the `/opt` directory.

        cd /opt
        curl https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.5.2.rpm

2.  Install Elasticsearch.

        rpm -ivh elasticsearch-5.5.2.rpm

3. Enable Elasticsearch on system boot.

        systemctl enable elasticsearch
        systemctl start elasticsearch

4. Load The Wazuh Elasticsearch template. Modify the following command by replacing the brackets and the text "insert_your_ip_address" with your Linode's external IP address.

        curl https://raw.githubusercontent.com/wazuh/wazuh-kibana-app/master/server/startup/integration_files/template_file.json | curl -XPUT 'http://[insert_your_ip_address]:9200/_template/wazuh' -H 'Content-Type: application/json' -d @-

### Logstash

1. Download the Logstash rpm file into the `/opt` directory.

        cd /opt
        curl https://artifacts.elastic.co/downloads/logstash/logstash-5.5.2.rpm

2. Install Logstash.

        rpm -ivh logstash-5.5.2.rpm

3. Enable Logstash on system boot.

        systemctl daemon-reload 
        systemctl enable logstash
        systemctl start logstash

4. Download the Wazuh config and template files for Logstash.

        curl -so /etc/logstash/conf.d/01-wazuh.conf https://raw.githubusercontent.com/wazuh/wazuh/2.0/extensions/logstash/01-wazuh.conf
        curl -so /etc/logstash/wazuh-elastic5-template.json https://raw.githubusercontent.com/wazuh/wazuh/2.0/extensions/elasticsearch/wazuh-elastic5-template.json

5. Modify the *01-wazuh.conf* file to indicate a single-host architecture. Replicate the contents below into your own file. The changes consist of commenting out the "Remote Wazuh Manager" section and uncommenting the "Local Wazuh Manager" section.

{: .file}
**/etc/logstash/conf.d/01-wazuh.conf**
~~~ conf
# Wazuh - Logstash configuration file
## Remote Wazuh Manager - Filebeat input
#input {
#    beats {
#        port => 5000
#        codec => "json_lines"
##        ssl => true
##        ssl_certificate => "/etc/logstash/logstash.crt"
##        ssl_key => "/etc/logstash/logstash.key"
#    }
#}
# Local Wazuh Manager - JSON file input
input {
   file {
       type => "wazuh-alerts"
       path => "/var/ossec/logs/alerts/alerts.json"
       codec => "json"
   }
}

. . .
~~~

6. Add the Logstash user to the "ossec" group to allow access to restricted files.:w

        usermod -aG ossec logstash

7. Follow this step if you are using CentOS 6 or RHEL 6.

    1. Edit the file /etc/logstash/startup.options and in line 30 change the LS_GROUP=logstash to LS_GROUP=ossec.

{: .file}
**/etc/logstash/startup.options**
~~~ options
. . .

# user and group id to be invoked as
LS_USER=logstash
LS_GROUP=logstash

. . . 
~~~

    2. Update the service with the new parameters.

            /usr/share/logstash/bin/system-install

    3. Restart Logstash.

            systemctl restart logstash

### Install Kibana

1. Download the Kibana rpm file into the `/opt` directory.

        cd /opt
        curl https://artifacts.elastic.co/downloads/kibana/kibana-5.5.2-x86_64.rpm

2. Install Kibana.

        rpm -ivh kibana-5.5.2-x86_64.rpm

3. Enable Kibana on system boot.

        systemctl enable kibana
        systemctl start kibana

4. Install the Wazuh app for Kibana.

        /usr/share/kibana/bin/kibana-plugin install https://packages.wazuh.com/wazuhapp/wazuhapp.zip

{: .note}
> The Kibana app installation process takes several minutes to complete and it may appear as though the process has stalled; wait patiently and it will finish.

5. If you will be accessing Kibana remotely online, you will need to configure it to listen on your IP address. Replace the following values with the correct parameters. If you are accessing Kibana from a localhost, you can leave the `server.host` value alone.

{: .table .table-striped .table-bordered }
| Value           | Parameter                                                                                  |
| :-------------: | :----------------------------------------------------------------------------------------: |
| server.port     | Change this value if the default port, 5601, is in use.                                    |
| server.host     | Set this value to your Linode's external IP address.                                        |
| server.name     | This value is used for display purposes only. Set to anything you wish, or leave it alone. |
| logging.dest    | Specify a location to log program information. `/var/log/kibana.log` is recommended.       |
| :-------------: | :----------------------------------------------------------------------------------------: |

You may modify other values in this file as you see fit, but this configuration should work for most.

6. Restart Kibana.

        systemctl restart kibana

## Configure The ELK Stack

The ELK Stack will require some tuning before it can be accessed via the Wazuh API.

1. Enable memory locking in Elasticsearch to mitigate poor performance. Uncomment or add this line to `/etc/elasticsearch/elasticsearch.yml`:

        bootstrap.memory_lock: true

2. Edit locked memory allocation. Follow the instructions under the appropriate init system used in your system.

    **SystemD**

    Edit the systemd init file and add the following line.

{: .file}
**/etc/systemd/system/multi-user.target.wants/elasticsearch.service**
~~~ service
. . . 

LimitMEMLOCK=infinity

. . . 
~~~

    **System V**

    Edit the `/etc/sysconfig/elasticsearch` file for RPM or `/etc/default/elasticsearch` for Debian and Ubuntu. Add or change the following line.

{: .file}
**/etc/sysconfig/elasticsearch
**/etc/default/elasticsearch
~~~
. . .

MAX_LOCKED_MEMORY=unlimited

. . .
~~~

3. Configure the Elasticsearch heap size. This figure will determine how much memory Elasticsearch is allowed to consume. You must determine the optimum heap size for Elasticsearch based on your system's hardware resources. However, the following two rules always apply:

  - No more than 50% of available RAM
  - No more than 32GB of RAM
  - The `-Xmsg` and `-Xmxg` values must be the same in order to avoid performance issues.

Open the `jvm.options` file and navigate to the following block:

{: .file}
**/etc/elasticsearch/jvm.options**
~~~ options
. . .

# Xms represents the initial size of total heap space
# Xmx represents the maximum size of total heap space

-Xms4g
-Xmx4g

. . . 
~~~

This configuration configures Elasticsearch with 4GB of allotted RAM. You may also use the `M` letter to specify megabytes. View your current RAM consumption with the `htop` command. If you do not have htop installed, install it with your distribution's package manager. Allocate as much RAM as you can, up to 50% of the max, while leaving enough available for other daemon and system processes.

{: .caution}
> Set this value carefully. If the system RAM is completely depleted, Elasticsearch will crash.

## 

# Connect The ELK Stack With The Wazuh API

This section ties everything together with the Wazuh API

## Configure Web Hosting

Configuring Nginx or Apache as a reverse proxy server allows you to secure the Kibana web interface with SSL and limit access to others. Instructions are provided for Nginx and Apache. The instructions assume you have your webserver configured to host virtual domains.

## Setup A Reverse Proxy Server To Host Kibana As a Subdomain

If you have SSL encryption enabled on your domain, follow the instructions in the **SSL** section. If not, follow the instructions included in the **Non SSL** section. Although you may skip this section if you wish to access Kibana through its server port, this approach is recommended. 

### Nginx

1. Navigate to your Nginx virtual host config directory. This is usually located in `/etc/nginx/conf` or `/etc/nginx/conf.d`. Create a new virtual host config file, naming it something like "kibana.conf". Add the contents below to this file. If you do not have a domain name available, replace the `server_name` parameter value with your Linode's external IP address. Replace the values in **bold** with your specific values.

**Non SSL**

{: .file}
**/etc/nginx/conf.d**
**/etc/nginx/conf**
~~~ conf
server {
    listen 80;
    # Remove this line below if you do not have IPv6 enabled.
    listen [::]:80;
    server_name **kibana.your_domain_name.com**;

    location / {
        proxy_pass http://**your_ip_address**:5601;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/htpasswd.users;
}
~~~

**SSL**

{: .file}
**/etc/nginx/conf.d**
**/etc/nginx/conf**
~~~ conf
server {
    listen 80;
    # Remove this line below if you do note have IPv6 enabled.
    listen [::]:80;
    server_name kibana.adventurecatsnw.com;

    location / {
        proxy_pass http://**your_ip_address**:5601;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl;

    # Remove this line below if you do not have IPv6 enabled.
    listen [::]:443 ssl;
    server_name **kibana.your_domain_name.com**;

    location / {
        proxy_pass http://**your_ip_address**:5601;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/certificate.key;

    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/htpasswd.users;
}
~~~

2. Secure your Kibana site with a login page. Create a **.htpasswd** file first if you do not have one.

        touch /etc/nginx/htpasswd.users
        htpasswd -c /etc/nginx/.htpasswd.users YourNewUsername
        chmod 644 /etc/nginx/.htpasswd.users

3. Restart the Nginx server to load the new configuration.

        systemctl restart nginx

### Apache

1. In order for Apache to function as a reverse proxy, *mod_proxy* must be installed.

    **Debian & Ubuntu**

        apt install libapache2-mod-proxy-uwsgi libxml2-dev -y

    **Fedora & RHEL based**

The default Apache install should include the necessary modules. Check that the following modules are enabled by running the `httpd -M` command.

  - proxy_module
  - lbmethod_byrequests_module
  - proxy_balancer_module
  - proxy_http_module

2. Enable the necessary mods in Apache.

  **Debian & Ubuntu**

You can run `a2enmod` and enter `*` to enable all mods, or selectively enable the following mods below using `a2enmod mod_name`.

  - sudo a2enmod proxy
  - sudo a2enmod proxy_http
  - sudo a2enmod proxy_ajp
  - sudo a2enmod rewrite
  - sudo a2enmod deflate
  - sudo a2enmod headers
  - sudo a2enmod proxy_balancer
  - sudo a2enmod proxy_connect
  - sudo a2enmod proxy_html

  **Fedora & RHEL based**

You can enable the necessary mods by opening the **00-proxy.conf** file and matching the text below.

{: .file}
**/etc/httpd/conf.modules.d/00-proxy.conf**
~~~ conf
. . . 

LoadModule proxy_module modules/mod_proxy.so
LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
LoadModule proxy_http_module modules/mod_proxy_http.so

. . . 
~~~

3. Create an new virtual config file for the Kibana site. Add the contents below to this file. If you do not have a domain name available, replace the `server_name` parameter value with your Linode's external IP address. Replace the values in **bold** with your specific values.

**Non SSL**

{: .file}
**/etc/httpd/sites-available/kibana.conf**
**/etc/apache2/sites-available/kibana.conf**
~~~ conf
<VirtualHost *:80>
    ServerName kibana.**your_domain_or_ip**.com
    ProxyPreserveHost On

    ProxyPass / http://**your_ip_address**:5601
    ProxyPassReverse / http://**your_ip_address**:5601

    <Directory "/">
        AuthType Basic
        AuthName "Restricted Content"
        AuthUserFile /etc/apache2/.htpasswd
        Require valid-user
    </Directory>
</VirtualHost>
~~~

**SSL**

{: .file}
**/etc/httpd/sites-available/kibana.conf**
**/etc/apache2/sites-available/kibana.conf**
~~~ conf
<VirtualHost *:80>
    ServerName kibana.**your_domain_or_ip**.com
    ProxyPreserveHost On

    ProxyPass / http://**your_ip_address**:5601
    ProxyPassReverse / http://**your_ip_address**:5601

    <Directory "/">
        AuthType Basic
        AuthName "Restricted Content"
        AuthUserFile /etc/apache2/.htpasswd
        Require valid-user
    </Directory>
</VirtualHost>

<VirtualHost *:443
    ServerName kibana.**your_domain_or_ip**.com
    ProxyPreserveHost On

    ProxyPass / http://**your_ip_address**:5601
    ProxyPassReverse / http://**your_ip_address**:5601

    SSLEngine on
    SSLProtocol all -SSLv2
    SSLCipherSuite ALL:!ADH:!EXPORT:!SSLv2:RC4+RSA:+HIGH:+MEDIUM
    
    SSLCertificateFile /path/to/cert_file/ssl.crt
    SSLCertificateKeyFile /path/to/ssl/private.key
    SSLCertificateChainFile /path/to/ssl/server.ca.pem

    <Directory "/">
        AuthType Basic
        AuthName "Restricted Content"
        AuthUserFile /etc/apache2/.htpasswd
        Require valid-user
    </Directory>
</VirtualHost>
~~~

4. Secure your Kibana site with a login page. Create a **.htpasswd** file first if you do not have one.

        touch /etc/apache2/htpasswd.users
        htpasswd -c /etc/apache2/.htpasswd.users YourNewUsername
        chmod 644 /etc/apache2/.htpasswd.users

5. Restart Apache.

  **Debian & Ubuntu&**

          systemctl restart apache2

  **Fedora & RHEL based**

          systemctl restart httpd

### Add The Kibana Site To The DNS Manager

The new Kibana subdomain will need to be configured in the Linode DNS Manager.

1. Login to the Linode Manager and select your Linode VPS. Click on *DNS Manager*. Add a new A/AAA record for the subdomain. Refer to the table below for the field values.

{: .table .table-striped .table-bordered }
| Field | Value |
| :-------------: | :-----------: |
| Hostname | Enter your subdomain name here - ex. kibana |
| IP Address | Set this value to your Linode's external IP address.                                        |
| TTL | Set this to 5 minutes. |
| :-------------: | :-----------: |

2. Click *Save Changes*.

## Open The Kibana Port

Kibana's default access port, 5601, must be opened for TCP traffic. Instructions are presented below for UFW, Iptabes, and FirewallD.

**UFW**

        ufw allow 5601/tcp comment "Kibana port"

**Iptables**

        iptables -A INPUT -p tcp --dport 5601 -m comment --comment "Kibana port" -j ACCEPT

{: .note}
> To avoid losing iptables rules after a server reboot, save your rules to a file using `iptables-save`, or install iptables-persistent to automatically save rules.

**FirewallD**

        firewall-cmd --add-port=5601/tcp --permanent

## Access The Wazuh API

Now you are ready to access the API and begin making use of your OSSEC ELK Stack!

1. The Wazuh API requires users to provide credentials in order to login. Navigate to `/var/ossec/api/configuration/auth`. Replace "NewUserName" with a user name of your choosing. Set a password following the system prompts.

        sudo node htpasswd -c user NewUserName

2. Restart the Wazuh API.

        systemctl restart wazuh-api

3. Check the status of all daemon components and verify they are running.

        systemctl -l status wazuh-api
        systemctl -l status wazuh-manager
        systemctl -l status elasticsearch
        systemctl -l status logstash
        systemctl -l status kibana
        systemctl -l status nginx

{: .note}
> If the Wazuh Manager fails to start and you determine the cause to be one of the OSSEC rules or decoders, disable that specific rule/decoder for now. You will find the rules and decoders in the `var/ossec/ruleset` directory. To disable, rename the file with any other file extension.

4. In a web browser, navigate to the Kibana homepage. If you created a subdomain for Kibana, the URL might look like *kibana.your_domain.com*. You can also reach Kibana by navigating to your server's IP address and specifying port 5601. Login with the credentials you setup for your Kibana site.

5. If everything is working correctly, you should have landed on the *Discover* page. Navigate to the *Wazuh* page using the left hand side menu. You will be immediately presented with the API configruation page. Underneath the *ADD NEW API* button, enter the user credentials you created for Wazuh. For *URL* and *Port*, enter "http(s)://your_ip_address" and "55000", respectively. Click *SAVE*.

## Where To Go From Here

Your OSSEC ELK Stack setup is now complete! At this point, you will want to customize and configure your OSSEC rules to better suit the needs in your environment. The Wazuh API contains pre-configured charts and queries, and more information on how to use them can be found in the official Wazuh documentation. Links for further examination of these topics can be found in the External Resources section in this guide.
