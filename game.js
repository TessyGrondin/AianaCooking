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





let functionArray = [selectPhase, recipePhase, ingredientPhase, taskPhase];
let clickOnPhase = [selectClick, recipeClick, ingredientClick, taskClick];

let steps = [];
let selectedStep = -1;











let board = [];

let end = false;
let menu = true;

let assetsImage = new Image();
assetsImage.src = "assets.png"
let backgroundImage = new Image();
backgroundImage.src = "background.png"

let score = 0;

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

function popTab(tab, val) {
    let res = [];

    for (let i = 0; i < tab.length; i++)
        if (tab[i] != val)
            res.push(tab[i]);
    return res;
}

function chosePattern() {
    let pw = [];
    let pl = [];
    for (let i = 0; i < board.length; i++)
        pl.push(i);
    for (let i = 0; i < recipes[selectedRecipe].ingredient.length; i++) {
        pw.push(recipes[selectedRecipe].ingredient[i].index);
        pl = popTab(pl, recipes[selectedRecipe].ingredient[i].index);
    }

    for (let i = 0; i < board.length; i++) {
        if (board[i].win) {
            let rand = Math.floor(Math.random() * pw.length);
            board[i].value = pw[rand];
            pw = popTab(pw, pw[rand]);
        } else {
            let rand = Math.floor(Math.random() * pl.length);
            board[i].value = pl[rand];
            pl = popTab(pl, pl[rand]);
        }
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
    chosePattern();
}

function swap(id1, id2) {
    let strtmp = steps[id1].text;

    steps[id1].text = steps[id2].text;
    steps[id2].text = strtmp;
}

function shuffleTask() {
    for (let i = 0; i < recipes[selectedRecipe].steps.length; i++)
        steps.push({text:recipes[selectedRecipe].steps[i], color:"yellow"});
    for (let i = 0; i < steps.length * 3; i++) {
        let ran1 = Math.floor(Math.random() * steps.length);
        let ran2 = Math.floor(Math.random() * steps.length);
        swap(ran1, ran2);
    }
}





function menuPhase() {
    context.drawImage(backgroundImage, 0, 0, 320, 480, 0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.font = "40px Arial";
    context.fillText("Appuie pour jouer", canvas.width / 2, canvas.height / 2);
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
        context.drawImage(assetsImage, 36 * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
        context.drawImage(assetsImage, tile.value * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
        if (tile.clicked && tile.win)
            context.drawImage(assetsImage, 37 * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
        if (tile.clicked && !tile.win)
            context.drawImage(assetsImage, 38 * 64, 0, 64, 64, tile.x, tile.y, 32, 32);
    });
    if (i == board.length) {
        shuffleTask();
        phase++;
    }
    if (score < 0)
        score = 0;
    context.font = "30px Arial";
    context.fillText(score, canvas.width - (score.toString().length + 1) * 20, 40);
    context.fillText("Time : " + time, 10, 40);
}

function taskPhase() {
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(backgroundImage, 0, 0, 320, 480, 0, 0, canvas.width, canvas.height);

    let ny = 80;
    context.textAlign = "left";
    context.font = "15px Arial";
    for (let i = 0; i < steps.length; i++, ny += 25) {
        context.fillStyle = steps[i].color;
        context.fillText("-" + steps[i].text, 5, ny);
    }
    context.font = "30px Arial";
    context.fillText("Time : " + time, 10, 40);

    let count = 0;
    for (let i = 0; i < steps.length; i++)
        if (steps[i].text == recipes[selectedRecipe].steps[i])
            count++;
    if (count == steps.length) {
        end = true;
        phase++;
    }
}

function loop() {
    context.fillStyle = 'yellow';
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
        context.font = "30px Arial";
        context.fillText(recipes[selectedRecipe].name, canvas.width / 2, 50);
        context.drawImage(recipes[selectedRecipe].image, 0, 0, recipes[selectedRecipe].image.width, recipes[selectedRecipe].image.height, (canvas.width / 2) - (112 * 1.5 / 2), 80, 112 * 1.5, 92 * 1.5);
        context.fillText("en " + time + "s !", canvas.width / 2, 300);
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

function taskClick(relativeX, relativeY) {
    let ny = 80;

    for (let i = 0; i < steps.length; i++, ny += 25) {
        steps[i].color = 'yellow';
        if (relativeY >= ny - 10 && relativeY <= ny && selectedStep == -1) {
            steps[i].color = 'blue';
            selectedStep = i;
        } else if (relativeY >= ny - 10 && relativeY <= ny && selectedStep != -1) {
            steps[selectedStep].color = 'yellow';
            swap(selectedStep, i);
            selectedStep = -1;
        }
    }
}

document.addEventListener('click', function(e) {
    let relativeX = e.x - canvas.offsetLeft;
    let relativeY = e.y - canvas.offsetTop;

    if (menu) {
        menu = false;
        return;
    }

    if (end) {
        end = false;
        phase = 0;
        menu = true;
        selectedRecipe = -1;
        selectedStep = -1;
        return;
    }

    if (phase < clickOnPhase.length)
        clickOnPhase[phase](relativeX, relativeY);
});






function increment() {
    if (phase >= 2 && !end)
        time++;
}

setInterval(increment, 1000);