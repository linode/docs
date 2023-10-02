---
slug: machine-learning-cyber-attacks
description: 'Common machine learning cyber attacks include evasion, poisoning, and inference attacks. In this guide, learn about each attack and the areas of an ML application they target.'
keywords: ['machine learning cyber attacks','evasion attacks against machine learning']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-20
modified_by:
  name: Linode
title: "The Most Common Cyber Attacks on Machine Learning Applications"
title_meta: "Common Cyber Attacks on Machine Learning Applications"
authors: ["John Mueller"]
---

[Machine learning (ML)](/docs/guides/history-of-machine-learning/) algorithms and models ingest large amounts of data and use pattern recognition to make predictions and adjustments based on that data. ML powers chatbots, product recommendation systems, self-driving cars, and assists in decision-making in the health and financial sectors. Due to the prevalence of tools and frameworks like [TensorFlow](/docs/guides/how-to-install-tensorflow/) and [PyTorch](/docs/guides/pytorch-installation-ubuntu-2004/), developers are now able to add ML to their applications with less effort. Before getting started with machine learning, you should be aware of the most common machine learning cyber attacks. When thinking about the security of your ML application, you must consider the following areas:

- **Data**: If your data is corrupted in any way, you will not obtain reliable our useful results from your machine learning models.
- **Application**: When a model becomes corrupted, even the most perfect data produces incorrect results.
- **Output**: An application only produces the output it’s designed to provide. Altering an application to perform tasks other than what it was designed to perform is a misuse of the application.
- **User**: Even if all of the other security factors for a machine learning application are correct, users can easily thwart machine learning applications through various means, such as purposely providing bad input or misinterpreting the output.

This guide discusses the top security vulnerabilities that you may encounter in a machine learning project. Some of these vulnerabilities are common to all software development projects, while others are unique to machine learning ones.

## Evasion

The evasion attack is the most common issue facing machine learning applications. This attack seeks to modify input data in order to "trick" ML classifiers. For example, a successful evasion attack can insert a malicious algorithm into your application that slightly modifies an image, causing it to be misclassified by the machine learning algorithm. An evasion attack seeks to infiltrate a system in the following ways:

- **Attachment**: An attachment can contain malicious code that executes the moment the file is opened.
- **Link**: The malicious code executes as soon as the resource pointed to by the link is opened.
- **Image**: Viewing an image within a user’s email setup can invoke the malicious code.
- **Spoofing**: A hacker impersonates a trusted party.
- **Biometric**: Using specially crafted code or other techniques, the attacker simulates a facial expression or fingerprint to gain access to a system.
- **Specially crafted code**: It’s possible to train a machine learning model to perturb the output of a target model.

## Poisoning

A poisoning attack is orchestrated by injecting false information into an application’s data stream, with the goal of producing inaccurate results. There are a number of situations where poisoning may occur. Here are the most common:

- Using bad data during model training from unreliable or unvetted sources.
- Providing large amounts of skewed or biased input after model training.

The attacker usually prefers stealth in this case because the goal is not to bring the system down. Instead, the attacker seeks to change the output in a manner that favors the attacker in some way. [SVM classifiers](https://secml.readthedocs.io/en/stable/tutorials/05-Poisoning.html) are often the focus of such attacks because the attacker uses them to perform tasks such as to redraw political or sales boundaries, or to give a particular product an edge during a sales campaign.

## Inference

If a hacker determines which records from a dataset are used to train a machine learning model, that information can be used to look for vulnerabilities. An inference attack uses data mining and analysis techniques to gain knowledge about the underlying dataset. In most cases, the best results come from [overfitted models](https://en.wikipedia.org/wiki/Overfitting). Overfitting happens when a machine learning model follows the original data points too carefully. This makes it possible for the hacker to query a particular data point with relative ease. This attack vector currently works only on [supervised learning models](/docs/guides/introduction-to-machine-learning-training-and-inference#an-introduction-to-training-and-inference) and [Generative Adversarial Networks (GANs)](https://en.wikipedia.org/wiki/Generative_adversarial_network).

As a hacker sends queries to the model, the model makes predictions based on the confidence levels for each class that the model supports, giving the hacker valuable insights into the underlying application. The worst part of this particular attack is that [it’s often used against specific people and their data](https://medium.com/disaitek/demystifying-the-membership-inference-attack-e33e510a0c39), such as their medical records.

## Trojans

A trojan employs various techniques to create code or data that looks legitimate, but is really designed to take over the application or manipulate specific components of it. The concept of using a trojan against an application is old and is used against applications of all stripes. However, in the case of machine learning, the trojan often remains hidden and seeks to discover more about the data used by the machine learning application, rather than performing more overt tasks, such as deleting files. There are many kinds of trojan attacks, but the list below contains some of the most common for machine learning:

- **Backdoor**: Creates a backdoor on the target computer that the hacker can use to remotely control the computer. Remote access allows the hacker to do just about anything desired, including downloading your dataset or model, corrupting a dataset, or causing the model to perform in an unexpected way.
- **Banker**: Focuses on a strategy for obtaining or manipulating financial information. When considering the machine learning aspect of this Trojan, you must think about the sorts of information that this Trojan could obtain, such as membership inference, to obtain data, or evasion, to potentially obtain credentials. However, the goals are always to somehow convince a user to download a payload.
- **Downloader**: Targets systems that are already compromised and uses its functionality to download additional malware. This malware could be anything, so look for any sort of unusual activity that comprises any part of your system, including your data.
- **Neural**: Embeds malicious data into the dataset to create a condition where an action occurs based on an event, like a trigger. In most cases, the attack focuses on changing a neural network's weights to apply to only certain nodes. This kind of Trojan is most effective against Convolutional Neural Networks (CNNs), although current research shows that you can also use it against Long-Short-Term-Memory (LSTM) and Recurrent Neural Networks (RNNs).

## Backdoors

This kind of attack uses system, application, or data stream vulnerabilities to gain access to the underlying system or application without providing required security credentials. The focus is on the neural network itself, rather than on specially prepared inputs. Even though this attack is data based, the attack focuses on corrupting the neural network, as is the case with a trojan. The backdoor attack relies on an attacker modifying training data in some manner to gain access to the model, usually through the underlying neural network. Because this kind of attack is so subtle, a separate application is often required to locate and get rid of it.

## Espionage

An espionage attack involves stealing classified and sensitive data, or intellectual property to gain an advantage over a person, group, or organization. Essentially, this kind of attack involves stealth to [spy on an organization’s activities to obtain a particular result](https://wwwfr.uni.lu/snt/news_events/new_machine_learning_methods_prevent_cyber_espionage). The attack can go on for years because the attacker’s goal is to remain undetected for as long as possible. The results of the attack are normally subtle too, such as redirecting some, but not all, sales to a particular product. This form of attack can target machine learning data and models. It locates the data by using predictive models to look through logs for particular patterns of access.

## Sabotage

Sabotage performs deliberate and malicious actions to disrupt normal processes, so that even if the data isn’t corrupted, biased, or damaged in some way, the underlying processes don’t interact with it correctly. Often, sabotage is highly detectable, but at the moment of detection, it’s already too late to do anything about it. [Financial institutions are particularly susceptible to sabotage](https://gizmodo.com/banks-using-ai-are-ripe-for-russian-sabotage-report-1848687118) due to the incredible amounts of data used to create and manage models. In addition, sabotage is often hard to fix because the underlying data must be remediated first and then the model rebuilt.

## Fraud

Fraud occurs when hackers rely on various techniques, such as phishing or communications from unknown sources, to undermine system, application, or data security in a secretive manner. This level of access can allow for unauthorized or unpaid use of the application and influence ways in which the results are used, such as providing false election projections. Fortunately, there is a lot of research pending that also uses [machine learning techniques to detect and help mitigate fraud](https://spd.group/machine-learning/fraud-detection-with-machine-learning/).

## Conclusion

Before adding ML to your project, you should know about the types of cyber attacks that are frequently targeted at machine learning powered applications. Evasion, poisoning, and inference are some of the most common attacks targeted at ML applications. Trojans, backdoors, and espionage are used to attack all types of applications, but they are used in specialized ways against machine learning. Now that you are familiar with the cyber attacks to look out for, you can get started creating an ML powered application, by [installing TensorFlow on Ubuntu 20.04](/docs/guides/how-to-install-tensorflow/).


