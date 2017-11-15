---
author:
  name: Linode
  email: docs@linode.com
description: 'Learn how to generate, update, and disable your Linode API key.'
keywords: ["linode api", " api key", " key"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['api/key/']
modified: 2014-02-14
modified_by:
  name: Linode
published: 2014-01-27
title: API Key
---

Learn how to generate and remove your Linode API keys for use with the [Linode API](https://www.linode.com/api/).

![Learn how to generate, update, and disable your Linode API key.](/docs/assets/linode_api_smg.png "Learn how to generate, update, and disable your Linode API key.")

## Generating

Follow the steps below to generate an API key for your Linode account. This will enable access to the Linode API for this user.

1.  Log in to the [Linode Manager](https://manager.linode.com/).
2.  Select the **my profile** link.
3.  Enter your password and click **Authenticate**.
4.  Select the **API Keys** tab.
5.  Optional: Type a label for the API key in the **Label** field.
6.  Optional: Set an expiration time using the **Expires** dropdown menu. By default, the key will never expire.
7.  Click the **Create API Key** button.

    [![Click the Create API Key button.](/docs/assets/1560-myprofile_api_create1_small.png)](/docs/assets/1553-myprofile_api_create1.png)

8.  You will see a message appear at the top of the page, displaying your new API key. Copy this key and save it in a secure location.

    [![Copy the API key that appears at the top of the page.](/docs/assets/1562-myprofile_api_key_full_marked_small.png)](/docs/assets/1554-myprofile_api_key_full_marked.png)

 {{< caution >}}
This is the only opportunity you will have to view and copy the new API key. In the future, only the key prefix will be displayed on this page.
{{< /caution >}}

Now you have the API key for your Linode account. Note that this key is associated with your own Linode Manager account user, so it has the same permissions for interacting with your account.

You can create as many keys as desired with different labels and expiration times.

## Removing

 {{< caution >}}
If you remove an in-use API key, your applications will break until you update them to use a new key.
{{< /caution >}}

Follow these steps to remove an API key. If all keys are removed, the API will become inaccessible.

1.  Log in to the [Linode Manager](https://manager.linode.com/).
2.  Select the **my profile** link.
3.  Enter your password and click **Authenticate**.
4.  Select the **API Keys** tab.
5.  Click the **Remove** link next to the appropriate key.

    [![Click the Remove button next to the appropriate key.](/docs/assets/1561-myprofile_api_remove_small.png)](/docs/assets/1555-myprofile_api_remove.png)

6.  You will see a popup that says **Are you sure you want to remove this API key?** Click **OK**.

    [![Click OK.](/docs/assets/1556-myprofile_api_remove_ok.png)](/docs/assets/1556-myprofile_api_remove_ok.png)

7.  The key has now been removed.

{{< note >}}
Using the [Linode Manager iPhone App](https://www.linode.com/mobile/) or the [Linode CLI](/docs/cli) will enable access to the API and generate a new API key, even if you have removed (or never created) all API keys for this account. If a key has been saved within the application, that key will be used in the future. If no key is saved in the application, a new key will be generated, even if your account has other existing keys.
{{< /note >}}
