---
slug: deploying-rabbitmq-on-kubernetes-with-linode-lke
title: "Deploying Rabbitmq on Kubernetes With Linode Lke"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-12-21
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide walks through how to deploy RabbitMQ with Linode Kubernetes Engine (LKE) using the [RabbitMQ Kubernetes Operators](https://www.rabbitmq.com/kubernetes/operator/operator-overview).

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

* A [Linode account](https://www.linode.com/cfe)  
* A [Linode API token (personal access token)](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)  
* The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/) installed and configured  
* [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed and configured

## Step 1: Provision a Kubernetes Cluster

While there are several ways to create a Kubernetes cluster on Linode, this guide uses the [Linode CLI](https://github.com/linode/linode-cli) to provision resources.

1. Use the Linode CLI (linode) to see available Kubernetes versions:

| $ linode lke versions-list  ┌───────┐ │ id      │ ├───────┤ │ 1.31    │ ├───────┤ │ 1.30    │ └───────┘ |
| :---- |

It’s generally recommended to provision the latest version of Kubernetes unless specific requirements dictate otherwise.

2. Use the following command to list available Linode plans, including plan ID, pricing, and performance details. For more detailed pricing information, see [Akamai Connected Cloud: Pricing](https://www.linode.com/pricing/):

| $ linode linodes types |
| :---- |

3. The examples in this guide use the **g6-standard-2** Linode, which features two CPU cores and 4 GB of memory. Run the following command to display detailed information in JSON for this Linode plan:

| $ linode linodes types \--label "Linode 4GB" \--json \--pretty\[  {    "addons": {...},     "class": "standard",    "disk": 81920,    "gpus": 0,    "id": "g6-standard-2",    "label": "Linode 4GB",    "memory": 4096,    "network\_out": 4000,    "price": {      "hourly": 0.036,      "monthly": 24.0    },    "region\_prices": \[...\],    "successor": null,    "transfer": 4000,    "vcpus": 2  }\] |
| :---- |

4. View available regions with the regions list command:

| $ linode regions list |
| :---- |

5. With a Kubernetes version and Linode type selected, use the following command to create a cluster named rabbitmq-cluster in the us-mia (Miami, FL) region with three nodes and auto-scaling. Replace rabbitmq-cluster and us-mia with a cluster label and region of your choosing, respectively:

| $ linode lke cluster-create \\  \--label rabbitmq-cluster \\  \--k8s\_version 1.31 \\  \--region us-mia \\  \--node\_pools '\[{    "type": "g6-standard-2",    "count": 3,    "autoscaler": {      "enabled": true,      "min": 3,      "max": 8    }  }\]' |
| :---- |

Once your cluster is successfully created, you should see output similar to the following:

| Using default values: {}; use the \--no-defaults flag to disable defaults\+------------------+--------+-------------+ |      label       | region | k8s\_version | \+------------------+--------+-------------+ | rabbitmq-cluster | us-mia |        1.31 | \+------------------+--------+-------------+ |
| :---- |

## Step 2: Access the Kubernetes Cluster

To access your cluster, fetch the cluster credentials in the form of a kubeconfig file.

1. Use the following command to retrieve the cluster’s ID:

| $ CLUSTER\_ID=$(linode lke clusters-list \--json | \\    jq \-r \\       '.\[\] | select(.label \== "rabbitmq-cluster") | .id') |
| :---- |

2. Create a hidden .kube folder in your user’s home directory:

| $ mkdir \~/.kube |
| :---- |

3. Retrieve the kubeconfig file and save it to \~/.kube/lke-config:

| $ linode lke kubeconfig-view \--json "$CLUSTER\_ID" | \\     jq \-r '.\[0\].kubeconfig' | \\     base64 \--decode \> \~/.kube/lke-config |
| :---- |

4. Once you have the kubeconfig file saved, access your cluster by using kubectl and specifying the file:

| $ kubectl get no \--kubeconfig \~/.kube/lke-config  NAME                            STATUS   ROLES    AGE   VERSION lke292179-482071-0f646b210000   Ready    \<none\>   33s   v1.31.0 lke292179-482071-119038ec0000   Ready    \<none\>   38s   v1.31.0 lke292179-482071-354f1bb10000   Ready    \<none\>   35s   v1.31.0 |
| :---- |

| Note: Optionally, to avoid specifying \--kubeconfig \~/.kube/lke-config with every kubectl command, you can set an environment variable for your current terminal window session. $ export KUBECONFIG=\~/.kube/lke-config  Then run: $ kubectl get no  |
| :---- |

## Step 3: Setup RabbitMQ on LKE

[Guidance](https://www.rabbitmq.com/blog/2020/08/10/deploying-rabbitmq-to-kubernetes-whats-involved) from the RabbitMQ maintainers recommends *not* handling the installation of RabbitMQ on Kubernetes directly, but instead using the following RabbitMQ tools to streamline its management on Kubernetes:

* [**Cluster Kubernetes Operator**](https://www.rabbitmq.com/kubernetes/operator/operator-overview#cluster-operator): Handles the automation of provisioning, management, and operation of RabbitMQ clusters on Kubernetes.  
* [**Messaging Topology Operator**](https://www.rabbitmq.com/kubernetes/operator/operator-overview#topology-operator): Manages the messaging topologies within a RabbitMQ cluster that has been deployed using the RabbitMQ Cluster Kubernetes Operator.

These operators are extensions to the Kubernetes management tooling and take advantage of the Kubernetes API. This guide focuses on the RabbitMQ Cluster Kubernetes Operator for deploying RabbitMQ, utilizing native RabbitMQ tooling for management and configuration. The Cluster Kubernetes Operator provides the following key features:

* Provisioning of single-node and multi-node RabbitMQ clusters  
* Reconciliation of deployed clusters when the existing state does not match the declarative state  
* Monitoring of RabbitMQ clusters  
* Scaling up and automated upgrades

### Install the RabbitMQ Cluster Kubernetes Operator

With your LKE cluster provisioned and the KUBECONFIG environment variable set to \~/.kube/lke-config, install the Cluster Kubernetes Operator with the following command:

| $ kubectl apply \-f \\https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml  namespace/rabbitmq-system created customresourcedefinition.apiextensions.k8s.io/rabbitmqclusters.rabbitmq.com created serviceaccount/rabbitmq-cluster-operator created role.rbac.authorization.k8s.io/rabbitmq-cluster-leader-election-role created clusterrole.rbac.authorization.k8s.io/rabbitmq-cluster-operator-role created clusterrole.rbac.authorization.k8s.io/rabbitmq-cluster-service-binding-role created rolebinding.rbac.authorization.k8s.io/rabbitmq-cluster-leader-election-rolebinding created clusterrolebinding.rbac.authorization.k8s.io/rabbitmq-cluster-operator-rolebinding created deployment.apps/rabbitmq-cluster-operator created |
| :---- |

To verify, list all the resources within the rabbitmq-system namespace.

| $ kubectl get all \-n rabbitmq-system NAME                                        READY STATUS   RESTARTS   AGEpod/rabbitmq-cluster-operator-779cb-g699f   1/1   Running  0          3m13sNAME                                       READY UP-TO-DATE AVAILABLE AGEdeployment.apps/rabbitmq-cluster-operator  1/1   1          1         3m13sNAME                                            DESIRED CURRENT READY AGEreplicaset.apps/rabbitmq-cluster-operator-779cb 1       1       1     3m14s |
| :---- |

### Install RabbitMQ

Next, install RabbitMQ on this cluster. To do that, a configuration is needed that specifies what the declarative state of the cluster will be. A basic example of a working configuration is:

| apiVersion: rabbitmq.com/v1beta1 kind: RabbitmqCluster metadata:   name: rabbitmq-basic spec:   service:     type: NodePort |
| :---- |

Store the above definition in a file called rabbitmq-basic.yaml. Then, apply this configuration to your LKE cluster.

| $ kubectl apply \-f ./rabbitmq-basic.yamlrabbitmqcluster.rabbitmq.com/rabbitmq-basic created |
| :---- |

### Verify successful installation

Confirm that RabbitMQ was installed by showing the resources that have been provisioned.

| $ kubectl get all NAME                          READY   STATUS     RESTARTS   AGEpod/rabbitmq-basic-server-0   0/1     Init:0/1   0          39sNAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                        AGEservice/kubernetes             ClusterIP   10.128.0.1      \<none\>        443/TCP                        15mservice/rabbitmq-basic         ClusterIP   10.128.120.69   \<none\>        5672:31825/TCP,15672:30153/TCP,15692:31520/TCP   39sservice/rabbitmq-basic-nodes   ClusterIP   None            \<none\>        4369/TCP,25672/TCP             39sNAME                                     READY   AGEstatefulset.apps/rabbitmq-basic-server   0/1     39sNAME                                          ALLREPLICASREADY   RECONCILESUCCESS   AGErabbitmqcluster.rabbitmq.com/rabbitmq-basic   True              True            40s |
| :---- |

![][image2]

The HTTP interface for RabbitMQ is exposed on port 15672. By specifying the NodePort service in rabbitmq-basic.yaml, this port is exposed on the LKE cluster at port 30153. Similarly the AQMP protocol, which runs through port 5672, is exposed on the LKE cluster at port 31825. Note that the ports shown in the example above may not match your specific LKE setup.

To view the logs from the pod listed in the output above, run:

| $ kubectl logs rabbitmq-basic-server-0 Defaulted container "rabbitmq" out of: rabbitmq, setup-container (init)… \#\#  \#\#      RabbitMQ 3.13.7  \#\#  \#\#  \#\#\#\#\#\#\#\#\#\#  Copyright (c) 2007-2024 Broadcom Inc and/or its subsidiaries  \#\#\#\#\#\#  \#\#  \#\#\#\#\#\#\#\#\#\#  Licensed under the MPL 2.0. Website: https://rabbitmq.com…  Starting broker...2024-12-18 15:50:34.914985+00:00 \[info\] \<0.254.0\> …2024-12-18 15:50:38.290177+00:00 \[info\] \<0.683.0\> Ready to start client connection listeners2024-12-18 15:50:38.292751+00:00 \[info\] \<0.850.0\> started TCP listener on \[::\]:5672 completed with 7 plugins.… 2024-12-18 15:50:38.484024+00:00 \[info\] \<0.9.0\> Time to start RabbitMQ: 6324 ms |
| :---- |

If you see the Time to start RabbitMQ line in the log output, this indicates a successful startup of the application.

## Step 4: Access RabbitMQ Remotely

To access the management console, you will need the auto-generated credentials of the default admin user. Use the following two commands:

| $ kubectl get secret rabbitmq-basic-default-user \\     \-o jsonpath='{.data.username}' \\     | base64 \--decode default\_user\_dS\_gWwwjtIEIiMcqdwu$ kubectl get secret rabbitmq-basic-default-user \\     \-o jsonpath='{.data.password}' \\     | base64 \--decode yOOO7ESTmh0DuCBbxz2IWaDGM-YafXSZ |
| :---- |

To set the default username and password upon creation of the RabbitMQ servers, modify rabbitmq-basic.yaml to add the additional configuration.

| apiVersion: rabbitmq.com/v1beta1 kind: RabbitmqCluster metadata:   name: rabbitmq-basic spec:   service:     type: NodePort     additionalConfig: |         default\_user=\<USERNAME\>         default\_pass=\<PASSWORD\> |
| :---- |

### Locate the external IP address of the LKE cluster

| $ kubectl get nodes \\     \-o wide \\     | awk \-v OFS='\\t\\t' '{print $1, $6, $7}' NAME                            INTERNAL-IP      EXTERNAL-IPlke292179-482071-0f646b210000	  192.168.143.176  172.235.141.144lke292179-482071-119038ec0000	  192.168.143.120	 172.235.141.24lke292179-482071-354f1bb10000	  192.168.143.239  172.235.141.151 |
| :---- |

The external IP address for one of the LKE nodes is 172.235.141.144. Recall from the earlier kubectl get all command that port 30153 at the cluster level routes to HTTP access to the RabbitMQ server. Therefore, the RabbitMQ management service can be found at 172.235.141.144:30153.

Run the following command to retrieve the current RabbitMQ configuration as a JSON object. Paste in the admin username and password that you obtained above.

| $ curl \\    \--user     default\_user\_dS\_gWwwjtIEIiMcqdwu:yOOO7ESTmh0DuCBbxz2IWaDGM-YafXSZ \\    172.235.141.144:30153/api/overview \\    | jq{  "management\_version": "3.13.7",  "rates\_mode": "basic",  ...    "product\_version": "3.13.7",  "product\_name": "RabbitMQ",  "rabbitmq\_version": "3.13.7",  "cluster\_name": "rabbitmq-basic",  "erlang\_version": "26.2.5.6",  … |
| :---- |

To access RabbitMQ admin in a web GUI, open a browser and navigate to [http://172.235.141.144:30153/\#/](http://172.235.141.144:30153/#/).

![][image3]

At the initial login prompt, supply the admin username and password.

![][image4]

## Step 5: Test RabbitMQ with a Messaging Example

To test the RabbitMQ deployment with a messaging example, first download the management script.

| $ wget http://172.235.141.144:30153/cli/rabbitmqadmin |
| :---- |

Make the script executable, and move it somewhere to a location included in the environment PATH.

| $ chmod \+x rabbitmqadmin $ mv rabbitmqadmin /usr/local/bin/ |
| :---- |

### Create exchange and queue

The subsequent calls to rabbitmqadmin will need to include admin authentication as well as the host and port information for RabbitMQ. For convenience, set these values as environment variables in your terminal window. This will look similar to the following:

| $ export USERNAME=default\_user\_dS\_gWwwjtIEIiMcqdwu$ export PASSWORD=yOOO7ESTmh0DuCBbxz2IWaDGM-YafXSZ $ export HOST=172.235.141.144$ export PORT=30153 |
| :---- |

Create a fanout style exchange on the RabbitMQ server with the following.

| $ rabbitmqadmin \\     \--username=$USERNAME \--password=$PASSWORD \\     \--host=$HOST \--port=$PORT \\     declare exchange \\     name=test\_fanout\_exchange \\     type=fanout exchange declared |
| :---- |

Create a queue to attach to this exchange to hold messages.

| $ rabbitmqadmin \\     \--username=$USERNAME \--password=$PASSWORD \\     \--host=$HOST \--port=$PORT \\     declare queue \\     name=fanout\_queue \\     durable=true queue declared |
| :---- |

Bind the queue to the exchange.

| $ rabbitmqadmin \\     \--username=$USERNAME \--password=$PASSWORD \\     \--host=$HOST \--port=$PORT \\     declare binding \\     source=test\_fanout\_exchange \\     destination=fanout\_queue binding declared |
| :---- |

### Test message publishing and retrieval

Publish a message to the exchange (and bound queue):

| $ rabbitmqadmin \\     \--username=$USERNAME \--password=$PASSWORD \\     \--host=$HOST \--port=$PORT \\     publish \\     exchange=test\_fanout\_exchange \\     routing\_key=dummy\_key \\     payload="Hello, world\!" Message published |
| :---- |

The routing key is not necessary for a fanout exchange, as each message is routed to each queue regardless of the routing key, but it is required for the rabbitmqadmin tool. 

Retrieve the messages from the queue.

| $ rabbitmqadmin \\     \--username=$USERNAME \--password=$PASSWORD \\     \--host=$HOST \--port=$PORT \\     get \\     queue=fanout\_queue  \+-------------+----------------------+---------------+---------------+---------------+------------------+------------+-------------+ | routing\_key |       exchange       | message\_count |    payload    | payload\_bytes | payload\_encoding | properties | redelivered | \+-------------+----------------------+---------------+---------------+---------------+------------------+------------+-------------+ | dummy\_key   | test\_fanout\_exchange | 0             | Hello, world\! | 13            | string           |            | False       | \+-------------+----------------------+---------------+---------------+---------------+------------------+------------+-------------+ |
| :---- |

![][image5]

## Step 6: Create New Users

When connecting applications to your new RabbitMQ deployment, you may want to create and use RabbitMQ users other than the [default administrative user](https://www.rabbitmq.com/docs/access-control#default-state).

In the RabbitMQ web interface, click the **Admin** tab. This will show the list of users, which currently only includes the default admin user.

![][image6]

Provide a username and password for the new user. Then, add any tags to specify the user’s level of permissions.

![][image7]

Click **Add user**. The user will be added to the list of users, but you will see that it does not yet have access to any virtual hosts.

![][image8]

### Set permissions for the user on the virtual host

Click the name of the newly created user. Allow full permissions on the default virtual host (which is /). Click **Set permission**.

![][image9]

Verify that this newly created user has RabbitMQ management access by logging out and logging in as the new user.

![][image10]

### Send test requests to the RabbitMQ API

Using curl, send an authenticated request to the RabbitMQ API, testing out the publishing of a message to an exchange. Note the %2f in the request URL. This is the name of the exchange, which is the URL-encoded value for /.

The requests below assume that the terminal session still uses the environment variables, HOST and PORT, which were set previously.

| $ curl \\     \-u linodeuser:mypassword \\     \-H "Content-Type: application/json" \\     \-X POST \\     \-d '{"properties":{},"routing\_key":"dummy\_key","payload":"Hello, curl\!","payload\_encoding":"string"}' \\     http://$HOST:$PORT/api/exchanges/%2f/test\_fanout\_exchange/publish {"routed":true} |
| :---- |

Next, send an authenticated request to get the last two messages from the queue.

| $ curl \\   \-u linodeuser:mypassword \\   \-H "Content-type:application/json" \\   \-X POST \\   \-d '{"count":2,"ackmode":"ack\_requeue\_true","encoding":"auto"}' \\   http://$HOST:$PORT/api/queues/%2f/fanout\_queue/get | json\_pp \[    {       "exchange" : "test\_fanout\_exchange",       "message\_count" : 1,       "payload" : "Hello, world\!",       "payload\_bytes" : 13,       "payload\_encoding" : "string",       "properties" : \[\],       "redelivered" : true,       "routing\_key" : "dummy\_key"    },    {       "exchange" : "test\_fanout\_exchange",       "message\_count" : 0,       "payload" : "Hello, curl\!",       "payload\_bytes" : 12,       "payload\_encoding" : "string",       "properties" : \[\],       "redelivered" : true,       "routing\_key" : "dummy\_key"    } \] |
| :---- |

The resources below are provided to help you become familiar with RabbitMQ when deployed to LKE on Linode.

## RabbitMQ Resources

* [RabbitMQ Kubernetes Operators](https://www.rabbitmq.com/kubernetes/operator/operator-overview)  
* [Production RabbitMQ Operator Configuration](https://github.com/rabbitmq/cluster-operator/tree/main/docs/examples/production-ready)  
* [RabbitMQ Message Topology Operator](https://www.rabbitmq.com/kubernetes/operator/install-topology-operator)  
* [Configuration Documentation](https://www.rabbitmq.com/docs/configure)  
* [Deployment Checklist](https://www.rabbitmq.com/docs/production-checklist)  
* [Plugins](https://www.rabbitmq.com/docs/plugins)  
* [Management CLI](https://www.rabbitmq.com/docs/management-cli)  
* [RabbitMQ Linode Marketplace App](https://www.linode.com/marketplace/apps/linode/rabbitmq/)