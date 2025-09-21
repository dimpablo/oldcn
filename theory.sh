#!/bin/bash

# Создаем папку theories, если она не существует
mkdir -p theories

# Ищем все файлы theory.html в папках lesson* и копируем их
# в папку theories с новым именем
for lesson_dir in lesson*/; do
  # Проверяем, существует ли папка (на случай, если glob ничего не нашел)
  if [[ -d "$lesson_dir" ]]; then
    # Получаем имя папки без слэша в конце
    lesson_name="${lesson_dir%/}"
    # Проверяем, существует ли файл theory.html внутри папки
    if [[ -f "${lesson_dir}theory.html" ]]; then
      # Копируем файл с новым именем
      cp "${lesson_dir}theory.html" "theories/${lesson_name}.html"
      echo "Скопирован ${lesson_dir}theory.html в theories/${lesson_name}.html"
    else
      # Файл theory.html не найден в этой папке
      echo "Файл theory.html не найден в ${lesson_dir}"
    fi
  fi
done

echo "Готово! Файлы скопированы в папку theories."

