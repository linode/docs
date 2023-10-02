---
slug: yaml-reference
description: 'This guide provides you with a brief introduction to the YAML programming language and gives you an understanding of the basics so you can work with YAML files.'
keywords: ['yaml reference']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-09
image: YAMLSyntaxRef.png
modified_by:
  name: Linode
title: "A YAML Syntax reference."
title_meta: "A YAML Syntax Reference"
tags: ["automation"]
external_resources:
- '[A brief YAML reference](https://camel.readthedocs.io/en/latest/yamlref.html)'
authors: ["Cameron Laird"]
---

YAML is a data interchange language commonly used in configuration files. It is used with configuration management tools like [Ansible](/docs/guides/applications/configuration-management/ansible/) and container orchestration tools, like [Kubernetes](/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/). YAML 1.2 is a superset of JSON, and is extensible with custom data types. Since YAML is very popular with automated builds and [continuous delivery](/docs/guides/introduction-ci-cd/), you can find YAML files used through many public GitHub repositories. This reference guide serves as an introduction to YAML, and provides examples to clarify the language's characteristics.

Consider the example snippet from a Kubernetes YAML file:

{{< file "my-apache-pod.yaml">}}
apiVersion: v1
kind: Pod
metadata:
 name: apache-pod
 labels:
   app: web
{{</ file >}}

This YAML file defines the version of the API in use, the kind of Kubernetes resource you'd like to define, and metadata about the resource. You don't have to be familiar with Kubernetes to read through the file's configurations and still have a general understanding about the purpose of each setting. YAML's human-readability is considered one of its advantages as compared to formats like XML or JSON.

## Getting Started with YAML

YAML works across operating systems, virtual environments, and data platforms. It is used most often to control how systems operate. For instance, you can configure [GitHub Actions](/docs/guides/kubernetes/) using YAML. The metadata you define in a GitHub Actions YAML file identifies the inputs and outputs needed to complete tasks in your GitHub repository.

You can also use YAML for data interchange. You might use YAML as a data format for transmission of an invoice, for recording the instantaneous state of a long-lasting game, or for communication between subsystems in complex physical machinery.

### Three Basic Rules

You can get started using YAML with a few basic rules. To begin, focus on the following three areas:

- indentation
- colons
- dashes

#### Indentation

YAML expresses data in hierarchical relationships through indentation. A fixed number of blank characters are used for an indentation. Take a look at the following example GitHub Actions YAML file:

{{< file "test.yaml">}}
...
jobs:
  blueberry:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
...
{{</ file >}}

The indention used in the example file shows that `runs-on`, and `steps` are part of the same *block*. This is a syntactic signal that both are a part of the same *scope*. By convention, two spaces are commonly used when indentation is required. Tabs should not be used for indentation.

#### Colons

Colons separate keys and their values. At a formal level, YAML specifies that an arbitrary number of spaces can follow a colon. However, by convention, a single space should be used after a colon. For example:


{{< file "test.yaml">}}
...
    runs-on: ubuntu-latest
...
{{</ file >}}

#### Dashes

Dashes (`-`) are used to denote a list. The following example is taken from [Linode's API v4](https://github.com/linode/linode-api-docs/), which uses the [OpenAPI 3 specification](https://github.com/OAI/OpenAPI-Specification).

{{< file "openapi.yaml" >}}
...
requestBody:
description: Information about the OAuth Client to create.
content:
    application/json:
    schema:
        required:
        - label
        - redirect_uri
...
{{</ file >}}

The `required` list specifies an object's required properties. In the example, these required properties are `label` and `redirect_uri`. The next sections include more examples of indentation, colons, and dashes.

## YAML Basic Data Types

YAML has three basic data types:

- scalars
- lists or sequences
- associative arrays or dictionaries

### Scalars

A scalar can be a numeric value, a string of text, or a boolean value like `true` or `false`. You can also express a `null` value, which is interpreted as `absent` or `unknown`.

{{< file "openapi.yaml" >}}
...
properties:
  address:
    type: string
    format: ip
    description: "The IP address."
    example: 97.107.143.141
...
{{</ file >}}

The example YAML uses several scalar values for the `address` property. Notice that the `description` property uses quotes around the string, while the `format` property does not. Using single `' '` or double `" "` quotes allow you to include special reserved YAML characters within your strings without encountering parsing errors.

### Lists

To define a list in YAML, each list value is denoted by an opening dash `-`, a space, and the value. No other values should be placed on the same line.

{{< file "openapi.yaml" >}}
...
status:
  type: string
  enum:
  - disabled
  - pending
  - ok
  - problem
...
{{</ file >}}

This example snippet defines the possible values for the `status` property using a list under the `enum` key. You can also nest your lists, as needed. For example:

{{<  file "openapi.yaml" >}}
security:
  - personalAccessToken: []
  - oauth:
    - account:read_only
{{</ >}}

### Dictionaries

YAML supports *associative arrays* or *dictionaries*. The key-value presentation of all the examples above is in fact a dictionary; for the key `description`, for instance, the value is `"The IP address."`.

{{< file "openapi.yaml" >}}
...
properties:
  address:
    type: string
    format: ip
    description: "The IP address."
    example: 97.107.143.141
...
{{</ file >}}

Dictionaries gain much of their power in combination with other data types. For example, a value might itself be a list, and a list's values might be another dictionary.

## Comparing YAML with other data formats

To understand YAML clearly, it's helpful to compare it to other formats you might know better. The comparisons in the next sections also serve to highlight each formats advantages and disadvantages. This can help you make the best use of each one.

### YAML vs JSON

The JavaScript object notation (JSON) is an open standard file format. It is commonly used with browser configuration or communication.

JSON content *is* YAML content. YAML is a superset of JSON. However, YAML's syntax is more relaxed.

- You can use unquoted string keys with YAML, which JSON does not allow. YAML permits single quotes, rather than the double quotes JSON requires for strings.
- You can include comments in your YAML files. JSON does not support comments.
- YAML has a special syntax for definition of custom data types. This means you can extend YAML beyond its base definition.
- YAML also goes beyond JSON in its support for anchors, aliases, directives, and merge keys.

### YAML vs XML

You can use YAML and XML to express the same data. For this reason, several applications support both languages. However, syntactically, YAML and XML are very different.

In general, XML is more verbose, but it also is easier to use when expressing content that resembles documents. YAML is more succinct. Below is an example of how each might express the same data:

{{< file "catalogue.xml">}}
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
{{</ file >}}

{{< file "catalogue.yaml">}}
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
{{</ file >}}

### Double and Single Quotes

Colons, quotes, commas, and other punctuation are all part of YAML's syntax. When using them in string values, special attention is required.

- When using a string value, you don't need to use quotes, but you can use quotes to force a numerical value to be interpreted as a string.
- Use quotes to ensure special characters are not parsed.
- Use double quotes when you want to parse escape codes, like `\n`. If single quotes are used, escape codes are note parsed.

## Diving Deeper

To dive deeper into YAML's syntax, [the official repository for the YAML 1.2 specification](https://github.com/yaml/yaml-spec) is publicly maintained on GitHub, as is [the grammar for YAML 1.2](https://github.com/yaml/yaml-grammar).

The full YAML 1.2 specification is rather involved. It has 211 grammatical rules and a four-part specification, with even more detail planned for upcoming versions 1.5 and 2.0. It's possible to use YAML with an understanding of its key foundational pieces, some of which have been covered in this guide.

### YAML Tools

Plenty of tools help YAML newcomers. Among them are several automatic YAML linters, including [YAML Lint](https://www.yamllint.com/). Other tools likely to interest a newcomer to YAML are:

- Converters between other formats and YAML. For example, VSCode provides a [YAML to JSON extension](https://marketplace.visualstudio.com/items?itemName=ahebrank.yaml2json).
- YAML prettifiers. The [VSCode Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) is one popular option.

You can find more tools to help you work with YAML using the [Online YAML tools](https://onlineyamltools.com/) reference.