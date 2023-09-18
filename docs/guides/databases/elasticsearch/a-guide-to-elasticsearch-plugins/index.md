---
slug: a-guide-to-elasticsearch-plugins
description: "Elasticsearch supports a wide variety of plugins which enable more powerful search features. Learn how to manage, install, and use them."
external_resources:
 - '[Elastic Documentation](https://www.elastic.co/guide/index.html)'
 - '[Elasticsearch reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)'
 - '[Elasticsearch Plugins Reference](https://www.elastic.co/guide/en/elasticsearch/plugins/current/index.html)'
keywords: ['elastic', 'elasticsearch', 'plugins', 'search', 'analytics', 'search engine']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-09
modified: 2019-01-31
modified_by:
  name: Linode
title: "Installing and Using Elasticsearch Plugins"
title_meta: "How to Install and Use Elasticsearch Plugins"
dedicated_cpu_link: true
tags: ["ubuntu","debian","database","java"]
aliases: ['/databases/elasticsearch/a-guide-to-elasticsearch-plugins/']
authors: ["Tyler Langlois"]
---

![banner_image](How_to_Install_and_Use_Elasticsearch_Plugins_smg.jpg)

## What are Elasticsearch Plugins?

[Elasticsearch](https://www.elastic.co/products/elasticsearch) is an open source, scalable search engine. Although Elasticsearch supports a large number of features out-of-the-box, it can also be extended with a variety of [plugins](https://www.elastic.co/guide/en/elasticsearch/plugins/6.1/index.html) to provide advanced analytics and process different data types.

This guide will show to how install the following Elasticsearch plugins and interact with them using the Elasticsearch API:

  * **ingest-attachment**: allows Elasticsearch to index and search base64-encoded documents in formats such as RTF, PDF, and PPT.
  * **analysis-phonetic**: identifies search results that sound similar to the search term.
  * **ingest-geoip**: adds location information to indexed documents based on any IP addresses within the document.
  * **ingest-user-agent**: parses the `User-Agent` header of HTTP requests to provide identifying information about the client that sent each request.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

## Installation

### Java

As of this writing, Elasticsearch requires Java 8.

1.  OpenJDK 8 is available from the official repositories. Install the headless OpenJDK 8 package:

        sudo apt install openjdk-8-jre-headless

2.  Confirm that Java is installed:

        java -version

    The output should be similar to:

        openjdk version "1.8.0_151"
        OpenJDK Runtime Environment (build 1.8.0_151-8u151-b12-1~deb9u1-b12)
        OpenJDK 64-Bit Server VM (build 25.151-b12, mixed mode)

### Elasticsearch

{{< content "install_elasticsearch_debian_ubuntu" >}}

  You are now ready to install and use Elasticsearch plugins.

## Elasticsearch Plugins

The remainder of this guide will walk through several plugins and common use cases. Many of the following steps will involve communicating with the Elasticsearch API. For example, in order to index a sample document into Elasticsearch, a `POST` request with a JSON payload must be sent to `/{index name}/{type}/{document id}`:

    POST /exampleindex/doc/1
    {
      "message": "this the value for the message field"
    }

There are a number of tools that can be used to issue this request. The simplest approach would be to use `curl` from the command line:

    curl -H'Content-Type: application/json' -XPOST localhost:9200/exampleindex/doc/1 -d '{ "message": "this the value for the message field" }'

Other alternatives include the [vim-rest-console](https://github.com/diepm/vim-rest-console), the Emacs plugin [es-mode](https://github.com/dakrone/es-mode), or the [Console](https://www.elastic.co/guide/en/kibana/current/console-kibana.html) plugin for Kibana. Use whichever tool is most convenient for you.

### Prepare an Index

Before installing any plugins, create a test index.

1.  Create an index named `test` with one shard and no replicas:

        POST /test
        {
          "settings": {
            "index": {
              "number_of_replicas": 0,
              "number_of_shards": 1
            }
          }
        }

    {{< note respectIndent=false >}}
These settings are suitable for testing, but additional shards and replicas should be used in a production environment.
{{< /note >}}

2.  Add an example document to the index:

        POST /test/doc/1
        {
          "message": "this is an example document"
        }

3.  Searches can be performed by using the `_search` URL endpoint. Search for "example" in the message field across all documents:

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

The attachment plugin lets Elasticsearch accept a base64-encoded document and index its contents for easy searching. This is useful for searching PDF or rich text documents with minimal overhead.

1.  Install the `ingest-attachment` plugin using the `elasticsearch-plugin` tool:

        sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install ingest-attachment

2.  Restart elasticsearch:

        sudo systemctl restart elasticsearch

3.  Confirm that the plugin is installed as expected by using the `_cat` API:

        GET /_cat/plugins

    The `ingest-attachment` plugin should be under the list of installed plugins.

In order to use the attachment plugin, a _pipeline_ must be used to process base64-encoded data in the field of a document. An [ingest pipeline](https://www.elastic.co/guide/en/elasticsearch/reference/master/ingest.html) is a way of performing additional steps when indexing a document in Elasticsearch. While Elasticsearch comes pre-installed with some pipeline *processors* (which can perform actions such as removing or adding fields), the attachment plugin installs an additional processor that can be used when defining a pipeline.

1.  Create a pipeline called `doc-parser` which takes data from a field called `encoded_doc` and executes the `attachment` processor on the field:

        PUT /_ingest/pipeline/doc-parser
        {
          "description" : "Extract text from base-64 encoded documents",
          "processors" : [ { "attachment" : { "field" : "encoded_doc" } } ]
        }

    The `doc-parser` pipeline can now be specified when indexing documents to extract data from the `encoded_doc` field.

    {{< note respectIndent=false >}}
By default, the attachment processor will create a new field called `attachment` with the parsed content of the target field. See the [attachment processor documentation](https://www.elastic.co/guide/en/elasticsearch/plugins/6.1/using-ingest-attachment.html) for additional information.
{{< /note >}}

2.  Index an example RTF (rich-text formatted) document. The following string is an RTF document containing text that we would like to search. It consists of the base64-encoded text "Hello from inside of a rich text RTF document":

        e1xydGYxXGFuc2kKSGVsbG8gZnJvbSBpbnNpZGUgb2YgYSByaWNoIHRleHQgUlRGIGRvY3VtZW50LgpccGFyIH0K

3.  Add this document to the test index, using the `?pipeline=doc_parser` parameter to specify the new pipeline:

        PUT /test/doc/rtf?pipeline=doc-parser
        {
          "encoded_doc": "e1xydGYxXGFuc2kKSGVsbG8gZnJvbSBpbnNpZGUgb2YgYSByaWNoIHRleHQgUlRGIGRvY3VtZW50LgpccGFyIH0K"
        }

4.  Search for the term "rich", which should return the indexed document:

        POST /_search
        {
          "query": {
            "terms": {
              "attachment.content": ["rich"]
            }
          }
        }

    This technique may be used to index and search other document types including PDF, PPT, and XLS. See the [Apache Tika Project](http://tika.apache.org/) (which provides the underlying text extraction implementation) for additional supported file formats.

### Phonetic Analysis Plugin

Elasticsearch excels when analyzing textual data. Several *analyzers* come bundled with Elasticsearch which can perform powerful analyses on text.

One of these analyzers is the [Phonetic Analysis](https://www.elastic.co/guide/en/elasticsearch/plugins/6.1/analysis-phonetic.html) plugin. By using this plugin, it is possible to search for terms that sound similar to other words.

1.  Install the plugin the `analysis-phonetic` plugin:

          sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install analysis-phonetic

2.  Restart Elasticsearch:

        sudo systemctl restart elasticsearch

3.  Confirm that the plugin has been successfully installed:

        GET /_cat/plugins

In order to use this plugin, the following changes must be made to the test index:

* A *filter* must be created. This filter will be used to process the tokens that are created for fields of an indexed document.
* This filter will be used by an *analyzer*. An analyzer determines how a field is tokenized and how those tokenized items are processed by filters.
* Finally, we will configure the test index to use this analyzer for a field in the index with a *mapping*.

An index must be closed before analyzers and filters can be added.

1.  Close the test index:

        POST /test/_close

2.  Define the analyzer and filter for the test index under the `_settings` API:

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

3.  Re-open the index to enable searching and indexing:

        POST /test/_open

4.  Define a mapping for a field named `phonetic` which will use the `my_phonetic_analyzer` analyzer:

        POST /test/_mapping/doc
        {
          "properties": {
            "phonetic": {
              "type": "text",
              "analyzer": "my_phonetic_analyzer"
            }
          }
        }

5.  Index a document with a JSON field called `phonetic` with content that should be passed through the phonetic analyzer:

        POST /test/doc
        {
          "phonetic": "black leather ottoman"
        }

6.  Perform a `match` search for the term "ottoman". However, instead of spelling the term correctly, misspell the word such that the misspelled word is phonetically similar:

        POST /_search
        {
          "query": {
            "match": {
              "phonetic": "otomen"
            }
          }
        }

    The phonetic analysis plugin should be able to recognize that "otomen" and "ottoman" are phonetically similar, and return the correct result.

### Geoip Processor Plugin

When indexing documents such as log files, some fields may contain IP addresses. The Geoip plugin can process IP addresses in order to enrich documents with location data.

1.  Install the plugin:

        sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install ingest-geoip

2.  Restart Elasticsearch:

        sudo systemctl restart elasticsearch

3.  Confirm the plugin is installed by checking the API:

        GET /_cat/plugins


As with the `ingest-attachment` pipeline plugin, the `ingest-geoip` plugin is used as a processor within an ingest pipeline. The [Geoip plugin documentation](https://www.elastic.co/guide/en/elasticsearch/plugins/6.1/using-ingest-geoip.html) outlines the available settings when creating processors within a pipeline.

1.  Create a pipeline called `parse-ip` which consumes an IP address from a field called `ip` and creates regional information underneath the default field (`geoip`):

        PUT /_ingest/pipeline/parse-ip
        {
          "description" : "Geolocate an IP address",
          "processors" : [ { "geoip" : { "field" : "ip" } } ]
        }

2.  Add a mapping to the index to indicate that the `ip` field should be stored as an IP address in the underlying storage engine:

        POST /test/_mapping/doc
        {
          "properties": {
            "ip": {
              "type": "ip"
            }
          }
        }

3.  Index a document with the `ip` field set to an example address and pass the `pipeline=parse-ip` in the request to use the `parse-ip` pipeline to process the document:

        PUT /test/doc/ipexample?pipeline=parse-ip
        {
          "ip": "8.8.8.8"
        }

4.  Retrieve the document to view the fields created by the pipeline:

        GET /test/doc/ipexample

    The response should include a `geoip` JSON key with fields such as `city_name` derived from the source IP address. The plugin should correctly determine that the IP address is located in California.

### User Agent Processor Plugin

A common use case for Elasticsearch is to index log files. By parsing certain fields from web server access logs, requests can be more effectively searched by response code, URL, and more. The `ingest-user-agent` adds the capability to parse the contents of the `User-Agent` header of web requests to more precisely create additional fields identifying the client platform that performed the request.

1.  Install the plugin:

        sudo /usr/share/elasticsearch/bin/elasticsearch-plugin install ingest-user-agent

2.  Restart Elasticsearch:

        sudo systemctl restart elasticsearch

3.  Confirm the plugin is installed:

        GET /_cat/plugins

4.  Create an ingest pipeline which instructs Elasticsearch which field to reference when parsing a user agent string:

        PUT /_ingest/pipeline/useragent
        {
          "description" : "Parse User-Agent content",
          "processors" : [ { "user_agent" : { "field" : "agent" } } ]
        }

5.  Index a document with the `agent` field set to an example `User-Agent` string:

        PUT /test/doc/agentexample?pipeline=useragent
        {
          "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
        }

6.  Retrieve the document to view the fields created by the pipeline:

        GET /test/doc/agentexample

    The indexed document will include user data underneath the `user_agent` JSON key. The User Agent plugin understands a variety of `User-Agent` strings and can reliably parse `User-Agent` fields from access logs generated by web servers such as Apache and NGINX.

## Conclusion

The plugins covered in this tutorial are a small subset of those available from Elastic or written by third parties. For additional resources regarding Elasticsearch and plugin use, see the links in the **More Information** section below.
