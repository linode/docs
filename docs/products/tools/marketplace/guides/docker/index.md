---
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide provides you with step-by-step instructions for deploying Docker, a tool which you can use to run containerized apps, from the Linode One-Click Marketplace."
keywords: ['docker','marketplace', 'container']
tags: ["container","cloud-manager","linode platform","docker","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified: 2022-03-08
image: Docker_oneclickapps.png
modified_by:
  name: Linode
title: "Deploying Docker through the Linode Marketplace"
external_resources:
 - '[Docker Commands Cheat Sheet](/docs/applications/containers/docker-commands-quick-reference-cheat-sheet/)'
 - '[Docker Documentation](https://docs.docker.com/)'
 - '[Play with Docker](https://training.play-with-docker.com/)'
 - '[Docker Hub](https://www.docker.com/products/docker-hub)'
aliases: ['/platform/marketplace/deploying-docker-with-marketplace-apps/', '/platform/one-click/deploying-docker-with-one-click-apps/','/guides/deploying-docker-with-one-click-apps/','/guides/deploying-docker-with-marketplace-apps/','/guides/docker-marketplace-app/']
---

Docker is a tool that enables you to create, deploy, and manage lightweight, stand-alone packages that contain that contain code, libraries, runtime, system settings, and dependencies that are required to run an application. These packages are called containers.

Each container is deployed with its own CPU, memory, block I/O, and network resources, without having to depend upon an individual kernel and operating system. While it may be easiest to compare Docker and virtual machines, they differ in the way they share or dedicate resources.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Docker should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 9
- **Recommended minimum plan:** All plan types and sizes can be used.

### Docker Options

- **Resource to Download** *(required)*: The url to a hosted [Dockerfile](https://docs.docker.com/engine/reference/builder/) or [docker-compose.yml](/docs/guides/how-to-use-docker-compose/#Basic-Usage) file to be used to assemble an image as part of the application creation process.
- **Command to run** *(required)*: A [Docker Command](https://www.linode.com/docs/guides/docker-commands-quick-reference-cheat-sheet/) to be run as part of the application creation process.


{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Do you need an MX record for this domain?** Select `Yes` to create a basic [MX record](/docs/networking/dns/dns-records-an-introduction/#mx) for the domain. Select `No` to create no MX records
- **Do you need an SPF record for this domain?** Select `Yes` to create a basic [SPF record](/docs/networking/dns/dns-records-an-introduction/#spf) for the domain. Select `No` to create no SPF records.

## Getting Started after Deployment

Docker is now installed and ready to use. The following steps provide a sample application to get you started with an easy example to demonstrate some basic Docker functionality. It is not necessary for Docker set-up.

### Access Docker

After Docker has finished installing, you can access Docker from the console via SSH with the IPv4 address of the Linode:

1.  [SSH into the Linode](/docs/guides/set-up-and-secure/#connect-to-the-instance) and [create a limited user account](/docs/guides/set-up-and-secure/#add-a-limited-user-account).

1.  Log out and log back in with the limited user account.

1.  Install the unzip package from the package manager:

        sudo apt install unzip

1.  Download the example `node-bulletin-board` project and unzip it:

        curl -LO https://github.com/dockersamples/node-bulletin-board/archive/master.zip
        unzip master.zip

1.  Move into the example project directory:

        cd node-bulletin-board-master/bulletin-board-app

1.  Build the image with the following command:

        sudo docker image build -t bulletinboard:1.0 .

1.  Start a container with the image:

        sudo docker container run --publish 8000:8080 --detach --name bb bulletinboard:1.0

1.  Visit the application in the browser by going to `http://198.51.100.0:8000`, replacing the IP address with the public IP of the Linode.

    ![Bulletin Board Sample Application in the Browser](docker-marketplace-bulletin-board.png "Bulletin Board Sample Application in the Browser")

1.  To delete the container run:

        sudo docker container rm --force bb

## Next Steps

{{< content "marketplace-update-note-shortguide">}}

For more on Docker, checkout the following guides:

- [An Introduction to Docker](/docs/applications/containers/introduction-to-docker/)
- [How to Use Docker Files](/docs/applications/containers/how-to-use-dockerfiles/)
- [How to Use Docker Compose](/docs/applications/containers/how-to-use-docker-compose/)
- [How to Connect Docker Containers](/docs/applications/containers/docker-container-communication/)
- [How to Create a Docker Swarm Manager and Nodes on a Linode](/docs/applications/containers/how-to-create-a-docker-swarm-manager-and-nodes-on-linode/)
- [Create and Deploy a Docker Container Image to a Kubernetes Cluster](/docs/kubernetes/deploy-container-image-to-kubernetes/)
- [Manage a Docker Cluster with Kubernetes](/docs/kubernetes/manage-a-docker-cluster-with-kubernetes/)
