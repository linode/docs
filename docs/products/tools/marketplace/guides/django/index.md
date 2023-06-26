---
description: "Learn how to deploy Django, a web framework that provides much of the core functionality required in modern web development, through the Linode Marketpplace"
keywords: ['django','marketplace', 'cms']
tags: ["cloud-manager","linode platform","cms","django","marketplace","digital agencies"]
published: 2020-03-11
modified: 2022-03-08
image: Django_oneclickapps.png
modified_by:
  name: Linode
title: "Deploy Django through the Linode Marketplace"
aliases: ['/platform/marketplace/how-to-deploy-django-with-marketplace-apps/','/platform/marketplace/deploying-django-with-marketplace-apps/', '/platform/one-click/how-to-deploy-django-with-one-click-apps/', '/platform/one-click/deploying-django-with-one-click-apps/','/guides/how-to-deploy-django-with-one-click-apps/','/guides/how-to-deploy-django-with-marketplace-apps/','/guides/django-marketplace-app/']
external_resources:
 - '[The Django Project](https://www.djangoproject.com/)'
 - '[Django Documentation](https://docs.djangoproject.com/en/2.2/releases/)'
authors: ["Linode"]
---

[Django](https://www.djangoproject.com/) is a web development framework for the Python programing language. It enables rapid development, while favoring pragmatic and clean design. Django was initially developed for use in a newspaper's website division, and as a result the Django framework is very well suited to developing content-centric applications. It's also very flexible in its ability to facilitate many complex content management operations.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Django should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used.

### Django Options

- **Django user** *(required)*: The username for your Django application.
- **Django password** *(required)*: Enter a *strong* password for your Django user.
- **Django user email** *(required)*: The email address you wish to use for your Django user.

{{< content "marketplace-special-character-limitations-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Access Django

{{< note >}}
The Django Marketplace App will assign `DjangoApp` as the [Django project name](https://docs.djangoproject.com/en/3.0/intro/tutorial01/#creating-a-project).
{{< /note >}}

After Django has finished installing, you will be able to access your Django site at your Linode's IPv4 address, for instance: `http://yourlinodeip:8000`.

1.  To find your Linode's IPv4 address. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

1. Find the Linode you just created when deploying your app and select it.

1. Navigate to the **Networking** tab.

1. The IP address will be displayed under the **Address** column in the **IPv4** table.

1. Copy and paste the IPv4 address into a browser window followed by `:8000`. You should see the Django test page appear.

    ![Django Test Page](django-test-page.png "Django Test Page")

1.  Once you have verified that you can access your Django site via the browser, you can log in using the admin credentials you created when deploying your app. Update the address in the browser to: `http://yourlinodeip:8000/admin`.

    ![Login to your Django site.](django-admin-login.png "Login to your Django site")

1.  Once logged in, you will have access to the Admin console. Now you can begin configuring your site.

    ![Django Admin Console](django-admin-console.png "Django Admin Console")

{{< content "marketplace-update-note-shortguide">}}
