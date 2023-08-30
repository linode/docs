---
title: Linode API
title_meta: "Linode API Product Documentation"
description: "The Linode API allows you to build the apps you want and programmitically manage your account. It offers secure authentication and third-party integrations and plugins."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    product_description: "Programmatic access to the Linode platform, allowing you to automate tasks through a fully-documented REST API."
published: 2020-09-11
modified: 2022-12-06
aliases: ['/products/tools/linode-api/','/platform/api/','/guides/platform/api/']
---

{{< note >}}
To view the official documentation on each Linode API endpoint, see the [API developer documentation](/docs/api/).
{{< /note >}}

## Features

### Build the Apps You Want

Create your own dev tools with the Linode API. Build scripts and applications to automatically handle repeatable tasks. The Linode API provides access to every part of the Linode platform. Deploy Kubernetes clusters, attach Block Storage volumes, configure NodeBalancers, manage users, and more. All response data is returned in JSON for easy parsing and filtering.

### Third-party Integrations and Plugins

A range of third-party integrations consume the Linode API. Describe your infrastructure as code with Linode’s Terraform provider or manage your Linode Kubernetes clusters with Rancher.

### Programmatically Manage Your Account

Automate account management. View everything from invoices to billing with the Linode API endpoints.

### Secure Authentication

Never worry about unauthorized modifications to your account. Access tokens are required for every request to the API and OAuth is available for applications with multiple users.

## Pricing and Availability

Access to the Linode API is available at no charge across [all regions](https://www.linode.com/global-infrastructure/).

## Technical Specifications

- RESTful API
- Responses formatted using JSON
- Authorization is provided through user-level Personal Access Tokens. These tokens can expire and provide customizable access/permissions to an account.
- HTTPS-only to ensure connections are secure and private

## Limits and Considerations

- Rate limiting may vary by endpoint. See [Linode APIv4 Rate Limits](/docs/api/#linode-apiv4-rate-limits)