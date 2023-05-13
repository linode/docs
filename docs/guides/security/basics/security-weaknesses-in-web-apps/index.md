---
slug: security-weaknesses-in-web-apps
description: "This guide provides an overview of cross-site scripting and SQL injection exploits, as well as how they happen and what you can do to prevent them."
keywords: ['web app security']
tags: ['security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-21
modified_by:
  name: Linode
title: "Common Security Weaknesses in Web Applications (XSS and SQL Injections)"
title_meta: "Common Security Weaknesses in Web Applications"
aliases: ['/guides/understanding-total-app-security/']
authors: ["David Strom"]
---

The [Why Security Automation is Needed for Today’s Modern Business](/docs/guides/security-automation-business) guide discusses the need for automating application security. Many developers are [moving “left” towards the earliest possible moment](https://tldrsec.com/blog/score-bot-shift-left-at-scale/) in the application development life cycle to ensure the most secure code. This guide discusses ways to approach coding your app more critically. It also outlines some of the more common security weaknesses and coding errors that could lead to subsequent problems.

One way to keep aware of the software vulnerabilities that attackers are likely to exploit is [MITRE's annual Common Weakness Enumeration (CWE) Most Dangerous Software Weaknesses](https://cwe.mitre.org/top25/archive/2020/2020_cwe_top25.html) list. MITRE tracks these by assigning them a number that indicates their severity and how likely it is that each may occur.

Below are two of the top mentions in MITRE's 2020 CWE top 25 list along with links to the Open Web Application Security Project (OWASP) descriptions for more information.

- [Cross-site scripting](https://owasp.org/www-project-top-ten/2017/A7_2017-Cross-Site_Scripting_(XSS))
- [SQL injection](https://owasp.org/www-project-top-ten/2017/A7_2017-Cross-Site_Scripting_(XSS))

The next sections review how each attack happens and what you can do to prevent them.

## Cross-site Scripting (XSS)

Cross-site scripting attacks got their start way [back in 2005 with the Samy worm](https://betanews.com/2005/10/13/cross-site-scripting-worm-hits-myspace/), which infected MySpace websites and was named for its author, then 20 year old [Samy Kamkar](https://samy.pl/). Back then, web browsers didn’t check for these kinds of tricks with HTML coding. The worm propagated so quickly and defaced so many websites that MySpace (what was then the web’s fifth largest destination) had to take down its servers to remove it.

The attacks occur when code is injected into a web form and the server doesn’t check the input. Then the new script can hijack a user’s session entirely, or deface a website, or redirect a user to a malicious site that is controlled by the attacker. There are [different sub-types of XSS](https://www.csoonline.com/article/3269028/what-is-cross-site-scripting-xss-low-hanging-fruit-for-both-attackers-and-defenders.html), as it is usually abbreviated. But what it comes down to is that a developer should never trust any inputs.

## SQL Injection

SQL injection is another one of those exploits that has been around for decades. It is actually a specialized version that combines two kinds of attacks and CWE exploits:

- not validating your inputs and
- OS-related command injections

SQL injections all come down to a lack of understanding of how databases actually work. The issue arises when a developer doesn’t check to see the origins of a database query, and assumes all queries are coming from trusted sources, such as the database server itself. But this isn’t always the situation, and an attacker – or even a curious teenager – can take control over a local web server and enter a few commands. This turns out not to be all that difficult. And this is the reason why the attack is popular and so evergreen. The hardest part with this type of attack is finding the right place to enter these commands. What makes this not much of a challenge is that you don’t need anything other than your web browser to pull this off. And all you need is to craft the right string of keywords to search for and find where to enter the commands.  There are two situations where the web and database servers intersect that are relevant here:

1. Places that directly enter database parameters into the URL string itself, or

1. Fill-in forms on web pages that will take this information and pass it along to the database server via the HTTP POST command.

There are probably dozens, if not hundreds or thousands of places across your various web applications that fit these two scenarios. Can you manually test them all to make sure you did everything possible to lock things down? Probably not.

SQL injections are just one of many types of code injection and scripting problems. To stop these, lockdown your database servers and remove any backdoors. Make sure you validate all of your input scripts and strings that are sent to your database, examine all of your access rights and user permissions, especially administrative passwords, and restrict web-based apps so they can’t access your entire stored procedure libraries.

## Recommended Resources

Take a look at the book [Alice and Bob Learn Application Security](https://www.amazon.com/dp/1119687357/) by Tanya Janca. The book is both a crash course for newbies, as well as a refresher for those that have been doing the job for a few years. Her rough organizing framework for the book has to do with the classic system development lifecycle in use for decades.

Some sources for online instruction are app sec classes at [Coursera](https://www.coursera.org/courses?query=application%2520security), [OWASP](https://training.owasp.org/), and [SANS](https://www.sans.org/cyber-security-courses/?msc=main-nav).

The next guide in this series,[An Overview of App Security Testing Tool](/docs/guides/app-security-testing-tools), discusses different types of security testing tools with links to various application testing and shielding products.