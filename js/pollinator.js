const Pollinator = function(x, y) {
    const armLength = Pollinator.ARM_LENGTH_MIN + (Pollinator.ARM_LENGTH_MAX - Pollinator.ARM_LENGTH_MIN) * Math.random();
    const handLeft = new Hand(x, y, armLength);
    const handRight = new Hand(x, y, armLength);
    let target = null;
    let updateTimer = 0;
    let vx = 0;
    let vy = 0;

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
        const dy = target.getY() - y;

        if (dx > 0)
            vx += Pollinator.ACCELERATION_X * timeStep;
        else
            vx -= Pollinator.ACCELERATION_X * timeStep;

        if (dy > 0)
            vy += Pollinator.ACCELERATION_Y * timeStep;
        else
            vy -= Pollinator.ACCELERATION_Y * timeStep;
    };

    this.update = (timeStep, plants) => {
        if (target)
            approachTarget(timeStep);

        vy = Math.min(vy + Pollinator.GRAVITY * timeStep, Pollinator.ACCELERATION_Y_MAX);
        x += vx * timeStep;
        y += vy * timeStep;

        vx -= vx * Pollinator.DAMPING * timeStep;
        vy -= vy * Pollinator.DAMPING * timeStep;

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

        context.strokeStyle = "blue";
        context.beginPath();
        context.arc(0, 0, 32, 0, Math.PI * 2);
        context.stroke();

        context.restore();
    };
};

Pollinator.ARM_LENGTH_MIN = 16;
Pollinator.ARM_LENGTH_MAX = 32;
Pollinator.TARGET_POLL_COUNT_MIN = 3;
Pollinator.UPDATE_TIME_MIN = 3;
Pollinator.UPDATE_TIME_MAX = 10;
Pollinator.ACCELERATION_X = 32;
Pollinator.ACCELERATION_Y = 80;
Pollinator.ACCELERATION_Y_MAX = 100;
Pollinator.GRAVITY = 4;
Pollinator.DAMPING = 0.3;