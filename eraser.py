import os
import re

code_to_remove = r"""
  // Следим за пользователем
  onAuthStateChanged\(auth, \(user\) => \{
    if \(user\) \{
      currentUser = user;
      console\.log\('🔐 Пользователь:', user\.displayName\);
    \} else \{
      alert\("Для доступа нужно войти"\);
      window\.location\.href = '..\/index\.html';
    \}
  \};
"""

pattern = re.compile(code_to_remove.strip(), re.MULTILINE | re.DOTALL)

def remove_code_from_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        original_content = content
        content = pattern.sub('', content)
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"✅ Обработан: {file_path}")
        else:
            print(f"ℹ️  Не найдено: {file_path}")
    except Exception as e:
        print(f"❌ Ошибка при обработке {file_path}: {e}")

def scan_and_clean(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.html'):
                remove_code_from_file(os.path.join(root, file))

if __name__ == "__main__":
    scan_and_clean(os.getcwd())
    print("✅ Готово!")