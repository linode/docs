---
title: "Send Email on the Linode Platform"
description: "Learn about Linode's email policy, how to lift email restrictions, and best practices to implement when sending email."
published: 2023-05-02
authors: ["Linode"]
keywords: ["SMTP", "SMTP restrictions", "email restrictions"]
---

Linode services, such as Compute Instances and LKE clusters, can be used to send and receive email --- though there may be restrictions in place on new accounts (see [Email Policy and Restrictions](#email-policy-and-restrictions)). This guide covers our email policies and details how to lift email restrictions from your account. It also includes best practices for both ensuring your email is compliant with regulations and decreasing the likelihood of having email marked as spam.

{{< note >}}
Managing an email server is complicated and can result in email deliverability issues if anything is misconfigured. Many organizations choose to instead use dedicated external mail servers, such as those provided by [Fastmail](https://www.fastmail.com/), [Gmail for Google Workspace](https://workspace.google.com/products/gmail/), and [Outlook for Microsoft 365](https://www.microsoft.com/en-us/microsoft-365/business/compare-all-microsoft-365-business-products?&activetab=tab:primaryr2). There are also email delivery services for marketing and transactional email, including [Postmark](https://postmarkapp.com/), [SendGrid](https://sendgrid.com/), and [Mailchimp](https://mailchimp.com/). If you are using one of these services, you may not need to configure your Compute Instances to send email. Consult with those on your team that use email to determine if an external service better suits your needs.
{{< /note >}}

## Email Policy and Restrictions

Email can be sent on the Linode Platform for any purpose (including marketing and transactional), provided that your use conforms to our [Acceptable Use Policy (AUP)](https://www.linode.com/legal-aup/) and any government policies that are applicable to you, including the [CAN-SPAM Act](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business).

In an effort to fight spam, Linode restricts outbound connections over ports 25, 465, and 587 on Compute Instances for *some* new accounts created after November 5th, 2019. These restrictions, if applied to your account, prevent your Compute Instance from sending email over the standard SMTP ports.

## Request to Lift Restrictions

If you would like to send email on a Compute Instance and notice that these restrictions are in place, contact the [Support](https://www.linode.com/support/) team and request that the restrictions are lifted. Please include the following information in your request.

- **First and last name** *(required)*: If you are not the account owner, please include their name and confirm that you're acting on their behalf.

- **Organization name:** If an organization owns the account, provide the name of that entity.

- **Use case and email sending practices** *(required)*: A clear and detailed description of your email use case, including how you intend to avoid sending unwanted emails.

- **Domain name(s)** *(required)*: The domain name from which you intend to send email. If you plan on using multiple domain names, please provide each one.

- **Links to public business information**: Links to public information about your organization or application. This could be a website, GitHub repository, social media profile, or another type of link.

Our Support team reviews each request and will respond back with their decision or ask for additional information to help process this request.

## Best Practices to Follow When Sending Email

When sending email to your users or mailing lists, you should keep the following best practices and requirements in mind. All marketing emails should also comply with any additional requirements described in the [CAN-SPAM Act](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business).

- **Configure rDNS on the Compute Instance to match the system's hostname.** For instructions, reference the [Configure rDNS (Reverse DNS) on a Compute Instance](/docs/products/compute/compute-instances/guides/configure-rdns/) guide. If you have not yet configured a hostname, see [Configure a Custom Hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname). This hostname is different than the domains that will be used when sending email.

- **Set up SPF, DKIM, and DMARC authentication methods for each sending domain name.** These authentication methods help identify which mail servers are able to send email from a domain (and what to do if that fails).

- **Use TLS to encrypt your emails while in transit.** When sending email over SMTP, configure implicit TLS over port 465 and STARTTLS over port 587. See [RFC 8314 Section 3.3](https://datatracker.ietf.org/doc/html/rfc8314#section-3.3) for more details.

- **All recipients must opt-in to receive emails.** At minimum, implement a single opt-in process, which means a recipient needs to manually subscribe to receive your emails. You should also consider implementing a double opt-in process, which means that the recipient needs to confirm their subscription, typically through an email link. It is much less likely for users to mark your email as spam if a person with access to that email has confirmed their subscription. Never purchase or obtain email lists from third parties without explicit consent from all email owners on that list.

- **Clear, accessible, and quick opt-out process.** All forms of marketing or automated email communication should have a clearly visible link for the recipient to unsubscribe or adjust their email preferences. You should honor their preferences as quickly as possible.

## Configure a Mail Server

Once your restrictions are lifted, you can begin to use your Compute Instance to send email. To do so, you will likely need to install a mail server. Follow our [Running a Mail Server](/docs/guides/running-a-mail-server/) guide for general information on setting up a mail server on Linode. This guide discusses your software options, the DNS records you may need, virus protection, and popular email clients.

For more detailed step-by-step instructions on installing a mail server, review one of our [email server](/docs/guides/email/) guides, including:

- [Create an Email Server using Mail-in-a-Box](/docs/guides/mail-in-a-box-email-server/)
- [Configure an Email Server with Postfix, Dovecot, and MySQL](/docs/guides/email-with-postfix-dovecot-and-mysql/)