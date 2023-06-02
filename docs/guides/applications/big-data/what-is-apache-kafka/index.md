---
slug: what-is-apache-kafka
description: 'This guide provides you with an introduction to Kafka, an open-source platform for stream management and processing, excellent when real-time data streams are needed.'
og_description:  'This guide provides you with an introduction to Kafka, an open-source platform for stream management and processing, excellent when real-time data streams are needed.'
keywords: ['Apache','Kafka','streaming','processing','events']
tags: ['kafka', 'apache']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-11
image: KAFKA1.jpg
modified_by:
  name: Linode
title: "An Introduction to Apache Kafka"
title_meta: "What is Apache Kafka?"
external_resources:
- '[Apache Kafka](https://kafka.apache.org/)'
- '[Events](https://kafka.apache.org/intro#intro_concepts_and_terms)'
- '[Kafka Administration API](https://kafka.apache.org/27/javadoc/index.html)'
- '[Kafka Documentation](https://kafka.apache.org/documentation/)'

authors: ["Jeff Novotny"]
---

[*Apache Kafka*](https://kafka.apache.org/), often known simply as Kafka, is a popular open-source platform for stream management and processing. Kafka is structured around the concept of an event. External agents, independently and asynchronously, send and receive event notifications to and from Kafka. Kafka accepts a continuous stream of events from multiple clients, stores them, and potentially forwards them to a second set of clients for further processing. It is flexible, robust, reliable, self-contained, and offers low latency along with high throughput. LinkedIn originally developed Kafka, but the Apache Software Foundation offers the current open-source iteration.

## An Overview of Apache Kafka

Kafka can be thought of as a re-implementation, or an evolution of a traditional database for a streaming world. Whereas the databases you are probably familiar with store data in tables with well-defined attributes, keys, and schemas, Kafka is much more freeform. Kafka's purpose is to receive, store, and transmit a record of real-time [*events*](https://kafka.apache.org/intro#intro_concepts_and_terms).

In a typical workflow, one or more producer applications send key-value messages about a pre-defined topic to a Kafka cluster. A cluster consists of one or more servers, which are also called *brokers*, and each cluster typically hosts messages for many topics. One of the brokers in the cluster receives these messages and writes them to a log file corresponding to the topic. These log files are called *partitions*, and topics usually contain several partitions. Messages might also get replicated to some of the other nodes within the cluster. Other processes known as consumers can then read and process the events in each partition. You can write these consumer and producer applications yourself or use third-party offerings.

{{< note respectIndent=false >}}
At the time of writing this guide, the version of Apache Kafka is release 2.7.
{{< /note >}}

## Advantages of Apache Kafka

1. **High Throughput:** Kafka is based on a highly optimized and efficient architecture. This allows Kafka to handle both low latency as well as high throughput.

1. **Highly Reliable:** Kafka can handle high volume data flow from multiple producers (who write to Kafka) and to multiple consumers (who poll Kafka for data to read).

1. **Durability:** Kafka stores events in a simple log format and hence, the data is durable and retention policies are easy to implement. You can deploy Kafka on virtual machines, bare metal, and in the cloud.

1. **Scalability:** Without any system downtime, you can easily add or upgrade nodes for extra reliability.

1. **Message Broker Capabilities:** You can organize several Kafka message brokers into a fault-tolerant cluster and replicate data between them.

1. **Consumer Friendly:** Kafka can integrate well with many programming languages including Java (the native language of Kafka), Go, C++, Python, and REST APIs which are useful for testing and prototyping.

Kafka provides applications such as [*Kafka Connect*](https://kafka.apache.org/documentation/#connect) (for integrating external components) and [*Kafka Streams*](https://kafka.apache.org/28/documentation/streams/) (for stream processing), as well as security and access policies. Many vendors have jumped in with third-party extensions for legacy systems, and Kafka provides many APIs for both producers and consumers to use. However, solid programming skills are required to develop a complex Kafka application.

## Use Cases for Apache Kafka

Kafka can be used in a variety of settings, but it lends itself to environments with a real-time data stream. It is an ideal format for a modern microservice-based world.

- Kafka is especially practical if the data is coming from multiple sources and intended for multiple destinations. Kafka works best with data representing a sequence of discrete events in a log-ready format.

- A suitable application for Kafka might be a simple home monitoring system. Each device in the house is a producer. Each of these producers sends status updates, alarms, maintenance reminders, and customer requests to Kafka. The events aggregate into a multi-device stream, which Kafka stores for further reference. The data remains available for alarm monitoring services and customer web portals to access later on. The monitoring service could constantly poll for new data, while customers might review their data sometime in the future.

- Kafka can also serve vastly more complicated systems, such as hotel reservation networks. The data might come from thousands of producers, including third-party systems. It could be sent to far more demanding consumers, such as marketing, e-commerce, and reservation portals. A large Kafka cluster might consist of hundreds of brokers and have tens of thousands of topics, along with complex replication and retention policies.

The [*Kafka website*](https://kafka.apache.org/uses) mentions several high-level domains where Kafka clusters might be used. Some of these areas include:

- **Message Brokers:** Due to Kafka's low latency and reliability, it excels as a buffer for inter-system communications. Its design allows for a completely modular decoupling of producers and consumers. High-speed producers, such as web applications, can immediately send events to Kafka. Consumer systems can then chew through the message buffer and carry out their more time-intensive work. Consumers can temporarily fall behind during high-volume bursts without destabilizing the system. Kafka simply continues to store the messages, and the consumers can retrieve them when they are ready.

- **Website Tracking:** Web tracking can be a very high-volume activity if a site intends to track all user actions. Kafka is a good choice for this because of its high throughput and efficient storage system. The aggregators can sweep up the data later on and rebuild the customer timeline based on the ID and topic of each event.

- **Metrics/Log Aggregation:** Kafka is suitable for logging operational data from a large number of networked devices. Kafka preserves data directly in log form and abstracts away system details, so simple end-user devices can quickly and easily interact with it.

- **Stream Processing:** Many modern web applications handle a stream of user updates and submissions. This type of data flow naturally lends itself to Kafka processing. Pipelines can evaluate, organize, and manipulate this content into a format suitable for secondary sources.

## Architecture of Apache Kafka

Kafka's architecture contains the components and extensions listed below. The following sections a more in-depth discussion for each component and extension.

- [Kafka Event Message Format](#kafka-event-message-format)
- [Topics and Partitions](#kafka-topics-and-partitions)
- [Clusters and Replication (including Zookeeper)](#kafka-clusters-and-replication)
- [Producers and Consumers](#producers-and-consumers)
- [Security, Troubleshooting, and Compatibility](#security-troubleshooting-and-compatibility)

### Kafka Event Message Format

In Kafka terminology, an event, a record, and a message all refer to the same thing. Kafka and its clients can only communicate by exchanging events. The Kafka design intentionally keeps the message format simple and concise to allow for greater flexibility. Each message contains the following fields:

- **Metadata header:** Each variable length header consists of fields including message length, key, value offsets, a CRC, the producer ID, and a magic ID (akin to a version). The Kafka APIs automatically build the headers.

- **Key:** Each application defines its own keys. Keys are opaque and are of variable length. In a typical application, the key refers to a particular user, customer, store, device, or location. It answers questions like:

  - Who or what generated this event?
  - Who or what does this event concern?

  Kafka ensures all messages with the same key are stored sequentially inside the same partition.

- **Value:** Values are opaque and are of variable length similar to *Keys*. The open-ended structure allows you to store any amount of data in any format. A value can be a standardized multi-field record or a simple string description, but values typically have at least some structure.

- **Timestamp:** Represents either the time the producer generated the event or the time Kafka received it.

### Kafka Topics and Partitions

Each event is stored inside a Kafka *topic*, and each topic contains many events. A topic can be thought of as a file folder. Each "folder" contains many individual files representing the events. Kafka allows an unlimited number of producers to publishing events on the same topic.

The events within a topic have the following capabilities :

- They are immutable and persist after being read, so they can be accessed multiple times.

- They can be stored indefinitely subject to storage limits. By default, events are kept for seven days. Each event within a topic is stored within a designated partition.

Kafka topics can be managed via the [Kafka Administration API](https://kafka.apache.org/27/javadoc/index.html). Kafka’s topics are divided into several *partitions*. Some of Kafka's partition facts are as follow:

- Kafka groups messages together when accessing a partition, resulting in efficient linear writes. Each message obtains a sequentially increasing number and is stored at an offset within its partition. This is used to maintain strict ordering.

- Events in a partition are always read in the same order they were written, but you can choose to compact a Kafka topic.

- When compaction is set, older events do not automatically expire. However, when a new event arrives, Kafka discards older events with the same key. Only the newest update is kept. You can choose to apply a deletion policy or a compaction policy, but not both.

### Kafka Clusters and Replication

Although you can certainly run Kafka on a stand-alone server, it works best when it runs on a cluster.

- Some of the servers in a cluster act as brokers to store the data. The other servers within the cluster might run services like *Kafka Connect* and *Kafka Streams* instead. Grouping the servers this way increases capacity and also allows for high reliability and fault tolerance.

- Kafka uses a central management task called *Zookeeper* to control each cluster. Zookeeper elects and tracks leaders to monitor the status of cluster members and manage the partitions.

- Zookeeper optionally maintains the *Access Control List* (ACL). You must launch Zookeeper before starting Kafka, but you do not otherwise have to actively manage it. Your cluster configuration determines how Zookeeper behaves. You can use the [*Kafka Administration API*](https://kafka.apache.org/27/javadoc/index.html) to manage cluster and replication settings.

Kafka replicates the partitions between the servers so there are several backups on other servers. A set of three or four servers are typical. One of the brokers is elected the leader on a per-partition basis. The leader receives events from the producers and sends updates to the consumers. The remaining brokers serve as followers. They query the leader for new events and store backup copies.

You can configure a Kafka cluster for different levels of reliability. Kafka can send an acknowledgment upon the first receipt of a message or when a certain number of backup servers have also made a copy. The first method is faster, but a small amount of data might be lost if the master fails. Producers can elect not to receive any acknowledgments if best-effort handling is the goal. Kafka does not automatically balance any topics, partitions, or replications. The Kafka administrator must manage these tasks.

### Producers and Consumers

Producers and consumers can both use the [Kafka Administration API](https://kafka.apache.org/27/javadoc/index.html) to communicate with Kafka.

- Applications use these APIs to specify a topic and send their key-value messages to the cluster.

- Consumers use the API to request all stored data or to continuously poll for updates.

The Kafka cluster keeps track of each consumer's location within a given partition so it knows which updates it still has to send. *Kafka Connect* and *Kafka Streams* help manage the flows of information to or from Kafka.

Our guide for [installing Kafka](/docs/guides/how-to-install-apache-kafka-on-ubuntu/) includes an example of how to use the producer and consumer APIs.

### Security, Troubleshooting, and Compatibility

Kafka clusters and brokers are not secure by default, but Kafka supports many security options.

- Using SSL, you can authenticate connections between brokers and clients, as well as between the brokers and the Zookeeper.

- You can enforce authorization for reading and write operations and encrypt data in transit. Kafka supports a mix of authenticated and non-authenticated clients and a high degree of granularity to the security settings.

Kafka also provides tools to monitor performance and log metrics, along with the usual error logs. Several third-party tools are offering Kafka command centers and big-picture snapshots of an entire cluster.

When upgrading Kafka brokers, or individual clients, it is important to consider compatibility issues. Schema evolution must be properly planned out, with components upgraded in the proper order along with version mismatch handling. Kafka streams provide version processing to assist with client migration.

## Kafka Connect

*Kafka Connect* is a framework for importing data from other systems, or exporting data to them. This allows easier integration between Kafka and traditional databases.

Some of the benefits of Kafka Connect include:

- Kafka Connect runs on its own server rather than on one of the regular Kafka brokers.

- The Kafka Connect API builds upon the Consumer and Producer APIs to implement connector functions for many legacy systems.

- Kafka Connect does not ship with any production-ready connectors, but there are many open source and commercial utilities available. For example, you might use a *Kafka Connect* connector to quickly transfer data out of a legacy relational database and into your Kafka cluster.

## Kafka Streams

*Kafka Streams* is a library designed for rapid stream processing. It accepts input data from Kafka, operates upon the data, and retransmits the transformed data. A Kafka Streams application can either send this data to another system or back to Kafka.

Some of the benefits of Kafka Streams are:

- Kafka Streams offers utilities to filter, map, group, aggregate, window, and join data.

- **Highly Durable:** The open-source RocksDB extension permits stateful stream processing and stores partially processed data on a local disc.

- **Stream processing:** Kafka Streams provides transactional writes, which guarantee "exactly once" processing. This means that it can execute a read-process-write cycle one time, without missing any input messages nor produces duplicate output messages.

## Install Kafka

You must install Java first before installing Apache Kafka. Kafka itself is straightforward to install, initialize, and run.

- [The Kafka site](https://kafka.apache.org/) contains a basic tutorial.

- We also have a guide on how to [Install Apache Kafka](/docs/guides/how-to-install-apache-kafka-on-ubuntu/) which demonstrates how to construct a simple producer and consumer and process data with Kafka Streams.

## Further Reference

Apache provides extensive documentation and supporting materials for Kafka.

- The [*Kafka documentation web page*](https://kafka.apache.org/documentation/) discusses the design, implementation, and operation of Kafka, with a deep-dive into common tasks.

- In-depth API information is found on the [*Kafka JavaDocs page*](https://kafka.apache.org/27/javadoc/index.html). You can reference a high-level overview of each class along with an explanation of the various methods.

- You can also refer to the [*Kafka Streams documentation*](https://kafka.apache.org/documentation/streams/) which features a demo and a fairly extensive tutorial.
