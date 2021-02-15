---
slug: kubernetes-security
author:
  name: Jack Wallen
  email: jlwallen@monkeypantz.net
description: 'Kubernetes is powerful. Make sure that you do all the right things to secure it.'
og_description: 'Kubernetes is powerful. Make sure that you do all the right things to secure it.'
keywords: ['Kubernetes security best practices']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-15
modified_by:
  name: Linode
title: "Kubernetes Security Best Practices"
h1_title: "Kubernetes Security Best Practices"
contributor:
  name: Jack Wallen
  link: https://twitter.com/jlwallen
---

# Kubernetes Security Best Practices

Kubernetes is a magnificent beast, one that [can take a business to incredible heights of scale and service](https://www.linode.com/docs/guides/kubernetes-use-cases/). Of course, anyone who has worked with Kubernetes knows a lot of moving parts are involved with the container orchestration platform. This is especially true when [Continuous Integration/Continuous Delivery](https://www.linode.com/docs/guides/development/ci/) (CI/CD) is added into the pipeline. When a development team employs automation with CI/CD, things can move really fast with your deployments. So fast, in fact, that things can get out of hand.

When that happens, security becomes a serious issue – and as with any other aspect of computing, security is not optional. This is compounded exponentially if the development team or system administrators don&#39;t start off with a solid foundation. A team&#39;s container deployments could be left wide open for hackers to gain access to pods, services, networks, or even company data.

It always is wise to learn from others&#39; mistakes so that you don&#39;t repeat their errors – also known as &quot;best practices.&quot; Apply these security lessons from the very beginning of any Kubernetes journey -- because learning them the hard way is far more painful.

Do note, however, that Kubernetes is an ever-moving and evolving target. The manifests used today might not work tomorrow.

## Use security policies and role-based access control

Because Kubernetes has a lot of moving parts, it is possible for interconnected services and users to have access to an entire stack. If the wrong user or service has the wrong access, they could use it to their advantage.

That&#39;s where Role-Based Access Control (RBAC) comes into play. This Kubernetes feature ensures that no user has any more permission than they need to function properly. Administrators should use Kubernetes Roles to attach rules to a group and add users to the group. Each role allows users to do certain things. First create a security policy and then, using RBAC, assign the role.

This example defines a security policy that specifies the operations a user can execute and on which namespace.

Create a YAML file, named `role.yaml`, with the following contents:

```
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: office
  name: deployment-manager
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["deployments", "replicasets", "pods"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"] # You can also use ["*"]
```

The above role allows users to execute operations on Deployments, Pods, and ReplicaSets, but only within the core, apps, and extensions API groups, and within the `office` namespace. That limits what a user can do, if they&#39;ve been assigned to this role.

A separate manifest binds that role to a specific user. To continue the example, and bind that role to a user named `admin1`, the manifest would look something like:

```
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: deployment-manager-binding
  namespace: office
subjects:
- kind: User
  name: admin1
  apiGroup: ""
roleRef:
  kind: Role
  name: deployment-manager-binding
  apiGroup: ""
```

That binds the `admin1` user, within the `office` namespace, such that they can execute operations on Deployments, Pods, and ReplicaSets, within the core, apps, and extensions API Groups.

It is crucial to understand how to employ RBAC in your Kubernetes manifests. To find out more about how RBAC functions within Kubernetes, read the [official documentation on this subject](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

## Keep your secrets to yourself

This security practice is not only important; it&#39;s often overlooked.

First of all, what is a `secret`? A `secret` is an object that contains a key-value pair and metadata. Here&#39;s a basic example of a secret in a Kubernetes YAML file

```
apiVersion: v1
kind: Secret
metadata:
  name: itsasecret
type: Opaque
data:
  username: admin1
  password: BU2Byyz2112
```

Clearly, this isn&#39;t an ideal path for any security behavior.

To improve the situation, there are a number of routes from which to choose, such as encrypting data that&#39;s stored or communicated with other systems. For example, use a section like this in an encryption configuration file (which is not a pod/container manifest):

```

apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    providers:
    - aescbc:
        keys:
        - name: secretkey1
          secret: <ENCODED SECRET>
    - identity: {}
```

You would then have to generate a random key and use base64 to encode it:

`head -c 32 /dev/urandom | base64`

This outputs a string that is copied as the value for secret, as in:

`secret: piE9qJYzcavzUz5q+gH70uRjnPWsvMMsoTndPi7KzqA=`

Then set `--encryption-provider-config` in the `kube-apiserver` such that it points to the encryption configuration file. Doing this avoids leaving secrets in your Kubernetes manifests.

## Restrict traffic between pods with a Kubernetes network policy

Be default, Pods running on a Kubernetes cluster accept traffic from any source. That&#39;s a bad idea in security terms.

To limit the communication between Pods, use the Kubernetes Network Policy API. This is important, because you might have certain Pods that should only be able to communicate to specific Pods. Accepting all traffic from all Pods could lead to trouble.

A network policy spec consists of three main sections:

- podSelector: Defines to which pods the rule(s) apply.
- policyTypes: Defines whether the rules apply to incoming or outgoing traffic.
- ingress/egress: Defines whether the traffic is incoming (ingress) or outgoing (egress).

An example of a network policy might look like:

```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: simple-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: target-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 172.17.0.0/16
    - namespaceSelector:
        matchLabels:
          name: namespace
    - podSelector:
        matchLabels:
          app: pod
    ports:
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    - namespaceSelector:
        matchLabels:
          name: namespace
    - podSelector:
        matchLabels:
          app: pod
    ports:
    - protocol: TCP
      port: 5978
```

In the above manifest, each of the following items requires definitions:

- **`app`** (in spec section): the target app for which the policy is applied.
- **`name`** (in ingress section): the namespace allowed to communicate with the app.
- **`app`** (in ingress section): the pod permitted to communicate to the app.
- **`name`** (in egress section): the namespace with which the app may communicate.
- **`app`** (in egress section): the pod with which the app may communicate.

By doing so, there is now an app for the policy and rules applied for incoming and outgoing traffic.

## Use a container-optimized operating system

A Kubernetes cluster can be deployed on just about any platform. It&#39;s possible to use Ubuntu desktop computers for a controller and nodes – but don&#39;t! Why? Because Ubuntu Desktop has not been optimized for Kubernetes (or for containers, for that matter).

Beyond the lack of optimization for containers, standard Linux distributions include systems and services that are unnecessary for successful container operation. So not only are those distributions using extra (valuable) overhead, those added bits of stack could lead to insecurities.

In addition, with a &quot;general purpose&quot; Linux operating system, the system administrators have to take time to administer the Kubernetes cluster and also take care of the operating system. A single patch deployment could possibly break a container or cluster. The admin would also need to disable unused daemons, manage user accounts, secure incoming and outgoing traffic...the list goes on and on.

A container-specific operating system provides a minimalist OS that is designed specifically to _only_ run containers. That removes a considerable amount of admin overhead. More importantly, it drastically reduces the attack plane, thanks to the likes of read-only filesystems, kernel hardening, and general network security.

So instead of opting for the likes of Ubuntu Server, AlmaLinux, SUSE Linux Enterprise, or Red Hat Enterprise Linux, choose [Fedora CoreOS](https://getfedora.org/coreos?stream=stable), [AWS Bottlerocket](https://aws.amazon.com/bottlerocket/), or [Google&#39;s Container-Optimized OS](https://cloud.google.com/container-optimized-os/docs).

## Security first!

Kubernetes is not easy—by any stretch of the imagination. And even applying best practices takes some time, because every container use-case is different. Every deployment of unique containers in a unique cluster environment requires time spent up-front to investigate which security practices might apply. A bit of extra effort up front goes a long way to keeping your container deployments secure.
