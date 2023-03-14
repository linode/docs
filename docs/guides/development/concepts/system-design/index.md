---
slug: system-design
description: 'What is system design and why is it important? Read our guide to learn system design basics, as well as how to design a high-level system. ✓ Click here!'
keywords: ['system design', 'what is system design', 'system design basics', 'systems by design', 'learn system design', 'software system design', 'system design process', 'system design in software engineering', 'steps in system design', 'how to design a system']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-12-28
modified_by:
  name: Linode
title: "A Software Engineer’s Guide to System Design"
title_meta: "System Design 101: How to Design a System"
external_resources:
- '[Educative.io: The complete guide to System Design in 2023](https://www.educative.io/blog/complete-guide-to-system-design)'
- '[GeeksForGeeks.org: 5 Common System Design Concepts for Interview Preparation](https://www.geeksforgeeks.org/5-common-system-design-concepts-for-interview-preparation/)'
- '[GitHub.com/donnemartin: The System Design Primer](https://github.com/donnemartin/system-design-primer)'

authors: ["John Mueller"]
---

The idea of designing something [is as old as humans](https://bootcamp.uxdesign.cc/design-history-key-moments-you-should-know-d403157a227). To [design something](https://medium.com/@alenaiouguina/the-origin-of-design-designing-the-future-by-understanding-the-past-295045e9384e) means to work out the details before committing to creating the real thing. [Important purposes of design](https://www.expandtheroom.com/insights/the-eight-principles-of-purpose-driven-design/) include ensuring that the resulting object:

-   Has real value
-   Works (especially in a given context)
-   Provides solutions for all stakeholders
-   Is simple enough
-   Is based on facts (not opinions)
-   Meets the goals you set for it

Design isn’t a new concept. It makes the process of creating the object more efficient. System design defines how a software system interacts with users, hardware, and data. It also ensures these tasks are done reliably and securely. Learning system design means discovering how to observe and articulate the desired behaviors and goals of a software system. Software system design relies on an established process that includes the overall architecture, interfaces between elements, and data structure.

## What is System Design?

When asked, “What is system design?”, different developers give different answers based on knowledge, experience, the teams they’re working with, and project type. To design means to create a plan using system design basics. This often requires the use of diagrams showing how system elements go together graphically, accompanied by text that fully explains them in human-readable terms. You find the elements of system design in [software engineering](https://www.tutorialspoint.com/software_engineering/software_engineering_overview.htm). Many developers confuse system design with [system analysis](https://study.com/academy/lesson/systems-analysis-definition-example.html), which is an entirely different concept. System analysis is a process of breaking down a system into pieces to determine how those components interact and achieve their goals. You perform system design before you create a system, and system analysis after the system is already in place.

## Why Should You Learn System Design?

It is preferable to create systems by design, rather than using ad hoc strategies that don’t work well. However, most developers feel uncomfortable with system design because it has nothing to do with coding. They often believe they don’t know how to design a system, yet every developer already practices the skills required to do so. System engineering involves asking questions that describe how to design a system. Part of the system design process is to review the available hardware, data locations, use of the cloud, and user interactions. There is a need to think about criteria that developers may not typically think about. The purposes of this thought process are:

-   **Efficiency**: Creating a design forces the development staff to think through the answers to questions before coding, which means fewer errors and problems.
-   **Reliability**: Designed systems work more reliably because they contain fewer bugs related to incorrect assumptions by the development staff. System design means working on new code, rather than rehashing old code continuously.
-   **Security**: Enduring a single hack is bothersome. Enduring continuous hacks against poorly designed software is catastrophic. A well-designed system often results in pats on the back, while poorly designed systems result in sleepless nights spent performing repairs.
-   **Speed**: The only way to create a truly speedy system is to design it. Speedy systems have features like caching, multiprocessing, and load balancing. It isn’t possible to use advanced programming techniques effectively without a system design.
-   **Reduced Responsibility**: Creating systems by design means embracing the skills, knowledge, and experiences of all the [stakeholders](https://www.conceptatech.com/blog/how-to-define-stakeholders-for-your-software-development-project) for a project. Sometimes, the best ideas for a system design come from users who know nothing about code, but everything about how data is used in a particular part of the organization. You can reduce system complexity by incorporating existing cloud solutions. This way, you don’t have to reinvent the wheel, or support that part of the system later. When you learn system design and use it appropriately, you also reduce your responsibility and risks.

## System Design Basics

System design follows a particular set of steps based on the [scientific method](https://www.khanacademy.org/science/biology/intro-to-biology/science-of-biology/a/the-science-of-biology), accumulated knowledge, and past errors. The steps tend to prevent various errors by adding structure to the thought processes of individual developers and feedback through [peer review](https://www.perforce.com/blog/qac/9-best-practices-for-code-review). Established guidelines and best practices reduce the amount of work needed to create a solid design.

### Defining Goals

It is essential to think through the goals for the system before delving into diagramming, specifications, and other elements of a system design. Simply ask what the system must achieve when complete. Having a clear picture in mind helps answer a second layer of questions. Questions like how the system pays for itself, and why users want to use it. This last question is essential. Many software projects look absolutely amazing to the developers, but [users won’t touch it](https://www.lemonlearning.com/blog/why-no-one-uses-software) because the software is not user-friendly. When goals don’t include users, the software often ["gets in their way"](https://saaslist.com/blog/why-teams-arent-using-crm/).

### Assessing Resources

Any system design must consider the availability of resources. If the new design requires new resources, then the design process must involve funding those resources. Otherwise, what happens is the software is built, but languishes due to an inability to use it. Worse, some organizations, having invested heavily in the software, try to force users to embrace the software on inadequate hardware. System downtime, slow response times, and other [resource starvation](https://www.centralgalaxy.com/what-is-resource-starvation-and-how-to-prevent-it/) problems inevitably doom the most enlightened software design because users refuse to use it.

An important resource to consider is data storage. One of the system design basics is to ensure that the system design includes enough storage, and of the right type. For example, permanent storage means working with a disk system (or a simulation of it) in some manner. You can store data in blocks as part of a traditional or distributed file system, or use objects that represent a real world entity. Most systems are designed to use more than one storage strategy, typically one for each data structure requirement. For example, a distributed file system works well with unstructured data.

In a cloud environment, it’s possible to partially overcome resource starvation issues by focusing on scaling strategies, such as [obtaining additional resources on demand](https://www.linode.com/content/bringing-innovation-to-the-edge-with-the-alternative-cloud-on-demand/). Using on-demand setups means the hosting company provides additional resources automatically when needed, within the parameters configured by the application developers. Using approaches like on demand [keep costs low](https://www.linode.com/blog/alternative-cloud/how-the-alternative-cloud-benefits-developers/), while also ensuring that the application automatically scales to meet additional needs.

### Creating Useful Diagrams

In software engineering system design, diagramming occurs at five different levels, or steps:

1.  **Architecture**: An overall plan of the software system design. A [block diagram](https://www.clear.rice.edu/comp310/JavaResources/systemblockdiagrams.html) without use cases that shows system elements at a level that provides enough information for the people involved in this phase. This is also when a designer addresses issues such as the behaviors of individuals with regard to the system design using [Unified Modeling Language (UML)](https://www.tutorialspoint.com/object_oriented_analysis_design/ooad_uml_behavioural_diagrams.htm) behavioral diagrams. Stakeholders are present to answer questions and overcome misconceptions.
1.  **Components**: The blocks within the block diagram in more detail using [cross-functional block diagrams](https://online.visual-paradigm.com/knowledge/flowchart/what-is-cross-functional-flowchart/). These show data and workflows in a manner that explains how the system architecture goals are achieved. This step follows the various actors around to see how they create, use, and modify data as part of their processing for the architecture as a whole. In many cases, a system design incorporates various UML diagrams to better explain the process: interaction, sequence, collaboration, state, and activity.
1.  **Modules**: The pieces of software that are put together to create a component. Precisely what diagrams are used in this step depends on the kind of design you want to create. For example, a [microservice approach based on service-oriented architecture (SOA)](https://www.devteam.space/blog/microservice-architecture-examples-and-diagram/) relies on a different kind of diagram than the traditional, monolithic approach. The idea is to determine what specific task each piece of software performs. This step often reveals similarities between modules that can reduce system design complexity, costs, and ultimately develop a more reliable system.
1.  **Interfaces**: Now that there are specific pieces of software, it’s possible to describe the methods they use to communicate with a more formal component diagram that details the communication between modules. This is also the point where a designer considers issues like multiprocessing and the use of load balancing. Except for actually writing the software, this phase describes every event that occurs and how the software design addresses them.
1.  **Data**: Even though the data has been part of the preceding four levels in various ways, it hasn’t been described in detail yet. At this point, you know there is a user entry in the database and that the entry contains certain data. However, nothing has been done to show the precise content of that entry in the form of data types, indexing, etc. For this task, many system designers rely on the [entity-relationship diagram (ERD)](https://www.lucidchart.com/pages/er-diagrams) to [describe the data in significant detail](https://www.guru99.com/er-diagram-tutorial-dbms.html).

### Considering the CAP Theorem

Any design you create encounters the CAP theorem when it comes to data management. CAP stands for Consistency, Availability, and Partition tolerance:

-   **Consistency**: The system always returns the most current data when requested. This means a data cache that helps improve system speed must also contain the most current data, reducing its effectiveness.
-   **Availability**: The system provides a response within a reasonable time. Users might hold one view of what is reasonable, while developers hold another. Part of goal setting for a system design must define what is reasonable.
-   **Partition tolerance**: The system continues to operate even when parts of it break down. A good system design assumes that parts of the system can fail, and ensures that the system has enough fault tolerance and redundancy to handle the failure.

The CAP theorem states that it’s possible to design an application that possesses two of the elements just described, but not all three. As part of the design process, you must ensure that stakeholders are aware of these trade-offs. For example, making the system highly consistent involves making it less available because it won’t be possible to add certain speed-boosting features. Likewise, if a system is both consistent and partition tolerant it naturally runs slower to support additional levels of checks and methods of addressing reliability. This particular concern also affects the choice of database manager:

-   Relational databases usually lean towards creating a CA system.
-   Non-relational databases usually lean towards creating a CP or AP system.

## How to Create a High-Level System Design

The stakeholders in an organization must be able to understand a high-level system design when provided as part of a presentation. The high-level system design discusses issues like:

-   How the application scales.
-   What is done to ensure that the application works reliably.
-   How the data remains secure.
-   How the system as a whole remains viable should unwanted or unforeseen events occur.

### Relying on Horizontal and Vertical Scaling

As the demand for an application changes, the underlying hardware must scale to support the application. Otherwise, users can experience slowness or possibly even crashes. The system design must address the need to scale in various circumstances. The two methods used to provide scalability are:

-   **Horizontal**: A [load balancer is used to add more servers](https://www.linode.com/products/nodebalancers/) of a given size. This form of scaling is typically used to address unforeseen needs, such as a [sudden increase in application use](https://www.linode.com/content/lke-now-with-horizontal-cluster-autoscaling/) due to a sales campaign. Load balancers add automation to scaling, which means they don’t require constant monitoring. Large organizations rely heavily on load balancing because it provides predictable scaling at a price that larger organizations can handle. Issues with horizontal scaling include:
    -   Increased complexity due to needed tasks, such as cloning servers.
    -   Added demand on downstream servers to provide caching and database support.
    -   Reduced reliability because a single load balancer can become a single point of failure.
-   **Vertical**: Where the [size of the server changes](/docs/products/compute/compute-instances/guides/resize/) to meet new needs. This form of scaling is typically used to enhance anticipated changes in application use and is a manual process. It’s also normally used by small-to-medium-sized businesses that don’t want, or need, the complexity of load balancing. Issues with vertical scaling include:
    -   Potential size limitations of the physical server or virtual server instance.
    -   Higher risk of downtime and outages because the load isn’t distributed across multiple, redundant servers.

### Ensuring Reliability

Every system design must address the topic of reliability. However, because the applications running on the system and user needs vary, not every system design uses the same approach. In addition, the resources available to an organization, language used for development, and other factors all play into decisions made about reliability. [The design of a reliable system can become quite complex](https://www.reliasoft.com/resources/resource-center/design-for-reliability-overview-of-the-process-and-applicable-techniques) depending on the size and use of that system. However, keeping things as simple as possible is always the best approach. One way to create a reliable software engineering system design is to rely on [microservices](https://www.infoq.com/articles/microservices-design-ideals/). This way, a loss of one component doesn’t bring the entire system down.

Data reliability depends on verification processes as part of the system design. In fact, you can consider verification as one of the system design basics. The most common approach is to create a checksum of any data transmitted from one location to another. The data on receipt is then verified against the checksum. Large datasets often require the use of alternative verification strategies, such as [Merkle trees](https://www.geeksforgeeks.org/introduction-to-merkle-tree/).

### Employing Proxy Servers

It’s essential that an application remain secure during use. One way to achieve this goal is to rely on proxy servers to hide the identities of participants in an exchange. Proxy servers provide added reliability because the target of an exchange can change if the original participant becomes unavailable. There are two forms of proxy server:

-   **Forward**: Hides the client from view. The server sees the proxy server instead of the client during an exchange, which is helpful during anonymous interactions. Using a forward proxy helps improve privacy and ensure that legal requirements regarding client data are met.
-   **Reverse**: Hides the server from view. The client sees the proxy server instead of the server during an exchange. This is helpful as part of securing the exchange. It also provides access to an alternative server when the original server becomes unavailable, all without a change in address.

## Conclusion

System design creates better software at lower cost, with higher reliability and security than any other approach. More importantly, it helps to deliver products on time. System design frees the designer to be creative, while allowing other stakeholders to provide their input as well. Ultimately, system design empowers people to solve complex problems that could otherwise be insurmountable.