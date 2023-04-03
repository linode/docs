---
slug: security-testing
description: 'Security testing is crucial for spotting and removing vulnerabilities. Learn about the types of application security tools and how to use them.'
keywords: ['security testing','application security testing','application security tools','security testing tools']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-29
modified_by:
  name: Linode
title: "Application Security Testing: Fundamentals and Best Practices"
title_meta: "Application Security Testing Tools"
authors: ["David Newman"]
---

Application security testing tools help you build applications that are less vulnerable to attacks by automating security testing, and by verifying your applications are secured against known vulnerabilities.

In this guide, you learn what application security testing is; why you need application security tools; what types of tools exist; and what best practices your organization can use in deploying them.

## What Is Application Security Testing?

Application Security Testing (AST) is the process of making code more resistant to attack by verifying the absence of known vulnerabilities. Applying security testing practices to all areas of your application's stack and software development life-cycle can decrease the risk of an incident. Security testing began with manual source code reviews, but that’s no longer feasible in most cases.

Automated testing with AST tools is a necessity today, for several reasons. These include the complexity of applications, especially web-based and mobile software; the frequent use of third-party components; time-to-market pressures; and the seemingly infinite universe of known attacks.

## The Importance of Security Testing

You can never completely eliminate risk for your application, but you can use AST tools to greatly reduce that risk. It’s much less difficult and less expensive to detect and fix security flaws early in the development cycle than it is in production.

Security testing tools also keep you current because they’re regularly updated to check for the latest known vulnerabilities. This is especially important considering that [2021 saw a record number of zero-day vulnerabilities](https://www.zero-day.cz/).

Compared with time consuming code reviews and conventional unit and system test, AST tools provide much more speed and convenience. AST tools also classify and triage test results, helping you quickly identify the most serious vulnerabilities.

Because they automate testing, software security tools scale well, and ensure repeatable results. AST tools also extend the breadth of security coverage by checking for new classes of vulnerabilities you previously might not have considered. Depending on your industry, there may be cases where you must perform security testing for regulatory and compliance reasons. And perhaps most important of all, AST tools help you think the way attackers do.

Unlike source code reviews, AST tools work at every stage of an application’s lifecycle. This extends security testing throughout your organization, regardless of whether you’re on a development, devops, or IT management team.

## Types of Application Security Testing

### Static Application Security Testing

Static application security testing (SAST) tools examine code to detect possible vulnerabilities. SAST tools are a form of *white-box* testing. In the white-box model, a test tool has access to all aspects of an application’s structure, including its architecture and source code. Armed with this inside knowledge, SAST tools can spot design flaws, identify logic problems, and verify code correctness. These tools optionally may perform negative testing as well, offering illegal values to test input validation and exception handling.

SAST tools run automated scanning of source code, byte code, or compiled binaries, or some combination of these. The central tenet of all SAST tools is that they examine code at rest. Because SAST tools use a white-box model, they can analyze virtually any aspect of software, including individual functions, classes, and entire applications.

Most AST tools, including SAST products, compare code against libraries of known vulnerabilities such as the [Common Vulnerability and Exposures (CVE) list](https://cve.mitre.org/cve/) or [VulnDB](https://vulndb.cyberriskanalytics.com/). A SAST tool that checks for vulnerabilities in this way might search for coding errors that could lead to privilege escalation, memory leaks, buffer overflows, and other faults.

Example SAST products include [AppScan Source](https://www.hcltechsw.com/appscan), [Checkmarx SAST](https://checkmarx.com/), [Coverity SAST](https://www.synopsys.com/software-integrity/security-testing/static-analysis-sast.html), [Klocwork](https://www.perforce.com/products/klocwork), and the open-source [Insider](https://github.com/insidersec/insider) and [LGMT](https://lgtm.com/) projects.

### Dynamic Application Security Testing

Dynamic application security testing (DAST) tools examine applications while they’re running. In contrast to SAST tools, DAST takes a “black-box” approach, where the test tool has no visibility into application architecture or coding. Instead, DAST tools must discover vulnerabilities through externally observable means.

One popular technique employed by DAST tools is the use of fuzzing. This is the practice of deliberately providing software with unexpected or illegal values, often at high rates and/or in high volumes.

Consider the example of network routing software. A fuzzing tool might bombard routing software with illegal and constantly iterating values for every field in the [IP header of every packet](/docs/guides/how-to-understand-ip-addresses/#what-is-an-internet-protocol). Fuzzing tests often expose memory leaks or trigger hangs and reboots. They represent an excellent way to detect problems relatively early in development.

Examples of DAST tools include [Acunetix](https://www.acunetix.com/plp/dast/), [AppSider](https://www.rapid7.com/products/appspider/), [CheckMarx AST](https://checkmarx.com/product/application-security-platform/), [GitLab](https://about.gitlab.com/enterprise/), [InsightAppSec](https://www.rapid7.com/products/insightappsec/), [Stackhawk](https://www.stackhawk.com/product/), and [Veracode](https://www.veracode.com/products/dynamic-analysis-dast).

As with SAST tools, most DAST products check software integrity against a known set of vulnerabilities and exposures. An interesting, but less common, method is to use a so-called anomaly-based approach, where a test tool monitors application traffic to determine a normal baseline, and then logs behavior outside that baseline.

[Project Ava](https://research.nccgroup.com/2019/06/20/project-ava-on-the-matter-of-using-machine-learning-for-web-application-security-testing-part-7-development-of-prototype-3-adventures-in-anomaly-detection/) represents an example of the anomaly-based approach.

While DAST tools work with any type of software, a subset of tools focuses on web application testing. These tools may use some combination of SQL injection (described in detail below), spoofing, cross-site scripting attacks, URL manipulation, password cracking, and other web-specific vulnerabilities.

Example products include [Detectify](https://detectify.com/), [Invicti](https://www.invicti.com/), [Nessus](https://www.tenable.com/products/nessus), [Portswigger](https://portswigger.net/), and the [OWASP Zed Attack Proxy (ZAP)](https://owasp.org/www-project-zap/).

### SQL Injection Testing

SQL injection test tools exist as a standalone category because injection attacks are so common, especially against web-based applications. SQL injection attacks work by inserting, or “injecting", data into SQL queries to compromise a target database.

For example, a successful SQL injection attack modifies a database by adding, updating, or deleting fields. It may expose personally identifiable information (PII) such as credit-card numbers or medical records. In some cases, SQL injection attacks also send commands to the underlying operating system.

Because SQL injection attacks are so common, numerous tools exist to automate testing of this class of vulnerabilities. Some examples include [SQLMap](https://sqlmap.org/), [jSQL Injection](https://github.com/ron190/jsql-injection), and [BBQSQL](https://github.com/CiscoCXSecurity/bbqsql). Another open-source tool, [NoSQLMap](https://github.com/codingo/NoSQLMap), automates testing of code-injection vulnerabilities in NoSQL databases such as [CouchDB](/docs/guides/install-couchdb-20-on-ubuntu/) and [MongoDB](/docs/guides/mongodb-introduction/).

### Software Composition Analysis

Software composition analysis (SCA) tools examine every component and library used by an application, including third-party software. SCA test tools help detect problems in the open-source components or libraries found in the vast majority of networked applications.

SCA testing uses a hybrid of SAST and DAST approaches. One caveat with SCA tools (and indeed, with any AST tool that uses a set of known vulnerabilities) is that they cannot detect problems they don’t know about. For example, SCA tools cannot detect problems in proprietary libraries developed in-house. Still, SCA tools are invaluable not only to identify vulnerabilities but also for risk management and license compliance needs.

Vendors of SCA tools include [Contrast Security](https://www.contrastsecurity.com/knowledge-hub/glossary/software-composition-analysis), [Fossa](https://fossa.com/product/open-source-license-compliance), and [Revenera](https://www.revenera.com/software-composition-analysis/business-solutions/open-source-vulnerability-management).

### Mobile application Security Testing

As the name suggests, mobile application security testing (MAST) tools look specifically for vulnerabilities in software built for mobile devices. Attackers may target a mobile device’s operating system, or its applications, or both. Some tools focus on apps on mobile devices, while others test back-end services such as cloud platforms and databases.

Some examples of MAST tools include [Fortify on Demand](https://www.microfocus.com/en-us/cyberres/application-security/fortify-on-demand), [NowSecure](https://www.nowsecure.com/products/nowsecure-platform/), and the open-source [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) project.

### Runtime Application Self-Protection

Runtime application self-protection (RASP) tools work in production settings by analyzing application traffic and user behavior. RASP uses a hybrid of SAST and DAST approaches, analyzing both source code and live binaries to identify attacks as they happen, and block attacks in real time. For example, a RASP tool may identify an attack that targets a specific API, and then block access to that API. RASP tools also log attempted exploits to external security event and information management (SIEM) systems, allowing for real-time notification.

Example products include [Fortify](https://www.microfocus.com/en-us/cyberres/application-security), [Imperva](https://www.imperva.com/products/runtime-application-self-protection-rasp/), [Signal Sciences](https://www.signalsciences.com/products/rasp-runtime-application-self-protection/), and [Sqreen](https://docs.sqreen.com/compatibility/rasp-compatibility-matrix/).

## Security Testing Best Practices

The list below includes five ways that you can make optimal use of AST tools.

- **Shift left**. Even with modern software development practices, it’s still common for security testing to begin well after initial coding starts. This is often due to development and test teams working in separate silos. It’s far safer and more efficient to integrate security testing into every development phase – that is, to shift left on project timelines. By shifting left you can reduce bug count, increase code quality, and lessen the chance of discovering critical issues later on during deployment. Security testers should be involved in initial planning, and should be an integral part of any development plan.

- **Don’t trust third-party code**. Virtually all networked applications today include third-party components. [As a famous comic wryly observed](https://xkcd.com/2347/), modern infrastructure today might well depend on, “a project some random person in Nebraska has been thanklessly maintaining since 2003.” There are many excellent third-party components available, but the onus is on development teams to ensure any outsourced code is free from known vulnerabilities and kept up to date. SCA tools should be an essential part of any AST toolkit.

- **Integrate patch management into CI/CD processes**. With the proliferation of zero-day vulnerabilities, it’s no longer sufficient to task IT managers with patch management, the practice of continually updating software to guard against newly discovered attack vectors in software. Certainly patch management is important in production settings, but it’s also critical in earlier stages of the software lifecycle. [Continuous development and integration (CI/CD)](/docs/guides/introduction-ci-cd/) teams need to include patching as part of their development processes, and ensure vulnerabilities are mitigated as soon as they’re discovered. This is particularly true when incorporating third-party components such as open-source libraries; those also need to be patched as soon as those projects announce fixes for known vulnerabilities.

- **Think negative thoughts**. Especially in early-stage unit testing, it’s all too common to design tests that merely verify a component works as intended. Attackers don’t think this way, and neither should developers. Negative testing – presenting applications with unexpected values – should be part of every test plan.

- **Use all the tools**. Information security depends on defense in depth, the concept of employing multiple safeguards to ensure no one component’s failure leads to compromise. In an AST context, this means integrating multiple types of security testing tools into the development process. As aforementioned, there are a wide variety of tools available. Developers, devops teams, and IT managers can greatly improve code security by learning to use these tools, and by implementing them through the application lifecycle.

## Conclusion

To reduce the risk of malicious attacks on your applications, it's important to use application security testing tools to mitigate any vulnerabilities. This guide covered some of the most important areas of AST, like static application security testing, dynamic application security testing, and SQL injecting testing. These areas help cover security throughout an application's technology stack and the software development lifecycle. See the [security basics](/docs/guides/security/basics/) section our documentation library to learn more about security best practices in information technology.




