// mobile.js — Активируется ТОЛЬКО на мобильных устройствах

document.addEventListener('DOMContentLoaded', function () {
    // === Проверка: это мобильное устройство? ===
    const isMobile = () => {
        return window.innerWidth <= 768 || 
               /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    };

    if (!isMobile()) {
        // ❌ Не мобильное — ничего не делаем
        return;
    }

    // ✅ Это мобильное устройство — применяем улучшения

    // 1. Добавляем viewport, если его нет
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, user-scalable=yes';
        document.head.appendChild(meta);
    }

    // 2. Помечаем body, чтобы можно было стилизовать под тач
    document.body.classList.add('touch');

    // 3. Оборачиваем таблицу в контейнер с горизонтальной прокруткой
    const table = document.getElementById('oracleTable');
    if (table && !table.parentNode.classList.contains('oracle-table-container')) {
        const container = document.createElement('div');
        container.className = 'oracle-table-container';
        container.style.overflowX = 'auto';
        container.style.padding = '0';
        container.style.margin = '15px 0';

        table.parentNode.insertBefore(container, table);
        container.appendChild(table);

        // Убедимся, что таблица может быть шире экрана
        table.style.minWidth = '600px';
        table.style.width = 'auto';
    }

    // 4. Заменяем hover-подсказки на долгое нажатие (touch)
    const charItems = document.querySelectorAll('.char-item');
    charItems.forEach(item => {
        const tooltip = item.querySelector('.char-tooltip');
        if (!tooltip) return;

        let touchTimeout;

        item.addEventListener('touchstart', function (e) {
            e.preventDefault();
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                // Показываем тултип при долгом нажатии (~600 мс)
                tooltip.style.display = 'block';
            }, 600);
        });

        item.addEventListener('touchend', function () {
            clearTimeout(touchTimeout);
            // Скрываем через 1.5 секунды
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 1500);
        });

        // Скрываем при касании вне
        document.addEventListener('touchstart', function (e) {
            if (!item.contains(e.target)) {
                tooltip.style.display = 'none';
            }
        }, { passive: true });
    });

    // 5. Корректировка шрифтов под мобильное чтение
    document.body.style.lineHeight = '1.6';
});