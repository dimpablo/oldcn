
  // Ждём полной загрузки DOM
  document.addEventListener('DOMContentLoaded', function () {
    // Определяем путь к папке help (относительно текущего location)
    const helpPath = '../help'; // Путь от /lessonN/theory.html к /help/

    // Массив иероглифов, для которых есть справочные страницы
    const glyphs = ['不', '亡', '其', '叀', '弗', '曰', '若', '于', '允', '占', '唯', '弜', '王', '貞', '奚'];

    // Функция для создания ссылки
    function createLink(char) {
      const link = document.createElement('a');
      link.href = `${helpPath}/${char}.html`;
      link.style.backgroundColor = '#fff9c4'; // Пастельно-жёлтый
      link.style.padding = '0 2px';
      link.style.borderRadius = '3px';
      link.style.textDecoration = 'none';
      link.style.display = 'inline-block';
      link.appendChild(document.createTextNode(char));
      return link;
    }

    // Обрабатываем все текстовые узлы на странице
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          // Пропускаем узлы внутри <script>, <style>, и атрибутов
          const parentTag = node.parentNode.tagName;
          if (['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE'].includes(parentTag)) {
            return NodeFilter.FILTER_REJECT;
          }
          return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodesToReplace = [];

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent;
      let modified = false;
      let fragment = document.createDocumentFragment();
      let lastIndex = 0;

      // Проверяем каждый символ в текстовом узле
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (glyphs.includes(char)) {
          // Добавляем текст до иероглифа
          if (i > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, i)));
          }
          // Добавляем ссылку на иероглиф
          fragment.appendChild(createLink(char));
          lastIndex = i + 1;
          modified = true;
        }
      }

      // Если были изменения — добавляем остаток текста
      if (modified) {
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        nodesToReplace.push({
          node: node,
          fragment: fragment
        });
      }
    }

    // Применяем изменения
    nodesToReplace.forEach(item => {
      item.node.parentNode.replaceChild(item.fragment, item.node);
    });

    // Обработка таблицы oracle-table (иероглифы в <td>)
    const tableCells = document.querySelectorAll('#oracleTable td');
    tableCells.forEach(td => {
      if (td.childNodes.length === 1 && td.childNodes[0].nodeType === Node.TEXT_NODE) {
        const text = td.textContent.trim();
        if (glyphs.includes(text)) {
          td.innerHTML = '';
          td.appendChild(createLink(text));
          td.style.padding = '0'; // Убираем лишние отступы из-за ссылки
        }
      }
    });

    // Обработка .char-item (если иероглифы там нужно тоже сделать ссылками)
    document.querySelectorAll('.char-item > span:first-child').forEach(span => {
      const char = span.firstChild.textContent.trim();
      if (glyphs.includes(char)) {
        const link = createLink(char);
        span.innerHTML = '';
        span.appendChild(link);
        // Возвращаем pinyin
        if (span.querySelector('.inline-pinyin')) {
          span.appendChild(span.querySelector('.inline-pinyin'));
        }
      }
    });
  });
