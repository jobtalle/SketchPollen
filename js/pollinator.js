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

        for (const plant of plants) for (const flower of plant.getFlowers()) {
            if (flower.isGrown() && flower.getPollCount() > Pollinator.TARGET_POLL_COUNT_MIN) {
                target = flower;

                break;
            }
        }
    };

    const approachTarget = timeStep => {
        const dx = target.getX() - x;
        const dy = target.getY() - y;

        if (dx > 0)
            vx += Pollinator.ACCELERATION * timeStep;
        else
            vx -= Pollinator.ACCELERATION * timeStep;

        if (dy > 0)
            vy += Pollinator.ACCELERATION * timeStep;
        else
            vy -= Pollinator.ACCELERATION * timeStep;
    };

    this.update = (timeStep, plants) => {
        vy += Pollinator.GRAVITY * timeStep;
        x += vx * timeStep;
        y += vy * timeStep;

        if ((updateTimer -= timeStep) < 0) {
            pickTarget(plants);

            updateTimer = Pollinator.UPDATE_TIME_MIN + (Pollinator.UPDATE_TIME_MAX - Pollinator.UPDATE_TIME_MIN) * Math.random();
        }

        if (target)
            approachTarget(timeStep);
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
Pollinator.ACCELERATION = 32;
Pollinator.GRAVITY = 4;
Pollinator.COUNTER_GRAVITY = 6;