var elem = document.querySelector('.grid-container2');
var msnry = new Masonry(elem, {
    // options
    itemSelector: '.grid-item',
    columnWidth: 250,
    gutter: 20,
    fitWidth: true,
});