---
title: Create a StackScript
description: "How to make a StackScript using Linode StackScripts."
published: 2022-11-30
aliases: ['/products/tools/stackscripts/guides/stackscripts-create-stackscript/']
authors: ["Linode"]
---

This guide walks you through creating a StackScript through the Cloud Manager.

1. [Open the Create StackScript Form in the Cloud Manager](#open-the-create-stackscript-form-in-the-cloud-manager)
1. [Set the Label](#set-the-label)
1. [Add a Description](#add-a-description)
1. [Select Compatible Distribution Images](#select-compatible-distribution-images)
1. [Create the Custom Script](#create-the-custom-script)
1. [Enter a Revision Note](#enter-a-revision-note)
1. [Save the StackScript](#save-the-stackscript)

## Open the Create StackScript Form in the Cloud Manager

Log in to the [Cloud Manager](https://cloud.linode.com/) and select **StackScripts** from the left navigation menu. Click the **Create StackScript** button. This opens the *[StackScript Create](https://cloud.linode.com/stackscripts/create)* form.

## Set the Label

Within the **Label** field, enter the label you wish to use identify this StackScript. A good label should provide some indication as to what the StackScript will be used to deploy. The label must be alphanumeric, between 3 and 128 characters, and unique from other StackScript labels on your account.

## Add a Description

Enter a brief overview of your StackScript in the **Description** field, outlining what it does and any software it might be installing or configuring. If you intend on sharing this StackScript with other users on your account or making this StackScript public, this description should be sufficient to help others understand the purpose of the StackScript.

## Select Compatible Distribution Images

Within the **Target Images** field, select each distribution image that is compatible with your StackScript. When deploying a Compute Image based on this StackScript, the available images are limited to whichever images are selected here. At least one image must be selected, though you can add multiple images if you wish to provide an option during deployment. See [Choosing a Linux Distribution](/docs/products/compute/compute-instances/guides/distributions/) to learn more about the distributions that Linode supports.

## Create the Custom Script

Paste (or type) your custom script in the **Script** field. This is the script that the StackScript calls when deploying a Compute Instance. The interpreter needed to execute your script must exist in the distribution images that were previously selected. The first line of the script must include a shebang followed by the path to the interpreter you wish to use.

- **Bash:** `#!/bin/bash`
- **Python:** `#!/usr/bin/env python`
- **Python 3:** `#!/usr/bin/python3`

For more details on the components of a StackScript, see [Write a Custom Script for Use with StackScripts](/docs/products/tools/stackscripts/guides/write-a-custom-script/) guide.

## Enter a Revision Note

Each time you make a change to a StackScript (including creating it), you can set a **Revision Note** to indicate what changes were made.

## Save the StackScript

Once you are finished filling out all required fields, click the **Create StackScript** button to create the StackScript. After it has been created, you can edit all of the fields as needed. See [Edit a StackScript](/docs/products/tools/stackscripts/guides/manage/#edit-a-stackscript).

{{< note >}}
To deploy a new Linode with your StackScript, follow the steps in the [Deploying a New Compute Instance Using a StackScript](/docs/products/tools/stackscripts/guides/deploy-a-compute-instance/#deploy-a-linode-from-an-account-stackscript) guide.
{{< /note >}}