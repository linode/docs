---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to delete a Linode Kubernetes Engine cluster.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Delete a Linode Kubernetes Engine Cluster
keywords: ["kubernetes"]
headless: true
show_on_rss_feed: false
---

You can delete an entire cluster using the Linode Cloud Manager. These changes cannot be reverted once completed.

1.  Click the **Kubernetes** link in the sidebar. The Kubernetes listing page will appear and you will see all your clusters listed.

    {{< image src="kubernetes-listing-page.png" alt="Kubernetes cluster listing page" title="Kubernetes cluster listing page" >}}

1. Select the **More Options Ellipsis** to the right of the cluster you'd like to delete, and select the `Delete` option:

    {{< image src="kubernetes-cluster-delete.png" alt="Kubernetes cluster delete" title="Kubernetes cluster delete" >}}

1.  A confirmation pop-up will appear. Enter in your cluster's name and click the **Delete** button to confirm.

    {{< image src="confirm-delete-cluster.png" alt="Kubernetes Delete Confirmation Dialog" title="Kubernetes Delete Confirmation Dialog" >}}

1.  The Kubernetes listing page will appear and you will no longer see your deleted cluster.
