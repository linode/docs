---
description: "Deploy HashiCorp Nomad Cluster, a flexible scheduling and orchestration for diverse workloads, on Linode Compute Instances.'"
keywords: ['HashiCorp','Nomad','Scheduling', 'orchestration']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-08-01
modified_by:
  name: Linode
title: "Deploy HashiCorp Nomad Cluster through the Linode Marketplace"
authors: ["Linode"]
---

[HashiCorp Nomad](https://www.nomadproject.io/) is a simple and flexible scheduler and orchestrator to deploy and manage containers and non-containerized applications across cloud platforms (and on-premises servers) at scale.

{{< note type="warning" title="Marketplace App Cluster Notice" >}} This Marketplace App deploys 6, 8 or 10 Compute Instances to create a highly available and redundant Hashicorp Nomad cluster, each with the plan type and size that you select. 

_There can only be one Nomad One-Click Cluster per datacenter._

Please be aware that each of these Compute Instances will appear on your invoice as separate items. To instead deploy Hashicorp Nomad on a single Compute Instance, see [Deploy Hashicorp Nomad through the Linode Marketplace](https://www.linode.com/docs/products/tools/marketplace/guides/hashicorp-nomad/). {{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Nomad Cluster should be fully installed within 15-20 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS,
- **Recommended plan:** We recommend a 8GB Dedicated CPU or Shared Compute instance for the Nomad Server. 

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Nomad Cluster Options 

- **Linode API Token** *(required)*: Your API token is used to deploy additional Compute Instances as part of this cluster. At a minimum, this token must have Read/Write access to *Linodes*. If you do not yet have an API token, see [Get an API Access Token](/docs/products/tools/api/guides/manage-api-tokens/) to create one.

- **Limited sudo user** *(required)*: A limited user account with sudo access is created as part of this cluster deployment. Enter your preferred username for this limited user. Please note that the password is automatically created. See [Obtaining Usernames and Passwords](#obtaining-usernames-and-passwords).

- **Add SSH Keys to all nodes?** If you select *yes*, any SSH Keys that are added to the root user account (in the **SSH Keys** section), are also added to your limited user account on all deployed Compute Instances.

- **Nomad cluster size:** Select the preferred size of your cluster from the available options (6, 8 or 10).

|  Servers |  Clients | Total  Linodes |
| ---- | ---- | ---- |
| 3  | 3  | 6 Linodes |
| 5  | 3  | 8 Linodes |
| 7  | 3  | 10 Linodes |
Please be aware that this creates the corresponding number of Compute Instances.

## Getting Started after Deployment

### Accessing the Nomad Web UI

1. Use [SSH]() to connect to the created sudo user of the initially deployed instance, labeled `occ-server-1`, and retrieve the contents of `~/.deployment-secrets.txt`. These are the generated tokens for adding Nomad clients to the cluster, managing jobs and the Consul service mesh. Save these tokens somewhere safe.  

2. Open your web browser and navigate to `http://[ip-address]:8080`, where *[ip-address]* is your Compute Instance labeled `occ-server-1` IPv4 address. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses.

3. The [Nomad Web UI](https://learn.hashicorp.com/collections/nomad/web-ui) is displayed. To authenticate you will need to provide the `nomad_user_token` from the `~/.deployment-secrets.txt` file to authenticate to the UI. From here, you can manage the cluster, jobs, integrations, and ACL tokens.

    ![Screenshot of the Nomad Web UI](nomad-webUI.jpg)

    {{< note >}}
    HashiCorp recommends using mutual TLS (mTLS) with a private CA to secure cluster communications and the web UI. Please see the following HashiCorp documentation for more details.
    https://learn.hashicorp.com/tutorials/nomad/security-enable-tls
    https://www.nomadproject.io/docs/configuration/tls#http
    {{< /note >}}

4. While the HashiCorp Nomad Cluster provides reasonable defaults, we recommend reviewing the [Configuration](https://www.nomadproject.io/docs/configuration) and [Job Spec](https://www.nomadproject.io/docs/job-specification) documentation.

{{< content "marketplace-update-note-shortguide">}}