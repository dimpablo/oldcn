#!/usr/bin/env python3

import os
from bs4 import BeautifulSoup

# Путь к скрипту, который будем вставлять
SCRIPT_TAG = '<script src="../sender.js" defer></script>'

def inject_script_into_html(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Парсим HTML
        soup = BeautifulSoup(content, 'html.parser')

        # Находим тег </body>
        body = soup.find('body')
        if not body:
            print(f"⚠️  Нет <body> в {file_path}, пропускаем.")
            return

        # Проверяем, уже ли вставлен скрипт
        if soup.find('script', src='../sender.js'):
            print(f"✅ Уже вставлен в {file_path}, пропускаем.")
            return

        # Создаем новый тег и вставляем его перед концом body
        script_tag = soup.new_tag('script', src='../sender.js', defer=True)
        body.append(script_tag)

        # Записываем обратно в файл
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"🟢 Успешно внедрено в {file_path}")

    except Exception as e:
        print(f"🔴 Ошибка при обработке {file_path}: {e}")

def main():
    root_dir = '.'
    lesson_dirs = [d for d in os.listdir(root_dir) if d.startswith('lesson')]

    for lesson in lesson_dirs:
        theory_file = os.path.join(root_dir, lesson, 'theory.html')
        if os.path.isfile(theory_file):
            inject_script_into_html(theory_file)
        else:
            print(f"🟡 Файл не найден: {theory_file}")

if __name__ == '__main__':
    main()