---
slug: third-party-authentication
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows how you can enable Third-Party Authentication (TPA) on your Linode account so you can sign in to Cloud Manager using third party credentials."
keywords: ['tpa','third party authentication','github','account','password']
tags: ["linode platform","security","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-23
image: enable-tpa-hero.png
modified_by:
  name: Linode
title: "Enable Third Party Authentication on Your Linode Account"
h1_title: "Enabling Third Party Authentication on Your Linode Account"
enable_h1: true
aliases: ['/platform/manager/third-party-authentication/']
---

Linode Cloud Manager supports Third-Party Authentication (TPA). This allows you to log in to the Linode Cloud Manager with another provider's login credentials.

{{< note >}}
Enabling TPA disables Two-Factor Authentication (TFA) on your Linode account. You should enable TFA with the TPA provider with which you choose to authenticate to Linode.

Additionally, enabling TPA disables password authentication in the Lish console. You can still authenticate to Lish with an SSH key. For more information on SSH key authentication with Lish, visit our [Using the Lish Console](/docs/guides/using-the-lish-console/#add-your-public-key) guide.
{{</ note >}}

## Enabling Third-Party Authentication

1.  To get started with TPA, log in to the [Cloud Manager](https://cloud.linode.com) using your existing username and password.

1.  Navigate to the Login & Authentication page of your profile by clicking on your **username** in the top right of the screen and selecting **Login & Authentication** from the dropdown menu.

    ![Click your username and select Login & Authentication](profile-link.png "Click your username and select Login & Authentication")

1.  Within the **Login Method** section, select the *Login Provider* you'd like to use for authentication. You can chose to use your own Linode credentials or chose from several Third-Party Authentication (TPA) providers, such as Google and GitHub. Only one login provider can be active at a time. Once selected, you will be asked to confirm that you'd like to enable TPA with this provider.

    ![Select the Login Method](tpa-options.png "Select the Login Method")

    {{< caution >}}
Enabling Third-Party Authentication disables your current Linode password and Two-Factor Authentication on your Linode account. Any Two-Factor Authentication you require will be handled by the TPA provider you choose.
{{</ caution >}}

1.  You will be taken to the TPA provider's website, where you will be prompted to give account access to Linode. You will see a list of permissions that will be granted to Linode. Confirm that you would like to grant Linode the required permissions.

1.  After granting permissions, you will see a confirmation screen. You can now log in to your Cloud Manager account using the TPA provider.

## Disabling Third-Party Authentication


1.  Log in to the [Cloud Manager](https://cloud.linode.com) using your TPA credentials.

1.  Navigate to the Login & Authentication page of your profile by clicking on your **username** in the top right of the screen. Select **Login & Authentication** from the dropdown menu.

    ![Click your username and select Login & Authentication](profile-link.png "Click your username and select Login & Authentication")

1.  Within the **Login Method** section, select **Linode** as the login provider.

    ![Select the Login Method](tpa-options.png "Select the Login Method")

1. A prompt will appear confirming your intent to disable Third-Party Authentication. You will need to click on the **Reset Password** button to send a password reset link to your email. This will be delivered to the email address associated with the Linode account, and not the email associated with the TPA provider. You will need to follow the link in that email to reset your Linode Cloud Manager password.

    ![Send password reset email.](confirm-disable-tpa.png)

1.  Once reset, you can use your new password to log in to Linode Cloud Manager.
