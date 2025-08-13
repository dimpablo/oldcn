for file in *.html; do
  echo "=== 📄 $file ===" >> filez.txt
  cat "$file" >> filez.txt
  echo -e "\n" >> filez.txt
done
