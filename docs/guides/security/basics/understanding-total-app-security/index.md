---
slug: understanding-total-app-security
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-21
modified_by:
  name: Linode
title: "Understanding Total App Security"
h1_title: "h1 title displayed in the guide."
enable_h1: true
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

In the previous blog post [LINK] we discuss the need for automating application security and moving “left” towards the earliest possible moment in the application development life cycle to ensure the most secure code. In this post, we talk about ways to approach coding your app more critically, and outline some of the more common security weaknesses and coding errors that could lead to subsequent problems.

One way to keep aware of the software vulnerabilities that attackers are likely to exploit is MITRE's annual Common Weakness Enumeration (CWE) Most Dangerous Software Weaknesses list. MITRE tracks these by assigning them a number that indicates their severity and how likely it is that each may occur.
Below are two of the top mentions in MITRE's 2020 CWE top 25 list along with links to the Open Web Application Security Project (OWASP) descriptions for more information.
Cross-site scripting
SQL injection
Let’s review how each attack happens and what you can do to prevent them.

Cross-site scripting

Cross-site scripting attacks got their start way back in 2005 with the Samy worm, which infected MySpace websites and was named for its author, then 20 year old Samy Kamkar. Back then, web browsers didn’t check for these kinds of tricks with HTML coding, and we have been paying the price ever since. The worm propagated so quickly and defaced so many websites that MySpace (what was then the web’s fifth largest destination) had to take down its servers to remove it.

The attacks occur when code is injected into a web form and the server doesn’t check the input. Then the new script can hijack a user’s session entirely, or deface a website, or redirect a user to a malicious site that is controlled by the attacker. There are different sub-types of XSS, as it is usually abbreviated. But what it comes down to is that a developer should never trust any inputs.

SQL Injection

SQL injection is another one of those exploits that has been around for decades. It is actually a specialized version that combines two kinds of attacks and CWE exploits:
not validating your inputs (sound familiar?) and
OS-related command injections

SQL injections all come down to a lack of understanding of how databases actually work. The issue is that a developer doesn’t check to see the origins of any database query, and assumes all queries are coming from trusted sources, such as the database server itself. But this isn’t always the situation, and an attacker – or even a curious teenager – can take control over a local web server and enter a few commands. This turns out not to be all that difficult. And this is the reason why the attack is popular and so evergreen. The hardest part with this type of attack is finding the right place to enter these commands. What makes this not much of a challenge is that you don’t need anything other than your web browser to pull this off. And all you need is to craft the right string of keywords to search for and find where to enter the commands.  There are two situations where the web and database servers intersect that are relevant here:
Places that directly enter database parameters into the URL string itself, or
Fill-in forms on web pages that will take this information and pass it along to the database server via the HTTP POST command.
If you think about this for a moment, there are probably dozens, if not hundreds or thousands of places across your various web applications that fit these two scenarios. Can you manually test them all to make sure you did everything possible to lock things down? Probably not.
SQL injections are just one of many types of code injection and scripting problems. To stop these, lockdown your database servers and remove any backdoors. Make sure you validate all of your input scripts and strings that are sent to your database, examine all of your access rights and user permissions, especially administrative passwords, and restrict web-based apps so they can’t access your entire stored procedure libraries.
Recommended reading/instruction

Before you go out and purchase or download any protective tool to help with your application security (ED NOTE: which will be the subject of my last blog), take a look at the courseware and accompanying book by Tanya Janca. The book is called Alice and Bob Learn Application Security and it is both a crash course for newbies, as well as a refresher for those that have been doing the job for a few years. Her rough organizing framework for the book has to do with the classic system development lifecycle in use for decades.

For more directed learning than an online class can provide, Janca offers a sequence of three classes called Application Security Foundations. There’s an option to interact directly with Janca for 30 minutes and it  is certainly worth it.

The first course is for beginning developers. If you have more experience, focus on the third class. The second class goes into more detail about how to create a culture at your organization where appsec is part of everyone’s job. If you don’t manage a development team, return to this class later on.

Janca’s sequence is laser focused on application security for developers and should be a serious choice for expanding your knowledge.

There are other sources for online instruction, including app sec classes at Coursera, OWASP and SANS.
