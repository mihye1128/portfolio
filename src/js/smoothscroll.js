// export文を使ってhello関数を定義する。
export function smoothScroll(headH = 0) {
  const interval = 10;               // スクロール処理を繰り返す間隔
  const divisor = 8;                 // 近づく割合（数値が大きいほどゆっくり近く）
  const range = (divisor / 2) + 1;   // どこまで近づけば処理を終了するか(無限ループにならないように divisor から算出)
  const links = document.querySelectorAll('a[href^="#"]');

  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function (e) {
      e.preventDefault();
      let toY;
      let nowY = window.pageYOffset;                       // 現在のスクロール値
      const href = e.target.getAttribute('href');          // href取得
      const target = document.querySelector(href);         // リンク先の要素（ターゲット）取得
      const targetRect = target.getBoundingClientRect();   // ターゲットの座標取得
      const targetY = targetRect.top + nowY - headH;       // 現在のスクロール値 & ヘッダーの高さを踏まえた座標
      // スクロール終了まで繰り返す処理
      (function doScroll() {
        toY = nowY + Math.round((targetY - nowY) / divisor);  // 次に移動する場所（近く割合は除数による。）
        window.scrollTo(0, toY);                       // スクロールさせる
        nowY = toY;                                 // nowY更新

        if (document.body.clientHeight - window.innerHeight < toY) {
          // 最下部にスクロールしても対象まで届かない場合は下限までスクロールして強制終了
          window.scrollTo(0, document.body.clientHeight);
          return;
        }
        if (toY >= targetY + range || toY <= targetY - range) {
          // +-rangeの範囲内へ近くまで繰り返す
          window.setTimeout(doScroll, interval);
        } else {
          // +-range の範囲内にくれば正確な値へ移動して終了。
          window.scrollTo(0, targetY);
        }
      })();
    });
  }
}
