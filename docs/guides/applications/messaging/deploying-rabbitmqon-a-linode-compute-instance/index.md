---
slug: deploying-rabbitmq-on-a-linode-compute-instance
title: "Deploying RabbitMQ on a Linode Compute Instance"
description: "Two to three sentences describing your guide."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-02-07
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide walks through how to deploy RabbitMQ on a single Linode Compute Instance using the [Linode CLI](https://github.com/linode/linode-cli).

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

-   A [Linode account](https://www.linode.com/cfe)
-   A [Linode API token (personal access token)](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)
-   The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/) installed and configured
-   An [SSH key pair](https://www.linode.com/content/ssh-key-authentication-how-to-create-ssh-key-pairs/)

## Step 1: Initialize a Compute Instance

This guide uses the Linode CLI to provision resources. The Linode Marketplace offers a one-click [RabbitMQ Marketplace app](https://www.linode.com/marketplace/apps/linode/rabbitmq/), whereas this tutorial walks through a manual installation.

### Determine Instance Configuration

In order to provision a Linode instance, you must specify the desired operating system, geographical region, and Linode plan size. The options available for each of these can be obtained using the Linode CLI.

#### Operating System

Run this command to obtain a formatted list of available operating systems:

```command
linode-cli images list --type=manual
```

This guide uses Ubuntu 22.04 LTS, which has the ID `linode/ubuntu22.04`.

#### Geographical Region

```command
linode-cli regions list
```

This guide uses the `us-sea` region (Seattle, WA).

#### Compute Instance Size

```command
linode-cli linodes types
```

For computing resources, [RabbitMQ recommends a minimum of 256 MB of memory](https://www.rabbitmq.com/docs/production-checklist#resource-limits-ram) and [4 GB of disk storage](https://www.rabbitmq.com/docs/production-checklist#resource-limits-disk-space). This guide uses the `g6-standard-1` Linode, which has 1 core, 50 GB disk, and 2 GB RAM with a 2000 Mbps transfer rate. The resources you require may vary depending on your workload.

### Create the Compute Instance

The following command creates a Linode Compute Instance based on the specified operating system, geographical region, and size as noted above.

```command
linode-cli linodes create
--image linode/ubuntu22.04 \
--region us-sea \
--type g6-standard-1 \
--root_pass {{< placeholder "PASSWORD">}} \
--authorized_keys "$(cat ~/.ssh/id_rsa.pub)" \
--label rabbitmq-linode
```

Note the following key points:

-   Replace {{< placeholder "PASSWORD" >}} with a secure alternative.
-   This command assumes that an SSH public/private key pair exists, with the public key stored as `id_rsa.pub` in the user’s `$HOME/.ssh` folder.
-   The `--label` argument specifies the name of the new server (`rabbitmq-linode`).

Within a few minutes of executing this command, the instance should be visible with status running in the Linode Cloud Manager or via the following CLI command:

```command
linode-cli linodes list --label rabbitmq-linode
```

```output
┌-----------------┬--------┬---------------┬---------┬----------------┐
│ label           │ region │ type          │ status  │ ipv4           │ ├-----------------┼--------┼---------------┼---------┼----------------┤
│ rabbitmq-linode │ us-sea │ g6-standard-1 │ running │ 172.232.188.97 │ └-----------------┴--------┴---------------┴---------┴----------------┘
```

Depending on notification settings, emails detailing the progress of the provisioning process may also be sent to the Linode user’s address.

## Step 2: Install RabbitMQ as a Service

To install RabbitMQ, you need to SSH into the newly provisioned Linode. The IP address of the new instance can be found in the Linode Cloud Manager dashboard or via the `linodes list` command shown above.

Once the IP address is found, run the following command:

```command
ssh -l root {{< placeholder "IP-ADDRESS" >}}
```

{{< note >}}
This method of connecting uses the `root` user, which is initially the only accessible user on the system. For production systems, it is strongly recommended that you disable the ability to access the instance as the `root` user, instead creating a limited user account with `sudo` privileges for access. See [this guide](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance#add-a-limited-user-account) for more details. This guide assumes that all remaining commands are run with sudo as a newly created user on the Linode instance.
{{< /note >}}

### Update System Packages

Ensure that the new system is up to date with the latest Ubuntu packages. The Ubuntu package manager (`apt`) needs to be updated to pull the latest package manifests, followed by upgrading any that are outdated.

```command
apt update && apt upgrade -y
```

### Install RabbitMQ and Dependencies

The RabbitMQ team offers an [install script](https://www.rabbitmq.com/docs/install-debian#apt-quick-start-cloudsmith) for Debian Bookworm, which is the version installed in the newly provisioned Linode Compute Instance. This install script uses the latest versions of Erlang supported by RabbitMQ as well as the latest version of the server itself.

Copy the code snippet for the Debian Bookwork script to a file on the Linode instance called `install-rabbitmq.sh`. Then, run the script:

```command
source ./install-rabbitmq.sh
```

After running the script, the Linode Compute Instance should have the latest version of the RabbitMQ server running as a SystemD service. Check this with the following command:

```command
systemctl status rabbitmq-server
```

```output
● rabbitmq-server.service - RabbitMQ broker
    Loaded: loaded (/usr/lib/systemd/system/rabbitmq-server.service; enabled; preset: enabled)
    Active: active (running) since Fri 2024-11-22 11:04:43 MST; 13s ago
  Main PID: 604444 (beam.smp)
     Tasks: 25 (limit: 1124)
    Memory: 95.0M (peak: 109.5M)
       CPU: 2.221s
    CGroup: /system.slice/rabbitmq-server.service
```

This shows that the service is enabled and running.

### Verify RabbitMQ Installation

RabbitMQ supplies a client that allows direct access to the server when connecting from localhost. To further verify that the installation was successful and configured as desired, run the following:

```command
rabbitmq-diagnostics status
```

```output
Status of node rabbit@my-linode ...
[]
Runtime OS PID: 604444
OS: Linux
Uptime (seconds): 162
Is under maintenance?: false
RabbitMQ version: 4.0.4
…
emory

Total memory used: 0.1126 gb
Calculation strategy: rss
Memory high watermark setting: 0.6 of available memory, computed to: 0.594 gb
…
Totals

Connection count: 0
Queue count: 0
Virtual host count: 1

Listeners

Interface: [::], port: 15672, protocol: http, purpose: HTTP API
Interface: [::], port: 25672, protocol: clustering, purpose: inter-node and CLI tool communication
Interface: [::], port: 5672, protocol: amqp, purpose: AMQP 0-9-1 and AMQP 1.0
```

This prints a list of diagnostic information about the server such as CPU and memory usage as well as locations of the logs and configuration files on the system.

### Starting and Stopping RabbitMQ

The RabbitMQ server can be controlled via `systemd`. For example:

Stop the RabbitMQ server:

```command
systemctl stop rabbitmq-server
```

Start the RabbitMQ server:

```command
systemctl start rabbitmq-server
```

Use `journalctl` to view the server logs:

```command
journalctl -u rabbitmq-server
```

Upon installation, RabbitMQ requires no additional configuration to be usable. Configuration files for the server can be found at `/etc/rabbitmq` if any exist. Information on configuration options can be found in the [RabbitMQ documentation](https://www.rabbitmq.com/docs/configure).

## Step 3: Test RabbitMQ with a Messaging Example

To test the RabbitMQ deployment, first enable the RabbitMQ management plugin.

```command
rabbitmq-plugins enable rabbitmq_management
```

```output
Enabling plugins on node rabbit@my-linode:
rabbitmq_management The following plugins have been configured:
    rabbitmq_management
    rabbitmq_management_agent
    rabbitmq_web_dispatch
Applying plugin configuration to rabbit@my-linode...
Plugin configuration unchanged.
```

Next, download the management script, which is available directly from `localhost` after enabling the plugin:

```command
wget http://localhost:15672/cli/rabbitmqadmin
```

Make the script executable, and move it somewhere to a location included in the environment `PATH`:

```command
chmod +x rabbitmqadmin
mv rabbitmqadmin /usr/local/bin/
```

### Create Exchange and Queue

This guide demonstrates creating a [fanout exchange](https://www.rabbitmq.com/tutorials/amqp-concepts#exchange-fanout), which "routes messages to all of the queues that are bound to it." A fanout closely resembles the pub/sub pattern and is typically used for broadcasting messages.

Create a `fanout` style exchange on the RabbitMQ server with the following:

```command
rabbitmqadmin declare exchange \
name=test_fanout_exchange \
type=fanout
```

```output
exchange declared
```

Create a queue to attach to this exchange to hold messages.

```command
rabbitmqadmin declare queue \
name=fanout_queue \
durable=true
```

```output
queue declared
```

Bind the queue to the exchange.

```command
rabbitmqadmin declare binding \
source=test_fanout_exchange \
destination=fanout_queue
```

```output
binding declared
```

### Test Message Publishing and Retrieval

Publish a message to the exchange (and bound queue):

```command
rabbitmqadmin publish \
exchange=test_fanout_exchange \
routing_key=dummy_key \
payload="Hello, world!"
```

```output
Message published
```

The routing key is not necessary for a fanout exchange, as each message is routed to each queue regardless of the routing key, but it is required for the `rabbitmqadmin` tool.

Retrieve the messages from the queue.

```command
rabbitmqadmin get queue=fanout_queue
```

```output
+-------------+----------------------+---------------+---------------+---------------+------------------+------------+-------------+
| routing_key |       exchange       | message_count |    payload    | payload_bytes | payload_encoding | properties | redelivered |
+-------------+----------------------+---------------+---------------+---------------+------------------+------------+-------------+
| dummy_key   | test_fanout_exchange | 0             | Hello, world! | 13            | string           |            | False       |
+-------------+----------------------+---------------+---------------+---------------+------------------+------------+-------------+
```

![](image2.png)

## Step 4: Access RabbitMQ Remotely

The RabbitMQ management plugin enables a web interface and API accessible at port `15672`. Assuming that this port on the Linode Compute Instance is not blocked by any firewall rules, you can access the web interface in your browser by visiting `http://{{< placeholder "IP_ADDRESS" >}}:15672`.

![](image3.png)

By default, RabbitMQ is initiated with a default [virtual host](https://www.rabbitmq.com/docs/vhosts) and a [default administrative user](https://www.rabbitmq.com/docs/access-control#default-state) with username `guest` (and password `guest`). However, this user can only connect to the management interface from `localhost`. To connect to RabbitMQ remotely, a new user must be created.

### Create a New RabbitMQ Management User

In a shell session on the Linode instance, use the `add_user` command with `rabbitmqctl`, providing a username and a password. For example:

```command
rabbitmqctl add_user \
"linodeuser" \
"dg8SeevsX5buXS7LL4k7JyDCEfvPZWu4AthUSTaUb6q3DHC6"
```

```output
Adding user "linodeuser" ...
Done. Don't forget to grant the user permissions to some virtual hosts! See 'rabbitmqctl help set_permissions' to learn more.
```

Add the `administrator` tag to the newly created user, giving it management privileges.

```command
rabbitmqctl set_user_tags linodeuser administrator
```

```output
Setting tags for user "linodeuser" to [administrator\] ...
```

### Set Permissions for the User on the Virtual Host

Verify the name of the existing virtual host. The default virtual host is named `/`.

```command
rabbitmqctl -q --formatter=pretty_table list_vhosts name description
```

```output
┌──────┬──────────────────────┐
│ name │ description          │
├──────┼──────────────────────┤
│ /    │ Default virtual host │
└──────┴──────────────────────┘
```

Grant permissions on this virtual host to the newly created user.

```command
rabbitmqctl set_permissions -p "/" "linodeuser" ".*" ".*" ".*"
```

```output
Setting permissions for user "linodeuser" in vhost "/" ...
```

### Access the RabbitMQ Management Interface Remotely

At the management console UI in the web browser, log in with the credentials of the newly created user.

![](image4.png)

After logging in, the **Overview** page displays metrics about the currently running RabbitMQ instance.

![](image5.png)

### Send Test Requests to the RabbitMQ API

Using `curl`, send an authenticated request to the RabbitMQ API, testing out the publishing of a message to an exchange. Note the `%2f` in the request URL. This is the name of the exchange, which is the URL-encoded value for `/`.

```command
curl \
  -u linodeuser:dg8SeevsX5buXS7LL4k7JyDCEfvPZWu4AthUSTaUb6q3DHC6 \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"properties":{},"routing_key":"dummy_key","payload":"Hello, curl!","payload_encoding":"string"}' \
  http://{{< placeholder "IP_ADDRESS" >}}:15672/api/exchanges/%2f/test_fanout_exchange/publish
```

```output
{"routed":true}
```

Next, send an authenticated request to get the last two messages from the queue.

```command
curl \
  -u linodeuser:dg8SeevsX5buXS7LL4k7JyDCEfvPZWu4AthUSTaUb6q3DHC6 \
  -H "Content-type:application/json" \
  -X POST \
  -d '{"count":2,"ackmode":"ack_requeue_true","encoding":"auto"}' \
  http://{{< placeholder "IP_ADDRESS" >}}:15672/api/queues/%2f/fanout_queue/get | json_pp
```

```output
[
    {
        "exchange" : "test_fanout_exchange",
        "message_count" : 1,
        "payload" : "Hello, world!",
        "payload_bytes" : 13,
        "payload_encoding" : "string",
        "properties" : [],
        "redelivered" : true,
        "routing_key" : "dummy_key"
    },
    {
        "exchange" : "test_fanout_exchange",
        "message_count" : 0,
        "payload" : "Hello, curl!",
        "payload_bytes" : 12,
        "payload_encoding" : "string",
        "properties" : [],
        "redelivered" : true,
        "routing_key" : "dummy_key"
    }
]
```

The resources below are provided to help you become familiar with RabbitMQ when deployed to Linode.

## RabbitMQ Resources

-   [Configuration Documentation](https://www.rabbitmq.com/docs/configure)
-   [Deployment Checklist](https://www.rabbitmq.com/docs/production-checklist)
-   [Plugins](https://www.rabbitmq.com/docs/plugins)
-   [Management CLI](https://www.rabbitmq.com/docs/management-cli)
-   [RabbitMQ Linode Marketplace App](https://www.linode.com/marketplace/apps/linode/rabbitmq/)