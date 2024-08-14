---
title: "Deploy OpenLiteSpeed Django through the Linode Marketplace"
description: "Deploy OpenLiteSpeed Django on a Linode Compute Instance. This provides you with a high performance web server to manage your Django application."
published: 2021-11-12
modified: 2024-06-10
keywords: ['web server','django','openlitespeed']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[OpenLiteSpeed Django](https://docs.litespeedtech.com/cloud/images/django/)'
aliases: ['/products/tools/marketplace/guides/openlitespeed-django/','/guides/deploying-openlitespeed-django-marketplace-app/','/guides/openlitespeed-django-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
---

The OpenLiteSpeed Django app automatically installs Linux, the performance web server OpenLiteSpeed, Python LSAPI, and CertBot. OpenLiteSpeed Django features HTTP/3 support and easy setup for SSL and RewriteRules. It’s flexible enough to host multiple Django apps and supports many other apps including Node.js, Ruby, and CMS software like WordPress.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** OpenLiteSpeed Django should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Suggested plan:** All plan types and sizes can be used.

## OpenLiteSpeed Django Options

- **Django User** *(required)*: Username for Django app.
- **SOA Email Address:** *(required)*: Email address for free Let's Encrypt SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Accessing the OpenLiteSpeed Django App

1.  Log in to your Compute Instance over SSH, using the sudo user created during deployment or `root`. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance. You should see output similar to the following:

    ```output
    *********************************************************
    Akamai Connected Cloud OpenLiteSpeed Django Marketplace App
    App URL:
    * The OpenLiteSpeed Web Admin: https://$EXAMPLE_DOMAIN:7080
    * The sample Django site: https://EXAMPLE_DOMAIN/
    * The Django admin user: $DJANGO_USER
    * The sample Django admin page: https://$EXAMPLE_DOMAIN/admin
    Credentials File: /home/$SUDO_USER/.credentials
    Documentation: https://www.linode.com/marketplace/apps/linode/openlitespeed-django/
    *********************************************************
    ```

    You can view this message again by running `cat /etc/motd`. To delete this information, run `rm /etc/motd`.

1.  The Django page is automatically configured with the custom domain provided during deployment, or the default rDNS.

    {{< note >}}
    For more documentation on how to assign a domain to your Linode, please review the [DNS Manager](/docs/products/networking/dns-manager/) guide for instructions on setting up your DNS records in Cloud Manager, and read through [DNS Records: An Introduction](/docs/guides/dns-overview/) for general information about how DNS works.
    {{< /note >}}

Now that you’ve accessed your OpenLiteSpeed Django instance, check out [the official OpenLiteSpeed Django documentation](https://docs.litespeedtech.com/cloud/images/django/) for further configuration steps.

{{% content "marketplace-update-note-shortguide" %}}