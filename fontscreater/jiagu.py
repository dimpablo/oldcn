#!/usr/bin/env python3

import fontforge
import os
import sys

# Пути
FONT_PATH = "jiaguwen.ttf"
SVG_DIR = "oracle_chars"
OUTPUT_FONT = "jiaguwen_enhanced.ttf"

# Проверка шрифта
if not os.path.exists(FONT_PATH):
    print(f"❌ Файл шрифта не найден: {FONT_PATH}")
    sys.exit(1)

if not os.path.exists(SVG_DIR):
    print(f"❌ Папка с SVG не найдена: {SVG_DIR}")
    sys.exit(1)

# Открываем шрифт
try:
    font = fontforge.open(FONT_PATH)
    print(f"✅ Шрифт загружен: {FONT_PATH}")
except Exception as e:
    print(f"❌ Ошибка загрузки шрифта: {e}")
    sys.exit(1)

# Обработка SVG
svg_files = [f for f in os.listdir(SVG_DIR) if f.lower().endswith('.svg')]
added_count = 0

for svg_file in svg_files:
    # Извлекаем символ из имени файла (например, '烖.svg' -> '烖')
    char = os.path.splitext(svg_file)[0]
    
    # Проверяем, что это один символ
    if len(char) != 1:
        print(f"⚠️ Пропущено (не символ): {svg_file}")
        continue

    codepoint = ord(char)
    glyph_name = f"uni{codepoint:04X}"

    # Проверяем, есть ли уже глиф с таким Unicode
    try:
        existing_glyph = font[codepoint]
        if existing_glyph and existing_glyph.isWorthOutputting():
            # print(f"ℹ️ Уже есть: {char} (U+{codepoint:04X})")
            continue
    except (TypeError, KeyError, AttributeError):
        pass  # Глифа нет — можно добавлять

    # Создаём новый глиф
    try:
        glyph = font.createChar(codepoint, glyph_name)
        glyph.importOutlines(os.path.join(SVG_DIR, svg_file))
        glyph.left_side_bearing = 50
        glyph.right_side_bearing = 50
        glyph.width = 1000  # Стандартная ширина
        print(f"✅ Добавлен: {char} (U+{codepoint:04X})")
        added_count += 1
    except Exception as e:
        print(f"❌ Ошибка при добавлении {char}: {e}")

# Сохраняем новый шрифт
try:
    font.generate(OUTPUT_FONT)
    print(f"\n🎉 Готово! Новый шрифт сохранён: {OUTPUT_FONT}")
    print(f"Добавлено новых глифов: {added_count}")
except Exception as e:
    print(f"❌ Ошибка при сохранении шрифта: {e}")
    sys.exit(1)

# Закрываем шрифт
font.close()