---
slug: open-source-vs-closed-source
description: 'Comparing open source vs. closed sourced software? Discover the definition for each and the differences that define the two terms.'
keywords: ['open source versus closed source','open source vs. closed source','difference between open source and closed source ']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-21
modified_by:
  name: Linode
title: "Open Source vs. Closed Source: What’s the Difference?"
title_meta: "What is the Difference Between Open Source and Closed Source?"
authors: ["Steven J. Vaughan-Nichols"]
---

## What is Open Source?

In the beginning, back when Remington Rand’s Univac 1, the DEC PDP-1, and IBM System 360 ruled the computing world, all software was *open-source* software. This means that anyone could take the source code and modify and improve it to meet their own needs. Early software was created by government agencies and schools. In the interest of getting programs up and running they’d share their source code either with programmer to programmer swaps or via user groups such as IBM Share and DEC DECUS.

As time passed, several events came together, which led to the rise of proprietary software. First, as computers became more standardized, original equipment manufacturers (OEMs) began bundling software with their hardware. Typically the price of the software was included with the computers. Then, 1969’s United States vs. IBM antitrust suit ruled that it was anticompetitive for IBM to give away its software. This was followed by the 1974 US Commission on New Technological Uses of Copyrighted Works (CONTU) which decided that computer programs could be copyrighted. Combine this with the growing cost of developing software, and conditions were ripe for a new kind of business: Selling closed-source, proprietary software.

During the 1950s through the early 70s, source code was always included with an operating system or program, and users were only given binaries. Since then, if you ask most people what a program is they describe something that requires a mouse click, a touch, or at most, entering a single word command to run.

That’s fine for users. For programmers, it was another story. Instead of sharing the load of developing software, they had to reinvent the wheel over and over again as each company pursued its own way of solving common development problems.

One developer who was especially annoyed at closed-source software was MIT’s Richard M. Stallman. He created a new legal approach, the GNU Public Library (GPL) for what he called “Free Software.” This framework would prove the launch-pad for open-source software.

Over the last 30-years, open-source software made a comeback. First, the rise of the commercial Internet and web made it easier for developers to work together. Then, open-source programs such as the Linux operating system and the [Apache HTTP Server](/docs/guides/web-servers/apache-tips-and-tricks/) showed that this kind of software could be far cheaper, better, and more secure than their closed-source rivals.

Since then, many popular end-user programs such as Firefox, LibreOffice, and Thunderbird often replace, or rival, closed-source programs such as Internet Explorer, Microsoft Office, and Outlook.

While open-source software is successful for desktop users, where it really shines is in server and service software. Today, even on the Microsoft Azure cloud, Linux, not Windows Server, is the most popular operating system. Almost all cloud computing services operating systems, Infrastructure-as-a-Service (IaaS), Software-as-a-Service (DaaS), and databases, are based on open-source software. Without open-source software, there would be no cloud computing.

### Open Source Pros and Cons

Why is open-source so successful? It starts with developers wanting to improve the programs they use. As Eric S. Raymond puts it in his seminal open-source work, The Cathedral and the Bazaar, "Every good work of software starts by scratching a developer's personal itch."

It’s more than personal though. By improving any program, everyone who uses it gets a better version. Open-source developers and companies instead of competing with each other, cooperate with each other. The idea is that a rising sea makes all ships rise. They still compete with each other, but if everyone’s software is fundamentally better, everyone benefits. Except, of course, for those building closed-source software.

Besides improving quality, this cooperation also drops the cost of developing software. If you and twenty other people from five different companies are all working on the same problem, every business cuts their programming costs.

Generally speaking, open-source software is more secure than its closed-source rivals. That’s because, as Raymond puts it in what he called Linus’s Law, "given enough eyeballs, all bugs are shallow."

Open-source software also has the advantage that it never runs out of support. A company can go out of business, but the code is still available, and if there’s enough interest in the program someone else picks it up and keeps it going. If you have skilled programmers on staff, you can do it yourself.

Last, open-source software is cheap. If you don’t need support, it’s often free.

There are very few problems with the open-source approach. In the case of some less well-known programs, you may have trouble finding end-user support.

In some cases, you may find it hard to find and fix problems with open-source programs. That’s because many developers do a poor job of reporting on exactly what open-source code they use in their programs. To combat this problem, open-source groups support Software Bills of Material (SBOM). An SBOM spells out exactly what software libraries, routines, and other code has been used in any program. Armed with this, you can examine what component versions are used in your program. Of course, with closed-source programs, you never know what went wrong.

## What is Closed Source?

Closed-source software is the exact opposite of open-source software. Instead of having access to the source code, all you get is the black box of the binary code.

Some of the most well-known programs written in closed source include Microsoft Office, games such as Fortnite, Call of Duty, and Grand Theft Auto, and essentially all Apple software.

Despite the benefits of open-source approaches, the vast majority of personal and end-user software is written with proprietary code. It’s an entirely different story when it comes to server-level and service programs. There, open-source software rules.

### Closed Source Pros and Cons

For its makers, closed-source software is more easily profitable. They sell, or increasingly rent you a subscription, you use the program, and they get paid.

When you get a closed-source program, you get a single vendor to turn to for all your support needs.

Generally speaking, closed-source programs have better interfaces. Because, unlike open-source software, they expect you to pay in advance for their program. For this reason, the software should look as good as possible and have well-thought out user experiences.

On the other hand, closed-source is more insecure than its open-source brethren. For example, every month Microsoft must release new security fixes, Patch Tuesday, for all its programs' most recently discovered flaws.

Closed-source software is also more expensive than open-source software. There are almost no free closed-source programs.

Once you’re using a closed-source program, you have few, if any, options to modify it for your specific needs. What you see is what you get.

## The Difference between Open Source and Closed-Source Software

These are two fundamentally different approaches to creating software. Here are the important differences:

1. You can modify open-source programs. You can’t change closed-source ones.
1. Open-source software tends to be free or inexpensive. Closed-source software is more expensive. If you must pay for open-source software support, it may be less expensive.
1. There are no user or CPU licensing restrictions on open-source software. Closed-source programs always have user and/or CPU licensing fees and restrictions.
1. Generally speaking, open-source software is more secure than closed-source programs. But, security is not a product, it’s a process. Both kinds of programs are vulnerable to attackers.
1. Open-source programs are constantly evolving and improving. Closed-source ones tend to change at a slower pace. If you’d rather stick with the tried and true, many major open-source programs have long-term support (LTS) versions, so you don’t need to be constantly updating them.
1. Closed-source programs may go out of date so you have no choice but to upgrade to another version. For example, Windows 7 users had to migrate to Windows 10. Open-source programs may go out of date, but you can continue to run older versions.
1. Unless you buy a support contract for an open-source program, you’re on your own. There is, however, free community support for most programs. With closed-source programs, some support is usually bundled into the price.
1. With open-source programs it can be hard to determine who’s responsible for patching your software. With closed-source software, you almost always have a single vendor to talk to if you run into a problem.

## Conclusion: Open-source Software for the Win

There are some occasions when closed-source software is better. For example, if you use Adobe Photoshop extensively in your business, for better or worse, you’re going to be using this closed-source program. While there is a good open-source graphical editor, GIMP, it doesn't have Photoshop’s vast software ecosystem.

When you’re using the cloud, open-source software runs the world. There are some proprietary programs that run off the cloud, such as Microsoft 365. Except for these end-user programs, everything else worth considering is based on open source.

Linode knows this well. Linode’s Open Cloud is 100% based on open-source programs and protocols. For example, the Linode application programming interface (API) is completely open and free. You can build your apps and infrastructure on top of it with confidence and without sacrificing your freedom.

While all cloud providers rely on open-source software, Linodes support all open-source distros. The company doesn't offer closed-source forks.

Linode doesn't just make use of open source. They’re open-source developers as well. Linode’s Manager, CLI, and product and API documentation are all on [Github](https://github.com/linode/) and open source.
