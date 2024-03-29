const Hand = function(x, y, length, sign, color) {
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
        poll.grab();

        grabbed = poll;
        poll = null;

        const slotIndex = Math.floor(Math.random() * slots.length);

        slot = slots[slotIndex];
        slots.splice(slotIndex, 1);
    };

    const reach = (timeStep, flower) => {
        const speed = Hand.REACH_SPEED * timeStep;
        const dx = poll.getX() - handX;
        const dy = poll.getY() - handY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < speed || dist < Hand.GRAB_THRESHOLD)
            grab(flower);
        else {
            handX += (dx / dist) * speed;
            handY += (dy / dist) * speed;
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

    this.getX = () => x;

    this.addSlot = s => {
        slots.push(s);
    };

    this.update = (timeStep, newX, newY, flower) => {
        const mx = newX - x;
        const my = newY - y;

        x = newX;
        y = newY;
        handX += mx * Hand.DAMPING;
        handY += my * Hand.DAMPING;

        const dx = x - handX;
        const dy = y - handY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxLength = length * Hand.MAX_EXTENSION;

        if (dist > maxLength) {
            handX += (dx / dist) * (dist - maxLength);
            handY += (dy / dist) * (dist - maxLength);
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
            if (poll.getY() < y + Hand.DOWN_OFFSET || poll.isGrabbed())
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
        }
        else {
            if (slots.length > 0 && flower !== null) {
                poll = flower.findPoll(x, y, length * Hand.MAX_EXTENSION, y + Hand.DOWN_OFFSET);
                pollFlower = flower;
            }

            handY += Hand.DOWN_SPEED * timeStep;
        }

        limitY();
    };

    this.draw = context => {
        const dx = handX - x;
        const dy = handY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const elbowAngle = Math.acos(dist / length) * sign;
        const handDirection = Math.atan2(dy, dx);
        const elbowX = x + Math.cos(handDirection + elbowAngle) * length * 0.5;
        const elbowY = y + Math.sin(handDirection + elbowAngle) * length * 0.5;

        context.strokeStyle = color;
        context.lineWidth = Hand.ARM_THICKNESS;

        context.beginPath();
        context.moveTo(x + sign * Hand.ARM_THICKNESS * 0.5, y);
        context.lineTo(elbowX, elbowY);
        context.lineTo(handX, handY);
        context.stroke();

        if (grabbed)
            grabbed.draw(context);

        context.fillStyle = color;
        context.beginPath();
        context.arc(handX, handY, Hand.RADIUS, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    };
};

Hand.ARM_THICKNESS = 3;
Hand.RADIUS = 2;
Hand.DOWN_SPEED = 60;
Hand.DOWN_OFFSET = 8;
Hand.REACH_SPEED = 110;
Hand.STORE_SPEED = 70;
Hand.GRAB_THRESHOLD = 1;
Hand.DAMPING = 0.75;
Hand.MAX_EXTENSION = 0.95;