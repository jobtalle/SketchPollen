const Hand = function(x, y, length, sign) {
    let handX = x;
    let handY = y;
    let poll = null;

    this.update = (timeStep, newX, newY, flower) => {
        x = newX;
        y = newY;

        const dx = x - handX;
        const dy = y - handY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > length) {
            handX += (dx / dist) * (dist - length);
            handY += (dy / dist) * (dist - length);
        }

        if (poll) {
            if (poll.getY() < y + Hand.DOWN_OFFSET)
                poll = null;

            if (poll) {
                const pdx = poll.getX() - x;
                const pdy = poll.getY() - y;
                const pollDist = Math.sqrt(pdx * pdx + pdy * pdy);

                if (pollDist > length)
                    poll = null;
                else {

                }
            }
        }
        else {
            if (flower !== null)
                poll = flower.findPoll(x, y, length, y + Hand.DOWN_OFFSET);

            handY += Hand.DOWN_SPEED * timeStep;
        }

        if (handY < y + Hand.DOWN_OFFSET)
            handY = y + Hand.DOWN_OFFSET;
    };

    this.draw = context => {
        const dx = handX - x;
        const dy = handY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const elbowAngle = Math.acos(dist / length) * sign;
        const handDirection = Math.atan2(dy, dx);
        const elbowX = x + Math.cos(handDirection + elbowAngle) * length * 0.5;
        const elbowY = y + Math.sin(handDirection + elbowAngle) * length * 0.5;

        context.strokeStyle = "black";
        context.fillStyle = "white";

        context.beginPath();
        context.arc(handX, handY, 3, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(elbowX, elbowY);
        context.lineTo(handX, handY);
        context.stroke();

        if (poll) {
            context.strokeStyle = "red";
            context.beginPath();
            context.moveTo(handX, handY);
            context.lineTo(poll.getX(), poll.getY());
            context.stroke();
        }
    };
};

Hand.DOWN_SPEED = 50;
Hand.DOWN_OFFSET = 16;