---
slug: leverage-kubernetes-data-oriented-projects-with-portworx
title: "Leveraging Kubernetes Data-oriented Projects with Portworx"
title_meta: "How to Leverage Kubernetes Data-oriented Projects with Portworx"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Cameron Laird"]
contributors: ["Cameron Laird"]
published: 2024-06-25
keywords: ['portworx cloud-native storage platform','kubernetes enterprise storage platform','cloud storage','data storage','data management','saas management','dbaas management']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Portworx](https://portworx.com)'
- '[Portworx: Database Services](https://portworx.com/products/portworx-data-services/)'
- '[Portworx Documentation: Kubernetes Operations](https://docs.portworx.com/portworx-enterprise/operations/operate-kubernetes)'
- '[Portworx: Kubernetes Storage Use Case](https://portworx.com/use-case/kubernetes-storage/)'
---

Management of data at scale is crucial for deriving actionable insights. An effective data platform provides the kind of insight that leads to decisions and action. An earlier generation of commercial computing labeled the role of high-end systems as decision support.

In today’s cloud environment, a diverse range of organizations and individuals rely on robust data platforms:

-   **Organizations** such as corporations, military forces, and charities must operate data platforms efficiently to convert their daily activities into tactical and strategic insights that enable growth and improvement.

-   **Data engineers, scientists, and analysts** leverage the technical capabilities of data platforms for exploration, analysis, and visualization to maximize their technical capabilities.

-   **Developers** use data platform *Application Programming Interfaces* (APIs) and other services to create machine learning (ML) models, data gateways, and other specific applications.

-   **Administrators** keep data platforms healthy by ensuring they have the computing resources needed to meet their demands.

-   **IT staffers** ensure that data security, availability, governance, and compliance requirements are met when connecting a data platform to all the relevant individuals within an organization.

-   **Researchers** use data platforms to investigate complex questions involving large datasets.

This guide addresses the front-line computing specialists, administrators, developers, and data engineers who operate data platforms. It explores the practical tasks involved in making a data platform more useful with Portworx.

## What Is a Data Platform?

A data platform is the **technology infrastructure** used for the collection, storage, transaction processing, and analysis of varied data at scale. It simplifies engineering tasks such as expanding the storage available to an application or encrypting project secrets. Portworx addresses persistent storage, backup, data protection, disaster recovery, capacity management, and data migrations. According to Portworx: "Portworx solves the five most common problems DevOps teams encounter when running database containers in production: data mobility, high availability, scheduler-based automation, data security, and 'Anything, Anywhere'".

## What Is Portworx?

Launched in 2014, the Portworx data platform began operating as a subsidiary of Pure Storage in 2020. It now curates [a GitHub account](https://github.com/portworx) with 135 public repositories devoted to "Software Defined Data Services for DevOps". Pure Storage promotes it as "the #1 Kubernetes data platform" under [the Portworx brand](https://portworx.com/), also known as the [Portworx Storage Platform](https://portworx.com/products/portworx-enterprise/). A limited version of the Portworx Storage Platform is available for free. It allows for an implementation of object storage for a single distributed cluster. This guide focuses on the free, downloadable software that you can install and run for your own educational and small-scale uses.

## Architecture: How Portworx Relates to Kubernetes, Kafka, and Cassandra

Portworx integrates with widely known software systems such as Kubernetes, Kafka, and Cassandra, providing perspective on its role in real-world applications.

The Portworx Storage Platform installs in [Kubernetes](/docs/guides/kubernetes/) environments, with most uses of Portworx having Kubernetes as a foundation. However, it is also compatible with other container orchestration systems.

[Cassandra](/docs/guides/databases/cassandra/) is an open source distributed database management system that emphasizes economical operation, high availability, and wide-column semantics. Portworx addresses several of the challenges involved in configuring and operating Cassandra. For example, when running Cassandra in containers managed by Kubernetes, Portworx can effectively control memory, resource quotas, and/or CPU cores per Kubernetes cluster.

Similarly, [Kafka](docs/guides/what-is-apache-kafka/) is a widely used open source distributed event store and stream-processing platform. In much the same way a traditional database system manages **records** of data, Kafka manages **events**. For Kafka to perform optimally, it needs a high-performance underlying storage system. Portworx is a good choice for an object storage system to support Kafka. Teams and individuals often initially adopt Portworx to meet requirements for hosting or upgrading Kafka. Portworx offers white papers on specifically on the [operation of Kafka in a Kubernetes environment](https://portworx.com/blog/deploying-kafka-on-kubernetes-using-portworx-data-services/).

### Remark on Nomenclature

Portworx defines itself as a "data service-as-a-service platform". Systems such as Kubernetes and Cassandra have clearly understood roles in most organizations. In contrast, Portworx and other competing data platforms are considerably less well known and understood. However, data platforms provide essential services that compliment and enhance these better-known systems.

### How to Be a Native in the Cloud

The term "cloud-native" is often incorrectly invoked by marketers. Use of the cloud is already widespread, after all, *billions* of users have email addresses they access as cloud services. In contrast to such introductory or superficial uses, "cloud native" actually refers to radical or transformative use of cloud computing's full potential.

Portworx manages advanced storage and data management capabilities tailored for cloud-native environments. It enables deployment and management of storage and data services specifically in containerized environments. It also takes responsibility for data replication, snapshots, backups, and data recovery, which allows application systems to focus on their own specific requirements. Since Portworx itself is cloud-native, it plays a crucial role in helping other systems maximize the capabilities of the cloud.

Portworx ensures data durability and resiliency in the cloud. It facilitates trustworthy operation of stateful applications and enables data-intensive workloads in the cloud-native ecosystem, which helps cloud applications fulfill their operational promises.

Current cloud computing practices face several challenges, particularly the difficulty managing Kubernetes instances in the real-world. Portworx mitigates some of these challenges and bridges the gaps in real-world Kubernetes-based applications, allowing cloud computing to deliver more on its promise.

## Installation-free Portworx Practice

You can practice with Portworx through the [live interactive tutorials](https://central.portworx.com/tutorials) provided at no charge. Among the common situations these tutorials detail are [resizing Kubernetes volumes from the command line](https://central.portworx.com/tutorials/scenario/px-k8s-kubectl-resize-volume;title=Resize%20Kubernetes%20volumes%20using%20kubectl?src=https:%2F%2Fplay.instruqt.com%2Fembed%2Fportworx%2Ftracks%2Fpx-k8s-kubectl-resize-volume%3Ftoken%3Dem_PnLyj2gfw7yGC_qO) and [deployment of Minio on Portworx volumes for backup](https://central.portworx.com/tutorials/scenario/px-minio;title=Deploy%20Minio%20on%20Portworx%20volumes%20and%20use%20it%20for%20volume%20backups?src=https:%2F%2Fplay.instruqt.com%2Fembed%2Fportworx%2Ftracks%2Fpx-minio%3Ftoken%3Dem_wfIAnp5_qeLKZ8Tr).

## Installation of Portworx

To install Portworx, use the basic installation model on an existing Kubernetes cluster. This can be any existing Kubernetes cluster, whether through Akamai Kubernetes or a manually constructed setup. You can also use [kind](https://kind.sigs.k8s.io/) for an installation purely within your desktop development environment.

Portworx is not an open source system, though it supports many [individual open source components](https://portworx.com/products/open-source/), and some of its [licenses](https://docs.portworx.com/portworx-enterprise/operations/licensing) involve no fee. However, installation is generally done through the Portworx website and not via standard command-line package managers such as `apt` or `brew`.

Follow the steps in the next four sections to install Portworx on an existing Kubernetes cluster.

### Prerequisites

1.  Create a Kubernetes cluster that meets the [Portworx installation prerequisites](https://docs.portworx.com/portworx-enterprise/install-portworx/prerequisites). The **Shared CPU**, **Linode 8 GB** plan is suitable. Follow our [Kubernetes Get Started](/docs/products/compute/kubernetes/get-started/) guide to set up Kubernetes.

1.  The installation prerequisites also include a backing drive (i.e. Volume) for each of three nodes, which must be at least 8 GB. Follow our [Block Storage Get Stated](/docs/products/storage/block-storage/get-started/) guide to create and attach a 10 GB Volume to each node.

1.  Sign up for a personal account on [Portworx Central](https://central.portworx.com).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

### The Wizard

1.  Select **Get Started** from the **Welcome to Portworx** section of the Portworx Central home screen:

    ![The "Welcome to Portworx" section of the Portworx Central Home page.](welcome-to-portworx.png)

1.  Choose the **Portworx Essentials/Portworx CSI** fee-free license for demonstration or proof-of-concept workloads:

    ![The Product Line selection page on Portworx Central.](portworx-product-line.png)

1.  Choose `DAS/SAN` as **Platform** and `None` for **Distribution Name**. Retain `portworx` as the default **Namespace**, but change the **K8s Version** to match the Kubernetes version chosen during deployment (e.g. `1.30.2`).

    ![The Generate Spec page in Portworx Central.](portworx-generate-spec.png)

    {{< note >}}
    Use the following command to check your version of Kubernetes:

    ```command
    kubectl version
    ```
    {{< /note >}}

1.  Select **Save Spec** to generate `kubectl apply` commands for `Operator` and `StorageCluster`, which reflect the specifications chosen for the Portworx installation. Copy the `kubectl apply` commands for use in the next section.

    ![The Save Spec sidebar of the Generate Spec page in Portworx Central](portworx-save-spec.png)

1.  To save this configuration, fill in **Spec Name** and **Spec Tags** then click **Save Spec** again.

1.  Your generated spec manifest is now available in the **Spec List** section of Portworx Central. You can download it at any time by clicking the three vertical dots under **Actions** and choosing **Download**.

    ![The Spec List section of Portworx Central with "portworx-example" listed and it's action menu opened.](portworx-spec-list-download.png)

### Deployment

1.  Use the first `kubectl apply` command generated in the previous section to deploy the `Operator` specification. The command structure should follow that of the example command below:

    ```command
    kubectl apply -f 'https://install.portworx.com/{{< placeholder "PORTWORX_VERSION_NUMBER" >}}?comp=pxoperator&kbver={{< placeholder "KUBERNETES_VERSION_NUMBER" >}}&ns=portworx'
    ```

    ```output
    namespace/portworx created
    serviceaccount/portworx-operator created
    clusterrole.rbac.authorization.k8s.io/portworx-operator created
    clusterrolebinding.rbac.authorization.k8s.io/portworx-operator created
    deployment.apps/portworx-operator created
    ```

1.  Use the second `kubectl apply` command generated in the previous section to deploy the `StorageCluster` specification. The command structure should resemble the example command below:

    ```command
    kubectl apply -f 'https://install.portworx.com/{{< placeholder "PORTWORX_VERSION_NUMBER" >}}?operator=true&mc=false&kbver={{< placeholder "KUBERNETES_VERSION_NUMBER" >}}&ns=portworx&oem=esse&user={{< placeholder "PX_USER_ID" >}}&b=true&iop=6&c=px-cluster-{{< placeholder "PX_CLUSTER_ID" >}}&stork=true&csi=true&mon=true&tel=true&st=k8s&promop=true'
    ```

    ```output
    storagecluster.core.libopenstorage.org/px-cluster-{{< placeholder "PX_CLUSTER_ID" >}} created
    secret/px-essential created
    ```

    {{< note >}}
    If you receive any errors, use the exact commands shown on the **Generate Spec** screen. It is likely more current than the examples shown in this guide or even [Portworx' own documentation](https://docs.portworx.com/).
    {{< /note >}}

### Verification

1.  Monitor Portworx nodes with the following command:

    ```command
    kubectl -n portworx get storagenodes -l name=portworx
    ```

    Eventually, each Portworx node appears as `Online` after the deployments finish:

    ```output
    NAME                            ID                                     STATUS   VERSION           AGE
    lke194968-280433-369bf4810000   f2522d07-0b59-482a-a8ae-bd2854fd7bc4   Online   3.1.2.0-fb52ced   4m46s
    lke194968-280433-438a8b610000   b1920afd-5326-48dc-9572-af8e638fd92b   Online   3.1.2.0-fb52ced   4m45s
    lke194968-280433-527b95040000   58649b41-b4c9-4c56-b983-e27a61c9f582   Online   3.1.2.0-fb52ced   4m46s
    ```

1.  Use the following command to monitor the status of an individual node:

    ```command
    kubectl -n portworx describe storagenode {{< placeholder "NODE_NAME" >}}
    ```

At this point, your working Kubernetes cluster includes a small Portworx deployment with a permanent fee-free license. You can use your cluster for educational practice, proofs-of-concept, or other demonstrations of Portworx' capabilities.

## Run a Model Portworx Project

The extensive [Portworx documentation](https://docs.portworx.com/) includes many examples of the benefits Portworx brings to data application management. One example is [Run Kafka on Kubernetes at Scale with Portworx](https://blog.purestorage.com/purely-technical/run-kafka-kubernetes-scale-portworx/). While thousands of organizations already "manually" deploy Kafka to good effect, Portworx can enhance the process. According to Portworx, it "can deliver major availability, resilience, and operational efficiency gains when running Apache Kafka at scale". Replacement of a manual deployment with Portworx' mediation automates disaster recovery, application-specific high availability, backup services, and capacity management.

Using the Portworx installation from the preceding section, follow the steps below to get started:

1.  Create a specification file named `sc-kafka-rf2.yaml`:

    ```command
    nano sc-kafka-rf2.yaml
    ```

    Give it the following contents:

    ```file {title="sc-kafka-rf2.yaml" lang="yaml"}
    kind: StorageClass
    apiVersion: storage.k8s.io/v1
    metadata:
      name: px-sc-kafka-repl2
    provisioner: kubernetes.io/portworx-volume
    allowVolumeExpansion: true
    parameters:
      repl: "2"
      priority_io: "high"
      io_profile: "db_remote"
      cow_ondemand: "true"
      disable_io_profile_protection: "1"
      nodiscard: "false"
      group: "kafka-broker-rep2"
      fg: "false"
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

    This storage specification provides several automations, including *replication*. The `repl: "2"` parameter instructs Portworx to maintain two full replicas of broker data (i.e. Kafka's content) across the failure domains of the hosting Kubernetes cluster. This ensures that Kafka continues without downtime even if one node fails.

1.  Use the following command to apply the storage class:

    ```command
    kubectl apply -f sc-kafka-rf2.yaml
    ```

    ```output
    storageclass.storage.k8s.io/px-sc-kafka-repl2 created
    ```

A complete working replication solution for Kafka is beyond the scope of this guide. However, Portworx provides a complete configuration, along with an installation script, in a [demonstration public repository](https://github.com/rsomu/kafka-setup-k8s).

Using Portworx for these services does more than just capture configuration in a well-documented and more maintainable format. Portworx services are clever enough that, in the event of a failure, the configuration above "provides an 83% reduction in Kafka broker rebuild times". This improvement results from Portworx' agility in resource allocation. Storage-level replication makes it possible for Portworx to identify and re-assign healthy storage in the event of failure. This keeps data available while replicating almost immediately.

Portworx usually requires at least several dozens of lines of configuration files. However, that's typically less than any procedural equivalent that administrators might use to maintain a Kubernetes cluster. Beyond the clarity and relative simplicity that Portworx brings, it also typically improves the efficiency of manual solutions. For example, the savings from more efficient storage use can quickly exceed Portworx' license fees when terabytes of data are involved.

## Conclusion

Modern organizations manage vast amounts of data in the cloud, generally with Kubernetes as a base infrastructure. Portworx provides easier and more trustworthy management of the storage and other resource requirements of large-scale data systems running in cloud environments. While manual specification of Kubernetes-based applications remains common in commercial installations, Portworx boosts both the efficiency and the quality of deployments.