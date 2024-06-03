---
title: Test API
noindex: true
spec: spec.yaml
_build:
  render: always
  list: never
  publishResources: false
---

A solution should allow designation of required properties in multiple, concurrent schemas.

For example, the below specification should designate the PUT /account Request Body Schema properties `test1`, `test2`, and `test3` as required, with `test3.test1` as optional.

Currently, only the `required` array from `ExampleOne` is applied, and it is applied to all Request Body Schema properties, resulting in `ExampleThree.test3.test1` designated as required as well. Ideally, each `required` arrays would apply to the relevant component's properties.
