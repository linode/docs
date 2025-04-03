---
slug: use-app-platform-to-deploy-wordpress
title: "Use App Platform to Deploy WordPress with Persistent Volumes on LKE"
description: "Two to three sentences describing your guide."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-04-03
keywords: ['app platform','app platform for lke','lke','linode kubernetes engine','kubernetes','persistent volumes','mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Akamai App Platform for LKE](https://techdocs.akamai.com/cloud-computing/docs/application-platform)'
- '[Akamai App Platform Documentation](https://apl-docs.net/docs/akamai-app-platform/introduction)'
---

{{< note title="Beta Notice" type="warning" >}}
The Akamai App Platform is now available as a limited beta. It is not recommended for production workloads. To register for the beta, visit the [Betas](https://cloud.linode.com/betas) page in the Cloud Manager and click the Sign Up button next to the Akamai App Platform Beta.
{{< /note >}}

This guide includes steps for deploying a WordPress site and MySQL database using App Platform for LKE. In this architecture, both WordPress and MySQL use PersistentVolumes and PersistentVolumeClaimes to store data.

Akamai App Platform for LKE uses the Add Helm Chart feature to add the WordPress and MySQL Helm charts to the App Platform Catalog.

## Prerequisites

## Set Up Infrastructure

Once your LKE cluster is provisioned and the App Platform web UI is available, complete the following steps to continue setting up your infrastructure.

Sign into the App Platform web UI using the `platform-admin` account, or another account that uses the `platform-admin` role. Instructions for signing into App Platform for the first time can be found in our [Getting Started with Akamai App Platform](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-akamai-application-platform) guide.

### Create a New Team

[Teams](https://apl-docs.net/docs/for-ops/console/teams) are isolated tenants on the platform to support Development/DevOps teams, projects or even DTAP. A Team gets access to the Console, including access to self-service features and all shared apps available on the platform.

When working in the context of an admin-level Team, users can create and access resources in any namespace. When working in the context of a non-admin Team, users can only create and access resources used in that Team’s namespace.

1.  Select **view** > **platform**.

1.  Select **Teams** in the left menu.

1.  Click **Create Team**.

1.  Provide a **Name** for the Team. Keep all other default values, and click **Submit**. This guide uses the Team name `demo`.

### Add the WordPress Helm Chart to the Catalog

[Helm charts](https://helm.sh/) provide information for defining, installing, and managing resources on a Kubernetes cluster. Custom Helm charts can be added to App Platform Catalog using the **Add Helm Chart** feature.

1.  While still using the `admin` team view, click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

    ![Add Helm Chart](APL-LLM-Add-Helm-Chart.jpg)

1.  Under **Git Repository URL**, add the URL to the `wordpress` Helm chart:

    ```command
    https://github.com/bitnami/charts/blob/wordpress/24.1.18/bitnami/wordpress/Chart.yaml
    ```

1.  Click **Get Details** to populate the `wordpress` Helm chart details.

1.  Deselect **Allow teams to use this chart**. This allows teams other than `admin` to use the Helm chart.

1.  Click **Add Chart**.

### Add the MySQL Helm Chart to the Catalog

Repeat the steps above to add the MySQL Helm chart.

1.  Click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

    ![Add Helm Chart](APL-LLM-Add-Helm-Chart.jpg)

1.  Under **Git Repository URL**, add the URL to the `mysql` Helm chart:

    ```command
    https://github.com/bitnami/charts/blob/mysql/12.3.1/bitnami/wordpress/Chart.yaml
    ```

1.  Click **Get Details** to populate the `mysql` Helm chart details. You may need to change the **Target Directory Name** field to read "MySQL". This is used to differentiate Helm charts within the Catalog.

1.  Deselect **Allow teams to use this chart**.

1.  Click **Add Chart**.

