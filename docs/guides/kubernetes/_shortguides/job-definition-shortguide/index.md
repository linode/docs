---
slug: job-definition-shortguide
title: Job Definition
description: 'Shortguide that displays the definition for Job.'
authors: ["Linode"]
contributors: ["Linode"]
published: 2019-07-12
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/kubernetes-shortguide-definitions/job-definition-shortguide/']
---

### Job

A [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) is a Controller which manages Pods created for a single or a set of tasks. This is handy if you need to create a Pod that performs a single function, or calculates a value. The deletion of the Job will delete the Pod.
