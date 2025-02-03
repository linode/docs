---
title: "Deploy Backstage Developer Portal through the Linode Marketplace"
description: "Deploy a Backstage framework for developing developer portals"
published: 2020-01-31
modified: 2025-01-31
keywords: ['backstage', 'developer portal']
tags: ["ubuntu", "marketplace", "developer portal", "developer", "linode platform", "cloud manager"]
external_resources:
- '[Backstage](https://backstage.io/)'
- '[Backstage documentation](https://backstage.io/docs/overview/what-is-backstage)'
aliases: ['/products/tools/marketplace/guides/backstage/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

Backstage is an open-source platform for building developer portals designed to simplify and unify software development processes. It provides a centralized hub for managing services, tools, and documentation. Backstage enables teams to improve efficiency, collaboration, and scalability across projects.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Once a compute instance finishes provisioning, the Backstage installation takes 3-5 minutes.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.


## Prerequisites

The Backstage application for Cloud Manager is configured with a Github authentication and allows you to integrate pulling catalog entities from Github directly. Before you can deploy the One-Click application, you need to create an OAuth application and authorize it to use your domain name.

To learn how to configure authentication to Github, see [Setting up authentication](https://backstage.io/docs/getting-started/config/authentication/#setting-up-authentication).

For reference, you can use the following image as a guideline to configure the OAuth application.

![Oauth Example App](./oauth-example.png)

{{< note >}}
Optionally, you can configure the [Github integration](https://backstage.io/docs/getting-started/config/authentication/#setting-up-a-github-integration), but it's not required for the deployment of the Backstage One-Click app.
{{< /note >}}

You only need to perform instructions from the linked sections. No need to perform following steps from linked pages.
Once done, save the following data to use in the following steps:

- Client ID,
- Client Secret,
- Personal Access Token (not required).

### Backstage Options

- **Your Linode API token** *(required)*: Linode API token to create DNS records for Backstage.
- **The subdomain for the DNS record** *(required)*: Subdomain to be created for Backstage. Enter the same value you provided when creating the OAuth application in the previous section.
- **The domain for the DNS record** *(required)*: The domain name for your Backstage instance. Enter the same value you provided when creating the OAuth application in the previous section.
- **Email address** *(required)*: Email address to use for generating the SSL certificates and configuring the server and DNS records.
- **Allowed IPs**: IP addresses allowed to access the frontend. If no IP addresses are provided, the frontend will be accessible to the public. It's highly recommended to enter your IP address.
- **Backstage application name** *(required)*: The name for the Backstage application. The application will live under this name in backstage home directory.
- **Github Oauth Client ID** *(required)*: OAuth Client ID created in Github, from the previous section.
- **Github Oauth Client Secret** *(required)*: OAuth Client Secret created in Github, from the previous section.
- **Github Username** *(required)*: Your Github username for you to authorize the Github backend authentication.
- **Backstage Organization Name** *(required)*: The organization name that will be used in the backstage configuration.
- **Github Personal Access Token**: The personal access token to integrate Backstage with Github. This will you to load catalog entities from Github.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

To get started with Backstage:

1. Open a web browser and navigate to your Backstage instance by using the domain name provided during the setup.
1. Log into your Github account for the authentication.

     ![Authenticate](./github-auth.png)

1. Go to the **Settings** tab, to see your authentication.

    ![Logged-In](./gituser.png)

You are now ready to start working with Backstage.

{{% content "marketplace-update-note-shortguide" %}}