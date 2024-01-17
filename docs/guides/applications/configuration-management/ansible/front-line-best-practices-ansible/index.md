---
slug: front-line-best-practices-ansible
title: "Best Practices for Ansible"
title_meta: "Top 12 Ansible Best Practices"
description: 'Discover Ansible best practices and proven techniques for project organization, playbook content, documentation, testing, validation, and security.'
keywords: ['ansible best practices','ansible documentation','ansible testing','ansible playbook']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Cameron Laird"]
published: 2023-11-28
modified_by:
  name: Linode
---

[Ansible](/docs/guides/applications/configuration-management/ansible/) is an important open source automation tool and platform. It is used for configuration management, application deployment, task automation, and [orchestration](https://www.databricks.com/glossary/orchestration) of complex workflows.

Ansible figures prominently in DevOps. It allows Information Technology (IT) administrators and developers to automate repetitive tasks and streamline the management and deployment of infrastructure, applications, and services. Ansible’s business and strategic features include:

- [**Agentless Architecture**](https://www.ansible.com/hubfs/pdfs/Benefits-of-Agentless-WhitePaper.pdf): Does not require installation of agents.
- [**Idempotency**](https://docs.ansible.com/ansible/latest/reference_appendices/glossary.html#term-Idempotency): Gives safe and reliable results from unreliable components.
- [**Portability**](https://www.ansible.com/blog/ansible-and-containers-why-and-how#:~:text=*%20Ansible%20playbooks%20are%20portable.&text=If%20you%20build%20a%20container%20with%20an%20Ansible%20playbook%2C%20you,choice%2C%20or%20on%20bare%20metal.): Operates consistently across different operating systems and into various flavors of cloud environments.

Data centers effectively require Ansible, or one of its competitors. Businesses operating at the data center scale have requirements for reliability, economy, scalability, and flexibility. These are exactly the advantages of Ansible. It makes data center operations more cost-effective, predictable, resilient, and responsive.

## Ansible Fundamentals

The following is a list of key terms that cover the [fundamental components and concepts associated with Ansible](https://docs.ansible.com/ansible/latest/getting_started/basic_concepts.html):

-   **Target State**: Ansible is a [**declarative**](http://www.it-automation.com/2021/06/05/is-ansible-declarative-or-imperative.html) language. It details target states for computing systems and how those states are achieved. It then takes responsibility for achievement of the target states. This creates a kind of [teamwork](https://www.linkedin.com/pulse/delegating-goals-versus-tasks-karl-maier) between users and Ansible, where users take the lead in telling what they want, and Ansible works out the details of how it's done. This is different from older styles of [system administration](/docs/guides/linux-system-administration-basics/) and system administration tools.

    An important aspect of target state is how it applies. Many practitioners have strong experience with Ansible's use in provisioning and deployment, but don't realize it also applies in other automations. While it is good at "spinning up" a new server or updating an existing one, it's also handy for many more uses that aid overall system health. For example, daily checks of certificate expirations, or hourly confirmations that file systems have at least 10% free storage. It only takes a few lines of Ansible to implement these and many other target states and verifications.

-   **Playbooks**: Ansible [playbooks](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html) are written in [YAML](/docs/guides/yaml-reference/) and define a sequence of steps, or "plays", to execute on a target system or group of systems. Playbooks express desired states for systems and how those states are achieved. Ansible then takes responsibility for achieving those states. That dynamic is Ansible’s fundamental accomplishment.

-   **Modules**: Ansible [modules](https://docs.ansible.com/ansible/latest/dev_guide/developing_modules_general.html) are the building blocks of playbooks. Modules are discrete units of code that enact specific tasks such as package management, file configuration, or launching services. One of Ansible's great assets is its enormous collection of built–in modules and the ability for users to author custom ones.

-   **Tasks**: Ansible [tasks](https://docs.ansible.com/ansible/latest/getting_started/basic_concepts.html#tasks) are individual units within a playbook that call modules to perform specific actions. Tasks execute sequentially on target systems to achieve desired states.

-   **Roles**: Ansible [roles](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html) organize and package related playbooks, variables, tasks, and other components into reusable and shareable units. Roles' modularization of configuration promotes reusability across playbooks and projects.

-   **Inventory**: The [inventory](https://docs.ansible.com/ansible/latest/getting_started/basic_concepts.html#inventory) file defines the hosts and systems under consideration. Inventory can be either static or dynamic. It typically includes such information as hostnames, IP addresses, groups, and variables.

-   **Variables**: Ansible allows use of [variables](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html) that make playbooks more dynamic and flexible. They also feature different scopes, including global, playbook, role, and task.

-   **Facts**: Ansible gathers information about target systems using modules called [facts](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_vars_facts.html). Examples of gathered information include hardware, operating systems, and internet addresses. Playbooks inform the decisions they make with such facts.

-   **Templates**: Ansible [templates](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/template_module.html) are files structured in [Jinja2 syntax](/docs/guides/introduction-to-jinja-templates-for-salt/) with placeholders. Playbook execution dynamically populates the placeholders with variables. Templates can generate configuration files, scripts, and other Ansible artifacts.

-   **Handlers**: Various specific Ansible events trigger [handlers](https://docs.ansible.com/ansible/latest/getting_started/basic_concepts.html#handlers), typically at the conclusion of a playbook run. A common handler responsibility is to restart services after a configuration change.

-   **Ad-hoc Commands**: Being declarative, Ansible is flexible enough to embed several imperative mechanisms which streamline and simplify particular operations. Its [ad–hoc commands](https://docs.ansible.com/ansible/latest/command_guide/intro_adhoc.html) are indispensable for quick system health checks, troubleshooting, and other isolated remedies.

## Ansible Best Practices

While best practices certainly improve run-time efficiency, they also improve organizational efficiency. They can promote teamwork, output reliable results with minimum effort, help onboarding, ease maintenance burdens, and even protect from legal liability.

As Abelson and Sussman wrote: "[Programs must be written for people to read, and only incidentally for machines to execute.](https://medium.com/javarevisited/epic-programmers-quotes-explained-aed933257b93#:~:text=The%20quote%20implies%20that%20writing,involves%20continuous%20updates%20and%20maintenance.)" In much the same way, the best Ansible playbooks are an ongoing asset for their *human* readers.

Recognize that Ansible playbooks and related specifications are source, or "[code](https://www.cloudbees.com/blog/configuration-as-code-everything-need-know#)". Like all other sources, they deserve a [version-controlled source code control system](/docs/guides/introduction-to-version-control/) to call home. Think of this as "best practice zero", which precedes the following top 12 best practices for using Ansible.

### File System Layout

Organize projects with a consistent file system layout. Separate playbooks from roles, in directories respectively named `playbooks` and `roles`. The result should look similar to the following example project directory structure:

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

Spelling of file names and other formal aspects of an Ansible project are purely cosmetic and aren't considered actual Ansible programming. All the more reason to standardize on common practices others have identified and save your team's attention for deeper matters. After all, IT is a collaborative undertaking.

The point of this best practice is less about the virtue or aesthetics of a directory spelled `playbooks` rather than `playbook`, and more about the benefits of a [common language for the whole team](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3575067/#:~:text=A%20shared%2C%20common%20language%20provides%20a%20focus%20for%20all%20stakeholders.&text=It%20is%20most%20effective%20when,help%20to%20decrease%20project%20costs.). Using these best practices, teams can shift their attention from [worrying about particular details](https://americanexpress.io/yak-shaving/) to thinking more about how to work together toward larger business goals.

### Ansible Configuration

Use `ansible.cfg` for global configuration. Define sensible defaults for the inventory and roles paths. Use syntactic comments to document the reasons behind the choices made.

Explicitly set `forks` to control parallelism. Configure `pipelining` to limit `ssh` operations and increase performance. Configure `ControlPath` to share `ssh` connections. Adjust `timeout` and `poll_interval` to manage timeout of long-running tasks.

Control verbosity of logging based on actual experience and measurements of the specific playbooks in use. Periodically review the configuration to ensure it is consistent with established policies and goals.

### Playbook Design and Structure

Use Roles to modularize playbooks. Refer to [Ansible Galaxy](https://galaxy.ansible.com/ui/) for inspiration regarding useful definitions of Roles. Define your own choices in `requirements.yml`.

Consider segmenting large and complex playbooks into multiple smaller ones, each with a focus on a specific component or functionality. The resulting bundle of playbooks is likely easier to manage than the original complete one. An alternative way to structure complex playbooks is with [tags](https://galaxy.ansible.com/ui/). Tags effectively disable or enable pieces of a playbook. For instance, it's sometimes beneficial to keep a playbook whole, while controlling distinct pieces within it.

Separate inventory, configuration, and variable information into environment-specific files.

Maintain a Vault for *all* sensitive or private information. This includes passwords, certificates, tokens, keys, or any other customer details Ansible needs to know. Consider the alternative of storing sensitive data in a file, and referring to it, rather than coding it into Ansible.

Periodically review and refactor the playbook structure to keep it fresh and well-aligned with project requirements.

### Variable Names

Choose descriptive variable names. For instance, `gateway` rather than `gw`. However, also choose brief names over complicated ones.

Use [snake case](https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/#:~:text=Snake%20case%20separates%20each%20word,letters%20need%20to%20be%20lowercase.&text=Snake%20case%20is%20used%20for%20creating%20variable%20and%20method%20names.), for example, `database_account` rather than `DatabaseAccount` or other variations.

Document the purpose, usage, and range of variables with comments. Examples of particularly useful comments focused on specific variables include:
- `# hostname is case-insensitive, so that 'server1' and 'SERVER1' behave identically`
- `# corpus_account must be qualified: 'name@domain.com' is OK, but 'name' is not`

Group variables hierarchically. This is likely to result in such names as `database_account`, `database_host`, `database_password`, and `database_priority`. Environment-specific variables deserve meaningful prefixes such as `prod_database_account` or `env_database_account`.

Avoid shadowing [reserved keywords](https://docs.ansible.com/ansible/latest/reference_appendices/playbooks_keywords.html). Rather than `item` or `serial`, choose `server_item` or `hardware_serial_number`.

Don't be afraid to make exceptions to these rules when appropriate. For example, abbreviate `gateway` down to `gw` if a particular team has a  well-understood, longstanding practice of doing so in other systems and languages beyond Ansible.

Last but not least, always be consistent across playbooks and projects.

### Error Handling in Ansible

Error handling is supremely important. Most of the work accomplished by computing systems is done when things work as intended. However, a good playbook has more lines devoted to responding to failures than for what happens when everything goes right.

"Handling" encompasses everything from ignoring the error, to logging it, notifying a monitoring system, or launching a diagnostic process. The most important best practice in error-handling is explicit use of `ignore_errors` and `register`. When a particular condition is judged to be non-fatal, mark it with `ignore_errors`, allowing the playbook to continue. Also mark it with an appropriate comment such as `# Error here is non-fatal because ...`. Also handle error conditions conditionally with `when: task_result.failed`. A different error-handling mechanism, `block-rescue-always`, is applicable for resource management and cleaning up problematic states. Take advantage of Ansible's `assert` module. Don’t assume that a particular service is available before starting to use it. Instead, `assert` its availability beforehand.

Learn Ansible's built-in logging, auditing, debugging, and exit code functionality to handle errors most effectively.

### Ansible Logging

Ansible logging has several roles. Learn the essentials by practicing with the log and debug modules. In its simplest form, log can deliver a message during playbook execution through a specification such as:

```
- name: Log a single diagnostic
  log:
    msg: "This is the diagnostic logged at this point"
```

Next, learn how to configure `callback_whitelist`, `log_level`, and `log_path` in `ansible.cfg`. Experiment with `log_level` to learn how the categories `CRITICAL`, `DEBUG`, `ERROR`, `INFO`, and `WARNING` apply in your projects. Set them to meet the needs of specific applications and your own preferences. Some administrators like to log everything that might be useful, but only enable `CRITICAL` for daily operations. Others only log diagnostics that are guaranteed to demand response. Either approach, or various alternatives between them, work. It's more important is to be consistent about which style you choose.

[Ansible's callback plugins](https://docs.ansible.com/ansible/latest/plugins/callback.html) naturally apply to many logging situations. For example, when you want to customize output formats, escalate notifications to email, profile performance metrics during an incident, or otherwise meet logging requirements.

Timestamp your log entries. Rotate logs to ensure efficient use of storage. Archive logs for auditing and compliance. Treat logs as sensitive information that deserve security controls, so configure access only to users with a need to view them.

With logging basics in place, consider more sophisticated log management through such aggregators as Elasticsearch, Logstash, Kibana, and Splunk. These help scale your ability to analyze logs.

Decide on a review policy. No well-founded best practice applies universally in regard to how and when to review logs. It's best to be realistic. If decision-makers believe that logs need to be read, allocate time to do so as an explicit policy, and track the results.

### Inline Comments

Comments are important and rewarding, although widely under-used in real-world practice. Each time you write a line of Ansible, ask yourself: what would help me understand the intent of this if I return here six months from now? Ideally, your playbooks should be so simple and idiomatic that their source speaks for itself. The next best thing to that ideal situation is source that's so well-commented that it answers any questions that naturally arise. Always write good comments, and insist that your whole team does, too.

### READMEs

Write a `README` for each directory and subdirectory in a project. It could be something as brief as:

```file {title="README.md"}
# Variables for the Staging environment

This specification details the Ansible variables which
are specific to actions in the staging environment.
```

Other `README` files can be several hundred words about the architecture and design decisions that a particular directory represents. Three natural best practices applicable to `README` files are:

-   Create exactly one `README.md` for each directory in a project.
-   Format the contents as well-formed [Markdown](https://www.markdownguide.org/getting-started/).
-   Provide high-level "philosophy" and motivation in the README. Leave technical details to source comments. Minimize repetition of the source comments, and instead **refer** to them in `README` files.

### Playbook Documentation

Prepare a top-level `README.md` which explains the purpose and use of the playbook. Provide the reader with at least one way to test the playbook. In other words, explain how to do something and what the result should be. Include examples, use cases, and references to relevant documents. Provide a link to your policy on the subject. If some aspect of the playbook is hard to explain, it's even more important to explain it. Use dataflow, state, or entity diagrams, as appropriate.

List Ansible versions that the playbook is compatible with. Include license and copyright notices in the `README.md`. Review the `README.md` periodically to make sure it aligns with the current state of the playbook. The result is a playbook that is easier to use and maintain correctly, particularly for those not involved in its original creation.

### Use of Vaults for Sensitive Data

Encrypt sensitive data, including variables, configurations, task contents, and whole files. However, do *not* encrypt information that is not sensitive. Store sensitive variables in `vars/secrets.yml` and encrypt the file. Reference the encrypted variables in the playbooks as necessary.

Control access to the Vault with such controls as file systems permissions. Only allow authorized users to decrypt sensitive data, and only with a proper decryption key. Choose strong passwords and encryption keys. Write explicit policies for rotation schedules and practice rotation to ensure that it's correctly executed.

Passwords must *not* appear in playbooks. Use a credential manager, or at least prompt for necessary passwords to be supplied at runtime.

### Secure Communication

Ansible projects generally communicate by way of `ssh`, and `ssh` best practices include the following:

-   Choose strong keys
-   Choose strong ciphers
-   Secure configurations
-   Choose key–based authentication rather than password authentication
-   Distribute keys securely
-   Minimize agent forwarding
-   Define appropriate policies, including a limit on login failures and idle timeouts.
-   Consider configuring access-control, restrictions on authentication methods, and lists of allowed users through `sshd_config`.

Configure Ansible to use SSL for communication between control nodes and managed hosts. Control access to the control node with firewalling and network restrictions. Patch Ansible components regularly and enable two-factor authentication (2FA).

If your project uses [Ansible APIs](https://docs.ansible.com/ansible/latest/api/index.html), configure communication for TLS. If your project uses [Ansible Tower](https://docs.ansible.com/ansible/latest/reference_appendices/tower.html) or [AWX](https://www.ansible.com/products/awx-project/faq), configure HTTPS.

### Privilege Escalation and Sudo

Learn Ansible's [`become` feature](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_privilege_escalation.html), designed expressly for secure privilege escalation. Apply `become` precisely, for a single play at a time, rather than for an entire playbook. Use `become_user` as an additional way to increase the precision of an escalation. Study `become_method` to understand the applicability of different escalation methods. For instance, while `sudo` is the default, a PowerBroker-equipped environment needs to favor `pbrun`. Review escalation uses periodically.

## Conclusion

The biggest payoffs in regard to Ansible best practices come from routine, non-technical habits. This includes maintaining playbook version control and accurate documentation, separating secrets from public information, roles from actions, and targets from implementations. Update your Ansible instance through a well-defined [software development lifecycle (SDLC)](https://stackify.com/what-is-sdlc/), and use tools such as [Ansible Lint](https://ansible.readthedocs.io/projects/lint/) appropriately. Make sure every line of code exists for a reason.

While these habits are not technically deep, with them in place across your teams, Ansible's best practices do pay off.