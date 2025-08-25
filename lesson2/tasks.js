// tasks.js
const tasks = [
    // Задание 1
    {
        sentence: "癸卯卜爭貞今歳商受年",
        display: "癸卯卜爭貞今歳商受年",
        words: ["癸卯", "卜", "爭", "貞", "今歳", "商", "受", "年"],
        links: [
            { from: "爭", to: "貞", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "爭", to: "卜", fromRole: "Подлежащее", toRole: "Приложение" },
            { from: "貞", to: "癸卯", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "商", to: "受", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "受", to: "年", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "受", to: "今歳", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "貞", to: "商", fromRole: "Сказуемое", toRole: "Зависимое предложение" }
        ]
    },
    // Задание 2
    {
        sentence: "貞來歳不其受年",
        display: "來歳不其受年",
        words: ["貞", "來歳", "不其", "受", "年"],
        links: [
            { from: "受", to: "年", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "受", to: "來歳", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "受", to: "不其", fromRole: "Сказуемое", toRole: "Обстоятельство степени" },
            { from: "貞", to: "受", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 3
    {
        sentence: "癸丑卜㱿貞冓受年",
        display: "癸丑卜㱿貞冓受年",
        words: ["癸丑", "卜", "㱿", "貞", "冓", "受", "年"],
        links: [
            { from: "㱿", to: "貞", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "㱿", to: "卜", fromRole: "Подлежащее", toRole: "Приложение" },
            { from: "貞", to: "癸丑", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "冓", to: "受", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "受", to: "年", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "貞", to: "受", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 4
    {
        sentence: "貞冓不其受年",
        display: "冓不其受年",
        words: ["貞", "冓", "不其", "受", "年"],
        links: [
            { from: "冓", to: "受", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "受", to: "年", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "受", to: "不其", fromRole: "Сказуемое", toRole: "Обстоятельство степени" },
            { from: "貞", to: "受", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 5
    {
        sentence: "癸卯卜亘貞我受黍年",
        display: "癸卯卜亘貞我受黍年",
        words: ["癸卯", "卜", "亘", "貞", "我", "受", "黍年"],
        links: [
            { from: "亘", to: "貞", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "亘", to: "卜", fromRole: "Подлежащее", toRole: "Приложение" },
            { from: "貞", to: "癸卯", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "我", to: "受", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "受", to: "黍年", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "貞", to: "受", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 6
    {
        sentence: "癸巳卜㱿貞我受稻年",
        display: "癸巳卜㱿貞我受稻年",
        words: ["癸巳", "卜", "㱿", "貞", "我", "受", "稻年"],
        links: [
            { from: "㱿", to: "貞", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "㱿", to: "卜", fromRole: "Подлежащее", toRole: "Приложение" },
            { from: "貞", to: "癸巳", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "我", to: "受", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "受", to: "稻年", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "貞", to: "受", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 7
    {
        sentence: "貞今來歳我不其受年",
        display: "今來歳我不其受年",
        words: ["貞", "今來歳", "我", "不其", "受", "年"],
        links: [
            { from: "我", to: "受", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "受", to: "年", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "受", to: "不其", fromRole: "Сказуемое", toRole: "Обстоятельство степени" },
            { from: "受", to: "今來歳", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "貞", to: "受", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 8
    {
        sentence: "貞戔受",
        display: "戔受",
        words: ["貞", "戔", "受"],
        links: [
            { from: "戔", to: "受", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "貞", to: "受", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 9
    {
        sentence: "貞甫弗其受黍年",
        display: "甫弗其受黍年",
        words: ["貞", "甫", "弗其", "受", "黍年"],
        links: [
            { from: "甫", to: "受", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "受", to: "黍年", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "受", to: "弗其", fromRole: "Сказуемое", toRole: "Обстоятельство степени" },
            { from: "貞", to: "受", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 10
    {
        sentence: "貞：肅來牛",
        display: "肅來牛",
        words: ["貞", "肅", "來", "牛"],
        links: [
            { from: "肅", to: "來", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "來", to: "牛", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "貞", to: "來", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 11
    {
        sentence: "貞肅弗其來牛",
        display: "肅弗其來牛",
        words: ["貞", "肅", "弗其", "來", "牛"],
        links: [
            { from: "肅", to: "來", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "來", to: "牛", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "來", to: "弗其", fromRole: "Сказуемое", toRole: "Обстоятельство степени" },
            { from: "貞", to: "來", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 12
    {
        sentence: "貞今春奚來牛奚不其來牛",
        display: "今春奚來牛 奚不其來牛",
        words: ["貞", "今春", "奚", "來", "牛", "不其"],
        links: [
            { from: "奚", to: "來", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "來", to: "牛", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "來", to: "今春", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "奚", to: "來", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "來", to: "牛", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "來", to: "不其", fromRole: "Сказуемое", toRole: "Обстоятельство степени" },
            { from: "貞", to: "來", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 13
    {
        sentence: "甲辰卜㱿貞奚來白馬",
        display: "甲辰卜㱿貞奚來白馬",
        words: ["甲辰", "卜", "㱿", "貞", "奚", "來", "白", "馬"],
        links: [
            { from: "㱿", to: "貞", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "㱿", to: "卜", fromRole: "Подлежащее", toRole: "Приложение" },
            { from: "貞", to: "甲辰", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "奚", to: "來", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "來", to: "馬", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "馬", to: "白", fromRole: "Дополнение", toRole: "Определение" },
            { from: "貞", to: "來", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    },
    // Задание 14
    {
        sentence: "王占曰吉其來馬",
        display: "王占曰吉其來馬",
        words: ["王", "占曰", "吉", "其", "來", "馬"],
        links: [
            { from: "王", to: "占曰", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "來", to: "馬", fromRole: "Сказуемое", toRole: "Дополнение" },
            { from: "來", to: "吉", fromRole: "Сказуемое", toRole: "Обстоятельство образа действия" },
            { from: "來", to: "其", fromRole: "Сказуемое", toRole: "Обстоятельство времени" }
        ]
    },
    // Задание 15
    {
        sentence: "丙辰卜㱿貞今春方其自來",
        display: "丙辰卜㱿貞今春方其自來",
        words: ["丙辰", "卜", "㱿", "貞", "今春", "方", "其", "自", "來"],
        links: [
            { from: "㱿", to: "貞", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "㱿", to: "卜", fromRole: "Подлежащее", toRole: "Приложение" },
            { from: "貞", to: "丙辰", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "方", to: "來", fromRole: "Подлежащее", toRole: "Сказуемое" },
            { from: "來", to: "今春", fromRole: "Сказуемое", toRole: "Обстоятельство времени" },
            { from: "來", to: "其", fromRole: "Сказуемое", toRole: "Обстоятельство" },
            { from: "來", to: "自", fromRole: "Сказуемое", toRole: "Обстоятельство образа действия" },
            { from: "貞", to: "來", fromRole: "Сказуемое", toRole: "Содержание вопроса" }
        ]
    }
];