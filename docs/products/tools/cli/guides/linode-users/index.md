---
author:
  name: Linode
  email: docs@linode.com
title: "Linode CLI Commands for Multiple Users"
description: "How to use the Linode CLI to manage multiple Linode accounts."
published:
modified:
---

You can configure, view, and remove additional users to manage multiple Linode accounts. You can also execute command as a particular user, change the default user using the Linode CLI:

1.  Configure users:

        linode-cli configure

1.  View the users:

        linode-cli show-users

1.  Change the default user for all requests:

        linode-cli set-user USERNAME

1.  Execute a request as a particular user:

         linode-cli set-user --as-user USERNAME

1.  Remove the configured user:

        linode-cli remove-user USERNAME
