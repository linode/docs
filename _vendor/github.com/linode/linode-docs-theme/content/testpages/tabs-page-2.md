---
title: Tabs Shortcode Page 2
description: This is a test page used in both manual and automatic tests. Do not delete. It will not be listed anywhere.
---

Also see [Page 1](../tabs-page-1/)

## Tabbed content

This is a test of tabbed content.

{{< tabs >}}
{{< tab "Tab number 1" >}}
This is **tab 1** on page 2.
{{< /tab >}}
{{< tab "Tab number 2" >}}
This is **tab 2** on page 2.

{{< /tab >}}
{{< tab "Tab number 3" >}}
This is **tab 3**.
{{< /tab >}}
{{< /tabs >}}

## Perform System Updates

Updating your system frequently is the single biggest security precaution you can take for any operating system. Software updates range from critical vulnerability patches to minor bug fixes and many software vulnerabilities are actually patched by the time they become public. Updating also provides you with the latest software versions available for your distribution.

{{< tabs >}}
{{< tab "Windows" >}}
```command
apt update && apt upgrade
```
{{< note isCollapsible=true >}}
foobar When updating some packages, you may be prompted to use updated configuration files. If prompted, it is typically safer to keep the locally installed version.
{{< /note >}}
{{< /tab >}}
{{< tab "CentOS/RHEL Stream and Fedora" >}}
*This includes CentOS Stream 8 (and above), CentOS 8, other RHEL derivatives (including AlmaLinux 8 and Rocky Linux 8), and Fedora.*

```command
dnf upgrade
```
{{< /tab >}}
{{< tab "Ubuntu, Debian, and Kali Linux" >}}
```command
apt update && apt upgrade
```

{{< note >}}
When updating some packages, you may be prompted to use updated configuration files. If prompted, it is typically safer to keep the locally installed version.
{{< /note >}}
{{< /tab >}}

{{< tab "Alpine" >}}
```command
apk update && apk upgrade
```
{{< /tab >}}
{{< tab "Arch Linux" >}}
```command
pacman -Syu
```
{{< /tab >}}
{{< tab "CentOS 7" >}}
```command
yum update
```
{{< /tab >}}
{{< tab "Gentoo" >}}
```command
emaint sync -a
```

After running a sync, it may end with a message that you should upgrade Portage using a `--oneshot` emerge command. If so, run the Portage update. Then update the rest of the system:

```command
emerge -uDU --keep-going --with-bdeps=y @world
```
{{< /tab >}}
{{< /tabs >}}

{{< note >}}
Standalone note.
{{< /note >}}

## Tabbed content with same tab names

{{< tabs >}}
{{< tab "Tab number 1" >}}
This is **tab 1**.
{{< /tab >}}
{{< tab "Tab number 2" >}}
This is **tab 2**.
{{< /tab >}}
{{< tab "Tab number 3" >}}
This is **tab 3**.
{{< /tab >}}
{{< /tabs >}}


## Tabbed content many tabs

Note that the tab names are the same as in the next section. Try tapping on the first and last element to see the scroll behavior.


{{< tabs >}}
{{< tab "Tab number 1" >}}
This is **tab 1**.
{{< /tab >}}
{{< tab "Tab number 2" >}}
This is **tab 2**.
{{< /tab >}}
{{< tab "Tab number 3" >}}
This is **tab 3**.
{{< /tab >}}
{{< tab "Tab number 4" >}}
This is **tab 4**.
{{< /tab >}}
{{< tab "Tab number 5" >}}
This is **tab 5**.
{{< /tab >}}
{{< tab "Tab number 6" >}}
This is **tab 6**.
{{< /tab >}}
{{< tab "Tab number 7" >}}
This is **tab 7**.
{{< /tab >}}
{{< tab "Tab number 8" >}}
This is **tab 8**.
{{< /tab >}}
{{< tab "Tab number 9" >}}
This is **tab 9**.
{{< /tab >}}
{{< tab "Tab number 10" >}}
This is **tab 10**.
{{< /tab >}}
{{< tab "Tab number 11" >}}
This is **tab 11**.
{{< /tab >}}
{{< tab "Tab number 12" >}}
This is **tab 12**.
{{< /tab >}}
{{< tab "Tab number 13" >}}
This is **tab 13**.
{{< /tab >}}
{{< /tabs >}}

## Another Tabbed content many tabs

{{< tabs >}}
{{< tab "Tab number 1" >}}
This is **tab 1**.
{{< /tab >}}
{{< tab "Tab number 2" >}}
This is **tab 2**.
{{< /tab >}}
{{< tab "Tab number 3" >}}
This is **tab 3**.
{{< /tab >}}
{{< tab "Tab number 4" >}}
This is **tab 4**.
{{< /tab >}}
{{< tab "Tab number 5" >}}
This is **tab 5**.
{{< /tab >}}
{{< tab "Tab number 6" >}}
This is **tab 6**.
{{< /tab >}}
{{< tab "Tab number 7" >}}
This is **tab 7**.
{{< /tab >}}
{{< tab "Tab number 8" >}}
This is **tab 8**.
{{< /tab >}}
{{< tab "Tab number 9" >}}
This is **tab 9**.
{{< /tab >}}
{{< tab "Tab number 10" >}}
This is **tab 10**.
{{< /tab >}}
{{< tab "Tab number 11" >}}
This is **tab 11**.
{{< /tab >}}
{{< tab "Tab number 12" >}}
This is **tab 12**.
{{< /tab >}}
{{< tab "Tab number 13" >}}
This is **tab 13**.
{{< /tab >}}
{{< /tabs >}}


## Tabbed content with different tab names

{{< tabs >}}
{{< tab "Other tab 1" >}}
This is **Other tab 1**.
{{< /tab >}}
{{< tab "Other tab 2" >}}
This is **Other tab 2**.
{{< /tab >}}
{{< tab "Other tab 3" >}}
This is **Other tab 3**.
{{< /tab >}}
{{< /tabs >}}




<!-- {{< tab "Ignore me." />}} Hugo has a bug that doesn't detect changes in inner shortcodes. I (bep) have fixed this in a Hugo dev branch, but until then, just keep this here while developing the shortcode templates. -->