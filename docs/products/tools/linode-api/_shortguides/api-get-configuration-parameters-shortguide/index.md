---
slug: api-get-configuration-parameters-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide shows you how to get configuration parameters from the Linode API.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to Get Configuration Parameters from the Linode API
keywords: ["api"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/api-get-configuration-parameters-shortguide/']
---

Specify the type, region, and image for the new Linode.

1.  Review the list of available images:

        curl https://api.linode.com/v4/images/ | json_pp

    Choose one of the images from the resulting list and make a note of the `id` field.

1.  Repeat this procedure to choose a type:

        curl https://api.linode.com/v4/linode/types/ | json_pp

1.  Choose a region:

        curl https://api.linode.com/v4/regions | json_pp
