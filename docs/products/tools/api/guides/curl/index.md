---
title: Send an API Request with cURL
description: "Learn how to use cURL to send requests to endpoints on the Linode API."
aliases: ['/products/tools/linode-api/guides/authenticate-requests/']
authors: ["Linode"]
---

One of the quickest ways to send an API request in the command line is to use the [cURL](https://en.wikipedia.org/wiki/CURL) command, which can be used on most systems. This guide shows you how to build a request using cURL.

## Authentication

The Linode API employs user-level Personal Access Tokens for authentication. This token is passed along in the header of an API request. The header should use the format:

```command
Authorization: Bearer <token-string>
```

Instead of entering your personal access token each time you send a cURL request, you store the token as a temporary shell variable. In the command below, replace `<token-string>` with your own token:

```command
export TOKEN=<token-string>
```

{{< note >}}
Not all endpoints require authentication. Public endpoints include the [region](/docs/api/regions/), distribution [images](/docs/api/images/), instance [types](/docs/api/linode-types/), and other endpoints.
{{< /note >}}

## Build the API Request

Replace the values in the command below with your chosen type, region, and image, and choose a label and secure password.

```command
curl -X POST https://api.linode.com/v4/linode/instances \
    -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" \
    -d '{"type": "g6-standard-2", "region": "us-east", "image": "linode/debian11", "root_pass": "[password]", "label": "[label]"}'
```

## Pagination

If a results list contains more than 100 items, the response is split into multiple pages. Each response includes the total number of pages and the current page. For example, querying the available kernels produces more than 300 results:

```command
curl https://api.linode.com/v4/linode/kernels | json_pp
```

```file {hl_lines="24,25" lang="json"}
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
```

The `pages` field indicates that the results are divided into three pages. To view additional pages, add a `page` parameter to the end of the URL. View the second page:

```command
curl https://api.linode.com/v4/linode/kernels | json_pp page=2
```

If you prefer a smaller number of items per page, you can override the default value with the `page_size` parameter:

```command
curl https://api.linode.com/v4/linode/kernels | json_pp page_size=50
```

## Filter Results

The API also supports filtering lists of results. Filters are passed using the `X-Filter` header and use JSON format. You can filter on almost any field that appears in a response object and the [API documentation](/docs/api/) specifies which fields are filterable.

The following query uses the `deprecated` and `vendor` fields to return all current Debian images:

```command
curl https://api.linode.com/v4/images/ -H 'X-Filter: { "vendor": "Debian", "deprecated": false}' | json_pp
```

```file {lang="json"}
{
   "data" : [
      {
         "created" : "2019-07-07T12:24:54",
         "created_by" : "linode",
         "deprecated" : false,
         "description" : "",
         "eol" : "2024-07-01T04:00:00",
         "expiry" : null,
         "id" : "linode/debian10",
         "is_public" : true,
         "label" : "Debian 10",
         "size" : 1500,
         "status" : "available",
         "type" : "manual",
         "updated" : "2022-09-12T14:08:55",
         "vendor" : "Debian"
      },
      {
         "created" : "2021-08-14T22:44:02",
         "created_by" : "linode",
         "deprecated" : false,
         "description" : "",
         "eol" : "2026-07-01T04:00:00",
         "expiry" : null,
         "id" : "linode/debian11",
         "is_public" : true,
         "label" : "Debian 11",
         "size" : 1300,
         "status" : "available",
         "type" : "manual",
         "updated" : "2022-09-12T14:09:17",
         "vendor" : "Debian"
      },
      {
         "created" : "2022-04-26T19:17:51",
         "created_by" : "linode",
         "deprecated" : false,
         "description" : "",
         "eol" : "2026-07-01T04:00:00",
         "expiry" : null,
         "id" : "linode/debian11-kube-v1.23.6",
         "is_public" : true,
         "label" : "Kubernetes 1.23.13 on Debian 11",
         "size" : 3500,
         "status" : "available",
         "type" : "manual",
         "updated" : "2022-11-17T14:15:50",
         "vendor" : "Debian"
      },
      {
         "created" : "2022-11-17T14:17:22",
         "created_by" : "linode",
         "deprecated" : false,
         "description" : "",
         "eol" : "2026-07-01T04:00:00",
         "expiry" : null,
         "id" : "linode/debian11-kube-v1.24.8",
         "is_public" : true,
         "label" : "Kubernetes 1.24.8 on Debian 11",
         "size" : 3500,
         "status" : "available",
         "type" : "manual",
         "updated" : "2022-11-17T14:17:36",
         "vendor" : "Debian"
      }
   ],
   "page" : 1,
   "pages" : 1,
   "results" : 4
}
```

More complex searches are possible through the use of logical operators. Use `or` to return a list of all Debian and Ubuntu images:

```command
curl https://api.linode.com/v4/images/ -H 'X-Filter: {"+or": [{"vendor":"Debian"}, {"vendor":"Ubuntu"}]}' | json_pp
```

See the [Linode API documentation](/docs/api/#filtering-and-sorting) for a full list of supported operators.