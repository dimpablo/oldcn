#!/bin/bash

# Создаем папку backup, если её нет
echo "🔄 Создание папки backup..."
mkdir -p backup

# Сохраняем все task*.html файлы в папку backup
echo "💾 Копирование оригинальных файлов в backup..."
cp task*.html backup/ 2>/dev/null || echo "⚠️ Не найдено файлов task*.html для резервного копирования"

# Обрабатываем каждый HTML-файл
echo "🧹 Обработка файлов task*.html..."

for file in task*.html; do
  # Проверяем, существует ли файл
  if [[ ! -f "$file" ]]; then
    echo "❌ Файлы task*.html не найдены"
    continue
  fi

  echo "📝 Обработка файла: $file"

  # Проверяем, не содержит ли уже ссылку на tasks.css
  if grep -q "tasks\.css" "$file"; then
    echo "✅ $file уже использует tasks.css — пропускаем"
    continue
  fi

  # Определяем путь к tasks.css как относительный путь на уровень выше
  css_path="../../tasks.css"

  # Удаляем блок <style>...</style> и вставляем ссылку на ../tasks.css
  if grep -q "<style>" "$file"; then
    sed -i.bak -E '
      /<style>/,/<\/style>/{
        /<head>/!{
          /<style>/,/<\/style>/d
        }
      }
      /<head>/a\
    <link rel="stylesheet" href="'"$css_path"'">
    ' "$file"

    # Удаляем временный бэкап от sed
    rm -f "$file.bak"

    echo "✨ $file обновлен: добавлена ссылка на ../tasks.css"
  else
    # Если нет <style>, просто добавляем ссылку
    sed -i.bak '/<head>/a\
  <link rel="stylesheet" href="'"$css_path"'">\
' "$file"
    rm -f "$file.bak"
    echo "🔗 $file: добавлена ссылка на ../tasks.css (не было стилей)"
  fi
done

echo "✅ Готово! Все файлы обновлены для использования ../tasks.css"
echo "📂 Резервные копии сохранены в папке ./backup/"