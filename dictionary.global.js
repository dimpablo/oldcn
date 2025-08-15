function extractHanzi(str) {
  // Регулярное выражение для китайских иероглифов (включает основные иероглифы CJK Unified Ideographs)
  const hanziRegex = /[\u4e00-\u9fff\uf900-\ufaff]/g;
  return (str.match(hanziRegex) || []).join('');
}
function uniqueChars(str) {
  return [...new Set(str)].join('');
}

丙寅卜爭貞雨曰其癸亥不允王占丑己卯珏壬午 (урок 1)
甲子乙丑丙寅丁卯戊辰己巳庚午辛未壬申癸酉戌亥 (циклические знаки)
弗肅牛重犬春奚甲辰白馬吉方自今歲商受年來冓亘我黍巳稲戔甫 (урок 2)