// === DEBUG MODE: ЗАМЕНА ТАБЛИЦЫ НА ОТЛАДОЧНЫЙ ЛОГ ===
document.addEventListener('DOMContentLoaded', function () {
  // Путь к папке help (относительно текущей страницы)
  const helpPath = '../help';

  // Целевые иероглифы (из твоего предыдущего скрипта)
  const glyphs = ['不', '亡', '其', '叀', '弗', '曰', '若', '于', '允', '占', '唯', '弜', '王', '貞', '奚'];

  // Получаем таблицу
  const table = document.getElementById('oracleTable');
  if (!table) {
    console.warn('Таблица #oracleTable не найдена');
    return;
  }

  // === СОЗДАЁМ TEXTAREA ДЛЯ ОТЛАДКИ ===
  const textarea = document.createElement('textarea');
  textarea.id = 'debug-log-replacement';
  textarea.readOnly = true;
  textarea.style.cssText = `
    width: 100%;
    height: 80vh;
    min-height: 400px;
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    border: 3px solid #ff69b4;
    border-radius: 10px;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.6;
    color: #000;
    background: #fff0f5;
    resize: vertical;
    display: block;
    white-space: pre;
    box-sizing: border-box;
    outline: none;
  `;
  textarea.placeholder = 'Здесь будет отладочная информация...';

  // === СБОР ДАННЫХ ===
  let log = '';

  log += '🔍 ОТЛАДКА: АНАЛИЗ ИЕРОГЛИФОВ В УРОКЕ 4\n';
  log += '========================================\n\n';

  log += `📱 Устройство: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}\n`;
  log += `🌐 URL: ${window.location.href}\n`;
  log += `📂 Путь к /help/: ${helpPath}\n`;
  log += `🔤 Целевые иероглифы: ${glyphs.join(', ')}\n\n`;

  // === ПОЛУЧАЕМ ТЕКСТ ИЗ lessonText (из глобальной переменной, если доступна) ===
  if (typeof lessonText === 'undefined') {
    log += '❌ Переменная lessonText не найдена!\n';
    log += '   Убедись, что скрипт выполняется ПОСЛЕ её объявления.\n\n';
  } else {
    log += `✅ Найден массив lessonText: ${lessonText.length} строк\n\n`;

    // Проходим по каждой строке
    lessonText.forEach((line, lineIndex) => {
      const chars = Array.from(line);
      const matches = chars.filter(char => glyphs.includes(char));
      if (matches.length > 0) {
        log += `📄 Строка ${lineIndex + 1}:\n`;
        log += `   Текст: "${line}"\n`;
        log += `   🎯 Найдено: ${[...new Set(matches)].join(', ')} (${matches.length} вхождений)\n\n`;
      }
    });
  }

  // === ПРОВЕРКА СТИЛЕЙ ТАБЛИЦЫ ===
  log += `🔍 ПРОВЕРКА СТИЛЕЙ .oracle-table\n`;
  const computedTable = window.getComputedStyle(table);
  log += `   width: ${computedTable.width}\n`;
  log += `   font-size: ${computedTable.fontSize}\n`;
  log += `   font-family: ${computedTable.fontFamily}\n`;
  log += `   line-height: ${computedTable.lineHeight}\n\n`;

  const firstTd = table.querySelector('td');
  if (firstTd) {
    const tdStyle = window.getComputedStyle(firstTd);
    log += `🔍 ПРОВЕРКА ЯЧЕЙКИ TD\n`;
    log += `   padding: ${tdStyle.padding}\n`;
    log += `   font-size: ${tdStyle.fontSize}\n`;
    log += `   font-family: ${tdStyle.fontFamily}\n`;
    log += `   display: ${tdStyle.display}\n`;
    log += `   text-align: ${tdStyle.textAlign}\n\n`;
  }

  // === ПРОВЕРКА charData (словарь) ===
  if (typeof charData !== 'undefined') {
    log += `✅ Словарь charData загружен: ${Object.keys(charData).length} иероглифов\n`;
    const missing = glyphs.filter(g => !charData[g]);
    if (missing.length > 0) {
      log += `⚠️  Нет данных в charData: ${missing.join(', ')}\n\n`;
    } else {
      log += `✅ Все целевые иероглифы есть в charData\n\n`;
    }
  } else {
    log += `❌ charData не загружен! Подключи dictionary.js\n\n`;
  }

  // === ПРОВЕРКА РАЗМЕРА ШРИФТА В РАЗНЫХ КОНТЕКСТАХ ===
  log += `🔍 ТЕСТ НАСЛЕДОВАНИЯ ШРИФТА\n`;
  const bodyStyle = window.getComputedStyle(document.body);
  const h1Style = window.getComputedStyle(document.querySelector('h1') || document.body);
  log += `   body font-size: ${bodyStyle.fontSize} (${bodyStyle.fontSize.includes('px') ? parseFloat(bodyStyle.fontSize) : '??'} px)\n`;
  log += `   h1 font-size: ${h1Style.fontSize}\n`;

  // === ПОПЫТКА ПРОЧИТАТЬ СТИЛИ ТАБЛИЦЫ ИЗ CSS ===
  log += `\n🔍 CSS .oracle-table (из стилей страницы)\n`;
  const styleSheet = Array.from(document.styleSheets).find(sheet => {
    try {
      return sheet.cssRules;
    } catch (e) {
      return false;
    }
  });

  if (styleSheet) {
    const rule = Array.from(styleSheet.cssRules).find(r => r.selectorText === '.oracle-table');
    if (rule) {
      log += `   Найдено правило: ${rule.cssText.substring(0, 100)}...\n`;
    } else {
      log += `   ❌ Правило .oracle-table не найдено в CSS\n`;
    }
  } else {
    log += `   ❌ Не удалось прочитать CSS-правила (возможно, из-за CORS)\n`;
  }

  // === ФИНАЛ ===
  log += `\n📌 ИНСТРУКЦИЯ:\n`;
  log += `   1. Нажми и удержи текст\n`;
  log += `   2. Выбери «Выделить всё» → «Копировать»\n`;
  log += `   3. Вставь сюда — и я скажу, почему иероглифы кажутся мелкими.\n\n`;
  log += `💡 Совет: сравни font-size таблицы и .char-item\n`;
  log += `   .char-item: font-size: 1.1em → ~17px\n`;
  log += `   .oracle-table: font-size: 1.3em → должно быть ~21px\n`;
  log += `   Если меньше — значит, шрифт не наследуется или перебивается!\n`;

  // Устанавливаем текст
  textarea.value = log;

  // === ЗАМЕНЯЕМ ТАБЛИЦУ ===
  table.replaceWith(textarea);

  // Дополнительно: если нужно, можно оставить кнопку для возврата таблицы
  // (для тестирования)
});