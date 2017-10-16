---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use this guide to visualize security data using an Elasticsearch, Logstash, and Kibana Elastic Stack with Wazuh intrusion detection.'
og_description: 'An Elastic Stack combines Elasticsearch, Logstash, and Kibana. With the help of Wazuh endpoint security, this guide shows how to visualize server security data on your Linode.'
keywords: 'ossec,elk stack,elk,ossec-hids'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Tuesday, October 17, 2017'
modified: Tuesday, October 17, 2017
modified_by:
  name: Linode
title: 'Visualize Server Security on CentOS 7 with an Elastic Stack and Wazuh'
contributor:
  name: Andrew Lescher
  link: https://www.linkedin.com/in/andrew-lescher-87027940/
external_resources:
  - '[Wazuh Official Documentation](https://documentation.wazuh.com/current/index.html)'
  - '[OSSEC Official Documentation](http://ossec-docs.readthedocs.io/en/latest/index.html)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

![Visualize Server Security on CentOS 7 with an Elastic Stack and Wazuh](/docs/assets/elastic-stack-security-title.jpg "Visualize Server Security on CentOS 7 with an Elastic Stack and Wazuh")

## Introduction to Elastic (ELK) Stack

An Elastic Stack, formerly known as an ELK Stack, is a combination of Elasticsearch, Logstash, and Kibana. In this tutorial, you will learn how to install and link together ElasticSearch, Logstash, Kibana, with Wazuh OSSEC to help monitor and visualize security threats to your machine. The resulting structure can be broken down into three core components that work with Wazuh's endpoint security:

-  **Elasticsearch**

      - The heart of the Elastic Stack, Elasticsearch provides powerful search and analytical capabilities. It stores and retrieves data collected by Logstash.

-  **Logstash**

      - Ingests data from multiple sources and passes it along to Elasticsearch which acts as a central database.

-  **Kibana**

      - A self-hosted, web-based tool which provides a multitude of methods to visualize and represent data stored in Elasticsearch.

## What is Wazuh OSSEC

Wazuh is an open source branch of the orignal [OSSEC HIDS](https://ossec.github.io/) developed for integration into the Elastic Stack. Wazuh provides the OSSEC software with the OSSEC ruleset, as well as a RESTful API Kibana plugin optimized for displaying and analyzing host IDS alerts.

## Before You Begin

1.  Many of the steps in this guide require root privileges. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Use `sudo` wherever necessary.

2. Your Linode should have at least [4GB of RAM](https://www.linode.com/pricing). While an Elastic Stack will run on less RAM, the Wazuh Manager will crash if RAM is depleted at any time during use.

3. Install nginx or Apache. Visit our guides on how to install a LEMP or LAMP stack for CentOS for help:

      - [Install a LEMP Stack on CentOS 7 with FastCGI](/docs/web-servers/lemp/lemp-stack-on-centos-7-with-fastcgi)
      - [LAMP on CentOS 7](/docs/web-servers/lamp/lamp-on-centos-7)

4. Configure your webserver for virtual domain hosting:

      **nginx**

      - [How to Configure nginx](/docs/web-servers/nginx/how-to-configure-nginx)

      **Apache**

      - [Apache Configuration Basics](/docs/web-servers/apache-tips-and-tricks/apache-configuration-basics)

## Update System and Install Pre-requisites

1. Update system packages:

        yum update -y && yum upgrade -y

2. Install Java 8 JDK:

        yum install java-1.8.0-openjdk.x86_64

3.  Verify the Java installation by checking the version:

        java -version

    Your output should be similar to:

    *Output*

        openjdk version "1.8.0_144"
        OpenJDK Runtime Environment (IcedTea 3.5.1) (suse-13.3-x86_64)
        OpenJDK 64-Bit Server VM (build 25.144-b01, mixed mode)

3. Install curl:

        yum install curl

## Install Wazuh

1. Create the `wazuh.repo` repository file and paste the text below:

    {: .file}
    /etc/yum.repos.d/wazuh.repo
    : ~~~ .repo
      [wazuh_repo]
      gpgcheck=1
      gpgkey=https://packages.wazuh.com/key/GPG-KEY-WAZUH
      enabled=1
      name=CentOS-$releasever - Wazuh
      baseurl=https://packages.wazuh.com/yum/el/$releasever/$basearch
      protect=1
      ~~~

2. Install Wazuh Manager:

        yum install wazuh-manager

3. Install Wazuh API:

    1. Install the NodeJS repository:

            curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -

    2. Install NodeJS:

            yum install nodejs
    
    3. Install Wazuh API:

            yum install wazuh-api

## Install Elasticsearch, Logstash, and Kibana

Install the Elastic Stack via RPM files to get the latest versions of all the software. Be sure to check the [Elastic website](https://www.elastic.co/downloads) for more recent software versions. Adjust the commands below to match.

### Install Elasticsearch

1. Download the Elasticsearch RPM into the `/opt` directory:

        cd /opt
        curl https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.5.2.rpm

2.  Install Elasticsearch:

        rpm -ivh elasticsearch-5.5.2.rpm

3. Enable the Elasticsearch service to start on system boot:

        systemctl enable elasticsearch
        systemctl start elasticsearch

4. Load the Wazuh Elasticsearch template. Replace `exampleIP` with your Linode's public IP address:

        curl https://raw.githubusercontent.com/wazuh/wazuh-kibana-app/master/server/startup/integration_files/template_file.json | curl -XPUT 'http://exampleIP:9200/_template/wazuh' -H 'Content-Type: application/json' -d @-

### Install Logstash

1. Download the Logstash RPM into the `/opt` directory:

        cd /opt
        curl https://artifacts.elastic.co/downloads/logstash/logstash-5.5.2.rpm

2. Install Logstash:

        rpm -ivh logstash-5.5.2.rpm

3. Enable Logstash on system boot:

        systemctl daemon-reload 
        systemctl enable logstash
        systemctl start logstash

4. Download the Wazuh config and template files for Logstash:

        curl -so /etc/logstash/conf.d/01-wazuh.conf https://raw.githubusercontent.com/wazuh/wazuh/2.0/extensions/logstash/01-wazuh.conf
        curl -so /etc/logstash/wazuh-elastic5-template.json https://raw.githubusercontent.com/wazuh/wazuh/2.0/extensions/elasticsearch/wazuh-elastic5-template.json

5. Modify the `01-wazuh.conf` file to indicate a single-host architecture. Replicate the contents below into your own file. The changes consist of commenting out the `Remote Wazuh Manager` section and uncommenting the `Local Wazuh Manager` section:

    {: .file-excerpt}
    /etc/logstash/conf.d/01-wazuh.conf
    : ~~~ conf
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

6. Add the Logstash user to the "ossec" group to allow access to restricted files:

        usermod -aG ossec logstash

**For CentOS 6 and RHEL 6 Only:**

1.  Edit `/etc/logstash/startup.options` to change the `LS_GROUP=logstash` to `LS_GROUP=ossec`:

    {: .file-excerpt}
    /etc/logstash/startup.options
    : ~~~ options
      . . .
      # user and group id to be invoked as
      LS_USER=logstash
      LS_GROUP=logstash
      . . .
      ~~~

2. Update the service with the new parameters:

        /usr/share/logstash/bin/system-install

3. Restart Logstash:

        systemctl restart logstash

### Install Kibana

1. Download the Kibana RPM into the `/opt` directory:

        cd /opt
        curl https://artifacts.elastic.co/downloads/kibana/kibana-5.5.2-x86_64.rpm

2. Install Kibana:

        rpm -ivh kibana-5.5.2-x86_64.rpm

3. Enable Kibana on system boot:

        systemctl enable kibana
        systemctl start kibana

4. Install the Wazuh app for Kibana:

        /usr/share/kibana/bin/kibana-plugin install https://packages.wazuh.com/wazuhapp/wazuhapp.zip

    The Kibana app installation process takes several minutes to complete and it may appear as though the process has stalled.

5. If you will access Kibana remotely, configure it to listen on your IP address. Replace the following values with the correct parameters. If you are accessing Kibana from a local host, you can leave the `server.host` value alone.

    {: .table .table-striped .table-bordered }
    | Value           | Parameter                                                                                  |
    | :-------------: | :----------------------------------------------------------------------------------------: |
    | server.port     | Change this value if the default port, `5601`, is in use.                                  |
    | server.host     | Set this value to your Linode's external IP address.                                       |
    | server.name     | This value is used for display purposes only. Set to anything you wish, or leave it alone. |
    | logging.dest    | Specify a location to log program information. `/var/log/kibana.log` is recommended.       |
    | :-------------: | :----------------------------------------------------------------------------------------: |

    You may modify other values in this file as you see fit, but this configuration should work for most.

6. Restart Kibana:

        systemctl restart kibana

## Configure the Elastic Stack

The Elastic Stack will require some tuning before it can be accessed via the Wazuh API.

1. Enable memory locking in Elasticsearch to mitigate poor performance. Uncomment or add this line to `/etc/elasticsearch/elasticsearch.yml`:

        bootstrap.memory_lock: true

2. Edit locked memory allocation. Follow the instructions under the appropriate init system used in your system:

    **SystemD**

    Edit the systemd init file and add the following line:

    {: .file-excerpt}
    /etc/systemd/system/multi-user.target.wants/elasticsearch.service
    : ~~~ service
      . . . 
      LimitMEMLOCK=infinity
      . . . 
      ~~~

    **System V**
      
    Edit the `/etc/sysconfig/elasticsearch` file for RPM or `/etc/default/elasticsearch` for Debian and Ubuntu. Add or change the following line:

    {: .file-excerpt}
    /etc/sysconfig/elasticsearch or /etc/default/elasticsearch
    : ~~~
      . . .
      MAX_LOCKED_MEMORY=unlimited
      . . .
      ~~~

3. Configure the Elasticsearch heap size based on your Linode's resources. This figure will determine how much memory Elasticsearch is allowed to consume. Keep the following rules in mind:

      - No more than 50% of available RAM
      - No more than 32GB of RAM
      - The `-Xmsg` and `-Xmxg` values must be the same in order to avoid performance issues.

    Open the `jvm.options` file and navigate to the block shown here:

    {: .file-excerpt}
    /etc/elasticsearch/jvm.options
    : ~~~ options
      . . .
      # Xms represents the initial size of total heap space
      # Xmx represents the maximum size of total heap space

      -Xms4g
      -Xmx4g
      . . . 
      ~~~

    This configures Elasticsearch with 4GB of allotted RAM. You may also use the `M` letter to specify megabytes, `Xms4096M` in this example. View your current RAM consumption with the `htop` command. If you do not have htop installed, install it with your distribution's package manager. Allocate as much RAM as you can, up to 50% of the max, while leaving enough available for other daemon and system processes.

## Configure a Reverse Proxy

A reverse proxy server allows you to secure the Kibana web interface with SSL and limit access to others. Instructions are provided for nginx and Apache. The instructions assume you have your webserver configured to host virtual domains.

### Set up a Reverse Proxy Server to Host Kibana as a Subdomain

If you have SSL encryption enabled on your domain, follow the instructions in the **SSL** section. If not, follow the instructions included in the **Non SSL** section. Although you may skip this section if you wish to access Kibana through its server port, this approach is recommended. 

#### nginx

1. Navigate to your nginx virtual host config directory. Create a new virtual host config file and name it something similar to `kibana.conf`. Add the contents below to this file. If you do not have a domain name available, replace the `server_name` parameter value with your Linode's external IP address:

    **Non SSL**

    {: .file-excerpt}
    /etc/nginx/conf.d or /etc/nginx/conf
    : ~~~ conf
      server {
          listen 80;
          # Remove the line below if you do not have IPv6 enabled.
          listen [::]:80;
          server_name kibana.exampleIPorDomain;
      
          location / {
              proxy_pass http://exampleIPorDomain:5601;
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

    {: .file-excerpt}
    /etc/nginx/conf.d or /etc/nginx/conf
    : ~~~ conf
      server {
          listen 80;
          # Remove the line below if you do note have IPv6 enabled.
          listen [::]:80;
          server_name kibana.exampleIPorDomain;
      
          location / {
              proxy_pass http://exampleIPorDomain:5601;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
          }
      }
      
      server {
          listen 443 ssl;
      
          # Remove the line below if you do not have IPv6 enabled.
          listen [::]:443 ssl;
          server_name kibana.exampleIPorDomain;
      
          location / {
              proxy_pass http://exampleIPorDomain:5601;
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

2. Secure your Kibana site with a login page. Create a **.htpasswd** file first if you do not have one:

        touch /etc/nginx/htpasswd.users
        htpasswd -c /etc/nginx/.htpasswd.users YourNewUsername
        chmod 644 /etc/nginx/.htpasswd.users

3. Restart the nginx server to load the new configuration:

        systemctl restart nginx

### Apache

1. In order for Apache to function as a reverse proxy, *mod_proxy* must be installed. Check that the following modules are enabled by running the `httpd -M` command:

        httpd -M

    - proxy_module
    - lbmethod_byrequests_module
    - proxy_balancer_module
    - proxy_http_module

2. Enable the necessary mods in Apache. Open `00-proxy.conf` and verify that the lines below are included:

    {: .file-excerpt}
    /etc/httpd/conf.modules.d/00-proxy.conf
    : ~~~ conf
      . . . 
      LoadModule proxy_module modules/mod_proxy.so
      LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
      LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
      LoadModule proxy_http_module modules/mod_proxy_http.so
      . . . 
      ~~~

3. Create a new virtual config file for the Kibana site. Add the contents below to this file. If you do not have a domain name available, replace the `server_name` parameter value with your Linode's public IP address. Replace `kibana.exampleIPorDomain` and `http://exampleIPorDomain` with your specific values:

    **Non SSL**

    {: .file}
    /etc/httpd/sites-available/kibana.conf or /etc/apache2/sites-available/kibana.conf
    : ~~~ conf
      <VirtualHost *:80>
          ServerName kibana.exampleIPorDomain
          ProxyPreserveHost On
      
          ProxyPass / http://exampleIPorDomain:5601
          ProxyPassReverse / http://exampleIPorDomain:5601
      
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
    /etc/httpd/sites-available/kibana.conf or /etc/apache2/sites-available/kibana.conf
    : ~~~ conf
      <VirtualHost *:80>
          ServerName kibana.exampleIPorDomain
          ProxyPreserveHost On
      
          ProxyPass / http://exampleIPorDomain:5601
          ProxyPassReverse / http://exampleIPorDomain:5601
      
          <Directory "/">
              AuthType Basic
              AuthName "Restricted Content"
              AuthUserFile /etc/apache2/.htpasswd
              Require valid-user
          </Directory>
      </VirtualHost>
      
      <VirtualHost *:443
          ServerName kibana.exampleIPorDomain
          ProxyPreserveHost On
      
          ProxyPass / http://exampleIPorDomain:5601
          ProxyPassReverse / http://exampleIPorDomain:5601
      
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

4. Secure your Kibana site with a login page. Create a **.htpasswd** file first if you do not have one:

        touch /etc/apache2/htpasswd.users
        htpasswd -c /etc/apache2/.htpasswd.users YourNewUsername
        chmod 644 /etc/apache2/.htpasswd.users

5. Restart Apache:

        systemctl restart httpd

### Add the Kibana Subdomain to the DNS Manager

The new Kibana subdomain will need to be configured in the Linode DNS Manager.

1. Login to the Linode Manager and select your Linode VPS. Click on *DNS Manager*. Add a new A/AAA record for the subdomain. Refer to the table below for the field values.

    {: .table .table-striped .table-bordered }
    | Field | Value |
    | :-------------: | :-----------: |
    | Hostname | Enter your subdomain name here - ex. kibana |
    | IP Address | Set this value to your Linode's external IP address. |
    | TTL | Set this to 5 minutes. |
    | :-------------: | :-----------: |

2. Click **Save Changes**.

## Open the Kibana Port

Kibana's default access port, `5601`, must be opened for TCP traffic. Instructions are presented below for UFW, Iptabes, and FirewallD.

**UFW**

    ufw allow 5601/tcp comment "Kibana port"

**iptables**

    iptables -A INPUT -p tcp --dport 5601 -m comment --comment "Kibana port" -j ACCEPT

{: .note}
> To avoid losing iptables rules after a server reboot, save your rules to a file using `iptables-save`, or install iptables-persistent to automatically save rules.

**FirewallD**

    firewall-cmd --add-port=5601/tcp --permanent

## ## Connect the Elastic Stack with the Wazuh API

Now you are ready to access the API and begin making use of your OSSEC Elastic Stack!

1. The Wazuh API requires users to provide credentials in order to login. Navigate to `/var/ossec/api/configuration/auth`. Replace `NewUserName` whatever user name you choose. Set a password following the system prompts:

        sudo node htpasswd -c user NewUserName

2. Restart the Wazuh API:

        systemctl restart wazuh-api

3. Check the status of all daemon components and verify that they are running:

        systemctl -l status wazuh-api
        systemctl -l status wazuh-manager
        systemctl -l status elasticsearch
        systemctl -l status logstash
        systemctl -l status kibana
        systemctl -l status nginx

    {: .note}
    > If the Wazuh Manager fails to start and you determine the cause to be one of the OSSEC rules or decoders, disable that specific rule/decoder for now. Find the rules and decoders in the `/var/ossec/ruleset` directory. To disable, rename the file to any other file extension.

4. In a web browser, navigate to the Kibana homepage. If you created a subdomain for Kibana, the URL will be similar to `kibana.exampleIPorDomain`. You can also reach Kibana by navigating to your server's IP address and specifying port `5601`. Login with the credentials you setup for your Kibana site.

5. If everything is working correctly, you should have landed on the **Discover** page. Navigate to the **Wazuh** page using the left hand side menu. You will be immediately presented with the API configuration page. Underneath the **ADD NEW API** button, enter the user credentials you created for Wazuh. For URL and Port, enter you URL or IP and `55000`, then click **SAVE**.

## Where To Go From Here

Your OSSEC Elastic Stack setup is now complete! At this point, you will want to customize and configure your OSSEC rules to better suit the needs of your environment. The Wazuh API contains pre-configured charts and queries, and more information on how to use them can be found in the official Wazuh documentation.
