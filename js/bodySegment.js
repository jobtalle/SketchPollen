const BodySegment = function(x, y, radius, color, distance, child) {
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
    };

    this.draw = context => {
        if (child)
            child.draw(context);

        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    };
};

BodySegment.DAMPING = 0.75;