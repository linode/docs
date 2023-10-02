---
slug: monitoring-configure-email-alerts-shortguide
description: 'Shortguide that describes how to configure monitoring email alerts in Cloud Manager.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-08-08
modified_by:
  name: Heather Zoppetti
published: 2020-07-21
title: Configuring Linode Cloud Manager Email Alerts
keywords: ["monitoring"]
headless: true
show_on_rss_feed: false
aliases: ['/uptime/monitoring-configure-email-alerts-shortguide/']
authors: ["Linode"]
---

The Cloud Manager allow you to configure *email alerts* that automatically notify you through email if certain performance thresholds are reached, including:

- CPU Usage
- Disk IO Rate
- Incoming Traffic
- Outbound Traffic
- Transfer Quota

When setting the threshold for CPU usage, the maximum value can be calculated by multiplying the total number of available CPUs by 100. For example, this means that if an instance has 4 CPUs, the maximum threshold is 400%. Therefore, if you wish to be notified of relative CPU usage greater than 80% over 2 hours, you would set the **Usage Threshold** value to 320%.

{{< note >}}
The default CPU usage alert threshold for all new instances is 90% relative to the number of available cores.
{{< /note >}}

To turn on and customize the alerts:

1.  Log in to the [Cloud Manager](https://cloud.linode.com).
1.  Click the **Linodes** link in the sidebar.
1.  Select your Compute Instance. The instance's details page appears.
1.  Click the **Settings** tab. The *Notification Thresholds* panel appears, as shown below.

    ![Configuring Linode Cloud Manager Email Alerts](notification-thresholds.png "Configuring Linode Cloud Manager Email Alerts")

1.  To enable an email alert, toggle the appropriate switch.
1.  To configure the threshold for an alert, set a value in the threshold text field.
1.  Click **Save** to save the email alert thresholds.

You have successfully configured email alerts in the Cloud Manager.

{{< note >}}
If you receive an email threshold alert from the Cloud Manager, do not be alarmed. It does not mean there is anything necessarily wrong with your instance.

For example, the instance may be operating above its normal threshold if it is performing intensive tasks such as compiling software (CPU, IO, or both) or if a major website just linked to your blog (increased traffic).
{{< /note >}}
