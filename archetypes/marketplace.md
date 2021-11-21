---
slug: {{ path.Base .File.Dir }}
author:
  name: Linode Community
  email: docs@linode.com
description: "Two to three sentences describing your guide."
og_description: "Two to three sentences describing your guide when shared on social media. Delete this if not needed."
keywords: ['list','of','keywords','and key phrases']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: {{ now.Format "2006-01-02" }}
modified_by:
  name: Linode
title: "Deploying ___App_Name___ through the Linode Marketplace"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

<!-- Intro paragraph describing the app and what it accomplishes. -->

## Deploying the ___App_Name___ Marketplace App

<!-- shortguide used by every Marketplace app to describe how to deploy from the Cloud Manger -->

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

## Configuration Options

### ___App_Name___ Options
<!-- The following table has three parts. The UDF name, in bold and in one column, followed by
     UDF description in the second column. The description is in normal text, with an optional
     "Required." tag at the end of the description, in italics, if the field is mandatory. -->
Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **UDF** | Description of UDF. *Required*. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 9
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

<!-- the following headings and paragraphs outline the steps necessary
     to access and interact with the Marketplace app. -->

### Accessing the ___App_Name___ App

Your app is accessible at your Linode's IP address...etc.

<!-- the following shortcode informs the user that Linode does not provide automatic updates
     to the Marketplace app, and that the user is responsible for the security and longevity
     of the installation. -->
{{< content "marketplace-update-note-shortguide">}}