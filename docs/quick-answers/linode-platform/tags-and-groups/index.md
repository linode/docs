---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to create tags to organize your Linode services.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-02-22
modified: 2019-02-22
modified_by:
  name: Linode
title: "Tags and Groups"
contributor:
  name: Linode
---

Linode's [Cloud Manager](https://cloud.linode.com) allows you to create tags to help organize and group your Linode resources. This guide will show you how to create tags, search by tag, and import tags from the Classic Manager.

## Tagging a Resource

Currently tags are available for Linodes, Volumes, NodeBalancers, and Domains.

### Tagging a Linode

#### Tagging a Linode at Creation

To tag a Linode at the time of its creation, first navigate to the Linode creation page. Select a tag or tags from the **Add Tags** dropdown menu, or type in a new tag and click **Create "your_tag"**:

![Select an existing tag or tags, or provide a new tag with the 'Add Tags' dropdown.](tags-new-linode.png)

Your tag will be applied when you create the Linode.

#### Tagging an Existing Linode

To tag an existing Linode, navigate to the Linode's details page. Click on the **Summary** tab. Locate the **Tags** box. Click **Add New Tag**. Select an existing tag or tags, or type in a new tag and click **Create "your_tag"**:

![Find the 'Tags' box and select an existing tag or tags, or type to add a new one.](tags-existing-linode.png)

### Tagging a Volume

#### Tagging a Volume at Creation

To tag a Volume at the time of its creation, select the dropdown menu labeled **Tags**. Select an existing tag or tags, or type in a new tag and click **Create "your_tag"**. Once you are done configuring the Volume, click **Submit**:

![Select the tag you would like to use from the 'Tags' dropdown menu, or type to create a new tag](tags-new-volume.png)

#### Tagging an Existing Volume

To tag an existing Volume, navigate to the Volumes page of the Cloud Manager. Select the ellipsis icon (three dot icon) to the right of the Volume you would like to tag and select **Edit Volume**. The **Edit volume** menu will appear. Click on the dropdown menu labeled **Tags**. Select an existing tag or tags, or type in a new tag and click **Create "your_tag"**. When you are done, click **Submit**:

![Select the tag you would like to use from the 'Tags' dropdown menu, or type to create a new tag](tags-existing-volume.png)

### Tagging a NodeBalancer

#### Tagging a NodeBalancer at Creation

To tag a NodeBalancer at the time of its creation, click the dropdown menu labeled **Tags** under the NodeBalancer Label field. Select an existing tag or tags, or type in a new tag and click **Create "your_tag"**:

![Select the tag you would like to use from the 'Tags' dropdown menu, or type to create a new tag.](tags-new-nodebalancer.png)

#### Tagging an Existing NodeBalancer

To tag an existing Linode, navigate to the NodeBalancer's details page. Click on the **Summary** tab. Locate the **Tags** box. Click **Add New Tag**. Select an existing tag or tags, or type in a new tag and click **Create "your_tag"**:

![Find the 'Tags' box and either select an existing tag, or type in a new one.](tags-existing-nodebalancer.png)

### Tagging a Domain

#### Tagging a Domain at Creation

To tag a domain at at the time of its creation, click the dropdown menu labeled **Tags**. Select an existing tag or tags, or type in a new tag and click **Create "your_tag"**:

![Select the tag you would like to use from the 'Tags' dropdown menu, or type to create a new tag.](tags-new-domain.png)

#### Tagging an Existing Domain

To tag an existing Domain, navigate to the Domains page. Click on the **DNS Records** tab. Locate the box labeled **Tags**. Click **Add New Tag**. Select an existing tag or tags, or type in a new tag and click **Create "your_tag"**:

![Find the 'Tags' box and select an existing tag or tags, or type to add a new one.](tags-existing-domain.png)

## Grouping by Tag

Linodes can be grouped by tag. To group Linodes by tag, toggle the **Group by Tag** box at the top of the Linodes page:

![To group Linodes by tag, toggle the 'Group by Tag' box at the top of the Linodes page](tags-group-linodes.png)

## Searching by Tag

You can use the search bar to search for resources by tag. To search for resources by tag, type the tag into the search bar at the top of the page and the results will be populated in a dropdown list:

![Search for resources by tag](tags-search-bar.png)

To see a more organized view of your tagged resources, hit enter on your search to be taken to the search results page:

![The search results page](tags-search-results.png)

## Importing Groups as Tags

If you have used the Display Groups feature in the Classic Manager, you can import your Display Groups to the Cloud Manager as tags. Navigate to the **Account** page in the sidebar menu, then click on the **Settings** tab. Expand the box labeled **Import Display Groups as Tags** and then click **Import Display Groups**:

{{< note >}}
Importing your Display Groups is a **one-time** operation.

If you don't have any Display Groups configured in the Classic Manager this feature will not appear in the Cloud Manager.
{{< /note >}}

![Import display groups from the Classic Manager with the 'Import Display Groups' button in Account Settings](tags-import-groups.png)