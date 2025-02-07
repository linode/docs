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

* A [Linode account](https://www.linode.com/cfe)  
* A [Linode API token (personal access token)](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)  
* The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/) installed and configured  
* An [SSH key pair](https://www.linode.com/content/ssh-key-authentication-how-to-create-ssh-key-pairs/)

## Step 1: Initialize a Compute Instance

This guide uses the Linode CLI to provision resources. The Linode Marketplace offers a one-click [RabbitMQ Marketplace app](https://www.linode.com/marketplace/apps/linode/rabbitmq/), whereas this tutorial walks through a manual installation.

### Determine instance configuration

In order to provision a Linode instance, you must specify the desired operating system, geographical region, and Linode plan size. The options available for each of these can be obtained using the Linode CLI.

#### Operating system

Run this command to obtain a formatted list of available operating systems:

| $ linode-cli images list \--type=manual |
| :---- |

This guide will use Ubuntu 22.04, which has the ID linode/ubuntu22.04.

#### Geographical region

| $ linode-cli regions list |
| :---- |

This guide will use the us-sea region (Seattle, WA).

#### Compute Instance size

| $ linode-cli linodes types |
| :---- |

For computing resources, [RabbitMQ recommends a minimum of 256 MB of memory](https://www.rabbitmq.com/docs/production-checklist#resource-limits-ram) and [4 GB of disk storage](https://www.rabbitmq.com/docs/production-checklist#resource-limits-disk-space). This guide will use the g6-standard-1 Linode, which has 1 core, 50 GB disk, and 2 GB RAM with a 2000 Mbps transfer rate. The resources you require may vary depending on your workload.

### Create the Compute Instance

The following command creates a Linode Compute Instance based on the specified operating system, geographical region, and size as noted above.

| $ linode-cli linodes create \\                                                                                                                                                                                                                                     \--image linode/ubuntu22.04 \\      \--region us-sea \\      \--type g6-standard-1 \\      \--root\_pass \<password\> \\      \--authorized\_keys "$(cat \~/.ssh/id\_rsa.pub)" \\      \--label rabbitmq-linode |
| :---- |

Note the following key points:

* Replace **`<password>`** with a secure alternative.  
* This command assumes that an SSH public/private key pair exists, with the public key stored as id\_rsa.pub in the user’s $HOME/.ssh/ folder.  
* The \--label argument specifies the name of the new server (rabbitmq-linode).

Within a few minutes of executing this command, the instance will be visible with status running in the Linode Cloud Manager or via the following CLI command:

| $ linode-cli linodes list \--label rabbitmq-linode┌-----------------┬--------┬---------------┬---------┬---------0------┐ │ label           │ region │ type          │ status  │ ipv4           │ ├-----------------┼--------┼---------------┼---------┼----------------┤ │ rabbitmq-linode │ us-sea │ g6-standard-1 │ running │ 172.232.188.97 │ └-----------------┴--------┴---------------┴---------┴----------------┘ |
| :---- |

Depending on notification settings, emails detailing the progress of the provisioning process may also be sent to the Linode user’s address.

## Step 2: Install RabbitMQ as a Service

To install RabbitMQ, you will need to SSH into the newly provisioned Linode. The IP address of the new instance can be found in the Linode Cloud Manager dashboard or via the **linodes list** command shown above.

Once the IP address is found, run the following command:

| $ ssh \-l root \<IP-address-of-instance\> |
| :---- |

| Note that this method of connecting uses the root user, which is initially the only accessible user on the system. For production systems, it is strongly recommended that you disable the ability to access the instance as the root user, instead creating a limited user account with sudo privileges for access. See [this guide](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance#add-a-limited-user-account) for more details. This guide will assume that all remaining commands are run with sudo as a newly created user on the Linode instance. |
| :---- |

### Update system packages

Ensure that the new system is up to date with the latest Ubuntu packages. The Ubuntu package manager (apt) needs to be updated to pull the latest package manifests, followed by upgrading any that are outdated.

| $ apt update && apt upgrade \-y |
| :---- |

### Install RabbitMQ and dependencies

The RabbitMQ team offers an [install script](https://www.rabbitmq.com/docs/install-debian#apt-quick-start-cloudsmith) for Debian Bookworm, which is the version installed in the newly provisioned Linode Compute Instance. This install script will use the latest versions of Erlang supported by RabbitMQ as well as the latest version of the server itself.  
Copy the code snippet for the Debian Bookwork script to a file on the Linode instance called install-rabbitmq.sh. Then, run the script:

| $ source ./install-rabbitmq.sh |
| :---- |

After running the script, the Linode Compute Instance will have the latest version of the RabbitMQ server running as a SystemD service. Check this with the following command:

| $ systemctl status rabbitmq-server  ● rabbitmq-server.service \- RabbitMQ broker      Loaded: loaded (/usr/lib/systemd/system/rabbitmq-server.service; enabled; preset: enabled)      Active: active (running) since Fri 2024-11-22 11:04:43 MST; 13s ago    Main PID: 604444 (beam.smp)       Tasks: 25 (limit: 1124\)      Memory: 95.0M (peak: 109.5M)         CPU: 2.221s      CGroup: /system.slice/rabbitmq-server.service |
| :---- |

This shows that the service is enabled and running.

### Verify RabbitMQ Installation

RabbitMQ supplies a client that allows direct access to the server when connecting from localhost. To further verify that the installation was successful and configured as desired, run the following:

| $ rabbitmq-diagnostics status Status of node rabbit@my-linode ... \[\] Runtime OS PID: 604444 OS: Linux Uptime (seconds): 162 Is under maintenance?: false RabbitMQ version: 4.0.4 … emory Total memory used: 0.1126 gb Calculation strategy: rss Memory high watermark setting: 0.6 of available memory, computed to: 0.594 gb … Totals Connection count: 0 Queue count: 0 Virtual host count: 1 Listeners Interface: \[::\], port: 15672, protocol: http, purpose: HTTP API Interface: \[::\], port: 25672, protocol: clustering, purpose: inter-node and CLI tool communication Interface: \[::\], port: 5672, protocol: amqp, purpose: AMQP 0-9-1 and AMQP 1.0 |
| :---- |

This prints a list of diagnostic information about the server such as CPU and memory usage as well as locations of the logs and configuration files on the system.

### Starting and stopping RabbitMQ

The RabbitMQ server can be controlled via systemd. For example:

| \# Stop the RabbitMQ server$ systemctl stop rabbitmq-server\# Start the RabbitMQ server$ systemctl start rabbitmq-server |
| :---- |

Use journalctl to view the server logs.

| $ journalctl \-u rabbitmq-server |
| :---- |

   
Upon installation, RabbitMQ requires no additional configuration to be usable. Configuration files for the server can be found at /etc/rabbitmq if any exist. Information on configuration options can be found in the [RabbitMQ documentation](https://www.rabbitmq.com/docs/configure).

## Step 3: Test RabbitMQ with a Messaging Example

To test the RabbitMQ deployment, first enable the RabbitMQ management plugin.

| $ rabbitmq-plugins enable rabbitmq\_management Enabling plugins on node rabbit@my-linode: rabbitmq\_management The following plugins have been configured:   rabbitmq\_management   rabbitmq\_management\_agent   rabbitmq\_web\_dispatch Applying plugin configuration to rabbit@my-linode... Plugin configuration unchanged. |
| :---- |

Next, download the management script, which is available directly from localhost after enabling the plugin.

| $ wget http://localhost:15672/cli/rabbitmqadmin |
| :---- |

Make the script executable, and move it somewhere to a location included in the environment PATH.

| $ chmod \+x rabbitmqadmin $ mv rabbitmqadmin /usr/local/bin/ |
| :---- |

### Create exchange and queue

This guide demonstrates creating a [fanout exchange](https://www.rabbitmq.com/tutorials/amqp-concepts#exchange-fanout), which “routes messages to all of the queues that are bound to it.” A fanout closely resembles the pub/sub pattern and is typically used for broadcasting messages.

Create a fanout style exchange on the RabbitMQ server with the following.

| $ rabbitmqadmin declare exchange \\   name=test\_fanout\_exchange \\   type=fanout exchange declared |
| :---- |

Create a queue to attach to this exchange to hold messages.

| $ rabbitmqadmin declare queue \\   name=fanout\_queue \\   durable=true queue declared |
| :---- |

Bind the queue to the exchange.

| $ rabbitmqadmin declare binding \\   source=test\_fanout\_exchange \\   destination=fanout\_queue binding declared |
| :---- |

### Test message publishing and retrieval

Publish a message to the exchange (and bound queue):

| $ rabbitmqadmin publish \\   exchange=test\_fanout\_exchange \\   routing\_key=dummy\_key \\   payload="Hello, world\!" Message published |
| :---- |

The routing key is not necessary for a fanout exchange, as each message is routed to each queue regardless of the routing key, but it is required for the rabbitmqadmin tool. 

Retrieve the messages from the queue.

| $ rabbitmqadmin get queue=fanout\_queue  \+-------------+----------------------+---------------+---------------+---------------+------------------+------------+-------------+ | routing\_key |       exchange       | message\_count |    payload    | payload\_bytes | payload\_encoding | properties | redelivered | \+-------------+----------------------+---------------+---------------+---------------+------------------+------------+-------------+ | dummy\_key   | test\_fanout\_exchange | 0             | Hello, world\! | 13            | string           |            | False       | \+-------------+----------------------+---------------+---------------+---------------+------------------+------------+-------------+ |
| :---- |

![][image2]

## Step 4: Access RabbitMQ Remotely

The RabbitMQ management plugin enables a web interface and API accessible at port   
15672. Assuming that this port on the Linode Compute Instance is not blocked by any firewall rules, you can access the web interface in your browser by visiting http://\<LINODE-IP\>:15672.

![][image3]

By default, RabbitMQ is initiated with a default [virtual host](https://www.rabbitmq.com/docs/vhosts) and a [default administrative user](https://www.rabbitmq.com/docs/access-control#default-state) with username guest (and password guest). However, this user can only connect to the management interface from localhost. To connect to RabbitMQ remotely, a new user will need to be created.

### Create a new RabbitMQ management user

In a shell session on the Linode instance, use the add\_user command with rabbitmqctl, providing a username and a password. For example:

| $ rabbitmqctl add\_user \\   "linodeuser" \\   "dg8SeevsX5buXS7LL4k7JyDCEfvPZWu4AthUSTaUb6q3DHC6" Adding user "linodeuser" ...Done. Don't forget to grant the user permissions to some virtual hosts\! See 'rabbitmqctl help set\_permissions' to learn more. |
| :---- |

Add the administrator tag to the newly created user, giving it management privileges.

| $ rabbitmqctl set\_user\_tags linodeuser administrator Setting tags for user "linodeuser" to \[administrator\] ... |
| :---- |

### Set permissions for the user on the virtual host

Verify the name of the existing virtual host. The default virtual host is named /.

| $ rabbitmqctl \-q \--formatter=pretty\_table list\_vhosts name description`┌──────┬──────────────────────┐│ name  │ description              │├──────┼──────────────────────┤│ /     │ Default virtual host     │└──────┴──────────────────────┘` |
| :---- |

Grant permissions on this virtual host to the newly created user.

| $ rabbitmqctl set\_permissions \-p "/" "linodeuser" ".\*" ".\*" ".\*" Setting permissions for user "linodeuser" in vhost "/" ... |
| :---- |

### Access the RabbitMQ management interface remotely

At the management console UI in the web browser, log in with the credentials of the newly created user.

![][image4]

After logging in, the **Overview** page will show metrics about the currently running RabbitMQ instance.

![][image5]

### Send test requests to the RabbitMQ API

Using curl, send an authenticated request to the RabbitMQ API, testing out the publishing of a message to an exchange. Note the %2f in the request URL. This is the name of the exchange, which is the URL-encoded value for /.

| $ curl \\     \-u linodeuser:dg8SeevsX5buXS7LL4k7JyDCEfvPZWu4AthUSTaUb6q3DHC6 \\     \-H "Content-Type: application/json" \\     \-X POST \\     \-d '{"properties":{},"routing\_key":"dummy\_key","payload":"Hello, curl\!","payload\_encoding":"string"}' \\     http://\<LINODE-IP\>:15672/api/exchanges/%2f/test\_fanout\_exchange/publish {"routed":true} |
| :---- |

Next, send an authenticated request to get the last two messages from the queue.

| $ curl \\   \-u linodeuser:dg8SeevsX5buXS7LL4k7JyDCEfvPZWu4AthUSTaUb6q3DHC6 \\   \-H "Content-type:application/json" \\   \-X POST \\   \-d '{"count":2,"ackmode":"ack\_requeue\_true","encoding":"auto"}' \\   http://\<LINODE-IP\>:15672/api/queues/%2f/fanout\_queue/get | json\_pp \[    {       "exchange" : "test\_fanout\_exchange",       "message\_count" : 1,       "payload" : "Hello, world\!",       "payload\_bytes" : 13,       "payload\_encoding" : "string",       "properties" : \[\],       "redelivered" : true,       "routing\_key" : "dummy\_key"    },    {       "exchange" : "test\_fanout\_exchange",       "message\_count" : 0,       "payload" : "Hello, curl\!",       "payload\_bytes" : 12,       "payload\_encoding" : "string",       "properties" : \[\],       "redelivered" : true,       "routing\_key" : "dummy\_key"    } \] |
| :---- |

---

The resources below are provided to help you become familiar with RabbitMQ when deployed to Linode.

## RabbitMQ Resources

* [Configuration Documentation](https://www.rabbitmq.com/docs/configure)  
* [Deployment Checklist](https://www.rabbitmq.com/docs/production-checklist)  
* [Plugins](https://www.rabbitmq.com/docs/plugins)  
* [Management CLI](https://www.rabbitmq.com/docs/management-cli)  
* [RabbitMQ Linode Marketplace App](https://www.linode.com/marketplace/apps/linode/rabbitmq/)