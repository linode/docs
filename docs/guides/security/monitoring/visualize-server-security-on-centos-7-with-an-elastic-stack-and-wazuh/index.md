---
slug: visualize-server-security-on-centos-7-with-an-elastic-stack-and-wazuh
description: "Learn how to use the Elastic Stack to collect, log, and visualize security data and threat alerts through Wazuh, part of OSSEC Intrusion Detection."
keywords: ["ossec", "elk stack", "elk,ossec-hids"]
tags: ["monitoring","security","lemp","centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-10-17
modified: 2019-01-31
modified_by:
  name: Linode
title: "Visualize Server Security on CentOS 7 with an Elastic Stack and Wazuh"
title_meta: "How to Visualize Server Security on CentOS 7"
external_resources:
  - '[Wazuh Official Documentation](https://documentation.wazuh.com/current/index.html)'
  - '[OSSEC Official Documentation](http://ossec-docs.readthedocs.io/en/latest/index.html)'
dedicated_cpu_link: true
aliases: ['/security/monitoring/visualize-server-security-on-centos-7-with-an-elastic-stack-and-wazuh/','/security/visualize-server-security-on-centos-7-with-an-elastic-stack-and-wazuh/']
authors: ["Andrew Lescher"]
---

![Visualize Server Security on CentOS 7 with an Elastic Stack and Wazuh](elastic-stack-security-title.jpg "Visualize Server Security on CentOS 7 with an Elastic Stack and Wazuh")

## What are Elasticsearch, Elastic Stack, and Wazuh?

An Elastic Stack, formerly known as an ELK Stack, is a combination of Elasticsearch, Logstash, and Kibana. In this tutorial, you will learn how to install and link together ElasticSearch, Logstash, Kibana, with Wazuh OSSEC to help monitor and visualize security threats to your machine. The resulting structure can be broken down into three core components that work with Wazuh's endpoint security:

-  **Elasticsearch**

      - The heart of the Elastic Stack, Elasticsearch provides powerful search and analytical capabilities. It stores and retrieves data collected by Logstash.

-  **Logstash**

      - Ingests data from multiple sources and passes it along to Elasticsearch which acts as a central database.

-  **Kibana**

      - A self-hosted, web-based tool which provides a multitude of methods to visualize and represent data stored in Elasticsearch.

## What is Wazuh OSSEC

Wazuh is an open source branch of the original [OSSEC HIDS](https://ossec.github.io/) developed for integration into the Elastic Stack. Wazuh provides the OSSEC software with the OSSEC ruleset, as well as a RESTful API Kibana plugin optimized for displaying and analyzing host IDS alerts.

## Before You Begin

1.  Many of the steps in this guide require root privileges. Complete the sections of our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access and remove unnecessary network services. Use `sudo` wherever necessary.

2. Your Linode should have at least [8GB of RAM](https://www.linode.com/pricing). While an Elastic Stack will run on less RAM, the Wazuh Manager will crash if RAM is depleted at any time during use.

3. Add a domain zone, NS record, and A/AAA record for the domain you will use to access your Kibana installation. See the [DNS Manager](/docs/products/networking/dns-manager/) guide for details. If you will access your Kibana instance via your Linode's IP address, you can skip this step.

4. [Create an SSL Certificate](/docs/guides/install-lets-encrypt-to-create-ssl-certificates/), if you will be using SSL encryption for your domain.

5. Install NGINX or Apache. Visit our guides on how to install a LEMP or LAMP stack for CentOS for help:

      - [Install a LEMP Stack on CentOS 7 with FastCGI](/docs/guides/lemp-stack-on-centos-7-with-fastcgi/)
      - [LAMP stack on CentOS 7](/docs/guides/how-to-install-a-lamp-stack-on-centos-7/)

6. Configure your webserver for virtual domain hosting:

      **NGINX**

      - [How to Configure NGINX](/docs/guides/how-to-configure-nginx/)

      **Apache**

      - [Apache Configuration Basics](/docs/guides/apache-configuration-basics/)

## Update System and Install Prerequisites

1. Update system packages:

        yum update -y && yum upgrade -y

1. Install Java 8 JDK:

        yum install java-1.8.0-openjdk.x86_64

1.  Verify the Java installation by checking the version:

        java -version

    Your output should be similar to:

    ```output
    openjdk version "1.8.0_191"
    OpenJDK Runtime Environment (build 1.8.0_191-b12)
    OpenJDK 64-Bit Server VM (build 25.191-b12, mixed mode)
    ```

1. If your Linode doesn't have curl installed, install curl:

        yum install curl

## Install Wazuh

1. Create the `wazuh.repo` repository file and paste the text below:

    {{< file "/etc/yum.repos.d/wazuh.repo" >}}
[wazuh_repo]
gpgcheck=1
gpgkey=https://packages.wazuh.com/key/GPG-KEY-WAZUH
enabled=1
name=CentOS-$releasever - Wazuh
baseurl=https://packages.wazuh.com/3.x/yum/
protect=1
{{< /file >}}

1. Install Wazuh Manager:

        yum install wazuh-manager

1. Install Wazuh API:

    1. Install the Node.js repository:

            curl --silent --location https://rpm.nodesource.com/setup_8.x | bash -

    1. Install NodeJS:

            yum install -y nodejs

    1. Install Wazuh API:

            yum install wazuh-api

        {{< note respectIndent=false >}}
  Python >= 2.7 is required in order to run the Wazuh API. To find out which version of Python is running on your Linode, issue the following command:

      python --version
{{< /note >}}

## Install Elasticsearch, Logstash, and Kibana

Install the Elastic Stack via RPM files to get the latest versions of all the software. Be sure to check the [Elastic website](https://www.elastic.co/downloads) for more recent software versions. Adjust the commands below to match.

### Install Elasticsearch

1. Download the Elasticsearch RPM into the `/opt` directory:

        cd /opt
        curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.5.2.rpm

1.  Install Elasticsearch:

        rpm -i elasticsearch-6.5.2.rpm

1. Enable the Elasticsearch service to start on system boot:

        systemctl enable elasticsearch
        systemctl start elasticsearch

1. Verify that Elasticsearch has installed and is listening on port 9200:

        curl "http://localhost:9200/?pretty"

    You should receive a similar response:

    ```output
    {
    "name" : "-7B24Uk",
    "cluster_name" : "elasticsearch",
    "cluster_uuid" : "UdLfdUOoRH2elGYckoiewQ",
    "version" : {
    &emsp;&emsp;"number" : "6.5.2",
    &emsp;&emsp; "build_flavor" : "default",
    &emsp;&emsp;"build_type" : "rpm",
    &emsp;&emsp;"build_hash" : "9434bed",
    &emsp;&emsp;"build_date" : "2018-11-29T23:58:20.891072Z",
    &emsp;&emsp;"build_snapshot" : false,
    &emsp;&emsp;"lucene_version" : "7.5.0",
    &emsp;&emsp;"minimum_wire_compatibility_version" : "5.6.0",
    &emsp;&emsp;"minimum_index_compatibility_version" : "5.0.0"
    &emsp;&emsp;},
    "tagline" : "You Know, for Search"
    }
    ```

1. Load the Wazuh Elasticsearch template. Replace `exampleIP` with your Linode's public IP address:

        curl https://raw.githubusercontent.com/wazuh/wazuh/3.7/extensions/elasticsearch/wazuh-elastic6-template-alerts.json | curl -X PUT "http://exampleIP:9200/_template/wazuh" -H 'Content-Type: application/json' -d @-


### Install Logstash

1. Download the Logstash RPM into the `/opt` directory:

        cd /opt
        curl -L -O https://artifacts.elastic.co/downloads/logstash/logstash-6.5.2.rpm

1. Install Logstash:

        rpm -i logstash-6.5.2.rpm

1. Enable Logstash on system boot:

        systemctl daemon-reload
        systemctl enable logstash
        systemctl start logstash

1. Download the Wazuh config file for a **single-host architecture** for Logstash:

        curl -so /etc/logstash/conf.d/01-wazuh.conf https://raw.githubusercontent.com/wazuh/wazuh/2.0/extensions/logstash/01-wazuh.conf

1. Add the Logstash user to the `ossec` group to allow access to restricted files:

        usermod -aG ossec logstash

**For CentOS 6 and RHEL 6 Only:**

1.  Edit `/etc/logstash/startup.options` to change the `LS_GROUP=logstash` to `LS_GROUP=ossec`:

    {{< file "/etc/logstash/startup.options" >}}
. . .
# user and group id to be invoked as
LS_USER=logstash
LS_GROUP=logstash
. . .
{{< /file >}}

1. Update the service with the new parameters:

        /usr/share/logstash/bin/system-install

1. Restart Logstash:

        systemctl restart logstash

### Install Kibana

1. Download the Kibana RPM into the `/opt` directory:

        cd /opt
        curl -L -O https://artifacts.elastic.co/downloads/kibana/kibana-6.5.2-x86_64.rpm

1. Install Kibana:

        rpm -i kibana-6.5.2-x86_64.rpm

1. Enable Kibana on system boot:

        systemctl enable kibana
        systemctl start kibana

1. Install the Wazuh app for Kibana:

        sudo -u kibana NODE_OPTIONS="--max-old-space-size=3072" /usr/share/kibana/bin/kibana-plugin install https://packages.wazuh.com/wazuhapp/wazuhapp-3.7.1_6.5.2.zip

    The Kibana app installation process takes several minutes to complete and it may appear as though the process has stalled.

1. By default Kibana only listens on the loopback interface. To configure it to listen on all interfaces, update the `/etc/kibana/kibana.yml` file and uncomment `server.host` and the following value:

    {{< file "/etc/kibana/kibana.yml">}}
# Specifies the address to which the Kibana server will bind. IP addresses and host names are both valid values.
# The default is 'localhost', which usually means remote machines will not be able to connect.
# To allow connections from remote users, set this parameter to a non-loopback address.
server.host: "0.0.0.0"
    {{</ file >}}

    Reference the table below for information on other configurations available in the `/etc/kibana/kibana.yml` file:

    | Value           | Parameter                                                                                  |
    | :-------------: | :----------------------------------------------------------------------------------------: |
    | server.port     | If the default port `5601` is in use, change this value.                                  |
    | server.name     | This value is used for display purposes only. Set to anything you wish, or leave it unchanged. |
    | logging.dest    | Specify a location to log program information. `/var/log/kibana.log` is recommended.       |

    You may modify other values in this file as you see fit, but this configuration should work for most.

1. Restart Kibana:

        systemctl restart kibana

## Configure the Elastic Stack

The Elastic Stack will require some tuning before it can be accessed via the Wazuh API.

1. Enable memory locking in Elasticsearch to mitigate poor performance. Uncomment the `bootstrap.memory_lock: true` line in the `/etc/elasticsearch/elasticsearch.yml` file:

    {{< file "/etc/elasticsearch/elasticsearch.yml">}}
# ----------------------------------- Memory -----------------------------------
#
# Lock the memory on startup:
#
bootstrap.memory_lock: true
#
    {{</ file >}}

1. Edit locked memory allocation. Follow the instructions under the appropriate init system used on your Linode:

    **SystemD**

    Edit the systemd init file and add the following line:

    {{< file "/etc/systemd/system/multi-user.target.wants/elasticsearch.service" >}}
. . .
LimitMEMLOCK=infinity
. . .
{{< /file >}}

    **System V**

    Edit the `/etc/sysconfig/elasticsearch` file. Add or change the following line:

    {{< file "/etc/sysconfig/elasticsearch" >}}
. . .
MAX_LOCKED_MEMORY=unlimited
. . .
{{< /file >}}

1. Configure the Elasticsearch heap size based on your Linode's resources. This figure will determine how much memory Elasticsearch is allowed to consume. Keep the following rules in mind:

      - No more than 50% of available RAM
      - No more than 32GB of RAM
      - The `-Xmsg` and `-Xmxg` values must be the same in order to avoid performance issues.

    Open the `jvm.options` file and navigate to the block shown here:

    {{< file "/etc/elasticsearch/jvm.options" >}}
. . .
# Xms represents the initial size of total heap space
# Xmx represents the maximum size of total heap space

-Xms4g
-Xmx4g
. . .
{{< /file >}}

    This configures Elasticsearch with 4GB of allotted RAM. You may also use the `M` letter to specify megabytes, `Xms4096M` in this example. View your current RAM consumption with the `htop` command. If you do not have htop installed, install it with your distribution's package manager. Allocate as much RAM as you can, up to 50% of the max, while leaving enough available for other daemon and system processes.

1. Restart Elasticsearch for the configurations to take effect:

        systemctl daemon-reload
        systemctl restart elasticsearch

## Configure a Reverse Proxy

A reverse proxy server allows you to secure the Kibana web interface with SSL and limit access to others. Instructions are provided for NGINX and Apache. The instructions assume you have your webserver configured to host virtual domains.

### Set up a Reverse Proxy Server to Host Kibana as a Subdomain

If you have SSL encryption enabled on your domain, follow the instructions in the **HTTPS** section below. If not, follow the instructions included in the **HTTP** section. Although you may skip this section if you wish to access Kibana through its server port, this approach is recommended.

#### NGINX

1. Navigate to your NGINX virtual host config directory. Create a new virtual host config file and name it something similar to `example.conf`. Replace `example.com` Add the contents below to this file. If you do not have a domain name available, replace the `server_name` parameter value with your Linode's external IP address:

    **HTTP**

    {{< file "/etc/nginx/conf.d/example.com.conf" >}}
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
{{< /file >}}

    **HTTPS**

    {{< file "/etc/nginx/conf.d/example.com.conf" >}}
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
  auth_basic_user_file /etc/nginx/.htpasswd;
}
{{< /file >}}

1. Install `httpd-tools` if it is not already installed on your Linode:

        yum install httpd-tools

1. Secure your Kibana site with a login page. Create a **.htpasswd** file first if you do not have one:

        touch /etc/nginx/.htpasswd
        htpasswd -c /etc/nginx/.htpasswd YourNewUsername
        chmod 644 /etc/nginx/.htpasswd

1. Restart the NGINX server to load the new configuration:

        systemctl restart nginx

### Apache

1. In order for Apache to function as a reverse proxy, *mod_proxy* must be installed. Check that the following modules are enabled by running the `httpd -M` command:

        httpd -M

    - proxy_module
    - lbmethod_byrequests_module
    - proxy_balancer_module
    - proxy_http_module

1. Enable the necessary mods in Apache. Open `00-proxy.conf` and verify that the lines below are included:

    {{< file "/etc/httpd/conf.modules.d/00-proxy.conf" >}}
. . .
LoadModule proxy_module modules/mod_proxy.so
LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
LoadModule proxy_http_module modules/mod_proxy_http.so
. . .
{{< /file >}}

1. Create a new virtual config file for the Kibana site. Add the contents below to this file. If you do not have a domain name available, replace the `server_name` parameter value with your Linode's public IP address. Replace `kibana.exampleIPorDomain` and `http://exampleIPorDomain` with your specific values:

    **HTTP**

    {{< file "/etc/httpd/sites-available/example.com.conf" >}}
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
{{< /file >}}

    **HTTPS**

    {{< file "/etc/httpd/sites-available/example.com.conf" >}}
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
{{< /file >}}

1. Secure your Kibana site with a login page. Create a **.htpasswd** file first if you do not have one:

        touch /etc/apache2/htpasswd.users
        htpasswd -c /etc/apache2/.htpasswd.users YourNewUsername
        chmod 644 /etc/apache2/.htpasswd.users

1. Restart Apache:

        systemctl restart httpd

### Add the Kibana Subdomain to the DNS Manager

The new Kibana subdomain will need to be configured in the Linode DNS Manager.

1. Login to the Linode Manager and select **Domains**. Click on your domain's corresponding ellipses and select **Edit DNS Records**. Add a new A/AAA record for the subdomain. Refer to the table below for the field values.

    | Field           | Value                                                |
    | :-------------: | :--------------------------------------------------: |
    | Hostname        | Enter your subdomain name here - ex. kibana          |
    | IP Address      | Set this value to your Linode's external IP address. |
    | TTL             | Set this to 5 minutes.                               |

1. Click **Save Changes**.

## Open the Kibana Port

Kibana's default access port, `5601`, must be opened for TCP traffic. Instructions are presented below for FirewallD, iptables, and UFW.

**FirewallD**

    firewall-cmd --add-port=5601/tcp --permanent
    firewall-cmd --reload

1. Set SELinux to allow HTTP connections:

        setsebool -P httpd_can_network_connect 1

**iptables**

    iptables -A INPUT -p tcp --dport 5601 -m comment --comment "Kibana port" -j ACCEPT

{{< note respectIndent=false >}}
To avoid losing iptables rules after a server reboot, save your rules to a file using `iptables-save`.
{{< /note >}}

**UFW**

    ufw allow 5601/tcp comment "Kibana port"

{{< content "cloud-firewall-shortguide" >}}

## Connect the Elastic Stack with the Wazuh API

Now you are ready to access the API and begin making use of your OSSEC Elastic Stack.

1. The Wazuh API requires users to provide credentials in order to login. Navigate to `/var/ossec/api/configuration/auth`. Replace `NewUserName` with whatever user name you choose. Set a password following the system prompts:

        node htpasswd -c user NewUserName

1. Restart the Wazuh API:

        systemctl restart wazuh-api

1. Check the status of all daemon components and verify that they are running:

        systemctl -l status wazuh-api
        systemctl -l status wazuh-manager
        systemctl -l status elasticsearch
        systemctl -l status logstash
        systemctl -l status kibana
        systemctl -l status nginx

    {{< note respectIndent=false >}}
If the Wazuh Manager fails to start and you determine the cause to be one of the OSSEC rules or decoders, disable that specific rule/decoder for now. Find the rules and decoders in the `/var/ossec/ruleset` directory. To disable, rename the file to any other file extension.
{{< /note >}}

1. In a web browser, navigate to the Kibana homepage. If you created a subdomain for Kibana, the URL will be similar to `kibana.exampleIPorDomain`. You can also reach Kibana by navigating to your server's IP address and specifying port `5601`. Login with the credentials you setup for your Kibana site.

1. If everything is working correctly, you should have landed on the **Discover** page. Navigate to the **Wazuh** page using the left hand side menu. You will be immediately presented with the API configuration page. Underneath the **ADD NEW API** button, enter the user credentials you created for Wazuh. For URL and Port, enter you URL or IP and `55000`, then click **SAVE**.

## Where To Go From Here

Your OSSEC Elastic Stack setup is now complete! At this point, you will want to customize and configure your OSSEC rules to better suit the needs of your environment. The Wazuh API contains pre-configured charts and queries, and more information on how to use them can be found in the official [Wazuh documentation](https://documentation.wazuh.com/current/user-manual/index.html).
