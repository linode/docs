---
title: "Linode CLI Commands for Viewing Events"
description: "How to use the Linode CLI to view and manage account events."
published: 2020-07-22
modified: 2022-05-02
authors: ["Linode"]
---

1.  View a list of events on your account:

        linode-cli events list

1.  View details about a specific event:

        linode-cli events view $event_id

1.  Mark an event as read:

        linode-cli events mark-read $event_id
