document.addEventListener('DOMContentLoaded', () => {
  addTemplateInformationClass();
  addRowTablesClass();
  moveFcommentIfCssLoaded();
});

// 1. 指定ラベルが揃ったときに直前の tr にクラスを追加
function addTemplateInformationClass() {
  document.querySelectorAll('tr').forEach((tr, index, rows) => {
    const titles = tr.querySelectorAll('td.ftd_title');
    const fixedLabels = ['社員番号', '氏名', 'メールアドレス'];

    let matchCount = 0;
    titles.forEach(td => {
      const text = td.textContent.trim().replace(/\u00a0/g, ''); // &nbsp;除去
      if (fixedLabels.includes(text)) {
        matchCount++;
      }
    });

    if (matchCount === fixedLabels.length && index > 0) {
      rows[index - 1].classList.add('template_information');
    }
  });
}

// 2. div#formbody 直下の table にクラスを追加
function addRowTablesClass() {
  const formBody = document.querySelector('#formbody');
  if (!formBody) return;

  Array.from(formBody.children).forEach(child => {
    if (child.tagName === 'TABLE') {
      child.classList.add('row-tables');
    }
  });
}

// 3. opt-valign.css が読み込まれている場合のみ、fcomment を fcont の後ろに移動
function moveFcommentIfCssLoaded() {
  const isCssLoaded = Array.from(document.styleSheets).some(sheet => {
    try {
      return sheet.href && sheet.href.includes('https://siaccorpgit.github.io/dev/opt-valign.css');
    } catch (e) {
      return false;
    }
  });

  if (!isCssLoaded) return;

  document.querySelectorAll('tr').forEach(row => {
    const fcont = row.querySelector('.fcont');
    const fcomment = row.querySelector('.fcomment');

    if (fcont && fcomment) {
      const newFcomment = fcomment.cloneNode(true);
      fcont.parentNode.insertBefore(newFcomment, fcont.nextSibling);
      fcomment.parentNode.removeChild(fcomment);
    }
  });
}
