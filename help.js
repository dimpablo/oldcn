// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  // Определяем путь к папке help (относительно текущего location)
  const helpPath = '../help'; // Путь от /lessonN/theory.html к /help/

  // Массив иероглифов, для которых есть справочные страницы
  const glyphs = ['不', '亡', '其', '叀', '弗', '曰', '若', '于', '允', '占', '唯', '弜', '王', '貞', '奚', '雨', '卜', '爭', '其', '允', '曰', '占', '贞', '其', '允'];

  // === Создание навигационной полоски ===
function createNavigation() {
  // Получаем текущий путь
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/');
  const currentFile = pathParts[pathParts.length - 1];
  const currentDir = pathParts[pathParts.length - 2];
  
  // Проверяем, что мы в уроке (формат lessonN)
  if (currentDir && currentDir.match(/^lesson\d+$/)) {
    const lessonNum = parseInt(currentDir.replace('lesson', ''));
    
    if (!isNaN(lessonNum) && lessonNum >= 1 && lessonNum <= 60) {
      // Создаем навигационную полоску
      const navDiv = document.createElement('div');
      navDiv.className = 'lesson-navigation';
      navDiv.style.cssText = `
        text-align: center;
        margin: 8px 0;
        padding: 4px 0;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        background-color: #fafafa;
        font-size: 13px;
        color: #666;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      
      // Генерируем ссылки
      const prevLesson = lessonNum > 1 ? 
        `<a href="../lesson${lessonNum - 1}/theory.html" style="color: #666; text-decoration: none; border-bottom: 1px dotted #ccc;">предыдущий урок</a>` : 
        '<span style="color: #bbb;">предыдущий урок</span>';
        
      const nextLesson = lessonNum < 60 ? 
        `<a href="../lesson${lessonNum + 1}/theory.html" style="color: #666; text-decoration: none; border-bottom: 1px dotted #ccc;">следующий урок</a>` : 
        '<span style="color: #bbb;">следующий урок</span>';
        
      const currentLesson = `<span style="color: #888;">урок ${lessonNum}</span>`;
      const home = `<a href="../index.html" style="color: #666; text-decoration: none; border-bottom: 1px dotted #ccc;">на главную</a>`;
      
      navDiv.innerHTML = `${prevLesson} | ${currentLesson} | ${nextLesson} | ${home}`;
      
      // Вставляем навигацию перед первым элементом с классом 'text'
      const textDiv = document.querySelector('.text');
      if (textDiv && textDiv.parentNode) {
        textDiv.parentNode.insertBefore(navDiv, textDiv);
      }
    }
  }
}
  
  // Вызываем создание навигации
  createNavigation();

  // Функция для создания ссылки с меткой как значок степени
  function createLink(char) {
    // Контейнер для иероглифа
    const container = document.createElement('span');
    container.style.position = 'relative';
    container.style.display = 'inline-block';

    // Иероглиф
    const glyphSpan = document.createElement('span');
    glyphSpan.textContent = char;

    // Ссылка-метка (только символ)
    const label = document.createElement('a');
    label.href = `${helpPath}/${char}.html`;
    label.target = '_blank';
    label.rel = 'noopener';
    label.textContent = '●';
    label.style.position = 'absolute';
    label.style.top = '-0.5em';
    label.style.right = '-0.3em';
    label.style.fontSize = '0.6em';
    label.style.color = 'rgba(216, 27, 96, 0.8)'; // Слегка прозрачная точка
    label.style.textDecoration = 'none';
    label.style.zIndex = '2';
    label.style.textShadow = '0 0 2px rgba(216, 27, 96, 0.5)'; // Нежное гало
    
    // Добавляем элементы
    container.appendChild(glyphSpan);
    container.appendChild(label);

    return container;
  }

  // Создаём TreeWalker для обхода текстовых узлов
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        const parent = node.parentNode;

        // Исключаем служебные теги
        const excludedTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'];
        if (excludedTags.includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }

        // Исключаем элементы с атрибутом data-no-glyph-links
        if (parent.hasAttribute && parent.hasAttribute('data-no-glyph-links')) {
          return NodeFilter.FILTER_REJECT;
        }

        // Принимаем, если текст не пустой
        return node.textContent.trim().length > 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const nodesToReplace = [];
  let node;

  while ((node = walker.nextNode())) {
    const text = node.textContent;
    let fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let modified = false;

    // Проходим по каждому символу
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (glyphs.includes(char)) {
        // Добавляем текст до иероглифа
        if (i > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, i)));
        }
        // Добавляем ссылку
        fragment.appendChild(createLink(char));
        lastIndex = i + 1;
        modified = true;
      }
    }

    // Добавляем остаток текста
    if (modified) {
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      nodesToReplace.push({ node, fragment });
    }
  }

  // Применяем изменения к текстовым узлам
  nodesToReplace.forEach(({ node, fragment }) => {
    node.parentNode.replaceChild(fragment, node);
  });

  // === Обработка таблицы #oracleTable ===
  const tableCells = document.querySelectorAll('#oracleTable td');
  tableCells.forEach((td) => {
    const child = td.firstChild;
    if (
      child &&
      child.nodeType === Node.TEXT_NODE &&
      child.textContent.trim().length === 1
    ) {
      const char = child.textContent.trim();
      if (glyphs.includes(char)) {
        td.innerHTML = ''; // Очищаем
        const link = createLink(char);
        td.appendChild(link);
        // Убираем лишние отступы, если нужно
        td.style.padding = '0'; // или оставьте стандартное, если мешает
      }
    }
  });

  // === Обработка .char-item (например, словарные карточки) ===
  document.querySelectorAll('.char-item > span:first-child').forEach((span) => {
    const firstChild = span.firstChild;
    if (
      firstChild &&
      firstChild.nodeType === Node.TEXT_NODE &&
      firstChild.textContent.trim().length === 1
    ) {
      const char = firstChild.textContent.trim();
      if (glyphs.includes(char)) {
        // Сохраняем pinyin, если есть
        const pinyin = span.querySelector('.inline-pinyin');

        // Пересоздаём span содержимое
        span.innerHTML = '';
        const link = createLink(char);
        span.appendChild(link);
        if (pinyin) {
          span.appendChild(pinyin);
        }
      }
    }
  });

  // === Принудительная обработка текста внутри .grammar .original ===
  document.querySelectorAll('.grammar .original').forEach((el) => {
    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          const parent = node.parentNode;
          const excludedTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'];
          if (excludedTags.includes(parent.tagName)) {
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
          fragment.appendChild(createLink(char));
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

    nodesToReplace.forEach(({ node, fragment }) => {
      node.parentNode.replaceChild(fragment, node);
    });
  });

  // === Дополнительно: защита от мобильного масштабирования ===
  // Добавляем стиль на страницу, если его ещё нет
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

document.addEventListener('DOMContentLoaded', function () {
    const table = document.getElementById('oracleTable');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            // Получаем текстовое содержимое ячейки, включая скрытые элементы, и удаляем пробелы
            const cellText = cell.textContent.trim();
            
            // Проверяем, является ли содержимое ячейки только "_"
            if (cellText === '_') {
                // Делаем текст невидимым, очищая textContent
                // Это удалит текстовый узел "_" , но оставит другие элементы (например, подсказки)
                cell.textContent = ''; 
            }
            // Проверяем, является ли содержимое ячейки только "|"
            else if (cellText === '|') {
                // Меняем фоновый цвет на пастельно-бордовый
                cell.style.backgroundColor = '#e0bfb8'; // Пример пастельно-бордового цвета
                // Делаем текст (символ "|") невидимым, очищая textContent
                cell.textContent = '';
            }
        });
    });
});