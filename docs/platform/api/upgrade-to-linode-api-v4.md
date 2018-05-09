---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'The new Linode API includes a number of additional features and changes from previous API versions. This guide is intended to help existing users upgrade to the new API.'
keywords: ["api","linode api"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-05-08
modified_by:
  name: Linode
title: 'Upgrade to the New Linode API'
published: 2018-05-08
external_resources:
 - '[Linode API Documentation](https://developers.linode.com)'
---

The new version of the Linode API, which is now in general release, is a significant departure from previous versions. If you have existing code that uses an older API version, you will have to adapt it in order to work with the current version. This guide will discuss the key changes in the Linode API and give examples to help you modify your code to take advantage of the new version.

If you have not used previous versions and are looking to get started with the current version, please see the [API documentation](https://developers.linode.com) or our [Getting Started with the Linode API guide](/docs/platform/api/getting-started-linode-api/).

## General Changes

* The Linode API now uses a standard RESTful architecture. HTTP verbs have predictable results across the API:

    | Verb  |  Result |
    |---|---|
    | GET  | used to retrieve information about a resource.  |
    | POST | create a new instance of a resource.  |
    | PUT  | update a resource.  |
    | DELETE  | remove a resource from your account.  |

* Previous versions of the API allowed users to submit request and method parameters via URL parameters; this is no longer supported. All information needed for a request must be included in the body of a POST or PUT request.

* Error codes also follow standard RESTful format; the custom error codes from previous versions are no longer used or supported.

* Batch requests are no longer supported by the Linode API. Many of the actions that previously required multiple requests–such as creating and booting a new Linode or creating and attaching a Block Storage Volume–can now be achieved in a single request.

## Creating a Linode

The process for creating a new Linode has been streamlined in the new API. Previously setting up a new Linode required multiple requests for creating the Linode, deploying an image, and booting. All of these steps have been combined, allowing you to get a running Linode with a single request:

    curl -X POST https://api.linode.com/v4/linode/instances \
    -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" \
    -d '{"type": "g5-standard-2", "region": "us-east", "image": "linode/debian9", "root_pass": "root_password", "label": "prod-1"}'

## Examples

This section presents examples of how to convert some of the most commmon tasks from version 3 of the API to version 4.

### Linodes

#### List All Linodes

To view all Linodes on your account:

**API v3**

    curl https://api.linode.com/?api_key=sekrit&api_action=linode.list

**API v4**

  In the new API, this is accomplished with a GET request to the `/instances` endpoint:

    curl https://api.linode.com/v4/linode/instances -H "Authorization: Bearer $token"

#### Boot a Linode

**API v3**

    curl https://api.linode.com/?api_key=sekrit&api_action=linode.boot&linodeID=123456

**API v4**

    curl https://api.linode.com/v4/linode/instances/$linode_id/boot -H "Authorization: Bearer $token"

### NodeBalancers

In the new API, `datacenter` has been replaced with `region`. Requests must also be converted to RESTful format, so for example creating a new NodeBalancer uses a POST request to the `/nodebalancers` endpoint:

**API v3**

    curl https://api.linode.com/?api_key=sekrit&api_action=nodebalancer.create&DatacenterID=123456&Label=this-balancer

**API v4**

    curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -X POST -d '{
        "region": "us-east",
        "label": "nodebalancer_1"
    }' \
    https://api.linode.com/v4/nodebalancers

### StackScripts

### Volumes

### DNS

### Account

## Error Codes
