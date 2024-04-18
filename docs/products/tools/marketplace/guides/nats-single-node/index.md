---
title: "Deploy NATS through the Linode Marketplace"
description: "Deploy NATS on a Linode Compute Instance. NATS is a connective technology responsible for addressing, discovery and exchanging of messages that drive the common patterns in distributed systems; asking and answering questions, aka services/microservices, and making and processing statements, or stream processing."
published: 2024-02-20
modified_by:
  name: Linode
keywords: ['cloud native','microservices','distributed systems', 'PubSub']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[NATS](https://nats.io/)'
authors: ["Linode"]
---

[NATS](https://docs.nats.io/nats-concepts/overview) is a connective technology built for the hyper-connected world. It is a single technology that enables applications to securely communicate across any combination of cloud vendors, on-premise, edge, web and mobile, and devices. NATS consists of a family of open-source products that are tightly integrated but can be deployed easily and independently. NATS is being used globally by thousands of companies, spanning use-cases including microservices, edge computing, mobile, and IoT.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** NATS should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### NATS Server Options

- **NATS Server Name**: The name for the NATS server. Default is "Test".
- **Version**: NATS server software version. Default is 2.10.1.
- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.
- **NATS Server Port**: NATS server port for clients to connect. Default is 4222.
- **NATS Websocket Port**: To setup the NATS server Websocket port. Default is 8888.
- **NATS MQTT Port**: To setup the NATS server MQTT port. Default is 1883.

{{< content "marketplace-required-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

### Getting Started after Deployment

## Accessing the NATS Monitoring UI

To monitor the NATS messaging system, nats-server provides a lightweight HTTP server on a dedicated monitoring port. The monitoring server provides several endpoints, providing statistics and other information.

Open your web browser and go to the custom domain you specified during deployment or the rDNS domain of your Compute Instance (e.g., `192-0-2-1.ip.linodeusercontent.com`). This will take you to the NATS monitoring page. Refer to the [Monitoring NATS](https://docs.nats.io/running-a-nats-service/nats_admin/monitoring) guide for details on the different endpoints, statistics and other info you have access to.

## Obtaining the NATS users passwords.

By default, this NATS deployment creates 2 users, one named "example" and another system user named "system". The passwords for these users are generated during the initial install process. To obtain these password, log in to your Compute Instance either through the [LISH Console](/docs/products/compute/compute-instances/guides/lish/#through-the-cloud-manager-weblish) or via SSH, then just read the `/home/$USERNAME/.credentials` file, ie:

```command
cat /home/$USERNAME/.credentials
```
This file will contain the two credentials needed for those users.

For details, see [NATS Authorization](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/authorization).

### More Information

For more information, refer to these resources. Note that we can't confirm the authenticity of externally hosted materials.

- [Support](https://natsio.slack.com/)

- [Installation examples](https://docs.nats.io/running-a-nats-service/introduction/installation)

- [Sample code/Tutorials](https://natsbyexample.com/)

- [Latest version](https://github.com/nats-io/nats-server)

{{< content "marketplace-update-note-shortguide">}}