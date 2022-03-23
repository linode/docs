#!/usr/bin/env python
import os
import re
import frontmatter

# ------------------
# Build a list of all aliases and map them to their current link
# ------------------

# The directory to be used when building the list of aliases
alias_directory = '../docs/guides/'
# A dictionary that maps all aliases to the current (canonical) link
aliases = {}

# Iterate through each markdown file within the alias_directory
for root, dirs, files in os.walk(alias_directory):
    for file in files:
        if file.endswith('.md'):

            # The relative file path of the file
            file_path = os.path.join(root, file)

            try:
                # Loads the entire guide (including front matter)
                guide = frontmatter.load(file_path)
                # Creates the canonical (current) link for the guide
                canonical_link = "/docs/guides/" + guide['slug'] + "/"
                # Updates the aliases dictionary with all aliases in the guide
                # and maps them to the guide's canonical link
                aliases.update ({ i : canonical_link for i in guide['aliases'] })
            except:
                continue

# To view aliases, use print(aliases)

# ------------------
# Find all markdown links, identify if they are an old link (alias), and replace them with the current link
# ------------------

# The directory to be used when replacing old links
link_directory = '../docs/guides/game-servers/'

# The regex pattern used to locate all markdown links containing the string "/docs".
# This bypasses any external urls and archor links
link_pattern = re.compile("(?:[^\!]|^)\[([^\[\]]+)\]\((/docs)([^()]+)\)")

# Iterate through each markdown file within the link_directory
for root, dirs, files in os.walk(link_directory):
    for file in files:
        if file.endswith('.md'):

            # The relative file path of the file
            file_path = os.path.join(root, file)

            # Iterate through each line of the file
            for i, line in enumerate(open(file_path)):
                # Find and iterate through all markdown links to other guides
                for match in re.finditer(link_pattern, line):
                    # Remove the title, brackets, and parenthesis from the markdown link
                    link = (match.group()).replace('/docs/','/')
                    link = link[link.find("(")+1:link.find(")")]

                    # Determine if the link is an alias (not current)
                    if aliases.get(link) is not None:
                        print(link + " redirects to " + aliases.get(link))
                    else:
                        continue