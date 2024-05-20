---
title: Tabs Shortcode Page 1
description: This is a test page used in both manual and automatic tests. Do not delete. It will not be listed anywhere.
---

Also see [Page 2](../tabs-page-2/) and  [Page 3](../tabs-page-3/).

## Tabbed content 1

{{< tabs >}}
{{< tab "Tab number 1" >}}
This is **tab 1**.
{{< /tab >}}
{{< tab "Tab number 2" >}}
This is **tab 2**.

Another line.
{{< /tab >}}
{{< /tabs >}}

## Tabbed content 2

{{< tabs >}}
{{< tab "Tab number 1" >}}
This is **tab 1**.
{{< /tab >}}
{{< tab "Tab number 2" >}}
This is **tab 2**.
{{< /tab >}}
{{< /tabs >}}

Fugiat duis qui tempor esse eiusmod laboris aliquip laboris sint reprehenderit cillum eiusmod sunt. Incididunt cillum laborum elit eiusmod tempor occaecat cillum enim ad occaecat consectetur. Ea id deserunt duis ad.

Duis voluptate et commodo non proident do aliquip. Cillum nostrud voluptate labore duis. Nisi laborum mollit ex sit ea aliquip cillum. Ad ea nisi commodo et minim commodo laboris deserunt ex. Dolore eiusmod velit dolore culpa laborum amet. Ipsum ipsum do duis laboris minim. Laborum culpa consectetur ea magna.

Cillum culpa eiusmod dolor nulla. Sunt proident deserunt adipisicing quis incididunt elit magna aute officia reprehenderit reprehenderit eu irure. Officia id qui excepteur aliqua id ipsum et ullamco Lorem.

## Tabbed content 3

{{< tabs >}}
{{< tab "Tab number 1" >}}
This is **tab 1**.
{{< /tab >}}
{{< tab "Tab number 2" >}}
This is **tab 2**.
{{< /tab >}}
{{< /tabs >}}

### Tabs issue 577

### Respect indentation of parent

1. First, add an additional worker node and, if using the Autoscale feature, increase the minimum number of nodes.

   {{< tabs >}}
   {{< tab "Cloud Manager" >}}
   Locate the node pool on the details page of your LKE cluster in the Cloud Manager. Click the corresponding **Resize Pool** button. Increase the size of the node pool by 1. For example, if you have 3 nodes in the pool, increase that value to 4. For additional instructions, see [Resize a Node Pool](/docs/products/compute/kubernetes/guides/manage-node-pools/#resize-a-node-pool).

   If you are also using the autoscale feature, increase the minimum and maximum nodes by 1. This can be done by clicking the corresponding **Autoscale Pool** button and adjusting the minimum and maximum values. For more details, see [Autoscale](/docs/products/compute/kubernetes/guides/manage-node-pools/#autoscale-automatically-resize-node-pools).

   {{< note >}}
   Test
   {{< /note >}}
   {{< /tab >}}
   {{< /tabs >}}

### Note shortcode in tab

{{< tabs >}}
{{< tab "Cloud Manager" >}}
{{< note >}}
Test
{{< /note >}}
{{< /tab >}}
{{< /tabs >}}


{{% note %}}
Test **standalone**
{{% /note %}}

## Some random text

Tempor voluptate quis reprehenderit excepteur fugiat id sit ad ipsum reprehenderit. Dolor veniam occaecat ad cillum occaecat. Minim nisi ut occaecat anim do aute proident ipsum in sunt esse deserunt labore. Eiusmod sunt aliquip aliquip consectetur. Occaecat id exercitation Lorem pariatur aute amet fugiat laborum nisi culpa. Ex fugiat eu excepteur laborum nulla quis laborum pariatur do culpa est commodo excepteur.

Et ad duis ex proident esse eu Lorem quis exercitation magna ad cupidatat cillum dolor. Est consequat dolor incididunt magna reprehenderit culpa in et mollit fugiat fugiat culpa. Proident officia sit sint elit commodo laboris eu occaecat ullamco ex irure non do. Amet in do nostrud mollit tempor est deserunt ut laboris qui anim. Sunt id occaecat est commodo reprehenderit dolore.

{{% note %}}
This is a note.
{{% /note %}}

Exercitation voluptate anim mollit elit ipsum enim non proident eu tempor quis veniam fugiat. Occaecat adipisicing aliqua occaecat consequat ullamco do est magna. Aliquip proident veniam quis consequat esse pariatur sint et laboris consectetur mollit. Velit non enim consectetur excepteur. Sunt nulla dolore incididunt id eu nulla ipsum qui sit tempor proident voluptate. Nisi eiusmod quis aliqua minim aliqua. Elit nostrud sint ut nulla et sit aute excepteur dolore irure aliqua.

Nostrud ea minim magna ipsum elit elit ipsum fugiat consequat dolore. Tempor minim proident quis quis sint laborum incididunt Lorem amet. Pariatur est irure id qui do irure ea incididunt commodo eu. Nisi non sunt consectetur nostrud dolore incididunt tempor elit consequat cillum dolore laborum dolore irure. Voluptate ullamco cillum labore commodo sit enim laboris adipisicing voluptate anim nulla. Dolore magna esse tempor aliquip Lorem eu ea in est ad tempor pariatur.


<!-- {{< tab "Ignore me." />}} Hugo has a bug that doesn't detect changes in inner shortcodes. I (bep) have fixed this in a Hugo dev branch, but until then, just keep this here while developing the shortcode templates. -->


## Tab width

{{< tabs >}}
{{< tab "Tab number 1" >}}
Foo
{{< /tab >}}
{{< tab "Tab number 2" >}}

```output
kube-proxy-gh6xg                           1/1     Running   0          49m
kube-proxy-p4fkm                           1/1     Running   0          53m
kube-proxy-pd5vb                           1/1     Running   0          51m
```
   
{{< /tab >}}
{{< /tabs >}}


