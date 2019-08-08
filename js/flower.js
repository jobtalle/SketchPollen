const Flower = function(model, x, y) {
    const pollen = [];

    this.setPosition = (newX, newY) => {
        x = newX;
        y = newY;
    };

    this.draw = context => {
        context.fillStyle = "white";
        context.strokeStyle = "black";
        context.beginPath();
        context.arc(x, y, 32, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    };
};