---
slug: getting-started-with-the-linode-api
author:
  name: Jared Kobos
  email: docs@linode.com
description: "This guide introduces the Linode API and demonstrates basic queries, authentication, and creating a new Linode through the API."
keywords: ["linode api", "api v4", "access token"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-08-20
modified_by:
  name: Linode
published: 2018-04-03
title: "Getting Started with the Linode API"
external_resources:
  - '[API Documentation](https://developers.linode.com/api/v4/)'
  - '[Linode CLI](https://github.com/linode/linode-cli)'
  - '[Linode API Python Library](https://github.com/linode/python-linode-api)'
aliases: ['/platform/api/getting-started-with-the-linode-api-classic-manager/','/platform/api/getting-started-with-the-linode-api-new-manager/','/platform/api/getting-started-with-the-linode-api/']
tags: ["linode platform"]
---

![Getting Started with the Linode API](getting-started-with-the-linode-api.png "Getting Started with the Linode API")

## Create a Linode Using the Linode API

The Linode API allows you to automate any task that can be performed by the Cloud Manager, such as creating Linodes, managing IP addresses and DNS, and opening support tickets.

For example, this command creates a new 2GB Linode, deploys a Debian 9 image, and boots the system:

    curl -X POST https://api.linode.com/v4/linode/instances \
    -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" \
    -d '{"type": "g5-standard-2", "region": "us-east", "image": "linode/debian9", "root_pass": "root_password", "label": "prod-1"}'

This guide helps you get set up to run this example. Note that if you run this command, you create and are [charged for a 2GB Linode](https://www.linode.com/pricing/).

## Get an Access Token

Only authorized users can add Linodes and make changes to your account, and each request must be authenticated with an access token.

The easiest way to get a token is through the [Cloud Manager](https://cloud.linode.com).

  {{< note >}}
If you are building an application which will need to authenticate multiple users (for example, a custom interface to Linode's infrastructure for your organization), you can set up an [OAuth authentication flow](/docs/api/#oauth-workflow) to generate tokens for each user.
{{< /note >}}

### Create an API Token

{{< content "api-create-api-token-shortguide" >}}

### Authenticate Requests

{{< content "api-authenticate-requests-shortguide" >}}

## Get Configuration Parameters

{{< content "api-get-configuration-parameters-shortguide" >}}

## Build the Final Query

{{< content "api-build-final-query-shortguide" >}}

## Advanced Query Options

### Pagination

If a results list contains more than 100 items, the response is split into multiple pages. Each response includes the total number of pages and the current page. For example, querying the available kernels produces more than 300 results:

    curl https://api.linode.com/v4/linode/kernels | json_pp

{{< highlight json "linenos=table,hl_lines=24 25" >}}
      ...
      {
         "architecture" : "i386",
         "built" : "2016-10-07T22:21:55",
         "deprecated" : true,
         "id" : "linode/4.8.1-x86-linode94",
         "kvm" : true,
         "label" : "4.8.1-x86-linode94",
         "pvops" : true,
         "version" : "4.8.1"
      },
      {
         "architecture" : "i386",
         "built" : "2016-09-15T13:13:40",
         "deprecated" : true,
         "id" : "linode/4.7.3-x86-linode92",
         "kvm" : true,
         "label" : "4.7.3-x86-linode92",
         "pvops" : true,
         "version" : "4.7.3"
      }
   ],
   "page" : 1,
   "pages" : 4,
   "results" : 312
}
{{< /highlight >}}

The `pages` field indicates that the results are divided into three pages. To view additional pages, add a `page` parameter to the end of the URL. View the second page:

    curl https://api.linode.com/v4/linode/kernels | json_pp page=2

If you prefer a smaller number of items per page, you can override the default value with the `page_size` parameter:

    curl https://api.linode.com/v4/linode/kernels | json_pp page_size=50

### Filter Results

The API also supports filtering lists of results. Filters are passed using the `X-Filter` header and use JSON format. You can filter on almost any field that appears in a response object and the [API documentation](/docs/api/) specifies which fields are filterable.

The following query uses the `deprecated` and `vendor` fields to return all current Debian images:

    curl https://api.linode.com/v4/images/ -H 'X-Filter: { "vendor": "Debian", "deprecated": false}' | json_pp

  {{< highlight json "linenos=table" >}}
{
    "page": 1,
    "pages": 1,
    "data": [
        {
            "size": 1024,
            "type": "manual",
            "label": "Debian 8",
            "created_by": "linode",
            "vendor": "Debian",
            "is_public": true,
            "created": "2015-04-27T20:26:41",
            "deprecated": false,
            "id": "linode/debian8",
            "description": ""
        },
        {
            "size": 1100,
            "type": "manual",
            "label": "Debian 9",
            "created_by": "linode",
            "vendor": "Debian",
            "is_public": true,
            "created": "2017-06-16T20:02:29",
            "deprecated": false,
            "id": "linode/debian9",
            "description": null
        }
    ],
    "results": 2
}
{{< /highlight >}}

More complex searches are possible through the use of logical operators. Use `or` to return a list of all Debian and Ubuntu images:

    curl https://api.linode.com/v4/images/ -H 'X-Filter: {"+or": [{"vendor":"Debian"}, {"vendor":"Ubuntu"}]}' | json_pp

See the [Linode API documentation](/docs/api/) for a full list of supported operators.

## Revoke an API Token

{{< content "api-revoke-token-shortguide" >}}
