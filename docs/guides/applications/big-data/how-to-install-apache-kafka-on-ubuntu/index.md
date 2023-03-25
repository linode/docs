---
slug: how-to-install-apache-kafka-on-ubuntu
description: "Learn how to install and configure Apache Kafka, a popular open-source platform for stream management and processing first developed by LinkedIn."
keywords: ['Apache','Kafka','streaming','processing','events']
tags: ['ubuntu', 'kafka', 'apache']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-11
modified_by:
  name: Linode
title: "Install and Configure Apache Kafka on Ubuntu"
title_meta: "How to Install Apache Kafka on Ubuntu"
external_resources:
- '[Apache Kafka](https://kafka.apache.org/)'
- '[Apache Kafka Downloads](https://kafka.apache.org/downloads)'
- '[Apache Kafka Authentication page](https://www.apache.org/info/verification.html)'
authors: ["Jeff Novotny"]
tags: ["saas"]
---

[*Apache Kafka*](https://kafka.apache.org/), often known simply as Kafka, is a popular open-source platform for stream management and processing. Kafka is structured around the concept of an event. External agents, independently and asynchronously, send and receive event notifications to and from Kafka. Kafka accepts a continuous stream of events from multiple clients, stores them, and potentially forwards them to a second set of clients for further processing. It is flexible, robust, reliable, self-contained, and offers low latency along with high throughput. LinkedIn originally developed Kafka, but the Apache Software Foundation offers the current open-source iteration.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
This guide is written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## A Summary of the Apache Kafka Installation Process

A complete Kafka installation consists of the high-level steps listed below. Each step is described in a separate section. These instructions are designed for Ubuntu 20.04 but are generally valid for any Debian-based Linux distribution.

1. Install Java
1. Download and Install Apache Kafka
1. Run Kafka
1. Create a Kafka Topic
1. Write and Read Kafka Events
1. Process Data with Kafka Streams
1. Create System Files for Zookeeper and Kafka

## Install Java

You must install Java before you can use Apache Kafka. This guide explains how to install OpenJDK, an open-source version of Java.

1. Update your Ubuntu packages.

        sudo apt update

1. Install OpenJDK with `apt`.

        sudo apt install openjdk-11-jdk

1. Confirm you installed the expected version of Java.

        java -version

   Java returns some basic information about the installation. The information can vary based on the version you have installed.

    {{< output >}}
openjdk version "11.0.9.1" 2020-11-04
OpenJDK Runtime Environment (build 11.0.9.1+1-Ubuntu-0ubuntu1.20.04)
OpenJDK 64-Bit Server VM (build 11.0.9.1+1-Ubuntu-0ubuntu1.20.04, mixed mode, sharing)
{{< /output >}}

## Download and Install Apache Kafka

Tar archives for Apache Kafka can be downloaded directly from the Apache Site and installed with the process outlined in this section. The name of the Kafka download varies based on the release version. Substitute the name of your own file wherever you see `kafka_2.13-2.7.0.tgz`.

1. Navigate to the [Apache Kafka Downloads page](https://kafka.apache.org/downloads) and choose the Kafka release you want. We recommend choosing the latest version, which is currently Apache Kafka 2.7. This link takes you to a landing page where you can use either HTTP or FTP to download the tar file.

1. If you downloaded the software onto a different computer than the host, transfer the Apache Kafka files to the host via `scp`, `ftp`, or another file transfer method. Replace the `user` and `yourhost` values with your user name and host IP address:

        scp /localpath/kafka_2.13-2.7.0.tgz user@192.0.2.0:~/
    {{< note respectIndent=false >}}
If the transfer is blocked, verify your firewall is not blocking the connection. Execute `sudo ufw allow 22/tcp` to allow `ufw` to allow `scp` transfers.
{{< /note >}}
1. (Optional) You can confirm you downloaded the file correctly with a SHA512 checksum. You can find the checksum file on the [Apache Kafka Downloads page](https://kafka.apache.org/downloads). Each release includes a link to a corresponding `sha512` file. Download this file and transfer it to your Kafka host using `scp`. Place the checksum file in the same directory as your tar file.
    Execute the following command to generate a checksum for the tar file:

        gpg --print-md SHA512 kafka_2.13-2.7.0.tgz

    Compare the output from this command against the contents of the `SHA512` file. The two checksums should match. This step does not confirm the authenticity of the file, only its validity. The checksum output has the following format:
    {{< output >}}
kafka_2.13-2.7.0.tgz: F3DD1FD8 8766D915 0D3D395B 285BFA75 F5B89A83 58223814
                      90C8428E 6E568889 054DDB5F ADA1EB63 613A6441 989151BC
                      7C7D6CDE 16A871C6 674B909C 4EDD4E28
{{< /output >}}
1. For extra security, confirm the file is signed. Download the `.asc` file and the signing keys associated with the release. You can find these files on the [Apache Kafka Downloads page](https://kafka.apache.org/downloads). The link to the `KEYS` file is located at the top of the page. Each release includes a link to its `asc` file. Download these files and transfer them to your Kafka host using `scp`. Place these files in the same directory as your tar file.

    - Import the keys from the `KEYS` file. This installs the entire key set.

          gpg --import KEYS

    - Use `gpg` to verify the signature.

          gpg --verify kafka_2.13-2.7.0.tgz.asc  kafka_2.13-2.7.0.tgz

    - The output should list the actual RSA key and the person who signed it.
{{< output >}}
gpg: Signature made Wed Dec 16 14:03:36 2020 UTC
gpg:                using RSA key DFB5ABA9CD50A02B5C2A511662A9813636302260
gpg:                issuer "bbejeck@apache.org"
gpg: Good signature from "Bill Bejeck (CODE SIGNING KEY) <bbejeck@apache.org>" [unknown]
    {{< /output >}}
    {{< note respectIndent=false >}}
`Gpg` might warn you the "key is not certified with a trusted signature". Unfortunately, there is no easy way to confirm the authenticity of the signer, and for most deployments, this is not necessary. For unqualified authentication for high-security deployments, follow the steps for *Validating Authenticity of a Key* on the [Apache Kafka Authentication page](https://www.apache.org/info/verification.html).
{{< /note >}}

1. Extract the files with the `tar` utility. After the extraction process is complete, either delete the archive or store it in a secure place elsewhere on your system.

        tar -zxvf kafka_2.13-2.7.0.tgz
1. (Optional) Create a new centralized directory for Kafka and move the extracted files to this new Kafka home directory.

        sudo mkdir /home/kafka
        sudo mv kafka_2.13-2.7.0 /home/kafka

## Run Kafka

Kafka can be launched directly from the command line. You must launch the Zookeeper module before running Kafka.

1. Review the settings contained in the `kafka_2.13-2.7.0/config/server.properties` file within your Kafka directory. For now, the default settings are fine. But we recommend you set the `delete.topic.enable` attribute to `true` at the end of the file. This allows you to delete any topics you might create during testing.
    {{< file "/home/kafka/kafka_2.13-2.7.0/config/server.properties" >}}
...
delete.topic.enable = true
    {{< /file >}}
1. Change to the Kafka home directory and start Zookeeper.

        cd /home/kafka/kafka_2.13-2.7.0/
        bin/zookeeper-server-start.sh config/zookeeper.properties

    {{< note respectIndent=false >}}
Leave all settings in `Zookeeper.properties` at the defaults for most deployments.
{{< /note >}}
1. Open a new console session and launch Kafka.

        cd /home/kafka/kafka_2.13-2.7.0/
        bin/kafka-server-start.sh config/server.properties

## Create a Kafka Topic

Before you can send any events to Kafka, you must create a topic to contain the events. An explanation of topics can be found in [Linode's Introduction to Kafka](/docs/guides/what-is-apache-kafka).

1. Open a new console session.

1. Change the directory to your Kafka directory and create a new topic named `test-events`.

        cd /home/kafka/kafka_2.13-2.7.0/
        bin/kafka-topics.sh --create --topic test-events --bootstrap-server localhost:9092

   Kafka confirms the topic has been created.

    {{< output >}}
Created topic test-events.
    {{< /output >}}
1. Generate a list of all the topics on the cluster with the `--list` option. You should see `test-events` listed in the output.

        bin/kafka-topics.sh --list --zookeeper localhost:2181
1. Use the `describe` flag to display all information about the new topic.

        bin/kafka-topics.sh --describe --topic test-events --zookeeper localhost:2181
    Kafka returns a summary of the topic, including the number of partitions and the replication factor.
    {{< output >}}
CTopic: test-events PartitionCount: 1 ReplicationFactor: 1 Configs:
Topic: test-events Partition: 0 Leader: 0 Replicas: 0 Isr: 0
    {{< /output >}}

## Writing and Reading Kafka Events

Kafka's command-line interface allows you to quickly test out the new topic. Use the API to create a Producer and write some events into the topic. Then, create a consumer and read the events you wrote.

1. Open a new console session for the producer and change the directory to the Kafka root directory.

        cd /home/kafka/kafka_2.13-2.7.0/

1. Configure a producer and specify a topic for its events. You are not creating any events yet, only a client with the ability to send events. Kafka returns a prompt `>` indicating the producer is ready.

        bin/kafka-console-producer.sh --topic test-events --bootstrap-server localhost:9092
1. Send a few key-value pairs to Kafka. Separate the keys and values with a `:`. You can choose to write messages with different keys or with the same key. If you do not specify a key, and only specify a value, the event is assigned a NULL key.

        >key1: This is event 1
        >key2: This is event 2
        >key1: This is event 3
1. Open a new console session to run the consumer and change the directory to the root Kafka directory.

        cd /home/kafka/kafka_2.13-2.7.0/
1. Create the consumer, specifying the `test-events` topic it should read from. The `--from-beginning` flag indicates it should read all events starting from the beginning of the topic.

        bin/kafka-console-consumer.sh --topic test-events --from-beginning --bootstrap-server localhost:9092
    {{< note respectIndent=false >}}
Kafka's Consumer API provides options to format the incoming events. Run the following command to view the full list.

    bin/kafka-console-consumer.sh
{{< /note >}}
1. The consumer immediately polls Kafka for any outstanding events in the topic and displays them onscreen. You should be able to see all the events you sent earlier.

    {{< output >}}
key1: This is event 1
key2: This is event 2
key1: This is event 3
    {{< /output >}}
1. Return to the producer console (the producer should still be running) and generate another new event.

        >key2: This is event 4
1. The event immediately appears in the consumer console.

    {{< output >}}
key2: This is event 4
    {{< /output >}}
1. Stop the producer or consumer anytime you like with a `Ctrl-C` command.
    {{< note respectIndent=false >}}
Events are durable and can be read as many times as you want. You can create a second consumer for the same topic and have it read all the same events.
{{< /note >}}

## Process Data with Kafka Streams

Kafka Streams is a library for performing real-time transformations and analysis on a stream. A Kafka Streams application typically acts as both a consumer and a producer. It polls a topic for new events, processes the data, and transmits its output as events to a second topic. Other applications are consumers of this second topic. Kafka Streams is explained in [Linode's Introduction to Apache Kafka](/docs/guides/what-is-apache-kafka).

You can use the `WordCountDemo` Java application included with Kafka Streams to run a quick demo. `WordCountDemo` consumes `streams-plaintext-input` events. It parses and processes the lines, and stores the words and counts in a table. The updated word counts are converted to a stream of events and sent to the `streams-plaintext-input` topic. The entire file is included below.

{{< file "WordCountDemo.java" java >}}
// Serializers/deserializers (serde) for String and Long types
final Serde<String> stringSerde = Serdes.String();
final Serde<Long> longSerde = Serdes.Long();

// Construct a `KStream` from the input topic "streams-plaintext-input", where message values
// represent lines of text (for the sake of this example, we ignore whatever may be stored
// in the message keys).
KStream<String, String> textLines = builder.stream(
      "streams-plaintext-input",
      Consumed.with(stringSerde, stringSerde)
    );

KTable<String, Long> wordCounts = textLines
    // Split each text line, by whitespace, into words.
    .flatMapValues(value -> Arrays.asList(value.toLowerCase().split("\\W+")))

    // Group the text words as message keys
    .groupBy((key, value) -> value)

    // Count the occurrences of each word (message key).
    .count();

// Store the running counts as a changelog stream to the output topic.
wordCounts.toStream().to("streams-wordcount-output", Produced.with(Serdes.String(), Serdes.Long()));
{{< /file >}}

1. Create a topic on the Kafka cluster to store the sample word count data.

        cd /home/kafka/kafka_2.13-2.7.0/
        bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --topic streams-plaintext-input

    Kafka confirms it has created the topic.
1. Create a second topic to store the output of the Kafka Streams application. Set the cleanup policy to compact entries, so only the updated word counts are stored.

        bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --topic streams-wordcount-output --config cleanup.policy=compact
    Kafka again confirms it has created the topic.
1. Run the `WordCountDemo` application.

        bin/kafka-run-class.sh org.apache.kafka.streams.examples.wordcount.WordCountDemo

1. Launch a producer to send test data to the WordCountDemo stream as `streams-plaintext-input` events.

        bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic streams-plaintext-input

1. Create a consumer to listen to the `streams-wordcount-output` stream. This stream contains the updated results of the `WordCountDemo` application. Set the formatting properties as follows to create more legible output.

        bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic streams-wordcount-output --from-beginning --formatter kafka.tools.DefaultMessageFormatter --property print.key=true --property print.value=true --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer

1. Enter some test data at the producer prompt.

        This is not the end

1. Verify the word counts are displayed in the consumer window.
   {{< output >}}
this   1
is 1
not 1
the 1
end 1
   {{< /output >}}
1. Use the producer to write more test input.

        The end of the line
1. Review the new output from the consumer. Notice how the word counts have been updated.
   {{< output >}}
the 2
end 2
of 1
the 3
line   1
   {{< /output >}}
1. When you are finished with the demo, use `Ctrl-C` to stop the producer, the consumer, and the WordCountDemo application.

## Create System Files for Zookeeper and Kafka

Until now, you have been starting Zookeeper and Kafka from the command line inside the Kafka directory. This is perfectly acceptable, but it is much easier to create entries for them inside `/etc/systemd/system/` and start them with `systemctl enable`.

1. Create a system file for Zookeeper called `/etc/systemd/system/zookeeper.service`.

        sudo vi /etc/systemd/system/zookeeper.service

1. Edit the file and add the following information. Use the location of your Kafka directory in the path names.

    {{< file "/etc/systemd/system/zookeeper.service" >}}
[Unit]
Description=Apache Zookeeper Server
Requires=network.target remote-fs.target
After=network.target remote-fs.target

[Service]
Type=simple
ExecStart=/home/kafka/kafka_2.13-2.7.0/bin/zookeeper-server-start.sh /home/kafka/kafka_2.13-2.7.0/config/zookeeper.properties
ExecStop=/home/kafka/kafka_2.13-2.7.0/bin/zookeeper-server-stop.sh

Restart=on-abnormal

[Install]
WantedBy=multi-user.target
{{< /file >}}

1. Create a second file for the Kafka server called `/etc/systemd/system/kafka.service`.

        sudo vi /etc/systemd/system/kafka.service

1. Edit the file and add the following information. Verify the full path to your Java application and enter it as the `JAVA_HOME` path.

    {{< file "/etc/systemd/system/kafka.service" >}}
[Unit]
Description=Apache Kafka Server
Requires=zookeeper.service
After=zookeeper.service

[Service]
Type=simple
Environment="JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64"
ExecStart=/home/kafka/kafka_2.13-2.7.0/bin/kafka-server-start.sh /home/kafka/kafka_2.13-2.7.0/config/server.properties
ExecStop=/home/kafka/kafka_2.13-2.7.0/bin/kafka-server-stop.sh

Restart=on-abnormal

[Install]
WantedBy=multi-user.target
{{< /file >}}

1. Reload the `systemd` daemon and start both applications.

        sudo systemctl daemon-reload
        sudo systemctl enable --now zookeeper
        sudo systemctl enable --now kafka

1. Confirm both Kafka and the Zookeeper are running as expected. Verify the status of both processes with `systemctl status`.

        sudo systemctl status kafka zookeeper
    The entries should both show as active.
    {{< output >}}
kafka.service - Apache Kafka Server
    Loaded: loaded (/etc/systemd/system/kafka.service; enabled; vendor preset: enabled)
    Active: active (running) since Thu 2021-01-21 15:13:45 UTC; 4s ago
...
    {{< /output >}}

## Shut Down the Kafka Environment

When you are finished with Kafka, we recommend you gracefully shut down all components and delete all unnecessary logs.

1. Shut down any Kafka consumers and producers and any Kafka Streams applications with a `ctrl-C` command.

1. Shut down Kafka and then Zookeeper with `systemctl stop` commands. If you did not register your Kafka application with the `systemd` daemon, shut them down with a `Ctrl-C` command.

        sudo systemctl stop kafka
        sudo systemctl stop zookeeper

1. Clean up any test data with the following command:

        rm -rf /tmp/kafka-logs /tmp/zookeeper
