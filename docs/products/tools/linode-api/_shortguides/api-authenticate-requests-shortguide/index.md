---
# Shortguide: shows you how to authenticate requests with the Linode API.

headless: true
show_on_rss_feed: false
---

This token must be sent as a header on all requests to authenticated endpoints. The header should use the format:

    Authorization: Bearer <token-string>

Store the token as a temporary shell variable to simplify repeated requests. Replace `<token-string>` in this example:

    TOKEN=<token-string>
