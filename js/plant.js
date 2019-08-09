const Plant = function(model, x, floor, ceiling) {
    const growthSpeed = Plant.GROWTH_SPEED_MIN + (Plant.GROWTH_SPEED_MAX - Plant.GROWTH_SPEED_MIN) * Math.random();
    const stalk = new Stalk(model, 0, 0, 0, 1, true);
    const phytomers = [new Phytomer(model, stalk, floor - ceiling, null)];
    const flowers = [];
    const fallSign = Math.random() < 0.5 ? -1 : 1;
    let lifetime = 0;
    let dying = false;
    let angle = Math.PI * 1.5;
    let fallSpeed = 0;

    this.getFlowers = () => flowers;

    this.draw = context => {
        context.save();
        context.translate(x, floor);
        context.rotate(angle);

        context.fillStyle = "#95c4a2";
        context.strokeStyle = "black";

        stalk.draw(context);

        context.restore();
    };

    this.update = timeStep => {
        lifetime += timeStep;

        if (dying) {
            if (Math.sin(angle += fallSign * fallSpeed * timeStep) > Plant.DELETE_THRESHOLD)
                return true;

            fallSpeed *= Plant.FALL_MULTIPLIER;
        }
        else {
            stalk.update(timeStep, lifetime);

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
Plant.FALL_MULTIPLIER = 1.01;
Plant.DELETE_THRESHOLD = 0.8;