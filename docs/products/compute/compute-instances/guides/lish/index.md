---
title: "Access Your System Console Using Lish (Linode Shell)"
title_meta: "Access Your System Console Using Lish"
description: "Learn how to use Lish as a shell for managing or rescuing your Compute Instances."
keywords: ["Console", "Shell", "Lish", "rescue", "weblish"]
published: 2009-08-04
modified: 2023-07-05
modified_by:
  name: Linode
tags: ["linode platform","cloud manager"]
image: using-the-linode-shell-lish.jpg
aliases: ['/platform/manager/using-the-linode-shell-lish-classic-manager/','/platform/using-the-linode-shell-lish/','/networking/using-the-linode-shell-lish/','/using-lish-the-linode-shell/','/troubleshooting/using-lish-the-linode-shell/','/platform/manager/using-the-linode-shell-lish/','/guides/using-the-linode-shell-lish/','/guides/using-the-lish-console/','/guides/lish/']
authors: ["Linode"]
---

The **Lish Console**, also called the *Linode Shell*, provides direct console access to all of your Compute Instances. Through Lish, you can easily access your Compute Instance's internal Linux system and run commands, install software, or configure applications. Lish is especially useful when you are not able to connect to your server through other means, such as SSH.

## Access Lish

There are two ways to access Lish. You can use a terminal application to connect to a *Lish SSH gateway*, or you can log in to the [Linode Cloud Manager](https://cloud.linode.com) and use the Lish console in your web browser. This section explains both methods.

{{< note >}}
Lish used to be accessible via a direct SSH connection to your Linode's host machine, but as of May 10, 2013, all users must connect to a Lish SSH gateway to access Lish. For more information, please see [this blog post](https://blog.linode.com/2013/04/30/lish-ssh-gateway/).
{{< /note >}}

### Through the Cloud Manager (Weblish)

You can connect to Lish using a web browser. This is useful when you don't have access to a terminal application, or if you just need quick and easy console access from the Cloud Manager.

1.  Log in to the [Cloud Manager](https://cloud.linode.com).

1.  Click on the **Linodes** link in the sidebar and select the desired Compute Instance.

1.  Click on the **Launch LISH Console** link in the top right-hand corner of the Cloud Manager.

    ![Launch the Lish Console](launch-console-button.png)

1.  The Lish Web Console window appears, as shown below. From here, you can log in to your Compute Instance with any other username and password available on that system (such as `root`).

    ![An example of the Lish Web Console](weblish.png)

You can exit to the Lish prompt by pressing **CTRL+A** then **D**. You cannot exit to a Lish gateway box using your web browser. To exit the session entirely, just close the Lish Web Console window.

### Through SSH (Using a Terminal)

You can connect to Lish with the SSH client of your choice. For example, you can use the Terminal application in Mac OS X, PuTTY in Windows, or your favorite X11 terminal emulator.

{{< note >}}
If you have [Third Party Authentication](/docs/products/platform/accounts/guides/third-party-authentication/) enabled on your account, you will not be able to log in to your Compute Instance through Lish with password authentication, and must instead use SSH key authentication. Read the [Add Your Public Key](#add-your-public-key) section for more instructions on how to add an SSH key to your account for use with Lish.
{{< /note >}}

1.  Determine which Lish SSH gateway you wish to use. There's one in every data center. See [Lish Gateways](#lish-gateways) for a full list.

1.  Open a terminal window and enter the following command, replacing `username` with your Cloud Manager username, and `location` with your preferred Lish SSH gateway.

    ```command
    ssh username@location
    ```

    For example, logging in as `user` via the Newark gateway would look like:

    ```command
    ssh user@lish-newark.linode.com
    ```

    {{< note >}}
    Users who have been granted "Access" rights on a particular Compute Instance will have access to its Lish console via the gateway. Linodes that a user can't access in the Cloud Manager won’t show up in the Lish list. For more information about creating user accounts and configuring permissions, see [Accounts and Passwords](/docs/products/platform/accounts/guides/manage-users/).
    {{< /note >}}

1.  Verify that the Lish SSH gateway's fingerprint is valid by verifying the Terminal's output against the list of our [Lish Gateway Fingerprints](#lish-gateways). Once verified, enter *yes* to proceed.

    ```output
    The authenticity of host 'lish-newark.linode.com (66.228.40.59)' can't be established.
    ECDSA key fingerprint is SHA256:57OGBNARJ1fhI+zrE3eTEeQWXVVDHRU8QHcP+BsWmN8.
    Are you sure you want to continue connecting (yes/no)?
    ```

    {{< note type="warning" title="ECDSA host key warning" isCollapsible=true >}}
    If after verifying the authenticity of the Lish SSH gateway's fingerprint, you receive a message indicating that the ECDSA host key differs from the key for the IP address, remove the cached IP address on your local machine. Ensure you replace `192.0.2.0` with the IP address indicated by the Terminal.

    ```command
    ssh-keygen -R 192.0.2.0
    ```

    Once you have removed the cached IP address, you can again attempt to SSH into the Lish gateway.
    {{</ note >}}

1.  Enter the password you use to log in to the Cloud Manager. You are now at the Lish shell. A list of your Compute Instances appears, as shown below:

    ```output
    Linodes located in this data center:
    linode241706         Newark, NJ
    linode276072         Newark, NJ

    Linodes located in other data centers:
    linode287497         Dallas, TX
    ```

    {{< note >}}
    You can add a public SSH key for Lish in the Cloud Manager to automatically connect to Lish without a password. See [this section](#add-your-public-key) for more information.
    {{< /note >}}

1.  At the Lish command prompt, type a Compute Instance's name from the list. For example, typing `linode241706` will connect you to the screen console session for that Instance.

1.  Log in to the system with your username and password.

After you log in, you'll have console access to your Compute Instance. You'll be able to restart services like `sshd`, edit firewall settings, and make other changes. To exit the console, press **CTRL+A** then **D** to return to the host machine, and then press **CTRL+D** to return to the Lish menu. If you'd like to see the list of your Compute Instances again, type `list` from the gateway.

## Add Your Public Key

If you don't want to enter your password every time you connect to Lish, or if you have [Third Party Authentication](/docs/products/platform/accounts/guides/third-party-authentication/) enabled on your account, you can add your public SSH key to the Linode Cloud Manager. If you haven't yet created SSH keys, please see our [Public Key Authentication with SSH](/docs/guides/use-public-key-authentication-with-ssh/) guide for more information.

1.  Log in to the [Cloud Manager](https://cloud.linode.com).

1.  Click on the profile icon in the top right hand corner of the Manager and select **LISH Console Settings**.

1.  Copy your public SSH key into the **SSH Public Key** field, as shown below.

    ![Add your public ssh key](lish-add-public-key.png)

1.  Click the **Save** button. Your Lish key will be saved in the Cloud Manager.

Now you can log in to any of the Lish gateway boxes without having to type your password.

If you wish to disable Lish access for users without keys, use the **Authentication Mode** dropdown menu on the same page, and select **Allow key authentication only** then click **Save**.

## Lish Commands

The Lish shell provides access to many functions which are otherwise only accessible via the Cloud Manager web-based administration tool. Enter the `help` command to see a full list of available commands. The output provides an introduction to Lish functionality:

```output
kill            - kill stuck screen sessions
exit            - exit from lish
help            - this menu

[return]        - connect to console
version         - display running kernel version
boot            - boot last used (or the only) config profile
boot N          - boot the specified config profile
shutdown        - shut down the Linode
reboot          - shut down, then boot the last used config profile
reboot N        - shut down, then boot the specified config profile
sysrq X         - send SysRq X to your Linode
destroy         - pulls the plug on a running Linode, no fs sync, no warning

jobs            - view the job queue for your Linode
configs         - view the configuration profiles for your Linode
config N        - view configuration profile details for profile N
status          - view the status of your Linode
logview         - view contents of console log
```

There are two ways to run these commands for a specific Compute Instance. If you are at the main Lish gateway, you can prefix the command with a ID, like this:

```command
linode123456 logview
```

You can also bring up the Compute Instance's console, then type **CTRL+A** then **D** to drop back to the host for that Instance. Now all of the commands above will be run for that Instance specifically. To exit back to the main Lish menu, type `exit`.

{{< note >}}
You can activate the ability to scroll back through the Lish console by pressing **CTRL-A + ESC**
{{< /note >}}

## Advanced Lish Tricks

While the Lish interface as described above is useful as a basic command-line interface, you may find that you want to issue commands to your Compute Instance without going through the Lish login process.

You can directly connect to a Compute Instance's console:

```command
ssh -t [manager-username]@lish-[location].linode.com [linode-name]
```

You can also append Lish commands to the SSH command on your system prompt. For instance, to reboot your system, using your Cloud Manager username, location, and the host-id for your Compute Instance:

```command
ssh -t [manager-username]@lish-[location].linode.com [linode-name] reboot
```

Similarly, you can generate a view of the log using Lish:

```command
ssh -t [manager-username]@lish-[location].linode.com [linode-name] logview
```

This command format works for all Lish functionality.

## Lish Gateways

Each data center has its own gateways, which provides access to Lish, Weblish, and Glish. When connecting through Lish, you can use the corresponding gateway within any data center, though we recommend choosing the data center the instance is located within. These gateways are accessible over IPv4 and IPv6.

{{< note >}}
If you are having issues accessing Lish, Weblish, or Glish, you may be blocked by a local firewall. Make sure your firewall allows outbound connections to the following ports and the gateway you wish to access:

- **Lish ports:** 22, 443, 2200
- **Weblish port:** 8181
- **Glish port:** 8080
{{< /note >}}

#### Atlanta, GA (USA)

-   **Lish SSH Gateway:** `lish-us-southeast.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:OWzHHclIp4zt5sHt+QZ002HYgnxtec+skWPAgFNfx4w lish-us-southeast.linode.com
    ECDSA 256 SHA256:qVMUsKTjxiSFvElIRMvjzKv4eRth37i2OBaaSODO6us lish-us-southeast.linode.com
    ED25519 256 SHA256:ZpNQYxIc25e4vVfFgscSJm1/jGaUy3Gti4kuzB1aTuc lish-us-southeast.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `us-southeast.webconsole.linode.com`
-   **Glish Gateway:** `us-southeast.webconsole.linode.com`

#### Chicago, IL (USA)

-   **Lish SSH Gateway:** `lish-us-ord.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:rRwktOKfSApeffa+YOVxXXL70Ba1CpTYp/oFywEH2Pc lish-us-ord.linode.com
    ECDSA 256 SHA256:SV9A/24Jdb++ns/+6Gx7WqZCyN4+0y4ICFsaqK3Rm8s lish-us-ord.linode.com
    ED25519 256 SHA256:J+yN8rjhr9j27M4zLSF6OX9XmIoipWbPP/J1AGRlRYc lish-us-ord.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `us-ord.webconsole.linode.com`
-   **Glish Gateway:** `us-ord.webconsole.linode.com`

#### Dallas, TX (USA)

-   **Lish SSH Gateway:** `lish-us-central.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:y1H5qzNB3yjvmPX/e8HcYbTffQb9qANjtT7r5vqIZl8 lish-us-central.linode.com
    ECDSA 256 SHA256:3FY9mXdhRJjaJ7eTDO8SUWoLxdJBshz5229Wwsg7/iQ lish-us-central.linode.com
    ED25519 256 SHA256:bC/I0G2IrWlICtzsGYT84dzdft1weRd28SIUt+D31P8 lish-us-central.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `us-central.webconsole.linode.com`
-   **Glish Gateway:** `us-central.webconsole.linode.com`

#### Frankfurt (Germany)

-   **Lish SSH Gateway:** `lish-eu-central.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:4Xkz0V7ZQd277GpfnHzvdshuH3gjsv9+UXlgO0/gNhA lish-eu-central.linode.com
    ECDSA 256 SHA256:W3V3zB1vYWlpoRaBy97RZk6GP+DZrFLsm1vAE27eCXQ lish-eu-central.linode.com
    ED25519 256 SHA256:/105/zGMByknAKw5Hm7554oZ25wwN0+3owhJTZWOvNc lish-eu-central.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `eu-central.webconsole.linode.com`
-   **Glish Gateway:** `eu-central.webconsole.linode.com`

#### Fremont, CA (USA)

-   **Lish SSH Gateway:** `lish-us-west.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:s4ACk4T42uMnOpMWybsZFSVn9PCd/0Q/LEqs0pWKVj4 lish-us-west.linode.com
    ECDSA 256 SHA256:2CnS4CkZsymw6PuT5bE8hLfVTMwkMPr8D9lYbUOgE7E lish-us-west.linode.com
    ED25519 256 SHA256:whGbGnOqEIv9HrvvEgXO6PdNnCDEr7OwL0pHzrTDBYo lish-us-west.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `us-west.webconsole.linode.com`
-   **Glish Gateway:** `us-west.webconsole.linode.com`

#### London (UK)

-   **Lish SSH Gateway:** `lish-eu-west.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:8EgXMpjYma0BpjghpUcFwlJCMv1cZROKv1CE35QElnI lish-eu-west.linode.com
    ECDSA 256 SHA256:CfmDU3U4/F0z34iosz9uWrsmeuy2L/8W+otq44Avonw lish-eu-west.linode.com
    ED25519 256 SHA256:K6Hh7inkt5vJYrPKz3sB3yLd/+rtyrmyV7vYSCQ+8mU lish-eu-west.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `eu-west.webconsole.linode.com`
-   **Glish Gateway:** `eu-west.webconsole.linode.com`

#### Mumbai (India)

-   **Lish SSH Gateway:** `lish-ap-west.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:cZv3NjjPKvjKuG4/ETTs8dQEn/sk/ryXJMn/wAqRSdk lish-ap-west.linode.com
    ECDSA 256 SHA256:PUjmIqCe7ViewBrmronVU1Ss/yU63Zgp0yFe4PCZSQk lish-ap-west.linode.com
    ED25519 256 SHA256:s5LimAwVgNrnDOVWhLhv8RyBo3jk6OjiSCxPUQSefQ8 lish-ap-west.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `ap-west.webconsole.linode.com`
-   **Glish Gateway:** `ap-west.webconsole.linode.com`

#### Newark, NJ (USA)

-   **Lish SSH Gateway:** `lish-us-east.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:u7ayBzPWsFmc2/sLrP8zYh0pFGFvo2m/H13Gmw7tZlA lish-us-east.linode.com
    ECDSA 256 SHA256:Q7TDu+Qa3OpO6TUlgtG8ROa0MfRP5uagjSfavqT4oqs lish-us-east.linode.com
    ED25519 256 SHA256:uUaOWG4KM2k+ZLCgtVFEi90TiNbNElXEP/orB57+8WI lish-us-east.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `us-east.webconsole.linode.com`
-   **Glish Gateway:** `us-east.webconsole.linode.com`

#### Paris, France

-   **Lish SSH Gateway:** `lish-fr-par.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:qTliFB86axo9n07H0hUP/z5nm7Fbkzlf8eKnmtXBhZU lish-fr-par.linode.com
    ECDSA 256 SHA256:NU4UctBefhWIR3mpCrh+r2p5lNmtwFFoeelZspjMNYM lish-fr-par.linode.com
    ED25519 256 SHA256:GYNvVuHJqGIdCiU6yTPbkJmMgj+ZYBGRVGDqnrtJoQc lish-fr-par.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `fr-par.webconsole.linode.com`
-   **Glish Gateway:** `fr-par.webconsole.linode.com`

#### Singapore

-   **Lish SSH Gateway:** `lish-ap-south.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:ed7vvOh2m4DtwwUruYiyDQLegcjh3AAeLZ/C9HYWjS0 lish-ap-south.linode.com
    ECDSA 256 SHA256:dVVAqiJMdolMgD81T1ELjPPM2P3EZ9b9li8dj8UssTw lish-ap-south.linode.com
    ED25519 256 SHA256:+gcOBQjBvMDrGuxKQdmV+fs7+sWqQ9e4khIFYlPvooM lish-ap-south.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `ap-south.webconsole.linode.com`
-   **Glish Gateway:** `ap-south.webconsole.linode.com`

#### Sydney (Australia)

-   **Lish SSH Gateway:** `lish-ap-southeast.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:rbamZevowgslIHGX34frmWv/Qvt863skVo5q2gKFCFs lish-ap-southeast.linode.com
    ECDSA 256 SHA256:FmtrulPNisf4KVfOEtxiC0jLQfLW6iNdM2bZ5AWWFyM lish-ap-southeast.linode.com
    ED25519 256 SHA256:dRp40pJoimqpzoRM9yCY8OIzDxESMIkLWYCes0nFRdQ lish-ap-southeast.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `ap-southeast.webconsole.linode.com`
-   **Glish Gateway:** `ap-southeast.webconsole.linode.com`

#### Tokyo (Japan)

-   **Lish SSH Gateway:** `lish-ap-northeast.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:Ral4+nR7A3jnhOqcebKTZQ+uDCIJ2rHQLnDUizDwIHY lish-ap-northeast.linode.com
    ECDSA 256 SHA256:mxhd/vUfH9+8CDfOVmpfAbGDXdt1o35QKwAxO20GAqw lish-ap-northeast.linode.com
    ED25519 256 SHA256:CDH9IcgWQ2iwx27ZotyvNbWl5os+QbeRZ/SLagLBckQ lish-ap-northeast.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `ap-northeast.webconsole.linode.com`
-   **Glish Gateway:** `ap-northeast.webconsole.linode.com`

#### Toronto (Canada)

-   **Lish SSH Gateway:** `lish-ca-central.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:FetyiRe7La3cAdpHz17sfKgQHaXEQPWcIq8A0sI11go lish-ca-central.linode.com
    ECDSA 256 SHA256:YhHGT3h4elvJjLTRBcjwNU+DK3TkvrQBrTtaiut5bIw lish-ca-central.linode.com
    ED25519 256 SHA256:hf6BTXkLy8dnGBD1z2IiMwD+J+o9xc/nkhxmOX69hWM lish-ca-central.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `ca-central.webconsole.linode.com`
-   **Glish Gateway:** `ca-central.webconsole.linode.com`

#### Washington, DC (USA)

-   **Lish SSH Gateway:** `lish-us-iad.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:mzFtMaMVX6CsLXsYWn6c8BXnXk0XHfoOXGExDUEH2OI lish-us-iad.linode.com
    ECDSA 256 SHA256:of9osuoFwh7g5ZiO0G3ZGYi/8JcCw3BA/ZdkpaKQlT0 lish-us-iad.linode.com
    ED25519 256 SHA256:oFoUJn/xXV/+b7EJIcIt6G6hV5jXzjM/pOsoceDDOaA lish-us-iad.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `us-iad.webconsole.linode.com`
-   **Glish Gateway:** `us-iad.webconsole.linode.com`
