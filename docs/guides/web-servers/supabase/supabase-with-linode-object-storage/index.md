---
slug: supabase-with-linode-object-storage
author:
  name: Linode Community
  email: docs@linode.com
description: "Two to three sentences describing your guide."
og_description: "Two to three sentences describing your guide when shared on social media."
keywords: ['supabase storage','supabase api','supabase s3']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-06
modified_by:
  name: Nathaniel Stickman
title: "How to Use Supabase with Linode Object Storage"
h1_title: "How to Use Supabase with Linode Object Storage"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Supabase: Storage Is Now Available in Supabase](https://supabase.com/blog/supabase-storage)'
- '[GitHub - supabase/storage-api](https://github.com/supabase/storage-api)'
---

Access Key: K7WSC2CBTXRKC2CCLQN8
Secret Key: DXCZEqzA49vDZ2bg1CITDDnJ8HRhHTljwOx3X9Ub

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}


## How Does Supabase Storage Work?
Succinctly explain the architecture and where the S3 storage sits in it

Supabase

## How to Use Linode Object Storage with Supabase

### Setting Up Linode Object Storage
Refer to the existing guide on doing so

Everything you need to get started with Linode Object Storage is covered in our guide [Object Storage - Get Started](https://www.linode.com/docs/products/storage/object-storage/get-started/).

- Create a bucket.

### Linking Supabase and Linode

### Testing

    insert into places (place_name)
    values
        ('Seattle, WA'),
        ('Chicago, IL'),
        ('New York, NY')
    ;

## Conclusion
