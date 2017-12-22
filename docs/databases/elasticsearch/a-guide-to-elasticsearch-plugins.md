---
author:
  name: Linode
  email: docs@linode.com
contributor:
  name: Tyler Langlois
  link: https://tjll.net
description: 'This guide will walk through how to install a variety of powerful Elasticsearch plugins.'
og_description: 'Elasticsearch supports a wide variety of plugins which enable more powerful search features. This guide will explore how to manage, install, and use these plugins to better leverage Elasticsearch for different use cases.'
external_resources:
 - '[Elastic Documentation](https://www.elastic.co/guide/index.html)'
keywords: 'elastic,elasticsearch,plugins,search,analytics,search engine'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-22
modified: 2017-12-22
modified_by:
  name: Linode
title: 'Elasticsearch Plugins'
---

## What are Elasticsearch Plugins?

[Elasticsearch](https://www.elastic.co/products/elasticsearch) is an open-source, scalable search engine. Although Elasticsearch supports a wide variety of features out-of-the-box, Elasticsearch can also be extended by a variety of [_plugins_](https://www.elastic.co/guide/en/elasticsearch/plugins/6.1/index.html) to enhance its functionality. Features such as PDF processing and advanced analysis techniques can improve an existing Elasticsearch setup.

This guide will explain to how install and use a variety of useful Elasticsearch plugins. In addition to basic Elasticsearch installation steps, some basic examples using the Elasticsearch API will also be used.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system depending upon the distribution in use. For rpm-based distributions such as CentOS, Red Hat, and Fedora:

        sudo yum update

    For deb-based systems such as Debian and Ubuntu:

        sudo apt-get update && sudo apt-get upgrade

## Installation

Before beginning, a supported Java runtime must be installed alongside Elasticsearch. The following steps will first install Java, then version 6 of Elasticsearch.

### Java

Java 8 (which is required by Elasticsearch 6) is available via different methods on either Debian or Red Hat-based systems.

#### Red Hat Based Distributions

OpenJDK 8 is available for installation from the official repositories. Install the headless OpenJDK package:

    sudo yum install -y java-1.8.0-openjdk-headless

Ensure that Java is ready for use by Elasticsearch by checking that the installed version is at least at version 1.8.0:

    java -version

The installed version should be similar to the following:

    openjdk version "1.8.0_151"
    OpenJDK Runtime Environment (build 1.8.0_151-b12)
    OpenJDK 64-Bit Server VM (build 25.151-b12, mixed mode)

#### Debian Based Distributions

Recent versions of Debian based Linux distributions should have Java 8 available in the default package repositories. For example, on Ubuntu Xenial or Debian 9, the following package provides the necessary java runtime:

    sudo apt install -y openjdk-8-jre-headless

Confirm that Java is installed and at least at version 1.8.

    java -version

The output of this command should be similar to the following.

    openjdk version "1.8.0_151"
    OpenJDK Runtime Environment (build 1.8.0_151-8u151-b12-1~deb9u1-b12)
    OpenJDK 64-Bit Server VM (build 25.151-b12, mixed mode)

### Elasticsearch

The Elastic package repositories contain the necessary Elasticsearch package. Repositories are available for both yum and apt.

#### Red Hat Based Distributions

1.  Trust the Elastic signing key:

        sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch

2.  Create a yum repository configuration to use the Elastic yum repository:
{{< file-excerpt "elastic.repo" ini >}}
[elasticsearch-6.x]
name=Elastic repository for 6.x packages
baseurl=https://artifacts.elastic.co/packages/6.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md
{{< /file-excerpt >}}

3.  Update the `yum` cache to ensure any new packages become available:

        sudo yum update

#### Debian Based Distributions

1.  Install the official Elastic APT package signing key:

        wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

2.  Install the `apt-transport-https` package, which is required to retrieve deb packages served over HTTPS on Debian 8:

        sudo apt-get install apt-transport-https

3.  Add the APT repository information to your server's list of sources:

        echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-5.x.list

4.  Refresh the list of available packages:

        sudo apt-get update

#### Installation

Install the `elasticsearch` package depending upon your distribution type. For CentOS/Red Hat/Fedora:

    sudo yum install -y elasticsearch

For Debian and Ubuntu:

    sudo apt-get install -y elasticsearch

Set the JVM heap size to approximately half of your server's available memory. For example, if your server has 1GB of RAM, change the `Xms` and `Xmx` values in the `/etc/elasticsearch/jvm.options` file to the following, and leave the other values in this file unchanged:

{{< file "/etc/elasticsearch/jvm.options" aconf >}}
-Xms512m
-Xmx512m
{{< /file >}}

Start and enable the `elasticsearch` service:

    sudo systemctl enable elasticsearch
    sudo systemctl start elasticsearch

Wait a few moments for the service to start, then confirm that the Elasticsearch API is available:

     curl localhost:9200

Elasticsearch may take some time to start up. If you need to determine whether the service has started successfully or not, you can use the `systemctl status elasticsearch` command to see the most recent logs. The Elasticsearch REST API should return a JSON response similar to the following:

    {
      "name" : "Sch1T0D",
      "cluster_name" : "docker-cluster",
      "cluster_uuid" : "MH6WKAm0Qz2r8jFK-TcbNg",
      "version" : {
        "number" : "6.1.1",
        "build_hash" : "bd92e7f",
        "build_date" : "2017-12-17T20:23:25.338Z",
        "build_snapshot" : false,
        "lucene_version" : "7.1.0",
        "minimum_wire_compatibility_version" : "5.6.0",
        "minimum_index_compatibility_version" : "5.0.0"
      },
      "tagline" : "You Know, for Search"
    }

You are now ready to install and use Elasticsearch plugins.

## Further Reading

This tutorial has covered only a portion of the data available for searching and analysis that Filebeat and Metricbeat provide. By drawing upon existing dashboards for examples, additional charts, graphs, and other visualizations can be created to answer specific questions and provide useful dashboards for a variety of purposes.

Comprehensive documentation for each piece of the stack is available from the Elastic web site:

- The [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) contains additional information regarding how to operate Elasticsearch, including clustering, managing indices, and more.
- [Metricbeat's documentation](https://www.elastic.co/guide/en/beats/metricbeat/current/index.html) provides additional information regarding configuration options and modules for other projects such as Apache, MySQL, and more.
- The [Filebeat documentation](https://www.elastic.co/guide/en/beats/filebeat/current/index.html) is useful if additional logs need to be collected and processed outside of the logs covered in this tutorial.
- [Kibana's documentation pages](https://www.elastic.co/guide/en/kibana/current/index.html) provide additional information regarding how to create useful visualizations and dashboards.
