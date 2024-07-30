---
title: "Configure NodeBalancers with the Linode API"
description: "This guide demonstrates the API calls needed to add and configure a NodeBalancer through the Linode API"
published: 2018-04-05
modified: 2022-11-30
image: configure-nodebalancers-with-the-linode-api.png
external_resources:
  - '[Getting Started with NodeBalancers](/docs/products/networking/nodebalancers/get-started/)'
keywords: ["nodebalancer", "load balancing", "high availability", "linode api"]
tags: ["linode platform"]
aliases: ['/platform/api/nodebalancers/','/guides/nodebalancers/','/products/tools/api/guides/nodebalancers/']
---

[NodeBalancers](https://www.linode.com/nodebalancers) can be used to provide high availability load balancing for almost any type of website or service hosted on a Compute Instance. This guide will demonstrate how to use the Linode API to create a NodeBalancer with two back end nodes.

{{< note >}}
You need a Personal Access Token for the Linode API to complete the steps in this guide. See [Manage Personal Access Tokens](/docs/products/tools/api/guides/manage-api-tokens/#create-an-api-token) for more information.
{{< /note >}}

## Create a NodeBalancer

1. Store your Personal Access Token as a shell variable:

    ```command
    export TOKEN=<token-string>
    ```

1. Using a text editor, create a file to store configuration options:

    ```file {title="nodebalancer.json" lang="json"}
    {
      "region": "us-central",
      "label": "nodebalancer-1",
      "client_conn_throttle": 10
    }
    ```

1. Create a NodeBalancer by making a POST request to the `/nodebalancers` endpoint:

    ```command
    curl https://api.linode.com/v4/nodebalancers \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -X POST -d @nodebalancer.json
    ```

1. If the NodeBalancer is successfully created, the response will include its ID. Copy the ID to use in subsequent requests.

## Add Configuration

NodeBalancers are created without any configuration profiles attached. Each profile configures a single port on the NodeBalancer. Once the port is configured, the NodeBalancer will begin listening for traffic on that port.

1. Create a new configuration file:

    ```file {title="nodebalancer-config.json" lang="json"}
    {
      "label": "nodebalancer-1",
      "port": 80,
      "check": "connection"
      }
    ```

1. Substitute the NodeBalancer's ID into the URL below:

    ```command
    curl https://api.linode.com/v4/nodebalancers/$NODEBALANCER_ID/configs \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -X POST -d @nodebalancer-config.json
    ```

{{< note >}}
For more information about configuration options, see our [NodeBalancer Reference Guide](/docs/products/networking/nodebalancers/guides/configure/).
{{< /note >}}

## Add Back-end Compute Instances

Even with a working configuration profile, the NodeBalancer isn't doing anything yet, since it has no back ends connected to it. Repeat the steps in this section for each back end you would like to add; usually you will want at least two.

### Create Compute Instances

1. Add the following options to a new config file. Adjust the type, image, and region to suit your needs; make sure the new Compute Instance is in the same region as your NodeBalancer and choose a secure root password.

    ```file {title="create-instance.json" lang="json"}
    {
      "region": "us-central",
      "type": "g5-standard-2",
      "image": "linode/debian9",
      "root_pass": "password",
      "booted": false
    }
    ```

1. Use the API to create the instance:

    ```command
    curl https://api.linode.com/v4/linode/instances/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -X POST -d @create-instance.json
    ```

    Make a note of the new Linode's ID.

1. Add configuration options for adding a private IPv4 address:

    ```file {title="ip-address.json" lang="json"}
    {
      "type": "ipv4",
      "public": false,
      "linode_id": 7449584
    }
    ```

1. Add a private IP address to the new instance:

    ```command
    curl https://api.linode.com/v4/networking/ips \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -X POST -d @ip-address.json
    ```

1. Boot the Compute Instance:

    ```command
    curl -X POST https://api.linode.com/v4/linode/instances/$LINODE_ID/boot \
    -H "Authorization: Bearer $TOKEN"
    ```

### Add Back ends to the NodeBalancer

Add the new Compute Instances as back ends to the NodeBalancer.

1. Add configuration options for each back end. Substitute the private IP address of the Compute Instance into the `address` field and give each back end a unique label.

    ```file {title="add-node.json" lang="json"}
    {
      "label": "node-1",
      "address": "$node-private-ip:80"
      }
    ```

1. Use the `/nodes` endpoint to add these back ends:

    ```command
    curl https://api.linode.com/v4/nodebalancers/$NODEBALANCER_ID/configs/$CONFIG_ID \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -X POST -d @add-node.json
    ```

1. Repeat this process for each additional back end.

## Check Back-end Status

Check the status of the two back-end nodes:

```command
curl https://api.linode.com/v4/nodebalancers/$NODEBALANCER_ID/configs/$CONFIG_ID \
-H "Authorization: Bearer $TOKEN"
```

```output
. . .
  "nodes_status": {
      "up": 0,
      "down": 2
  },
. . .
```

Both back ends are down because there is no process for the NodeBalancer to connect to on the designated port. As a demonstration, a basic install of NGINX will listen on port 80 automatically. SSH into each Compute Instance and install NGINX:

```command
apt update && apt upgrade && apt install nginx
```

If you check the NodeBalancer config again, it should report that both back ends are now up. You can also navigate to the NodeBalancer's public IP address in a browser; the default NGINX landing page should be displayed.

## Configure HTTPS

NodeBalancers can also be configured to use HTTPS. You will need to have a TLS certificate before enabling this option.

1. If you do not have an existing TLS certificate, generate a self-signed certificate using OpenSSL:

    ```command
    openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out MyCertificate.crt -keyout MyKey.key
    ```

    {{< note >}}
    Provide values for country name, common name, etc. when prompted. The Linode API will reject the certificate if these are left blank.
    {{< /note >}}

1. Edit your `nodebalancer-config.json` configuration file:

    ```file {title="nodebalancer-config.json" lang="json"}
    {
      "protocol":"https",
      "port": 443,
      "ssl_cert": "-----BEGIN CERTIFICATE-----\nCERTIFICATE_INFORMATION\n-----END CERTIFICATE-----",
      "ssl_key": "-----BEGIN PRIVATE KEY-----\nPRIVATE_KEY_INFORMATION\n-----END PRIVATE KEY-----"
    }
    ```

    {{< note >}}
    Line breaks in SSL certificate and private key strings must be represented by `\n`.
    {{< /note >}}

1. Use a PUT request to update your NodeBalancer's configuration:

    ```command
    curl -X PUT https://api.linode.com/v4/nodebalancers/$NODEBALANCER_ID/configs/$CONFIG_ID \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d @nodebalancer-config.json
    ```