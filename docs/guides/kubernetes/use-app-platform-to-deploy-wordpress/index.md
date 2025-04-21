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

This guide includes steps for deploying a WordPress site and MySQL database using App Platform for Linode Kubernetes Engine (LKE). In this architecture, both WordPress and MySQL use PersistentVolumes (PV) and PersistentVolumeClaims (PVC) to store data.

Akamai App Platform for LKE uses the Add Helm Chart feature to add the WordPress and MySQL Helm charts to the App Platform Catalog.

## Prerequisites

-   A [Cloud Manager](https://cloud.linode.com/) account is required to use Akamai's cloud computing services, including LKE.

-   Enrollment into the Akamai App Platform's [beta program](https://cloud.linode.com/betas).

-   An provisioned and configured LKE cluster with App Platform enabled and [auto-scaling](https://techdocs.akamai.com/cloud-computing/docs/manage-nodes-and-node-pools#autoscale-automatically-resize-node-pools) turned on. A Kubernetes cluster consisting of 3 [Dedicated CPU Compute Instances](https://techdocs.akamai.com/cloud-computing/docs/dedicated-cpu-compute-instances) is sufficient for the deployment in this guide to run, but additional resources may be required during the configuration of your App Platform architecture.

    To ensure sufficient resources are available, it is recommended that node pool auto-scaling for your LKE cluster is enabled after deployment. Make sure to set the max number of nodes higher than your minimum. This may result in higher billing costs.

To learn more about provisioning a LKE cluster with App Platform, see our [Getting Started with App Platform for LKE](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-akamai-application-platform) guide.

## Components

### Infrastructure

-   **Linode Kubernetes Engine (LKE)**: LKE is Akamai’s managed Kubernetes service, enabling you to deploy containerized applications without needing to build out and maintain your own Kubernetes cluster.

-   **App Platform for LKE**: A Kubernetes-based platform that combines developer and operations-centric tools, automation, self-service, and management of containerized application workloads. App Platform for LKE streamlines the application lifecycle from development to delivery and connects numerous CNCF (Cloud Native Computing Foundation) technologies in a single environment, allowing you to construct a bespoke Kubernetes architecture.

### Software

-   [**MySQL**](https://www.mysql.com/): An open source database management system that uses a relational database and SQL (Structured Query Language) to manage its data.

-   [**WordPress**](https://wordpress.com/): The WordPress application is an industry standard, open source CMS (content management system) often used for creating and publishing websites.

-   [**Ingress NGINX Controller**](https://github.com/kubernetes/ingress-nginx): When creating a Service in App Platform, an `ingress` is created using NGINX's Ingress Controller to allow public access to internal services.

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

To install WordPress on your cluster, add the WordPress Helm chart using the Git Repository URL.

1.  While still using the `admin` team view, click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

1.  Under **Git Repository URL**, add the URL to the `wordpress` Helm chart .yaml file:

    ```command
    https://github.com/bitnami/charts/blob/wordpress/24.1.18/bitnami/wordpress/Chart.yaml
    ```

1.  Click **Get Details** to populate the `wordpress` Helm chart details.

1.  Deselect **Allow teams to use this chart**. This allows teams other than `admin` to use the Helm chart.

1.  Click **Add Chart**.

### Add the MySQL Helm Chart to the Catalog

Repeat the same steps for installing the MySQL service on your cluster.

1.  Click on **Catalog** in the left menu.

1.  Select **Add Helm Chart**.

1.  Under **Git Repository URL**, add the URL to the `mysql` Helm chart .yaml file:

    ```command
    https://github.com/bitnami/charts/blob/mysql/12.3.1/bitnami/mysql/Chart.yaml
    ```

1.  Click **Get Details** to populate the `mysql` Helm chart details. You may need to change the **Target Directory Name** field to read "MySQL". This is used to differentiate Helm charts within the Catalog.

1.  Deselect **Allow teams to use this chart**.

1.  Click **Add Chart**.

## Deploy a MySQL Database and WordPress Site

Separate Workloads are created for MySQL and WordPress in order to deploy a database and site, respectively. Both Workloads require passwords, so to prevent the passwords from being stored unencrypted, Sealed Secrets are created for each first.

[Sealed Secrets](https://apl-docs.net/docs/for-devs/console/secrets) are encrypted Kubernetes Secrets stored in the Values Git repository. When a Sealed Secret is created in the Console, the Kubernetes Secret will appear in the Team's namespace.

### Create a Sealed Secret to Store MySQL Passwords

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Sealed Secrets** from the menu.

1.  Click **Create SealedSecret**.

1.  Add a name for your Sealed Secret, where this name is also used when creating the MySQL Workload. This guide uses the name `mysql-credentials`.

1.  Select type _[kubernetes.io/opaque](kubernetes.io/opaque)_ from the **type** dropdown menu.

1.  Add the following **Key** and **Value** pairs, replacing `{{< placeholder "YOUR_PASSWORD" >}}` and `{{< placeholder "YOUR_ROOT_PASSWORD" >}}` with your own secure passwords:

    - Key=`mysql-password`, Value=`{{< placeholder "YOUR_PASSWORD" >}}`
    - Key=`mysql-root-password`, Value=`{{< placeholder "YOUR_ROOT_PASSWORD" >}}`

1.  Click **Submit**. The Sealed Secret may take a few minutes to become ready.

### Create a Sealed Secret to Store WordPress Credentials

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Sealed Secrets** from the menu.

1.  Click **Create SealedSecret**.

1.  Add a name for your Sealed Secret, where this name is also used when creating the WordPress Workload. This guide uses the name `wordpress-credentials`.

1.  Select type _[kubernetes.io/opaque](kubernetes.io/opaque)_ from the **type** dropdown menu.

1.  Add the following **Key** and **Value** pairs.

    Replace `{{< placeholder "YOUR_MYSQL_PASSWORD" >}}` with the same password you used for your `mysql-password` when creating the `mysql-credentials` Sealed Secret above. Replace `{{< placeholder "YOUR_PASSWORD" >}}` with your own secure password:

    - Key=`mariadb-password`, Value=`{{< placeholder "YOUR_MYSQL_PASSWORD" >}}`
    - Key=`wordpress-password`, Value=`{{< placeholder "YOUR_PASSWORD" >}}`

1.  Click **Submit**. The Sealed Secret may take a few minutes to become ready.

### Create the MySQL Workload

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Workloads**.

1.  Click on **Create Workload**.

1.  Select the _MySQL_ Helm chart from the Catalog.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name `wordpress-mysql`.

1.  Set the following chart values:

    ```
    auth:
      database: "{{< placeholder "wordpress" >}}"
      username: "{{< placeholder "wordpress" >}}"
      existingSecret: "{{< placeholder "mysql-credentials" >}}" # Change when using a different name
    networkPolicy:
      enabled: {{< placeholder "false" >}}
    ```

    {{< note title="Managing Network Policies" >}}
    The `networkPolicy` is disabled since all traffic is allowed by default. Rather than configuring `networkPolicy` values directly in the Workload config, this guide centrally manages all network policies using App Platform's [**Network Policies**](https://apl-docs.net/docs/for-ops/console/netpols) function.
    {{< /note >}}

1.  Click **Submit**. The Workload may take a few minutes to become ready.

### Create the WordPress Workload

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Workloads**.

1.  Click on **Create Workload**.

1.  Select the _WordPress_ Helm chart from the Catalog.

1.  Click on **Values**.

1.  Provide a name for the Workload. This guide uses the Workload name `wordpress`.

1.  Set the following chart values. Replace {{< placeholder "YOUR_USERNAME" >}} with the username you wish to use for logging into WordPress:

    ```
    mariadb:
      enabled: {{< placeholder "false" >}}
    externalDatabase:
      host: {{< placeholder "wordpress-mysql.team-labs.svc.cluster.local" >}}
      user: {{< placeholder "wordpress" >}}
      database: {{< placeholder "wordpress" >}}
      existingSecret: "{{< placeholder "wordpress-credentials" >}}"
    service:
      type: {{< placeholder "ClusterIP" >}}
    networkPolicy:
      enabled: {{< placeholder "false" >}}
    existingSecret: "{{< placeholder "wordpress-credentials" >}}"
    wordpressUsername: "{{< placeholder "YOUR_USERNAME" >}}"
    ```

1.  Click **Submit**. The Workload may take a few minutes to become ready.

### Create Network Policies

Create a Network Policy allowing only the WordPress Pod to connect to the MySQL database.

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Select **Network Policies** from the menu.

1.  Click **Create Netpol**.

1.  Add a name for the Network Policy. This guide uses the name `wordpress-mysql`.

1.  Select **Rule type** `ingress` using the following values, where `kfp` is the name of the Workload created in the next step:

    - **Selector label name**: [`app.kubernetes.io/instance`](http://app.kubernetes.io/instance)

    - **Selector label value**: `kfp`

1.  Select **AllowOnly**, and enter the following values:

    - **Namespace name**: __

    - **Selector label name**: [`app.kubernetes.io/instance`](http://app.kubernetes.io/instance)

    - **Selector label value**: `wordpress`

1.  Click **Submit**.

#### Check the Pod Status

Using the App Platform **Shell** feature, you can check to see if the WordPress Pod has started and connected to the MySQL database.

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  In the left menu, select **Shell**.

1.  Once the Shell session has loaded, enter the following command to launch the k9s interface. [k9s](https://k9scli.io/) is an open source, terminal-based Kubernetes user interface pre-installed with Akamai App Platform:

    ```command
    k9s
    ```

1.  A `CrashLoopBackOff` status signifies that WordPress has not successfully connected to the database.

    ![SCREENSHOT]()

    In order to force a restart, click on the WordPress Pod, and type <kbd>Ctrl</kbd> + <kbd>D</kbd>. This kills the current Pod and starts a new one.

    ![SCREENSHOT]()

## Create a Service to Expose the WordPress Site

Creating a [Service](https://apl-docs.net/docs/for-devs/console/services) in App Platform configures NGINX’s Ingress Controller. This allows you to enable public access to services running internally on your cluster.

1.  Select **view** > **team** and **team** > **demo** in the top bar.

1.  Click **Services**, and select **Create Service**.

1.  In the **Name** dropdown menu, select the `wordpress` service.

1.  Under **Exposure (ingress)**, select **External**.

1.  Click **Submit**.

1.  Once the Service is ready, click the URL of the `wordpress` service to navigate to the live WordPress site:

    ![SCREENSHOT]()

### Setting Up DNS

When creating a Service, DNS for your site can be configure using a CNAME rather than using an external IP address. To do this, configure a CNAME entry with your domain name provider, and follow the steps in our [Using a CNAME](https://apl-docs.net/docs/for-devs/console/services#using-a-cname) App Platform documentation.

See our guide on [CNAME records](https://techdocs.akamai.com/cloud-computing/docs/cname-records) for more information on how CNAME records work.

### Access the WordPress UI

1.  While viewing the WordPress site in your browser, add `/wp-admin` to the end of the URL, where {{< placeholder "MY_WORDPRESS_URL" >}} is your site URL:

    ```
    http://{{< placeholder "MY_WORDPRESS_URL" >}}/wp-admin
    ```

    This should bring you to the WordPress admin panel login screen:

    ![SCREENSHOT]()

1.  To access the WordPress UI, sign in with your WordPress username and password.

    Your username is the value used for `wordpressUsername` when creating the [WordPress Workload](#create-the-wordpress-workload). Your password is the value used for `wordpress-password` when making your `wordpress-credentials` [Sealed Secret](#create-a-sealed-secret-to-store-wordpress-credentials):

    ![SCREENSHOT]()

## Going Further

Once you've accessed the WordPress UI, you can begin modifying your site using WordPress templates, themes, and plugins. For more information, see WordPress's resources below:

- [WordPress Support](https://wordpress.org/support/): Learn the basic workflows for using WordPress.

- [Securing WordPress](https://www.linode.com/docs/guides/how-to-secure-wordpress/): Advice on securing WordPress through HTTPS, using a secure password, changing the admin username, and more.

- [WordPress Themes](https://wordpress.org/themes/#): A collection of thousands of available WordPress themes.