export default (keys, pointerBlock) => {
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    function keyDownHandler(event) {
        let key = event.key.toLowerCase();
        //console.log(key);
        if (key == "w" || key == "в") {
            keys.upPressed = true;
        } else if (key == "s" || key == "с") {
            keys.downPressed = true;
        } else if (key == "a" || key == "а") {
            keys.leftPressed = true;
        } else if (key == "d" || key == "д") {
            keys.rightPressed = true;
        }

        let labelElement = document.getElementById("mode-label");
        let pointer = document.getElementById("pointer");

        if (key == "b") {
            labelElement.textContent = "Build mode (blocks)";

            keys.shootingMode = false;
            keys.placeBots = false;
            keys.breakMode = false;

            if (keys.buildMode == true) {
                labelElement.textContent = "Break mode";
                keys.breakMode = true;
            }

            if (pointer)
                pointer.remove();

            keys.buildMode = !keys.buildMode;
        }

        if (key == "v") {
            if (pointer) {
                pointer.remove();
            }

            keys.buildMode = false;
            keys.shootingMode = true;
            keys.breakMode = false;
            labelElement.textContent = "Shooting mode";
        } else if (key == "c") {
            if (pointer) {
                pointer.remove();
            }

            keys.buildMode = true;
            keys.placeBots = true;
            keys.shootingMode = false;
            keys.breakMode = false;

            labelElement.textContent = "Build mode (bots)";
        }
    }

    function keyUpHandler(event) {
        let key = event.key.toLowerCase();
        //console.log(key);
        if (key == "w" || key == "в") {
            keys.upPressed = false;
        } else if (key == "s" || key == "с") {
            keys.downPressed = false;
        } else if (key == "a" || key == "а") {
            keys.leftPressed = false;
        } else if (key == "d" || key == "д") {
            keys.rightPressed = false;
        }
    }


}