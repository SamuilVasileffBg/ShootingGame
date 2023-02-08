export default (firstObj, solidBlocks) => {
    let _return = false;

    solidBlocks.forEach(secondObj => {
        let topTouches = firstObj.top + firstObj.height >= secondObj.top
            && firstObj.top <= secondObj.top + secondObj.height;

        let leftTouches = firstObj.left + firstObj.width >= secondObj.left
            && firstObj.left <= secondObj.left + secondObj.width;

        if (firstObj.left + firstObj.width == secondObj.left
            && topTouches) {
            _return = true;
        } else if (firstObj.left == secondObj.left + secondObj.width
            && topTouches) {
            _return = true;
        } else if (firstObj.top + firstObj.height == secondObj.top
            && leftTouches) {
            _return = true;
        } else if (firstObj.top == secondObj.top + secondObj.height
            && leftTouches) {
            _return = true;
        }
    });

    return _return;
}