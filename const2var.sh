#!/bin/bash

# Script to replace 'const SentenceData =' with 'var SentenceData =' in 
segmentation.js files

echo "🚀 Searching for segmentation.js files and replacing 'const' with 
'var'..."

# Find all segmentation.js files recursively and process them with sed
# -type f : only files
# -name "segmentation.js" : exact filename match
# -exec ... {} \; : execute the command on each found file
# sed -i.bak : edit files in-place, create a .bak backup
# 's/const SentenceData =/var SentenceData =/' : the substitution command
find . -type f -name "segmentation.js" -exec sed -i.bak 's/const 
SentenceData =/var SentenceData =/g' {} \; -exec echo "✅ Processed file: 
{}" \;

# Optional: Uncomment the line below if you want to automatically delete 
the .bak files
# find . -type f -name "segmentation.js.bak" -delete

echo "🏁 Replacement complete."
