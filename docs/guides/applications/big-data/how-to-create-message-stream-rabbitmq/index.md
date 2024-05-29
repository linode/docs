---
slug: how-to-create-message-stream-rabbitmq
title: "How to Create a Message Stream with Rabbitmq"
description: "Discover how RabbitMQ streams optimize message handling with efficient data distribution. Explore examples, configurations, and best practices."
authors: ["John Mueller"]
contributors: ["John Mueller"]
published: 2024-05-29
keywords: ['message stream','rabbitmq queue','stream vs queue','rabbitmq vs kafka','message broker']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[RabbitMQ: Queues](https://www.rabbitmq.com/queues.html)'
---

[RabbitMQ](https://www.rabbitmq.com/) 3.9 introduces a new data structure called a *stream*. Streams and queues differ in how they work with data. A message stream is subscription-based, relying on a log file organized by topic for distribution. Meanwhile, a message queue is point-to-point. Other differences between streams and queues are described later, but the key distinction is how they manage data distribution. This difference determines the use cases in which each data structure is most effective.

It’s also important not to confuse RabbitMQ with products like [Apache Kafka](https://kafka.apache.org/), as the use cases are different. RabbitMQ provides a general purpose message broker, while Kafka provides an event streaming platform.

## Before You Begin

The examples in this guide assume that you have a RabbitMQ installation available. Follow the instructions and links below to set up a RabbitMQ instance:

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started on the Linode Platform](/docs/products/platform/get-started/) and [Create a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides. An Ubuntu 22.04 LTS, Nanode 1 GB, Shared CPU instance is sufficient for the examples in this guide.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Follow the instructions contained in the CloudSmith section of RabbitMQ's official [Installing on Debian and Ubuntu](https://www.rabbitmq.com/install-debian.html#apt-quick-start-cloudsmith) guide. It provides everything required for a basic installation, and is the setup used for this guide. To use the streams feature covered in this guide, ensure that you have RabbitMQ 3.9 or above installed on your server:

    ```command
    sudo rabbitmqctl version
    ```

1.  Also make sure to [enable](https://www.rabbitmq.com/plugins.html) the `rabbitmq_management`, `rabbitmq_management_agent`, and  `rabbitmq_web_dispatch` plugins:

    ```command
    sudo rabbitmq-plugins enable rabbitmq_management
    ```

1.  Use the following command to install `pip` if it is not already installed on your system:

    ```command
    sudo apt install python3-pip
    ```

1.  Use `pip` to install Pika for Python support:

    ```command
    python3 -m pip install pika --upgrade
    ```

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is RabbitMQ?

RabbitMQ is a distributed message broker system that relies on the Advanced Messaging Queuing Protocol (AMPQ) for secure message transfer. A producer (or publisher) creates a message, sends it to a broker, and a consumer (or subscriber) picks it up. This allows for asynchronous communication, where the producer and the consumer need not be available at the same time. Because of its asynchronous nature, the resulting setup is fast, scalable, and durable. The [RabbitMQ "Hello world!" tutorial](https://www.rabbitmq.com/tutorials/tutorial-one-python.html) delves further into how this works.

### Message Broker

The central part of RabbitMQ is the message broker, which acts as an intermediary for messaging. Think of the message broker as a kind of bulletin board. A producer puts a message on a particular bulletin board and an interested consumer takes it off. The message broker supports various kinds of queues that hold messages until a consumer picks them up. To create a message, the producer opens a connection to a particular channel, creates a queue there, and then uploads the message. Likewise, the consumer opens a connection to the same channel, locates the queue, and downloads any messages it finds.

### Queue Types

A queue is a data structure that holds messages. When working with RabbitMQ, queues are all first-in, first-out (FIFO) in nature. Like waiting in line, a message starts at the back of the queue and works its way up to the front. There are three common types of queues:

-   **Classic**: The original queue type, which is set to be deprecated in a future version because of its technical limitations. The [Classic Queue Mirroring](https://www.rabbitmq.com/ha.html) article holds more information about them, and how to migrate to the quorum queue.
-   **Quorum**: This is a [newer form of queue](https://www.rabbitmq.com/quorum-queues.html) that provides advantages in both reliability and speed over the classic queue. It relies on agreement between a majority of replicas when differences exist between individual replicas, ensuring data safety and consistency.
-   **Stream**: A stream is an augmented kind of queue that solves specific programming requirements as described throughout the rest of this guide. Essentially, it’s a non-destructive queue where the messages aren’t removed immediately after reading.

Queues can be either durable or transient. Data for a durable queue is stored on disk so that it survives a reboot. Alternatively, data for a transient queue is stored in memory whenever possible. A durable queue is the optimal choice for any need that requires a highly reliable message flow. Meanwhile, a transient queue works better for time-sensitive data where speed is valued over persistence.

Queue characteristics can be modified depending on the queue type. For example, you can set a time-to-live (TTL) value for messages in a queue so that data isn’t processed when it’s no longer relevant. These characteristics also control issues such as the maximum message length and the maximum priority that a message can have.

## Advantages and Disadvantages of Message Streams Vs Other Queue Types

Message streams have advantages and disadvantages when compared to queues. Understanding the kind of application being used is key. Some applications benefit greatly from message streams, while others do not.

### Advantages

The advantages of using streams far outweigh the disadvantages for the use cases in which streams are commonly used. For example, in a publisher/subscriber environment, trying to write code using a classic or quorum queue can be difficult. However, all of the required support is built into a stream.

#### Streams Are Non-Destructive

The most important difference between streams and queues is that streams are non-destructive. Multiple consumers can read the same message, making a stream more like a newspaper than a bulletin board.

#### Streams Do Not Need Multiple Bindings to Serve Multiple Clients

Queues require multiple bindings if you want to send the same message to multiple consumers. The reason is that once a consumer reads a message, it disappears from the queue. Consequently, each consumer requires a distinct binding to ensure receipt of its copy of the message. In contrast, messages within a stream aren’t removed, allowing multiple consumers to access the message through a single binding. This approach saves memory and other resources, and makes streams faster because the code spends less time duplicating messages.

#### Streams Can Be Accessed at Any Place in the Timeline of Messages

To make streams as useful as possible, a consumer can specify which message to read using an absolute offset or timestamp. In addition, a consumer can read the same message as many times as needed using the same approach. This ability to access specific messages anywhere in the stream reduces consumer storage needs because the consumer doesn't need to store a copy of every message.

#### Streams Are Faster than Queues

Streams use resources more efficiently than queues because you do not need to duplicate messages. In addition, streams don’t require multiple bindings to get the job done. Once a message is written to disk, it doesn’t consume any server memory, freeing up more high-speed memory for other tasks. Because of these and other optimizations, streams are incredibly fast when compared to queues. Add in the ability to slim down the application code, and the efficiencies of streams become even more apparent.

### Disadvantages

There aren’t any perfect programming solutions, just ones that work best in specific use cases. While RabbitMQ streams provide a lot of functionality, they also come with disadvantages that make them less efficient for some use cases.

#### Can Be Quite Large

Streams can keep growing indefinitely, which means that configuring one correctly is essential. RabbitMQ never removes any of the messages from a stream unless you provide stream constraints. You can [control the size of a stream](https://www.rabbitmq.com/streams.html#declaring) in two ways. The first is by using the `x-max-length-bytes` and/or `x-stream-max-segment-size-bytes` settings. Here, older messages are removed whenever adding a new message would exceed the setting parameters. The second method is by using the `x-max-age` setting to control how long the stream retains its messages. Here, when the message times out, it has to be recreated.

#### Does Not Guarantee Deliverability

It’s essential to know what an "at least once" delivery guarantee means. Streams guarantee that some consumer sees the message at least once by using a combination of publisher confirms and message de-duplication on the publisher side. However, it doesn’t guarantee that a specific consumer sees the message. This means that the consumer code must be written so that the consumer checks for *every* message. A message can also get lost midway to the consumer unless the application relies on the publisher confirm mechanism.

Streams achieve their speedy characteristics by taking some shortcuts. For example, streams don’t explicitly flush the operating system cache, which means that an uncontrolled shutdown of a server may result in data loss.

## How to Create a Message Stream with RabbitMQ

There are several options to create streams in RabbitMQ, with programmatic and plugin approaches being the most common.

### Should Streams Be Managed via RabbitMQ Core or the Plugin?

The two basic methods of managing RabbitMQ streams are using the [stream core](https://www.rabbitmq.com/streams.html) or the [stream plug-in](https://www.rabbitmq.com/stream.html). Which you use depends on how you plan to work with streams. If you plan to work mostly at the server using application code, the stream core likely works best. On the other hand, if you plan to work with clients extensively, using the stream plug-in is probably the best option. In addition, the stream plug-in provides GUI access through the management console. See the [Stream Core vs Stream Plugin](https://www.rabbitmq.com/stream-core-plugin-comparison.html) comparison for additional details.

### What Amount of Storage Should Be Reserved for a RabbitMQ Stream?

The [Can Be Quite Large](#can-be-quite-large) section discusses configuration parameters to control the storage space and message persistence in a stream. You must allocate enough storage space for the message you plan to store. Keep in mind that old messages remain until they expire or are replaces by newer ones in the queue. Ensure you set up [free space alarms](https://www.rabbitmq.com/disk-alarms.html) when configuring RabbitMQ. This allows you to address messaging issues proactively, rather than waiting for an application to crash.

### Example

An easy way to understand how streams work is to create a simple application consisting of a producer and a consumer.

1.  First, create a python file to house the producer code:

    ```command
    nano producer.py
    ```

    Give the file the following contents:

    ```file {title="producer.py" lang="python"}
    import pika

    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()

    channel.queue_declare(queue='test_stream',
                          durable=True,
                          arguments={"x-queue-type": "stream"})

    channel.basic_publish(exchange='',
                          routing_key='test_stream',
                          body='This is a test message.')

    print("Sent message to stream.")

    connection.close()
    ```

    The producer code begins by creating a connection to RabbitMQ. It uses this connection to create the `test_stream` queue. You must define the queue as durable, or you’ll receive an error message. Setting the `x-queue-type` argument to `stream` converts the queue it into a stream, which you can verify through the RabbitMQ console.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Now create a second python file to house the consumer code:

    ```command
    nano consumer.py
    ```

    Give the file the following contents:

    ```file {title="consumer.py" lang="python"}
    import pika

    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()

    channel.queue_declare(queue='test_stream',
                          durable=True,
                          arguments={"x-queue-type": "stream"})

    def print_msg(msg):
        print(f"Received {msg}")

    def callback(ch, method, properties, body):
        print_msg(body)

    channel.basic_qos(prefetch_count=100)

    channel.basic_consume('test_stream', callback)

    channel.start_consuming()

    connection.close()
    ```

    The consumer code receives any new messages sent to the stream. Additional code is needed to access messages that are already in the stream, but this serves as a good starting point. It begins by establishing a connection and then accessing a stream. As with sending messages, ensure that the stream is defined as durable and includes the correct arguments. The application sets the prefetch count using `prefetch_count=100`. This setting designates how many messages a consumer retrieves from the stream at once. Consumers can process a batch of messages in local memory before having to make another round trip to the server. The call to `channel.basic_consume()` defines what to do with messages upon arrival. Once the application is setup, it calls `channel.start_consuming()` to continuously process messages until it receives a keyboard interrupt (<kbd>CTRL</kbd>+<kbd>C</kbd>).

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  To test the application, first run the consumer code:

    ```command
    python3 consumer.py
    ```

    It should display no output, as it is simply awaiting new messages.

1.  Now open a second terminal window and run the producer code:

    ```command
    python3 producer.py
    ```

    The producer terminal should display a success message:

    ```output
    Sent message to stream.
    ```

    Meanwhile, the consumer terminal should display the producer's test message:

    ```output
    Received b'This is a test message.'
    ```

1.  When done, press <kbd>CTRL</kbd>+<kbd>C</kbd> to stop the consumer code.

## Conclusion

RabbitMQ streams open up a wealth of possibilities for working with RabbitMQ. Most important is that they reduce the amount of work required to implement certain types of programming situations. Using streams is safe, simple, and consistent, eliminating the need for developers to reinvent the wheel whenever a non-destructive queue is needed.