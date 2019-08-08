const Hand = function(x, y, length, sign) {
    const slots = [];
    let handX = x;
    let handY = y;
    let poll = null;
    let pollFlower = null;
    let grabbed = null;
    let slot = null;
    let restoring = false;

    const grab = flower => {
        flower.grabPoll(poll);

        grabbed = poll;
        poll = null;

        const slotIndex = Math.floor(Math.random() * slots.length);

        slot = slots[slotIndex];
        slots.splice(slotIndex, 1);
    };

    const reach = (timeStep, flower) => {
        const dx = poll.getX() - handX;
        const dy = poll.getY() - handY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < Hand.GRAB_THRESHOLD)
            grab(flower);
        else {
            handX += (dx / dist) * Hand.REACH_SPEED * timeStep;
            handY += (dy / dist) * Hand.REACH_SPEED * timeStep;
        }
    };

    const stash = () => {
        slot.add(grabbed);

        grabbed = null;
        slot = null;
        restoring = true;
    };

    const store = timeStep => {
        const dx = slot.getX() - handX;
        const dy = slot.getY() - handY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < Hand.GRAB_THRESHOLD)
            stash();
        else {
            handX += (dx / dist) * Hand.STORE_SPEED * timeStep;
            handY += (dy / dist) * Hand.STORE_SPEED * timeStep;
        }
    };

    const limitY = () => {
        if (handY < y + Hand.DOWN_OFFSET)
            handY = y + Hand.DOWN_OFFSET;
    };

    this.addSlot = s => {
        slots.push(s);
    };

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

        if (restoring) {
            if ((handY += Hand.DOWN_SPEED * timeStep) > y + Hand.DOWN_OFFSET)
                restoring = false;
        }
        else if (grabbed) {
            store(timeStep);

            if (grabbed)
                grabbed.setPosition(handX, handY);
        }
        else if (poll) {
            if (poll.getY() < y + Hand.DOWN_OFFSET)
                poll = null;

            if (poll) {
                const pdx = poll.getX() - x;
                const pdy = poll.getY() - y;
                const pollDist = Math.sqrt(pdx * pdx + pdy * pdy);

                if (pollDist > length)
                    poll = null;
                else
                    reach(timeStep, pollFlower);
            }

            limitY();
        }
        else {
            if (slots.length > 0 && flower !== null) {
                poll = flower.findPoll(x, y, length, y + Hand.DOWN_OFFSET);
                pollFlower = flower;
            }

            handY += Hand.DOWN_SPEED * timeStep;

            limitY();
        }
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

        if (grabbed)
            grabbed.draw(context);

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
Hand.REACH_SPEED = 60;
Hand.STORE_SPEED = 50;
Hand.GRAB_THRESHOLD = 3;