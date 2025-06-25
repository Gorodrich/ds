// ページ読み込み時に実行
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleRules");
  const body = document.body;
  const rules = document.querySelectorAll(".rule");
  
  // トグルの状態切り替え
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      // 簡易モードON
      body.classList.add("simple-mode");
    } else {
      // 簡易モードOFF
      body.classList.remove("simple-mode");
      // 展開状態もリセット
      rules.forEach(rule => {
        rule.classList.remove("expanded");
      });
    }
  });

  // 各ルールの [表示] ボタンにクリックイベントを設定
  rules.forEach(rule => {
    const btn = rule.querySelector(".show-btn");
    btn.addEventListener("click", () => {
      // クリックされたルールだけ展開
      rule.classList.add("expanded");
    });
  });
});
