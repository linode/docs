---
title: "How to Use the Metadata Service API"
description: 'This guide provides a reference for using the Metadata service API directly.'
keywords: ['cloud-init','api','metadata']
contributors: ["Nathaniel Stickman"]
published: 2024-01-03
---

Akamai's [Metadata service](/docs/products/compute/compute-instances/guides/metadata/) offers an API for use in automated deployment configurations. Compatible versions of cloud-init can leverage the Metadata service to automatically configure new Compute Instances at deployment. However, the Metadata service's API can also be accessed directly. Doing so provides access to both instance and user data.

In this reference guide, learn more about the available API endpoints for the Metadata service and how to use them. Follow along to find out how to access the API from your Compute Instance and what to expect from each endpoint.

## API Endpoints

To access the Metadata API, you need to be on a Compute Instance. If you have not done so already, follow along with our guide on [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) before moving forward.

Once you have an instance deployed, the Metadata API is accessible via link-local addresses, specifically:

- **IPv4**: `169.254.169.254`
- **IPv6**: `fd00:a9fe:a9fe::1`

Each Metadata API endpoint provides instance data or user data. *Instance data* includes information related to the deployment and the instance itself, while *User data* consists of a specific field submitted when deploying the instance.

{{< note >}}
Only select regions support submission of user data. Additionally, a limited number of distributions are officially supported by Akamai's Metadata service and cloud-init. To learn more about Metadata and cloud-init support, review the Availability section of our [Overview of the Metadata Service](/docs/products/compute/compute-instances/guides/metadata/#availability) guide.
{{< /note >}}

The sections that follow list each endpoint, explain their usage, and provide examples of the expected output. Using the `Accept` header, output can generally be in either the default `text/plain` format or the `applciation/json` format.

To demonstrate, the guide provides example output in the plain-text format and shows the response structure in JSON format where applicable.

### Authentication Tokens (/v1/token)

Use of the Metadata API always starts with the `token` endpoint. Use this endpoint to authenticate a new session and receive a Metadata token for accessing subsequent Metadata endpoints from your instance.

While all other Metadata endpoints use `GET`, requests to this endpoint use the `PUT` method:

```command
curl -X PUT -H "Metadata-Token-Expiry-Seconds: 3600" http://169.254.169.254/v1/token
```

These requests provide a `Metadata-Token-Expiry-Seconds` header, which indicate the token's expiry time in seconds:

```output
e80eb80986f17fcd3df8fcb6ea944774cae47b26ed6d68df63a15b294b7a6e3f
```

When using the JSON format, the endpoint's response is an array containing the token string:

```output
[ "token" ]
```

From here on, this guide assumes you have already acquired a Metadata token. For convenience, subsequent examples use `$TOKEN` in place of the actual token string. Follow along by storing the token in an [environment variable](/docs/guides/how-to-set-linux-environment-variables/), as shown here:

```command
export TOKEN=$(curl -X PUT -H "Metadata-Token-Expiry-Seconds: 3600" http://169.254.169.254/v1/token)
```

### Instance Data (/v1/instance)

To receive information about the Compute Instance itself, use the `instance` endpoint:

```command
curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/instance
```

The output includes information on the identity of the instance, its specifications, and its backup scheduling:

```output
backups.enabled: false
host_uuid: 123abc456def789ghi
id: 532754976
label: example-linode-instance
region: us-iad
specs.disk: 51200
specs.gpus: 0
specs.memory: 2048
specs.transfer: 2000
specs.vcpus: 1
type: g6-standard-1
```

The endpoint's response is structured as shown below using the JSON format:

```output
{
  “id”: int,
  “host_uuid”: str,
  “label”: str,
  “region”: str,
  “type”: str,
  “tags”: array of str,
  “specs”: {
    “vcpus”: int,
    “memory”: int,
    “disk”: int,
    “transfer”: int,
    “gpus”: int
  },
  “backups”: {
    “enabled”: bool,
    “status”: str[pending/running/complete] or null
  }
}
```

The overall object provides identifying information about the instance, such as `ID`, `label`, and `tags`. A nested `specs` object details the instance specifications, while a nested `backups` object provides the status of backups for the instance.

### Network Data (/v1/network)

To retrieve information about how the instance's networking is configured, use the `network` endpoint:

```command
curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/network
```

Refer to this endpoint when you need to identify the instance's IP addresses, configured network interfaces, and those interfaces' IPAM addresses:

```output
ipv4.public: 192.0.2.0/24
ipv6.link_local: fe80::db8:1b3d:e5g7::/64
ipv6.slaac: 2600:3c05::db8:1b3d:e5g7::/64
```

The endpoint's response follows the JSON structuring shown below:

```output
{
  “interfaces”: [
    {
      “purpose”: str[public/vlan],
      “label”: str,
      ipam_address”: str[optional]
    },
  ],
  “ipv4”: {
    “public”: array of str,
    “private”: array of str,
    “elastic”: array of str
  },
  “ipv6”: {
    “ranges”: array of str,
    “link-local”: array of str
    “elastic-ranges”: array of str
  }
}

```

The `interfaces` array shows what interfaces, if any, the instance has. However, a default "eth0 - Public Internet" interface alone does not result in any output here. The `ipv4` and `ipv6` objects list the various addresses configured for the instance.

### SSH Keys (/v1/ssh-keys)

Use the `ssh-keys` endpoint to acquire a list of all SSH keys and associated users configured for the instance:

```command
curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/ssh-keys
```

The output lists each user by username, along with an array of associated keys:

```output
users.example-user: EXAMPLE_SSH_PUBLIC_KEY
users.root: ROOT_SSH_PUBLIC_KEY
```

The endpoint's output uses the structure shown below for JSON requests:

```output
{
  “users”: {
    “root”: array of str,
    “username”: array of str
  }
}
```

A `root` array lists keys for the root user. Other users each have their own array of keys, with the username acting as a label.

### User Data (/v1/user-data)

The `user-data` endpoint returns the user data submitted during the instance's deployment. Typically, this user data consists of a cloud-config script to be used by cloud-init for automating deployment. However, when accessing the Metadata service directly, you may utilize the user data for other purposes. If no user data was submitted, nothing will be returned.

Submitted user data is required to be encoded using `base64`, so you need to decode the returned string to view the expected user data:

```command
curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/user-data | base64 --decode
```

The output from this endpoint is simply the user data contents. There is no further formatting. For this reason, the endpoint only accepts the `text/plain` format, not `application/json`, format.

Below is example cloud-config user data for a basic instance. This is just an example and the specific content varies depending on the user data submitted when initializing the instance.

```output
#cloud-config

# Configure a limited user
users:
  - default
  - name: example-user
    groups:
      - sudo
    sudo:
      - ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    ssh_authorized_keys:
      - "SSH_PUBLIC_KEY"

# Perform system updates
package_update: true
package_upgrade: true

# Configure server details
timezone: 'US/Central'
hostname: examplehost

# Harden SSH access
runcmd:
  - sed -i '/PermitRootLogin/d' /etc/ssh/sshd_config
  - echo "PermitRootLogin no" >> /etc/ssh/sshd_config
  - systemctl restart sshd
```