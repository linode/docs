---
slug: yaml-anchors-aliases-overrides-extensions
author:
  name: Cameron Laird
  email: claird@phaseit.net
description: 'This guide gives you examples for using YAML anchors, aliases, and overrides, which are features of the YAML language that help keep your code DRY.'
og_description: 'This guide gives you examples for using YAML anchors, aliases, and overrides, which are features of the YAML language that help keep your code DRY.'
keywords: ['YAML anchors']
tags: ['docker', 'kubernetes']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-02
image: YAML.jpg
modified_by:
  name: Linode
title: "YAML Examples for Anchors, Aliases, and Overrides"
h1_title: "YAML Anchors, Aliases, and Overrides"
enable_h1: true
contributor:
  name: Cameron Laird
external_resources:
- '[Docker Compose](https://docs.docker.com/compose/)'
- '[Quickstart-Compose and WordPress](https://docs.docker.com/compose/wordpress/)'

---

YAML anchors, aliases, overrides, and extensions help reduce the repetition of data in your YAML files. These features of YAML are discussed in this guide to take you beyond the basics covered in the [A YAML Syntax Reference](/docs/guides/yaml-reference/) guide.

## YAML Anchors and Aliases

Suppose you use [Docker Compose](https://docs.docker.com/compose/) to specify a particular WordPress customization. Docker itself offers an [example specification](https://docs.docker.com/compose/wordpress/) that, as of this writing, begins:

{{< file >}}
version: "3.9"

services:
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
...
{{< /file >}}

Docker’s documentation illustrates how to use a `docker-compose.yml` to create a basic blog backed by a data store with a volume mounted on `/var/lib/mysql`.

In a professional context, though, you don't only need a backing data store for the WordPress instance, but multiple WordPress instances. It is common to define a production instance that supports end-users in their real-life WordPress activities, along with a test instance to verify the correctness of functionality before exposing end-users to it. One way to implement multiple definitions is simply to write them naively.

{{< file >}}
version: "3.9"

services:
  production-db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
  MYSQL_ROOT_PASSWORD: somewordpress
  MYSQL_DATABASE: wordpress
  MYSQL_USER: wordpress
  MYSQL_PASSWORD: wordpress
      ...
  test-db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
    MYSQL_ROOT_PASSWORD: somewordpress
    MYSQL_DATABASE: wordpress
    MYSQL_USER: wordpress
    MYSQL_PASSWORD: wordpress
{{< /file >}}

An *anchor* (`&`) and *alias* (`*`) abbreviate these definitions down to:

{{< file >}}
version: "3.9"

services:
  production-db: &database-definition
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
  MYSQL_ROOT_PASSWORD: somewordpress
  MYSQL_DATABASE: wordpress
  MYSQL_USER: wordpress
  MYSQL_PASSWORD: wordpress
      ...
  test-db: *database-definition
{{< /file >}}

In this example, the `&database-definition` is an *anchor* to which the `*database-definition` *alias* refers.

The alias abbreviates YAML content, compacting it down so it takes up fewer bytes in a file system. More importantly, *human* readers have less to take in and thus focus more effectively on the essentials of the definition. Moreover, these anchor-alias combinations can ease maintenance chores. Suppose `MYSQL_USER` needs to be updated from `wordpress` to `special_wordpress_account`: while naive YAML requires editing the `MYSQL_USER` in each of its uses--presumably the same as the number of databases in all environments--the rewritten YAML only needs an update to its one anchor. Each alias then properly receives the updated `special_wordpress_account` *automatically*. Fewer distinct values to copy-and-paste inevitably mean fewer opportunities for inadvertent error.

Aliases often shrink complex YAML specifications down to half or even a smaller fraction of their original sizes.

## YAML Overrides

Sometimes segments of a YAML file share only part of their contents. The WordPress example might configure databases that are identical except that each instance has a distinct password. YAML’s *overrides* allow for this situation.

{{< file >}}
version: "3.9"

services:
  production-db: &database-definition
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment: &environment-definition
  MYSQL_ROOT_PASSWORD: somewordpress
  MYSQL_DATABASE: wordpress
  MYSQL_USER: wordpress
  MYSQL_PASSWORD: production-password
      ...
  test-db:
    <<: *database-definition
    environment:
        <<: *environment-definition
  MYSQL_PASSWORD: test-password
  ...
{{</ file >}}

The `<<` is a special *override* syntax that effectively allows for an alias whose individual values can be updated.

## Economy of Expression

Anchors, aliases, and overrides provide brevity for your YAML configuration files. Any YAML written with these constructs can be expanded into a valid form that helps you keep your configuration files DRY. These features of the YAML language help keep your files compact and make them easier to understand and maintain.
