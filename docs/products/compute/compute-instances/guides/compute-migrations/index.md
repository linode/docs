---
slug: compute-migrations
title: "Compute Migrations on Akamai Cloud"
description: 'This guide reviews the various types of compute migrations available on the Akamai Cloud platform.'
keywords: ['migrate','migration','host']
tags: ["linode platform","cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Linode"]
published: 2023-11-09
modified_by:
  name: Linode

---

A migration occurs when a Compute Instance is moved from one physical host machine to another. This can happen within the same data center or across data centers. Migrations across data centers can be configured by customers in the Cloud Manager. All other types of migrations must be configured by a Linode or Akamai administrator.

## Types of Migrations

There are three types of migrations that can occur: **cold**, **live**, or **warm**.

### Cold Migrations

During a cold migration, your Compute Instance is automatically shut down if it's not powered off already, moved to another physical host machine, and then returned to a previous state (booted or powered down) once it has fully migrated.

- **Advantages:** Can occur within the same data center or across data centers, generally the most available type of migration option
- **Disadvantages:** Requires the most downtime of all migration types

### Live Migrations

During a live migration, your Compute Instance remains up and running while it is moved from one host to another within the same data center.

- **Advantages:** No downtime
- **Disadvantages:** Not always an option depending on the scenario (i.e. host hardware compatibility, plan resizing, etc.)

### Warm Migrations

During a warm migration, your Compute Instance remains up and running while it is synced from one host to another within the same data center. Once synced, the instance is automatically powered down and is booted back up on the new host to complete the migration process.

- **Advantages:** Significantly less downtime than a cold migration, alternative to live migrations if they are not available
- **Disadvantages:** Requires a reboot to complete the process

## When Migrations Occur

Compute Instances can be migrated between hosts within the same data center, as well as across data centers. Only certain types of migrations are available for certain use cases.

**Within the same data center:**
- Scheduled or emergency maintenance
- By customer request via [Support ticket](/docs/products/platform/get-started/guides/support/) while troubleshooting performance issues
- During the [resize process](/docs/products/compute/compute-instances/guides/resize/)
- Can be achieved via any migration type (cold, live, and warm)

**Across data centers:**
- Customer initiated for personal or business reasons (see our guide on [Initiating a Cross Data Center Migration](/docs/products/compute/compute-instances/guides/migrate-to-different-dc/))
- By customer request via [Support ticket](/docs/products/platform/get-started/guides/support/)
- When an old data center is retired. If this is the case, you will be notified ahead of any anticipated migrations or maintenance.
- Can only be achieved using cold migrations

## Troubleshooting Migrations and FAQ

### What if my cold migration fails?

Should a cold migration fail for any reason, Support will be be notified and will configure a new cold migration.

### Why would a live migration not be available?

In order for a live migration to occur, a host compatible with the host your instance currently resides on must be available and actively communicating with the current host. Not all host hardware is alike, and not all hosts are actively communicating with each other, so live migration availability will not always be a viable option.

### What could cause a warm migration to fail?

- Your instance is not configured to respect ACPI shutdowns:
    - This applies to warm migrations initiated by customers, including warm migrations taking place during the warm resize process.
    - This also applies if you are running a custom distribution (i.e. Windows) or unsupported disk image that is not configured for ACPI shutdowns.
- If a Linode or Akamai administrator cancels the warm migration.
- If the sources Linode stops responding, is shut down prior to the cross-host sync, or if the process is disturbed in any way.

### What should I do if my warm migration fails?

- If your warm migration fails to complete after early initiation via Cloud Manager, Support will be notified. Once notified, there are two options that Support will use at their discretion:
    - Configure a new warm migration and let it proceed as scheduled without early initiation.
    - Configure a cold migration. Once configured by Support, you can then initiate the cold migration via the Cloud Manager or allow it to proceed as otherwise scheduled.

### What should I do if my warm resize fails?

- If a warm resize fails, you can either proceed with a cold resize (recommended) or troubleshoot your instance's configuration to respect ACPI shutdowns.

### What if my cross data center migration fails?

- Should a cross data center migration fail, you may reattempt the migration. If it fails again, open a [Support ticket](/docs/products/platform/get-started/guides/support/) for further assistance.

## Next Steps

If you want to learn more about migrations or need additional troubleshooting tips, see the following resources for additional information:

- [Guides - Change Plans (Resize)](/docs/products/compute/compute-instances/guides/resize/)
- [Guides - Reboot Survival Guide](/docs/guides/reboot-survival-guide/)
- [Linode Community - How should I handle a Scheduled Migration for my Linode?](https://www.linode.com/community/questions/23075/how-should-i-handle-a-scheduled-migration-for-my-linode)
- [Linode Community - My Linode is unreachable after maintenance](https://www.linode.com/community/questions/323/my-linode-is-unreachable-after-maintenance)
- [Linode Blog - Live Migrations at Linode](https://www.linode.com/blog/linode/live-migrations-at-linode/)