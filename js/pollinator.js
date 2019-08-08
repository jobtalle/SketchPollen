const Slot = function(xOffset, yOffset) {
    let poll = null;

    this.add = p => {
        poll = p;
    };

    this.draw = context => {
        context.strokeStyle = "blue";
        context.beginPath();
        context.arc(xOffset, yOffset, 3, 0, Math.PI * 2);
        context.stroke();
    };
};

const Pollinator = function(x, y) {
    const armLength = 48;
    const handSpacing = 12;
    const handLeft = new Hand(x - handSpacing, y, armLength, 1);
    const handRight = new Hand(x + handSpacing, y, armLength, -1);
    const slots = [];
    let pollen = 0;
    let target = null;
    let updateTimer = 0;
    let vx = 0;
    let vy = 0;

    const makeSlots = () => {
        const slotCount = 8;
        const radius = 28;

        for (let i = 0; i < slotCount; ++i) {
            const angle = Math.PI + (i / (slotCount - 1)) * Math.PI;
            slots.push(new Slot(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius));
        }
    };

    const pickTarget = plants => {
        if (target) {
            if (target.getPollCount() >= Pollinator.TARGET_POLL_COUNT_MIN)
                return;
        }

        const candidates = [];

        for (const plant of plants) for (const flower of plant.getFlowers())
            if (flower.isGrown() && !flower.isClaimed() && flower.getPollCount() > Pollinator.TARGET_POLL_COUNT_MIN)
                candidates.push(flower);

        if (candidates.length > 0) {
            target = candidates[Math.floor(Math.random() * candidates.length)];
            target.claim();
        }
    };

    const approachTarget = timeStep => {
        const dx = target.getX() - x;
        const dy = target.getY() - y - Hand.DOWN_OFFSET;

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

        handLeft.update(timeStep, x - handSpacing, y, target);
        handRight.update(timeStep, x + handSpacing, y, target);

        if ((updateTimer -= timeStep) < 0) {
            pickTarget(plants);

            updateTimer = Pollinator.UPDATE_TIME_MIN + (Pollinator.UPDATE_TIME_MAX - Pollinator.UPDATE_TIME_MIN) * Math.random();
        }
    };

    this.draw = context => {
        handLeft.draw(context);
        handRight.draw(context);

        context.save();
        context.translate(x, y);

        for (const slot of slots)
            slot.draw(context);

        context.restore();
    };

    makeSlots();
};

Pollinator.TARGET_POLL_COUNT_MIN = 3;
Pollinator.UPDATE_TIME_MIN = 3;
Pollinator.UPDATE_TIME_MAX = 10;
Pollinator.ACCELERATION_X = 280;
Pollinator.ACCELERATION_Y = 700;
Pollinator.VELOCITY_Y_MAX = 500;
Pollinator.VELOCITY_X_MAX = 300;
Pollinator.GRAVITY = 120;
Pollinator.DAMPING = 0.5;