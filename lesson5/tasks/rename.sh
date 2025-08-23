#!/bin/bash

# Проходим по всем файлам в текущей директории
for file in task*.html task*.txt; do
    # Проверяем, существует ли файл (на случай, если glob не нашёл совпадений)
    [[ -f "$file" ]] || continue

    if [[ "$file" == *.html ]]; then
        # Если это taskN.html → переименовываем в taskN.txt
        new_name="${file%.html}.txt"
        if [[ -f "$new_name" ]]; then
            echo "Ошибка: файл $new_name уже существует. Пропускаем $file"
            continue
        fi
        mv "$file" "$new_name"
        echo "Переименовано: $file → $new_name"

    elif [[ "$file" == *.txt ]]; then
        # Если это taskN.txt → переименовываем обратно в taskN.html
        new_name="${file%.txt}.html"
        if [[ -f "$new_name" ]]; then
            echo "Ошибка: файл $new_name уже существует. Пропускаем $file"
            continue
        fi
        mv "$file" "$new_name"
        echo "Переименовано: $file → $new_name"
    fi
done