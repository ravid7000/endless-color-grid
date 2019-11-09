var rootGridElement = $('.grid')
var cartContainer = $('.color-container')
var colorCart = $('.color-cart')
var colorLength = $('.all-colors')
var downloadBtn = $('#downloadJson')
var cart = []

function ramdomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    var letters = '0123456789abcdef'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

function generateGridColumns(columns) {
    if (!columns) {
        columns = 10
    }

    function addColor(btn, color) {
        btn.on('click', function () {
            cart.push(color);
            renderCart()
        })
    }

    for (var i = 0; i < columns; i++) {
        var gridCol = $('<div class="grid-col"></div>')
        var content = $('<div class="content"></div>')
        var figure = $('<div class="figure"></div>')
        var text = $('<div class="text"></div>')
        var input = $('<input />')
        var addBtn = $('<button>add</button>')

        var color = getRandomColor()

        figure.css('height', 200)
            .css('background', color)

        gridCol.append(content)
        content.append(figure)
        content.append(text)
        text.append([input, addBtn])
        input.val(color)
        input.attr('readonly', true)
        addBtn.html('<i class="material-icons">add_circle</i>')
        addColor(addBtn, color)
        rootGridElement.append(gridCol)
    }
}

function renderCart() {
    var i = 0;
    var len = cart.length;

    if (!len) {
        colorCart.hide();
    } else {
        colorCart.show(200);
    }

    function addAction(item, close, index) {
        close.on('click', function () {
            cart.splice(index, 1);
            renderCart();
        })
    }

    var items = ['<div class="all-colors">' + cart.length + '</div>']
    cartContainer.empty();
    while (i < len) {
        var item = $('<div class="item"></div>');
        var itemColor = $('<div class="item-color"></div>');
        var itemClose = $('<span>&times;</span>');
        itemColor.text(cart[i]);
        itemColor.css('background-color', cart[i]);
        item.append([itemColor, itemClose]);
        addAction(item, itemClose, i);
        items.push(item)
        i += 1;
    }
    cartContainer.append(items)
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ colors: cart }));
    downloadBtn.attr('href', dataStr);
    downloadBtn.attr('download', 'endless-colors.json');
}

renderCart()


generateGridColumns()

function initScroll() {
    var isScrolling = false
    window.addEventListener('scroll', function (e) {
        isScrolling = true
        var bodyHeight = document.body.scrollHeight
        var scrollBottom = scrollY + window.innerHeight
        /* don't endup with momory space */
        if (bodyHeight < 100000) {
            if (Math.floor((scrollBottom / bodyHeight) * 100) > 95) {
                e.preventDefault()
                generateGridColumns(10)
            }
        }
    })
}

initScroll()