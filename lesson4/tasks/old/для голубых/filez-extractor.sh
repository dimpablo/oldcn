#!/bin/bash

INPUT_FILE="filez.txt"

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "❌ Ошибка: файл $INPUT_FILE не найден!"
  exit 1
fi

echo "🔄 Восстановление HTML-файлов из $INPUT_FILE..."

current_file=""

while IFS= read -r line || [[ -n "$line" ]]; do
  # Проверяем, начинается ли строка с шаблона заголовка
  if [[ "$line" =~ ^===\ 📄\ task.*\.html\ === ]]; then
    # Извлекаем имя файла с помощью регулярного выражения
    if [[ "$line" =~ ^===\ 📄\ (task[^[:space:]]+\.html)\ === ]]; then
      current_file="${BASH_REMATCH[1]}"
    else
      echo "⚠️ Не удалось извлечь имя файла из: $line"
      current_file=""
      continue
    fi

    # Создаём файл (очищаем, если существует)
    > "$current_file"
    echo "✅ Начато восстановление: $current_file"

  elif [[ -n "$current_file" ]]; then
    # Записываем строку в текущий файл
    # Даже если line пустая — echo добавит пустую строку
    echo "$line" >> "$current_file"
  fi
done < "$INPUT_FILE"

echo "🎉 Восстановление завершено! Все найденные файлы сохранены."
