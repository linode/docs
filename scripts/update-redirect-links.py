#!/usr/bin/env python
import os
import re
import frontmatter

# The directory to be used when building the list of aliases
alias_directory = '../docs/guides/'
aliases = {}

for root, dirs, files in os.walk(alias_directory):
    for file in files:
        if file.endswith('.md'):

            file_path = os.path.join(root, file)

            try:
                post = frontmatter.load(file_path)

                canonical_link = "/docs/guides/" + post['slug'] + "/"
                aliases.update ({ i : canonical_link for i in post['aliases'] })
            except:
                continue

# To view aliases, use print(aliases)

# The directory to be used when replacing old links
link_directory = '../docs/guides/game-servers/'

# The regex to locate any markdown links containing "/docs"
link_pattern = re.compile("(?:[^\!]|^)\[([^\[\]]+)\]\((/docs)([^()]+)\)")

for root, dirs, files in os.walk(link_directory):
    for file in files:
        if file.endswith('.md'):

            file_path = os.path.join(root, file)

            for i, line in enumerate(open(file_path)):
                for match in re.finditer(link_pattern, line):
                    #print(match.group())
                    link = (match.group()).replace('/docs/','/')
                    link = link[link.find("(")+1:link.find(")")]
                    #print(link)
                    #if link in aliases:
                    if aliases.get(link) is not None:
                        print(link + " redirects to " + aliases.get(link))
                    else:
                        continue