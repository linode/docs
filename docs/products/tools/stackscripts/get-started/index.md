---
title: Get Started
description: "Get started with Linode StackScripts. Learn to create a StackScript and create a new Linode using a StackScript."
tab_group_main:
    weight: 20
---

## Create a Stackscript

1. Log into the Linode Cloud Manager.

2. Click on the **StackScripts** link in the left-hand navigation menu. You are brought to the StackScripts page.

3. Viewing the **Account StackScripts** section, click on the Create New StackScript link at the top of the page.

4. On the Create New StackScript page, provide the required configurations to create your StackScript.

    | **Field**| **Description** |
    |:-----------------|:---------------------|
    | **StackScript Label** | The name with which to identify your StackScript. *Required*. |
    | **Description** | An overview of what your StackScript does. |
    | **Target Images** | The Linux distributions that can run this StackScript. *Required*.|
    | **Script** | The body of the script. See the [Writing Scripts for Use with Linode StackScripts](/docs/guides/writing-scripts-for-use-with-linode-stackscripts-a-tutorial/) section for more details. *Required*. |
    | **Revision Note** | A short description of the updates made to your StackScript in this version of your script.|

## Create a New Linode Using a Stackscript

1. Log in to the [Cloud Manager](https://cloud.linode.com/) with the username and password you created when signing up.

1. At the top of the page, click **Create** and select **Linode**.

1. Select the `StackScripts` tab.

1. Choose from **Community Stackscripts** or **Account Stackscripts**.

1. Select a specific StackScript from the menu that appears, and fill in all required fields.

1. Click on the `Create` button to complete the creation of your new Linode.