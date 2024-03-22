---
slug: use-apache-kafka-to-process-streams
title: "How to Process Streams Using Kafka"
title_meta: "Use Apache Kafka to Process Streams"
description: 'Two to three sentences describing your guide.'
keywords: ['Kafka process streams', 'Apache Kafka', 'Kafka message broker', 'Kafka events', 'Kafka API', 'Kafka stream setup', 'Kafka tutorial']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Tom Henderson"]
published: 2023-12-24
modified_by:
  name: Linode
external_resources:
- '[KStreams API](https://kafka.apache.org/35/documentation/streams/core-concepts)'
- '[Commonly used logging facade in Java](https://www.slf4j.org/)'
---

This guide addresses Apache Kafka and its ability to process data streams. The sources are provided by applications using Kafka libraries. The source data applications push data to Kafka, which serializes and stores the data; Kafka then makes the logged data available to other applications written in various languages.

## What is Apache Kafka?

Apache Kafka is a highly scalable messaging bus orchestration system based on a commit log foundation. It builds a sequence-tagged, append-only, logging system dataset where inputs are decoupled from outputs. The Kafka-processed data store contains messages that are sequentially logged and serialized.

Kafka can take many concurrent data sources, partition and order the messages, and make them available for consumers. The message source is disassociated from the message receiver, and the source and destination of the messages allow microservices to be publishers and consumers. These disassociated applications can be from many sources, programming languages, business logic cases, and contexts.

Kafka’s API set is a jar or library that attaches Kafka to an application. The application processes data, calling the library to push information to or retrieve data from Kafka. It is built for speed and scale, and very little processing goes on inside Kafka. This allows a variety of applications to speak to one serialized data store, and an application may play several roles as a client, with Kafka as a server.

In this application model, consumers can play dual roles as subsequent producers, publishing their processed results to other subscribers in the pub/sub model. Consumer-retrieved messages are processed and become a new Kafka produced input topic for another message consumer. This allows Kafka to be the immutable logkeeper of a variety of data at differing points of business data processing tasks through a transaction cycle.

[Kafka is designed for speed, scale, and reliable distributed infrastructure](/docs/guides/what-is-apache-kafka/). It mimes and allies frameworks constructed with Big Data, complex multi-partner trading, log accumulation and processing, and traditional transaction tracking systems.

### The Kafka Pub/Sub Model and Terminology

Kafka uses an architectural model called Publisher-Subscriber, also known as the pub/sub model. In this model, a framework is established between publisher applications that are providers of event information, and apps using the logged provider data by subscribers and consumers of the logged data.

In the pub/sub paradigm, Kafka refers to its app server instances as *brokers*. There is usually only one *leader broker*, and it is common to store topic data across several broker member servers for resiliency, redundancy, and data localization or processing requirements. These replicas of data are called *partitions*.

Kafka receives messages called *events*, and logs and sequentially stores events as topics. Consumer applications poll Kafka to receive messages, or *events*, within topics. These are serialized once Kafka receives them. Publisher applications push messages in topics to Kafka instances. Kafka then handles the distribution of the messages as a log store accessed by consumer applications.

Kafka elements are its logs, and the sanity and state-checking components are kept by a coordination application, the *Zookeeper*. Applications for producers' and consumers' log data are written and deployed applications externally to Kafka. They can be written in any programming language using Kafka APIs and libraries.

## Quick Guide To Kafka Concepts: Client-Server and Streams

Producer and consumer applications access Kafka in the client-server model, where the producer and consumer applications are the clients, with Kafka’s log store of topics and events within topics as the server in the client-server model.

Producers send events to topics, called streams which are analogous to a row update in an SQL database environment. The messages updating topics pushed to Kafka by producer applications follow the topic’s format. Many topics may have many formats but are consistent across partitions when secondary partitions are updated by Kafka.

Examples include sensor data from many sources, elements of transactions, stock market data, warehouse additions/deletions from inventory, GPS and other position tracking data, and similar multi-sources of constantly streaming data. Records are received in varying cycles, rather than being polled from sources.

### Kafka Streams

Kafka Streams is a client library used by application builders using the pub/sub model to build applications and microservices based on Kafka clusters datastores. Messages arrive as a key/value pair; each record is, therefore, a two-tuple item, analogous to a two-column row in SQL database parlance.

In the KStream library are objects built from Kafka topics called KStream objects that are built with KStreamBuilder(). KStream processes streams of records, and alternately, KTable works for some given key, reading as a changelog and offering the latest value for that given key. For events that rely on current events and not prior values for the “table”, KTable retains, observes, and finds the most recent value.

Kafka uses a log-append system to store event messages. Each message stored is immutable and cannot be changed. Each message it stores is analogous to a single SQL row.

Applications can take streaming data and use table topics as accumulators, dynamically changing between stateless monitoring and stateful event storage. Neither the application forming the message, nor the application polling for messages is relevant to Kafka’s state.

## Kafka Brokers

Apache Kafka Brokers are Kafka instances. Kafka is best functionally deployed with a minimum of three instances and there is no maximum. Kafka broker instances are called a Kafka *cluster*. Cluster broker members can be deployed on Kubernetes, Docker, VMs, or a combination of these deployment methods.

Producers are application data sources that form and send topics to the leader broker. Kafka instances listen for event messages on TCP port `9092` of the broker instance specified in the bootstrap library object that the Publisher uses to send messages. Kafka writes event messages to its store sequentially, as a key/value pair. Keys are iterative, sequential, and establish the message or topic sequence.

The lead broker, which an application discovers through the called library bootstrap process for a topic has the freshest information, and *follower* brokers copy their replication of the partition from the leader broker store. Partitions are replicated across the broker instances programmatically by the Producer app depending on the Producer’s event key.

In turn, consumers poll the leader broker for event messages that are in partitions. Consumer applications know about their partitions and the sequential messages in the log.

Messages are stored in the cluster among the brokers in partitions according to configuration. The default storage time is seven days, however, it can be up to a year, depending on transaction volume, storage capacity, history required, and replication needs.

## ZooKeeper

A Zookeeper instance and its configuration control the establishment and maintenance of Kafka clusters. Each broker has a Zookeeper instance that starts before the Kafka broker instance in a server instance starts.

Zookeeper instances communicate with other Zookeepers on each broker to elect a leader when communications fail or become corrupt. The cluster broker leader is configured to permit data sanity when a broker, and therefore the broker’s partitions, become unavailable.

Kafka keeps track of the consumers that poll the leader broker. There are consumer constructions, single consumers, groups of consumers, and combinations of single and group consumers, depending on programming and resiliency needs. All consumer applications poll Kafka as subscribers to its data stores. Kafka uses a heartbeat mechanism to determine that consumers have not lost parity which means that a consumer may lose log sequence and is otherwise not synchronized with the feeds.

Producers and consumers can communicate with Kafka synchronously or asynchronously. Messages that become topic-logged records do not need to be timed, and requests from consumers can be polled randomly.

The Zookeeper process also keeps track of access control lists, failure detection, auth secrets, configuration options asserted during failures, and the recovery of activities based on the failure mode within the cluster. Its library admin functions are the gateway to programming changes to ZooKeeper functions.

## Kafka Events

Kafka receives events. Many unbound events from the same Publisher are termed "streams". Events are messages sent to specific, pre-determined topics. The message sent by a Publisher application to the Kafka cluster becomes topic partitions that are in turn, copied to other brokers. Events are serialized on entrance to Kafka and deserialized upon exit from Kafka. The process of event serialization and deserialization (seder) is handled by applications through a function `serder()`.

Partitions can be sent to multiple member broker targets in a cluster. When a broker member of a cluster becomes unavailable, or a new broker member comes online, the cluster is forced to rebalance the partitions striped across the cluster; a new leader may be elected in the process. To the producers and consumers, a cluster rebalance is a process whose sanity checks can be configured to suit the nature of the rebalancing. Partitions contain the same topic seder() values across brokers. This allows a broker failure within a cluster to produce correctly serialized data from other partitions.

## Kafka Producers

Producers are applications that receive data from various sources, perhaps the Kafka cluster as a subscriber/consumer, and format that data into an event that is then published to Kafka. The source data may be transaction data, the result of web purchases, inventory lookups, likes received in an online forum, IoT information coming from building temperature controls, financial transactions, or GPS data.

When the Producer sends an event to a cluster, the cluster logs the event as a log message and acknowledges the logging to the Producer.

Producers specify the network location of the cluster, form a message as an event, transmit it, and receive a receipt acknowledgment from the cluster. This mimes a database commit or a commit as part of transaction processing. In layman’s terms, the database (Kafka log) received the record (the message event) and returned a message acknowledging receipt of the event, similar to a transactional database commit sequence.

The producer may also specify in the message that the data is to be replicated into partitions a number of times, using the hash value of the key sent with the key/value pair part of the event message.

### Producer Event Messages

An event message consists of four elements:

- An optional header or headers
- A key
- A value associated with the key
- A timestamp that represents either ingestion time or creation time

Every Kafka event is a simple key-value pair with optional headers and a time stamp. Keys and values are strings or integers. The time can be set explicitly by the Producer, or time stamped upon ingestion. Values can be also written in various formats including JSON and AVRO.


If no key is sent by the Producer, the default strategy Kafka employs places topics round-robin in its broker topic partitions. If a key is sent, the key is hashed and its modulo specifies the number of partitions that Kafka allocates to a topic across the brokers in its cluster. Custom partitioning strategies make use of Kafka configuration to define partition quantity and allocation across a cluster.

## Stream Setup and Traffic Management

Stream ingress and management to applications surrounding Kafka fall into two general categories: applications that push or are polled. There are different techniques used for each that help plan the scope of scale needs.

Streaming devices and sources that are stateless, and can be buffered in applications prior to logging data to Kafka. This produces a predictable feed rate and duty cycle of transactions for an application, and data processing can take place *after* the stream(s) are fed to the Kafka log.

The Kafka libraries for applications contain a class called Interface ProducerInterceptor, which can intercept and optionally mutate, typically through a transform or lambda, streamed data sources to process events sent to Kafka topics. This class allows capturing planned sources of unbound data streams, merging or joining them with other data sources in cadence, and placing them into the key/value pairs that Kafka messaging uses.

These and other elements of the Kafka API ally program models can establish flow control, and where needed, log models from many sources to achieve complex relationships.

Where streams are stateful, cannot be polled, or are asynchronous and "bursty" in nature, Kafka scales in terms of the number of brokers and striped partitions across brokers to aid in transactional speed.

The ZooKeeper function quickly determines when to fail consumers and brokers, informing producers where to point data inputs to surviving members of a damaged cluster. Recovery time is minimized to prevent system latency.

The amount of time cluster realignment takes varies depending on the size of the cluster, and the latency between brokers. Kafka must react to changes asserted by the Zookeeper function cluster during reorganization function events. The synchronicity of the cluster varies by its configuration, and details are [highlighted in the KStreams API](https://kafka.apache.org/35/documentation/streams/core-concepts).

## Kafka Setup Example

Application development with Kafka is performed using an Integrated Development Environment (IDE) or through manual configuration pilots using the Kafka application. IDEs like IntelliJ IDEA are used with optional Kafka library classes that take advantage of Kafka object configuration routings for producer, subscriber, and administrative tasks as Java language classes.

Libraries joining these objects to other languages, such as C#, Python, Ruby, and IDEs surrounding framework development platforms, are available for many IDE platforms.

Akamai offers a guide on how to [Install and Configure Apache Kafka on Ubuntu](/docs/guides/how-to-install-apache-kafka-on-ubuntu/). This quick setup example is based on the installation and configuration setup in that guide.

This is modern Java code. It uses the `slf4j` logging code, [a commonly used logging facade in Java](https://www.slf4j.org/). The dependencies for the Java Kafka client include the following commonly used configurations:

```file {title="pom.xml" lang="xml"}
<!-- https://mvnrepository.com/artifact/org.apache.kafka/kafka-clients -->
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>3.3.1</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-api -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>2.0.6</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-simple -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>2.0.6</version>
</dependency>

```

At run time, these dependencies, and the version numbers change progressively as newer versions are released. You can build a Kafka producer class using these dependencies. The code below represents a Kafka producer class within the `org.example` package, utilizing the SLF4J logging framework.

```file {title="Producer.java" lang="java"}
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Producer {
    private static final Logger log = LoggerFactory.getLogger(KafkaProducer.class);

    public static void main(String[] args) {
        log.info("This Producer class will produce messages to the Kafka cluster or instance");
    }
}
```

The producer class calls the `slf4j` logger and `LoggerFactory` builder and is placed inside the Java app’s `main()` function. You must include these properties in the `main()` method:

```file {title="Producer.java" lang="java"}
package org.example;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;

public class Producer {
    private static final Logger log = LoggerFactory.getLogger(Producer.class);

    public static void main(String[] args) {
        log.info("This Producer class will produce messages to the Kafka cluster or instance");

        // Kafka producer configuration properties
        Properties properties = new Properties();
        properties.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        properties.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        properties.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        // Add Kafka producer logic here
    }
}
```

This code identifies how you reach the Kafka instance. The `localhost` is used as an example, but the correct IP address or Fully Qualified Domain Name-FQDN can be substituted. Call the `key_serializer` for both the key and then the value in the key/value pair that Kafka stores.

Records to become events are sent using the `send()` method:

```command
producer.send(producerRecord)
```

Calling the `send()` method updates whatever the value(s) is of the value of producerRecord. At the end of the `send()` process, a `close()` method stops the producer and clears message buffers.

The `send()` method setup requires that the producerRecord values are filled; and code for streams can setup up polling to fashion the value, a for-nect loop, do-while, or other function or method that fills in the producerRecord to be pushed by the `send()` method.

The consumer functions use similar methods to get records, called by a `main()` method:

```file {title="Consumer.java" lang="java"}
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Consumer {
    private static final Logger log = LoggerFactory.getLogger(Consumer.class);

    public static void main(String[] args) {
        log.info("This class consumes messages from Kafka");

        // Add Kafka consumer logic here
    }
}
```

Properties are similar to those for the `Producer.java`, but the client must now de-serialize records, because Kafka serializes them upon storage, and adds an offset:

```file {title="Consumer.java" lang="java"}
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.util.Properties;

public class Consumer {
    // Logger and other parts of the class remain the same...

    public static void main(String[] args) {
        log.info("This class consumes messages from Kafka");

        // Kafka consumer configuration properties
        Properties properties = new Properties();
        properties.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        properties.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.setProperty(ConsumerConfig.GROUP_ID_CONFIG, "lotr_consumer_group");
        properties.setProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        // Add Kafka consumer logic here
    }
}
```

The consumer side of the application must know the properties above to connect to the correct bootstrap server and be able to understand the sedes-serializer/deserializer of the records sought, as well as its membership if in a consumer group, so that the Kafka records requested by the consumer, understand their record offset, which may be different than another consumer’s call.

Like the producer object, the consumer object uses a `close()` method to gracefully die and maintain the application state.

These relationships are also well-explained at [freecodecamp.org](https://www.freecodecamp.org), and the examples used in this context can be found in their [corresponding section](https://www.freecodecamp.org/news/apache-kafka-handbook/#how-to-set-up-the-project).

## Conclusion

Apache Kafka serves as a distributed log to use in the pub/sub architectural model. By creating many brokers, it offers high reliability across a distributed framework message store.

Publishers and consumers, independent of each other, use its topic storage to create applications that use a combination of data intake processes that publish to the Kafka log, and consumers read the log as their data input sources.

The decoupling of input and output applications lends Kafka’s pub/sub architecture to the use of microservice applications. Apps written in many languages can share Kafka’s library functions to use with its distributed topic store.
