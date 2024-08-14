---
title: "Deploy Django through the Linode Marketplace"
description: "Learn how to deploy Django, a web framework that provides much of the core functionality required in modern web development, through the Linode Marketpplace"
published: 2020-03-11
modified: 2024-04-16
keywords: ['django','marketplace', 'cms']
tags: ["cloud-manager","linode platform","cms","django","marketplace","digital agencies"]
image: Django_oneclickapps.png
aliases: ['/products/tools/marketplace/guides/django/','/platform/marketplace/how-to-deploy-django-with-marketplace-apps/','/platform/marketplace/deploying-django-with-marketplace-apps/', '/platform/one-click/how-to-deploy-django-with-one-click-apps/', '/platform/one-click/deploying-django-with-one-click-apps/','/guides/how-to-deploy-django-with-one-click-apps/','/guides/how-to-deploy-django-with-marketplace-apps/','/guides/django-marketplace-app/']
external_resources:
 - '[The Django Project](https://www.djangoproject.com/)'
 - '[Django Documentation](https://docs.djangoproject.com/en/2.2/releases/)'
---

[Django](https://www.djangoproject.com/) is a web development framework for the Python programing language. It enables rapid development, while favoring pragmatic and clean design. Django was initially developed for use in a newspaper's website division, and as a result the Django framework is very well suited to developing content-centric applications. It's also very flexible in its ability to facilitate many complex content management operations.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Django should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### Django Options

- **Django user** *(required)*: The username for your Django application.
- **Django user email** *(required)*: The email address you wish to use for your Django user and to generate the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Access Django

{{< note >}}
The Django Marketplace App will assign `DjangoApp` as the [Django project name](https://docs.djangoproject.com/en/5.0/intro/tutorial01/#creating-a-project).
{{< /note >}}

1. Open your web browser and navigate to `https://[domain]`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). You can also use your IPv4 address. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS.

1.  Once you have verified that you can access your Django site via the browser, you can log in using the admin credentials generated during the deployment. The credentials can be found in `/home/$USERNAME/.credentials`. Update the address in the browser to: `https://[domain]/admin`.

    ![Login to your Django site.](django-admin-login.png "Login to your Django site")

1.  Once logged in, you will have access to the Admin console. Now you can begin configuring your site.

    ![Django Admin Console](django-admin-console.png "Django Admin Console")

{{% content "marketplace-update-note-shortguide" %}}
