// NAV
export default function navBar(nav, btn, icon, active) {
  const $navMenu = document.querySelector(nav),
    $menuBtn = document.querySelector(btn),
    $iconBtn = document.querySelector(icon);
  let openMenu = "icons/menu/menu.svg",
    closeMenu = "icons/menu/close.svg";

  document.addEventListener("click", (e) => {
    if (e.target.matches(`${btn} > *`)) {
      $navMenu.classList.toggle(active);
      $menuBtn.classList.toggle(active);

      if ($menuBtn.classList.contains(active)) {
        $iconBtn.src = closeMenu;
      } else {
        $iconBtn.src = openMenu;
      }
    } else {
      $navMenu.classList.remove(active);
      $menuBtn.classList.remove(active);
      $iconBtn.src = openMenu;
    }
  });

  // SCROLL

  window.addEventListener("scroll", () => {
    $navMenu.classList.toggle(
      "sticky-menu",
      window.scrollY > 0 && window.innerWidth > 750
    );
    $navMenu.classList.remove(active);
    $menuBtn.classList.remove(active);
    $iconBtn.src = openMenu;
  });

  // resize

  window.addEventListener("resize", () => {
    $navMenu.classList.remove(active);
    $menuBtn.classList.remove(active);
    if (window.screenX < 750) $navMenu.classList.remove("sticky-menu");
    $iconBtn.src = openMenu;
  });
}
