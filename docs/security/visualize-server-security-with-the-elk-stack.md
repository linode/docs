---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Utilizing the Elastic Stack (ElasticSearch, Logstash, and Kibana), security data and threat alerts can be collected, logged, and visualized with the integration of Wazuh, a branch of the OSSEC Intrusion Detection System.'
keywords: 'ossec, elk stack, elk, ossec-hids'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Wednesday, October 11th, 2017'
modified: Thursday, October 12th, 2017
modified_by:
  name: Linode
title: 'Visualize Server Security On CentOS 7 With The Elastic Stack'
contributor:
  name: Andrew Lescher
  link: 'https://www.linkedin.com/in/andrew-lescher-87027940/'
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

In this tutorial, you will learn how to install and link together ElasticSearch, Logstash, Kibana, and Wazuh OSSEC to aid in monitoring and visualizing security threats to your machine. The resulting structure can be broken down into four core components:

**ElasticSearch**

  - The heart of the Elastic Stack, ElasticSearch provides powerful search and analytical capabilities. It's purpose in the Elastic Stack is to centrally store and retrieve data collected by Logstash.

**Logstash**

  - Receives data input from multiple sources and passes it along to a central database (ElasticSearch)

**Kibana**

  - A self-hosted, web based tool which provides a multitude of methods to visualize and represent data stored in ElasticSearch.

**Wazuh OSSEC**

  - An open source branch of the orignal OSSEC HIDS developed for integration into the Elastic Stack. Wazuh provides the OSSEC software with the OSSEC ruleset, as well as a RESTful API Kibana plugin optimized for displaying and analyzing host IDS alerts.

## Before You Begin

1. Working through this tutorial requires the use of a limited user account. If you have yet to create one, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

2. Ideally, your Linode should possess at least 4GB of RAM. While the Elastic Stack will run on less RAM, the Wazuh Manager will crash if RAM is depleted at any time during use.

    {: .note}
    > Some of the commands below require elevated privileges to execute, and should be prefixed with `sudo` when necessary.

3. You will need to have either Nginx or Apache installed. If you have yet to install a webserver, follow the instructions in the below guide that best describes your Linux environment.

    - [Install a LEMP Stack on CentOS 7 with FastCGI](/docs/web-servers/lemp/lemp-stack-on-centos-7-with-fastcgi)
    - [LAMP on CentOS 7](/docs/web-servers/lamp/lamp-on-centos-7)

4. Configure your webserver for virtual domain hosting. Follow the tutorial best suited for your installed webserver.

    **Nginx**

    - [How to Configure nginx](/docs/web-servers/nginx/how-to-configure-nginx)

    **Apache**

    - [Apache Configuration Basics](/docs/web-servers/apache-tips-and-tricks/apache-configuration-basics)

# Set Up The Elastic Stack and Integrate Wazuh OSSEC

Installing the Elastic Stack components can be accomplished in various ways. Installing with RPM is recommended, as this will yield the latest versions.

## Update System and Install Prerequisites

1. Update system packages.

        yum update -y && yum upgrade -y

2. Install Java 8 JDK.

        yum install java-1.8.0-openjdk.x86_64

    Once Java is installed, verify the installation by running the following command:

        java -version

    Your output should be similar to the lines below:

        openjdk version "1.8.0_144"
        OpenJDK Runtime Environment (IcedTea 3.5.1) (suse-13.3-x86_64)
        OpenJDK 64-Bit Server VM (build 25.144-b01, mixed mode)

3. Install final pre-requisites.

        yum install wget

## Install Wazuh

1. Create the file `/etc/yum.repos.d/wazuh.repo` and paste the following text using your preferred text editor:

      {: .file}
      /etc/yum.repos.d/wazuh.repo
      :  ~~~ .repo
         [wazuh_repo]
         gpgcheck=1
         gpgkey=https://packages.wazuh.com/key/GPG-KEY-WAZUH
         enabled=1
         name=CentOS-$releasever - Wazuh
         baseurl=https://packages.wazuh.com/yum/el/$releasever/$basearch
         protect=1
         ~~~

2. Install the Wazuh Manager:

        yum install wazuh-manager

3. Install the Wazuh API:

    1. Add the EPEL repository and install Node.js:

            yum install epel-release
            yum install nodejs

    2. Install Wazuh API:

            yum install wazuh-api

## Install Elasticsearch, Logstash, and Kibana

Install the Elastic Stack via rpm files to get the latest versions of all the software. Be sure to check the Elastic website for more recent software versions. Version 5.6.2 was the most recent at the time of publishing.

### ElasticSearch

1. Download the ElasticSearch rpm file into the `/opt` directory.

        cd /opt
        wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.6.2.rpm

2.  Install ElasticSearch.

        rpm -ivh elasticsearch-5.6.2.rpm

3. Enable ElasticSearch on system boot.

        systemctl enable elasticsearch
        systemctl start elasticsearch

4. Load The Wazuh ElasticSearch template.

        wget https://raw.githubusercontent.com/wazuh/wazuh-kibana-app/2.1/server/startup/integration_files/template_file.json
        curl -XPUT http://localhost:9200/_template/wazuh/ -d @template_file.json


### Logstash

1. Download the Logstash rpm file into the `/opt` directory.

        cd /opt
        wget https://artifacts.elastic.co/downloads/logstash/logstash-5.6.2.rpm

2. Install Logstash.

        rpm -ivh logstash-5.6.2.rpm

3. Enable Logstash on system boot.

        systemctl daemon-reload
        systemctl enable logstash
        systemctl start logstash

4. Download the Wazuh config and template files for Logstash.

        curl -o /etc/logstash/conf.d/01-wazuh.conf https://raw.githubusercontent.com/wazuh/wazuh/2.0/extensions/logstash/01-wazuh.conf
        curl -o /etc/logstash/wazuh-elastic5-template.json https://raw.githubusercontent.com/wazuh/wazuh/2.0/extensions/elasticsearch/wazuh-elastic5-template.json

5. Modify the *01-wazuh.conf* file to indicate a single-host architecture. Replicate the contents below into your own file. The changes consist of commenting out the "Remote Wazuh Manager" section and uncommenting the "Local Wazuh Manager" section.

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

6. Add the Logstash user to the "ossec" group to allow access to restricted files.

        usermod -aG ossec logstash

7. Follow this step if you are using CentOS 6 or RHEL 6.

    1. Edit the file `/etc/logstash/startup.options` and in line 30 change the `LS_GROUP=logstash` to `LS_GROUP=ossec`.

      {: .file-excerpt}
      /etc/logstash/startup.options
      : ~~~ options
        . . .

        # user and group id to be invoked as
        LS_USER=logstash
        LS_GROUP=ossec

        . . .
        ~~~

    2. Update the service with the new parameters.

            /usr/share/logstash/bin/system-install

    3. Restart Logstash.

            systemctl restart logstash

### Install Kibana

1. Download the Kibana rpm file into the `/opt` directory.

        cd /opt
        wget https://artifacts.elastic.co/downloads/kibana/kibana-5.6.2-x86_64.rpm

2. Install Kibana.

        rpm -ivh kibana-5.6.2-x86_64.rpm

3. Enable Kibana on system boot.

        systemctl enable kibana
        systemctl start kibana

4. Install the Wazuh app for Kibana.

        /usr/share/kibana/bin/kibana-plugin install https://packages.wazuh.com/wazuhapp/wazuhapp.zip

    {: .note}
    > The Kibana app installation process takes several minutes to complete and it may appear as though the process has stalled; wait patiently and it will finish.

5. If you will be accessing Kibana remotely online, you will need to configure it to listen on your IP address. Replace the following values in `/etc/kibana/kibana.yml` with the correct parameters. If you are accessing Kibana from a localhost, you can leave the `server.host` value alone.

    {: .table .table-striped .table-bordered }
    | Value           | Parameter                                                                                  |
    | :-------------: | :----------------------------------------------------------------------------------------: |
    | server.port     | Change this value if the default port, 5601, is in use.                                    |
    | server.host     | Set this value to your Linode's external IP address.                                        |
    | server.name     | This value is used for display purposes only. Set to anything you wish, or leave it alone. |
    | logging.dest    | Specify a location to log program information. `/var/log/kibana.log` is recommended.       |
    | :-------------: | :----------------------------------------------------------------------------------------: |

    You may modify other values in this file as you see fit, but this configuration should work for most.

6. Create a log file for Kibana and give it appropriate permissions. Make sure the file path in the command matches the `logging.dest` you set in `/etc/kibana/kibana.yml`.

        touch /var/log/kibana.log
        chmod 777 /var/log/kibana.log

7. Restart Kibana.

        systemctl restart kibana

## Configure The Elastic Stack

The Elastic Stack will require some tuning before it can be accessed via the Wazuh API.

1. Enable memory locking in ElasticSearch to mitigate poor performance. Uncomment or add this line to `/etc/elasticsearch/elasticsearch.yml`:

        bootstrap.memory_lock: true

2. Edit locked memory allocation. Follow the instructions under the appropriate init system used in your system.

    **SystemD**

    Edit the systemd init file and add the following line.

    {: .file-excerpt}
    /etc/systemd/system/multi-user.target.wants/elasticsearch.service
    : ~~~ service
      . . .

      LimitMEMLOCK=infinity

      . . .
      ~~~

    **System V**

    Edit the `/etc/sysconfig/elasticsearch` file. Add or change the following line.

      {: .file}
      /etc/sysconfig/elasticsearch
      : ~~~
        . . .

        MAX_LOCKED_MEMORY=unlimited

        . . .
        ~~~

3. Configure the ElasticSearch heap size. This figure will determine how much memory ElasticSearch is allowed to consume. You must determine the optimum heap size for ElasticSearch based on your system's hardware resources. However, the following two rules always apply:

  - No more than 50% of available RAM
  - No more than 32GB of RAM
  - The `-Xmsg` and `-Xmxg` values must be the same in order to avoid performance issues.

    Open the `jvm.options` file and navigate to the following block:

      {: .file}
      /etc/elasticsearch/jvm.options
      : ~~~ options
        . . .

        # Xms represents the initial size of total heap space
        # Xmx represents the maximum size of total heap space

        -Xms4g
        -Xmx4g

        . . .
        ~~~

This configuration configures ElasticSearch with 4GB of allotted RAM. You may also use the `M` letter to specify megabytes. View your current RAM consumption with the `htop` command. If you do not have htop installed, install it with your distribution's package manager. Allocate as much RAM as you can, up to 50% of the max, while leaving enough available for other daemon and system processes.

{: .caution}
> Set this value carefully. If the system RAM is completely depleted, ElasticSearch will crash.

## Connect The Elastic Stack With The Wazuh API
<!---
COPY EDITOR: Changes requested from A. Lescher, as this section does not quite work. This section can also be cut, as it is not necessary to complete the guide. Leaving in as a comment for editorial feedback.

This section ties everything together with the Wazuh API

### Configure Web Hosting

Configuring Nginx or Apache as a reverse proxy server allows you to secure the Kibana web interface with SSL and limit access to others. Instructions are provided for Nginx and Apache. The instructions assume you have your webserver configured to host virtual domains.

### Set Up a Reverse Proxy Server to Host Kibana as a Subdomain

If you have SSL encryption enabled on your domain, follow the instructions in the **SSL** section. If not, follow the instructions included in the **Non SSL** section. Although you may skip this section if you wish to access Kibana through its server port, this approach is recommended.

### Nginx

1. Create an Nginx config file at `/etc/nginx/conf.d/kibana.conf` and add the contents below, replacing `example.com` with your domain name or external IP address. If you do not have a domain name available, replace the `server_name` parameter value with your Linode's IP address.

**Non SSL**

{: .file}
/etc/nginx/conf.d/kibana.conf
: ~~~ conf
  server {
      listen 80;
      # Remove this line if you do not have IPv6 enabled.
      listen [::]:80;
      server_name kibana.your_domain_name.com;

      location / {
          proxy_pass http://example.com:5601;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }

      auth_basic "Restricted Access";
      auth_basic_user_file /etc/nginx/.htpasswd.users;
  }
  ~~~

**SSL**

{: .file}
/etc/nginx/conf.d/kibana.conf
: ~~~ conf
  server {
      listen 80;
      # Remove this line below if you do note have IPv6 enabled.
      listen [::]:80;
      server_name kibana.adventurecatsnw.com;

      location / {
          proxy_pass http://example.com:5601;
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
          proxy_pass http://example.com:5601;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }

      ssl_certificate /path/to/ssl/certificate.crt;
      ssl_certificate_key /path/to/ssl/certificate.key;

      auth_basic "Restricted Access";
      auth_basic_user_file /etc/nginx/.htpasswd.users;
  }
  ~~~

2. Secure your Kibana site with a login page. Create a **.htpasswd** file first if you do not have one.

        sudo yum install httpd-tools
        touch /etc/nginx/htpasswd.users
        htpasswd -c /etc/nginx/.htpasswd.users YourNewUsername
        chmod 644 /etc/nginx/.htpasswd.users

3. Restart the Nginx server to load the new configuration.

        systemctl restart nginx

### Apache

1. In order for Apache to function as a reverse proxy, *mod_proxy* must be installed. Check that the following modules are enabled by running the `httpd -M` command.

    - proxy_module
    - lbmethod_byrequests_module
    - proxy_balancer_module
    - proxy_http_module

2. Enable the necessary mods in Apache. Open the **00-proxy.conf** file and verify all lines below are included.

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

3.  Create the necessary directories for virtual host configuration:

        mkdir /etc/httpd/{sites-available,sites-enabled}

4. Create a new virtual config file for the Kibana site. Add the contents below to this file. If you do not have a Fully-Qualified Domain Name (FQDN), use your Linode's public IP address for the ServerName parameter.

    **Non SSL**

    {: .file}
    /etc/httpd/sites-available/kibana.conf
      : ~~~ conf
        <VirtualHost *:80>
            ServerName kibana.192.0.2.0.com
            ProxyPreserveHost On

            ProxyPass / http://example.com:5601
            ProxyPassReverse / http://example.com:5601

            <Directory "/">
                AuthType Basic
                AuthName "Restricted Content"
                AuthUserFile /etc/httpd/.htpasswd
                Require valid-user
            </Directory>
        </VirtualHost>
        ~~~

    **SSL**

    {: .file}
    /etc/httpd/sites-available/kibana.conf
    : ~~~ conf
      <VirtualHost *:80>
          ServerName kibana.example.com
          ProxyPreserveHost On

          ProxyPass / http://example.com:5601
          ProxyPassReverse / http://example.com:5601

          <Directory "/">
              AuthType Basic
              AuthName "Restricted Content"
              AuthUserFile /etc/httpd/.htpasswd
              Require valid-user
          </Directory>
      </VirtualHost>

      <VirtualHost *:443
          ServerName kibana.example.com
          ProxyPreserveHost On

          ProxyPass / http://example.com:5601
          ProxyPassReverse / http://example.com:5601

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


4. Enable the new site:

        ln -s /etc/httpd/sites-available/kibana.conf /etc/httpd/sites-enabled/kibana.conf

5. Secure your Kibana site with a login page. Create a **.htpasswd** file first if you do not have one.

        touch /etc/httpd/.htpasswd.users
        htpasswd -c /etc/httpd/.htpasswd.users YourNewUsername
        chmod 644 /etc/httpd/.htpasswd.users

6. Restart Apache.

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

--->
## Open The Kibana Port

Kibana's default access port, 5601, must be opened for TCP traffic. Instructions are presented below for UFW, Iptables, and FirewallD.

**UFW**

        ufw allow 5601/tcp comment "Kibana port"

**Iptables**

        iptables -A INPUT -p tcp --dport 5601 -m comment --comment "Kibana port" -j ACCEPT

{: .note}
> To avoid losing iptables rules after a server reboot, save your rules to a file using `iptables-save`, or install `iptables-persistent` to automatically save rules.

**FirewallD**

        firewall-cmd --add-port=5601/tcp --permanent

## Access The Wazuh API

Now you are ready to access the API and begin making use of your OSSEC Elastic Stack!

1. The Wazuh API requires users to provide credentials in order to log in. Switch to a root session and configure user credentials:

        su -
        cd /var/ossec/api/configuration/auth
        node htpasswd -c user NewUserName
        exit

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

4. In a web browser, navigate to the Kibana homepage. If you created a subdomain for Kibana, the URL might look like *kibana.your_domain.com*. You can also reach Kibana by navigating to your server's IP address and specifying port 5601. Login with the credentials you set up for your Kibana site.

5. If everything is working correctly, you should have landed on the *Discover* page. Navigate to the *Wazuh* page using the left hand side menu. You will be immediately presented with the API configuration page. Underneath the *ADD NEW API* button, enter the user credentials you created for Wazuh. For *URL* and *Port*, enter "http(s)://your_ip_address" and "55000", respectively. Click *SAVE*.

## Where To Go From Here

Your OSSEC Elastic Stack setup is now complete! At this point, you will want to customize and configure your OSSEC rules to better suit the needs in your environment. The Wazuh API contains pre-configured charts and queries, and more information on how to use them can be found in the official Wazuh documentation. Links for further examination of these topics can be found in the External Resources section in this guide.
