# Deploying an HA PostgreSQL server with Backups

> **Note:** This document just contains a rough outline of the guide being written on this topic. The intention is to use this to solicit early feedback in the following cases:
>
> - You'd like the structure to be different
> - You'd like the order of some sections/subsections to change
> - You'd like some sections/subsections to be dropped
> - You'd like some sections/subsections to be added
>
> This document will be deleted before the final PR.

## Introduction

This section will introduce PostgreSQL and briefly explain what the rest of the guide will do. It will also touch upon why readers might find this guide useful.

## Before You Begin

This section will list the prerequisites to start using the guide. This will include:

- Things the reader should be familiar with
- Number at type of machines the user should have access to
- The state the machines should be in
- The software the machines should have pre-installed

## Various Options to Create HA Setups

This section will list out and briefly describe the different tools and setups available to achieve high availability with Postgres.

The section will end by explaining why this guide will use a particular setup.

## A Brief Introduction to the Tools Being Used

This section will expand on our chosen tools and explain how they work together to create an HA setup. The section will also list the benefits and trade-offs of the chosen setup.

## Installation Instructions

This section will help the reader install all the required software on the appropriate machines.

## Setup and Configuration Instructions

This section will help the reader configure the installed software to get the HA setup working. This section will also explain how Linode backups can be used in the HA setup.

## Testing the Setup

This section will test the setup we've created to see automatic failover in action.
