---
slug: how-to-change-your-email
author:
  name: Linode
  email: docs@linode.com
description: 'This quick answer guide shows you how to change your account email address both in the Linode Cloud Manager and by using the Linode API.'
og_description: 'This quick answer guide shows you how to change your account email address both in the Linode Cloud Manager and by using the Linode API.'
keywords: ["email address", "email addresses", "address", "addresses"]
tags: ["linode platform","cloud manager","email"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-01-20
modified_by:
  name: Linode
published: 2020-01-20
image: ChangingYourEmailAddress.png
title: How to Change Your Email Address
h1_title: Changing Your Email Address
aliases: ['/quick-answers/linode-platform/how-to-change-your-email/']
---

Changing your account's email address is easy and can be done two different ways.

## From the Cloud Manager

1.  Log in to the [Cloud Manager](http://cloud.linode.com).

1.  Click on your username and choose **My Profile** from the drop down menu.

    ![Click My Profile from Username Drop Down Menu](how-to-change-email-my-profile.png "Click My Profile from Username Drop Down Menu")

1.  On the My Profile page, in the **Email** field, enter the email you would like to associate with your account.

1.  Click the **Save** button.

    ![Click to Save a New Email](how-to-change-email-save.png "Click to Save a New Email")

1.  Cloud Manager will tell you that the email address has been updated. You will also receive an email at this new address from Linode Support confirming this update.

1.  If you enter an invalid email address, the following error message is displayed.

    ![Error Message for Invalid Email](how-to-change-email-error.png "Error Message for Invalid Email")

## Using the API

You can also use the [Linode API](https://developers.linode.com/api/v4) to view and update your account's email address.

1.  Use the [View Account](https://developers.linode.com/api/v4/account) endpoint to view your account information including your email address:

        curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/account

1.  An example of the output:

    {{< output >}}
{
  "active_promotions": [
    {
      "credit_monthly_cap": "10.00",
      "credit_remaining": "50.00",
      "description": "Receive up to $10 off your services every month for 6 months! Unused credits will expire once this promotion period ends.",
      "expire_dt": "2018-01-31T23:59:59",
      "image_url": "https://www.linode.com/10_a_month_promotion.svg",
      "summary": "$10 off your Linode a month!",
      "this_month_credit_remaining": "10.00"
    }
  ],
  "active_since": "2018-01-01T00:01:01",
  "address_1": "123 Main Street",
  "address_2": "Suite A",
  "balance": 200,
  "balance_uninvoiced": 145,
  "capabilities": [],
  "city": "Philadelphia",
  "credit_card": {
    "last_four": 1111,
    "expiry": "11/2022"
  },
  "company": "Linode LLC",
  "country": "US",
  "email": "john.smith@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "215-555-1212",
  "state": "Pennsylvania",
  "tax_id": "ATU99999999",
  "euuid": "E1AF5EEC-526F-487D-B317EBEB34C87D71",
  "zip": 19102
}
{{</ output >}}

1.  To update your email address, use the [Update Account](https://developers.linode.com/api/v4/account/#put) endpoint:

        curl -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -X PUT -d '{
        "email": "jsmith@example.com"
        }
        }' \
        https://api.linode.com/v4/account

1.  The output will be mostly the same, but this time, the email field will be updated with your new email address:

    {{< output >}}
{
  "active_promotions": [
    {
      "credit_monthly_cap": "10.00",
      "credit_remaining": "50.00",
      "description": "Receive up to $10 off your services every month for 6 months! Unused credits will expire once this promotion period ends.",
      "expire_dt": "2018-01-31T23:59:59",
      "image_url": "https://www.linode.com/10_a_month_promotion.svg",
      "summary": "$10 off your Linode a month!",
      "this_month_credit_remaining": "10.00"
    }
  ],
  "active_since": "2018-01-01T00:01:01",
  "address_1": "123 Main Street",
  "address_2": "Suite A",
  "balance": 200,
  "balance_uninvoiced": 145,
  "capabilities": [],
  "city": "Philadelphia",
  "credit_card": {
    "last_four": 1111,
    "expiry": "11/2022"
  },
  "company": "Linode LLC",
  "country": "US",
  "email": "jsmith@example.com",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "215-555-1212",
  "state": "Pennsylvania",
  "tax_id": "ATU99999999",
  "euuid": "E1AF5EEC-526F-487D-B317EBEB34C87D71",
  "zip": 19102
}
{{</ output >}}