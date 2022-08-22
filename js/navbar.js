// NAV
export default function navBar(nav, btn, icon, active) {
  const $navMenu = document.querySelector(nav),
    $menuBtn = document.querySelector(btn),
    $iconBtn = document.querySelector(icon);

    let openMenu = "fa-bars",
    closeMenu = "fa-xmark";
    
  $menuBtn.addEventListener("click", () => {
    $navMenu.classList.toggle(active);
    $menuBtn.classList.toggle(active);
    
    if ($iconBtn.classList.contains(openMenu)) {
      $iconBtn.classList.remove(openMenu);
      $iconBtn.classList.add(closeMenu);
    } else {
      $iconBtn.classList.remove(closeMenu);
      $iconBtn.classList.add(openMenu);
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
    $iconBtn.classList.add(openMenu);

    changeIcon();
  });

  // resize

  window.addEventListener("resize", () => {
    $navMenu.classList.remove(active);
    $menuBtn.classList.remove(active);
    if (window.screenX < 750) $navMenu.classList.remove("sticky-menu");

    changeIcon();
  });
  function changeIcon() {
    if ($iconBtn.classList.contains(closeMenu))
      $iconBtn.classList.remove(closeMenu);
    else $iconBtn.classList.add(openMenu);
  }
}

