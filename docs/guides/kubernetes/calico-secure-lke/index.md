---
slug: calico-secure-lke
title: "Defining a Calico Network Policy for Securing LKE Clusters"
description: 'How to use a Calico Network Policy to Secure Linode Kubernetes Engine Clusters.'
keywords: [kubernetes','calico','network policy','secure kubernetes','linode kubernetes engine','lke']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["John Mueller"]
published: 2023-04-24
modified_by:
  name: Linode
external_resources:
- '[Linode Community: Securing k8s cluster](https://linode.com/community/questions/19155/securing-k8s-cluster)'
- '[Tigera: Get started with Calico network policy](https://projectcalico.docs.tigera.io/security/calico-network-policy)'
---

A [Linode Kubernetes Engine (LKE) cluster](https://www.linode.com/products/kubernetes/) provides the means for deploying, scaling, and managing containerized applications. [Kubernetes](https://kubernetes.io/) groups application containers into logical units for easy management and discovery. LKE clusters provide efficiencies such as automatic scaling, which makes it easier for developers to create robust applications. They also include tools to make deployments easier for administrators.

Kubernetes resources must be secured. [Calico](https://www.tigera.io/project-calico/) makes it possible to define a complex set of rules and network policies to manage a project. It secures Kubernetes in a way that doesn’t interfere with essential Kubernetes functionality. This guide provides insights into working with Calico on an LKE clusters installation.

## What is Calico?

Calico provides security for containers, virtual machines, and native host-based workloads. It’s an open source product that focuses on fast performance and cloud-native scalability. Developers and cluster operators obtain a consistent experience whether working with a single node or a multi-thousand node cluster.

Calico supports three different dataplanes, also called "user planes", "forwarding planes", "carrier planes", or "bearer planes". A dataplane is the part of the network that carries user data. The other two parts of the telecommunications architecture are the [control plane](https://www.cloudflare.com/learning/network-layer/what-is-the-control-plane/) and the [management plane](https://www.nginx.com/resources/glossary/management-plane/). All three planes are implemented in the router firmware. Calico supports these dataplanes:

-   [Linux eBPF](https://ebpf.io/) (the default)
-   Standard Linux Networking Pipeline
-   [Windows Host Networking Service (HNS)](https://learn.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture)

## What is a Network Policy?

A network policy is a set of rules that govern how networks, applications, and users interact. Just as governments set down laws that govern how people are supposed to behave, network policies govern a Kubernetes setup. In this case, it protects communication between a cluster's Pods and Services. Network policies make networks run with more precision because every network element has rules to follow. Network policies provide these benefits:

-   Reduce the work required to create automation
-   Respond more quickly to changing needs
-   Align the network with business needs
-   Provide all network stakeholders with consistent services
-   Enhance performance by making it dependable and verifiable
-   Improve overall network security
-   Implement defense in depth so the network isn’t just relying on one security feature

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  [Set up a Linode Kubernetes Engine (LKE) cluster](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install and Configure `calicoctl`

The desktop client must be within one version difference of the Kubernetes cluster. This guide relies on version 1.24 of Kubernetes, allowing for a 1.23, 1.24, or 1.25 client.

1.  The `calicoctrl` command line tool works with Calico resources and performs administrative tasks. LKE already has the required Calico resources, verify this with the following command:

    ```command
    kubectl get pods -A
    ```

    Somewhere in the output list should be an entry for `calico-kube-controllers`.

1.  Tasks are performed with greater ease when the version number of `calicoctrl` matches the image version number of `calico-kube-controllers`. Obtain the image version number:

    ```command
    kubectl -n kube-system describe pod calico-kube-controllers
    ```

    One of the output lines should read something like the following, where `3.24.5` is the version number of the image.:

    ```output
    Image: docker.io/calico/kube-controllers:v3.24.5
    ```

There are a [number of ways](https://projectcalico.docs.tigera.io/maintenance/clis/calicoctl/install) to install the `calicoctrl` command line tool. This guide installs it as a standalone utility on a single client system. Use your Calico image version number to install `calicoctrl` with one of the techniques below. If you have a different Calico image version number than `3.24.5`, replace this value with your version in the instructions that follow:

### Installing on Linux Client

The installation in this section is designed for Ubuntu, but other Linux platforms should have similar workflows.

1.  The `calicoctrl` command line tool needs to be in a directory that’s on the path, so enter the following command:

    ```command
    sudo cd /usr/local/bin/
    ```

1.  Download a copy of the `calicoctrl` command line tool and place it in the `/usr/local/bin/` directory. Current and previous versions of `calicoctrl` are available on [GitHub](https://github.com/projectcalico/calico/releases). Remember to replace `3.22.1` in the command below with the `calico-kube-controllers` version installed on your LKE cluster:

    ```command
    sudo curl -L https://github.com/projectcalico/calico/releases/download/v3.24.5/calicoctl-linux-amd64 -o calicoctl
    ```

1.  Mark the `calicoctl` utility as executable:

    ```command
    sudo chmod +x ./calicoctl
    ```

### Installing on Windows Client

This installation assumes Windows 10 or above and access to administrator privileges. It also assumes the `kubectl` utility is installed in the `\Users\<Username>\.kube` directory.

1.  Open a Windows PowerShell window with administrator rights.

1.  Change to the `\Users\<Username>\.kube` directory, and replace `<Username>` with your username:

    ```command
    cd \users\<Username>\.kube
    ```

1.  Download a copy of the `calicoctrl` command line tool and place it in the `\users\<Username>\.kube` directory. Current and previous versions of `calicoctrl` are available on [GitHub](https://github.com/projectcalico/calico/releases).:

    ```command
    Invoke-WebRequest -Uri "https://github.com/projectcalico/calico/releases/download/v3.24.5/calicoctl-windows-amd64.exe" -OutFile "calicoctl.exe"
    ```

### Installing on macOS Client

The macOS client installation works similarly to the Linux setup with a few small changes:

1.  The `calicoctrl` command line tool needs to be in a directory that’s on the path:

    ```command
    cd /usr/local/bin/
    ```

    {{< note >}}
    If the `bin` folder does not exist, create it with the following command:

    ```command
    sudo mkdir /usr/local/bin
    ```
    {{< /note >}}

1.  Download a copy of the `calicoctrl` command line tool and place it in the `/usr/local/bin/` directory. Current and previous versions of `calicoctrl` are available on [GitHub](https://github.com/projectcalico/calico/releases).:

    ```command
    sudo curl -L https://github.com/projectcalico/calico/releases/download/v3.24.3/calicoctl-darwin-amd64 -o calicoctl
    ```

1.  Mark the `calicoctrl` utility as executable:

    ```command
    sudo chmod +x calicoctrl
    ```

{{< note >}}
If you see the error message: `cannot be opened because the developer cannot be verified` when using the `calicoctrl` utility for the first time, open **Applications** > **System Settings** > **Privacy & Security** and in the **Security** section click **Allow Anyway**.
{{< /note >}}

### Configuring the `calicoctl` Utility and Testing Your Setup

By default, `calicoctrl` uses the contents of the `kubeconfig.yaml` file from the `kubectl` utility installation process.

1.  Change to the directory containing the `kubectl` utility and its required support.

1.  Generate a list of profile names and labels to verify that `calicoctl` is working and accessible:

    ```command
    calicoctl get profiles -o wide
    ```

{{< note >}}
In some cases, you need to perform a [special setup to access particular datastores](https://projectcalico.docs.tigera.io/maintenance/clis/calicoctl/configure/overview).
{{< /note >}}

## Creating a Basic Policy

A basic policy that reflects the use of LKE must be created. The default policy doesn’t include the specific protocols and ports for working with LKE. Defining a policy always begins with the `calicoctl create` command. [There are several ways to use this command](https://projectcalico.docs.tigera.io/reference/calicoctl/create). The easiest method is to create a `.yaml` file with the policies beforehand, and then pass that file to `calicoctl` using the `-f` command line switch.

Any basic LKE policy needs to include specific protocol and port entries to ensure access to LKE. Depending on the setup, there are [Calico-specific policies](https://projectcalico.docs.tigera.io/reference/host-endpoints/connectivity) that need to be put in place before removing the [failsafe rules](https://projectcalico.docs.tigera.io/reference/host-endpoints/failsafe). The following `BasicPolicy.yaml` file provides the LKE-specific access required.

1.  Create a new file called `BasicPolicy.yaml` and paste the following contents into it:

    ```file{title="BasicPolicy.yaml" lang="yaml"}
    - apiVersion: projectcalico.org/v3
      kind: GlobalNetworkPolicy
      metadata:
        name: lke-specific
      spec:
        selector: "all()"
        order: 1
        ingress:
        - action: Allow
          protocol: TCP
          destination:
            nets:
            - "192.168.128.0/17"
            ports: [10250, 179]
        - action: Allow
          protocol: UDP
          destination:
            nets:
            - "192.168.128.0/17"
            ports: [51820]
        - action: Allow
          protocol: TCP
          destination:
            ports: ["30000:32767"]
        - action: Allow
          protocol: UDP
          destination:
            ports: ["30000:32767"]
    ```

    Here's a breakdown of the file contents:

    -   The first entry must be an API version number so that Kubernetes understand the instructions it receives.

    -   A [GlobalNetworkPolicy](https://projectcalico.docs.tigera.io/reference/resources/globalnetworkpolicy) is an ordered set of rules applied to endpoints, which are defined by the selector `all()` (meaning all endpoints).

    -   In this case, the `metadata` entry defines a name for the policy, which must be both short and expressive. [Calico doesn’t interpret the `metadata`](https://projectcalico.docs.tigera.io/reference/resources/globalnetworkpolicy#rulemetadata), and it can be any information needed to work with the policy from a human perspective. For example, the name of the app that a rule applies to or the creator of the rule can be specified here instead.

    -   The `order` entry specifies the order in which a policy is parsed by the system. The system looks for a rule to meet a specific need in a policy and then stops. If it doesn’t find the rule in the first policy, it moves onto the second policy and so on, so order is important. For example, disallowing access in one policy and then trying to allow it in the next, means the access remains disallowed. This is because the system doesn’t read the next policy. The topmost policy has an `order` value of `0`.

    -   Rules can affect either `ingress` (incoming traffic) or `egress` (outgoing traffic). To allow both incoming and outgoing traffic on a particular address and port, two rules are needed: one for ingress and another for egress. An `action` must also be provided. This specifies one of these four actions to take as a result of interpreting the rule:

        -   `Allow`: allow the access
        -   `Deny`: deny the access
        -   `Log`: create a log entry for the access
        -   `Pass`: skip the remaining policies and jump to the first profile assigned to the endpoint

    -   After an action, specify a `protocol`, which defines one of these recognized protocols: `TCP`, `UDP`, `ICMP`, `ICMPv6`, `SCTP`, or `UDPLite`. Separate rules must be defined for each protocol, even if the rule is the same for multiple protocols. If a protocol isn’t specified, the rule affects all protocols.

        To allow all access by a particular protocol, the `action` and `protocol` entries are enough. However, most rules require the inclusion of an [entity rule entry](https://projectcalico.docs.tigera.io/reference/resources/globalnetworkpolicy#entityrule) that specifies the particulars of the rule. The `nets` keyword matches packets with IP in any of the listed Classless Inter-Domain Routings (CIDRs). In this case, the first entity rule entry applies to IP `192.168.128.0/17`. Note that this is actually an [IP range](https://www.ipaddressguide.com/cidr) starting with `192.168.128.0` and ending with `192.168.255.255`. However, a list of IPs for a particular rule can also be created. Never mix IPv4 and IPv6 in a single rule. If there is no `nets` entry, then the rule applies to all CIDRs.

    -   The `ports` entry further defines the rule with specific ports that the rule affects. As with CIDRs, [more than one port](https://projectcalico.docs.tigera.io/reference/resources/globalnetworkpolicy#ports) can be provided in a comma-separated list. If there are a range of ports affected by the rule, specify the beginning and ending port numbers separated with a colon. The range must appear within double quotes. Here is the purpose behind each of the entity rule entries in this file:

        -   TCP port 10250 inbound from 192.168.128.0/17: kubelet health checks
        -   TCP port 179 inbound from 192.168.128.0/17: Calico BGP traffic
        -   UDP port 51820 inbound from 192.168.128.0/17: Wireguard tunneling for kubectl proxy
        -   TCP/UDP ports 30000 - 32767 inbound from All: NodePorts for workload Services

    {{< note >}}
    If new to YAML, use an [Online YAML Parser](https://yaml-online-parser.appspot.com/) to verify the file as many online examples can be tough for humans to read.
    {{< /note >}}

1.  To use this file, enter the following command:

    ```command
    calicoctl create -f BasicPolicy.yaml
    ```

    This should produce the following output message:

    ```output
    Successfully created 1 'GlobalNetworkPolicy' resource(s)
    ```

## Checking a Policy

Checking which policies already exist is important in order to properly modify them. [The `calicoctl get` command queries any network policy](https://projectcalico.docs.tigera.io/reference/calicoctl/get) set on LKE and displays it in a number of ways.

1.  The previous section shows how to create a new policy that ensures that all of the LKE-specific requirements are met. To see that policy in place, enter the following command:

    ```command
    calicoctl get GlobalNetworkPolicy
    ```

1.  To see the order in which this policy is applied, along with the selector used to apply it, append the `--output=wide` flag:

    ```command
    calicoctl get GlobalNetworkPolicy --output=wide

## Denying and Allowing Traffic via Selectors

Selector-based policies are applicable when Calico is running on either a gateway or router. This orientation allows for a dynamic security policy based on the labels attached to the host endpoints. Use endpoint policies to manage three kinds of traffic:

-   Locally terminated
-   Forwarded between hosts
-   Forwarded between a host endpoint and a workload endpoint on the same host

A selector allows access to a resource based on the value of labels and resource fields assigned to a group of pods or nodes. Consequently, a selector-based policy relies on these labels and resource fields to determine what traffic to allow and disallow. Ultimately, creating a policy also controls actions that pods or nodes perform. A selector-based policy relies on key/value pairs. For example, to assign a policy to a particular role, the key might be `role`, while the value might be `webserver`. The associated action could be `Allow` with network protocols (e.g. `TCP`) and ports (e.g.`80`) assigned.

Obtain information about the key/value pairs using the `kubectl` utility.

1.  For example, to see all of the nodes that have an `app` label of `csi-linode-node` using a label selector, enter:

    ```command
    kubectl get pods -A -l "app in (csi-linode-node)" --show-labels
    ```

1.  A field selector works similarly. To see all of the nodes that appear in the `kube-system` namespace, enter:

    ```command
    kubectl get pods -A --field-selector=metadata.namespace=kube-system
    ```

Here is an example of what a network policy based on a selector looks like:

```file
- apiVersion: projectcalico.org/v3
  kind: GlobalNetworkPolicy
  metadata:
    name: webserver
  spec:
    selector: "role==\"webserver\""
    order: 2
    ingress:
    - action: Deny
      protocol: TCP
      destination:
        ports: [80]
    - action: Allow
      protocol: TCP
      destination:
        ports: [443]
    egress:
    - action: Allow
```

This policy affects only the web server role. It denies access to all incoming requests from the normally unsecured port `80`, but does allow access from the SSL port `443`. To provide full security, enter the correct information for your specific application. Opening or closing a port is only one step in the security process. To restrict all access to the web server, leave out the `Allow` action, along with the `destination` and `ports` for the `Deny` action.

This policy allows output from the web server using any protocol and any port. Unrestricted output, with restricted or possibly no input is often desired.

## Ordering Network Policies

The example policies in this guide contain an `order` entry with a particular number. The `order` element defines the order in which policies are used. As mentioned, order is very important. If two policies contain conflicting instructions, the instructions found in the first policy are used while the second policy is ignored. It’s best practice to always define the `order` element.

Changing the order of policies is simple thanks to easily editable `.yaml` files. To change the order of policies, just modify the `order` element value to the new order. Use the `calicoctl replace` command, rather than `calicoctl create`, to perform the order update.

## Summary

This guide provides instructions to access the `calicoctrl` utility, which is used in tandem with the `kubectl` utility to manage LKE clusters. The `calicoctrl` utility is used to interact with Calico resources and perform administrative tasks, such as configuring network policies. Ultimately, the goal is to improve security and ensure that any modifications made are both consistent and useful.

The guide shows how to work with network policies in a number of ways. The most basic being to create network policy based on selectors, which allows access to resources in a consistent manner. Remember that the `all()` selector affects your entire setup.