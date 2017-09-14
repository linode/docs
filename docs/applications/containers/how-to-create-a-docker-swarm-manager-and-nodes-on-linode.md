---
author:
  name: Linode Community
  email: docs@linode.com
contributor:
  name: Jack Wallen
  link: https://twitter.com/jlwallen
description: 'This guide shows you how to use Linode to create a Docker Swarm Manager and deploy a service to several Nodes.'
keywords: 'docker,container,docker swarm,swarm manager,swarm nodes'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Monday, September 18, 2017
modified_by:
  name: Linode
published: 'Monday, September 18, 2017'
title: 'How to Create a Docker Swarm Manager and Nodes on Linode'
external_resources:
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Docker Hub](https://hub.docker.com/)'
---

![How to Create a Docker Swarm Manager and Nodes on Linode](/docs/assets/docker/create-a-docker-swarm-manager.jpg "How to Create a Docker Swarm Manager and Nodes on Linode")

Scale up the power of Docker by creating a cluster of Docker hosts, called a Docker Swarm. All you need is one Linode to serve as a Docker Swarm Manager and a few Docker hosts to join the Swarm as Nodes.

In this guide, you'll set up a Docker Swarm Manager and connect Nodes for a scalable container roll out. This requires multiple Linodes with Docker installed and running in the same datacenter. They don't need to be running the same distribution.

## Create the Docker Swarm Manager

The Docker Swarm Manager’s purpose is to receive commands on behalf of the cluster and assign containers to nodes. The Swarm Manager uses the Raft Consensus Algorithm to manage a Swarm state. The Raft Consensus Algorithm ensures that all manager nodes that are in charge of managing and scheduling tasks in a cluster are storing the same, consistent state. Should a failure occur, any single node can assume the tasks and restore a stable state.

In this guide, we create a single Swarm Manager. If your goal is high-availability, you can create multiple managers.

1.  Log in to the Linode you've chosen for Swarm manager and initialize the manager. Replace `PUBLIC_IP` in this example with your Linode's [public IP address](/docs/networking/linux-static-ip-configuration):

        docker swarm init --advertise-addr PUBLIC_IP

    Docker responds with the command necessary for the nodes to join the Swarm:

    ![Command to join Docker Swarm](/docs/assets/docker/dockerswarm-join.jpg "Command to join Docker Swarm")

2.  Use `docker info` to verify that your Swarm is running and active:

        docker info

    ![Swarm is running and active](/docs/assets/docker/dockerswarm-active.jpg "Swarm is running and active")

## Join Nodes to the Manager

In Step 1 of the previous section, The `docker swarm init` command outputs instructions on how to join the Manager. It follows the following structure:

    docker swarm join --token TOKEN PUBLIC_IP:2377

Where `TOKEN` is the long string of characters presented to you when you initialized the Swarm and `PUBLIC_IP` is the public-facing IP address of your Swarm Manager Linode. If you don’t remember the token, run `join-token` on the Manager to view the information from the `swarm init` command:

    docker swarm join-token manager

1.  To join the Node to the Swarm, run `docker swarm join` from the Node. Change `TOKEN` to the token from Step 1 in the previous section, and `PUIBLIC_IP` to the Manager's public IP:

        docker swarm join --token TOKEN PUBLIC_IP:2377

    The output shows that the node has joined the swarm as a worker. You now have a small Docker Swarm cluster, with one Manager and one Node:

    ![Node has joined the swarm as a worker](/docs/assets/docker/swarm-joined-as-worker.jpg "Node has joined the swarm as a worker")

2.  Use Step 1 to join as many Nodes to the Swarm as needed.

3.  On the Manager, use `docker nodes ls` to view information about the Manager and a list of all Nodes:

        docker nodes ls

## Deploy a Service with Swarm

To deploy a service with Docker Swarm, use the Manager to prepare a single node, then *scale* the configuration to match your needs. In this example, we install nginx on one node, then scale it to a swarm of three nodes.

1.  From the Swarm Manager, use `service create` to deploy a service to a node. Change `nginxexample` to whatever you like:

        docker service create -p 80:80 --name nginxexample nginx

2.  Scale the nginx service to three nodes:

        docker service scale nginxexample=3

3.  Verify that the service has been deployed with `docker ps -a` from any node:

        docker ps -a

4.  To stop the `nginxexample` service, use the `service remove` command:

        docker service remove nginxexample
