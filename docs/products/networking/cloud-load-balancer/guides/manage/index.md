---
title: "Manage Cloud Load Balancer"
description: "Learn how to view, edit, and delete Cloud Load Balancer."
published: 2023-07-06
authors: ["Akamai"]
---
## Manage Cloud Load Balancer
- [View Cloud Load Balancers](/docs/products/networking/cloud-load-balancer/guides/manage/#view-cloud-load-balancers)
- [Create a Cloud Load Balancer](/docs/products/networking/cloud-load-balancer/guides/manage/#create-a-cloud-load-balancer)
- [Update or Delete Load Balancer Components](/docs/products/networking/cloud-load-balancer/guides/manage/#update-or-delete-load-balancer-components)
- [Delete a Cloud Load Balancer](/docs/products/networking/cloud-load-balancer/guides/manage/#delete-a-cloud-load-balancer)

### View Cloud Load Balancers

Log in to the [Cloud Manager](https://cloud.linode.com) and select Cloud Load Balancers from the left menu. If any Cloud Load Balancers exist on your account, they are listed on this page.

Each Cloud Load Balancer in the matrix is displayed alongside the following details:

- **Label:** The unique label that you assign when you create a Cloud Load Balancer.
- **Endpoints:** Provides the total number of endpoints that are healthy (`up`) and unhealthy (`down`). Endpoints are the destinations where the load balancer sends requests to. Health checks are completed on endpoints. When endpoints are able to accept requests, they are considered to be healthy and `up `.
- **Ports:** A list of the ports configured on the Cloud Load Balancer.
- **Hostname:** The Load Balancer's generated hostname.
- **Regions:** The regions where this load balancer processes requests. For Beta, regions are automatically provisioned.

### Create a Cloud Load Balancer

To create a Cloud Load Balancer, follow the [Get Started](/docs/products/networking/cloud-load-balancer/) instructions.

### Update or Delete Load Balancer Components

You can review, edit and delete any of the load balancer components using the Summary, Configurations, Routes, Service Targets, Certificates and Settings tabs. Tabs display the following information:

- **Summary:** Provides the load balancers hostname, endpoint health stats, generated id, regions where this load balancer processes requests, and port numbers.
- **Configurations:** Provides details for each port configured on the load balancer. Details include the configuration name, port number, number of routes, route health stats, and the assigned ID for the configuration. Clicking on a configuration displays the ports protocol, additional route information, and TLS certificates if the port protocol is HTTPS.
- **Routes:** Provides the route names, the number of rules per route, protocol, and the generated id. You can click the "**>**" located next to the route label to display more details including:
    - Rules and the order they are applied if applicable.
    - Number of service targets. Hover over the service target number to see the percentage of requests routed to each target.
    - Session stickiness enablement.
- **Service Targets:** A service target consists of 1 or more endpoints. This tab lists service targets' names and their ids,  endpoint health status, the service targets' protocol, the load balancing algorithm, and certificates.
- **Certificates:** This tab has two sub-tabs.
    - **TLS Certificates:** display the list of certificates that can be added to load balancer port configurations for terminating connections and decrypting requests from your clients.
    - **Service Target Certificates:** display the list of certificates that can be added to service targets and used by load balancer to validate responses from service targets to your clients.
- **Settings:** Provides the regions this load balancer processes requests. You can also delete a load balancer from this tab.

1. Log in to the [Cloud Manager](https://cloud.linode.com) and select Cloud Load Balancers from the left menu. If any Cloud Load Balancers exist on your account, they are listed on this page.

1. Click on the [Cloud Load Balancer](https://cloud.linode.com/loadbalancers/) that you want to review, edit or delete. The Cloud Load Balancer **Summary** tab is displayed.

1. Navigate to the tab containing the component you want to review,  edit, or delete.

    - For Configurations, select the down arrow "⌄" corresponding to the Configuration you want to update or delete. Complete your updates in the form and click **Save Configuration** or **Delete**.

    - For Routes, Service Targets and Certificates, select the more options **ellipsis (...)** corresponding to the route, service tatget or certificate and select **Edit** or **Delete**. Complete your updates in the form.

### Delete a Cloud Load Balancer

1. Log in to the [Cloud Manager](https://cloud.linode.com) and select Cloud Load Balancers from the left menu. If any Cloud Load Balancers exist on your account, they are listed on this page.

1. Click on the Cloud Load Balancer that you want to delete. The Cloud Load Balancer **Summary** tab is displayed.

1. Navigate to the **Settings** tab, scroll to the *Delete Load Balancer* section, and click the **Delete** button.

1. A confirmation dialog appears. Enter the Load Balancer Label and click **Delete Load Balancer** to proceed with removing the load balancer from your account.