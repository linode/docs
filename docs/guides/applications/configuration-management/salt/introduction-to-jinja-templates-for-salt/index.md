---
slug: introduction-to-jinja-templates-for-salt
description: 'An introduction to Jinja using Salt configuration management examples.'
keywords: ['salt','jinja','configuration management']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-29
modified: 2019-01-02
modified_by:
  name: Linode
image: IntroductiontoJinjaTemplatesforSalt.png
title: "Introduction to Jinja Templates for Salt"
external_resources:
- '[Salt Best Practices](https://docs.saltproject.io/en/latest/topics/best_practices.html#modularity-within-states)'
- '[Salt States Tutorial](https://docs.saltproject.io/en/latest/topics/tutorials/states_pt1.html)'
- '[Jinja Template Designer Documentation](http://jinja.pocoo.org/docs/2.10/templates/#import)'
aliases: ['/applications/configuration-management/introduction-to-jinja-templates-for-salt/','/applications/configuration-management/salt/introduction-to-jinja-templates-for-salt/']
tags: ["automation","salt"]
authors: ["Linode"]
---
## Introduction to Templating Languages

Jinja is a flexible templating language for Python that can be used to generate any text based format such as HTML, XML, and YAML. Templating languages like Jinja allow you to insert data into a structured format. You can also embed logic or control-flow statements into templates for greater reusability and modularity. Jinja's template engine is responsible for processing the code within the templates and generating the output to the final text based document.

Templating languages are well known within the context of creating web pages in a *Model View Controller* architecture. In this scenario the template engine processes source data, like the data found in a database, and a web template that includes a mixture of HTML and the templating language. These two pieces are then used to generate the final web page for users to consume. Templating languages, however, are not limited to web pages. Salt, a popular Python based configuration management software, supports Jinja to allow for abstraction and reuse within Salt state files and regular files.

This guide will provide an overview of the Jinja templating language used primarily within Salt. If you are not yet familiar with Salt concepts, review the [Beginner's Guide to Salt](/docs/guides/beginners-guide-to-salt/) before continuing. While you will not be creating Salt states of your own in this guide, it is also helpful to review the [Getting Started with Salt - Basic Installation and Setup](/docs/guides/getting-started-with-salt-basic-installation-and-setup/) guide.

## Jinja Basics

This section provides an introductory description of Jinja syntax and concepts along with examples of Jinja and Salt states. For an exhaustive dive into Jinja, consult the official Jinja [Template Designer Documentation](http://jinja.pocoo.org/docs/2.10/templates/).

Applications like Salt can define default behaviors for the Jinja templating engine. All examples in this guide use Salt's default Jinja environment options. These settings can be changed in the Salt master configuration file:

{{< file "/etc/salt/master" yaml >}}
# Default Jinja environment options for all templates except sls templates
#jinja_env:
#  block_start_string: '{%'
#  block_end_string: '%}'
#  variable_start_string: '{{'
#  variable_end_string: '}}'
#  comment_start_string: '{#'
#  comment_end_string: '#}'
#  line_statement_prefix:
#  line_comment_prefix:
#  trim_blocks: False
#  lstrip_blocks: False
#  newline_sequence: '\n'
#  keep_trailing_newline: False

# Jinja environment options for sls templates
#jinja_sls_env:
#  block_start_string: '{%'
#  block_end_string: '%}'
#  variable_start_string: '{{'
#  variable_end_string: '}}'
#  comment_start_string: '{#'
#  comment_end_string: '#}'
#  line_statement_prefix:
#  line_comment_prefix:
#  trim_blocks: False
#  lstrip_blocks: False
{{</ file >}}

{{< note respectIndent=false >}}
Before including Jinja in your Salt states, be sure to review the [Salt and Jinja Best Practices](#salt-and-jinja-best-practices) section of this guide to ensure that you are creating maintainable and readable Salt states. More advanced Salt tools and concepts can be used to improve the modularity and reusability of some of the Jinja and Salt state examples used throughout this guide.
{{< /note >}}

### Delimiters
Templating language delimiters are used to denote the boundary between the templating language and another type of data format like HTML or YAML. Jinja uses the following delimiters:

| Delimiter Syntax | Usage       |
| ---------------- |-------------|
| `{% ... %}`      | Control structures |
| `{{ ... }}`      | Evaluated expressions that will print to the template output |
| `{# ... #}`      | Comments that will be ignored by the template engine |
| `#  ... ##`      | Line statements |

In this example Salt state file, you can differentiate the Jinja syntax from the YAML because of the `{% ... %}` delimiters surrounding the if/else conditionals:

{{< file "/srv/salt/webserver/init.sls" yaml >}}
{% if grains['group'] == 'admin' %}
    America/Denver:
        timezone.system:
{% else %}
    Europe/Minsk:
        timezone.system:
{% endif %}
{{</ file >}}

See the [control structures](#control-structures) section for more information on conditionals.

### Template Variables

Template variables are available via a template's context dictionary. A template's context dictionary is created automatically during the different stages of a template's evaluation. These variables can be accessed using dot notation:

    {{ foo.bar }}

  Or they can be accessed by subscript syntax:

    {{ foo['bar'] }}

  Salt provides several context variables that are available by default to any Salt state file or file template:

  - **Salt**: The `salt` variable provides a powerful set of [Salt library functions](https://docs.saltproject.io/en/latest/ref/modules/all/index.html#all-salt-modules).

        {{ salt['pw_user.list_groups']('jdoe') }}

    You can run `salt '*' sys.doc` from the Salt master to view a list of all available functions.

  - **Opts**: The `opts` variable is a dictionary that provides access to the content of a Salt minion's [configuration file](https://docs.saltproject.io/en/latest/ref/internals/opts.html):

        {{ opts['log_file'] }}

    The location for a minion's configuration file is `/etc/salt/minion`.

  - **Pillar**: The `pillar` variable is a dictionary used to access Salt's [pillar data](https://docs.saltproject.io/en/latest/topics/tutorials/pillar.html):

        {{ pillar['my_key'] }}

    Although you can access pillar keys and values directly, it is recommended that you use Salt's `pillar.get` variable library function, because it allows you to define a default value. This is useful when a value does not exist in the pillar:

        {{ salt['pillar.get']('my_key', 'default_value') }}

  - **Grains**: The `grains` variable is a dictionary and provides access to minions' [grains data](https://docs.saltproject.io/en/latest/topics/grains/):

        {{ grains['shell'] }}

    You can also use Salt's `grains.get` variable library function to access grain data:

        {{ salt['grains.get']('shell') }}

  - **Saltenv**: You can define multiple salt environments for minions in a Salt master's top file, such as `base`, `prod`, `dev` and `test`. The `saltenv` variable provides a way to access the current Salt environment within a Salt state file. This variable is only available within Salt state files.

        {{ saltenv }}

  - **SLS**: With the `sls` variable you can obtain the reference value for the current state file (e.g. `apache`, `webserver`, etc). This is the same value used in a top file to map minions to state files or via the `include` option in state files:

        {{ sls }}

  - **Slspath**: This variable provides the path to the current state file:

        {{ slspath }}

### Variable Assignments

You can assign a value to a variable by using the `set` tag along with the following delimiter and syntax:

    {% set var_name = myvalue %}

  Follow [Python naming conventions](https://www.python.org/dev/peps/pep-0008/?#naming-conventions) when creating variable names. If the variable is assigned at the top level of a template, the assignment is exported and available to be imported by other templates.

  Any value generated by a Salt [template variable](#template-variables) library function can be assigned to a new variable.

    {% set username = salt['user.info']('username') %}

### Filters

Filters can be applied to any template variable via a `|` character. Filters are chainable and accept optional arguments within parentheses. When chaining filters, the output of one filter becomes the input of the following filter.

    {{ '/etc/salt/' | list_files | join('\n') }}

These chained filters will return a recursive list of all the files in the `/etc/salt/` directory. Each list item will be joined with a new line.

  {{< output >}}
  /etc/salt/master
  /etc/salt/proxy
  /etc/salt/minion
  /etc/salt/pillar/top.sls
  /etc/salt/pillar/device1.sls
  {{</ output >}}

  For a complete list of all built in Jinja filters, refer to the [Jinja Template Design documentation](http://jinja.pocoo.org/docs/2.10/templates/#builtin-filters). Salt's official documentation includes a [list of custom Jinja filters](https://docs.saltproject.io/en/latest/topics/jinja/index.html#filters).

### Macros

Macros are small, reusable templates that help you to minimize repetition when creating states. Define macros within Jinja templates to represent frequently used constructs and then reuse the macros in state files.

{{< file "/srv/salt/mysql/db_macro.sls" jinja >}}
{% macro mysql_privs(user, grant=select, database, host=localhost) %}
{{ user }}_exampledb:
   mysql_grants.present:
    - grant: {{ grant }}
    - database: {{ database }}
    - user: {{user}}
    - host: {{ host }}
{% endmacro %}
{{</ file >}}

{{< file "db_privs.sls" yaml >}}
{% import "/srv/salt/mysql/db_macro.sls" as db -%}

db.mysql_privs('jane','exampledb.*','select,insert,update')
{{</ file >}}

The `mysql_privs()` macro is defined in the `db_macro.sls` file. The template is then imported to the `db` variable in the `db_privs.sls` state file and is used to create a MySQL `grants` state for a specific user.

Refer to the [Imports and Includes](#imports-and-includes) section for more information on importing templates and variables.

### Imports and Includes

**Imports**

Importing in Jinja is similar to importing in Python. You can import an entire template, a specific state, or a macro defined within a file.

    {% import '/srv/salt/users.sls' as users %}

This example will import the state file `users.sls` into the variable `users`. All states and macros defined within the template will be available using dot notation.

You can also import a specific state or macro from a file.

    {% from '/srv/salt/user.sls' import mysql_privs as grants %}

This import targets the macro `mysql_privs` defined within the `user.sls` state file and is made available to the current template with the `grants` variable.

**Includes**

The `{% include %}` tag renders the output of another template into the position where the include tag is declared. When using the `{% include %}` tag the context of the included template is passed to the invoking template.

{{< file "/srv/salt/webserver/webserver_users.sls" >}}
include:
  - groups

{% include 'users.sls' %}
{{</ file >}}

{{< note respectIndent=false >}}
A file referenced by the Jinja `include` tag needs to be specified by its [absolute path from Salt's `file_roots` setting](https://github.com/saltstack/salt/issues/15863#issuecomment-57823633); using a relative path from the current state file will generate an error. To include a file in the same directory as the current state file:

    {% include slspath + "/users.sls" %}

Also note that [Salt has its own native `include` declaration](https://docs.saltproject.io/en/latest/ref/states/include.html) which is independent of Jinja's `include`.
{{< /note >}}

**Import Context Behavior**

By default, an import will not include the context of the imported template, because imports are cached. This can be overridden by adding `with context` to your import statements.

    {% from '/srv/salt/user.sls' import mysql_privs with context %}

Similarly, if you would like to remove the context from an `{% include %}`, add `without context`:

    {% include 'users.sls' without context %}

### Whitespace Control

Jinja provides several mechanisms for whitespace control of its rendered output. By default, Jinja strips single trailing new lines and leaves anything else unchanged, e.g. tabs, spaces, and multiple new lines. You can customize how Salt's Jinja template engine handles whitespace in the [Salt master configuration file](#jinja-basics). Some of the available environment options for whitespace control are:

- `trim_blocks`: When set to `True`, the first newline after a template tag is removed automatically. This is set to `False` by default in Salt.
- `lstrip_blocks`: When set to `True`, Jinja strips tabs and spaces from the beginning of a line to the start of a block. If other characters are present before the start of the block, nothing will be stripped. This is set to `False` by default in Salt.
- `keep_trailing_newline`: When set to `True`, Jinja will keep single trailing newlines. This is set to `False` by default in Salt.

To avoid running into YAML syntax errors, ensure that you take Jinja's whitespace rendering behavior into consideration when inserting templating markup into Salt states. Remember, Jinja must produce valid YAML. When using control structures or macros, it may be necessary to strip whitespace from the template block to appropriately render valid YAML.

To preserve the whitespace of contents within template blocks, you can set both the `trim_blocks` and `lstrip_block` options to `True` in the master configuration file. You can also manually enable and disable the white space environment options within each template block. A `-` character will set the behavior of `trim_blocks` and `lstrip_blocks` to `False` and a `+` character will set these options to `True` for the block:

For example, to strip the whitespace after the beginning of the control structure include a `-` character before the closing `%}`:

    {% for item in [1,2,3,4,5] -%}
        {{ item }}
    {% endfor %}

This will output the numbers `12345` without any leading whitespace. Without the `-` character, the output would preserve the spacing defined within the block.

### Control Structures

Jinja provides control structures common to many programming languages such as loops, conditionals, macros, and blocks. The use of control structures within Salt states allow for fine-grained control of state execution flow.

**For Loops**

For loops allow you to iterate through a list of items and execute the same code or configuration for each item in the list. Loops provide a way to reduce repetition within Salt states.

{{< file "/srv/salt/users.sls" yaml >}}
{% set groups = ['sudo','wheel', 'admins'] %}
include:
  - groups

jane:
  user.present:
    - fullname: Jane Doe
    - shell: /bin/zsh
    - createhome: True
    - home: /home/jane
    - uid: 4001
    - groups:
    {%- for group in groups %}
      - {{ group }}
    {%- endfor -%}
{{</ file >}}

The previous for loop will assign the user `jane` to all the groups in the `groups` list set at the top of the `users.sls` file.

**Conditionals**

A conditional expression evaluates to either `True` or `False` and controls the flow of a program based on the result of the evaluated boolean expression. Jinja's conditional expressions are prefixed with `if`/`elif`/`else` and placed within the `{% ... %}` delimiter.

{{< file "/srv/salt/users.sls" yaml >}}
{% set users = ['anna','juan','genaro','mirza'] %}
{% set admin_users = ['genaro','mirza'] %}
{% set admin_groups = ['sudo','wheel', 'admins'] %}
{% set org_groups = ['games', 'webserver'] %}


include:
  - groups

{% for user in users %}
{{ user }}:
  user.present:
    - shell: /bin/zsh
    - createhome: True
    - home: /home/{{ user }}
    - groups:
{% if user in admin_users %}
    {%- for admin_group in admin_groups %}
      - {{ admin_group }}
    {%- endfor -%}
{% else %}
    {%- for org_group in org_groups %}
      - {{ org_group }}
    {% endfor %}
{%- endif -%}
{% endfor %}
{{</ file >}}

In this example the presence of a user within the `admin_users` list determines which groups are set for that user in the state. Refer to the [Salt Best Practices](#salt-and-jinja-best-practices) section for more information on using conditionals and control flow statements within state files.

### Template Inheritance

With template inheritance you can define a base template that can be reused by child templates. The child template can override blocks designated by the base template.

Use the `{% block block_name %}` tag with a block name to define an area of a base template that can be overridden.

{{< file "/srv/salt/users.jinja" >}}
{% block user %}jane{% endblock %}:
  user.present:
    - fullname: {% block fullname %}{% endblock %}
    - shell: /bin/zsh
    - createhome: True
    - home: /home/{% block home_dir %}
    - uid: 4000
    - groups:
      - sudo
{{</ file >}}

This example creates a base user state template. Any value containing a `{% block %}` tag can be overridden by a child template with its own value.

To use a base template within a child template, use the `{% extends "base.sls"%}` tag with the location of the base template file.

{{< file "/srv/salt/webserver_users.sls" yaml >}}
{% extends "/srv/salt/users.jinja" %}

{% block fullname %}{{ salt['pillar.get']('jane:fullname', '') }}{% endblock %}
{% block home_dir %}{{ salt['pillar.get']('jane:home_dir', 'jane') }}{% endblock %}
{{</ file >}}

The `webserver_users.sls` state file extends the `users.jinja` template and defines values for the `fullname` and `home_dir` blocks. The values are generated using the [`salt` context variable](#template-variables) and pillar data. The rest of the state will be rendered as the parent `user.jinja` template has defined it.

## Salt and Jinja Best Practices

If Jinja is overused, its power and versatility can create unmaintainable Salt state files that are difficult to read. Here are some best practices to ensure that you are using Jinja effectively:

- Limit how much Jinja you use within state files. It is best to separate the data from the state that will use the data. This allows you to update your data without having to alter your states.
- Do not overuse conditionals and looping within state files. Overuse will make it difficult to read, understand and maintain your states.
- Use dictionaries of variables and directly serialize them into YAML, instead of trying to create valid YAML within a template. You can include your logic within the dictionary and retrieve the necessary variable within your states.

     The `{% load_yaml %}` tag will deserialize strings and variables passed to it.

         {% load_yaml as example_yaml %}
             user: jane
             firstname: Jane
             lastname: Doe
         {% endload %}

         {{ example_yaml.user }}:
            user.present:
              - fullname: {{ example_yaml.firstname }} {{ example_yaml.lastname }}
              - shell: /bin/zsh
              - createhome: True
              - home: /home/{{ example_yaml.user }}
              - uid: 4001
              - groups:
                - games

     Use `{% import_yaml %}` to import external files of data and make the data available as a Jinja variable.

         {% import_yaml "users.yml" as users %}

- Use Salt [Pillars](https://docs.saltproject.io/en/latest/topics/tutorials/pillar.html) to store general or sensitive data as variables. Access these variables inside state files and template files.
