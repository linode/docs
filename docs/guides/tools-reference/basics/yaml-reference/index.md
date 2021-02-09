---
slug: yaml-reference
author:
  name: Cameron Laird
  email: claird@phaseit.net
description: 'This reference guide brings you up to speed on YAML data types and structure design, with plenty of examples.'
og_description: 'Need to get started with #YAML? @phaseit's reference guide brings you up to speed on YAML data types and structure design, with plenty of examples.'
keywords: ['yaml reference']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-09
modified_by:
  name: Linode
title: "Yaml Reference"
h1_title: "A YAML syntax reference."
contributor:
  name: Cameron Laird
  link: https://twitter.com/Phaseit
---

# A YAML syntax reference

YAML is a data interchange format commonly used in configuration files. YAML often is conceived as a lightweight alternative to XML; [Ansible](https://www.linode.com/docs/guides/applications/configuration-management/ansible/?q=ansible) playbooks and [Docker](https://www.linode.com/docs/guides/what-is-docker/) Compose configurations, for instance, are both written in YAML. YAML 1.2 is a superset of JSON, and is extensible through definition of custom datatypes. At last count, GitHub included several scores of millions of YAML sources in its public repositories, a testimony to YAML&#39;s ubiquity.

This reference guide serves as an introduction to YAML, and uses examples to clarify the language&#39;s characteristics.

As an introduction, consider a simple YAML file:

```
# myconfig.yaml: configuration source for myapp.
include_dirs: [library, object]
maximum_size: 8
show_password: False
```

This code communicates to `myapp` that the application includes two directories, `library` and `object`, in whatever myapp does; that 8 is as big as something gets; and that passwords should be hidden. Many applications depend on configurations of this sort to control how the software operates, and YAML is a good vehicle for setting configuration. [Bandit](https://pypi.org/project/bandit/), for instance, is a popular tool for security scans of Python applications, and Bandit&#39;s configuration is expressed in YAML.

## How YAML is used

YAML works across operating systems, virtual environments, and data platforms.

It is used most often to control how systems operate. For instance, [Kubernetes](https://www.linode.com/docs/guides/kubernetes) configures much of its action through YAML files, as do dozens of other common IT tools.

But YAML also can fill other roles, such as data interchange. You might use YAML as a data format for transmission of an invoice, for recording the instantaneous state of a long-lasting game, or for communication between subsystems in complex physical machinery.

### Three basic rules

While YAML is powerful, you can get started with only a few basics, which suffice for most common uses. It&#39;s perfectly fine to focus on a handful of rules that address the situations _you_ need, and leave the other 200-plus grammatical rules to specialists.

Newcomers do well, in fact, to focus on just three punctuation rules:

- indentation
- colons
- dashes

YAML expresses data in hierarchical relationships through indentation, itself always written as a fixed number of blank characters. The introductory myconfig example above had no indentation; `maximum_size` and `show_password` presumably apply throughout `myconfig`.

However, this example uses indentation:

```
---
active_life:
  first_use: 17 November 1983
  scheduled
```

As a result, `first_use` and `scheduled_termination` are part of `active_life`.

Colons separate keys and their values. At a formal level, YAML specifies that an arbitrary number of spaces can follow a colon. It&#39;s conventional to use a single space after a colon. For example:

```
first_use: 17 November 1983
 ---
```

Avoid a bare colon, like this:

```
first_use:17 November 1983
 ---
```

Well-behaved YAML parsers accept both these variants. However, a few YAML parsers require one or the other style. You might as well get in the habit of using the accepted style.

In any case, all of these examples of colon punctuation equally express that &quot;17 November 1983&quot; is the value associated with the key `first_use`.

Dashes provide an alternative syntax for lists. For instance:

```
---
[library, object]
```

The same list can be written as:

```
---
- library
- object
```

More examples of indentation, colons, and dashes appear below.

## YAML structure

YAML syntax is like several other languages and data formats, including CSV, INI, JSON, and XML. It is more-or-less human readable; admits hierarchical organization; and is platform agnostic. INI, YAML, and XML also support comments.

**Human-readable**: The myconfig.yaml example shown at the top of this guide has English and near-English words, rather than opaque binary codes. These words might also be written in French, Russian, Japanese, or any other language Unicode represents.

**Hierarchy**: YAML expresses hierarchical relationship using outline indentation, one of the three most fundamental syntactic rules introduced above. Consider this example:

```
# event
date: 14 October 2020
contact:
  first_name: Jane
  last_name: Smith
```

`Jane` and `Smith` here both belong to `contact`. YAML permits arbitrary nesting of this sort, "arbitrary" in the sense that nesting can be both deeper and wider.

**Comments**: The octothorpe `#` begins a comment:

```
# The next line has both a value *and* a comment.
precision_threshold: 0.93  # Comment in only part of a line.
```

**Comprehensive expressivity**: YAML is &quot;smarter&quot; than such formats as CSV and XML, which only manage strings, such as &quot;this is a string&quot; or &quot;a year like 2020 is string interpreted as a time value&quot;. YAML, in contrast, builds in recognition of types commonly used in configuration and data interchange: strings of human-readable characters; numbers; booleans; lists; and associative arrays.

The `include_dirs` example above illustrates the difference. `include_dirs` above received a list value, made up of the two strings library and object. The value of contact is itself an associative array, or dictionary, which keys `Jane` to `first_name` and `Smith` to `last_name`. A format such as CSV has no standard way to communicate such relationships.

## YAML datatypes basics

At a formal level, YAML has three datatypes:

- scalar
- list or sequence
- associative array or dictionary or mapping

### Scalar

A scalar might be numeric, textual, temporal, logical (true or false) or a special null value, often interpreted as `absent` or `unknown`.

You can style YAML in several different ways, such as using either spaces or tabs to indent. There are other variations, all of which are legal. YAML recognizes multiple quoting styles; several rules control case sensitivity; nesting can be named or anonymous; and YAML has accumulated a collection of even more obscure variations.

Rather than attempt to learn every alternative, beginners should start with a single style.

For an example of these variations, consider quoting. Because YAML encompasses JSON, this text is valid JSON and therefore is valid YAML.

`"Author": "Alex Brown"`

However, YAML allows the same content to be written in other ways. Among them:

```
---
Author: Alex Brown
```

and

```
---
Author: ‘Alex Brown’
```

In YAML terms, the scalar string `Alex Brow` is identical, even though its punctuation or quoting varies slightly.

Other examples of YAML scalars include:

```
---
numeric: 1456.8
logical: true
temporal: 2020-12-03 04:48:16.10
special: null
```

### List

One format to express YAML&#39;s lists delimits with `[...]` symbols, that is, square brackets. The initial example above, `include_dirs`, used a list as value.

YAML&#39;s nesting is flexible. List values can embed other lists. Indentation and bracketing can both appear in YAML source. Thus, both of these code blocks represent identical YAML values:

```
---
people: [{name: Terry Williams, qualities: [happy, chef, short]},
         {name: Joe Chung, qualities: [helpful, nocturnal]}]
```

and

```
---
people:
  -
    name: "Terry Williams"
    qualities:
      - happy
      - chef
      - short
  -
    name: "Joe Chung"
    qualities:
      - helpful
      - nocturnal
```

### Associative arrays

YAML supports what Perl and other languages call &quot;associative arrays,&quot; or the &quot;dictionaries&quot; of [Python](https://www.linode.com/docs/guides/development/python/), Lua, and other languages. The key-value presentation of all the examples above is in fact a dictionary; for the key `Author`, for instance, the value is `Alex Brown`.

Associative arrays gain much of their power in combination with other datatypes. For example, a value might itself be a list, and a list&#39;s values might be another dictionary.

## Comparing YAML with other data formats

To understand YAML clearly, it&#39;s helpful to compare it to other formats you might know better. Such comparisons simultaneously illuminate each formats&#39; advantages and disadvantages, and how to make best use of each one.

### YAML vs JSON

The JavaScript object notation (JSON) is an open standard file format. It is commonly used with browser configuration or communication, for instance as web browser bookmarks.

JSON content _is_ YAML content. YAML is a superset of JSON. However, YAML&#39;s syntax is more relaxed.

- It encompasses unquoted string keys, which JSON doesn&#39;t allow. YAML permits single quotes, rather than the double quotes JSON requires for strings.
- YAML has comments, which JSON lacks.
- YAML has a special syntax for definition of custom datatypes, so you can extend YAML beyond its base definition.
- YAML also goes beyond JSON in its support for anchors, aliases, directives, and merge keys, all of which are outside the scope of this reference guide.

### YAML vs XML

Pragmatic usage of YAML and XML is so similar that several applications support both. Syntactically, YAML and XML are rather far apart.

In general, XML is more verbose, but it also is easier to use when expressing content, especially content that resembles documents. YAML is more succinct. Here is an example of how each might express the same data, starting with XML:

```
<?xml version=”1.0”?>
<catalogue>
  <book>
    <author>Homer</author>
    <title>Illiad</title>
    <genre>epic poem</genre>
  </book>
  <book>
    <author>William Gilbert</author>
    <title>On the Magnet and Magnetic Bodies ...</title>
    <genre>natural philosophy</genre>
  </book>
</catalogue>
```

And then the YAML equivalent:

```
---
catalogue:
  -
    author: Homer
    genre: "epic poem"
    title: Illiad
  -
    author: "William Gilbert"
    genre: "natural philosophy"
    title: "On the Magnet and Magnetic Bodies …"
```

## Using specialized YAML syntax

YAML 1.2 defines a wealth of special-purpose syntax, most of which isn&#39;t necessary for introductory use of YAML.

It is important to recognize, though, how to &quot;escape&quot; or quote a few special characters. Colons, quotes, commas, and other punctuation are all part of YAML&#39;s syntax, so they frequently require special attention. For instance, when single-quoting, double-quotes appear without the need for escaping, but single quotes must be doubled:

```
---
text: 'This is a string with special characters:  '',".'
```

With double quotes, a double quote is backslash-escaped, but a single quote appears unmodified. Therefore, an alternative expression of the same content is:

```
---
text: "This is a string with special characters:  ',\"."
```

To dive deeper into syntax, [the official repository for the YAML 1.2 specification](https://github.com/yaml/yaml-spec) is publicly maintained on GitHub, as is [the grammar for YAML 1.2](https://github.com/yaml/yaml-grammar).

The full YAML 1.2 specification is rather involved. It has 211 grammatical rules and a four-part specification, with even more detail planned for upcoming versions 1.5 and 2.0. Few people know all of YAML, so don&#39;t feel as though you need to become a scholar. It&#39;s possible to use YAML to good effect with only a little practice using the most common parts of its syntax, to which you were just introduced.

[Wikipedia&#39;s entry on YAML](https://en.wikipedia.org/wiki/YAML) is well-maintained, and deserves attention along with the official references mentioned above. [A brief YAML reference](https://camel.readthedocs.io/en/latest/yamlref.html) is also readable.

Plenty of tools help YAML newcomers. Among them are several automatic YAML validators, including the fee-free [YAML Lint](https://yamlvalidator.com/). Other tools likely to interest a newcomer to YAML are:

- converters between other formats and YAML
- YAML prettifiers
- alternative validators

These and more are all available through [Online YAML tools](https://onlineyamltools.com/).

## The YAML challenges

Precisely because YAML can do so much, it also surprises practitioners occasionally. Even mildly-experienced YAML users are sometimes frustrated by the contrast between what looks like a simple YAML expression, and its actual YAML meaning.

YAML 1.2 is so complex that only specialists understand all its rules. In fact, it&#39;s so complex that some rules have been interpreted inconsistently. Several widely-used libraries disagree, for instance, on whether certain complex documents are well-formed YAML. [Yaml-sucks](https://github.com/cblp/yaml-sucks) compiles examples of apparent ambiguities in YAML interpretation. However, don&#39;t let these blemishes dissuade you from learning YAML. These esoteric exceptions rarely occur in simple uses.

### Scalar interpretation

Several of YAML&#39;s complexities arise in interpretation of basic values. For example these two examples do not represent the same content. Compare:

```
---
item: false
```

with:

```
---
item: "false"
```

The value in the first example is the logical false (also spelled False, off, NO, and other ways), while the value in the second is the string &quot;false&quot;.

Learn YAML&#39;s basic datatypes. Doing so minimizes surprises as YAML aggressively maps content to types other than strings.

### Truncation

One failure mode common in working with YAML is that a maintainer inadvertently deletes a segment of a YAML source—the bottom five lines, for instance. YAML&#39;s syntax is so flexible that the resulting source might remain syntactically valid. This is a contrast with XML, for example, where deletion of a line usually results in mismatched tags, and thus invalid XML – which at least is easier to troubleshoot.

YAML&#39;s flexibility and concision are strengths, rather than liabilities. A maintainer might do well to shift authoring style, particularly when compared to XML.

### Tabs

YAML allows tabs in content, of course, but not to express indentation. This surprises many experienced coders new to YAML.

### Three dashes

The examples above all begin with three dashes: `---`. This is a convention related to more advanced YAML topics, including use of directives, and are not strictly required. Nearly all modern YAML parsers happily interpret content even without an initial three-dash line. Inclusion of the dashes is common, though, and the default for most valid syntaxes.

## A few minutes&#39; practice make YAML available to you

YAML&#39;s employment is widespread. Millions of applications transact YAML in one form or another. A YAML beginner should need only a few minutes&#39; practice to begin to update and even create useful YAML source.
