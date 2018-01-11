---
author:
  name: Angel
  email: docs@linode.com
description: 'Two to three sentences describing the purpose of the guide.'
keywords: ["list", "of", "keywords", "and key phrases"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-29
modified: 2017-11-30
modified_by:
  name: Linode
title: 'Deploying Kubernetes Clusters with Rancher '
external_resources:
  - '[Link Title 1](http://www.example.com)'
  - '[Link Title 2](http://www.example.net)'
---

Rancher is tool that streamlines container usuage on a host. Rancher is a lair of abstraction that sits on top of Docker and Kubernetes, giving you the ability to stand up clusters of containers with the push of a button. The web front-end gives the user access to an impressive catalog of ready-to-go containerized tools that can be deployed instantly from within Rancher. This guide will walk you through installing [Rancher](http://rancher.com/quick-start/), and then deploying services with Docker and Kubernetes. 


## Prepare the Environment
Rancher Server is installed using Docker, the entire project is run on two containers, the first container functions are the host, the second as the node. Before installing Rancher you have to install Docker:

### Install Docker CE

You will need a Linode with Docker CE installed to follow along with the steps in this guide.

{{< section file="/shortguides/docker/install_docker_ce.md" >}}

### Install Docker Compose

{{< section file="/shortguides/docker/install_docker_compose.md" >}}


### Modify Permissions

Add the user to the `docker` group, so that Docker can run as intended:

    usermod -aG docker $USER
    
### Install Rancher 

Rancher is launched using Docker, and runs as a container.

    sudo docker run -d --restart=unless-stopped -p 8080:8080 rancher/server:stable

After running the command, Docker will begin to pull the Rancher image, and initiate the containers. Running `curl -I localhost:8080`, should return an `HTTP/1.1 200 OK` response and the `docker ps` command should return a variation of this:

    60e73830a1bb        rancher/server:stable   "/usr/bin/entry /usr…"   5 minutes ago       Up 5 minutes        3306/tcp, 0.0.0.0:8080->8080/tcp   objective_meninsky

Furthermore, navigating to `<your_linodes_ip>:8080` will bring you to this page:

![Rancher-first-screen](/docs/assets/Rancher/rancher_first_screen.png)

### Using Rancher

Rancher lists various applications that are avaibile through the platform in the catalog. The first thing you have to do is register your Host with Rancher. 


![Rancher-Host-Register](/docs/assets/register_host.png)

Enter, your Linode's IP address into the box in number 4, and copy the registration command to your Linode in the shell:


    sudo docker run --rm --privileged -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/rancher:/var/lib/rancher rancher/agent:v1.2.7 http://1.1.1.1:8080/v1/scripts/27A53F2DD64845F46731:1514678400000:XjuABKlOdVl4yoo4J4JTlVmwmc

Rancher will then attempt to register your machine as the host. Running `docker-ps` after the registration will show a similar output to this:

{{< output >}}
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS                          PORTS                              NAMES
a16cd00943fc        rancher/agent:v1.2.7    "/run.sh run"            3 minutes ago       Restarting (1) 43 seconds ago                                      rancher-agent
60e73830a1bb        rancher/server:stable   "/usr/bin/entry /usr…"   3 hours ago         Up 3 hours                      3306/tcp, 0.0.0.0:8080->8080/tcp   objective_meninsky
{{</ output >}}

Go back to the Rancher web application and press the **close** button. 

You will be taken to the catalog, where Rancher lists all of the applications that can be installed from the platform:

![Rancher Catalog](/docs/assets/Rancher/catalog.png)

#### Installing Wordpress with Rancher

In the catalog, find the Wordpress icon, and click it. Configure the appropriate settings, and press launch. 

![wordpress screen](/docs/assets/Rancher/wordpress_screen.png)
![wordpress config](/docs/assets/Rancher/wordpress_config.png)


