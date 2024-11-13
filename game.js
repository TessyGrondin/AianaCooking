const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

let phase = 0;
let time = 60;
let selectedRecipe = -1;



let recipes = [{
    name:"Rougail Saucisse",
    ingredient:[
        {name:"Saucisses fumées", index:0},
        {name:"Petits piments", index:1},
        {name:"Tomates", index:2},
        {name:"Oignons", index:3},
        {name:"Gingembre", index:4},
        {name:"Sel", index:5},
        {name:"Poivre", index:6},
        {name:"Huile", index:7}
    ],
    steps:[
        "Faire bouillir les saucisses",
        "Chauffer l'huile dans une poêle",
        "Faire revenir les saucisses dans l'huile",
        "Ajouter les oignons et les faire revenir",
        "Assaisonner avec du sel",
        "Ajouter le poivre",
        "Incorporer le gingembre",
        "Ajouter les tomates coupées",
        "Laisser mijoter jusqu'à ce que le plat soit bien savoureux"
    ],
    image:new Image,
    icone:"rougailSaucisses.png"
}];





let functionArray = [selectPhase, recipePhase, ingredientPhase];
let clickOnPhase = [selectClick, recipeClick, ingredientClick];












let x4 = [{pos:7, win:false, value:0}, {pos:8, win:false, value:0}, {pos:9, win:false, value:0}, {pos:10, win:false, value:0}, {pos:13, win:false, value:0}, {pos:14, win:false, value:0}, {pos:15, win:false, value:0}, {pos:16, win:false, value:0}, {pos:19, win:false, value:0}, {pos:20, win:false, value:0}, {pos:21, win:false, value:0}, {pos:22, win:false, value:0}, {pos:25, win:false, value:0}, {pos:26, win:false, value:0}, {pos:27, win:false, value:0}, {pos:28, win:false, value:0}];
let x3 = [{pos:8, win:false, value:0}, {pos:9, win:false, value:0}, {pos:14, win:false, value:0}, {pos:15, win:false, value:0}, {pos:20, win:false, value:0}, {pos:21, win:false, value:0}, {pos:26, win:false, value:0}, {pos:27, win:false, value:0}];
let board = [];

let end = false;
let menu = true;

let assetsImage = new Image();
assetsImage.src = "assets.png"
let backgroundImage = new Image();
backgroundImage.src = "background.png"

let score = 0;

let nbPattern = 10;

let texts = ["touch all ", "don't touch "];
let patternToShow = [-1, -1];
let textChose = 0;

let x = (canvas.width - 32 * 6) / 2;
let y = (canvas.height - 32 * 6) / 2;

for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
        board.push({x:x, y:y, value:0, activ:true, clicked:false, win:false});
        x += 32;
    }
    x = (canvas.width - 32 * 6) / 2;
    y += 32;
}

context.fillStyle = 'yellow';

function chosePattern(length) {
    let p1 = Math.floor(Math.random() * nbPattern);
    let p2 = Math.floor(Math.random() * nbPattern);
    let p3 = Math.floor(Math.random() * nbPattern);
    let p4 = Math.floor(Math.random() * nbPattern);

    let div = Math.floor(Math.random() * 2);

    textChose = Math.floor(Math.random() * 2);
    patternToShow = [-1, -1];

    while (p2 == p1)
        p2 = Math.floor(Math.random() * nbPattern);
    while (p3 == p1 || p3 == p2)
        p3 = Math.floor(Math.random() * nbPattern);
    while (p4 == p1 || p4 == p2 || p4 == p3)
        p4 = Math.floor(Math.random() * nbPattern);
    if (length < x4.length) {
        x3.forEach(function(ref) {
            textChose = 0;
            patternToShow[0] = p1;
            if (ref.win)
                ref.value = p1;
            else
                ref.value = p2;
        });
    } else if (length < board.length) {
        if (div == 0) {
            if (textChose == 0)
                patternToShow[0] = p1;
            else
                patternToShow[0] = p2;
            x4.forEach(function(ref) {
                if (ref.win)
                    ref.value = p1;
                else
                    ref.value = p2;
            });
        } else {
            let nb = 7;
            if (textChose == 0)
                patternToShow[0] = p1;
            else {
                patternToShow[0] = p2;
                patternToShow[1] = p3;
            }
            x4.forEach(function(ref) {
                if (ref.win)
                    ref.value = p1;
                else {
                    let choice = Math.floor(Math.random() * 2);
                    if (choice == 0 && nb > 0) {
                        ref.value = p2;
                        nb--;
                    } else
                        ref.value = p3;
                }
            });
        }
    } else {
        let nb1 = 15;
        if (div == 0) {
            if (textChose == 0)
                patternToShow[0] = p1;
            else {
                patternToShow[0] = p2;
                patternToShow[1] = p3;
            }
            board.forEach(function(ref) {
                if (ref.win)
                    ref.value = p1;
                else {
                    let choice = Math.floor(Math.random() * 2);
                    if (choice == 0 && nb1 > 0) {
                        ref.value = p2;
                        nb1--;
                    } else
                        ref.value = p3;
                }
            });
        } else {
            let nb2 = 2;
            if (textChose == 0) {
                patternToShow[0] = p1;
                patternToShow[1] = p4;
            } else {
                patternToShow[0] = p2;
                patternToShow[1] = p3;
            }
            board.forEach(function(ref) {
                if (ref.win) {
                        let choice = Math.floor(Math.random() * 2);
                        if (choice == 0 && nb2 > 0) {
                            ref.value = p1;
                            nb2--;
                        } else
                            ref.value = p4;
                } else {
                        let choice = Math.floor(Math.random() * 2);
                        if (choice == 0 && nb1 > 0) {
                            ref.value = p2;
                            nb1--;
                        } else
                            ref.value = p3;
                }
            });
        }
    }
}

function choseWin(length) {
    let w1 = Math.floor(Math.random() * length);
    let w2 = Math.floor(Math.random() * length);
    let w3 = Math.floor(Math.random() * length);
    let w4 = Math.floor(Math.random() * length);
    let w5 = Math.floor(Math.random() * length);

    while (w2 == w1)
        w2 = Math.floor(Math.random() * length);
    while (w3 == w1 || w3 == w2)
        w3 = Math.floor(Math.random() * length);
    while (w4 == w1 || w4 == w2 || w4 == w3)
        w4 = Math.floor(Math.random() * length);
    while (w5 == w1 || w5 == w2 || w5 == w3 || w5 == w4)
        w5 = Math.floor(Math.random() * length);
    if (length < x4.length) {
        x3[w1].win = true;
        x3[w2].win = true;
    } else if (length < board.length) {
        x4[w1].win = true;
        x4[w2].win = true;
        x4[w3].win = true;
        x4[w4].win = true;
    } else {
        board[w1].win = true;
        board[w2].win = true;
        board[w3].win = true;
        board[w4].win = true;
        board[w5].win = true;
    }
}

function makeBoard() {
    let type = Math.floor(Math.random() * 3);

    x3.forEach(function(n) {
        n.win = false;
        n.value = 0;
    });
    x4.forEach(function(n) {
        n.win = false;
        n.value = 0;
    });
    board.forEach(function(tile){
        tile.activ = false;
        tile.value = 0;
        tile.clicked = false;
        tile.win = false;
    });
    if (type == 1) {
        choseWin(x4.length);
        chosePattern(x4.length);
        x4.forEach(function(n) {
            board[n.pos].activ = true;
            board[n.pos].win = n.win;
            board[n.pos].value = n.value;
        });
    } else if (type == 0) {
        choseWin(x3.length);
        chosePattern(x3.length);
        x3.forEach(function(n) {
            board[n.pos].activ = true;
            board[n.pos].win = n.win;
            board[n.pos].value = n.value;
        });
    } else {
        choseWin(board.length);
        chosePattern(board.length);
        board.forEach(function(tile){
            tile.activ = true;
        });
    }
}

makeBoard();


function selectPhase() {
    backgroundImage.src = "shelf.png"
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(backgroundImage, 0, 0, 320, 480, 0, 0, canvas.width, canvas.height);

    context.textAlign = "center";
    context.fillText("Choix du plat", canvas.width / 2, 60);

    for (let i = 0; i < recipes.length; i++) {
        recipes[i].image.src = recipes[i].icone;
        if (i % 2 == 0)
            context.drawImage(recipes[i].image, 0, 0, recipes[i].image.width, recipes[i].image.height, 8, 96 + 96 * i / 2, 112, 92);
        else
            context.drawImage(recipes[i].image, 0, 0, recipes[i].image.width, recipes[i].image.height, 200, 96 + 96 * (i - 1) / 2, 112, 92);
    }
}


function ingredientPhase() {
    backgroundImage.src = "background.png"
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(backgroundImage, 0, 0, 320, 480, 0, 0, canvas.width, canvas.height);

    context.textAlign = "left";
    let i = 0;
    board.forEach(function(tile) {
    if ((tile.clicked && tile.win) || !tile.win)
        i++;
    if (tile.activ) {
        context.drawImage(assetsImage, 640, 0, 64, 64, tile.x, tile.y, 32, 32);
        context.drawImage(assetsImage, tile.value * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
        if (tile.clicked && tile.win)
        context.drawImage(assetsImage, 11 * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
        if (tile.clicked && !tile.win)
        context.drawImage(assetsImage, 12 * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
    }
    });
    if (i == board.length) {
        score += 300;
        makeBoard();
    }
    if (score < 0)
        score = 0;
    context.font = "30px Arial";
    context.fillText(score, canvas.width - (score.toString().length + 1) * 20, 40);
    context.fillText("Time left : " + time, 10, 40)
    context.font = "20px Arial";
    context.fillText(texts[textChose], 80, 120);
    let px = 80 + (texts[textChose].toString().length + 1) * 7;
    if (textChose == 1)
        px = 180
    context.drawImage(assetsImage, patternToShow[0] * 64, 0, 64, 64, px, 95, 32, 32);
    if (patternToShow[1] != -1)
        context.drawImage(assetsImage, patternToShow[1] * 64, 0, 64, 64, px + 32, 95, 32, 32);
    if (time <= 0)
        phase = 2;
}

function decrement() {
    if (!end && !menu)
        time--;
}

setInterval(decrement, 1000);

function menuPhase() {
    context.drawImage(backgroundImage, 0, 0, 320, 480, 0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.font = "40px Arial";
    context.fillText("Tap to play", canvas.width / 2, canvas.height / 2);
}

function recipePhase() {
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "black";
    context.textAlign = "center";
    context.font = "30px Arial";
    context.fillText("Ingredients :", canvas.width / 2, 20);
}

function loop() {
    requestAnimationFrame(loop);
    if (menu) {
        menuPhase();
        return;
    }
    if (phase < functionArray.length)
        functionArray[phase]();
    else {
        context.clearRect(0,0,canvas.width,canvas.height);
        context.drawImage(backgroundImage, 0, 0, 320, 480, 0, 0, canvas.width, canvas.height);
        context.textAlign = "center";
        context.font = "40px Arial";
        context.fillText("broke the loop", canvas.width / 2, canvas.height / 2 - 40);
    }
}

requestAnimationFrame(loop);


function selectClick(relativeX, relativeY) {
    phase++;
}

function recipeClick(relativeX, relativeY) {
    phase++;
}

function ingredientClick(relativeX, relativeY) {
    board.forEach(function(boardtile) {
        if (!boardtile.activ || relativeX < boardtile.x || relativeX > boardtile.x + 32 || relativeY < boardtile.y || relativeY > boardtile.y + 32)
            return;
        if (!boardtile.clicked && boardtile.win)
            score += 100;
        else
            score -= 50;
        boardtile.clicked = true;
    });
}

document.addEventListener('click', function(e) {
    let relativeX = e.x - canvas.offsetLeft;
    let relativeY = e.y - canvas.offsetTop;

    if (menu) {
        menu = false;
        return;
    }

    clickOnPhase[phase](relativeX, relativeY);
});