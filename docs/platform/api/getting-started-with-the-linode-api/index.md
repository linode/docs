---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'This guide introduces the Linode API and demonstrates several basic queries. It also covers authentication and the process of creating a new Linode through the API.'
og_description: 'This guide introduces the Linode API and demonstrates several basic queries. It also covers authentication and the process of creating a new Linode through the API.'
keywords: ["linode api", "api v4", "access token"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-06-29
modified_by:
  name: Linode
published: 2018-04-03
title: Getting Started with the Linode API
external_resources:
  - '[API Documentation](https://developers.linode.com/v4/introduction)'
  - '[Linode CLI](https://github.com/linode/linode-cli)'
  - '[Linode API Python Library](https://github.com/linode/python-linode-api)'
---
The Linode API provides the ability to programmatically manage the full range of Linode products and services. This guide will outline how to create a new Linode using the API and how to filter and sort results.

### Create an API Token

All endpoints affecting your account require either a Personal Access Token or [OAuth authentication](https://developers.linode.com/api/v4#section/OAuth) (when using third-party applications). You can generate an access token through the [beta Linode Manager](https://cloud.linode.com).

1. Log in to the Manager and select the **API Tokens** tab from the **My Profile** menu.

1. Click on **Add a Personal Access Token** and choose the access rights for the new token.

1. Click **Submit** to generate an API token string. Copy the token and save it in a secure location. **You will not be able to view the token through the Manager after closing the popup.**

1. This token must be sent as a header on all requests to authenticated endpoints. The header should use the format:

        Authorization: Bearer <token-string>

1. Store the token as a temporary shell variable to simplify repeated requests.

### Create a Linode Using the Linode API

Get the necessary configuration parameters to create your new Linode.

1.  Review the list of available images:

        curl https://api.linode.com/v4/images/

    Choose one of the images from the resulting list and make a note of the `id` field.

1.  Repeat this procedure to choose a type:

        curl https://api.linode.com/v4/linode/types/

1.  Choose a region:

        curl https://api.linode.com/v4/regions

1. Create a new 2GB Linode with a Debian 9 image. The image will be deployed and the Linode will boot:

        curl -X POST https://api.linode.com/v4/linode/instances \
            -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" \
            -d '{"type": "g5-standard-2", "region": "us-east", "image": "linode/debian9", "root_pass": "root_password", "label": "prod-1"}'

    Note that if you run this command, you will create and be charged for a [2GB Linode](https://www.linode.com/pricing).

### Filtering and Sorting

The API supports filtering lists of results. Filters are passed using the `X-Filter` header and JSON format. You can filter on almost any field that appears in a response object.

- The following query uses the `vendor` and `deprecated` fields to return all current Debian images:

        curl https://api.linode.com/v4/images/ -H 'X-Filter: { "vendor": "Debian", "deprecated": false}'

You can add logical operators to your search filters.

- The example query uses `or` to return a list of all Debian and Ubuntu images:

        curl https://api.linode.com/v4/images/ -H "{"+or": [{"vendor":"Debian"}, {"vendor":"Ubuntu"}]}"

    See the [Linode API documentation](https://developers.linode.com/api/v4#section/Filtering-and-Sorting) for a full list of supported operators.

If a results list contains more than 100 items, the response will be split into multiple pages. Each response will include the total number of pages and the current page.

- To view additional pages, add a page parameter to the end of the URL:

        curl https://api.linode.com/v4/linode/kernels?page=2

- If you prefer a smaller number of items per page, you can override the default value with the page_size parameter:

        curl https://api.linode.com/v4/linode/kernels?page_size=50