---
title: "Known Issues"
description: "Beta Issues"
published: 2023-07-06
authors: ["Akamai"]
#eglb-743-Endpoint hostname not getting updated after cluster update
#ARB-4882-[AGLB-SQA]: API allows creating service-target without endpoint
---

## Issues
- [A Service Target Requires At Least One Endpoint](/docs/products/networking/cloud-load-balancer/guides/issues/#a-service-target-requires-at-least-one-endpoint)
- [Editing only the Service Target Endpoint `host` Requires a Workaround for Beta](/docs/products/networking/cloud-load-balancer/guides/issues/#editing-only-the-service-target-endpoint-host-requires-a-workaround-for-beta)

### A Service Target Requires At Least One Endpoint

A service target is a collection of endpoints. Endpoints are the destinations where the load balancer sends requests to. When creating a new service target, add at least one endpoint using [APIv4](https://deploy-preview-17--roaring-gelato-12dc9e.netlify.app/docs/api/cloud-load-balancer/#service-target-create) or [Cloud Manager](/docs/products/networking/cloud-load-balancer/get-started/#create-service-targets).

If at service target was created without an endpoint, delete the service target using [APIv4](https://deploy-preview-17--roaring-gelato-12dc9e.netlify.app/docs/api/cloud-load-balancer/#service-target-delete) or [Cloud Manager](/docs/products/networking/cloud-load-balancer/guides/manage/#update-or-delete-load-balancer-components), and re-add it with an endpoint.

### Editing only the Service Target Endpoint `host` Requires a Workaround for Beta

Updating the service target endpoint `host` value using APIv4 `PUT /v4beta/aclb/{id}/service-targets/{id}` or Cloud Manager is not supported for Beta.

If you need to update the service target endpoint `host`, you can do one of the following;
- Edit the `ip` and `host` together and then edit just the `ip` back to its original value.
- Delete the service target and create a new service target with the required `host` value.