---
slug: migrating-from-aws-sns-to-rabbitmq-on-linode
title: "Migrating from AWS SNS to RabbitMQ on Linode"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-12-30
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide walks through how to migrate standard AWS SNS messaging service usage to RabbitMQ running on a Linode instance.

AWS Simple Notification Service (SNS) is a fully managed, topic-based messaging service typically used for event-driven architectures and decoupled application designs. RabbitMQ is an open-source message broker with queue-based messaging that offers additional customization and control over message routing and delivery patterns.

Developers may choose to migrate from AWS SMS to RabbitMQ when they want fine-grained control over their messaging system or need features not supported by SNS, such as advanced routing rules or multi-protocol support.

## Feature Comparison

AWS SNS and RabbitMQ serve similar purposes, but they have their differences.

| Feature | AWS SNS | RabbitMQ |
| ----- | ----- | ----- |
| **Architecture** | Topic-based (pub/sub model) | Queue-based (AMQP standard; pub/sub and point-to-point) |
| **Message Routing** | Uses topics; broadcasts messages to all subscribers | Flexible routing via exchanges and queues |
| **Delivery Semantics** | Best-effort, at-least-once delivery | Configurable (acknowledgments, at-most-once, at-least-once, exactly-once) |
| **Durability** | No message persistence; ephemeral by default | Configurable persistence; durable queues supported |
| **Message Ordering** | Generally unordered | FIFO and priority queues supported |
| **Supported Protocols** | HTTP/S, email, SMS, mobile push, Lambda | AMQP, MQTT, STOMP, HTTP |
| **Use Cases** | Notifications, alerts, fanout messaging | Complex workflows, task queues, custom routing |
| **Scaling** | Auto-scaling with AWS infrastructure | Can scale but may need manual clustering and tuning |
| **Managed Service** | Fully managed (AWS handles scaling and maintenance) | Self-hosted or managed (like CloudAMQP) but requires more operational management |
| **Integration with AWS** | Native AWS integration, seamless with services like Lambda | Integrates but requires custom setup on AWS |

## Deploy RabbitMQ on Linode

When migrating from AWS SNS to RabbitMQ on Linode, your requirements will dictate whether to install RabbitMQ on a single Linode Compute Instance or to pursue a larger scale, more fault tolerant environment with RabbitMQ on Kubernetes through the Linode Kubernetes Engine (LKE). Follow the appropriate guide based on your requirements:

* Deploying RabbitMQ on a Linode Compute Instance  
* Deploying RabbitMQ on Kubernetes with Linode LKE

In addition to the prerequisites needed for either of the above deployment methods, you will also need access to your AWS account with sufficient permissions to work with SNS topics.

## Migrate from AWS SNS to RabbitMQ

RabbitMQ exchanges offer several different routing mechanisms: 

* **Direct exchanges** deliver messages to queues with a specific routing key.  
* **Topic exchanges** enable pattern-based routing, allowing wildcard matches.  
* **Fanout exchanges** broadcast messages to all bound queues (like SNS).  
* **Header exchanges** route messages based on their headers for more nuanced filtering.

This [example project](https://github.com/nathan-gilbert/rabbitmq-migrations) uses Terraform to set up and enable a Flask application with notifications received from an SNS topic as well as topic subscription. 

### Assess current messaging needs

In the example project, AWS SNS provides multiple topics for publishing messages. The AWS Console UI displays the current subscribers for each topic. This provides guidance on which services will need to be updated after migrating to RabbitMQ. 

![][image2]

AWS provides a UI for publishing messages to all subscribers of a topic. This has a similar interface to rabbitmqadmin for command line interactions with the topics.

![][image3]

This message will come through the example application’s logs as the following:

| INFO:app:NotificationINFO:app:Received SNS message: This is a test message\! |
| :---- |

### Convert authentication to be compatible with RabbitMQ

RabbitMQ does not work with AWS IAM. As an alternative, select an authentication method that is compatible with RabbitMQ, such as username/password or SSL/TLS certificates. This guide will use username/password for authentication.

Log in to the RabbitMQ web interface as an administrator user. Create a new user through the RabbitMQ web interface. Click the **Admin** tab and go through the steps for creating a new user.

![][image4]

Add the username/password credentials for the RabbitMQ user to your Flask application.

### Create RabbitMQ exchange and queue your application

Click the **Exchanges** tab. Create a new exchange for your application. Provide a name for the exchange, and then set the exchange type. Next, click **Add exchange**.

![][image5]

Click the **Queues** tab. Create a new queue on the / virtual host. Specify a name. Then, click **Add queue**.

![][image6]

Click the name of the newly created queue in the list to bring up its details. Find the **Bindings** section. Add a new binding by setting **From exchange** to the name of the newly created exchange. Then, click **Bind**.

![][image7]

### Set permissions for RabbitMQ user

Return to the **Admin** page and click the newly created user to bring up its permission details. Set the permissions for the user as follows:

![][image8]

* The “Configure” permission allows the user to create or modify queues. By setting this to the regular expression ^$, you are prohibiting this user from making and configuration changes. Your application assumes the queue(s) it subscribes to already exist.  
* The “Write” permission allows the user to publish messages to the queue. The example application in this guide will never write to the queue, so specifying ^$ denies write access.  
* The “Read” permission, set to ^flask\_queue$, grants the user read access to the queue called “flask\_queue”, which is the queue you created above.

### Convert existing applications from AWS SNS to RabbitMQ

In the example project, the application communicates directly to AWS SNS using the boto3 library provided by AWS. In order to use RabbitMQ, be sure to carefully switch corresponding code from AWS tooling to RabbitMQ. 

For Python applications, RabbitMQ support comes through the [Pika](https://pypi.org/project/pika/) library, which is an AMQP provider with RabbitMQ bindings. Install Pika with the following command:

| $ apt install python3-pika |
| :---- |

Apply the code changes (in [app.py](https://github.com/nathan-gilbert/rabbitmq-migrations/blob/main/rabbitmq-changes/app.py)) required to subscribe to the newly created queue. The resulting file should look like this:

| from flask import Flaskimport pikaimport threadingimport jsonimport logginglogging.basicConfig(level=logging.INFO)app \= Flask(\_\_name\_\_)def rabbitmq\_listener():    def callback(ch, method, properties, body):        app.logger.info(body.decode('utf-8'))        \# Do other processing here as needed on messages    connection \= pika.BlockingConnection(pika.ConnectionParameters(        host="\<RABBITMQ\_HOST\>",        port=\<RABBITMQ\_AMQP\_PORT\>,        credentials=pika.PlainCredentials("\<RABBITMQ\_USERNAME\>", "\<RABBITMQ\_PASSWORD\>"),    ))    channel \= connection.channel()    channel.basic\_consume(queue="flask\_queue", on\_message\_callback=callback, auto\_ack=True)    app.logger.info("Started listening to RabbitMQ...")    channel.start\_consuming()\# Start RabbitMQ listener in a separate threadlistener\_thread \= threading.Thread(target=rabbitmq\_listener, daemon=True)listener\_thread.start()@app.route("/", methods=\["GET"\])def default\_handler():    app.logger.info("Request received.")    return "RabbitMQ Listener Active", 200if \_\_name\_\_ \== "\_\_main\_\_":    app.run(host="0.0.0.0", port=5000) |
| :---- |

Run the updated application, and logs will begin to populate the terminal:

| $ python3 app.py  \* Serving Flask app 'app' \* Debug mode: offINFO:pika.adapters.utils.connection\_workflow:Pika version 1.3.2 connecting to ('172.235.61.66', 5672\)INFO:pika.adapters.utils.io\_services\_utils:Socket connected: \<socket.socket fd=9, family=AddressFamily.AF\_INET, type\=SocketKind.SOCK\_STREAM, proto=6, laddr=('192.168.86.203', 50052), raddr=('172.235.61.66', 5672)\>...INFO:werkzeug:Press CTRL+C to quitINFO:app:Started listening to RabbitMQ... |
| :---- |

In the web UI for the RabbitMQ server, publish a message to the queue where this application has subscribed. Click the **Queues and Streams** tab and select flask\_queue from the list of queues. Enter a message payload and click **Publish message**.

![][image9]

In the log output for the running Python application, you’ll see an update with the message from the subscribed queue.

| INFO:app:Hello, Flask app\! |
| :---- |

## Production Considerations

When migrating from AWS SNS to RabbitMQ for application messaging, several considerations ought to be weighed, including authentication, security, performance, and overall architecture.

### Authentication and authorization

AWS SNS typically uses IAM roles and policies for authentication, while RabbitMQ supports multiple methods like username/password and OAuth2. For production-level security, RabbitMQ should use federated authentication services or certificates. Another approach is to implement access controls through RabbitMQ’s virtual hosts and user permissions, using them to match or exceed the granular controls SNS provides with IAM policies.

### Message reliability, durability, and delivery

RabbitMQ, by default, offers persistent storage for messages. You can also configure queues to be durable, which means they will survive a RabbitMQ broker restart.

RabbitMQ offers different delivery guarantees that help control message reliability and how it behaves under failure scenarios.

* ***At-least-once delivery*** is the default delivery model in RabbitMQ, where messages are delivered to consumers at least once.  
* ***At-most-once delivery*** removes messages from the queue as soon as they are sent to the consumer. This mode is generally suitable for non-critical or low-stakes messages.

To handle messages that can’t be processed after multiple retries, configure a Dead-Letter Exchange (DLX). A DLX redirects unprocessed messages to a separate queue after exceeding the configured retry limit. A DLX is a best practice to mitigate temporary outages or network errors that cause message failures, retrying delivery without affecting primary processing. Failed messages can be inspected or logged for later analysis after landing the DLX.

Adopt the following best practices for delivery and ordering:

* When ordering is critical, use a single consumer per queue to avoid parallel consumption.  
* For messages with critical processing requirements, implement deduplication to avoid issues from at-least-once delivery.  
* Use manual acknowledgment to control when messages are marked as processed and ensure that RabbitMQ can deliver unacknowledged messages again.  
* Use DLX for retry handling and for separating failed messages for special processing, preventing interference with successful message flows.

### Monitoring and observability

SNS includes AWS CloudWatch metrics out of the box. Basic monitoring of RabbitMQ is available through the RabbitMQ Management plugin. You can also use tools such as Prometheus and Grafana for real-time performance tracking. 

### Scaling, load balancing, and availability

RabbitMQ supports clustering and federation for scaling, though it doesn’t offer auto-scaling like SNS does. For load balancing, configure multiple nodes and use connection sharding.

Set up cross-node distribution by configuring queues and connections across multiple nodes to balance load. Avoid single points of failure by ensuring that both applications and consumers can failover to different nodes within the cluster.

If RabbitMQ nodes span different data centers, use the [Federation](https://www.rabbitmq.com/docs/federation) or [Shovel](https://www.rabbitmq.com/docs/shovel) plugins. Federation allows controlled mirroring across remote clusters, while Shovel enables continuous transfer of messages from one RabbitMQ instance to another—even across data centers.

Use persistent storage for durable messages and for mirrored or quorum queues that require substantial disk I/O. When taking this approach, ensure that disks have enough I/O capacity. Enable disk alarms in RabbitMQ to prevent scenarios where disk space runs out, which could lead to node crashes.

The resources below are provided to help you become familiar with RabbitMQ when migrating from AWS SNS to Linode.

## Additional Resources

* AWS  
  * [SNS Documentation](https://docs.aws.amazon.com/sns/)  
* RabbitMQ  
  * [Configuration Documentation](https://www.rabbitmq.com/docs/configure)  
  * [Deployment Checklist](https://www.rabbitmq.com/docs/production-checklist)  
  * [Plugins](https://www.rabbitmq.com/docs/plugins)  
  * [Management CLI](https://www.rabbitmq.com/docs/management-cli)  
  * [Pub/Sub Tutorial](https://www.rabbitmq.com/tutorials/tutorial-three-python)  
* Linode  
  * [Documentation](https://www.linode.com/docs/)  
  * [Linode Cloud Manager](https://cloud.linode.com/)  
  * Deploying RabbitMQ on a Linode Compute Instance  
  * Deploying RabbitMQ on Kubernetes with Linode LKE  
  * [RabbitMQ Linode Marketplace App](https://www.linode.com/marketplace/apps/linode/rabbitmq/)