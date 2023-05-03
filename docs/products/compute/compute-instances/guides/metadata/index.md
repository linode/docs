---
title: "Overview of the Metadata Service"
description: ""
keywords: ["user data", "metadata", "cloud-init", "cloudinit"]
published: 2023-05-03
modified_by:
  name: Linode
authors: ["Linode"]
---

When deploying Compute Instances, it's almost always necessary to perform additional configuration before you can host your website or run your workloads. This configuration might include creating a new user, adding an SSH key, or installing software. It could also include more complex tasks like configuring a web server or other software that runs on the instance. Performing these tasks manually can be tedious and is not ideal at larger scales. To automate this configuration, Linode offers two provisioning tools: Metadata (covered in this guide) and StackScripts.

## Overview

Linode's Metadata service provides a convenient method to automate software configuration when deploying a Compute Instance. It is accessed by a newly deployed instance through an HTTP request and provides relevant metadata to that instance. This metadata includes details about the instance's plan, resources, ip addresses, among other information --- such as *user data*.

The Metadata service is designed to be consumed by [Cloud-Init](https://cloudinit.readthedocs.io/en/latest/), an industry standard software that automates cloud instance initialization. When a Compute Instance first boots up, the Cloud-Init tool runs locally on the system, accesses the metadata, and configures your system according to the user data that is supplied.

User data is one of the most powerful features of the Metadata service and allows you to define your desired system configuration, including creating users, installing software, configuring settings, and more. User data is supplied by the user when deploying, rebuilding, or cloning a Compute Instance through the Cloud Manager, Linode CLI, or Linode API. This user data can written as a cloud-config file or any script that can be executed on the target distribution image, such as a bash script.

## Comparison to StackScripts

Similar to Metadata, StackScripts can also be used to automate system provisioning. However, it does not use Cloud-Init and instead runs its custom script and any user-defined variables during the system's first boot. If you are already using Cloud-Init, we recommend using the Metadata service. If you do not yet have a provisioning tool, both can be considered.

## User Data Formats

User data can be provided in many different formats, with the most common being Cloud-Config.

-   **Cloud-Config script:** Cloud-config is the default syntax for Cloud-Init and can be used on any Linux distribution. It contains a list of directives formatted using YAML.

    ```command
    #cloud-config
    package_update: true
    package_upgrade: true
    packages:
    - nginx
    - mysql-server
    ```

-   **Executable script:** Cloud-Init also accepts other scripts that can be executed by the target distribution. This includes bash and python. Since many commands (including those to create users and install packages) differ between distributions, providing these scripts may limit which distributions you can target.

    ```command
    #!/bin/bash
    apt-get update -y && apt-get upgrade -y
    apt-get install nginx mysql-server -y
    ```

-   **Other formats:** Review the [User data formats](https://cloudinit.readthedocs.io/en/latest/explanation/format.html#user-data-formats) guide within the official documentation to learn more about other types of formats supported by Cloud-Init.

## Technical Specifications

- **Compatible distributions:** All Linode-provided distribution images are supported except Kali Linux and Slackware.
- Can be deployed alongside Custom Images that use one of the supported distributions
- All user data is encrypted
- Supports shell scripts, include files, part handlers, cloud config, etc
- Supported metadata: Linode instance id , Hostname, Region, Plan Type [Dedicated/Shared/GPU], CPU, RAM, Storage, VLAN ID, Private IP (IPV4), Public IP (IPV4), Private IP (IPV6), Public IP (IPV6), Backup Status [Backup not enabled, Running, Completed], SSH - Public key (This includes all SSH keys that were specified at the time when the Linode was created)

## Deploy a Compute Instance with User Data

{{< tabs >}}
{{% tab "Cloud Manager" %}}
1.  Navigate to the **Linodes** page in the [Cloud Manager](http://cloud.linode.com) and click the **Create Linode** button. This opens the **Create Linode** form.

1.  Fill out the form with your desired settings. Be sure to select one of the supported distribution images.

1.  Expand the *Add User Data* section and enter your user data into the **User Data** field.

    ![Screenshot of the Add User Data section in the Cloud Manager](user-data-section.png)

    If you are unfamiliar with Cloud-Init, you can review the [Cloud-Config Usage and Examples](/docs/products/compute/compute-instances/guides/metadata-cloud-config/) guide for help creating a cloud-config file.

1.  Once you are ready, click the **Create Linode** button to deploy the instance.
{{% /tab %}}
{{% tab "Linode CLI" %}}
```command
linode-cli linodes create \
  --label linode123 \
  --root_pass aComplex@Password \
  --booted true \
  --stackscript_id 10079 \
  --stackscript_data '{"gh_username": "linode"}' \
  --region us-east \
  --type g6-standard-2 \
  --authorized_keys "ssh-rsa AAAA_valid_public_ssh_key_123456785== user@their-computer"
  --authorized_users "myUser"
  --authorized_users "secondaryUser"
```

```output
Placeholder.
```
{{% /tab %}}
{{% tab "Linode API" %}}
Run the API curl request below, making sure to properly paste in or reference your [API token](/docs/products/tools/api/guides/manage-api-tokens/).

```command
curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -X POST -d '{
      "backup_id": 1234,
      "backups_enabled": true,
      "swap_size": 512,
      "image": "linode/debian9",
      "root_pass": "aComplexP@ssword",
      "stackscript_id": 10079,
      "stackscript_data": {
        "gh_username": "linode"
      },
      "interfaces": [
        {
          "purpose": "public",
          "label": "",
          "ipam_address": ""
        },
        {
          "purpose": "vlan",
          "label": "vlan-1",
          "ipam_address": "10.0.0.1/24"
        }
      ],
      "authorized_keys": [
        "ssh-rsa AAAA_valid_public_ssh_key_123456785== user@their-computer"
      ],
      "authorized_users": [
        "myUser",
        "secondaryUser"
      ],
      "booted": true,
      "label": "linode123",
      "type": "g6-standard-2",
      "region": "us-east",
      "group": "Linode-Group"
    }' \
    https://api.linode.com/v4/linode/instances
```

```output
Placeholder.
```
{{% /tab %}}
{{< /tabs >}}

## View Cloud-Init Logs

If you encounter issues with Cloud-Init or your user data, you can review the output log by running the command below:

```command
cat /var/log/cloud-init-output.log
```