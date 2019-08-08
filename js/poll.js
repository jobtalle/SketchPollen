const Poll = function() {
    let lifetime = 0;
    let radius = 0;
    let x = 0;
    let y = 0;

    this.setPosition = (newX, newY) => {
        x = newX;
        y = newY;
    };

    this.grow = time => {
        lifetime += time;

        radius = Math.min(1, lifetime / Poll.GROW_TIME) * Poll.RADIUS;
    };

    this.isGrown = () => radius === Poll.RADIUS;

    this.draw = context => {
        context.fillStyle = "white";
        context.strokeStyle = "black";
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    };
};

Poll.RADIUS = 5;
Poll.GROW_TIME = 8;