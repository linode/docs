# ------------------
# Generate a CSV for guides
# ------------------
def create_csv():

    guides_dir = "docs/guides"
    output_file = "/Users/mwildman/Documents/guides.csv"
    analytics_file = "~/Documents/analytics_data.csv"

    # Iterate through each file in each docs directory
    for root, dirs, files in os.walk(guides_dir):
        for file in files:

            # The relative file path of the file
            file_path = os.path.join(root, file)
            path_segments = file_path.split("/")

                # If the file is markdown..
                if file.endswith('.md'):
                    try:
                        # Loads the entire guide (including front matter)
                        expanded_guide = frontmatter.load(file_path)

                        # Ignores the guide if it's headless
                        if "headless" in expanded_guide.keys():
                            if expanded_guide["headless"] == True:
                                continue

                        # Identifies the canonical link for a guide
                        # ... If the guide is in the guides section...
                        if "slug" in expanded_guide.keys() and "docs/guides/" in file_path:
                            canonical_link = "/docs/guides/" + expanded_guide['slug'] + "/"

                        # Construct the guide object
                        guide = Guide(root, file_path, expanded_guide['title'], canonical_link)

                        # Add aliases to the guide object if they exist
                        if "aliases" in expanded_guide.keys():
                            guide.add_aliases(expanded_guide['aliases'])

                        # Append the guide object to the list of guides
                        guides.append(guide)

                    except Exception as e: print(e)
# ------------------
# Main function
# ------------------
def main():

    guides, assets, issues = get_guides()

if __name__ == "__main__":
    main()