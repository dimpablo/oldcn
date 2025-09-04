// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  // === НАСТРОЙКИ ===
  const helpPath = '../help';
  const glyphs = ['不', '亡', '其', '叀', '弗', '曰', '若', '于', '允', '占', '唯', '弜', '王', '貞', '奚'];
  const debugDurationMs = 10000; // Показывать отладку 10 секунд

  // === СОЗДАНИЕ ПОЛНОЭКРАННОГО ОКНА ОТЛАДКИ ===
  const debugModal = document.createElement('div');
  debugModal.id = 'glyph-debug-modal';
  debugModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: white;
    color: #222;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    z-index: 99999;
    padding: 16px;
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  `;

  // Заголовок
  const header = document.createElement('h2');
  header.textContent = '🔍 Отладка: Иероглифы в тексте';
  header.style.marginTop = '0';
  debugModal.appendChild(header);

  // Блок для логов
  const log = document.createElement('div');
  log.style.cssText = `
    flex: 1;
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    font-family: monospace;
    white-space: pre-wrap;
    overflow-y: auto;
    margin-bottom: 12px;
  `;
  debugModal.appendChild(log);

  // Кнопка закрытия
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✅ Продолжить (закрыть)';
  closeBtn.style.cssText = `
    padding: 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  `;
  closeBtn.addEventListener('click', () => {
    debugModal.remove();
    document.body.style.visibility = 'visible'; // Возвращаем видимость
  });
  debugModal.appendChild(closeBtn);

  // Добавляем модалку в DOM
  document.body.appendChild(debugModal);

  // Скрываем основное содержимое на время отладки
  document.body.style.visibility = 'hidden';

  // === СБОР ИНФОРМАЦИИ ===
  let debugLog = '';

  // Информация о странице
  debugLog += `📱 Устройство: ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}\n`;
  debugLog += `🌐 URL: ${window.location.href}\n`;
  debugLog += `📂 helpPath: ${helpPath}\n`;
  debugLog += `🔤 Целевые иероглифы: ${glyphs.join(', ')}\n\n`;

  // Функция для логирования стилей
  function getStyleInfo(el, prop) {
    const value = window.getComputedStyle(el)[prop];
    return value || 'n/a';
  }

  // Счётчики
  let totalFound = 0;
  let nodesProcessed = 0;

  // === ОБРАБОТКА ТЕКСТОВЫХ УЗЛОВ ===
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

  debugLog += '🔍 Поиск в текстовых узлах:\n';

  while ((node = walker.nextNode())) {
    const text = node.textContent;
    const matches = [...text].filter(char => glyphs.includes(char));
    if (matches.length > 0) {
      debugLog += `  📄 Найдено в узле (${matches.join(',')}) → Родитель: <${node.parentNode.tagName.toLowerCase()}>`;
      const fontSize = getStyleInfo(node.parentNode, 'fontSize');
      const fontFamily = getStyleInfo(node.parentNode, 'fontFamily');
      debugLog += ` | Шрифт: ${fontSize}, ${fontFamily}\n`;
      totalFound += matches.length;
      nodesProcessed++;
    }

    let fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let modified = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (glyphs.includes(char)) {
        if (i > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, i)));
        }
        // Создаём ссылку (с теми же стилями, что и в боевом скрипте)
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
          font-weight: inherit;
          color: inherit;
          text-size-adjust: none;
          -webkit-text-size-adjust: none;
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

  debugLog += `\n📊 Найдено иероглифов: ${totalFound} в ${nodesProcessed} узлах\n\n`;

  // === ОБРАБОТКА ТАБЛИЦ ===
  const tableCells = document.querySelectorAll('#oracleTable td');
  debugLog += `🔍 Проверка #oracleTable: ${tableCells.length} ячеек\n`;
  tableCells.forEach((td, i) => {
    const child = td.firstChild;
    if (child && child.nodeType === Node.TEXT_NODE) {
      const char = child.textContent.trim();
      if (glyphs.includes(char)) {
        debugLog += `  🟩 TD[${i}]: '${char}' → будет ссылкой\n`;
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

  // === ОБРАБОТКА .char-item ===
  const charItems = document.querySelectorAll('.char-item > span:first-child');
  debugLog += `\n🔍 Проверка .char-item: ${charItems.length} элементов\n`;
  charItems.forEach((span, i) => {
    const first = span.firstChild;
    if (first && first.nodeType === Node.TEXT_NODE) {
      const char = first.textContent.trim();
      if (glyphs.includes(char)) {
        debugLog += `  🟦 char-item[${i}]: '${char}' → будет ссылкой\n`;
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

  // === ЗАВЕРШЕНИЕ ===
  debugLog += `\n✅ Обработка завершена. Ссылки созданы.\n`;
  debugLog += `⏳ Окно закроется автоматически через 10 секунд.`;

  log.textContent = debugLog;

  // Применяем изменения к DOM (уже в фоне)
  nodesToReplace.forEach(({ node, fragment }) => {
    if (node.parentNode) {
      node.parentNode.replaceChild(fragment, node);
    }
  });

  // Автоматическое закрытие
  setTimeout(() => {
    if (debugModal.parentNode) {
      debugModal.remove();
      document.body.style.visibility = 'visible';
    }
  }, debugDurationMs);
});