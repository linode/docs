---
slug: kubernetes-security-best-practices
author:
  name: Jack Wallen
  email: jlwallen@monkeypantz.net
description: 'Kubernetes is a container orchestration system to help scale containerized applications in the cloud. This guide covers some of the Kubernetes security best practices.'
og_description: 'Kubernetes is a container orchestration system to help scale containerized applications in the cloud. This guide covers some of the Kubernetes security best practices.'
keywords: ['Kubernetes security best practices']
tags: ['kubernetes', 'security','container', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-15
modified_by:
  name: Linode
title: "Kubernetes Security Best Practices"
h1_title: "Kubernetes Security Best Practices"
enable_h1: true
contributor:
  name: Jack Wallen
  link: https://twitter.com/jlwallen
external_resources:
- '[Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)'
- '[Fedora CoreOS](https://getfedora.org/coreos?stream=stable)'
- '[AWS Bottlerocket](https://aws.amazon.com/bottlerocket/)'
- "[Google's Container-Optimized OS](https://cloud.google.com/container-optimized-os/docs)"
---

Kubernetes is a magnificent beast, one that [can take a business to incredible heights of scale and service](https://www.linode.com/docs/guides/kubernetes-use-cases/). Of course, anyone who has worked with Kubernetes knows a lot of moving parts are involved with the container orchestration platform. This is especially true when [Continuous Integration/Continuous Delivery](https://www.linode.com/docs/guides/development/ci/) (CI/CD) is added into the pipeline. When a development team employs automation with CI/CD, things can move fast with your deployments. So fast, that things can get out of hand.

When that happens, security becomes a serious issue – and as with any other aspect of computing, security is not optional. This is compounded exponentially if the development team or system administrators don't start with a solid foundation. A team's container deployments could be left wide open for hackers to gain access to pods, services, networks, or even company data.

It always is wise to learn from others' mistakes so that you don't repeat their errors – also known as "Best Practices." Apply these security lessons from the very beginning of any Kubernetes journey -- because learning them the hard way is far more painful.

{{< note >}}
Kubernetes is an ever-moving and evolving target. The manifests used today might not work tomorrow.
{{< /note >}}

## Use Security Policies and Role-Based Access Control

A Kubernetes cluster consists of many pieces –services, networking, namespaces, pods, nodes, containers, and more. Limiting which users and services have access to different parts of your stack is an important step in keeping your cluster secure. Role-Based Access Control (RBAC) authorization is a Kubernetes feature that limits access to a cluster's resources. With this method, no user or service has any more permissions than they need to function properly in the cluster. Administrators should use Kubernetes *Roles* or *ClusterRoles* to attach rules to a group and add users to the group. First, create a security policy and then, using RBAC, assign the role.

The example below defines a security policy that specifies the operations a user can execute and on which namespace.

{{< file "role.yaml" yaml >}}
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: office
  name: deployment-manager
rules:
- apiGroups: ["core", "extensions", "apps"]
  resources: ["deployments", "replicasets", "pods"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"] # You can also use ["*"]
{{< /file >}}

The above Role allows users to execute operations on `deployments`, `replicasets`, and `pods`, but only within the `core`, `apps`, and `extensions` [API groups](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning), and within the `office` namespace. The example Role limits what a user can do if they are assigned to it.

A separate manifest binds that Role to a specific user. To continue the example, and bind the Role to a user named `admin1`, the corresponding manifest resembles the example below:

{{< file "role.yaml" yaml >}}
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
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
{{< /file >}}

The manifest binds the `admin1` user, within the `office` namespace. The user can execute operations on `deployments`, `replicasets`, and `pods`, within the `core`, `apps`, and `extensions` API Groups.

RBAC authorization is one of the primary ways to keep your Kubernetes cluster secure. To learn more about the implementation details of RBAC, view the [Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) Kubernetes documentation page.

## Use Kubernetes Secrets for Sensitive Data

A Kubernetes Secret is used to keep sensitive information —like passwords, tokens, and keys— out of your application code. Secrets prevent your sensitive data from being exposed during your development workflow. At its simplest, a Secret is an object that contains a key-value pair and metadata. The example below creates a Kubernetes secret that stores a user's plain-text password:

{{< file "role.yaml" yaml >}}
apiVersion: v1
kind: Secret
metadata:
  name: itsasecret
type: Opaque
data:
  username: admin1
  password: BU2Byyz2112
{{< /file >}}

It is not a good security practice to store a plain-text password in a manifest file. Anyone with access to the Secret's namespace can read the Secret. Similarly, anyone with access to the cluster's API can read and modify the Secret. For this reason, you should encrypted any sensitive data that is stored in a Secret. Kubernetes supports encryption at rest which means your sensitive will be stored encrypted in etc. To do this create an [encryption at rest configuration](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration) similar to the example below:

{{< file "role.yaml" yaml >}}
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
{{< /file >}}

Then, you have to generate a random key and use `base64` to encode it.

`head -c 32 /dev/urandom | base64`

You can then copy the returned output and store it in the `secret` field of your encryption at rest configuration.

{{< file "role.yaml" yaml >}}
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
  - secrets
  providers:
  - aescbc:
      keys:
      - name: secretkey1
      secret: piE9qJYzcavzUz5q+gH70uRjnPWsvMMsoTndPi7KzqA=
  - identity: {}
{{< /file >}}

Finally, set `--encryption-provider-config` in the `kube-apiserver` so that it points to the encryption configuration file. To learn more about the different encryption providers that Kubernetes supports, see the [Encrypting Secret Data at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) documentation.

## Restrict Traffic Between Pods With a Kubernetes Network Policy

By default, Pods running on a Kubernetes cluster accept traffic from any source. To limit the communication between Pods, use the [Kubernetes Network Policy](https://kubernetes.io/docs/concepts/services-networking/network-policies/) API. This is important because you might have certain Pods that should only be able to communicate to specific Pods. Accepting all traffic from all Pods could lead to trouble.

A network policy spec consists of three main sections:

- `podSelector`: Defines to which pods the rule(s) apply.
- `policyTypes`: Defines whether the rules apply to incoming or outgoing traffic.
- `Ingress/Egress`: Defines whether the traffic is incoming (ingress) or outgoing (egress).

An example of a Kubernetes network policy might look like:

{{< file "role.yaml" yaml >}}
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
{{< /file >}}

In the above manifest, each of the following items requires definitions:

- `app` (in "spec" section): the target app for which the policy is applied.
- `name` (in "ingress" section): the namespace allowed to communicate with the app.
- `app` (in "ingress" section): the Pod permitted to communicate to the app.
- `name` (in "egress" section): the namespace with which the app may communicate.
- `app` (in "egress" section): the Pod with which the app may communicate.

By doing so, there is now an app for the policy and rules applied for incoming and outgoing traffic.

## Use a Container-Optimized Operating System

A Kubernetes cluster can be deployed on just about any platform. It's possible to use Ubuntu desktop computers for a controller and nodes – but it is not recommended. Why? Because, Ubuntu Desktop has not been optimized for Kubernetes (or for containers, for that matter).

Beyond the lack of optimization for containers, standard Linux distributions include systems and services that are unnecessary for successful container operation. So not only are those distributions using extra (valuable) overhead, those added bits of the stack could lead to insecurities.

In addition, with a "general purpose" Linux operating system, the system administrators have to take time to administer the Kubernetes cluster and also take care of the operating system. A single patch deployment could break a container or cluster. The admin would also need to disable unused daemons, manage user accounts, secure incoming and outgoing traffic, etc.

A container-specific operating system provides a minimalist OS that is designed specifically to _only_ run containers. That removes a considerable amount of admin overhead. More importantly, it drastically reduces the attack plane, thanks to the likes of read-only filesystems, kernel hardening, and general network security.

So instead of opting for the likes of Ubuntu Server, AlmaLinux, SUSE Linux Enterprise, or Red Hat Enterprise Linux, choose [Fedora CoreOS](https://getfedora.org/coreos?stream=stable), [AWS Bottlerocket](https://aws.amazon.com/bottlerocket/), or [Google's Container-Optimized OS](https://cloud.google.com/container-optimized-os/docs).

## Security First

Kubernetes is not easy—by any stretch of the imagination. And even applying best practices takes some time, because every container use-case is different. Every deployment of unique containers in a unique cluster environment requires time spent up-front to investigate which security practices might apply. A bit of extra effort upfront goes a long way to keeping your container deployments secure.
