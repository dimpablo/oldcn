// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  // Определяем путь к папке help (относительно текущего location)
  const helpPath = '../help'; // Путь от /lessonN/theory.html к /help/

  // Массив иероглифов, для которых есть справочные страницы
  const glyphs = ['不', '亡', '其', '叀', '弗', '曰', '若', '于', '允', '占', '唯', '弜', '王', '貞', '奚'];

  // Функция для создания ссылки с сохранением стилей
  function createLink(char) {
    const link = document.createElement('a');
    link.href = `${helpPath}/${char}.html`;
    link.target = '_blank'; // Открытие в новой вкладке — опционально
    link.rel = 'noopener';

    // КРИТИЧЕСКИЕ СТИЛИ: сохраняем внешний вид как у обычного текста
    link.style.fontSize = 'inherit';        // Наследуем размер шрифта
    link.style.lineHeight = 'inherit';      // Наследуем высоту строки
    link.style.fontFamily = 'inherit';      // Наследуем шрифт
    link.style.fontWeight = 'inherit';      // Наследуем жирность
    link.style.letterSpacing = 'inherit';   // Наследуем интервал между буквами
    link.style.color = 'inherit';           // Сохраняем цвет текста
    link.style.textDecoration = 'none';     // Убираем подчёркивание

    // Визуальные стили выделения
    link.style.backgroundColor = '#fdeced'; // Пастельно-розовый фон
    link.style.padding = '0 2px';
    link.style.borderRadius = '3px';
    link.style.display = 'inline-block';    // Чтобы padding и border работали
    link.style.verticalAlign = 'middle';    // Ровняем по базовой линии
    link.style.textAlign = 'center';        // Центрируем иероглиф

    // Защита от мобильной авто-подстройки шрифта (особенно в Safari)
    link.style.textSizeAdjust = 'none';
    link.style.WebkitTextSizeAdjust = 'none';

    // Добавляем иероглиф
    link.appendChild(document.createTextNode(char));

    return link;
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