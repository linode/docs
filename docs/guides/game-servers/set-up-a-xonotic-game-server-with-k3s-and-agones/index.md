---
slug: set-up-a-xonotic-game-server-with-k3s-and-agones
title: "Set Up a Xonotic Game Server with K3s and Agones"
description: "This guide demonstrates how to install and manage server software for Xonotic using Terraform, K3s, and Agones."
authors: ["Michael Archer"]
contributors: ["Michael Archer"]
published: 2025-03-17
keywords: ['agones','xonotic','k3s','self-hosted game server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

This guide demonstrates how to install and manage server software for Xonotic, a free and fast arena shooter game. Resources are deployed on Linode using [Terraform](https://www.terraform.io/), the infrastructure-as-code tool, and the game server installation is supported by K3s and Agones.

[K3s](https://k3s.io/) is a lightweight Kubernetes distribution. This guide deploys K3s on a single Linode and uses it to manage your game server software. [Agones](https://agones.dev/site/) is an open-source, Kubernetes-native project specifically designed for managing dedicated game servers, and it is deployed on the K3s installation in this guide. Agones is then used to deploy and manage containers for the Xonotic game server software.

## Before You Begin

1. [Install Terraform](https://developer.hashicorp.com/terraform/install) on your workstation.

1. Create an account with Linode if you do not already have one.

1. [Create a Linode personal access token](https://techdocs.akamai.com/linode-api/reference/get-started#personal-access-tokens). This token is used later by Terraform to create resources on your Linode account.

## Configure Terraform

1. Create a directory for the Terraform project on your workstation:

    ```command {title="Your workstation"}
    mkdir xonotic
    cd xonotic
    ```

1. Inside the new directory, create a file named `main.tf` and paste in the following code. This code defines a Linode instance and sets up a firewall.

    Be sure to replace {{< placeholder "LINODE_REGION" >}} on line 47 with a slug for a region (e.g. `us-central` for the Dallas, TX region) that's geographically closest to your location. Regions and slugs are listed on the [region availability](https://www.linode.com/global-infrastructure/availability/) page. Closer locations reduce lag/latency for players on your game server.

    ```file {title="main.tf" hl_lines="47"}
    # Specify the required Terraform provider
    terraform {
      required_providers {
        linode = {
          source = "linode/linode"
          version = ">= 1.27.0"  # Ensure a version that supports metadata
        }
      }
    }
    # Define variables for sensitive information
    variable "linode_token" {
      description = "Linode API token"
      type        = string
      sensitive   = true
    }
    variable "root_password" {
      description = "Root password for the instance"
      type        = string
      sensitive   = true
    }
    variable "admin_ip" {
      description = "IPv4 address to be used to access the instance"
      type        = string
      sensitive   = true
    }

    # Configure the Linode provider
    provider "linode" {
      token = var.linode_token
    }

    # Define the cloud-init configuration
    data "template_file" "cloud_init" {
      template = <<EOF
    #cloud-config
    package_update: true
    package_upgrade: true

    runcmd:
      - apt update -y
      - apt upgrade -y
    EOF
    }
    # Create a 8GB dedicated Linode instance in Denver
    resource "linode_instance" "my_instance" {
      label     = "xonotic-game-server"
      region    = "{{< placeholder "LINODE_REGION" >}}"
      type      = "g6-dedicated-4"
      image     = "linode/ubuntu20.04"
      root_pass = var.root_password
      booted    = true
      metadata {
        user_data = base64encode(data.template_file.cloud_init.rendered)
      }
    }
    # Create a firewall to allow incoming traffic on port 22 and 7000-8000
    resource "linode_firewall" "my_firewall" {
      label = "xonotic-firewall"
    # Drop everything that is not covered by an explicit rule
      inbound_policy = "DROP"
    # Allow all outbound traffic
      outbound_policy = "ACCEPT"
      # Rule to allow SSH (port 22)
      inbound {
        label    = "allow-ssh"
        action   = "ACCEPT"
        protocol = "TCP"
        ports    = "22"
        ipv4     = [var.admin_ip]
      }
      # Rule to allow custom port range (7000-8000)
      inbound {
        label    = "allow-custom-ports"
        action   = "ACCEPT"
        protocol = "UDP"
        ports    = "7000-8000"
        ipv4     = ["0.0.0.0/0"]
        ipv6     = ["::/0"]
      }
      # Rule to allow Agones port 8080
      inbound {
        label    = "allow-custom-ports"
        action   = "ACCEPT"
        protocol = "TCP"
        ports    = "8080"
        ipv4     = ["0.0.0.0/0"]
        ipv6     = ["::/0"]
      }
      # Associate the firewall with the instance
      linodes = [linode_instance.my_instance.id]
    }
    # Output the instance's IP address
    output "instance_ip" {
      value = linode_instance.my_instance.ip_address
    }
    ```

    {{< note >}}
    Akamai now offers an expanded set of [distributed compute regions](https://techdocs.akamai.com/cloud-computing/docs/distributed-compute-regions). Deploying in these regions is currently in [limited availability](https://techdocs.akamai.com/etp/docs/features-not-released). These regions may include locations that are closer to you than the set of core compute regions.

    To access these regions, [contact customer support](https://techdocs.akamai.com/cloud-computing/docs/help-and-support#contact-customer-support).

    When deploying in a distributed compute region, note that there is a different [list of supported instance types](https://techdocs.akamai.com/cloud-computing/docs/plans-distributed). The recommended distributed compute instance type for this guide is `g6-dedicated-edge-4`. The instance type can be updated in your Terraform configuration on line 48 of the `main.tf` file.
    {{< /note >}}

1. In the `xonotic` directory, create a file named `terraform.tfvars` with the following code. Insert your personal access token, create a unique and complex root password, and insert your workstation's IP address (maintain the `/32` suffix after the IP).

    ```file {title="terraform.tfvars"}
    linode_token  = "{{< placeholder "PERSONAL_ACCESS_TOKEN">}}"
    root_password = "{{< placeholder "LINODE_ROOT_PASSWORD">}}"
    admin_ip = "{{< placeholder "WORKSTATION_IP_ADDRESS">}}/32"
    ```

    If you’re not sure of your current IP address you can use the following command which will return your current public IP address.

    ```{title="Your workstation"}
    curl http://whatismyip.akamai.com
    ```

    {{< caution >}}
Keep your `terraform.tfvars` file safe and *never* commit it to a public repository.
{{< /caution >}}

## Create Resources with Terraform

1. While inside the `xonotic` directory, initialize Terraform:

    ```command {title="Your workstation"}
    terraform init
    ```

    This command downloads the necessary Linode provider.

1. Apply the configuration defined in the previous section of this guide:

    ```command {title="Your workstation"}
    terraform apply
    ```

1. When prompted to confirm the changes, type `yes` and hit <kbd>Enter</kbd>. Terraform provisions your Linode instance and sets up the firewall.

1. Once Terraform is finished, it outputs the IP address of your new Linode instance. SSH into the instance using this IP address:

    ```command {title="Your workstation"}
    ssh root@{{< placeholder "LINODE_INSTANCE_IP_ADDRESS" >}}
    ```

    Enter the root password when prompted, which you defined in the `terraform.tfvars` file in the previous section of this guide.

1. Before proceeding with game server software installation, take time to [secure your new instance](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance).

## Install K3s

From your SSH session with your Linode instance, run:

```command {title="Linode SSH session"}
curl -sfL https://get.k3s.io | sh -
```

## Install Agones on K3s

1. From your SSH session with your Linode instance, run:

    ```command {title="Linode SSH session"}
    kubectl create namespace agones-system
    kubectl apply --server-side -f https://raw.githubusercontent.com/googleforgames/agones/release-1.47.0/install/yaml/install.yaml
    ```

    This creates a dedicated namespace for Agones and deploys it to your K3s cluster.

1. Observe the new pods created by Agones:

    ```command {title="Linode SSH session"}
    kubectl describe --namespace agones-system pods
    ```

    You should see output indicating that the Agones pods are running. If the Agones pods are not running yet, wait until they are before proceeding to the next section.

## Install Xonotic Game Server on K3s

1. From your SSH session with your Linode instance, run this command to deploy a container for the Xonotic game server software using Agones:

    ```command {title="Linode SSH session"}
    kubectl apply -f https://raw.githubusercontent.com/googleforgames/agones/release-1.47.0/examples/xonotic/fleet.yaml
    ```

1. Run this command to observe the newly deployed game server. The `watch` command will updated every 2 seconds:

    ```command {title="Linode SSH session"}
    watch kubectl describe gameserver
    ```

    Enter <kbd>Ctrl</kbd> + <kbd>C</kbd> to exit the `watch` command.

1. Get a list of your game servers and their IP addresses and ports:

    ```command {title="Linode SSH session"}
    kubectl get gs
    ```

    Make a note of the IP address and port, which is used to configure the Xonotic client software in the next section.

## Install and Configure Xonotic Client

1. If you don't have it already, download and install the Xonotic client for your workstation's operating system from [https://xonotic.org/](https://xonotic.org/).

1. Launch the Xonotic client and choose the multiplayer mode.

1. Enter the IP address and port of your game server in the **Address** field of the Xonotic client UI, separated by a colon:

        {{< placeholder "GAME_SERVER_IP_ADDRESS" >}}:{{< placeholder "GAME_SERVER_PORT" >}}


1. Click **Join!** to join the game server.

## Clean Up Resources

When you're finished playing, it's good practice to clean up your resources:

1. To remove the Xonotic game server, run this kubectl command on your Linode instance:

    ```command {title="Linode SSH session"}
    kubectl delete -f https://raw.githubusercontent.com/googleforgames/agones/release-1.47.0/examples/xonotic/fleet.yaml
    ```

1. To remove Agones, run this kubectl command on your Linode instance:

    ```command {title="Linode SSH session"}
    kubectl delete -f https://raw.githubusercontent.com/googleforgames/agones/release-1.47.0/install/yaml/install.yaml
    ```

1. To remove the Linode instance and firewall, run this Terraform command from the `xonotic` directory on your workstation:

    ```command {title="Your workstation"}
    terraform destroy
    ```