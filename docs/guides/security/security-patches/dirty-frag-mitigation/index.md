---
slug: dirty-frag-mitigation
title: '"DirtyFrag" (CVE-2026-43500, CVE-2026-43284) Mitigations'
description: "Mitigating the 'DirtyFrag' privilege escalation vulnerability in Linux."
og_description: "Mitigating the 'DirtyFrag' privilege escalation vulnerability in Linux."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2026-05-14
keywords: ['dirtyfrag','dirty','frag','mitigation','patch','CVE-2026-43500','CVE-2026-43284']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

The "[DirtyFrag](https://github.com/V4bel/dirtyfrag)" (CVE-2026-43500, CVE-2026-43284) vulnerabilities are the second in a new series of local privilege escalations in the Linux kernel that have recently been published and which exploit the ability for an unprivileged user to write to the page cache.  Similar to the "[CopyFail](/docs/guides/cve-2026-31431-copy-fail-mitigation/)" (CVE-2026-31431) vulnerability in nature, these new attack vectors exploit the esp4/esp6 (used by, e.g., [IPSec ESP](https://en.wikipedia.org/wiki/IPsec#Encapsulating_Security_Payload)) and `rxrpc` (used by, e.g., the Andrew File System) components to write attacker controlled data to the page cache.  Much like CopyFail as well, these vulnerabilities are easy and reliable to exploit on affected systems and impact most major Linux distributions.

Unfortunately, these two vulnerabilities were disclosed before upstream Linux distributions had a chance to provide kernel updates, requiring a more dynamic incident response.  This early disclosure was triggered by an independent researcher identifying and publishing vulnerability details without coordination before the embargoed details could be reacted to.  Given the recent developments in the area of AI-assisted vulnerability research, this parallel discovery of adjacent attack vectors to a once-published vulnerability (CopyFail in this case) is not surprising, but should serve as warning and stress the importance to develop nimble defensive capabilities to rapidly respond to new findings.  The time window on embargoed vulnerabilities is shrinking rapidly.

To wit: Only a few days after the disclosure of DirtyFrag, a new variant termed "[Fragnesia](https://github.com/v12-security/pocs/tree/main/fragnesia)" (CVE-2026-46300) was published on 2026-05-13, itself seeing yet another variation just a day later.  Fortunately, this vulnerability is based on the same attack vector and the mitigations described below equally address that vulnerability as well as DirtyFrag.

## Mitigations

A complete fix for these vulnerabilities requires a kernel update.  However, patches to address DirtyFrag may not yet be available from all upstream OS providers.  If your distribution has no upstream release available, you may be able to apply temporary mitigations as explained below.

You may note that these mitigations are quite similar to those we documented for the recent [CopyFail](/docs/guides/cve-2026-31431-copy-fail-mitigation/) vulnerability.  Since the exploitation paths for DirtyFrag affect different capabilities, the impact of the removal of a given kernel module will also differ.  Please keep this in mind while reviewing the mitigations provided below:

As noted above, DirtyFail can be triggered via two distinct attack paths: IPsec ESP and RxRPC. (Fragnesia and its variations use the same ESP attack vector, so can be mitigated in the same manner.)

To check whether ESP support or RxRPC support are compiled into the kernel or is made available as a loadable kernel module, you can run the following commands:

```
egrep "(AF_RXRPC|INET6?_ESP=)" /boot/config-$(uname -r)
CONFIG_INET_ESP=m
CONFIG_INET6_ESP=m
CONFIG_AF_RXRPC=m
CONFIG_AF_RXRPC_IPV6=m
```

If the /boot/config file does not exist, you can also check the running config via

```
zgrep -E INET6?_ESP /proc/config.gz
CONFIG_INET_ESP=m
CONFIG_INET6_ESP=m
CONFIG_AF_RXRPC=m
```

In this example, `=m` indicates that the given functionality is available as a loadable kernel module.  In that case, you can prevent the module from being loaded by running these commands:

```
echo "install esp4 /bin/false" | sudo tee /etc/modprobe.d/dirtyfrag.conf
echo "install esp6 /bin/false" | sudo tee /etc/modprobe.d/dirtyfrag.conf
echo "install rxrpc /bin/false" | sudo tee /etc/modprobe.d/dirtyfrag.conf
sudo rmmod esp4
sudo rmmod esp6
sudo rmmod rxrpc
```

This removes the loaded modules and prevents the respective capabilities from being used, effectively blocking the exploit path. However, this of course also means that no other use of ESP or RXRPC is possible.  For many systems, this is reasonable, but especially the removal of ESP may not be feasible for some classes of systems.

If the `zgrep` command above returned a `# CONFIG_<capability> is not set` instead of `CONFIG_<capability>=m`, then the system does not support it at all and is safe against this vulnerability.  If instead it returned `CONFIG_<capability>=y`, then the system is vulnerable, since support is directly compiled into the kernel and the `rmmod` command above would thus fail.  In this case, you may be able to set a [kernel boot parameter](https://wiki.ubuntu.com/Kernel/KernelBootParameters) of `initcall_blacklist=esp4_init,esp6_init,af_rxrpc_init` and then reboot to block the exploit paths.

## Akamai Cloud (Linode)

Per our [Shared Security Model](https://www.akamai.com/legal/security), customers are responsible for making sure their service’s installed applications and code are securely configured and patched. Given the nature of this vulnerability, it should be assumed that all virtual machines running Linux are at-risk until patched.

As a local privilege escalation, this vulnerability is not exploitable remotely by itself.  Therefore, it is most urgent to fix in multi-tenant / multi-user workloads, or workloads where you allow external code to be executed as a non-privileged user, including in a container environment.  The specifics of your risk exposure will depend highly on your environment, workload, and applications.

Depending on which environment your applications are running in, you have a number of options.

For virtual machines (Linode VMs) you can:

- Upgrade the OS in your VM to vendor supplied patches following instructions from the OS vendor.
- Ensure the loadable kernel module is blocklisted and unloaded, as described above.
- [Rebuild](https://techdocs.akamai.com/cloud-computing/docs/rescue-and-rebuild#rebuilding) your Compute Instance using our updated base images containing the upstream fixes.  At this time we have received upgraded/patched images from upstream providers for:

    - AlmaLinux 8, 9, and 10
    - Alpine 3.21, 3.22, and 3.23
    - ArchLinux
    - Debian 11, 12, and 13
    - Fedora 42 and 43
    - Slackware 15.0

    We will continue to update the OS versions as upstream providers issue new releases.

- Older versions of the different Linux distributions remain available for customers to launch.  The reason for this is that we cannot assess for our customers what risks they are willing to accept, and that we cannot break automated deployment pipelines for them.  We strongly recommend that customers who continue to deploy older releases manually mitigate the vulnerability as described above.
-  If you are using "GRUB 2" (default since August 2018), your Linode will boot with the kernel in the OS disk image.  However, if you are [still using one of our kernels to boot](https://techdocs.akamai.com/cloud-computing/docs/manage-the-kernel-on-a-compute-instance), the latest kernel configuration (version 7.0.5) contains the patch for the DirtyFrag vulnerabilities. Older Linode provided kernel configurations (e.g., "6.15.7-x86_64-linode169", but notably including the 7.0.3 kernel we published in response to the CopyFail vulnerability) remain vulnerable.  We will also provide yet another update to fix Fragnesia, which is why we are strongly encouraging customers to switch to the "latest" kernel – that pointer will be updated to the newest kernel when it lands, then only requiring a reboot to take effect.  Alternatively, use Linode’s default approach of using the "GRUB 2" option to boot from your own (upstream) kernel on your primary disk.

For Linode Kubernetes Engine (LKE and LKE-E), the underlying nodes run a Linux kernel based on the Debian 12 (for LKE) and Ubuntu 22/24 (for LKE-Enterprise) distribution. While we are still waiting for Ubuntu to release an update, we have made available the latest Debian images.  However, existing deployments will need patching.  You can choose one of the following options:

- Upgrade to the latest images by [recycling your node pools](https://techdocs.akamai.com/linode-api/reference/post-lke-cluster-pool-recycle).
- The most durable option is to apply the mitigations outlined above via a DaemonSet. This will ensure mitigations are in place should scaling provision new nodes.
    Note: A RuntimeDefault seccomp profile is insufficient.
- Alternatively, mitigations can be applied manually or via infrastructure as code (IaC) tools like Terraform or Ansible.

## A final note
As we’ve seen in the last few days, vulnerability discovery is currently running on over drive, and once an attack vector has been identified, it is no surprise that the added scrutiny leads to follow-up findings.  With that in mind, we think that there is a good chance that additional vulnerabilities will be disclosed in the near future.  We will, of course, continue to monitor any and all such reports, but if there’s one thing we want to recommend to customers, it is to focus on agility and the ability to take patches on short notice.
