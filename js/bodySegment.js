const BodySegment = function(x, y, radius, color, distance, child) {
    this.move = (newX, newY) => {
        const dx = newX - x;
        const dy = newY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > distance) {
            x += (dx / dist) * (dist - distance);
            y += (dy / dist) * (dist - distance);

            if (child)
                child.move(x, y);
        }
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