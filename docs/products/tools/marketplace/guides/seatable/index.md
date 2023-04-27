---
description: "Deploy SeaTable, a simple database management GUI, on a Linode Compute Instance."
keywords: ['SeaTable','Database','Web UI']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2022-08-09
modified_by:
  name: Linode
title: "Deploy SeaTable through the Linode Marketplace"
authors: ["Linode"]
---

[SeaTable](https://seatable.io/docs/?lang=auto) is a simple and flexible database management interface with native Python automation support.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** SeaTable should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 11
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared Compute instance for SeaTable.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Accessing the SeaTable Web UI

1. To use SeaTable's generated Let's Encrypt SSL an [A Record](docs/products/networking/dns-manager/guides/a-record/index.md) for the Compute Instance's IPv4 address. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses. 
2. Access your SeaTable instance via [SSH](docs/products/compute/compute-instances/guides/set-up-and-secure/index.md#connect-to-the-instance) and change to the directory `/opt/seatable`.
3. Follow the SeaTable [deployment instructions](https://manual.seatable.io/docker/Enterprise-Edition/Deploy%20SeaTable-EE%20with%20Docker/#downloading-and-modifying-docker-composeyml). 
4. Adapt the existing docker-compose.yml as necessary.
5. Start the Docker container twice to [initalize the database](https://manual.seatable.io/docker/Enterprise-Edition/Deploy%20SeaTable-EE%20with%20Docker/#initializing-the-database).
6. Create a [sudo user](docs/products/compute/compute-instances/guides/set-up-and-secure/index.md#add-a-limited-user-account) and you are read to go...

{{< content "marketplace-update-note-shortguide">}}
