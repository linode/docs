---
author:
  name: Linode
  email: docs@linode.com
title: Access the Kubernetes Dashboard
description: "How to access the Kubernetes Dashboard on a Linode Kubernetes Engine (LKE) cluster."
---

## Access the Kubernetes Dashboard

1. Click the Kubernetes link in the Cloud Manager sidebar menu. The Kubernetes listing page appears and you see all of your clusters listed.

1. Select the cluster that you would like to reach the Kubernetes Dashboard for. The Kubernetes cluster’s details page appears.

1. Select the **Kubernetes Dashboard** option at the top of the page to open the link to your Kubernetes Dashboard.

1. Once the link has been opened you will see a login prompt with the option to enter either a Secret valid Bearer **Token**, or a **Kubeconfig** file to authenticate.

   In any [default Kubeconfig file provided for access to LKE clusters](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-and-download-your-kubeconfig) an administrative user token can be found within the file itself, and entered in the `Enter token*` field to authenticate via a token.

   If you prefer to authenticate using a Kubeconfig file, the file can be entered by selecting the `Kubeconfig` option, the `Choose Kubeconfig file` field, and entering the file by using the file explorer menu that appears.


1. After a token or Kubeconfig file has been entered, select the **Sign in** button to access the dashboard.