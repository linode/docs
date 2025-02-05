---
slug: migrating-from-azure-service-bus-to-rabbitmq-on-linode
title: "Migrating from Azure Service Bus to RabbitMQ on Linode"
description: "Learn how to migrate from Azure Service Bus to RabbitMQ on Linode. Discover RabbitMQ's customizable routing and multi-protocol messaging advantages over Azure Service Bus."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-02-05
keywords: ['azure','service','bus','rabbitmq','migration','azure service bus migration','rabbitmq on linode','azure to rabbitmq','service bus rabbitmq comparison']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Azure Service Bus Documentation](https://learn.microsoft.com/en-us/azure/service-bus-messaging/)'
- '[RabbitMQ Configuration Documentation](https://www.rabbitmq.com/docs/configure)'
- '[RabbitMQ Deployment Checklist](https://www.rabbitmq.com/docs/production-checklist)'
- '[RabbitMQ Plugins](https://www.rabbitmq.com/docs/plugins)'
- '[RabbitMQ Management CLI](https://www.rabbitmq.com/docs/management-cli)'
- '[RabbitMQ Pub/Sub Tutorial](https://www.rabbitmq.com/tutorials/tutorial-three-python)'
---

Microsoft Azure Service Bus is an enterprise-grade messaging service that supports pub/sub and point-to-point patterns with features like at-least-once delivery and dead-letter queues. It allows for advanced message filtering using SQL-like expressions, enabling sophisticated routing scenarios.

RabbitMQ is an open source alternative message broker that provides similar flexibility while offering a self-hosted deployment model. Migrating to RabbitMQ can offer developers more control over their messaging systems, with features like custom routing and multi-protocol support.

This guide includes steps and recommendations on how to migrate from Azure Service Bus to RabbitMQ running on Linode. To help illustrate the migration process, an example Flask-based Python application running on a separate instance is used as a placeholder for your application or workload.

## Feature Comparison

Below is a list comparing the key features of Azure Service Bus and RabbitMQ:

| Feature | Azure Service Bus | RabbitMQ |
| ----- | ----- | ----- |
| **Primary Use Case** | Fully managed enterprise-grade messaging for cloud-native and hybrid systems. | Open-source message broker for on-premise or cloud deployments. |
| **Deployment** | Fully managed by Azure, no maintenance required. | Self-hosted or managed services (e.g. CloudAMQP); requires maintenance if self-hosted. |
| **Protocol Support** | AMQP, HTTP, and REST APIs. | AMQP, STOMP, MQTT, and more; highly extensible. |
| **Message Filtering** | Advanced SQL-like filtering rules for topics. | Limited to simple routing logic with exchanges (direct, fanout, topic, header). |
| **Scalability** | Automatically scales with Azure infrastructure. | Requires manual scaling or external tools for clustering and federation. |
| **Dead-Letter Queue** | Built-in dead-letter queue for unprocessed messages. | Supports dead-letter queues but requires custom setup. |
| **Security** | Azure Active Directory (AAD) and RBAC integration. TLS. | Authentication via username/password or external plugins (e.g. OAuth). |

## Before You Begin

1.  Read our [Getting Started with Linode](https://techdocs.akamai.com/cloud-computing/docs/getting-started) guide, and create a Linode account if you do not already have one.

1.  Migrating from Azure Service Bus to RabbitMQ on Linode requires choosing between a single Linode instance or a larger scale, more fault-tolerant environment with Linode Kubernetes Engine (LKE). Follow the appropriate guide below based on your needs:

    -   [Deploying RabbitMQ on a Linode Compute Instance]()
    -   [Deploying RabbitMQ on Kubernetes with Linode LKE]()
    -   [Deploy RabbitMQ through the Linode Marketplace](https://www.linode.com/marketplace/apps/linode/rabbitmq/)

1.  You must have access to your Azure account with sufficient permissions to work with Service Bus resources.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Migrate from Azure Service Bus to RabbitMQ

RabbitMQ exchanges provides various routing mechanisms to handle message delivery:

-   **Direct** exchanges deliver messages to queues with a specific routing key.
-   **Topic** exchanges enable pattern-based routing, which allow wildcard matches.
-   **Fanout** exchanges broadcast messages to all bound queues, similar to the pub/sub model in Azure Service Bus.
-   **Header** exchanges route messages based on their headers for more nuanced filtering.

Migrating your messaging broker service involves porting any applications that depend on Azure Service Bus to use RabbitMQ instead. To illustrate the process, this guide uses an [example Flask application](https://github.com/linode/docs-cloud-projects/tree/main/demos/rabbitmq-migrations-main) running on a Linode instance that is subscribed to an Azure Service Bus topic.

### Assess Current Messaging Needs

Using the example Flask app integration, Azure Service Bus provides a topic for publishing messages to web application subscriptions. The UI displays the current subscribers to each topic. This provides guidance as to which services may need to be updated when migrating to RabbitMQ.

![The Azure Service Bus Console UI showing current topic subscribers.](azure-servicebus-subscribers-ui.png)

The Azure Service Bus Explorer provides a UI for publishing messages to all subscribers of a topic. This has a similar interface to `rabbitmqadmin` for command line interactions with topics.

![Azure Service Bus Explorer UI for publishing messages to a topic.](azure-servicebus-publish-message.png)

This message should appear in the example application’s logs as the following:

```output
2024-11-23 19:15:20,634 - azure.servicebus._pyamqp.cbs - DEBUG - CBS status check: state == <CbsAuthState.OK: 0>, expired == False, refresh required == False
2024-11-23 19:15:20,651 _____main___ - DEBUG Received: This is a test message!
2024-11-23 19:15:20,652 - azure.servicebus._pyamqp.cbs - DEBUG - CBS status check: state == <CbsAuthState.OK: 0>, expired == False, refresh required == False
```

The Azure Service Bus overview UI displays all related resources associated with the service as well as monitoring of message throughput, latency, and errors:

![Azure Monitor interface showing Service Bus metrics and diagnostics.](azure-servicebus-logging-metrics.png)

### Convert Authentication to be Compatible with RabbitMQ

RabbitMQ does not use Microsoft Entra ID or Azure Active Directory (AAD) roles or policies. As an alternative, select an authentication method compatible with RabbitMQ such as username/password or SSL/TLS certificates. This guide uses username/password for authentication. The following steps create a new read-only RabbitMQ user (e.g. `flaskappuser`) to interact with the example Flask application.

1.  To create a new user, open a web browser and navigate to the following URL over port 15672, replacing {{< placeholder "IP_ADDRESS" >}} with the external IP address of your Linode instance or LKE node running RabbitMQ:

    ```command
    http://{{< placeholder "IP_ADDRESS" >}}:15672
    ```

1.  Log in to the RabbitMQ web interface as an administrator user.

    {{< note title="Create a new admin user for single instance deployments" >}}
    If you set up RabbitMQ manually on a single Linode instance, the default administrative username (`guest`) and password (`guest`) are only permitted to log in via `localhost`. Therefore, you must create a new administrative user.

    1. Use the following command to create a new RabbbitMQ user:

        ```command
        rabbitmqctl add_user {{< placeholder "USERNAME" >}} {{< placeholder "PASSWORD" >}}
        ```

    1.  The following commands tag that user as an `administrator` and grant them administrative permissions:

        ```command
        rabbitmqctl set_user_tags <username> administrator
        rabbitmqctl set_permissions -p / <username> ".*" ".*" ".*"
        ```
    {{< /note >}}

1.  Open the **Admin** tab and click the **Add user** button. Provide a **Username** (e.g. `flaskappuser`) and **Password** and apply the **Monitoring** tag:

    ![The RabbitMQ Admin interface showing the user creation process.](rabbitmq-create-user.png)

1.  Take note of the username/password for the newly created RabbitMQ user, as these credentials must be added to your application for authentication. Later in the guide, these are added directly to the example Flask app configuration.

{{< note title="Make separate users for each application" >}}
It's considered a best practice to create a separate set of credentials for each application interacting with RabbitMQ.
{{< /note >}}

### Create a RabbitMQ Exchange and Queue Your Application

1.  To create a new exchange for your application, open the **Exchanges** tab. Under **Add a new exchange**, provide a **Name** (e.g. `flask_app_exchange`) and set the **Type** to `fanout`. Leave the default values in the rest of the fields, then click **Add exchange**:

    ![The RabbitMQ interface showing steps to create a new exchange.](rabbitmq-create-exchange.png)

1.  To create a new queue, open the **Queues and Streams** tab. Under **Add a new queue**, specify a **Name** (e.g. `flask_queue`) and leave the default values in the rest of the fields, then click **Add queue**:

    ![The RabbitMQ interface showing steps to create a new queue.](rabbitmq-create-queue.png)

1.  Select the name of the newly created queue in the list to bring up its details. Expand the **Bindings** section and add a new binding by setting **From exchange** to the name of the newly created exchange (e.g. `flask_app_exchange`), then click **Bind**:

    ![The RabbitMQ interface showing the bindings section for queues.](rabbitmq-bind-queue.png)

{{< note title="Make a separate exchange and queue for each application" >}}
It's considered a best practice to create a distinct exchange and queue for each application.
{{< /note >}}

### Set Permissions for RabbitMQ User

Return to the **Admin** page and select the newly created user to bring up its permission details. The following permissions are recommended:

![The RabbitMQ Admin interface showing user permission configuration.](rabbitmq-set-permissions.png)

-   The **Configure** permission allows the user to create or modify queues. By setting this to the regular expression `^$`, the user is prohibited from making any configuration changes. Your application assumes the queue(s) it subscribes to already exist.
-   The **Write** permission allows the user to publish messages to the queue. The example application in this guide does not write to the queue, so specifying `^$` denies write access.
-   The **Read** permission, set to `^flask_queue$`, grants the user read access to the previously created queue (`flask_queue`). Replace `flask_queue` with the name of your application's queue.

### Configure Example Flask Server

This guide demonstrates the migration process using an [example Flask server](https://github.com/linode/docs-cloud-projects/tree/main/demos/rabbitmq-migrations-main) that reads messages from RabbitMQ. The example app is deployed on a separate Linode instance to emulate a remote application in production.

1.  Create a new Compute Instance (a [Nanode](https://techdocs.akamai.com/cloud-computing/docs/how-to-choose-a-compute-instance-plan) is sufficient) on which to install and configure Flask. See our [Get Started](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-compute-instances) guide for information on deploying an instance.

1.  Follow our [Set Up and Secure](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) guide to update your system and create a limited user account. You may also wish to set the timezone, configure your hostname, and harden SSH access.

1.  If you haven't done so already, log in to your instance via SSH as a limited user with `sudo` privileges. Replace {{< placeholder "USER" >}} with your limited username and {{< placeholder "FLASK_IP_ADDRESS" >}} with the IP address your new instance:

    ```command
    ssh {{< placeholder "USER" >}}@{{< placeholder "FLASK_IP_ADDRESS" >}}
    ```

1.  Use `apt` to install Flask:

    ```command
    sudo apt install python3-flask
    ```

1.  Use `git` to clone the `docs-cloud-projects` GitHub repository. This includes all playbooks, configurations, and files for all project directories in the repository, including those for the example Flask app.

    ```command
    git clone https://github.com/linode/docs-cloud-projects.git
    ```

    {{< note title="Installing git" >}}
    Depending on the distribution installed on your instance, you may need to install the `git` utility prior to cloning the docs-cloud-projects repository.

    See GitHub's documentation on [installing git](https://github.com/git-guides/install-git).
    {{< /note >}}

1.  Navigate to the `main/demos/rabbitmq-migration-main` directory within the cloned `docs-cloud-projects` repository:

    ```command
    cd docs-cloud-projects/demos/rabbitmq-migrations-main
    ```

1.  Confirm the `rabbitmq-migration-main` directory contents on your system:

    ```command
    ls
    ```

    The following contents should be visible:

    ```output
    rabbitmq-changes  README.md
    ```

### Convert Existing Applications from Azure Service Bus to RabbitMQ

{{< note title="Steps may vary from application to application" >}}
The specific steps for converting applications from GCP Pub/Sub to RabbitMQ depend on your application configuration and type.

The conversion steps in this guide are specific to the featured example Flask Python app, however the concepts still apply. When converting your message broker service to RabbitMQ, ensure you are configuring it to authenticate to your RabbitMQ exchange and queue as described.
{{< /note >}}

In the example, the subscribing application communicates directly with Azure Service Bus by using the [azure-servicebus library](https://pypi.org/project/azure-servicebus/). In order to use RabbitMQ, corresponding code must be carefully switched from Azure tooling to RabbitMQ. For Python applications like the Flask app in this guide, RabbitMQ support is provided through the [Pika](https://pypi.org/project/pika/) library, which is an AMQP provider with RabbitMQ bindings.

1.  Use `apt` to install Pika:

    ```command
    sudo apt install python3-pika
    ```

1.  Using a text editor of your choice, edit the [`app.py`](https://github.com/linode/docs-cloud-projects/blob/main/demos/rabbitmq-migrations-main/rabbitmq-changes/app.py) file located in the `rabbitmq-migrations-main/rabbitmq-changes` directory to apply the changes required to subscribe to the `flask_queue` queue. Save your changes when complete:

    ```command
    nano rabbitmq-changes/app.py
    ```

    The resulting file should look like this, replacing {{< placeholder "RABBITMQ_HOST" >}}, {{< placeholder "RABBITMQ_USERNAME" >}} and {{< placeholder "RABBITMQ_PASSWORD" >}} with your actual RabbitMQ IP address, username, and password:

    ```file {title="rabbitmq-changesapp.py" lang="python" hl_lines="23,25"}
    from flask import Flask
    import pika
    import threading
    import json
    import logging

    logging.basicConfig(level=logging.INFO)

    app = Flask(__name__)

    def rabbitmq_listener():
        """
        Opens listener to the desired RabbitMQ queue and handles incoming messages
        """
        def callback(ch, method, properties, body):
            """
            Callback function to handle incoming messages from RabbitMQ
            """
            app.logger.info(body.decode('utf-8'))
            # Do other processing here as needed on messages

        connection = pika.BlockingConnection(pika.ConnectionParameters(
            host="{{< placeholder "RABBITMQ_HOST" >}}",
            port=5672,
            credentials=pika.PlainCredentials("{{< placeholder "RABBITMQ_USERNAME" >}}", "{{< placeholder "RABBITMQ_PASSWORD" >}}"),
        ))

        channel = connection.channel()
        channel.basic_consume(queue="flask_queue", on_message_callback=callback, auto_ack=True)
        app.logger.info("Started listening to RabbitMQ...")
        channel.start_consuming()

    # Start RabbitMQ listener in a separate thread
    listener_thread = threading.Thread(target=rabbitmq_listener, daemon=True)
    listener_thread.start()

    @app.route("/", methods=["GET"])
    def default_handler():
        app.logger.info("Request received.")
        return "RabbitMQ Listener Active", 200

    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5000)
    ```

1.  Run the updated application:

    ```command
    python3 app.py
    ```

    Ensure the logs show `Started listening to RabbitMQ...`, indicating a successful connection and listener setup:

    ```output
     * Serving Flask app 'app'
     * Debug mode: off
    INFO:pika.adapters.utils.connection_workflow:Pika version 1.3.2 connecting to ('172.235.61.66', 5672)
    INFO:pika.adapters.utils.io_services_utils:Socket connected: <socket.socket fd=9, family=AddressFamily.AF_INET, type=SocketKind.SOCK_STREAM, proto=6, laddr=('192.168.86.203', 50052), raddr=('172.235.61.66', 5672)>
    ...
    INFO:werkzeug:Press CTRL+C to quit
    INFO:app:Started listening to RabbitMQ...
    ```

1.  Next, publish a message to the queue where this application has subscribed. Return to the RabbitMQ Web UI in your browser and log in using your administrative credentials (*not* `flaskappuser`):

    ```command
    http://{{< placeholder "RABBITMQ_HOST" >}}:15672
    ```

1.  Open the **Queues and Streams** tab and select `flask_queue` from the list of queues. Expand **Publish message** and enter a message in the **Payload** section (e.g. `Hello, Flask app!`), then click **Publish message**:

    ![The RabbitMQ interface showing how to publish a message to a queue.](rabbitmq-publish-message.png)

    In the log output for the running Python application, you should see an update with the message from the subscribed queue:

    ```output
    INFO:app:Hello, Flask app!
    ```

## Production Considerations

Considerations to weigh when migrating your application messaging from Azure Service Bus to RabbitMQ include authentication, security, performance, and overall architecture.

### Authentication and Authorization

For authentication and authorization, Azure Service Bus uses AAD and role-based access control (RBAC). With AAD integration, users and applications can authenticate using managed identities, OAuth 2.0 tokens, or service principals. For fine-grained access control, using RBAC allows administrators to define roles and permissions at the entity level (queues, topics, and subscriptions).

In comparison, RabbitMQ offers multiple authentication methods, including username/password, OAuth2, and certificate-based authentication. For production-level security, RabbitMQ should use federated authentication services or certificates to match the enterprise-grade capabilities of Azure Service Bus. Implement access controls through RabbitMQ’s virtual hosts and user permissions to replicate the RBAC and AAD model from Azure Service Bus.

### Message Reliability, Durability, and Delivery

RabbitMQ offers persistent storage for messages by default. You can also configure queues to be durable, meaning they can survive a RabbitMQ broker restart.

RabbitMQ offers different delivery guarantees that help control message reliability and how it behaves under failure scenarios:

-   **At-least-once delivery** delivers messages to consumers at least once. This is the default delivery model in RabbitMQ.
-   **At-most-once delivery** removes messages from the queue as soon as they are sent to the consumer. This mode is generally suitable for non-critical or low-stakes messages.

In addition to basic pub/sub functionality, Azure Service Bus ensures reliable message ordering when using sessions. If sessions are enabled, subscribers can process messages in the exact order they were sent. This provides deterministic processing for applications where order matters. Azure Service Bus provides tools to manage reliable and predictable messaging workflows, including at-least-once delivery guarantees, dead-letter queues for handling undeliverable messages, and configurable message time-to-live (TTL).

To handle messages that can’t be processed after multiple retries, configure a Dead-Letter Exchange (DLX) in RabbitMQ. A DLX redirects unprocessed messages to a separate queue after exceeding the configured retry limit. A DLX is a best practice to mitigate temporary outages or network errors that cause message failures, retrying delivery without affecting primary processing. Failed messages can be inspected or logged for later analysis after landing the DLX.

Adopt the following best practices for delivery and ordering:

-   When ordering is critical, use a single consumer per queue to avoid parallel consumption.
-   For messages with critical processing requirements, implement deduplication to avoid issues from at-least-once delivery.
-   Use manual acknowledgment to control when messages are marked as processed and ensure that RabbitMQ can deliver unacknowledged messages again.
-   Use DLX for retry handling and separating failed messages for special processing, preventing interference with successful message flows.

### Monitoring and Observability

Azure Service Bus provides built-in monitoring capabilities through Azure Monitor, offering a suite of metrics and diagnostics. Key metrics, such as message count, delivery success rates, dead-letter messages, and queue length, are available for real-time tracking. Logs and metrics can also be exported to Azure Log Analytics for deeper analysis. This allows teams to monitor system health, performance, and potential bottlenecks across the entire messaging infrastructure.

Basic monitoring of RabbitMQ is available through the RabbitMQ Management plugin. You can also use tools such as Prometheus and Grafana for real-time performance tracking.

### Scaling, Load Balancing, and Availability

While RabbitMQ does not offer auto-scaling like Azure, it supports clustering and federation for scaling options. For load balancing, configure multiple nodes and use connection sharding. You can set up cross-node distribution by configuring queues and connections across multiple nodes to balance load. Avoid single points of failure by ensuring that both applications and consumers can failover to different nodes within the cluster.

If RabbitMQ nodes span different data centers, use the [Federation](https://www.rabbitmq.com/docs/federation) or [Shovel](https://www.rabbitmq.com/docs/shovel) plugins. Federation allows controlled mirroring across remote clusters, while Shovel enables continuous transfer of messages from one RabbitMQ instance to another, even across data centers.

Use persistent storage for durable messages and mirrored or quorum queues that require substantial disk I/O. When taking this approach, ensure that disks have enough I/O capacity. Enable disk alarms in RabbitMQ to prevent scenarios where disk space runs out, which could lead to node crashes.