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
                image: "graphics_data/Scrabble_Tiles/Scrabble_Tile_" + piece.letter + ".jpg"
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
}

const bag = new TileBag(pieces);
var placeAnywhere = true;

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
            console.log(`${this.dataset.col}`);

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

}

function tallyScore(){
    sum = 0;
    $(".droppable").filter(function () {
        return $(this).data("hasTile");
    }).each(function () {
        const $square = $(this);
        sum = sum + $square.data.
        placedTiles.push({
            row: parseInt($square.data("row")),
            col: parseInt($square.data("col")),
            letter: $square.find("img").attr("alt")  // assuming your tile image's alt is the letter
        });
    });
}


function enableSurroundingTilesv1(centerRow, centerCol) {

    let placedTiles = [];

    $(".droppable").filter(function () {
        return $(this).data("hasTile");
    }).each(function () {
        const $square = $(this);
        placedTiles.push({
            row: parseInt($square.data("row")),
            col: parseInt($square.data("col")),
            letter: $square.find("img").attr("alt")  // assuming your tile image's alt is the letter
        });
    });

    console.log(placedTiles);
    // $(".droppable").each(function () {
    //     $(this).droppable("option", "disabled", true).addClass("droppable-disabled");
    // });

    $("droppable").filter(function () {
        return $(this).data("hasTile");
    }).each(function () {
        const $square = $(this);
        const row = parseInt($square.data("row"));
        const col = parseInt($square.data("col"));
        const neighbors = [
            [row - 1, col],
            [row + 1, col],
            [row, col - 1],
            [row, col + 1],
        ];
        neighbors.forEach(([nRow, nCol]) => {
            const selector = `.droppable[data-row='${nRow}'][data-col='${nCol}']`;
            const $neighbor = $(selector);
            $neighbor.droppable("option", "disabled", false).removeClass("droppable-disabled");
            // Only enable empty, unfilled squares
            // if ($neighbor.length && !$neighbor.data("hasTile")) {
            //     $neighbor.droppable("option", "disabled", false).removeClass("droppable-disabled");
            // }
        });

    });
    // $("data(has").each(function(){
    //     const $square = $(this);
    //     const row = parseInt($square.data("row"));
    //     const col = parseInt($square.data("col"));
    //     const rowDiff = Math.abs(row - centerRow);
    //     const colDiff = Math.abs(col - centerCol);
    //     const isSurrounding = ((rowDiff == 1 && colDiff == 0)||(rowDiff == 0 && colDiff == 1)) && !$square.data("hasTile");
    //     $(".droppable").each(function(){
    //         const $checkSquare = $(this);
    //         const checkRow = parseInt($square.data("row"));
    //         const checkCol = parseInt($square.data("col"));
    //         const checkrowDiff = Math.abs(row - centerRow);
    //         const checkcolDiff = Math.abs(col - centerCol);
    //         // if(rowDiff)
    //     });
    //     if(isSurrounding){
    //         $square.droppable("option", "disabled", false).removeClass("droppable-disabled");
    //     }
    //     else{
    //         $square.droppable("option", "disabled", true).addClass("droppable-disabled");
    //     }
    // })
}

function draggable(id) {
    $(id).draggable({
        start: function (event, ui) {
            ui.helper.data("wasDropped", false);
        },
        stop: function (event, ui) {
            if (ui.helper.data("wasDropped")) {
                $(this).find(".tile").hide();
            }
            $(this).css({
                top: 0,
                left: 0
            });

        }
    });
    $(id).find(".tile").html(makeTileImageHtml());
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
    const boardHeight = 1;
    const boardBody = document.getElementById("board");

    for (let row = 0; row < boardHeight; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < boardWidth; col++) {
            const td = document.createElement("td");
            td.classList.add("droppable")
            td.classList.add("board-space")
            td.dataset.row = row;
            td.dataset.col = col;
            td.innerHTML = "<p>Drop here</p>";
            tr.appendChild(td);
        }
        boardBody.appendChild(tr);
    }
}