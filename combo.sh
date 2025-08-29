#!/bin/bash

# Имя итогового файла
OUTPUT="all_tasks_combined.txt"

# Начинаем с чистого файла
> "$OUTPUT"

# Путь к корневой директории (можно изменить при необходимости)
BASE_DIR="/Users/inok_Roman/Desktop/GIT/main/oldcn"

echo "Объединяю файлы filez.txt из уроков 1-10..."

# Цикл по урокам от 1 до 10
for i in {1..10}; do
    TASK_DIR="$BASE_DIR/lesson$i/tasks"
    FILEZ_PATH="$TASK_DIR/filez.txt"
    
    if [[ -f "$FILEZ_PATH" ]]; then
        echo "Добавляю содержимое из lesson$i..."
        echo "==== ИЗ ПАПКИ УРОКА $i: ====" >> "$OUTPUT"
        cat "$FILEZ_PATH" >> "$OUTPUT"
        echo -e "\n" >> "$OUTPUT"  # Добавляем пустые строки для разделения
    else
        echo "⚠️  Файл filez.txt не найден в $TASK_DIR"
    fi
done

echo "✅ Готово! Все файлы объединены в $OUTPUT"