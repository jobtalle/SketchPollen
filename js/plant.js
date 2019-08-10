const Plant = function(model, x, floor, ceiling) {
    const growthSpeed = Plant.GROWTH_SPEED_MIN + (Plant.GROWTH_SPEED_MAX - Plant.GROWTH_SPEED_MIN) * Math.random();
    const stalk = new Stalk(model, 0, 0, 0, 1, true);
    const phytomers = [new Phytomer(model, stalk, floor - ceiling, 0, null)];
    const flowers = [];
    const transform = new Transform();
    let originalFloor = floor;
    let lifetime = 0;
    let dying = false;
    let fallSpeed = 0;

    this.rebase = base => {
        floor = originalFloor = base;
    };

    this.getFlowers = () => flowers;

    this.draw = context => {
        transform.identity();

        context.save();
        context.translate(x, floor);
        context.rotate(Math.PI * 1.5);

        transform.translate(x, floor);
        transform.rotate(Math.PI * -1.5);

        context.fillStyle = model.getLeafModel().getStalkColor();

        stalk.draw(context, transform);

        context.restore();
    };

    this.update = timeStep => {
        lifetime += timeStep;

        stalk.update(timeStep, lifetime);

        if (dying) {
            floor += fallSpeed;
            fallSpeed *= Plant.FALL_MULTIPLIER;

            if (floor > originalFloor * 2)
                return true;
        }
        else {
            for (let i = phytomers.length; i-- > 0;)
                if (phytomers[i].update(timeStep, growthSpeed, phytomers, flowers))
                    phytomers.splice(i, 1);

            if (flowers.length > 0) {
                dying = true;

                for (const flower of flowers) if (flower.getPollCount() > 0)
                    dying = false;

                if (dying)
                    fallSpeed = Plant.FALL_SPEED;
            }
        }

        return false;
    };
};

Plant.GROWTH_SPEED_MIN = 8;
Plant.GROWTH_SPEED_MAX = 24;
Plant.FALL_SPEED = 0.05;
Plant.FALL_MULTIPLIER = 1.002;
Plant.DELETE_THRESHOLD = 0.8;
