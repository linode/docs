---
title: "Deploy Couchbase One-Click Cluster through the Linode Marketplace"
description: "Deploy Couchbase Enterprise Server One-Click Cluster on Akamai Connected Cloud. Couchbase Enterprise Server is a high-performance NoSQL database, designed for scale."
keywords: ['database','nosql','high availability','data','cluster']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2024-06-10
external_resources:
- '[Couchbase](https://www.couchbase.com/)'
---

[Couchbase](https://www.couchbase.com/) is an enterprise class NoSQL database designed with memory-first architecture, built-in cache and workload isolation. The Couchbase One-Click cluster deploys five connected Couchbase Enterprise Server nodes, split between data, index and query services. This starting configuration allows quick deployment and rapid cluster expansion with Couchbase's multi-dimensional scaling.

{{< note title="Couchbase Enterprise Server License" >}}
Couchbase Enterprise Server is not free to use in production. Contact [Couchbase Support](https://www.couchbase.com/pricing/) to activate your license on Akamai Connected Cloud and enable [Couchbase application support](https://support.couchbase.com/hc/en-us/articles/360043247551-Accessing-Couchbase-Support).
{{< /note >}}

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Couchbase should be fully installed within 10-20 minutes after the Linode has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Minimum plan:** Couchbase Enterprise Server requires 8GB of RAM.
- **Suggested Plan:** 16GB of RAM is suggested for production deployments.

{{< note type="warning" title="Minimum RAM Requirements" >}}
**Minimum RAM Requirements:** Deploying the Couchbase Enterprise Server One-Click Cluster on a plan with less than 8GB of RAM will fail. Use caution, your account will be billed for any failed instances deployed with less than 8GB of RAM.
{{< /note >}}

### Couchbase Options

- **API Token** *(required)*: A valid API token with grants to deploy Linodes.

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Getting Started after Deployment

## Accessing the Couchbase Server

Access Couchbase's web UI by launching your preferred web browser and navigating to either the reverse DNS address of the *cluster provisioner*. This is the instance labeled `couchbase-occ-1-$region-$uuid`. If you need assistance in finding your instance's IP addresses and rDNS information, refer to the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for detailed instructions.

Provide the username Administrator and generated password included in `/home/$sudo_username/.credentials` to access the Dashboard.

![Couchbase Dashboard](couchbase_dashboard.png)

While there are no buckets yet configured on this new cluster, you can see all five nodes marked ready on the bottom status bar, and verify the status of the cluster members from the Servers tab.

![Couchbase Servers Status](couchbase_servers.png)

## Next Steps

Now that your Couchbase Enterprise Server One-Click Cluster has been deployed, contact [Couchbase Support](https://www.couchbase.com/pricing/) to activate your license on this newly deployed cluster before using the cluster for testing, quality assurance, or in production. An active Enterprise License is required for any use other than solely for internal development use or evaluation of the software.

### More Information

You may wish to consult the following resources for additional information on this topic. We cannot guarantee for the accuracy or timeliness of externally hosted materials.

- [Couchbase](https://www.couchbase.com/)
- [Couchbase Documentation](https://docs.couchbase.com/home/server.html)

{{% content "marketplace-update-note-shortguide" %}}