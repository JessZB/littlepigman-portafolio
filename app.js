import navBar from "./js/navbar.js";
import scrollUp from "./js/scrollUp.js";

const d = document;

d.addEventListener('DOMContentLoaded', (e)=>{
    navBar(".nav-menu", ".activate-menu", ".activate__menu-i", "active");
    scrollUp(".up-btn", "activate");
})
