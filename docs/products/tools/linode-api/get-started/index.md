---
title: Get Started
description: "Get started with the Linode API. Learn to get an access token, create an API token, authenticate requests, get configuration parameters, and build the final query."
tab_group_main:
    weight: 20
---

## Get an Access Token

Only authorized users can add Linodes and make changes to your account, and each request must be authenticated with an access token.

The easiest way to get a token is through the [Cloud Manager](https://cloud.linode.com).

  {{< note >}}
If you are building an application which needs to authenticate multiple users (for example, a custom interface to Linode's infrastructure for your organization), you can set up an [OAuth authentication flow](/docs/api/#oauth) to generate tokens for each user.
{{< /note >}}

### Create an API Token

1.  Log into the Cloud Manager.

1.  Click on your username at the top of the screen and select **My Profile**.

1.  Select the **API Tokens** tab:

1.  Click on **Add a Personal Access Token** and choose the access rights you want users authenticated with the new token to have.

1.  When you have finished, click **Submit** to generate an API token string. Copy the token and save it in a secure location. **You will not be able to view the token through the Cloud Manager after closing the popup.**

### Authenticate Requests

1.  This token must be sent as a header on all requests to authenticated endpoints. The header should use the format:

        Authorization: Bearer <token-string>

1.  Store the token as a temporary shell variable to simplify repeated requests. Replace `<token-string>` in this example:

        TOKEN=<token-string>

## Get Configuration Parameters

Specify the type, region, and image for the new Linode.

1.  Review the list of available images:

        curl https://api.linode.com/v4/images/ | json_pp

    Choose one of the images from the resulting list and make a note of the `id` field.

1.  Repeat this procedure to choose a type:

        curl https://api.linode.com/v4/linode/types/ | json_pp

1.  Choose a region:

        curl https://api.linode.com/v4/regions | json_pp

## Build the Final Query

Replace the values in the command below with your chosen type, region, image, label, and a secure root password.

    curl -X POST https://api.linode.com/v4/linode/instances \
    -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" \
    -d '{"type": "g5-standard-2", "region": "us-east", "image": "linode/debian9", "root_pass": "root_password", "label": "prod-1"}'
