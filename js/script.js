const pieces = [
    { "letter": "A", "value": 1, "amount": 9 },
    { "letter": "B", "value": 3, "amount": 2 },
    { "letter": "C", "value": 3, "amount": 2 },
    { "letter": "D", "value": 2, "amount": 4 },
    { "letter": "E", "value": 1, "amount": 12 },
    { "letter": "F", "value": 4, "amount": 2 },
    { "letter": "G", "value": 2, "amount": 3 },
    { "letter": "H", "value": 4, "amount": 2 },
    { "letter": "I", "value": 1, "amount": 9 },
    { "letter": "J", "value": 8, "amount": 1 },
    { "letter": "K", "value": 5, "amount": 1 },
    { "letter": "L", "value": 1, "amount": 4 },
    { "letter": "M", "value": 3, "amount": 2 },
    { "letter": "N", "value": 1, "amount": 6 },
    { "letter": "O", "value": 1, "amount": 8 },
    { "letter": "P", "value": 3, "amount": 2 },
    { "letter": "Q", "value": 10, "amount": 1 },
    { "letter": "R", "value": 1, "amount": 6 },
    { "letter": "S", "value": 1, "amount": 4 },
    { "letter": "T", "value": 1, "amount": 6 },
    { "letter": "U", "value": 1, "amount": 4 },
    { "letter": "V", "value": 4, "amount": 2 },
    { "letter": "W", "value": 4, "amount": 2 },
    { "letter": "X", "value": 8, "amount": 1 },
    { "letter": "Y", "value": 4, "amount": 2 },
    { "letter": "Z", "value": 10, "amount": 1 },
    { "letter": "_", "value": 0, "amount": 2 }
];

class TileBag {
    constructor(pieces) {
        pieces.forEach(piece => {
            this[piece.letter] = {
                letter: piece.letter,
                value: piece.value,
                amount: piece.amount,
                image: "graphics_data/Solid/letter_" + piece.letter + ".png"
            };
        });
    }
    getTotalTiles() {
        let total = 0;
        for (const key in this) {
            total += this[key].amount
        }
        return total;
    }
    removeTile(letter) {
        var tile = this[letter];
        if (!tile) {
            console.log(`No such tile: ${letter}`);
            return null;
        }
        if (tile.amount < 0) {
            console.log(`No ${letter}s left!`);
            return null;
        }
        else {
            tile.amount--;
            console.log(`Removed ${letter}!`);
            return null;
        }
    }
    drawTile() {
        var num = Math.floor(Math.random() * (this.getTotalTiles())) + 1;
        for (const key in this) {
            num -= this[key].amount;
            if (num <= 0) {
                this.removeTile(key);
                return this[key]
            }
        }

    }
    getScoreValue(letter){
        var tile = this[letter];
        if (!tile) {
            console.log(`No such tile: ${letter}`);
            return null;
        }
        else{
            return tile.value;
        }
    }
}

const bag = new TileBag(pieces);
var placeAnywhere = true;
var score = 0;

$(function () {
    makeBoard();
    $(".droppable").droppable({
        disabled: false,
        drop: function (event, ui) {
            const $droppable = $(this);
            const $draggable = ui.helper;
            $draggable.data("wasDropped", true);
            $droppable.html($draggable.html());
            $droppable.data("hasTile", true);
            blockCol = parseInt(this.dataset.col)
            blockRow = parseInt(this.dataset.row)
            enableSurroundingTiles(blockRow, blockCol);
            nScore =(tallyScore(score));
            $('.score').text(`${nScore}`);
        }
    });
    $(".droppable-trash").droppable({
        disabled: false,
        drop: function (event, ui) {
            const $droppable = $(this);
            const $draggable = ui.helper;
            $draggable.data("wasDropped", true);
            $droppable.data("hasTile", true);
        }
    });
    draggable("#one");
    draggable("#two");
    draggable("#three");
    draggable("#four");
    draggable("#five");
    draggable("#six");
    draggable("#seven");
});

function enableSurroundingTiles(centerRow, centerCol) {
    $(".droppable").each(function () {
        $(this).droppable("option", "disabled", true).addClass("droppable-disabled");
    });
    $(".droppable").filter(function () {
        return $(this).data("hasTile");
    }).each(function () {
        const $square = $(this);
        const row = parseInt($square.data("row"));
        const col = parseInt($square.data("col"));
        const neighbors = [
        ];
        horizontal = $(`.droppable[data-row='${row}'][data-col='${col-1}']`).data("hasTile");
        horizontal = $(`.droppable[data-row='${row}'][data-col='${col+1}']`).data("hasTile") || horizontal;
        vertical = $(`.droppable[data-row='${row-1}'][data-col='${col}']`).data("hasTile");
        vertical = $(`.droppable[data-row='${row+1}'][data-col='${col}']`).data("hasTile") || vertical;
        if(horizontal && vertical){
            //Add later
        }
        else{
            if(!horizontal){
                neighbors.push([row - 1, col]);
                neighbors.push([row + 1, col]);
            }
            if(!vertical){
                neighbors.push([row, col - 1]);
                neighbors.push([row, col + 1]);
            }
        }
        console.log(`Vertical: ${!vertical}, Horizontal: ${!horizontal}`)
        console.log(`${$(this).data("hasTile")}`)
        neighbors.forEach(([nRow, nCol]) => {
            const selector = `.droppable[data-row='${nRow}'][data-col='${nCol}']`;
            const $neighbor = $(selector);
            $neighbor.droppable("option", "disabled", false).removeClass("droppable-disabled");
        });
    });
}

function tallyScore(score = 0) {
    placedTiles = []
    wordMult = 1;
    sum = score;
    $(".droppable").filter(function () {
        return $(this).data("hasTile");
    }).each(function () {
        const $square = $(this);
        // sum = sum + $square.data.
            placedTiles.push($square.find("img").attr("alt"))  // assuming your tile image's alt is the letter);
            sum += bag.getScoreValue($square.find("img").attr("alt")) * $square.data("letterMult");
            wordMult *= $square.data("wordMult");
    });
    return(sum*wordMult)
}

function draggable(id) {
    $(id).draggable({
        start: function (event, ui) {
            ui.helper.data("wasDropped", false);
        },
        stop: function (event, ui) {
            if (ui.helper.data("wasDropped")) {
                $(this).find(".tile").attr("src", "graphics_data/Solid/black_square.png");
                $(this).draggable("option", "disabled", true);
            }
            $(this).css({
                top: 0,
                left: 0
            });

        }
    });
    image = $(id).find(".tile").html(makeTileImageHtml());
    tile = bag.drawTile();
    image.attr("src", tile.image);
    image.attr("alt", tile.letter);
    image.addClass("tile-piece")
}

function makeTileImageHtml() {
    tile = bag.drawTile();
    image = $("<img>");
    image.attr("src", tile.image);
    image.attr("alt", tile.letter);
    image.addClass("tile-piece")
    return image;
}

function makeBoard() {
    const boardWidth = 15;
    const boardHeight = 15;
    const boardBody = document.getElementById("board");
    const tripple_word = [
        [0, 0],
        [0, 7],
        [0, 14],
        [7, 0],
        [7, 14],
        [14, 0],
        [14, 7],
        [14, 14]
    ]
    const double_letter = [
        [0, 3],
        [0, 11],
        [2, 6],
        [2, 8],
        [3, 0],
        [3, 7],
        [3, 14],
        [6, 2],
        [6, 6],
        [6, 8],
        [6, 12],
        [7, 3],
        [7, 11],
        [14, 3],
        [14, 11],
        [12, 6],
        [12, 8],
        [11, 0],
        [11, 7],
        [11, 14],
        [8, 2],
        [8, 6],
        [8, 8],
        [8, 12]
    ]
    const tripple_letter = [
        [1, 5],
        [1, 9],
        [5, 1],
        [5, 5],
        [5, 9],
        [5, 13],
        [13, 5],
        [13, 9],
        [9, 1],
        [9, 5],
        [9, 9],
        [9, 13]
    ]
    const double_word = [
        [1, 1],
        [1, 13],
        [2, 2],
        [2, 12],
        [3, 3],
        [3, 11],
        [4, 4],
        [4, 10],
        [13, 1],
        [13, 13],
        [12, 2],
        [12, 12],
        [11, 3],
        [11, 11],
        [10, 4],
        [10, 10],
    ]

    for (let row = 0; row < boardHeight; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < boardWidth; col++) {
            const td = document.createElement("td");
            td.classList.add("droppable")
            td.dataset.row = row;
            td.dataset.col = col;
            td.dataset.wordMult = 1;
            td.dataset.letterMult = 1;
            td.dataset.hasTile = false;
            td.innerHTML = `<img class="board-tile" src="graphics_data/Solid/tile.png" alt="Drop Here">`;
            for (let i = 0; i < tripple_word.length; i++) {
                if ((row == tripple_word[i][0]) && (col == tripple_word[i][1])) {
                    td.innerHTML = `<img class="board-tile" src="graphics_data/Solid/letter_TW.png" alt="T">`;
            td.dataset.wordMult = 3;
                }
            }
            for (let i = 0; i < double_letter.length; i++) {
                if ((row == double_letter[i][0]) && (col == double_letter[i][1])) {
                    td.innerHTML = `<img class="board-tile" src="graphics_data/Solid/letter_DL.png" alt="D">`;
            td.dataset.letterMult = 2;
                }
            }
            for (let i = 0; i < tripple_letter.length; i++) {
                if ((row == tripple_letter[i][0]) && (col == tripple_letter[i][1])) {
                    td.innerHTML = `<img class="board-tile" src="graphics_data/Solid/letter_TL.png" alt="T">`;
            td.dataset.letterMult = 3;
                }
            }
            for (let i = 0; i < double_word.length; i++) {
                if ((row == double_word[i][0]) && (col == double_word[i][1])) {
                    td.innerHTML = `<img class="board-tile" src="graphics_data/Solid/letter_DW.png" alt="S">`;
            td.dataset.wordMult = 2;
                }
            }
            if ((row == 7) && (col == 7)) {
                td.innerHTML = `<img class="board-tile" src="graphics_data/Solid/letter_start.png" alt="_">`;
            }
            tr.appendChild(td);
        }
        boardBody.appendChild(tr);
    }
}