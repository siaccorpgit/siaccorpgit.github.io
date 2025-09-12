document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('tr').forEach(tr => {
    const titles = tr.querySelectorAll('td.ftd_title');
    const fixedLabels = ['社員番号', '氏名', 'メールアドレス'];

    let matchCount = 0;

    titles.forEach(td => {
      const text = td.textContent.trim().replace(/\u00a0/g, ''); // &nbsp;除去
      if (fixedLabels.includes(text)) {
        matchCount++;
      }
    });
    // すべてのラベルが一致した場合に class を追加
    if (matchCount === fixedLabels.length) {
      tr.classList.add('template_information');
    }
  });
});

(function() {
  // Check if 'opt-valign.css' is loaded
  const isCssLoaded = Array.from(document.styleSheets).some(sheet => {
    return sheet.href && sheet.href.includes('opt-valign.css');
  });

  if (!isCssLoaded) return;

  // Get all rows in the document
  const rows = document.querySelectorAll('tr');

  rows.forEach(row => {
    const fcont = row.querySelector('.fcont');
    const fcomment = row.querySelector('.fcomment');

    if (fcont && fcomment) {
      // Clone the fcomment element
      const newFcomment = fcomment.cloneNode(true);

      // Insert the cloned fcomment after fcont
      fcont.parentNode.insertBefore(newFcomment, fcont.nextSibling);

      // Remove the original fcomment
      fcomment.parentNode.removeChild(fcomment);
    }
  });
})();
