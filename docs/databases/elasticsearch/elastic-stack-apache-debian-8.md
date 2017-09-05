---
author:
  name: Linode
  email: docs@linode.com
contributor:
  name: Tyler Langlois
  link: https://tjll.net
description: 'Install Elasticsearch, Logstash, and Kibana to collect and visualize webserver logs on Debian 8.'
external_resources:
 - '[Elastic Documentation](https://www.elastic.co/guide/index.html)'
keywords: 'apache debian 8,apache debian jessie,linux web server,apache on debian,apache jessie,apache,debian,web server,elastic,elasticsearch,logstash,kibana,elk stack,elastic stack,stack,log,graph'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, June 29th, 2015'
title: 'Visualizing Apache Webserver Logs with the Elastic Stack on Debian 8'
---

*This is a Linode Community guide. If you're an expert on something we need a guide on, you too can [get paid to write for us](/docs/contribute).*
----


The [Elastic](https://www.elastic.co/) stack, which includes Elasticsearch, Logstash, and Kibana, is a suite of tools that provide a free and open source solution to collect and analyze data. This guide will explain how to install all these components and use them to explore Apache webserver logs in Kibana, a browser-based tool used to create visualizations.

This guide will walk through the installation of version 5 of the stack, which is latest as of the time of this writing.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Follow the steps in our [Apache Web Server on Debian 8 (Jessie)](/docs/web-servers/apache/apache-web-server-debian-8) guide to set up and configure Apache on your server.

3.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

4.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install OpenJDK 8

Elasticsearch *requires* recent versions of Java, and will not run with the version of OpenJDK available by default on Debian Jessie, so install the `jessie-backports` source in order to get OpenJDK 8:

1.  Add Jessie backports to your list of APT sources:

        echo deb http://ftp.debian.org/debian jessie-backports main | sudo tee -a /etc/apt/sources.list.d/jessie-backports.list

2.  Update the APT package cache:

        sudo apt-get update

3.  Install OpenJDK 8:

        sudo apt-get install -y openjdk-8-jre-headless ca-certificates-java

## Install Elastic APT Repository

The Elastic package repositories contain all the necessary packages for this tutorial, so install it first before proceeding with the individual services.

1.  Install the official Elastic APT package signing key:

        wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

2.  Install the `apt-transport-https` package, which is required to retrieve deb packages served over HTTPS on Debian 8:

        sudo apt-get install apt-transport-https

3.  Add the APT repository information to your server's list of sources:

        echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-5.x.list

4.  Refresh the list of available packages:

        sudo apt-get update

## Installation

Before configuring and loading log data, first install each piece of the stack.

### Elasticsearch

1.  Install the `elasticsearch` package:

         sudo apt-get install elasticsearch

2.  Set the JVM heap size to approximately half of your server's available memory. For example, if your server has 1 gigabyte of RAM, change the `Xms` and `Xmx` values in the `/etc/elasticsearch/jvm.options` file to the following, and leave the other values in this file unchanged:

    {: .file}
    /etc/elasticsearch/jvm.options
    :   ~~~ conf
        -Xms512m
        -Xmx512m
        ~~~

3.  Start and enable the `elasticsearch` service:

         sudo systemctl enable --now elasticsearch

3.  Wait for a few moments for the service to start, then confirm that the Elasticsearch API is available:

         curl localhost:9200

    The Elasticsearch REST API should return a JSON response similar to the following:

         {
           "name" : "e5iAE99",
           "cluster_name" : "elasticsearch",
           "cluster_uuid" : "lzuLNZa0Qo-7_puJZZjR4Q",
           "version" : {
             "number" : "5.5.2",
             "build_hash" : "b2f0c09",
             "build_date" : "2017-08-14T12:33:14.154Z",
             "build_snapshot" : false,
             "lucene_version" : "6.6.0"
           },
           "tagline" : "You Know, for Search"
         }

### Logstash

1.  Install the `logstash` package:

         sudo apt-get install logstash

### Kibana

1.  Install the `kibana` package:

         sudo apt-get install kibana

## Configuration

### Elasticsearch

By default, Elasticsearch will create five shards and one replica for every index that is created. When deploying to production, these are reasonable settings to use. In this tutorial, however, only one server is used in the Elasticsearch setup, so multiple shards and replicas are unncessary. Changing these defaults can avoid unecessary overhead.

1.  Create a temporary JSON file with an *index template*, which instructs Elasticsearch to set the number of shards to one and number of replicas to zero for all matching index names (in this case, a wildcard `*`):

    {: .file}
    template.json
    :   ~~~ json
        {
          "template": "*",
          "settings": {
            "index": {
              "number_of_shards": 1,
              "number_of_replicas": 0
            }
          }
        }
        ~~~

2.  Use `curl` to create an index template with these settings, which will be applied to all indices created hereafter:

        curl -XPUT http://localhost:9200/_template/defaults -d @template.json

3.  Elasticsearch should return:

        {"acknowledged":true}

### Logstash

In order to collect Apache access logs, Logstash must be configured to watch any necessary files and process them, eventually sending them to Elasticsearch. This configuration files assumes that a site has been set up according to the previously mentioned [Apache Web Server on Debian 8 (Jessie)](/docs/web-servers/apache/apache-web-server-debian-8) guide to find the correct log path.

1.  Create the following Logstash configuration file to do so:

    {: .file}
    /etc/elasticsearch/jvm.options
    :   ~~~ conf
        input {
          file {
            path => '/var/www/*/logs/access.log'
          }
        }

        filter {
          grok {
            match => { "message" => "%{COMBINEDAPACHELOG}" }
          }
        }

        output {
          elasticsearch { }
        }
        ~~~

2.  Start and enable `logstash`:

        sudo systemctl enable --now logstash

### Kibana

There are no configuration file changes necessary for Kibana, so the daemon can be started and enabled:

    sudo systemctl enable --now kibana

In order for Kibana to find log entries to configure an *index pattern*, logs must first be sent to Elasticsearch. With the three daemons started, log files should be collected with Logstash and stored in Elasticsearch, so issue several requests to Apache to generate logs:

    for i in `seq 1 5` ; do curl localhost ; sleep 0.2 ; done

Next, open Kibana in your browser. Kibana listens for requests on port 5601, so depending on your Linode's configuration, you may need to open this port in your firewall configuration, or port-forward it through ssh. The landing page should look similar to the following:

[pic]

This screen permits us to create an index pattern, which is a way for Kibana to know which indices to search when browsing logs and creating dashboards. The default value of `logstash-*` matches the indices created by Logstash by default, so clicking "Create" on this screen is enough to configure Kibana and begin reading logs.
