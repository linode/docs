---
title: "Linode CLI Commands for Account Management"
description: "How to use the Linode CLI for Account management tasks."
published: 2020-07-22
modified: 2022-05-02
authors: ["Linode"]
---

View or update your account information, add payment methods, view notifications, make payments, create OAuth clients, and do other related tasks through the `account` action:

1.  View your account:

        linode-cli account view

1.  View your account settings:

        linode-cli account settings

1.  Make a payment:

        linode-cli account payment-create --cvv 123 --usd 20.00

1.  View notifications:

        linode-cli account notifications-list
