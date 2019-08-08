const Plant = function(model, x, floor, ceiling) {
    const growthSpeed = Plant.GROWTH_SPEED_MIN + (Plant.GROWTH_SPEED_MAX - Plant.GROWTH_SPEED_MIN) * Math.random();
    const stalk = new Stalk(model, 0, 0, 0, 1, true);
    const phytomers = [new Phytomer(model, stalk, floor - ceiling, null)];
    const flowers = [];
    let lifetime = 0;

    this.getFlowers = () => flowers;

    this.draw = context => {
        context.save();
        context.translate(x, floor);
        context.rotate(Math.PI * 1.5);

        context.fillStyle = "#95c4a2";
        context.strokeStyle = "black";

        stalk.draw(context);

        context.restore();
    };

    this.update = timeStep => {
        lifetime += timeStep;

        stalk.update(timeStep, lifetime);

        for (let i = phytomers.length; i-- > 0;)
            if (phytomers[i].update(timeStep, growthSpeed, phytomers, flowers))
                phytomers.splice(i, 1);

        return false;
    };
};

Plant.GROWTH_SPEED_MIN = 16;
Plant.GROWTH_SPEED_MAX = 32;