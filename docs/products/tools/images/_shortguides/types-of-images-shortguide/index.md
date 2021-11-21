---
# Shortguide: Types of Images

headless: true
show_on_rss_feed: false
---

All Images stored on your Account are visible from the main **Images** page within the Cloud Manager. Images are divided between two tables: *Custom Images* and *Recovery Images*.

- **Custom Images:** Images that are manually created by a user on the account. These Images were either captured from an existing Linode's disk or uploaded from an image file. Custom Images do not expire and will remain on the account until they are manually deleted.

- **Recovery Images:** Temporary Images that are automatically created when a Linode is deleted (provided the Linode has been active for at least 12 hours). Recovery Images have a defined expiration date and, once expired, will automatically be deleted. The expiration timeline is typically equal to the number of hours the Linode was active, up to 7 days.