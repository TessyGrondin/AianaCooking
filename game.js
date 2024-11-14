const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

let phase = 0;
let time = 0;
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
        "Laisser mijoter jusqu'à ce que le plat soit prêt"
    ],
    image:new Image,
    icone:"rougailSaucisses.png"
}];





let functionArray = [selectPhase, recipePhase, ingredientPhase];
let clickOnPhase = [selectClick, recipeClick, ingredientClick];












let board = [];

let end = false;
let menu = true;

let assetsImage = new Image();
assetsImage.src = "assets.png"
let backgroundImage = new Image();
backgroundImage.src = "background.png"

let score = 0;

let nbPattern = 10;

let patternToShow = [-1, -1];

let x = (canvas.width - 32 * 6) / 2;
let y = (canvas.height - 32 * 6) / 2;

for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
        board.push({x:x, y:y, value:0, clicked:false, win:false});
        x += 32;
    }
    x = (canvas.width - 32 * 6) / 2;
    y += 32;
}

context.fillStyle = 'yellow';

function chosePattern() {
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

function choseWin() {
    for (let i = 0; i < recipes[selectedRecipe].ingredient.length; i++) {
        let rand = Math.floor(Math.random() * board.length);

        while (board[rand].win)
            rand = Math.floor(Math.random() * board.length);
        board[rand].win = true;
    }
}

function makeBoard() {

    board.forEach(function(tile) {
        tile.value = 0;
        tile.clicked = false;
        tile.win = false;
    });
    choseWin();
    //chosePattern();
    for (let i = 0; i < board.length; i++) {
        if (board[i].win)
            board[i].value = 3;
        else
            board[i].value = 8;
    }
}





function menuPhase() {
    context.drawImage(backgroundImage, 0, 0, 320, 480, 0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.font = "40px Arial";
    context.fillText("Tap to play", canvas.width / 2, canvas.height / 2);
}

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

function recipePhase() {
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "black";
    context.textAlign = "center";
    context.font = "30px Arial";
    context.fillText("Ingredients :", canvas.width / 2, 30);

    let nx = 20;
    let ny = 40;
    for (let i = 0; i < recipes[selectedRecipe].ingredient.length; i++) {
        context.drawImage(assetsImage, recipes[selectedRecipe].ingredient[i].index * 64, 0, 64, 64, nx, ny, 64, 64);
        nx += 68;
        if (nx >= canvas.width - 64) {
            nx = 20;
            ny += 68;
        }
    }
    ny += 15;
    context.textAlign = "left";
    context.font = "15px Arial";
    for (let i = 0; i < recipes[selectedRecipe].steps.length; i++, ny += 25)
        context.fillText("-" + recipes[selectedRecipe].steps[i], 5, ny);
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
        context.drawImage(assetsImage, 640, 0, 64, 64, tile.x, tile.y, 32, 32);
        context.drawImage(assetsImage, tile.value * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
        if (tile.clicked && tile.win)
            context.drawImage(assetsImage, 11 * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
        if (tile.clicked && !tile.win)
            context.drawImage(assetsImage, 12 * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
    });
    if (i == board.length)
        phase++;
    if (score < 0)
        score = 0;
    context.font = "30px Arial";
    context.fillText(score, canvas.width - (score.toString().length + 1) * 20, 40);
    context.fillText("Time : " + time, 10, 40);
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
    let nx = 0;
    let ny = 0;
    for (let i = 0; i < recipes.length; i++) {
        nx = (i % 2 == 0) ? 8 : 200;
        ny = (i % 2 == 0) ? 96 + 96 * i : 96 + 96 * (i - 1);
        if (relativeX > nx && relativeX < nx + 112 && relativeY > ny && relativeY < ny + 92) {
            selectedRecipe = i;
            phase++;
            return;
        }
    }
}

function recipeClick(relativeX, relativeY) {
    makeBoard();
    phase++;
}

function ingredientClick(relativeX, relativeY) {
    board.forEach(function(boardtile) {
        if (relativeX < boardtile.x || relativeX > boardtile.x + 32 || relativeY < boardtile.y || relativeY > boardtile.y + 32)
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






function increment() {
    if (phase >= 2)
        time++;
}

setInterval(increment, 1000);