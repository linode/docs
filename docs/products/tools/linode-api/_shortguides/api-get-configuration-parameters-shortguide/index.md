---
# Shortguide: you how to get configuration parameters from the Linode API.

headless: true
show_on_rss_feed: false
---

Specify the type, region, and image for the new Linode.

1.  Review the list of available images:

        curl https://api.linode.com/v4/images/ | json_pp

    Choose one of the images from the resulting list and make a note of the `id` field.

1.  Repeat this procedure to choose a type:

        curl https://api.linode.com/v4/linode/types/ | json_pp

1.  Choose a region:

        curl https://api.linode.com/v4/regions | json_pp
