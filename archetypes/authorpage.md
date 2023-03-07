---
title: "{{ replace (path.Base .File.Dir) "-" " " | title }}"
link: ""
email: ""
description: "The Linode documentation library's profile page and submission listing for {{ replace (path.Base .File.Dir) "-" " " | title }}"
---

<!--
Use this archetype to add biographical information to an author's profile page in the /docs/authors/ directory. For example:

    hugo new -k authorpage authors/firstname-lastname/_index.md

Guides are associated to an author's profile page by setting the `authors` frontmatter in a guide's frontmatter. If an author's name is `FirstName LastName`, then the markdown file for their author page should be located at `docs/authors/firstname-lastname/_index.md`, and the `authors` frontmatter on the guide should be set to `authors: ["FirstName LastName"]`.

The link frontmatter should be a link to the author's website (or GitHub profile or something else if they prefer). The link and email frontmatter are optional.
-->

The description in the frontmatter is rendered as a meta description element on the author profile page.

A short biography of the docs author/contributor. This biography text is displayed above a listing of their published docs/content.