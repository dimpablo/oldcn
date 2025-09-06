#!/bin/bash

# Ищем файлы quiz.html и translateall.html в текущей директории
if [[ ! -f "quiz.html" ]] || [[ ! -f "translateall.html" ]]; then
    echo "Ошибка: файлы quiz.html и/или translateall.html не найдены в 
текущей директории."
    exit 1
fi

# Копируем файлы во все папки lesson1, lesson2, ..., lesson21
for i in {1..21}; do
    dir="lesson$i"
    if [[ -d "$dir" ]]; then
        echo "Копирую в $dir..."
        cp -f quiz.html "$dir/"
        cp -f translateall.html "$dir/"
        echo "  ✓ Успешно скопировано"
    else
        echo "Папка $dir не существует — пропускаем."
    fi
done

echo "Готово! Файлы скопированы во все существующие папки 
lesson1–lesson21."
