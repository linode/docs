---
slug: how-to-install-kubectl
author:
  name: Linode Community
  email: docs@linode.com
description: 'This short-guide will provide you with step-by-step instructions on how to install kubectl, the Kubernetes command-line utility, using homebrew or your package manager.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-08
modified: 2022-08-11
modified_by:
  name: Linode
title: "How to Install kubectl"
contributor:
  name: Linode
headless: true
show_on_rss_feed: false
aliases: ['/applications/containers/kubernetes/how-to-install-kubectl/','/kubernetes/how-to-install-kubectl/']
tags: ["kubernetes"]
---

**macOS:**

Install via [Homebrew](https://brew.sh):

    brew install kubectl

If you don't have Homebrew installed, visit the [Homebrew](https://brew.sh) home page for instructions. Alternatively, you can manually install the binary; visit the [Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos) for instructions.

**Linux:**

1.  Download the latest kubectl release:

        curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

1.  Make the downloaded file executable:

        chmod +x ./kubectl

1.  Move the command into your PATH:

        sudo mv ./kubectl /usr/local/bin/kubectl

{{< note >}}
You can also install kubectl via your package manager; visit the [Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux) for instructions.
{{< /note >}}

**Windows:**

Visit the [Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows) for a link to the most recent Windows release.
