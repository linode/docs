---
description: "This guide provides you with step-by-step instructions for deploying Docker, a tool which you can use to run containerized apps, from the Linode One-Click Marketplace."
keywords: ['docker','marketplace', 'container']
tags: ["container","cloud-manager","linode platform","docker","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified: 2022-04-01
image: Docker_oneclickapps.png
title: "Deploying Docker through the Linode Marketplace"
external_resources:
 - '[Docker Commands Cheat Sheet](/docs/guides/docker-commands-quick-reference-cheat-sheet/)'
 - '[Docker Documentation](https://docs.docker.com/)'
 - '[Play with Docker](https://training.play-with-docker.com/)'
 - '[Docker Hub](https://www.docker.com/products/docker-hub)'
aliases: ['/platform/marketplace/deploying-docker-with-marketplace-apps/', '/platform/one-click/deploying-docker-with-one-click-apps/','/guides/deploying-docker-with-one-click-apps/','/guides/deploying-docker-with-marketplace-apps/','/guides/docker-marketplace-app/']
---

[Docker](https://www.docker.com/) is a tool that enables you to create, deploy, and manage *containers*. Each container is a lightweight stand-alone package that containing the code, libraries, runtime, system settings, and dependencies that are required to run an application. Every container is deployed with its own CPU, memory, block I/O, and network resources, without having to depend upon an individual kernel and operating system. While it may be easiest to compare Docker to virtual machines, they differ in the way they share or dedicate resources.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Docker should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 11, Debian 10, and Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### Docker Options

- **Resource to Download**: The url to a hosted [Dockerfile](https://docs.docker.com/engine/reference/builder/) or [docker-compose.yml](/docs/guides/how-to-use-docker-compose/#Basic-Usage) file to be used to assemble an image as part of the application creation process.
- **Command to run**: A [Docker Command](/docs/guides/docker-commands-quick-reference-cheat-sheet/) to be run as part of the application creation process.


{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Do you need an MX record for this domain?** Select `Yes` to create a basic [MX record](/docs/networking/dns/dns-records-an-introduction/#mx) for the domain. Select `No` to create no MX records
- **Do you need an SPF record for this domain?** Select `Yes` to create a basic [SPF record](/docs/networking/dns/dns-records-an-introduction/#spf) for the domain. Select `No` to create no SPF records.

## Getting Started after Deployment

Docker is now installed and ready to use. The following steps provide a sample application to get you started with an easy example to demonstrate some basic Docker functionality. It is not necessary for Docker set-up.

### Deploy a Sample Application

After Docker has finished installing, you can access Docker from your terminal and deploy a sample application or any application that you intend on running.

1.  Log in to your Compute Instance via [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/) using the limited user account you may have created during deployment. If you do not yet have one, login as the `root` user and [create a limited user account](/docs/guides/set-up-and-secure/#add-a-limited-user-account).

1.  Locate the application or sample application you wish to deploy.

    - [Docker Hub](https://hub.docker.com/): Find official docker images, such as one for [NGINX](https://hub.docker.com/_/nginx), [Node.js](https://hub.docker.com/_/node), or the [Hello World](https://hub.docker.com/_/hello-world) test image. Each image should be accompanied with documentation on how to use it.
    - [Docker Samples](https://docs.docker.com/samples/): Docker's documentation has a list of sample applications with full instructions for running each sample. This includes a [WordPress]() sample, as well as [ASP.NET Core](https://docs.docker.com/samples/dotnetcore/) and [Django](https://docs.docker.com/samples/django/).
    - [Docker Samples Repository](https://github.com/dockersamples/): Additional sample applications you can run.

1.  Learn how to use Docker by running through the [Docker for Beginners](https://github.com/docker/labs/tree/master/beginner/) lab or by reading the documentation below:

    - [An Introduction to Docker](/docs/guides/introduction-to-docker/)
    - [How to Deploy an nginx Container with Docker on Linode](/docs/guides/how-to-deploy-an-nginx-container-with-docker/)
    - [Docker Commands Quick Reference Cheat Sheet](/docs/guides/docker-commands-quick-reference-cheat-sheet/)
    - [How to Use Docker Files](/docs/guides/how-to-use-dockerfiles/)
    - [How to Use Docker Compose](/docs/guides/how-to-use-docker-compose/)
    - [How to Connect Docker Containers](/docs/guides/docker-container-communication/)
    - [How to Create a Docker Swarm Manager and Nodes on a Linode](/docs/guides/how-to-create-a-docker-swarm-manager-and-nodes-on-linode/)
    - [Create and Deploy a Docker Container Image to a Kubernetes Cluster](/docs/guides/deploy-container-image-to-kubernetes/)
    - [Manage a Docker Cluster with Kubernetes](/docs/guides/manage-a-docker-cluster-with-kubernetes/)


{{< content "marketplace-update-note-shortguide">}}