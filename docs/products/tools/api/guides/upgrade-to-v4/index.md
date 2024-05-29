---
title: "Upgrade from API v3 to API v4"
description: 'This guide is intended to help existing users upgrade to the new Linode API version 4, which includes a number of additional features and changes from v3 of the API.'
published: 2018-05-14
modified: 2022-11-30
external_resources:
 - '[Linode API Documentation](https://developers.linode.com)'
keywords: ["api","linode api"]
tags: ["linode platform"]
aliases: ['/platform/api/upgrade-to-linode-api-v4/','/guides/upgrade-to-linode-api-v4/']
---

Version 4 of the Linode API is now in general release and it is a major improvement over previous versions. Almost any task which can be done through the Cloud Manager can now be performed through the API. This guide will show you how to adapt existing code for previous API versions in order to take advantage of these new features.

To get started with the current version, please see the [API documentation](https://developers.linode.com) or our [Getting Started with the Linode API guide](/docs/products/tools/api/get-started/).

## General Changes

- The Linode API now uses a standard RESTful architecture. HTTP verbs have predictable results across the API:

    | Verb | Result |
    | -- | -- |
    | GET | Used to retrieve information about a resource.  |
    | POST | For collections or to create a new resource of that type; also used to perform actions on action endpoints.  |
    | PUT | Update a resource.  |
    | DELETE | Remove a resource from your account.  |

- Previous versions of the API allowed users to submit request and method parameters via URL parameters; this is no longer supported. Instead, entity IDs are included in URL paths (e.g. `/linode/instances/1234567` is used to access a Compute Instance with ID 1234567). Additional parameters are passed in the request body.

- Authentication is now done through the `Authorization` header rather than through the query string.

- Error codes also follow standard RESTful format (e.g. 2XX for success, 4XX for bad input, 5XX for server errors). The custom error codes from previous versions are no longer used or supported.

- Most common static resources can be specified with slugs (e.g. `linode/debian11` for a Debian 11 image) instead of numeric IDs.

- Batch requests are no longer supported. Many of the actions that previously required multiple requests–such as creating and booting a new Compute Instance or creating and attaching a Block Storage Volume–can now be achieved in a single request.

- Modernized language is used throughout the API: "data centers" are now "regions", "distributions" are now "images", and "plans" are now "types".

- A new version of the [Linode CLI](https://github.com/linode/linode-cli) is available to make interacting with the API more convenient.

## Creating a Compute Instance

The process for creating a new Compute Instance with the new API has been streamlined. Setting up an instance previously required multiple requests for creating the instance, deploying an image, and booting. All of these steps have been combined, allowing you to get a running Compute Instance with a single request:

```command
curl -H "Authorization: Bearer $TOKEN" \
    -H "Content-type: application/json" \
    -X POST -d '{
        "type": "g6-standard-2",
        "region": "us-east",
        "image": "linode/debian11",
        "root_pass": "[password]",
        "label": "[label]"
    }' \
    https://api.linode.com/v4/linode/instances
```

## Examples

This section presents examples of how to convert some of the most common tasks from version 3 of the API to version 4. These example commands output JSON, and a nicer way to view this output is to pipe it into Python's `json.tool` function:

```command
curl https://api.linode.com/v4/regions | python -m json.tool
```

### Compute Instances

#### List All Instances

View all Compute Instances on your account:

- **API v3**

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=linode.list
    ```

- **API v4**

    In the new API, this is accomplished with a GET request to the `/instances` endpoint:

    ```command
    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/linode/instances
    ```

#### Boot a Compute Instance

- **API v3**

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=linode.boot&linodeID=123456
    ```

- **API v4**

    ```command
    curl -H "Authorization: Bearer $TOKEN" \
        -X POST \
        https://api.linode.com/v4/linode/instances/$linode_id/boot
    ```

### NodeBalancers

`Data center` has been replaced with `region` in the new API and requests must also be converted to RESTful format. For example, creating a new NodeBalancer uses a POST request to the `/nodebalancers` endpoint:

- **API v3**

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=nodebalancer.create&DatacenterID=123456&Label=this-balancer
    ```

- **API v4**

    ```command
    curl -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -X POST -d '{
            "region": "us-east",
            "label": "nodebalancer_1"
        }' \
        https://api.linode.com/v4/nodebalancers
    ```

### StackScripts

StackScripts have been moved under the `/linode` endpoint. To list all available StackScripts:

- **API v3**

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=stackscript.list
    ```

- **API v4**

    ```command
    curl https://api.linode.com/v4/linode/stackscripts
    ```

    This will list all public StackScripts, and if the request is authenticated will also list any private StackScripts on your account. You can use the ID of a StackScript to deploy from that Script when creating a Compute Instance:

    ```command
    curl -H "Authorization: Bearer $TOKEN" \
        -H "Content-type: application/json" \
        -X POST -d '{
            "type": "g6-standard-2",
            "stackscript_id": 10079,
            "region": "us-east",
            "image": "linode/debian11",
            "root_pass": "[password]",
            "label": "[label]"
        }' \
        https://api.linode.com/v4/linode/instances
    ```

### Volumes

Block storage volumes previously were resized through the `volume.update` method. This method no longer exists, and resizing is now done through the `/resize` endpoint. Note: In both API versions, a block storage volume size can only be increased.

To resize a volume:

- **API v3**

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=volume.update&VolumeID=1234&Size=100
    ```

- **API v4**

    ```command
    curl -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -X POST -d '{
            "size": 2000
        }' \
        https://api.linode.com/v4/volumes/$volume_id/resize
    ```

### DNS

Working with DNS domains and records is similar in both versions. `Resources` are now `Records`, and are nested beneath the `/domains` endpoint.

To create a new A record:

- **API v3**

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=domain.resource.create&DomainID=1234&Type=A&Name=sub.example.com&Target=123.456.789.101
    ```

- **API v4**

    ```command
    curl -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -X POST -d '{
            "type": "A",
            "target": "123.456.789.101",
            "name": "sub.example.com"
        }' \
        https://api.linode.com/v4/domains/$domain_id/records
    ```

### Account

Account interaction has been greatly expanded in the new API. The `/accounts` endpoint allows you to view events and notifications on your account, review and make payments, manage account settings and users, and view account information and invoices.

- **API v3**

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=account.info
    ```

- **API v4**

    ```command
    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/account
    ```

    Transfer information, previously included in the `account.info` method, can now be accessed through its own endpoint:

    ```command
    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/account/transfer
    ```

See the [API documentation](https://developers.linode.com) for information about the other new collections under the `/account` endpoint.

### Utility

Version 3 of the API included utility methods for testing the API and retrieving general information about available plans, data centers, and distributions. The debugging methods `api.spec` and `test.echo` are not included in version 4, and the `avail` information methods have been replaced by GET requests to the corresponding endpoints. Remember that "data centers" are now referred to as "regions", "distributions" as "images", and "plans" as "types".

- **API v3**

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=avail.datacenters
    ```

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=avail.distributions
    ```

    ```command
    curl https://api.linode.com/?api_key=sekrit&api_action=avail.linodeplans
    ```

- **API v4**

    ```command
    curl https://api.linode.com/v4/regions
    ```

    ```command
    curl https://api.linode.com/v4/images
    ```

    ```command
    curl https://api.linode.com/v4/linode/types
    ```