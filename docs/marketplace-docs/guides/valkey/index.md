---
title: "Deploy Valkey through the Linode Marketplace"
description: "Valkey is an open-source, keyvalue database driven by community development and supported by the Linux Foundation. Valkey is forked from Redis release 7.2, and maintains BSD-3 licensing. Valkey can serve production roles such as caching and message queues, or as a primary database."
published: 2024-08-05
keywords: ['nosql','database', 'marketplace', 'valkey']
tags: ["ubuntu","marketplace", "database", "linode platform", "cloud manager", "ssl", "cloud storage", "high availability", "compute storage"]
external_resources:
- '[About Valkey](https://valkey.io/)'
- '[Valkey Documentation](https://valkey.io/docs/)'
authors: ["Akamai"]
---

Valkey is an open-source (BSD) key/value datastore that supports diverse workloads such as caching and message queues, and can act as a primary database. The Akamai Connected Cloud One-Click App for Valkey is configured as a standalone system daemon with TLS support.

Valkey natively supports a broad collection of data types, extensibility with built-in scripting support for Lua, and module plugins to create new commands, data types, and more.

{{< note type="warning" title="Valkey is still early in development" >}}
While Valkey is a fork of a production-ready 7.2.4 release of Redis, the Valkey codebase is still early in development and is subject to change as development takes place. We recommend following the [release cycles](https://github.com/valkey-io/valkey/releases) for any breaking changes to minimize downtime on a production environment.
{{< /note >}}

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Valkey should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Suggested minimum plan:** All plan types and sizes can be used. For best results, a minimum of 8GB Dedicated CPU or Shared Compute Instance is recommended.

### Valkey Options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

- **Number of clients connecting to Valkey:** The number of clients that will be connecting to the cluster. The application will create SSL certificates for your client that need to connect to the cluster. This should be an integer equal or greater than 1.

- **Valkey Version:** Version of Valkey to install.

### Self Signed SSL/TLS Options

- **Country or Region:** Enter the country or region for you or your organization.

- **State or Province:** Enter the state or province for you or your organization.

- **Locality:** Enter the town or other locality for you or your organization.

- **Organization:** Enter the name of your organization.

- **Email Address:** Enter the email address you wish to use for your certificate file.

- **CA Common Name:** The common name that will be shared as the authority for all SSL certificates. Example: "Valkey CA"

## Getting Started After Deployment

Connect to the compute instance using either `root` or the `sudo user` created during deployment if you provided account SSH keys. In order to access the TLS-encrypted Valkey database, path arguments must be provided to `valkey-cli`. The directory paths are provided in the MOTD:

```output
*********************************************************
Akamai Connected Cloud Valkey Marketplace App
Credentials File: /home/$SUDO_USER/.credentials
Valkey Configuration Directory: /etc/valkey/
Valkey Configuration File: /etc/valkey/valkey.conf
Valkey SSL directories: /etc/valkey/ssl/[ca,certs,keys,reqs]
Valkey Install directory: /var/valkey
Valkey Data Directory: /var/valkey/data
Valkey SRC: /var/valkey/lib/[...]
Valkey DEFAULT Configuration File: /var/valkey/lib/valkey.conf
Documentation: https://www.linode.com/docs/products/tools/marketplace/guides/valkey/
*********************************************************
To delete this message of the day: rm /etc/motd
```

Access the Valkey database from the compute instance using the `valkey-cli` command, for example:

```command
--tls --cacert /etc/valkey/ssl/ca/ca.crt --cert /etc/valkey/ssl/certs/client1.crt --key /etc/valkey/ssl/keys/client1.key.pem
```

This enters the Valkey interface and allows you to authenticate as either the `default` user or the `sudo user`. The `sudo user` is created during deployment using the passwords provided in the `/home/$SUDO_USER/.credentials` file.

Valkey is deployed to listen only on `127.0.0.1` loopback. Additional configurations to Valkey and the firewall may be necessary to connect to external clients and resources.

{{< note >}}
Valkey is still in early development and has limited documentation. Pending further major release, Redis usage and configuration documentation is generally applicable to Valkey.
{{< /note >}}

## More Information

Additional resources are available from the Valkey community.

- [Valkey](https://valkey.io/)
- [Valkey Github Repo](https://github.com/valkey-io/valkey)

{{% content "marketplace-update-note-shortguide" %}}
