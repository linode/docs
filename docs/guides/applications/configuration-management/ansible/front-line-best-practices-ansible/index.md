---
slug: front-line-best-practices-ansible
title: "Top 12 Front Line Best Practices Ansible Use"
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['ansible best practices','ansible documentation','ansible testing','ansible playbook']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Cameron Laird"]
published: 2023-10-27
modified_by:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

[Ansible](/docs/guides/applications/configuration-management/ansible/) is an important open source automation tool and platform used for configuration management, application deployment, task automation, and [orchestration](https://www.databricks.com/glossary/orchestration) of complex workflows. It figures prominently in DevOps and allows IT administrators and developers to automate repetitive tasks, and streamline the management and deployment of infrastructure, applications, and services.

Ansible’s business and strategic features are:

-   [Agentless architecture](https://www.ansible.com/hubfs/pdfs/Benefits-of-Agentless-WhitePaper.pdf), which does not require installation of agents.
-   [Idempotency](https://docs.ansible.com/ansible/latest/reference_appendices/glossary.html), which gives safe and reliable results from unreliable components.
-   [Portability](https://www.ansible.com/blog/ansible-and-containers-why-and-how#:~:text=*%20Ansible%20playbooks%20are%20portable.&text=If%20you%20build%20a%20container%20with%20an%20Ansible%20playbook%2C%20you,choice%2C%20or%20on%20bare%20metal.), so that Ansible operates consistently across different operating systems and into various flavors of cloud environments.

## Ansible Fundmentals

The following sections cover the fundamental components and [concepts associated with Ansible](https://docs.ansible.com/ansible/latest/getting_started/basic_concepts.html).

### Target State

At the highest level, Ansible is a [**declarative**](http://www.it-automation.com/2021/06/05/is-ansible-declarative-or-imperative.html) language which details target states for computing systems, and how those states are achieved. It then takes responsibility for achievement of the target states. This creates a specific kind of [teamwork](https://www.linkedin.com/pulse/delegating-goals-versus-tasks-karl-maier) between users and Ansible, where users take the lead in telling what they want, and Ansible works out the details of how it's done. This is different from older styles of [system administration](/docs/guides/linux-system-administration-basics/) and system administration tools.

An important aspect of target state is how it applies. Many practitioners have strong experience with Ansible's use in provisioning and deployment. They don't realize it applies in other automations. It's true that it is good at "spinning up" a new server, or updating an existing one. However, it's also handy for many even more frequent uses that help the health of your systems such as daily checks of certificate expirations, or hourly confirmations that file systems have at least 10% storage free. It takes just a couple of lines of Ansible to implement these and many other target states and verifications.

### Playbooks

[Playbooks](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html) written in [YAML](/docs/guides/yaml-reference/) define a sequence of steps, or "plays", to execute on a target system or group of systems. Playbooks express desired states for systems, how those states are achieved, and Ansible then takes responsibility for achieving those states. That dynamic is Ansible’s fundamental accomplishment.

### Modules

Ansible [modules](https://docs.ansible.com/ansible/latest/dev_guide/developing_modules_general.html) are the building blocks of playbooks. Modules are discrete units of code that enact such specific tasks as package management, file configuration, or launching services. One of Ansible's great assets is its enormous collection of built–in modules and the opportunity users have to author custom modules.

### Tasks

[Tasks](https://docs.ansible.com/ansible/latest/getting_started/basic_concepts.html#tasks) are individual units within a playbook that call modules to perform specific actions. Tasks execute sequentially on target systems to achieve desired states.

### Roles

[Roles](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html) organize and package related playbooks, variables, tasks, and other components into reusable and shareable units. Roles' modularization of configuration promotes reusability across playbooks and projects.

### Inventory

Its [inventory](https://docs.ansible.com/ansible/latest/getting_started/basic_concepts.html#inventory) file defines the hosts and systems under consideration. Inventory can be static or dynamic and typically includes such information as hostnames, IP addresses, groups, and variables.

### Variables

Ansible allows use of [variables](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html) that make playbooks more dynamic and flexible, and have different scopes, including global, playbook, role, and task.

### Facts

Ansible gathers information about target systems using modules called "[facts](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_vars_facts.html)". Examples of gathered information include hardware measurements, operating system release, and internet address. Playbooks inform the decisions they make with such facts.

### Templates

[Templates](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/template_module.html) are files structured in [Jinja2 syntax](/docs/guides/introduction-to-jinja-templates-for-salt/) with placeholders. Playbook execution dynamically populates the placeholders with variables. In this way, templates generate configuration files, scripts, and other Ansible artifacts.

### Handlers

Various specific Ansible events trigger [handlers](https://docs.ansible.com/ansible/latest/getting_started/basic_concepts.html#handlers), typically at the conclusion of a playbook run. A common handler responsibility is to restart services after a configuration change.

### Ad-hoc Commands

Ansible's high-level character is declarative and it’s flexible enough to embed several imperative mechanisms which streamline and simplify particular operations. Its [ad–hoc commands](https://docs.ansible.com/ansible/latest/command_guide/intro_adhoc.html) are indispensable for quick system health checks, troubleshooting, and other isolated remedies.

## Ansible in the Data Center

Data centers effectively require Ansible or one of its competitors because businesses operating at the data center scale have requirements such as reliability, economy, scalability, and flexibility. These are exactly the [advantages Ansible brings](https://www.neebal.com/blog/the-advantages-and-use-cases-of-ansible). It makes data center operations less expensive, more predictable, more resilient, and more responsive.

## Best Practices are Valuable

Most best practices capture the **simplest** forms of certain operations in easily-recognized idioms that streamline work and that readers can understand. While best practices certainly often improve run-time efficiency, the most important efficiencies they improve are **organizational** ones: they promote teamwork, they give reliable results with a minimum of effort, they provide clarity to those newly-assigned to a domain, they ease maintenance burdens, and they even protect from legal liability. Abelson and Sussman wrote, long ago, that "[Programs must be written for people to read, and only incidentally for machines to execute.](https://medium.com/javarevisited/epic-programmers-quotes-explained-aed933257b93#:~:text=The%20quote%20implies%20that%20writing,involves%20continuous%20updates%20and%20maintenance.)"  In much the same way, the best Ansible playbooks are an ongoing asset for their *human* readers.

## Ansible Best Practices

Recognize that Ansible playbooks and related specifications are source, or "[code](https://www.cloudbees.com/blog/configuration-as-code-everything-need-know#)". Like all other sources, these assets deserve to have their home in an business-wide, [version-controlled source code control system](/docs/guides/introduction-to-version-control/). Think of this as the "zeroth" rule which precedes and grounds the following twelve.

### Ansible Project Organization

Spelling of file names and other formal aspects of an Ansible project aren't "real" Ansible programming: they're purely cosmetic. All the more reason for you to standardize on common practices others have identified and save *your* team's attention for deeper matters. Adopt the next three collections of best practices to make the most of their efforts.

#### 1: File System Layout

Organize projects with a consistent file system layout. Separate playbooks from roles, in directories named, respectively, "`playbooks`" and "`roles`". The result looks resembles:

```
project/
├── playbooks/
│   └── example_playbook.yml
├── roles/
│   └── example_role/
│       ├── tasks/
│       ├── handlers/
│       ├── templates/
│       └── …
│── ...
├── group_vars/
│   ├── all.yml
│   ├── production.yml
│   └── development.yml
│── ...
├── inventory/
│   ├── production_hosts
│   ├── staging_hosts
│   └── development_hosts
│── ...
├── vault/
│   ├── secret_file.yml
│   └── …
└── ...
```

#### 2: Ansible Configuration

Use `ansible.cfg` for global configuration. Define sensible defaults for inventory path and roles path. Use syntactic comments to document the reasons behind choices made.

Explicitly set `forks` to control parallelism.

Configure `pipelining` to limit `ssh` operations and increase performance. Configure `ControlPath` to share `ssh` connections.

Adjust `timeout` and `poll_interval` to manage timeout of long-running tasks.

Control verbosity of logging, based on actual experience and measurements of the specific playbooks in use.

Periodically, proactively rather than reactively, review configuration to ensure it is consistent with established policies and goals.

#### 3: Playbook Design and Structure

Use Roles to modularize playbooks. Refer to [Ansible Galaxy](https://galaxy.ansible.com/ui/) for inspiration regarding useful definitions of Roles, and define your own choices in `requirements.yml`.

Segment large and complex playbooks into multiple smaller, more coherent ones, each with a focus on a specific component or functionality. The resulting bundle of playbooks is more easily managed than the original comprehensive but complicated one.

A complementary way to structure complex playbooks is with [tags](https://galaxy.ansible.com/ui/). Tags effectively disable or enable pieces of a playbook; sometimes it's a benefit for keeping one playbook whole, without subdivision, while controlling the action of distinct pieces within the one playbook. If that matches your situation, learn about tags.

Distinguish environments: separate inventory, configuration, and variable information into environment-specific files.

Maintain a Vault for *all* sensitive or private information, including passwords, certificates, tokens, keys, and any customer details Ansible needs to know. Consider the alternative of storing sensitive data in a file, and referring to it, rather than coding it into Ansible.

Periodically review and refactor the playbook structure, to keep it fresh and well-aligned with project requirements.

### Playbook Content

#### 4: Variable Names

Choose descriptive variable names: `gateway` rather than `gw`, for instance, and choose brief names over complicated ones.

Use [snake case](https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/#:~:text=Snake%20case%20separates%20each%20word,letters%20need%20to%20be%20lowercase.&text=Snake%20case%20is%20used%20for%20creating%20variable%20and%20method%20names.): `database_account` rather than `DatabaseAccount` or other variations.

Be consistent across playbooks and projects.

Document the purpose, usage, and range of variables using comments. Examples of particularly useful comments focused on specific variables are "`# hostname is case-insensitive, so that 'server1' and 'SERVER1' behave identically`" or "`# corpus_account must be qualified: 'name@domain.com' is OK, but 'name' is not`."

Group variables hierarchically. This is likely to result in such names as `database_account`, `database_host`, `database_password`, and `database_priority`. Environment-specific variables deserve meaningful prefixes: `prod_database_account` vs `env_database_account`, for instance.

Avoid shadowing [reserved keywords](https://docs.ansible.com/ansible/latest/reference_appendices/playbooks_keywords.html). Rather than `item` or `serial`, choose `server_item` or `hardware_serial_number`.

Make exceptions to these rules as appropriate. Abbreviate `gateway` down to `gw` when a particular team has a longstanding practice in favor of the latter, one so well-understood that it's realized in other systems and languages beyond Ansible.

#### 5: Error Handling in Ansible

Error handling is supremely important. Most of the work accomplished by computing systems is along "[happy paths](https://blog.zeplin.io/what-is-the-happy-path)", when things are working as intended. A good playbook has more content automating responses when networks or storage or memory fail, than in what happens when everything is going right.

The most important best practice in error-handling, then, is explicit use of `ignore_errors` and `register`. When you judge a particular condition to be non-fatal, mark it with `ignore_errors`, and allow the playbook to continue. Mark it with an appropriate comment such as "`# Error here is non-fatal, because it will be retried next hour through …`"

Handle error conditions conditionally with "`when: task_result.failed`". "Handling" encompasses everything from ignoring the error, to logging it, to notifying a monitoring system, or launching a diagnostic process.

A different error-handling mechanism is `block-rescue-always`. `block-rescue-always` is applicable for resource management and cleaning up problematic states.

Take advantage of Ansible's `assert` module. Don’t assume that a particular service is available before starting to use it, `assert` its availability.

Learn the logging, auditing, debugging, and exit code functionality Ansible builds in to handle errors most effectively.

#### 6: Ansible Logging

Ansible logging has several roles. You can learn the essentials by practicing with the log and debug modules. In its simplest form, log can deliver a message during playbook execution through a specification such as:

```
- name: Log a single diagnostic
  log:
    msg: "This is the diagnostic logged at this point"
```

Next, learn how to configure `callback_whitelist`, `log_level`, and `log_path` in `ansible.cfg`. Experiment with `log_level` to learn how the categories `CRITICAL`, `DEBUG`, `ERROR`, `INFO`, and `WARNING` apply in your projects. Set them to meet the needs of specific applications and your own preferences. Some administrators like to log everything that might be useful, but only enable `CRITICAL`-s for daily operations. Others only log diagnostics that are guaranteed to demand response. Either approach, or various alternatives between them, work; what's important is to be consistent about which style you choose.

[Ansible's callback plugins](https://docs.ansible.com/ansible/latest/plugins/callback.html) naturally apply to many logging situations. When you want to customize output formats, escalate notifications to email, profile performance metrics during an incident, or otherwise meet logging requirements, callback plugins are the best implementation.

Timestamp your log entries.

Rotate logs to ensure efficient use of storage. Archive logs for auditing and compliance.

Treat logs as sensitive information. They deserve security controls so configure access only to users with a need to view them.

With logging basics in place, consider more sophisticated management of them through such aggregators as Elasticsearch, Logstash, Kibana, and Splunk. These help scale your ability to analyze logs.

Decide on a review policy. No well-founded best practice applies universally in regard to how and when to review logs. It's best to be realistic: if decision-makers believe that logs need to be read, allocate time to do so as an explicit policy, and track the results.

### Documentation

Accurate, thorough documentation is critical for a project’s success and continued maintenance even though no end-users are involved.

#### 7: Inline Comments

Comments are important and rewarding, although widely underused in "real-world" practice. Each time you write a line of Ansible, ask yourself, "what reminder will help me understand the intent best if I'm focused elsewhere and only return here six months from now?"  Most importantly, is that your playbooks are so simple and idiomatic that their source speaks for itself. A close second to that ideal is source that's so well-commented as to answer questions that naturally arise. Write *good* comments, and insist that your whole team does too.

#### 8: READMEs

Write a `README` for each directory and subdirectory in a project. Something as brief as:

```file {title="README.md"}
# Variables for the Staging environment

This specification details the Ansible variables which
are specific to actions in the staging environment.
```

Other `README`-s can be several hundred words about the architecture and design decisions a particular directory represents. Three natural best practices applicable to `README`-s are:

-   Create exactly one `README.md` for each directory in a project
-   Format the contents as well-formed [Markdown](https://www.markdownguide.org/getting-started/)
-   Provide high-level "philosophy" and motivation in the README. Leave technical details to source comments. Minimize repetition of the content of source comments; instead, **refer** in `README`-s to the source comments.

#### 9: Playbook Documentation

Prepare a toplevel `README.md` which explains the purpose and use of playbook. Provide the reader with at least one way to use the playbook, that is, how to *do* something with it, and what the result is.

Include examples, use cases, and references to relevant documents. Give a link to your policy write-up of the subject.

If some aspect of the playbook is hard to explain, it's particularly important to explain it. Use dataflow, state, or entity diagrams, as appropriate.

List Ansible versions that the playbook is compatible with.

Include license and copyright notices in the `README.md`.

Review the `README.md` periodically.

The result is a playbook that is easier to use and maintain correctly, particularly for those not involved in its original creation.

### Testing, Validation, and Security

Promote testing and security training for frontline workers who need it.

#### 10: Use of Vaults for Sensitive Data

Encrypt sensitive data, including variables, configurations, task contents, and whole files. Do *not* encrypt information that is not sensitive.

Store sensitive variables in `vars/secrets.yml`, and encrypt `vars/secrets.yml`. Reference the encrypted variables in the playbooks as necessary.

Control access to Vault with such controls as file systems permissions. Allow only authorized users to decrypt sensitive data, and only with a proper decryption key.

Choose strong passwords and encryption keys. Write explicit policies for rotation schedules. Practice rotation to ensure that it's correctly executed.

Passwords must *not* appear in playbooks. Use a credential manager or, at least, prompt for necessary passwords to be supplied at runtime.

#### 11: Secure Communication

Ansible projects generally communicate by way of `ssh`. Most secure communications consists in good `ssh` practice:

-   Choose strong keys
-   Choose strong ciphers
-   Secure configurations
-   Choose key–based authentication rather than password authentication
-   Distribute keys securely
-   Minimize agent forwarding
-   Define appropriate policies, including a limit on login failures and idle timeouts
-   Consider configuration through `sshd_config` of access-control, restrictions on authentication methods, and lists of allowed users.

Configure Ansible to use SSL for communication between control nodes and managed hosts. Control access to the control node with firewalling and network restrictions.

Patch Ansible components regularly.

Enable two-factor authentication (2FA).

If your project uses [Ansible APIs](https://docs.ansible.com/ansible/latest/api/index.html), configure communication for TLS.

If your project uses [Ansible Tower](https://docs.ansible.com/ansible/latest/reference_appendices/tower.html) or [AWX](https://www.ansible.com/products/awx-project/faq), configure use of HTTPS.

#### 12: Privilege Escalation and Sudo

Learn Ansible's [`become` feature](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_privilege_escalation.html), designed expressly for secure privilege escalation. Apply `become` precisely, for a single play at a time, rather than for an entire playbook. Use `become_user` as an additional way to increase the precision of an escalation. Study `become_method` to understand the applicability of different escalation methods. For instance, while `sudo` is the default, a PowerBroker-equipped environment needs to favor `pbrun`.

Review escalation uses periodically.

#### Importance of Team Level Workflows

Information Technology (IT) is a collaborative undertaking. The point of the file system best practice above, for example, is less about the virtue or aesthetics of a directory spelled `playbooks/` rather than `playbook/`, and more about the benefits of a [common language for the whole team](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3575067/#:~:text=A%20shared%2C%20common%20language%20provides%20a%20focus%20for%20all%20stakeholders.&text=It%20is%20most%20effective%20when,help%20to%20decrease%20project%20costs.). The ideal of these best practices is that individual contributors shift their attention from [fussing over particular details](https://americanexpress.io/yak-shaving/), in the direction of thinking more tactically and strategically about how to work together toward larger business goals.

## Conclusion

The biggest payoffs in regard to Ansible best practices come from routine, "non-technical" habits such as maintaining playbook version control, maintaining accurate documentation, separating secrets from public information, separating roles from actions, and targets from implementations. Update your Ansible through a well-defined software development lifecycle ([SDLC](https://stackify.com/what-is-sdlc/)), and use tools such as [Ansible Lint](https://ansible.readthedocs.io/projects/lint/) appropriately. Make sure every line of code exists for a reason.

These habits are not technically deep, but with them in place across your teams, Ansible's best practices pay off.



Edit Note: this could be a standalone text box, or delete it.~AB

### Secure, reliable, and efficient operations

You know when your teams' practices are best when:

-   It becomes desirable to update root passwords on all production machines and there is a clear process for doing so.  You know how long it takes to complete the operation.  The new passwords are securely communicated to everyone who needs them, and kept *away* from those who don’t.  Existing services automatically continue, and manual intervention is not necessary.
-   Your business is successful. If traffic doubles in the next six weeks, your systems can handle the load.  They do not require expert involvement to scale up and you can predict the level of interruptions you're likely to experience.
-   Team members can take vacations with confidence that systems will be in good shape when they return and your prospective budgets are accurate.

Comfortable answers to these questions suggest that Ansible is delivering on its promise to keep your virtual and physical data centers running securely, reliably, and efficiently.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< caution >}}
Highlight warnings that could adversely affect a user's system with the Caution style.
{{< /caution >}}

{{< file "/etc/hosts" aconf >}}
192.0.2.0/24      # Sample IP addresses
198.51.100.0/24
203.0.113.0/24
{{< /file >}}