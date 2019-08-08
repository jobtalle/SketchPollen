const Plant = function(model, x, floor, ceiling) {
    const growthSpeed = Plant.GROWTH_SPEED_MIN + (Plant.GROWTH_SPEED_MAX - Plant.GROWTH_SPEED_MIN) * Math.random();
    const stalks = [new Stalk(model, 0, 0)];
    const phytomers = [new Phytomer(model, stalks[0], floor - ceiling, null)];
    let lifetime = 0;

    this.draw = context => {
        context.save();
        context.translate(x, floor);
        context.rotate(Math.PI * 1.5);

        context.fillStyle = "#65bf71";
        context.strokeStyle = "black";

        for (const stalk of stalks)
            stalk.draw(context, lifetime);

        context.restore();
    };

    this.update = timeStep => {
        lifetime += timeStep;

        for (let i = phytomers.length; i-- > 0;)
            if (phytomers[i].update(timeStep, growthSpeed, phytomers))
                phytomers.splice(i, 1);

        return false;
    };
};

Plant.GROWTH_SPEED_MIN = 16;
Plant.GROWTH_SPEED_MAX = 32;