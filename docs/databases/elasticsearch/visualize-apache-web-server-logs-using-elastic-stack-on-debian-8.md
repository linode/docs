---
author:
  name: Linode
  email: docs@linode.com
contributor:
  name: Tyler Langlois
  link: https://tjll.net
description: 'This guide will show how to use Elasticsearch, Logstash, and Kibana to collect and visualize web server logs.'
og_description: 'The Elastic Stack - Elasticsearch, Logstash, & Kibana - provides a free, open-source solution to search, collect, and analyze data. This guide shows how to install all three components to explore Apache web server logs in Kibana.'
external_resources:
 - '[Elastic Documentation](https://www.elastic.co/guide/index.html)'
keywords: 'apache debian 8,linux web server,elasticsearch,logstash,kibana,elk stack,elastic stack'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, September 18th, 2017'
modified: Monday, November 6, 2017
modified_by:
  name: Linode
title: 'Visualize Apache Web Server Logs Using an Elastic Stack on Debian 8'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

![Visualize Apache Web Server Logs Using an Elastic Stack on Debian 8](/docs/assets/elastic-stack-visualize-server-logs-title.jpg "Visualize Apache Web Server Logs Using an Elastic Stack on Debian 8")


## What is an Elastic Stack?

The [Elastic](https://www.elastic.co/) stack, which includes Elasticsearch, Logstash, and Kibana, is a troika of tools that provides a free and open-source solution that searches, collects and analyzes data from any source and in any format and visualizes it in real time. 

This guide will explain how to install all three components and use them to explore Apache web server logs in Kibana, the browser-based component that visualizes data.

This guide will walk through the installation and set up of version 5 of the Elastic stack, which is the latest at time of this writing.

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

Elasticsearch requires the most recent versions of Java, and will not run with the default OpenJDK version available on Debian Jessie. Install the `jessie-backports` source in order to get OpenJDK 8:

1.  Add Jessie backports to your list of APT sources:

        echo deb http://ftp.debian.org/debian jessie-backports main | sudo tee -a /etc/apt/sources.list.d/jessie-backports.list

2.  Update the APT package cache:

        sudo apt-get update

3.  Install OpenJDK 8:

        sudo apt-get install -y -t jessie-backports openjdk-8-jre-headless ca-certificates-java

4.  Make sure your system is using the updated version of Java. Run the following command and choose `java-8-openjdk-amd64/jre/bin/java` from the dialogue menu that opens:

        sudo update-alternatives --config java

## Install Elastic APT Repository

The Elastic package repositories contain all of the necessary packages for this tutorial, so install it first before proceeding with the individual services.

1.  Install the official Elastic APT package signing key:

        wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

2.  Install the `apt-transport-https` package, which is required to retrieve deb packages served over HTTPS on Debian 8:

        sudo apt-get install apt-transport-https

3.  Add the APT repository information to your server's list of sources:

        echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-5.x.list

4.  Refresh the list of available packages:

        sudo apt-get update

## Install Elastic Stack

Before configuring and loading log data, install each piece of the stack, individually.

### Elasticsearch

1.  Install the `elasticsearch` package:

         sudo apt-get install elasticsearch

2.  Set the JVM heap size to approximately half of your server's available memory. For example, if your server has 1GB of RAM, change the `Xms` and `Xmx` values in the `/etc/elasticsearch/jvm.options` file to the following, and leave the other values in this file unchanged:

    {: .file}
    /etc/elasticsearch/jvm.options
    :   ~~~ conf
        -Xms512m
        -Xmx512m
        ~~~

3.  Start and enable the `elasticsearch` service:

         sudo systemctl enable elasticsearch
         sudo systemctl start elasticsearch

3.  Wait a few moments for the service to start, then confirm that the Elasticsearch API is available:

         curl localhost:9200

    Elasticsearch may take some time to start up. If you need to determine whether the service has started successfully or not, you can use the `systemctl status elasticsearch` command to see the most recent logs. The Elasticsearch REST API should return a JSON response similar to the following:

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

Install the `logstash` package:

     sudo apt-get install logstash

### Kibana

Install the `kibana` package:

     sudo apt-get install kibana

## Configure Elastic Stack

### Elasticsearch

By default, Elasticsearch will create five shards and one replica for every index that's created. When deploying to production, these are reasonable settings to use. In this tutorial, only one server is used in the Elasticsearch setup, so multiple shards and replicas are unncessary. Changing these defaults can avoid unecessary overhead.

1.  Create a temporary JSON file with an *index template* that instructs Elasticsearch to set the number of shards to one and number of replicas to zero for all matching index names (in this case, a wildcard `*`):

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

2.  Use `curl` to create an index template with these settings that'll be applied to all indices created hereafter:

        curl -XPUT http://localhost:9200/_template/defaults -d @template.json

3.  Elasticsearch should return:

        {"acknowledged":true}

### Logstash

In order to collect Apache access logs, Logstash must be configured to watch any necessary files and then process them, eventually sending them to Elasticsearch. This configuration file assumes that a site has been set up according to the previously mentioned [Apache Web Server on Debian 8 (Jessie)](/docs/web-servers/apache/apache-web-server-debian-8) guide to find the correct log path.

1.  Create the following Logstash configuration:

    {: .file}
    /etc/logstash/conf.d/apache.conf
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

        sudo systemctl enable logstash
        sudo systemctl start logstash

### Kibana


1.  Open `/etc/kibana/kibana.yml`. Uncomment the following two lines and replace `localhost` with the public IP address of your Linode. If you have a firewall enabled on your server, make sure that the server accepts connections on port `5601`.

    {:.file-excerpt}
    /etc/kibana/kibana.yml
    :  ~~~
       server.port: 5601
       server.host: "localhost"
       ~~~

2.  Enable and start the Kibana service:

        sudo systemctl enable kibana
        sudo systemctl start kibana

3.  In order for Kibana to find log entries to configure an *index pattern*, logs must first be sent to Elasticsearch. With the three daemons started, log files should be collected with Logstash and stored in Elasticsearch. To generate logs, issue several requests to Apache:

        for i in `seq 1 5` ; do curl localhost ; sleep 0.2 ; done

4.  Next, open Kibana in your browser. Kibana listens for requests on port `5601`, so depending on your Linode's configuration, you may need to port-forward Kibana through SSH. The landing page should look similar to the following:

    ![Kibana 5 Index Pattern Configuration](/docs/assets/elastic-stack-debian-8-kibana-index-pattern.png "Kibana 5 Index Pattern Configuration")

    This screen permits you to create an index pattern, which is a way for Kibana to know which indices to search for when browsing logs and creating dashboards. The default value of `logstash-*` matches the default indices created by Logstash. Clicking "Create" on this screen is enough to configure Kibana and begin reading logs.

    {: .note}
    >
    >Throughout this section, logs will be retrieved based upon a time window in the upper right corner of the Kibana interface (such as "Last 15 Minutes"). If at any point, log entries no longer are shown in the Kibana interface, click this timespan and choose a wider range, such as "Last Hour" or "Last 1 Hour" or "Last 4 Hours," to see as many logs as possible.

## View Logs

After the previously executed `curl` commands created entries in the Apache access logs, Logstash will have indexed them in Elasticsearch. These are now visible in Kibana.

The "Discover" tab on the left-hand side of Kibana's interface (which should be open by default after configuring your index pattern) should show a timeline of log events:

![Kibana 5 Discover Tab](/docs/assets/elastic-stack-debian-8-kibana-discover.png "Kibana 5 Discover Tab")

Over time, and as other requests are made to the web server via `curl` or a browser, additional logs can be seen and searched from Kibana. The Discover tab is a good way to familiarize yourself with the structure of the indexed logs and determine what to search and analyze.

In order to view the details of a log entry, click the drop-down arrow to see individual document fields:

![Kibana 5 Document Fields](/docs/assets/elastic-stack-debian-8-kibana-field-dropdown.png "Kibana 5 Document Fields")

Fields represent the values parsed from the Apache logs, such as `agent`, which represents the `User-Agent` header, and `bytes`, which indicates the size of the web server response.

### Analyze Logs 

Before continuing, generate a couple of dummy 404 log events in your web server logs to demonstrate how to search and analyze logs within Kibana:

    for i in `seq 1 2` ; do curl localhost/notfound-$i ; sleep 0.2 ; done

#### Search Data

The top search bar within the Kibana interface allows you to search for queries following the [query string syntax](https://www.elastic.co/guide/en/elasticsearch/reference/5.5/query-dsl-query-string-query.html#query-string-syntax) to find results.

For example, to find the 404 error requests you generated from among 200 OK requests, enter the following in the search box:

    response:404

Then, click the magnifying glass search button.

![Kibana 5 Search Bar](/docs/assets/elastic-stack-debian-8-kibana-search-bar.png "Kibana 5 Search Bar")

The user interface will now only return logs that contain the "404" code in their response field.

#### Analyze Data

Kibana supports many types of Elasticsearch queries to gain insight into indexed data. For example, consider the traffic that resulted in a "404 - not found" response code. Using [aggregations](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html), useful summaries of data can be extracted and displayed natively in Kibana.

To create one of these visualizations, begin by selecting the "Visualize" tab:

![Kibana 5 Visualize Tab](/docs/assets/elastic-stack-debian-8-kibana-visualize-tab.png "Kibana 5 Visualize Tab")

Then, select one of the icons to create a visualization:

![Kibana 5 Create Visualization](/docs/assets/elastic-stack-debian-8-kibana-create-visualization.png "Kibana 5 Create Visualization")

Select "Pie" to create a new pie chart:

![Kibana 5 Select Pie Chart Visualization](/docs/assets/elastic-stack-debian-8-kibana-pie-chart.png "Kibana 5 Select Pie Chart Visualization")

Then select the `logstash-*` index pattern to determine from where the data for the pie chart will come:

![Kibana 5 Select Pie Chart Index](/docs/assets/elastic-stack-debian-8-kibana-vis-index.png "Kibana 5 Select Pie Chart Index")

At this point, a pie chart should appear in the interface ready to be configured. Follow these steps to configure the visualization in the user interface pane that appears to the left of the pie chart:

- Select "Split Slices" to create more than one slice in the visualization.
- From the "Aggregation" drop-down menu, select "Terms" to indicate that unique terms of a field will be the basis for each slice of the pie chart.
- From the "Field" drop-down menu, select `response.keyword`. This indicates that the `response` field will determine the size of the pie chart slices.
- Finally, click the "Play" button to update the pie chart and complete the visualization.

![Kibana 5 Select Pie Chart Configuration](/docs/assets/elastic-stack-debian-8-kibana-finished-pie.png "Kibana 5 Select Pie Chart Configuration")

Observe that only a portion of requests have returned a 404 response code (remember to change the aforementioned time span if your curl requests occurred earlier than you are currently viewing). This approach of collecting summarized statistics about the values of fields within your logs can be similarly applied to other fields, such as the http verb (GET, POST, etc.), or can even create summaries of numerical data, such as the total amount of bytes transferred over a given time period.

If you wish to save this visualization for use later use, click the "Save" button near the top of the browser window to name the visualization and save it permanently to Elasticsearch.

## Further Reading

Although this tutorial has provided an overview of each piece of the Elastic stack, more reading is available to learn additional ways to process and view data, such as additional Logstash filters to enrich log data, or other Kibana visualizations to present data in new and useful ways.

Comprehensive documentation for each piece of the stack is available from the Elastic web site:

- The [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) contains additional information regarding how to operate Elasticsearch, including clustering, managing indices, and more.
- The [Logstash documentation](https://www.elastic.co/guide/en/logstash/current/index.html) contains useful information on additional plug-ins that can further process raw data, such as geolocating IP addresses, parsing user-agent strings, and other plug-ins.
- [Kibana's documentation pages](https://www.elastic.co/guide/en/kibana/current/index.html) provide additional information regarding how to create useful visualizations and dashboards.
