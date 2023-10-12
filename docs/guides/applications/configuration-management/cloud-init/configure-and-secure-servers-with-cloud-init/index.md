---
slug: configure-and-secure-servers-with-cloud-init
title: "Use Cloud-init to Automatically Configure and Secure Your Servers"
description: 'Learn how you can use cloud-init to automate the process of configuring and securing a new cloud instance.'
og_description: 'Learn how you can use cloud-init to automate the process of configuring and securing a new cloud instance.'
keywords: ['cloud-init','cloudinit','metadata']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-09-11
modified_by:
  name: Nathaniel Stickman
---

## What is cloud-init?

[Cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) is an industry standard method for automating cloud instance initialization, with support across distributions and platforms. Cloud-init manages initialization using a combination of instance metadata and configuration scripts (user data) to automate the process of setting up a new server.

Akamai's [Metadata](/docs/products/compute/compute-instances/guides/metadata/) service provides an API for cloud-init to consume, offering the relevant instance and user data to initialize your server. When your new instance spins up, cloud-init starts running locally, accesses the metadata, and automatically configures your system accordingly.

{{< note title="Metadata Availability" >}}
Akamai’s Metadata service is now available in select data centers. Use Metadata to automate system configuration by adding directives or scripts when deploying Compute Instances. This user data can then be consumed by cloud-init, an industry standard system initialization tool, or accessed directly using the Metadata API. For instructions on using the Metadata service and for a list of supported regions and distributions, reference our [documentation](https://www.linode.com/docs/products/compute/compute-instances/guides/metadata/#availability).
{{< /note >}}

## Create a Cloud-Config File

Cloud-init consumes instance metadata from Akamai's Metadata server. This gives cloud-init relevant information about the Compute Instance. From there, cloud-init derives specific initialization steps from supplied *user data*, which comes in the form of *cloud-config* scripts.

Cloud-config scripts use declarative YAML formatting to define configuration and other steps cloud-init needs to initialize the new instance. Learn more about cloud-config scripts in our guide on [Using Cloud-Config Files to Configure a Server](/docs/products/compute/compute-instances/guides/metadata-cloud-config/).

When creating an Akamai Compute Instance, you can add the cloud-config via the Cloud Manager, Linode CLI, or Linode API when deploying the instance. Refer to our [Metadata](/docs/products/compute/compute-instances/guides/metadata/) guide for details on when and how to add the cloud-config *user data*.

To start, create an initial cloud-config file to design your desired server initialization. The examples that follow name the file `cloud-config.yaml`. All cloud-config files begin with the following line:

```file {title="cloud-config.yaml" lang="yaml"}
#cloud-config
```

From there, you need to fill out the cloud-config with specific options matching your needs for the server. The rest of this guide walks you through a series of recommended cloud-config options for initializing and securing a Compute Instance. These configurations parallel the steps in our guide on [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/).

Toward the end of the guide, you can see the [Complete Cloud-Config File](#complete-cloud-config-file) as well as steps for how to [Deploy an Instance with User Data](#deploy-an-instance-with-user-data).

## Update Your System

Cloud-config includes a module for handling system updates using two keys: `package_update` and `package_upgrade`. Including both of these with values of `true` ensures that package updates and upgrades are run as part of the initialization.

```file {title="cloud-config.yaml" lang="yaml"}
package_update: true
package_upgrade: true
```

The section on how to [Install Any Additional Required Software](#install-any-additional-required-software) provides further resources for working with packages in cloud-config.

## Configure Basic Server Details

Cloud-config has a range of options for setting up server details. This section applies two of those options, providing your server with recommended details by setting up the timezone and hostname.

The `timezone` key provides a straightforward method for setting your server's timezone. It takes any valid timezone for your system as an argument. Typically, you can find these using `timedatectl list-timezones` or by navigating the paths in `/usr/share/zoneinfo`.

```file {title="cloud-config.yaml" lang="yaml"}
timezone: 'US/Central'
```

The `hostname` key conveniently assigns a hostname for your instance. In this example, the cloud-init initializes the server with the hostname `examplehost`:

```file {title="cloud-config.yaml" lang="yaml"}
hostname: examplehost
```

{{< note >}}
Cloud-config's `hostname` key does not modify the `/etc/hosts` file by default. That lets you take control over the server's hostname by the usual route of modifying the `/etc/hosts` file after initialization.

You can, alternatively, have cloud-init fully manage the `/etc/hosts` file by setting the `manage_etc_hosts` key to `true`. On each boot, cloud-init ensures that the contents of the `/etc/hosts` matches the contents of `/etc/cloud/templates/hosts.tmpl`.

Learn more in cloud-init's module reference for [Update Etc Hosts](https://cloudinit.readthedocs.io/en/latest/reference/modules.html#update-etc-hosts).
{{< /note >}}

## Add a Limited User Account

Your instance should have at least one limited user account to prevent remote root access and the associated security risks. Cloud-config's `users` key can define one or more new users for your system, including features like `sudo` access.

For example, below is the typical configuration for initializing a limited user with `sudo` access. The setup also includes the default user, which is recommended.

```file {title="cloud-config.yaml" lang="yaml"}
users:
  - default
  - name: example-user
    groups:
      - sudo
    sudo:
      - ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
```

However, the example is incomplete, since the user does not have a password or SSH key. You can create a password using the `passwd` option, but this is not recommended. Instead, you should set up an SSH key for the user, as shown in the next section.

For more on creating and managing users with cloud-init, refer to our guide [Use Cloud-init to Manage Users on New Servers](/docs/guides/manage-users-with-cloud-init/). The guide includes more information on setting up user passwords, should you need to.

## Add an SSH Key to Your Limited User Account

Rather than using a password for access, the more secure approach is setting up your limited user, or users, with SSH key authentication. If you do not yet have an SSH key pair, get one by following the relevant section of our guide on how to [Use SSH Public Key Authentication](/docs/guides/use-public-key-authentication-with-ssh/#generate-an-ssh-key-pair).

Once you have an SSH key pair, you can add an SSH public key to a user defined in the cloud-config with the `ssh_authorized_keys` option. The option accepts a list of SSH public keys to authorize for access to this user.

```file {title="cloud-config.yaml" lang="yaml"}
users:
  - default
  - name: example-user
    groups:
      - sudo
    sudo:
      - ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    ssh_authorized_keys:
      - <SSH_PUBLIC_KEY>
```

## Harden SSH

To increase the security of SSH connections into your Compute Instance, you should generally disable password authentication and root logins via SSH. This way, access is restricted to limited users and connections authenticated by SSH key pairs.

By default, the cloud-config `users` setup assumes `lock_passwd: true`, automatically disabling password authentication. You can learn more about user setup and managing such features in our guide [Use Cloud-init to Manage Users on New Servers](/docs/guides/manage-users-with-cloud-init/).

To disable root logins, you need to modify the SSH configuration file. Cloud-config does not have a direct option for this, but you can use its versatile `runcmd` key to automate the necessary commands. Learn more about the `runcmd` option in our guide [Use Cloud-init to Run Commands and Bash Scripts on First Boot](/docs/guides/run-commands-and-bash-scripts-with-cloud-init).

The example below removes any existing `PermitRootLogin` configuration and adds a new configuration disabling `PermitRootLogin`. The last command restarts the `sshd` service for the changes to take effect.

```file {title="cloud-config.yaml" lang="yaml"}
runcmd:
  - sed -i '/PermitRootLogin/d' /etc/ssh/sshd_config
  - echo "PermitRootLogin no" >> /etc/ssh/sshd_config
  - systemctl restart sshd
```

{{< note >}}
The example above assumes your system uses `systemctl` to manage the SSH service. While that is the case with the latest versions of the most popular distributions, it is not the case for all distributions. You may need to modify the commands above depending on how your system manages the SSH service.

For instance, systems like CentOS 6, Debian 7, and Ubuntu 14.04 use `service` instead of `systemctl`. So you would need to replace the `systemctl` command above with the following:

```command
service sshd restart
```
{{< /note >}}

## Install Any Additional Required Software

With cloud-config's `packages` key, you can automate software installation and management as part of server initialization. For thorough coverage of cloud-init's package management features, and examples of how to use it, see our guide [Use Cloud-init to Install and Update Software on New Servers](/docs/guides/install-and-update-software-with-cloud-init/).

As a basic illustration, the snippet below shows how to install a set of software during instance initialization. The example installs software for a LEMP web stack (NGINX, MySQL, and PHP) a popular setup for web applications. You can learn more about LEMP stacks in our guide on how to [Install a LEMP Stack](/docs/guides/how-to-install-a-lemp-stack-on-ubuntu-22-04/).

```file {title="cloud-config.yaml" lang="yaml"}
packages:
  - mysql-server
  - nginx
  - php
```

## Complete Cloud-Config File

What follows is a complete example cloud-config file, summarizing all of the initialization options covered in this tutorial. You can use this as a basis for initializing your own Compute Instances. For example, remove the `packages` section and customize the limited user and server details, and you have a script following our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide. Feel free to add other features to fine-tune the instance to your needs.

```file {title="cloud-config.yaml" lang="yaml" hl_lines="6,13,20,21,31,32,33"}
#cloud-config

# Configure a limited user
users:
  - default
  - name: example-user
    groups:
      - sudo
    sudo:
      - ALL=(ALL) NOPASSWD:ALL
    shell: /bin/bash
    ssh_authorized_keys:
      - "SSH_PUBLIC_KEY"

# Perform System Updates
package_update: true
package_upgrade: true

# Configure server details
timezone: 'US/Central'
hostname: examplehost

# Harden SSH access
runcmd:
  - sed -i '/PermitRootLogin/d' /etc/ssh/sshd_config
  - echo "PermitRootLogin no" >> /etc/ssh/sshd_config
  - systemctl restart sshd

# Install additional software packages
packages:
  - nginx
  - mysql-server
  - php
```

## Deploy an Instance with User Data

There are three paths to deploy a new Compute Instance using your cloud-config initialization script. These options are summarized below, with links to relevant deployment guides. For more coverage of cloud-init deployments, review our [Overview of the Metadata Service](/docs/products/compute/compute-instances/guides/metadata/) guide.

-   **Cloud Manager**: You can conveniently configure and deploy new instances using a web browser. Follow along with our [Create a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide to deploy a new instance. The guide includes a section on how to **Add User Data**, showing where you can input your cloud-config content.

-   **Linode CLI**: The command-line tool provides a command for creating a new Compute Instance, and that command can take a `--metdata.user_data` option with your cloud-config script. To learn more about using the Linode CLI, see our guides [Getting Started with the Linode CLI](/docs/products/tools/cli/get-started/) and [Linode CLI Commands for Compute Instances](/docs/products/tools/cli/guides/linode-instances/).

    What follows is an example set of commands to deploy an instance from a cloud-config file. The example assumes you have set up the Linode CLI tool and that your cloud-config is stored as `cloud-config.yaml` in the current directory. Review the guide linked above for more on the other options used in this example command.

    The CLI command requires that the cloud-config be encoded as a base64 string, which you can make using the `cat cloud-config.yaml | base64 -w 0` command. The first command below does this and assigns the value to a shell variable for convenience.

    ```command
    cloudconfigvar="$(cat cloud-config.yaml | base64 -w 0)"

    linode-cli linodes create \
      --label cloud-init-example \
      --region us-iad \
      --type g6-nanode-1 \
      --image linode/ubuntu22.04 \
      --root_pass EXAMPLE_ROOT_PASSWORD \
      --metadata.user_data "$cloudconfigvar"
    ```

-   **Linode API**: Within the `instances/` endpoint of the API, you have access to a `metadata.user_data` option for inputting a cloud-config. Using this, you can initialize a new Compute Instance in a convenient `POST` request. Learn more about the Linode API in our documentation on the [Linode API](/docs/api/) and the [Linode Instances API](/docs/api/linode-instances/) documentation.

    With versatility being one of its main advantages, there are numerous ways to use the Linode API to deploy a server. The steps below show a simple approach using just the command line. This example is easily adaptable for other contexts as well.

    1.  Create a payload file. This is a convenient approach for a `POST` request's data, as it makes the data easier to craft and reuse. You can create the file using your preferred text editor, but this example uses a `>` command to do so.

        ```command
        cat > cloud-init-example-deployment.json <<'EOF'
        {
          "label": "cloud-init-example",
          "region": "us-iad",
          "type": "g6-nanode-1",
          "image": "linode/ubuntu22.04",
          "root_pass": "EXAMPLE_ROOT_PASSWORD",
          "metadata": {
            "user_data": "<INSERT_CLOUD_CONFIG>"
          }
        }
        EOF
        ```

    1.  Insert the cloud-config as `metadata.user_data`. The API, like the CLI, requires that the cloud-config be encoded as a base64 string. Below, that is accomplished using the command `cat cloud-config.yaml | base64 -w 0`, and the value is assigned to a shell variable for convenience.

        ```command
        cloudconfigvar="$(cat cloud-config.yaml | base64 -w 0)"
        sed -i "s,<INSERT_CLOUD_CONFIG>,$cloudconfigvar," cloud-init-example-deployment.json
        ```

        Alternatively, you can copy the base64 string, open the file, and paste the string into the `user_data` field.

    1.  Make the `POST` request to the `instances` API endpoint. Include your Linode API personal access token (covered in the guide linked above) as an `Authorization: Bearer` header.

        ```command
        curl -H "Content-Type: application/json" \
          -H "Authorization: Bearer API_ACCESS_TOKEN" \
          -X POST \
          -d @cloud-init-example-deployment.json \
          https://api.linode.com/v4/linode/instances
        ```