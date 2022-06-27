---
slug: 2fa
author:
  name: Linode
  email: docs@linode.com
description: "Secure your Linode user account from unauthorized access by enabled 2FA (two-factor authentication)."
keywords: ["security", "Linode Cloud Manager", "token"]
tags: ["security","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2022-06-27
modified_by:
  name: Linode
published: 2022-06-27
title: "Managing 2FA on a Linode User Account"
h1_title: "Managing Two-Factor Authentication (2FA) on a User Account"
enable_h1: true
---

2FA (*two-factor authentication*) increases the security of your Linode account by requiring two forms of authentication: your password and an expiring token, also called an OTP (one-time passcode) or 2FA code. This follows the security principle of authenticating with something you *know* (a password) and something you *have* (the device used to generate the token). This additional layer of security reduces the risk that an unauthorized individual can gain access to your Linode account. **Linode highly recommends enabling 2FA**.

{{< note >}}
Managing 2FA through Linode is only available if *Linode* is selected as the **Login Method**. If you select a third-party authentication provider (such as Google or GitHub), 2FA is managed directly through that provider and not through Linode.
{{</ note >}}

## Choosing a 2FA Provider

Before enabling 2FA on your user account, you need to determine which application you wish to use for managing your authentication and generating the expiring tokens (OTPs). You may want to consider using your existing password manager or using a using dedicated authenticator app.

### Use Your Password Manager

Most password managers offer a built-in OTP feature. If convenience is a large factor for you, using your password manager is typically faster and no extra applications are needed. Once configured, you can copy your OTP token from the same application that stores your usernames and passwords. In many cases, your OTP token can automatically be pasted into the appropriate field on your web browser when logging in. Here are some password managers that support OTP / 2FA tokens:

- [1Password](https://1password.com/)
- [Bitwarden](https://bitwarden.com/)
- [Keeper](https://www.keepersecurity.com/)

The primary downsides of using your password manager as your OTP provider are security and cost. If a malicious actor gains access to your password manager, they also now have access to your OTPs. To prevent this, consider using a dedicated application (see below).

### Use a Dedicated Authenticator App

There are quite a few free (and paid) third-party authenticator applications available. They are typically more secure than using your password manager's OTP functionality as a malicious actor cannot gain access to your Linode account (or any other 2FA protected account) unless they know your password and have access to the particular device on which the authenticator app is installed, typically your smartphone.

- [Authy](https://authy.com/features/setup/)
- [Duo Mobile](http://guide.duosecurity.com/third-party-accounts)
- [Google Authenticator](http://support.google.com/accounts/bin/answer.py?hl=en&answer=1066447)
- [Microsoft Authenticator](https://www.microsoft.com/en-us/security/mobile-authenticator-app)

## Enabling 2FA

Enable two-factor authentication to start using it with your Linode account.

1.  Log in to the [Cloud Manager](https://cloud.linode.com).

1.  Navigate to the Login & Authentication page of your profile by clicking on your **username** in the top right of the screen. Select **Login & Authentication** from the dropdown menu.

    ![Click your username and select Login & Authentication](profile-link.png)

1. Within the **Login Method** section, select **Linode** as the login provider. If you configure a third-party provider (such as Google or GitHub), you instead can manage 2FA directly through that provider and not through Linode.

    ![Screenshot of the Login Method section](login-provider.png)

1. Under **Security Settings**, verify that you have configured all 3 security questions. If not, follow the instructions within the [Security Questions](/docs/guides/user-security-controls/#security-questions) guide.

1. Within the **Two-Factor Authentication** section, click the toggle switch to enable 2FA.

    ![Enable 2FA](tfa-enable.png)

    A QR code should appear, along with a secret key and a field to enter your 2FA token.

1.  Open the app for your preferred 2FA provider on your smartphone or desktop. For help choosing a provider, see [Choosing a 2FA Provider](#choosing-a-2fa-provider).

1.  The next step is to configure the app to automatically generate OTP tokens for use with Linode's 2FA feature. The process varies depending on the app you are using. Within most dedicated authenticator apps, you can add an account. For password managers, edit or add a Linode login entry and add a one-time passcode (1Password), two-factor code (Keeper), or the equivalent field within your app. Then either scan the Cloud Manager's 2FA QR code or manually enter the secret key (also called a setup key or code). On mobile devices, you can use your phone's camera to scan the QR code. Desktop applications instead can typically scan the QR through their own custom screen capture tool. If you need further help, you can consult the documentation for your 2FA provider.

1. Once 2FA has been configured in your 2FA provider, a time-sensitive OTP token is generated. This token refreshes every 30 seconds. Copy this token and, within the Cloud Manager, paste it to the **Token** field and click **Confirm Token**.

    ![Enter the 2FA token](confirm-2fa-token.png)

1. Once the token is successfully confirmed, a scratch code appears. Save this code to a secure place, such as a password manager. If you ever lose access to your authenticator app, this scratch code can be used once in place of the OTP token. is enabled on your account.

## Logging in When 2FA Is Enabled

If 2FA is enabled on your account, you must enter the OTP generated by your 2FA provider when you log in to the Cloud Manager.

1. Open the [Cloud Manager](https://cloud.linode.com) in your web browser. If you are not already logged in, the Login page appears.

1. Enter your username and password and click **Log in**. If you wish, you can also select *Trust this device for 30 days* to stay logged in for 30 days. If 2FA is enabled on your account, a form appears requesting your OTP token or scratch code.

1. Open the authenticator app you are using to manage your 2FA and OTP tokens. Within this app, open the Linode account or login entry to view the time-sensitive OTP code.

1. Enter your OTP token into the **Token** field in the Cloud Manager and then click the **Verify** button. Provided the token is correct, you are successfully logged in.

    ![Screenshot of the 2FA entry form](login-with-2fa.png)

    {{< note >}}
If you entered your one-time use scratch code instead of an OTP token, a new scratch code is automatically generated and provided to you. Save this code for the next time you do not have access to your authenticator app.
{{</ note >}}

## Switching to a New Device or 2FA Provider

If you need to switch your 2FA provider or change the device in use by your two-factor authenticator app, you can do so within the Cloud Manager. To successfully log in to the Cloud Manager, you must have access to your original 2FA provider or device. If you've lost your device or otherwise don't have access, see the [Recovery Procedure](#recovery-procedure) below.

1. Log in to the [Cloud Manager](https://cloud.linode.com).

1. Navigate to the Login & Authentication page of your profile by clicking on your **username** in the top right of the screen. Select **Login & Authentication** from the dropdown menu.

1. In the **Two-Factor Authentication (2FA)** section, click **Reset two-factor authentication**, as shown below.

    ![Reset two-factor authentication.](security-reset-tfa.png "Reset two-factor authentication.")

1. A new QR code and secret key is generated for your account and displayed on the screen. Follow the instructions in the [Enabling Two-Factor Authentication](#enabling-2fa) section.

## Disabling 2FA

You can disable two-factor authentication for your Linode account at any time. Here's how:

1.  Log in to the [Cloud Manager](https://cloud.linode.com).

1.  Navigate to the Login & Authentication page of your profile by clicking on your **username** in the top right of the screen. Select **Login & Authentication** from the dropdown menu.

1.  In the **Two-Factor Authentication (2FA)** section, toggle the **Enabled** switch to disable two-factor Authentication.

1.  A confirmation window appears asking if you want to disable two-factor authentication. Click **Disable Two-Factor Authentication**.

You have successfully disabled the two-factor authentication feature for your Linode Cloud Manager account.

## Recovery Procedure

If you lose access to your 2FA application without first removing 2FA from your account, you will be unable to log in to the Cloud Manager. In this case, you will need to contact Linode Support and provide a few pieces of information to confirm your identity, such as valid answers to your [security questions](/docs/guides/user-security-controls/#security-questions). If you have enabled 2FA prior to June 27th, 2022 and have not configured any security questions, you will need to verify your identity by providing images of your payment card and photo ID.

### With Security Questions

1. Contact the [Linode Support](https://www.linode.com/support/) team through phone or email and state that you are locked out of your account and would like to remove 2FA.

1. A member of the Support team will ask you to provide valid answers to each of your security questions.

1. Your answers and any other details provided will be reviewed. If the information provided is sufficient, the team member will remove 2FA from your account. If additional details are needed, you will be provided with further instructions.

### Without Security Questions

1. Send an email to support@linode.com and state that you are locked out of your account and would like to remove 2FA.

1. Once the email is processed, you will receive a confirmation email referencing a unique ticket number.

1. Open the [Credential Submission Portal](https://www.linode.com/credential-submission/) and enter your ticket number and the email address on your account.

1. Upload the following images through the portal:

    - An image of the front and back of the payment card on file, which clearly shows the last 6 digits of the card number, the expiration date, cardholder name, and bank logos.
    - An image of the front and back of Government-issued photo ID that matches the name on the card.

1. A member of the Support team will review your submission and respond to your ticket. If the information provided is sufficient, the team member will remove 2FA from your account. If additional details are needed, you will be provided with further instructions.