---
slug: what-is-pub-sub
title: "What Is Publisher Subscriber Model?"
description: "Explore the Publisher/Subscriber (Pub/Sub) model in-depth, from its fundamental concepts to dynamic scaling, practical implementation using PyPubSub, and understanding its place in modern communication architectures."
authors: ["John Mueller"]
contributors: ["John Mueller"]
published: 2023-08-08
modified: 2024-05-14
keywords: ['Publisher/Subscriber model', 'Messaging patterns', 'Message queuing vs. Pub/Sub', 'Pub/Sub benefits and limitations']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[PyPubSub](https://pypubsub.readthedocs.io/en/v4.0.3/)'
- '[Pub/sub Basic Setup](https://pypubsub.readthedocs.io/en/v4.0.3/installation.html)'
- '[Message Queuing](https://www.baeldung.com/pub-sub-vs-message-queues)'
- '[IoT Edge Connect API](https://techdocs.akamai.com/iot-edge-connect/reference/api)'
- '[Firebase Realtime Database](https://firebase.google.com/docs/database)'
- '[Google Pub/Sub](https://cloud.google.com/pubsub)'
---

## Introduction

The concept of the publisher/subscriber (pub/sub) model is not new. It represents the best way for a producer, or publisher, of an information source, to communicate with an information consumer, the subscriber. This mirrors the functioning of newspapers and magazines. A publisher produces a message that contains a topic, for example, headings in newspapers, and associated content, like the associated newspaper text. Clients subscribe to the messages based on the topics or the content, or sometimes both. Unlike a newspaper, the client gets only the content that it wants. Similar to how newspapers are unaware of their readers, the publisher in the pub/sub model has no idea of which clients are getting what content. There is no direct coupling involved, which is why this particular pattern is so useful in microservice applications. In addition, communication (as with a newspaper) is asynchronous, which tends toward a more scalable solution than synchronous communication. This model is used extensively on the Internet using newer programming languages and making it possible to do much more with pub/sub than before. Using cloud-based techniques, publishers can communicate with unknown subscribers at any time and any place.

## Why Is Pub/Sub Important and to Whom?

Pub/sub is about communication, so anytime you need to create an environment where one entity outputs data to be picked up by several entities at a later time, you have a pub/sub environment. Pub/sub sees business uses in all sorts of data communication needs, streaming analytics, and task queues. In task environments, two or more worker services can access the queue to select the next task in line and perform these tasks in parallel, leading to high efficiencies and significant scalability. The publisher operates in an environment where the task is essentially forgotten once it is sent to the queue.

It’s important to think outside the box with pub/sub. For example, an application can act as a publisher of events, even when it has multiple users. The interaction with an app generates events that are handled by subscriber services on the back end. The results are sent back to the user as they’re completed. Users can also act as subscribers by requesting updates on tasks, events, or other forms of data generation by a third party. In fact, it can go further than a simple one-to-one setup with IoT devices, or sensors, sending data to a third party using pub/sub, who accumulates the information, generates events based on it, and then sends the result to a user.

## How Is Pub/Sub Different From Other Messaging Services?

Modern pub/sub configurations differ from earlier [message queuing](https://www.baeldung.com/pub-sub-vs-message-queues) and event broker technologies in several ways to accommodate new realities imposed by the internet and significantly larger systems where the participants may not even know each other. A pub/sub setup may place messages in a message broker or on an event bus to distribute and optionally prioritize the messages, but this isn’t the same as solely relying on a message queue or event broker configuration.

### Understanding the Pub/Sub Usage Types

There are a number of pub/sub usage types and they each have different products supporting them. This list provides a quick overview of the most common usage types, or environments, and provides a few ideas on which products support them:

-   **Sensor/device-to-service**: A device, such as an Internet of Things (IoT) device, communicates with a service. The device sends data and doesn’t make any requests. The data is sent without any sort of verification that it has reached its destination because the data remains in the message queue until removed by the service or overwritten by newer data. A product that interacts with IoT devices is [IoT Edge Connect API](https://techdocs.akamai.com/iot-edge-connect/reference/api).

-   **Client/Server**: A client (requestor), normally a user, sends a request to a server, which generally results in a response. Products like [MogoDB Atlas](https://www.mongodb.com/atlas/database), [Firebase Realtime Database](https://firebase.google.com/docs/database), and [Amazon Redshift](https://aws.amazon.com/redshift/) provide a cloud-based version with updated features.

-   **Service-to-service**: Two services exchange messages to provide a queue of requests for each service to process in a type of peer interaction that doesn’t have a user element. This form of pub/sub often requires the publisher (the requestor) to provide monitoring, as is the case with [Apache Kafka](https://kafka.apache.org/), [IBM MQ](https://www.ibm.com/products/mq), and [Google Pub/Sub](https://cloud.google.com/pubsub).

-   **Queued tasking**: The form of pub/sub involves three components: the task generator, task manager, and the worker. All three components can appear in the same application, but the task manager is generally a separate service, such as [Trello](https://trello.com/), [monday.com](https://monday.com/), and [Todoist](https://todoist.com/). An application or user creates tasks that are then queued and managed by the task manager and performed by the worker.

-   **Service-to-client**: The pub/sub architecture also lends itself to keeping a client apprised of external events or receiving informational updates. Most often, the communication takes the form of a dashboard that allows a person to monitor a server or service as is done with products like [Akamai Connected Cloud](https://www.akamai.com/), [Microsoft Azure](https://azure.microsoft.com/en-us), and [Amazon Web Services](https://aws.amazon.com/). However, there is no real limit on how a publisher can interact with a subscriber through a queue to pass data of any sort.

### Interacting With Other Services

Many communication technologies are dedicated solely to communication. A pub/sub setup can interact with other kinds of services to provide additional information as part of communication or to instigate the startup of additional tasks. Categories of these other types of interaction include:

-   Data management
-   Data processing
-   System monitoring
-   Administrator alerting
-   Event logging
-   Authorization/authentication
-   Connectivity to other APIs
-   Workflow management


### Dynamic vs Static Scaling

Modern pub/sub setups rely on dynamic scaling, whereas older configurations used static scaling. The difference is that with an older system, the system was set up and configured to accommodate a specific number of connections, even if all those connections weren’t being used at a particular time. This means that there weren’t enough connections during peak request times causing delays, and too many connections during quieter times wasting money and resources. A dynamic setup automatically resizes itself to meet the needs of the moment, which creates a flexible, cost-saving environment with low latency.

However, the scaling is dependent on the system on which pub/sub runs and the kinds of connections required. A pub/sub configuration can still experience load surges when there is a great deal of traffic, and slowdowns until the underlying system dynamically scales to handle the increased traffic. The use of message queuing to hold excess messages provides a caching effect to help deal with the load better, but it’s still best not to expect a precise quality of service because a large setup is subject to performance issues.

## Working With Pub/Sub

This section uses a third-party Pub/Sub library called [PyPubSub](https://pypubsub.readthedocs.io/en/v4.0.3/), which allows you to create and use basic pub/sub setups. It relies on a [basic setup](https://pypubsub.readthedocs.io/en/v4.0.3/installation.html), rather than using the longer version on the [GitHub](https://github.com/Humbedooh/pypubsub) site, which can prove error-prone, but may provide you with additional flexibility when working with your own code.

### Install the Required Software

To install PyPubSub, open a terminal window and connect to your Linode. The example is using an Ubuntu 22.04 LTS configuration with Python 3.9.

1.  Type `sudo apt update` and press **Enter** to look for updates.
1.  Type ``sudo apt -y upgrade`` and press **Enter** to perform any required upgrades. At this point, you may have to close the terminal window, perform a reboot of your system, and then reopen the terminal window to ensure that any upgrades have taken effect. This avoids problems later).
1.  Type `sudo apt install -y python3-pip` and press **Enter** to install the [Package Installer for Python (PIP)](https://pip.pypa.io/en/stable/) utility.
1.  Type `pip install pypubsub` and press **Enter** to install PyPubSub. Create a Python application to test your installation.

### Create a Test Application

The test application is written in Python and is designed to demonstrate pub/sub basics using nothing more than a topic with an associated message. [PyPubSub is capable of doing a lot more](https://pypubsub.readthedocs.io/en/v4.0.3/usage/index.html), but this is a good place to begin.

```file {title="example_application.py" lang="python"}
from pubsub import pub


def listener_A(arg):
    print('Listener A receives message topic: ', arg['topic'])
    print(arg['message'])
    print()


def listener_B(arg):
    print('Listener B received message topic: ', arg['topic'])
    print(arg['message'])
    print()


# Register listeners
pub.subscribe(listener_A, 'TopicA')
pub.subscribe(listener_A, 'TopicB')
pub.subscribe(listener_B, 'TopicB')
pub.subscribe(listener_B, 'TopicC')

# Send messages to all listeners of topics
pub.sendMessage('TopicA', arg={'topic': 'A Topic',
                               'message': 'Topic A Content'})
pub.sendMessage('TopicB', arg={'topic': 'B Topic',
                               'message': 'Topic B Content'})
pub.sendMessage('TopicC', arg={'topic': 'C Topic',
                               'message': 'Topic C Content'})

```

The code comes in three parts after you import the `pubsub` library. The first part defines listeners that are part of the subscriber setup. A subscriber needs to listen to messages from the publisher. In this case, the listener will receive a topic and a message as input for each message that the publisher sends. You can create other content that contains more than just two arguments. The listener has to be generic to all messages that the publisher might send.

The second part is subscriber registration for specific message topics. The call to `pub.subscribe()` includes the name of a listener function and the topic of interest.

The third part actually sends a message using the `pub.sendMessage()`. Notice that the publisher doesn’t check for any listeners. If no one is listening, the message goes out into the ether and drops in the bit bucket. Each message posting includes the topic and its associated arguments, which are then picked up by the listener and displayed on the screen. Here is the output from this example:

```output
Listener A receives message topic:  A Topic
Topic A Content

Listener A receives message topic:  B Topic
Topic B Content

Listener B received message topic:  B Topic
Topic B Content

Listener B received message topic:  C Topic
Topic C Content

```

Each subscriber receives only the topics of interest. If the publisher sends a message to `TopicD`, no one is going to receive it. Likewise, even if a subscriber subscribes to `TopicE`, it receives nothing until the publisher actually outputs it.

## Conclusion

One consideration for using pub/sub is that it’s not a good choice for time-critical tasks, where RPC really shines. It’s problematic in an environment where the publisher must ensure that subscribers actually receive requests or data because there isn’t a completely bulletproof method to obtain receipts from the subscribers. Consequently, pub/sub has limitations, like any other strategy.

Using pub/sub requires a good design and implementation because one subscriber can request information from multiple publishers and multiple publishers can push data to a single subscriber. In most cases, a pub/sub configuration ends up being a many-to-many construct with the role of publisher and subscriber often being exchanged to allow two-way communication between participants.
