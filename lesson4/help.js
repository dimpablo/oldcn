// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  // === НАСТРОЙКИ ===
  const helpPath = '../help';
  const glyphs = ['不', '亡', '其', '叀', '弗', '曰', '若', '于', '允', '占', '唯', '弜', '王', '貞', '奚'];

  // === СОЗДАНИЕ ПОЛНОЭКРАННОГО TEXTAREA ДЛЯ ОТЛАДКИ ===
  const textarea = document.createElement('textarea');
  textarea.id = 'glyph-debug-output';
  textarea.readOnly = true; // Запрещаем редактирование
  textarea.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border: none;
    margin: 0;
    padding: 16px;
    box-sizing: border-box;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    color: #000;
    background: #fff;
    z-index: 99999;
    resize: none;
    outline: none;
    white-space: pre;
  `;
  textarea.placeholder = 'Идёт анализ страницы...';

  // Добавляем в DOM
  document.body.appendChild(textarea);

  // Скрываем основной контент
  document.body.style.visibility = 'hidden';

  // === СБОР ИНФОРМАЦИИ (самый простой и надёжный способ) ===
  let log = '';

  log += '🔍 АНАЛИЗ ИЕРОГЛИФОВ — ОТЛАДКА\n';
  log += '================================\n\n';

  log += `📱 Устройство: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}\n`;
  log += `🌐 URL: ${window.location.href}\n`;
  log += `📂 helpPath: ${helpPath}\n`;
  log += `🔤 Целевые иероглифы: ${glyphs.join(', ')}\n\n`;

  log += '🔍 ПОИСК В ТЕКСТОВЫХ УЗЛАХ...\n';

  let totalFound = 0;
  let processedNodes = 0;

  // TreeWalker для текстовых узлов
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

  const nodesToReplace = [];
  let node;

  while ((node = walker.nextNode())) {
    const text = node.textContent;
    const matches = [...text].filter(char => glyphs.includes(char));
    
    if (matches.length > 0) {
      const parentTag = node.parentNode.tagName.toLowerCase();
      const computedStyle = window.getComputedStyle(node.parentNode);
      const fontSize = computedStyle.fontSize;
      const fontFamily = computedStyle.fontFamily;

      log += `📄 В <${parentTag}> найдено: ${matches.join(', ')}\n`;
      log += `   Шрифт: ${fontSize}, ${fontFamily}\n`;
      log += `   Текст: "${text.trim()}"\n\n`;

      totalFound += matches.length;
      processedNodes++;
    }

    // Подготовка фрагмента для замены (без применения, пока)
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
          text-size-adjust: none;
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
      nodesToReplace.push({ node, fragment });
    }
  }

  log += `📊 ВСЕГО: ${totalFound} иероглифов в ${processedNodes} узлах\n\n`;

  // === ТАБЛИЦА #oracleTable ===
  const tableCells = document.querySelectorAll('#oracleTable td');
  log += `🔍 ПРОВЕРКА #oracleTable: ${tableCells.length} ячеек\n`;
  tableCells.forEach((td, i) => {
    const child = td.firstChild;
    if (child && child.nodeType === Node.TEXT_NODE) {
      const char = child.textContent.trim();
      if (glyphs.includes(char)) {
        const style = window.getComputedStyle(td);
        log += `🟩 TD[${i}]: '${char}' → ссылка\n`;
        log += `   Стили TD: font-size=${style.fontSize}, padding=${style.padding}\n\n`;
      }
    }
  });

  // === .char-item ===
  const charItems = document.querySelectorAll('.char-item > span:first-child');
  log += `🔍 ПРОВЕРКА .char-item: ${charItems.length} элементов\n`;
  charItems.forEach((span, i) => {
    const first = span.firstChild;
    if (first && first.nodeType === Node.TEXT_NODE) {
      const char = first.textContent.trim();
      if (glyphs.includes(char)) {
        log += `🟦 char-item[${i}]: '${char}' → будет ссылкой\n`;
      }
    }
  });

  log += '\n✅ Обработка завершена. Ссылки подготовлены.\n';
  log += '📌 Нажмите и удерживайте текст, чтобы выделить и скопировать.\n';
  log += '⏳ Страница появится через 8 секунд...';

  // Записываем лог в textarea
  textarea.value = log;

  // Через 8 сек — убираем textarea и показываем страницу
  setTimeout(() => {
    if (textarea.parentNode) {
      textarea.remove();
    }
    document.body.style.visibility = 'visible';

    // Теперь применяем все изменения к DOM
    nodesToReplace.forEach(({ node, fragment }) => {
      try {
        if (node.parentNode) {
          node.parentNode.replaceChild(fragment, node);
        }
      } catch (e) {
        console.warn('Не удалось заменить узел', e);
      }
    });

    // Обработка таблицы
    document.querySelectorAll('#oracleTable td').forEach(td => {
      const child = td.firstChild;
      if (child && child.nodeType === Node.TEXT_NODE) {
        const char = child.textContent.trim();
        if (glyphs.includes(char)) {
          td.innerHTML = '';
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
          td.appendChild(link);
          td.style.padding = '0';
        }
      }
    });

    // Обработка .char-item
    document.querySelectorAll('.char-item > span:first-child').forEach(span => {
      const first = span.firstChild;
      if (first && first.nodeType === Node.TEXT_NODE) {
        const char = first.textContent.trim();
        if (glyphs.includes(char)) {
          const pinyin = span.querySelector('.inline-pinyin');
          span.innerHTML = '';
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
          span.appendChild(link);
          if (pinyin) span.appendChild(pinyin);
        }
      }
    });
  }, 8000);
});