document.addEventListener('DOMContentLoaded', () => {
  addTemplateInformationClass();
  addRowTablesClass();
  moveFcommentIfCssLoaded();
  applyTitleToPlaceholder();
  applyNoMarginTopIfUserStampExists();
  convertFcommentToLabelIfStructureMatches();
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
  // opt-valign.cssが読み込まれているか判定
  const isCssLoaded = Array.from(document.styleSheets).some(sheet => {
    try {
      return sheet.href && sheet.href.includes('https://siaccorpgit.github.io/dev/opt-valign.css');
    } catch (e) {
      return false;
    }
  });
  if (!isCssLoaded) return;

  // すべてのtrを走査
  document.querySelectorAll('tr').forEach(row => {
    // .fcontまたは.fcont_dspを取得
    const fcont = row.querySelector('.fcont, .fcont_dsp');
    if (!fcont) return;

    // fcontの親tdを取得
    const fcontTd = fcont.closest('td');
    if (!fcontTd) return;

    // 同じtr内で、fcontTd以外のtd内にある.fcommentを探す
    let fcomment = null;
    row.querySelectorAll('td').forEach(td => {
      if (td !== fcontTd) {
        const candidate = td.querySelector('.fcomment');
        if (candidate && !fcomment) fcomment = candidate;
      }
    });

    if (fcomment) {
      // fcommentをfcontの直後に移動
      fcont.parentNode.insertBefore(fcomment, fcont.nextSibling);
    }
  });
}



// 4. td.ftd_cont または td.ftd_verticalcont の title を input/textarea の placeholder に設定
function applyTitleToPlaceholder() {
  document.querySelectorAll('td.ftd_cont, td.ftd_verticalcont').forEach(td => {
    const titleText = td.getAttribute('title');
    if (!titleText) return;

    // input または textarea を探す
    const input = td.querySelector('input');
    const textarea = td.querySelector('textarea');

    if (input) {
      input.setAttribute('placeholder', titleText);
    } else if (textarea) {
      textarea.setAttribute('placeholder', titleText);
    }
  });
}

// 4.承認画面用のクラス付与
function applyNoMarginTopIfUserStampExists() {
  const userStampExists = document.querySelector('.userStampBlock') !== null;
  const formBody = document.getElementById('formbody');

  if (userStampExists && formBody) {
    formBody.classList.add('no-margintop');
  }

  if (userStampExists) {
    document.querySelectorAll('.fcomment').forEach(el => {
      el.style.display = 'none';
    });
  }

}

// 5.チェックボックス用ラベル作成
function convertFcommentToLabelIfStructureMatches() {
  document.querySelectorAll('tr').forEach(row => {
    // .fcont または .fcont_dsp を取得
    const fcont = row.querySelector('.fcont, .fcont_dsp');
    const fcomment = row.querySelector('.fcomment');

    // 条件：fcontがあり、fcommentがあり、fcont内にチェックボックスがある
    if (fcont && fcomment) {
      const checkbox = fcont.querySelector('input[type="checkbox"]');
      const commentText = fcomment.textContent.trim();

      if (checkbox && commentText) {
        // label要素を作成
        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        label.textContent = commentText;
        label.style.marginLeft = '6px';
        label.style.fontSize = '13px';
        label.style.lineHeight = '23px';

        // fcont内にラベルを追加
        fcont.appendChild(label);

        // 元のfcommentを削除
        fcomment.remove();
      }
    }
  });
}
