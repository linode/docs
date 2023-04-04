---
slug: edge-computing
description: 'Edge computing allows computation and data storage to be expedited. This guide covers how it works and why this technology should matter to you?.'
keywords: ['what is edge computing','edge computing definition','edge computing example']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-18
modified_by:
  name: Linode
title: "What is Edge Computing and How Does It Work?"
title_meta: "Edge Computing Architecture and Services Explained"
authors: ["Pam Baker"]
---

At its core, *edge computing* is distributed computing. It pushes the computing close to or on the data source, which greatly minimizes the distance data must travel to be analyzed. Not only does it shorten analysis times to real time speeds, but it also returns the output just as fast to automated systems that are located on the data source too. Because of the speed in these processes, edge computing is vital to innovative applications such as autonomous vehicles, in-hospital patient monitoring, remote asset monitoring for the oil and gas industry, movie recommendations on Smart TVs, and EKGs on smartphones. Given the versatility edge computing provides, many companies are finding it useful and even essential to their business.

## What is Edge Computing?

Essentially the term refers to devices that gather and use data at the outer edge of networks. Hence the name, edge computing.

There are various types of devices with many different functions. Collectively they are referred to as the Internet of Things (IoT). They reside in homes and offices, atop buildings and other structures, out in the frozen tundra, in the depths of jungles, around swamps and farmlands, and even in space.

Some devices are stationary, but many are not. Several fly onboard drones and planes. Others sail the seas on ships or bob about on buoys. Others you wear as smartwatches and smartphones. Some are attached to a robot delivering medications in a hospital or on one that is vacuuming your floor. They exist in vehicles of all types on roads, rails, waterways, in the air, and off road too.

These IoT devices can be anything, or anywhere, doing whatever they are designed to do. In terms of edge computing, one thing these devices all have in common is that they collect data and analyze it on site, either on the device or at a nearby gateway. A gateway can be another physical device or a virtual platform, but either way the gateway connects smart devices via sensors and IoT modules to the cloud.

Think of edge computing as cloud computing that comes to the data source.

For example, an autonomous car collects, analyzes, and takes automated actions to navigate according to GPS directions and road hazards detected by onboard sensors. The entire process takes mere seconds. Speed is necessary to avoid collisions, missed turns, and other in-the-moment mishaps. Collisions are inevitable if instead the data is collected by sensors on the car, sent to the cloud for analysis, and the outputs then sent back to the car as triggers for automated actions. There is simply insufficient time for that process to complete in the typical cloud computing environment.

That is not to say that traditional cloud computing isn’t used in tandem with edge computing, because often it is. Autonomous cars must analyze data on the spot to drive safely, but its data can also be sent to the cloud for storage and further, less time-sensitive analysis, such as vehicle performance metrics and vehicle diagnostics.

Edge computing is not a replacement for, or alternative to, traditional cloud computing, but rather an extension of it.

## Why Should You Care about Edge Computing Technology?

Edge computing is on its way to being ubiquitous. [Gartner estimates](https://www.gartner.com/smarterwithgartner/what-edge-computing-means-for-infrastructure-and-operations-leaders) that by the year 2025, “75% of data will be created and processed outside of a traditional centralized data center or cloud.” Edge servers, which can be used as gateways and to form clusters or micro data centers, are going to beef up computing power at the edge as needed for more complex use cases.

There is more at stake here than achieving faster speeds in analysis to feed automated decision making in fluid situations. Expanding the cloud to include distributed computing (at the edge) makes room for increased innovation and profits for cloud hosting providers.

Just as providers forever changed the on-premises data center model for everyone, they are going to disrupt their own cloud models too. In today’s supercharged market environments the smart move is to continually disrupt your own company in order to find new revenue streams and seize larger market shares.

The public cloud giants do not exist in a vacuum. With this burst of new computing models and the previously unimagined innovations that are going to follow, comes the impetus for vast change across industries.

The day is coming when edge computing in the traditional sense, along with mobile edge computing on 5G networks, is going to unleash embedded intelligence capabilities, vastly improve user experiences, and bring a wide array of new technologies, services, and business opportunities to bear.

There are downsides to edge computing too.

For one thing, decentralization broadens the attack surface which means that criminals and nations have more places and more ways to attack companies, national infrastructures, and a myriad other targets. Securing edge devices, servers and gateways, and apps is a burgeoning problem.

User privacy may improve as it will be harder for companies to harvest your data if it is kept locally. Your data may also be sold at a higher price because it is more difficult for interested companies to get access from distributed data storage. Also, data collection comes closer to your daily life, and edge computing may suction more private information from your personal life than just what you’re doing on a device or browser. Certainly, privacy remains an issue to watch.

Further, companies are going to have more control over decisions in your private life even if that isn’t their intention. Since many of the services delivered by edge computing, as with traditional cloud computing, reduce your decisions to a small number of options, users may end up ignoring other options which may be better for their personal circumstance.

Another downside may be costs, depending on how a company chooses to deploy and manage edge computing. Scale – a hallmark of traditional data mining – will be much harder and costlier to achieve. The sheer number of devices and gateways to be purchased and managed can also substantially drive-up costs for companies.

## Edge Computing Explained: How Does it Work?

Edge computing occurs when intelligent devices, AKA smart devices, gather data on the scene through the use of sensors and other data-gathering instruments and process the data via analytics on the device or a nearby gateway. The resulting outputs can be used to trigger an automated action onsite or sent to the cloud for storage, additional analysis, or to an app for visualization and dashboard reads – or even all three.

By comparison, in traditional data mining all calculations take place in the cloud or in data centers.

Flipping the model from centralized data storage and analysis (cloud) to decentralized (edge computing), means greater speeds in analysis. There is less strain on networks because less bandwidth is consumed, less lag, faster data transmission times to the cloud because only change and relevant data is sent instead of bulk data migration, there’s a shorter distance between data collection points and analytics, and better offline access when internet or cellular connections are spotty or sparse.

Edge devices add flexibility in computing by virtue of the many communication protocol options they use, which include:

- **Bluetooth Low Energy** (BLE): a low power wireless technology.
- **Cellular** (most notably 5G): the same type of protocol used by mobile devices including mobile phones.
- **Ethernet**: a group of wired networking technologies. Examples include local area networks (LAN), metropolitan area networks (MAN), and wide area networks (WAN).
- **NFC**: stands for near field communication; used for short-range wireless connectivity.
- **RFID**: stands for radio frequency identification; used for wireless communication on radio frequency in identifying a person, animal, or object.
- **Zigbee**: low cost, low power, wireless mesh network.
- **Z-Wave**: low energy radio waves in a mesh network primarily used for home automation.

Edge devices continue to evolve. Some use more than one communication protocol. Most send data over an open systems interconnection (OSI) framework to unite data from other, disparate devices adhering to various standards. Gateway devices often route, transfer, and manage data connections. The resulting systems connect via cloud and Internet protocols as needed. Edge devices are already intelligent enough to handle AI and machine learning and other highly sophisticated functions on their own.

Edge gateways serve as the connection between edge devices and cloud and/or on-premises data centers. An edge gateway can help manage edge devices downstream by functions such as triggering on/off to save power, pinging the device to function on command and then return to sleep mode, and make adjustments to accommodate conditions surrounding the edge device.

Edge networks operate outside and independent from a centralized network. The edge network is two way, meaning it feeds data to the main network but can also be used to pull data from the main network. Thus, edge networks are meant to run parallel and in coordination with the main network as needed.

Very advanced edge networks provide additional highly sophisticated capabilities such as dynamic data processing and distribution, as well as running applications and algorithms on the edge.

## Edge Computing Examples

Examples are plentiful as applications of edge computing are only limited by the imagination. Here are three examples to give you an idea of the diversity and flexibility in use cases.

- **Autonomous vehicles**. By far the best known and arguably most glamorous example of edge computing are autonomous vehicles ranging from consumer Tesla models to [Walmart’s Gatik built delivery truck](https://www.cnbc.com/2021/11/08/walmart-is-using-fully-driverless-trucks-to-ramp-up-its-online-grocery-business.html) and [Rolls-Royce’s autonomous commercial ships](https://spectrum.ieee.org/forget-autonomous-cars-autonomous-ships-are-almost-here). All types of vehicles are undergoing the same transitions. Edge computing is radically changing transportation worldwide.

- **Agricultural Farm and Field Automation**. Everything from autonomous tractors and farm machines, moisture and soil sensors that automate irrigation and fertilizer applications, and farm robotics is proving edge computing to be a valuable field hand for family and commercial farms alike.

- **Extreme Environment Studies and Analysis**. Take the Arctic, where extreme temperatures and other conditions make it dangerous for humans to collect data manually. According to the [IEEE IoT Vertical and Topical Summit report](https://anchorage2018.iot.ieee.org/program/vertical-sessions/arctic-region-alaska-challenges/), IoT and edge computing are useful in monitoring active volcanic zones; detecting and tracking seismic activity from movement of tectonic plates; monitoring and understanding a complex maritime ecology; analyzing changes in glaciers and ice caps; and monitoring the high latitude ionosphere and magnetosphere.

As edge computing continues to expand, more uses appear on the horizon.

## Use Cases for Edge Computing Technology

Edge computing use has spread across industries. Currently it is widely used in the following industries:

- **Autonomous vehicles and charging stations**: Not only does edge computing drive vehicles but it helps with the planning, predicting, monitoring, and management of charging stations for electric vehicles too. Edge computing features are evolving in vehicle design now. Examples include lane departure warnings and self-parking applications.

- **Agriculture**: From autonomous tractor and farm equipment to herd management, disease monitoring and prevention, and soil optimization, plus many functions and features in-between, edge computing is becoming the farmer’s best field hand.

- **Public Transit Systems**: Ticketing and auto-passes, security screening, luggage tracking, trip and route planning, and passenger information systems are just a few examples of how quickly edge computing is improving public transit systems and user experiences.

- **Retail Applications**: In-store item price checking, mobile app checkouts, passive in-store checkouts, and product suggestions offered in-store according to available inventory are use cases in retail for computer vision and other technologies coupled with edge computing.

- **Manufacturing**: Process monitoring, raw material and part inventory management, warehouse management, and order fulfillment management are advantages edge computing brings to manufacturing.

- **Industrial Robotics and Process Monitoring**: Automated and self-improving robotic processes, maintenance prediction and automation, production on demand, and other new capabilities make edge computing essential for industrial robotic users.

- **Traffic Management and Smart City Systems**: Edge computing enables many new capabilities such as vehicle-to-anything communications. The “anything” in that calculation can quite literally be anything from traffic signals, lane openings, automated tolls, parking, and ticket payments, automated parking and passenger drop off and pickup, and more. One example of such a system in operation today is [New York City’s traffic management system](https://www.digi.com/customer-stories/new-york-city-dot-deploys-digi-solutions).

- **Supply Chain Tracking and Monitoring**: From ensuring product temperatures during transit and providing a chain of custody to monitoring delivery delays and arrival times, edge computing goes a long way in solving many of the world’s most frustrating supply chain issues.

- **Security and Safety**: Edge computing can help prevent unauthorized access to physical locations through real-time analysis of biometric authentications, security camera footage analysis, automated lockdown, and other automated responses to real time data. Summoning help onsite and disengaging equipment that may otherwise harm a human are additional examples of how edge computing aids with security, safety protocols, and actions.

- **Healthcare and Medical Research**: Edge computing is already permeating medical research and healthcare delivery systems. EMTs in ambulances are collaborating en route on patient care with doctors in ERs via 4k video and patient vital reads, thanks to edge computing. Bedside monitors, home monitors, and even ingestible diagnostic devices are providing much needed real time patient data and analysis to doctors. Smart hospital beds are preventing falls and pressure sores, and conducting contact free monitoring for incontinence detection, heart and respiratory rates, sleep apnea, and infectious agents.

This is not an exhaustive list. Rankings of which industry is using or deploying more edge computing than others tend to shift as edge computing becomes more mainstream, even among late adopters.

According to a [2020 Deloitte report](https://www2.deloitte.com/xe/en/insights/industry/technology/technology-media-and-telecom-predictions/2021/edge-intelligence-fourth-industrial-revolution.html), “by 2023, 70% of enterprises may likely run some amount of data processing at the edge.” The report also credits a leading graphics processing unit (GPU) manufacturer for saying, “We’re about to enter a phase where we’re going to create an internet that is thousands of times bigger than the internet that we enjoy today.”

## Conclusion

One startling example of the evolution of technologies that edge computing pushes into our reality is a shift from AI being solely data-based to AI being situational-based. This is now possible because AI can now be put on the edge where it can analyze conditions in real time. As other new capabilities and shifts in the focus of features begin to rise and mature, industries will find more ways to capitalize on the unique aspects of edge computing in the cloud.