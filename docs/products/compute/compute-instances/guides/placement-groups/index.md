---
title: "Work with Placement Groups"
description: "Learn how to group your compute instances to best meet your delivery model."
keywords: ["placement-group", "affinity", "compliance"]
published: TBD
modified: 2024-02-14
modified_by:
  name: Linode
authors: ["Linode"]
---

When you deploy several compute instances in an Akamai data center ("region"), they're default placed wherever there's available space. But, you may want them in a specific physical location, to best support your need. Do you want them close together, even on the same host to speed up performance? Or, do you want to disperse them across several hosts to support high availability? Placement groups let you determine this physical location to meet either of these models.

## Overview

The Placement Groups service gives you a convenient way to set up groups of your compute instances, using Cloud Manager, API operations, or our CLI. Create a new placement group in a supported region and add new or existing compute instances from that region to your group. With the new group created, we physically move your compute instances into it, based on your desired model.

## Availability

<!--

**CV: 03/2024** Availability at limited availability is only on two data centers - Washington D.C., and Miami. We'll be progressively opening up more regions as they're qualified. The request is to hide availability information in the docs, prior to actual GA.

- UI: There's a mouse-over tooltip that reveals the available regions when creating a placement group. It'll be dynamically updated as new regions are made available.
- API: The `GET /v4/regions:id` operation in the API spec lists `Placement Group` in the `capabilities` array, if PGs are supported for that region. This is the only op I see that shows support/non-support. The issue here is, you need to know the `id` for the target region, in order to run this operation. How would this work in an automated API workflow? Would you set up automation to periodically ping all regions, until it sees that `Placement Groups` is listed for a specific region? (In which case, the workflow could be manipulated to include the new region.)

Because of the issue with the API, I'm including the Availability section in the docs. It's easy enough to update the docs on a weekly release cadence as we add new supported regions. (Do we anticipate qualifying regions quicker than once a week?)

-->

The Placement Groups service is available in select regions. Currently, this includes:

- Miami, FL (us-mia)

- Washington, DC (us-iad)

{{< note >}}
Placement Groups is in limited availability. Throughout this phase, we expect to increase the number of supported regions.
{{< /note >}}

## Affinity, enforcement, and compliance

To distribute your compute instances in a placement group to meet your model, we use the industry-recognized affinity standard. You can pick from one of two types:

- **Affinity**. Your compute instances are physically close together, possibly on the same host. Set this as your preferred container to help with performance.

- **Anti-affinity**. Your compute instances are placed in separate fault domains, but they're still in the same region. Use this preferred container to better support a high-availability model.

You also select how your affinity type should be enforced, when adding more compute instances to it in the future. This determines whether or not the placement group remains accessible – is “compliant”-- after you add a new compute instance:

- **Strict (Best practice)**. You can't add more compute instances to your placement group if your preferred container lacks capacity or is unavailable. For example, let's assume you've set **Anti-affinity** as your affinity type. If you try to add a compute instance that's on the same host, or there's no capacity outside that host in the region, you get an error and can't add the compute instance. This helps you keep your placement group compliant, because you can only pick compute instances that fit your desired model.

- **Flexible**. You can add more compute instances to your placement group even if they're outside your affinity type's preferred container. However, if you add one and it violates your affinity type, the placement group becomes non-compliant. Once the necessary capacity is available in the data center, we physically move the compute instance for you, to fit your affinity type's preferred container and make it compliant again. This can work for you if you know you need to add more compute instances to your group in the future.

### Non-compliance precedence

If a placement group becomes non-compliant, *we need to fix it for you*. The precedence for this assistance depends on the group's affinity type enforcement setting:

1. **Strict**. By design, you can't make a strict placement group non-compliant when simply creating or managing it. However, if for maintenance we need to migrate or fail-over your compute instances, a strict group may become non-compliant. So, these take precedence when it comes to our assistance in bringing them back into compliance.

2. **Flexible**. We bring any flexible placement groups to compliance as quickly as possible.

{{< note >}}
Once a placement group is non-compliant, there's nothing you can do to bring it back to compliance. We are alerted when *any* placement group becomes non-compliant.
{{< /note >}}

## Create a placement group

{{< tabs >}}
{{< tab "Cloud Manager" >}}
Here's how to create a new placement group and add existing compute instances to it.

#### Before you begin

Make sure you understand how placement groups work. Have a look at [Affinity, enforcement, and compliance](#affinity-enforcement-and-compliance).

#### Creation process

1.  Navigate to the **Placement Groups** page in [Akamai Cloud Manager](http://cloud.linode.com) and click **Create Placement Groups**. The **Create Placement Group** form opens.

1.  Fill out the form with your desired settings:

    - **Label**. Give your placement group an easily recognizable name.
    - **Region**. Select the [data center](#availability) that includes the compute instances you want to add.
    - **Affinity Type**. Select the [affinity](#affinity-enforcement-and-compliance) that meets your model.
    - **Affinity Type Enforcement**. Pick how you want to [enforce](#affinity-enforcement-and-compliance) compliance for your placement group, when adding compute instances to it in the future.

{{< note >}}
- During the limited availability phase, only **Anti-affinity** is available for Affinity Type.
- Once you create your placement group, you *can't change its Affinity Type Enforcement*.
{{< /note >}}

3.  When you're ready, click **Create Placement Group**. A summary of your group is revealed.

4.  Select the **Linodes (0)** tab.

1.  Click **Assign Linode to Placement Group**. The Assign Linodes form opens.

1.  The **Linodes in \<Region\>** drop-down is auto-populated with eligible compute instances in your selected Region. Pick one to add it and click **Assign Linode**.

    <div align=center>
    <img src="pg-added-linode-v1.png" width=600 />
    </div>

7. Review the **Linode limit for this placement group**, and repeat steps 5-6 to add more compute instances, as necessary.

{{< note >}}
During the limited availability phase, you’re limited to a maximum of 5 compute instances in a placement group.
{{< /note >}}

With all your compute instances added, we begin provisioning by moving them into the placement group to meet your selected Affinity Type.

{{< /tab >}}
{{< tab "Linode API" >}}
Here, we combine API operations to create a new placement group and add existing compute instances to it.

#### Before you begin

Make sure you understand how placement groups work. Have a look at [Affinity, enforcement, and compliance](#affinity-enforcement-and-compliance).

#### List regions

Run this API curl request, making sure to properly paste in or reference your [API token](/docs/products/tools/api/guides/manage-api-tokens/). Store the `id` and `label` values for the region where your target compute instances live.
```command
curl -H "Authorization: Bearer $TOKEN" \
    https://api.linode.com/v4/regions
```
{{< note >}}
During the limited availability phase, only specific [regions](#availability) support placement groups.
{{< /note >}}

#### Identify the maximum number of compute instances

Run this request, using the stored region `id`. Store the `maximum_linodes_per_pg` value. This represents the maximum number of compute instances you can add to a placement group for that region.
```command
curl -H "Authorization: Bearer $TOKEN" \
    https://api.linode.com/v4/regions/us-east
```
{{< note >}}
During limited availability, you can have a maximum of 5 compute instances in a placement group.
{{< /note >}}

#### List compute instances

Run this request, using the stored region `id` to filter the response. Identify the specific compute instances you want to include -- up to the `maximum_linodes_per_pg` value -- and store the `id` value for each.
```command
curl -H "Authorization: Bearer $TOKEN"
    -H 'X-Filter: { "region": "us-east" }'
    https://api.linode.com/v4/networking/ips
```

#### Create a new placement group

Run this request to create a new placement group. Store the `id` value that's generated for it.

- `label`. Give your placement group an easily recognizable name.
- `region`. Set this to the `label` you stored for your region.
- `affinity-type`. Set this to the [affinity](#affinity-enforcement-and-compliance) that meets your model.
- `is_strict`. Define how to [enforce](#affinity-enforcement-and-compliance) compliance for your placement group, when adding compute instances to it in the future. Set to `true`, strict enforcement is applied and `false` sets it to flexible.

{{< note >}}
- During the limited availability phase, only anti-affinity (`anti-affinity:local`) is available for `affinity-type`.
- Once you create your placement group, you *can't change* its affinity type enforcement setting (`is_strict`).
{{< /note >}}

```command
curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -X POST -d '{
      "label": "new-placement-group",
      "region": "us-iad",
      "affinity-type": "anti_affinity:local",
      "is_strict": "true"
    }' \
    https://api.linode.com/v4/placement/groups
```

#### Add compute instances to the group

In this request, populate the `linodes` array with a comma-separated data center list of stored `id` values for the compute instances. In the URL, target the new placement group using its stored `id`.

```command
curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -X POST -d '{
      "linodes": [
        123, 456, 789
      ]
    }' \
    https://api.linode.com/v4/placement/groups/12/assign
```
With all your compute instances added, we begin provisioning by moving them into the placement group to meet your selected affinity type.

#### More with the Placement Groups API

There are several other operations in the [Linode API](/docs/api/placement-groups/) that let you interact with placement groups.

{{< /tab >}}
{{< /tabs >}}

## Technical Specifications

- Placement groups support dedicated and shared compute instance plans. Plan types can be mixed in a placement group. However, specialty hardware, such as GPUs aren't supported.

- A compute instance can only exist in one placement group.

- The Affinity Type and Region you select determine the maximum number of compute instances per placement group. This quantity is reflected in Cloud Manager when reviewing your placement group. With the API, the [GET /v4/regions/\{regionid\}](/docs/api/regions/#region-view) operation contains the `maximum_linodes_per_pg` element that displays this maximum.

- Placement groups can be renamed or deleted. To delete a placement group, you need to remove all compute instances from it.

- When you remove a compute instance from a placement group, it continues to function as-is, but the placement decisions are no longer guided by the group's Affinity Type.

- Entry points to create a placement group are also available when creating a new compute instance or editing an existing one.