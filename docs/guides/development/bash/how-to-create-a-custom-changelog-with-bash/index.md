---
slug: how-to-create-a-custom-changelog-with-bash
author:
  name: Linode Community
  email: docs@linode.com
description: "In this guide, the user would learn how to create a bash script that would generate a custom changelog. A changelog is a simple log that details and describes what changes have been made in a project's code or development since the last merged change. After completing this guide, the user would have a versatile bash script that could be implemented into a wide variety of existing or future projects."
og_description: "In this guide, the user would learn how to create a bash script that would generate a custom changelog. A changelog is a simple log that details and describes what changes have been made in a project's code or development since the last merged change. After completing this guide, the user would have a versatile bash script that could be implemented into a wide variety of existing or future projects."
keywords: ['bash','script','changelog','linux','custom','log']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-26
modified_by:
  name: Linode
title: "How to Create a Custom Changelog with Bash"
h1_title: "How to Create a Custom Changelog with Bash"
enable_h1: true
contributor:
  name: Linode Community
external_resources:
  - '[nano](https://www.nano-editor.org/docs.php)'
  - '[Keep a Changelog](https://keepachangelog.com/en/1.0.0/'
  - '[Semantic Versioning](https://semver.org/spec/v2.0.0.html)'
---

A changelog is a record of changes made to a project or repository. A changelog is important to track developments, edits, and revisions to your code, as well as showcase new features in your project. 

In this guide, learn to create a bash script that allows us to create a changelog that is fully customizable. This changelog can be edited to suit your project's specific needs as far as documentation and accountability. 

## Before You Begin

1. Familiarize yourself with the Introduction to Linux Concepts  [Introduction to Linux Concepts](/docs/guides/introduction-to-linux-concepts/). 

{{< note >}}
This guide is written using a non-root user account.
For any commands that require elevated privileges, `sudo` is prefixed at the start of the command syntax.
If you're unfamiliar with the `sudo` command workflow, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}


## Creating a Project Files

Start by creating a new project directory for your script by using the following command:

`mkdir changelog-project`

Navigate into the new directory with the following command:

`cd changelog-project`

Then, create a new empty file:

`touch changelog.sh`

Before we edit the script, we need to change the permissions to allow the script to be executed. Use the follow command to edit the permissions:

`chmod u+x changelog.sh`

## Creating the Bash Script

Open this file in the nano text editor. For more information on Linux nano, check out this [documentation.](/docs/guides/use-nano-to-edit-files-in-linux/)

First, start by creating a prompt that will begin the changelog script. This prompt then records the value you enter to be referenced later. 

```
#!/bin/bash

echo "Would you like to add a changelog item? (Y/N)"

read CHANGELOG_START

```

Next, create an `if` statement that determines if the value entered was the character 'y':

```
if [ "$CHANGELOG_START" == "Y" ]  || [ "$CHANGELOG_START" == "y" ];

```

Then, create a series of prompts for the changelog information. These prompts include a version number and output file name. Each value entered at these prompts is stored as a variable.

```
then
    echo Starting script...
    echo "Please enter the changelog version:"
    read VERSION
    echo "Please enter the output file:"
    read FILE
    changelog="$FILE"
    version="$VERSION"
    date="$(date '+%Y-%m-%d')"
    item="## [$VERSION] - $date"
    
```

Next, create a prompt for the actual changelog entry:

```
    echo "Enter the changelog item:"
    read CHANGELOG_ITEM
```

Then create a function called 'new_changelog()'. This function echos the Changelog's informaton.Edit this function with the information you want to be reflected in your changelog. 

```
    new_changelog()
      {
      echo "# Changelog
      This changelog showcases all notable edits, revisions, and updates to this project.
      The format is based off of [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
      ## [Unreleased]
      $item
      ### Added
      $CHANGELOG_ITEM
          " > $FILE
      }
```



Then create a new function called 'new_changelog_item()'. This function adds a new item to the changelog and provides an error checking function to avoid duplicate entries. 

```
new_changelog_item()
    {
        echo $item
        if grep -Fxq "$item" $FILE; then
            echo "Changelog item already exists for
        $item"
        else
            while read line; do
                if [[ $line == "## [Unreleased]"* ]]; then
                    newvar=$(<<<"$line" sed 's/[].*[]/\\&/g')
                    sed -i "" "s/$newvar/## [Unreleased]\n\n$item\n### Added\n- $CHANGELOG_ITEM. /" $FILE
                    return
                fi
            done < $FILE
        fi
    }

```

Lastly, create a function that will test and initialize your first two functions. This is an important debugging function. 

```
init()
    {
        if test -f "$changelog" ; then
            new_changelog_item
        else
            new_changelog
        fi
    }
    init
```

Then, end the initial `if` statement with an `else` clause, meaning if the value 'y' is not entered at the start, the script will exit.
```
else
    exit;
fi
```

Overall, your script should resemble the following:

```
#!/bin/bash

echo "Would you like to add a changelog item? (Y/N)"

read CHANGELOG_START

if [ "$CHANGELOG_START" == "Y" ]  || [ "$CHANGELOG_START" == "y" ];
then
    echo Starting script...
    echo "Please enter the changelog version:"
    read VERSION
    echo "Please enter the output file:"
    read FILE
    changelog="$FILE"
    version="$VERSION"
    date="$(date '+%Y-%m-%d')"
    item="## [$VERSION] - $date"

    echo "Enter the changelog item:"
    read CHANGELOG_ITEM
    new_changelog()
    {
    echo "# Changelog
    This changelog showcases all notable edits, revisions, and updates to this project.
    The format is based off of [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
    ## [Unreleased]
    $item
    ### Added
    $CHANGELOG_ITEM
        " > $FILE
    }

    new_changelog_item()
    {
        echo $item
        if grep -Fxq "$item" $FILE; then
            echo "Changelog item already exists for
        $item"
        else
            while read line; do
                if [[ $line == "## [Unreleased]"* ]]; then
                    newvar=$(<<<"$line" sed 's/[].*[]/\\&/g')
                    sed -i "" "s/$newvar/## [Unreleased]\n\n$item\n### Added\n- $CHANGELOG_ITEM. /" $FILE
                    return
                fi
            done < $FILE
        fi
    }

    init()
    {
        if test -f "$changelog" ; then
            new_changelog_item
        else
            new_changelog
        fi
    }
    init
else
    exit;
fi
```

## Running the Script

Run the bash script with the following command:

`./changelog.sh`

This script creates a new file with your specificed name that contains your changelog. 
