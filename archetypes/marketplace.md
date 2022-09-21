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

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time for ___App_Name___:** The software should be fully installed within 2-5 minutes.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 9
- **Recommended plan:** All plan types and sizes can be used.

### ___App_Name___ Options

<!-- The following table has three parts. The UDF name, in bold and in one column, followed by
     UDF description in the second column. The description is in normal text, with an optional
     "Required." tag at the end of the description, in italics, if the field is mandatory. -->
| **Field** | **Description** |
|:--------------|:------------|
| **UDF** | Description of UDF. *Required*. |

## Getting Started after Deployment

<!-- the following headings and paragraphs outline the steps necessary
     to access and interact with the Marketplace app. -->
### Accessing the ___App_Name___ App

Your app is accessible at your Linode's IP address...etc.

<!-- the following shortcode informs the user that Linode does not provide automatic updates
     to the Marketplace app, and that the user is responsible for the security and longevity
     of the installation. -->
{{< content "marketplace-update-note-shortguide">}}