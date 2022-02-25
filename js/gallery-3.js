var elem = document.querySelector('.grid-container3');
var msnry = new Masonry(elem, {
    // options
    itemSelector: '.grid-item',
    columnWidth: 200,
    gutter: 20,
    fitWidth: true,
});