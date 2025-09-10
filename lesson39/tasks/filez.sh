#!/bin/bash

> filez.txt  # Очищаем или создаём пустой файл

for file in task*.html; do
  # Проверяем, существует ли файл (на случай, если нет совпадений)
  if [[ -f "$file" ]]; then
    echo "=== 📄 $file ===" >> filez.txt
    cat "$file" >> filez.txt
    echo -e "\n" >> filez.txt
  fi
done

echo "✅ Готово! Все файлы task*.html объединены в filez.txt"