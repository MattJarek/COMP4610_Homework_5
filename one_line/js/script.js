// File: script.js
// GUI Assignment: Scrabble
// Matthew Jarek, UMass Lowell Computer Science, matthew_jarek@student.uml.edu
// Updated by MJ on July 4, 2025 at 6:43 PM
//     Tile pieces and board squares, gotten and modified from kenny letter pack: https://kenney.nl/assets/letter-tiles
//     Trash can image from bootstrap image library: https://icons.getbootstrap.com/icons/trash/
//     Scrabble logo from the scabble website: https://playscrabble.com/

// Copy the pieces.json data ("creator":"Ramon Meza")
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

//New class to make the json data easier to work with and change
class TileBag {
    constructor(pieces) {
        //Go through each piece and add the values
        pieces.forEach(piece => {
            this[piece.letter] = {
                letter: piece.letter,
                value: piece.value,
                amount: piece.amount,
                image: "graphics_data/Solid/letter_" + piece.letter + ".png"
            };
        });
        //Make a variable to keep track of the overall score
        this._score = 0;
    }
    bagReset() {
        //Go through each piece and add the values
        pieces.forEach(piece => {
            this[piece.letter] = {
                letter: piece.letter,
                value: piece.value,
                amount: piece.amount,
                image: "graphics_data/Solid/letter_" + piece.letter + ".png"
            };
        });
        //Make a variable to keep track of the overall score
        this._score = 0;
    }
    get score() {
        return this, this._score;
    }

    set score(value) {
        this._score = value;
    }

    getTotalTiles() {
        //Returns the total number oof tiles left
        let total = 0;
        for (const key in this) {
            if (key != "_score") {
                total += this[key].amount;
            }
        }
        return total;
    }

    removeTile(letter) {
        //Takes a letter and removes 1 from the letters amount if possible
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
        //Gives the information for a random tile, removes the tile from the bag
        var num = Math.floor(Math.random() * (this.getTotalTiles())) + 1;
        for (const key in this) {
            num -= this[key].amount;
            if (num <= 0) {
                this.removeTile(key);
                return this[key];
            }
        }

    }
    getScoreValue(letter) {
        //Returns the score of a given letter
        var tile = this[letter];
        if (!tile) {
            console.log(`No such tile: ${letter}`);
            return null;
        }
        else {
            return tile.value;
        }
    }
}

let dictionary = [];

//Load the dictionary "words.txt", need to be an HTML to work
fetch("words.txt")
    .then(response => response.text())
    .then(text => {
        dictionary = text.split("\n").map(w => w.trim().toLowerCase());
        //get each word from the dictionary
        console.log("Dictionary loaded with", dictionary.length, "words.");
        //give an error if cant load the dictionary
    })
    .catch(err => console.error("Failed to load dictionary:", err));

//initialize the TileBag class
const bag = new TileBag(pieces);

$(function () {
    //make the board
    makeBoard();
    //if the submit button is clicked
    $(".submit").click(function () {
        //save the score to the bag, so it does not get reset
        bag.score = tallyScore(bag.score);
        //check the word and save the score
        submit();
    });
    //if the reset button is clicked
    $(".reset").click(function () {
        //reset
        reset();
    });
    //if the restart button is clicked
    $('.restart').click(function () {
        restart();
    });
    //make the trash block
    $(".droppable-trash").droppable({
        disabled: false,
        drop: function (event, ui) {
            const $droppable = $(this);
            const $draggable = ui.helper;
            $draggable.data("wasDropped", true);
            $droppable.data("hasTile", true);
        }
    });
    //make all of the draggable tiles
    draggable("#one");
    draggable("#two");
    draggable("#three");
    draggable("#four");
    draggable("#five");
    draggable("#six");
    draggable("#seven");
});

function makeBoard() {
    //Set the board size, height = 1 for top line, = 2 for second line ect.
    const boardWidth = 15;
    const boardHeight = 2;
    const boardBody = $('#board');
    //Manually set the 'special' space locations
    const tripple_word = [
        [0, 0],
        [0, 7],
        [0, 14],
        [7, 0],
        [7, 14],
        [14, 0],
        [14, 7],
        [14, 14]
    ];
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
    ];
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
    ];
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
    ];
    //Go through each space to make a table
    for (let row = 0; row < boardHeight; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < boardWidth; col++) {
            const td = document.createElement("td");
            //make the element droppable, and keep track of the col and row for later
            td.classList.add("droppable");
            td.dataset.row = row;
            td.dataset.col = col;
            //also keep track of the multipliers and if a tile piece is on the space
            td.dataset.wordMult = 1;
            td.dataset.letterMult = 1;
            td.dataset.hasTile = false;
            //depending on the board square, load the correct image and modify the multipliers
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
            //add to the list
            tr.appendChild(td);
        }
        //make the table the board
        boardBody.html(tr);
    }
    //enable the droppable class to be droppable
    $(".droppable").droppable({
        //set it to be enabled
        disabled: false,
        drop: function (event, ui) {
            //get the droppable object and the draggable that is on the droppable
            const $droppable = $(this);
            const $draggable = ui.helper;
            //update draggable so we know which one was dropped
            $draggable.data("wasDropped", true);
            //make the droppable image a duplicate of the draggable, this is to 'cheat' perfectly aligning the tile
            $droppable.html($draggable.html());
            //upadate so we know there is a tile on this square
            $droppable.data("hasTile", true);
            //keep track of the letter on the tile
            letter = $draggable.find(".tile").attr("alt");
            $droppable.data("letter", letter);
            //get the row and column
            blockCol = parseInt(this.dataset.col);
            blockRow = parseInt(this.dataset.row);
            //figure out which droppables can remain active
            enableSurroundingTiles(blockRow, blockCol);
            //get the score/word and update the html
            nScore = (tallyScore(bag.score));
            $('.score').text(`Score: ${nScore}`);
            $('.word').text(`Word: ${getWord()}`);
        }
    });
}

function enableSurroundingTiles(centerRow, centerCol) {
    //Disable all droppables
    $(".droppable").each(function () {
        $(this).droppable("option", "disabled", true).addClass("droppable-disabled");
    });
    //Go through each droppable that has a tile 
    $(".droppable").filter(function () {
        return $(this).data("hasTile");
    }).each(function () {
        //Get the object along with the current row and column
        const $square = $(this);
        const row = parseInt($square.data("row"));
        const col = parseInt($square.data("col"));
        const neighbors = [
        ];
        //logic, if there is a tile to the left or right, we can only add pieces horizontally
        horizontal = $(`.droppable[data-row='${row}'][data-col='${col - 1}']`).data("hasTile");
        horizontal = $(`.droppable[data-row='${row}'][data-col='${col + 1}']`).data("hasTile") || horizontal;
        //if there is a tile to above or below, we can only add pieces vertically
        vertical = $(`.droppable[data-row='${row - 1}'][data-col='${col}']`).data("hasTile");
        vertical = $(`.droppable[data-row='${row + 1}'][data-col='${col}']`).data("hasTile") || vertical;
        //If there is a word vertically and horizontally something has gone wrong, reset
        if (horizontal && vertical) {
            reset();
        }
        else {
            //If there is no word horizontally we can place vertically
            if (!horizontal) {
                neighbors.push([row - 1, col]);
                neighbors.push([row + 1, col]);
            }
            //viceversa
            if (!vertical) {
                neighbors.push([row, col - 1]);
                neighbors.push([row, col + 1]);
            }
        }
        //enable all neighbor pieces, excluding those with tiles to be droppable again
        neighbors.forEach(([nRow, nCol]) => {
            const selector = `.droppable[data-row='${nRow}'][data-col='${nCol}']`;
            const $neighbor = $(selector);
            if (!$neighbor.data("hasTile")) {
                $neighbor.droppable("option", "disabled", false).removeClass("droppable-disabled");
            }
        });
    });
}

function tallyScore(score = 0) {
     //calculates the current score
    let placedTiles = [];
    let wordMult = 1;
    let sum = score;
    let numLetters = 0;
    //Go through each droppable with a tile
    $(".droppable").filter(function () {
        return $(this).data("hasTile");
    }).each(function () {
        //get the letter value and apply letter multipliers, save the total word multiplier
        const $square = $(this);
        placedTiles.push($square.find("img").attr("alt"))
        sum += bag.getScoreValue($square.find("img").attr("alt")) * $square.data("letterMult");
        wordMult *= $square.data("wordMult");
        numLetters += 1;
    });
    //apply the word multiplier and return the calculated score
    if (numLetters == 7) {
        numLetters = 50;
    }
    else {
        numLetters = 0;
    }
    return ((sum * wordMult) + numLetters);
}

function draggable(id) {
    //make sure the piece is not disabled
    $(id).draggable({
        start: function (event, ui) {
            ui.helper.data("wasDropped", false);
        },
        stop: function (event, ui) {
            //when dropped change the image to appear as though it is no longer there and disable dragging
            if (ui.helper.data("wasDropped")) {
                $(this).find(".tile").attr("src", "graphics_data/Solid/black_square.png");
                $(this).draggable("option", "disabled", true);
            }
            //reset the position
            $(this).css({
                top: 0,
                left: 0
            });

        }
    });
    //Make the draggable piece have a tile image
    image = $(id).find(".tile");
    tile = bag.drawTile();
    image.attr("src", tile.image);
    image.attr("alt", tile.letter);
    image.addClass("tile-piece")
}

function getWord() {
    //get the word made
    let word = ''
    $(".droppable").filter(function () {
        return $(this).data("hasTile");
    }).each(function () {
        word += $(this).data("letter")
    });
    return word;
}

function submit() {
    //get the word made
    let word = getWord();
    //if it is not valid reset the board and display an error message
    if (!isWordValid(word)) {
        reset()
        //Unique error message if a blank tile is played
        if (word.includes('_')) {
            $(".error").text(`${word} can not be made a word!`)
        }
        else {
            $(".error").text(`${word} is not a word!`)
        }
    }
    //if it is a valid word replace all played tiles (draggable disabled) with new letters
    else {
        // clear the error
        $(".error").text(``)
        makeBoard();
        $(".draggable").filter(function () {
            return $(this).draggable("option", "disabled");
        }).each(function () {
            $square = $(this)
            $square.draggable("option", "disabled", false);
            id = $square.attr('id');
            draggable(`#${id}`);
        });
    }
}

function reset() {
    // clear the error
    $(".error").text(``)
    //clear the board
    makeBoard();
    //go through each piece that was dragged and restore it
    $(".draggable").each(function () {
        $square = $(this);
        if ($square.draggable("option", "disabled")) {
            $square.draggable("option", "disabled", false);
            id = $square.attr('id');
            id = `#${id}`;
            image = $(id).find(".tile");
            letter = image.attr("alt")
            image.attr("src", `graphics_data/Solid/letter_${letter}.png`);
        }
    });
}

function restart() {
    // clear the error
    $(".error").text(``)
    //clear the board
    makeBoard();
    //reset the bag
    bag.bagReset();
    //get new pieces
    draggable("#one");
    draggable("#two");
    draggable("#three");
    draggable("#four");
    draggable("#five");
    draggable("#six");
    draggable("#seven");
    //make the score 0
    $(".score").text(`Score: 0`)
    $(".word").text(`Word: `)
}

function isWordValid(word) {
    //make sure the dictionary is loaded, if not allow any word, this is so that it works from "file://...."
    let isValid = false;
    if (!dictionary.length) {
        return true;
    }
    //If there is an '_' go through every posible combination
    if (word.includes('_',)) {
        let parts = word.split('_');
        let front = parts[0];
        let back = ''
        for (let i = 1; i < parts.length; i++) {
            if (i != 1) {
                back += "_";
            }
            back += parts[i];
        }
        for (let i = 65; i <= 90; i++) {
            // 65 is the ASCII (or UTF-16) code for 'A'
            // 90 is the ASCII (or UTF-16) code for 'Z'
            let nWord = front + String.fromCharCode(i) + back;
            isValid = isWordValid(nWord) && isValid;
            if (isValid) {
                return isValid
            }
        }
        return isValid
    }
    //if not retun if the word is in the dictionary
    console.log(dictionary.includes(word.toLowerCase())); 
    return dictionary.includes(word.toLowerCase());
}
