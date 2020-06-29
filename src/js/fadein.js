// export文を使ってhello関数を定義する。
export function fadein() {
  const triggerMargin = 300;
  const scrollAnimationElm = document.querySelectorAll('.js-fadein');
  const returnBtn = document.getElementById('js-return_top');

  const scrollAnimation = function() {
    for(let i = 0; i < scrollAnimationElm.length; i++) {
      if (window.innerHeight > scrollAnimationElm[i].getBoundingClientRect().top + triggerMargin) {
        scrollAnimationElm[i].classList.add('show');
      }
    }
  }

  const returnBtnAnimation = function() {
      if (window.innerHeight > triggerMargin) {
        returnBtn.classList.add('show');
      } else {
        returnBtn.classList.remove('show');
      }
  }

  window.addEventListener('load', scrollAnimation);
  window.addEventListener('scroll', scrollAnimation);
  window.addEventListener('scroll', returnBtnAnimation);
}
