#!/usr/bin/env python
import os
import sys
import re
import textwrap

DOCS_DIR = [
    "docs/guides",
    "docs/products",
    "docs/bundles",
    "docs/assets",
    "docs/api",
    "docs/reference-architecture",
    "docs/release-notes"
]

# This file contains functions that were previously used to update various
# front matter parameters. This is stored here for archive use only.

# ------------------
# Parses through each file and, if that file contains an h1_title, updates it
# to use the new title_meta parameter instead.
# ------------------
def update_titles():

    # Iterate through each file in each docs directory
    for dir in DOCS_DIR:
        for root, dirs, files in os.walk(dir):
            for file in files:

                # The relative file path of the file
                file_path = os.path.join(root, file)
                path_segments = file_path.split("/")

                # If the file is markdown...
                if file.endswith('.md'):

                    with open(file_path, "r") as fp:
                        lines = fp.readlines()

                    title = ""
                    title_meta = ""
                    h1_title = ""

                    frontmatter = False
                    yaml_token = "---"
                    yaml_token_counter = 0
                    update = False
                    duplicate_title = False

                    # Iterates through each line of the file and locates
                    # the title and h1_title parameters.
                    for i, line in enumerate(lines):
                        if line.startswith(yaml_token) and yaml_token_counter == 0:
                            yaml_token_counter += 1
                            frontmatter = True
                        elif line.startswith(yaml_token) and yaml_token_counter == 1:
                            yaml_token_counter += 1
                            frontmatter = False

                        if frontmatter == False:
                            continue

                        if line.startswith("title:"):
                            title = line
                        elif line.startswith("title_meta:"):
                            title_meta = line
                        elif line.startswith("h1_title:"):
                            h1_title = line

                    # Update title if h1_tile exists
                    if not h1_title == "":
                        title_meta = title.replace("title:", "title_meta:")
                        title = h1_title.replace("h1_title:", "title:")
                        update = True

                    # If there is no h1_title, go to the next file.
                    if not update:
                        continue

                    # Determine if title and title_meta are duplicates
                    if title.replace("title:","") == title_meta.replace("title_meta:",""):
                        duplicate_title = True

                    # Reset the yaml token counter
                    yaml_token_counter = 0

                    # Write to the file
                    with open(file_path, "w") as fp:
                        for line in lines:

                            if line.startswith(yaml_token) and yaml_token_counter == 0:
                                yaml_token_counter += 1
                                frontmatter = True
                            elif line.startswith(yaml_token) and yaml_token_counter == 1:
                                yaml_token_counter += 1
                                frontmatter = False

                            if frontmatter:
                                if line.startswith("title:") and duplicate_title:
                                    fp.write(title)
                                elif line.startswith("title:") and not duplicate_title:
                                    fp.write(title)
                                    fp.write(title_meta)
                                elif not line.startswith("h1_title:") and not line.startswith("enable_h1:"):
                                    fp.write(line)
                            else:
                                fp.write(line)

# ------------------
# Removes duplicate title and description front matter parameters
# ------------------
def remove_duplicate_parameters():

    # Iterate through each file in each docs directory
    for dir in DOCS_DIR:
        for root, dirs, files in os.walk(dir):
            for file in files:

                # The relative file path of the file
                file_path = os.path.join(root, file)
                path_segments = file_path.split("/")

                # If the file is markdown...
                if file.endswith('.md'):

                    with open(file_path, "r") as fp:
                        lines = fp.readlines()

                    title = ""
                    title_meta = ""
                    description = ""
                    og_description = ""

                    frontmatter = False
                    yaml_token = "---"
                    yaml_token_counter = 0
                    update = False
                    duplicate_title = False
                    duplicate_description = False

                    # Iterates through each line of the file and locates
                    # the title and description parameters.
                    for i, line in enumerate(lines):
                        if line.startswith(yaml_token) and yaml_token_counter == 0:
                            yaml_token_counter += 1
                            frontmatter = True
                        elif line.startswith(yaml_token) and yaml_token_counter == 1:
                            yaml_token_counter += 1
                            frontmatter = False

                        if frontmatter == False:
                            continue

                        if line.startswith("title:"):
                            title = line
                        elif line.startswith("title_meta:"):
                            title_meta = line
                        elif line.startswith("description:"):
                            description = line
                        elif line.startswith("og_description:"):
                            og_description = line

                    # Determine if title and title_meta are duplicates
                    if title.replace("title:","") == title_meta.replace("title_meta:",""):
                        duplicate_title = True

                    # Determine if description and og_description are duplicates
                    if description.replace("description:","") == og_description.replace("og_description:",""):
                        duplicate_description = True

                    # If there are no duplicates, go to the next file.
                    if not (duplicate_title or duplicate_description):
                        continue

                    # Reset the yaml token counter
                    yaml_token_counter = 0

                    # Write to the file
                    with open(file_path, "w") as fp:
                        for line in lines:

                            if line.startswith(yaml_token) and yaml_token_counter == 0:
                                yaml_token_counter += 1
                                frontmatter = True
                            elif line.startswith(yaml_token) and yaml_token_counter == 1:
                                yaml_token_counter += 1
                                frontmatter = False

                            if frontmatter:
                                if line.startswith("title_meta:") and duplicate_title:
                                    continue
                                elif line.startswith("og_description:") and duplicate_description:
                                    continue
                                else:
                                    fp.write(line)
                            else:
                                fp.write(line)

# ------------------
# Main function
# ------------------
def main():

    update_titles()
    remove_duplicate_parameters()

if __name__ == "__main__":
    main()