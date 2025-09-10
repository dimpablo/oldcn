document.addEventListener('DOMContentLoaded', function () {
  const helpPath = '../help'; // Путь к справке
  const glyphs = ['不', '亡', '其', '叀', '弗', '曰', '若', '于', '允', '占', '唯', '弜', '王', '貞', '奚'];

  // Функция создания иероглифа с иконкой "ссылка" в виде степени
  function createGlyphWithLink(char) {
    const container = document.createElement('span');
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    container.style.lineHeight = '1'; // Чтобы не сбивалась высота строки

    // Иероглиф
    const glyphSpan = document.createElement('span');
    glyphSpan.textContent = char;
    glyphSpan.style.position = 'relative';
    glyphSpan.style.zIndex = '1';

    // Значок степени
    const linkLabel = document.createElement('a');
    linkLabel.href = `${helpPath}/${char}.html`;
    linkLabel.target = '_blank';
    linkLabel.rel = 'noopener';
    linkLabel.textContent = '●'; // Круглая точка
    linkLabel.style.position = 'absolute';
    linkLabel.style.top = '-0.5em';      // Поднимаем вверх
    linkLabel.style.right = '0';
    linkLabel.style.fontSize = '0.6em';  // Меньше основного текста
    linkLabel.style.lineHeight = '1';
    linkLabel.style.color = '#d81b60';   // Цвет
    linkLabel.style.textDecoration = 'none';
    linkLabel.style.zIndex = '2';
    linkLabel.style.transform = 'translateX(50%)'; // Сдвиг вправо, чтобы был над краем
    linkLabel.style.cursor = 'pointer';

    container.appendChild(glyphSpan);
    container.appendChild(linkLabel);

    return container;
  }

  // === Создание навигационной полоски ===
  function createNavigation() {
    const textDiv = document.querySelector('.text');
    if (!textDiv) return;

    // Получаем номер урока из URL
    const path = window.location.pathname;
    const lessonMatch = path.match(/\/lesson(\d+)\//);
    
    if (lessonMatch) {
      const lessonNum = parseInt(lessonMatch[1]);
      const prevLesson = lessonNum - 1;
      const nextLesson = lessonNum + 1;

      // Создаем навигационную полоску
      const navDiv = document.createElement('div');
      navDiv.style.cssText = `
        text-align: center;
        margin: 15px 0;
        padding: 8px 0;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        background-color: #f8f9fa;
        font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
        font-size: 0.9em;
      `;

      // Создаем ссылки
      const prevLink = prevLesson > 0 ? 
        '<a href="../lesson' + prevLesson + '/theory.html" style="color: #1a4f72; text-decoration: none;">← предыдущая</a>' : 
        '<span style="color: #999;">← предыдущая</span>';

      const currentLink = '<a href="../lesson' + lessonNum + '/theory.html" style="color: #1a4f72; text-decoration: none; font-weight: bold;">урок ' + lessonNum + '</a>';
      
      // Для следующего урока проверяем, не выходит ли за пределы (1-60)
      const nextLink = nextLesson <= 60 ? 
        '<a href="../lesson' + nextLesson + '/theory.html" style="color: #1a4f72; text-decoration: none;">следующая →</a>' : 
        '<span style="color: #999;">следующая →</span>';
      
      const homeLink = '<a href="../index.html" style="color: #1a4f72; text-decoration: none;">на главную</a>';

      navDiv.innerHTML = prevLink + ' | ' + currentLink + ' | ' + nextLink + ' | ' + homeLink;
      
      // Вставляем навигацию перед текстом
      textDiv.parentNode.insertBefore(navDiv, textDiv);
    }
  }

  // === Обработка таблицы oracleTable ===
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
        td.innerHTML = '';
        td.appendChild(createGlyphWithLink(char));
      }
    }
  });

  // === Обработка .char-item > span:first-child ===
  document.querySelectorAll('.char-item > span:first-child').forEach((span) => {
    const firstChild = span.firstChild;
    if (
      firstChild &&
      firstChild.nodeType === Node.TEXT_NODE &&
      firstChild.textContent.trim().length === 1
    ) {
      const char = firstChild.textContent.trim();
      if (glyphs.includes(char)) {
        const pinyin = span.querySelector('.inline-pinyin');

        span.innerHTML = '';
        span.appendChild(createGlyphWithLink(char));
        if (pinyin) {
          span.appendChild(pinyin);
        }
      }
    }
  });

  // Создаем навигацию
  createNavigation();
});