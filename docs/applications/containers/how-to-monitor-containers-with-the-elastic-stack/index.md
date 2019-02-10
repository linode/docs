---
author:
  name: Tyler Langlois
  email: ty@tjll.net
description: 'This tutorial will explain how to configure Filebeat and Metricbeat to monitor Docker container logs and metrics to be stored in Elasticsearch and visualized in Kibana.'
og_description: 'Monitor Docker containers using the Elastic Stack.'
keywords: ["elastic", "filebeat", "metricbeat", "elasticsearch", "kibana", "docker", "container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-09-20
modified_by:
  name: Linode
published: 2019-01-06
title: Container Instrumentation with the Elastic Stack
external_resources:
- '[Elastic Container Monitoring](https://www.elastic.co/docker-kubernetes-container-monitoring)'
- '[Docker Command-Line Reference](https://docs.docker.com/reference/)'
---

The [Elastic Stack](https://www.elastic.co/products) can monitor a variety of data for [Docker](https://www.docker.com/) containers. In this guide, you will set up a Linode to analyze and visualize container logs and metrics using tools like Kibana, Beats, and Elasticsearch. Once finished, you will be able to configure your system to collect data for additional containers automatically.

## Before you Begin

1.  Familiarize yourself with Linode's [Getting Started](/docs/getting-started/) guide and complete the steps for deploying and setting up a Linode running Ubuntu 18.04, including setting the hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services.

1.  Follow our [Firewall Guide](/docs/security/firewalls/configure-firewall-with-ufw/) in order to install and configure a firewall (UFW) on your Ubuntu system. After configuring the firewall, ensure that the necessary ports are open in order to proceed with connections over for the rest of this guide:

        sudo ufw allow ssh

1.  Ensure your system is up to date. On Debian-based systems, use:

        sudo apt update && sudo apt upgrade

1.  While on rpm-based systems such as CentOS, use:

        sudo yum update

{{< note >}}
The services in this guide bind to localhost-only, which means they are not accessible outside of the Linode from remote hosts. This ensures that Elasticsearch's REST API remains private to localhost and are not remotely accessible from the internet. If you take further steps beyond this guide to configure Elasticsearch and related components further, ensure that your firewall is in-place and correctly blocking traffic to the Elasticsearch and Kibana nodes from the internet (ports 9200 and 9300 for Elasticsearch and 5601 for Kibana) to keep them properly secured.
{{< /note >}}

## Install Elastic Stack Components

Before configuring your system to monitor running containers, first install the components necessary to collect and ship logs and metrics to Elasticsearch.

### Debian-Based Distributions

Configure the Elastic `apt` repository and install the necessary packages and their dependencies.

1.  Install the official Elastic APT package signing key:

        wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

1.  Install the `apt-transport-https` package, which is required to retrieve `deb` packages served over HTTPS:

        sudo apt-get install apt-transport-https

1.  Add the APT repository information to your server's list of sources:

        echo "deb https://artifacts.elastic.co/packages/6.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-6.x.list

1.  Refresh the list of available packages:

        sudo apt-get update

1.  Before installing Elasticsearch, the Java runtime must be present. On systems such as Ubuntu 18.04 LTS, using the `default-jre-headless` package installs a compatible Java runtime:

        sudo apt-get install default-jre-headless

1.  Install Elasticsearch, Kibana, Filebeat, and Metricbeat:

        sudo apt-get install elasticsearch kibana filebeat metricbeat

### Redhat-Based Distributions

Configure the `rpm` repository for `yum` and related packaging tools.

1.  Trust the Elastic signing key:

        sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

1.  Create a yum repository configuration to use the Elastic yum repository:

    {{< file "/etc/yum.repos.d/elasticsearch.repo" ini >}}
[elasticsearch-6.x]
name=Elastic repository for 6.x packages
baseurl=https://artifacts.elastic.co/packages/6.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
    {{< /file >}}

1.  Update the `yum` cache to ensure any new packages become available:

        sudo yum update

1.  Before installing Elasticsearch, the Java runtime must be present. On CentOS, for example, a compatible Java runtime can be installed using a headless OpenJDK package:

        sudo yum install java-11-openjdk-headless

1.  Install Elasticsearch, Kibana, Filebeat, and Metricbeat:

        sudo yum install elasticsearch kibana filebeat metricbeat

## Configure The Elastic Stack

In order to properly discover and capture container metrics, each component of the Elastic stack should be configured.

### Elasticsearch

By default, Elasticsearch will operate correctly as a document store for Filebeat and Metricbeat. Before starting Elasticsearch, some minor configuration changes should be made first.

In the file `/etc/elasticsearch/jvm.options`, two values should be uncommented that begin with `-Xm` that instruct the JVM to allocate a specific amount of memory. The recommend value for these settings is 50% of the available system RAM. For example, on a system with 1G of RAM, these settings should be:

{{< file "/etc/elasticsearch/jvm.options" yml >}}
-Xms512m
-Xmx512m
{{< /file >}}

With these setting in place, start the `elasticsearch` service.

    sudo systemctl start elasticsearch

Wait for a short period of time for Elasticsearch to start, then check that Elasticsearch is responding over the REST API:

    curl http://localhost:9200

A response similar to the following should return:

    {
      "name" : "iQEk_-M",
      "cluster_name" : "elasticsearch",
      "cluster_uuid" : "tQeLgbKrTNOp2AoqdmTItw",
      "version" : {
        "number" : "6.5.4",
        "build_flavor" : "default",
        "build_type" : "deb",
        "build_hash" : "d2ef93d",
        "build_date" : "2018-12-17T21:17:40.758843Z",
        "build_snapshot" : false,
        "lucene_version" : "7.5.0",
        "minimum_wire_compatibility_version" : "5.6.0",
        "minimum_index_compatibility_version" : "5.0.0"
      },
      "tagline" : "You Know, for Search"
    }

Elasticsearch should now be ready to index documents.

### Kibana

Most of Kibana's default settings are suitable for the purposes of this guide. No configuration changes are necessary, so start the `kibana` service now.

    sudo systemctl start kibana

### Filebeat

In order for Filebeat to capture started containers dynamically, the `docker` input should be used. This alleviates the need to specify Docker log file paths and instead permits Filebeat to discover containers when they start.

1.  Add the following near the top of the Filebeat configuration file to instruct the `filebeat` daemon to capture Docker container logs. These lines should be entered under the configuration key `filebeat.inputs`:

    {{< file "/etc/filebeat/filebeat.yml" yml >}}
filebeat.inputs:
- type: docker
  containers.ids:
  - '*'
  processors:
  - add_docker_metadata
    {{< /file >}}

1.  Uncomment the following line and change its value to `true`, which will permit Filebeat to create associated Kibana dashboards for captured container logs:

    {{< file "/etc/filebeat/filebeat.yml" yml >}}
setup.dashboards.enabled: true
    {{< /file >}}

1.  The remainder of the configuration file will instruct Filebeat to send logs to the locally-running Elasticsearch instance, which can be left unchanged. Filebeat can not be started:

        sudo systemctl start filebeat

### Metricbeat

Like Filebeat, Metricbeat should be similarly configured in order to dynamically discover running containers to monitor.

1.  Metricbeat uses a module in order to collect container metrics. Issue the following command to enable the `docker` module:

        sudo /usr/bin/metricbeat modules enable docker

1.  The remainder of the configuration file will instruct Metricbeat to send logs to the locally-running Elasticsearch instance, which can be left unchanged. Metricbeat can now be started:

        sudo systemctl start metricbeat

## 

![Kibana 6 Initial Configuration Page](kibana-initial-page.png "Kibana 6 Initial Configuration Page")
