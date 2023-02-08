import collisionChecker from "./collisionChecker.js";
import controller from "./controller.js";

class GameObject {
    constructor(top, left, width, height, id, color, type, breakable, botSpeed) {
        this.initialTop = top;
        this.initialLeft = left;
        this.type = type;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        if (type == "solid" || type == "bot") {
            this.width = width - 2.5;
            this.height = height - 2.5;
        }

        if (type == "bot") {
            this.canHit = true;
            this.speed = botSpeed;
            this.image = "tank";
        }


        this.DOMElement = document.createElement("div");
        this.DOMElement.setAttribute("id", id);
        this.DOMElement.style.position = 'absolute';
        this.DOMElement.style.top = top + 'px';
        this.DOMElement.style.left = left + 'px';
        this.DOMElement.style.width = (width) + 'px';
        this.DOMElement.style.height = (height) + 'px';

        if (type != "bot" && type != "player") {
            this.DOMElement.style.background = color;
        }

        if (breakable == true) {
            this.DOMElement.addEventListener("click", removeBlock);
        }

        this.bottom = top + height;
        this.right = left + width;

        gameContainerElement.appendChild(this.DOMElement);

        if (type != "player" && type != "pointer") {
            gameObjects.push(this);
        }

        if (type == "player") {
            this.health = 3;

            this.reduceHealth = () => {
                this.health--;

                healthSpanElement.textContent = this.health;

                if (this.health == 0) {
                    resetGame();
                }
            }

            healthSpanElement.textContent = 3;
        }

        if (type == "player") {
            this.image = "tank";
        } else if (type == "bot") {
            this.image = "enemy";
        }
        if (type == "player") {
            this.DOMElement.innerHTML = `<img class='image-texture' src='src/tankUp.png'> <div style="position: absolute; left:30%; top:45%; width:70%; height: 8%; background: black;"></div>`;
        }

        if (type == "bot") {
            this.DOMElement.innerHTML = `<img class='image-texture' src='src/enemyUp1.png'>`;
        }

        if (type == "solid" || type == "bot") {
            solidBlocks.push(this);
        }
    }
}

let levels = [firstLevel, secondLevel];

let newGameButton = document.querySelector("BUTTON");
newGameButton.addEventListener("click", () => {
    currentLevel = 0;
    resetGame();
});

let currentLevel = 0;

let pointerBlock;

let keys;

let gameObjects;

let isAudioPlaying;

const gameContainerElement = document.getElementById("game-container");
const modeLabelElement = document.getElementById("mode-label");
const healthSpanElement = document.getElementById("health-span");
const punchAudioElement = document.getElementById("punch-audio");
const shootingAudioElement = document.getElementById("shooting-audio");
const tankMovingAudioElement = document.getElementById("tank-moving-audio");
const winGameDivElement = document.getElementById("win-game-div");
const nextLevelButtonElement = document.getElementById("next-level-button");

nextLevelButtonElement.addEventListener("click", () => {
    currentLevel++;
    resetGame();
})

let solidBlocks;

let playerTop;
let playerLeft;
let player;
let block;
let speed;

let frame;

let isGameActive = false;

let horizontalMovement;
let verticalMovement;

function startGame(event) {
    if (event) {
        event.preventDefault();
    }

    winGameDivElement.style.display = "none";

    pointerBlock;
    keys = {
        leftPressed: false,
        rightPressed: false,
        upPressed: false,
        downPressed: false,
        buildMode: false,
        breakMode: false,
        shootingMode: true,
        placeBots: false,
    }

    isAudioPlaying = false;
    gameObjects = [];
    solidBlocks = [];
    playerTop = window.innerHeight / 2.7 + (10 - window.innerHeight / 2.7 % 10);
    playerLeft = window.innerWidth / 2.3 + (10 - window.innerWidth / 2.3 % 10);
    player = new GameObject(playerTop, playerLeft, 97.5, 97.5, "player", "blue", "player");
    speed = 2.5;
    horizontalMovement = 0;
    verticalMovement = 0;
    frame = 1;

    isGameActive = true;

    modeLabelElement.textContent = "Shooting mode";

    levels[currentLevel]();

    window.addEventListener("mousemove", mouseHandler);
    window.addEventListener("click", mouseHandler);

    controller(keys);
}

window.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    let labelElement = document.getElementById("mode-label");
    let pointer = document.getElementById("pointer");

    if (keys.placeBots) {
        labelElement.textContent = "Build mode (blocks)";

        keys.shootingMode = false;
        keys.placeBots = false;
        keys.breakMode = false;
        keys.buildMode = true;


    } else if (keys.buildMode) {
        if (keys.buildMode == true) {
            labelElement.textContent = "Break mode";
        }

        keys.shootingMode = false;
        keys.placeBots = false;
        keys.breakMode = true;
        keys.buildMode = false;

        if (pointer) {
            pointer.remove();
        }
    } else if (keys.breakMode) {
        if (pointer) {
            pointer.remove();
        }

        keys.shootingMode = true;
        keys.placeBots = false;
        keys.breakMode = false;
        keys.buildMode = false;

        labelElement.textContent = "Shooting mode";
    } else if (keys.shootingMode) {
        if (pointer) {
            pointer.remove();
        }

        keys.shootingMode = false;
        keys.placeBots = true;
        keys.breakMode = false;
        keys.buildMode = false;

        labelElement.textContent = "Build mode (bots)";
    }
});

startGame();

function resetGame() {
    gameObjects.forEach(x => x.DOMElement.remove());
    solidBlocks.forEach(x => x.DOMElement.remove());

    gameObjects = [];
    solidBlocks = [];


    player.DOMElement.remove();


    startGame();
}

function firstLevel() {
    for (let i = 0; i < 3500; i += 100) {
        new GameObject(i, -100, 100, 100, gameObjects.length, "cyan", "solid", false);
    }

    for (let i = 0; i < 3500; i += 100) {
        new GameObject(i, 3100, 100, 100, gameObjects.length, "cyan", "solid", false);
    }

    for (let i = 0; i < 3100; i += 100) {
        new GameObject(3400, i, 100, 100, gameObjects.length, "cyan", "solid", false);
    }

    for (let i = 0; i < 3100; i += 100) {
        new GameObject(0, i, 100, 100, gameObjects.length, "cyan", "solid", false);
    }


    for (let i = 0; i < 1000; i += 100) {
        new GameObject(500, i, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = 500; i < 1500; i += 100) {
        new GameObject(i, 0, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = 500; i < 1500; i += 100) {
        new GameObject(i, 1000, 100, 100, gameObjects.length, "red", "solid", true);
    }


    for (let i = 100; i < 1000; i += 500) {
        new GameObject(700 + i / 5, i, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);
    }


    for (let i = 2000; i < 3000; i += 100) {
        new GameObject(500, i, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = 500; i < 1500; i += 100) {
        new GameObject(i, 2000, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = 500; i < 1500; i += 100) {
        new GameObject(i, 3000, 100, 100, gameObjects.length, "red", "solid", true);
    }


    for (let i = 2300; i < 3000; i += 500) {
        new GameObject(700, i, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);
    }


    let height = 3000;
    let width = 1000;

    for (let i = width - 1000; i < width; i += 100) {
        new GameObject(height - 1000, i, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = height - 1000; i < height; i += 100) {
        new GameObject(i, width - 1000, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = height - 1000; i < height; i += 100) {
        new GameObject(i, width, 100, 100, gameObjects.length, "red", "solid", true);
    }


    for (let i = width - 900; i < width; i += 500) {
        new GameObject(2200, i, 100, 100, gameObjects.length, "yellow", "bot", false, 2.5);
    }

    height = 3000;
    width = 3000;

    for (let i = width - 1000; i < width; i += 100) {
        new GameObject(height - 1000, i, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = height - 1000; i < height; i += 100) {
        new GameObject(i, width - 1000, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = height - 1000; i < height; i += 100) {
        new GameObject(i, width, 100, 100, gameObjects.length, "red", "solid", true);
    }


    for (let i = width - 900; i < width; i += 500) {
        new GameObject(2200, i, 100, 100, gameObjects.length, "yellow", "bot", false, 2.5);
    }

    new GameObject(1000, 1500, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);
    new GameObject(500, 1500, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);
    new GameObject(1500, 1700, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);
    new GameObject(2000, 1300, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);

    new GameObject(3000, 1500, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);
    new GameObject(2500, 1500, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);
    new GameObject(3200, 1700, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);
    new GameObject(3200, 1300, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);

}

function secondLevel() {
    for (let i = 100; i < 700; i += 100) {
        new GameObject(i, 200, 100, 100, gameObjects.length, "cyan", "solid", false);
    }

    for (let i = 100; i < 700; i += 100) {
        new GameObject(i, 3000, 100, 100, gameObjects.length, "cyan", "solid", false);
    }

    for (let i = 200; i < 3000; i += 100) {
        new GameObject(100, i, 100, 100, gameObjects.length, "cyan", "solid", false);
    }

    for (let i = 200; i < 3000; i += 100) {
        new GameObject(600, i, 100, 100, gameObjects.length, "cyan", "solid", false);
    }

    for (let i = 200; i < 600; i += 100) {
        new GameObject(i, 1000, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = 200; i < 600; i += 100) {
        new GameObject(i, 1500, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = 200; i < 600; i += 100) {
        new GameObject(i, 2000, 100, 100, gameObjects.length, "red", "solid", true);
    }

    for (let i = 200; i < 600; i += 100) {
        new GameObject(i, 2500, 100, 100, gameObjects.length, "red", "solid", true);
    }

    new GameObject(300, 1300, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);

    new GameObject(300, 1900, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);

    new GameObject(300, 2200, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);

    new GameObject(300, 2700, 100, 100, gameObjects.length, "yellow", "bot", false, 1.25);
}

async function mouseHandler(event) {
    event.preventDefault();

    let pageY = event.pageY;
    let pageX = event.pageX;

    let correctedYPixels = pageY % 100;
    let correctedXPixels = pageX % 100;
    let y;
    let x;


    let initialLeft = Number(player.initialLeft) + 50;
    let initialTop = Number(player.initialTop) + 50;

    let left = pageX - initialLeft;
    let top = pageY - initialTop;

    let coefficient = 10 / (Math.abs(left) + Math.abs(top));

    let horizontalSpeed = left * coefficient;
    let verticalSpeed = top * coefficient;

    let dimunitive = (360 - Math.abs(horizontalSpeed * 36)) / 4;

    let minuend;

    let result;

    let quadrant;

    let cannon = player.DOMElement.children[1];

    if (horizontalSpeed > 0 && verticalSpeed < 0) {
        minuend = 0;
        quadrant = 1;
        player.DOMElement.children[1].style.transform = `rotate(${minuend - Math.abs(dimunitive)}deg)`;

        cannon.style.top = `${35 + (verticalSpeed)}%`;
        cannon.style.left = `${25 + horizontalSpeed}%`;

        //result = 360 + dimunitive;
    } else if (horizontalSpeed > 0 && verticalSpeed > 0) {
        quadrant = 2;
        minuend = 180;
        player.DOMElement.children[1].style.transform = `rotate(${minuend + Math.abs(dimunitive)}deg)`;

        cannon.style.top = `${45 + verticalSpeed}%`;
        cannon.style.left = `${25 + horizontalSpeed}%`;
    } else if (horizontalSpeed < 0 && verticalSpeed < 0) {
        quadrant = 3;
        minuend = 180;
        player.DOMElement.children[1].style.transform = `rotate(${minuend + Math.abs(dimunitive)}deg)`;
        cannon.style.top = `${35 + verticalSpeed}%`;
        cannon.style.left = `${10 + horizontalSpeed}%`;
    } else {
        quadrant = 4;
        minuend = 360;
        player.DOMElement.children[1].style.transform = `rotate(${minuend - Math.abs(dimunitive)}deg)`;
        cannon.style.top = `${45 + verticalSpeed}%`;
        cannon.style.left = `${20 + horizontalSpeed}%`;
    }

    //player.DOMElement.children[1].style.transform = `rotate(${minuend - Math.abs(dimunitive)}deg)`;

    //console.log(horizontalSpeed, verticalSpeed, dimunitive);
    //console.log(minuend, dimunitive);
    //
    //console.log("quadrant", quadrant);
    //
    y = pageY - (correctedYPixels) - (100 - solidBlocks[0].top % 100);
    x = pageX - (correctedXPixels) - (100 - solidBlocks[0].left % 100);

    if (pointerBlock) {
        pointerBlock.DOMElement.remove();
    }

    if (keys.shootingMode == true) {
        if (event.type == "click") {
            //console.log("CLICK");
            shoot(event);
        }
    } else if (keys.buildMode == true) {
        //console.log(event.type);
        //console.log(event.screenX);
        //console.log(`$Page Top ${pageY} Left ${pageX}`);
        //y = pageY - (correctedYPixels) + (solidBlocks[0].top % 100);
        //x = pageX - (correctedXPixels) + (solidBlocks[0].left % 100);


        //if (correctedYPixels < 50) {
        //    y = pageY - (correctedYPixels) - (100 - solidBlocks[0].top % 100);
        //} else {
        //    y = pageY - (correctedYPixels) + (solidBlocks[0].top % 100);
        //}
        //
        //if (correctedXPixels < 50) {
        //    x = pageX - (correctedXPixels) - (100 - solidBlocks[0].left % 100);
        //} else {
        //    x = pageX - (correctedXPixels) + (solidBlocks[0].left % 100);
        //}
        //console.log(`$Final Top ${y} Left ${x}`);
        //console.log(x);
        //console.log(y);

        if (event.type == "mousemove") {
            pointerBlock = new GameObject(y, x, 100, 100, "pointer", "#ff484a", "pointer");
        } else if (event.type == "click") {
            //console.log(`Block top: ${y} Player top: ${player.top}`);
            //console.log(`Block left: ${x} Player left: ${player.left}`);
            //console.log(Math.abs(y - player.top));
            //console.log(Math.abs(x - player.left));
            if (Math.abs(y - player.top) <= 100 && Math.abs(x - player.left) < 100) {
                return;
            }

            if (!gameObjects.filter(x => x.type == "solid" || x.type == "bot").find(b => {
                if (b.type == "solid") {
                    return b.left == x && b.top == y
                } else {
                    return gameObjects.filter(x => x.type == "solid" || x.type == "bot").find(obj => {
                        let horizontalDif = obj.left - x;
                        let verticalDif = obj.top - y;

                        //console.log("dif");
                        //console.log(horizontalDif, verticalDif);

                        return (horizontalDif < 100 && horizontalDif > -100 && verticalDif < 100 && verticalDif > -100);
                    })
                }
            })) {
                let newGameObject;

                if (keys.placeBots == true) {
                    newGameObject = new GameObject(y, x, 97.5, 97.5, `b${solidBlocks.length}`, "yellow", "bot");
                } else {
                    newGameObject = new GameObject(y, x, 100, 100, `b${solidBlocks.length}`, "red", "solid", true);

                }
            }

        }
    }
}

function removeBlock(event) {
    event.preventDefault();

    if (keys.buildMode == false && keys.shootingMode == false) {
        removeGameObject(event.currentTarget, true);
    }
}

function activateFrameHandler() {
    let id = null;

    clearInterval(id);

    id = setInterval(frameHandler, 1);

    function frameHandler() {
        frame++;

        if (isGameActive) {
            if (!gameObjects.find(x => x.type == "bot")) {
                winGame();
            }

            checkKeys();

            renderVisibleObjects();

            botsBehaviourHandler();

        }
    }
}

function winGame() {
    console.log("you win");
    isGameActive = false;
    winGameDivElement.style.display = "inline";
}

function checkKeys() {
    let horizontalChange = 0;
    let verticalChange = 0;

    let entered = false;

    if (keys.upPressed) {
        verticalChange = -speed;

        if (isAudioPlaying == false) {
            tankMovingAudioElement.play();
        }

        entered = true;
    }
    if (keys.downPressed) {
        verticalChange = speed;

        if (isAudioPlaying == false) {
            tankMovingAudioElement.play();
        }

        entered = true;
    }
    if (keys.leftPressed) {
        horizontalChange = -speed;

        if (isAudioPlaying == false) {
            tankMovingAudioElement.play();
        }

        entered = true;

    }
    if (keys.rightPressed) {
        horizontalChange = speed;

        if (isAudioPlaying == false) {
            tankMovingAudioElement.play();
        }

        entered = true;
    }

    if (entered == false) {
        tankMovingAudioElement.pause();
    }

    moveObject(verticalChange, horizontalChange, player);

    if (collisionChecker(player, solidBlocks)) {
        moveObject(-verticalChange, -horizontalChange, player);
    }
}

function renderVisibleObjects() {
    gameObjects.forEach(block => {
        if (block.right < 0 || block.bottom < 0 || block.left > window.innerWidth || block.top > window.innerHeight) {
            block.DOMElement.remove();
        } else if (!block.DOMElement.parentNode) {
            gameContainerElement.appendChild(block.DOMElement);
        }
    });
}

function botsBehaviourHandler() {
    let bots = gameObjects.filter(x => x.type == "bot");
    bots.forEach(bot => {

        let x = bot.left;
        let y = bot.top;

        let initialLeft = Number(player.initialLeft) + 50;
        let initialTop = Number(player.initialTop) + 50;

        let left = x - initialLeft;
        let top = y - initialTop;

        let coefficient = 1.25 / (Math.abs(left) + Math.abs(top));

        let horizontalSpeed = left * coefficient;
        let verticalSpeed = top * coefficient;

        let imaginaryLineLeft = initialLeft;
        let imaginaryLineTop = initialTop;

        let result = true;

        //console.log(bot.left, bot.top);



        //if (solidBlocks.find(block => Math.abs(bot.left - block.left) <= 200 && Math.abs(bot.top - block.top) <= 200)) {
        //    moveObject(-1, finalHorizontalSpeed, bot);
        //    result = false;
        //}

        let horizontalDif = player.initialLeft - bot.left;
        let verticalDif = player.initialTop - bot.top;

        let finalHorizontalSpeed = horizontalDif / Math.abs(horizontalDif) * bot.speed || 0;
        let finalVerticalSpeed = verticalDif / Math.abs(verticalDif) * bot.speed || 0;

        if (horizontalDif <= 100 && horizontalDif >= -100 && verticalDif <= 100 && verticalDif >= -100 && bot.canHit == true) {
            console.log("hit");
            botHitsPlayer(bot);

            bot.canHit = false;

            setTimeout(() => bot.canHit = true, 2000);
        }

        //console.log(finalHorizontalSpeed, finalVerticalSpeed);

        if (result == true) {
            moveObject(finalVerticalSpeed, finalHorizontalSpeed, bot);
        }
    })
}
activateFrameHandler();

function botHitsPlayer(bot) {
    if (bot.canHit == true) {
        let audioElement = document.createElement("audio");
        audioElement.setAttribute("src", "src/punchAudio.mp3");

        audioElement.play();

        player.reduceHealth();

        bot.canHit = false;

        setTimeout(() => bot.canHit = true, 2000);
    }
}

function shoot(event) {
    let id = null;
    clearInterval(id);

    let x = event.pageX;
    let y = event.pageY;

    let initialLeft = Number(player.initialLeft) + 50;
    let initialTop = Number(player.initialTop) + 50;

    let left = x - initialLeft;
    let top = y - initialTop;

    let coefficient = 10 / (Math.abs(left) + Math.abs(top));

    let horizontalSpeed = left * coefficient;
    let verticalSpeed = top * coefficient;

    console.log(horizontalSpeed, verticalSpeed);

    id = setInterval(moveBullet, 1)

    let audioElement = document.createElement("audio");
    audioElement.setAttribute("src", "src/shootingAudio.mp3");

    audioElement.play();

    let bullet = new GameObject(initialTop, initialLeft, 10, 10, "bullet", "black", "bullet");
    function moveBullet() {
        gameObjects.forEach(b => {
            if (b.left <= bullet.left + bullet.width && b.left + b.width >= bullet.left
                && b.top <= bullet.top + bullet.height && b.top + b.height >= bullet.top) {
                if (b.type == "solid" || b.type == "bot") {
                    clearInterval(id);
                    removeGameObject(bullet.DOMElement);

                    if (b.type == "bot") {
                        removeGameObject(b.DOMElement, true);
                    }
                }
            }
        })

        bullet.left += horizontalSpeed;
        bullet.top += verticalSpeed;
        bullet.DOMElement.style.left = bullet.left + "px";
        bullet.DOMElement.style.top = bullet.top + "px";
    }
}

function moveObject(topChange, leftChange, gameObject) {
    changeTexture(topChange, leftChange, gameObject);

    if (gameObject.type == "bot") {
        if (!collisionChecker(gameObject, solidBlocks) && !isNaN(topChange) && !isNaN(leftChange)) {
            gameObject.top += topChange;
            gameObject.left += leftChange;
            gameObject.DOMElement.style.top = `${gameObject.top}px`;
            gameObject.DOMElement.style.left = `${gameObject.left}px`;
        }
        if (collisionChecker(gameObject, solidBlocks)) {
            moveObjectBack(topChange, leftChange, gameObject);
        }

        if (collisionChecker(gameObject, [player])) {
            moveObjectBack(topChange, leftChange, gameObject);
        }

    } else {
        gameObjects.forEach(gameObject => {
            moveObjectBack(topChange, leftChange, gameObject);
        })
    }
    //gameObject.top += topChange;
    //gameObject.left += leftChange;
    //gameObject.DOMElement.style.top = `${gameObject.top}px`;
    //gameObject.DOMElement.style.left = `${gameObject.left}px`;

}

function moveObjectBack(topChange, leftChange, gameObject) {
    gameObject.top -= topChange;
    gameObject.left -= leftChange;
    gameObject.DOMElement.style.top = `${gameObject.top}px`;
    gameObject.DOMElement.style.left = `${gameObject.left}px`;
}

function changeTexture(topChange, leftChange, gameObject) {
    let textureFrame = "";

    if (gameObject.type == "bot") {
        textureFrame = frame % 2 + 1;
    }

    if (topChange == 0 || leftChange == 0) {
        gameObject.DOMElement.style.width = "25%";
        gameObject.DOMElement.style.height = "25%";


        if (topChange < 0) {
            gameObject.DOMElement.children[0].setAttribute("src", `src/${gameObject.image}Up${textureFrame}.png`);
        } else if (topChange > 0) {
            gameObject.DOMElement.children[0].setAttribute("src", `src/${gameObject.image}Down${textureFrame}.png`);
        } else if (leftChange < 0) {
            gameObject.DOMElement.children[0].setAttribute("src", `src/${gameObject.image}Left${textureFrame}.png`);
        } else if (leftChange > 0) {
            gameObject.DOMElement.children[0].setAttribute("src", `src/${gameObject.image}Right${textureFrame}.png`);
        }
    } else if (topChange != 0 && leftChange != 0) {
        gameObject.DOMElement.style.width = "33%";
        gameObject.DOMElement.style.height = "33%";

        if (topChange < 0 && leftChange < 0) {
            gameObject.DOMElement.children[0].setAttribute("src", `src/${gameObject.image}UpLeft${textureFrame}.png`);
        } else if (topChange > 0 && leftChange > 0) {
            gameObject.DOMElement.children[0].setAttribute("src", `src/${gameObject.image}DownRight${textureFrame}.png`);
        } else if (topChange < 0 && leftChange > 0) {
            gameObject.DOMElement.children[0].setAttribute("src", `src/${gameObject.image}UpRight${textureFrame}.png`);
        } else if (topChange > 0 && leftChange < 0) {
            gameObject.DOMElement.children[0].setAttribute("src", `src/${gameObject.image}DownLeft${textureFrame}.png`);
        }
    }
}


//let block1 = new GameObject(200, 900, 200, 200, "block", "green", "solid");
//let block2 = new GameObject(300, 1000, 200, 200, "block", "green", "solid");

//for (let i = 100; i < 1000; i += 10) {
//    new GameObject(i, i + 900, 200, 200, "block", "green", "solid");
//}
//console.log(solidBlocks);

function removeGameObject(gameObject, isSolid) {
    gameObjects.splice(gameObjects.findIndex(b => b.DOMElement == gameObject), 1);

    if (isSolid) {
        solidBlocks.splice(solidBlocks.findIndex(b => b.DOMElement == gameObject), 1);
    }

    gameObject.remove();
}

//controller(keys);



