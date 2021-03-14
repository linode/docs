---
slug: deploying-docker-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy a Docker on Linode using Marketplace Apps.'
og_description: 'Deploy a Docker on Linode using Marketplace Apps.'
keywords: ['docker','marketplace', 'container']
tags: ["container","cloud-manager","linode platform","docker","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified: 2020-03-11
modified_by:
  name: Linode
title: "How to Deploy Docker with Marketplace Apps"
h1_title: "Deploying Docker with Marketplace Apps"
contributor:
  name: Linode
external_resources:
 - '[Docker Commands Cheat Sheet](/docs/applications/containers/docker-commands-quick-reference-cheat-sheet/)'
 - '[Docker Documentation](https://docs.docker.com/)'
 - '[Play with Docker](https://training.play-with-docker.com/)'
 - '[Docker Hub](https://www.docker.com/products/docker-hub)'
aliases: ['/platform/marketplace/deploying-docker-with-marketplace-apps/', '/platform/one-click/deploying-docker-with-one-click-apps/']
---

## Docker Marketplace App

Docker is a tool that enables you to create, deploy, and manage lightweight, stand-alone packages that contain that contain code, libraries, runtime, system settings, and dependencies that are required to run an application. These packages are called containers.

Each container is deployed with its own CPU, memory, block I/O, and network resources, without having to depend upon an individual kernel and operating system. While it may be easiest to compare Docker and virtual machines, they differ in the way they share or dedicate resources.

### Deploy a Docker Marketplace App

{{< content "deploy-marketplace-apps">}}

### Docker Options

| **Configuration** | **Description** |
|:--------------|:------------|
| **Resource to Download** | The url to a hosted [Dockerfile](https://docs.docker.com/engine/reference/builder/) or [docker-compose.yml](/docs/guides/how-to-use-docker-compose/#Basic-Usage) file to be used to assemble an image as part of the application creation process. |
| **Command to run**| A [Docker Command](https://www.linode.com/docs/guides/docker-commands-quick-reference-cheat-sheet/) to be run as part of the application creation process.|
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on the server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/guides/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |
| **Your Linode API Token.** | Linode API access token is needed to create any DNS records. If you don't have a token, you must [create one](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) to configure DNS. |
| **Subdomain** | The subdomain you want the installer to create a DNS record for during setup. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name you want to create as part of the application creation process. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **Do you need an MX record for this domain?** | Select `Yes` to create a basic [MX record](/docs/networking/dns/dns-records-an-introduction/#mx) for the domain. Select `No` to create no MX records.|
| **Do you need an SPF record for this domain?** | Select `Yes` to create a basic [SPF record](/docs/networking/dns/dns-records-an-introduction/#spf) for the domain. Select `No` to create no SPF records. |

### Linode Options

After providing any app specific options, provide configurations for the Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by Docker Marketplace Apps, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you want the Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | The Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Docker can be supported on any size Linode, but it is recommended that you choose a Linode plan that reflects how many resources you plan on using. For small applications, a 1GB Linode (Nanode) is sufficient. If you decide that you need more or fewer hardware resources after you deploy the app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for the Linode, which must be unique between all of the Linodes on your account. This name helps you identify the server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for the Linode instance. This password must be provided when you log in to the Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. The root password can be used to perform any action on the server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click the **Create** button. **The Docker app completes the installation anywhere between 2-5 minutes after the Linode has finished provisioning**.

## Getting Started after Deployment

Docker is now installed and ready to use. The following steps provide a sample application to get you started with an easy example to demonstrate some basic Docker functionality. It is not necessary for Docker set-up.

### Access Docker

After Docker has finished installing, you can access Docker from the console via SSH with the IPv4 address of the Linode:

1.  [SSH into the Linode](/docs/getting-started/#connect-to-your-linode-via-ssh) and [create a limited user account](/docs/security/securing-your-server/#add-a-limited-user-account).

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

{{< content "marketplace-update-note">}}

For more on Docker, checkout the following guides:

- [An Introduction to Docker](/docs/applications/containers/introduction-to-docker/)
- [How to Use Docker Files](/docs/applications/containers/how-to-use-dockerfiles/)
- [How to Use Docker Compose](/docs/applications/containers/how-to-use-docker-compose/)
- [How to Connect Docker Containers](/docs/applications/containers/docker-container-communication/)
- [How to Create a Docker Swarm Manager and Nodes on a Linode](/docs/applications/containers/how-to-create-a-docker-swarm-manager-and-nodes-on-linode/)
- [Create and Deploy a Docker Container Image to a Kubernetes Cluster](/docs/kubernetes/deploy-container-image-to-kubernetes/)
- [Manage a Docker Cluster with Kubernetes](/docs/kubernetes/manage-a-docker-cluster-with-kubernetes/)
