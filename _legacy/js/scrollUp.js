const d = document;

export default function scrollUp(btnUp, activeBtn) {
  const $upButton = d.querySelector(btnUp);
  d.addEventListener("scroll", (e) => {
    if (window.scrollY >= 600) {
      $upButton.classList.add(activeBtn);
    } else {
      $upButton.classList.remove(activeBtn);
    }
  });
  d.addEventListener("click", (e) => {
    if (e.target.matches(btnUp) || e.target.matches(`${btnUp} *`)) {
      window.scroll(0, 0);
    }
  });
}