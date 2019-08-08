const Poll = function() {
    let x = 0;
    let y = 0;

    this.draw = context => {
        context.fillStyle = "white";
        context.strokeStyle = "black";
        context.beginPath();
        context.arc(x, y, Poll.RADIUS, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    };
};

Poll.RADIUS = 12;