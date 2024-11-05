---
slug: dbaas-relaunch
title: "DBaaS Relaunch"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2024-11-05
keywords: ['dbaas','dedicated','migration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

## New Managed Database Services powered by Aiven

Beginning November 14, 2024, Akamai will provide a managed database service in partnership with Aiven to bring customers higher performance, reliability, and flexibility. The new service is available in 20 core compute sites across the globe for distribution and low latency.

With this new service's introduction, the resources currently available will be retired. Please study the guides below about how to create new databases, migrate existing databases to the new infrastructure, and how the pricing changes.

## New database creation
Starting November 14th, 2024, you can set up new database instances at all Aiven-powered data centers through the Linode API and in Cloud Manager. These locations might be different from where customers currently have running databases.

The list of available locations are:

**NA**
- Atlanta
- Chicago
- Dallas
- Miami
- Fremont
- Newark
- Toronto
- Washington

**EMEA**
- Frankfurt
- London
- Paris
- Amsterdam
- Stockholm

**APAC**
- Chennai
- Melbourne
- Mumbai
- Singapore
- Sydney
- Osaka
- Tokyo

## Migration of existing databases
We highly recommend migrating data from the old database infrastructure as soon as possible because, from November 14th, 2024, the old database infrastructure won’t receive updates anymore.

All customers will be offered two start dates for migration, with the ability to select the final migration schedule window. There will be an option to choose one or more database instances for each migration process. **If a customer does not initiate the migration after two reminders, we will initiate the migration from the backend during off-business hours.**

At the start of migration, customers will be presented with the following information:
- Selected database(s) will be migrated to a staging/UAT environment and will continue operating in that environment for 21 days.
- There will be no extra cost for the migrated database in the staging/UAT environment.
Once the migration is complete, customers will have read-only access to their old instances for 14 days free of charge.
- The new pricing table will apply to migrated database instances after March 31, 2025. Customers will be charged based on the current pricing table regardless of the migration schedule.
- Any new databases created after November 11th (in the new Aiven-supported data centers) will be charged as per the new pricing table from the creation date.

## Additional notes

Restore works differently in the new platform!

A new forked database is provisioned, and the old one is not automatically deleted.

Users have to delete the old database after restoring the data to avoid extra billing.

## Pricing
Starting November 11, 2024, we will offer new 2-node plans for dedicated databases. We will introduce dedicated 512GB plans in the second half of 2025.


### Shared Managed Database Plans
| Cores | RAM | 1 Node Shared CPU Plans | 3 Node Shared CPU Plans |
| -- | -- | -- | -- |
| 1 | Shared 1GB, 1 node | $16.00 | $37.00 |
| 1 | Shared 2GB, 1 node | $32.00 | $74.00 |
| 2 | Shared 4GB, 1 node | $63.00 | $147.00 |
| 4 | Shared 8GB, 1 node | $126.00 | $294.00 |
| 6 | Shared 16GB, 1 node | $252.00 | $588.00 |
| 8 | Shared 32GB, 1 node | $504.00 | $1,176.00 |
| 16 | Shared 64GB, 1 node | $1,008.00 | $2,352.00 |
| 20 | Shared 96GB, 1 node | $1,512.00 | $3,545.00 |
| 24 | Shared 128GB, 1 node | $2,016.00 | $4,726.00 |
| 32 | Shared 192GB, 1 node | $3,025.00 | $7,090.00 |


### Dedicated Managed Database Plans
| Cores | RAM | 1 Node Dedicated CPU Plans | 2 Node Dedicated CPU Plans(New) | 3 Node Dedicated CPU Plans |
| -- | -- | -- | -- | -- |
| 2 | Dedicated 4GB | $68.00 | $143.00 | $206.00 |
| 4 | Dedicated 8GB | $136.00 | $285.00 | $410.00 |
| 8 | Dedicated 16GB | $273.00 | $590.00 | $819.00 |
| 16 | Dedicated 32GB | $546.00 | $1,168.00 | $1,638.00 |
| 32 | Dedicated 64GB | $1,173.00 | $2,365.00 | $3,459.00 |
| 48 | Dedicated 96GB | $1,759.00 | $3,632.00 | $5,195.00 |
| 50 | Dedicated 128GB | $2,341.00 | $4,755.00 | $6,739.00 |
| 56 | Dedicated 256GB | $4,684.00 | $9,118.00 | $13,553.00 |




