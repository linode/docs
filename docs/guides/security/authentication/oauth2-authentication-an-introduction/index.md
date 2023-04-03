---
slug: oauth2-authentication-an-introduction
description: 'This guide provides an introduction to Oauth2 authentication, flows, scopes, and libraries.'
keywords: ['What is Oauth2','How does Oauth2 work','Oauth2 flow','Oauth vs oauth2']
tags: ['python', 'security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-22
modified_by:
  name: Linode
title: "What Is OAuth2 Authentication?"
title_meta: "An Introduction to OAuth2 Authentication"
external_resources:
- '[OAuth2 website](https://oauth.net/2/)'
- '[OAuth2 libraries](https://oauth.net/code/)'
authors: ["Jeff Novotny"]
---

[*OAuth 2.0*](https://oauth.net/2/) is an authorization protocol that helps application users securely share access to their accounts. For example, with the help of OAuth 2.0, a social media app user can securely share their email contacts with the app. Providing account details directly to the application is highly problematic from the perspective of web security and privacy. OAuth2 allows users to grant limited access to their accounts with third-party applications without sharing any passwords. This guide discusses how OAuth2 works and compares it to other authorization frameworks.

## What is OAuth2?

OAuth release 2.0 has become the tech industry's open standard for authorization and access delegation. It allows for some degree of flexibility and leaves many decisions up to the individual implementations. Security flaws have been discovered in some of these libraries, but OAuth2 best practices can reduce the risk of these problems.

The OAuth process allows users to authorize web applications to access their accounts without sharing login or password details. Authorization details are handled by the site hosting the account, not the site requesting the access. This is why OAuth is known as an authorization protocol, not an authentication protocol. This process is also known as *secure delegated access*. OAuth is application-centric. This means permissions are granted to a specific client application rather than being attached to a particular user.

The service uses OAuth to dispense *access tokens* containing account permissions to third-party applications. This token can then be used to directly access the actual account information. OAuth is specifically designed to work with the *Hypertext Transfer Protocol Secure* (HTTPS) protocol. It uses the *Secure Sockets Layer* (SSL) to ensure data and tokens remain safe during transmission.

## Benefits of OAuth2 Authentication

OAuth2 features some advantages over other more complex protocols. The current release has evolved and matured in comparison to the original OAuth protocol. Some advantages include the following:

- OAuth's token-based method is more secure than sharing password details directly with third-party applications.
- It gives the user more control over what information they are sharing.
- OAuth2 allows users to revoke their access tokens if they want to disable access.
- It is supported and recommended by many large tech organizations such as Facebook, Microsoft, and Google. Some of these sites require the use of OAuth 2.0 to access account information.
- OAuth2 can be used to access secure RSS or ATOM feeds, which had been difficult to access before.
- OAuth2 is flexible and can be used by web, desktop, and mobile applications.
- It is compatible with *Single Sign-On* (SSO) systems and authentication protocols.
- It is relatively easy for developers to implement. Many third-party OAuth libraries are available.

### OAuth vs OAuth2

OAuth1 was originally based on *Flickr's authorization protocol* and *Google's AuthSub* utility. OAuth2 completely overhauled the first release of OAuth and should be thought of as a completely new protocol. Here are some of the major differences between the two releases:

- OAuth1 and OAuth2 are not compatible.
- OAuth2 is designed to simplify some sections of the original protocol that developers found confusing.
- OAuth1 uses cryptographic techniques and digital signatures to verify message integrity, whereas OAuth2 bases its authorization mechanism around access tokens. Cryptographic techniques are more secure, but also more difficult to implement. However, tokens can be copied or even stolen under certain circumstances.
- OAuth2 uses HTTPS and TLS to handle security, whereas OAuth1 was more protocol agnostic. This means release 2.0 is more dependent on its transport protocols.
- The tasks of account verification and resource handling are decoupled in OAuth2.
- OAuth2 is more flexible than OAuth1, and can now handle applications other than web clients.

Overall, there is a tradeoff between the two releases. OAuth2 is easier to use but is slightly less secure.

## OAuth2 Definitions

The OAuth2 protocol introduces a substantial amount of new terminologies. Some of the key terms are described in this section.

### OAuth2 Scopes

In OAuth2 terminology, a *scope* specifies the level of access the client is requesting. It refers to the information or functionality that the application can access, and whether read-only or write access is allowed. The particular data contained within a scope is referred to as a *claim*.

### OAuth2 Roles

There are four roles defined within the OAuth 2 authorization flow. These roles describe an actor's position within the protocol and the actions they might take.

**Resource Owner:** This role refers to a person or service that grants access to certain aspects of their account. In a typical workflow, this is a user who logs in to one of their accounts via a third-party application. As part of the authorization process, the resource owner can specify a scope to apply to the request.

**Client:** This is the application that is attempting to access the resource owner's account. However, it must obtain permission from the owner before it can make its request. In most cases, clients must pre-register with the target service and obtain a designated client identifier before making any authorization requests. The client must present these credentials when attempting to access any account information.

**Authorization Server:** This server validates the user credentials and provides an access token that can be used to request the resources at some later point.

**Resource Server:** This server hosts the account resources that the client wants to access. Clients must use the resource server's API and submit an access token when making a request. In some cases, this might be the same device as the authorization server, but for popular services, they are usually different.

## How does OAuth Work? A Description of the OAuth2 Authentication Flow

Although the exact OAuth2 flow differs somewhat depending on the application, there are three main sections of the authorization procedure. The approach described in this section is recommended for web server applications where processing takes place internally and code is not externally visible. A brief explanation of single-page or JavaScript applications where the source code is exposed follows the main section.

### Step 1: Client and Resource Owner

In this step, the client asks the resource owner for access and presents them with an authorization request. For example, the web application could provide the user with, or redirect a user to, a URL where they can enter authorization details. The resource owner can then decide whether or not to grant access and specify the scope for the access. The user typically authorizes the request by entering either their account details or a one-time code.

If the authorization request is successful, the target service transmits an authorization code back to the client, typically as part of the redirect URL. The application stores this code for use in the next step of the negotiation.

### Step 2: Client and Authorization Server

When the client receives the code, it asks the service's authorization server for an *access token*. As part of the request, it supplies the authorization code and proof of its own identity. It typically transmits its request in the form of an HTTPS message. As soon as the server validates the information and verifies the client is trustworthy, it sends the client an access token. The client never learns anything about the resource owner's account information.

### Step 3: Client and Resource Server

In the final phase of the negotiation, the client presents the access token to the resource server, and requests access to the protected resource. If the access token is still valid, the server provides the client access to the account within the scope of the access grant.

{{< note respectIndent=false >}}
Single-page applications, including those generated entirely through JavaScript, cannot securely maintain a secret client identity. In this case, the *Proof Key for Code Exchange* (PKCE) extension is used to dynamically generate a secret key for each request. There are some additional concerns for mobile applications. All applications can use PKCE to eliminate the possibility of the code being intercepted and to enhance security. Consult the [*OAuth2 specification*](https://oauth.net/2/) for more details.

Devices without a keyboard, such as smart televisions, typically implement OAuth2 using a *device code*. The device code is used alongside a user code that is submitted elsewhere.
{{< /note >}}

## Popular OAuth2 Libraries

Links to popular OAuth2 libraries are available in a variety of languages, including JavaScript, Python, and PHP, courtesy of the [*OAuth2 libraries directory*](https://oauth.net/code/). These libraries are divided into client libraries and server libraries. Client libraries are used by applications to access protected account services. There are also links to open source and commercial OAuth providers. It is best to use a library recommended by the OAuth site because other implementations might have security concerns or coding flaws.

Due to a large number of libraries, this guide focuses on the high-level task of selecting, installing, and using an OAuth2 client library. In this section, a sample Python library is used as an example. Pseudocode is shown for each step, with a more detailed summary of the code at the end of this section. Some basic knowledge of Python is necessary to understand the code samples.

{{< note respectIndent=false >}}
You must register the application with the service before accessing any account information. You must also register and submit a URL to redirect client traffic. After approving your registration, the application provides you with a client ID and secret. All applications must use HTTPS when transmitting and receiving OAuth2 messages.
{{< /note >}}

### How to Use a Python OAuth2 Library

1. Review the supported languages on the [*OAuth2 libraries page*](https://oauth.net/code) and select the category corresponding to the language you are using. Alternatively, select a link to a commercial or open-source provider.

1. Select a library from the available choices. Evaluate the alternatives by comparing how many downloads and stars each package has received on GitHub. Review the documentation, as some packages are easier to install and use than others. This tutorial uses the [*Rauth*](https://github.com/litl/rauth) package from GitHub for an example. The exact installation instructions depend on the package.

1. Download and install the library. In many cases, the library can be installed using `apt` or `pip`. In other cases, the library must be added to the source list first.

    {{< note respectIndent=false >}}
The following command assumes Python and `pip` are already installed on the Linode.
    {{< /note >}}

        sudo pip3 install rauth

    {{< output >}}
Installing collected packages: rauth
Successfully installed rauth-0.7.3
    {{< /output >}}

1. Inside the python file, import `OAuth2Service` from the `rauth` package.

    {{< file "oauth2.py" python >}}
from rauth import OAuth2Service
    {{< /file >}}

1. Instantiate an `OAuth2Service` container object for use throughout the authorization process. Use the `client_id` and `client_secret` that were assigned to the application when it was registered. The other values are unique to the service being accessed. Verify all URLs using the service documentation.

    {{< file "oauth2.py" >}}
service = OAuth2Service(params)
    {{< /file >}}

1. Use this object to access the redirect URL for the service. When the client finishes authorizing access to the service, this link contains an authorization code. Consult the [service documentation](https://rauth.readthedocs.io/en/latest/api/#oauth-2-0-services) for details about how the code is embedded in the `url` variable.

    {{< file "oauth2.py" python >}}
url = service.get_authorize_url(**params)
    {{< /file >}}

1. Extract the authorization code from the `url` and use it to request an access token for the user account. Submit the authorization code as part of the `data` object.

    {{< file "oauth2.py" python >}}
token = service.get_auth_session(data=data)
    {{< /file >}}

1. The session can now be used to access account information.

    {{< file "oauth2.py" python >}}
r = token.get(params)
"do something with r"
    {{< /file >}}

1. An actual implementation of this scenario, using methods and parameters from the `rauth` library, would be similar to the following prototype. Substitute the appropriate URLs for the service being accessed in place of the `example.com` URLs.

    {{< file "oauth2.py" python >}}
from rauth import OAuth2Service

# Initialize the container

service = OAuth2Service(
           name='example',
           client_id='123',
           client_secret='456',
           access_token_url='https://example.com/token',
           authorize_url='https://example.com/authorize',
           base_url='https://example.com/api/')

# Construct the params dict and use it to retrieve the url embedded in the authorization code

params = {'redirect_uri': 'http://example.com/',
          'response_type': 'code'}
url = service.get_authorize_url(**params)

# Write a routine to extract the code from the url based on the service documentation

code = parse_url_for_code(url)

# Construct the data dict and use it to obtain an access token

data = {'code': 'code_from_url_above',
        'grant_type': 'authorization_code',
        'redirect_uri': 'http://example.com/'}

token = service.get_auth_session(data=data)

# Use the token as required

r = token.get('url', params={'format': 'json'})
    {{< /file >}}

## OAuth2 Comparisons

OAuth is not the only protocol that can be used for authentication and authorization. Some competing and complementary protocols are [*OpenID*](https://openid.net/) and [*OpenID Connect*](https://openid.net/connect/) (OIDC), *eXtensible Access Control Markup Language* (XACML), and the *Security Assertion Markup Language* (SAML).

OAuth2 can be used for authentication without an assisting protocol. This process is known as *pseudo-authentication*, but it is not recommended.

### OAuth2 vs OpenID/OIDC

OpenID is complementary to OAuth2. It is intended for authentication rather than authorization.

Some of the similarities and differences between OAuth2 and OpenID are as follows:

- OAuth2 is used for authorization while OpenID is mainly for authentication. Authorization means the user is allowing the application to access an account they own. For authentication, the user must prove their identity.
- An OpenID server used for authenticating a user is typically referred to as an *identity provider*.
- In OpenID, the response from the authorization server affirms the resource owner's identity. Consequently, OpenID does not provide an access token. Instead, it dispenses an *ID token*. The information in this token has a special format and is encapsulated in a tamper-proof *JSON Web Token* (JWT).
- OAuth2 is not specifically a means of authentication, even though the authorization server typically authenticates the user while validating their credentials.

OAuth2 is more closely related to OIDC, an authentication layer built on top of OAuth2. The two protocols can be used together. A comparison between OIDC and OAuth2 is as follows:

- OIDC allows clients to validate the identity of a user based on the results of the authorization procedure.
- OIDC can be used to obtain details about the user, including their account profile or log-in details. OAuth does not have any such capabilities. It can access account details without knowing anything about the user.
- Both protocols are fairly flexible and can support web and mobile clients.
- OIDC has additional capabilities. It can discover OpenID Providers and manage session details. It can also be configured to encrypt the identity details.

### OAuth2 vs XACML

XACML is an alternative for authorization that is based on access control. However, it can be combined with OAuth2 for a more complete solution. Some of the differences between the two protocols are as follows:

- XACML uses policies to control the level of access.
- XACML uses a request and response format for its requests.
- XACML is more granular than OAuth is. Its policies can take into account attributes including the context, the action being taken, and the nature of the resource. OAuth has access to the resource based on the scope of the grant, with no further restrictions and no additional access rights.
- OAuth2 requires HTTP, but XACML can work over a wider range of applications, including databases.

XACML policies can potentially incorporate OAuth2 authorization grants. OAuth2 can obtain the authorization and gain delegated access rights. XACML can then further refine this access based on its control policies. For example, it can determine whether a user has read-only or write access within different ranges of the OAuth2 scope.

### OAuth2 vs SAML

SAML is also used for authentication and identity management. It provides tokens containing the user's identification record. SAML is more commonly used in enterprise settings, like Enterprise Single Sign-On (SSO). In an enterprise environment, it gives the user access to a wide range of company resources with only one login. OAuth2 and SAML can both be used for single sign-on, but SAML is user-centric, while OAuth2 provides access to a specific client application.

OAuth2 and SAML can be used together. However, OAuth2 and OIDC are considered a better combination that is usually easier to implement.

## OAuth2 Summarized

OAuth2 is the current standard for authorization and access delegation. It defines several user roles and outlines a procedure for authorization. In a typical OAuth2 flow, the client acquires an access token after a successful authorization exchange. It then uses this token to access protected resources. OAuth2 is easier to implement than the first release of OAuth but is perhaps not quite as secure. There are a few alternatives and complements to OAuth2, including OpenID/OIDC and XACML.

A large number of OAuth2 libraries are available in different programming languages. These can be found on the [*OAuth2 site*](https://oauth.net/code/). The typical library includes high-level instructions for each step of the authorization process.
