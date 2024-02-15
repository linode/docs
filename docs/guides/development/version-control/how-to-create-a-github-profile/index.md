---
slug: how-to-create-a-github-profile
author:
  name: Linode Community
  email: docs@linode.com
description: 'Creating a GitHub profile is a great way to show visitors what you are all about as a developer - what languages and frameworks you know, types of work you are interested in, and general background informaton. In this guide, we’ll cover how to create a repository that doubles as a profile and how to add advanced tools that display cool statistics about your coding history and habits.'
og_description: 'Creating a GitHub profile is a great way to show visitors what you are all about as a developer - what languages and frameworks you know, types of work you are interested in, and general background informaton. In this guide, we’ll cover how to create a repository that doubles as a profile and how to add advanced tools that display cool statistics about your coding history and habits.'
keywords: ['github','profile','version-control','README']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-07
modified_by:
  name: Linode
title: "How to Create a Github Profile"
h1_title: "How to Create a Github Profile"
enable_h1: true
contributor:
  name: Amar Pan
  link: https://www.linkedin.com/in/profpan396/
external_resources:
- '[GitHub Profile Add-on Theming and Customization](https://github.com/anuraghazra/github-readme-stats)'
---

## Introduction
![Final profile preview](images/ghprofile-final-profile.png)
<br>
Creating a GitHub profile is a great way to show visitors what you are all about as a developer - what languages and frameworks you know, types of work you are interested in, and general background informaton. 
<br><br>
In this guide, we'll cover how to create a repository that doubles as a profile and how to add advanced tools that display cool statistics about your coding history and habits. 

## Create a Profile Repository
To make a GitHub profile, you must first create a repository with the same name as your GitHub username. 

### 1. Create a new repository
In the upper-right hand corner of the GitHub dashboard: 
<br>
- a. Click `+`
- b. Click `New repository`
<br>
![New Repository](images/ghprofile-new-repo.png)
<br> 
           
### 2. Add the details for the new repository
- c. Under "Repository name", type in your GitHub username <br>
**For example, if my GitHub username is linuxfan123, I would type in `linuxfan123`**
- d. Click the `Public` option so all users can see your newly created profile
- e. Check the `Add a README file` box
- f. Click the green `Create repository` button to make the new repository with all the above settings
<br>
![Create new repository](images/ghprofile-name-repo.png)

### 3. View your new default profile
- g. Click the white `View Profile` button on the right side of the page
- h. Take a look at your new profile - by default, some placeholder text is inputted.
- i. Click the pencil icon in the top-right hand corner of your new profile to initiate editing
<br>
![Created profile](images/ghprofile-created-profile.png)
![Default new created profile](images/ghprofile-default-profile.png)

### 4. Edit your new profile
- j. Delete lines 3-6 and the ending `-->`
<br>
![Edit Profile](images/ghprofile-edit-profile.png)
- k. Add the missing information - think about what important information visitors looking at your code should know
- l. Click the `Preview` tab to see what the new edits will look like
<br>
![Preview Edits](images/ghprofile-preview.png)
- m. When satisfied, click the green `Commit changes` button to finalize the changes

### 5. View your new profile
In the upper-right hand corner of the GitHub dashboard:
<br>
- n. Click your profile picture
<br>
- o. Click `Your profile`
<br>
![View New Profile](images/ghprofile-your-profile.png)

## Advanced Coding Statistic Add-ons
We can also choose to add from a variety of add-on tools that display insightful and interesting statistics about our coding history and habits.<br>
{{< note >}}
Take care to replace `<your-github-username>` with your own GitHub username when using the following code snippets and then delete the angle brackets `<>`. 
{{< /note >}}
<br>

### Activity
Displays total stars, commits, pull requests, etc.
<br>
[![Activity](https://github-readme-stats.vercel.app/api?username=profpan396&count_private=true&show_icons=true&include_all_commits=true&theme=vue-dark&custom_title=Activity)](https://github.com/anuraghazra/github-readme-stats)
<br>
`[![Activity](https://github-readme-stats.vercel.app/api?username=<your-github-username>&count_private=true&show_icons=true&include_all_commits=true&theme=vue-dark&custom_title=Activity)](https://github.com/anuraghazra/github-readme-stats)`

### Commits Graph
A simple graph displaying your daily commits over the last 30 days
<br>
<img src="https://activity-graph.herokuapp.com/graph?username=profpan396&bg_color=1c1917&color=ffffff&line=0891b2&point=ffffff&area_color=1c1917&area=true&hide_border=true&custom_title=GitHub%20Commits%20Graph" alt="GitHub Commits Graph" />
<br>
`<img src="https://activity-graph.herokuapp.com/graph?username=<your-github-username>&bg_color=1c1917&color=ffffff&line=0891b2&point=ffffff&area_color=1c1917&area=true&hide_border=true&custom_title=GitHub%20Commits%20Graph" alt="GitHub Commits Graph" />`

### Top Languages
Lists your most frequently coded in languages by percentage
<br>
[![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=profpan396&theme=vue-dark&custom_title=Languages&layout=compact)](https://github.com/anuraghazra/github-readme-stats)
<br>
`[![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=<your-github-username>&theme=vue-dark&custom_title=Languages&layout=compact)](https://github.com/anuraghazra/github-readme-stats)`

### Repository Highlight
Displays a single repository (just as it would look underneath your GitHub profile)
<br>
<a href="https://github.com/profpan396/simon-memory-game"><img align="center" src="https://github-readme-stats.vercel.app/api/pin/?username=profpan396&repo=simon-memory-game&theme=vue-dark" /></a>
<br>
`<a href="https://github.com/<your-github-username>/<repository-name>"><img align="center" style="margin:20px" src="https://github-readme-stats.vercel.app/api/pin/?username=<your-github-username>&repo=<repo-name>&theme=vue-dark" /></a>`

### Streak Counter
Lists your current and longest streak of making at least one daily GitHub commit
<br>
[![GitHub Streak Counter](https://github-readme-streak-stats.herokuapp.com/?user=profpan396&theme=vue-dark)](https://git.io/streak-stats)
<br>
`[![GitHub Streak Counter](https://github-readme-streak-stats.herokuapp.com/?user=<your-github-username>&theme=vue-dark)](https://git.io/streak-stats)`

### Visitor Counter
A running counter of how many times your GitHub profile has been visited
<br>
![Visitor Counter](https://visitor-badge.glitch.me/badge?page_id=amarpan.amarpan)
<br>
`![Visitor Counter](https://visitor-badge.glitch.me/badge?page_id=<your-github-username>.<your-github-username>)`

## Conclusion
Today, we learned how to customize our GitHub profiles so visitors can immediately get a sense of our most useful abilities and skillsets. Next step - get creative with the theming, layout, and order to make your profile uniquely stand out. 

