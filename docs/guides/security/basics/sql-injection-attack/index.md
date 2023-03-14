---
slug: sql-injection-attack
description: 'SQL injection is a type of attack that alters SQL queries. Learn about the different types of SQL injection attacks, how to detect them, and prevention tips.'
keywords: ['sql injection attack','sql injection example','what is a sql injection']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-03
modified_by:
  name: Linode
title: "SQL Injection Attack: What It Is and How to Prevent It"
title_meta: "What is SQL Injection? Attack Examples & Prevention Tips"
external_resources:
- '[Open Web Application Security Project website](https://owasp.org/)'
- '[Wikipedia SQL Injection page](https://en.wikipedia.org/wiki/SQL_injection)'
- '[Netsparker SQL Injection Cheat Sheet](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet)'
- '[OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)'
- '[OWASP Security Code Review guide](https://owasp.org/www-project-code-review-guide/)'
authors: ["Jeff Novotny"]
---

Security is an important issue for all web applications and databases, especially those using the *Structured Query Language* (SQL). Although criminals most frequently focus on high-value targets, even small online applications can be victimized. When important information is stolen or an application is compromised, the financial, logistical, and reputation costs can be severe. Criminals and hackers frequently use a technique named *SQL Injection* (SQLi) to gain unauthorized entry to a remote database. This guide describes a SQL injection attack and explains how it is used. It also discusses how to detect SQLi vulnerabilities and how to defend against them.

## What is a SQL Injection Attack?

A SQL injection attack is an incursion that alters SQL *Queries* with the objective of tampering with a SQL database. It is most often used to attack web applications, but can be used on other systems that host a database. This attack uses a code injection strategy to send malicious SQL queries to the database. Often, these commands are based on legitimate information from the website. SQLi attacks are usually launched to achieve the following:

- View private or restricted information contained in a database, including sensitive personal or financial information.
- Add, delete, or edit information stored in a database. This could include either application data or metadata including the schema or table definitions.
- Gain administrative access to a database, possibly creating a back door for long-term future use.
- Compromise the server by using the database as an access point.
- Launch a denial-of-service attack or incapacitate the database's underlying infrastructure.

Some SQL injection attacks are designed to remain undetected for a long period of time. In this case, the objective is usually to maintain ongoing access and eavesdrop on the database in the future. In some other cases, the hackers want to immediately extract as much information as they can, such as credit card numbers. Their intention is to resell the information or use it for criminal purposes. While the intruders would prefer to go undetected, they do not expect to access the system again. Finally, other attackers only want to inflict damage and take the application offline. They have no need for secrecy.

No matter the purpose of the attack, it can inflict tremendous consequences upon the victimized organization. A SQL injection attack can cause several of the following negative consequences:

- Lead to the loss of corporate secrets, confidential information, and other sensitive data.
- Expose sensitive customer information, including credit/financial information, personal details, or private correspondence.
- Incur direct financial loss due to theft and claims for compensation from users or third parties.
- Generate negative publicity and a public relations crisis.
- Take a web application or other component of a site offline or render it inoperable.
- Hurt customer confidence and make it difficult for the organization to attract new clients and retain existing ones.

Any organization can be targeted, even personal websites and small forums. According to the [*Wikipedia SQL Injection page*](https://en.wikipedia.org/wiki/SQL_injection), the average web application is attacked around four times per month. New exploits are always being developed, and it is difficult to design a truly bulletproof site. However, many hackers target sites indiscriminately using brute force. A database that has been secured through a few basic techniques is much more secure and difficult to compromise.

{{< note respectIndent=false >}}
This guide is intended as an introduction to SQL injections and does not cover every possible type of attack. [Web security](/docs/guides/software-security-best-practices/) is a very complex field, and many possible attacks demand careful consideration. You should consult with web security professionals before launching any application that stores private personal or financial information.
{{< /note >}}

### What is a SQL Query?

SQL is a simple domain-specific programming language used to communicate with a *Relational DataBase Management System* (RDBMS). Database developers use SQL commands to send queries from database clients to the RDBMS. These queries contain commands to insert, update, delete, or read data. Queries are also used to administer the database and update the schema, including table definitions.

During normal operations, web applications incorporate user data into SQL queries and forward them to the RDBMS. For instance, a query might add a new forum user or retrieve information about a category of products. Unfortunately, bad actors can manipulate these queries and cause the application to behave in an unintended or insecure manner.

### Types of SQL Injection Attacks

Most SQL injection attacks fall into one of three categories. They vary in how direct they are and how difficult they are to execute. The three main categories are:

- **Classic (In-Band)**
- **Blind**
- **Out-of-Band**

#### Classic SQL Injection

The classic method attack, also known as an in-band attack, sends altered commands to the database using the regular communication channel. It uses information learned from the response to gain information about the structure or contents of the database. This type of attack is easy to execute and can quickly yield results. It requires less skill, imagination, and programming ability than the other attack types. Many attackers use these techniques in an automated fashion on random sites, trying to find poorly-designed web applications.

For this injection attack, the user adds information to the URL or the fields on a web form in an attempt to trick the database. The assailant hopes the database might transmit sensitive information or provide clues about its internal structure. For example, they might try to trick the database into displaying not only the public entries, but every row in the table.

There are several variations on this method. Error-based SQLi attacks are designed to get the database to transmit error messages that reveal information about its internal schema. Union-based attacks use the SQL `UNION` command to append an additional query to the command. This can cause a database to display extra data. The information gained through a SQL injection attack is frequently used to craft subsequent attacks. A classic attack often takes an iterative approach. The attacking queries are refined until the database is fully compromised.

Classic SQL injection attacks are often more successful with older applications that are built with PHP or ASP. This is due to security gaps and the lack of more advanced programming tools.

#### Blind SQL Injection

This approach is often used when classic attack methods do not work. In a blind attack, the attacker sends a manipulated query to the database and analyzes the response. The attack is considered "blind" because the attacker does not receive any direct information from the server. The attacker can analyze details, such as how long it takes the server to reply, to learn more about the database.

The two most common types of blind SQL injection attacks are the *Boolean Attack* and the *Time-based Attack*. In a Boolean attack, the attacker expects a different response if the query is `True` than if it is `False`. For example, the results might get updated if the query is valid, but stay the same otherwise. The attacker might also be able to deduce some information based on whether they receive an error page or not.

A time-based attack extracts information from the database based on how long it takes the server to respond. The attacker can selectively add delays to the query and calculate the response time. They can also construct commands that take longer to process in some situations compared to others. For example, a time-based attack might initiate a complex calculation for each column in a table. Tables that have more columns take longer to process the query. However, if the processing time exceeds the connection timeout value, the response becomes useless.

Although this type of attack takes more time, forethought, and consideration, it can eventually uncover plenty of information about the database. Therefore, it can be as damaging as a classic attack, even though it is less common.

#### Out-of-Band Injection

Out-of-band attacks are the most complicated and the most difficult to construct. They are less common than the other two types. They do not rely on the behavior of the database. Instead, they receive information through a different channel other than the original web application. For example, they can trigger the database to transmit DNS or HTTP requests to a server under the attacker's control. This is often referred to as a compounded SQL attack.

Some out-of-band attacks might only work if certain features are enabled on the database. For example, the `UTL_HTTP` package must be configured on an Oracle database before it can forward any HTTP requests.

## SQL Injection Attack Examples

Many SQL injection attacks take advantage of SQL keywords and syntax. The object is to use valid queries to get the database to operate in an undesirable manner. The particular details of these dangerous commands vary between the various RDBMS applications. However, most attacks use a few basic methods. The following SQL injection examples demonstrate some commonly used approaches.

{{< note respectIndent=false >}}
Although the core SQL syntax is standardized, the implementation varies between RDBMS applications. The different database applications also offer unique enhancements and features. These might be more or less secure. Some of the following attacks might work on some databases and not others. Consult the database documentation for more details.
{{< /note >}}

### Using Comments

In SQL, the `--` symbol means the rest of the command is a comment. If a user adds a comment indicator to a field it might be incorporated into a dynamic command. This could cause other fields to be ignored.

In the following SQL injection example, a web form might have a field for the `username` and another for the user `password`. The backend of the application validates the login using the following command:

    SELECT * FROM forumusers WHERE username = 'username' AND password = 'password'

If an unprotected dynamic query, a hostile agent could enter the name of another user followed by the sequence `'--`. The quotation mark closes the field while the `--` characters convert the rest of the command into a comment. As a result, the web application sends the following command to the database.

    SELECT * FROM forumusers WHERE username = 'otheruser'--' AND password = 'password'

When the comment is stripped out, the command evaluates to the following.

    SELECT * FROM forumusers WHERE username = 'otheruser'

If no other validation or safeguards are in place, the application might permit the attacker to log in as the other user.

### Using the UNION Command

The `UNION` command is very powerful. It retrieves the intersection of two distinct queries. This can be used to extract additional results from the database, combining an "innocent" query with one requesting sensitive information.

As an example, the original command might be constructed in the following manner.

    SELECT name, price, description FROM products where category ='categoryname'

The attacker might then add the phrase `'UNION ALL SELECT username, password FROM forumusers --` to the end of a product name. This results in the following query.

    SELECT name, price, description FROM products where category ='categoryname' UNION ALL SELECT username, password FROM forumusers

This might result in the login details of all the forum users being dumped onto the attacker's screen along with the product information.

### Using Stacked Queries

In SQL, the `;` symbol is used to separate two queries, which are executed together in the same transaction. This is known as a *stacked query*. This is often a useful feature, but it can cause problems for web applications. If an attacker adds a `'` character to terminate the original field, they can then add `;`, followed by a malevolent command.

For example, the application logic constructs the following command from a user-specified `category`.

    SELECT name, price, description FROM products where category ='categoryname'

Then the user might end their product selection with `'; DROP TABLE forumusers --`. This causes the command to execute the following commands:

    SELECT name, price, description FROM products where category ='categoryname' ; DROP TABLE forumusers

If not detected elsewhere in the application, this command would delete all the user accounts, rendering the forum nearly worthless.

### Using the OR Keyword

Attackers can also use the SQL `OR` keyword to extract additional information. The phrase `+OR+1=1` always evaluates to `True`, so an attacker can use it to access the entire table. It could also be used on the forum login page, which ordinarily generates the following query.

    SELECT * FROM forumusers WHERE username = 'username' AND password = 'password'

The phrase `+OR+1=1` could be inserted, radically altering the command.

    SELECT * FROM forumusers WHERE username = 'username' OR 1=1 --' AND password = 'password'

The expression `1=1` evaluates to `True`. So does `username = 'username' OR True`. This results in an unqualified `SELECT *` statement without any conditionals, which displays the login information for every user.

    SELECT * FROM forumusers

### Other Techniques

Attackers typically iterate through several techniques until they find something that works. They can potentially use a long list of keywords along with numerical and string manipulators. For instance, they can use the SQL `CONCAT` keyword. They can also use the `CHAR` keyword to transmit individual characters as their hexadecimal equivalents. This could bypass validation techniques that are scanning for certain invalid characters. Some commands provide information about the database and its schema, although they differ between the various RDBMS applications.

Several websites provide detailed "cheat sheets" about the most common attacks. One example is [*Netsparker's SQL Injection Cheat Sheet*](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet). It compares and contrasts the various RDBMS systems, so it can be used as a MySQL injection cheat sheet, for example. The Open Web Application Security Project (OWASP) also provides a very detailed and useful [*SQL Injection Prevention Cheat Sheet*](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

## How to Detect a SQL Injection Vulnerability

To ensure a web application is not vulnerable to common web attacks, consider security issues at every stage of the development process.

- During the design specification process, document how to handle security threats.
- At the implementation stage, build common classes or functions to sanitize input and detect suspicious data. Every client should call these routines to ensure every case is covered.
- Develop a strategy for input validation, also known as sanitization, to detect malicious input. All user-provided data should be verified to ensure it is legitimate. At the same time, valid input must still be allowed. See the section on [Preventing a SQL Injection Attack](/docs/guides/sql-injection-attack/#preventing-a-sql-injection-attack) for more information.
- Use established quality assurance techniques and tools to ensure common SQLi attacks are blocked. Build automated test and regression scripts to validate fixes and ensure security holes are not introduced.
- Stay informed about new security issues and emerging threats. Keep the web server and RDBMS updated to the most recent release using the latest security updates.

Applications handling financial information are at an even higher risk of attack, and should consider some additional measures. This increases the development and operational costs but provides an extra level of protection.

- Consider hiring a security firm or consultant. An expert can review the design documents beforehand and run a security audit on the final product. Some firms provide commercial web vulnerability scanners. These scanners can be run anytime during the development process.
- Employ a *web application firewall* (WAF) to detect threats. These applications continually update their list of attack signatures and filter input coming IP addresses with bad reputations. Because these applications are continually updated, they provide a reliable level of ongoing security.

The OWASP has a good [*security code review guide*](https://owasp.org/www-project-code-review-guide/) which covers SQL injection attacks along with other web security issues.

## Preventing a SQL Injection Attack

Several basic coding principles can greatly enhance database security. Most attackers are hoping to find easy targets. If their standard playbook does not work, they are likely to move on to another site. Many of the most obvious safeguards can be used together for increased effectiveness. To reduce the chances of a SQL injection attack, follow the steps below.

- **Use parameterized queries**: This technique uses *prepared SQL* statements to construct the query beforehand. Variables initially take the place of the actual parameters. The actual user-supplied values replace the placeholders later on. This draws a distinction between code and data, and renders many attack techniques much less useful. For example, an attacker cannot comment out the remainder of the query using the `--` sequence. The double dash would be included as part of the `username` field. The database would attempt to locate a user field ending with `'--` and would not find it.
- **Validate all data**: Before accepting any data, verify it is actually valid. This includes rejecting any input using certain characters or certain keywords. Table and column names can be mapped to their actual internal names, which should not be exposed to the customers. Choice control can be used to limit certain selections. For example, a form's design can force a user to select their birth year from a drop-down list. This means any input in this field is guaranteed to be valid.
- **Use stored procedures**: This is an alternative to parameterized queries with the same goal. Stored procedures are saved inside the database, allowing the application to use them at any time. Typically, the procedures automatically parameterize the code. As an added precaution, only a user who has `execute` privileges can run these procedures. Unfortunately, there might be cases where this technique is not completely foolproof. Consult the user documentation for the RDBMS for more information.
- **Use non-standard names for tables and columns**: Many attackers look for standard tables such as `customers` or fields including `username` and `password`. Adding a prefix or suffix to each string or column provides additional protection at the cost of a bit of extra complexity and longer strings for each name.
- **Escape the input fields**: This technique is not considered effective on its own, but provides another layer of protection as part of a total security strategy. Every RDBMS has a method of escaping user-supplied data. This involves recalculating the input so it is treated as pure text, rather than keywords or application-specific symbols. Some applications convert the input characters into their hex equivalents. The PHP programming language, which is often used in conjunction with SQL, also provides tools for escaping SQL queries.
- **Restrict the access privileges of the database user**: Determine the level of access every account requires and configure the user roles accordingly. This limits the damage any individual user can inflict. A similar optimization is to limit the system privileges of the database owner. Even if a user gains access to an administrative account, they cannot use it to gain further access to the server. SQL views can also be used to further limit access. Our guide [SQL Database Security: User Management](/docs/guides/sql-security/) discusses how to develop an access management strategy for an RDBMS.

## Conclusion

A SQL injection attack is a type of security threat where attackers manipulate the data in web forms or in URLs. The main purpose of this attack is to get the database to behave in an undesirable or insecure manner. This might result in the database displaying confidential data or allowing an unauthorized user to modify, add, or delete data. An injection attack can cause a severe loss of reputation and operational or logistical consequences for the victimized business.

The three main types of SQL injection attacks are classic, blind, and out-of-band. The classic method is the most common. The attacker directly assaults the database, submitting malevolent data as part of a query. For example, adding the `--` sequence causes many RDBMS applications to treat the rest of the command as a comment. This might cause important parts of the query to be dropped and allow the attacker to log in as an administrator or another user.

Database operators can protect themselves by considering security at every stage of the development process, hiring a security auditor, or deploying a web application firewall. Several coding defenses including parameterized queries, input validation, and stored procedures can thwart most common attacks. If you are considering deploying a web application that uses a database, consult OWASP's [*cheat sheet*](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) and [*security code review guide*](https://owasp.org/www-project-code-review-guide/).


