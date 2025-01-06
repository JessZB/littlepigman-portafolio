import navBar from './js/navbar.js'
import scrollUp from './js/scrollUp.js'

const d = document

ping()

d.addEventListener('DOMContentLoaded', (e) => {
  navBar('.nav-menu', '.activate-menu', '.activate-menu-btn', 'active')
  scrollUp('.up-btn', 'activate')
})
