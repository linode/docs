#!/usr/bin/env python
import os
import re
import frontmatter

output_duplicates_filename = "duplicates.csv"

# ------------------
# Build a list of all aliases and map them to their current link
# ------------------

# The directory to be used when building the list of aliases
alias_directory = '../docs/'
# A dictionary that maps all aliases to the current (canonical) link
aliases = {}
# A dictionary that contains all the aliases that are duplicated on multiple guides
duplicate_aliases = {}

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
                if "/docs/guides/" in file_path:
                    canonical_link = "/docs/guides/" + guide['slug'] + "/"
                elif "/docs/products/" in file_path:
                    canonical_link = file_path.replace('../docs/','/docs/')
                    canonical_link = canonical_link.replace('/index.md','/')
                    canonical_link = canonical_link.replace('/_index.md','/')
                else:
                    # Go to the next file if it is not located in /guides/ or /products/
                    file.next()
                # Updates the aliases dictionary with all aliases in the guide
                # and maps them to the guide's canonical link
                for alias in guide['aliases']:
                    # Check if the alias already exists in the aliases dictionary
                    if aliases.get(alias) is not None:
                      # If it does exist, then it's a duplicate alias - which is not ideal as
                      # and a member of the docs team should manually intervene.
                      # Let's check to see if the duplicate alias has already been logged.
                      if duplicate_aliases.get(alias) is not None:
                          # If the duplicate has been logged, increment the count.
                          # This helps us identify how many times this alias appears.
                          count = duplicate_aliases.get(alias)
                          count = count + 1
                          duplicate_aliases.update({ alias : count})
                      # If the duplicate alias has not yet been logged, clear it and log it.
                      else:
                        # Log the duplicate, starting the count at 2
                        duplicate_aliases.update({ alias : 2})
                    # If the alias does not yet exist in the aliases dictionary, add it
                    else:
                      aliases.update({ alias : canonical_link})
            except:
                continue

# To view aliases, use print(aliases)

# ------------------
# Find all markdown links, identify if they are an old link (alias), and replace them with the current link
# ------------------

# The directory to be used when replacing old links
link_directory = '../docs/guides/development/'
# A list of all links that point to duplicate aliases
links_to_duplicate_aliases = []

# The regex pattern used to locate all markdown links containing the string "/docs".
# This bypasses any external urls and archor links
link_pattern = re.compile("(?:[^\!]|^)\[([^\[\]]+)\]\((/docs)([^()]+)\)")

# Iterate through each markdown file within the link_directory
for root, dirs, files in os.walk(link_directory):
    for file in files:
        if file.endswith('.md'):

            # The relative file path of the file
            file_path = os.path.join(root, file)

            print(file_path)

            # Iterate through each line of the file
            for i, line in enumerate(open(file_path)):
                # Find and iterate through all markdown links to other guides
                for match in re.finditer(link_pattern, line):
                    # Remove the title, brackets, and parenthesis from the markdown link
                    link = match.group()
                    link = link[link.find("(")+1:link.find(")")]
                    # Remove /docs/ from the link so its formatted the same as aliases
                    link_as_alias = link.replace('/docs/','/')
                    # Searches the aliases dictionary for the canonical link
                    link_canonical = aliases.get(link_as_alias)
                    # Checks if the link matches an alias (is not current)
                    if link_canonical is not None:
                        # Checks if the link matches a duplicate
                        if duplicate_aliases.get(link_as_alias):
                            with open(output_duplicates_filename, "w") as f:
                                f.write(link_as_alias)
                            print("SKIPPED LINK | Points to duplicate aliases: " + link)
                        else:
                            print("UPDATED LINK | " + file_path + " | Changed " + link + " to " + link_canonical)
                            # Replace the outdated link with the new link
                            with open(file_path) as f:
                                updated_contents=f.read().replace(link, link_canonical)
                            with open(file_path, "w") as f:
                                f.write(updated_contents)
                    # Check to see if the link matches a current link.
                    else:
                        continue

# Log duplicate to Excel
# alias, link to guide that it appears on