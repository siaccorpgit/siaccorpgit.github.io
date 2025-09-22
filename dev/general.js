document.addEventListener('DOMContentLoaded', () => {
  addTemplateInformationClass();
  addRowTablesClass();
  moveFcommentIfCssLoaded();
  applyTitleToPlaceholder();
  applyNoMarginTopIfUserStampExists();
  convertFcommentToLabelIfStructureMatches();
  addNoTitleClassToNoTitlePattern()
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

  // すべての.fcommentを走査
  document.querySelectorAll('.fcomment').forEach(fcomment => {
    const fcommentTd = fcomment.closest('td');
    if (!fcommentTd) return;

    // 兄弟の.ftd_contを取得
    const siblingFtdConts = Array.from(fcommentTd.parentNode.children)
      .filter(td => td !== fcommentTd && td.classList.contains('ftd_cont'));

    // 兄弟.ftd_contの中の.fcontまたは.fcont_dspを探す
    let targetFcont = null;
    for (const td of siblingFtdConts) {
      targetFcont = td.querySelector('.fcont, .fcont_dsp');
      if (targetFcont) break;
    }

    // 見つかったら、その直後にfcommentを移動
    if (targetFcont) {
      targetFcont.parentNode.insertBefore(fcomment, targetFcont.nextSibling);
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
// 6.タイトルなし行のクラス付与
function addNoTitleClassToNoTitlePattern() {
  document.querySelectorAll('.ftd_cont').forEach(td => {
    // .fcontと.fcommentが両方ともこのtd内にあるか
    const fcont = td.querySelector('.fcont, .fcont_dsp');
    const fcomment = td.querySelector('.fcomment');
    if (!fcont || !fcomment) return;

    // 兄弟tdに.ftd_titleが存在するか
    const siblings = Array.from(td.parentNode.children).filter(sib => sib !== td);
    const hasTitle = siblings.some(sib => sib.classList.contains('ftd_title'));

    // 兄弟に.ftd_titleがなければno_titleを付与
    if (!hasTitle) {
      td.classList.add('no_title');
    }
  });
}
