import os
import frontmatter
import csv
import argparse

# Define command-line arguements
parser = argparse.ArgumentParser(description='Script that generatees a CSV file of guides and processes actions added to that file.')
parser.add_argument('--process', help="Process actions added to the CSV file", default=False, action=argparse.BooleanOptionalAction)
ARGS = parser.parse_args()

# Identifies if --process arguement has been used and, if so, set PROCESS_MODE to true
PROCESS_MODE = False
if ARGS.process:
    PROCESS_MODE = True

# Define the Guide class
class Guide:
    def __init__(self, slug, root, path, title, uri, published, modified, deprecated, deprecated_link):
        self.slug = slug
        self.root = root
        self.path = path
        self.title = title
        self.uri = uri
        self.published = published
        self.modified = modified
        self.deprecated = deprecated
        self.deprecated_link = deprecated_link

# Define the path used for all input and output csv files
data_path = "../data/"

# Path and name for the file that will be generated that contains all guides and analaytics data
aggregate_file = data_path + "guides.csv"
# Path and name for the file that contains Google Search Console data
search_file = data_path + "search_data.csv"
# Path and name for the file that contains Adobe Analytics data
analytics_file = data_path + "analytics_data.csv"
# Path and name for the file that contains actions to be performed on guides (a modified version of the aggregate_file)
process_file = data_path + "guides_process.csv"

# ------------------
# Generate an array of all guides
# ------------------
def get_guides():

    guides = []

    guides_dir = "docs/guides"

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

                    # If the guide is in the guides section...
                    if "slug" in expanded_guide.keys() and "docs/guides/" in file_path:

                        # Get various front matter parameters from the guide
                        slug = expanded_guide['slug']
                        title = expanded_guide['title']
                        published = expanded_guide['published']
                        if "modified" in expanded_guide.keys():
                            modified = expanded_guide['modified']
                        else:
                            modified = published
                        if "deprecated" in expanded_guide.keys():
                            deprecated = expanded_guide['deprecated']
                        else:
                            deprecated = False
                        if "deprecated_link" in expanded_guide.keys():
                            deprecated_link = expanded_guide['deprecated_link']
                        else:
                            deprecated_link = ""

                        # Construct the URI for the guide
                        uri = "/docs/guides/" + slug + "/"

                        # Construct the guide object
                        guide = Guide(slug, root, file_path, title, uri, published, modified, deprecated, deprecated_link)

                        # Append the guide object to the list of guides
                        guides.append(guide)
                except Exception as e: print(e)
    return guides

# ------------------
# Generate a CSV for guides, aggregating data from other sources
# ------------------
def generate_csv(guides):

    # An array that contains the keys (first row headers) for the CSV file to be generated
    guide_keys = ["Title", "Published", "Modified", "Slug", "Deprecated", "Deprecated Link", "Visitors", "Page Views", "Clicks", "Impressions", "CTR", "Position", "Action", "Redirect Link", "Notes"]

    # Write to the CSV file used for aggregating all data
    with open(aggregate_file, 'w+') as file:
      writer = csv.writer(file)

      # Write the first row of the CSV file (header row)
      writer.writerow(guide_keys)

      # Loop through all guides.
      for guide in guides:
          visitors = 0
          page_views = 0
          clicks = ""
          impressions = ""
          ctr = ""
          position = ""

          # Get data from analytics file
          for row in csv.reader(open(analytics_file, "r", encoding='utf-8'), delimiter=","):
              if len(row) < 3:
                  continue
              if row[0] == "www.linode.com" + guide.uri:
                  visitors = row[1]
                  page_views = row[2]

          # Get data from search file
          for row in csv.reader(open(search_file, "r", encoding='utf-8'), delimiter=","):
              if len(row) < 5:
                  continue
              if row[0] == "https://www.linode.com" + guide.uri:
                  clicks = row[1]
                  impressions = row[2]
                  ctr = row[3]
                  position = row[4]

          # Write a row to the CSV file contianing all information for this guide.
          writer.writerow(["=HYPERLINK(\"https://www.linode.com" + guide.uri + "\",\" " + guide.title + "\")", guide.published, guide.modified, guide.slug, guide.deprecated, guide.deprecated_link, visitors, page_views, clicks, impressions, ctr, position])

# ------------------
# Process CSV file and perform the "Deprecate" action as needed
# ------------------
def process_csv(guides):

    # Open modified aggregated data file and read in the data
    with open(process_file, newline='') as csvfile:
      reader = csv.DictReader(csvfile)

      # Iterate through each row in the CSV file and determine if the action is "Deprecate"
      for row in reader:
          if row['Action'] == "Deprecate":

              # If there is an action of "Deprecate, find the cooresponding guide in the guides array
              for guide in guides:
                if row["Slug"] == guide.slug and not guide.deprecated == True:

                    # Capture the intended redirect link (deprecated_link) from the CSV file
                    redirect_link = row["Redirect Link"]

                    with open(guide.path, "r") as fp:
                        lines = fp.readlines()
                    with open(guide.path, "w") as fp:

                        frontmatter = False
                        yaml_token = "---"
                        yaml_token_counter = 0
                        existing_deprecated_status = False
                        existing_deprecated_link = False

                        # Iterate through each line in the file
                        for line in lines:

                            # Determine if the front matter section has started or ended
                            if line.startswith(yaml_token) and yaml_token_counter == 0:
                                yaml_token_counter += 1
                                frontmatter = True
                            elif line.startswith(yaml_token) and yaml_token_counter == 1:
                                yaml_token_counter += 1
                                frontmatter = False
                            elif line.startswith(yaml_token):
                                yaml_token_counter += 1

                            # If there's an existing deprecated parameter, skip it (do not write it to the file). It will be added back in later.
                            if frontmatter and line.startswith("deprecated:"):
                                continue
                            # If there's an existing deprecated_link parameter, skip it (do not write it to the file). It will be added back in later.
                            elif frontmatter and line.startswith("deprecated_link:"):
                                continue

                            # If the line is the last line of the front matter, write the deprecated parameter and the deprecated_link parameter
                            if line.startswith(yaml_token) and yaml_token_counter == 2:
                                fp.write("deprecated: true\n")
                                if not redirect_link == "":
                                  fp.write("deprecated_link: \'" + redirect_link + "\'\n")
                                fp.write("---\n")
                            else:
                                fp.write(line)

# ------------------
# Main function
# ------------------
def main():

    # Get all guides
    guides = get_guides()

    # If --process has been passed, run the process_csv function. Otherwise, run the generate_csv function.
    if PROCESS_MODE == False:
        generate_csv(guides)
    else:
        process_csv(guides)

if __name__ == "__main__":
    main()