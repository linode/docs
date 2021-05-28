---
# Shortguide: shows you how to build a query for the Linode API.

headless: true
show_on_rss_feed: false
---

Replace the values in the command below with your chosen type, region, and image, and choose a label and secure password.

    curl -X POST https://api.linode.com/v4/linode/instances \
    -H "Authorization: Bearer $TOKEN" -H "Content-type: application/json" \
    -d '{"type": "g5-standard-2", "region": "us-east", "image": "linode/debian9", "root_pass": "root_password", "label": "prod-1"}'
