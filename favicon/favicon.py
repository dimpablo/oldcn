import os
import json
from pathlib import Path
import cairosvg
from PIL import Image

# Настройки
INPUT_SVG = "說.svg"
OUTPUT_DIR = "icons"
ICON_SIZES = {
    "favicon": [16, 32, 48],
    "apple_touch_icon": [57, 60, 72, 76, 80, 114, 120, 144, 152, 167, 180, 1024],
    "android_chrome": [96, 144, 192, 256, 384, 512],
    "maskable": [192, 512],  # Для maskable icons (Android)
}

# Создаём папку
os.makedirs(OUTPUT_DIR, exist_ok=True)

def svg_to_png(svg_path, output_path, size):
    """Конвертация SVG в PNG заданного размера"""
    try:
        cairosvg.svg2png(
            url=svg_path,
            write_to=output_path,
            output_width=size,
            output_height=size,
            background_color="white"  # можно изменить при необходимости
        )
        print(f"✅ {output_path} ({size}x{size})")
    except Exception as e:
        print(f"❌ Ошибка при создании {output_path}: {e}")

def make_maskable_icon(png_path, output_path):
    """
    Делает иконку "maskable" — центрирует на квадрате, оставляя поля.
    Это важно для Android Adaptive Icons.
    """
    img = Image.open(png_path).convert("RGBA")
    original_size = img.size[0]
    
    # Размер нового изображения с отступами (15% по бокам)
    safe_area = int(original_size * 0.7)
    border = (original_size - safe_area) // 2
    
    # Создаём новое изображение и вставляем оригинальную иконку в центр безопасной зоны
    new_img = Image.new("RGBA", (original_size, original_size), (0, 0, 0, 0))
    new_img.paste(img, (border, border))
    
    new_img.save(output_path, "PNG")
    print(f"🔷 Maskable сохранён: {output_path}")

# === Генерация иконок ===
print("🎨 Генерация иконок из", INPUT_SVG)

# 1. Favicon (multi-size .ico)
svg_to_png(INPUT_SVG, os.path.join(OUTPUT_DIR, "favicon.png"), 32)
os.system(f"convert {os.path.join(OUTPUT_DIR, 'favicon.png')} {{16,32,48}} {os.path.join(OUTPUT_DIR, 'favicon.ico')}" if os.name != 'nt' else '')
# Альтернатива: если нет ImageMagick, используем Pillow
if not os.path.exists(os.path.join(OUTPUT_DIR, "favicon.ico")):
    icon_images = []
    for size in [16, 32, 48]:
        temp_path = os.path.join(OUTPUT_DIR, f"tmp_{size}.png")
        svg_to_png(INPUT_SVG, temp_path, size)
        icon_images.append(Image.open(temp_path))
    icon_images[0].save(os.path.join(OUTPUT_DIR, "favicon.ico"), format='ICO', sizes=[(s, s) for s in [16, 32, 48]], append_images=icon_images[1:])
    for img in icon_images:
        img.close()

# 2. Apple Touch Icons
for size in ICON_SIZES["apple_touch_icon"]:
    path = os.path.join(OUTPUT_DIR, f"apple-touch-icon-{size}x{size}.png")
    svg_to_png(INPUT_SVG, path, size)

# 3. Android Chrome Icons
for size in ICON_SIZES["android_chrome"]:
    path = os.path.join(OUTPUT_DIR, f"android-chrome-{size}x{size}.png")
    svg_to_png(INPUT_SVG, path, size)

# 4. Maskable Icons (Android Adaptive Icons)
for size in ICON_SIZES["maskable"]:
    normal = os.path.join(OUTPUT_DIR, f"maskable-icon-{size}x{size}.png")
    svg_to_png(INPUT_SVG, normal, size)
    # Создаём версию с безопасной зоной
    masked = os.path.join(OUTPUT_DIR, f"maskable-icon-{size}x{size}-masked.png")
    make_maskable_icon(normal, masked)

# === Создание manifest.json ===
webmanifest = {
    "name": "Мой Китайский Словарь",
    "short_name": "Иероглифы",
    "start_url": ".",
    "display": "standalone",
    "background_color": "#f9f9f9",
    "theme_color": "#4CAF50",
    "icons": [
        {
            "src": f"android-chrome-{size}x{size}.png",
            "sizes": f"{size}x{size}",
            "type": "image/png"
        } for size in ICON_SIZES["android_chrome"]
    ] + [
        {
            "src": f"maskable-icon-{size}x{size}-masked.png",
            "sizes": f"{size}x{size}",
            "type": "image/png",
            "purpose": "maskable"
        } for size in ICON_SIZES["maskable"]
    ]
}

with open(os.path.join(OUTPUT_DIR, "site.webmanifest"), "w", encoding="utf-8") as f:
    json.dump(webmanifest, f, indent=2, ensure_ascii=False)

# === Создание browserconfig.xml (для старых Windows) ===
browserconfig_content = """<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>#4CAF50</TileColor>
    </tile>
  </msapplication>
</browserconfig>"""

with open(os.path.join(OUTPUT_DIR, "browserconfig.xml"), "w", encoding="utf-8") as f:
    f.write(browserconfig_content.strip())

print("\n🎉 Готово! Все иконки сохранены в папке:", OUTPUT_DIR)
print("\n📌 Теперь добавь в <head> своего сайта:")
print("""
<link rel="icon" type="image/x-icon" href="/icons/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">

<!-- Apple -->
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png">

<!-- Web App Manifest -->
<link rel="manifest" href="/icons/site.webmanifest">
<meta name="msapplication-config" content="/icons/browserconfig.xml">
<meta name="theme-color" content="#4CAF50">

<!-- Android -->
<link rel="icon" type="image/png" sizes="192x192" href="/icons/android-chrome-192x192.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/icons/android-chrome-512x512.png" />
""")