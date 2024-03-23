---
title: "Known Issues"
description: "Beta Issues"
published: 2023-07-06
authors: ["Akamai"]
---

## Issues
- [Editing only the Service Target Endpoint `host` Requires a Workaraound for Beta](/docs/products/networking/cloud-load-balancer/guides/issues/#editing-only-the-service-target-endpoint-host-requires-a-workaraound-for-beta-eglb-743--742)
- [Adding Duplicate Endpoints Raises an Error (EGLB-793)](/docs/products/networking/cloud-load-balancer/guides/issues/#adding-duplicate-endpoints-raises-an-error-eglb-793)

### Editing only the Service Target Endpoint `host` Requires a Workaraound for Beta (EGLB-743 & 742)

Updating the service target endpoint `host` value using APIv4 `PUT /v4beta/aglb/{id}/service-targets/{id}` or Cloud Manager is not supported for Beta.

If you need to update the service target endpoint `host`, you can do one of the following;
- Edit the `ip` and `host` together and then edit just the `ip` back to its original value.
- Delete the service target, and create a new service target with the required `host` value.


### Adding Duplicate Endpoints Raises an Error (EGLB-793)

Service target endpoints can be a compute instance (Linode) and port number (for example; my-linode:443) or an IP address and port number (for example; 192.0.2.0:80).

When adding endpoints to a service target, the endpoints must be unique.