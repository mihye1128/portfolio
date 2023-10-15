export default function preLoad() {
  window.onload = function () {
    const body = document.getElementById("js-body");
    body.classList.remove("js-preload");
  };
}
