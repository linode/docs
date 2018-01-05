---
author:
  name: Linode
  email: docs@linode.com
contributor:
  name: Tyler Langlois
  link: https://tjll.net
description: 'This guide will walk through how to install a variety of useful Elasticsearch plugins.'
og_description: 'Elasticsearch supports a wide variety of plugins which enable more powerful search features. This guide will explore how to manage, install, and use these plugins to better leverage Elasticsearch for different use cases.'
external_resources:
 - '[Elastic Documentation](https://www.elastic.co/guide/index.html)'
keywords: 'elastic,elasticsearch,plugins,search,analytics,search engine'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-30
modified: 2017-12-30
modified_by:
  name: Linode
title: 'How to Install and Use Elasticsearch Plugins'
---

## What are Elasticsearch Plugins?

[Elasticsearch](https://www.elastic.co/products/elasticsearch) is an open-source, scalable search engine. Although Elasticsearch supports a wide variety of features out-of-the-box, Elasticsearch can also be extended by a variety of [_plugins_](https://www.elastic.co/guide/en/elasticsearch/plugins/6.1/index.html) to enhance its functionality. Features such as PDF processing and advanced analysis techniques can improve an existing Elasticsearch setup.

This guide will explain to how install and use a variety of useful Elasticsearch plugins. In addition to basic Elasticsearch installation steps, some basic examples using the Elasticsearch API will also be demonstrated.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system depending upon the distribution in use. For rpm-based distributions such as CentOS, Red Hat, and Fedora, use `yum`:

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

Ensure that Java is ready for use by Elasticsearch by checking that the installed version is at least at version 1.8.0 by running the following command:

    java -version

The command should return the installed version, which should be similar to the following:

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
{{< file-excerpt "/etc/yum.repos.d/elastic.repo" ini >}}
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

2.  Install the `apt-transport-https` package, which is required to retrieve deb packages served over HTTPS:

        sudo apt-get install apt-transport-https

3.  Add the APT repository information to your server's list of sources:

        echo "deb https://artifacts.elastic.co/packages/6.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic.list

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

## Elasticsearch Plugins

This guide will walk through several plugins with different features and use cases. Many of the following steps will involve communicating with the Elasticsearch API. There are a number of different ways to send and receive REST requests to Elasticsearch, so use whichever method is most comfortable for your environment.

For example, consider how to index a sample document into Elasticsearch. A `POST` request must be sent to `/{index name}/{type}/{document id}` with a JSON payload:

    POST /exampleindex/doc/1
    {
      "message": "this the value for the message field"
    }

There are a number of methods that could be used to issue requests.

- From the command line, `curl` can be used.
  - `curl -H'Content-Type: application/json' -XPOST localhost:9200/exampleindex/doc/1 -d '{ "message": "this the value for the message field" }'`
- For vim users, [vim-rest-console](https://github.com/diepm/vim-rest-console) can easily send REST requests, while Emacs users can use [es-mode](https://github.com/dakrone/es-mode).
- If Kibana is installed, [Console](https://www.elastic.co/guide/en/kibana/current/console-kibana.html) may be used to send requests directly from the browser.

Whichever technique is used, the same method of annotating REST requests will be used for the rest of this guide.

### Indexing and Searching

Before beginning, create a test index. The following request will create an index named `test` with one shard and no replicas. While suitable for testing, additional shards and replicas should be used in a production scenario.

    POST /test
    {
      "settings": {
        "index": {
          "number_of_replicas": 0,
          "number_of_shards": 1
        }
      }
    }

Index a single document with a key called `message` with a freetext value to add it to the `test` index:

    POST /test/doc/1
    {
      "message": "this is an example document"
    }

Searches can be performed by using the `_search` URL endpoint. The following query searches for the `example` term across all documents in the `message` field, which should match the indexed document.

    POST /_search
    {
      "query": {
        "terms": {
          "message": ["example"]
        }
      }
    }

The Elasticsearch API should return the matching document.

### Elasticsearch Attachment Plugin

The attachment plugin lets Elasticsearch accept a base64-encoded document and index its contents for easy searching. This is useful in situations such as when PDF or rich text documents need to be searched with minimal overhead to pull out textual data.

To begin, install the `ingest-attachment` plugin using the `elasticsearch-plugin` tool:

      sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install ingest-attachment

Then restart elasticsearch. Note that the following command restarts Elasticsearch on systemd-based Linux distributions. Use the appropriate service manager for your system.

    sudo systemctl restart elasticsearch

Confirm that the plugin is installed as expected by using the `_cat` API:

    GET /_cat/plugins

The `ingest-attachment` plugin should be under the list of installed plugins.

In order to use the attachment plugin, a _pipeline_ must be used to process base64-encoded data in the field of a document. An [ingest pipeline](https://www.elastic.co/guide/en/elasticsearch/reference/master/ingest.html) is a way of performing additional steps when indexing a document in Elasticsearch. While Elasticsearch comes pre-installed with some pipeline processors (which can perform actions such as removing or adding fields), the attachment plugin installs an addition _processor_ that can be used when defining a pipeline.

Create a pipeline called `doc-parser` which takes data from a field called `encoded_doc` and executes the `attachment` processor on the field. By default, the attachment processor will create a new field called `attachment` with the parsed content of the target field. See the [attachment processor documentation](https://www.elastic.co/guide/en/elasticsearch/plugins/6.1/using-ingest-attachment.html) for additional information.

    PUT /_ingest/pipeline/doc-parser
    {
      "description" : "Extract text from base-64 encoded documents",
      "processors" : [ { "attachment" : { "field" : "encoded_doc" } } ]
    }

Now documents can be indexed with the optional step of passing through the `doc-parser` pipeline to extract data from the `encoded_doc` field.

To demonstrate using the attachment plugin, we will index an RTF (rich-text formatted) document. The following base64-encoded string is an RTF document containing text that we would like to search.

    e1xydGYxXGFuc2kKSGVsbG8gZnJvbSBpbnNpZGUgb2YgYSByaWNoIHRleHQgUlRGIGRvY3VtZW50LgpccGFyIH0K

In order to index this RTF document, index it in JSON form into the `test` index, indicating that the `doc-parser` pipeline should be used when indexing the document.

    PUT /test/doc/rtf?pipeline=doc-parser
    {
      "encoded_doc": "e1xydGYxXGFuc2kKSGVsbG8gZnJvbSBpbnNpZGUgb2YgYSByaWNoIHRleHQgUlRGIGRvY3VtZW50LgpccGFyIH0K"
    }

Now perform a search for the term `rich`, which should find the indexed document. The base64-encoded string that was just indexed contains the term "rich" in the RTF document.

    POST /_search
    {
      "query": {
        "terms": {
          "attachment.content": ["rich"]
        }
      }
    }

The response from Elasticsearch should include a match for the previously-indexed document.

This technique may be used to index and search other document types such as PDF, PPT, and XLS. See the [Apache Tika Project](http://tika.apache.org/) (which provides the underlying text extraction implementation) for additional supported file formats. As long as the document file is base64-encoded first, Elasticsearch can index and make various document types easily searchable.

### Phonetic Analysis Plugin

Elasticsearch excels when performing textual analysis of data. Several _analyzers_ come bundled with Elasticsearch which can perform powerful analysis on text to make finding results more reliable and dynamic.

One of these analyzers is the [Phonetic Analysis](https://www.elastic.co/guide/en/elasticsearch/plugins/6.1/analysis-phonetic.html) plugin. By using this plugin, searches for terms that _sound_ like other words can be found by Elasticsearch. This is a powerful technique to help users find results for items that may be searching for that audibly sound similar to the terms they enter.

To begin, follow the same steps as with the attachment plugin to install the plugin:

      sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install analysis-phonetic

Restart Elasticsearch:

    sudo systemctl restart elasticsearch

And confirm the plugin is installed by checking the API:

    GET /_cat/plugins

`analysis-phonetic` should be included in this list.

In order to use this analyzer, a number of changes must be made to our `test` index.

1. A `filter` must be created. This filter will be used to process the tokens that are created for the field of an indexed document.
2. This filter will be used by an `analyzer`. An analyzer determines how a field is tokenized and then how those tokenized items are processed by filters.
3. Finally, we will configure the `test` index to use this analyzer for a field in our index with a `mapping`.

The following requests will accomplish all of the above, and perform phonetic analysis on the `phonetic` field for documents that we index into the `test` index.

First, close the `test` index to add analyzers and filters:

    POST /test/_close

Then, define the analyzer and filter for the `test` index under the `_settings` API:

    PUT /test/_settings
    {
      "analysis": {
        "analyzer": {
          "my_phonetic_analyzer": {
            "tokenizer": "standard",
            "filter": [
              "standard",
              "lowercase",
              "my_phonetic_filter"
            ]
          }
        },
        "filter": {
          "my_phonetic_filter": {
            "type": "phonetic",
            "encoder": "metaphone",
            "replace": false
          }
        }
      }
    }

Re-open the index to enable searching and indexing again.

    POST /test/_open

Define a mapping for a field named `phonetic` which will use the `my_phonetic_analyzer` analyzer that has just been defined.

    POST /test/_mapping/doc
    {
      "properties": {
        "phonetic": {
          "type": "text",
          "analyzer": "my_phonetic_analyzer"
        }
      }
    }

In order to demonstrate this plugin's functionality, index a document with a JSON field called `phonetic` with content that should be passed through the phonetic analyzer. For example, consider a field with a product description:

    POST /test/doc
    {
      "phonetic": "black leather ottoman"
    }

Now perform a `match` search for the term "ottoman". However, instead of spelling the term correctly, misspell the word such that the misspelled word is phonetically similar.

    POST /_search
    {
      "query": {
        "match": {
          "phonetic": "otomen"
        }
      }
    }

Observe that the previously-indexed document is matched. Even though the term "ottoman" is spelled differently, because "otomen" sounds similar to "ottoman", the document is still matched.

### Geoip Processor Plugin

When indexing certain types of documents such as log files, some fields may contain fields with content like IP addresses. The Geoip plugin can process IP addresses in order to enrich documents with regional data indicating where an IP address originated from.

Follow the same steps as before in order to first install the plugin:

      sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install ingest-geoip

Restart Elasticsearch:

    sudo systemctl restart elasticsearch

And confirm the plugin is installed by checking the API:

    GET /_cat/plugins

`ingest-geoip` should be included in this list.

As with the `ingest-attachment` pipeline plugin, the `ingest-geoip` plugin is used as a processor within an ingest pipeline. The [Geoip plugin documentation](https://www.elastic.co/guide/en/elasticsearch/plugins/6.1/using-ingest-geoip.html) outlines the available settings when creating processors within a pipeline.

Create a pipeline called `parse-ip` which consumes an IP address from a field called `ip` and creates regional information underneath the default field (`geoip`):

    PUT /_ingest/pipeline/parse-ip
    {
      "description" : "Geolocate an IP address",
      "processors" : [ { "geoip" : { "field" : "ip" } } ]
    }

In addition, add a mapping to the index to indicate that the `ip` field should be stored as an IP address in the underlying storage engine:

    POST /test/_mapping/doc
    {
      "properties": {
        "ip": {
          "type": "ip"
        }
      }
    }

Now index a document with the `ip` field set to an example address and pass the `pipeline=parse-ip` in the request to use the `parse-ip` pipeline to process the document:

    PUT /test/doc/ipexample?pipeline=parse-ip
    {
      "ip": "8.8.8.8"
    }

Retrieve the document to view the fields created by the pipeline:

    GET /test/doc/ipexample

The response should include a `geoip` JSON key with fields such as `city_name` derived from the source IP address. The plugin should correctly determine that the IP address originated from California.

### User Agent Processor Plugin

A common use case for Elasticsearch is to index log files. By parsing certain fields from web server access logs, requests can be more effectively searched by response code, URL, and more. The `ingest-user-agent` adds the capability to parse the contents of the `User-Agent` header of web requests to more precisely create additional fields identifying the client platform that performed the request.

Install the plugin:

      sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install ingest-user-agent

Restart Elasticsearch:

    sudo systemctl restart elasticsearch

Confirm the plugin is installed:

    GET /_cat/plugins

`ingest-user-agent` should be included in this list.

As with other pipeline-based plugins, create an ingest pipeline which instructs Elasticsearch which field to reference when parsing a user agent string.

    PUT /_ingest/pipeline/useragent
    {
      "description" : "Parse User-Agent content",
      "processors" : [ { "user_agent" : { "field" : "agent" } } ]
    }

Index a document with the `agent` field set to an example `User-Agent` string:

    PUT /test/doc/agentexample?pipeline=useragent
    {
      "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
    }

Retrieve the document to view the fields created by the pipeline:

    GET /test/doc/agentexample

The indexed document will have several fields listed underneath the `user_agent` JSON key. The User Agent plugin understands a wide variety of `User-Agent` strings and can reliably parse `User-Agent` fields from access logs generated by web servers such as Apache and nginx.

## Conclusion

The plugins covered in this tutorial are a small subset of those available from Elastic or written by third parties. Whether using Elasticsearch as a log aggregation tool, traditional search engine, or document store, there are a variety of plugins that can enhance its functionality. For additional resources regarding Elasticsearch and plugin use, consider reading:

- The [Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) includes additional material regarding the Elasticsearch search API and features.
- A dedicated [reference for Elasticsearch plugins](https://www.elastic.co/guide/en/elasticsearch/plugins/current/index.html) contains a list of additional plugins and how to use them.
