---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to get Consul (Service discovery) running for Docker.'
keywords: 'container,docker,consul,service discovery'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['applications/containers/get-consul-working-for-docker/']
modified: Thursday, May 26th, 2016
title: 'How to get Consul (Service Discovery) running for Docker'
contributor:
    name: Sang Le
    link: https://twitter.com/sanglt
external_resources:
 - '[Docker Hub](https://hub.docker.com/)'
 - '[Consul by HashiCorp](https://www.consul.io)'
 - '[Docker Swarm](https://www.docker.com/products/docker-swarm)'
 - '[Registrator](http://gliderlabs.com/registrator)'
 - '[Consul Health](https://consul.io/docs/agent/checks.html)'
 - '[Circuit Breaker](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern)'
 - '[consul-template](https://github.com/hashicorp/consul-template)'

---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

With the advent of modern [microservices-based architectures](https://medium.com/aws-activate-startup-blog/using-containers-to-build-a-microservices-architecture-6e1b8bacb7d1), many applications are now deployed as a set of distributed components. In such architecture, there is a need to configure and coordinate the various applications running in multiple docker containers across multiple Linode instances

In the following post, I show how a tool called [Consul by HashiCorp](https://www.consul.io) can providing service discovery for a docker. I also provide an example application.

Its ready for work with [Docker Swarm](https://www.docker.com/products/docker-swarm) in case you want to running on multiple docker engine in multiple Linode instances.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Install Docker
You should follow the section **Install Docker** in guide [How to install Docker and deploy a LAMP Stack](/docs/applications/containers/how-to-install-docker-and-deploy-a-lamp-stack/)
Make sure you have docker up and running by running this command and its should have results:

    $ docker info | grep "Server Version"
    Server Version: 1.11.1

## Getting consul server
Now its time to get consul server running, with the ui for easy discovery

    $ docker run -d \
            --restart always \
            -p 8500:8500 \
            --name=consul \
            progrium/consul \
            -server \
            -bootstrap \
            -ui-dir /ui

{: .note}
>
>`-d` run in detached mode
>`--restart always` Always run this container, even docker has been restart
>`-p 8500:8500` This binding Consul's HTTP port to Linode address
>`--name=consul` Set the name of the container
>`progrium/consul` The name of the docker image to run
>`-server` Run consul as server mode
>`-bootstrap` We are starting a consul cluster (of one node) from scratch, rather than joining an existing cluster. We must bootstrap it.
>`-ui-dir /ui` Enable the consul ui, this docker image have ui source in /ui
   
{: .note}
>In this guide we run its in same server, in production, you may have at least 3 consul server.

## Getting registrator
Registrator automatically registers and deregisters services for any Docker container by inspecting containers as they come online

    $ docker run -d \
         --restart always \
         --name=registrator \
         --net=host \
         --volume=/var/run/docker.sock:/tmp/docker.sock \
         gliderlabs/registrator \
           consul://localhost:8500

{: .note}
>
>`-d` run in detached mode
>`--restart always` Always run this container, even docker has been restart
>`--name=registrator` Set the name of the container
>`--net=host` Run this container in hosts network
>`--volume=/var/run/docker.sock:/tmp/docker.sock` This mounts the docker daemon socket into the container, so it can monitor the API for start/stop events from other containers.
>`gliderlabs/registrator` The name of the docker image to run
>`consul://localhost:8500` Tell registrator that we’re using consul and to look for it on the bridge address


You can access the consul ui at http://your_linode_ip:8500/ui, we should have:
[![consul ui init](/docs/assets/1769-consul-ui-init_small.png)](/docs/assets/1769-consul-ui-init.png)

Or you can check it over REST:

    $ curl http://localhost:8500/v1/catalog/nodes
      [{"Node":"02fde2c62e87","Address":"172.17.0.5"}]

## Getting some service working
In real world, and with [microservices-based architectures](https://medium.com/aws-activate-startup-blog/using-containers-to-build-a-microservices-architecture-6e1b8bacb7d1) we will have many of containers running, and we may have 1 service but run in multiple containers (same image).
In this case, how can we find where is our service.

In this guide I will running 2 services name `order` and `customer` using image `dockercloud/hello-world`. When the container start, docker just map the port avaliable in host to port 80 in container.

    $ docker run -d -p 80 -e "NAME=order01" -e "SERVICE_80_NAME=order" dockercloud/hello-world
    $ docker run -d -p 80 -e "NAME=order02" -e "SERVICE_80_NAME=order" dockercloud/hello-world
    $ docker run -d -p 80 -e "NAME=customer01" -e "SERVICE_80_NAME=customer" dockercloud/hello-world
    $ docker run -d -p 80 -e "NAME=customer02" -e "SERVICE_80_NAME=customer" dockercloud/hello-world
    
I use same image here for the example, and this image can say hello to `NAME` in environment, so I use `-e "NAME=order01"`, so that container will tell we know what service + id its running. The `-e "SERVICE_80_NAME=order"` will tell registrator our service at port 80 have name `order`.
Look at the `-p 80` here, our service is http service and expose at port 80, we can't do the 1-1 mapping here because we may have multiple containers running on same machine like this case. So it just have 1 param, docker will get the available port in host and map it to this port in container.

Now, we should have those services in consul ui:
[![consul ui service](/docs/assets/1770-consul-ui-services_small.png)](/docs/assets/1770-consul-ui-services.png)

Cool! What about over REST?

    $ curl http://localhost:8500/v1/catalog/service/order?pretty
    [
        {
            "Node": "82f99a7f54b6",
            "Address": "172.17.0.5",
            "ServiceID": "moby:order01:80",
            "ServiceName": "order",
            "ServiceTags": null,
            "ServiceAddress": "",
            "ServicePort": 32775
        },
        {
            "Node": "82f99a7f54b6",
            "Address": "172.17.0.5",
            "ServiceID": "moby:elated_mayer:80",
            "ServiceName": "order",
            "ServiceTags": null,
            "ServiceAddress": "",
            "ServicePort": 32777
        }
    ]
    $ curl http://localhost:8500/v1/catalog/service/customer\?pretty
    [
        {
            "Node": "82f99a7f54b6",
            "Address": "172.17.0.5",
            "ServiceID": "moby:clever_leakey:80",
            "ServiceName": "customer",
            "ServiceTags": null,
            "ServiceAddress": "",
            "ServicePort": 32778
        },
        {
            "Node": "82f99a7f54b6",
            "Address": "172.17.0.5",
            "ServiceID": "moby:cranky_wozniak:80",
            "ServiceName": "customer",
            "ServiceTags": null,
            "ServiceAddress": "",
            "ServicePort": 32779
        }
    ]
    
So, the `ServicePort` is the post in your Linode, in this case I can access my `order` service at http://your_linode_ip:32775/ and http://your_linode_ip:32777/. You should see the message `Hello order01!` and `Hello order02!` when access its.
The `customer` should have message `Hello customer01!` and `Hello customer02!`. In short, its should return the value we input in `-e "NAME=` before.

## Next steps!
The next things we would want to do are:

- Get Consul working in a resilient cluster
- Set up [Consul Health](https://consul.io/docs/agent/checks.html) checks. This allows for Consul to monitor the health of your services, and can act as an easily configurable [Circuit Breaker](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern)
- Get Consul DNS service working for all containers. This allow each service can talking to each other by `[name].service.consul`
- Setup API Gateway. It can done by use [consul-template](https://github.com/hashicorp/consul-template)