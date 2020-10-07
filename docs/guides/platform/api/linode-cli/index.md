---
slug: linode-cli
author:
  name: Jared Kobos
  email: docs@linode.com
description: The Linode CLI provides a simplified interface to the Linode API. This guide shows how to install the CLI and describes how to perform basic tasks from the command line.
og_description: The Linode CLI provides a simplified interface to the Linode API. This guide shows how to install the CLI and describes how to perform basic tasks from the command line.
keywords: ["linode api", "linode cli", "python cli"]
aliases: ['/platform/api/linode-cli/','/cli/','/platform/linode-cli/','/platform/api/using-the-linode-cli/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-03-05
modified_by:
  name: Linode
published: 2018-06-29
title: Using the Linode CLI
external_resources:
  - '[Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/)'
  - '[Linode API Documentation](https://developers.linode.com/)'
tags: ["linode platform"]
---

![Linode CLI](using-the-linode-cli.png "Linode CLI")

The Linode CLI is a wrapper around the [Linode API](https://developers.linode.com) that allows you to manage your Linode account from the command line. Virtually any task that can be done through the Linode Manager can be done through the CLI, making it an excellent tool for scripting.

This guide describes the basics of installing and working with the CLI. It also offers examples illustrating how to complete common tasks using the CLI.

## Install the CLI

{{< content "linode-cli-install-shortguide" >}}

## Options

### Help

{{< content "linode-cli-get-help-shortguide" >}}

### Customize Output Fields

{{< content "linode-cli-customize-output-shortguide" >}}

### JSON Output

{{< content "linode-cli-json-output-shortguide" >}}

### Machine Readable Output

You can also display the output as plain text. By default, tabs are used as a delimiter, but you can specify another character with the `--delimiter` option:

    linode-cli regions list --text

{{< highlight text >}}
id	country
us-central	us
us-west	us
us-southeast	us
us-east	us
eu-west	uk
ap-south	sg
eu-central	de
ap-northeast	jp
ap-northeast-1a	jp
ca-east         ca
{{< /highlight >}}

    linode-cli regions list --text --delimiter ";"

{{< highlight text >}}
id;country
us-central;us
us-west;us
us-southeast;us
us-east;us
eu-west;uk
ap-south;sg
eu-central;de
ap-northeast;jp
ap-northeast-1a;jp
ca-east;ca
{{< /highlight >}}

## Examples

This section reviews some common examples related to [Accounts](#account) and [Events](#events), [Domains](#domains), [Linode Instances](#linode-instances), [Linode Kubernetes Engine (LKE)](#linode-kubernetes-engine-lke), [NodeBalancers](#nodebalancers), [Object Storage](#object-storage), [Block Storage Volumes](#block-storage-volumes), and [Support Tickets](#support-tickets). Other actions are available. Use `linode-cli linodes --help` for a complete list.

### Account

{{< content "linode-cli-account-shortguide" >}}

### Events

{{< content "linode-cli-events-shortguide" >}}

### Domains

{{< content "linode-cli-domains-shortguide" >}}

### Linode Instances

{{< content "linode-cli-instances-shortguide" >}}

### Linode Kubernetes Engine (LKE)

{{< content "linode-cli-kubernetes-shortguide" >}}

### NodeBalancers

{{< content "linode-cli-nodebalancer-shortguide" >}}

### Object Storage

{{< content "linode-cli-object-storage-shortguide" >}}

### Block Storage Volumes

{{< content "linode-cli-block-storage-shortguide" >}}

### Support Tickets

{{< content "linode-cli-support-tickets-shortguide" >}}
