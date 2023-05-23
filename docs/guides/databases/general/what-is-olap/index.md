---
slug: what-is-olap
title: "What Is OLAP?"
description: 'This guide describes what an OLAP server does and how it works within the context of a data warehouse.'
og_description: 'This guide describes what an OLAP server does and how it works within the context of a data warehouse.'
keywords: ['OLAP','OLAP and Data Warehouse','Types of OLAP Servers','OLAP operations']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
published: 2023-05-15
modified_by:
  name: Linode
external_resources:
- '[Online Analytical Processing on Wikipedia](https://en.wikipedia.org/wiki/Online_analytical_processing)'
- '[Dimensional Database Model on Wikipedia](https://en.wikipedia.org/wiki/Dimension_(data_warehouse))'
- '[Comparison summary of OLAP servers](https://en.wikipedia.org/wiki/Comparison_of_OLAP_servers)'
---

*Online analytical processing* (OLAP) helps organizations answer complicated business queries. In conjunction with a data warehouse, OLAP can efficiently analyze multi-dimensional data. This guide provides an introduction to OLAP and explains how it is used. It also discusses the various types of OLAP servers and the most common type of OLAP operations.

## What is OLAP?

OLAP is a database technique designed to answer *multi-dimensional analytical* (MDA) problems. This technique is used in statistics, economics, and business intelligence to evaluate scenarios with more than two inputs. For example, a business analyst might want to track sales by product category and sales district over time. OLAP organizes and structures the massive accumulation of institutional data so it is meaningful and useful.

The MDA process evaluates information in terms of *dimensions* and *facts*. A fact is a measurement of an item of interest. A fact might represent the number of sales of a particular brand of tomato soup. A dimension is a label that describes the facts. For example, the dimensions for the soup sales figure might include the store, time period, and unit size. Fact tables store the facts and dimension tables describe the dimensions. The tables are correlated to each other using keys, which often map to official IDs such as a product ID code. MDA queries can use more than three dimensions, but higher-order dimensionality can potentially lead to confusing queries and incorporate irrelevant information.

The multidimensional approach allows business users to evaluate corporate data from multiple perspectives. For example, analysts can specify values for each dimension and view the data at the intersection of these attributes. They can also keep one dimension constant and see how the data varies as the remaining attributes change. This system is often easier for non-technical staff to use than a traditional relational database.

Dedicated OLAP servers typically process the OLAP queries. These systems are optimized for handling highly-complicated analytical queries. The data set for an OLAP server is almost always read-only. This reduces the use of database locks and improves performance. If the database is ever refreshed, new data is only uploaded during maintenance windows when the system is otherwise unavailable.

OLAP systems are often integrated with a tool set to make them easier to use. Some of these tools enable business users to run batch jobs returning the results of common queries. However, an OLAP tool is always able to respond to ad hoc queries. OLAP servers can readily interface with business reporting,*artificial intelligence* (AI), and third-party tools.

### OLAP Concepts

The multi-dimensional data set is stored in a format known as a *OLAP data cube*. If four or more dimensions are used, it is often called a *hypercube*. A data cube or hypercube is a conceptual representation of a spreadsheet extended out to additional dimensions. It stores both the measures in the fact table and the dimensions for contextualizing the facts. After the dimensions of a data cube are defined, the structure of the cube cannot be changed. To redefine a cube, it must be completely rebuilt.

Each dimension of the cube represents a quality that partially categorizes or defines the data. For example, a hypercube might have the product ID, time period, location, and market segment as its four dimensions. A cube consists of a large number of cells. Each cell contains a data point representing the intersection of the different dimensions. Taken together, the union of the dimensions provides the exact context for the measurement. For instance, a cell might indicate the number of cans of tomato soup sold in Blackpool during Q3 2021 at the corporate discount chain.

Additional background can be obtained for each dimension from the dimension table. For example, within the data cube a unique product ID might identify the specific item. This ID can be used to access the product dimension table and extract additional information about the product. OLAP databases are specifically designed to support a few core processes, including slicing and dicing, drilling down, and consolidation. The most common OLAP techniques are discussed in more depth in a later section.

Inside the OLAP database, the data is structured according to one of several schemas. In a *star schema*, a fact table lies at the center of the structure with dimension tables at the points. A *snowflake schema* has a network of dimension tables at the points. The snowflake schema is capable of modeling more complicated relationships and is typically more normalized than a star. However, it is also more difficult to model and query. Another alternative arrangement is a *fact constellation*. In this design multiple fact tables share one or more dimension tables.

Data aggregation within an OLAP cube allows for faster and more efficient queries. Data can be pre-aggregated along one of the dimensions. For instance, daily sales records can be aggregated into monthly sales records. This allows data for a specified time range to be extracted more quickly. Data can be aggregated according to many potential metrics.

To save precalculation efforts and preserve flexibility, only the most popular, useful, and time-saving aggregations are computed. However, some hybrid approaches can automatically assess certain interim aggregations. These lower-level aggregations can then be manually aggregated for a second time to generate higher-level values. But any aggregation can be generated upon request. If the underlying data changes after an update, then many of the aggregate data items must also be recalculated. This can be computationally expensive, so most data cubes are typically only updated occasionally.

Queries for OLAP systems typically do not use the SQL syntax. Several other formats could be used, depending on the system. However, the *Multidimensional Expressions* (MDX) query language has slowly become the non-official standard. Most OLAP applications now support MDX.

### OLAP Operations

OLAP is optimized to support a few core operations. These operations reflect the most common tasks in the business intelligence domain. The key OLAP procedures are as follows:

- **Slice-and-Dice**: A *slice* carves a subsection out of the larger data cube. The subsection represents one layer of information relating to a specific dimension. A slice can extract all sales data from one particular store, cutting across products and time periods. A *dice* operation evaluates the cube over two or more dimensions, carving out an even smaller sub-section of the original data. This results in an even smaller section of data than a slice. Slicing-and-dicing can work together. Sales from one store can be sliced off and then diced into time periods, for example, Q3 2022.
- **Pivot**: As part of a slice or dice activity, a *pivot* can reorient the data around a new dimension. For example, a slice operation can pivot to examine soup sales from all stores in all time periods. This can result in surprising new insights.
- **Roll-up**: Often known as *consolidation*, this procedure aggregates data on one or more dimensions based on a specific attribute. For example, sales from all stores can be added together to calculate total retail sales. This technique is good for generating high-level summaries and reports.
- **Drill-down**: This operation navigates deep into the data cube to extract specific and precise results. It searches for data satisfying specific criteria on several dimensions. For instance, an analyst can review sales of a particular product at a particular store. This technique could be used to see if a local promotion resulted in increased sales.

## OLAP Servers and Data Warehouses

OLAP applications are usually one components of a *data warehouse*, but they can be developed independently as part of a smaller *data mart*. A data warehouse is a comprehensive collection of all the data associated with a large business or organization. It collects data from several intake sources and operational databases. A data warehouse aggregates and transforms the data into a more useful store for corporate analysts and managers. Data warehouses host both historical and current data and can track changes over time.

Data warehouses are oriented around key business subjects and contain immutable data. They consist of a staging layer to store raw data, a data integration layer, and an access layer. The data integration layer standardizes, formats, and pre-processes the data. It accomplishes this task using an *extract, transform, and load* (ETL) procedure. The access layer is used to retrieve and analyze the data. It often includes business intelligence tools and an analytics engine.

After processing, the data is stored inside a *data warehouse database*. The underlying data storage mechanism is often a dimensional database consisting of facts and dimensions. But it can also be a normalized RDBMS-style database with tables, rows, and columns. OLAP systems require a *semantic model* to describe and conceptualize the meaning of each data element.

In many data warehouses, an OLAP engine is one of the most important components. The data warehouse contains large amounts of historical and current data which serves as a data source for the OLAP server. The OLAP system also benefits from any previous formatting, standardization, and transformation activities. However, the OLAP database is almost always separate from the main data warehouse database. This is because additional processing is required to optimize the information for an OLAP cube overlay. In some cases, an OLAP server might only use a subset of the data in a data warehouse. Any special OLAP tools are usually considered part of the access layer of the data warehouse.

It is important to align the structures of each database. If the data warehouse uses a dimensional format, then the OLAP component should use the same format. Of course, the OLAP server is only one aspect of a data warehouse. So the OLAP workflow cannot be as efficiently streamlined as an independent system. A competing alternative is to develop several smaller data marts, each focussing on one particular subject. The data in the data mart can be deliberately structured to enable efficient OLAP queries.

## What is the Difference Between OLAP and OLTP Systems?

OLAP is often confused with *Online transaction processing* (OLTP), due to their similar acronyms. However, these systems handle entirely different processes at opposite ends of the business. OLTP systems are designed for rapid processing of simple transactions and are essential for operational use. Most businesses maintain both OLAP and OLTP systems. Here are some of the key differences between OLAP and OLTP.

- **Purpose**: OLAP systems specialize in complex business intelligence queries. The purpose of an OLTP system is to rapidly process a large number of simple transactions.
- **Usage**: OLAP data is structured to support complicated multi-dimensional business intelligence queries. OLAP servers are highly centralized read-only systems. They cannot efficiently or quickly handle updates. On the other hand, an OLTP system is designed to efficiently and quickly add, modify, or delete entries. For example, an OLTP system might be used to store customer hotel reservations. They are not designed to handle complex analytical queries. OLTP systems are usually highly distributed. They manage a single task and do not attempt to provide a broader context.
- **Design**: OLAP data is stored in data cubes, using a dimensional format. It is structured through the use of fact and dimension tables. Data does not have to be normalized and is instead organized into a format more suitable for MDA tasks. An OLTP is designed for high speed and data integrity. It normalizes and aggregates data for simple and efficient atomic operations.
- **User Base**: OLAP systems have a small number of users, typically analysts and managers, who generate complicated searches. OLTP systems have a larger number of operations staff and customers conducting more straightforward transactions.
- **Historical Data**: OLAP systems perform historical analysis and store both historical and current data. OLTP systems only handle new data, which is frequently copied to other systems and then purged.

## Use Cases for OLAP

OLAP is widely used in academia and government in addition to business. In a business, it is useful for the following tasks.

- Data mining
- Trend analysis
- Sales records and forecasting
- Marketing and market research
- Budgeting
- Financial reporting
- Decision support
- Business process management
- Compliance and regulatory reporting
- Product research, development, and testing

## Benefits and Drawbacks of OLAP

OLAP systems efficiently address many common business requirements, and provide the following advantages.

- It gathers multiple data sources, including current and historical records, in one location. Multiple teams can share the same data.
- It supplies data in the correct format for business intelligence queries.
- It provides fast access to the most commonly used information.
- It helps spot trends, patterns, and anomalies.
- It is very efficient for complex read-only searches and data extraction.
- It readily integrates with other business tools, including report generators and artificial intelligence applications.
- It keeps analytical tasks separate from operational systems, allowing both applications to function better.
- It is easy for employees to use and understand.

However, OLAP systems do present a few drawbacks and challenges.

- It is difficult to refresh OLAP systems with new data because the system is not optimized for updates.
- The OLAP data stores might be out of date or exclude current data.
- Extensive data cleaning and transformations are required to ensure useful data.
- It is computationally expensive to calculate and store a large number of aggregations.
- It does not integrate well with relational database tools.

## Types of OLAP System Architectures

There are two main types of OLAP systems, along with a hybrid compromise. *Multidimensional OLAP* (MOLAP) takes a dimensional approach. The *Relational OLAP* (ROLAP) alternative uses a normalized design similar to a RDBMS system.

### Multidimensional OLAP (MOLAP)

MOLAP is the most common form for an OLAP system. MOLAP and OLAP are even used as synonyms. MOLAP uses multi-dimensional arrays to arrange, store, and display the data. Data is usually not normalized, although pre-computation, consolidation, and aggregation are frequently used. A MOLAP data cube is able to provide an answer to any conceivable query, either directly from the aggregations or through run-time calculations. Most MOLAP systems use a star or snowflake schema to structure the data.

MOLAP has the following advantages:

- It is very fast, often taking only a fraction of the time required by other systems.
- It can automatically precalculate or cache frequently used results for better performance.
- It allows for data compression to preserve storage space.
- It is extremely fast for two or three-dimensional data.
- It is easy to model and understand, and is often more clear to business users.

MOLAP also has a couple of drawbacks:

- It can duplicate data.
- It does not prioritize data integrity or consistency.
- It works best with a static data set and is not optimized to handle updates. Post-update processing can be time and memory-intensive and require an official maintenance window.
- It can become disorganized and turn into a data swamp, consuming vast amounts of storage space.

### Relational OLAP (ROLAP)

ROLAP has a more traditional relational database structure, using a tabular semantic model. Data is stored in rows inside tables, with each column specifying a different attribute of the record. Tables and subjects are associated through database joins. ROLAP systems normalize data and do not precalculate aggregate results.

However, ROLAP adds several optimizations allowing for faster and more efficient OLAP queries. It reconfigures the data to more closely resemble the multi-dimensional data cube found in MOLAP architectures. However, it still converts any requests into standard relational database queries.

Some of the advantages of a ROLAP application are as follows:

- It is more scalable and can handle dimensions with millions of entries.
- It inter-operates with any third-party SQL tool. This allows for a wider range of reporting and data analysis applications.
- It is faster and more efficient in handling text and non-numerical attributes.
- It can load and modify data more quickly.
- It preserves data integrity and completeness.
- It allows administrators to use a more complex security model and control access at the table or row level.

Unfortunately, a ROLAP application has some significant downsides compared to MOLAP.

- It is less efficient and slower.
- It does not naturally aggregate data, so custom code is required to perform this task. Aggregate tables must be created and updated manually.
- It relies too heavily on SQL and does not support non-SQL tools.
- It does not integrate as well with many business intelligence tools. It does not naturally support traditional models for budgeting and forecasting.

Some of the downsides of a ROLAP system have been partially alleviated with new SQL features. These features include the `ROLLUP` and `CUBE` commands, along with new OLAP extensions.

{{< note >}}
Although ROLAP systems use a relational database model, most RDBMS systems do not support OLAP. ROLAP systems perform special data handling and have additional capabilities that regular RDBMS systems lack. A standard RDBMS implementation would be too slow and inefficient for this purpose. Some companies try to reuse their existing relational databases for OLAP, but this is not recommended.
{{< /note >}}

### Hybrid OLAP (HOLAP)

New *Hybrid OLAP* (HOLAP) systems attempt to combine the advantages of MOLAP and ROLAP applications. These systems use both relational and dimensional storage and structures, allowing administrators to decide how to partition the data. Older or more detailed data is stored in a relational ROLAP format. But aggregated summaries and core information might be optimized using a MOLAP structure. HOLAP offers a good combination of reasonable performance, high scaling, and user flexibility. Recent OLAP software development activities are trending in this hybrid direction.

## Commercial and Open Source OLAP Software

Many major software vendors provide OLAP system solutions for large organizations. However, data warehouse applications also provide some OLAP capabilities. Some of the major OLAP vendors include Microsoft, Hyperion, Oracle, and IBM/Cognos. The total price for a system depends on the depth of the feature set and the number of supported users. Wikipedia provides a [summary of the major OLAP servers](https://en.wikipedia.org/wiki/Comparison_of_OLAP_servers) for comparison. Some of the main open source alternatives to the commercial products include Apache Pinot, Apache Druid, Cubes, and the Mondrian OLAP server.

Most organizations could consider outsourcing the design and implementation of their OLAP installation. Even if a solution is developed in-house, a consultant should be hired to ensure development is on track and meets the actual business requirements.

## Conclusion

OLAP is a database solution for corporate business intelligence and analytics tasks. Using information derived from a data warehouse, the OLAP structure efficiently supports complex queries on read-only data. OLAP servers store data in a data cube format with multiple dimensions, but can be based on either a dimensional or relational design. The most common OLAP operations consist of roll-up, drill-down, and slice-and-dice queries. Many corporate and open source OLAP servers are available, but management should be clear about their objectives when designing their system.