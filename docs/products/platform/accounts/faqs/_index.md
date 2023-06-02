---
title: "FAQs"
title_meta: "FAQs for Creating and Managing Linode Accounts"
description: "Find quick answers to some of the most commonly asked account and login questions."
tab_group_main:
    weight: 60
published: 2023-03-08
modified: 2023-03-14
---

## I no longer remember my user password. How can I reset it?

If you forget the password associated with your Linode user account, you can reset it using the [forgot password](https://login.linode.com/forgot/password) form. Once you enter your username and submit the form, a password reset is emailed to the user's email address. See [Reset Your User Password](/docs/products/platform/accounts/guides/reset-user-password/).

If you instead need assistance resetting the root user on a Compute Instance, review the [Reset the Root Password on a Compute Instance](/docs/products/compute/compute-instances/guides/reset-root-password/) guide.

## How can I recover the username associated with my Linode account?

If you forget your username, you can recover it using the [forgot username](https://login.linode.com/forgot/username) form. Enter the email address you might have used during signup. If a username is associated with that address, a message containing the username(s) is sent to that email address. See [Recover a Lost Username](/docs/products/platform/accounts/guides/manage-users/#recover-a-lost-username).

## I'm not receiving login-related emails, including username recovery, password reset, and one-time passcode emails.

Login-related emails are sent to the email address of your user account (not to the billing contact email) and are sent from *support@linode.com*. If you are expecting an OTP, password reset, or user recovery email but not seeing one in your inbox, follow the steps below:

- Search your inbox for the sender email (*support@linode.com*).
- Check your spam or junk folder for the email.
- If you are using a Microsoft email service (like Outlook.com, Microsoft 365, or Exchange), verify that *linode.com* is on the [safe senders list](https://support.microsoft.com/en-us/office/block-or-allow-junk-email-settings-48c9f6f7-2309-4f95-9a4d-de987e880e46#bkmk_safesenders).
- For Microsoft 365 (business users), you may need to review your [quarantined email messages](https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/quarantine-end-user?view=o365-worldwide). When viewing the [quarantine portal](https://protection.office.com/quarantine), search for your email address, locate the email you wish to receive, and release/allow that email. and release any emails from *linode.com*.

If you are still not receiving this email, submit a support request through the [Can't sign in to your account?](https://www.linode.com/support/contact/) form.

## 2FA is enabled on my account but I no longer have access to my 2FA device or application. How can I regain access to my Linode account?

2FA (two-factor authentication) adds a layer of security to protect your account from unauthorized access. When switching devices or 2FA applications, it's important to [reset 2FA](/docs/products/platform/accounts/guides/2fa/#switching-to-a-new-device-or-2fa-provider) before decommissioning your original device. If you lose access to your device before resetting 2FA, use one of the scratch codes that were provided to when 2FA was first enabled. As a best practice, these should always be stored in a secure manner separate from your 2FA provider. If you do not have your scratch code, review the options available within the [2FA Recovery Procedures](/docs/products/platform/accounts/guides/2fa/#recovery-procedure).

## I'd like to provide a developer with access to my Linode account. How should I do this?

When working with an outside developer or web administrator, you will likely need to provide them access to your Linode account, your Compute Instances, or both. It's important to keep in mind the level of access they will need. You, as the account owner, are ultimately responsible for the services on the account and the bill that those services generate. Review the [Create an Account for a Developer to Work on Your Linode](/docs/products/platform/get-started/guides/developer-access/) guide for instructions on creating a user account for your developer, providing them with access to Compute Instances, and granting other types of access.