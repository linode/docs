---
slug: an-introduction-to-neo4j
title: "An Introduction to Neo4j"
title_meta: "What Is Neo4j?"
description: 'Neoj4 is a graph database that excels at complex datasets. Learn how it differs from relational databases like SQL and discover some practical use cases.'
og_description: 'Neoj4 is a graph database that excels at complex datasets. Learn how it differs from relational databases like SQL and discover some practical use cases.'
keywords: ['what is neo4j','what is neo4j used for','what is neo4j graph database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Cameron Laird"]
published: 2023-09-29
modified_by:
  name: Linode
---

Many of the world's largest organizations rely on Neo4j. This introduction explains Neo4j's role in managing modern databases and its advantages over other technologies.

## What Is Neo4j?

[Neo4j](https://neo4j.com) is a [database management system](/docs/guides/databases/) (DBMS). Rather than the [relational model](https://www.techtarget.com/searchdatamanagement/definition/RDBMS-relational-database-management-system) used in the [SQL programming language](/docs/guides/sql-commands/), Neo4j organizes, represents, and delivers data in terms of [graph structures](https://neo4j.com/developer/graph-database/). Because of this distinction, graph database managers are often labeled as [NoSQL](/docs/guides/what-is-nosql/). However, NoSQL encompasses more than just graph databases. For example, a key-value store such as [Redis](/docs/guides/databases/redis/) is also NoSQL, but it is *not* a graph database.

The Neo4j DBMS was created by a company of the same name. Neo4j, Inc. develops and maintains the associated software, library, and tool set. Neo4j is available either as self-managed software or as a cloud-based solution (called AuraDB). This guide covers the free Neo4j self-managed Community edition, though it also comes as a paid Enterprise edition. Review the Neo4j [product page](https://neo4j.com/product/neo4j-graph-database/) and [license page](https://neo4j.com/licensing/) to learn more about the differences between editions.

While Neo4j is coded in Java, the information Neo4j manages is also accessible to most [other programming languages](https://neo4j.com/developer/language-guides/).

## The Benefits of Using Neo4j

In what situations do graph databases shine, and how does Neo4j compare to other graph databases?

Graph databases excel when hosting structured data such as customer records, financial transactions, clinical information, scientific measurements, and sports observations. They make it less complicated to manage the relationships between data, particularly as those relationships become more complex.

For example, when there's a need to look not just at customers, but at people known to customers, or customers acquainted with other customers. In this scenario, it's likely that a graph database is an order of magnitude faster for many queries than a Relational DBMS (RDBMS).

In this case, "faster" has a couple of meanings. Graph databases return the answers to specific complex queries on terabyte-sized databases in fractions of a second. Additionally, the time to develop those queries is also believed to be less than corresponding RDBMS programming.

It's true that SQL has been in use for five decades, and a large pool of practitioners already exist. On the other hand, graph databases are more expressive of complex relationships and "unstructured" data. Therefore, graph databases have the potential to be less difficult and quicker to program for many contemporary relationship-focused problems. Neo4j, in particular, has all the capabilities of previous generations of data management technology. It then extends that base to solve the data problems involved in complex relationships.

Business strategists often refer to [data and information as a company's greatest asset](https://techcrunch.com/sponsor/teradata/why-data-is-the-single-most-important-asset-for-companies-of-the-future/). Not factories, or the land underneath the factories, or the inventory inside of them. Rather, the decades of intelligence on how to run those factories, and on the customers they serve. Only a modern DBMS such as Neo4j can effectively get at that data. That's why the use of Neo4j grows so rapidly, [more than doubling each year](https://neo4j.com/news/neo4j-ranks-among-20-fastest-growing-skills-for-independent-professionals-over-120-yoy-growth/).

Indexes play a crucial role in RDBMS architecture. The best RDBMS results come when an application is designed ahead of time with appropriate SQL indexes. SQL enhancements frequently require new indexes, which themselves might involve downtime and delicate updates. In contrast, graph databases handle new data attributes and new relationships more gracefully.

Neo4j has a weighty market presence among graph databases. As of 2022, it had an installed base of thousands of enterprise-class deployments and hundreds of thousands of working applications. Some competitive graph databases like [TigerGraph](https://www.tigergraph.com/) and [Neptune](https://aws.amazon.com/neptune/) may be faster than Neo4j in some ranges. However, Neo4j offers more mature development and operating communities, documentation, training, and associated services.

A crucial strategic benefit of Neo4j is the extent to which it shifts human effort from capital to operations. SQL installations typically thrive with a carefully designed data model crystallized early in an organization's history, and amortized over a long span of use. While Neo4j is effective at managing large, old datasets, it simultaneously encourages "experimental", light-weight project management. Changes in requirements during the course of a project are less traumatic for graph databases than for the corresponding relational databases. Graph databases are intrinsically agile, and simply more flexible in this sense.

## Key Features of Neo4j

Those who use relational databases think in terms of tables, rows, columns, and relationships. The rough equivalents in graphical databases are nodes, relationships, and properties. Customer Mary Smith might appear in a particular graphical database as a customer node with such properties as name, address, and account number. Specific relationships connect Ms. Smith to family members, to purchases she's made, and meetings she's attended.

Neo4j builds in a query language, CQL ([Cypher Query Language](https://neo4j.com/developer/cypher/)), which serves the role SQL does for RDBMSs. The Neo4j Data Browser is a graphical user interface which eases the use of CQL. CQL expresses such queries as:

```command
MATCH (prospect: Person {income > 10000})-
       [:PURCHASED]->(course: {level: 'introductory'})
RETURN prospect
LIMIT 10
```

The Data Browser makes it quick work to express complex look-ups. Neo4j's intrinsic speed returns results in a fraction of a second, even when working with terabytes of data. Neo4j supports [ACID–atomic, consistent, isolated, and durable](https://database.guide/what-is-acid-in-databases/) rules of database operation. This guarantees that database instances behave sensibly and reliably. ACID makes it feasible to trust that a bank's books are balanced, and prevents money involved in a transaction from being spent twice.

Neo4j offers a [REST API](https://restfulapi.net/) that any programming language can use to access Neo4j data, along with specialized language-specific APIs for JavaScript and Java.

It supports familiar enterprise-class database capabilities, including backups, indexes, partitioning, replication, and sharding. These are all features that make real-world databases more responsive and trustworthy.

## Conclusion

Neo4j is a popular, stable, fast, and agile graph database system. Run-time results are often an order of magnitude faster than those from RDBMSs, especially on relation-centered problems. Consequently, programming those relation-centered applications can also be less complicated. Neo4j has a rich and stable ecosystem, including good documentation, training, and support services.

The result is wide adoption of Neo4j by organizations with complex and rigorous data-processing requirements. Every one of North America’s twenty largest banks licenses Neo4j as a platform for regulatory compliance, customer retention, and other crucial applications. Similarly, Neo4j is widely used in aerospace, telecommunications, retailing, and other leading industries.