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

When writing content, please reference the [Linode Writer's Formatting Guide](https://www.linode.com/docs/guides/linode-writers-formatting-guide/). This provides formatting guidelines for YAML front matter, Markdown, and our custom shortcodes (like [command](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#commands), [file](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#files), [notes](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#note-shortcode), and [tabs](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#tabs)).

## Before You Begin

In this section, list out any prerequisites necessary for the reader to complete the guide, including: services or products to be created beforehand, hardware and plan requirements, or software that needs to be preinstalled.

See: [Linode Writer's Formatting Guide: Before You Begin](http://www.linode.com/docs/guides/linode-writers-formatting-guide/#before-you-begin)

Management of data at scale is crucial. A good data platform is the kind of insight that leads to decision and action. An earlier generation of commercial computing labeled [decision support](https://www.techtarget.com/searchcio/definition/decision-support-system/www.techtarget.com/searchcio/definition/decision-support-system) as the role of high-end systems.

In today’s cloud environment, a diverse range of organizations and individuals need strong relationships with data platforms:

-   Organizations including corporations, military forces, and charities must operate instances of data platforms efficiently to turn all the results from their daily activity into tactical and strategic insights that enable growth and improvement.

-   Data engineers, scientists, and allied analysts are at their best when they leverage the technical capabilities of data platforms, which typically support the exploration, analysis, and visualization data scientists routinely do.

-   Developers program the machine learning (ML) models, data gateways, and other specific applications made possible by data platforms' application programming interfaces (APIs) and other services.

-   Administrators keep data platforms healthy by ensuring those data platforms have the computing resources needed to meet the demands on them.

-   IT staffers ensure that requirements of data security, availability, governance, and compliance are met in connecting a data platform to all the individuals throughout an organization.

-   Researchers with access to data platforms investigate questions that involve terabytes or more of measurements.

This guide addresses the front-line computing specialists, administrators, developers, and data engineers who operate data platforms, and explores the practical tasks involved in making a data platform useful with Portworx.

## What Is a Data Platform?

A data platform is **technology infrastructure** for collection, storage, transaction, processing, and analysis of data at full scale and variety. It simplifies engineering tasks like expanding the storage available to an application, or encrypting project secrets. Portworx addresses persistent storage, backup, data protection, disaster recovery, capacity management, and data migrations. Portworx' Website says, ["Portworx solves the five most common problems DevOps teams encounter when running database containers … in production:  data mobility, high availability , scheduler-based automation, data security, [and] 'Anything, Anywhere'."](https://portworx.com/products/why-portworx/)

## What is Portworx?

Portworx is a data platform that launched in 2014. In 2020 it began operating as a subsidiary of Pure Storage and now curates [a GitHub account](https://github.com/portworx) with 129 public repositories devoted to "Software Defined Data Services for DevOps". Pure offers software as "... [t]he #1 Kubernetes data platform …" under [the Portworx brand](https://portworx.com/), sometimes called [Portworx Storage Platform](https://portworx.com/products/portworx-enterprise/). A limited version of Portworx Storage Platform is free and allows for an implementation of object storage for a single distributed cluster. This guide focuses on the free, downloadable software that you can install and run for your own education and small-scale use.

## Architecture:  How Portworx relates to Kubernetes, Kafka, and Cassandra

Kubernetes, Kafka, and Cassandra are more widely-known software systems, and integrate with Portworx. This gives perspective on how Portworx fits in real-world applications.

The Portworx Storage Platform installs in [Kubernetes](https://www.linode.com/docs/guides/kubernetes/) environments and most uses of Portworx have Kubernetes as a foundation. It's also possible to replace Kubernetes with other container orchestration systems.

[Cassandra](https://www.linode.com/docs/guides/databases/cassandra/) is an open-source distributed database management system which emphasizes economical operation, high availability, and wide-column semantics. Portworx is a good answer to several of the challenges involved in configuration and operation of Cassandra. One example: if an aim is to run Cassandra in containers managed by Kubernetes, then Portworx is a fitting tool for effective control of memory, resource quotas, or CPU cores per Kubernetes cluster.

Similarly, [Kafka](https://www.linode.com/docs/guides/what-is-apache-kafka/) is a widely-used open-source distributed event store and stream-processing platform. Think of Kafka like this: in much the same way a traditional database system manages **records** of data, Kafka manages **events**.

For Kafka to be at its best, it needs an underlying storage system that performs well.  Portworx is a good choice for an object storage system to back or underlie Kafka. It's common for individuals and teams to first use Portworx as a solution to requirements they have in hosting or upgrading Kafka. The Portworx company offers white papers on precisely the subject of [operation of Kafka in a Kubernetes environment](https://portworx.com/blog/deploying-kafka-on-kubernetes-using-portworx-data-services/).

### Remark on Nomenclature

Portworx defines itself as "a data service-as-a-service platform" Such systems as Kubernetes and Cassandra have clearly understood roles in most organizations. In contrast, Portworx and competing data platforms are considerably less well known, and understood. Data platforms generally exist somewhere between the boundaries of those other and better-known systems.

### How to Be a Native in the Cloud

Cloud-native is a quality digital strategists often invoke. Use of the cloud is widespread; *billions* of users have email addresses they access as cloud services. In contrast to introductory or superficial use, "cloud native" refers to radical or transformative use of cloud computing's full potential.

Portworx manages advanced storage and data management capabilities tailored for cloud-native environments. It enables deployment and management of storage and data services specifically in containerized environments. It also takes responsibility for data replication, snapshotting, backups, and data recovery, and leaves application systems to focus on their own specific requirements. Since Portworx is cloud-native itself, it plays a crucial role in helping other systems make the most of the cloud.

It ensures data durability and resiliency in the cloud.  Portworx facilitates trustworthy operation of stateful applications and enables data-intensive workloads in the cloud-native ecosystem helping cloud applications meet the operational promises the cloud has already made.

Current cloud computing practice has several challenges, many of which have to do with the difficulty of real-world management of Kubernetes instances. Portworx mitigates several of the challenges and bridges the gaps in true-life Kubernetes-based applications, so cloud computing delivers more on its promise.

## Installation-free Portworx Practice

You can begin practice with Portworx through [live interactive tutorials](https://central.portworx.com/tutorials) the company makes available at no charge. Among the common situations these tutorials detail are [resizing Kubernetes volumes from the command line](https://central.portworx.com/tutorials/scenario/px-k8s-kubectl-resize-volume;title=Resize%20Kubernetes%20volumes%20using%20kubectl?src=https:%2F%2Fplay.instruqt.com%2Fembed%2Fportworx%2Ftracks%2Fpx-k8s-kubectl-resize-volume%3Ftoken%3Dem_PnLyj2gfw7yGC_qO) and [deployment of Minio on Portworx volumes for backup](https://central.portworx.com/tutorials/scenario/px-minio;title=Deploy%20Minio%20on%20Portworx%20volumes%20and%20use%20it%20for%20volume%20backups?src=https:%2F%2Fplay.instruqt.com%2Fembed%2Fportworx%2Ftracks%2Fpx-minio%3Ftoken%3Dem_wfIAnp5_qeLKZ8Tr).

## Installation of Portworx

Use the basic installation model on an existing Kubernetes cluster. You can use any existing Kubernetes cluster you have, whether through LKE or a "manual" construction. You also can use [kind](https://kind.sigs.k8s.io/) for an installation purely within your desktop development environment.

Portworx is not itself an open-source system. While the company supports many [individual open-source components](https://portworx.com/products/open-source/), and some of its [licenses](https://docs.portworx.com/portworx-enterprise/operations/licensing) involve no fee, installation is generally through the company site, and *not* a standard installation of an open-sourced package through such familiar command-line requests as `apt install` or `brew install`.

To install Portworx on an existing Kubernetes cluster::

### Prerequisites

1.  Verify that your Kubernetes cluster meets such [installation prerequisites](https://docs.portworx.com/portworx-enterprise/install-portworx/prerequisites) as the size of the backing drive for each of three nodes, which itself is a minimum supported size.  The backing drive must be at least 8 GB.

1.  Log in to a personal account on [Portworx Central](https://docs.portworx.com/portworx-enterprise/operations/licensing).

### The Wizard

1.  Select **Portworx Enterprise** from the product catalog visible there to arrive at [the Portworx Wizard](https://central.portworx.com/specGen/wizard).

1.  Choose the **Portworx Essentials** fee-free license for demonstration or proof-of-concept workloads.

1.  Choose "`DAS/SAN`" as `Platform`.

1.  Choose "`None`" for `Distribution Name`. Retain "`portworx`" as the default `Namespace`.

1.  Select "`Save Spec`".  This generates Kubernetes manifests for `Operator` and `StorageCluster` which capture specifications for the desired Portworx installation. It's recommended to download the manifests by filling in "`Spec Name`" and "`Spec Tags`" in the Wizard, and touching "`Save Spec`" a second time.

### Deployment

1.  Deploy the `Operator` specification with "`kubectl apply -f 'https://install.portworx.com/$PORTWORX_VERSION_NUMBER?comp=pxoperator&kbver=$KUBERNETES_VERSION&ns=portworx'`". `PORTWORX_VERSION_NUMBER` has a value such as `2.13`, while `KUBERNETES_VERSION` is at `1.25.0` as of this writing. Use the exact command line the Wizard suggests; even [Portworx' own documentation](https://docs.portworx.com/) of installation occasionally slips behind what is current and correct for the Wizard.

1.  Deploy the `StorageCluster` specification with "`kubectl apply -f 'https://install.portworx.com/$VERSION_NUMBER?operator=true&mc=false&kbver=&b=true&c=$PXCLUSTER&csi=true&mon=true&tel=false&st=k8x&promop=true'`"

### Verification

1.  Monitor Portworx nodes with "`kubectl -n kube-system get storagenodes -l name=portworx`".  Each Portworx node eventually appears as "`Online`" or "`Ready`", perhaps after a little delay as the "`kubectl apply …`" deployments finish.

1.  Practice monitoring the status of an individual node with "`kubectl -n kube-system describe storagenode $PORTWORX_NODENAME`".

At this point, your working Kubernetes cluster includes a small Portworx deployment with a permanent fee-free license.  You can use your cluster for educational practice, proofs-of-concept, or other demonstrations of Portworx' capabilities.

## Run a Model Portworx Project

The extensive [documentation on Portworx' own Web site](https://docs.portworx.com/) includes many examples of the benefits Portworx brings to management of data applications. Consider, in particular, how to "[Run Kafka on Kubernetes at Scale with Portworx](https://blog.purestorage.com/purely-technical/run-kafka-kubernetes-scale-portworx/)". While thousands of organizations already deploy Kafka "manually" to good effect, Portworx "... can deliver major availability, resilience, and operational efficiency gains when running Apache Kafka at scale …" Replacement of a manual deployment with Postworx' mediation **automates** disaster recovery, application-specific high availability, backup services, and capacity management.

1.  Here's what it takes: given a Postworx installation from the preceding section, create the specification `sc-kafka-rf2.yaml` with contents

```file
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

Among the automations this specification provides is **replication**. The `'repl: "2"'` parameter, for instance, informs Postworx to maintain precisely two full replicas of broker data–that is, Kafka's content–across the failure domains of the hosting Kubernetes cluster. This guarantees that Kafka continues without downtime even if one node fails.

A complete working "manual" replication solution for Kafka for comparison is beyond the scope of this guide. Even a complete configuration is large enough that Postworx provides it, along with an installation script, in a [demonstration public repository](https://github.com/rsomu/kafka-setup-k8s).

Reliance on Portworx for such services does more than just capture configuration in a well-documented and more maintainable format.  Portworx services are clever enough that, in the event of a failure, the configuration above "... provides an 83% reduction in Kafka broker rebuild times." That particular improvement results from Postworx' agility in implementing resource allocations: replication at the storage level makes it possible in the event of failure for Portworx to identify and re-assign healthy storage in a way that keeps good data available and replicating almost immediately.

Use of Postworx typically entails at least several dozens of lines of configuration files, but that's nearly always less than any procedural equivalent administrators might adopt in maintaining a Kubernetes cluster.  Beyond that clarity and relative simplicity that Postworx brings, Postworx also typically improves on the efficiency of manual solutions by a large factor. The savings from more efficient storage use, for example, quickly exceed Portworx' license fees when terabytes of data are involved.

## Conclusion

Modern organizations manage vast amounts of data, and they do it in the cloud, generally with Kubernetes as an infrastructure basis. Portworx goes a long way toward easier, more trustworthy management of the storage and other resource requirements of large-scale data systems running in cloud environments.  While manual specification of Kubernetes-based applications remains common in commercial installations, Portworx boosts your efficiency and the quality of your deployments.