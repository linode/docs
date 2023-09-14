---
slug: how-to-create-a-docker-swarm-manager-and-nodes-on-linode
description: "In this guide, we'll show you how to create and run a Docker Swarm - and thereby manage a Docker cluster - on Linode."
keywords: ["docker", "container", "docker swarm", "swarm manager", "swarm nodes"]
tags: ["ubuntu","container","docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-09-28
modified_by:
  name: Linode
published: 2017-09-18
title: "Create a Docker Swarm Manager and Nodes on Linode"
external_resources:
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Docker Hub](https://hub.docker.com/)'
aliases: ['/applications/containers/how-to-create-a-docker-swarm-manager-and-nodes-on-linode/']
authors: ["Jack Wallen"]
---

![How to Create a Docker Swarm Manager and Nodes on Linode](create-a-docker-swarm-manager.jpg "How to Create a Docker Swarm Manager and Nodes on Linode")

## Before You Begin

1.  Completing this guide will require at least two Linodes located in the same data center. The instructions in this guide were written for Ubuntu 16.04, but other distributions can be used; the Linodes do not need to use the same distribution.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

3. Install Docker on each Linode. See our [Installing Docker and Deploying a LAMP Stack](/docs/guides/how-to-install-docker-and-deploy-a-lamp-stack/) guide or the [Docker installation docs](https://docs.docker.com/engine/installation/) for more information.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

Scale up the power of Docker by creating a cluster of Docker hosts, called a Docker Swarm. You need one Linode to serve as a Docker Swarm Manager and a few Docker hosts to join the Swarm as Nodes.

In this guide, you'll set up a Docker Swarm Manager and connect Nodes for a scalable container deployment. This requires multiple Linodes with Docker installed and running in the same data center. They don't need to be running the same distribution.

## Create the Docker Swarm Manager

The Docker Swarm Manager’s purpose is to receive commands on behalf of the cluster and assign containers to nodes. The Swarm Manager uses the Raft Consensus Algorithm to manage Swarm states. The Raft Consensus Algorithm ensures that all manager nodes that are in charge of managing and scheduling tasks in a cluster are storing the same, consistent state. Should a failure occur, a single node assumes the tasks and restores the stable state.

In this guide, we create a single Swarm Manager. If your goal is high-availability, you can create multiple managers.

1.  Log in to the Linode you've chosen for Swarm manager and initialize the manager. Replace `PUBLIC_IP` in this example with your Linode's [public IP address](/docs/products/compute/compute-instances/guides/manual-network-configuration/):

        docker swarm init --advertise-addr PUBLIC_IP

    Docker responds with the command necessary for the nodes to join the Swarm:

    ![Command to join Docker Swarm](dockerswarm-join.jpg "Command to join Docker Swarm")

2.  Use `docker info` to verify that your Swarm is running and active:

        docker info

    ![Swarm is running and active](dockerswarm-active.jpg "Swarm is running and active")


## Join Nodes to the Manager

In Step 1 of the previous section, The `docker swarm init` command outputs instructions on how to join the manager.

    docker swarm join --token TOKEN PUBLIC_IP:2377

Where `TOKEN` is the long string of characters presented to you when you initialized the Swarm, and `PUBLIC_IP` is the public-facing IP address of your Swarm Manager Linode. If you don’t remember the token, run `join-token` on the manager to view the information from the `swarm init` command:

    docker swarm join-token worker

1.  To join the node to the Swarm, run `docker swarm join` from the node. Change `TOKEN` to the token from Step 1 in the previous section, and `PUIBLIC_IP` to the manager's public IP:

        docker swarm join --token TOKEN PUBLIC_IP:2377

    The output shows that the node has joined the swarm as a worker. You now have a small Docker Swarm cluster, with one manager and one node:

    ![Node has joined the swarm as a worker](swarm-joined-as-worker.jpg "Node has joined the swarm as a worker")

2.  Repeat Step 1 to join as many nodes to the Swarm as needed.

3.  On the manager, use `docker node ls` to view information about the manager and a list of all nodes:

        docker node ls

## Deploy a Service with Docker Swarm

To deploy a service with Docker Swarm, use the manager to prepare a single node, then *scale* the configuration to match your needs. In this example, you will install NGINX on one node, then scale it to a cluster (swarm) of three nodes.

1.  From the Swarm Manager, use `service create` to deploy a service to a node. Change `nginxexample` to whatever you like:

        docker service create -p 80:80 --name nginxexample nginx

2.  Scale the NGINX service to three nodes:

        docker service scale nginxexample=3

3.  Verify that the service has been deployed with `docker ps -a` from any node:

        docker ps -a

4.  To stop the `nginxexample` service, use the `service remove` command:

        docker service remove nginxexample
