const BodySegment = function(x, y, radius, color, distance, child) {
    const handLeft = color === Pollinator.BODY_COLOR_B ? new Hand(
        x - radius,
        y,
        radius * BodySegment.LEG_LENGTH_FACTOR,
        1,
        color) : null;
    const handRight = color === Pollinator.BODY_COLOR_B ? new Hand(
        x + radius,
        y,
        radius * BodySegment.LEG_LENGTH_FACTOR,
        -1,
        color) : null;
    let xp = x;
    let yp = y;

    this.getX = () => x;
    this.getY = () => y;
    this.getRadius = () => radius;

    this.update = (timeStep, newX, newY) => {
        x += (newX - xp) * BodySegment.DAMPING;
        y += (newY - yp) * BodySegment.DAMPING;
        xp = newX;
        yp = newY;

        const dx = newX - x;
        const dy = newY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > distance) {
            x += (dx / dist) * (dist - distance);
            y += (dy / dist) * (dist - distance);
        }

        if (child)
            child.update(timeStep, x, y);

        if (handLeft) {
            handLeft.update(timeStep, x - radius, y, null);
            handRight.update(timeStep, x + radius, y, null);
        }
    };

    this.draw = context => {
        if (child)
            child.draw(context);

        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();

        if (handLeft) {
            handLeft.draw(context);
            handRight.draw(context);
        }
    };
};

BodySegment.DAMPING = 0.75;
BodySegment.LEG_LENGTH_FACTOR = 1.3;