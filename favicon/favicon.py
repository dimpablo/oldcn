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
    "maskable": [192, 512],
}

os.makedirs(OUTPUT_DIR, exist_ok=True)

def svg_to_png(svg_path, output_path, size):
    try:
        cairosvg.svg2png(
            url=svg_path,
            write_to=output_path,
            output_width=size,
            output_height=size,
            background_color="white"
        )
        print(f"✅ {output_path} ({size}x{size})")
    except Exception as e:
        print(f"❌ Ошибка при создании {output_path}: {e}")

def make_maskable_icon(png_path, output_path):
    img = Image.open(png_path).convert("RGBA")
    original_size = img.size[0]
    safe_area = int(original_size * 0.7)
    border = (original_size - safe_area) // 2
    new_img = Image.new("RGBA", (original_size, original_size), (0, 0, 0, 0))
    new_img.paste(img, (border, border))
    new_img.save(output_path, "PNG")
    print(f"🔷 Maskable сохранён: {output_path}")

print("🎨 Генерация иконок из", INPUT_SVG)

# Favicon.ico (multi-size)
svg_to_png(INPUT_SVG, os.path.join(OUTPUT_DIR, "favicon.png"), 32)
# Создаём .ico через Pillow
icon_images = []
for size in [16, 32, 48]:
    temp_path = os.path.join(OUTPUT_DIR, f"tmp_{size}.png")
    svg_to_png(INPUT_SVG, temp_path, size)
    icon_images.append(Image.open(temp_path))
icon_images[0].save(os.path.join(OUTPUT_DIR, "favicon.ico"), format='ICO', sizes=[(s, s) for s in [16, 32, 48]], append_images=icon_images[1:])
for img in icon_images:
    img.close()

# Apple Touch Icons
for size in ICON_SIZES["apple_touch_icon"]:
    path = os.path.join(OUTPUT_DIR, f"apple-touch-icon-{size}x{size}.png")
    svg_to_png(INPUT_SVG, path, size)

# Android Chrome
for size in ICON_SIZES["android_chrome"]:
    path = os.path.join(OUTPUT_DIR, f"android-chrome-{size}x{size}.png")
    svg_to_png(INPUT_SVG, path, size)

# Maskable Icons
for size in ICON_SIZES["maskable"]:
    normal = os.path.join(OUTPUT_DIR, f"maskable-icon-{size}x{size}.png")
    svg_to_png(INPUT_SVG, normal, size)
    masked = os.path.join(OUTPUT_DIR, f"maskable-icon-{size}x{size}-masked.png")
    make_maskable_icon(normal, masked)

# Web App Manifest
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

# browserconfig.xml
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