---
slug: using-nomad-for-orchestration
author:
  name: Linode Community
  email: docs@linode.com
description: "Nomad provides workload orchestration, similar to Kubernetes, but with a higher degree of simplicity, flexibility, and scalability. Learn through this tutorial more about what Nomad is, how it works, and how you can deploy your own Nomad cluster for container orchestration."
keywords: ['nomad cluster setup','nomad hashicorp','nomad docker']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-02-03
modified_by:
  name: Nathaniel Stickman
title: "How to Use Nomad for Container Orchestration"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[HashiCorp Developer: Nomad Tutorials - Get Started](https://developer.hashicorp.com/nomad/tutorials/get-started)'
- '[Kevin Wang: My First Nomad Cluster](https://thekevinwang.com/2022/11/20/nomad-cluster/)'
- '[Pavel Sklenar: Creating Two Node Nomad Cluster](https://blog.pavelsklenar.com/two-node-nomad-cluster/)'
---

[Nomad](https://www.nomadproject.io/) is an open source workload orchestration and scheduling system that offers a simplified and flexible alternative to Kubernetes. With Nomad, you can deploy and manage both containerized and non-containerized applications across efficient, highly-scalable clusters.

And Nomad is part of the HashiCorp ecosystem, giving built-in integration with tools like Consul, Terraform, and Vault.

You can learn more about Nomad and how it compares to Kubernetes in our guide [Kubernetes vs Nomad: Which Is Better?](/docs/guides/kubernetes-vs-nomad/).

In this tutorial, learn what you need to get started understanding and using Nomad effectively. The tutorial walks you through installing a single Nomad instance to get a sense of its interface and cluster structure.

Then see how you can leverage Terraform and Consul to deploy a full Nomad cluster with Docker for containerized applications.

## How to Install Nomad

To get started, you can install Nomad to get a feel for how it works. This section shows you how to install Nomad and access its interface, where you can start getting familiar with Nomad's way of handling jobs.

If, instead, you are ready to start deploying a Nomad cluster, head on to the [How to Deploy a Cluster with Nomad](/docs/guides/using-nomad-for-orchestration/#how-to-deploy-a-cluster-with-nomad) section further on.

### Deploying Nomad from the Linode Marketplace

The most approachable solution for setting up a Nomad instance with Linode is through the Linode Marketplace. There, you can quickly set up a Linode instance with Nomad already installed and set up.

To do so, take a look at our guide to [Deploy HashiCorp Nomad through the Linode Marketplace](/docs/products/tools/marketplace/guides/hashicorp-nomad/).

Follow along with that guide, and your Nomad instance is ready. Head on to the section further on, [How Nomad Works](/docs/guides/using-nomad-for-orchestration/#how-nomad-works), to start getting familiar with your new Nomad instance.

### Manually Installing Nomad

Should you want to install Nomad manually, you can follow along with the steps here. These walk you through everything you need to get a Nomad instance up and running and to be able to access the Nomad interface.

#### Setting Up the Prerequisites

You need a Linode instance to run Nomad on, so follow the linked guides here to start up and configure your own instance.

1. Create a Linode Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update the instance. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
Throughout the rest of this tutorial, commands are provided for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

#### Installing Nomad on Debian and Ubuntu

To install Nomad on a Debian or Ubuntu system, follow along with the steps here.

1. Install the prerequisite packages for adding the HashiCorp repository to the APT package manager.

    ```command
    sudo apt install wget gpg coreutils
    ```

1. Add the GPG key for the HashiCorp repository.

    ```command
    wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
    ```

1. Add the HashiCorp repository to the APT package manager.

    ```command
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    ```

1. Update APT's indices, and install Nomad.

    ```command
    sudo apt update
    sudo apt install nomad
    ```

#### Installing Nomad on CentOS and Fedora

To install Nomad on a CentOS, Fedora, or an RHEL system, follow the steps here.

1. Install the configuration manager for the DNF package manager.

    ```command
    sudo dnf install dnf-plugins-core
    ```

1. Use the configuration manager to add the HashiCorp repository to DNF.

    - On CentOS and RHEL distributions, use the RHEL URL.

        ```command
        sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
        ```

    - On Fedora, use the Fedora URL.

        ```command
        sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo
        ```

1. Install Nomad.

    ```command
    sudo dnf install nomad
    ```

#### Verifying Your Nomad Installation

Once you have completed the installation steps above for your system, you can verify you Nomad installation with the command here.

``` command
nomad --version
```

```output
Nomad v1.4.3
```

#### Installing CNI Plugins for Nomad

Nomad uses CNI plugins to support some network features, particularly its bridge mode. The CNI plugins are required when using network namespaces within Nomad clusters.

Completing this part of the setup is optional, but it is generally recommended.

1. Install the CNI plugins with the following set of commands.

    ```command
    curl -L -o cni-plugins.tgz "https://github.com/containernetworking/plugins/releases/download/v1.0.0/cni-plugins-linux-$( [ $(uname -m) = aarch64 ] && echo arm64 || echo amd64)"-v1.0.0.tgz
    sudo mkdir -p /opt/cni/bin
    sudo tar -C /opt/cni/bin -xzf cni-plugins.tgz
    ```

1. To further support network traffic over bridge connections, you need to adjust your system's iptables. Nomad provides the configurations implemented below for this purpose.

    Run the command here to create a `bridge.conf` file within the `/etc/sysctl.d/` directory. These lines set the necessary iptables values, and adding them to a file ensures they persist at system startup.

    ```command
    sudo tee /etc/sysctl.d/bridge.conf > /dev/null <<EOF
    net.bridge.bridge-nf-call-arptables = 1
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    ```

    Then, use the command below to load the new file into the current `sysctl` configuration.

    ```command
    sudo modprobe br_netfilter
    sudo sysctl -p /etc/sysctl.d/bridge.conf
    ```

## How Nomad Works

With your own Nomad instance up and running, you can start exploring and getting an understanding of how Nomad works. This section walks you through some of that, providing the basics to help navigate Nomad's features.

### Using Nomad

With Nomad installed, you can see a Nomad agent in action to play with the Nomad interface and see how things work. To start up a Nomad development agent, use the following command.

```command
nomad agent -dev
```

{{< note >}}
Nomad instances created through the Linode Marketplace are already running a Nomad agent at startup. You do not need to issue the command above, and can skip to accessing your instance's Nomad interface.

To do so, navigate to port `4646` on your instance's public IP address. If that address is `192.0.2.0`, then go to `192.0.2.0:4646` in your browser to see the Nomad web interface.
{{< /note >}}

The agent makes a Nomad web interface available, serving it on `localhost:4646`. To access this in your web browser from a remote machine, you can use an SSH tunnel.

- On **Windows**, you can use the PuTTY tool to set up your SSH tunnel. Follow the PuTTY section of our guide on how to [Create an SSH Tunnel for MySQL Remote Access](/docs/guides/create-an-ssh-tunnel-for-mysql-remote-access/#how-to-access-mysql-remotely-by-creating-an-ssh-tunnel-with-putty). Use `4646` as the **Source port** and `127.0.0.1:4646` as the **Destination**.

- On **macOS** or **Linux**, use the following command to set up the SSH tunnel. Replace `example-user` with your username on the remote server and `192.0.2.0` with the remote server's IP address:

    ```output
    ssh -L4646:localhost:4646 example-user@192.0.2.0
    ```

Now navigate to `localhost:4646` in your web browser to see the Nomad interface.

[![The Nomad web interface](nomad-local-interface_small.png)](nomad-local-interface.png)

### Nomad Structure

One of the best ways to get familiar with Nomad is through navigating the options available in its interface. But Nomad also has a set of core concepts that its operations are structured around. Getting familiar with those is essential for using Nomad effectively.

What follows gives a brief overview of some of these key essentials for grasping the Nomad cluster architecture. You can get additional details and more particulars in Nomad's [vocabulary documentation](https://developer.hashicorp.com/nomad/tutorials/get-started/get-started-vocab).

- A Nomad *agent* runs on each Node in the Nomad cluster and can be either a server agent or a client agent. Agents do all the work behind Nomad, and it is the presence of this network of agents that make up the Nomad cluster.

- A Nomad *server* agent manages jobs and clients. Each server node communicates with the other server nodes for high availability and awareness across multiple regions. Servers also manage job schedules and disseminate jobs to appropriate client nodes when the jobs need to be executed.

- A Nomad *client* agent watches for jobs from its region's server nodes and executes any tasks within those jobs. Essentially clients are the units that fulfill jobs, running the necessary tasks, whether batch processes, services, or otherwise.

- A Nomad *job* is a collection of one or more tasks to be handled by a client. Tasks are collected within **groups** within their jobs. Each *task* in turn contains a single unit of work to be executed by a client agent.

## How to Deploy a Cluster with Nomad

All of the above should give you a solid foundational understanding of Nomad. Typically, though, Nomad is deployed in a cluster, where you can have an array of server nodes and client nodes to execute jobs.

The rest of this tutorial gives you a straightforward method for deploying a complete Nomad cluster using Terraform for provisioning and Consul for networking.

This setup is meant to serve as a basis for your to develop to your own needs. For that reason, the setup favors a clear and simplified approach. Doing so leaves a few features to be added and enhancements to be pursued to your liking. The conclusion to this tutorial provides a summary of some things you may want to do to best fit this setup to your needs.

### Overview of Terraform Provisioning

Probably the most effective way to deploy a Nomad cluster is through [Terraform](https://www.terraform.io/), another tool by HashiCorp. With Terraform, you can provision infrastructure as code, automating the deployment process.

This is especially convenient with Nomad. Terraform lets you coordinate configuration and deployment between all nodes in your cluster, in addition to saving you manual installation and setup on each node.

You can learn more about using Terraform, particularly for provisioning Linode instances, in our [Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/).

For this tutorial, you can leverage our custom Terraform script to deploy your own Nomad cluster. The Terraform script here emphasizes simplicity and readability and is helpful for getting started and developing to your own uses.

Here is a rundown of what the Terraform script does.

- Creates a given number of Nomad server nodes and a given number of client nodes. All instances deploy within a single region and leverage [Linode's VLAN](/docs/products/networking/vlans/) feature for virtual private cloud (VPC) communications between nodes.

- Executes a script on each node to install Nomad, Consul, and Docker.

- Runs a script on each server node to provide an initial Consul and Nomad server configuration. And does the same for each client node, setting the configurations for communication with the server nodes.

- Starts up Consul and Nomad so that, by the end of the Terraform process, the cluster is up and running and accessible.

### Deploying the Cluster with Terraform

When you are ready to deploy your own Nomad cluster, follow the steps outlined here. These give you what you need to get Terraform set up, prepare the script, and start provisioning your cluster.

{{< caution >}}
The configurations and commands used in this guide add multiple Linode instances to your account. Be sure to monitor your account closely in the Linode Cloud Manager to avoid unwanted charges.
{{< /caution >}}

1. Install Terraform. You can do so by following the [official installation guide](https://learn.hashicorp.com/tutorials/terraform/install-cli). This sets you up with the Terraform command line interface (CLI).

1. Download our Terraform script for deploying a Nomad cluster. You can find a zip archive of the script and its accompanying files [here](example-nomad-terraform.zip).

    Once you have downloaded the zip archive, you need to unzip it. You can do so with the `unzip` program. Using a set of commands like below places the Terraform directory in your current user's home directory.

    ```command
    mv example-nomad-terraform.zip ~/
    cd ~/
    unzip example-nomad-terraform.zip
    ```

    This should result in a `~/example-nomad-terraform/` directory, which you should change into. Any further commands and file references assume you are operating out of this directory.

    ```command
    cd ~/example-nomad-terraform/
    ```

1. Open the `terraform.tfvars` file, and configure the variables there. Here is a breakdown of the variables and how should to set them.

    - `token` needs your Linode API token. Terraform uses this to provision Linode instances. You can follow our [Get an API Access Token](/docs/products/tools/linode-api/guides/get-access-token/) guide to generate a personal access token. Be sure to give the token "Read/Write" permissions.

    - `ssh_keys` takes a list of SSH public keys. These keys are added to the known hosts on each node, allowing SSH access to the nodes.

    - `root_password` is used to set up a root password for each node.

    - `server_count` and `client_count` dictate the number of Nomad server nodes and Nomad client nodes, respectively, to provision. Nomad recommends three or five server nodes for each region. This tutorial uses three, and the same for the number of client nodes.

    - `region` determines what Linode region the nodes should be created in. You can see the full list of regions and their designations via the [Linode regions API](https://api.linode.com/v4/regions).

        However, this tutorial uses Linode's VLAN feature, which is only available for certain regions. You can see which regions on the [VLAN Overview](/docs/products/networking/vlans/#availability) page.

    - `linode_image` points to an image to use for each node. The default for this tutorial is an Ubuntu 20.04 image. You can see a list of possible images via the [Linode images API](https://api.linode.com/v4/images).

        Be aware that changing the image requires that you accordingly adjust the scripts for installing Consul, Nomad, and Docker.

    - `server_type` and `client_type` indicate the Linode instance types to use for the server nodes and client nodes, respectively. The default provides a Dedicated 4GB instance for each Nomad server, as recommended, and a Linode (shared) 4GB instance for each Nomad client.

        You can get a full list of the instance type designations via the [Linode types API](https://api.linode.com/v4/linode/types).

    {{< caution >}}
Sensitive infrastructure data, such as passwords and tokens, are visible in plain text within the `terraform.tfvars` file. Review [Secrets Management with Terraform](/docs/applications/configuration-management/secrets-management-with-terraform/#how-to-manage-your-state-file) for guidance on how to secure these secrets.
    {{< /caution >}}

1. Initialize the Terraform script, which installs the required provisioners. Then apply the script to start the provisioning process.

    ```command
    terraform init
    terraform apply
    ```

    The process runs for a while as Terraform stands up first the server instances then the client instances and then runs the necessary scripts. Once the process has finished, you should see a message like this.

    ```output
    Apply complete! Resources: 12 added, 0 changed, 0 destroyed.
    ```

At this point, you can access your Nomad interface and see that your cluster is running and connected. In a web browser, navigate to port `4646` on the public IP address for one of your cluster's server nodes. For instance, if `nomad-server-1` got the public IP address `192.0.2.0`, you would navigate in your browser to `192.0.2.0:4646`.

Here you can use the left menu to navigate to the **Server** page to see a list of the Nomad servers deployed in your cluster.

[![Nomad server nodes listed in the web interface](nomad-cluster-servers_small.png)](nomad-cluster-servers.png)

And you can navigate to the **Clients** page from the same menu to see a list of your deployed Nomad clients.

[![Nomad client nodes listed in the web interface](nomad-cluster-clients_small.png)](nomad-cluster-clients.png)

### Creating a Docker Job

Now to the Nomad cluster in action, you should create and execute a simple job on it. And you can actually do that right from within the Nomad web interface.

These next steps show you how. The result uses a simple Docker image to have each client node echo "Hello, world!" via an HTTP server.

1. Open the Nomad web interface from one of your server nodes, as described in the previous section.

1. Navigate to the **Jobs** page from the menu on the left, and select the **Run Job** button from the upper right.

1. You are prompted here for a *Job Definition*. This is where you can insert an HCL script to define your job.

    For this example, you can use the job script provided below. This creates a job named `example-docker-job` and a group of three `docker-server` tasks to start up HashiCorp's `http-echo` Docker image on three client nodes.

    ```file {lang="hcl"}
    job "example-docker-job" {
      datacenters = ["dc-us-southeast-1"]
      type = "service"

      group "docker-example" {
        count = 3

        task "docker-server" {
          driver = "docker"

          config {
            image = "hashicorp/http-echo:latest"

            args = [
              "-listen",
              ":3030",
              "-text",
              "Hello, world!",
            ]
          }

          resources {
            network {
              mbits = 10

              port "http" {
                static = "3030"
              }
            }
          }
        }
      }
    }
    ```

1. Select the **Plan** button at the bottom of the page. You should be presented with a summary of the job, which you can accept using the **Run** button now at the bottom of the page.

    ![Nomad summarizing the impact of the example job](nomad-cluster-plan.png)

1. At this point, you should see the job's page, with a summary of its execution. The page provides metrics on the job, including breakdowns of the job group and its tasks. The page also provides an option to stop the job.

    [![The example job listed in the Nomad web interface](nomad-cluster-job_small.png)](nomad-cluster-job.png)

1. To see the results served by Docker, navigate to port `3030` on the public IP address of one of the client nodes. For instance, if one of the clients has the public IP address `192.0.2.12`, you would navigate to `192.0.2.12:3030` in you web browser.

    ```output
    Hello, world!
    ```

## Conclusion

You now have what you need to start orchestrating your workloads with Nomad. Through this tutorial, you have steps for everything from running a single Nomad instance to deploying an entire Nomad cluster.

Regarding the Terraform deployment, what you have above is meant as a more accessible and readable base. You can and should continue enhancing this to better meet your needs. The following are some initial ideas you may start out with.

- Use Packer to build initial images. This would save deployment time and would replace the steps in the `nomad-installations.sh` script. You can learn more about Packer and using it to create Linode images in our guide [Using the Linode Packer Builder to Create Custom Images](/docs/guides/how-to-use-linode-packer-builder/).

- Leverage Consul's Access Control List (ACL) features to bolster the cluster's security. These features allow you to secure your cluster's access points through ACL policies. You can learn more in HashiCorp's [Secure Consul with Access Control Lists](https://developer.hashicorp.com/consul/tutorials/security/access-control-setup-production) documentation.

- Implement multiple regions in your Nomad cluster. Nomad supports multi-region federation, allowing you to reliably configure clusters the coordinate across data centers in different regions. Learn more about this process in Nomad's [Multi-region Federation](https://developer.hashicorp.com/nomad/tutorials/manage-clusters/federation) documentation.

In addition to the links provided above and throughout this tutorial, refer to the link to HashiCorp's Nomad tutorials below. From there, you can continue to expand your understanding of Nomad and its capabilities to get the most out of your cluster.
