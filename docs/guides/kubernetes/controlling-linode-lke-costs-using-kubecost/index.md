---
slug: controlling-linode-lke-costs-using-kubecost
title: "Controlling Linode LKE Costs Using Kubecost"
description: 'Discover how to optimize Linode LKE costs with Kubecost, a powerful tool automating Kubernetes container cost calculations.'
keywords: ['Kubernetes costs', 'Kubernetes monitoring', 'Configuring Kubecost']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["John Mueller"]
published: 2023-12-23
modified_by:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

To ensure return on investment (ROI), you have to know what something costs. Most organizations calculate the costs for their [Kubernetes](https://kubernetes.io/) containers manually, but manual calculations, when many containers need to be counted, become time-consuming and error-prone. Calculations are more complex when the containers are located across the cloud because it’s possible to miss some of the containers during the calculation. Also, manual calculations don’t lend themselves well to various forms of analysis to determine where and when it’s possible to produce cost savings without losing functionality. [Kubecost](https://www.kubecost.com/) provides an automated method for calculating Kubernetes container costs in various ways and then performs analysis on those costs to determine how to save money without losing the benefits sought from Kubernetes in the first place.

## What Does Kubecost Do?

Kubecost automates the task of Kubernetes cost accounting of both internal and external expenses. It also performs usage analysis, while breaking the task down into easily understood pieces. In addition, it provides alerts that detail when predicted costs go out of scope and governance to help limit excesses that can occur with a container. The governance feature also helps predict some outages through Kubernetes monitoring so that remediation occurs on a proactive, rather than a reactive basis.

### Cost Allocation

Setting Kubernetes costs across multiple clusters using a single view or API endpoint is essential to understanding ROI and keeping costs controlled. Kubecost breaks down costs by deployment, service, and namespace label, among other concepts. For example, it’s possible to break costs down by team, individual application, product, project, department, or environment for showback or chargeback.

### Cost Monitoring

Tracking whether costs remain in line with predictions is important because doing so points out invalid assumptions about a particular setup. When working with both on-premise and external cloud services, some costs can become hidden or difficult to ascertain. In addition, cost monitoring must include both in-cluster and out-of-cluster costs, which can make calculations complex. Kubecost performs these kinds of cost monitoring in real time. When performing its analysis, Kubecost uses metrics like these:

- Time in running state
- Consumed and reserved resources
- Resource price
- Hardware usage, such as:
   - CPU
   - GPU
   - Memory
   - Storage

The metrics act as inputs for calculations that provide cost categories like these:

- Monthly cluster cost
- Deployment resource cost
- Cost efficiency

Cost monitoring can occur at many Kubernetes levels, including:

- Clusters
- Namespace
- Controller
- Deployment
- Service
- Label
- Pod
- Container

### Optimization Insights

Keeping costs within predicted ranges requires optimization. Kubecost makes dynamic optimization recommendations that focus on cost reduction without an associated sacrifice in performance. Part of this optimization process depends on the prioritization of key infrastructure and application elements.

### Alerts and Governance

The best time to deal with cost overruns is as they occur. Kubecost provides alerts and governance features that detect cost overruns before they become a problem. For example, you can receive emails detailing budget overruns and anomalous spending patterns. At the end of a reporting period, Kubecost also provides reports that track trends and efficiency across all or a set of namespaces.

### Alternatives

You may find that a Kubecost alternative meets needs like automatic scaling and support for horizontal pods or nodes. Different products offer specialized functionality that you may find essential for your particular application.

#### OpenCost

[OpenCost](https://www.opencost.io/) uses the Kubecost engine as a starting point. The two products have different focuses, making OpenCost a solution for particular needs. OpenCost monitors in-cluster and some external Kubernetes costs in real time, although it isn’t as feature-rich as Kubecost. It also isn’t as mature as Kubecost because it’s at the[ Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/) sandbox project maturity level. Both products provide continuous Kubernetes monitoring, with OpenCost focusing on in-cluster CPU, RAM, load balancers, storage, and persistent volumes.

Unlike Kubecost, OpenCost is always free, whereas there are freemium and paid versions of Kubecost with differing levels of functionality. OpenCost is also fully open-source (Apache 2.0 license) and vendor-agnostic. A task that OpenCost performs exceptionally well is writing custom Prometheus queries to gain cost insights. In addition, OpenCost provides a command line interface (CLI) that accesses cost allocation metrics in Kubernetes through the [OpenCost API](https://www.opencost.io/docs/integrations/api-examples). This level of access makes it possible to perform quick queries and automate some tasks that might require additional time to perform using Kubecost.

#### Loft Labs

[Loft Labs](https://loft.sh/) is a control platform that operates on top of existing Kubernetes clusters. Consequently, it works with individual clusters, rather than being outside the clusters and relying on a separate engine to gain a bigger picture of the environment. You don’t get the overview that both Kubecost and OpenCost provide, but Loft Labs can be easier to setup and configure because there are fewer external pieces.

One interesting Loft Labs feature is sleep mode. When working with Kubecost, you know there is a problem, but you have to do something about it. Loft Labs automatically puts idle namespaces to sleep based on the criteria you provide, so that it does more than just tell you there is a cost problem. It also deletes namespaces when those namespaces become old and unused.

Accounting is another area where Loft Labs excels because you can set quotas for each user, account, and team. It also offers enterprise-grade, multi-tenant access control, security, and fully automated tenant isolation, among other features.

#### Cast.ai

In many respects, [Cast.ai](https://cast.ai/) and Kubecost do the same things, but in different ways. Both products:

- Allocate costs based on Kubernetes concepts such as namespace, deployment, service, and workload
- Organize cost data at the microservice level
- Allow the addition of custom cost allocation tags if you prefer user-defined cost allocation tags
- Provide automatic alerts for anomalous cost trends

There are other similarities, but this list highlights the fact that both products do a good job with the basics. Differences come into play in the way they manage. For example:

- Cast.ai allows you to view and manage multi-cloud infrastructure costs in one place
- Kubecost supports multi-tenant cost monitoring
- Cast.ai emphasizes detailed CPU costs in the Savings estimator
- Kubecost connects real time in-cluster costs (such as CPU, RAM, storage, and network) and out-of-cluster spending from cloud services.

The two products also share some of the same limitations. For example, neither product offers a dedicated [FinOps resource](https://www.finops.org/resources/) or combines all cloud costs in a single place. When choosing between Cast.ai and Kubecost, consider the special features that each product provides and how these features meet your needs.

## Understanding Kubernetes Monitoring vs Cost Control

Monitoring is an essential part of discerning precisely what problems a Kubernetes configuration has. Costs and resource usage constantly fluctuate which is the reason that automation tools are essential to knowing what is happening with the setup in real time. According to [Survey Surfaces Recent Spike in Kubernetes Costs](https://cloudnativenow.com/editorial-calendar/container-kubernetes-management/survey-surfaces-recent-spike-in-kubernetes-costs/) only 38% of IT professionals can accurately predict monthly Kubernetes costs within a 10% margin of error. So, a good monitoring technique is always a required first step in keeping costs under control.

Cost control is the second step. In this case, you take what you learn through monitoring to optimize a setup to provide maximum performance at the lowest cost in time, resources, and money. Because the monitoring environment is dynamic, so is the cost control environment. It isn’t possible to optimize a configuration once and always receive the best performance. Tools can also make suggestions on where to optimize a setup. Some provide automation that puts unused application components to sleep or even deletes them when no longer needed.

Relying exclusively on tools will have a significant impact on costs. Human knowledge is also an important factor in keeping costs low. Knowing organizational direction and special events helps people maintaining the system anticipate needs that the software can’t know in advance. By planning for requirements as part of monitoring and control, you further reduce costs.

## Creating a Cost Monitoring Plan

Create a monitoring plan for your setup so that everyone interacts with Kubernetes in the same way to achieve consistent results. A monitoring plan takes the functionality of your tools, business needs, and human resources into account. Here are some factors for a monitoring plan to consider:

- Use labels and tags extensively to ensure you can break container components down to basic levels
- Create a list of metrics to monitor:
    - Active pods
    - Resources
    - Container native
    - Application-specific
- Go beyond basic CPU, memory, and similar metrics to include running processes, file access traffic, network traffic, and other details
- Capture historical data to make it possible to predict future performance based on expected conditions at the time
- Ensure that the user experience remains unaffected by monitoring and cost-control efforts

Any worthwhile plan includes some level of alerting so that an errant condition doesn’t go unnoticed. When creating a cost monitoring plan, keep these alerting principles in mind:

- Correlate alerts to keep the number of alerts at a minimum
- Consider when and who should receive alerts
- Keep non-critical alerts in-house so that employees don’t disregard a critical alert when it arrives during off-hours periods
- Include every possible useful detail with the alert so that someone can determine the cause
- Suggest one or more actions for the alert

## Installing and Configuring Kubecost

To begin the installation, use [Linode Kubernetes Engine - Get Started](/docs/products/compute/kubernetes/get-started/) to create an LKE setup to work with Kubecost. The example relies on a Linode 4 GB Plan for the server instance and also a Linode 4 GB Plan for the Cluster. Add the `export KUBECONFIG=<.yaml File Location>` entry to your `.bashrc` file to ensure `kubectl` can locate the clusters each time you sign into your server instance.

Install Helm: [How to Install Helm on Ubuntu, Mac and Windows](https://phoenixnap.com/kb/install-helm)

This product requires that you sign into the [Kubecost registration page](https://www.kubecost.com/install#show-instructions). Fill out the required information and it supplies you with a token that’s used as part of your interaction with Kubecost.

1.  Use Helm to install Kubecost using the command below:

    ```command
    helm install kubecost cost-analyzer \
    --repo https://kubecost.github.io/cost-analyzer/ \
    --namespace kubecost --create-namespace \
    --set kubecostToken="<Your Kubecost Token>"
    ```

1.  Enable port forwarding using the command below:

    ```command
    kubectl port-forward --namespace kubecost deployment/kubecost-cost-analyzer 9090
    ```

## Testing the Kubecost Setup

Enabling port forwarding means that Kubecost is available on the server at port ``9090``. However, to work with Kubecost, you must have access to a browser, which means making Kubecost accessible on your local system. Open a terminal window and use Secure Shell to create a connection between your system and the server instance.

1.  Open the SSH tunnel to the localhost through your normal connection to the server instance:

    ```command
    ssh -L 8080:localhost:9090 <User Name>@<Server IP Address>
    ```

1.  Provide the user password. This terminal window must remain open during your session, but it doesn’t actually host the session, so you don’t see any Kubecost messages in it.

1.  Perform any required startup

1.  Do not start Kubecost (it is already started in the other terminal window)

1.  Open a browser on your local machine.

1.  Type a localhost address with a special port that points to your server instance like this: `http://localhost:8080/`. Use `localhost:8080`, not the server’s IP address.

1.  Go to the site and you see a display similar to the one shown in Figure 1.

   << Insert Figure 1 Here. >>

## Conclusion

Kubernetes containers are an essential part of the [development strategy for organizations](https://www.gartner.com/en/newsroom/press-releases/2020-06-25-gartner-forecasts-strong-revenue-growth-for-global-co) of all sizes. Kubecost makes using Kubernetes more affordable in three ways: determining where and when to spend on containers, monitoring container costs, and providing alerts and other automation when costs get out of control. Other solutions are available if you have special needs. View Kubecost as a good overall solution with a strong feature set and good flexibility.
