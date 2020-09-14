---
author:
  name: Ryan Syracuse
  email: docs@linode.com
description: 'Shortguide that shows you how to create a StackScript.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-09-14
modified_by:
  name: Ryan Syracuse
published: 2020-09-14
title: How to Create a Stackscript
keywords: ["StackScript"]
headless: true
show_on_rss_feed: false
---

## Create a Stackscript

1. Log into the Linode Cloud Manager.

2. Click on the **StackScripts** link in the left-hand navigation menu. You will be brought to the StackScripts page.

3. Viewing the **Account StackScripts** section, click on the Create New StackScript link at the top of the page.

4. On the Create New StackScript page, provide the required configurations to create your StackScript.

    | **Field**| **Description** |
    |:-----------------|:---------------------|
    | **StackScript Label** | The name with which to identify your StackScript. *Required*. |
    | **Description** | An overview of what your StackScript does. |
    | **Target Images** | The Linux distributions that can run this StackScript. *Required*.|
    | **Script** | The body of the script. See the [Writing Scripts for Use with Linode StackScripts](/docs/platform/stackscripts/writing-scripts-for-use-with-linode-stackscripts-a-tutorial/) section for more details. *Required*. |
    | **Revision Note** | A short description of the updates made to your StackScript in this version of your script.|