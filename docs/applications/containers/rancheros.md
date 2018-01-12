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
title: 'Using Rancher'
external_resources:
  - '[Link Title 1](http://www.example.com)'
  - '[Link Title 2](http://www.example.net)'
---

Rancher is tool that streamlines container usuage on a host. Rancher is a lair of abstraction that sits on top of Docker and Kubernetes, giving you the ability to stand up clusters of containers with the push of a button. The web front-end gives the user access to an impressive catalog of ready-to-go containerized tools that can be deployed instantly from within Rancher. This guide will walk you through installing [Rancher](http://rancher.com/quick-start/), and then deploying services with Docker and Kubernetes. 


## Prepare the Environment
Rancher Server is installed using Docker, the entire project is run on two containers, the first container functions are the host, the second as the node. Before installing Rancher you have to install Docker:

### Install Docker CE

You will need a Linode with Docker CE installed to follow along with the steps in this guide. Rancher uses specific versions of Docker to interface with Kubernetes. 

    curl https://releases.rancher.com/install-docker/17.03.sh | sh


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

#### Installing the Ghost Blogging Engine

As an example, install the Ghost blog platform. This will showcase Rancher's interaction with Docker. In the catalog, select Ghost, leave the default settings and click the create button. 

![wordpress screen](/docs/assets/Rancher/rancher_ghost.png)

Now, query your Linode with `docker ps`, and you Docker will show you what containers are now working on the machine:

    
    144d0a07c315        rancher/pause-amd64@sha256:3b3a29e3c90ae7762bdf587d19302e62485b6bef46e114b741f7d75dba023bd3                  "/pause"                 44 seconds ago       Up 42 seconds                                          k8s_rancher-pause_ghost-ghost-1-c9fb3da6_default_afe1ff4d-f7ce-11e7-a624-0242ac110002_0
    fddce07374a0        ghost@sha256:77b1b1cbe16ae029dee383e7bd0932bd2ca0bd686e206cb1abd14e84555088d2                                "docker-entrypoint..."   44 seconds ago       Up 43 seconds

Finally, navigating to the ip address of your Linode from the browser will result in the Ghost landing page. You have just used Rancher to deploy a containered Ghost service.

Clicking on the Ghost container in Rancher will take you to this screen:

![Rancher Options](/docs/assets/Rancher/rancher_options.png)

This page monitors performance, and offers you options to manage each individual containe. Everything from spawning a shell within the container, to changing environment variables can be handled from within this page. Remove the application on the Apps screen by pressing **Delete**

The applications in Rancher's catalog are Dockerfiles, these Dockerfiles are viewable and editable from within Rancher. The DockerFiles define the "stack", or the fleet of individual containers neccesary to bring up a service, and groups them in one place.

![Rancher Stacks](/docs/assets/Rancher/rancher_stack.png)


#### Launching Services From Rancher

You can launch individual custom containers with Rancher in the **containers** section of the application:

![rancher config](/docs/assets/Rancher/rancher_container_config.png)



