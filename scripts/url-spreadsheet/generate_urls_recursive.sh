#!/bin/bash

# Get the absolute path to where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define the path to parse, assuming it's always in "/docs/docs/guides" relative to the repository root
GUIDES_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)/docs/guides"

# Define the output CSV file in the script's directory
OUTPUT_FILE="$SCRIPT_DIR/urls.csv"

# Define the base URL
BASE_URL="https://www.linode.com/docs/guides/"

# Initialize the CSV file with a header
echo "URL,Title,Description,Keyword(s),Deprecation Status,Published Date,Updated Date" > "$OUTPUT_FILE"

# Function to extract and trim a given field from a line
extract_field() {
  echo "$1" | sed "s/^$2:\s*//" | xargs
}

# Function to sanitize the description field
sanitize_description() {
  echo "$1" | sed 's/"/'\''/g; s/'"'"'/\\'"'"'/g; s/,/\\,/g; s/:/\\:/g; s/;/\\;/g' | xargs
}

# Function to clean and format the keywords field
format_keywords() {
  echo "$1" | sed 's/[][]//g' | sed 's/, */, /g' | xargs
}

# Function to parse fields and build the CSV
parse_directory_recursively() {
  local dir="$1"

  # Find all index.md files recursively in the directory, excluding specified folders
  find "$dir" -type d \( -name "_shortguides" -o -name "concentrations" -o -name "audiences" -o -name "linode-writers-formatting-guide" \) -prune -o -type f -name "index.md" -print | while read -r file; do
    # Initialize default values
    slug=""
    title=""
    description=""
    keywords=""
    deprecated="false"
    published_date=""
    updated_date=""

    # Extract fields from each line
    while read -r line; do
      case "$line" in
        slug:*)
          slug=$(extract_field "$line" "slug")
          ;;
        title:*)
          title=$(extract_field "$line" "title")
          ;;
        description:*)
          description=$(extract_field "$line" "description")
          description=$(sanitize_description "$description")
          ;;
        keywords:*)
          keywords=$(extract_field "$line" "keywords")
          keywords=$(format_keywords "$keywords")
          ;;
        deprecated:*)
          deprecated_value=$(extract_field "$line" "deprecated")
          if [ "$deprecated_value" = "true" ]; then
            deprecated="true"
          fi
          ;;
        published:*)
          published_date=$(extract_field "$line" "published")
          ;;
        modified:*)
          updated_date=$(extract_field "$line" "modified")
          ;;
      esac
    done < "$file"

    # Construct the full URL without spaces, if slug exists
    if [ -n "$slug" ]; then
      full_url="${BASE_URL}${slug}"

      # Append the data to the CSV file
      echo "\"$full_url\",\"$title\",\"$description\",\"$keywords\",\"$deprecated\",\"$published_date\",\"$updated_date\"" >> "$OUTPUT_FILE"
    fi
  done
}

# Parse the designated guides directory
parse_directory_recursively "$GUIDES_DIR"

echo "Data has been written to $OUTPUT_FILE"