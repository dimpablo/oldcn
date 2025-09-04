// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  // === НАСТРОЙКИ ===
  const helpPath = '../help';
  const glyphs = ['不', '亡', '其', '叀', '弗', '曰', '若', '于', '允', '占', '唯', '弜', '王', '貞', '奚'];

  // === ПОЛУЧАЕМ ТАБЛИЦУ ===
  const table = document.getElementById('oracleTable');

  // Если таблицы нет — создаём placeholder
  const targetContainer = table || document.body;

  // === СОЗДАЁМ TEXTAREA ДЛЯ ОТЛАДКИ ===
  const textarea = document.createElement('textarea');
  textarea.id = 'glyph-debug-replacement';
  textarea.readOnly = true;
  textarea.style.cssText = `
    width: 100%;
    height: 80vh;
    min-height: 300px;
    border: 2px solid #ff69b4;
    border-radius: 8px;
    padding: 16px;
    margin: 10px 0;
    box-sizing: border-box;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    color: #000;
    background: #fff0f5;
    resize: vertical;
    white-space: pre;
    outline: none;
  `;
  textarea.placeholder = 'Отладочная информация будет здесь...';

  // === СБОР ДАННЫХ ===
  let log = '';

  log += '🔍 ОТЛАДКА: ЗАМЕНА #oracleTable НА ЛОГ\n';
  log += '====================================\n\n';

  log += `📱 Устройство: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}\n`;
  log += `🌐 Страница: ${window.location.href}\n`;
  log += `📂 Путь к /help/: ${helpPath}\n`;
  log += `🔤 Целевые иероглифы: ${glyphs.join(', ')}\n\n`;

  // Информация о таблице
  if (table) {
    log += `✅ Найдена таблица: #oracleTable\n`;
    log += `   Строк: ${table.rows?.length || 'n/a'}, Ячеек: ${table.querySelectorAll('td').length}\n\n';
  } else {
    log += `❌ #oracleTable НЕ найдена. Лог вставлен в <body>.\n\n`;
  }

  // Проверка видимости и стилей
  const testDiv = document.createElement('div');
  testDiv.textContent = 'Тест видимости';
  document.body.appendChild(testDiv);
  log += `👁‍🗨 Тест: элементы видны? → ${testDiv.offsetParent !== null ? 'Да' : 'Нет'}\n`;
  document.body.removeChild(testDiv);

  // === СБОР ТЕКСТОВЫХ УЗЛОВ ===
  log += '🔍 ПОИСК ИЕРОГЛИФОВ В ТЕКСТЕ...\n';
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        const parent = node.parentNode;
        const excluded = ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'];
        if (excluded.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.hasAttribute?.('data-no-glyph-links')) return NodeFilter.FILTER_REJECT;
        return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );

  let totalFound = 0;
  let contextCounter = 0;

  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent;
    const matches = [...text].filter(char => glyphs.includes(char));
    if (matches.length > 0) {
      contextCounter++;
      const parent = node.parentNode;
      const parentStyle = window.getComputedStyle(parent);
      log += `📄 #${contextCounter} В <${parent.tagName.toLowerCase()}> (шрифт: ${parentStyle.fontSize}, ${parentStyle.fontFamily})\n`;
      log += `   🎯 Найдено: ${matches.join(', ')}\n`;
      log += `   📜 Контекст: "${text.trim()}"\n\n`;
      totalFound += matches.length;
    }
  }

  log += `📊 ИТОГО: ${totalFound} иероглифов найдено в ${contextCounter} местах.\n\n`;

  // === ПРОВЕРКА ЯЧЕЕК ТАБЛИЦЫ (если была) ===
  if (table) {
    const tds = table.querySelectorAll('td');
    log += `🔍 АНАЛИЗ ЯЧЕЕК #oracleTable: ${tds.length} шт.\n`;
    tds.forEach((td, i) => {
      const text = td.textContent.trim();
      const child = td.firstChild;
      if (child && child.nodeType === Node.TEXT_NODE && text.length === 1 && glyphs.includes(text)) {
        const style = window.getComputedStyle(td);
        log += `🟩 TD[${i}]: '${text}' → подходит\n`;
        log += `   📏 font-size: ${style.fontSize}, padding: ${style.padding}, display: ${style.display}\n`;
      } else if (text.length > 0) {
        log += `⬜ TD[${i}]: "${text}" → не иероглиф или не в списке\n`;
      }
    });
    log += '\n';
  }

  // === ПРОВЕРКА .char-item ===
  const charItems = document.querySelectorAll('.char-item > span:first-child');
  log += `🔍 .char-item элементов: ${charItems.length}\n`;
  charItems.forEach((span, i) => {
    const text = span.textContent.trim();
    if (text.length === 1 && glyphs.includes(text)) {
      log += `🟦 char-item[${i}]: '${text}' → будет ссылкой\n`;
    } else {
      log += `⬜ char-item[${i}]: "${text}" → нет\n`;
    }
  });

  // === ДОБАВЛЯЕМ ИНФУ О ШРИФТАХ ДЛЯ ПРОВЕРКИ ===
  log += `\n🔍 ТЕСТ НАСЛЕДОВАНИЯ ШРИФТА (на примере body)\n`;
  const bodyStyle = window.getComputedStyle(document.body);
  log += `📏 font-size body: ${bodyStyle.fontSize}\n`;
  log += `🔤 font-family body: ${bodyStyle.fontFamily}\n`;

  // === ФИНАЛ ===
  log += `\n✅ Этот лог заменил таблицу.\n`;
  log += `📌 Нажми и удержи → "Выделить всё" → "Копировать".\n`;
  log += `💡 Данные помогут понять, почему иероглифы кажутся мелкими.`;

  // Устанавливаем текст
  textarea.value = log;

  // === ЗАМЕНЯЕМ ТАБЛИЦУ ИЛИ ВСТАВЛЯЕМ В BODY ===
  if (table) {
    table.replaceWith(textarea);
  } else {
    // Если таблицы нет — вставляем в начало контента
    const firstContent = document.body.firstElementChild;
    if (firstContent) {
      document.body.insertBefore(textarea, firstContent);
    } else {
      document.body.appendChild(textarea);
    }
  }

  // === ВАЖНО: продолжаем работать с DOM (создаём ссылки, как в боевом режиме) ===
  // (Ты можешь временно закомментировать, если нужен только лог)
  processGlyphs();
  
  function processGlyphs() {
    // TreeWalker — замена текстовых узлов
    const walker2 = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          const parent = node.parentNode;
          const excluded = ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'];
          if (excluded.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent === textarea || parent.closest('#glyph-debug-replacement')) return NodeFilter.FILTER_REJECT;
          if (parent.hasAttribute?.('data-no-glyph-links')) return NodeFilter.FILTER_REJECT;
          return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodesToReplace = [];
    let n;
    while (n = walker2.nextNode()) {
      const text = n.textContent;
      let fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let modified = false;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (glyphs.includes(char)) {
          if (i > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, i)));
          }
          const link = document.createElement('a');
          link.href = `${helpPath}/${char}.html`;
          link.style.cssText = `
            background-color: #fdeced;
            padding: 0 2px;
            border-radius: 3px;
            text-decoration: none;
            display: inline-block;
            vertical-align: middle;
            font-size: inherit;
            line-height: inherit;
            font-family: inherit;
            color: inherit;
          `;
          link.appendChild(document.createTextNode(char));
          fragment.appendChild(link);
          lastIndex = i + 1;
          modified = true;
        }
      }

      if (modified) {
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        nodesToReplace.push({ node: n, fragment });
      }
    }

    nodesToReplace.forEach(({ node, fragment }) => {
      if (node.parentNode) node.parentNode.replaceChild(fragment, node);
    });
  }
});