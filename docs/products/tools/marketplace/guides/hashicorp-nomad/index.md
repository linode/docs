---
author:
  name: Linode
  email: docs@linode.com
description: "Deploy HashiCorp Nomad, a flexible scheduling and orchestration for diverse workloads, on a Linode Compute Instance.'"
keywords: ['HashiCorp','Nomad','Scheduling', 'orchestration']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-09
modified_by:
  name: Linode
title: "Deploying HashiCorp Nomad through the Linode Marketplace"
---

[HashiCorp Nomad](https://www.nomadproject.io/) is a simple and flexible scheduler and orchestrator to deploy and manage containers and non-containerized applications across cloud platforms (and on-premises servers) at scale.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Nomad should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS, Debian 11
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared Compute instance for the Nomad Server. Nomad Clients (deployed separately from this Marketplace App) can use plans of any size.

{{< content "marketplace-limited-user-fields-shortguide">}}

## Getting Started after Deployment

### Accessing the Nomad Web UI

1. Open your web browser and navigate to `http://[ip-address]:8080`, where *[ip-address]* is your Compute Instance's IPv4 address. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing IP addresses.

1. The [Nomad Web UI](https://learn.hashicorp.com/collections/nomad/web-ui) is displayed. From here, you can manage the cluster, jobs, integrations, and ACL tokens.

    ![Screenshot of the Nomad Web UI](nomad-webUI.jpg)

    {{<note>}}
HashiCorp recommends using mutual TLS (mTLS) with a private CA to secure cluster communications and the web UI. Please see the following HashiCorp documentation for more details.
https://learn.hashicorp.com/tutorials/nomad/security-enable-tls
https://www.nomadproject.io/docs/configuration/tls#http
{{</note>}}

1. Additional configurations are required to use the Linode Marketplace Nomad Server in a production environment. We recommend reviewing the [Configuration](https://www.nomadproject.io/docs/configuration) and [Job Spec](https://www.nomadproject.io/docs/job-specification) documentation before proceeding.

{{< content "marketplace-update-note-shortguide">}}
