const Poll = function() {
    const targetRadius = Poll.RADIUS_MIN + (Poll.RADIUS_MAX - Poll.RADIUS_MIN) * Math.random();
    let lifetime = 0;
    let radius = 0;
    let x = 0;
    let y = 0;
    let grabbed = false;

    this.getX = () => x;
    this.getY = () => y;
    this.isGrabbed = () => grabbed;

    this.grab = () => {
        grabbed = true;
    };

    this.setPosition = (newX, newY) => {
        x = newX;
        y = newY;
    };

    this.grow = time => {
        lifetime += time;

        radius = Math.min(1, lifetime / Poll.GROW_TIME) * targetRadius;
    };

    this.isGrown = () => radius === targetRadius;

    this.draw = context => {
        context.fillStyle = "white";
        context.strokeStyle = "black";
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    };
};

Poll.RADIUS_MIN = 4;
Poll.RADIUS_MAX = 6;
Poll.GROW_TIME = 8;