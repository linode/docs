File excerpt: Author Submission

---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Graylog is a free, open source and powerful log management and analysis tool that can be used for monitoring SSH logins and unusual activity to debugging applications.
It is based on Java, Elasticsearch, MongoDB and provides a beautiful web interface for centralized log management and log analysis.'
keywords: 'Debian, Graylog, Monitoring'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Weekday, Month 00st, 2017'
modified: Weekday, Month 00th, 2017
modified_by:
  name: Linode
title: 'How to Install and Configure Graylog2 on Debian 9'
contributor:
  name: Hitesh Jethva
  link: https://github.com/hitjethva
  external_resources:
---

*This is a Linode Community guide. If you're an expert on something we need a guide on, you too can [get paid to write for us](/docs/contribute).*
----


Graylog is a free, open source and powerful log management and analysis tool that can be used for monitoring SSH logins and unusual activity to debugging applications.
It is based on Java, Elasticsearch, MongoDB and provides a beautiful web interface for centralized log management and log analysis.
Graylog uses, Elasticsearch for searching and storing the log messages, and MongoDB to store the meta information and configuration. Graylog collects, index and analyze the logs from various inputs and display them through a web interface.
Compare to other log monitoring tool, Graylog is a more finished and enterprise-ready tool out of the box.

This guide shows how to install and configure Graylog2 with Elasticsearch and MongoDB on Debian 9 server.

File excerpt: Guides Written for a Non-Root User

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2. Not all required dependencies are available in the standard repository, so you will need to add Debian Backports to the list of package sources: 

   echo "deb http://ftp.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/backports.list

2. Update your system:

    apt-get update && apt-get upgrade

##Prerequisites
* Server running Debian 9.
* Minimum 4 GB RAM installed on your server.

##Install Java
Elasticsearch and Graylog is a Java based application, so you will need to install the latest version of the Java to your system.

1. Install the latest version of the Java by running the following command:

    apt-get install openjdk-8-jre-headless -y

2. Once Java is installed, check the version of the Java with the following command:
	
    java -version

You should see the Java version as follows:

    java version "1.8.0_131"
    Java(TM) SE Runtime Environment (build 1.8.0_131-b11)
    Java HotSpot(TM) 64-Bit Server VM (build 25.131-b11, mixed mode)

3. You will also need to install some additional packages to your system. You can install all of them by just running the following command:

    apt-get install apt-transport-https uuid-runtime pwgen -y

##Install and Configure Elasticsearch
Graylog uses Elasticsearch for storing the log messages and offers a searching facility. By default, Elasticsearch is not available in Debian 9 repository. So you will need to add Elasticsearch repository to your system.

1. First, download and install GPG key with the following command:

     wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | apt-key add -

2. Next, add Elasticsearch repository to the APT with the following command:

    echo "deb https://packages.elastic.co/elasticsearch/2.x/debian stable main" | tee -a /etc/apt/sources.list.d/elasticsearch-2.x.list

3. Next, update the repository by running the following command:

    apt-get update -y

4. Once the repository is updated, install Elasticsearch by running the following command:

    apt-get install elasticsearch -y

5. Start Elasticsearch service and enable it to start on boot with the following command:

    systemctl start elasticsearch
    systemctl enable elasticsearch

6. Next, you will need to edit `elasticsearch.yml` file located at /etc/elasticsearch/ directory:

{: .file }
/etc/elasticsearch/elasticsearch.yml
:   ~~~ conf
    cluster.name: graylog
    network.host: 192.168.0.102
    discovery.zen.ping.timeout: 10s
    discovery.zen.ping.multicast.enabled: false
    discovery.zen.ping.unicast.hosts: ["192.168.0.102:9300"]
    script.inline: false
    script.indexed: false
    script.file: false

    ~~~

{: .note}
> Replace the IP address 192.168.0.102 with your server IP address.

Save and close the, then restart Elasticsearch service with the following command:

    systemctl restart elasticsearch

7. Once the Elasticsearch gets fully restarted, it should be listening on port `9200`. You can check the response by running the following command:

    curl -X GET http://192.168.0.102:9200

You can also test the health of the Elasticsearch with the following command:

    curl -XGET 'http://192.168.0.102:9200/_cluster/health?pretty=true'

{: .note}
> Make sure the output yields the cluster status as "green"

##Install MongoDB
Graylog uses MongoDB as a database to store meta information and configuration. By default, MongoDB is available in Debian 9 repository. You can install it by just running the following command:

    apt-get install mongodb-server -y

After installing MongoDB, you can proceed to install Graylog server.

##Install and Configure Graylog Server
In order to install Graylog server, you will need to download and install Graylog repository to your system.

1. First, download and install Graylog repository with the following command:

    wget https://packages.graylog2.org/repo/packages/graylog-2.2-repository_latest.deb
    dpkg -i graylog-2.2-repository_latest.deb

2. Next, update Graylog repository, then install Graulog server by running the following command:

    apt-get update -y
    apt-get install graylog-server -y

3. Next, you will need to set password secret and hash password for root user.

First, set a password secret using the pwgen command as shown below:

    pwgen -N 1 -s 96

You should see the following output:

    nNPjRmvyyyPc0YKySXhkebfwUYvW2dQz7kD1GxBq7qhJre1eIAySsUbmlYNKiYZnHquHPu8pTswvc3MFSVDrwn5AmdwOSMri

Next, set a hash password for root user with the following command:

    echo -n roothashpassword | sha256sum

You should see the following output:

    4c941dd2a116bf235e943771ad16c4e8877d75c597936accf168e08c5f93ce24

{: .note}
> You will need this password to login into the Graylog web interface.


4. Next, edit the Graylog server main configuration file `server.conf` located inside `/etc/graylog/server/` directory:

{: .file }
/etc/graylog/server/server.conf
:   ~~~ conf
    is_master = true
    node_id_file = /etc/graylog/server/node-id
    password_secret = nNPjRmvyyyPc0YKySXhkebfwUYvW2dQz7kD1GxBq7qhJre1eIAySsUbmlYNKiYZnHquHPu8pTswvc3MFSVDrwn5AmdwOSMri
    root_username = admin
    root_password_sha2 = 4c941dd2a116bf235e943771ad16c4e8877d75c597936accf168e08c5f93ce24
    root_timezone = UTC
    plugin_dir = /usr/share/graylog-server/plugin
    rest_listen_uri = http://0.0.0.0:9000/api/
    rest_enable_cors = true
    web_listen_uri = http://0.0.0.0:9000/
    rotation_strategy = count
    elasticsearch_max_docs_per_index = 20000000
    elasticsearch_max_number_of_indices = 7
    retention_strategy = delete
    elasticsearch_shards = 4
    elasticsearch_replicas = 1
    elasticsearch_index_prefix = graylog
    allow_leading_wildcard_searches = true
    allow_highlighting = false
    elasticsearch_cluster_name = graylog
    elasticsearch_discovery_zen_ping_unicast_hosts = 192.168.0.102:9300
    elasticsearch_http_enabled = false
    elasticsearch_network_host = 0.0.0.0
    elasticsearch_discovery_initial_state_timeout = 3s
    elasticsearch_analyzer = standard
    output_batch_size = 500
    output_flush_interval = 1
    output_fault_count_threshold = 5
    output_fault_penalty_seconds = 30
    ring_size = 65536
    inputbuffer_ring_size = 65536
    inputbuffer_processors = 2
    inputbuffer_wait_strategy = blocking
    processbuffer_processors = 5
    outputbuffer_processors = 3
    processor_wait_strategy = blocking
    message_journal_enabled = true
    message_journal_dir = /var/lib/graylog-server/journal
    async_eventbus_processors = 2
    lb_recognition_period_seconds = 3
    alert_check_interval = 60
    mongodb_uri = mongodb://localhost/graylog
    mongodb_max_connections = 1000
    mongodb_threads_allowed_to_block_multiplier = 5
    transport_email_enabled = true
    content_packs_dir = /usr/share/graylog-server/contentpacks
    content_packs_auto_load = grok-patterns.json
    proxied_requests_thread_pool_size = 32

    ~~~

{: .note}
> Replace the `root_password_sha2` and `password_secret` value with which we have generated previously.

Save the file when you are finished.
Finally, start the Graylog server and enable it to start at boot time by running the following command:

    systemctl start graylog-server
    systemctl enable graylog-server

5. Check the Graylog server log whether it is working or not with the following command:

    tail -f /var/log/graylog-server/server.log

##Access Graylog
Now, Graylog is up and running, Its time to access the Graylog web interface.

Open your web browser and navigate to URL `http://192.168.0.102:9000`, you will be redirected to the Graylog login page as shown below:

[![Graylog Login Page](/docs/assets/Screenshot-of-graylog-login-page_small.png)](/docs/assets/Screenshot-of-graylog-login-page.png)


Provide the username as `admin` and password as `roothashpassword` (which you have generated previously), then click on the **Sign In** button. You should see the Graylog default dashboard in below image:

[![Graylog Dashboard](/docs/assets/Screenshot-of-graylog-dashboard_small.png)](/docs/assets/Screenshot-of-graylog-dashboard.png)


Next, you will need to configure Graylog Input to receive the logs from the external source. To do so, click on the System > Inputs. Then select Syslog UDP from this dropdown, and then click on the **Launch new input** button. You should see the following image:

[![Graylog Add Input](/docs/assets/Screenshot-of-graylog-syslog-input_small.png)](/docs/assets/Screenshot-of-graylog-syslog-input.png)

Here, fill all the details then click on the **Save** button. You should see the local input in the following image:

[![Graylog Input Dashboard](/docs/assets/Screenshot-of-graylog-input-dashboard_small.png)](/docs/assets/Screenshot-of-graylog-input-dashboard.png)

Your Graylog input is configured and listening on port 8514. Now, you will need to configure rsyslog to send its system logs to the input we just created.
You can do this by editing `rsyslog.conf` file:

{: .file-excerpt }
/etc/rsyslog.conf
:   ~~~ ini
    $template GRAYLOGRFC5424,"%protocol-version% %timestamp:::date-rfc3339% %HOSTNAME% %app-name% %procid% %msg%\n"
    *.* @192.168.0.102:8514;GRAYLOGRFC5424
    ~~~

Save and close the file when you are finished, then restart your server to apply these changes:

    reboot

After restarting, login to your Graylog server web interface and click on the System > Inputs. Then click on the **Show received messages** button. You should see all the syslog messages in the following image:

[![Graylog Log Messages](/docs/assets/Screenshot-of-graylog-server-messeges_small.png)](/docs/assets/Screenshot-of-graylog-server-messeges.png)




