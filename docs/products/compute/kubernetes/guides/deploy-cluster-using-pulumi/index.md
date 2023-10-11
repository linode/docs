---
description: "In this tutorial, you'll deploy a Kubernetes cluster using the Linode Kubernetes Engine (LKE) and Pulumi."
keywords: ['kubernetes','pulumi','infrastructure as code','container orchestration']
tags: ["linode platform","kubernetes","automation","managed hosting"]
published: 2023-08-22
authors: ["Pulumi"]
modified_by:
  name: Linode
title: "Deploy a Linode Kubernetes Engine Cluster Using Pulumi"
license: "[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)"
external_resources:
- '[Setting Up a Private Docker Registry with Linode Kubernetes Engine and Object Storage](/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/)'
- '[Deploying a Static Site on Linode Kubernetes Engine](/docs/guides/how-to-deploy-a-static-site-on-linode-kubernetes-engine/)'
- '[Linode Provider Pulumi Documentation](https://www.pulumi.com/registry/packages/linode/)'
---

## In this Guide

This guide walks you through the steps needed to deploy a Kubernetes cluster using LKE and the popular *infrastructure as code (IaC)* tool, [Pulumi](https://www.pulumi.com/).
- [Create reusable Pulumi infrastructure code to define your Kubernetes cluster's resources](#create-your-pulumi-infrastructure-code).
- [Optionally, destroy the cluster you create using Pulumi](#destroy-your-kubernetes-cluster-optional).

## Before you Begin

1. Create a personal access token for [Linode's API v4](https://developers.linode.com/api/v4). Follow the [Getting Started with the Linode API](/docs/products/tools/api/get-started/#get-an-access-token) to get a token. You will need a token to be able to create Linode resources using Pulumi.

    {{< note >}}
    Ensure that your token has, at minimum, Read/Write permissions for Compute Instances, Kubernetes, NodeBalancers, and Volumes.
    {{< /note >}}
1. Download and [install Pulumi](https://www.pulumi.com/docs/install/) on your local machine.
1. Create a free [Pulumi Cloud account](https://app.pulumi.com/signup).
1. Review the [Getting Started With Pulumi](/docs/guides/deploy-in-code-with-pulumi/) guide to familiarize yourself with Pulumi concepts if you have not used the tool before. You need to be familiar with Pulumi and one of the [supported programming languages](https://www.pulumi.com/docs/languages-sdks/). In this guide, Typescript is used for the code examples.
1. [Install kubectl](docs/products/compute/kubernetes/guides/deploy-and-manage-cluster-with-the-linode-api/#install-kubectl) on your local machine.

## Create your Pulumi Infrastructure Code

Create Pulumi infrastructure code that define the resources needed to create a Kubernetes cluster. You can create a minimal Pulumi project containing your [resources](https://www.pulumi.com/docs/concepts/resources/), a [stack](https://www.pulumi.com/docs/concepts/stack/) which is an instance of your Pulumi program, and the [configuration values](https://www.pulumi.com/docs/concepts/config/) for your stack. Setting up your Pulumi project in this way allows you to reuse your Pulumi program to deploy more Kubernetes clusters, if desired, by way of additional stacks.

### Create your Pulumi project

Pulumi defines the elements of your Linode infrastructure using a regular programming language. Pulumi refers to these infrastructure elements as *resources*. After you declare your Pulumi infrastructure, you run `pulumi up` to create resources on the Linode platform. The Linode Provider for Pulumi exposes the Linode resources you need to deploy a Kubernetes cluster using LKE.

1. Create a new directory for the Pulumi project containing your LKE cluster's setup. Replace `<lke-cluster>` with your preferred directory name.

    ```command
    mkdir <lke-cluster>
    ```

1. In this new folder, create a new Pulumi project using the `linode-typescript` template:

    ```command
    pulumi new
    Please choose a template (8/220 shown):
    [Use arrows to move, type to filter]
      kubernetes-yaml                    A minimal Kubernetes Pulumi YAML program
      linode-go                          A minimal Linode Go Pulumi program
      linode-javascript                  A minimal Linode JavaScript Pulumi program
      linode-python                      A minimal Linode Python Pulumi program
    > linode-typescript                  A minimal Linode TypeScript Pulumi program
      linode-yaml                        A minimal Linode Pulumi YAML program
      oci-go                             A minimal OCI Go Pulumi program
      oci-java                           A minimal Java Pulumi program with Maven builds
    ```

    After selecting the template, the wizard prompts you for some more information:

    ```command
    This command walks you through creating a new Pulumi project.

    Enter a value or leave blank to accept the (default), and press <ENTER>.
    Press ^C at any time to quit.

    project name: (lke-cluster) 
    project description: (A minimal Linode TypeScript Pulumi program) 
    Created project 'lke-cluster'

    Please enter your desired stack name.
    To create a stack in an organization, use the format <org-name>/<stack-name> (e.g. `acmecorp/dev`).
    stack name: (dev)
    Created stack 'dev'

    linode:token: The token that allows you access to your Linode account: 
    Saved config

    Installing dependencies...

    added 194 packages, and audited 195 packages in 14s

    found 0 vulnerabilities
    Finished installing dependencies

    Your new project is ready to go! ✨

    To perform an initial deployment, run `pulumi up`
    ```

    Wherever a default value is presented between brackets, you can press the `<Enter>` key to accept this value. The wizard prompts you to enter the name of the first stack to create, in this case called `dev`.

1. Using the text editor of your choice, open the `index.ts` file and create your cluster’s main configuration. Replace the contents to the file with the following:

    ```file {title="lke-cluster/index.ts"}
    import * as pulumi from "@pulumi/pulumi";
    import * as linode from "@pulumi/linode";

    const config = new pulumi.Config()

    // Create a Linode Kubernets Engine cluster
    const cluster = new linode.LkeCluster("foobar", {
        k8sVersion: config.require('k8s_version'),
        label: config.require('label'),
        region: config.require('region'),
        tags: config.getObject<string[]>('tags'),
        pools: config.requireObject<linode.types.input.LkeClusterPool[]>('pools')
    });

    // Export some of the cluster's output properties
    export const kubeconfig = cluster.kubeconfig;
    export const apiEndpoints = cluster.apiEndpoints;
    export const status = cluster.status;
    export const id = cluster.id;
    export const pool = cluster.pools;
    ```

    This file contains your cluster’s setup and [stack outputs](https://www.pulumi.com/docs/concepts/stack/#outputs). In this example, you make use of Pulumi's stack config so that your Pulumi program can be easily reused across different clusters.

    The cluster configuration is set using [stack configuration](https://www.pulumi.com/docs/concepts/config/). Each stack can have a different infrastructure configuration. This strategy can help you reuse, share, and version control your Pulumi programs.

    The Pulumi program uses the Linode provider to create a Kubernetes cluster. All arguments within the `linode.LkeCluster` resource are required, except for `tags`. The `pools` argument accepts a list of pool objects. In order to read the configuration for all the pools at once, the Pulumi program makes use of Pulumi's [structured configuration](https://www.pulumi.com/docs/concepts/config/#structured-configuration). Structured configuration allows for list values, maps & objects. Finally, [stack outputs](https://www.pulumi.com/docs/concepts/stack/#outputs) are defined in order to capture your cluster's output properties that will be returned to Pulumi after creating your cluster.

    {{< note >}}
    You do not have to mark any stack output as a secret when the resource output property is already marked as a secret. In the example configuration for the cluster though, the `kubeconfig` output property is a regular string value. By wrapping it in a `pulumi.secret(...)`, the value is marked as a secret and Pulumi will make sure it is not outputted in clear text.

    See [Pulumi's secrets documentation](https://www.pulumi.com/docs/concepts/secrets/) for more details on the behavior of secrets with [Inputs & Outputs](https://www.pulumi.com/docs/concepts/inputs-outputs/).
    {{< /note >}}

    {{< note >}}
    For a full list of `linode.LkeCluster` input properties, see the [Linode Provider Pulumi documentation](https://www.pulumi.com/registry/packages/linode/api-docs/lkecluster/). You can update the `index.ts` file to include any additional arguments you would like to use.
    {{< /note >}}

### Define your Stack Configuration

You need to define the values you would like to use in order to create your Kubernetes cluster. These values are stored as configuration in the stack file. Stack configuration should be the only place that requires updating when reusing the program created in this guide to deploy a new Kubernetes cluster or to add a new node pool to the cluster.

Stack configuration is usually set using the Pulumi CLI using the command [`pulumi config set`](https://www.pulumi.com/docs/cli/commands/pulumi_config_set/).

1. The Pulumi program for our cluster uses the `Config` object to retrieve a few named configuration items. You can set values for the (current) `dev` stack with the following commands:

    ```command
    pulumi config set label "example-lke-cluster"
    pulumi config set k8s_version "1.26"
    pulumi config set region "us-west"
    ```

    So far, the values for stack configuration are simple strings. Pulumi also supports Structured Configuration, allowing list, map and object values. The commands to set such values are a bit more complex but still fully supported.

    ```command
    pulumi config set --path 'pools[0].count' 3
    pulumi config set --path 'pools[0].type' 'g6-standard-2'
    ```

    With the `dev` stack active as the current stack, the values should be added to the `Pulumi.dev.yaml` stack configuration file.

    Pulumi uses the values in this file to create a new Kubernetes cluster with one node pool that contains three 4 GB nodes. The cluster is located in the `us-west` data center (Dallas, Texas, USA). Each node in the cluster's node pool uses Kubernetes version `1.26` and the cluster is named `example-lke-cluster`. You can replace any of the values in this file with your own preferred cluster configurations.

## Deploy your Kubernetes Cluster

Now that all your Pulumi configuration is ready, you can deploy your Kubernetes cluster.

1. Ensure that you are in your `lke-cluster` project directory which should contain your Pulumi program and stack configuration file.

    ```command
    cd lke-cluster
    ```

1. If you are using the Pulumi Cloud as state backend, run the [login command](https://www.pulumi.com/docs/cli/commands/pulumi_login/).

    ```command
    pulumi login
    ```

    Or export your Pulumi access token for the Pulumi Cloud to an [environment variable](https://www.pulumi.com/docs/cli/environment-variables/).

    ```command
    export PULUMI_ACCESS_TOKEN=pul-70a141.....40eebd
    ```

    {{< note type="warning" >}}
    This last method commits the environment variable to your shell’s history, so take care when using this method.
    {{< /note >}}

1. Preview the updates Pulumi executes before deploying your infrastructure. This command won't take any actions or make any changes on your Linode account. It provides a report displaying all the resources that is created or modified when the plan is executed.

    ```command
    pulumi preview
    ```

1. Execute your Pulumi program to deploy your Kubernetes cluster.

    ```command
    pulumi up
    ```

    Pulumi begins to create the resources you’ve defined. This process takes several minutes to complete. After the cluster has been successfully created the output includes a success message and the values that you exposed as stack outputs when creating your `index.ts` file.

    ```output
    Updating (team-ce/dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/team-ce/lke-cluster/dev/updates/2

        Type                        Name             Status             
        pulumi:pulumi:Stack         lke-cluster-dev                     
    +   └─ linode:index:LkeCluster  foobar           created (108s)     


    Outputs:
      + apiEndpoints: [
      +     [0]: "https://a16255eb-d29e-4f1f-8224-ffa5ff6e4e52.us-west-1.linodelke.net:443"
      +     [1]: "https://a16255eb-d29e-4f1f-8224-ffa5ff6e4e52.us-west-1.linodelke.net:6443"
      +     [2]: "https://45.79.231.137:443"
      +     [3]: "https://45.79.231.137:6443"
        ]
      + id          : "126299"
      + kubeconfig  : [secret]
      + pool        : [
      +     [0]: {
              + autoscaler: <null>
              + count     : 3
              + id        : 187151
              + nodes     : [
              +     [0]: {
                      + id        : "187151-64e4b5432fab"
                      + instanceId: 48953345
                      + status    : "not_ready"
                    }
              +     [1]: {
                      + id        : "187151-64e4b54353f5"
                      + instanceId: 48953348
                      + status    : "not_ready"
                    }
              +     [2]: {
                      + id        : "187151-64e4b54376b5"
                      + instanceId: 48953350
                      + status    : "not_ready"
                    }
                ]
              + type      : "g6-standard-2"
            }
        ]
      + status      : "ready"

    Resources:
        + 1 created
        1 unchanged

    Duration: 1m53s
    ```

### Connect to your LKE Cluster

Now that your Kubernetes cluster is deployed, you can use kubectl to connect to it and begin defining your workload. Access your cluster's kubeconfig and use it to connect to your cluster with kubectl.

1. Use Pulumi to access your cluster's kubeconfig, decode its contents, and save them to a file. Pulumi returns a [base64](https://en.wikipedia.org/wiki/Base64) encoded string (a useful format for automated pipelines) representing your kubeconfig. Replace `lke-cluster-config.yaml` with your preferred file name.

    ```command
    export KUBE_VAR=`pulumi stack output kubeconfig --show-secrets` && echo $KUBE_VAR | base64 -di > lke-cluster-config.yaml
    ```

    {{< note >}}
    Depending on your local operating system, to decode the kubeconfig's base64 format, you may need to replace `base64 -di` with `base64 -D` or just `base64 -d`. To determine which `base64` option to use the following command:

    ```command
    base64 --help
    ```
    {{< /note >}}

1. Add the kubeconfig file to your `$KUBECONFIG` environment variable. This gives kubectl access to your cluster's kubeconfig file.

    ```command
    export KUBECONFIG=lke-cluster-config.yaml
    ```

1. Verify that your cluster is selected as kubectl’s current context:

    ```command
    kubectl config get-contexts
    ```

1. View all nodes in your Kubernetes cluster using kubectl:

    ```command
    kubectl get nodes
    ```

    Your output resembles the following example, but will vary depending on your own cluster’s configurations.

    ```output
    NAME                            STATUS   ROLES    AGE     VERSION
    lke126299-187151-64e4b5432fab   Ready    <none>   4m13s   v1.26.3
    lke126299-187151-64e4b54353f5   Ready    <none>   3m44s   v1.26.3
    lke126299-187151-64e4b54376b5   Ready    <none>   4m22s   v1.26.3
    ```

    Now that you are connected to your LKE cluster, you can begin using kubectl to deploy applications, [inspect and manage](/docs/guides/troubleshooting-kubernetes/#kubectl-get) cluster resources, and [view logs](/docs/guides/troubleshooting-kubernetes/#kubectl-logs).

## Destroy your Kubernetes Cluster (optional)

Pulumi includes a `destroy` command to remove resources managed by Pulumi.

1. Run the `destroy` command.

    ```command
    pulumi destroy
    ```

    Pulumi first displays the list of resources & stack outputs that need to be deleted.

    ```output
    Previewing destroy (team-ce/dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/team-ce/lke-cluster/dev/previews/76104ab8-eaf1-4b09-b361-11693a5da0b2

        Type                        Name             Plan       
    -   pulumi:pulumi:Stack         lke-cluster-dev  delete     
    -   └─ linode:index:LkeCluster  foobar           delete     


    Outputs:
      - apiEndpoints: [
      -     [0]: "https://a16255eb-d29e-4f1f-8224-ffa5ff6e4e52.us-west-1.linodelke.net:443"
      -     [1]: "https://a16255eb-d29e-4f1f-8224-ffa5ff6e4e52.us-west-1.linodelke.net:6443"
      -     [2]: "https://45.79.231.137:443"
      -     [3]: "https://45.79.231.137:6443"
        ]
      - id          : "126299"
      - kubeconfig  : [secret]
      - pool        : [
      -     [0]: {
              - autoscaler: <null>
              - count     : 3
              - id        : 187151
              - nodes     : [
              -     [0]: {
                      - id        : "187151-64e4b5432fab"
                      - instanceId: 48953345
                      - status    : "not_ready"
                    }
              -     [1]: {
                      - id        : "187151-64e4b54353f5"
                      - instanceId: 48953348
                      - status    : "not_ready"
                    }
              -     [2]: {
                      - id        : "187151-64e4b54376b5"
                      - instanceId: 48953350
                      - status    : "not_ready"
                    }
                ]
              - type      : "g6-standard-2"
            }
        ]
      - status      : "ready"

    Resources:
        - 2 to delete

    Do you want to perform this destroy?  [Use arrows to move, type to filter]
      yes
    > no
      details
    ```

    If you want to continue deleted the cluster, select `yes` after the preview and press `<Enter>`. Pulumi now deletes the cluster and the nodepool.
