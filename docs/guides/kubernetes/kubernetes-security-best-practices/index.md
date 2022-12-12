---
slug: kubernetes-security-best-practices
author:
  name: Jack Wallen
  email: jlwallen@monkeypantz.net
description: 'This guide covers some of the best security practices in Kubernetes so you can deploy clusters that are secured and keep your infrastructure safe.'
og_description: 'This guide covers some of the best security practices in Kubernetes so you can deploy clusters that are secured and keep your infrastructure safe.'
keywords: ['Kubernetes security best practices']
tags: ['kubernetes', 'container']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-17
modified_by:
  name: Linode
title: "Kubernetes Security Best Practices: A Beginner's Overview"
h1_title: "Kubernetes Security Best Practices Overview"
enable_h1: true
contributor:
  name: Jack Wallen
  link: https://twitter.com/jlwallen
---

If you are [deploying your first Kubernetes cluster](/docs/guides/getting-started-with-kubernetes/), it's important to consider the security best practices that are available to keep your workload safe. Kubernetes provides several out-of-the-box features to help secure your cluster. This guide provides an overview of three Kubernetes features to you can use to secure different components of a cluster. The three areas covered are Role-Based Access Control (RBAC), Secrets, and Network Policies.

{{< note >}}
This guide assumes some familiarity with Kubernetes terminology and concepts. If you are newer to Kubernetes, refer to our [A Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/).
{{</ note >}}

## Use Security Policies and Role-Based Access Control

A Kubernetes cluster consists of many areas –services, networking, namespaces, pods, nodes, containers, and more. Limiting which users and services have access to different parts of your stack is an important step in keeping your cluster secure. Role-Based Access Control (RBAC) authorization is a Kubernetes feature that limits access to a cluster's resources. With this method, no user or service has any more permissions than they need to function properly in the cluster. Administrators should use Kubernetes *Roles* or *ClusterRoles* to attach rules to a group and add users to the group. First, create a security policy and then, using RBAC, assign the role.

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

The above Role allows users to execute operations on `deployments`, `replicasets`, and `pods`, but only within the `core`, `apps`, and `extensions` [API groups](https://kubernetes.io/docs/concepts/overview/kubernetes-api/#api-groups-and-versioning), and within the `office` namespace. The example Role limits what a user can do if they are assigned to the Role.

A separate manifest binds that Role to a specific user. To continue the example, and bind the Role to a user named `admin1`, the corresponding manifest resembles the example below:

{{< file "user-role.yaml" yaml >}}
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

The manifest binds the `admin1` user, within the `office` namespace. The user can execute operations on `deployments`, `replicasets`, and `pods`, within the `core`, `apps`, and `extensions` API groups.

RBAC authorization is one of the primary ways to keep your Kubernetes cluster secure. To learn more about the implementation details of RBAC, view the [Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) Kubernetes documentation page.

## Use Kubernetes Secrets to Store Sensitive Data

A Kubernetes Secret is used to keep sensitive information —like passwords, tokens, and keys— out of your application code. Secrets prevent your sensitive data from being exposed during your development workflow. At its simplest, a Secret is an object that contains a key-value pair and metadata. The example below creates a Kubernetes secret that stores a user's plain-text password:

{{< file "secret.yaml" yaml >}}
apiVersion: v1
kind: Secret
metadata:
  name: itsasecret
type: Opaque
data:
  username: admin1
  password: BU2Byyz2112
{{< /file >}}

It is not a good security practice to store a plain-text password in a manifest file. Anyone with access to the Secret's namespace can read the Secret. Similarly, anyone with access to the cluster's API can read and modify the Secret. For this reason, you should encrypt any sensitive data that is stored in a Secret. Kubernetes supports encryption at rest which means your sensitive data will be stored in an encrypted format. To store your Secrets in an encrypted format, create an [encryption at rest configuration](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration) similar to the example below:

{{< file "encryption.yaml" yaml >}}
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

Then, generate a random key and use `base64` to encode it.

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

By default, Pods running on a Kubernetes cluster accept traffic from any source. [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) allow you to control and secure network access between Pods and across your application.

A network policy spec consists of three main sections:

- `podSelector`: Defines to which pods the rule(s) apply.
- `policyTypes`: Defines whether the rules apply to incoming or outgoing traffic.
- `Ingress/Egress`: Defines whether the traffic is incoming (ingress) or outgoing (egress).

The file below contains an example Kubernetes network policy:

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
      cidr: 192.0.2.0/16
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

In the above manifest, each of the following items require values:

- `spec.podSelector.matchLabels.app`: the target app for which the policy is applied.
- `spec.ingress.namespaceSelector.matchLabels.name`: the namespace allowed to communicate with the app.
- `spec.ingress.podSelector.matchLabels.app`: the Pod permitted to communicate with the app.
- `spec.egress.namespaceSelector.matchLabels.name`: the namespace with which the app may communicate.
- `spec.egress.podSelector.matchLabels.app`: the Pod with which the app may communicate.

To learn more about creating Network Policies for a Kubernetes cluster, see the [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) documentation page.

## Conclusion

Kubernetes security is a vast topic, however, there are a few core areas that are essential. Aside from the three areas covered in this overview, you can consider limiting resource usage on a cluster, review the [Kubernetes security reporting](https://kubernetes.io/docs/reference/issues-security/security/) page, and review any third-party integrations used by your cluster. The Kubernetes [Securing a Cluster](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/) documentation page provides a deeper discussion on these topics.

