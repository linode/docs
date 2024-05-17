---
slug: use-apache-kafka-to-process-streams
title: "How to Process Streams Using Kafka"
description: 'Two to three sentences describing your guide.'
authors: ["Tom Henderson"]
contributors: ["Tom Henderson"]
published: 2024-05-17
keywords: ['Kafka process streams', 'Apache Kafka', 'Kafka message broker', 'Kafka events', 'Kafka API', 'Kafka stream setup', 'Kafka tutorial']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[KStreams API](https://kafka.apache.org/35/documentation/streams/core-concepts)'
- '[Commonly used logging facade in Java](https://www.slf4j.org/)'
---

This guide explores Apache Kafka and its ability to process data streams. Data sources are provided by applications using Kafka libraries. These applications push data to Kafka, which serializes and stores the data. Kafka then makes the logged data available to other applications written in various languages.

## What is Apache Kafka?

Apache Kafka is a highly scalable messaging bus orchestration system based on a commit log foundation. It builds a sequence-tagged, append-only, logging system dataset where inputs are decoupled from outputs. The Kafka-processed data store contains messages that are sequentially logged and serialized.

Kafka can take many concurrent data sources, partition and order the messages, then make them available for consumers. It disassociates the message source from the receiver, allowing microservices to be both publishers and consumers. These disassociated applications can be from many sources, programming languages, business logic cases, and contexts.

Kafka’s API is distributed as either a Java Archive File (JAR) or library that attaches Kafka to an application. The application processes data and calls the library to push information to, or retrieve data from, Kafka. It is built for speed and scale, so very little processing goes on inside Kafka. This allows a variety of applications to speak to one serialized data store. An application may play several roles as a client, with Kafka as a server.

In this application model, consumers can play dual roles as subsequent producers, publishing their processed results to other subscribers in the pub/sub model. Consumer-retrieved messages are processed and become a new Kafka-produced input topic for another message consumer. This allows Kafka to be the immutable log keeper of a variety of data for various business data processing tasks throughout the transaction cycle.

[Kafka is designed for speed, scale, and reliable distributed infrastructure](/docs/guides/what-is-apache-kafka/). It is well-suited for frameworks constructed for Big Data, complex multi-partner trading, log accumulation & processing, and traditional transaction tracking systems.

### The Kafka Pub/Sub Model and Terminology

Kafka uses an architectural model called Publisher-Subscriber (pub/sub). In this model, a framework is established between publisher applications, which provide event information, and subscriber applications, which consume the logged data from these providers.

In the pub/sub paradigm, Kafka refers to its application server instances as *brokers*. There is usually only one *leader broker*. However, it is common to store topic data across several brokers for resiliency, redundancy, data localization, or other processing requirements. These replicas of data are called *partitions*.

Kafka receives messages called *events*, which it logs and sequentially stores as *topics*. Consumer applications retrieve these messages, or *events*, by polling Kafka within specific topics. These are serialized once Kafka receives them. Publisher applications push messages in topics to Kafka instances. Kafka then handles the distribution of the messages as a log store accessed by consumer applications.

Kafka core elements are its logs. Sanity and state-checking components are maintained by a coordination application called *Zookeeper*. Producers and consumer applications for logging data are developed and deployed independently from Kafka. These applications can be written in any programming language to utilize Kafka APIs and libraries.

## Kafka Concepts

Producer and consumer applications access Kafka in the client/server model. Here, the producer and consumer applications are the clients, while Kafka’s log store containing topics and events act as the server.

Producers send events to topics, called *streams*, which are analogous to a row update in an SQL database environment. Messages sent to Kafka by producer applications adhere to the topic’s format. Topics can have various formats, but they remain consistent across partitions when Kafka updates secondary partitions.

Examples include sensor data, stock market data, GPS data, financial transactions, inventory, and similar sources of constantly streaming data. Instead of being periodically polled for updates, these records are continuously sent to Kafka as they are generated.

### Kafka Streams

Kafka Streams is a client library (`KStream`) that developers adopting the pub/sub model use to build applications and microservices based on Kafka clusters datastores. Messages arrive as a key-value pair, analogous to a two-column row in SQL database terminology.

The KStream library contains KStream objects, which are built from Kafka topics using `KStreamBuilder()`. KStream processes streams of records, while KTable operates on specific keys. KTable reads keys as a changelog and provides the latest value for each. For events that rely on current data and not prior values for the “table”, KTable retains, observes, and finds the most recent value.

Kafka uses a log-append system to store event messages. Each message it stores is immutable and cannot be changed. Each stored message is analogous to a single SQL row.

Applications can take streaming data and use table topics as accumulators, allowing them to dynamically change between stateless monitoring and stateful event storage. Kafka's state is unaffected by either the application forming the message, or the application polling for messages.

### Kafka Brokers

Kafka instances are known as *brokers*. Kafka is optimally deployed with a minimum of three instances, but there is no maximum. Collectively, Kafka brokers are called a Kafka *cluster*. Cluster members can be deployed on Kubernetes, Docker, VMs, or a combination of these deployment methods.

*Producers* are application data sources that create and send topics to the leader broker. By default, Kafka instances listen for event messages on TCP port `9092` of the specified broker instance. This port is configured in the bootstrap library object used by the Publisher to send messages. Kafka writes event messages to its store sequentially, key-value pairs. Keys are iterative, sequential, and establish the sequence of messages/topics.

The lead broker, which an application discovers through the bootstrap process for a topic, has the freshest information. *Follower* brokers replicate partitions from the leader broker's store. Partitions are replicated across the broker instances programmatically by the Producer app based on the Producer’s event key.

In turn, consumers poll the leader broker for event messages in partitions. Consumer applications are aware of their assigned partitions and the sequential messages contained within the log.

Messages in the Kafka cluster are stored across multiple brokers and organized into partitions according to the cluster's configuration. The default storage time is seven days. However, it can be up to a year, depending on transaction volume, storage capacity, history required, and replication needs.

### ZooKeeper

A Zookeeper instance and its configuration control the establishment and maintenance of Kafka clusters. Each broker has a Zookeeper instance that starts before the Kafka broker instance.

Zookeeper instances communicate with other Zookeepers on each broker to elect a leader when communication fails or becomes corrupt. The cluster's broker leader is configured to permit data sanity when a broker, and therefore its partitions, become unavailable.

Kafka keeps track of the consumers that poll the leader broker. There are various potential consumer configurations, including single consumers, consumer groups, and combinations of both. The choice depends on programming requirements and resiliency needs. All consumer applications poll Kafka as subscribers to its data stores. Kafka uses a heartbeat mechanism to ensure that consumers have not lost parity. If this happens, a consumer may lose log sequence and is otherwise not synchronized with the feeds.

Producers and consumers can communicate with Kafka synchronously or asynchronously. Messages that become topic-logged records do not need to be timed, and requests from consumers can be polled randomly.

The Zookeeper process manages access control lists, failure detection, authentication secrets, configuration options asserted during failures, and activity recovery based on the failure mode within the cluster. Its library administration functions are the gateway to programming changes to ZooKeeper functions.

### Kafka Events

Kafka receives events, which can include many unbound events from the same Publisher, termed *streams*. Events are messages sent to specific, pre-determined topics. The message sent by a Publisher application to the Kafka cluster becomes a topic partition that is then copied to other brokers. Events are serialized on entrance to Kafka and deserialized upon exit. The process of event serialization and deserialization (Ser/Des) is handled by applications through the `Serdes()` function. See Kafka's [Data Types and Serialization](https://kafka.apache.org/10/documentation/streams/developer-guide/datatypes) documentation for more information about the `Serdes()` function.

Partitions can be sent to multiple broker members in a cluster. If a broker member becomes unavailable or a new one comes online, the cluster rebalances the partitions across the cluster, potentially electing a new leader in the process. To the producers and consumers, a cluster rebalance is a process whose sanity checks can be configured to suit the nature of the rebalancing. Partitions contain the same topic `Serdes()` values across brokers. This allows a broker failure within a cluster to produce correctly serialized data from other partitions.

### Kafka Producers

Producers are applications that receive data from various sources and format that data into an event that is then published to Kafka. This can include subscribing to the Kafka cluster as a consumer. The source data may be transaction data, the result of web purchases, inventory lookups, likes received in an online forum, IoT information coming from building temperature controls, financial transactions, or GPS data.

When the producer sends an event to a cluster, the cluster logs the event as a log message and acknowledges the logging to the producer.

Producers specify the network location of the cluster, form a message as an event, transmit it, and await acknowledgment from the cluster. This is similar to a transactional database commit sequence. Here, the database (the Kafka log) received the record (the message event) and returned a message acknowledging receipt of the event.

The producer may also specify in the message that the data is to be replicated into partitions a number of times. This is achieved using the hash value of the key in the key-value pair within the event message.

#### Producer Event Messages

An event message consists of four elements:

- An optional header or headers
- A key
- A value associated with the key
- A timestamp that represents either ingestion time or creation time

Every Kafka event is a simple key-value pair with optional headers and a time stamp. Keys and values are strings or integers. The time can be set explicitly by the producer, or timestamped upon ingestion. Values can also be written in various formats, including JSON and AVRO.

If no key is provided by the producer, Kafka's default strategy evenly distributes topics in a round-robin fashion across its broker topic partitions. If a key is provided, Kafka hashes the key and its modulo determines the number of partitions it allocates to a topic across the brokers in its cluster. Custom partitioning strategies make use of Kafka configuration to define partition quantity and allocation across a cluster.

## Stream Setup and Traffic Management

Stream ingress and management for applications interacting with Kafka fall into two general categories: applications that push, and applications that are polled. Different techniques are used for each category to help plan for scalability requirements.

Stateless streaming devices and sources can be buffered in-application prior to logging data to Kafka. This produces a predictable feed rate and duty cycle of transactions for an application. Data processing can take place after the stream or streams are fed to the Kafka log.

Kafka application libraries contain a class called `Interface ProducerInterceptor`. It is designed to intercept and optionally modify streamed data sources before processing events sent to Kafka topics. This is typically done through a transform or lambda. This class allows capturing planned sources of unbound data streams, merging or joining them with other data sources, and placing them into key-value pairs used by Kafka messaging.

These and other elements of the Kafka API enable program models to establish flow control and, when needed, log models from many sources to achieve complex relationships.

When streams cannot be polled or are stateful, asynchronous, or sporadic, Kafka scales the number of brokers/partitions to increase transactional speed.

The ZooKeeper function quickly determines when consumers and brokers fail, informing producers where to redirect data inputs to surviving members of a damaged cluster. Recovery time is minimized to prevent system latency.

The amount of time cluster realignment takes varies depending on the size of the cluster and the latency between brokers. Kafka must react to changes triggered by the Zookeeper function during cluster reorganization events. The synchronicity of the cluster varies by its configuration, and details are [highlighted in the KStreams API](https://kafka.apache.org/35/documentation/streams/core-concepts).

## Kafka Setup Example

Application development with Kafka is performed using an Integrated Development Environment (IDE) or through manual configuration of the Kafka application. IDEs like IntelliJ IDEA can leverage optional Kafka library classes that take advantage of Kafka object configuration routings for producer, subscriber, and administrative tasks as Java language classes.

Libraries joining these objects to other languages, such as C#, Python, and Ruby are available for many IDE platforms.

Akamai offers a guide on how to [Install and Configure Apache Kafka on Ubuntu](/docs/guides/how-to-install-apache-kafka-on-ubuntu/). This example is based on the installation and configuration shown in that guide.

This is code is written in modern Java and utilizes the `slf4j` logging framework, [a commonly used logging facade in Java](https://www.slf4j.org/). The dependencies for the Java Kafka client include the following commonly used configurations:

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

At runtime, these dependencies undergo progressive version number changes as newer versions are released. You can use these dependencies to build a Kafka producer class. The code below represents a Kafka producer class within the `org.example` package, utilizing the `slf4j` logging framework:

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

The producer class is placed inside the Java app’s `main()` function, and it calls the `slf4j` logger and `LoggerFactory` builder. You must include these properties in the `main()` method:

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

This code identifies how to reach the Kafka instance. `localhost` is used as an example, but the correct IP address or Fully Qualified Domain Name (FQDN) can be substituted. Call the `key_serializer` for both the key and the value in the key-value pair that Kafka stores.

The `send()` method is used to transmit records (i.e. events or messages) to Kafka topics:

```command
producer.send(producerRecord)
```

Calling the `send()` method updates the value of `producerRecord`. At the end of the `send()` process, a `close()` method stops the producer and clears message buffers.

The `send()` method setup requires that the `producerRecord` values are filled. For streams, code can establish polling mechanisms to derive the value. For example, loops such as `for-next`, `do-while`, and other functions/methods that populate the `producerRecord` to be pushed by the `send()` method.

Consumer functions use similar methods to get records, called by a `main()` method:

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

Consumer properties are similar to those for `Producer.java`, but the client must de-serialize records, because Kafka serializes them upon storage, and adds an offset:

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

The consumer side of the application must know the properties above to connect to the correct bootstrap server. It must also be able to understand the SerDes of the records it seeks, along with its membership if in a consumer group. This ensures that the Kafka records requested by the consumer are processed correctly, considering their record offset, which may be different than another consumer.

Like the producer object, the consumer object uses a `close()` method to gracefully terminate and maintain the application state.

These relationships are explained in further detail at [freecodecamp.org](https://www.freecodecamp.org/news/apache-kafka-handbook/#how-to-set-up-the-project).

## Conclusion

Apache Kafka serves as a distributed log to use in the pub/sub architectural model. By creating many brokers, it offers high reliability across a distributed framework message store.

Publishers and consumers use Kafka's topic storage to create applications independently of each other. Publishers write data into the Kafka log through data intake processes, while consumers read the log as their data source.

Kafka’s pub/sub architecture, which decouples input and output applications, is well-suited for microservices. Applications written in various languages can leverage Kafka’s library functions to interact with its distributed topic store.