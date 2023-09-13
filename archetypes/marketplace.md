---
title: "Deploy ___App_Name___ through the Linode Marketplace"
description: "Two to three sentences describing your guide."
og_description: "Two to three sentences describing your guide when shared on social media. Delete this if not needed."
keywords: ['list','of','keywords','and key phrases']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Linode"]
published: {{ now.Format "2006-01-02" }}
modified_by:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

<!-- Intro paragraph describing the app and what it accomplishes. -->

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time for ___App_Name___:** The software should be fully installed within 2-5 minutes.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 11
- **Recommended plan:** All plan types and sizes can be used.

### ___App_Name___ Options

<!-- List each UDF field. Include a description and note if it is required. -->

- **Field name** (*required*): Description of the field.

## Getting Started after Deployment

<!-- the following headings and paragraphs outline the steps necessary
     to access and interact with the Marketplace app. -->
### Accessing the ___App_Name___ App

Your app is accessible at your Linode's IP address...etc.

<!-- the following shortcode informs the user that Linode does not provide automatic updates
     to the Marketplace app, and that the user is responsible for the security and longevity
     of the installation. -->
{{< content "marketplace-update-note-shortguide">}}