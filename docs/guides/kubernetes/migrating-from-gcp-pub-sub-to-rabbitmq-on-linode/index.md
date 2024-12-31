---
slug: migrating-from-gcp-pub-sub-to-rabbitmq-on-linode
title: "Migrating from GCP Pub/Sub to RabbitMQ on Linode"
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

Pub/Sub from the Google Cloud Platform (GCP) is a fully managed, topic-based messaging service designed for real-time, event-driven architectures. It simplifies communication between independent applications with high throughput and automatic scalability. RabbitMQ, on the other hand, is an open-source message broker with queue-based messaging that provides additional customization and control over message routing and delivery.

Developers may choose to migrate from GCP Pub/Sub to RabbitMQ to gain fine-grained control over their messaging system or to leverage features not offered by Pub/Sub, such as support for multiple protocols or advanced routing rules.

## Feature Comparison

GCP Pub/Sub and RabbitMQ share many key features in common, though there are some notable differences between the two.

| Feature | GCP Pub/Sub | RabbitMQ |
| ----- | ----- | ----- |
| **Type** | Managed messaging service | Message broker |
| **Message Model** | Pub/Sub with topics and subscriptions | Brokered queues, exchanges, and topics |
| **Management** | Fully managed by Google Cloud | Self-managed, flexible deployment options |
| **Use Cases** | Real-time event streaming, integration between cloud services | Complex messaging patterns, low-level control |
| **Scaling** | Automatic scaling | Horizontal, manual configuration often required |
| **Guaranteed Delivery** | Yes, at least once | Yes, with various modes (at least once, exactly once) |
| **Integrations** | Strong integration with GCP services, HTTP push/pull models | Various protocols (AMQP, MQTT, STOMP) |

## Deploy RabbitMQ on Linode

When migrating from GCP Pub/Sub to RabbitMQ on Linode, your requirements will dictate whether to install RabbitMQ on a single Linode Compute Instance or to pursue a larger scale, more fault tolerant environment with RabbitMQ on Kubernetes through the Linode Kubernetes Engine (LKE). Follow the appropriate guide based on your requirements:

* Deploying RabbitMQ on a Linode Compute Instance  
* Deploying RabbitMQ on Kubernetes with Linode LKE

In addition to the prerequisites needed for either of the above deployment methods, you will also need access to your Google Cloud account with sufficient permissions to work with Pub/Sub resources.

## Migrating from GCP Pub/Sub to RabbitMQ

RabbitMQ exchanges offer several different routing mechanisms: 

* **Direct exchanges** deliver messages to queues with a specific routing key.  
* **Topic exchanges** enable pattern-based routing, allowing wildcard matches.  
* **Fanout exchanges** broadcast messages to all bound queues (like GCP Pub/Sub).  
* **Header exchanges** route messages based on their headers for more nuanced filtering.

While Pub/Sub offers simplicity, scalability, and cloud-native integration, RabbitMQ provides more detailed control over routing for advanced messaging patterns.

This [example project](https://github.com/nathan-gilbert/gcp-pub-sub-example) uses Terraform to set up and enable a Flask application with notifications received from an Pub/Sub topic as well as topic subscription. 

### Assess current messaging needs

In the example project, GCP Pub/Sub provides a single topic for pushing messages. The UI displays the current subscribers to this topic—which is the single Flask app—and gives guidance on what services would need to be updated in the move to RabbitMQ. 

![][image2]

GCP provides a UI for publishing messages to all subscribers of a topic. This has a similar interface to rabbitmqadmin for command line interactions with the topics.  
![][image3] 

This message will come through the example application’s logs as the following:

| 2024-11-22 04:34:33,122 \- INFO \- Received a GET request2024-11-22 04:41:29,341 \- INFO \- Received Pub/Sub message.2024-11-22 04:41:29,342 \- INFO \- Received message: Hello, World\!2024-11-22 04:41:29,342 \- INFO \- Attributes: {'key': 'value'} |
| :---- |

GCP Pub/Sub also provides a logging and monitoring system.

![][image4]

### Convert authentication to be compatible with RabbitMQ

RabbitMQ does not work with GCP IAM. As an alternative, select an authentication method that is compatible with RabbitMQ, such as username/password or SSL/TLS certificates. This guide will use username/password for authentication.

Log in to the RabbitMQ web interface as an administrator user. Create a new user through the RabbitMQ web interface. Click the **Admin** tab and go through the steps for creating a new user.

![][image5]

Add the username/password credentials for the RabbitMQ user to your Flask application.

### Create RabbitMQ exchange and queue your application

Click the **Exchanges** tab. Create a new exchange for your application. Provide a name for the exchange, and then set the exchange type. Next, click **Add exchange**.

![][image6]

Click the **Queues** tab. Create a new queue on the / virtual host. Specify a name. Then, click **Add queue**.

![][image7]

Click the name of the newly created queue in the list to bring up its details. Find the **Bindings** section. Add a new binding by setting **From exchange** to the name of the newly created exchange. Then, click **Bind**.

![][image8]

### Set permissions for RabbitMQ user

Return to the **Admin** page and click the newly created user to bring up its permission details. Set the permissions for the user as follows:

![][image9]

* The “Configure” permission allows the user to create or modify queues. By setting this to the regular expression ^$, you are prohibiting this user from making and configuration changes. Your application assumes the queue(s) it subscribes to already exist.  
* The “Write” permission allows the user to publish messages to the queue. The example application in this guide will never write to the queue, so specifying ^$ denies write access.  
* The “Read” permission, set to ^flask\_queue$, grants the user read access to the queue called “flask\_queue”, which is the queue you created above.

### Convert existing applications from GCP Pub/Sub to RabbitMQ

In the example project, the Flask application receives and decodes GCP Pub/Sub messages using standard Python libraries. In order to use RabbitMQ, be sure to carefully switch corresponding code from GCP Pub/Sub tooling to RabbitMQ.

For Python applications, RabbitMQ support comes through the [Pika](https://pypi.org/project/pika/) library, which is an AMQP provider with RabbitMQ bindings. Install Pika with the following command:

| $ apt install python3-pika |
| :---- |

Apply the code changes (in [main.tf](https://github.com/nathan-gilbert/gcp-pub-sub-example/blob/main/flask-app/main.tf), which writes the application code to /opt/app.py) required to subscribe to the newly created queue. The resulting file should look like this:

| from flask import Flaskimport pikaimport threadingimport jsonimport logginglogging.basicConfig(level=logging.INFO)app \= Flask(\_\_name\_\_)def rabbitmq\_listener():    def callback(ch, method, properties, body):        app.logger.info(body.decode('utf-8'))        \# Do other processing here as needed on messages    connection \= pika.BlockingConnection(pika.ConnectionParameters(        host="\<RABBITMQ\_HOST\>",        port=\<RABBITMQ\_AMQP\_PORT\>,        credentials=pika.PlainCredentials("\<RABBITMQ\_USERNAME\>", "\<RABBITMQ\_PASSWORD\>"),    ))    channel \= connection.channel()    channel.basic\_consume(queue="flask\_queue", on\_message\_callback=callback, auto\_ack=True)    app.logger.info("Started listening to RabbitMQ...")    channel.start\_consuming()\# Start RabbitMQ listener in a separate threadlistener\_thread \= threading.Thread(target=rabbitmq\_listener, daemon=True)listener\_thread.start()@app.route("/", methods=\["GET"\])def default\_handler():    app.logger.info("Request received.")    return "RabbitMQ Listener Active", 200if \_\_name\_\_ \== "\_\_main\_\_":    app.run(host="0.0.0.0", port=5000) |
| :---- |

Run the updated application, and logs will begin to populate the terminal:

| $ python3 app.py  \* Serving Flask app 'app' \* Debug mode: offINFO:pika.adapters.utils.connection\_workflow:Pika version 1.3.2 connecting to ('172.235.61.66', 5672\)INFO:pika.adapters.utils.io\_services\_utils:Socket connected: \<socket.socket fd=9, family=AddressFamily.AF\_INET, type\=SocketKind.SOCK\_STREAM, proto=6, laddr=('192.168.86.203', 50052), raddr=('172.235.61.66', 5672)\>...INFO:werkzeug:Press CTRL+C to quitINFO:app:Started listening to RabbitMQ... |
| :---- |

In the web UI for the RabbitMQ server, publish a message to the queue where this application has subscribed. Click the **Queues and Streams** tab and select flask\_queue from the list of queues. Enter a message payload and click **Publish message**.

![][image10]

In the log output for the running Python application, you’ll see an update with the message from the subscribed queue.

| INFO:app:Hello, Flask app\! |
| :---- |

## Production Considerations

When migrating from GCP Pub/Sub to RabbitMQ for application messaging, several considerations ought to be weighed, including authentication, security, performance, and overall architecture.

### Authentication and authorization

GCP Pub/Sub uses IAM roles and policies for authentication, while RabbitMQ supports multiple methods like username/password and OAuth2. For production-level security, RabbitMQ should use federated authentication services or certificates. Another approach is to implement access controls through RabbitMQ’s virtual hosts and user permissions, using them to match or exceed the granular controls GCP provides with IAM policies.

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

GCP Pub/Sub is directly connected to GCP Cloud Monitoring. Basic monitoring of RabbitMQ is available through the RabbitMQ Management plugin. You can also use tools such as Prometheus and Grafana for real-time performance tracking. 

### Scaling, load balancing, and availability

RabbitMQ supports clustering and federation for scaling, though it doesn’t offer auto-scaling like GCP Pub/Sub does. For load balancing, configure multiple nodes and use connection sharding.

Set up cross-node distribution by configuring queues and connections across multiple nodes to balance load. Avoid single points of failure by ensuring that both applications and consumers can failover to different nodes within the cluster.

If RabbitMQ nodes span different data centers, use the [Federation](https://www.rabbitmq.com/docs/federation) or [Shovel](https://www.rabbitmq.com/docs/shovel) plugins. Federation allows controlled mirroring across remote clusters, while Shovel enables continuous transfer of messages from one RabbitMQ instance to another—even across data centers.

Use persistent storage for durable messages and for mirrored or quorum queues that require substantial disk I/O. When taking this approach, ensure that disks have enough I/O capacity. Enable disk alarms in RabbitMQ to prevent scenarios where disk space runs out, which could lead to node crashes.

The resources below are provided to help you become familiar with RabbitMQ when migrating from GCP Pub/Sub to Linode.

## Additional Resources

* GCP  
  * [Pub/Sub Documentation](https://cloud.google.com/pubsub/docs)  
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