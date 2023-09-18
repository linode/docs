---
title: Tabs Shortcode Page 3
description: This is a test page used in both manual and automatic tests. Do not delete. It will not be listed anywhere.
---

Also see [Page 1](../tabs-page-1/)

This page is primarily to test a issue where Safari didn't always keep the active tab's style refreshed when the tabs are scrolled.

In the 2 tab sets below, change between the tabs in the first tab set.

## Tabbed content 1


{{< tabs >}}
{{< tab "Tab number 1" >}}
This is **tab 1**.
{{< /tab >}}
{{< tab "Tab number 2" >}}
This is **tab 2**.
{{< /tab >}}
{{< tab "Tab number 10" >}}
This is **tab 10**.
{{< /tab >}}
{{< /tabs >}}

## Tabbed content 2

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
{{< /tabs >}}


## Tabbed content in list


*   List item 1
    {{< tabs >}}
    {{< tab "Tab number 1" >}}
    This is **tab 1**.
    {{< /tab >}}
    {{< /tabs >}}
*   List item 2

<!-- {{< tab "Ignore me." />}} Hugo has a bug that doesn't detect changes in inner shortcodes. I (bep) have fixed this in a Hugo dev branch, but until then, just keep this here while developing the shortcode templates. -->