---
title: "Linode CLI Commands for Support Tickets"
description: "How to use the Linode CLI to submit and manage support tickets."
published: 2020-07-22
modified: 2022-05-02
authors: ["Linode"]
---

1.  List your Support Tickets:

        linode-cli tickets list

1.  Open a new Ticket:

        linode-cli tickets create --description "Detailed description of the issue" --summary "Summary or quick title for the Ticket"

    If your issue concerns a particular Linode, Volume, Domain, or NodeBalancer, pass the ID with `--domain_id`, `--linode-id`, `--volume_id`, etc.

1.  List replies for a Ticket:

        linode-cli tickets replies $ticket_id

1.  Reply to a Ticket:

        linode-cli tickets reply $ticket_id --description "The content of your reply"
