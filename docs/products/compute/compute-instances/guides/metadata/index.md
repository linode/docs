---
title: "Overview of the Metadata Service"
description: "Learn how to automate server provisioning on the Linode platform through the new Metadata service and cloud-init."
keywords: ["user data", "metadata", "cloud-init", "cloudinit"]
published: 2023-07-25
modified: 2023-09-11
modified_by:
  name: Linode
authors: ["Linode"]
---

{{% content "metadata-beta-notice" %}}

When deploying Compute Instances, it's almost always necessary to perform additional configuration before you can host your website or run your workloads. This configuration might include creating a new user, adding an SSH key, or installing software. It could also include more complex tasks like configuring a web server or other software that runs on the instance. Performing these tasks manually can be tedious and is not ideal at larger scales. To automate this configuration, Linode offers two provisioning automation tools: Metadata (covered in this guide), and [StackScripts](/docs/products/tools/stackscripts/).

## Overview

Linode's Metadata service provides a convenient method to automate software configuration when deploying a Compute Instance. It is an API that's accessible only from within a provisioned Compute Instance and provides relevant metadata to that instance. The Metadata service is designed to be consumed by [cloud-init](https://cloudinit.readthedocs.io/en/latest/), an industry standard software that automates cloud instance initialization. This allows you to use the same tool across multiple cloud providers, enabling a pathway for provisioning your systems as part of a multi-cloud infrastructure strategy.

The Metadata service provides both *instance data* and optional *user data*, both of which are explained below:

-   **Instance data:** The instance data includes information about the Compute Instance, including its label, plan size, region, host identifier, and more.
-   **User data:** User data is one of the most powerful features of the Metadata service and allows you to define your desired system configuration, including creating users, installing software, configuring settings, and more. User data is supplied by the user when deploying, rebuilding, or cloning a Compute Instance. This user data can be written as a cloud-config file, or it can be any script that can be executed on the target distribution image, such as a bash script.

    User data can be submitted directly in the Cloud Manager, Linode CLI, or Linode API. It's also often programmatically provided through IaC (Infrastructure as Code) provisioning tools like [Terraform](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/).

When a Compute Instance first boots up, cloud-init runs locally on the system, accesses the metadata, and then configures your system using that metadata.

## Comparison to StackScripts

Similar to Metadata, Linode's [StackScripts](/docs/products/tools/stackscripts/) service can be used to automate system provisioning. However, the StackScripts service is Linode-specific and does not interface with cloud-init. If you wish to keep your system provisioning tools cloud-agnostic and industry-standard, we recommend using the Metadata service.

## Availability

Akamai's Metadata service is available in beta and limited to select data centers. Additionally, user-submitted user data and cloud-init integration is currently only supported in a few distribution images. Supported data centers and distributions are listed below:

- **Data centers:** Washington, DC (`us-iad`) and Paris (`fr-par`)
- **Distributions:** Ubuntu 22.04 LTS and Ubuntu 20.04 LTS

Additional regions and distributions may be added throughout the beta period. When selecting a distribution in the Cloud Manager, the following icon designates distributions that fully support the Metadata service:

![Screenshot showing icon that indicates user data and cloud-init support for a distribution](cloud-init-supported-image.png)

{{< note >}}
Compute Instances deployed in a supported region can always access the [Metadata Service API](#access-the-metadata-service-api) to obtain instance data, regardless of the distribution. However, user data cannot be submitted for distributions that do not yet have cloud-init support.
{{< /note >}}

## Add User Data When Deploying a Compute Instance {#add-user-data}

The Metadata service is always active, so there's no need to enable it. User data can be provided to the Metadata service, which is then consumed by cloud-init when your Compute Instance boots up for the first time.

{{< tabs >}}
{{< tab "Cloud Manager" >}}
1.  Navigate to the **Linodes** page in the [Cloud Manager](http://cloud.linode.com) and click the **Create Linode** button. This opens the **Create Linode** form.

1.  Fill out the form with your desired settings. Be sure to select one of the supported distribution images and data centers.

1.  Expand the *Add User Data* section and enter your user data into the **User Data** field.

    ![Screenshot of the Add User Data section in the Cloud Manager](user-data-section.png)

    If you are unfamiliar with cloud-init, you can review the [Cloud-Config Usage and Examples](/docs/products/compute/compute-instances/guides/metadata-cloud-config/) guide for help creating a cloud-config file.

1.  Once you are ready, click the **Create Linode** button to deploy the instance.
{{< /tab >}}
{{< tab "Linode CLI" >}}
```command
linode-cli linodes create \
  --label new-instance-with-metadata \
  --region us-iad \
  --type g6-standard-2 \
  --image linode/ubuntu22.04 \
  --root_pass [your-root-password] \
  --metadata.user_data [your-user-data]
```

Replace *[your-root-password]* with a strong root password and *[your-user-data]* with the cloud-config data or script you wish to use. When using the CLI, user data must be a Base64-encoded string. Review the [Base64 Encoded](#base64-encoded) section below to generate the string.
{{< /tab >}}
{{< tab "Linode API" >}}
Run the API curl request below, making sure to properly paste in or reference your [API token](/docs/products/tools/api/guides/manage-api-tokens/).

```command
curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -X POST -d '{
      "label": "new-instance-with-metadata",
      "region": "us-iad",
      "type": "g6-standard-2",
      "image": "linode/ubuntu22.04",
      "root_pass": "[your-root-password]",
      "metadata": {
          "user_data": "[your-user-data]"
      }
    }' \
    https://api.linode.com/v4/linode/instances
```

Replace *[your-root-password]* with a strong root password and *[your-user-data]* with the cloud-config data or script you wish to use. When using the API, user data must be a Base64-encoded string. Review the [Base64 Encoded](#base64-encoded) section below to generate the string.
{{< /tab >}}
{{< /tabs >}}

When your Compute Instance boots up using a compatible distribution, cloud-init runs. If it detects that this is the first time running on this instance, it connects to the Metadata API and captures the instance data for that instance, including any user data that you added. It then uses that metadata to provision the software on the instance, including setting the hostname to the instance's label and executing the user data script.

{{< note >}}
User data can be added when creating a new Compute Instance, rebuilding an instance, cloning an instance, and restoring from a backup.
{{< /note >}}

### User Data Formats

User data can be provided in many different formats, with the most common being [cloud-config](https://cloudinit.readthedocs.io/en/latest/explanation/format.html#cloud-config-data).

-   **Cloud-config script:** cloud-config is the default syntax for cloud-init and can be used on any Linux distribution. It contains a list of directives formatted using YAML. Review the [Cloud-Config Usage and Examples](/docs/products/compute/compute-instances/guides/metadata-cloud-config/) guide for more details.

    ```command
    #cloud-config
    package_update: true
    package_upgrade: true
    packages:
    - nginx
    - mysql-server
    ```

-   **Executable script:** Cloud-init also accepts other scripts that can be executed by the target distribution. This includes bash and python. Since many commands (including those to create users and install packages) differ between distributions, providing these scripts may limit which distributions you can target.

    ```command
    #!/bin/bash
    apt-get update -y && apt-get upgrade -y
    apt-get install nginx mysql-server -y
    ```

-   **Other formats:** Review the [User data formats](https://cloudinit.readthedocs.io/en/latest/explanation/format.html#user-data-formats) guide within the official documentation to learn more about other types of formats supported by cloud-init.

#### Base64 Encoded

When submitting user data through the Linode CLI or API, you first need to encode it into [Base64](https://en.wikipedia.org/wiki/Base64) (without any line breaks/wraps). To do that, run the command below that corresponds with your local operating system. Replace *[file]* with the name (and path, if needed) of your cloud-config or script file.

{{< tabs >}}
{{< tab "macOS" >}}
```command
base64 --break=0 --input=[file]
```
{{< /tab >}}
{{< tab "Linux" >}}
```command
base64 --wrap=0 [file]
```
{{< /tab >}}
{{< /tabs >}}

## Modify Cloud-Init Configuration and Save a Custom Image {#modify-cloud-init}

Our supported distribution images have cloud-init pre-installed and configured to interact with our Metadata service. Beyond submitting user data, you are not able to adjust cloud-init settings directly through the Cloud Manager, Linode CLI, or Linode API. If you do wish to deploy Compute Instances using a modified cloud-init configuration, you can use our [Images](/docs/products/tools/images/) service.

1.  Deploy a new Compute Instance using your preferred supported distribution image.
1.  Log in to that instance using SSH or Lish and then modify the cloud-init configuration files (or add your own). These files are typically located in the `/etc/cloud/` folder.

    - `/etc/cloud/cloud.cfg`: The distribution-provided configuration settings.
    - `/etc/cloud/cloud.cfg.d/`: A directory containing other configuration files that are processed by cloud-init.
    - `/etc/cloud/cloud.cfg.d/99-linode.cfg`: The Linode-provided cloud-init configuration file. Since this is processed *after* the other configuration files, the settings here override any of the same settings that exist in those other configuration files.

1.  Once you have configured cloud-init with your desired settings, [create a custom image from that Compute Instance](/docs/products/tools/images/guides/capture-an-image/).

Now, when you wish to deploy a new Compute Instance, you can select your custom image. During the creation workflow, you can attach any desired user data for that particular instance. When cloud-init runs, your updated configuration settings will be used alongside any user data that you've added.

## Access the Metadata Service API

In addition to being consumed by cloud-init, the Metadata service can also be accessed through an API. The API is available on industry standard link-local IP addresses (`169.254.169.254` and `fd00:a9fe:a9fe::1`) and returns only instance data and user data for that Compute Instance.

1.  Log in to a Compute Instance that has been deployed in a supported data center using a supported distribution image.

1.  Generate your API token by running the command below:

    ```command
    curl -X PUT -H "Metadata-Token-Expiry-Seconds: 3600" http://169.254.169.254/v1/token
    ```

    Instead of receiving the token as an output string, you can save it directly to the `$TOKEN` environmental variable:

    ```command
    export TOKEN=$(curl -X PUT -H "Metadata-Token-Expiry-Seconds: 3600" http://169.254.169.254/v1/token)
    ```

1.  Query one of the following API endpoints to receive data from the API. If you did not save the API token to the `$TOKEN` variable, replace `$TOKEN` in the commands below with your token.

    -   **/v1/instance**: Output information about your instance, including plan resources.

        ```command
        curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/instance
        ```

    -   **/v1/network**: Output information about your instance's IP addresses.

        ```command
        curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/network
        ```

    -   **/v1/user-data**: Output your user data.

        ```command
        curl -H "Metadata-Token: $TOKEN" http://169.254.169.254/v1/user-data | base64 --decode
        ```

## Technical Specifications

- The Metadata service is an API designed to be consumed by the cloud-init provisioning tool.
- All user data is encrypted and the Metadata service is only accessible from within the Compute Instance.
- Supports custom user data in the form of cloud-config scripts, shell scripts, and more.
- User data can be added when creating, rebuilding, or cloning a Compute Instance. User data can also be added when performing one of those functions using a custom image created from a compatible distribution image.

{{< note type="warning" noTitle=true >}}
The Compute Instance must have a *public* network interface to access the Metadata service.
{{< /note >}}

## Troubleshoot Metadata and Cloud-Init

### View Cloud-Init Logs

If you encounter issues with cloud-init or your user data, you can review the logs and output logs by running one of the commands below:

```command
cat /var/log/cloud-init.log
cat /var/log/cloud-init-output.log
```

If you are not able to access your system through SSH, you can use [Lish](/docs/products/compute/compute-instances/guides/lish/) or boot your instance into [Rescue Mode](/docs/products/compute/compute-instances/guides/rescue-and-rebuild/) and mount your disks.

### Run the `cloud-init` Command

The `cloud-init` command-line tool can be used to gather more information or perform certain actions. Here are some commands you can utilize to help troubleshoot cloud-init.

- `cloud-init status --long`: This provides information about the status of cloud-init. You will notice different output depending on if it is actively running or if has run in the past. See [cloud-init status](https://cloudinit.readthedocs.io/en/latest/reference/cli.html#status).
- `cloud-init query v1` and `cloud-init query userdata`: This outputs either the instance data or the user data provided by the Metadata service. Other metadata is also exposed by entering a different query key. See [cloud-init query](https://cloudinit.readthedocs.io/en/latest/reference/cli.html#query).