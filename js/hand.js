const Hand = function(x, y, length) {
    let handX = x;
    let handY = y;

    this.move = (newX, newY) => {
        x = newX;
        y = newY;

        const dx = x - handX;
        const dy = y - handY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > length) {
            handX += (dx / dist) * (dist - length);
            handY += (dy / dist) * (dist - length);
        }
    };

    this.draw = context => {
        context.fillStyle = "black";
        context.fillStyle = "white";

        context.beginPath();
        context.arc(handX, handY, 3, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(handX, handY);
        context.stroke();
    };
};