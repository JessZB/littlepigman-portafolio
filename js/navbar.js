const nav_menu = document.querySelector('.nav-menu');

const buttondiv = document.querySelector('.activate-menu');
const button = document.querySelector('.activate__menu-i');

// NAV

buttondiv.addEventListener('click', () => {
    nav_menu.classList.toggle('active');
    buttondiv.classList.toggle('active');

    if (button.classList.contains('icon-list')) {
        button.classList.remove('icon-list');
        button.classList.add('icon-close');
    } else {
        button.classList.remove('icon-close');
        button.classList.add('icon-list');
    }
})

// SCROLL

window.addEventListener("scroll", () => {
    nav_menu.classList.toggle('sticky-menu', window.scrollY > 0 && window.innerWidth > 750);
    nav_menu.classList.remove('active');

    buttondiv.classList.remove('active');
    button.classList.add('icon-list');

    changeIcon()
})

// resize

window.addEventListener('resize', () => {
    nav_menu.classList.remove('active');
    buttondiv.classList.remove('active');
    if (window.screenX < 750) nav_menu.classList.remove('sticky-menu');

    changeIcon();

})

function changeIcon() {
    if (button.classList.contains('icon-close')) button.classList.remove('icon-close');
    else button.classList.add('icon-list');
}