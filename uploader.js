// === СКРИПТ ДЛЯ КОНСОЛИ: ГЛОБАЛЬНАЯ mainScript + НАБЛЮДАТЕЛЬ ===

function mainScript() {
    var dictContainer = document.getElementById('dictionaryContent');
    if (!dictContainer) return;

    var items = dictContainer.querySelectorAll('.dict-item');
    var list = [];

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var hanzi = item.dataset.hanzi;
        var pinyinEl = item.querySelector('.dict-pinyin');
        var pinyin = pinyinEl ? pinyinEl.textContent.trim() : '';
        if (hanzi && pinyin) {
            list.push({ hanzi: hanzi, pinyin: pinyin });
        }
    }

    if (list.length === 0) return;

    // --- Удаляем старый прогресс-бар и блок теории ---
    var oldLoading = document.getElementById('theory-loading-bar');
    if (oldLoading) oldLoading.remove();

    var oldBox = document.getElementById('theory-tabbed-box');
    if (oldBox) oldBox.remove();

    // --- Создаем контейнеры ---
    var container = document.querySelector('.collapsible-container');
    var header = container?.querySelector('#collapsibleHeader');
    var content = container?.querySelector('#collapsibleContent');
    if (!container || !header || !content) return;

    // --- Создаем прогресс-бар ---
    var loadingEl = document.createElement('div');
    loadingEl.id = 'theory-loading-bar';
    loadingEl.style.cssText = `
        background-color: #fffaf7;
        padding: 10px;
        border-radius: 8px;
        margin: 10px 0;
        text-align: center;
        font-size: 13px;
        color: #a0a0a0;
        border: 1px solid #f5e1da;
    `;
    loadingEl.innerHTML = '🔍 Поиск данных... (0/60)';
    container.insertBefore(loadingEl, content);

    function updateProgress(count) {
        if (loadingEl) {
            loadingEl.innerHTML = `🔍 Поиск данных... (${count}/60)`;
        }
    }

    // --- Кэши и результаты ---
    if (!window.theoryCache) window.theoryCache = {};
    if (!window.masterTheoryResults) window.masterTheoryResults = [];
    var results = [];
    var loadedCount = 0;

    // --- Асинхронный поиск ---
    (async function () {
        try {
            for (var lessonNum = 1; lessonNum <= 60; lessonNum++) {
                var url = '../lesson' + lessonNum + '/theory.html';
                try {
                    var html = window.theoryCache[url];
                    if (!html) {
                        var response = await fetch(url);
                        if (!response.ok) continue;
                        html = await response.text();
                        window.theoryCache[url] = html;
                    }

                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                    var grammarSection = doc.querySelector('.grammar');
                    if (!grammarSection) continue;

                    var blocks = grammarSection.querySelectorAll('p.original');
                    for (var j = 0; j < list.length; j++) {
                        var hanzi = list[j].hanzi;
                        for (var k = 0; k < blocks.length; k++) {
                            var block = blocks[k];
                            if (block.textContent.includes(hanzi)) {
                                var h3 = null;
                                var sibling = block.previousElementSibling;
                                while (sibling) {
                                    if (sibling.tagName === 'H3') {
                                        h3 = sibling;
                                        break;
                                    }
                                    sibling = sibling.previousElementSibling;
                                }
                                var title = h3 ? h3.textContent.trim() : '(без заголовка)';
                                var context = h3 ? '<h3>' + h3.innerHTML + '</h3>' + block.outerHTML : block.outerHTML;
                                results.push({ hanzi: hanzi, lesson: lessonNum, title: title, context: context });
                            }
                        }
                    }
                } catch (err) {
                    console.warn(`Ошибка в уроке ${lessonNum}`, err.message);
                } finally {
                    loadedCount++;
                    updateProgress(loadedCount);
                }
            }

            // --- Обновляем глобальную базу ---
            window.masterTheoryResults = window.masterTheoryResults.concat(
                results.filter(r => !window.masterTheoryResults.some(x => x.hanzi === r.hanzi && x.lesson === r.lesson && x.title === r.title))
            );

            // --- Удаляем прогресс-бар и создаем UI ---
            if (loadingEl) loadingEl.remove();
            createTabInterface(container, content, results);

        } catch (err) {
            console.error('Critical error:', err);
            if (loadingEl) loadingEl.innerHTML = '❌ Ошибка загрузки';
        }
    })();
}

function createTabInterface(container, content, resultsForDebug) {
    var theoryBox = document.createElement('div');
    theoryBox.id = 'theory-tabbed-box';
    theoryBox.style.cssText = `
        display: none;
        background-color: #fffdfb;
        padding: 0;
        border-radius: 8px;
        margin: 10px 0;
        border: 1px solid #f5e1da;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        overflow: hidden;
    `;
    container.insertBefore(theoryBox, content);

    theoryBox.innerHTML = `
        <div id="tab-header" style="
            display: flex;
            align-items: flex-start;
            background-color: #f8f6fb;
            padding: 0;
            user-select: none;
            height: 36px;
        ">
            <div class="tab active" data-tab="theory" style="
                padding: 8px 14px;
                background-color: white;
                color: #7c6b96;
                font-size: 13px;
                font-weight: bold;
                border: 1px solid #eae5f3;
                border-bottom: none;
                border-radius: 6px 6px 0 0;
                margin-left: 10px;
                cursor: pointer;
                box-shadow: 0 -1px 2px rgba(0,0,0,0.05);
                position: relative;
                top: 1px;
                z-index: 2;
            ">📌 Теория</div>
            <div class="tab" data-tab="input" style="
                padding: 8px 14px;
                background-color: #f8f6fb;
                color: #a0a0a0;
                font-size: 13px;
                font-weight: normal;
                border: 1px solid #eae5f3;
                border-bottom: none;
                border-radius: 6px 6px 0 0;
                margin-left: 4px;
                cursor: pointer;
            ">✍️ Рукописный ввод</div>
            <button id="close-theory-btn" style="
                margin-left: auto;
                background-color: #ff6b6b;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 13px;
                cursor: pointer;
                font-weight: bold;
                margin: 8px 10px 0 0;
                height: 28px;
            ">ЗАКРЫТЬ</button>
        </div>
        <div id="tab-content" style="padding: 10px; min-height: 60px;">
            <div id="tab-theory" class="tab-pane active"></div>
            <div id="tab-input" class="tab-pane" style="display:none;">
                <iframe id="hanzi-frame" style="width:100%; height:1px; border:none;" src=""></iframe>
            </div>
        </div>
    `;

    var tabs = document.querySelectorAll('.tab');
    var panes = document.querySelectorAll('.tab-pane');
    var closeBtn = document.getElementById('close-theory-btn');
    var hanziFrame = document.getElementById('hanzi-frame');

    for (var i = 0; i < tabs.length; i++) {
        tabs[i].onclick = function () {
            for (var tab of tabs) {
                tab.classList.remove('active');
                if (tab.dataset.tab === 'input') {
                    tab.style.backgroundColor = '#f8f6fb';
                    tab.style.color = '#a0a0a0';
                    tab.style.fontWeight = 'normal';
                }
            }
            for (var pane of panes) pane.style.display = 'none';

            this.classList.add('active');
            this.style.backgroundColor = 'white';
            this.style.color = '#7c6b96';
            this.style.fontWeight = 'bold';

            var targetPane = document.getElementById('tab-' + this.dataset.tab);
            targetPane.style.display = 'block';

            if (this.dataset.tab === 'input') {
                var hanzi = theoryBox.dataset.hanzi;
                hanziFrame.src = './tasks/task1.html#' + hanzi;
                document.getElementById('tab-content').style.padding = '10px 10px 15px';
                hanziFrame.style.height = '420px';
            } else {
                document.getElementById('tab-content').style.padding = '10px';
                if (hanziFrame) hanziFrame.style.height = '1px';
            }
        };
    }

    closeBtn.onclick = function () {
        theoryBox.style.display = 'none';
        if (hanziFrame) hanziFrame.src = '';
    };

    var items = document.getElementById('dictionaryContent').querySelectorAll('.dict-item');
    for (var idx = 0; idx < items.length; idx++) {
        (function (item) {
            var hanzi = item.dataset.hanzi;
            item.removeEventListener('click', item.clickHandler);
            item.clickHandler = function () {
                if (theoryBox.style.display === 'block' && theoryBox.dataset.hanzi === hanzi) {
                    theoryBox.style.display = 'none';
                    return;
                }
                theoryBox.dataset.hanzi = hanzi;
                theoryBox.style.display = 'block';
                var theoryPane = document.getElementById('tab-theory');
                theoryPane.innerHTML = '<p style="color:#999;font-size:12px;">Поиск...</p>';

                var filteredResults = window.masterTheoryResults.filter(r => r.hanzi === hanzi);
                if (filteredResults.length === 0) {
                    theoryPane.innerHTML = '<p style="color:#999;font-size:12px;">Нет данных.</p>';
                } else {
                    var html = '';
                    for (var j = 0; j < filteredResults.length; j++) {
                        var res = filteredResults[j];
                        var context = res.context.replace(new RegExp('(' + hanzi + ')', 'g'), '<span style="background-color:#ffb6c1;padding:0 2px;border-radius:3px;">$1</span>');
                        html += `
                            <div style="margin-bottom:14px;">
                                <strong style="color:#5a5a5a;font-size:12px;">Урок ${res.lesson}</strong>
                                <h4 style="margin:4px 0;color:#7c6b96;">${res.title}</h4>
                                <div style="
                                    background:#f9f7fc;
                                    padding:10px;
                                    border-left:4px solid #a8c8d8;
                                    border-radius:0 6px 6px 0;
                                    font-size:13px;
                                    line-height:1.5;
                                ">${context}</div>
                            </div>`;
                    }
                    theoryPane.innerHTML = html;
                }
                tabs[0].onclick();
            };
            item.addEventListener('click', item.clickHandler);
        })(items[idx]);
    }
}

// --- Наблюдатель за изменениями в DOM ---
if (!window.__theoryObserverInstalled) {
    var observer = new MutationObserver(function (mutations) {
        for (var m of mutations) {
            if (m.type === 'childList' && m.target.id === 'dictionaryContent') {
                setTimeout(mainScript, 100); // Теперь mainScript — глобальная!
                break;
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.__theoryObserverInstalled = true;
    console.log('✅ Наблюдатель за DOM установлен.');
}

// --- Первый запуск ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('🔄 Первый запуск после загрузки DOM');
        mainScript();
    });
} else {
    console.log('🔄 Страница уже загружена. Запускаем немедленно.');
    mainScript();
}