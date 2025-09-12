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
