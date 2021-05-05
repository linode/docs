---
slug: lke-continuous-deployment-part-11
author:
  name: Linode Community
  email: docs@linode.com
description: 'This series of guides will waklk you through setting up a continous deployment pipeline on LKE.'
keywords: ['kubernets', 'k8s', 'lke']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-03
modified_by:
  name: Linode
title: "Building a Continous Deployment Pipepline Using LKE Part 11: Prometheus and Grafana"
contributor:
  name: Linode
tags: ["kubernetes"]
---

## Presentation Text

### Prometheus and Grafana

- What if we want metrics retention, view graphs, trends?
- A very popular combo is Prometheus+Grafana:
    - Prometheus as the "metrics engine"
    - Grafana to display comprehensive dashboards
- Prometheus also has an alert-manager component to trigger alerts (we won't talk about that one)

### Installing Prometheus and Grafana

- A complete metrics stack needs at least:
    - the Prometheus server (collects metrics and stores them efficiently)
    - a collection of exporters (exposing metrics to Prometheus)
    - Grafana
    - a collection of Grafana dashboards (building them from scratch is tedious)
- The Helm chart kube-prometheus-stack combines all these elements
- ... So we're going to use it to deploy our metrics stack!

### Installing `kube-prometheus-stack`

- Let's install that stack *directly* from its repo (without doing helm repo add first)
- Otherwise, keep the same naming strategy:

      helm upgrade --install kube-prometheus-stack kube-prometheus-stack \
        --namespace kube-prometheus-stack --create-namespace \
        --repo https://prometheus-community.github.io/helm-charts

- This will take a minute...
- Then check what was installed:

      kubectl get all --namespace kube-prometheus-stack

### Exposing Grafana

- Let's create an Ingress for Grafana

      kubectl create ingress --namespace kube-prometheus-stack grafana \
      --rule=grafana.cloudnative.party/*=kube-prometheus-stack-grafana:80

  (as usual, make sure to use your domain name above)

- Connect to Grafana (remember that the DNS record might take a few minutes to come up)

### Grafana credentials

- What could the login and password be?
- Let's look at the Secrets available in the namespace:

      kubectl get secrets --namespace kube-prometheus-stack

- There is a `kube-prometheus-stack-grafana` that looks promising!

- Decode the Secret:

      kubectl get secret --namespace kube-prometheus-stack \
      kube-prometheus-stack-grafana -o json | jq '.data | map_values(@base64d)'

- If you don't have the `jq` tool mentioned above, don't worry...

### Grafana credentials

- What could the login and password be?

- Let's look at the Secrets available in the namespace:

      kubectl get secrets --namespace kube-prometheus-stack

- There is a `kube-prometheus-stack-grafana` that looks promising!

- Decode the Secret:

      kubectl get secret --namespace kube-prometheus-stack \
      kube-prometheus-stack-grafana -o json | jq '.data | map_values(@base64d)'

- If you don't have the `jq` tool mentioned above, don't worry...

- The login/password is hardcoded to admin/prom-operator 😬

### Grafana dashboards

- Once logged in, click on the "Dashboards" icon on the left (it's the one that looks like four squares)
- Then click on the "Manage" entry
- Then click on "Kubernetes / Compute Resources / Cluster"
- This gives us a breakdown of resource usage by Namespace
- Feel free to explore the other dashboards!





