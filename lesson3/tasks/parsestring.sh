#!/bin/bash

# fix-matched-pairs.sh
# Ищет все HTML-файлы и заменяет if (matchedPairs === N) на pairs.length

echo "Поиск и исправление HTML-файлов..."

# Шаблон: if (matchedPairs === <число>) {
# Поддерживает пробелы вокруг === и число
find . -name "*.html" -type f | while read file; do
    # Создаём временную копию
    temp_file=$(mktemp)

    # Флаг: была ли замена?
    changed=0

    while IFS= read -r line; do
        # Проверяем, есть ли совпадение с шаблоном
        if [[ $line =~ if\ \(matchedPairs[[:space:]]*===?[[:space:]]*([0-9]+)[[:space:]]*\)\s*\{ ]]; then
            number="${BASH_REMATCH[1]}"
            echo "✅ Найдено в $file: if (matchedPairs === $number) {"
            echo "   Заменено на: if (matchedPairs === pairs.length) {"
            echo "${line//if (matchedPairs === $number) {/if (matchedPairs === pairs.length) {/" >> "$temp_file"
            changed=1
        else
            echo "$line" >> "$temp_file"
        fi
    done < "$file"

    # Если были изменения — заменяем файл
    if [ $changed -eq 1 ]; then
        cp "$temp_file" "$file"
        echo "   → Файл обновлён: $file"
    fi

    # Удаляем временный файл
    rm "$temp_file"
done

echo "✅ Готово. Проверка завершена."