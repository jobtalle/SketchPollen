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
        context.strokeStyle = "blue";
        context.beginPath();
        context.arc(x + xOffset, y + yOffset, 3, 0, Math.PI * 2);
        context.stroke();

        if (poll)
            poll.draw(context);
    };
};

const Pollinator = function(x, y) {
    const noisex = cubicNoiseConfig(Math.random());
    const noisey = cubicNoiseConfig(Math.random());
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
        if (target)
            if (target.getPollCount() > 0)
                return;

        const candidates = [];

        for (const plant of plants) for (const flower of plant.getFlowers())
            if (flower.isGrown() && !flower.isClaimed() && flower.getPollCount() > 0)
                candidates.push(flower);

        if (candidates.length > 0) {
            if (target)
                target.unclaim();
            target = candidates[Math.floor(Math.random() * candidates.length)];
            target.claim();
        }
    };

    const approachTarget = timeStep => {
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
            approachTarget(timeStep);

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
        handLeft.draw(context);
        handRight.draw(context);

        for (const slot of slots)
            slot.draw(context);
    };

    makeSlots();
};

Pollinator.UPDATE_TIME_MIN = 3;
Pollinator.UPDATE_TIME_MAX = 10;
Pollinator.ACCELERATION_X = 280;
Pollinator.ACCELERATION_Y = 700;
Pollinator.VELOCITY_Y_MAX = 500;
Pollinator.VELOCITY_X_MAX = 300;
Pollinator.GRAVITY = 120;
Pollinator.DAMPING = 0.5;
Pollinator.DESPAWN_CLEARING = 200;
Pollinator.NOISE_SPEED = 0.2;
Pollinator.HOVER_REGION_SCALE = 2;