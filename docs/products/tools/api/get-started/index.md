---
title: Get Started
title_meta: "Getting Started with the Linode API"
description: "Get started with the Linode API. Learn to get an access token, create an API token, authenticate requests, get configuration parameters, and build the final query."
tab_group_main:
    weight: 20
published: 2020-09-11
modified: 2022-12-06
aliases: ['/products/tools/linode-api/get-started/','/platform/api/getting-started-with-the-linode-api-classic-manager/','/platform/api/getting-started-with-the-linode-api-new-manager/','/platform/api/getting-started-with-the-linode-api/','/guides/getting-started-with-the-linode-api/','/products/tools/linode-api/guides/build-final-query/','/products/tools/linode-api/guides/get-config-parameters/']
tags: ["managed hosting"]
---

The Linode API allows you to automate any task that can be performed by the Cloud Manager. This includes creating and managing all of our products (like Compute Instances and Managed Databases), your customer account (like adding new users or viewing invoices), and even creating support tickets. As an example of an API call, the command below deploys a new 2GB Compute Instance in the Newark data center using the Debian 11 image.

```command
curl -X POST https://api.linode.com/v4/linode/instances \
    -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" \
    -d '{"type": "g6-standard-2", "region": "us-east", "image": "linode/debian11", "root_pass": "[password]", "label": "[label]"}'
```

This guide helps you get set up to run this example. Note that if you run this command, you create and are charged for a 2GB Compute Instance. See [Linode Pricing](https://www.linode.com/pricing/) for details on these charges.

{{< note >}}
Within the Linode API documentation, including this guide, the json_pp utility is used with the curl command to process JSON data into a more human-readable format. An example is shown below:

```command
curl [options] | json_pp
```

Using json_pp is optional. You can remove `| json_pp` from the command and the output is instead displayed without proper indentation. Other alternatives exist, such as the [jsonpp](https://github.com/jmhodges/jsonpp) utility, or you can save the output as a file and open the file with a JSON-compatible file viewer. To install either of these utilities, see the [json_pp](https://github.com/deftek/json_pp) or [jsonpp](https://github.com/jmhodges/jsonpp) documentation.
{{< /note >}}

## Get an Access Token

Authorization for the Linode API is handled through personal access tokens. Personal access tokens grant permissions to read or write to an API endpoint. All API requests to non-public resources must be authenticated with an access token.

{{< note >}}
If you are building an application which needs to authenticate multiple users (for example, a custom interface to Linode's infrastructure for your organization), you can set up an [OAuth authentication flow](/docs/api/#oauth) to generate tokens for each user.
{{< /note >}}

For full instructions on creating and managing personal access tokens, see [Manage Personal Access Tokens](/docs/products/tools/api/guides/manage-api-tokens/#create-an-api-token).

1. Log in to the Cloud Manager.

1. Click on your username at the top of the screen and select **My Profile**.

1. Select the **API Tokens** tab:

1. Click on **Create Personal Access Token** and choose the access rights you want users authenticated with the new token to have.

1. When you have finished, click **Create** to generate an API token string. Copy the token and save it in a secure location. **You will not be able to view the token through the Cloud Manager after closing the popup.**

## Authenticate Requests

Once you have created a personal access token, it needs to be sent along in the header of most API requests. The header should use the format:

```command
Authorization: Bearer <token-string>
```

Store the token as a temporary shell variable to simplify repeated requests. Replace `<token-string>` in this example:

```command
export TOKEN=<token-string>
```

## Get Configuration Parameters

Specify the type, region, and image for the new Compute Instance.

1. Review the list of available images:

    ```command
    curl https://api.linode.com/v4/images/ | json_pp
    ```

    Choose one of the images from the resulting list and make a note of the `id` field.

1. Repeat this procedure to choose a type:

    ```command
    curl https://api.linode.com/v4/linode/types/ | json_pp
    ```

1. Choose a region:

    ```command
    curl https://api.linode.com/v4/regions | json_pp
    ```

## Build the Final Query

Replace the values in the command below with your chosen type, region, image, label, and a secure root password.

```command
curl -X POST https://api.linode.com/v4/linode/instances \
    -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" \
    -d '{"type": "g5-standard-2", "region": "us-east", "image": "linode/debian9", "root_pass": "root_password", "label": "prod-1"}'
```

See [Send an API Request with cURL](/docs/products/tools/api/guides/curl/) for additional instructions on making API calls through the cURL command.