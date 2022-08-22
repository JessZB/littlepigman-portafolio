
var elem = document.querySelector('.grid-container');
var msnry = new Masonry(elem, {
    // options
    itemSelector: '.grid-item',
    columnWidth: 200,
    gutter: 20,
    fitWidth: true,
});

var elem2 = document.querySelector('.grid-container2');
var msnry2 = new Masonry(elem2, {
    // options
    itemSelector: '.grid-item',
    columnWidth: 200,
    gutter: 20,
    fitWidth: true,
});

