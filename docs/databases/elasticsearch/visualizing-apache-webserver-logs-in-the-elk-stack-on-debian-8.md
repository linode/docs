---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Use Elastisearch, Logstash, and Kibana to Store and Visualize Apache Webserver Logs.'
keywords: 'webserver,apache,elasticsearch,logstash,kibana,dashboard,visualization'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: Friday, October 23rd, 2015
modified: 'Friday, October 23rd, 2015'
modified_by:
    name: Tyler Langlois
title: Visualizing Apache Webserver Logs in the ELK Stack on Debian 8
alias: ['databases/elasticsearch/webserver-logs-with-elk-stack/']
contributor:
  name: Tyler Langlois
  link: https://github.com/tylerjl
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

The [ELK Stack](https://www.elastic.co/products) is an open-source platform that makes structured and unstructured data easy to collect, store and visualize. In this guide, we'll collect Apache logs with [Logstash](https://www.elastic.co/products/logstash), store parsed documents in [Elasticsearch](https://www.elastic.co/products/elasticsearch), and create dashboards in [Kibana](https://www.elastic.co/products/kibana) to make webserver logs easy to search and see in real-time.

![An example of the types of charts you can create](/docs/assets/elk-kibana-cover.png)

At the end of this guide, you'll have an end-to-end system that collects your webserver logs and presents them in a beautiful, shareable format. Let's get started!

## Before You Begin

Before beginning, note that we will be setting up several services on the server, so the normal best practices for setting up a stable, secure Linux system still apply. In particular, you should follow the advice in the following guides:

-   [Getting Started](/docs/getting-started) with your Linux server.
-   [Securing Your Server](/docs/security/securing-your-server), which is critical to ensure your services are properly protected.

If using a firewall, add additional rules to allow for the use of port 5601:

    sudo iptables -I INPUT 9 -p tcp --dport 5601 -j ACCEPT
    sudo ip6tables -I INPUT 9 -p tcp --dport 5601 -j ACCEPT

### Overview

Before beginning, it's helpful to review how the entire pipeline will work:

1. With Apache running, we issue log-generating requests to the webserver.
2. Logstash, running as a persistent daemon, monitors the Apache logs for new lines and processes them.
2. Logstash will send parsed logs in JSON document form to Elasticsearch for storage and the ability to perform analytics on them.
4. Kibana uses Elasticsearch as a back-end for dashboarding and searching.

In this walk-through the Linux distribution of choice will be Debian 8 (Jessie), although you could easily adapt the instructions to work on Ubuntu or a RHEL-based distribution such as Fedora or CentOS.

## Prerequisites

Before setting up Elasticsearch, Logstash and Kibana, a webserver and Java 8 need to be installed.

### Apache

To have log files to process, you should follow the [Set Up an Apache Web Server on Debian 8](/docs/websites/apache/apache-web-server-debian-8) guide to easily install and configure Apache on Debian. Once Apache is running, issue an empty request to your webserver:

    curl localhost

Then, confirm logs are being generated in the default Apache log file:

    sudo tail /var/log/apache2/access.log

{: .note}
>
>If your Apache server was set up using the above-referenced Apache Web Server on Debian 8 guide, the access log will be located at `/var/www/example.com/logs/access.log`, with `example.com` being your domain name. Amend the above code if needed.

You should see one or more lines that look like this:

    10.0.0.1 - - [18/Sep/2015:02:03:08 +0000] "GET / HTTP/1.1" 200 11359 "-" "curl/7.38.0"

We can now ingest and parse these logs to make them more useful.

### Java 8

Although the default repositories in Debian provide Java, both Logstash and Elasticsearch work best with a recent version of Java. We can use an existing Ubuntu APT repository as a source for Java 8.

First, create the `apt` source file (you will need to create the file as root to write to this directory with a command like `sudo nano /etc/apt/sources.list.d/webupd8team-java.list`):

{: .file}
/etc/apt/sources.list.d/webupd8team-java.list
:   ~~~
    deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main
    deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main
    ~~~

Then, trust the signing key:

    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys EEA14886

Finally, update the local package database and install Java 8:

    sudo apt-get update
    sudo apt-get install oracle-java8-installer

Now, confirm that your Java executable is running version 8:

    java -version

The version string should return something similar to `1.8.0`.

## Logstash

The following steps taken from [the Logstash documentation](https://www.elastic.co/guide/en/logstash/current/package-repositories.html) will install and configure a repostitory for Logstash to more easily install and update the official `deb` package. First, trust the packaging key:

    wget -qO - https://packages.elasticsearch.org/GPG-KEY-elasticsearch | sudo apt-key add -

Then, add the package repository:

    echo "deb http://packages.elasticsearch.org/logstash/1.5/debian stable main" | sudo tee -a /etc/apt/sources.list

Now, update the list of available packages:

    sudo apt-get update

And install Logstash:

    sudo apt-get install logstash

Next, we'll create a simple logstash configuration file - create a file named `apache.conf` (the name is arbitrary) under `/etc/logstash/conf.d/apache.conf`:

{: .file}
/etc/logstash/conf.d/apache.conf
:   ~~~
    input {
        file {
            path => '/var/log/apache2/access.log'
        }
    }
    
    filter {
        grok {
            match => { "message" => "%{COMBINEDAPACHELOG}" }
        }
    }
    
    output {
        stdout { codec => rubydebug }
    }
    ~~~

{: .note}
>
>If your log file is located at `/var/www/example.com/logs/access.log` or another non-traditional location, adjust the third line, `path => '/var/log/apache2/access.log'`, accordingly.

The config file simply watches the apache log file for events, parses them with a grok pattern (a simplified predefined regular expression) called `COMBINEDAPACHELOG`, and will print those events to standard output (the [Logstash documentation](https://www.elastic.co/guide/en/logstash/current/index.html) has additional information.)

Now, try out the config by starting logstash and passing the configuration directory (you'll need to run this command with `sudo` in order to read the Apache logs):

    sudo /opt/logstash/bin/logstash -f /etc/logstash/conf.d

Wait until `Logstash startup completed` appears, then in another window, issue some curl commands to generate logs:

    curl localhost

You should see logstash print parsed fields such as `verb`, `response`, and `bytes`. Hit **CTRL-C** to exit Logstash.

{: .note}
>
>If you receive a `NotImplementedError: stat.st_gid unsupported or native support failed to load` error when first attempting to run Logstash, run:
>
>     sudo ln -s /lib/x86_64-linux-gnu/libcrypt.so.1 /usr/lib/x86_64-linux-gnu/libcrypt.so
>
>Then, repeat the above instructions to start and test Logstash again.

An additional step is necessary so that the `logstash` user that the daemon runs as will be able to read Apache log files. Apache logs are readable by users in the `adm` group, so add the `logstash` user to that group:

    sudo gpasswd -a logstash adm

## Elasticsearch

Adding the Elasticsearch apt repository is a similar process to the steps for installing Logstash. These steps are taken from the [Elasticsearch repository documentation](https://www.elastic.co/guide/en/elasticsearch/reference/1.7/setup-repositories.html):

    wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
    echo "deb http://packages.elastic.co/elasticsearch/1.7/debian stable main" | sudo tee -a /etc/apt/sources.list.d/elasticsearch-1.7.list
    sudo apt-get update
    sudo apt-get install elasticsearch

With Elasticsearch installed, you should configure it properly for a cloud environment by entering the following lines in the Elasticsearch configuration file:

{: .file}
/etc/elasticsearch/elasticsearch.yaml
:   ~~~ yaml
    cluster.name: <choose something unique>
    discovery.zen.ping.multicast.enabled: false
    index.number_of_replicas: 0
    ~~~

These configuration lines allow you to:

- Set a unique cluster name, ensuring the node doesn't cluster with other machines.
- Disable multicast clustering. This is an important setting within cloud environments that prohibits Elasticsearch from broadcasting itself and clustering with other machines on a shared network.
- Reduce the number of replica shards. In a clustered setup, replica shards provide failover, but on single host demo environment, we'll disable it.

Once you have configured Elasticsearch, you can start it:

    sudo systemctl start elasticsearch

Wait a few moments for Elasticsearch to start, then confirm that your node is up and running:

    curl localhost:9200

You should see a JSON document confirming that your node has a `"status" : 200`, indicating that it's healthy and ready to be used.

## Kibana

Kibana is distributed as a compressed archive, so we'll download and extract it to `/opt` to keep our filesystem organized:

    cd /opt
    sudo wget https://download.elastic.co/kibana/kibana/kibana-4.1.2-linux-x64.tar.gz
    sudo tar xvzf kibana-4.1.2-linux-x64.tar.gz

Because Debian 8 ships with systemd, we can easily create a unit file to run Kibana as a service for us instead of running it manually in the terminal. Create the following service file:

{: .file}
/etc/systemd/system/kibana.service
:   ~~~ ini
    [Unit]
    Description=open source browser based analytics and search dashboard for Elasticsearch
    
    [Service]
    Type=simple
    ExecStart=/opt/kibana-4.1.2-linux-x64/bin/kibana  -c /opt/kibana-4.1.2-linux-x64/config/kibana.yml
    ~~~

Now simply start the service to run Kibana as a daemon:

    sudo systemctl start kibana

## Put It All Together

Now that each component of the ELK stack is installed, we can start streaming data into our setup. The previous Logstash configuration we created will output parsed Apache logs to our terminal. To instead send them to Elasticsearch, we can change the output line by replacing the `stdout` plugin with the Elasticsearch output, like this:

{: .file}
/etc/logstah/conf.d/apache.conf
:   ~~~
	output {
		elasticsearch { protocol => "http" }
	}
    ~~~

Here, the protocol is set to `http`, which talks to Elasticsearch over the standard JSON API. We can now start the Logstash daemon and let it funnel logs into Elasticsearch:

    sudo systemctl start logstash

To confirm the pipeline is working correctly, issue some requests to your webserver:

    for x in {1..10} ; do curl -s localhost ; done

Then, look at an Elasticsearch API to see that a new index has been created (it will appear in the list of indices as `logstash-` followed by the date):

    curl localhost:9200/_cat/indices

There should be an index with the current date appended with documents inserted by Logstash. Now, with Kibana running in the background from your systemd unit, browse to the machine's address under port 5601 to start using Kibana's interface:

![The initial setup screen for Kibana](/docs/assets/elk-kibana-setup.png)

Kibana makes an educated guess at your index and time field names, so selecting "Create" here will get you started. Click on the "Discover" tab at the top and you'll see a timeline of Apache log events.

### Custom Dashboards

First, to generate a steady stream of web traffic to visualize, issue the following command in another terminal window:

    while sleep 1 ; do for n in {0..$(((RANDOM % 10) + 1))} ; do curl -s -A $n localhost &>/dev/null ; done ; done

This command issues between 1 to 10 `curl` requests to Apache every second to generate sample traffic with a custom user agent. Let this command run for a few minutes, then click on the magnifying glass in Kibana to issue a new search and draw a timeline graph of the requests we're issuing:

![Timeline of basic requests to Apache](/docs/assets/elk-kibana-discovery.png)

The "Discovery" tab simply plots the count of documents within the logstash index (Y axis) against the timestamp of those events (X axis.)

We can create additional types of graphs as well. The `curl` that generates sample traffic sets the user agent to an integer. Kibana can create a summary of the most common user agents by asking Elasticsearch for a terms aggregation. The following steps outline how to do so:

- Click the "Visualize" tab at the top of the Kibana interface.
- Scroll down to find "Pie chart" and click on it to start creating the chart.
- Select "From a new search" to create a graph from a generic search query.
- You'll see a large pie chart that is simply displaying the document count for the selected time period.
- Click "Split Slices" on the left sidebar.
- In the "Aggregation" dropdown, select "Terms."
- Under the "Field" section, select `agent.raw`.
- Change the "Size" option to 10.
- Click on the green play button on the left sidebar.

You should see a pie chart similar to the one below:

![Pie chart displaying most common user agents](/docs/assets/elk-kibana-pie-chart.png)

This simple example summarizes the dummy user-agent strings we set in the `curl` command. In a real-world scenario, this same type of aggregation could be used to visualize the values in the `response` field to see how often 500 or 404 errors occur.

To get a feel for Kibana, try creating a similar graph, but use a bar chart this time. The X-axis should be a date histogram, and you can split the bars by adding sub-buckets to aggregate on the `agent.raw` field. Explore different possibilities!

## Further Reading

From here on out, the [official Kibana documentation](https://www.elastic.co/guide/en/kibana/current/index.html) can help you learn how to graph logs to create charts, graphs, and other helpful visualizations. Remember that the `filter` section of the Logstash configuration file we wrote includes a `grok` directive to parse log fields, so you now have the ability to do things like:

- Calculate the average or sum of total bytes sent over the web server over a period of time.
- Aggregate (rank occurrences) of the top response code sent by your webserver (i.e., 200, 404, etc.).
- Perform fast freetext search across all your logs using Elasticsearch.

In addition, you can reference the list of [Logstash filters](https://www.elastic.co/guide/en/logstash/current/filter-plugins.html) to find ways to enrich your data with filters, like `geoip` to create maps, `useragent` to analyze user traffic, or [create your own](https://www.elastic.co/guide/en/logstash/current/contributing-to-logstash.html)!
