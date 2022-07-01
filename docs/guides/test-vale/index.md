---
slug: test-vale
published: 2022-07-01
title: "Vale Tests"
_build:
  list: false
noindex: true
---

<!--- Possessive test. Desired result: ignore -->
This is a possessive form of a word from our vocab list: Ansible's.

<!--- Inline code spelling error. Desired result: ignore -->
This is a spelling error in an inline code block: `eror`.

<!--- Code block spelling error. Desired result: ignore -->

    sudo chcon -t bin_t /usr/local/bin/lelastic

{{< note >}}
    sudo chcon -t bin_t /usr/local/bin/lelastic
{{</ note >}}

<!--- Code block in list spelling error. Desired result: ignore -->
1.  List item that includes a vocab term within a code block.

        sudo chcon -t bin_t /usr/local/bin/lelastic

    {{< note >}}
This note is inside of a list item and also has a code block within it.

    sudo chcon -t bin_t /usr/local/bin/lelastic
{{</ note >}}