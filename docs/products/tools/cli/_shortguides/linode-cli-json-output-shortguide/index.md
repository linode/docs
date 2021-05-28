---
slug: linode-cli-json-output-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to return JSON output from the Linode CLI.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Return JSON Output from the Linode CLI
keywords: ["linode cli"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-json-output-shortguide/']
---

The CLI will return output in tabulated format for easy readability. If you prefer to work with JSON, use the `--json` flag. Adding the `--pretty` flag will format the JSON output to make it more readable:

    linode-cli regions list --json --pretty

{{< highlight json >}}
[
  {
    "country": "us",
    "id": "us-central"
  },
  {
    "country": "us",
    "id": "us-west"
  },
  {
    "country": "us",
    "id": "us-southeast"
  },
  {
    "country": "us",
    "id": "us-east"
  },
  ...
]
{{< /highlight >}}
