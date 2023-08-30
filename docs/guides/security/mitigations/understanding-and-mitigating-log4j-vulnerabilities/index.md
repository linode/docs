---
slug: understanding-and-mitigating-log4j-vulnerabilities
description: 'Vulnerabilities in log4j are resulting in RCE exploits and more. This guide empowers users to stay ahead of the issue as it develops.'
keywords: ["log4j","security","log4shell"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-12-17
modified_by:
  name: Linode
published: 2021-12-17
title: Understanding and Mitigating log4j Vulnerabilities
tags: ["security"]
aliases: ['/security/mitigations/mitigating-log4j-vulnerabilities/']
authors: ["Linode"]
---

## Understanding log4j Vulnerabilities

Recently, a series of new critical 0-day vulnerabilities,[CVE-2021–44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228) and [CVE-2021-45046 ](https://nvd.nist.gov/vuln/detail/CVE-2021-45046) have been disclosed, with CVE-2021-44228 receiving a 10.0 [CVSS score](https://nvd.nist.gov/vuln-metrics/cvss) indicating the highest level of severity. Both vulnerabilities are of significant concern to those implementing applications that use Java's [log4j](https://logging.apache.org/log4j/2.x/) logging service. When unpatched, attacks can include remote code execution on effected systems via unauthenticated web requests and more vulnerabilities likely to be announced.

Log4j is often included in software packages and tools without explicit mention, and as such, has the potential to go unnoticed within user systems without a deliberate investigation. Additionally, vulnerable log4j implementations can be hidden within configuration files such as `.jar` files, potentially making full detection via traditional methods such as the `find` or `locate` commands insufficient.

Before proceeding, it should be noted that the above mentioned log4j vulnerabilities  only impact versions of log4j using versions **log4j 2.x** and later, and patches are being rolled out by the Apache Foundation regularly. For any updates on these patches, it is recommended that users review Apache's [log4j Security Page](https://logging.apache.org/log4j/2.x/security.html) for additional information.

The steps in this guide aim to empower you to proactively discover log4j vulnerabilities on your system, and mitigate them where needed.

{{< note respectIndent=false >}}
For more information on how Linode has handled log4j vulnerabilities, and a detailed writeup on [CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228) specifically, as well as mitigation steps, see our [Security Digest](https://www.linode.com/blog/security/linode-security-digest-log4j2/).
{{< /note >}}

### Identifying log4j issues and potential compromises on Linode

Searching for software affected by log4j is a good first step for identifying impact, and both the [NCSC](https://www.ncsc.nl/) and [CISA](https://www.cisa.gov/) have compiled comprehensive lists built to help you to discover the full scope of impacted software. Additionally we recommend performing scans using open-source tools created by reputable security experts that have been constructed specifically to identify log4j vulnerabilities that may be unique to your configuration. A list of useful tools and resources, as well as a brief description of each, are listed below:

- [NCSC Maintained List of Known Effected Software and Remediation Status](https://github.com/NCSC-NL/log4shell/tree/main/software): The NCSC maintained list of known effected software as well as the remediation status.
- [CISA Log4j List of Known Effected Products and Guidance](https://github.com/cisagov/log4j-affected-db): CISA's list of known effected Software, as well as official Mitigation Guidance.
- [CERTCC'S CVE-2021-44228_scanner](https://github.com/CERTCC/CVE-2021-44228_scanner): The Official recommendation for log4j identification by CISA, and developed by [Carnegie Mellon's CERT Coordination Center](https://www.kb.cert.org/vuls/), this tool will empower you to identify log4j vulnerabilities in all of their known forms.
- [Lunasec's Log4j Blog](https://www.lunasec.io/docs/blog/log4j-zero-day/): A blog post from security company [Lunasec](https://www.lunasec.io), which has published detailed information on the log4j vulnerabilities. Lunasec's log4j blog post was one of the first resources published towards identification and mitigation, and is regularly updated with new information.
- [log4j-scan](https://github.com/fullhunt/log4j-scan): **log4j-scan** is an open source tool built to assist users in remote fuzzing of user owned domains, specifically to address log4j vulnerabilities.
- [Log4j-Detector](https://github.com/mergebase/log4j-detector): **log4j-detector** is an open source tool that performs local queries to detect versions of log4j that are vulnerable to both CVE-2021-44228 and CVE-2021-45046.
- [Log4j RCE Exploitation Detection](https://gist.github.com/Neo23x0/e4c8b03ff8cdf1fa63b7d15db6e3860b): A list of commands compiled by security expert [Florian Roth](https://twitter.com/cyb3rops) built to help users identify exploitation attempts.
- [Trivy](https://github.com/aquasecurity/trivy): Trivy is an image vulnerability scanning tool that includes log4j vulnerabilities, and can help users to identify log4j in containerized applications such as with [Docker](https://www.docker.com/) or [Kubernetes](https://kubernetes.io/)

{{< note respectIndent=false >}}
Containerized applications using tools like Docker and Kubernetes may not be detected via the above methods if performed only from the host device, and identification steps should be performed directly from within containers.
{{< /note >}}

The following commands may also be used towards manually identifying log4j packages and affected files on your system:


    dpkg -l | grep liblog4j
    dpkg -l | grep log4
    find / -name log4j-core-*.jar
    locate log4j | grep -v log4js

### Log4j Vulnerability Mitigation

If log4j is detected on your system, mitigation can be performed by immediately installing the [Latest Software Version](https://logging.apache.org/log4j/2.x/download.html) which will include the latest available software patches. Installing `log4j 2.16.0` for example will completely disables JNDI by default and removes support for Message Lookups to apply mitigation. If patching your system is not possible by updating your version of log4j, then users should follow CISA's [Recommended Workarounds](https://www.cisa.gov/uscert/apache-log4j-vulnerability-guidance) with the understanding that a full log4j software version update is recommended.

If you believe a compromise has occurred, we recommend following the steps in our guide for [Recovering From a System Compromise](/docs/guides/recovering-from-a-system-compromise/).

As log4j is, at the time of this writing, still a developing issue, it is recommended that users continue to regularly monitor the situation from both CISA's [Guidance Page](https://www.cisa.gov/uscert/apache-log4j-vulnerability-guidance) and [Apache's log4j Vulnerabilities Page](https://logging.apache.org/log4j/2.x/security.html)