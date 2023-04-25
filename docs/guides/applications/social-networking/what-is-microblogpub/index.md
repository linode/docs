---
slug: what-is-microblogpub
title: "What Is Microblog.pub?"
description: 'Self-hosted Microblog.pub offers lightweight, secure, and privacy-aware microblogging with Federated social media on the ActivityPub platform.'
keywords: ['microblog.pub','mastodon alternatives','federated social media','activitypub platform','self-hosted microblogging',;lightweight micrblogging','indie web citizenry']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Martin Heller"]
published: 2023-04-24
modified_by:
  name: Linode
---

[Microblog.pub](https://microblog.pub/) is a self-hosted social media server application/microblog that leverages the federated social media model and is powered by the ActivityPub platform. The Microblog.pub server can be installed by compiling a Docker instance from its github source or by performing a Python 3.10 developer installation. Microblog.pub uses a SQLite3 database as content storage and relies on ActivityPub as its communications federation engine.

The W3C standard ActivityPub platform enables an active user to link Microblog.pub server content to another federated social media network of their choice. It is commonly used to connect with other users/followers in the social media Fediverse.

Servers in the Fediverse are interconnected. Microblog.pub allows for the rapid deployment of an ActivityHub protocol-compliant social media microblogging server instance. While it requires moderate skills to deploy, maintaining Microblog.pub is relatively easy compared to platforms such as Mastodon.

Microblog.pub supports many common social media textual and rich-content transactions supported by the Fediverse, and can be linked and removed from other servers at will. It also supports typical social media features such as likes, mentions, emojis, and other broad media formats found in the Fediverse.

## Why Is It Important and to Whom?

Microblog.pub provides social media users and content managers with a server application foundation that can be rapidly deployed. Users can create new content or import/export to other ActivityPub-based platforms, such as Mastodon, which is Microblog.pub’s main competitor.

Individuals and organizations within the Fediverse support the concept of *Indie Web Citizenry*, where social media is independent of organizational or corporate social media silos. Microblog.pub is poised to provide lightweight yet highly featured individual microblogging.

It features composition tools for microblogging using the Markdown language, user authentication, and highly customizable content templates. Users can customize their content using Cascading Style Sheets (CSS). User authentication support using [IndieAuth](https://www.w3.org/TR/indieauth/) adds proxy authentication based on OAUTH2 concepts to prevent social media stream fraud and poisoning.

Content generated in Microblog.pub or imported through other Fediverse platforms is disbursed through other servers according to access control lists and the act of following other users, or being followed within the Fediverse. Other Fediverse destinations can be access-controlled through administrative configuration settings in the Microblog.pub UI.

Microblog.pub instances and content can be migrated or redeployed to other hardware or service providers as desired. Social media follower account blocks, muting, and other admittance controls are available. Microblog.pub hosts media, links, and images, while content generation is composed in [Markdown](https://commonmark.org/). By default, Microblog.pub strips image [Exchangeable Image File Format (EXIF)](https://www.howtogeek.com/203592/what-is-exif-data-and-how-to-remove-it/) data for image metadata privacy.

## How Is Microblog.pub Different from Competitors?

The Microblog.pub server instance has a smaller footprint than Mastodon and others, while still retaining social media content support found in larger platforms. The Microblog.pub platform runs via a Docker file that is not currently in the Docker repository, or as Python code running in the Python Developer V3.10+.

In contrast, Mastodon is typically deployed as a Docker instance. Due to its more complex infrastructure, Mastodon can be more difficult to backup, migrate, and manage. Mastodon and Microblog.pub have similar user experience (UX) and user interface (UI) profiles. Both require an NGINX or equivalent web server reverse proxy. Overall, Microblog.pub is less complex to set up and maintain, while providing highly customized citizenry in the Fediverse.

Importing social media followers from Mastodon allows offloading Mastodon-siloed social media content from busy or high content flow feeds to Microblog.pub or other sources in the Fediverse.

## Conclusion

Microblog.pub focuses on self-hosted, single-user, Fediverse-connected microblogging. Setting up and configuring a Microblog.pub instance requires moderate skill. However, ongoing maintenance and diverse social media usage are comparatively simple after the initial installation. Additionally, Microblog.pub uses secure identity and privacy-aware traffic flows within the Fediverse.