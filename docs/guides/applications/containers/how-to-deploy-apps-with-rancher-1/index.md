---
slug: how-to-deploy-apps-with-rancher-1
description: 'This guide shows how to use the open source Rancher platform to deploy applications and containers to remote hosts.'
keywords: ["rancher", "docker", "kubernetes", "container"]
tags: ["container","docker","kubernetes"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-29
modified: 2018-01-16
modified_by:
  name: Linode
title: 'How to Deploy Apps with Rancher'
external_resources:
  - '[Rancher Official Docs](http://rancher.com/docs/)'
deprecated: true
deprecated_link: applications/containers/how-to-deploy-apps-with-rancher/
aliases: ['/applications/containers/how-to-deploy-apps-with-rancher-1/']
authors: ["Angel Guarisma"]
---

## What is Rancher?

Rancher is a tool that streamlines container usage on a host. Rancher sits on top of Docker and Kubernetes, giving you the ability to stand up clusters of containers with the push of a button. The web front-end gives the you and your users access to an impressive catalog of ready-to-go containerized tools that can be deployed from within Rancher.

This guide shows you how to install [Rancher](http://rancher.com/quick-start/), then deploy services with Docker and Kubernetes.

## Prepare the Environment

Two Docker containers are needed to run Rancher:

* `rancher/server` hosts the front-end portal, and

* `rancher/agent` connects remote hosts with the Rancher server.

In this guide both of these containers will be run on the same Linode. If you would like to add additional Linodes as Rancher agents, you will need to install Docker on each Linode.

### Install Docker CE

You will need a Linode with Docker CE installed to follow along with the steps in this guide. Rancher uses specific versions of Docker to interface with Kubernetes.

    curl https://releases.rancher.com/install-docker/17.03.sh | sh

### Modify Permissions

Add the user to the `docker` group, so that Docker commands can be run without `sudo`:

    usermod -aG docker $USER

## Install Rancher

1.  Launch the Rancher container:

        sudo docker run -d --restart=unless-stopped -p 8080:8080 rancher/server:stable

2.  Verify that Rancher is running:

        curl -I localhost:8080

    {{< output >}}
HTTP/1.1 200 OK
{{< /output >}}

        docker ps

    {{< output >}}
60e73830a1bb        rancher/server:stable   "/usr/bin/entry /usr…"   5 minutes ago       Up 5 minutes        3306/tcp, 0.0.0.0:8080->8080/tcp   objective_meninsky
{{< /output >}}

## Deploy Apps with Rancher

The applications in Rancher's catalog are Dockerfiles. These Dockerfiles are viewable and editable from within Rancher. The DockerFiles define the *stack*, or the fleet of individual containers necessary to bring up a service, and groups them in one place.

### Add a Host

In order for Rancher to deploy containers on remote hosts, each host must be registered with the Rancher server. This guide will use the Linode running the Rancher server as the host, but any number of Linodes can be added using the these steps.

1.  In a browser, navigate to `yourLinodesIP:8080` to view the Rancher landing page:

    ![Rancher first screen](rancher-first-screen.png "Rancher first screen")

2.  A banner at the top of the screen will prompt you to add a host. Click **Add a host** to begin this process.

    ![Rancher Host Register](register-host.png "Rancher Host Register")

3.  Enter your Linode's IP address into the box in Item 4. This will customize the registration command in item 5 for your system. Copy this command and run it from the command line.

4.  Run `docker-ps` after the registration process to verify that `rancher/agent` is running on the host:

    {{< output >}}
CONTAINER ID        IMAGE                   COMMAND                  CREATED             STATUS                          PORTS                              NAMES
a16cd00943fc        rancher/agent:v1.2.7    "/run.sh run"            3 minutes ago       Restarting (1) 43 seconds ago                                      rancher-agent
60e73830a1bb        rancher/server:stable   "/usr/bin/entry /usr…"   3 hours ago         Up 3 hours                      3306/tcp, 0.0.0.0:8080->8080/tcp   objective_meninsky
{{</ output >}}

5.  Go back to the Rancher web application and press **Close**. You will be taken to the catalog, where Rancher lists all of the applications that can be installed through the platform:

    ![Rancher Catalog](catalog.png "Rancher Catalog")

### Install the Ghost Blogging Engine

As an example, install the Ghost blog platform. This will showcase Rancher's interaction with Docker.

1.  In the catalog, select Ghost, leave the default settings and click the create button.

    ![Ghost screen](rancher-ghost.png "Ghost screen")

2.  Query your Linode with `docker ps`, and Docker will show what containers are running on the machine:

        144d0a07c315        rancher/pause-amd64@sha256:3b3a29e3c90ae7762bdf587d19302e62485b6bef46e114b741f7d75dba023bd3                  "/pause"                 44 seconds ago       Up 42 seconds                                          k8s_rancher-pause_ghost-ghost-1-c9fb3da6_default_afe1ff4d-f7ce-11e7-a624-0242ac110002_0
        fddce07374a0        ghost@sha256:77b1b1cbe16ae029dee383e7bd0932bd2ca0bd686e206cb1abd14e84555088d2                                "docker-entrypoint..."   44 seconds ago       Up 43 seconds

3.  Navigate to your Linode's IP address from the browser for the Ghost landing page.

    You have just used Rancher to deploy a containerized Ghost service.

4.  In the Rancher interface, click on the Ghost container:

    ![Rancher Options](rancher-options.png "Rancher Options")

    This page monitors performance, and offers you options to manage each individual container. Everything from spawning a shell within the container, to changing environment variables can be handled from within this page. To remove the application on the Apps screen, click **Delete**.

### Launch Services From Rancher

You can launch individual custom containers with Rancher in the **Containers** section of the application:

![Rancher Config](rancher-container-config.png "Rancher Config")
