---
description: "This guide shows you how to install Splunk, a powerful data solution that collects, monitors, analyzes, and visualizes data, using the Linode One-Click Marketplace."
keywords: ['monitoring','splunk', 'data solution']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-09-03
modified: 2024-01-31
title: "Deploy Splunk through the Linode Marketplace"
aliases: ['/guides/deploying-splunk-marketplace-app/','/guides/splunk-marketplace-app/']
external_resources:
- '[Splunk](http://splunk.com/)'
authors: ["Linode"]
contributors: ["Linode"]
---

Splunk is a powerful log analyzer that can be used to obtain insight into your infrastructure. Splunk collects, monitors, analyzes, and visualizes data from database applications, web servers, cloud networks, and a variety of other sources.

The Akamai Connected Cloud Splunk Marketplace App includes support for the [Akamai SIEM integration](https://techdocs.akamai.com/siem-integration/docs/akamai-siem-integration-for-splunk-and-cef-syslog) on deployment. For details on generating valid tokens, see [create authentication credentials](https://techdocs.akamai.com/developer/docs/set-up-authentication-credentials). 

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Splunk should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### Splunk Options

- **Splunk Admin user** *(required)*: This will be the username you use to login the Splunk Dashboard.
- **Akamai Access Token**: Akamai Access Token
- **Akamai Client Secret**: Akamai Client Secret
- **Akamai Client Token**: Akamai Client Token
- **Luna Hostname**: Akamai Luna Hostname
- **Akamai Security Configuration ID**: Akamai Security Configuration ID

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Email address for the SOA record:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.

{{< content "marketplace-required-limited-user-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Obtaining the Admin Password

The password for the sudo user account was automatically generated during the initial install process. To find this password, log in to your Compute Instance through the [LISH Console](/docs/products/compute/compute-instances/guides/lish/#through-the-cloud-manager-weblish). The credentials are available in the file `/home/$USERNAME/.credentials`
```
cat /home/$USERNAME/.credentials
sudo username: $USERNAME
sudo password: 0oVSsWmkbGesmtuTlOEgFl7t
splunk user: $SPLUNK_USER
splunk admin password: fRLdHksJoMPrjLtRCogEPVLYOML1zQtQ0kIsL7IWvo49
```

### Access your Splunk App

Open a browser and navigate to `https://192-0-2-1.ip.linodeusercontent.com:8000`, where `192-0-2-1` represents the IPv4 address of your new Compute Instance. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#configuring-rdns) guide for information on viewing the rDNS value.

You will be presented a login field where you can enter the credentials you previously specified in the *Splunk Username* and the generated *Splunk Password* in `/home/$USERNAME/.credentials`.

Now that you’ve accessed your dashboard, checkout [the official Splunk documentation](https://docs.splunk.com/Documentation/Splunk) to learn how to further configure your instance.

{{< content "marketplace-update-note-shortguide">}}