---
author:
  name: Linode Community
  email: docs@linode.com
description: 'A secure design methodology that consists in seeding a development database with sample fake data while designing it at the same time.'
keywords: ["security", "database", "development", "production", "fixtures", "tests", "tdd"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
contributor:
    name: Jordi Bassagañas
    link: https://twitter.com/programarivm
title: 'Stop Using a Production Database for Development Purposes'
---

Whether it is because of tight deadlines, management, or simply because of budget constraints, it's not too uncommon that software development teams will end up using real production data instead of sample data for development purposes.

However if working locally with a copy of the production database your data is at risk of being sent through email, Skype, or shared on cloud-based platforms such as Slack or Discord, just to name a few.

Remember, this is not the right thing to do since it comes with a number of threats which might even propagate through your DevOps infrastructure.

This guide will show you a secure database design methodology that consists in seeding a development database with sample fake data while designing it at the same time.

Specifically it is implemented with PHP and Symfony but the important software design concepts in place can be easily transferred to other programming languages and frameworks.

## Before You Begin

- Learn the basics of test-driven development

- Install and set up a fresh copy of Symfony

- Familiarize yourself with the concept of fixtures

## Fixture Driven Development

So, the present design methodology is basically about letting our data fixtures guide the database design process in a similar way as with test-driven development (TDD).

This is how a cycle looks like:

1. Add a fixture
2. Try to load the fixtures and see if they can be loaded
3. Write some code in the entity layer
4. Load the fixtures and refactor the code
5. Repeat

Once the process is completed and the development database has been designed, you end up having precious sample data in it.

## Writing Our First Fixture

Now let's assume we are starting the database design process from scratch. A good idea may be to write the following code.

– code here
