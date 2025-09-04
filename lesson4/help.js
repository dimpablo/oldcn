// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  // === ОТЛАДКА: СОБИРАЕМ ИНФОРМАЦИЮ ===
  let debugLog = '';

  debugLog += '🔍 ОТЛАДКА: АНАЛИЗ ВЫДЕЛЕННЫХ ИЕРОГЛИФОВ\n';
  debugLog += '========================================\n\n';
  debugLog += `📱 Устройство: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}\n`;
  debugLog += `🌐 URL: ${window.location.href}\n\n`;

  // === НАСТРОЙКИ (как в оригинале) ===
  const helpPath = '../help';
  const glyphs = ['不', '亡', '其', '叀', '弗', '曰', '若', '于', '允', '占', '唯', '弜', '王', '貞', '奚'];

  // Переменная для сбора данных о каждом найденном иероглифе
  const glyphInfo = [];

  // Функция для создания ссылки с сохранением стилей
  function createLink(char, context = {}) {
    const link = document.createElement('a');
    link.href = `${helpPath}/${char}.html`;
    link.target = '_blank';
    link.rel = 'noopener';

    // КРИТИЧЕСКИЕ СТИЛИ: сохраняем внешний вид как у обычного текста
    link.style.fontSize = 'inherit';
    link.style.lineHeight = 'inherit';
    link.style.fontFamily = 'inherit';
    link.style.fontWeight = 'inherit';
    link.style.letterSpacing = 'inherit';
    link.style.color = 'inherit';
    link.style.textDecoration = 'none';

    // Визуальные стили выделения
    link.style.backgroundColor = '#fdeced'; // Пастельно-розовый
    link.style.padding = '0 2px';
    link.style.borderRadius = '3px';
    link.style.display = 'inline-block';
    link.style.verticalAlign = 'middle';
    link.style.textAlign = 'center';

    // Защита от мобильной авто-подстройки шрифта
    link.style.textSizeAdjust = 'none';
    link.style.WebkitTextSizeAdjust = 'none';

    link.appendChild(document.createTextNode(char));

    // === СОБИРАЕМ ИНФОРМАЦИЮ О ССЫЛКЕ ПОСЛЕ СОЗДАНИЯ ===
    setTimeout(() => {
      try {
        const computed = window.getComputedStyle(link);
        glyphInfo.push({
          char,
          context,
          href: link.href,
          fontSize: computed.fontSize,
          fontFamily: computed.fontFamily,
          lineHeight: computed.lineHeight,
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          display: computed.display,
          verticalAlign: computed.verticalAlign,
          padding: computed.padding,
          offsetHeight: link.offsetHeight,
          offsetWidth: link.offsetWidth,
          tagName: link.tagName,
        });
      } catch (e) {
        glyphInfo.push({ char, error: 'Не удалось прочитать стили', context });
      }
    }, 0);

    return link;
  }

  // Создаём TreeWalker для обхода текстовых узлов
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        const parent = node.parentNode;
        const excludedTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'];
        if (excludedTags.includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.hasAttribute && parent.hasAttribute('data-no-glyph-links')) {
          return NodeFilter.FILTER_REJECT;
        }
        return node.textContent.trim().length > 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const nodesToReplace = [];
  let node;

  debugLog += '🔍 ПОИСК В ТЕКСТОВЫХ УЗЛАХ...\n';

  while ((node = walker.nextNode())) {
    const text = node.textContent;
    let fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let modified = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (glyphs.includes(char)) {
        if (i > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, i)));
        }

        // Собираем контекст
        const parent = node.parentNode;
        const parentStyle = window.getComputedStyle(parent);
        fragment.appendChild(
          createLink(char, {
            type: 'text-node',
            parentTag: parent.tagName,
            parentFontSize: parentStyle.fontSize,
            parentFontFamily: parentStyle.fontFamily,
            parentLineHeight: parentStyle.lineHeight,
            textBefore: text.slice(Math.max(0, i - 3), i),
            textAfter: text.slice(i + 1, i + 4),
            nodeLength: text.length,
          })
        );
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

  debugLog += `✅ Обработано текстовых узлов: ${nodesToReplace.length}\n\n`;

  // === Обработка таблицы #oracleTable ===
  const tableCells = document.querySelectorAll('#oracleTable td');
  debugLog += `🔍 Обработка #oracleTable: ${tableCells.length} ячеек\n`;

  tableCells.forEach((td, i) => {
    const child = td.firstChild;
    if (
      child &&
      child.nodeType === Node.TEXT_NODE &&
      child.textContent.trim().length === 1
    ) {
      const char = child.textContent.trim();
      if (glyphs.includes(char)) {
        const style = window.getComputedStyle(td);
        td.innerHTML = '';
        const link = createLink(char, {
          type: 'table-cell',
          cellIndex: i,
          parentTag: 'TD',
          tdFontSize: style.fontSize,
          tdFontFamily: style.fontFamily,
          tdPadding: style.padding,
        });
        td.appendChild(link);
        td.style.padding = '0';
      }
    }
  });

  // === Обработка .char-item ===
  document.querySelectorAll('.char-item > span:first-child').forEach((span, i) => {
    const firstChild = span.firstChild;
    if (
      firstChild &&
      firstChild.nodeType === Node.TEXT_NODE &&
      firstChild.textContent.trim().length === 1
    ) {
      const char = firstChild.textContent.trim();
      if (glyphs.includes(char)) {
        const pinyin = span.querySelector('.inline-pinyin');
        const parentStyle = window.getComputedStyle(span);
        span.innerHTML = '';
        const link = createLink(char, {
          type: 'char-item',
          index: i,
          spanFontSize: parentStyle.fontSize,
          spanFontFamily: parentStyle.fontFamily,
        });
        span.appendChild(link);
        if (pinyin) span.appendChild(pinyin);
      }
    }
  });

  // === ПРИМЕНЯЕМ ИЗМЕНЕНИЯ ===
  nodesToReplace.forEach(({ node, fragment }) => {
    if (node.parentNode) {
      node.parentNode.replaceChild(fragment, node);
    }
  });

  // === ЖДЁМ, ЧТОБЫ ВСЕ СТИЛИ ПРИМЕНИЛИСЬ ===
  setTimeout(() => {
    // === ФОРМИРУЕМ ОКОНЧАТЕЛЬНЫЙ ЛОГ ===
    debugLog += `📊 Найдено и обработано иероглифов: ${glyphInfo.length}\n\n`;

    glyphInfo.forEach((info, i) => {
      debugLog += `📌 Иероглиф #${i + 1}: '${info.char}'\n`;
      debugLog += `   📍 Контекст: ${info.context.type}\n`;
      debugLog += `   📏 font-size: ${info.fontSize}\n`;
      debugLog += `   🖋️ font-family: ${info.fontFamily}\n`;
      debugLog += `   🎨 color: ${info.color}\n`;
      debugLog += `   🟨 background: ${info.backgroundColor}\n`;
      debugLog += `   📏 height: ${info.offsetHeight}px, width: ${info.offsetWidth}px\n`;
      debugLog += `   📏 padding: ${info.padding}\n`;
      debugLog += `   📏 line-height: ${info.lineHeight}\n`;
      debugLog += `   🔝 vertical-align: ${info.verticalAlign}\n`;

      if (info.context.parentTag) {
        debugLog += `   🧬 Родитель: <${info.context.parentTag.toLowerCase()}>\n`;
        debugLog += `   🧬 Род. шрифт: ${info.context.parentFontFamily}\n`;
        debugLog += `   🧬 Род. размер: ${info.context.parentFontSize}\n`;
      }
      debugLog += '\n';
    });

    // === ДОБАВЛЯЕМ ГЛОБАЛЬНЫЕ СТИЛИ ===
    const bodyStyle = window.getComputedStyle(document.body);
    const originalStyle = window.getComputedStyle(document.querySelector('.original') || document.body);

    debugLog += '🔍 ГЛОБАЛЬНЫЕ СТИЛИ\n';
    debugLog += `   body font-size: ${bodyStyle.fontSize}\n`;
    debugLog += `   .original font-size: ${originalStyle.fontSize}\n`;
    debugLog += `   .original font-family: ${originalStyle.fontFamily}\n\n`;

    debugLog += '📌 Нажми и удержи → «Выделить всё» → «Копировать»\n';
    debugLog += '⏳ Страница появится через 12 секунд...';

    // === ВЫВОДИМ В TEXTAREA ===
    const textarea = document.createElement('textarea');
    textarea.readOnly = true;
    textarea.value = debugLog;
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
      line-height: 1.6;
      color: #000;
      background: #fff;
      z-index: 999999;
      resize: none;
      outline: none;
      white-space: pre;
    `;

    document.body.appendChild(textarea);
    document.body.style.visibility = 'hidden';

    // Через 12 сек — убираем лог и возвращаем страницу
    setTimeout(() => {
      if (textarea.parentNode) textarea.remove();
      document.body.style.visibility = 'visible';
    }, 12000);
  }, 100); // Даем время стилям примениться

  // === ДОПОЛНИТЕЛЬНЫЙ СТИЛЬ (как в оригинале) ===
  if (!document.getElementById('glyph-link-styles')) {
    const style = document.createElement('style');
    style.id = 'glyph-link-styles';
    style.textContent = `
      a[href*="/help/"] {
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }
      @media (max-width: 768px) {
        a[href*="/help/"] {
          font-size: inherit !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
});