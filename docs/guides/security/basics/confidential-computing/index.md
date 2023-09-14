---
slug: confidential-computing
description: 'This guide dives into the security model, confidential computing, which seeks to better secure data in use.'
keywords: ['confidential computing']
tags: ['security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-23
modified_by:
  name: Linode
title: "Confidential Computing: A Collaborative Security Model for Data in Use"
authors: ["Pam Baker"]
---

Cloud providers, hardware vendors, and software developers have teamed up to tackle data-in-use security issues. The result is a security model called *confidential computing*.

Security measures can be categorized by the three data states they aim to protect: *data at rest*, *data in transit*, and *data in use*. Of the three, data in use is by far the most vulnerable to attack. That’s because in that state, data must be open and fully accessible to applications but also completely closed to criminal activity. Walking that fine line is a daunting, and until now, a nearly impossible task. Enter a collaboration of hardware vendors, cloud providers, and software developers called the Confidential Computing Consortium (CCC) to tackle the problem with a comprehensive solution. “We’re trying to evangelize that there are actually practical solutions to protect data while it’s in use,” said Dave Thaler, a software architect from Microsoft and chair of the CCC’s Technical Advisory Council in [an interview](https://spectrum.ieee.org/what-is-confidential-computing#toggle-gdpr) with IEEE Spectrum.

## Who is the Confidential Computing Consortium (CCC)?

The Consortium was launched in August, 2019 under the wing of the Linux Foundation. Its members include some of the [largest companies in tech](https://confidentialcomputing.io/members/).

Cloud computing technology walls off sensitive data in a protected enclave in a CPU during processing – aka data in use. The data tucked inside – and the processing munching on it – are only accessible by authorized computer code. No one and nothing else can detect its presence. Think of it as a black box. Once the processing is done, the data reverts to another state – either at rest (stored) or in transit (migrating to another destination).

The primary goal is to make accessing data stored in the cloud and allowing cloud services to access sensitive data residing anywhere, safe for the most sensitive of data and workloads. It’s a tall order in an age with an increasing amount of [cyber attacks](/docs/guides/types-of-cyber-attacks/#the-major-cyber-attacks). But that’s exactly why a new approach and a team of protectors are so sorely needed.

## Confidential Computing Use Cases

Confidential computing is a security innovation and like all good innovations, use cases for it are immediately evident.  Essentially, it creates a hardware-based trusted execution environment that is both flexible and completely isolated.

Some use cases for confidential computing are to prevent fraud in financial services, to spur innovations in medical treatments, and to secure intellectual property across industries and throughout supply chains.

There are as many use cases for confidential computing as there are uses for data. Essentially users and organizations want to protect all data while they’re using it, most especially any data categorized as sensitive or proprietary.

Newer technologies are driving a growing number of use cases for protective measures for data while in the crux of processing. A chief example is edge computing.According to the CCC report by the Everest group, titled *Confidential Computing - The Next Frontier in Data Security*, confidential computing, “ensures only authorized commands and code are executed by edge and IOT devices. Use of confidential computing on IOT, edge devices, and on the back end, helps control critical infrastructure by preventing tampering with code of data being communicated across interfaces.”

## Confidential Computing and Expanding Regulations

Rising and strengthening data privacy laws in several countries are driving more stringent compliance requirements. For this reason, a greater effort at securing data in all three of its states is required. Examples include a wide range of rules and laws from payment card industry ([PCI](https://www.investopedia.com/terms/p/pci-compliance.asp)) compliance which is mandated by credit card companies and acknowledged by legal precedent, to the EU legislation known as the General Data Protection Regulation ([GDPR](https://gdpr.eu/)).

Data privacy and protection laws are gaining momentum. A [report](https://unctad.org/page/data-protection-and-privacy-legislation-worldwide) by the United Nations Conference on Trade and Development (UNCTAD) found that 128 out of 194 countries have legislation in place now to secure the protection of data and privacy. In Africa and Asia, the report found similar high uptakes, “with 55% of countries having adopted such legislation from which 23 are least developed countries.”

According to the CCCC report, over 75% of demand is driven by regulated industries like banking, finance, insurance, healthcare, life sciences, public sector, and defense in 2021. As awareness of the benefits of confidential computing grows, willingness to invest in confidential computing exploration is expected to double across key regulated industries through 2026.

Further, the Consortium predicts that the confidential computing hardware and software markets are poised for exponential growth backed by expanding regulations, demand for comprehensive security postures, and appetite for new revenue generators. Bottom-line, the Consortium expects the Total Addressable Market (TAM) for confidential computing to “grow at least 26x over the next five years in a best-case scenario, and 6x in the same period in a worst case scenario,” wherein both cases are “due to growing enterprise awareness of confidential computing.”

## Building a Trusted Execution Environment (TEE)

The goal of confidential computing is to create and maintain a *Trusted Execution Environment* (TEE) which is, “commonly defined as an environment that provides a level of assurance of data integrity, data confidentiality, and code integrity,” according to the [Hardware-Based Trusted Execution for Applications and Data report](https://confidentialcomputing.io/white-papers-reports/) by the CCC. A hardware-based TEE uses hardware-backed techniques to provide increased security guarantees for the execution of code and protection of data within that environment.

A hardware-based TEE is necessary because data in use is being worked on within a computing environment which means hardware is involved even when the data resides in the cloud. Security in any layer of the compute stack is subject to a breach at an underlying layer. The Consortium report says that this truth drives the need for security measures to be taken at the lowest layers possible, “down to the silicon components of the hardware.”

A TEE is thus created by providing security though the lowest layers of hardware and severely limiting dependencies. This makes it possible to eliminate the operating system and device driver vendors, platform and peripheral vendors, and service providers and their admins, from the list of required trusted parties, reducing exposure and mitigating risk to data in use, according to the Consortium report.

Flexibility in the platform is also a key necessity. “Hardware-based TEEs can supplement other security techniques,” Thaler said in the IEEE Spectrum interview, “including homomorphic encryption and secure element chips such as the Trusted Platform Module. You can combine these technologies because they are not necessarily competing. Are you looking at the cloud or looking at the edge? You can pick which techniques to use.”