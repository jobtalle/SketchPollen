const Slot = function(x, y, xOffset, yOffset) {
    let poll = null;

    this.getX = () => x + xOffset;
    this.getY = () => y + yOffset;

    this.add = p => {
        poll = p;
    };

    this.hasPoll = () => {
        return poll !== null;
    };

    this.update = (newX, newY) => {
        x = newX;
        y = newY;

        if (poll)
            poll.setPosition(x + xOffset, y + yOffset);
    };

    this.draw = context => {
        if (poll)
            poll.draw(context);
    };
};

const Pollinator = function(x, y) {
    const noisex = cubicNoiseConfig(Math.random());
    const noisey = cubicNoiseConfig(Math.random());
    const wings = new Wings();
    const eye = new Eye();
    const armLength = 70;
    const handSpacing = 25;
    const handLeft = new Hand(x - handSpacing, y, armLength, 1);
    const handRight = new Hand(x + handSpacing, y, armLength, -1);
    const slots = [];
    let lifetime = 0;
    let target = null;
    let updateTimer = 0;
    let vx = 0;
    let vy = 0;
    let leave = false;

    const makeSlots = () => {
        const slotCount = 8;
        const radius = 20;

        for (let i = 0; i < slotCount; ++i) {
            const angle = Math.PI + (i / (slotCount - 1)) * Math.PI;
            slots.push(new Slot(
                x,
                y,
                Math.cos(angle) * radius,
                -Math.sin(angle) * radius + Hand.DOWN_OFFSET));
        }

        for (let i = 0; i < 4; ++i)
            handLeft.addSlot(slots[i]);

        for (let i = 4; i < 8; ++i)
            handRight.addSlot(slots[i]);
    };

    const pickTarget = plants => {
        const claimed = [];
        const candidates = [];

        for (const plant of plants) for (const flower of plant.getFlowers()) {
            if (flower.isGrown() && flower.getPollCount() > 0) {
                if (!flower.isClaimed())
                    candidates.push(flower);
                else
                    claimed.push(flower);
            }
        }

        if (target) {
            target.unclaim();
            target = null;
        }

        if (candidates.length > 0)
            target = candidates[Math.floor(Math.random() * candidates.length)];
        else if (claimed.length > 0)
            target = claimed[Math.floor(Math.random() * claimed.length)];

        if (target)
            target.claim();
        else
            leave = true;
    };

    const approachTarget = (timeStep, plants) => {
        if (target.getPollCount() === 0)
            pickTarget(plants);

        if (!target)
            return;

        lifetime += timeStep;

        const xOffset = (cubicNoiseSample1(noisex, lifetime * Pollinator.NOISE_SPEED) - 0.5) * 2 * target.getRadius();
        const yOffset = (cubicNoiseSample1(noisey, lifetime * Pollinator.NOISE_SPEED) - 0.5) * 2 * target.getRadius();
        const dx = target.getX() + xOffset * Pollinator.HOVER_REGION_SCALE - x;
        const dy = target.getY() + yOffset * Pollinator.HOVER_REGION_SCALE - y - (armLength + Hand.DOWN_OFFSET) * 0.5;

        if (dx > 0)
            vx += Pollinator.ACCELERATION_X * timeStep;
        else
            vx -= Pollinator.ACCELERATION_X * timeStep;

        if (dy < 0)
            vy -= Pollinator.ACCELERATION_Y * timeStep;
    };

    this.update = (timeStep, plants) => {
        if (target)
            approachTarget(timeStep, plants);

        vy = Math.min(vy + Pollinator.GRAVITY * timeStep, Pollinator.VELOCITY_Y_MAX);

        if (vx > Pollinator.VELOCITY_X_MAX)
            vx = Pollinator.VELOCITY_X_MAX;
        else if (vx < -Pollinator.VELOCITY_X_MAX)
            vx = -Pollinator.VELOCITY_X_MAX;

        x += vx * timeStep;
        y += vy * timeStep;

        vx -= vx * Pollinator.DAMPING * timeStep;
        vy -= vy * Pollinator.DAMPING * timeStep;

        let pollCount = 0;

        for (const slot of slots) {
            slot.update(x, y);

            if (slot.hasPoll())
                ++pollCount;
        }

        if (!leave && pollCount === slots.length) {
            if (target)
                target.unclaim();

            target = null;
            leave = true;
        }

        handLeft.update(timeStep, x - handSpacing, y, target);
        handRight.update(timeStep, x + handSpacing, y, target);

        if (leave) {
            vy -= Pollinator.ACCELERATION_Y * timeStep;

            if (y < -Pollinator.DESPAWN_CLEARING)
                return true;
        }
        else if ((updateTimer -= timeStep) < 0) {
            pickTarget(plants);

            updateTimer = Pollinator.UPDATE_TIME_MIN + (Pollinator.UPDATE_TIME_MAX - Pollinator.UPDATE_TIME_MIN) * Math.random();
        }

        return false;
    };

    this.draw = context => {
        wings.draw(context, x, y, vx);

        for (const slot of slots)
            slot.draw(context);

        context.fillStyle = "#ffbb00aa";
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(x - handSpacing, y);
        context.lineTo(x, y - 4);
        context.lineTo(x + handSpacing, y);
        context.arc(x, y + Hand.DOWN_OFFSET, handSpacing - Pollinator.BELLY_INSET, 0, Math.PI);
        context.closePath();
        context.fill();
        context.stroke();

        handLeft.draw(context);
        handRight.draw(context);

        eye.draw(context, x - 8, y + Hand.DOWN_OFFSET, lifetime);
        eye.draw(context, x + 8, y + Hand.DOWN_OFFSET, lifetime);
    };

    makeSlots();
};

Pollinator.UPDATE_TIME_MIN = 10;
Pollinator.UPDATE_TIME_MAX = 18;
Pollinator.ACCELERATION_X = 280;
Pollinator.ACCELERATION_Y = 700;
Pollinator.VELOCITY_Y_MAX = 500;
Pollinator.VELOCITY_X_MAX = 160;
Pollinator.GRAVITY = 120;
Pollinator.DAMPING = 0.5;
Pollinator.DESPAWN_CLEARING = 200;
Pollinator.NOISE_SPEED = 0.4;
Pollinator.HOVER_REGION_SCALE = 2;
Pollinator.BELLY_INSET = 6;