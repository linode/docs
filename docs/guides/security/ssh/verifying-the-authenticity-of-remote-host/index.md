---
slug: verifying-the-authenticity-of-remote-host
description: "A tutorial outlining how and why you should verify a host key's fingerprint when connecting to a server over a new SSH connection."
keywords: ['ssh','linux','mac','connect to server over ssh','fingerprint']
tags: ['ssh', 'security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-28
modified: 2022-05-10
modified_by:
  name: Linode
title: "Verifying the Authenticity of a Remote Server through Its SSH Key Fingerprint"
title_meta: "Verifying the Authenticity of Remote Host (SSH Key Fingerprint)"
authors: ["Linode"]
---

## Warning: The Authenticity of Host Can't Be Established

The first time you connect to a remote server over SSH on a new machine, the SSH client warns you that the authenticity of a host can't be established. This is message is normal and allows you to take extra precautions to make sure you're connecting to the correct remote server. The output of this warning is similar to:

{{< output >}}
The authenticity of host ‘example.com (192.0.2.1)’ can't be established.
ED25519 key fingerprint is SHA256:d029f87e3d80f8fd9b1be67c7426b4cc1ff47b4a9d0a84.
Are you sure you want to continue connecting (yes/no)?
{{</ output >}}

To verify this host key fingerprint, you need to identify the algorithms that are used:

- **SSH key algorithm:** Typically the key is generated using either the **ED25519** or **ECDSA** algorithms, but could also use **RSA** or **DSA** if the server is older. You can determine the algorithm by looking at the first word in the second line, which should be "**ED25519** key fingerprint" or "**ECDSA** key fingerprint".
- **Fingerprint hash algorithm:** Typically the hash is displayed using the **SHA256** algorithm (for later versions of OpenSSH) or the **MD5** algorithm (for earlier versions). You can determine the hash algorithm used by looking at the first few characters of the fingerprint, which should either read `SHA256:` or `MD5:`.

Make a note of both the algorithm and the displayed fingerprint as you continue with the steps below to verify your remote server's SSH key fingerprint.

## Verifying the Host Key Fingerprint

1.  Log in to your remote server through a trusted method. For a Linode Compute Instance, use [Lish](/docs/products/compute/compute-instances/guides/lish/).

1.  Run one of the commands below to output your server's SSH key fingerprint, depending on which algorithm the fingerprint was displayed on your new machine:

    -   **SHA256:**

            ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub

    -   **MD5:**

            ssh-keygen -E md5 -lf /etc/ssh/ssh_host_ed25519_key.pub

    {{< note respectIndent=false >}}
If your local computer connected to the remote host using an algorithm other than ED25519, you can replace the file with the one that corresponds with the algorithm being used:

- **ED25519:** `/etc/ssh/ssh_host_ed25519_key.pub`
- **ECDSA:** `/etc/ssh/ssh_host_ecdsa_key.pub`
- **RSA:** `/etc/ssh/ssh_host_rsa_key.pub`
- **DSA:** `/etc/ssh/ssh_host_dsa_key.pub`
{{< /note >}}

    The output looks similar to:

    {{< output >}}
256 SHA256:C4TRvMnuXWmhrRP/4RgD8wTVAbCBay8/piOExnqVCmQ root@localhost (ED25519)
{{< /output >}}

1.  Compare this output to what appears when opening an SSH connection on your local computer. The two fingerprints should match. **If the fingerprints do not match, do not connect to the server.** You won't receive further warnings unless the fingerprint changes for some reason. Typically, this should only happen if you reinstall the remote server's operating system. If you receive this warning again from a system you already have the host key cached on, you should not implicitly trust the connection and should investigate matters further.