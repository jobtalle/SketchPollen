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
    const handLeft = new Hand(x - Pollinator.RADII[0], y, Pollinator.ARM_LENGTH, 1, Pollinator.BODY_COLOR_B);
    const handRight = new Hand(x + Pollinator.RADII[0], y, Pollinator.ARM_LENGTH, -1, Pollinator.BODY_COLOR_B);
    const slots = [];
    let body = null;
    let lifetime = 0;
    let target = null;
    let updateTimer = 0;
    let vx = 0;
    let vy = 0;
    let leave = false;

    const makeBody = () => {
        let lastSegment = null;

        for (let i = Pollinator.RADII.length; i-- > 1;)
            lastSegment = new BodySegment(
                x,
                y,
                Pollinator.RADII[i],
                (i & 1) === 1 ? Pollinator.BODY_COLOR_B : Pollinator.BODY_COLOR_A,
                Pollinator.RADII[i - 1] * Pollinator.BODY_FOLLOW_DIST,
                lastSegment);

        body = lastSegment;
    };

    const makeSlots = () => {
        const angleOffset = Math.atan(Hand.DOWN_OFFSET / Pollinator.RADII[0]);

        for (let i = 0; i < Pollinator.CARRY_CAPACITY; ++i) {
            const angle = Math.PI + (i / (Pollinator.CARRY_CAPACITY - 1)) * (Math.PI - 2 * angleOffset) + angleOffset;
            const newSlot = new Slot(
                x,
                y,
                Math.cos(angle) * Pollinator.RADII[0],
                -Math.sin(angle) * Pollinator.RADII[0]);

            slots.push(newSlot);

            const toLeft = Math.abs(newSlot.getX() - handLeft.getX());
            const toRight = Math.abs(newSlot.getX() - handRight.getX());

            if (toLeft < toRight)
                handLeft.addSlot(newSlot);
            else
                handRight.addSlot(newSlot);
        }
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
        const dy = target.getY() + yOffset * Pollinator.HOVER_REGION_SCALE - y - (Pollinator.ARM_LENGTH * Hand.MAX_EXTENSION - Hand.DOWN_OFFSET) * 0.5;

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

        body.update(timeStep, x, y);

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

        handLeft.update(timeStep, x - Pollinator.RADII[0], y, target);
        handRight.update(timeStep, x + Pollinator.RADII[0], y, target);

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
        body.draw(context);

        wings.draw(context, body.getX(), body.getY() - body.getRadius() * Pollinator.WINGS_INSET, vx);

        for (const slot of slots)
            slot.draw(context);

        handLeft.draw(context);
        handRight.draw(context);

        context.fillStyle = Pollinator.BODY_COLOR_A;
        context.beginPath();
        context.arc(x, y, Pollinator.RADII[0], 0, Math.PI * 2);
        context.fill();

        eye.draw(context, x - Pollinator.EYE_SPACING, y, lifetime);
        eye.draw(context, x + Pollinator.EYE_SPACING, y, lifetime);
    };

    makeBody();
    makeSlots();
};

Pollinator.CARRY_CAPACITY = 8;
Pollinator.ARM_LENGTH = 55;
Pollinator.RADII = [22, 22, 18, 12];
Pollinator.BODY_FOLLOW_DIST = 0.5;
Pollinator.EYE_SPACING = 8;
Pollinator.WINGS_INSET = 0.7;
Pollinator.UPDATE_TIME_MIN = 10;
Pollinator.UPDATE_TIME_MAX = 18;
Pollinator.ACCELERATION_X = 280;
Pollinator.ACCELERATION_Y = 800;
Pollinator.VELOCITY_Y_MAX = 500;
Pollinator.VELOCITY_X_MAX = 160;
Pollinator.GRAVITY = 180;
Pollinator.DAMPING = 0.5;
Pollinator.DESPAWN_CLEARING = 200;
Pollinator.NOISE_SPEED = 0.4;
Pollinator.HOVER_REGION_SCALE = 2;
Pollinator.BODY_COLOR_A = "rgb(228,196,25)";
Pollinator.BODY_COLOR_B = "rgb(97,81,28)";