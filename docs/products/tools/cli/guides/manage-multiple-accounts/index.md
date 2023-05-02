---
title: "Manage Multiple Accounts with the Linode CLI"
description: "How to use the Linode CLI to manage multiple Linode accounts."
published: 2022-12-06
authors: ["Linode"]
---

The Linode CLI can be configured to run commands from multiple users on separate Linode Accounts. This allows you to control multiple accounts, all through the same system, using the Linode CLI. Once multiple users are configured, you can execute commands as a particular user or set a specific user as the default.

## Configure an Additional User

To manage another Linode Account, you must configure the Linode CLI with a user on that account. This is accomplished by re-running the Linode CLI configuration utility (see [Configure the Linode CLI](/docs/products/tools/cli/guides/install/#configure-the-linode-cli)).

```command
linode-cli configure
```

## View Users

To see which users have already been configured on the Linode CLI, run the following command:

```command
linode-cli show-users
```

This outputs a list containing the usernames of each user. An asterisks (`*`) marks the user that is currently active (the default user).

```output
Configured Users:
*  example-user
   another-user
```

## Change the Default User

The default user is used when running Linode CLI commands. Run the following command to change the default user, replacing *[username]* with the name of the user you wish to use.

```command
linode-cli set-user [username]
```

## Run a Command as a Different User

You can run a Linode CLI command as a specific user *without* needing to change the default user. This is helpful if you need to run a one-off command on a different account. In the command below, replace *[username]* with the name of the user you wish to use.

```command
linode-cli set-user --as-user [username]
```

## Remove a User from the Linode CLI

If you no longer wish to manage a particular user or account from the Linode CLI, you can remove that user. In the command below, replace *[username]* with the name of the user you wish to remove.

{{< note >}}
This does not delete the user on the Linode Platform. It only removes the user from the Linode CLI so you can no longer execute commands as that user.
{{< /note >}}

```command
linode-cli remove-user [username]
```