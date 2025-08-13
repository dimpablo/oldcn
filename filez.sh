for file in *.html; do
  echo "=== 📄 $file ===" >> filez
  cat "$file" >> filez
  echo -e "\n" >> filez
done
