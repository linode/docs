---
slug: what-is-a-data-warehouse
title: "What Is a Data Warehouse?"
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
published: 2023-05-09
modified_by:
  name: Linode
external_resources:
- '[Data Warehouse on Wikipedia](https://en.wikipedia.org/wiki/Data_warehouse)'
- '[Seven Steps of Data Warehousing](https://www.itprotoday.com/sql-server/7-steps-data-warehousing)'
- '[Dimension-based database on Wikipedia](https://en.wikipedia.org/wiki/Dimension_(data_warehouse))'
- '[Database normalization on Wikipedia](https://en.wikipedia.org/wiki/Database_normalization)'
- '[Star schema on Wikipedia](https://en.wikipedia.org/wiki/Star_schema)'
---

A *data warehouse* (DWH) aggregates data from many sources into a central location for better usability. This helps large organizations more effectively analyze their historical business records and reach better decisions. This guide describes data warehousing, explains the main design concepts, and provides some guidelines on how to create one.

## What is a Data Warehouse?

A data warehouse extends the traditional database to provide a comprehensive and fully-integrated data collection for a large business or organization. A DWH collects data from various intake sources and production databases. It presents the data in a more straightforward and useful format for corporate analysts and managers. Also known as an *enterprise data warehouse* (EDW), it is the foundation for an institution's business intelligence efforts.

In most cases, a data warehouse stores both historical and current data, making it invaluable in tracking business trends over time. The data is often transformed or normalized after intake to provide a standardized interface and ensure data consistency. Data warehouses are typically designed for specific types of analytic queries rather than general operational performance. These queries search for long-term trends and obvious relationships in the data. The data warehouse philosophy recognizes operations and analytics can both be improved by maintaining separate dedicated systems.

Data warehousing was first conceptualized in the 1980s at IBM. It was an attempt to resolve many problems with business data storage and organization. These issues included redundant and conflicting data, along with the presence of business silos, where each unit managed their data separately. Maintaining separate decision-making applications resulted in considerable overlap and inefficiencies. The widespread deployment of data warehouses is part of the same long-term trend towards analytical corporate planning and operational effectiveness.

A data warehouse, regardless of its underlying structure or design, shares the following characteristics.

- **It is subject-oriented**: It prioritizes the topics of interest to management and disregards the rest. The most important subjects dictate the structure of the warehouse.
- **A data warehouse integrates multiple data sources**: Data is taken from several sources, and is combined, structured, and organized for consistency. Invalid or duplicate data is removed. Across the entire data warehouse, the same labels, units, and data types are used.
- **It stores data for a longer period**: Both current and historical data sets are included in a data warehouse. Data can be stored indefinitely or deleted after a set length of time.
- **The data set is immutable**: Data inside the warehouse is read-only and historical data cannot be changed. Data can only be added through official data uptake procedures, or deleted according to corporate data retention policies.

A corporation might use a data warehouse in several ways, including the following roles:

- Data mining
- Analytical processing
- Market research
- Decision support
- Integration with automated processes
- Complying with data handling and retention requirements

The [Data Warehouse page on Wikipedia](https://en.wikipedia.org/wiki/Data_warehouse) provides more information on the various types of data warehouses and the history behind the technology.

### The Structure and Workflow of a Data Warehouse

To populate the data warehouse, information is first taken from lower-level systems. These might include point of sales records, employee training results, or operational logs. Depending on the nature of the warehouse, the inputs might undergo *data cleansing*. This process corrects, completes, or transforms the original data. The data is then standardized and organized before it is ready for analysis and data reporting. From a conceptual viewpoint, a data warehouse can be decomposed into three basic several layers.

- **Staging Layer**: This is an interim storage area for the raw data extracted from the original data sources. The raw data remains in this layer until it is processed. It serves as a backup copy of the original data to preserve the original format and for legal and data retention purposes. After the data warehouse is operative, information is usually extracted from operational systems on a regularly-scheduled basis. However, data can also be uploaded from specialized or legacy systems on a one-time basis.
- **Data Integration/Storage Layer**: This layer cleans up and transforms the data so it can be integrated into a *operational data store*. The data is frequently *normalized*. This means it is converted into a series of tables, each containing a number of columns. Relationships between the tables are defined to contextualize the data. The data in this layer can alternatively be sorted into *dimensions*, *facts*, and aggregate facts. The dimensions provide a template for understanding the facts. As part of this process, the data is cleaned, missing information added, and extraneous information removed. The transformation layer can also add aggregated values and meta-data. At the conclusion of this phase, the data collection is often moved to the *data warehouse database*.
- **Access Layer**: This is the layer managers use when retrieving and analyzing the data. It potentially includes business intelligence tools and an analytics engine for data mining, aggregation, and management. The access layer usually includes a *data dictionary*. This contains information about the data, including the type, origin, and meaning of each data item, and the relationship between items.

Different tools and processes are used at each layer and to move data sets between layers. A data warehouse requires the following tools and components:

- Access to the source databases and a means of uploading the original data.
- Database architectures capable of storing and retrieving the information. A DWH typically uses a *relational database management system* (RDBMS) to host the data.
- Data integration tools for processing and transforming the data.
- Tools allowing business users to retrieve and analyze the data.
- Rules for maintaining data quality and a consistent format for the metadata.
- Policies and procedures for data governance, compliance, and retention.

There are two main approaches taken when converting the original source data into a data warehouse collection.

- **Extract, Transform, and Load (ETL)**: This procedure first extracts the raw data from the original database sources to the staging area. It then applies a series of operations and transformations to the data to convert it to a consistent format more suitable for analysis. The data is later moved to permanent storage, where users can execute queries and retrieve the results from the access layer. This is the most efficient method, but it requires considerable development work and a larger storage capacity.
- **Extract, Load, and Transform (ELT)**: This is similar to the ETL process, except there are no intermediate transformations after the data is loaded. The data is extracted from the sources and moved directly into the data warehouse without the use of a staging area. The data set can still be potentially transformed inside the warehouse, either before data access or at access time. Some ELT systems make use of a *data lake*. This includes both raw and transformed data in one central location. An ELT architecture is simpler but not as efficient as an ETL warehouse. If poorly managed, this technique can result in a data swamp of nearly-unusable information.

In addition to the two workflow alternatives, there are several different design alternatives for designing the structure of a data warehouse. The *normalized approach* is more similar to a traditional RDBMS design. A *dimensional approach* is based on the relations between *fact tables* and *dimension tables*. These approaches are more thoroughly explained in the "Data Warehouse Design Alternatives" section.

## Related Concepts and Alternatives

There are a number of alternatives to a data warehouse. Some of these can be used in addition to a data warehouse. The most common alternatives are as follows:

- **Data mart**: This is a simplified and smaller-scale version of a data warehouse. A data mart is typically created for use by a single department or a smaller organization. It focuses on one subject or aspect of the data. A data mart might only have a couple of sources and a small number of users. It is usually less formal and standardized and applies fewer transformations. Data might not be normalized or converted into an RDBMS-friendly format.
- **Online analytical processing**: This is a small but sophisticated database geared towards advanced analysis and statistical operations. The data is often heavily normalized, aggregated, and optimized to support very complex queries.
- **Online transaction processing**: These operational systems are designed for rapid processing of simple transactions like purchases or reservations. They are highly distributed and used by a large number of concurrent users. An OLTP system is designed for high speed and data integrity.

## The Advantages and Disadvantages of a Data Warehouse

Data warehouses have many advantages over an ad-hoc mixture of data marts and production systems. Although the main advantage is simply bringing all data into a central location, other secondary benefits occur. Not all of these advantages occur in all data warehouses. The precise list of enhancements is correlated to the scope, design, and architecture of the specific warehouse.

Some of the main advantages of a data warehouse include the following:

- It collects data from a large number of operational databases into a single location for ease of use.
- It is designed for business analysts, data scientists, and managers rather than for operational staff. It presents the data in the correct format for management use and business intelligence purposes.
- It works in tandem with business tools such as reports, dashboards, and decision-support heuristics, promoting better decision making. It integrates well with data science or *artificial intelligence* (AI) tools.
- It allows for better automation of processes and management activities.
- It converts organizational data into a format that is easier to understand and investigate. It permits a more organized, structured, and centralized database model, resulting in more efficient queries.
- It standardizes the data using uniform codes and formats and presents it in a coherent and consistent manner.
- Because it stores both past and current data, it supports historical data analysis. This allows managers to track corporate performance over time and in relation to secondary factors.
- It speeds up data extraction and processing, reducing the use of database table-level locks.
- It maintains data integrity and improves consistency and accuracy. It also detects and eliminates invalid, missing, or duplicate data.
- It allows the source databases to more aggressively purge old data.
- It minimizes the risk of unauthorized access and data theft.

There are also a few disadvantages with the standard data warehouse design:

- It can be time-consuming, costly, and difficult to implement. There is a long list of failed corporate data warehouse projects.
- Different stakeholders might not agree on the structure, organization, and objectives of the data warehouse. It requests considerable management support.
- It can reflect or retain problems and errors imported from the sources.
- Important information can be lost when the data is transformed, cleaned, and normalized.

## How to Design a Data Warehouse

To properly design a data warehouse, database architectures must choose between a dimensional and normalized approach. Each alternative stores data in a different manner and has different advantages and weaknesses. It is also worth considering whether the data warehouse should evolve using a top-down or bottom-up approach. Finally, there are a number of general issues to consider when designing any warehouse, regardless of its design.

### Data Warehouse Design Alternatives

Several database concepts underlie the design, construction and use of any EDW system. There are two main types of data warehouse architectures.

In a [dimensional approach](https://en.wikipedia.org/wiki/Dimension_(data_warehouse)), transactional data is transformed into facts, with the dimensions providing a context for the facts.

- A *fact* refers to an individual value or measurement. On a sales bill, the individual sales items are the facts. Facts are stored inside a *fact table*. An *aggregate fact* summarizes a number of facts together, for example, adding up the server connections to calculate the total connections to a cluster.
- A *dimension* categorizes, labels, and contextualizes facts. For the sales receipt facts, the store location and purchaser might be two of the dimensions. Each dimension includes additional information about the entity. For example, the store dimension contains the location of the store. Like facts, dimensions are stored in a *dimension table*. Each dimension table contains a primary key, often system-generated to uniquely identify each dimension. This key links to the associated fact tables, which contain more information.
- The dimensions help make sense of the facts from a business intelligence perspective. They represent the most relevant concepts to management. For instance, managers typically do not care about what an individual customer bought. But they do care what type of items a store is selling the most.
- Standardized dimension tables are shared across the company and used to group data from multiple fact tables. Different fact tables can link to the same dimension table. A store takes in revenue, but it also generates purchase orders and employs staff. So the orders and purchases fact table could link to the store dimension. Likewise, multiple dimensions are typically linked to each fact. Queries often filter data based on a dimension.
- A dimensional model often uses a [*star schema*](https://en.wikipedia.org/wiki/Star_schema) to store the data. In this database layout, each fact table references several dimension tables. The design can be visualized as a "star", with the fact table lying at the center. Each dimension table represents a point of the star. This design is effective in handling simple queries.
- The dimensions can be stacked over time, forming a three-dimensional cube-like structure. The cube can be sliced into time periods, or according to a dimension.
- A dimensional design does not have to use an RDBMS structure or enforce normalization unless it is useful to do so.
- Data retrieval is very fast and efficient.
- This type of data warehouse is faster to build and quicker to understand and use. However, it is also inefficient and subject to duplication and data inconsistency. It is also difficult to modify.

A [normalized approach](https://en.wikipedia.org/wiki/Database_normalization) uses relational database structure including columns and rows. It often stores data in a RDBMS.

- Data is said to be normalized when it is organized into tables with relationships between the tables. The normalization process maps the original source data into tables, rows, and columns.
- Tables map to the different subjects of managerial interest, for example, product orders.
- Primary, secondary, and foreign keys establish relationships between the subjects.
- The data warehouse design is often highly complicated, with dozens of tables and an even larger number of table relationships.
- This approach is very common in database design and is well understood by database professionals. Normalization is the default approach used in RDBMS systems.
- It is easy to add new information or extract existing data using SQL queries or another similar approach.
- It avoids data redundancy, increases data integrity, uses less storage space, and integrates more effectively with data analysis tools.
- The design is more complicated and takes more time to implement. It can also be slower and more difficult for managers to use.

It is also possible to use a hybrid approach. In this architecture, the data is mainly normalized with some dimensional aspects. Along with the architectural alternatives, there are two main approaches to data warehouse evolution.

In a *bottom-up* approach, data marts for specific purposes and departments are created first. The data marts are then bound together to form a larger data warehouse. Dimensions and facts from one data mart can be shared with the other data marts. This approach works best as a star schema or hub-and-spoke design, which means data does not necessarily have to be normalized. It is much easier to create a bottom-up warehouse, but they can be messy and duplicate data.

A *top-down* design is more hierarchical and centrally planned and is best for companies wanting a "single source" of truth. Data is more frequently normalized and follows a formal data model. Dimensional databases and data marts are carved out of the main data warehouse, often at no extra cost. However, it is more difficult and costly to use a top-down approach. In a hybrid model, smaller data marts can link to a central repository as one of their data sources.

A new form of data warehouse uses virtualization. The data is not uploaded to a new system. Instead, a data overlay is used to access and analyze data across the various subsystems. This avoids the creation of a separate data warehouse database and guarantees access to up-to-the-minute data. However, it might be inefficient, leading to contention between systems, and is less organized. There is no offline copy of the data.

### The Data Warehouse Design Process

Designing, creating, and populating a data warehouse is a lengthy process. It involves the work of many architects, software developers, database experts, and business stakeholders. In addition, the development efforts must consider any existing tools, such as data science software packages.

Not all organizations have the level of in-house expertise to build a data warehouse. It is worth considering whether to outsource the data warehouse development task or at least hire a consultant to direct the process. A few data warehousing applications are available, such as Google BigQuery. These generic solutions might not meet all requirements, but could be the right choice for a smaller business on a tighter budget.

Business leaders and the corporate culture must support the data warehouse. The company must also have mature data handling and management practices. In the absence of any of these factors, the project is unlikely to succeed. The skill level and technological competence of managers and business analysts should also factor into the data warehouse design. At all stages of the process, data warehouse designers, consultants, IT developers, and corporate management should keep in close contact.

Despite any differences in the approach or structure of the warehouse, the same steps are necessary to deliver a successful deployment. The specifics of each case determine the correct course of action, and in many cases there are tradeoffs. For example, it might be too difficult or expensive to completely clean all data from the source systems. More sophisticated tools can support staff members with different technical backgrounds, but they come at a development cost. The scope and budget of the project obviously affect some of these decisions. These instructions should be taken as general guidelines.

1.  **Determine the business case**: It is important to know how and why the data warehouse is intended to be used. These objectives must tie into the definition of success for the business. The organization's objectives must drive the organization and structure of the warehouse and the approach used to build it. In many cases, the business might not receive a cost benefit from the warehouse relative to the costs to build it. In this case, it might be better to proceed with several smaller data marts for individual units.
2.  **Analyze the information and systems that are currently available**: Review the data in each active system and discuss how it might be useful or not. Investigate how long data is currently retained for and the availability of historical data. Understand what data is missing or is stored outside any operational system, including information on paper and in retired legacy databases. It is also important to be aware of any existing processes, such as how business decisions are currently made.
3.  **Discuss the data warehouse plans with individual stakeholder**: Talk to the people who collect the data and those who perform the analysis and make business decisions. This frequently involves discussions with operations and non-managerial staff. Changes to the data collection process might enable the data warehouse to be even more successful. Ensure the data warehouse supports current core business processes, even if they are currently performed manually. Ensure the business users find the system useful and easy to use. Failing to consider user perspectives might lead to poor morale and non-compliance in the future.
4.  **Build a list of supported tasks**: These activities should align with the core business processes and support the original business case. The subjects in the data warehouse must reflect the company's key performance indicators and dashboard components. If business analysts spend most of their time reviewing customer accounts, the data warehouse and tools must support this task. The warehouse must also integrate tools for accomplishing the most important business processes. Ideally, every business activity can be mapped to a specific tool, although in practice tools often support multiple tasks.
5.  **Design the data model**: A key decision is whether to use a dimensional or normalized approach. For a dimensional warehouse, determine the required facts and dimension tables. The facts should be traceable back to the key corporate performance indicators. Decide what dimensions are necessary and create correlations between the dimension and fact tables. Fact tables can be related to each other if they share a dimension. In a more traditional normalized approach, design the database, tables, and columns. To complete the data model, determine the primary, composite, and foreign keys for the tables. Once again, the database design should reflect the subjects and relationships that are relevant to the business analysts.
6.  **Plan the data flows and transformations**: Locate the various source databases and create a process for importing the data, including how often to update the data warehouse. Map the data points from these databases to facts and fact tables. This is also a good time to agree upon the labels and units of measurement to use. Decide what conversions and transformations are required and what to do about missing, incorrect, or incomplete data. Some systems require more data cleaning than others, but the data from all systems should be standardized into the same format. Some data processing is likely required during the import process, such as adding missing ZIP codes or performing unit conversions. But it might be more efficient to apply other transformations after all the data has been moved to the warehouse. Decide whether to use third-party tools to execute some of the more intensive numerical processing requirements.
7.  **Compose data governance and retentions policies**: Data retention and privacy policies must comply with any regulations. The amount of available storage and requirements of the organization should shape the storage policies. Different sets of data can be kept for different durations and at various states of granularity. For example, an organization might keep the complete data set for two years, and a summarized version for ten. This strikes a balance between storage requirements and business intelligence demands, but it requires additional data handling procedures. Security, user identification, and access control requirements should also be defined in this stage.
8.  **Plan the schedule**: The usual project management best practices also apply to data warehouse development. Break the project down into smaller tasks, with significant slack to allow for the unexpected. A reporting mechanism and schedule should be developed to keep all stakeholders informed. Agile software development processes can help build out a data warehouse in stages. It is a good idea to plan for and build a demo or proof-of-concept first. This might focus on a particular subject or set of source data. The advantage of a phased approach is it provides an opportunity to obtain feedback or optimize the steps before more work is done.
9.  **Implement the data warehouse and tools**: A maintenance window should be scheduled to activate the database. This ideally occurs overnight or on a weekend. Data can be transferred from the source systems in smaller batches to reduce the overall load. It is important to build in quality assurance tools and beta testing to confirm the validity of the data intake and transformation. Beta users can provide valuable input and give the organization the opportunity to refine training and best practices before a wider deployment.
10.  **Monitor the deployment**: Post-development support can include providing training assistance and materials, integrating enhancement requests, and patching defects. Users should be interviewed and their concerns and complaints acknowledged and potentially addressed. The performance of the system should be monitored on an ongoing basis. In particular, computing power and storage can be added if necessary. Over the longer term, the business must decide whether the system is meeting its objectives. The data warehouse should ideally be allowing managers and analysts to reach better decisions and optimize corporate performance.

## Conclusion

A data warehouse collects data from various source databases, and organizes and structures it so it is more useful to management. It contains both current and historical data and is centered around key business objectives. Data warehouses typically stage and transform the original data after extracting it, and include an access layer and tools to assist business users. A data warehouse can be dimensional, with fact tables and dimension tables, or normalized into relational tables, each with a list of columns. Following a rigorous design process is more likely to result in a successful data warehouse deployment. For more information about data warehouses, the [Wikipedia page](https://en.wikipedia.org/wiki/Data_warehouse) is a good place to begin.