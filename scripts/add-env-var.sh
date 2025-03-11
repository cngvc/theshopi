#!/bin/bash

# Define the new line to add
NEW_LINE="ELASTIC_APM_SECRET_TOKEN="

# Find all .env and .env.* files and append the new line if not already present
find . -type f \( -name ".env" -o -name ".env.*" \) | while read file; do
  # Check if the line already exists
  if ! grep -q "^${NEW_LINE}$" "$file"; then
    echo "$NEW_LINE" >> "$file"
    echo "Added to: $file"
  else
    echo "Already exists in: $file"
  fi
done