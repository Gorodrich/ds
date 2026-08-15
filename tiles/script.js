(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var grid = document.getElementById('tileGrid');
  if (!grid) return;

  for (var i = 1; i <= 16; i++) {
    var num = i < 10 ? '0' + i : String(i);
    var tile = document.createElement('a');
    tile.className = 'tile';
    tile.href = 'assets/' + num + '.zip';
    tile.download = num + '.zip';
    tile.textContent = num;
    tile.setAttribute('aria-label', '区画' + num + 'をダウンロード (' + num + '.zip)');
    tile.addEventListener('click', function () {
      var el = this;
      el.classList.add('is-tapped');
      setTimeout(function () { el.classList.remove('is-tapped'); }, 220);
    });
    grid.appendChild(tile);
  }
})();
