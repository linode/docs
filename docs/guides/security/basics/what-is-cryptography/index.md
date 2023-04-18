---
slug: what-is-cryptography
description: 'What is cryptography in communication? Read our guide to learn more about cryptography in cyber security, how it works, and why it’s important.'
keywords: ['what is cryptography','cryptography definition','cryptographic']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-15
modified_by:
  name: Linode
title: "How Cryptography Enables Secure Communication"
title_meta: "Understanding Cryptography’s Meaning and Function"
authors: ["Pam Baker"]
---

Cryptography is a cornerstone of modern secure communication practices. From digital signatures to disk encryption, these everyday applications of cryptography enable users of the Internet, developers, and business to keep sensitive data private. This guide provides an overview of what cryptography is, a brief history of cryptography, and the differences between symmetric asymmetric encryption.

## What Is Cryptography?

The discipline of cryptography includes the study and practice of transforming data from its original format into an unintelligible format. The goal of cryptography is to keep information secure at rest and during its transfer. In the context of computer science, cryptography focuses on the mathematical concepts and algorithms that keep communications hidden from unauthorized viewers. There are three basic types of cryptographic algorithms that are used: secret key, public key, and hash function algorithms. Data encryption applies the principles of cryptography and refers to the method used to encode data into an unintelligible format.

Cryptography enables cybersecurity professionals to [secure sensitive company information](/docs/guides/cloud-security-checklist/#protect-your-data-and-your-cloud-environment). Well-known examples of cryptographic techniques used in cybersecurity are digital signatures, time stamping, the SSL protocol, and [public key authentication with secure shell (SSH)](/docs/guides/use-public-key-authentication-with-ssh/).

### History of Cryptography

While the use of cryptography in network communications began with the advent of computers, the origins of cryptography extends much further back into history. The earliest known use to date is in an inscription that belonged to a nobleman’s tomb in Egypt in 1900 B.C. The inscriber inserted unusual symbols in place of more common hieroglyphic symbols to transform the inscription. It is widely theorized that this behavior was not intended to hide the inscription, but to make it appear more dignified and educated. However, the original text was transformed much in the same way that cryptography seeks to transform text to keep its original meaning secret.

Early uses of cryptography intended to hide a message date back to numerous early civilizations. Keeping information private has been a consistent need for human societies. One early stage example, [Arthashastra](https://www.worldhistory.org/Arthashastra/), is a classic on statecraft written circa 350-275 BCE. It includes mentions of India’s early espionage service and the “secret writings” used to communicate with spies. Julius Caesar was known to use cryptography to communicate with his army generals in 100 BC, as did numerous other leaders with armies and wars to fight.

According to Britannica, there [are three distinct stages in the development of cryptography](https://www.britannica.com/topic/cryptology/History-of-cryptology) over time. The first is manual cryptography, the second is mechanized cryptography, and the third is digital cryptography.

The first cipher requiring a decryption key was developed in the 16th century. It is known as the [Vigenere cipher](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher) which is described as “a poly-alphabetic substitution system that uses a key and a double-entry table.”

An example of the second stage, that is the mechanization of cryptography, is the [Hebern rotor machine](https://en.wikipedia.org/wiki/Hebern_rotor_machine) which was developed after electricity became available in the 18th century. It embedded a secret key on a rotating disk. Another example is the famous [Enigma machine](https://en.wikipedia.org/wiki/Enigma_machine) which was invented at the end of World War II. It used multiple rotors that rotated at different rates while the user typed. The key was the initial setting of the rotors.

Cryptography was used almost exclusively for military purposes for most of its history. That changed substantially in the early 1970s when IBM customers demanded additional security when using computers. For this reason, IBM developed a cipher called [Lucifer](https://www.ibm.com/ibm/history/ibm100/us/en/icons/cryptography/).

As computer usage increased within government agencies, the demand for less militarized applications of cryptography increased. This began the era of digital cryptography which sought to counter the growing cybersecurity attacks. In 1973, the U.S. National Bureau of Standards (NIST) sought a block cipher to become the national standard. Lucifer was accepted and dubbed the [Data Encryption Standard (DES)](https://en.wikipedia.org/wiki/Data_Encryption_Standard). However, it failed to withstand intensifying brute force attacks as computing and cyber attacks became more powerful. In response, NIST solicited a new block cipher in 1997 and received 50 submissions of possible contenders. NIST chose Rijndael in 2000 and renamed it the [Advanced Encryption Standard (AES)](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard).

Although encryption standards exist today, cryptography continues to evolve. The cryptography of the present is anchored to computer science algorithms and mathematics, like number theory.

### Symmetric vs. Asymmetric Cryptography

The two main forms of encryption utilized by cryptography are *symmetric* and *asymmetric*. Symmetric cryptography encrypts and decrypts with a single key. Asymmetric cryptography uses two linked keys, one public and the other private.

Both forms of encryption are used everyday, although most computer users typically don’t notice them. They’re at work in the background every time someone uses their web browser, answers emails, submits a web form, as well as other activities.

People tend to notice cryptography when they initiate its use or directly observe it in use. One example is when using OpenSSL key management services. Another example is when emailing an encrypted document, like an Adobe PDF file that requires a password in order for it to be opened.

Symmetric encryption is the most widely used and the oldest form of encryption. It dates back to Julius Caesar’s cipher. Symmetric encryption uses either [stream](https://en.wikipedia.org/wiki/Stream_cipher) or [block cipher](https://en.wikipedia.org/wiki/Block_cipher) to encrypt plain text data.

While symmetric encryption requires the sender and recipient to use the same key, that key’s use is not limited to two people in a linear conversation. Others can also be designated recipients and use the same key. Likewise, any of the recipients can respond to the sender, plus anyone on the approved list of recipients using the same key from the initial encrypted message.

Thus, if an unauthorized person were to gain the symmetric key, that person could see, read, copy, forward the message to new recipients, and even respond to the original group. Hackers gain access to the key either by pilfering it from a storage space on a device that hasn't been properly secured, or by extracting it from the message itself.

The key must be transmitted when the sender and receiver are not in the same location. It is therefore vulnerable if the network or channel are compromised and must be closely protected.

By comparison, asymmetric cryptography uses two linked keys, one public and the other private, on each side of the conversation or transaction. Both sender and receiver have a private key in their possession alone. Each also has a public key – meaning a unique key of their own made public only by virtue of being exchanged with another person. The sender uses the recipient’s public key to encrypt the file. The recipient then uses their private key to decrypt it. Only the recipient can decrypt the file because no one else has access to that person’s private key. Asymmetric encryption also enables digital signature authentication.

Examples of asymmetric cryptography in everyday use include [RSA](https://csrc.nist.gov/glossary/term/rsa), the [Digital Signature Standard (DSS/DSA)](https://csrc.nist.gov/glossary/term/digital_signature_algorithm), and the [TLS/SSL protocol](/docs/guides/getting-started-with-nginx-part-3-enable-tls-for-https/).

Both forms are considered secure, but the level of security in any given encrypted message has more to do with the size of the key(s) than the form of encryption. Just like passwords, keys must be complex, difficult to obtain, decode, or reveal.

## The Objectives of Cryptography

Cryptography has four major goals: confidentiality, integrity, authentication, and non-repudiation. Put another way, the goals are data privacy (confidential treatment), data authenticity (verified source), and data integrity (original and unaltered message). Non-repudiation refers to the combination of each of these three things to prove undeniable validity of the message or data. One example of non-repudiation in use is a service used to authenticate digital signatures and to ensure that a person cannot reasonably deny having signed a document. Some popular examples are [DocuSign](https://www.docusign.com/) and [PandaDoc](https://www.pandadoc.com/).

Of these goals, confidentiality carries the most weight. The need to ensure that an unauthorized party cannot access the data is the ultimate objective of cryptography. That does not mean that the remaining goals are of less importance.

Data integrity is vital to ensure that the message has not been altered in some way. Otherwise, the receiving party could be manipulated into taking a wrong or undesirable action. Whether a spy is sending a message to their country’s leadership, or a company is sending instructions to a field office, both sender and receiver need assurance that the message sent is identical to the message received.

Authenticity is essential to ensure that the user or system is known and trusted. Establishing the identity of the user (sender or recipient) is the crux of this assurance. However, the system must also be known in order to [prevent ransomware attacks](/docs/guides/ransomware-attack) that involve phishing (fraudulent emails), vishing (fraudulent voice mails and phone calls), smishing (fraudulent texts), and other deceptive forms of communication.

## Types of Cryptography

There are three types of cryptography: secret key cryptography, public key cryptography, and hash functions.

The least complicated and fastest to use is secret key cryptography, also known as symmetric cryptography. This type uses one key to encrypt and decrypt communications. It protects data at rest and data in transit, and is most often used on data at rest. The most well-known algorithms used in secret key cryptography are [Advanced Encryption Standard (AES)](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), [Triple Data Encryption Standard (3DES)](https://en.wikipedia.org/wiki/Triple_DES), and [Rivest Cipher 4 (RC4)](https://en.wikipedia.org/wiki/RC4).

Public key cryptography, or asymmetric cryptography, uses two keys on each end of the communication. Each pair consists of a public and a private key. Public keys are exchanged between sender and recipient. The sender then uses the recipient’s public key to encrypt the message. The recipient uses their private key to decrypt the message. Examples of public key use are plentiful in just about any communication over the Internet such as [HTTPS](/docs/guides/introducing-http-2/), [SSH](/docs/guides/connect-to-server-over-ssh-on-linux/), [OpenPGP](https://www.openpgp.org/), [S/MIME](https://en.wikipedia.org/wiki/S/MIME), and a [website’s SSL/TLS certificate](/docs/guides/what-is-a-tls-certificate/).

The math connecting public and private keys makes it impossible to derive the private key from the public key. However, the public key is derived from the private key, which is why private keys should never be shared.

Hash functions are one-way functions and completely irreversible. This renders the original message unrecoverable. A hashing algorithm produces unique outputs for each input. Examples include [SHA-256 and SHA3-256](https://en.wikipedia.org/wiki/Cryptographic_hash_function#Cryptographic_hash_algorithms), both of which change any input into a new and complex 256-bit output. Bitcoin, the largest and best known of the cryptocurrencies, uses SHA-256 cryptographic hash function in its algorithm. Almost all passwords are stored securely as hashed functions which are then used to verify the correct password is being used. A hacker must try every input possible to find the exact same hash, which renders the effort useless.

## What is Cryptography in Cyber Security?

Modern cryptography is based on mathematical theory and computer science. It continues to evolve as computing becomes more powerful. For example, [quantum computers will break today’s encryption](https://www.verizon.com/about/news/quantum-computing-encryption-standards) standards in the foreseeable future. Computer scientists are already hard at work developing quantum-safe algorithms and security protocols. Whatever the solutions turn out to be, they’ll be built based on the laws of physics and the rules of mathematics.

Both now and in the future, cryptography is central to cybersecurity efforts. Whether it is protecting data points and documents across communication channels, or large data sets in transit or at rest in storage and on devices; cryptography is the first line of defense. Nothing is fool-proof, and therefore all things in cybersecurity, including cryptography, must evolve to match increasingly sophisticated threats and evermore powerful computers.

To understand the necessity of encryption, one need only to look at the headlines. The frequency of data breaches and intercepted or leaked messages is readily apparent. In February 2022 alone, more than 5.1 million records were breached, according to research by [IT Governance](https://www.itgovernance.co.uk/blog/list-of-data-breaches-and-cyber-attacks-in-february-2022-5-1-million-records-breached).

The central assumption with cryptography is that other parties are going to try to breach data and many are going to be successful. Encryption is meant to thwart their efforts even if they succeed in reaching the data. It is an essential line of defense in cybersecurity architecture and hinders an attacker’s efforts to access sensitive information.

Other forms of cybersecurity focus on other fronts such as protecting the network, limiting or stopping access to data, and protecting data from manipulation, i.e. deliberate corruption of meaning or readability.

[Layers of different cybersecurity methods](/docs/guides/cloud-security-checklist/) work in tandem to provide a better, stronger defense. Even so, encrypting data is a primary defense used across all efforts in protecting data. Its use is of particular value to secure communications which by necessity must be shared with parties beyond secure company walls.

## Conclusion

Cybersecurity and encryption are tasks that require research, time, and effort in order to be effective. Many companies prefer to leverage the efforts of vendor teams rather than overburden their internal cybersecurity teams to develop these additional layers of protection. However, there are many tools available to encrypt areas of your infrastructure and network. For example, you can use [LUKS to encrypt a Linux server's filesystem disk](/docs/guides/use-luks-for-full-disk-encryption/). Similarly, you can use [GPG keys to send encrypted messages via email](/docs/guides/gpg-keys-to-send-encrypted-messages/).

